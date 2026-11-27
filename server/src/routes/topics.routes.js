import { Router } from 'express'
import Topic, { publicTopicQuery } from '../models/Topic.js'
import { topicView } from '../lib/topics.js'
import Problem from '../models/Problem.js'
import { EXERCISE_CODES } from '../data/exerciseLists.js'
import Theory from '../models/Theory.js'
import List from '../models/List.js'
import { publishedOrLegacyProblemQuery } from '../models/content.js'
import { LIST_SOURCES, areaCondition } from './library.utils.js'

const router = Router()
// The four áreas always get a count, even in a database without Topics.
const AREA_NAMES = ['Geometría', 'Álgebra', 'Teoría de Números', 'Combinatoria']

// Approved topics only (one someone proposed shows up once it is approved),
// each with its other names (`aliases`) for the search box.
router.get('/', async (req, res) => {
  res.json((await Topic.find(publicTopicQuery()).sort({ name: 1 }).lean()).map((topic) => topicView(topic)))
})

// How many published items each área and each topic has in one library,
// counting subtopics: { areas: { Geometría: 45 }, topics: { <id>: 16 } }.
// The área tiles show these numbers; empty subtemas are hidden.
// GET /api/topics/counts?library=problems|theory|lists[&source=teacherperi|external]
const LIBRARIES = {
  problems: { model: Problem, base: () => ({ ...publishedOrLegacyProblemQuery(), codigo: { $nin: EXERCISE_CODES } }) },
  theory: { model: Theory, base: () => ({ publicationStatus: 'published' }) },
  lists: { model: List, base: () => ({ publicationStatus: 'published' }) },
}
router.get('/counts', async (req, res) => {
  const library = LIBRARIES[req.query.library]
  if (!library) return res.status(400).json({ error: 'El parámetro library es inválido.' })
  const source = req.query.source
  if (source !== undefined && (req.query.library !== 'lists' || !LIST_SOURCES[source])) return res.status(400).json({ error: 'El parámetro source es inválido.' })
  const topics = await Topic.find(publicTopicQuery()).select('_id parent').lean()
  const children = new Map()
  for (const topic of topics) if (topic.parent) children.set(String(topic.parent), [...(children.get(String(topic.parent)) || []), topic._id])
  const subtree = (id) => [id, ...(children.get(String(id)) || []).flatMap(subtree)]
  const base = { ...library.base(), ...(source ? { $and: [LIST_SOURCES[source]] } : {}) }
  const counts = await Promise.all(topics.map((topic) => library.model.countDocuments({ ...base, topics: { $in: subtree(topic._id) } })))
  const roots = await Topic.find({ parent: null, ...publicTopicQuery() }).select('name').lean()
  const areaNames = [...new Set([...AREA_NAMES, ...roots.map((root) => root.name)])]
  const areaCounts = await Promise.all(areaNames.map(async (name) => library.model.countDocuments({ ...base, $and: [...(base.$and || []), await areaCondition(name)] })))
  res.json({
    areas: Object.fromEntries(areaNames.map((name, index) => [name, areaCounts[index]])),
    topics: Object.fromEntries(topics.map((topic, index) => [String(topic._id), counts[index]])),
  })
})

export default router
