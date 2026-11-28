// Personal lists, shown as «colecciones» («Guardar», Mi Espacio › Guardados)
//
// GET    /api/my-lists/containing?itemType=&item=   signed in: your lists, each with `contains`
// POST   /api/my-lists                              signed in: { name, isPublic }
// GET    /api/my-lists/:id                          the owner, or anyone if the list is public
// PATCH  /api/my-lists/:id                          owner: { name?, isPublic? }
// DELETE /api/my-lists/:id                          owner: deletes the list and its items
// POST   /api/my-lists/:id/items                    owner: { itemType: problem|theory, item }
// DELETE /api/my-lists/:id/items/:itemType/:item    owner
//
// Someone else's private list answers 404, the same as a list that does not
// exist, so its existence never leaks.

import { Router } from 'express'
import mongoose from 'mongoose'
import User from '../models/User.js'
import UserList from '../models/UserList.js'
import UserListItem from '../models/UserListItem.js'
import { requireAuth } from '../middleware/auth.js'
import { optionalAuth } from '../middleware/optionalAuth.js'
import { roleOf } from '../lib/permissions.js'
import { LIST_ITEM_TYPES, MAX_ITEMS_PER_LIST, MAX_LISTS_PER_USER, avatarColorOf, avatarOf, parseListName } from '../lib/profile.js'
import { frameOf } from '../lib/levels.js'
import { contentNames, publicItemExists } from '../lib/profileContent.js'

const router = Router()
const isId = (value) => typeof value === 'string' && mongoose.isObjectIdOrHexString(value)
const notFound = (res) => res.status(404).json({ error: 'Esa colección no existe.' })

const listHref = (owner, id) => `/perfil/${encodeURIComponent(owner.username)}/colecciones/${id}`

// Cards for the Guardados tab: name, privacy and how many items each list has.
export async function listSummaries(lists, owner) {
  if (!lists.length) return []
  const counts = await UserListItem.aggregate([{ $match: { list: { $in: lists.map((l) => l._id) } } }, { $group: { _id: '$list', count: { $sum: 1 } } }])
  const byList = new Map(counts.map((row) => [String(row._id), row.count]))
  return lists.map((list) => ({ id: list._id, name: list.name, isPublic: list.isPublic, count: byList.get(String(list._id)) ?? 0, href: listHref(owner, list._id), createdAt: list.createdAt }))
}

async function ownList(req, res) {
  const list = isId(req.params.id) ? await UserList.findOne({ _id: req.params.id, owner: req.userId }) : null
  if (!list) notFound(res)
  return list
}

router.get('/containing', requireAuth, async (req, res) => {
  const { itemType, item } = req.query
  if (!LIST_ITEM_TYPES.includes(itemType) || !isId(item)) return res.status(400).json({ error: 'Falta qué guardar.' })
  const [lists, owner] = await Promise.all([UserList.find({ owner: req.userId }).sort({ createdAt: -1 }).lean(), User.findById(req.userId).select('username').lean()])
  const containing = new Set((await UserListItem.find({ owner: req.userId, itemType, item }).select('list').lean()).map((row) => String(row.list)))
  const summaries = await listSummaries(lists, owner)
  res.json({ items: summaries.map((summary) => ({ ...summary, contains: containing.has(String(summary.id)) })) })
})

router.post('/', requireAuth, async (req, res) => {
  const name = parseListName(req.body.name)
  if (name.error) return res.status(400).json({ error: name.error })
  if (await UserList.countDocuments({ owner: req.userId }) >= MAX_LISTS_PER_USER) {
    return res.status(409).json({ error: `Puedes tener hasta ${MAX_LISTS_PER_USER} colecciones.` })
  }
  const list = await UserList.create({ owner: req.userId, name: name.value, isPublic: req.body.isPublic === true })
  const owner = await User.findById(req.userId).select('username').lean()
  const [summary] = await listSummaries([list.toObject()], owner)
  res.status(201).json(summary)
})

