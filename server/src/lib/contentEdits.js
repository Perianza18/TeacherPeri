// ---------------------------------------------------------------------------
// Direct edits by editors and admins (permission `content:edit-any`).
//
// An editor's change applies at once (no review). Every saved change is
// recorded as a ContentRevision (who, when, each field before and after), and
// every OTHER admin gets an in-site notification with a link to it.
//
// Problems: title, statement, hints, solution, áreas, tags, exam folder and
// problem number. Lessons: title, summary and the lesson text (markup).
// ---------------------------------------------------------------------------

import mongoose from 'mongoose'
import Category from '../models/Category.js'
import ContentRevision from '../models/ContentRevision.js'
import Notification from '../models/Notification.js'
import User from '../models/User.js'
import { roleOf } from './permissions.js'
import { folderPath } from './examFolders.js'
import { mathFindings, statementFindings, STATEMENT_MAX } from './review/checks.js'
import { vocabulary } from './submissions.js'

export const PROBLEM_LIMITS = { titulo: 200, enunciado: STATEMENT_MAX, hint: 5000, solution: 20000 }
export const THEORY_LIMITS = { title: 200, summary: 600, content: 200000 }
const MAX_TERMS = 10

export class EditError extends Error {
  constructor(message, status = 400, checks = []) {
    super(message)
    this.status = status
    this.checks = checks
  }
}

const isId = (value) => typeof value === 'string' && mongoose.isObjectIdOrHexString(value)
const text = (value) => (typeof value === 'string' ? value.replace(/\r\n/g, '\n').trim() : '')

function idList(value, label) {
  if (value === undefined || value === null) return []
  if (!Array.isArray(value) || value.some((id) => !isId(id))) throw new EditError(`La lista de ${label} no es válida.`)
  const list = [...new Set(value.map(String))]
  if (list.length > MAX_TERMS) throw new EditError(`Elige como máximo ${MAX_TERMS} ${label}.`)
  return list
}

function limited(value, max, label, { required = false } = {}) {
  const clean = text(value)
  if (required && !clean) throw new EditError(`Escribe ${label}.`)
  if (clean.length > max) throw new EditError(`${label[0].toUpperCase()}${label.slice(1)} no puede pasar de ${max} caracteres.`)
  return clean
}

// The fields an editor may send for a problem. Anything else in the body is
// ignored (status, author, codigo…).
export function parseProblemEdit(body = {}) {
  const edit = {
    titulo: limited(body.titulo, PROBLEM_LIMITS.titulo, 'el título', { required: true }),
    enunciado: text(body.enunciado),
    hint: limited(body.hint, PROBLEM_LIMITS.hint, 'las pistas'),
    solution: limited(body.solution, PROBLEM_LIMITS.solution, 'la solución'),
    topics: idList(body.topics, 'áreas'),
    tags: idList(body.tags, 'etiquetas'),
    examFolder: null,
    problemNumber: null,
  }
  if (body.examFolder != null && body.examFolder !== '') {
    if (!isId(body.examFolder)) throw new EditError('La carpeta de examen no es válida.')
    edit.examFolder = String(body.examFolder)
  }
  if (body.problemNumber != null && body.problemNumber !== '') {
    const number = Number(body.problemNumber)
    if (!Number.isInteger(number) || number < 1 || number > 999) throw new EditError('El número de problema debe ser un entero entre 1 y 999.')
    edit.problemNumber = number
  }
  const checks = [
    ...statementFindings(edit.enunciado),
    ...mathFindings(edit.enunciado),
    ...mathFindings(edit.hint).map((f) => ({ ...f, message: `Pistas: ${f.message}` })),
    ...mathFindings(edit.solution).map((f) => ({ ...f, message: `Solución: ${f.message}` })),
  ].filter((finding) => finding.level === 'error')
  if (checks.length) throw new EditError(checks[0].message, 422, checks)
  return edit
}

export function parseTheoryEdit(body = {}) {
  return {
    title: limited(body.title, THEORY_LIMITS.title, 'el título', { required: true }),
    summary: limited(body.summary, THEORY_LIMITS.summary, 'el resumen', { required: true }),
    content: limited(body.content, THEORY_LIMITS.content, 'el texto de la lección', { required: true }),
  }
}

// The exam folder a problem sits in (its first exam Category), or null.
function examFolderOf(problem, foldersById) {
  return (problem.categories || []).map(String).find((id) => foldersById.get(id)?.kind === 'exam') || null
}

async function examFolders() {
  const folders = await Category.find({ kind: 'exam' }).lean()
  return new Map(folders.map((folder) => [String(folder._id), folder]))
}

// What the editor form starts from.
export async function problemEditView(problem) {
  const foldersById = await examFolders()
  const examFolder = examFolderOf(problem, foldersById)
  return {
    _id: problem._id,
    codigo: problem.codigo,
    titulo: problem.titulo,
    enunciado: problem.enunciado,
    hint: problem.hint || '',
    solution: problem.solution || '',
    topics: (problem.topics || []).map(String),
    tags: (problem.tags || []).map(String),
    examFolder,
    examFolderPath: examFolder ? folderPath(examFolder, foldersById).slice(1) : [],
    problemNumber: problem.problemNumber ?? null,
    publicationStatus: problem.publicationStatus,
    deleted: Boolean(problem.deletedAt),
    author: problem.author ?? null,
    updatedAt: problem.updatedAt,
  }
}

export function theoryEditView(lesson) {
  return {
    _id: lesson._id,
    title: lesson.title,
    summary: lesson.summary,
    content: lesson.content,
    level: lesson.level,
    publicationStatus: lesson.publicationStatus,
    updatedAt: lesson.updatedAt,
  }
}

