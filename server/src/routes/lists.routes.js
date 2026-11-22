import { Router } from 'express'
import List from '../models/List.js'
import { descendantCategoryIds, populatedProblems, difficultyOrBadRequest, idsOrBadRequest, paginatedResponse, populatedContent, textSearch, validObjectId } from './library.utils.js'

const router = Router()
const published = { publicationStatus: 'published' }
// ?source=teacherperi: lists made by TeacherPeri. ?source=external: links to
// other publishers (OMM, IMO, NRICH). Entrenamiento shows each in its own tab.
const TEACHERPERI = 'TeacherPeri'
const SOURCES = {
  teacherperi: { $or: [{ sourceOrganization: TEACHERPERI }, { sourceOrganization: { $exists: false } }, { sourceOrganization: '' }] },
  external: { sourceOrganization: { $exists: true, $nin: [TEACHERPERI, ''] } },
}
router.get('/', async (req, res) => {
  const source = req.query.source
  if (source !== undefined && !SOURCES[source]) return res.status(400).json({ error: 'El filtro source es inválido.' })
  const topics = idsOrBadRequest(res, req.query.topics, 'topics')
  const tags = idsOrBadRequest(res, req.query.tags, 'tags')
  const categoryFilter = idsOrBadRequest(res, req.query.categories, 'categories')
  const categories = categoryFilter ? await descendantCategoryIds(categoryFilter) : null
  if (!topics || !tags || !categories) return
  const level = difficultyOrBadRequest(res, req.query.level, 'level')
  if (level === undefined) return
  const filter = { ...published }
  if (topics.length) filter.topics = { $in: topics }
  if (tags.length) filter.tags = { $in: tags }
  if (categories.length) filter.categories = { $in: categories }
  if (level) filter.level = level
  if (req.query.q) filter.$or = [{ title: textSearch(req.query.q) }, { summary: textSearch(req.query.q) }, { sourceOrganization: textSearch(req.query.q) }]
  if (source) filter.$and = [SOURCES[source]]
  await paginatedResponse({ req, res, model: List, filter })
})
router.get('/:id', async (req, res) => {
  if (!validObjectId(req.params.id)) return res.status(400).json({ error: 'Identificador de lista inválido.' })
  const item = await populatedProblems(populatedContent(List.findOne({ _id: req.params.id, ...published }))).lean()
  if (!item) return res.status(404).json({ error: 'Esa lista no existe o no está publicada.' })
  res.json(item)
})
export default router
