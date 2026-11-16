// ---------------------------------------------------------------------------
// Category model — the "folders" from the AoPS-style structure.
//
// A category can point to another category as its "parent", which is how
// folders end up nested inside folders (e.g. "Colección interna" contains
// "2024", the same way AoPS nests Contest > Year). A category with
// parent = null is a top-level folder.
//
// This project only uses categories for the data model right now — the
// fancy nested folder-browser UI is a later step, not part of this pass.
// ---------------------------------------------------------------------------

import mongoose from 'mongoose'
import { normalizeSlug } from './content.js'

// Carpetas de examen (kind 'exam'): cuelgan de una raíz «Exámenes» y cualquier
// persona con sesión puede proponer una subcarpeta, que queda en revisión hasta
// que un admin la aprueba. Las carpetas de siempre son kind 'general'.
// Un documento sin reviewStatus (todas las carpetas anteriores) cuenta como
// aprobado.
export const FOLDER_KINDS = ['general', 'exam']
export const FOLDER_REVIEW_STATUSES = ['approved', 'pending', 'rejected']
export const FOLDER_NAME_MAX = 80

export function publicFolderQuery() {
  return { reviewStatus: { $nin: ['pending', 'rejected'] } }
}

const categorySchema = new mongoose.Schema(
  {
    // El nombre visible de la carpeta, ej. "Colección interna" o "2024".
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Referencia a OTRO documento Category — así es como una carpeta vive
    // "dentro" de otra. `ref: 'Category'` le dice a Mongoose que este ID
    // apunta a otro documento de esta misma colección (auto-referencia).
    // null = está en la raíz (no tiene carpeta padre).
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },

    kind: { type: String, enum: FOLDER_KINDS, default: 'general' },
    reviewStatus: { type: String, enum: FOLDER_REVIEW_STATUSES, default: 'approved' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewReason: { type: String, trim: true, default: null },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true },
)

categorySchema.index({ parent: 1, kind: 1 })

// Dos carpetas de examen hermanas no pueden llamarse igual (sin importar
// mayúsculas ni acentos): «Jalisco» y «jalisco» bajo «OMM Estatal» serían la
// misma carpeta. Una carpeta rechazada no ocupa el nombre. Las carpetas
// generales conservan su comportamiento anterior.
categorySchema.pre('validate', async function uniqueSiblingName() {
  if (this.kind !== 'exam' || !this.name || this.reviewStatus === 'rejected') return
  if (!this.isNew && !this.isModified('name') && !this.isModified('parent') && !this.isModified('reviewStatus')) return
  const target = normalizeSlug(this.name)
  const siblings = await this.constructor.find({ _id: { $ne: this._id }, parent: this.parent ?? null, kind: 'exam', reviewStatus: { $ne: 'rejected' } }).select('name').lean()
  if (siblings.some((sibling) => normalizeSlug(sibling.name) === target)) {
    this.invalidate('name', 'Ya existe una carpeta con ese nombre en este lugar.')
  }
})

categorySchema.pre('validate', async function preventCycles() {
  if (!this.parent) return
  if (this._id.equals(this.parent)) this.invalidate('parent', 'A category cannot be its own parent.')
  const visited = new Set([this._id.toString()])
  let parentId = this.parent
  while (parentId) {
    const key = parentId.toString()
    if (visited.has(key)) {
      this.invalidate('parent', 'A category hierarchy cannot contain a cycle.')
      return
    }
    visited.add(key)
    const parent = await this.constructor.findById(parentId).select('parent').lean()
    if (!parent) {
      this.invalidate('parent', 'A category parent must exist.')
      return
    }
    parentId = parent?.parent || null
  }
})

export default mongoose.model('Category', categorySchema)
