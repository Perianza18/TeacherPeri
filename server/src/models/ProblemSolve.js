// ProblemSolve: the person marked the problem with «Lo resolví». Nothing
// checks answers; it is the student's own record.
import mongoose from 'mongoose'

const problemSolveSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  },
  { timestamps: true },
)

problemSolveSchema.index({ user: 1, problem: 1 }, { unique: true })
problemSolveSchema.index({ user: 1, createdAt: -1 })

export default mongoose.model('ProblemSolve', problemSolveSchema)
