// ---------------------------------------------------------------------------
// app.js — builds and configures the Express app, but does NOT start it
// listening on a port and does NOT connect to MongoDB. That split exists
// specifically so tests can import the app and send fake requests directly
// to it (via supertest) without needing a real running server or a real
// database connection managed here.
//
// server.js is the "real" entry point: it imports this app, connects to
// the real database, and actually starts listening.
// ---------------------------------------------------------------------------

import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'

import authRoutes from './routes/auth.routes.js'
import categoriesRoutes from './routes/categories.routes.js'
import problemsRoutes from './routes/problems.routes.js'
import commentsRoutes from './routes/comments.routes.js'
import contactRoutes from './routes/contact.routes.js'
import topicsRoutes from './routes/topics.routes.js'
import tagsRoutes from './routes/tags.routes.js'
import theoryRoutes from './routes/theory.routes.js'
import collectionsRoutes from './routes/collections.routes.js'
import listsRoutes from './routes/lists.routes.js'
import examsRoutes from './routes/exams.routes.js'
import pathsRoutes from './routes/paths.routes.js'
import reportsRoutes from './routes/reports.routes.js'
import submissionsRoutes from './routes/submissions.routes.js'
import flagsRoutes from './routes/flags.routes.js'
import notificationsRoutes from './routes/notifications.routes.js'

const app = express()

// Detrás de un proxy (como el balanceador de Render), cada petición llega
// desde la IP del proxy. TRUST_PROXY_HOPS le dice a Express cuántos proxies
// de confianza hay delante, para que req.ip (y por lo tanto los límites por
// IP de abajo) use la IP real del visitante. Solo se acepta un entero
// positivo: sin la variable, o con un valor inválido, no se confía en ningún
// encabezado X-Forwarded-For. Nunca usamos `true`, que dejaría a cualquiera
// falsificar su IP.
const trustProxyHops = Number(process.env.TRUST_PROXY_HOPS)
if (Number.isInteger(trustProxyHops) && trustProxyHops > 0) {
  app.set('trust proxy', trustProxyHops)
}

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

// Dos niveles de límite, ambos por IP, ambos apagados bajo pruebas
// automatizadas (NODE_ENV=test, que vitest pone solo) para que la suite de
// pruebas no se bloquee a sí misma llamando estas rutas muchas veces seguidas
// a propósito:
//
// 1. Uno GENERAL para toda la API (por si alguien intenta saturar cualquier
//    ruta, no solo login).
// 2. Uno más ESTRICTO solo para /api/auth, porque ahí es donde de verdad
//    importa: sin esto, nada le impide a alguien probar miles de
//    contraseñas por segundo (fuerza bruta). Solo cuentan los intentos
//    fallidos: así un salón entero que entra desde la misma red escolar
//    (misma IP) no se bloquea, y adivinar contraseñas sigue limitado.
if (process.env.NODE_ENV !== 'test') {
  app.use(
    '/api',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'Demasiadas peticiones. Espera unos minutos e intenta de nuevo.' },
    }),
  )

  app.use(
    '/api/auth',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 20,
      skipSuccessfulRequests: true,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'Demasiados intentos. Espera unos minutos e intenta de nuevo.' },
    }),
  )
}

app.use('/api/auth', authRoutes)
app.use('/api/categories', categoriesRoutes)
app.use('/api/problems', problemsRoutes)
app.use('/api/problems/:problemId/comments', commentsRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/topics', topicsRoutes)
app.use('/api/tags', tagsRoutes)
app.use('/api/theory', theoryRoutes)
app.use('/api/collections', collectionsRoutes)
app.use('/api/lists', listsRoutes)
app.use('/api/exams', examsRoutes)
app.use('/api/paths', pathsRoutes)
app.use('/api/reports', reportsRoutes)
app.use('/api/submissions', submissionsRoutes)
app.use('/api/flags', flagsRoutes)
app.use('/api/notifications', notificationsRoutes)

app.use('/api', (_req, res) => res.status(404).json({ error: 'Ese recurso no existe.' }))
app.use((error, _req, res, next) => {
  if (res.headersSent) return next(error)
  const status = error.status === 400 ? 400 : 500
  if (status === 500 && process.env.NODE_ENV !== 'test') console.error('API request failed:', error.name)
  res.status(status).json({ error: status === 400 ? 'La solicitud no es válida.' : 'No fue posible completar la solicitud. Intenta de nuevo.' })
})

export default app
