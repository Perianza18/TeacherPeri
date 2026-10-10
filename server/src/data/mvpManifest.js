import { createHash } from 'node:crypto'
import { OMM_CURRICULUM } from './ommCurriculum.js'
import { MVP_LESSONS } from './mvpLessons.js'
import { MVP_PROBLEMS } from './mvpProblems.js'

export const CONTENT_RELEASE = 'omm-mvp-1'
export const contentId = (model, key) => createHash('sha256').update(`teacherperi:${model}:${key}`).digest('hex').slice(0, 24)
export const AREAS = { geometry: 'Geometría', algebra: 'Álgebra', 'number-theory': 'Teoría de Números', combinatorics: 'Combinatoria', orientation: 'Cómo entrenar', proof: 'Demostraciones', strategy: 'Estrategia', mixed: 'Entrenamiento mixto' }
const practice = (slug) => MVP_PROBLEMS.filter((p) => p.pathSlug === slug).map((p) => p.codigo)
export const MVP_LISTS = [
  ...['geometry', 'algebra', 'number-theory', 'combinatorics'].map((area) => ({
    key: `practica-${area}`, title: `${AREAS[area]} — práctica de Ciclo 1`,
    summary: 'Colección original organizada para trabajar después de las guías. Intenta cada problema antes de consultar la pista; escribe una prueba y usa la solución para revisar el argumento, no solo el resultado.',
    area, problemCodes: MVP_PROBLEMS.filter((p) => MVP_LESSONS.find((l) => l.pathSlug === p.pathSlug)?.area === area && !p.codigo.startsWith('TP-M')).map((p) => p.codigo),
  })),
  { key: 'mixto-ciclo-1', title: 'Ciclo 1 — selección mixta', area: 'mixed', summary: 'Un bloque de cinco problemas de distintas herramientas. Dedica veinte minutos por problema, registra las ideas exploradas y revisa después una solución completa.', problemCodes: ['TP-C05', 'TP-G07', 'TP-A02', 'TP-C01', 'TP-D01'] },
  { key: 'congruencias', title: 'Primeros pasos en congruencias', area: 'number-theory', summary: 'Residuos, obstrucciones e inversos. Resuelve primero los cálculos módulo siete y cuatro; después usa el MCD en las congruencias lineales.', problemCodes: [...practice('aritmetica-modular'), ...practice('inversos-y-congruencias-lineales')] },
  { key: 'omm-oficial', title: 'Preparación y materiales de la OMM', area: 'orientation', summary: 'Portal de la Olimpiada Mexicana de Matemáticas: consulta preparación, publicaciones y convocatorias en la fuente oficial. Selecciona un recurso acorde con tu nivel. Los materiales permanecen en el sitio del editor.', sourceOrganization: 'Olimpiada Mexicana de Matemáticas', sourceUrl: 'https://www.ommenlinea.org/', problemCodes: [] },
  { key: 'imo-oficial', title: 'Archivo oficial de problemas de la IMO', area: 'orientation', summary: 'Archivo de la International Mathematical Olympiad para una etapa avanzada. Úsalo después de consolidar las herramientas básicas; selecciona idioma y año en la fuente oficial. No es una lista introductoria de Ciclo 1.', sourceOrganization: 'International Mathematical Olympiad', sourceUrl: 'https://www.imo-official.org/problems/', level: 'avanzado', problemCodes: [] },
  { key: 'nrich', title: 'NRICH — explorar y justificar', area: 'orientation', summary: 'Recursos de NRICH, University of Cambridge, con problemas y actividades en inglés. Elige por tema y compara distintas estrategias. El contenido se consulta directamente en su sitio.', sourceOrganization: 'NRICH, University of Cambridge', sourceUrl: 'https://nrich.maths.org/', problemCodes: [] },
]
export const MVP_EXAMS = [
  { key: 'ciclo-1-a', round: 'Ciclo 1 · Práctica A', durationMinutes: 90, instructions: 'Práctica original introductoria; no es un examen oficial de la OMM. Trabaja sin soluciones durante 90 minutos. Escribe argumentos completos. Después compara cada solución y registra una mejora concreta.', problemCodes: ['TP-C05', 'TP-G08', 'TP-A01', 'TP-N02', 'TP-D04'] },
  { key: 'ciclo-1-b', round: 'Ciclo 1 · Práctica B', durationMinutes: 90, instructions: 'Segunda práctica original de Ciclo 1. Dedica 90 minutos y justifica cada paso. No consultes pistas hasta terminar el bloque. Revisa restricciones, unidades y si tu solución cubre todos los casos.', problemCodes: ['TP-G04', 'TP-A06', 'TP-N04', 'TP-C06', 'TP-D03'] },
  { key: 'congruencias', round: 'Ciclo 2 · Taller de congruencias', durationMinutes: 60, instructions: 'Taller parcial de Ciclo 2, centrado en congruencias. No representa un simulacro completo de nivel OMM. Usa 60 minutos; explica el módulo elegido y comprueba las soluciones en el módulo original.', problemCodes: ['TP-M02', 'TP-M01', 'TP-M04', 'TP-M03'] },
]

