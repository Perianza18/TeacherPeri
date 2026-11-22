// ---------------------------------------------------------------------------
// Images in problems: what an upload may be, how it is stored, and how a list
// of images on a problem or a proposal is checked.
//
// Accepted: PNG, JPEG and WebP, up to 5 MB, detected from the file's own bytes
// (never trusting the browser's type), so SVG and anything else is refused.
// Every upload is re-encoded with sharp: rotated by its EXIF orientation,
// metadata dropped, at most 1200 px wide, WebP quality 80.
// ---------------------------------------------------------------------------

import mongoose from 'mongoose'
import sharp from 'sharp'
import Problem from '../models/Problem.js'
import ProblemImage from '../models/ProblemImage.js'
import ProblemSubmission from '../models/ProblemSubmission.js'
import { mathFindings } from './review/checks.js'

export const IMAGE_MAX_BYTES = 5 * 1024 * 1024
export const IMAGE_MAX_WIDTH = 1200
export const IMAGES_PER_PROBLEM = 4
export const ALT_MIN = 5
export const ALT_MAX = 300
export const PLACEMENTS = ['statement', 'solution']
// Unattached uploads a person may keep at once (each is deleted a day later).
export const MAX_LOOSE_UPLOADS = 12
const LOOSE_TTL_MS = 24 * 60 * 60 * 1000

export class ImageError extends Error {
  constructor(message, status = 400) {
    super(message)
    this.status = status
  }
}

const isId = (value) => typeof value === 'string' && mongoose.isObjectIdOrHexString(value)

// The real format from the first bytes, or null.
export function sniffFormat(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) return null
  if (buffer[0] === 0x89 && buffer.toString('ascii', 1, 4) === 'PNG') return 'png'
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'jpeg'
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return 'webp'
  return null
}

// Re-encodes an upload. Returns { data, width, height, bytes }.
export async function processImage(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) throw new ImageError('Elige una imagen.')
  if (buffer.length > IMAGE_MAX_BYTES) throw new ImageError('La imagen pesa más de 5 MB.', 413)
  if (!sniffFormat(buffer)) throw new ImageError('Solo se aceptan imágenes PNG, JPG o WebP.', 415)
  try {
    const { data, info } = await sharp(buffer, { limitInputPixels: 40_000_000, animated: false })
      .rotate()
      .resize({ width: IMAGE_MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 80, effort: 4 })
      .toBuffer({ resolveWithObject: true })
    return { data, width: info.width, height: info.height, bytes: data.length }
  } catch {
    throw new ImageError('No se pudo leer la imagen. Prueba con otro archivo PNG, JPG o WebP.', 415)
  }
}

// Deletes this person's uploads that were never attached and are a day old.
async function sweepLoose(ownerId) {
  const old = await ProblemImage.find({ owner: ownerId, createdAt: { $lt: new Date(Date.now() - LOOSE_TTL_MS) } }).select('_id').lean()
  const unused = await unreferenced(old.map((image) => image._id))
  if (unused.length) await ProblemImage.deleteMany({ _id: { $in: unused } })
}

// Of these image ids, the ones no problem and no open or approved proposal uses.
export async function unreferenced(ids) {
  if (!ids.length) return []
  const [problems, submissions] = await Promise.all([
    Problem.find({ 'images.image': { $in: ids } }).select('images.image').lean(),
    ProblemSubmission.find({ 'proposed.images.image': { $in: ids }, status: { $in: ['pending', 'rejected', 'approved'] } }).select('proposed.images.image').lean(),
  ])
  const used = new Set([...problems.flatMap((p) => p.images), ...submissions.flatMap((s) => s.proposed.images)].map((entry) => String(entry.image)))
  return ids.filter((id) => !used.has(String(id)))
}

