import { Router } from 'express'
import Tag from '../models/Tag.js'

const router = Router()
router.get('/', async (req, res) => res.json(await Tag.find().sort({ label: 1 }).lean()))
export default router
