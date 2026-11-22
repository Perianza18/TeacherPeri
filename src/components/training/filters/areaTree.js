import { useEffect, useState } from 'react'
import { apiFetch } from '../../../lib/api'
import { normalize } from '../../../lib/submissions'

export const LEVELS = { basico: 'Básico', intermedio: 'Intermedio', avanzado: 'Avanzado' }
export const countLabel = (count) => count === null || count === undefined ? '' : ` (${count})`

// The four olympiad áreas, in the order students meet them, with the same
// colors as the library card strips.
export const MAIN_AREAS = [
  { slug: 'omm-geometry', name: 'Geometría', color: 'bg-tp-sky', glyph: '△' },
  { slug: 'omm-algebra', name: 'Álgebra', color: 'bg-tp-tint-violet', glyph: 'x²' },
  { slug: 'omm-number-theory', name: 'Teoría de Números', color: 'bg-tp-mint', glyph: '≡' },
  { slug: 'omm-combinatorics', name: 'Combinatoria', color: 'bg-tp-orange', glyph: 'n!' },
]

// Builds the área tree from the Topics (each subtopic has its área as
// `parent`) and how many items of this library each one has. Subtopics with
// no items are hidden; áreas always show, so the tree keeps its shape.
// Other top topics («Cómo entrenar», «Demostraciones»…) go to «Otros temas»
// only when they have items.
// `library` null: the tree isn't shown, so nothing is fetched.
export function useAreaTree(library, source = null) {
  const [data, setData] = useState({ topics: [], counts: null })
  useEffect(() => {
    if (!library) return undefined
    let cancelled = false
    const query = `library=${library}${source ? `&source=${source}` : ''}`
    Promise.all([apiFetch('/api/topics'), apiFetch(`/api/topics/counts?${query}`).catch(() => null)])
      .then(([topics, counts]) => { if (!cancelled) setData({ topics, counts }) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [library, source])

  const { topics, counts } = data
  const count = (topic) => counts ? counts[topic._id] || 0 : null
  const childrenOf = (topic) => topics
    .filter((t) => String(t.parent) === String(topic._id) && (counts ? count(t) > 0 : true))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
    .map((t) => ({ id: t._id, name: t.name, count: count(t), children: [] }))
  const roots = topics.filter((t) => !t.parent)
  const main = MAIN_AREAS.map((area) => {
    const topic = roots.find((t) => t.slug === area.slug) || roots.find((t) => normalize(t.name) === normalize(area.name))
    return topic && { ...area, id: topic._id, name: topic.name, count: count(topic), children: childrenOf(topic) }
  }).filter(Boolean)
  const mainIds = new Set(main.map((area) => String(area.id)))
  const others = roots
    .filter((t) => !mainIds.has(String(t._id)) && (counts ? count(t) > 0 : true))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
    .map((t) => ({ id: t._id, name: t.name, count: count(t), color: 'bg-tp-yellow-soft', children: childrenOf(t) }))
  return { main, others, ready: topics.length > 0 }
}

// Where a topic id sits in the tree: [área] or [área, subtema].
export function pathOf(tree, id) {
  if (!id) return []
  for (const area of [...tree.main, ...tree.others]) {
    if (String(area.id) === String(id)) return [area]
    const child = area.children.find((c) => String(c.id) === String(id))
    if (child) return [area, child]
  }
  return []
}

// Áreas and subtemas whose name matches what the student typed, ignoring
// accents and capitals: «triangulo» suggests «Triángulos».
export function matchingTopics(tree, query) {
  const wanted = normalize(query)
  if (wanted.length < 2) return []
  const found = []
  for (const area of [...tree.main, ...tree.others]) {
    if (normalize(area.name).includes(wanted)) found.push({ id: area.id, label: area.name, count: area.count })
    for (const child of area.children) if (normalize(child.name).includes(wanted)) found.push({ id: child.id, label: `${area.name} › ${child.name}`, count: child.count })
  }
  return found.slice(0, 6)
}
