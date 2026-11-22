// ---------------------------------------------------------------------------
// Keeps the Exámenes page in step with the exam folders.
//
// The source of truth is each problem's exam folder (a Category with kind
// 'exam') and its problemNumber. Every exam folder that directly holds
// published problems has one Exam document linked to it through `categories`.
// That Exam lists the folder's published problems in problemNumber order
// (problems without a number go last), and its competition, year and round
// come from the folder path:
//   Exámenes › OMM › 2024                → «OMM 2024»
//   Exámenes › OMM Estatal › Jalisco › 2023 → «OMM Estatal 2023 · Jalisco»
// When the folder runs out of problems the Exam is unpublished (draft), never
// deleted, so it comes back with its other fields if a problem returns.
//
// Hand-made exams are left alone: an Exam whose categories hold no exam
// folder (the three TeacherPeri practice exams) keeps its own list, and a
// folder whose problems such an exam already lists gets no second exam.
//
// Call syncFolderExams(folderIds) after anything that moves a problem in or
// out of a folder, renumbers it, publishes, unpublishes, deletes or restores
// it, or renames a folder. With apply=false nothing is written and the
// returned `changes` say what would happen (the backfill dry run).
// ---------------------------------------------------------------------------

import Category from '../models/Category.js'
import Exam from '../models/Exam.js'
import Problem from '../models/Problem.js'
import { publishedOrLegacyProblemQuery } from '../models/content.js'
import { examPathLabel, folderPath } from './examFolders.js'

const YEAR = /^(19|20)\d{2}$/

// competition, year and round for an Exam from the folder names below the
// «Exámenes» root. The year is the last name that looks like a year; the
// competition is the first other name; the rest becomes the round.
export function examFieldsFromPath(names) {
  const year = [...names].reverse().find((name) => YEAR.test(name)) ?? null
  const rest = names.filter((name) => name !== year)
  return { competition: rest[0] ?? year ?? '', year, round: rest.slice(1).join(' · ') || null }
}

// The card title, e.g. «OMM Estatal 2023 · Jalisco». Same rule as the page.
export function examTitle({ competition, year, round }) {
  return [[competition, year].filter(Boolean).join(' '), round].filter(Boolean).join(' · ')
}

// Problems first by number, then the ones without a number, then by code.
export function orderExamProblems(problems) {
  return [...problems].sort((a, b) => {
    const an = a.problemNumber ?? Infinity
    const bn = b.problemNumber ?? Infinity
    if (an !== bn) return an - bn
    return String(a.codigo).localeCompare(String(b.codigo))
  })
}

// Exam folder ids a problem sits in.
export function examFoldersOfProblem(problem, foldersById) {
  return (problem?.categories || []).map(String).filter((id) => foldersById.get(id)?.kind === 'exam')
}

export async function examFolderMap() {
  const folders = await Category.find({ kind: 'exam' }).lean()
  return new Map(folders.map((folder) => [String(folder._id), folder]))
}

// A folder and every folder below it (for renames).
export function folderAndDescendants(id, foldersById) {
  const ids = [String(id)]
  for (let i = 0; i < ids.length; i += 1) {
    for (const folder of foldersById.values()) if (String(folder.parent ?? '') === ids[i]) ids.push(String(folder._id))
  }
  return ids
}

const sameIds = (a, b) => a.length === b.length && a.every((id, i) => String(id) === String(b[i]))

async function syncOne(folderId, foldersById, { apply }) {
  const folder = foldersById.get(folderId)
  if (!folder || !folder.parent || folder.kind !== 'exam') return []
  const where = `«${folderPath(folderId, foldersById).join(' › ')}»`
  const examFolderIds = [...foldersById.keys()]
  const problems = orderExamProblems(await Problem.find({ categories: folderId, ...publishedOrLegacyProblemQuery() }).select('codigo problemNumber').lean())
  const problemIds = problems.map((p) => p._id)

  const linked = await Exam.find({ categories: folderId }).sort({ createdAt: 1 })
  if (!linked.length && problemIds.length) {
    const handMade = await Exam.exists({ 'problems.problem': { $in: problemIds }, categories: { $nin: examFolderIds } })
    if (handMade) return []
  }
  const [exam, ...extra] = linked
  const changes = []
  const fields = examFieldsFromPath(examPathLabel(folderId, foldersById))
  const title = examTitle(fields)
  const list = problems.map((p, i) => ({ problem: p._id, position: i + 1 }))
  const codes = problems.map((p) => p.codigo).join(', ')

  if (!exam) {
    if (!problemIds.length) return []
    changes.push(`create exam «${title}» for ${where} with ${problems.length} problem(s): ${codes}`)
    if (apply) await Exam.create({ ...fields, categories: [folderId], problems: list, publicationStatus: 'published' })
  } else {
    const status = problemIds.length ? 'published' : 'draft'
    const current = [...exam.problems].sort((a, b) => a.position - b.position).map((entry) => entry.problem)
    const fieldsChanged = ['competition', 'year', 'round'].some((key) => (exam[key] ?? null) !== (fields[key] ?? null))
    if (!problemIds.length && exam.publicationStatus === 'published') changes.push(`unpublish exam «${title}» (${where} has no published problems left)`)
    else if (problemIds.length && exam.publicationStatus !== 'published') changes.push(`publish exam «${title}» again for ${where} with ${problems.length} problem(s): ${codes}`)
    else if (!sameIds(current, problemIds)) changes.push(`update exam «${title}» for ${where}: ${problems.length} problem(s) in order ${codes}`)
    if (fieldsChanged) changes.push(`rename exam «${examTitle(exam)}» to «${title}»`)
    if (changes.length && apply) {
      exam.set({ ...fields, problems: list, publicationStatus: status })
      await exam.save()
    }
  }
  for (const duplicate of extra.filter((e) => e.publicationStatus === 'published')) {
    changes.push(`unpublish duplicate exam «${examTitle(duplicate)}» (${duplicate._id}) for ${where}`)
    if (apply) await Exam.updateOne({ _id: duplicate._id }, { publicationStatus: 'draft' })
  }
  return changes
}

// Brings the Exam of each given folder up to date. Returns the change lines.
export async function syncFolderExams(folderIds, { apply = true, foldersById = null } = {}) {
  const map = foldersById ?? await examFolderMap()
  const ids = [...new Set((folderIds || []).filter(Boolean).map(String))]
  const changes = []
  for (const id of ids) changes.push(...await syncOne(id, map, { apply }))
  return changes
}

// Syncs the folders a problem was in before a change and is in now.
export async function syncProblemExams(before, after, options = {}) {
  const map = options.foldersById ?? await examFolderMap()
  return syncFolderExams([...examFoldersOfProblem(before, map), ...examFoldersOfProblem(after, map)], { ...options, foldersById: map })
}

// Every folder that holds problems or already has an Exam (the backfill).
export async function syncAllFolderExams({ apply = false } = {}) {
  const map = await examFolderMap()
  const ids = [...map.keys()]
  const [withProblems, withExams] = await Promise.all([
    Problem.distinct('categories', { categories: { $in: ids } }),
    Exam.distinct('categories', { categories: { $in: ids } }),
  ])
  const used = new Set([...withProblems, ...withExams].map(String))
  // Folder order, so the plan reads top-down.
  const ordered = ids.filter((id) => used.has(id)).sort((a, b) => folderPath(a, map).join(' › ').localeCompare(folderPath(b, map).join(' › ')))
  return syncFolderExams(ordered, { apply, foldersById: map })
}
