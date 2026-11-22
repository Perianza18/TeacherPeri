import mongoose from 'mongoose'
import Category from '../models/Category.js'
import Tag from '../models/Tag.js'
import Topic from '../models/Topic.js'
import { publishedOrLegacyProblemQuery } from '../models/content.js'
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

// Include descendants in every library, without depending on the client tree.
export async function descendantCategoryIds(ids) {
  const seen = new Set(ids.map(String))
  let frontier = ids
  while (frontier.length) {
    const children = await Category.find({ parent: { $in: frontier } }).select('_id').lean()
    frontier = children.map((c) => String(c._id)).filter((id) => !seen.has(id))
    frontier.forEach((id) => seen.add(id))
  }
  return [...seen]
}

export function populatedProblems(query) {
  return query.populate({ path: 'problems.problem', match: publishedOrLegacyProblemQuery(), select: 'codigo titulo enunciado problemNumber difficulty dificultad sourceAttribution' })
}

// Keyword search that forgives accents and capitals: «geometria», «GEOMETRÍA»
// and «Geometría» find the same items. Each word must match somewhere: in
// one of `fields`, or in the name of one of the item's tags or topics.
const ACCENTS = { a: 'aáàäâAÁÀÄÂ', e: 'eéèëêEÉÈËÊ', i: 'iíìïîIÍÌÏÎ', o: 'oóòöôOÓÒÖÔ', u: 'uúùüûUÚÙÜÛ', n: 'nñNÑ', c: 'cçCÇ' }
export const foldText = (value) => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

export function accentInsensitive(word) {
  const pattern = [...foldText(word)].map((char) => ACCENTS[char] ? `[${ACCENTS[char]}]` : char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('')
  return new RegExp(pattern, 'i')
}

export async function keywordConditions(query, fields) {
  const words = foldText(query).split(/[\s,]+/).filter(Boolean).slice(0, 6)
  return Promise.all(words.map(async (word) => {
    const pattern = accentInsensitive(word)
    const [tags, topics] = await Promise.all([
      Tag.find({ $or: [{ label: pattern }, { name: pattern }] }).select('_id').lean(),
      Topic.find({ name: pattern }).select('_id').lean(),
    ])
    return { $or: [
      ...fields.map((field) => ({ [field]: pattern })),
      { tags: { $in: tags.map((tag) => tag._id) } },
      { topics: { $in: topics.map((topic) => topic._id) } },
    ] }
  }))
}

// An área includes its subtopics: «Geometría» also finds items tagged only
// with «Triángulos».
export async function descendantTopicIds(ids) {
  const seen = new Set(ids.map(String))
  let frontier = ids
  while (frontier.length) {
    const children = await Topic.find({ parent: { $in: frontier } }).select('_id').lean()
    frontier = children.map((t) => String(t._id)).filter((id) => !seen.has(id))
    frontier.forEach((id) => seen.add(id))
  }
  return [...seen]
}

// ?area=<name>: one área («Geometría») with all its subtemas. Matches the
// Topic tree, and also the older `tema` field, so databases from before
// Topics existed still filter by área.
export async function areaCondition(name) {
  const root = await Topic.findOne({ parent: null, name }).select('_id').lean()
  const ids = root ? await descendantTopicIds([root._id]) : []
  return { $or: [{ topics: { $in: ids } }, { tema: name }] }
}

export function areaOrBadRequest(res, value) {
  if (value === undefined || value === '') return ''
  if (typeof value !== 'string' || value.length > 80) {
    res.status(400).json({ error: 'El filtro area es inválido.' })
    return null
  }
  return value.trim()
}

// ?source= on Lists: TeacherPeri's own lists, or links to other publishers.
const TEACHERPERI = 'TeacherPeri'
export const LIST_SOURCES = {
  teacherperi: { $or: [{ sourceOrganization: TEACHERPERI }, { sourceOrganization: { $exists: false } }, { sourceOrganization: '' }] },
  external: { sourceOrganization: { $exists: true, $nin: [TEACHERPERI, ''] } },
}
