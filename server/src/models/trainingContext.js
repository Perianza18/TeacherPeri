export const COMPETITIONS = ['OMM', 'OMMEB']
export const ROUNDS = ['escolar', 'municipal', 'estatal', 'nacional']
export const SCHOOL_STAGES = ['primaria', 'secundaria', 'bachillerato']

// All selected dimensions must belong to the SAME assessment of one problem.
export function trainingContextFilter(query) {
  const match = {}
  for (const [key, options] of [['contest', COMPETITIONS], ['stage', ROUNDS], ['schoolStage', SCHOOL_STAGES]]) {
    if (query[key]) {
      if (!options.includes(query[key])) throw new Error(`Filtro inválido: ${key}`)
      match[key] = query[key]
    }
  }
  if (query.grade) {
    if (!match.schoolStage || !/^[1-6]$/.test(String(query.grade)) || Number(query.grade) > (match.schoolStage === 'primaria' ? 6 : 3)) throw new Error('Elige un grado válido para la etapa escolar.')
    match.grade = Number(query.grade)
  }
  if (query.challenge) {
    if (!/^[1-6]$/.test(String(query.challenge))) throw new Error('El reto debe ser de 1 a 6.')
    if (!match.contest || !match.stage) throw new Error('Elige competencia y etapa antes del reto.')
    match.challenge = Number(query.challenge)
  }
  return Object.keys(match).length ? { trainingContexts: { $elemMatch: match } } : {}
}
