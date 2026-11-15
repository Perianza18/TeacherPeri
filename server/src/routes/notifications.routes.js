// GET  /api/notifications       your latest notifications and how many are unread
// POST /api/notifications/read  mark them all as read

import { Router } from 'express'
import Notification from '../models/Notification.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

router.get('/', async (req, res) => {
  const [items, unread] = await Promise.all([
    Notification.find({ user: req.userId }).sort({ createdAt: -1 }).limit(30).select('type problem message readAt createdAt').lean(),
    Notification.countDocuments({ user: req.userId, readAt: null }),
  ])
  res.json({ unread, items })
})

router.post('/read', async (req, res) => {
  const result = await Notification.updateMany({ user: req.userId, readAt: null }, { readAt: new Date() })
  res.json({ read: result.modifiedCount })
})

export default router
