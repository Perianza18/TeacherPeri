// GET  /api/reports?status=open                     — moderation queue, grouped by comment (moderador+).
// POST /api/reports/comments/:commentId/dismiss     — dismiss a comment's open reports (moderador+).
//
// Reports are created from the comment itself:
// POST /api/problems/:problemId/comments/:commentId/reports (see comments.routes.js).
// Deleting a comment resolves its open reports automatically.

import { Router } from 'express'
import mongoose from 'mongoose'
import Report from '../models/Report.js'
import Comment from '../models/Comment.js'
import Problem from '../models/Problem.js'
import { requireAuth, requirePermission } from '../middleware/auth.js'

const router = Router()
const STATUSES = ['open', 'resolved', 'dismissed']
const QUEUE_LIMIT = 500

router.use(requireAuth, requirePermission('comments:moderate'))

router.get('/', async (req, res) => {
  const status = req.query.status ?? 'open'
  if (!STATUSES.includes(status)) return res.status(400).json({ error: 'Estado de reporte no válido.' })

  const reports = await Report.find({ status })
    .sort({ createdAt: 1 })
    .limit(QUEUE_LIMIT)
    .populate('reporter', 'username')
    .lean()

  const commentIds = [...new Set(reports.map((r) => String(r.comment)))]
  const comments = await Comment.find({ _id: { $in: commentIds } }).populate('author', 'username role').lean()
  const problems = await Problem.find({ _id: { $in: [...new Set(comments.map((c) => String(c.problem)))] } }).select('titulo codigo').lean()
  const commentById = new Map(comments.map((c) => [String(c._id), c]))
  const problemById = new Map(problems.map((p) => [String(p._id), p]))

  const groups = new Map()
  for (const report of reports) {
    const id = String(report.comment)
    const comment = commentById.get(id)
    if (!comment) continue
    if (!groups.has(id)) {
      const problem = problemById.get(String(comment.problem))
      groups.set(id, {
        comment: {
          _id: comment._id,
          body: comment.body,
          status: comment.status ?? 'visible',
          createdAt: comment.createdAt,
          author: comment.author ? { _id: comment.author._id, username: comment.author.username, role: comment.author.role ?? 'usuario' } : null,
        },
        problem: problem ? { _id: problem._id, titulo: problem.titulo, codigo: problem.codigo } : { _id: comment.problem },
        reports: [],
        firstReportedAt: report.createdAt,
      })
    }
    groups.get(id).reports.push({
      _id: report._id,
      reason: report.reason,
      note: report.note,
      reporter: report.reporter ? { _id: report.reporter._id, username: report.reporter.username } : null,
      createdAt: report.createdAt,
    })
  }

  const queue = [...groups.values()]
    .map((group) => ({ ...group, count: group.reports.length }))
    .sort((a, b) => b.count - a.count || new Date(a.firstReportedAt) - new Date(b.firstReportedAt))
  res.json(queue)
})

router.post('/comments/:commentId/dismiss', async (req, res) => {
  const { commentId } = req.params
  if (!mongoose.isObjectIdOrHexString(commentId)) return res.status(404).json({ error: 'No hay reportes abiertos de ese comentario.' })
  const result = await Report.updateMany(
    { comment: commentId, status: 'open' },
    { status: 'dismissed', handledBy: req.userId, handledAt: new Date() },
  )
  if (result.modifiedCount === 0) return res.status(404).json({ error: 'No hay reportes abiertos de ese comentario.' })
  res.json({ dismissed: result.modifiedCount })
})

export default router