// Sequential dependency order; references are resolved to existing IDs by the importer.
export function buildMvpManifest(resolve = (model, key) => contentId(model, key)) {
  const entries = []
  const add = (model, key, data, identity) => entries.push({ model, key, _id: resolve(model, key), data, identity })
  add('Category', 'omm', { name: 'Preparación para la OMM', parent: null }, { name: 'Preparación para la OMM', parent: null })
  for (const [area, name] of Object.entries(AREAS)) {
    const parent = resolve('Category', 'omm')
    add('Category', area, { name, parent }, { name, parent })
    add('Topic', area, { name, slug: `omm-${area}`, parent: null }, { slug: `omm-${area}` })
  }
  add('Tag', 'original', { name: 'teacherperi-original', slug: 'teacherperi-original', label: 'Original TeacherPeri' }, { slug: 'teacherperi-original' })
  const metadata = (area) => ({ topics: [resolve('Topic', area)], categories: [resolve('Category', area)], tags: [resolve('Tag', 'original')] })
  for (const problem of MVP_PROBLEMS) {
    const { pathSlug, ...fields } = problem
    delete fields.answer
    const area = MVP_LESSONS.find((l) => l.pathSlug === pathSlug).area
    add('Problem', problem.codigo, { ...fields, ...metadata(area), category: resolve('Category', area), año: '2026', tema: AREAS[area], tipo: 'TeacherPeri', dificultad: problem.difficulty === 'basico' ? 'Fácil' : 'Media', competition: 'TeacherPeri', sourceAttribution: 'Material original de TeacherPeri. Práctica editorial; no es un problema oficial de competencia.', publicationStatus: 'published' }, { codigo: problem.codigo })
  }
  for (const lesson of MVP_LESSONS) {
    const { key, ...fields } = lesson.theory
    add('Theory', key, { ...fields, ...metadata(lesson.area), publicationStatus: 'published' }, { title: fields.title })
  }
  for (const list of MVP_LISTS) {
    const { key, area, problemCodes, ...fields } = list
    add('List', key, { ...fields, ...metadata(area), authors: [fields.sourceOrganization || 'TeacherPeri'], sourceOrganization: fields.sourceOrganization || 'TeacherPeri', level: fields.level || 'basico', problems: problemCodes.map((code, i) => ({ problem: resolve('Problem', code), position: i + 1 })), publicationStatus: 'published' }, { title: list.title })
  }
  for (const exam of MVP_EXAMS) {
    const { key, problemCodes, ...fields } = exam
    const data = { ...fields, competition: 'TeacherPeri', year: '2026', organization: 'TeacherPeri', country: 'México', categories: [resolve('Category', key === 'congruencias' ? 'number-theory' : 'mixed')], tags: [resolve('Tag', 'original')], problems: problemCodes.map((code, i) => ({ problem: resolve('Problem', code), position: i + 1 })), publicationStatus: 'published' }
    add('Exam', key, data, { competition: data.competition, year: data.year, round: data.round })
  }
  const published = new Set(MVP_LESSONS.map((l) => l.pathSlug))
  // Only groups with actual available descendants are published.
  let changed = true
  while (changed) {
    changed = false
    for (const edge of OMM_CURRICULUM.references) if (published.has(edge.childSlug) && !published.has(edge.parentSlug)) { published.add(edge.parentSlug); changed = true }
  }
  for (const path of OMM_CURRICULUM.paths) {
    const lesson = MVP_LESSONS.find((l) => l.pathSlug === path.slug)
    const data = { slug: path.slug, title: path.title, level: path.level, description: lesson?.theory.summary || (published.has(path.slug) ? `Recorre las lecciones disponibles de ${path.title}. Los tramos pendientes están indicados como Próximamente.` : path.description), tags: [], publicationStatus: published.has(path.slug) ? 'published' : 'draft' }
    add('Path', path.slug, data, { slug: path.slug })
  }
  for (const section of OMM_CURRICULUM.sections) {
    const path = resolve('Path', OMM_CURRICULUM.root.slug)
    add('PathSection', section.key, { path, title: section.title }, { path, title: section.title })
  }
  for (const edge of OMM_CURRICULUM.references) {
    const data = { parentPath: resolve('Path', edge.parentSlug), childPath: resolve('Path', edge.childSlug), order: edge.order, section: edge.sectionKey ? resolve('PathSection', edge.sectionKey) : null, previewWhenUnavailable: edge.parentSlug === OMM_CURRICULUM.root.slug }
    add('PathReference', `${edge.parentSlug}:${edge.childSlug}`, data, { parentPath: data.parentPath, childPath: data.childPath })
  }
  for (const lesson of MVP_LESSONS) for (const step of lesson.steps) {
    const path = resolve('Path', lesson.pathSlug)
    const references = [...step.theoryKeys.map((key) => ({ contentType: 'Theory', target: resolve('Theory', key) })), ...step.problemCodes.map((key) => ({ contentType: 'Problem', target: resolve('Problem', key) })), ...(step.listKeys || []).map((key) => ({ contentType: 'List', target: resolve('List', key) })), ...(step.examKeys || []).map((key) => ({ contentType: 'Exam', target: resolve('Exam', key) }))]
    add('Step', `${lesson.pathSlug}:${step.order}`, { path, order: step.order, title: step.title, description: step.description, teacherperiReferences: references, extraResources: [] }, { path, order: step.order })
  }
  return entries
}
