import { Router } from 'express'
import Comment from '../models/Comment.js'
import Problem from '../models/Problem.js'
import ProblemCollection, { COLLECTION_SLUG } from '../models/ProblemCollection.js'
import { publishedOrLegacyProblemQuery } from '../models/content.js'

// GET /api/collections/:slug — every published box of a lesson in one
// request: { slug, collections: { ejercicios?, practice?, dificiles? } }.
// Each list keeps the collection's order and holds only public problems,
// with what a box row shows (statement, hint, level, comment count). Never
// the title or the solution.
const router = Router()
const ROW_FIELDS = '_id codigo enunciado hint difficulty'
const CODE = /^[A-Z0-9][A-Z0-9-]{0,19}$/
const MAX_CODES = 20

async function withCommentCounts(problems) {
  const counts = await Comment.aggregate([
    { $match: { problem: { $in: problems.map((p) => p._id) }, status: { $ne: 'deleted' } } },
    { $group: { _id: '$problem', count: { $sum: 1 } } },
  ])
  const commentCount = new Map(counts.map((entry) => [String(entry._id), entry.count]))
  return problems.map((problem) => ({ ...problem, commentCount: commentCount.get(String(problem._id)) ?? 0 }))
}

// GET /api/collections?codes=TP-A01,TP-G08 — the problems of a
// `[[problems:<códigos>:<kind>]]` box, in the order written. Codes that are
// not public are left out. Same row fields as a collection.
router.get('/', async (req, res) => {
  const codes = String(req.query.codes || '').split(',').map((code) => code.trim().toUpperCase()).filter(Boolean)
  if (!codes.length || codes.length > MAX_CODES || !codes.every((code) => CODE.test(code))) return res.status(400).json({ error: 'Lista de códigos inválida.' })
  const problems = await Problem.find({ codigo: { $in: codes }, ...publishedOrLegacyProblemQuery() }).select(ROW_FIELDS).lean()
  const byCode = new Map(problems.map((problem) => [problem.codigo, problem]))
  res.json({ codes, problems: await withCommentCounts([...new Set(codes)].map((code) => byCode.get(code)).filter(Boolean)) })
})

router.get('/:slug', async (req, res) => {
  const { slug } = req.params
  if (!COLLECTION_SLUG.test(slug)) return res.status(400).json({ error: 'Identificador de colección inválido.' })
  const collections = await ProblemCollection.find({ slug, publicationStatus: 'published' }).lean()
  if (!collections.length) return res.status(404).json({ error: 'Esa colección no existe o no está publicada.' })

  const ids = collections.flatMap((collection) => collection.problems.map((entry) => entry.problem))
  const [problems, counts] = await Promise.all([
    Problem.find({ _id: { $in: ids }, ...publishedOrLegacyProblemQuery() }).select(ROW_FIELDS).lean(),
    // Same count as the comments list: every comment that is not deleted.
    Comment.aggregate([
      { $match: { problem: { $in: ids }, status: { $ne: 'deleted' } } },
      { $group: { _id: '$problem', count: { $sum: 1 } } },
    ]),
  ])
  const byId = new Map(problems.map((problem) => [String(problem._id), problem]))
  const commentCount = new Map(counts.map((entry) => [String(entry._id), entry.count]))

  const result = {}
  for (const collection of collections) {
    result[collection.kind] = [...collection.problems]
      .sort((a, b) => a.position - b.position)
      .map((entry) => byId.get(String(entry.problem)))
      .filter(Boolean)
      .map((problem) => ({ ...problem, commentCount: commentCount.get(String(problem._id)) ?? 0 }))
  }
  res.json({ slug, collections: result })
})

export default router
