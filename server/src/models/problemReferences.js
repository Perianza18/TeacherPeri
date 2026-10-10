import mongoose from 'mongoose'
import Problem from './Problem.js'

export const orderedProblemSchema = new mongoose.Schema({
  problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  position: { type: Number, required: true, min: 1, validate: Number.isInteger },
}, { _id: false })

export async function validateOrderedProblems() {
  const positions = this.problems.map((p) => p.position).sort((a, b) => a - b)
  if (positions.some((position, i) => position !== i + 1)) this.invalidate('problems', 'Problem positions must be contiguous starting at one.')
  const ids = this.problems.map((p) => p.problem)
  if (new Set(ids.map(String)).size !== ids.length) this.invalidate('problems', 'A collection cannot reference the same Problem more than once.')
  if (ids.length && await Problem.countDocuments({ _id: { $in: ids } }) !== ids.length) this.invalidate('problems', 'Every problem reference must exist.')
}
