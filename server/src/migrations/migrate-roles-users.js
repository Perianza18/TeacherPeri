// ---------------------------------------------------------------------------
// One-time, idempotent migration for the three-role system and exam folders.
// It never deletes anything and a second run changes nothing.
//
// 1. Rewrites legacy role values (usuario/moderador → user, editor_junior/
//    editor_senior → editor, teacherperi → admin; no role → user). The site
//    already reads them this way, so this only tidies the stored values.
// 2. Creates the «Exámenes» root and the empty top-level competition folders
//    (SEED_FOLDERS). Years and states are added as problems arrive.
// 3. Files the problems of every existing Exam into the tree. The three current
//    exams are TeacherPeri practice sets, so they go to
//    «Exámenes › Prácticas TeacherPeri › <round>»; any other exam would go to
//    «Exámenes › <competition> › <year> › <round>». Additive only: area
//    folders, Exam documents and the Exámenes page stay as they are.
// ---------------------------------------------------------------------------

import Category from '../models/Category.js'
import Exam from '../models/Exam.js'
import Problem from '../models/Problem.js'
import User from '../models/User.js'
import { LEGACY_ROLES } from '../lib/permissions.js'
import { normalizeSlug } from '../models/content.js'
import { EXAM_ROOT_NAME } from '../lib/examFolders.js'

export const SEED_FOLDERS = ['OMM', 'OMM Estatal', 'OMMEB', 'Centroamericana', 'Iberoamericana', 'IMO']
export const PRACTICE_FOLDER = 'Prácticas TeacherPeri'

export function examFolderNames(exam) {
  return exam.competition === 'TeacherPeri'
    ? [PRACTICE_FOLDER, exam.round]
    : [exam.competition, exam.year, exam.round].filter(Boolean)
}

export async function migrateRolesUsers({ apply = false } = {}) {
  const changes = []

  // 1. Roles
  for (const [legacy, role] of Object.entries(LEGACY_ROLES)) {
    const count = await User.countDocuments({ role: legacy })
    if (!count) continue
    changes.push(`role ${legacy} → ${role}: ${count} account(s)`)
    if (apply) await User.updateMany({ role: legacy }, { $set: { role } })
  }
  const missing = await User.countDocuments({ role: { $exists: false } })
  if (missing) {
    changes.push(`no stored role → user: ${missing} account(s)`)
    if (apply) await User.updateMany({ role: { $exists: false } }, { $set: { role: 'user' } })
  }

  // 2 and 3. Folders. In a dry run, folders that would be created get a
  // placeholder id so the plan for their children can still be described.
  const all = await Category.find({ kind: 'exam' }).lean()
  let planned = 0
  async function ensureFolder(name, parent, label) {
    const existing = all.find((folder) => String(folder.parent ?? '') === String(parent ?? '') && folder.reviewStatus !== 'rejected' && normalizeSlug(folder.name) === normalizeSlug(name))
    if (existing) return existing._id
    changes.push(`create folder ${label}`)
    if (!apply) {
      const placeholder = `planned-${(planned += 1)}`
      all.push({ _id: placeholder, name, parent, kind: 'exam', reviewStatus: 'approved' })
      return placeholder
    }
    const created = await Category.create({ name, parent, kind: 'exam', reviewStatus: 'approved' })
    all.push(created.toObject())
    return created._id
  }

  const rootId = await ensureFolder(EXAM_ROOT_NAME, null, `«${EXAM_ROOT_NAME}»`)
  for (const name of SEED_FOLDERS) await ensureFolder(name, rootId, `«${EXAM_ROOT_NAME} › ${name}»`)

  const exams = await Exam.find().sort({ createdAt: 1 }).lean()
  for (const exam of exams) {
    let parent = rootId
    const names = examFolderNames(exam)
    for (let i = 0; i < names.length; i += 1) parent = await ensureFolder(names[i], parent, `«${[EXAM_ROOT_NAME, ...names.slice(0, i + 1)].join(' › ')}»`)
    const problemIds = exam.problems.map((entry) => entry.problem)
    const missingIds = String(parent).startsWith('planned-')
      ? problemIds
      : (await Problem.find({ _id: { $in: problemIds }, categories: { $ne: parent } }).select('_id').lean()).map((p) => p._id)
    if (!missingIds.length) continue
    const codes = (await Problem.find({ _id: { $in: missingIds } }).select('codigo').lean()).map((p) => p.codigo).sort()
    changes.push(`file ${codes.length} problem(s) of «${exam.round}» into «${[EXAM_ROOT_NAME, ...names].join(' › ')}»: ${codes.join(', ')}`)
    if (apply) await Problem.updateMany({ _id: { $in: missingIds } }, { $addToSet: { categories: parent } })
  }

  return { mode: apply ? 'applied' : 'dry-run', changes }
}