router.get('/:id', optionalAuth, async (req, res) => {
  const list = isId(req.params.id) ? await UserList.findById(req.params.id).populate('owner', 'username role avatar avatarColor points frame unlockedAvatars').lean() : null
  if (!list || !list.owner) return notFound(res)
  const owner = Boolean(req.userId) && String(list.owner._id) === req.userId
  if (!list.isPublic && !owner) return notFound(res)
  const rows = await UserListItem.find({ list: list._id }).sort({ createdAt: -1 }).lean()
  const names = await contentNames({
    problemIds: rows.filter((r) => r.itemType === 'problem').map((r) => r.item),
    theoryIds: rows.filter((r) => r.itemType === 'theory').map((r) => r.item),
  })
  const items = []
  for (const row of rows) {
    const content = (row.itemType === 'problem' ? names.problems : names.theory).get(String(row.item))
    if (content) items.push({ itemType: row.itemType, item: row.item, label: content.label, href: content.href, preview: row.itemType === 'problem' ? content.enunciado : content.summary, savedAt: row.createdAt })
  }
  res.json({
    id: list._id,
    name: list.name,
    isPublic: list.isPublic,
    isOwner: owner,
    owner: { username: list.owner.username, avatar: avatarOf(list.owner), avatarColor: avatarColorOf(list.owner), frame: frameOf(list.owner), role: roleOf(list.owner) },
    count: items.length,
    items,
  })
})

router.patch('/:id', requireAuth, async (req, res) => {
  const list = await ownList(req, res)
  if (!list) return
  if ('name' in req.body) {
    const name = parseListName(req.body.name)
    if (name.error) return res.status(400).json({ error: name.error })
    list.name = name.value
  }
  if ('isPublic' in req.body) {
    if (typeof req.body.isPublic !== 'boolean') return res.status(400).json({ error: 'Elige si la colección es pública o privada.' })
    list.isPublic = req.body.isPublic
  }
  await list.save()
  const owner = await User.findById(req.userId).select('username').lean()
  const [summary] = await listSummaries([list.toObject()], owner)
  res.json(summary)
})

router.delete('/:id', requireAuth, async (req, res) => {
  const list = await ownList(req, res)
  if (!list) return
  await UserListItem.deleteMany({ list: list._id })
  await list.deleteOne()
  res.status(204).end()
})

router.post('/:id/items', requireAuth, async (req, res) => {
  const list = await ownList(req, res)
  if (!list) return
  const { itemType, item } = req.body
  if (!LIST_ITEM_TYPES.includes(itemType) || !isId(item)) return res.status(400).json({ error: 'Solo puedes guardar problemas y lecciones de teoría.' })
  if (!await publicItemExists(itemType, item)) return res.status(404).json({ error: 'Eso no existe o no está publicado.' })
  if (await UserListItem.exists({ list: list._id, itemType, item })) return res.status(200).json({ saved: true })
  if (await UserListItem.countDocuments({ list: list._id }) >= MAX_ITEMS_PER_LIST) {
    return res.status(409).json({ error: `Una colección puede tener hasta ${MAX_ITEMS_PER_LIST} elementos.` })
  }
  try {
    await UserListItem.create({ list: list._id, owner: req.userId, itemType, item })
  } catch (error) {
    if (error.code !== 11000) throw error // the same save arrived twice at once
  }
  res.status(201).json({ saved: true })
})

router.delete('/:id/items/:itemType/:item', requireAuth, async (req, res) => {
  const list = await ownList(req, res)
  if (!list) return
  const { itemType, item } = req.params
  if (!LIST_ITEM_TYPES.includes(itemType) || !isId(item)) return res.status(400).json({ error: 'Ese elemento no es válido.' })
  await UserListItem.deleteOne({ list: list._id, itemType, item })
  res.status(204).end()
})

export default router
