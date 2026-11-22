import { Router } from 'express'
import Theory from '../models/Theory.js'
import { descendantCategoryIds, areaCondition, areaOrBadRequest, descendantTopicIds, difficultyOrBadRequest, idsOrBadRequest, keywordConditions, paginatedResponse, populatedContent, validObjectId } from './library.utils.js'

const router = Router()
const published = { publicationStatus: 'published' }

router.get('/', async (req, res) => {
  const topics = idsOrBadRequest(res, req.query.topics, 'topics')
  const tags = idsOrBadRequest(res, req.query.tags, 'tags')
  const categoryFilter = idsOrBadRequest(res, req.query.categories, 'categories')
  const categories = categoryFilter ? await descendantCategoryIds(categoryFilter) : null
  if (!topics || !tags || !categories) return
  const level = difficultyOrBadRequest(res, req.query.level, 'level')
  if (level === undefined) return
  const area = areaOrBadRequest(res, req.query.area)
  if (area === null) return
  const filter = { ...published }
  if (topics.length) filter.topics = { $in: await descendantTopicIds(topics) }
  if (tags.length) filter.tags = { $in: tags }
  if (categories.length) filter.categories = { $in: categories }
  if (level) filter.level = level
  filter.$and = [
    ...(area ? [await areaCondition(area)] : []),
    ...(req.query.q ? await keywordConditions(req.query.q, ['title', 'summary']) : []),
  ]
  if (!filter.$and.length) delete filter.$and
  await paginatedResponse({ req, res, model: Theory, filter })
})

router.get('/:id', async (req, res) => {
  if (!validObjectId(req.params.id)) return res.status(400).json({ error: 'Identificador de teoría inválido.' })
  const item = await populatedContent(Theory.findOne({ _id: req.params.id, ...published })).lean()
  if (!item) return res.status(404).json({ error: 'Esa teoría no existe o no está publicada.' })
  res.json(item)
})
export default router
