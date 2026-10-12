import { Router } from 'express'
import { trainingContextFilter } from '../models/trainingContext.js'
import Problem from '../models/Problem.js'
import { publishedOrLegacyProblemQuery } from '../models/content.js'
import { descendantCategoryIds, difficultyOrBadRequest, idsOrBadRequest, paginatedResponse, populatedContent, textSearch, validObjectId } from './library.utils.js'

const router = Router()

async function problemFilter(req, res) {
  const topics = idsOrBadRequest(res, req.query.topics, 'topics')
  const tags = idsOrBadRequest(res, req.query.tags, 'tags')
  const categoryFilter = idsOrBadRequest(res, req.query.categories, 'categories')
  const categories = categoryFilter ? await descendantCategoryIds(categoryFilter) : null
  if (!topics || !tags || !categories) return null
  const difficulty = difficultyOrBadRequest(res, req.query.difficulty)
  if (difficulty === undefined) return null
  let context
  try { context = trainingContextFilter(req.query) } catch (error) { res.status(400).json({ error: error.message }); return null }
  const filter = { ...publishedOrLegacyProblemQuery(), ...context }
  if (topics.length) filter.topics = { $in: topics }
  if (tags.length) filter.tags = { $in: tags }
  if (categories.length) filter.$and = [{ $or: [{ categories: { $in: categories } }, { category: { $in: categories } }] }]
  if (req.query.year) filter.año = { $in: String(req.query.year).split(',') }
  if (req.query.subject) filter.tema = { $in: String(req.query.subject).split(',') }
  if (req.query.type) filter.tipo = { $in: String(req.query.type).split(',') }
  if (req.query.competition) filter.competition = textSearch(req.query.competition)
  if (difficulty) filter.difficulty = difficulty
  if (req.query.q) {
    const search = textSearch(req.query.q)
    filter.$and = [...(filter.$and || []), { $or: [{ codigo: search }, { titulo: search }, { enunciado: search }, { competition: search }, { tema: search }] }]
  }
  return filter
}

router.get('/', async (req, res) => {
  const filter = await problemFilter(req, res)
  if (!filter) return
  // The legacy client expects an array. New callers opt into pagination by
  // supplying any discovery query parameter.
  if (Object.keys(req.query).length === 0) return res.json(await Problem.find(filter).sort({ createdAt: -1 }))
  await paginatedResponse({ req, res, model: Problem, filter })
})

router.get('/facets', async (_req, res) => {
  const filter = publishedOrLegacyProblemQuery()
  const [years, subjects, types] = await Promise.all(['año', 'tema', 'tipo'].map((field) => Problem.distinct(field, filter)))
  res.json({ years: years.sort().reverse(), subjects: subjects.sort(), types: types.sort() })
})

router.get('/:id', async (req, res) => {
  if (!validObjectId(req.params.id)) return res.status(400).json({ error: 'Identificador de problema inválido.' })
  const problem = await populatedContent(Problem.findOne({ _id: req.params.id, ...publishedOrLegacyProblemQuery() })).lean()
  if (!problem) return res.status(404).json({ error: 'Ese problema no existe o no está publicado.' })
  res.json(problem)
})

export default router
