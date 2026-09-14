import { Router } from 'express'
import List from '../models/List.js'
import { difficultyOrBadRequest, idsOrBadRequest, paginatedResponse, populatedContent, textSearch, validObjectId } from './library.utils.js'

const router = Router()
const published = { publicationStatus: 'published' }
router.get('/', async (req, res) => {
  const topics = idsOrBadRequest(res, req.query.topics, 'topics')
  const tags = idsOrBadRequest(res, req.query.tags, 'tags')
  const categories = idsOrBadRequest(res, req.query.categories, 'categories')
  if (!topics || !tags || !categories) return
  const level = difficultyOrBadRequest(res, req.query.level, 'level')
  if (level === undefined) return
  const filter = { ...published }
  if (topics.length) filter.topics = { $in: topics }
  if (tags.length) filter.tags = { $in: tags }
  if (categories.length) filter.categories = { $in: categories }
  if (level) filter.level = level
  if (req.query.q) filter.$or = [{ title: textSearch(req.query.q) }, { summary: textSearch(req.query.q) }, { sourceOrganization: textSearch(req.query.q) }]
  await paginatedResponse({ req, res, model: List, filter })
})
router.get('/:id', async (req, res) => {
  if (!validObjectId(req.params.id)) return res.status(400).json({ error: 'Identificador de lista inválido.' })
  const item = await populatedContent(List.findOne({ _id: req.params.id, ...published })).lean()
  if (!item) return res.status(404).json({ error: 'Esa lista no existe o no está publicada.' })
  res.json(item)
})
export default router
