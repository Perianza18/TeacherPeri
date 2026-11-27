// ---------------------------------------------------------------------------
// «Proponer una solución» (SolutionProposal).
//
// GET  /api/solutions/problem/:problemId   public: approved solutions of a published problem, oldest first
// POST /api/solutions                      signed in: { problemId, body }; goes to Revisión
// GET  /api/solutions/mine                 signed in: their own proposals, newest first (Mis envíos)
// DELETE /api/solutions/:id                signed in: withdraw their own pending proposal
// GET  /api/solutions/pending              editors and admins: what waits in Revisión
// POST /api/solutions/:id/approve          editors and admins
// POST /api/solutions/:id/reject           editors and admins: { reason }
//
// Only an accepted solution counts for points (server/src/lib/levels.js).
// ---------------------------------------------------------------------------

import { Router } from 'express'
import mongoose from 'mongoose'
import Problem from '../models/Problem.js'
import SolutionProposal, { SOLUTION_PROPOSAL_MIN } from '../models/SolutionProposal.js'
import User from '../models/User.js'
import { publishedOrLegacyProblemQuery } from '../models/content.js'
import { requireAuth, requirePermission } from '../middleware/auth.js'
import { SOLUTION_MAX, hasErrors, solutionFindings } from '../lib/review/checks.js'
import { ReviewError } from '../lib/review/service.js'
import { approveSolution, listPendingSolutions, rejectSolution } from '../lib/review/solutions.js'
import { PERSON_FIELDS, personView } from './profiles.routes.js'

const router = Router()
const isId = (value) => typeof value === 'string' && mongoose.isObjectIdOrHexString(value)
const GONE = 'Esa solución ya no está en revisión. Recarga la página.'

router.get('/problem/:problemId', async (req, res) => {
  const { problemId } = req.params
  if (!isId(problemId) || !await Problem.exists({ _id: problemId, ...publishedOrLegacyProblemQuery() })) return res.status(404).json({ error: 'Ese problema no existe.' })
  const rows = await SolutionProposal.find({ problem: problemId, status: 'approved' }).sort({ reviewedAt: 1 }).limit(50).populate('author', PERSON_FIELDS).lean()
  res.json({
    items: rows.map((row) => ({ id: String(row._id), body: row.body, approvedAt: row.reviewedAt, author: row.author ? personView(row.author) : null })),
  })
})

router.use(requireAuth)

router.post('/', requirePermission('solutions:propose'), async (req, res) => {
  const { problemId } = req.body ?? {}
  const body = typeof req.body?.body === 'string' ? req.body.body.trim() : ''
  if (!isId(problemId)) return res.status(400).json({ error: 'No se puede proponer una solución para ese problema.' })
  if (body.length < SOLUTION_PROPOSAL_MIN) return res.status(400).json({ error: `Explica tu solución con un poco más de detalle (mínimo ${SOLUTION_PROPOSAL_MIN} caracteres).` })
  if (body.length > SOLUTION_MAX) return res.status(400).json({ error: `La solución no puede pasar de ${SOLUTION_MAX} caracteres.` })
  const findings = solutionFindings(body)
  if (hasErrors(findings)) return res.status(400).json({ error: findings.find((f) => f.level === 'error').message, findings })
  if (!await Problem.exists({ _id: problemId, ...publishedOrLegacyProblemQuery() })) return res.status(404).json({ error: 'Ese problema no existe.' })
  try {
    const proposal = await SolutionProposal.create({ problem: problemId, author: req.userId, body })
    res.status(201).json({ id: String(proposal._id), status: proposal.status, createdAt: proposal.createdAt })
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ error: 'Ya tienes una solución en revisión para este problema. Espera a que la revisemos.' })
    throw error
  }
})

router.get('/mine', async (req, res) => {
  const rows = await SolutionProposal.find({ author: req.userId, status: { $ne: 'withdrawn' } }).sort({ createdAt: -1 }).limit(200).populate('problem', 'codigo titulo').lean()
  res.json(rows.map((row) => ({
    id: String(row._id),
    status: row.status,
    reason: row.reason ?? null,
    createdAt: row.createdAt,
    reviewedAt: row.reviewedAt ?? null,
    body: row.body,
    problem: row.problem ? { id: String(row.problem._id), label: row.problem.titulo || row.problem.codigo, href: `/entrenamiento/problemas/${row.problem._id}` } : null,
  })))
})

router.delete('/:id', async (req, res) => {
  if (!isId(req.params.id)) return res.status(404).json({ error: GONE })
  const result = await SolutionProposal.updateOne({ _id: req.params.id, author: req.userId, status: 'pending' }, { $set: { status: 'withdrawn' } })
  if (!result.modifiedCount) return res.status(404).json({ error: GONE })
  res.json({ id: req.params.id, status: 'withdrawn' })
})

router.get('/pending', requirePermission('solutions:review'), async (req, res) => {
  res.json({ items: await listPendingSolutions() })
})

async function decide(req, res, action) {
  if (!isId(req.params.id)) return res.status(404).json({ error: GONE })
  const reviewer = await User.findById(req.userId).select('username role').lean()
  try {
    const result = await action({ ref: req.params.id, reviewer, reason: req.body?.reason, apply: true })
    res.json({ id: req.params.id, changes: result.changes })
  } catch (error) {
    if (!(error instanceof ReviewError)) throw error
    if (/No pending solution/.test(error.message)) return res.status(404).json({ error: GONE })
    if (/reason/.test(error.message)) return res.status(400).json({ error: 'Escribe el motivo (mínimo 5 caracteres). La persona lo leerá.' })
    res.status(400).json({ error: error.findings?.[0]?.message ?? 'No se pudo aprobar: revisa las fórmulas.', findings: error.findings ?? [] })
  }
}

router.post('/:id/approve', requirePermission('solutions:review'), (req, res) => decide(req, res, approveSolution))
router.post('/:id/reject', requirePermission('solutions:review'), (req, res) => decide(req, res, rejectSolution))

export default router
