import { Router } from 'express'
import Topic from '../models/Topic.js'
import Problem from '../models/Problem.js'
import Theory from '../models/Theory.js'
import List from '../models/List.js'
import { publishedOrLegacyProblemQuery } from '../models/content.js'
import { LIST_SOURCES } from './library.utils.js'

const router = Router()

router.get('/', async (req, res) => {
  res.json(await Topic.find().sort({ name: 1 }).lean())
})

// How many published items each topic has in one library, counting its
// subtopics: the área tree shows these numbers and hides empty subtopics.
// GET /api/topics/counts?library=problems|theory|lists[&source=teacherperi|external]
const LIBRARIES = {
  problems: { model: Problem, base: () => publishedOrLegacyProblemQuery() },
  theory: { model: Theory, base: () => ({ publicationStatus: 'published' }) },
  lists: { model: List, base: () => ({ publicationStatus: 'published' }) },
}
router.get('/counts', async (req, res) => {
  const library = LIBRARIES[req.query.library]
  if (!library) return res.status(400).json({ error: 'El parámetro library es inválido.' })
  const source = req.query.source
  if (source !== undefined && (req.query.library !== 'lists' || !LIST_SOURCES[source])) return res.status(400).json({ error: 'El parámetro source es inválido.' })
  const topics = await Topic.find().select('_id parent').lean()
  const children = new Map()
  for (const topic of topics) if (topic.parent) children.set(String(topic.parent), [...(children.get(String(topic.parent)) || []), topic._id])
  const subtree = (id) => [id, ...(children.get(String(id)) || []).flatMap(subtree)]
  const base = { ...library.base(), ...(source ? { $and: [LIST_SOURCES[source]] } : {}) }
  const counts = await Promise.all(topics.map((topic) => library.model.countDocuments({ ...base, topics: { $in: subtree(topic._id) } })))
  res.json(Object.fromEntries(topics.map((topic, index) => [String(topic._id), counts[index]])))
})

export default router
