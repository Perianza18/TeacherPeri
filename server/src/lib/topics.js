// ---------------------------------------------------------------------------
// Temas: las cuatro áreas, sus subtemas y los que propone la comunidad.
// ---------------------------------------------------------------------------

import Topic, { TOPIC_NAME_MAX } from '../models/Topic.js'
import { normalizeSlug } from '../models/content.js'
import { aliasesFor } from '../data/topicAliases.js'

// Las raíces bajo las que alguien puede proponer un subtema: las cuatro áreas
// y las técnicas de demostración. «Cómo entrenar» y las demás raíces de las
// lecciones no se ofrecen en el formulario.
export const AREA_SLUGS = ['omm-geometry', 'omm-algebra', 'omm-number-theory', 'omm-combinatorics']
export const TECHNIQUE_ROOT_SLUG = 'omm-proof'
export const PROPOSABLE_ROOT_SLUGS = [...AREA_SLUGS, TECHNIQUE_ROOT_SLUG]

// What the browser gets for one topic.
export function topicView(topic, userId = null) {
  return {
    _id: topic._id,
    name: topic.name,
    slug: topic.slug,
    parent: topic.parent ?? null,
    aliases: aliasesFor(topic),
    reviewStatus: topic.reviewStatus ?? 'approved',
    ...(userId ? { mine: String(topic.createdBy) === String(userId) } : {}),
  }
}

// Approved topics plus the ones this person proposed and are still waiting.
export async function topicsVisibleTo(userId) {
  const or = [{ reviewStatus: { $nin: ['pending', 'rejected'] } }]
  if (userId) or.push({ reviewStatus: 'pending', createdBy: userId })
  return Topic.find({ $or: or }).sort({ name: 1 }).lean()
}

// The área a topic hangs from (itself when it is a root).
export function rootOf(topicId, byId) {
  let cursor = byId.get(String(topicId))
  const seen = new Set()
  while (cursor?.parent && !seen.has(String(cursor._id))) {
    seen.add(String(cursor._id))
    const parent = byId.get(String(cursor.parent))
    if (!parent) break
    cursor = parent
  }
  return cursor || null
}

// Validates a proposed topic name. Returns { name } or { error }.
export function parseTopicName(input) {
  const name = typeof input === 'string' ? input.replace(/\s+/g, ' ').trim() : ''
  if (!name) return { error: 'Escribe el nombre del tema.' }
  if (name.length > TOPIC_NAME_MAX) return { error: `El nombre no puede pasar de ${TOPIC_NAME_MAX} caracteres.` }
  if (!/^[\p{L}\p{N}][\p{L}\p{N} .,'()·-]*$/u.test(name)) return { error: 'Usa solo letras, números, espacios y . , - ( ) en el nombre.' }
  return { name: name[0].toLocaleUpperCase('es') + name.slice(1) }
}

// A topic under `parentId` that already answers to `name` (by name or by one
// of its other names), or null. Rejected topics don't count.
export function existingTopicNamed(name, parentId, topics) {
  const wanted = normalizeSlug(name)
  return topics.find((topic) => topic.reviewStatus !== 'rejected' && String(topic.parent) === String(parentId)
    && [topic.name, ...aliasesFor(topic)].some((other) => normalizeSlug(other) === wanted)) || null
}

// A slug that no other topic uses: omm-combinatoria-palomar, then -2, -3…
export async function freeTopicSlug(name, parent) {
  const base = `omm-${normalizeSlug(parent.name)}-${normalizeSlug(name)}`.slice(0, 90)
  for (let n = 1; n < 100; n += 1) {
    const slug = n === 1 ? base : `${base}-${n}`
    if (!await Topic.exists({ slug })) return slug
  }
  return `${base}-${Date.now()}`
}
