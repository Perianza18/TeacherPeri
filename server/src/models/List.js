import mongoose from 'mongoose'
import { DIFFICULTY_LEVELS, publicationFields } from './content.js'

const listSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    authors: [{ type: String, trim: true }],
    sourceOrganization: { type: String, trim: true },
    sourceUrl: { type: String, trim: true },
    pdfUrl: { type: String, trim: true },
    level: { type: String, enum: DIFFICULTY_LEVELS },
    // A future upload system may resolve this reference; Lists still default
    // to the original publisher's URL/PDF and never imply local ownership.
    hostedFileReference: { type: String, trim: true },
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    ...publicationFields,
  },
  { timestamps: true },
)

export default mongoose.model('List', listSchema)
