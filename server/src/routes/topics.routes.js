import { Router } from 'express'
import Topic from '../models/Topic.js'

const router = Router()

router.get('/', async (req, res) => {
  res.json(await Topic.find().sort({ name: 1 }).lean())
})

export default router
