// ---------------------------------------------------------------------------
// Imports the OMMEB Guerrero exams (server/src/data/ommebGuerrero) into a
// database that already has content. Additive and idempotent:
//
//   - Exam folders Exámenes › OMMEB › Guerrero › <year> › <Estatal|Selectivo> ›
//     Nivel <n> are found by name (ignoring case and accents) or created.
//   - Each problem is found by its code (OMMEB-GRO-2025-EST-N1-01). A missing
//     one is created, published, with its figures as ProblemImages. One that
//     exists is never changed: it is reported as «already there» when it holds
//     the transcription, or as «different» when it was edited on the site.
//   - Then every touched folder gets its Exam on the Exámenes page
//     (syncFolderExams), and an Exam without duration or instructions gets
//     the ones from the transcription.
//
// With apply=false nothing is written and the plan is returned. With
// apply=true the folders, images and problems are written in one transaction
// (a replica set is required, as for the other importers); the Exam sync runs
// after it and is itself idempotent.
// ---------------------------------------------------------------------------

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import mongoose from 'mongoose'
import Category from '../models/Category.js'
import Exam from '../models/Exam.js'
import Problem from '../models/Problem.js'
import ProblemImage from '../models/ProblemImage.js'
import Topic from '../models/Topic.js'
import User from '../models/User.js'
import { normalizeSlug } from '../models/content.js'
import { EXAM_ROOT_NAME } from './examFolders.js'
import { syncFolderExams } from './examSync.js'
import { processImage } from './images.js'
import {
  FIGURES_DIR, OMMEB_GUERRERO_EXAMS, buildOmmebProblems, examFolderPath, examInstructions, validateOmmebGuerrero,
} from '../data/ommebGuerrero/index.js'

mongoose.set('transactionAsyncLocalStorage', true)

// The fields compared to tell «already there» from «edited on the site».
export const COMPARED_FIELDS = ['titulo', 'enunciado', 'solution', 'sourceAttribution', 'competition', 'round', 'problemNumber', 'año', 'tema', 'tipo']

export class OmmebImportError extends Error {
  constructor(message, code = 'OMMEB_IMPORT_ERROR') {
    super(message)
    this.code = code
  }
}

const key = (names) => names.join(' › ')
const sameName = (a, b) => normalizeSlug(a) === normalizeSlug(b)

// Walks the exam folder tree for every path the transcription needs.
// Returns { root, byPath: Map(pathKey → folder or null), create: [path…] }.
function resolveFolders(folders, paths) {
  const root = folders.filter((f) => !f.parent).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[0] ?? null
  const byPath = new Map()
  const create = []
  const pending = []
  for (const names of paths) {
    let parent = root
    for (let i = 0; i < names.length; i += 1) {
      const sub = names.slice(0, i + 1)
      if (byPath.has(key(sub))) { parent = byPath.get(key(sub)); continue }
      const found = parent && folders.find((f) => String(f.parent ?? '') === String(parent._id) && f.reviewStatus !== 'rejected' && sameName(f.name, names[i]))
      if (found?.reviewStatus === 'pending') pending.push(key(sub))
      byPath.set(key(sub), found ?? null)
      if (!found) create.push(sub)
      parent = found ?? null
    }
  }
  return { root, byPath, create, pending }
}

// What an import would do, without writing.
export async function planOmmebImport({ exams = OMMEB_GUERRERO_EXAMS } = {}) {
  const summary = validateOmmebGuerrero(exams)
  const problems = buildOmmebProblems(exams)
  const paths = exams.map(examFolderPath)
  // Sequential on purpose: this also runs inside the import transaction.
  const folders = await Category.find({ kind: 'exam' }).lean()
  const existing = await Problem.find({ codigo: { $in: problems.map((p) => p.fields.codigo) } }).lean()
  const { root, byPath, create, pending } = resolveFolders(folders, paths)
  const byCode = new Map(existing.map((p) => [p.codigo, p]))
  const rows = problems.map((problem) => {
    const live = byCode.get(problem.fields.codigo)
    if (!live) return { ...problem, action: 'create' }
    const differs = COMPARED_FIELDS.filter((field) => String(live[field] ?? '') !== String(problem.fields[field] ?? ''))
    return { ...problem, action: differs.length ? 'differs' : 'keep', differs, liveId: live._id }
  })
  return { summary, exams, root, byPath, foldersToCreate: [...(root ? [] : [[EXAM_ROOT_NAME]]), ...create], pending, rows }
}

// Plain-object report of a plan (for the CLI and the tests).
export function summarizeOmmebPlan(plan) {
  const codes = (action) => plan.rows.filter((row) => row.action === action).map((row) => row.fields.codigo)
  return {
    exams: plan.summary.exams,
    problems: plan.summary.problems,
    foldersToCreate: plan.foldersToCreate.map(key),
    pendingFolders: plan.pending,
    create: codes('create'),
    keep: codes('keep'),
    differs: plan.rows.filter((row) => row.action === 'differs').map((row) => ({ codigo: row.fields.codigo, fields: row.differs })),
    images: plan.rows.filter((row) => row.action === 'create').reduce((sum, row) => sum + row.figures.length, 0),
  }
}

