// Pure helpers for the Inicio page: the «Problema del día» and the ciclos of
// the featured Ruta. No React and no network, so they can be unit tested.

const DAY_MS = 86_400_000
const PROBLEM_TIME_ZONE = 'America/Mexico_City'

// Ciclo names shown when the featured Ruta cannot be loaded.
export const DEFAULT_CICLOS = [
  'Primeros Pasos',
  'Herramientas Fundamentales',
  'Construyendo Técnica',
  'Ampliando Herramientas',
  'Integración y Estrategia',
]

// Whole days between 1970-01-01 and the calendar date in `timeZone`, so the
// problem changes at midnight in Mexico City, not at midnight UTC.
export function daysSinceEpoch(date = new Date(), timeZone = PROBLEM_TIME_ZONE) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(date)
  const value = (type) => Number(parts.find((part) => part.type === type).value)
  return Math.floor(Date.UTC(value('year'), value('month') - 1, value('day')) / DAY_MS)
}

// Same problem for everyone on the same day: sort by _id, then index by date.
export function pickProblemOfTheDay(problems, date = new Date()) {
  if (!Array.isArray(problems) || problems.length === 0) return null
  const sorted = [...problems].sort((a, b) => (String(a._id) < String(b._id) ? -1 : String(a._id) > String(b._id) ? 1 : 0))
  return sorted[daysSinceEpoch(date) % sorted.length]
}

// Competition statements may start with «(Día 1) » or «(Día 2) ».
export function stripDayPrefix(statement) {
  return String(statement || '').replace(/^\s*\(D[ií]a\s*\d+\)\s*/i, '')
}

// «OMMU Nacional 2024 · Problema 1»: competition (or tipo) and year, plus the
// position when the code ends in one (OMMU-NAC-2024-1). Never the title.
export function problemSourceLabel(problem) {
  if (!problem) return ''
  const source = [problem.competition || problem.tipo, problem.año].filter(Boolean).join(' ')
  const position = problem.problemNumber || /-(\d+)$/.exec(problem.codigo || '')?.[1]
  return [source, position && `Problema ${Number(position)}`].filter(Boolean).join(' · ')
}

// Ciclo names from the Ruta's section headings («Ciclo 1 — Primeros Pasos»).
export function cicloNames(path) {
  const names = (path?.presentation || [])
    .filter((item) => item.type === 'section' && item.section?.title)
    .map((item) => item.section.title.replace(/^Ciclo\s+\d+\s*[—–-]\s*/i, '').trim())
    .filter(Boolean)
  return names.length ? names : DEFAULT_CICLOS
}
