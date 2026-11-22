// GET    /api/problems/:problemId/comments             — list comments as ordered threads.
// POST   /api/problems/:problemId/comments             — add one or reply with `parent` (needs login).
// DELETE /api/problems/:problemId/comments/:commentId  — soft delete: author, or moderator with a reason.
// POST   /api/problems/:problemId/comments/:commentId/reports — report someone else's comment (needs login).
//
// This file doesn't know its own full URL — `:problemId` is filled in by
// wherever server.js decides to mount this router (see server.js). Router({
// mergeParams: true }) is what lets this file read req.params.problemId even
// though the ":problemId" part of the URL is defined one level up.

import { Router } from 'express'
import mongoose from 'mongoose'
import Comment from '../models/Comment.js'
import Report from '../models/Report.js'
import Problem from '../models/Problem.js'
import { publishedOrLegacyProblemQuery } from '../models/content.js'
import { requireAuth, requirePermission } from '../middleware/auth.js'
import { can } from '../lib/permissions.js'
import { MAX_COMMENT_DEPTH, parseReason } from '../lib/moderation.js'
import { orderCommentThread, publicComment } from '../lib/commentThread.js'

const isId = (value) => typeof value === 'string' && mongoose.isObjectIdOrHexString(value)

const router = Router({ mergeParams: true })

// Público: cualquiera puede LEER los comentarios, con o sin sesión iniciada.
router.get('/', async (req, res) => {
  if (!isId(req.params.problemId)) return res.status(404).json({ error: 'Ese problema no existe.' })
  const comments = await Comment.find({ problem: req.params.problemId })
    .populate('author', 'username role avatar avatarColor') // reemplaza el ObjectId del autor por { _id, username, role }
    .lean()

  // Hilos en orden de llegada, cada respuesta debajo de su padre, con la
  // profundidad lista para sangrar. Los eliminados quedan sin texto ni autor.
  res.json(orderCommentThread(comments).map(({ comment, depth }) => publicComment(comment, depth)))
})

// Protegido: requireAuth corre ANTES que esta función. Si no hay sesión
// válida, requireAuth ya respondió 401 y esta línea nunca se ejecuta.
router.post('/', requireAuth, requirePermission('comments:create'), async (req, res) => {
  const body = (typeof req.body.body === 'string' ? req.body.body : '').trim()
  if (!body) {
    return res.status(400).json({ error: 'El comentario no puede estar vacío.' })
  }

  const { problemId } = req.params
  // Solo problemas públicos: un envío en revisión o borrado no recibe comentarios.
  if (!isId(problemId) || !await Problem.exists({ _id: problemId, ...publishedOrLegacyProblemQuery() })) {
    return res.status(404).json({ error: 'Ese problema no existe.' })
  }

  // Respuesta: `parent` es el comentario al que se responde. Debe ser del
  // mismo problema y no estar eliminado. La profundidad no pasa de
  // MAX_COMMENT_DEPTH: responder a un comentario de nivel 3 queda en nivel 3.
  let reply = {}
  if (req.body.parent != null) {
    const parent = isId(req.body.parent)
      ? await Comment.findOne({ _id: req.body.parent, problem: problemId }).select('depth root status').lean()
      : null
    if (!parent) return res.status(404).json({ error: 'Ese comentario no existe.' })
    if (parent.status === 'deleted') return res.status(409).json({ error: 'No puedes responder a un comentario eliminado.' })
    reply = { parent: parent._id, root: parent.root ?? parent._id, depth: Math.min((parent.depth ?? 0) + 1, MAX_COMMENT_DEPTH) }
  }

  try {
    const comment = await Comment.create({
      problem: problemId,
      author: req.userId, // puesto por requireAuth después de verificar el token
      body,
      ...reply,
    })

    // Antes de responder, llenamos el campo author con { _id, username } en
    // vez de dejarlo como un ObjectId — así el frontend puede mostrar el
    // nombre del autor de inmediato, sin pedirlo aparte.
    await comment.populate('author', 'username role avatar avatarColor')

    res.status(201).json(publicComment(comment.toObject(), comment.depth))
  } catch (err) {
    // Mongoose lanza un ValidationError si, por ejemplo, el comentario
    // pasa del límite de 2000 caracteres del modelo. Sin este catch, ese
    // error se iría como un 500 genérico en vez de un 400 explicando qué
    // salió mal.
    if (err.name === 'ValidationError') {
      const mensaje = Object.values(err.errors)
        .map((e) => e.message)
        .join(' ')
      return res.status(400).json({ error: mensaje })
    }
    res.status(500).json({ error: 'No se pudo guardar el comentario.' })
  }
})

// Eliminación SUAVE: el comentario se queda en la base (con quién, cuándo y
// por qué) y el hilo muestra «eliminado» en su lugar; sus respuestas siguen
// visibles. Puede eliminarlo su autor (sin motivo) o alguien con permiso de
// moderar (con motivo obligatorio; «otro» exige una nota).
router.delete('/:commentId', requireAuth, async (req, res) => {
  const { problemId, commentId } = req.params
  const comment = isId(commentId) ? await Comment.findById(commentId) : null

  // Si no existe, o existe pero es de OTRO problema, tratamos ambos casos
  // igual (404) -- no hay razón para distinguirlos desde afuera.
  if (!comment || comment.problem.toString() !== problemId) {
    return res.status(404).json({ error: 'Ese comentario no existe.' })
  }
  if (comment.status === 'deleted') {
    return res.status(409).json({ error: 'Ese comentario ya fue eliminado.' })
  }

  const isAuthor = comment.author.toString() === req.userId
  if (isAuthor) {
    comment.set({ deletedAs: 'autor', deletedReason: null, deletedReasonNote: null })
  } else if (can({ role: req.userRole }, 'comments:moderate')) {
    const parsed = parseReason(req.body)
    if (parsed.error) return res.status(400).json({ error: parsed.error })
    comment.set({ deletedAs: 'moderacion', deletedReason: parsed.reason, deletedReasonNote: parsed.note })
  } else {
    return res.status(403).json({ error: 'Solo puedes eliminar tus propios comentarios.' })
  }

  const now = new Date()
  comment.set({ status: 'deleted', deletedBy: req.userId, deletedAt: now })
  await comment.save()
  // Los reportes abiertos de este comentario quedan resueltos.
  await Report.updateMany({ comment: comment._id, status: 'open' }, { status: 'resolved', handledBy: req.userId, handledAt: now })
  res.json(publicComment(comment.toObject(), comment.depth))
})

// Reportar un comentario ajeno para que la moderación lo revise. Cada persona
// reporta un comentario una sola vez. La respuesta no revela otros reportes.
router.post('/:commentId/reports', requireAuth, requirePermission('comments:report'), async (req, res) => {
  const { problemId, commentId } = req.params
  const comment = isId(commentId) ? await Comment.findOne({ _id: commentId, problem: problemId }).select('author status').lean() : null
  if (!comment) return res.status(404).json({ error: 'Ese comentario no existe.' })
  if (comment.status === 'deleted') return res.status(409).json({ error: 'Ese comentario ya fue eliminado.' })
  if (comment.author.toString() === req.userId) return res.status(400).json({ error: 'No puedes reportar tu propio comentario.' })

  const parsed = parseReason(req.body)
  if (parsed.error) return res.status(400).json({ error: parsed.error })

  try {
    await Report.create({ comment: comment._id, problem: problemId, reporter: req.userId, reason: parsed.reason, note: parsed.note })
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Ya reportaste este comentario.' })
    throw err
  }
  res.status(201).json({ ok: true })
})

export default router
