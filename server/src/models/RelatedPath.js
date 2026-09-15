import mongoose from 'mongoose'
import Path from './Path.js'

export const RELATED_PATH_TYPES = ['prerequisite', 'deeper', 'related']

const relatedPathSchema = new mongoose.Schema(
  {
    sourcePath: { type: mongoose.Schema.Types.ObjectId, ref: 'Path', required: true, index: true },
    targetPath: { type: mongoose.Schema.Types.ObjectId, ref: 'Path', required: true, index: true },
    relationshipType: { type: String, required: true, enum: RELATED_PATH_TYPES },
  },
  { timestamps: true },
)

relatedPathSchema.index({ sourcePath: 1, targetPath: 1, relationshipType: 1 }, { unique: true })

relatedPathSchema.pre('validate', async function validateRelatedPath() {
  if (!this.sourcePath || !this.targetPath) return
  if (this.sourcePath.equals(this.targetPath)) {
    this.invalidate('targetPath', 'A Path cannot be related to itself.')
    return
  }

  const [source, target, duplicate] = await Promise.all([
    Path.exists({ _id: this.sourcePath }),
    Path.exists({ _id: this.targetPath }),
    this.constructor.exists({
      _id: { $ne: this._id },
      sourcePath: this.sourcePath,
      targetPath: this.targetPath,
      relationshipType: this.relationshipType,
    }),
  ])
  if (!source) this.invalidate('sourcePath', 'A related Path source must exist.')
  if (!target) this.invalidate('targetPath', 'A related Path target must exist.')
  if (duplicate) this.invalidate('targetPath', 'An equivalent related Path reference already exists.')
})

export default mongoose.model('RelatedPath', relatedPathSchema)
