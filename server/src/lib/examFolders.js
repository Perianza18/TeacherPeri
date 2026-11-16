// ---------------------------------------------------------------------------
// Exam folder tree helpers. Exam folders are Categories with kind 'exam' under
// one root «Exámenes»: Exámenes › OMM Estatal › Jalisco › 2023.
// ---------------------------------------------------------------------------

import Category, { FOLDER_NAME_MAX } from '../models/Category.js'

export const EXAM_ROOT_NAME = 'Exámenes'

// The root is created on first use, so the submit form works right after a
// deploy even before the migration seeds the tree. Idempotent.
export async function ensureExamRoot() {
  const existing = await Category.findOne({ parent: null, kind: 'exam' }).sort({ createdAt: 1 }).lean()
  if (existing) return existing
  const created = await Category.create({ name: EXAM_ROOT_NAME, parent: null, kind: 'exam', reviewStatus: 'approved' })
  return created.toObject()
}

// Exam folders a person may see: approved ones plus the ones they proposed and
// are still waiting for review. Rejected folders are never offered.
export async function examFoldersVisibleTo(userId) {
  const or = [{ reviewStatus: { $nin: ['pending', 'rejected'] } }]
  if (userId) or.push({ reviewStatus: 'pending', createdBy: userId })
  return Category.find({ kind: 'exam', $or: or }).sort({ name: 1 }).lean()
}

// Names from the top folder down to `id`, e.g. ['Exámenes', 'OMM', '2024'].
export function folderPath(id, folders) {
  const byId = folders instanceof Map ? folders : new Map(folders.map((folder) => [String(folder._id), folder]))
  const names = []
  const seen = new Set()
  let cursor = id ? byId.get(String(id)) : null
  while (cursor && !seen.has(String(cursor._id))) {
    seen.add(String(cursor._id))
    names.unshift(cursor.name)
    cursor = cursor.parent ? byId.get(String(cursor.parent)) : null
  }
  return names
}

// The path without the «Exámenes» root, for titles: ['OMM Estatal', 'Jalisco', '2023'].
export function examPathLabel(id, folders) {
  const names = folderPath(id, folders)
  return names.length > 1 ? names.slice(1) : names
}

// Validates a proposed folder name. Returns { name } or { error }.
export function parseFolderName(input) {
  const name = typeof input === 'string' ? input.replace(/\s+/g, ' ').trim() : ''
  if (!name) return { error: 'Escribe el nombre de la carpeta.' }
  if (name.length > FOLDER_NAME_MAX) return { error: `El nombre no puede pasar de ${FOLDER_NAME_MAX} caracteres.` }
  if (!/^[\p{L}\p{N}][\p{L}\p{N} .,'()·-]*$/u.test(name)) return { error: 'Usa solo letras, números, espacios y . , - ( ) en el nombre.' }
  return { name }
}
