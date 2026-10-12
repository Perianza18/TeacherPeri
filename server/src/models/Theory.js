import mongoose from 'mongoose'
import { DIFFICULTY_LEVELS, publicationFields } from './content.js'

const theorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    // Editorial scaffolding, NOT mathematical difficulty or the reader's ability.
    engagement: { type: Number, min: 1, max: 10, validate: Number.isInteger },
    level: { type: String, enum: DIFFICULTY_LEVELS, required: true },
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    ...publicationFields,
  },
  { timestamps: true },
)

export default mongoose.model('Theory', theorySchema)
