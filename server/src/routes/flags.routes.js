// ---------------------------------------------------------------------------
// «Reportar un error» on a problem or a theory page.
//
// POST /api/flags                 anyone signed in: { targetType, targetId, message }
// GET  /api/flags?status=open     editors and admins: every flag, oldest first
// POST /api/flags/:id/status      editors and admins: { status: resolved|dismissed, note }
//
// The review script (npm run review -- flags) lists and closes them too.
// ---------------------------------------------------------------------------

import { Router } from 'express'
import mongoose from 'mongoose'
import Flag, { FLAG_MESSAGE_MAX, FLAG_MESSAGE_MIN, FLAG_STATUSES, FLAG_TARGETS } from '../models/Flag.js'
import Problem from '../models/Problem.js'
import Theory from '../models/Theory.js'
import { publishedOrLegacyProblemQuery } from '../models/content.js'
import { requireAuth, requirePermission } from '../middleware/auth.js'
import { listFlags } from '../lib/review/service.js'

const router = Router()
const isId = (value) => typeof value === 'string' && mongoose.isObjectIdOrHexString(value)

router.use(requireAuth)

async function publicTargetExists(targetType, id) {
  if (targetType === 'problem') return Problem.exists({ _id: id, ...publishedOrLegacyProblemQuery() })
  return Theory.exists({ _id: id, publicationStatus: 'published' })
}

router.post('/', requirePermission('flags:create'), async (req, res) => {
  const { targetType, targetId } = req.body ?? {}
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : ''
  if (!FLAG_TARGETS.includes(targetType) || !isId(targetId)) return res.status(400).json({ error: 'No se puede reportar esa página.' })
  if (message.length < FLAG_MESSAGE_MIN) return res.status(400).json({ error: `Describe el error con un poco más de detalle (mínimo ${FLAG_MESSAGE_MIN} caracteres).` })
  if (message.length > FLAG_MESSAGE_MAX) return res.status(400).json({ error: `El reporte no puede pasar de ${FLAG_MESSAGE_MAX} caracteres.` })
  if (!await publicTargetExists(targetType, targetId)) return res.status(404).json({ error: 'Esa página no existe.' })
  try {
    const flag = await Flag.create({ targetType, target: targetId, reporter: req.userId, message })
    res.status(201).json({ _id: flag._id, status: flag.status, createdAt: flag.createdAt })
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ error: 'Ya reportaste un error en esta página. Lo revisaremos pronto.' })
    throw error
  }
})

router.get('/', requirePermission('flags:view'), async (req, res) => {
  const status = req.query.status ?? 'open'
  if (!FLAG_STATUSES.includes(status)) return res.status(400).json({ error: 'Estado de reporte no válido.' })
  res.json(await listFlags(status))
})

router.post('/:id/status', requirePermission('flags:view'), async (req, res) => {
  const { status } = req.body ?? {}
  const note = typeof req.body?.note === 'string' ? req.body.note.trim().slice(0, 500) : null
  if (!['resolved', 'dismissed'].includes(status)) return res.status(400).json({ error: 'Elige resuelto o descartado.' })
  const flag = isId(req.params.id) ? await Flag.findOneAndUpdate({ _id: req.params.id, status: 'open' }, { status, handledBy: req.userId, handledAt: new Date(), handledNote: note || null }, { returnDocument: 'after' }) : null
  if (!flag) return res.status(404).json({ error: 'No hay un reporte abierto con ese identificador.' })
  res.json({ _id: flag._id, status: flag.status })
})

export default router
