import mongoose from 'mongoose'
import Path from './Path.js'
import Step from './Step.js'

const pathSectionSchema = new mongoose.Schema(
  {
    path: { type: mongoose.Schema.Types.ObjectId, ref: 'Path', required: true, index: true },
    title: { type: String, required: true, trim: true },
  },
  { timestamps: true },
)

pathSectionSchema.pre('validate', async function validatePathSection() {
  if (!this.path) return
  const PathReference = mongoose.model('PathReference')
  const [path, step, dependentReferenceCount] = await Promise.all([
    Path.exists({ _id: this.path }),
    Step.exists({ path: this.path }),
    this.isNew ? 0 : PathReference.countDocuments({ section: this._id }),
  ])
  if (!path) this.invalidate('path', 'A Path Section must belong to an existing Path.')
  if (step) this.invalidate('path', 'A leaf Path with Steps cannot own presentation sections.')
  if (this.isModified('path') && dependentReferenceCount) {
    this.invalidate('path', 'A Path Section with child references cannot be reassigned.')
  }
})

export default mongoose.model('PathSection', pathSectionSchema)
