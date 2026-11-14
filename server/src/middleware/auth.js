// ---------------------------------------------------------------------------
// requireAuth — an Express "middleware": a function that runs BEFORE a route
// handler, and can either let the request continue (by calling next()) or
// stop it short (by sending a response itself, like the 401s below).
//
// SKELETON of what any Express middleware looks like:
//
//   function algunMiddleware(req, res, next) {
//     if (condicionOk) {
//       next()              // <- sigue hacia la ruta real
//     } else {
//       res.status(400).json({ error: '...' })   // <- corta aquí, la ruta real nunca corre
//     }
//   }
//
// We attach this to any route that should be blocked for logged-out
// visitors — in this project, that's only "post a comment".
// ---------------------------------------------------------------------------

import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from '../models/User.js'
import { can, roleOf } from '../lib/permissions.js'

export async function requireAuth(req, res, next) {
  // El navegador manda el token en un encabezado HTTP así:
  //   Authorization: Bearer eyJhbGciOiJI...
  // Lo separamos de la palabra "Bearer " para quedarnos solo con el token.
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'Necesitas iniciar sesión para hacer esto.' })
  }

  try {
    // jwt.verify hace dos cosas a la vez: confirma que el token fue firmado
    // con nuestro JWT_SECRET (o sea, que lo emitimos nosotros y nadie lo
    // inventó) y que no ha expirado. Si algo falla, lanza un error.
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    // Guardamos el id y el rol del usuario en `req` para que la ruta que
    // sigue (ej. crear un comentario) sepa quién hace la petición y qué puede
    // hacer. El rol se lee de la base de datos en cada petición, no del token:
    // si un admin cambia el rol de alguien, el cambio aplica de inmediato.
    if (typeof payload.sub !== 'string' || !mongoose.isObjectIdOrHexString(payload.sub)) return res.status(401).json({ error: 'Tu sesión no es válida o ya expiró.' })
    const user = await User.findById(payload.sub).select('role').lean()
    if (!user) return res.status(401).json({ error: 'Tu sesión no es válida o ya expiró.' })
    req.userId = payload.sub
    req.userRole = roleOf(user)
    next()
  } catch {
    return res.status(401).json({ error: 'Tu sesión no es válida o ya expiró.' })
  }
}

// Se usa DESPUÉS de requireAuth: corta con 403 si el rol de la persona no
// incluye el permiso pedido (ver PERMISSIONS en lib/permissions.js).
//
//   router.delete('/:id', requireAuth, requirePermission('comments:moderate'), ...)
export function requirePermission(permission) {
  return (req, res, next) => {
    if (!can({ role: req.userRole }, permission)) {
      return res.status(403).json({ error: 'No tienes permiso para hacer esto.' })
    }
    next()
  }
}
