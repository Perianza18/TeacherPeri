// GET /api/categories — list every public folder.
// No auth needed, anyone can browse the folder list. Exam folders that are
// still waiting for review (or were rejected) are left out; their authors see
// them through /api/submissions/folders.

import { Router } from 'express'
import Category, { publicFolderQuery } from '../models/Category.js'

const router = Router()

router.get('/', async (req, res) => {
  const categories = await Category.find(publicFolderQuery()).select('name parent kind createdAt updatedAt').sort({ name: 1 }).lean()
  res.json(categories.map((category) => ({ ...category, kind: category.kind ?? 'general' })))
})

export default router
