import mongoose from 'mongoose'
import { normalizeSlug } from './content.js'

const tagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    label: { type: String, required: true, trim: true },
  },
  { timestamps: true },
)

tagSchema.pre('validate', function normalizeTag() {
  const normalized = normalizeSlug(this.label || this.name)
  this.name = normalized
  if (!this.slug) this.slug = normalized
  if (this.slug) this.slug = normalizeSlug(this.slug)
})

tagSchema.pre('validate', async function enforceNormalizedUniqueness() {
  if (!this.name || !this.slug) return
  const existing = await this.constructor.exists({
    _id: { $ne: this._id },
    $or: [{ name: this.name }, { slug: this.slug }],
  })
  if (existing) this.invalidate('name', 'A controlled Tag name and slug must be unique.')
})

export default mongoose.model('Tag', tagSchema)
