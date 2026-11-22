// ---------------------------------------------------------------------------
// On-site review of community submissions (editors and admins). Same functions as
// `npm run review` (server/src/lib/review/service.js), always applied: the
// person clicking is the reviewer, and the service checks their permission
// again. Every decision is recorded in «Cambios de editores» and, when an
// editor takes it, admins are notified (server/src/lib/activity.js).
// Suggestions («Sugerir un cambio») are listed and closed through /api/flags.
//
// GET  /api/review                                 pending problems and pending folders
// GET  /api/review/folders                         every exam folder that is not rejected
// GET  /api/review/submissions/:id                 one submission in full (with what an edit changes)
// POST /api/review/submissions/:id/approve         { fixes: { topics, tags, folder, notExam, number, title } }
// POST /api/review/submissions/:id/reject          { reason }
// POST /api/review/folders/:id/approve
// POST /api/review/folders/:id/reject              { reason }
// POST /api/review/folders/:id/rename              { name }
// ---------------------------------------------------------------------------

import { Router } from 'express'
import mongoose from 'mongoose'
import Category from '../models/Category.js'
import User from '../models/User.js'
import { requireAuth, requirePermission } from '../middleware/auth.js'
import {
  ReviewError, approveFolder, approveSubmission, listPending, rejectFolder, rejectSubmission, renameFolder, showSubmission,
} from '../lib/review/service.js'

const router = Router()
const isId = (value) => typeof value === 'string' && mongoose.isObjectIdOrHexString(value)

router.use(requireAuth)

// The service speaks English (it also prints to a terminal); the site speaks
// Spanish. Known messages are translated; the automatic checks already are.
const SPANISH = [
  [/^Fix the errors before approving/, 'Corrige estos puntos antes de aprobar.'],
  [/^A rejection needs a reason/, 'Escribe el motivo (mínimo 5 caracteres). La persona autora lo leerá.'],
  [/^The reason cannot exceed/, 'El motivo es demasiado largo (máximo 1000 caracteres).'],
  [/^No pending submission matches/, 'Ese envío ya no está pendiente. Recarga la página.'],
  [/^No submission matches/, 'Ese envío no existe.'],
  [/^The problem was deleted/, 'La persona autora eliminó este problema; no hay nada que aprobar.'],
  [/is not an existing (topic|tag)/, 'Una de las áreas o etiquetas elegidas no existe.'],
  [/^No exam folder matches/, 'Esa carpeta de examen no existe.'],
  [/is not pending\.$/, 'Esa carpeta ya no está en revisión. Recarga la página.'],
  [/^Only pending folders can be rejected/, 'Esa carpeta ya no está en revisión. Recarga la página.'],
  [/^The folder still has/, 'La carpeta todavía tiene subcarpetas, envíos pendientes o problemas. Muévelos o recházalos primero.'],
  [/^--difficulty must be/, 'El nivel elegido no es válido.'],
]
const FINDINGS = { 'no-topic': 'Agrega al menos un área antes de aprobar.' }

function spanish(error) {
  const match = SPANISH.find(([pattern]) => pattern.test(error.message))
  return match ? match[1] : error.message
}

async function reviewer(req) {
  return User.findById(req.userId).select('username email role').lean()
}

async function run(res, action) {
  try {
    return res.json(await action())
  } catch (error) {
    if (error instanceof ReviewError) {
      const permission = /does not have permission/.test(error.message)
      const checks = (error.findings || []).map((finding) => ({ ...finding, message: FINDINGS[finding.code] || finding.message }))
      return res.status(permission ? 403 : 400).json({ error: permission ? 'No tienes permiso para hacer esto.' : spanish(error), ...(checks.length ? { checks } : {}) })
    }
    if (error.name === 'ValidationError') return res.status(409).json({ error: Object.values(error.errors)[0]?.message || 'No se pudo guardar.' })
    throw error
  }
}

const list = (value) => (Array.isArray(value) ? value.filter((item) => typeof item === 'string') : undefined)

// Only the fixes the screen offers; anything else in the body is ignored.
export function fixesFromBody(body = {}) {
  const fixes = {}
  const source = body.fixes || {}
  if (list(source.topics)) fixes.topics = list(source.topics)
  if (list(source.tags)) fixes.tags = list(source.tags)
  if (source.notExam === true) fixes.notExam = true
  else if (isId(source.folder)) fixes.folder = source.folder
  if (source.number !== undefined && source.number !== null && source.number !== '') {
    const number = Number(source.number)
    if (!Number.isInteger(number) || number < 1 || number > 999) throw new ReviewError('El número de problema debe ser un entero entre 1 y 999.')
    fixes.number = number
  }
  if (typeof source.title === 'string' && source.title.trim()) fixes.title = source.title.trim().slice(0, 200)
  return fixes
}

router.get('/', requirePermission('submissions:review'), async (_req, res) => {
  res.json(await listPending())
})

// Every exam folder that is not rejected (pending ones too), for the folder
// picker when an admin moves a proposal to another folder.
router.get('/folders', requirePermission('folders:review'), async (_req, res) => {
  const folders = await Category.find({ kind: 'exam', reviewStatus: { $ne: 'rejected' } }).sort({ name: 1 }).select('name parent reviewStatus').lean()
  res.json(folders.map((folder) => ({ _id: folder._id, name: folder.name, parent: folder.parent, reviewStatus: folder.reviewStatus ?? 'approved', mine: false })))
})

router.get('/submissions/:id', requirePermission('submissions:review'), async (req, res) => {
  if (!isId(req.params.id)) return res.status(404).json({ error: 'Ese envío no existe.' })
  return run(res, () => showSubmission(req.params.id))
})

router.post('/submissions/:id/approve', requirePermission('submissions:review'), async (req, res) => {
  if (!isId(req.params.id)) return res.status(404).json({ error: 'Ese envío no existe.' })
  return run(res, async () => approveSubmission({ ref: req.params.id, reviewer: await reviewer(req), fixes: fixesFromBody(req.body), apply: true }))
})

router.post('/submissions/:id/reject', requirePermission('submissions:review'), async (req, res) => {
  if (!isId(req.params.id)) return res.status(404).json({ error: 'Ese envío no existe.' })
  return run(res, async () => rejectSubmission({ ref: req.params.id, reviewer: await reviewer(req), reason: req.body?.reason, apply: true }))
})

router.post('/folders/:id/approve', requirePermission('folders:review'), async (req, res) => {
  if (!isId(req.params.id)) return res.status(404).json({ error: 'Esa carpeta no existe.' })
  return run(res, async () => approveFolder({ ref: req.params.id, reviewer: await reviewer(req), apply: true }))
})

router.post('/folders/:id/reject', requirePermission('folders:review'), async (req, res) => {
  if (!isId(req.params.id)) return res.status(404).json({ error: 'Esa carpeta no existe.' })
  return run(res, async () => rejectFolder({ ref: req.params.id, reviewer: await reviewer(req), reason: req.body?.reason, apply: true }))
})

router.post('/folders/:id/rename', requirePermission('folders:review'), async (req, res) => {
  if (!isId(req.params.id)) return res.status(404).json({ error: 'Esa carpeta no existe.' })
  return run(res, async () => renameFolder({ ref: req.params.id, reviewer: await reviewer(req), name: req.body?.name, apply: true }))
})

export default router
