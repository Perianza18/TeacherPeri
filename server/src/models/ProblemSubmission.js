// ---------------------------------------------------------------------------
// ProblemSubmission — one document per request to create or change a
// community Problem. The Problem itself always holds the live (approved)
// version; a submission holds what its author PROPOSES until someone reviews it.
//
//   kind 'create' → a brand-new problem (the Problem exists as a draft)
//   kind 'edit'   → a change to a published problem (the live version stays
//                   public until this is approved)
//
// status: pending → approved | rejected (with a reason), or withdrawn (the
// author deleted the problem) / superseded (never used by the API today; kept
// for an editor flow that replaces a pending proposal).
// At most ONE pending submission per problem (partial unique index below).
// ---------------------------------------------------------------------------

import mongoose from 'mongoose'
import { SOLUTION_MAX, STATEMENT_MAX } from '../lib/review/checks.js'

export const SUBMISSION_KINDS = ['create', 'edit']
export const SUBMISSION_STATUSES = ['pending', 'approved', 'rejected', 'withdrawn', 'superseded']
export const REJECTION_REASON_MAX = 1000

const proposalSchema = new mongoose.Schema(
  {
    enunciado: { type: String, required: true, maxlength: STATEMENT_MAX },
    // Optional: the author's solution or final answer (shown, once approved,
    // under «Solución» on the problem page).
    solution: { type: String, default: '', maxlength: SOLUTION_MAX },
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    isExam: { type: Boolean, default: false },
    examFolder: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    problemNumber: { type: Number, min: 1, max: 999, default: null },
    // Pictures for the statement (ProblemImage ids with their alt text).
    images: {
      type: [new mongoose.Schema({
        image: { type: mongoose.Schema.Types.ObjectId, ref: 'ProblemImage', required: true },
        alt: { type: String, required: true, trim: true, minlength: 5, maxlength: 300 },
        placement: { type: String, enum: ['statement'], default: 'statement' },
      }, { _id: false })],
      default: [],
    },
  },
  { _id: false },
)

const checkSchema = new mongoose.Schema(
  {
    level: { type: String, enum: ['error', 'warning', 'info'], required: true },
    code: { type: String, required: true },
    message: { type: String, required: true },
  },
  { _id: false },
)

const submissionSchema = new mongoose.Schema(
  {
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true, index: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    kind: { type: String, enum: SUBMISSION_KINDS, required: true },
    proposed: { type: proposalSchema, required: true },
    status: { type: String, enum: SUBMISSION_STATUSES, default: 'pending' },
    reason: { type: String, trim: true, maxlength: REJECTION_REASON_MAX, default: null },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null },
    // Automatic checks (math renders, duplicates, spam signals…) computed when
    // the author saved it. The review recomputes them; they never block saving.
    checks: { type: [checkSchema], default: [] },
    // Later: an editor's direct change is stored as an approved revision.
    appliedDirectly: { type: Boolean, default: false },
  },
  { timestamps: true },
)

submissionSchema.index({ status: 1, createdAt: 1 })
submissionSchema.index({ problem: 1 }, { unique: true, partialFilterExpression: { status: 'pending' }, name: 'one_pending_per_problem' })

export default mongoose.model('ProblemSubmission', submissionSchema)
