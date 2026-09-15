import mongoose from 'mongoose'
import Problem from './Problem.js'
import Theory from './Theory.js'
import List from './List.js'
import Exam from './Exam.js'
import Path from './Path.js'

const CONTENT_MODELS = { Problem, Theory, List, Exam }
export const STEP_CONTENT_TYPES = Object.keys(CONTENT_MODELS)

const teacherperiReferenceSchema = new mongoose.Schema(
  {
    contentType: { type: String, required: true, enum: STEP_CONTENT_TYPES },
    target: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { _id: false },
)

const externalResourceSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    url: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator(value) {
          try {
            const parsed = new URL(value)
            return parsed.protocol === 'http:' || parsed.protocol === 'https:'
          } catch {
            return false
          }
        },
        message: 'An external resource URL must use http or https.',
      },
    },
    description: { type: String, trim: true },
    resourceType: { type: String, trim: true },
  },
  { _id: false },
)

const stepSchema = new mongoose.Schema(
  {
    path: { type: mongoose.Schema.Types.ObjectId, ref: 'Path', required: true, index: true },
    order: { type: Number, required: true, min: 1 },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    teacherperiReferences: { type: [teacherperiReferenceSchema], default: [] },
    extraResources: { type: [externalResourceSchema], default: [] },
  },
  { timestamps: true },
)

stepSchema.index({ path: 1, order: 1 }, { unique: true })

stepSchema.pre('validate', async function validateStep() {
  if (!this.path) return
  const PathReference = mongoose.model('PathReference')
  const PathSection = mongoose.model('PathSection')
  const [path, childReference, section, existingOrder] = await Promise.all([
    Path.exists({ _id: this.path }),
    PathReference.exists({ parentPath: this.path }),
    PathSection.exists({ path: this.path }),
    this.constructor.exists({ _id: { $ne: this._id }, path: this.path, order: this.order }),
  ])
  if (!path) this.invalidate('path', 'A Step must belong to an existing Path.')
  if (childReference) this.invalidate('path', 'A Path with child Paths cannot own Steps.')
  if (section) this.invalidate('path', 'A Path with presentation Sections cannot own Steps.')
  if (existingOrder) this.invalidate('order', 'Step order positions must be unique within a Path.')

  const seen = new Set()
  const byType = new Map()
  for (const reference of this.teacherperiReferences) {
    const key = `${reference.contentType}:${reference.target}`
    if (seen.has(key)) this.invalidate('teacherperiReferences', 'A Step cannot repeat the same TeacherPeri reference.')
    seen.add(key)
    if (!byType.has(reference.contentType)) byType.set(reference.contentType, [])
    byType.get(reference.contentType).push(reference.target)
  }

  await Promise.all([...byType.entries()].map(async ([contentType, ids]) => {
    const Model = CONTENT_MODELS[contentType]
    if (!Model) {
      this.invalidate('teacherperiReferences', 'A Step contains an unsupported TeacherPeri reference type.')
      return
    }
    const count = await Model.countDocuments({ _id: { $in: ids } })
    if (count !== ids.length) this.invalidate('teacherperiReferences', 'Every TeacherPeri Step reference must exist.')
  }))
})

export default mongoose.model('Step', stepSchema)
