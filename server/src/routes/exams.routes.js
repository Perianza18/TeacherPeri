import { publishedOrLegacyProblemQuery } from '../models/content.js'
import { Router } from 'express'
import Exam from '../models/Exam.js'
import { descendantCategoryIds, idsOrBadRequest, paginatedResponse, textSearch, validObjectId } from './library.utils.js'

const router = Router()
const published = { publicationStatus: 'published' }
router.get('/', async (req, res) => {
  const tags = idsOrBadRequest(res, req.query.tags, 'tags')
  const categoryFilter = idsOrBadRequest(res, req.query.categories, 'categories')
  const categories = categoryFilter ? await descendantCategoryIds(categoryFilter) : null
  if (!tags || !categories) return
  const filter = { ...published }
  if (tags.length) filter.tags = { $in: tags }
  if (categories.length) filter.categories = { $in: categories }
  if (req.query.competition) filter.competition = textSearch(req.query.competition)
  if (req.query.year) filter.year = req.query.year
  if (req.query.q) filter.$or = [{ competition: textSearch(req.query.q) }, { round: textSearch(req.query.q) }, { organization: textSearch(req.query.q) }]
  await paginatedResponse({
    req,
    res,
    model: Exam,
    filter,
    sort: { year: -1, competition: 1, round: 1 },
    populate: (query) => query.populate('tags', 'name slug label').populate('categories', 'name parent'),
  })
})
router.get('/:id', async (req, res) => {
  if (!validObjectId(req.params.id)) return res.status(400).json({ error: 'Identificador de examen inválido.' })
  const item = await Exam.findOne({ _id: req.params.id, ...published })
    .populate('tags', 'name slug label')
    .populate('categories', 'name parent')
    .populate({ path: 'problems.problem', match: publishedOrLegacyProblemQuery(), select: 'codigo titulo enunciado difficulty dificultad sourceAttribution' })
    .lean()
  if (!item) return res.status(404).json({ error: 'Ese examen no existe o no está publicado.' })
  item.problems.sort((a, b) => a.position - b.position)
  res.json(item)
})
export default router
