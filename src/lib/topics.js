// Áreas, subtemas y la búsqueda por nombre o por otro nombre («palomar» →
// Combinatoria › Principio de casillas). Lo usan «Proponer un problema»,
// Revisión y el editor (components/submissions/VocabularyPicker.jsx).
import { normalize } from './submissions.js'

// The four áreas, in the order the form shows them (same colors and glyphs as
// the library tiles, components/training/filters/areaTree.js).
export const AREA_CHOICES = [
  { slug: 'omm-geometry', name: 'Geometría', color: 'bg-tp-sky', glyph: '△' },
  { slug: 'omm-algebra', name: 'Álgebra', color: 'bg-tp-tint-violet', glyph: 'x²' },
  { slug: 'omm-number-theory', name: 'Teoría de Números', color: 'bg-tp-mint', glyph: '≡' },
  { slug: 'omm-combinatorics', name: 'Combinatoria', color: 'bg-tp-orange', glyph: 'n!' },
]
export const TECHNIQUE_ROOT_SLUG = 'omm-proof'

const id = (value) => String(value?._id ?? value)

// The área (root) a topic hangs from; the topic itself when it is a root.
export function rootOf(topicId, byId) {
  let cursor = byId.get(String(topicId))
  const seen = new Set()
  while (cursor?.parent && !seen.has(id(cursor))) {
    seen.add(id(cursor))
    const parent = byId.get(String(cursor.parent))
    if (!parent) break
    cursor = parent
  }
  return cursor || null
}

// { areas: [{ ...choice, topic, children }], technique: { topic, children } | null, byId }
// An área missing from the database is left out.
export function topicTree(topics) {
  const byId = new Map(topics.map((topic) => [id(topic), topic]))
  const roots = topics.filter((topic) => !topic.parent)
  const bySlug = new Map(roots.map((topic) => [topic.slug, topic]))
  const byName = new Map(roots.map((topic) => [normalize(topic.name), topic]))
  const childrenOf = (root) => topics
    .filter((topic) => String(topic.parent) === id(root))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
  const areas = AREA_CHOICES
    .map((choice) => ({ ...choice, topic: bySlug.get(choice.slug) || byName.get(normalize(choice.name)) }))
    .filter((area) => area.topic)
    .map((area) => ({ ...area, children: childrenOf(area.topic) }))
  const techniqueRoot = bySlug.get(TECHNIQUE_ROOT_SLUG)
  const technique = techniqueRoot ? { topic: techniqueRoot, children: childrenOf(techniqueRoot) } : null
  return { areas, technique, byId }
}

// Subtemas whose name or other name contains what was typed, best first:
// the name before another name, a word start before the middle of a word,
// the áreas already chosen before the rest. Each result says which other
// name matched (`alias`) so the list can explain «también: palomar».
// `exclude`: ids already chosen.
export function searchTopics(query, topics, { preferRoots = [], exclude = [], limit = 8 } = {}) {
  const wanted = normalize(query)
  if (wanted.length < 2) return []
  const byId = new Map(topics.map((topic) => [id(topic), topic]))
  const preferred = new Set(preferRoots.map(String))
  const skip = new Set(exclude.map(String))
  const score = (text) => {
    const value = normalize(text)
    if (value === wanted) return 0
    if (value.startsWith(wanted)) return 1
    if (value.split(/[\s-]+/).some((word) => word.startsWith(wanted))) return 2
    if (value.includes(wanted)) return 3
    return null
  }
  const found = []
  for (const topic of topics) {
    if (!topic.parent || skip.has(id(topic))) continue
    const byName = score(topic.name)
    let best = byName === null ? null : { rank: byName, alias: null }
    for (const alias of topic.aliases || []) {
      const rank = score(alias)
      if (rank !== null && (!best || rank + 4 < best.rank)) best = { rank: rank + 4, alias }
    }
    if (!best) continue
    const root = rootOf(topic._id, byId)
    found.push({ topic, root, alias: best.alias, rank: best.rank, preferred: root && preferred.has(id(root)) ? 0 : 1 })
  }
  return found
    .sort((a, b) => a.rank - b.rank || a.preferred - b.preferred || a.topic.name.localeCompare(b.topic.name, 'es') || (a.root?.name || '').localeCompare(b.root?.name || '', 'es'))
    .slice(0, limit)
}

// Adds a subtema and its área; áreas first, then subtemas, without repeats.
export function withTopic(chosen, topicId, byId) {
  const root = rootOf(topicId, byId)
  return orderTopics([...chosen, ...(root ? [id(root)] : []), String(topicId)], byId)
}

// Removes an área and every subtema under it.
export function withoutArea(chosen, rootId, byId) {
  return chosen.filter((topicId) => String(topicId) !== String(rootId) && id(rootOf(topicId, byId) || topicId) !== String(rootId))
}

export function orderTopics(chosen, byId) {
  const unique = [...new Set(chosen.map(String))]
  const isRoot = (topicId) => !byId.get(topicId)?.parent
  return [...unique.filter(isRoot), ...unique.filter((topicId) => !isRoot(topicId))]
}
