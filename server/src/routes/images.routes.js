// ---------------------------------------------------------------------------
// Problem images.
//
// POST /api/images        signed in: the file itself as the request body
//                         (Content-Type image/png, image/jpeg or image/webp).
//                         Answers { _id, width, height, bytes }. The image is
//                         not shown anywhere until a proposal or an edit uses it.
// GET  /api/images/:id    public: the WebP bytes, cached for a year (an image
//                         never changes; replacing one makes a new id).
// ---------------------------------------------------------------------------

import express, { Router } from 'express'
import mongoose from 'mongoose'
import ProblemImage from '../models/ProblemImage.js'
import { requireAuth, requirePermission } from '../middleware/auth.js'
import { IMAGE_MAX_BYTES, ImageError, storeUpload } from '../lib/images.js'

const router = Router()
const readBody = express.raw({ type: () => true, limit: IMAGE_MAX_BYTES })

function rawUpload(req, res, next) {
  readBody(req, res, (error) => {
    if (error?.type === 'entity.too.large') return res.status(413).json({ error: 'La imagen pesa más de 5 MB.' })
    if (error) return res.status(400).json({ error: 'No se pudo leer la imagen.' })
    next()
  })
}

router.post('/', requireAuth, requirePermission('problems:submit'), rawUpload, async (req, res) => {
  try {
    res.status(201).json(await storeUpload(req.body, req.userId))
  } catch (error) {
    if (error instanceof ImageError) return res.status(error.status).json({ error: error.message })
    throw error
  }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const image = mongoose.isObjectIdOrHexString(id) ? await ProblemImage.findById(id).select('data contentType').lean() : null
  if (!image) return res.status(404).json({ error: 'Esa imagen no existe.' })
  res.set({
    'Content-Type': image.contentType,
    'Cache-Control': 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff',
    'Cross-Origin-Resource-Policy': 'cross-origin',
    'Content-Security-Policy': "default-src 'none'",
    ETag: `"${id}"`,
  })
  res.send(Buffer.from(image.data.buffer ?? image.data))
})

export default router
