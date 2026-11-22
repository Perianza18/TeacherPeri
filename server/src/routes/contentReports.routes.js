// ---------------------------------------------------------------------------
// «Reportar» a problem or a lesson as inappropriate. Goes to Moderación.
//
// POST /api/reports/content               anyone signed in: { targetType, targetId, reason, note }
// GET  /api/reports/content?status=open   editors and admins: every report, oldest first
// POST /api/reports/content/:id/status    editors and admins: { status: resolved|dismissed, note }
//
// Content corrections are suggestions (/api/flags, Revisión), not reports.
// ---------------------------------------------------------------------------

import { Router } from 'express'
import mongoose from 'mongoose'
import ContentReport, { CONTENT_REPORT_STATUSES, CONTENT_REPORT_TARGETS } from '../models/ContentReport.js'
import Problem from '../models/Problem.js'
import Theory from '../models/Theory.js'
import { publishedOrLegacyProblemQuery } from '../models/content.js'
import { requireAuth, requirePermission } from '../middleware/auth.js'
import { parseReason } from '../lib/moderation.js'

const router = Router()
const isId = (value) => typeof value === 'string' && mongoose.isObjectIdOrHexString(value)

router.use(requireAuth)

async function publicTargetExists(targetType, id) {
  if (targetType === 'problem') return Problem.exists({ _id: id, ...publishedOrLegacyProblemQuery() })
  return Theory.exists({ _id: id, publicationStatus: 'published' })
}

router.post('/', requirePermission('content:report'), async (req, res) => {
  const { targetType, targetId } = req.body ?? {}
  if (!CONTENT_REPORT_TARGETS.includes(targetType) || !isId(targetId)) return res.status(400).json({ error: 'No se puede reportar esa página.' })
  const parsed = parseReason(req.body)
  if (parsed.error) return res.status(400).json({ error: parsed.error })
  if (!await publicTargetExists(targetType, targetId)) return res.status(404).json({ error: 'Esa página no existe.' })
  try {
    const report = await ContentReport.create({ targetType, target: targetId, reporter: req.userId, reason: parsed.reason, note: parsed.note })
    res.status(201).json({ _id: report._id, status: report.status, createdAt: report.createdAt })
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ error: 'Ya reportaste esta página. La revisaremos pronto.' })
    throw error
  }
})

router.get('/', requirePermission('reports:moderate'), async (req, res) => {
  const status = req.query.status ?? 'open'
  if (!CONTENT_REPORT_STATUSES.includes(status)) return res.status(400).json({ error: 'Estado de reporte no válido.' })
  const reports = await ContentReport.find({ status }).sort({ createdAt: status === 'open' ? 1 : -1 }).limit(500).populate('reporter', 'username').populate('handledBy', 'username').lean()
  const ids = (type) => reports.filter((r) => r.targetType === type).map((r) => r.target)
  const [problems, lessons] = await Promise.all([
    Problem.find({ _id: { $in: ids('problem') } }).select('codigo titulo').lean(),
    Theory.find({ _id: { $in: ids('theory') } }).select('title').lean(),
  ])
  const names = new Map([...problems.map((p) => [String(p._id), `${p.codigo} «${p.titulo}»`]), ...lessons.map((t) => [String(t._id), `«${t.title}»`])])
  res.json(reports.map((report) => ({
    id: String(report._id),
    targetType: report.targetType,
    target: String(report.target),
    targetName: names.get(String(report.target)) ?? '(ya no existe)',
    reason: report.reason,
    note: report.note,
    reporter: report.reporter?.username ?? null,
    createdAt: report.createdAt,
    status: report.status,
    handledBy: report.handledBy?.username ?? null,
    handledAt: report.handledAt,
    handledNote: report.handledNote ?? null,
  })))
})

router.post('/:id/status', requirePermission('reports:moderate'), async (req, res) => {
  const { status } = req.body ?? {}
  const note = typeof req.body?.note === 'string' ? req.body.note.trim().slice(0, 500) : ''
  if (!['resolved', 'dismissed'].includes(status)) return res.status(400).json({ error: 'Elige resuelto o descartado.' })
  const report = isId(req.params.id)
    ? await ContentReport.findOneAndUpdate({ _id: req.params.id, status: 'open' }, { status, handledBy: req.userId, handledAt: new Date(), handledNote: note || null }, { returnDocument: 'after' })
    : null
  if (!report) return res.status(404).json({ error: 'Ese reporte ya no está abierto. Recarga la página.' })
  res.json({ _id: report._id, status: report.status })
})

export default router
