// Imports official exam problems (for example the OMM regional exams) from a
// folder of prepared JSON files, one file per exam:
//
//   MONGO_EXAM_IMPORT_URI=<uri with /teacherperi> node server/src/scripts/import-exam-problems.js <folder>            → dry run
//   ... EXAM_IMPORT_CONFIRM=teacherperi node server/src/scripts/import-exam-problems.js <folder> --apply
//   On Atlas: npm run atlas:import-exams:test (or :prod) -- <folder> [--apply]
//
// Each file is an array of problem records:
//   { codigo, titulo, enunciado, solution, sourceAttribution, año, tema, tipo,
//     problemNumber, competition, round, subtopics: [tag labels],
//     subtopicTopics: [subtopic names under the área], difficulty, dificultad,
//     publicationStatus, figure: null | { id, kind: 'svg'|'png', alt } }
// Figures are read from <folder>/figures/<id>.svg or .png and stored like any
// uploaded image (WebP, at most 1200 px wide).
//
// What it writes, all in one transaction:
//   - the exam folders Exámenes › <competition> › <round> › <año>, created
//     when missing (approved, like the seed folders);
//   - the problems, with existing tags and topics only: an unknown tag, área
//     or subtopic stops the run. It never creates a tag or a topic;
//   - the figures.
// Then it brings the Exámenes cards of those folders up to date with the
// same exam sync the site uses (server/src/lib/examSync.js).
//
// Safe to run again: a problem whose code already exists with the same
// statement is kept; one with a different statement stops the run.
// Never reads MONGO_URI and never prints the URI.

import 'dotenv/config'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import mongoose from 'mongoose'
import sharp from 'sharp'
import Problem from '../models/Problem.js'
import { connectTarget, explicitTarget, TargetError } from '../lib/scriptTarget.js'
import { EXAM_ROOT_NAME } from '../lib/examFolders.js'
import { syncFolderExams } from '../lib/examSync.js'
import { processImage } from '../lib/images.js'
import { mathFindings } from '../lib/review/checks.js'
import { normalizeSlug } from '../models/content.js'

export function examImportTarget(env = process.env, apply = false) {
  return explicitTarget(env, { uriVar: 'MONGO_EXAM_IMPORT_URI', confirmVar: 'EXAM_IMPORT_CONFIRM', apply })
}

export function parseImportArgs(args) {
  const folder = args.find((arg) => !arg.startsWith('--'))
  const flags = args.filter((arg) => arg.startsWith('--'))
  if (!folder || flags.some((flag) => !['--apply', '--dry-run'].includes(flag)) || (flags.includes('--apply') && flags.includes('--dry-run'))) {
    throw new TargetError('Give the folder with the exam files, then --dry-run (default) or --apply.')
  }
  return { folder, apply: flags.includes('--apply') }
}

// Same id on every database and every run, so reruns find what they made.
export const stableId = (kind, key) => new mongoose.Types.ObjectId(crypto.createHash('sha256').update(`teacherperi:exam-import:${kind}:${key}`).digest('hex').slice(0, 24))

const AREAS = ['Álgebra', 'Combinatoria', 'Geometría', 'Teoría de Números']
const REQUIRED = ['codigo', 'titulo', 'enunciado', 'sourceAttribution', 'año', 'tema', 'tipo', 'competition', 'round', 'difficulty', 'dificultad']

// Checks one exam file's records without a database. Returns error lines.
export function recordProblems(records, file) {
  const errors = []
  if (!Array.isArray(records) || !records.length) return [`${file}: no problems`]
  const numbers = records.map((r) => r.problemNumber)
  if (numbers.some((n, i) => n !== i + 1)) errors.push(`${file}: problem numbers must be 1…${records.length}`)
  const exams = new Set(records.map((r) => `${r.competition}|${r.round}|${r.año}`))
  if (exams.size !== 1) errors.push(`${file}: every problem must belong to the same exam`)
  for (const r of records) {
    const where = `${file} ${r.codigo ?? '?'}`
    for (const key of REQUIRED) if (typeof r[key] !== 'string' || !r[key].trim()) errors.push(`${where}: missing ${key}`)
    if (!/^(19|20)\d{2}$/.test(r.año ?? '')) errors.push(`${where}: año must be a year`)
    if (!AREAS.includes(r.tema)) errors.push(`${where}: unknown área «${r.tema}»`)
    if (!['published', 'draft'].includes(r.publicationStatus)) errors.push(`${where}: publicationStatus must be published or draft`)
    for (const finding of [...mathFindings(r.enunciado), ...mathFindings(r.solution || '')]) errors.push(`${where}: ${finding.message}`)
    if (r.figure && (!/^[a-z0-9-]+$/.test(r.figure.id || '') || !['svg', 'png'].includes(r.figure.kind) || !(r.figure.alt?.length >= 5 && r.figure.alt.length <= 300))) errors.push(`${where}: invalid figure`)
  }
  return errors
}

