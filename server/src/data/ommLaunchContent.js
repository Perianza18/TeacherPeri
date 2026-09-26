import { OMM_CURRICULUM } from './ommCurriculum.js'
import { problemas } from './problemasReales.js'
import { OMM_PRE_CYCLE_LESSONS } from './ommLaunchContent.preCycle.js'
import { OMM_CYCLE_1_LESSONS } from './ommLaunchContent.cycle1.js'

export const OMM_BATCH_1_ROOT_SLUGS = Object.freeze([
  'fundamentos-para-olimpiadas',
  'consejos-para-empezar-a-entrenar',
  'tecnicas-de-demostracion',
  'geometria-basica-para-olimpiadas',
  'algebra-basica-para-olimpiadas',
  'divisibilidad-y-primos',
  'conteo-basico',
  'principio-de-casillas',
  'digitos-y-sistemas-de-numeracion',
  'entrenamiento-mixto-ciclo-1',
])

export const OMM_LAUNCH_CONTENT_BATCH_1 = Object.freeze({
  batch: 1,
  publicationStatus: 'draft',
  lessons: Object.freeze([...OMM_PRE_CYCLE_LESSONS, ...OMM_CYCLE_1_LESSONS]),
})

function curriculumMaps(curriculum) {
  const paths = new Map(curriculum.paths.map((path) => [path.slug, path]))
  const children = new Map()
  curriculum.references.forEach((reference) => {
    if (!children.has(reference.parentSlug)) children.set(reference.parentSlug, [])
    children.get(reference.parentSlug).push(reference.childSlug)
  })
  return { paths, children }
}

export function batch1CurriculumScope(curriculum = OMM_CURRICULUM) {
  const { paths, children } = curriculumMaps(curriculum)
  const groups = new Set()
  const leaves = new Set()
  function visit(slug) {
    const path = paths.get(slug)
    if (!path) throw new Error(`Batch 1 references unknown curriculum Path ${slug}.`)
    const childSlugs = children.get(slug) || []
    if (childSlugs.length) {
      groups.add(slug)
      childSlugs.forEach(visit)
    } else {
      leaves.add(slug)
    }
  }
  OMM_BATCH_1_ROOT_SLUGS.forEach(visit)
  return { groups, leaves }
}

export function validateOmmLaunchContentBatch1(definition = OMM_LAUNCH_CONTENT_BATCH_1, curriculum = OMM_CURRICULUM) {
  const errors = []
  const { paths, children } = curriculumMaps(curriculum)
  const scope = batch1CurriculumScope(curriculum)
  const problemCodes = new Set(problemas.map((problem) => problem.codigo))
  const seenPaths = new Set()
  const theoryKeys = new Set()
  const theoryTitles = new Set()

  for (const groupSlug of scope.groups) {
    if (!(children.get(groupSlug) || []).length) errors.push(`Group Path ${groupSlug} has no children.`)
  }

  for (const lesson of definition.lessons) {
    if (seenPaths.has(lesson.pathSlug)) errors.push(`Duplicate lesson for ${lesson.pathSlug}.`)
    seenPaths.add(lesson.pathSlug)
    if (!scope.leaves.has(lesson.pathSlug)) errors.push(`${lesson.pathSlug} is outside Batch 1 or is not a leaf.`)
    if (!paths.has(lesson.pathSlug)) errors.push(`${lesson.pathSlug} does not exist in the curriculum.`)
    if (paths.get(lesson.pathSlug)?.publicationStatus !== 'draft') errors.push(`${lesson.pathSlug} must remain draft.`)
    if (!lesson.theory?.key || theoryKeys.has(lesson.theory?.key)) errors.push(`Invalid or duplicate Theory key for ${lesson.pathSlug}.`)
    theoryKeys.add(lesson.theory?.key)
    if (!lesson.theory?.title || theoryTitles.has(lesson.theory?.title)) errors.push(`Invalid or ambiguous Theory title for ${lesson.pathSlug}.`)
    theoryTitles.add(lesson.theory?.title)
    if (lesson.theory?.publicationStatus !== 'draft') errors.push(`${lesson.theory?.key} must remain draft.`)
    if ((lesson.theory?.content || '').length < 700) errors.push(`${lesson.theory?.key} is too short to be meaningful Theory.`)
    for (const heading of ['IDEAS CLAVE', 'EJEMPLO TRABAJADO', 'ERRORES FRECUENTES', 'PRACTICA', 'EN RESUMEN']) {
      if (!lesson.theory?.content.includes(heading)) errors.push(`${lesson.theory?.key} is missing ${heading}.`)
    }
    if (((lesson.theory?.content.match(/\$/g) || []).length % 2) !== 0) errors.push(`${lesson.theory?.key} has unbalanced math delimiters.`)
    if (lesson.steps.length < 3 || lesson.steps.length > 5) errors.push(`${lesson.pathSlug} must have 3–5 Steps.`)
    const orders = lesson.steps.map((step) => step.order)
    if (new Set(orders).size !== orders.length || orders.some((order, index) => order !== index + 1)) errors.push(`${lesson.pathSlug} has invalid Step order.`)
    for (const step of lesson.steps) {
      const references = [...step.theoryKeys, ...step.problemCodes]
      if ((step.description || '').trim().length < 35 && !references.length) errors.push(`${lesson.pathSlug} Step ${step.order} is a placeholder.`)
      for (const key of step.theoryKeys) if (key !== lesson.theory.key) errors.push(`${lesson.pathSlug} Step ${step.order} references unknown Theory ${key}.`)
      for (const code of step.problemCodes) if (!problemCodes.has(code)) errors.push(`${lesson.pathSlug} Step ${step.order} references nonexistent Problem ${code}.`)
    }
  }

  for (const leafSlug of scope.leaves) if (!seenPaths.has(leafSlug)) errors.push(`Batch 1 leaf ${leafSlug} has zero Steps.`)
  for (const lesson of definition.lessons) {
    if (/ciclo-[2345]|simulacro/u.test(lesson.pathSlug)) errors.push(`${lesson.pathSlug} is forbidden in Batch 1.`)
  }
  if (definition.publicationStatus !== 'draft') errors.push('Batch 1 definition must remain draft.')
  if (errors.length) throw new Error(`Invalid OMM launch content Batch 1:\n- ${errors.join('\n- ')}`)
  return true
}

export function ommLaunchContentBatch1Report(definition = OMM_LAUNCH_CONTENT_BATCH_1) {
  const theoryCount = definition.lessons.length
  const steps = definition.lessons.flatMap((lesson) => lesson.steps)
  const problemCodes = [...new Set(steps.flatMap((step) => step.problemCodes))]
  const lines = definition.lessons.map((lesson) => {
    const theoryRefs = lesson.steps.reduce((sum, step) => sum + step.theoryKeys.length, 0)
    const problemRefs = lesson.steps.reduce((sum, step) => sum + step.problemCodes.length, 0)
    return `✓ ${lesson.pathSlug} — ${lesson.steps.length} Steps · ${theoryRefs} Theory refs · ${problemRefs} Problem refs`
  })
  return [
    'OMM launch content — Batch 1',
    ...lines,
    '',
    'Resumen',
    `- Leaves ready in source: ${definition.lessons.length}`,
    `- Steps: ${steps.length}`,
    `- Theory records: ${theoryCount}`,
    `- Existing Problems reused: ${problemCodes.length}${problemCodes.length ? ` (${problemCodes.join(', ')})` : ''}`,
    `- Publication status: ${definition.publicationStatus}`,
  ].join('\n')
}

validateOmmLaunchContentBatch1()
