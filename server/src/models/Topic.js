import mongoose from 'mongoose'
import { normalizeSlug } from './content.js'

const topicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, immutable: true, trim: true, lowercase: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', default: null },
  },
  { timestamps: true },
)

topicSchema.pre('validate', async function normalizeAndPreventCycles() {
  if (!this.slug) this.slug = normalizeSlug(this.name)
  if (!this.parent) return
  if (this._id.equals(this.parent)) this.invalidate('parent', 'A topic cannot be its own parent.')

  const visited = new Set([this._id.toString()])
  let parentId = this.parent
  while (parentId) {
    const key = parentId.toString()
    if (visited.has(key)) {
      this.invalidate('parent', 'A topic hierarchy cannot contain a cycle.')
      return
    }
    visited.add(key)
    const parent = await this.constructor.findById(parentId).select('parent').lean()
    if (!parent) {
      this.invalidate('parent', 'A topic parent must exist.')
      return
    }
    parentId = parent?.parent || null
  }
})

export default mongoose.model('Topic', topicSchema)
