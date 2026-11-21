// ---------------------------------------------------------------------------
// Admins name editors from the site.
//
// GET /api/users?q=texto       admin: accounts (username, email, role), newest first
// PUT /api/users/:id/role      admin: { role: 'user' | 'editor' }
//
// Nobody becomes admin from the site (only `npm run users:set-role` does that).
// An admin may move another admin to editor or user, but never the last one.
// ---------------------------------------------------------------------------

import { Router } from 'express'
import mongoose from 'mongoose'
import User from '../models/User.js'
import { requireAuth, requirePermission } from '../middleware/auth.js'
import { canAssignRole, LEGACY_ROLES, roleOf } from '../lib/permissions.js'

const router = Router()
const isId = (value) => typeof value === 'string' && mongoose.isObjectIdOrHexString(value)
const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
// Stored values that mean admin (the old `teacherperi` too).
const ADMIN_VALUES = ['admin', ...Object.entries(LEGACY_ROLES).filter(([, role]) => role === 'admin').map(([value]) => value)]

router.use(requireAuth, requirePermission('roles:assign-editor'))

const view = (user) => ({ _id: user._id, username: user.username, email: user.email, role: roleOf(user), createdAt: user.createdAt })

router.get('/', async (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 80) : ''
  const filter = q ? { $or: [{ username: new RegExp(escape(q), 'i') }, { email: new RegExp(escape(q), 'i') }] } : {}
  const users = await User.find(filter).sort({ createdAt: -1 }).limit(100).select('username email role createdAt').lean()
  res.json(users.map(view))
})

router.put('/:id/role', async (req, res) => {
  const role = req.body?.role
  if (!canAssignRole({ role: req.userRole }, role)) return res.status(400).json({ error: 'Desde el sitio solo se puede dar el rol de Editor o regresar a Usuario.' })
  const user = isId(req.params.id) ? await User.findById(req.params.id) : null
  if (!user) return res.status(404).json({ error: 'Esa cuenta no existe.' })
  if (roleOf(user) === role) return res.status(400).json({ error: 'La cuenta ya tiene ese rol.' })
  if (roleOf(user) === 'admin') {
    const others = await User.countDocuments({ _id: { $ne: user._id }, role: { $in: ADMIN_VALUES } })
    if (others === 0) return res.status(409).json({ error: 'Es la última cuenta admin; no se le puede quitar el rol.' })
  }
  user.role = role
  await user.save()
  res.json(view(user.toObject()))
})

export default router
