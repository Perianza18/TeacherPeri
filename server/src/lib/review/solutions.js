// ---------------------------------------------------------------------------
// Review of proposed solutions («Proponer una solución», SolutionProposal).
// Same shape as service.js: each action takes { apply } and returns the
// `changes` it makes; with apply=false nothing is written.
//
// Approving publishes the solution on the problem page with credit to its
// author, tells them, records it in «Cambios de editores» and refreshes their
// points and badges (an accepted solution is worth points, lib/levels.js).
// ---------------------------------------------------------------------------

import mongoose from 'mongoose'
import Notification from '../../models/Notification.js'
import Problem from '../../models/Problem.js'
import SolutionProposal, { SOLUTION_REASON_MAX } from '../../models/SolutionProposal.js'
import User from '../../models/User.js'
import { recordReview } from '../activity.js'
import { awardBadges } from '../badges.js'
import { ReviewError, assertReviewer } from './service.js'
import { solutionFindings } from './checks.js'

const isId = (value) => typeof value === 'string' && mongoose.isObjectIdOrHexString(value)
const problemLabel = (problem) => `${problem?.codigo ?? 'Problema'} «${problem?.titulo ?? ''}»`
const problemLink = (problem) => `/entrenamiento/problemas/${problem._id}`

async function findPending(ref) {
  const proposal = isId(ref) ? await SolutionProposal.findOne({ _id: ref, status: 'pending' }) : null
  if (!proposal) throw new ReviewError(`No pending solution matches «${ref}».`)
  return proposal
}

// Pending proposals for Revisión, oldest first, with the problem to compare.
export async function listPendingSolutions() {
  const rows = await SolutionProposal.find({ status: 'pending' }).sort({ createdAt: 1 }).limit(500)
    .populate('author', 'username').populate('problem', 'codigo titulo enunciado solution').lean()
  return rows.map((row) => ({
    id: String(row._id),
    author: row.author?.username ?? null,
    createdAt: row.createdAt,
    body: row.body,
    findings: solutionFindings(row.body),
    problem: row.problem ? {
      id: String(row.problem._id),
      codigo: row.problem.codigo,
      titulo: row.problem.titulo,
      enunciado: row.problem.enunciado,
      hasSolution: Boolean(row.problem.solution),
    } : null,
  }))
}

async function refreshAuthor(userId) {
  const author = await User.findById(userId).select('role').lean()
  if (author) await awardBadges(author)
}

export async function approveSolution({ ref, reviewer, apply = false }) {
  assertReviewer(reviewer, 'solutions:review')
  const proposal = await findPending(ref)
  const problem = await Problem.findById(proposal.problem).select('codigo titulo deletedAt').lean()
  if (!problem || problem.deletedAt) throw new ReviewError('The problem was deleted; nothing to approve.')
  const findings = solutionFindings(proposal.body)
  if (findings.some((f) => f.level === 'error')) throw new ReviewError('Fix the errors before approving.', findings)
  const author = await User.findById(proposal.author).select('username').lean()
  const changes = [`publish the solution of @${author?.username ?? 'cuenta eliminada'} on ${problemLabel(problem)} and notify them`]
  if (apply) {
    proposal.set({ status: 'approved', reviewedBy: reviewer._id, reviewedAt: new Date() })
    await proposal.save()
    await Notification.create({
      user: proposal.author, type: 'solution-approved', problem: problem._id, link: problemLink(problem),
      message: `¡Aceptamos tu solución de ${problemLabel(problem)}! Ya está publicada con tu nombre.`,
    })
    await recordReview({
      targetType: 'problem', target: problem._id, targetLabel: problemLabel(problem), reviewer, action: 'approved',
      summary: `la solución de @${author?.username ?? 'cuenta eliminada'} para ${problemLabel(problem)}.`,
    })
    await refreshAuthor(proposal.author)
  }
  return { mode: apply ? 'applied' : 'dry-run', changes, findings }
}

export async function rejectSolution({ ref, reviewer, reason, apply = false }) {
  assertReviewer(reviewer, 'solutions:review')
  const text = typeof reason === 'string' ? reason.trim() : ''
  if (text.length < 5) throw new ReviewError('A rejection needs a reason (at least 5 characters). The author will read it.')
  if (text.length > SOLUTION_REASON_MAX) throw new ReviewError(`The reason cannot exceed ${SOLUTION_REASON_MAX} characters.`)
  const proposal = await findPending(ref)
  const problem = await Problem.findById(proposal.problem).select('codigo titulo').lean()
  const author = await User.findById(proposal.author).select('username').lean()
  const changes = [`reject the solution of @${author?.username ?? 'cuenta eliminada'} on ${problemLabel(problem)} with reason: ${text}`]
  if (apply) {
    proposal.set({ status: 'rejected', reason: text, reviewedBy: reviewer._id, reviewedAt: new Date() })
    await proposal.save()
    await Notification.create({
      user: proposal.author, type: 'solution-rejected', problem: proposal.problem, link: problem ? problemLink(problem) : null,
      message: `Tu solución de ${problemLabel(problem)} no se aceptó: ${text}`,
    })
    await recordReview({
      targetType: 'problem', target: proposal.problem, targetLabel: problemLabel(problem), reviewer, action: 'rejected',
      summary: `la solución de @${author?.username ?? 'cuenta eliminada'} para ${problemLabel(problem)}.`, note: text,
    })
  }
  return { mode: apply ? 'applied' : 'dry-run', changes }
}
