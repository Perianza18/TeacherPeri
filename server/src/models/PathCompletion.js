import mongoose from 'mongoose'

const pathCompletionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    path: { type: mongoose.Schema.Types.ObjectId, ref: 'Path', required: true, index: true },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

pathCompletionSchema.index({ user: 1, path: 1 }, { unique: true })

export default mongoose.model('PathCompletion', pathCompletionSchema)