const sameList = (a, b) => [...a].map(String).sort().join(',') === [...b].map(String).sort().join(',')

function assertFresh(doc, baseUpdatedAt) {
  if (!baseUpdatedAt) return
  if (new Date(baseUpdatedAt).getTime() !== new Date(doc.updatedAt).getTime()) {
    throw new EditError('Alguien más guardó cambios mientras editabas. Copia tu texto, recarga la página y vuelve a intentarlo.', 409)
  }
}

// Applies an editor's change to a problem document (not saved yet) and
// returns the list of changes, with readable before/after values.
export async function applyProblemEdit(problem, edit, { baseUpdatedAt } = {}) {
  assertFresh(problem, baseUpdatedAt)
  const [{ topics, tags }, foldersById] = await Promise.all([vocabulary(), examFolders()])
  if (edit.topics.some((id) => !topics.has(id))) throw new EditError('Una de las áreas elegidas no existe.')
  if (edit.tags.some((id) => !tags.has(id))) throw new EditError('Una de las etiquetas elegidas no existe.')
  const currentFolder = examFolderOf(problem, foldersById)
  if (edit.examFolder && edit.examFolder !== currentFolder) {
    const folder = foldersById.get(edit.examFolder)
    if (!folder || !folder.parent) throw new EditError('Elige una carpeta dentro de «Exámenes».')
    if (folder.reviewStatus === 'pending' || folder.reviewStatus === 'rejected') throw new EditError('Esa carpeta todavía está en revisión. Elige una carpeta aprobada.')
  }

  const names = (ids, map, field) => ids.map((id) => map.get(String(id))?.[field] ?? '(no existe)')
  const pathOf = (id) => (id ? folderPath(id, foldersById).slice(1).join(' › ') : null)
  const changes = []
  const scalar = (field, label) => {
    const before = problem[field] ?? ''
    const after = edit[field] ?? ''
    if (String(before) !== String(after)) changes.push({ field, label, before: before || null, after: after || null })
  }
  scalar('titulo', 'Título')
  scalar('enunciado', 'Enunciado')
  scalar('hint', 'Pistas')
  scalar('solution', 'Solución')
  if (!sameList(problem.topics || [], edit.topics)) changes.push({ field: 'topics', label: 'Áreas', before: names(problem.topics || [], topics, 'name'), after: names(edit.topics, topics, 'name') })
  if (!sameList(problem.tags || [], edit.tags)) changes.push({ field: 'tags', label: 'Etiquetas', before: names(problem.tags || [], tags, 'label'), after: names(edit.tags, tags, 'label') })
  if ((currentFolder || null) !== (edit.examFolder || null)) changes.push({ field: 'examFolder', label: 'Carpeta de examen', before: pathOf(currentFolder), after: pathOf(edit.examFolder) })
  if ((problem.problemNumber ?? null) !== (edit.problemNumber ?? null)) changes.push({ field: 'problemNumber', label: 'Número de problema', before: problem.problemNumber ?? null, after: edit.problemNumber ?? null })

  if (changes.length) {
    const otherCategories = (problem.categories || []).map(String).filter((id) => foldersById.get(id)?.kind !== 'exam')
    problem.set({
      titulo: edit.titulo,
      enunciado: edit.enunciado,
      hint: edit.hint || undefined,
      solution: edit.solution || undefined,
      topics: edit.topics,
      tags: edit.tags,
      categories: [...otherCategories, ...(edit.examFolder ? [edit.examFolder] : [])],
      problemNumber: edit.problemNumber ?? undefined,
    })
  }
  return changes
}

export function applyTheoryEdit(lesson, edit, { baseUpdatedAt } = {}) {
  assertFresh(lesson, baseUpdatedAt)
  const changes = []
  for (const [field, label] of [['title', 'Título'], ['summary', 'Resumen'], ['content', 'Texto de la lección']]) {
    if ((lesson[field] ?? '') !== edit[field]) changes.push({ field, label, before: lesson[field] ?? null, after: edit[field] })
  }
  if (changes.length) lesson.set(edit)
  return changes
}

// Saves the history entry and tells every other admin.
export async function recordRevision({ targetType, target, targetLabel, editorId, changes }) {
  const editor = await User.findById(editorId).select('username role').lean()
  const revision = await ContentRevision.create({ targetType, target, targetLabel, editor: editorId, editorRole: roleOf(editor), changes })
  const admins = await User.find({ role: { $in: ['admin', 'teacherperi'] }, _id: { $ne: editorId } }).select('_id').lean()
  const fields = changes.map((change) => change.label.toLowerCase()).join(', ')
  const message = `@${editor?.username ?? 'alguien'} editó ${targetLabel}: ${fields}.`.slice(0, 1200)
  if (admins.length) {
    await Notification.insertMany(admins.map((admin) => ({
      user: admin._id,
      type: 'content-edited',
      problem: targetType === 'problem' ? target : null,
      revision: revision._id,
      link: `/panel/cambios/${revision._id}`,
      message,
    })))
  }
  return revision
}

export function revisionView(revision) {
  return {
    _id: revision._id,
    targetType: revision.targetType,
    target: revision.target,
    targetLabel: revision.targetLabel,
    href: revision.targetType === 'problem' ? `/entrenamiento/problemas/${revision.target}` : `/entrenamiento/teoria/${revision.target}`,
    editor: revision.editor?.username ?? null,
    editorRole: revision.editorRole,
    changes: revision.changes,
    createdAt: revision.createdAt,
  }
}
