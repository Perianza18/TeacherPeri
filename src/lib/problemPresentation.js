// Only display a title when it identifies a particular problem in a source.
// Older contest records use codes instead of the structured problemNumber.
export function sourceProblemTitle(problem = {}) {
  const title = String(problem.titulo || '').trim()
  if (/^.{2,80}\b(?:19|20)\d{2}\s*[·–—-]?\s*problema\s+[A-Z]?\d+$/i.test(title)) return title
  const source = String(problem.competition || problem.tipo || '').trim()
  const year = String(problem.año || problem.year || '').trim()
  const code = String(problem.codigo || '')
  const putnam = /^PUTNAM-\d{4}-([AB]\d+)$/i.exec(code)
  const ommu = /^OMMU-(?:PR|NAC)-\d{4}-(\d+)$/i.exec(code)
  const number = putnam?.[1]?.toUpperCase() || (Number.isInteger(problem.problemNumber) && problem.problemNumber > 0 ? String(problem.problemNumber) : ommu?.[1])
  if (source && !/^teacherperi$/i.test(source) && /^\d{4}$/.test(year) && number) return `${source} ${year} · Problema ${number}`
  return ''
}

export function problemTopics(problem = {}) {
  const area = String(problem.tema || '').trim()
  const names = (problem.topics || []).map((topic) => typeof topic === 'object' && topic ? topic.name : '').filter(Boolean)
  return [...new Set([area, ...names].filter(Boolean))]
}

// A submission account identifies who entered a problem, not its contest proposer.
export function problemCredit(problem = {}) {
  const source = String(problem.competition || problem.tipo || '').trim()
  const attribution = String(problem.sourceAttribution || '').trim()
  if (/^teacherperi$/i.test(source) || (!source && /^TP-/i.test(problem.codigo || ''))) {
    return { label: 'Fuente', source: 'Material original de TeacherPeri.' }
  }
  const names = [
    [/^OMM(?:\s+Estatal)?$/i, 'Olimpiada Mexicana de Matemáticas'],
    [/^OMMU(?:\s|$)/i, 'Olimpiada Mexicana de Matemáticas para Universitarios'],
    [/^OMMEB$/i, 'Olimpiada Mexicana de Matemáticas para Educación Básica'],
    [/^IMO$/i, 'Olimpiada Internacional de Matemáticas'],
    [/^Putnam$/i, 'William Lowell Putnam Mathematical Competition'],
  ]
  // OMM regional exams name their region: «Olimpiada Mexicana de Matemáticas, Regional Sureste».
  const region = /^OMM Regional$/i.test(source) && String(problem.round || '').trim()
  const competition = (region && `Olimpiada Mexicana de Matemáticas, Regional ${region}`)
    || names.find(([pattern]) => pattern.test(source))?.[1]
    || (problem.competition && !/^teacherperi$/i.test(source) ? source : '')
  if (competition) {
    const author = /(?:^|\n)\s*Autor(?:a)?:\s*([^\n]+)/i.exec(attribution)?.[1]?.trim()
    return { label: 'Créditos y fuente', source: `${competition}.`, author }
  }
  return attribution ? { label: 'Fuente', source: attribution } : null
}
