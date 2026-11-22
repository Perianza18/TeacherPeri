// Public base URL of each content library, keyed by its API name.
// Every library lives under Entrenamiento. External resources are Lists
// too, shown and opened under /entrenamiento/recursos.
export const LIBRARY_BASE = {
  problems: '/entrenamiento/problemas',
  theory: '/entrenamiento/teoria',
  lists: '/entrenamiento/listas',
  resources: '/entrenamiento/recursos',
  exams: '/entrenamiento/examenes',
}

// Card and page title of an exam: «OMM 2024», «OMM Estatal 2023 · Jalisco»,
// «TeacherPeri 2026 · Ciclo 1 · Práctica A». Year and round may be missing.
export function examTitle({ competition, year, round } = {}) {
  return [[competition, year].filter(Boolean).join(' '), round].filter(Boolean).join(' · ')
}

// Use the original exam number, which may differ from the list position when
// some problems have not yet been published.
export function examProblemTitle(problem) {
  return Number.isInteger(problem?.problemNumber) && problem.problemNumber > 0
    ? `Problema ${problem.problemNumber}`
    : problem?.titulo || problem?.codigo
}
