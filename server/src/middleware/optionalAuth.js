// Like requireAuth, but never rejects: a valid token sets req.userId and
// req.userRole; no token or a bad one just means "visitor". Used by public
// pages that show more to the owner (Mi Espacio).
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from '../models/User.js'
import { roleOf } from '../lib/permissions.js'

export async function optionalAuth(req, _res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  req.userId = null
  req.userRole = null
  if (!token) return next()
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    if (typeof payload.sub === 'string' && mongoose.isObjectIdOrHexString(payload.sub)) {
      const user = await User.findById(payload.sub).select('role').lean()
      if (user) {
        req.userId = payload.sub
        req.userRole = roleOf(user)
      }
    }
  } catch {
    // An expired or bad token is treated as a visitor.
  }
  next()
}
