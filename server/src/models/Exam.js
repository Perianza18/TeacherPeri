import mongoose from 'mongoose'
import { publicationFields } from './content.js'
import { orderedProblemSchema, validateOrderedProblems } from './problemReferences.js'

const examSchema = new mongoose.Schema(
  {
    durationMinutes: { type: Number, min: 1, validate: Number.isInteger },
    instructions: { type: String, trim: true },
    competition: { type: String, required: true, trim: true },
    // Exams built from an exam folder (server/src/lib/examSync.js) may have no
    // year or round, e.g. «Exámenes › IMO» or «Exámenes › OMM › 2024».
    year: { type: String, trim: true },
    round: { type: String, trim: true },
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
