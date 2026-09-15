import mongoose from 'mongoose'
import { PUBLICATION_STATUSES, normalizeSlug } from './content.js'
import Tag from './Tag.js'

export const PATH_LEVELS = ['introductorio', 'omm', 'avanzado']

const pathSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, immutable: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    level: { type: String, enum: PATH_LEVELS },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    publicationStatus: {
      type: String,
      enum: PUBLICATION_STATUSES,
      default: 'draft',
      index: true,
    },
  },
  { timestamps: true },
)

pathSchema.pre('validate', async function normalizeAndValidatePath() {
  if (!this.slug) this.slug = normalizeSlug(this.title)
  if (this.slug) this.slug = normalizeSlug(this.slug)
  const ids = this.tags.map(String)
  if (ids.length !== new Set(ids).size) this.invalidate('tags', 'A Path cannot contain duplicate Tags.')
  if (this.tags.length && await Tag.countDocuments({ _id: { $in: this.tags } }) !== this.tags.length) {
    this.invalidate('tags', 'Every Path Tag must exist in the controlled Tag system.')
  }
})

export default mongoose.model('Path', pathSchema)
