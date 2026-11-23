import { Router } from 'express'
import Problem from '../models/Problem.js'
import { publishedOrLegacyProblemQuery } from '../models/content.js'
import { EXERCISE_LISTS } from '../data/exerciseLists.js'
import { AREAS } from '../data/mvpManifest.js'

const router = Router()
const visible = () => Problem.find({ codigo: { $in: [...new Set(EXERCISE_LISTS.flatMap((list) => list.codes))] }, ...publishedOrLegacyProblemQuery() }).select('_id codigo titulo enunciado hint solution difficulty').lean()

router.get('/', async (_req, res) => {
  const available = new Set((await visible()).map((problem) => problem.codigo))
  res.json(EXERCISE_LISTS.map(({ slug, title, area, codes }) => ({ slug, title, area: AREAS[area], count: codes.filter((code) => available.has(code)).length })).filter((list) => list.count))
})
router.get('/:slug', async (req, res) => {
  const list = EXERCISE_LISTS.find((entry) => entry.slug === req.params.slug)
  if (!list) return res.status(404).json({ error: 'Esa lista no existe.' })
  const byCode = new Map((await visible()).map((problem) => [problem.codigo, problem]))
  res.json({ slug: list.slug, title: list.title, area: AREAS[list.area], exercises: list.codes.map((code) => byCode.get(code)).filter(Boolean) })
})
export default router
