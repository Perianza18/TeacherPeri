// ---------------------------------------------------------------------------
// «Sugerir un cambio» on a problem or a theory page: a content correction
// (wrong answer, typo, missing case). Stored as a Flag; every Flag is a
// suggestion, including the ones sent before as «Reportar un error».
// Inappropriate content goes to /api/reports/content instead (Moderación).
//
// POST /api/flags                 anyone signed in: { targetType, targetId, message }
// GET  /api/flags?status=open     editors and admins (Revisión): every suggestion, oldest first
// POST /api/flags/:id/status      editors and admins: { status: resolved («Aplicada») | dismissed, note }
//
// Closing one is recorded in «Cambios de editores» (server/src/lib/activity.js).
// The review script (npm run review -- flags) lists and closes them too.
// ---------------------------------------------------------------------------

import { Router } from 'express'
import mongoose from 'mongoose'
import Flag, { FLAG_MESSAGE_MAX, FLAG_MESSAGE_MIN, FLAG_STATUSES, FLAG_TARGETS } from '../models/Flag.js'
import Problem from '../models/Problem.js'
import Theory from '../models/Theory.js'
import User from '../models/User.js'
import { publishedOrLegacyProblemQuery } from '../models/content.js'
import { requireAuth, requirePermission } from '../middleware/auth.js'
import { ReviewError, listFlags, setFlagStatus } from '../lib/review/service.js'

const router = Router()
const isId = (value) => typeof value === 'string' && mongoose.isObjectIdOrHexString(value)

router.use(requireAuth)

async function publicTargetExists(targetType, id) {
  if (targetType === 'problem') return Problem.exists({ _id: id, ...publishedOrLegacyProblemQuery() })
  return Theory.exists({ _id: id, publicationStatus: 'published' })
}

router.post('/', requirePermission('suggestions:create'), async (req, res) => {
  const { targetType, targetId } = req.body ?? {}
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : ''
  if (!FLAG_TARGETS.includes(targetType) || !isId(targetId)) return res.status(400).json({ error: 'No se puede sugerir un cambio en esa página.' })
  if (message.length < FLAG_MESSAGE_MIN) return res.status(400).json({ error: `Describe el cambio con un poco más de detalle (mínimo ${FLAG_MESSAGE_MIN} caracteres).` })
  if (message.length > FLAG_MESSAGE_MAX) return res.status(400).json({ error: `La sugerencia no puede pasar de ${FLAG_MESSAGE_MAX} caracteres.` })
  if (!await publicTargetExists(targetType, targetId)) return res.status(404).json({ error: 'Esa página no existe.' })
  try {
    const flag = await Flag.create({ targetType, target: targetId, reporter: req.userId, message })
    res.status(201).json({ _id: flag._id, status: flag.status, createdAt: flag.createdAt })
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ error: 'Ya enviaste una sugerencia para esta página. La revisaremos pronto.' })
    throw error
  }
})

router.get('/', requirePermission('suggestions:review'), async (req, res) => {
  const status = req.query.status ?? 'open'
  if (!FLAG_STATUSES.includes(status)) return res.status(400).json({ error: 'Estado de reporte no válido.' })
  res.json(await listFlags(status))
})

router.post('/:id/status', requirePermission('suggestions:review'), async (req, res) => {
  const { status } = req.body ?? {}
  const note = typeof req.body?.note === 'string' ? req.body.note : ''
  if (!['resolved', 'dismissed'].includes(status)) return res.status(400).json({ error: 'Elige «Aplicada» o «Descartar».' })
  if (!isId(req.params.id)) return res.status(404).json({ error: 'Esa sugerencia ya no está abierta. Recarga la página.' })
  const reviewer = await User.findById(req.userId).select('username role').lean()
  try {
    await setFlagStatus({ ref: req.params.id, status, note, reviewer, apply: true })
  } catch (error) {
    if (error instanceof ReviewError) return res.status(404).json({ error: 'Esa sugerencia ya no está abierta. Recarga la página.' })
    throw error
  }
  res.json({ _id: req.params.id, status })
})

export default router
