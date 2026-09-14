import mongoose from 'mongoose'
import { DIFFICULTY_LEVELS } from '../models/content.js'

export function validObjectId(value) {
  return typeof value === 'string' && mongoose.isObjectIdOrHexString(value)
}

export function parsePage(query) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1)
  const limit = Math.min(50, Math.max(1, Number.parseInt(query.limit, 10) || 20))
  return { page, limit, skip: (page - 1) * limit }
}

export function commaValues(value) {
  return typeof value === 'string' ? value.split(',').map((entry) => entry.trim()).filter(Boolean) : []
}

export function textSearch(value) {
  return new RegExp(String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
}

export function idsOrBadRequest(res, value, field) {
  const ids = commaValues(value)
  if (ids.some((id) => !validObjectId(id))) {
    res.status(400).json({ error: `El filtro ${field} contiene un identificador inválido.` })
    return null
  }
  return ids
}

export function difficultyOrBadRequest(res, value, field = 'difficulty') {
  if (value === undefined || value === '') return null
  if (!DIFFICULTY_LEVELS.includes(value)) {
    res.status(400).json({ error: `El filtro ${field} es inválido.` })
    return undefined
  }
  return value
}

export function populatedContent(query) {
  return query.populate('topics', 'name slug').populate('tags', 'name slug label').populate('categories', 'name parent')
}

export async function paginatedResponse({ req, res, model, filter, sort = { updatedAt: -1 }, populate = populatedContent }) {
  const { page, limit, skip } = parsePage(req.query)
  const [items, total] = await Promise.all([
    populate(model.find(filter).sort(sort).skip(skip).limit(limit)).lean(),
    model.countDocuments(filter),
  ])
  res.json({ items, page, limit, total, totalPages: Math.ceil(total / limit) })
}
