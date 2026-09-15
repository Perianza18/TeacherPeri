import { Router } from 'express'
import PathCompletion from '../models/PathCompletion.js'
import { requireAuth } from '../middleware/auth.js'
import { idsOrBadRequest } from './library.utils.js'
import {
  descendantLeafIds,
  progressForUser,
  publicPathDetail,
  publishedPath,
  publishedPathDiscovery,
  validTraversal,
} from './paths.utils.js'

const router = Router()

router.get('/', async (req, res) => {
  if (typeof req.query.traversal === 'string') {
    const slugs = req.query.traversal.split('/').filter(Boolean)
    const paths = await validTraversal(slugs)
    if (!paths) return res.status(404).json({ error: 'La ruta solicitada no existe o no está publicada.' })
    const current = paths.at(-1)
    return res.json({
      breadcrumbs: paths.map(({ slug, title }) => ({ slug, title })),
      path: await publicPathDetail(current),
    })
  }

  const tags = idsOrBadRequest(res, req.query.tags, 'tags')
  if (!tags) return
  const items = await publishedPathDiscovery(req.query.q, tags)
  res.json({ items })
})

router.get('/:slug/progress', requireAuth, async (req, res) => {
  const path = await publishedPath(req.params.slug)
  if (!path) return res.status(404).json({ error: 'Esa Ruta no existe o no está publicada.' })
  res.json(await progressForUser(path, req.userId))
})

router.put('/:slug/completion', requireAuth, async (req, res) => {
  if (typeof req.body.completed !== 'boolean') {
    return res.status(400).json({ error: 'completed debe ser verdadero o falso.' })
  }
  const path = await publishedPath(req.params.slug)
  if (!path) return res.status(404).json({ error: 'Esa Ruta no existe o no está publicada.' })
  const leaves = await descendantLeafIds(path)
  if (path.kind !== 'leaf' || leaves.size !== 1 || !leaves.has(path._id.toString())) {
    return res.status(400).json({ error: 'Solo las Rutas hoja pueden marcarse como completadas.' })
  }

  if (req.body.completed) {
    await PathCompletion.updateOne(
      { user: req.userId, path: path._id },
      { $setOnInsert: { completedAt: new Date() } },
      { upsert: true },
    )
  } else {
    await PathCompletion.deleteOne({ user: req.userId, path: path._id })
  }

  res.json({
    completed: req.body.completed,
    progress: await progressForUser(path, req.userId),
  })
})

router.get('/:slug', async (req, res) => {
  const path = await publishedPath(req.params.slug)
  if (!path) return res.status(404).json({ error: 'Esa Ruta no existe o no está publicada.' })
  res.json({
    breadcrumbs: [{ slug: path.slug, title: path.title }],
    path: await publicPathDetail(path),
  })
})

export default router