export function readExamFolder(folder) {
  const files = fs.readdirSync(folder).filter((name) => name.endsWith('.json') && !name.startsWith('_')).sort()
  const exams = files.map((file) => ({ file, records: JSON.parse(fs.readFileSync(path.join(folder, file), 'utf8')) }))
  const errors = exams.flatMap(({ file, records }) => recordProblems(records, file))
  const codes = exams.flatMap(({ records }) => records.map((r) => r.codigo))
  if (new Set(codes).size !== codes.length) errors.push('Two problems share a code.')
  return { exams, errors }
}

async function figureImage(folder, figure) {
  const base = path.join(folder, 'figures', figure.id)
  const source = figure.kind === 'svg'
    ? await sharp(fs.readFileSync(`${base}.svg`), { density: 192 }).flatten({ background: '#ffffff' }).png().toBuffer()
    : fs.readFileSync(`${base}.png`)
  return processImage(source)
}

export async function importExamProblems({ folder, apply }) {
  const { exams, errors } = readExamFolder(folder)
  if (errors.length) throw new TargetError(`The exam files have problems:\n  ${errors.join('\n  ')}`)
  const db = mongoose.connection.db
  const col = (name) => db.collection(name)
  const plan = { folders: [], problems: [], kept: [], images: 0 }
  const session = await mongoose.startSession()
  const work = async () => {
    const opt = { session }
    const now = new Date()
    const roots = await col('categories').find({ parent: null, kind: 'exam' }, opt).toArray()
    if (roots.length > 1) throw new TargetError('There is more than one exam root folder.')
    let root = roots[0]
    if (!root) {
      root = { _id: stableId('category', EXAM_ROOT_NAME), name: EXAM_ROOT_NAME, parent: null, kind: 'exam', reviewStatus: 'approved', createdBy: null, createdAt: now, updatedAt: now }
      plan.folders.push(root)
    }
    // Finds or plans the folder `name` under `parent` (names compared like the site does).
    const childFolder = async (parent, name, key) => {
      const pending = plan.folders.find((f) => String(f.parent) === String(parent._id) && normalizeSlug(f.name) === normalizeSlug(name))
      if (pending) return pending
      const found = (await col('categories').find({ parent: parent._id, kind: 'exam', reviewStatus: { $ne: 'rejected' } }, opt).toArray()).filter((f) => normalizeSlug(f.name) === normalizeSlug(name))
      if (found.length > 1) throw new TargetError(`Two folders called «${name}» in the same place.`)
      if (found[0]?.reviewStatus === 'pending') throw new TargetError(`Folder «${name}» is still waiting for review.`)
      if (found[0]) return found[0]
      const folderDoc = { _id: stableId('category', key), name, parent: parent._id, kind: 'exam', reviewStatus: 'approved', createdBy: null, createdAt: now, updatedAt: now }
      plan.folders.push(folderDoc)
      return folderDoc
    }
    const tags = await col('tags').find({}, opt).toArray()
    const tagByLabel = new Map(tags.map((t) => [t.label, t]))
    const topics = await col('topics').find({}, opt).toArray()
    const areaByName = new Map(topics.filter((t) => !t.parent).map((t) => [t.name, t]))
    // Figures belong to the one admin (or, on a database with a single account, to it).
    let owners = await col('users').find({ role: 'admin' }, opt).project({ _id: 1 }).limit(2).toArray()
    if (!owners.length) owners = await col('users').find({}, opt).project({ _id: 1 }).limit(2).toArray()
    const imageDocs = []
    const problemDocs = []
    const examFolders = []
    for (const { file, records } of exams) {
      const first = records[0]
      const competition = await childFolder(root, first.competition, first.competition)
      const round = await childFolder(competition, first.round, `${first.competition}|${first.round}`)
      const year = await childFolder(round, first.año, `${first.competition}|${first.round}|${first.año}`)
      examFolders.push(year._id)
      for (const r of records) {
        const existing = await col('problems').findOne({ codigo: r.codigo }, opt)
        if (existing) {
          if (existing.enunciado !== r.enunciado) throw new TargetError(`${r.codigo} already exists with a different statement; nothing was written.`)
          plan.kept.push(r.codigo)
          continue
        }
        const area = areaByName.get(r.tema)
        if (!area) throw new TargetError(`${file} ${r.codigo}: área «${r.tema}» does not exist in this database.`)
        const subtopics = (r.subtopicTopics || []).map((name) => topics.find((t) => String(t.parent) === String(area._id) && t.name === name))
        if (subtopics.some((t) => !t)) throw new TargetError(`${file} ${r.codigo}: a subtopic of «${r.tema}» does not exist in this database.`)
        const tagIds = (r.subtopics || []).map((label) => tagByLabel.get(label)?._id)
        if (tagIds.some((id) => !id)) throw new TargetError(`${file} ${r.codigo}: a tag does not exist in this database. This script never creates tags.`)
        const doc = {
          _id: stableId('problem', r.codigo),
          codigo: r.codigo, titulo: r.titulo, enunciado: r.enunciado, solution: r.solution || '',
          sourceAttribution: r.sourceAttribution, año: r.año, tema: r.tema, tipo: r.tipo,
          competition: r.competition, round: r.round, problemNumber: r.problemNumber,
          category: year._id, categories: [year._id],
          topics: [area._id, ...subtopics.map((t) => t._id)], tags: tagIds,
          difficulty: r.difficulty, dificultad: r.dificultad, exito: 0,
          publicationStatus: r.publicationStatus, author: null, deletedAt: null, createdAt: now, updatedAt: now,
        }
        if (r.figure) {
          if (owners.length !== 1) throw new TargetError('Figures need exactly one admin account to own them.')
          const image = await figureImage(folder, r.figure)
          const imageId = stableId('image', r.codigo)
          imageDocs.push({ _id: imageId, owner: owners[0]._id, contentType: 'image/webp', ...image, originalBytes: image.bytes, createdAt: now, updatedAt: now })
          doc.images = [{ image: imageId, alt: r.figure.alt, placement: 'statement' }]
        }
        try { await new Problem(doc).validate() } catch (invalid) {
          throw new TargetError(`${r.codigo}: ${Object.values(invalid.errors || {}).map((e) => e.message).join('; ') || 'invalid problem'}`)
        }
        problemDocs.push(doc)
      }
    }
    plan.problems = problemDocs.map((p) => `${p.codigo}${p.publicationStatus === 'draft' ? ' (draft)' : ''}`)
    plan.images = imageDocs.length
    plan.examFolders = examFolders
    if (apply) {
      if (plan.folders.length) await col('categories').insertMany(plan.folders, { session, ordered: true })
      if (imageDocs.length) await col('problemimages').insertMany(imageDocs, { session, ordered: true })
      if (problemDocs.length) await col('problems').insertMany(problemDocs, { session, ordered: true })
    }
  }
  try {
    if (apply) await session.withTransaction(work)
    else {
      session.startTransaction()
      try { await work() } finally { await session.abortTransaction() }
    }
  } finally {
    await session.endSession()
  }
  plan.exams = apply ? await syncFolderExams(plan.examFolders, { apply: true }) : []
  return plan
}

