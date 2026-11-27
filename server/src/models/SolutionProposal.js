// ---------------------------------------------------------------------------
// SolutionProposal — «Proponer una solución» on a published problem. Anyone
// signed in may send one; an editor or admin reviews it in Revisión. Once
// approved it is shown on the problem page under «Soluciones de la comunidad»
// with credit to its author, and it counts for points and badges
// (server/src/lib/levels.js). The problem's own «Solución» never changes.
//
// status: pending → approved | rejected (with a reason), or withdrawn (the
// author took it back). One pending proposal per person per problem; many
// people may propose for the same problem.
// ---------------------------------------------------------------------------

import mongoose from 'mongoose'
import { SOLUTION_MAX } from '../lib/review/checks.js'

export const SOLUTION_PROPOSAL_MIN = 20
export const SOLUTION_STATUSES = ['pending', 'approved', 'rejected', 'withdrawn']
export const SOLUTION_REASON_MAX = 1000

const solutionProposalSchema = new mongoose.Schema(
  {
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    body: { type: String, required: true, trim: true, minlength: SOLUTION_PROPOSAL_MIN, maxlength: SOLUTION_MAX },
    status: { type: String, enum: SOLUTION_STATUSES, default: 'pending' },
    reason: { type: String, trim: true, maxlength: SOLUTION_REASON_MAX, default: null },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true },
)

solutionProposalSchema.index({ status: 1, createdAt: 1 })
solutionProposalSchema.index({ problem: 1, status: 1, reviewedAt: 1 })
solutionProposalSchema.index({ problem: 1, author: 1 }, { unique: true, partialFilterExpression: { status: 'pending' }, name: 'one_pending_solution_per_person' })

export default mongoose.model('SolutionProposal', solutionProposalSchema)
