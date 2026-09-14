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
  const normalized = normalizeSlug(this.name || this.label)
  if (!this.slug) this.slug = normalized
  if (this.slug) this.slug = normalizeSlug(this.slug)
  if (!this.name) this.name = normalized
})

export default mongoose.model('Tag', tagSchema)
