import mongoose from 'mongoose'
import { publicationFields } from './content.js'
import Problem from './Problem.js'

const examProblemSchema = new mongoose.Schema(
  {
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    position: { type: Number, required: true, min: 1 },
  },
  { _id: false },
)

const examSchema = new mongoose.Schema(
  {
    competition: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    round: { type: String, required: true, trim: true },
    organization: { type: String, trim: true },
    country: { type: String, trim: true },
    problems: { type: [examProblemSchema], default: [] },
    sourceUrl: { type: String, trim: true },
    pdfUrl: { type: String, trim: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    ...publicationFields,
  },
  { timestamps: true },
)

examSchema.pre('validate', async function validateProblemReferences() {
  const positions = this.problems.map(({ position }) => position)
  if (new Set(positions).size !== positions.length) this.invalidate('problems', 'Exam problem positions must be unique.')
  if (!this.problems.length) return
  const ids = this.problems.map(({ problem }) => problem)
  if (new Set(ids.map(String)).size !== ids.length) {
    this.invalidate('problems', 'An Exam cannot reference the same Problem more than once.')
    return
  }
  const count = await Problem.countDocuments({ _id: { $in: ids } })
  if (count !== ids.length) this.invalidate('problems', 'Every exam problem reference must exist.')
})

export default mongoose.model('Exam', examSchema)
