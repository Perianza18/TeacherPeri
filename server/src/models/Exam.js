import mongoose from 'mongoose'
import { publicationFields } from './content.js'
import { orderedProblemSchema, validateOrderedProblems } from './problemReferences.js'

const examSchema = new mongoose.Schema(
  {
    durationMinutes: { type: Number, min: 1, validate: Number.isInteger },
    instructions: { type: String, trim: true },
    competition: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    round: { type: String, required: true, trim: true },
    organization: { type: String, trim: true },
    country: { type: String, trim: true },
    problems: { type: [orderedProblemSchema], default: [] },
    sourceUrl: { type: String, trim: true },
    pdfUrl: { type: String, trim: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    ...publicationFields,
  },
  { timestamps: true },
)

examSchema.pre('validate', validateOrderedProblems)

export default mongoose.model('Exam', examSchema)