async function imageOwner(username) {
  const query = username ? { username } : { role: 'admin' }
  const owner = await User.findOne(query).sort({ createdAt: 1 }).select('_id username role').lean()
  if (!owner) throw new OmmebImportError(username ? `No user «${username}» to own the figures.` : 'No admin account to own the figures. Pass --owner <username>.', 'OMMEB_NO_OWNER')
  return owner
}

async function topicIds() {
  const topics = await Topic.find({ parent: null }).select('name').lean()
  return (area) => topics.filter((topic) => sameName(topic.name, area)).map((topic) => topic._id)
}

// Runs the import. apply=false (default) only plans.
export async function importOmmebGuerrero({ apply = false, owner: ownerName = null, exams = OMMEB_GUERRERO_EXAMS } = {}) {
  const plan = await planOmmebImport({ exams })
  if (plan.pending.length) throw new OmmebImportError(`These folders are waiting for review; approve or rename them on /panel/revision first: ${plan.pending.join(', ')}.`, 'OMMEB_PENDING_FOLDER')
  const report = summarizeOmmebPlan(plan)
  if (!apply) return { ...report, applied: false, examChanges: [] }

  const hello = await mongoose.connection.db.admin().command({ hello: 1 })
  if (!hello.setName && hello.msg !== 'isdbgrid') throw new OmmebImportError('The import requires a replica set (MongoDB Atlas supports this). Nothing was written.', 'CONTENT_REPLICA_SET_REQUIRED')

  const toCreate = plan.rows.filter((row) => row.action === 'create')
  // Figures are re-encoded before the transaction (sharp is slow) — the same
  // processing as an upload on the site (WebP, at most 1200 px wide).
  const owner = toCreate.some((row) => row.figures.length) ? await imageOwner(ownerName) : null
  const encoded = new Map()
  for (const file of new Set(toCreate.flatMap((row) => row.figures.map((figure) => figure.file)))) {
    const original = await readFile(path.join(FIGURES_DIR, file))
    encoded.set(file, { ...(await processImage(original)), originalBytes: original.length })
  }
  const topicsFor = await topicIds()

  if (report.foldersToCreate.length || toCreate.length) {
    await mongoose.connection.transaction(async () => {
      // The plan is recomputed inside the transaction, so nothing created in
      // the meantime is duplicated.
      const fresh = await planOmmebImport({ exams })
      const folders = new Map(fresh.byPath)
      let root = fresh.root
      if (!root) root = (await new Category({ name: EXAM_ROOT_NAME, parent: null, kind: 'exam', reviewStatus: 'approved' }).save()).toObject()
      for (const names of fresh.foldersToCreate.filter((names) => !(names.length === 1 && names[0] === EXAM_ROOT_NAME && !fresh.root))) {
        const parent = names.length === 1 ? root : folders.get(key(names.slice(0, -1)))
        const folder = await new Category({ name: names.at(-1), parent: parent._id, kind: 'exam', reviewStatus: 'approved' }).save()
        folders.set(key(names), folder.toObject())
      }
      for (const row of fresh.rows.filter((r) => r.action === 'create')) {
        const folder = folders.get(key(row.folder))
        const images = []
        for (const figure of row.figures) {
          const data = encoded.get(figure.file)
          const image = await new ProblemImage({ owner: owner._id, contentType: 'image/webp', ...data }).save()
          images.push({ image: image._id, alt: figure.alt, placement: figure.placement })
        }
        await new Problem({
          ...row.fields,
          categories: [folder._id],
          topics: topicsFor(row.fields.tema),
          ...(images.length ? { images } : {}),
        }).save()
      }
    })
  }

  // One Exam per exam folder on the Exámenes page, then its duration and
  // instructions when the Exam has none yet.
  const after = await planOmmebImport({ exams })
  const examFolders = exams.map((exam) => ({ exam, folder: after.byPath.get(key(examFolderPath(exam))) }))
  const examChanges = await syncFolderExams(examFolders.map(({ folder }) => folder?._id), { apply: true })
  for (const { exam, folder } of examFolders) {
    if (!folder) continue
    const set = { durationMinutes: exam.duracionMinutos, instructions: examInstructions(exam), organization: 'OMMEB Guerrero', country: 'México' }
    for (const [field, value] of Object.entries(set)) {
      const result = await Exam.updateMany({ categories: folder._id, [field]: { $in: [null, ''] } }, { $set: { [field]: value } })
      if (result.modifiedCount) examChanges.push(`set ${field} of the exam in «${key(examFolderPath(exam))}»`)
    }
  }
  return { ...report, applied: true, examChanges }
}
