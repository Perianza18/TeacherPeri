import { useEffect, useState } from 'react'
import { apiFetch } from '../../../lib/api'
import { normalize } from '../../../lib/submissions'

export const countLabel = (count) => count === null || count === undefined ? '' : ` (${count})`

// The four olympiad áreas, always shown as tiles, with the same colors as the
// library card strips. The API filters an área by name (?area=), matching the
// Topic tree or the older `tema` field.
export const MAIN_AREAS = [
  { name: 'Geometría', color: 'bg-tp-sky', glyph: '△' },
  { name: 'Álgebra', color: 'bg-tp-tint-violet', glyph: 'x²' },
  { name: 'Teoría de Números', color: 'bg-tp-mint', glyph: '≡' },
  { name: 'Combinatoria', color: 'bg-tp-orange', glyph: 'n!' },
]

// Builds the área tree: the four áreas, each with its subtemas (Topics whose
// `parent` is the área), and how many items of this library each one has.
// Subtemas with no items are hidden. Other top topics («Cómo entrenar»,
// «Demostraciones»…) go to «Otros temas» only when they have items.
// `library` null: the library has no área filter, so nothing is fetched.
export function useAreaTree(library, source = null) {
  const [data, setData] = useState({ topics: [], counts: null, loaded: false, error: false })
  useEffect(() => {
    if (!library) return undefined
    let cancelled = false
    const query = `library=${library}${source ? `&source=${source}` : ''}`
    Promise.all([apiFetch('/api/topics'), apiFetch(`/api/topics/counts?${query}`).catch(() => null)])
      .then(([topics, counts]) => { if (!cancelled) setData({ topics, counts, loaded: true, error: false }) })
      .catch(() => { if (!cancelled) setData({ topics: [], counts: null, loaded: true, error: true }) })
    return () => { cancelled = true }
  }, [library, source])

  const { topics, counts, loaded, error } = data
  const topicCount = (topic) => counts?.topics ? counts.topics[topic._id] || 0 : null
  const areaCount = (name) => counts?.areas ? counts.areas[name] || 0 : null
  const childrenOf = (topic) => !topic ? [] : topics
    .filter((t) => String(t.parent) === String(topic._id) && (counts?.topics ? topicCount(t) > 0 : true))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
    .map((t) => ({ id: t._id, name: t.name, count: topicCount(t) }))
  const roots = topics.filter((t) => !t.parent)
  const rootNamed = (name) => roots.find((t) => normalize(t.name) === normalize(name))
  const main = MAIN_AREAS.map((area) => ({ ...area, count: areaCount(area.name), children: childrenOf(rootNamed(area.name)) }))
  const mainNames = new Set(MAIN_AREAS.map((area) => normalize(area.name)))
  const others = roots
    .filter((t) => !mainNames.has(normalize(t.name)) && (counts?.areas ? areaCount(t.name) > 0 : true))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
    .map((t) => ({ name: t.name, count: areaCount(t.name), children: childrenOf(t) }))
  return { main, others, ready: loaded, error }
}

// The chosen área and subtema: [área] or [área, subtema].
export function pathOf(tree, area, topicId) {
  const node = [...tree.main, ...tree.others].find((entry) => entry.name === area)
  if (!node) return area ? [{ name: area, children: [] }] : []
  const child = topicId && node.children.find((c) => String(c.id) === String(topicId))
  return child ? [node, child] : [node]
}

// Áreas and subtemas whose name matches what the student typed, ignoring
// accents and capitals: «triangulo» suggests «Geometría › Triángulos».
export function matchingTopics(tree, query) {
  const wanted = normalize(query)
  if (wanted.length < 2) return []
  const found = []
  for (const area of [...tree.main, ...tree.others]) {
    if (normalize(area.name).includes(wanted)) found.push({ key: area.name, area: area.name, topic: '', label: area.name, count: area.count })
    for (const child of area.children) if (normalize(child.name).includes(wanted)) found.push({ key: String(child.id), area: area.name, topic: child.id, label: `${area.name} › ${child.name}`, count: child.count })
  }
  return found.slice(0, 6)
}
