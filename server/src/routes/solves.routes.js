// «Lo resolví» on a problem. The student's own record; nothing checks answers.
//
// GET    /api/problems/:problemId/solved   signed in: { solved }
// PUT    /api/problems/:problemId/solved   signed in: mark it
// DELETE /api/problems/:problemId/solved   signed in: unmark it

import { Router } from 'express'
import mongoose from 'mongoose'
import Problem from '../models/Problem.js'
import ProblemSolve from '../models/ProblemSolve.js'
import { publishedOrLegacyProblemQuery } from '../models/content.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router({ mergeParams: true })
const isId = (value) => typeof value === 'string' && mongoose.isObjectIdOrHexString(value)

router.use(requireAuth)
router.use((req, res, next) => (isId(req.params.problemId) ? next() : res.status(404).json({ error: 'Ese problema no existe.' })))

router.get('/', async (req, res) => {
  res.json({ solved: Boolean(await ProblemSolve.exists({ user: req.userId, problem: req.params.problemId })) })
})

router.put('/', async (req, res) => {
  if (!await Problem.exists({ _id: req.params.problemId, ...publishedOrLegacyProblemQuery() })) return res.status(404).json({ error: 'Ese problema no existe.' })
  await ProblemSolve.updateOne({ user: req.userId, problem: req.params.problemId }, { $setOnInsert: { user: req.userId, problem: req.params.problemId } }, { upsert: true })
  res.json({ solved: true })
})

router.delete('/', async (req, res) => {
  await ProblemSolve.deleteOne({ user: req.userId, problem: req.params.problemId })
  res.json({ solved: false })
})

export default router