async function run() {
  const { folder, apply } = parseImportArgs(process.argv.slice(2))
  const target = examImportTarget(process.env, apply)
  await connectTarget(mongoose, target)
  const plan = await importExamProblems({ folder, apply })
  const verb = apply ? 'created' : 'to create'
  console.log([
    `Exam problems import · ${apply ? 'applied' : 'dry-run'} · database: ${target.dbName}`,
    `  Folders ${verb}: ${plan.folders.length}${plan.folders.length ? ` (${plan.folders.map((f) => f.name).join(', ')})` : ''}`,
    `  Problems ${verb}: ${plan.problems.length}; already there: ${plan.kept.length}; figures ${verb}: ${plan.images}`,
    ...(apply ? [`  Exámenes cards: ${plan.exams.length ? '' : 'nothing to change'}`, ...plan.exams.map((line) => `    - ${line}`)] : ['  Exámenes cards are created after --apply by the exam sync.', '  Nothing was written.']),
  ].join('\n'))
}

if (process.argv[1]?.endsWith('/scripts/import-exam-problems.js')) run().catch((error) => {
  const safe = error instanceof TargetError || error.code === 'TARGET_ERROR'
  console.error(`Exam import stopped. ${safe ? error.message : 'Check the connection and the target database; credentials are never printed.'}`)
  process.exitCode = 1
}).finally(() => mongoose.disconnect())