export async function storeUpload(buffer, ownerId) {
  await sweepLoose(ownerId)
  const recent = await ProblemImage.find({ owner: ownerId, createdAt: { $gte: new Date(Date.now() - LOOSE_TTL_MS) } }).select('_id').lean()
  if ((await unreferenced(recent.map((image) => image._id))).length >= MAX_LOOSE_UPLOADS) {
    throw new ImageError('Subiste muchas imágenes que aún no usas. Guarda tu problema o espera un día.', 429)
  }
  const processed = await processImage(buffer)
  const image = await ProblemImage.create({ owner: ownerId, contentType: 'image/webp', originalBytes: buffer.length, ...processed })
  return { _id: image._id, width: image.width, height: image.height, bytes: image.bytes }
}

// Reads the `images` list a browser sent: [{ image, alt, placement }].
// `allowSolution` is for editors and admins; users only add images to the statement.
export function parseImageList(value, { allowSolution = false } = {}) {
  if (value === undefined || value === null) return { images: [] }
  if (!Array.isArray(value)) return { error: 'La lista de imágenes no es válida.' }
  if (value.length > IMAGES_PER_PROBLEM) return { error: `Un problema puede tener como máximo ${IMAGES_PER_PROBLEM} imágenes.` }
  const images = []
  for (const [index, entry] of value.entries()) {
    const id = typeof entry?.image === 'string' ? entry.image : null
    if (!isId(id)) return { error: 'Una de las imágenes no es válida.' }
    if (images.some((other) => other.image === id)) return { error: 'La misma imagen aparece dos veces.' }
    const alt = typeof entry.alt === 'string' ? entry.alt.replace(/\s+/g, ' ').trim() : ''
    if (alt.length < ALT_MIN) return { error: `Describe la imagen ${index + 1} para quien no puede verla (mínimo ${ALT_MIN} caracteres).` }
    if (alt.length > ALT_MAX) return { error: `La descripción de la imagen ${index + 1} no puede pasar de ${ALT_MAX} caracteres.` }
    // The description may use $…$ math (shown rendered to writers and
    // reviewers, as plain text in the alt attribute), checked like a statement.
    const [math] = mathFindings(alt)
    if (math) return { error: `Descripción de la imagen ${index + 1}: ${math.message[0].toLowerCase()}${math.message.slice(1)}` }
    const placement = entry.placement ?? 'statement'
    if (!PLACEMENTS.includes(placement) || (placement === 'solution' && !allowSolution)) return { error: 'Las imágenes de una propuesta van con el enunciado.' }
    images.push({ image: id, alt, placement })
  }
  return { images }
}

// Every image in `images` must exist, and be either already on this problem
// (or its proposals) or uploaded by `userId`. Staff may reuse any image.
export async function assertUsableImages(images, { userId, problemId = null, staff = false }) {
  if (!images.length) return
  const ids = images.map((entry) => entry.image)
  const found = await ProblemImage.find({ _id: { $in: ids } }).select('owner').lean()
  if (found.length !== ids.length) throw new ImageError('Una de las imágenes ya no existe. Súbela de nuevo.')
  if (staff) return
  const known = new Set()
  if (problemId) {
    const [problem, submissions] = await Promise.all([
      Problem.findById(problemId).select('images.image').lean(),
      ProblemSubmission.find({ problem: problemId }).select('proposed.images.image').lean(),
    ])
    for (const entry of [...(problem?.images || []), ...submissions.flatMap((s) => s.proposed.images || [])]) known.add(String(entry.image))
  }
  if (found.some((image) => String(image.owner) !== String(userId) && !known.has(String(image._id)))) {
    throw new ImageError('Solo puedes usar imágenes que subiste tú.', 403)
  }
}

// Deletes images that were removed and nothing uses anymore.
export async function deleteIfUnused(ids) {
  const unused = await unreferenced(ids.map((id) => new mongoose.Types.ObjectId(String(id))))
  if (unused.length) await ProblemImage.deleteMany({ _id: { $in: unused } })
  return unused.length
}

export const imageUrl = (id) => `/api/images/${id}`
