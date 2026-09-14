import { Router } from 'express'
import Problem from '../models/Problem.js'
import { publishedOrLegacyProblemQuery } from '../models/content.js'
import { difficultyOrBadRequest, idsOrBadRequest, paginatedResponse, populatedContent, textSearch, validObjectId } from './library.utils.js'

const router = Router()

function problemFilter(req, res) {
  const topics = idsOrBadRequest(res, req.query.topics, 'topics')
  const tags = idsOrBadRequest(res, req.query.tags, 'tags')
  const categories = idsOrBadRequest(res, req.query.categories, 'categories')
  if (!topics || !tags || !categories) return null
  const difficulty = difficultyOrBadRequest(res, req.query.difficulty)
  if (difficulty === undefined) return null
  const filter = publishedOrLegacyProblemQuery()
  if (topics.length) filter.topics = { $in: topics }
  if (tags.length) filter.tags = { $in: tags }
  if (categories.length) filter.$and = [{ $or: [{ categories: { $in: categories } }, { category: { $in: categories } }] }]
  if (req.query.year) filter.año = req.query.year
  if (req.query.competition) filter.competition = textSearch(req.query.competition)
  if (difficulty) filter.difficulty = difficulty
  if (req.query.q) {
    const search = textSearch(req.query.q)
    filter.$and = [...(filter.$and || []), { $or: [{ codigo: search }, { titulo: search }, { competition: search }, { tema: search }] }]
  }
  return filter
}

router.get('/', async (req, res) => {
  const filter = problemFilter(req, res)
  if (!filter) return
  // The legacy client expects an array. New callers opt into pagination by
  // supplying any discovery query parameter.
  if (Object.keys(req.query).length === 0) return res.json(await Problem.find(filter).sort({ createdAt: -1 }))
  await paginatedResponse({ req, res, model: Problem, filter })
})

router.get('/:id', async (req, res) => {
  if (!validObjectId(req.params.id)) return res.status(400).json({ error: 'Identificador de problema inválido.' })
  const problem = await populatedContent(Problem.findOne({ _id: req.params.id, ...publishedOrLegacyProblemQuery() })).lean()
  if (!problem) return res.status(404).json({ error: 'Ese problema no existe o no está publicado.' })
  res.json(problem)
})

export default router
