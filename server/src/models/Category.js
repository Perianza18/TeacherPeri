// ---------------------------------------------------------------------------
// Category model — the "folders" from the AoPS-style structure.
//
// A category can point to another category as its "parent", which is how
// folders end up nested inside folders (e.g. "Interno Axioma" contains
// "2024", the same way AoPS nests Contest > Year). A category with
// parent = null is a top-level folder.
//
// This project only uses categories for the data model right now — the
// fancy nested folder-browser UI is a later step, not part of this pass.
// ---------------------------------------------------------------------------

import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    // El nombre visible de la carpeta, ej. "Interno Axioma" o "2024".
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
  },
  { timestamps: true },
)

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
