// Only display a title when it identifies a particular problem in a source.
// Older contest records use codes instead of the structured problemNumber.
export function sourceProblemTitle(problem = {}) {
  const source = String(problem.competition || problem.tipo || '').trim()
  const year = String(problem.año || problem.year || '').trim()
  const code = String(problem.codigo || '')
  const putnam = /^PUTNAM-\d{4}-([AB]\d+)$/i.exec(code)
  const number = putnam?.[1]?.toUpperCase() || (Number.isInteger(problem.problemNumber) && problem.problemNumber > 0 ? String(problem.problemNumber) : /-(\d+)$/.exec(code)?.[1])
  if (source && !/^teacherperi$/i.test(source) && /^\d{4}$/.test(year) && number) return `${source} ${year} · Problema ${number}`
  const title = String(problem.titulo || '').trim()
  return /^.{2,80}\b(?:19|20)\d{2}\s*[·–—-]?\s*problema\s+[A-Z]?\d+$/i.test(title) ? title : ''
}

export function problemTopics(problem = {}) {
  const area = String(problem.tema || '').trim()
  const names = (problem.topics || []).map((topic) => typeof topic === 'object' && topic ? topic.name : '').filter(Boolean)
  return [...new Set([area, ...names].filter(Boolean))]
}
