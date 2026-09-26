import katex from 'katex'
import { describe, expect, it } from 'vitest'
import {
  OMM_LAUNCH_CONTENT_BATCH_1,
  batch1CurriculumScope,
  validateOmmLaunchContentBatch1,
} from '../data/ommLaunchContent.js'
import {
  assertNoAuthoredContentConflict,
  stepMatches,
  theoryMatches,
} from '../data/ommLaunchContent.identity.js'

describe('OMM launch content Batch 1', () => {
  it('populates every and only Batch 1 curriculum leaf', () => {
    expect(validateOmmLaunchContentBatch1()).toBe(true)
    const scope = batch1CurriculumScope()
    expect(scope.leaves.size).toBe(35)
    expect(OMM_LAUNCH_CONTENT_BATCH_1.lessons).toHaveLength(35)
    expect(new Set(OMM_LAUNCH_CONTENT_BATCH_1.lessons.map((lesson) => lesson.pathSlug))).toEqual(scope.leaves)
    expect(OMM_LAUNCH_CONTENT_BATCH_1.lessons.some((lesson) => /ciclo-[2345]|simulacro/u.test(lesson.pathSlug))).toBe(false)
  })

  it('keeps Groups Step-free and gives each leaf meaningful ordered Steps', () => {
    const scope = batch1CurriculumScope()
    expect(OMM_LAUNCH_CONTENT_BATCH_1.lessons.some((lesson) => scope.groups.has(lesson.pathSlug))).toBe(false)
    OMM_LAUNCH_CONTENT_BATCH_1.lessons.forEach((lesson) => {
      expect(lesson.steps.length).toBeGreaterThanOrEqual(3)
      expect(lesson.steps.length).toBeLessThanOrEqual(5)
      expect(lesson.steps.map((step) => step.order)).toEqual(lesson.steps.map((_, index) => index + 1))
      expect(lesson.steps.every((step) => step.description.length >= 35 || step.theoryKeys.length + step.problemCodes.length > 0)).toBe(true)
    })
  })

  it('resolves Theory references in-source and keeps every authored record draft', () => {
    const theories = new Set(OMM_LAUNCH_CONTENT_BATCH_1.lessons.map((lesson) => lesson.theory.key))
    expect(OMM_LAUNCH_CONTENT_BATCH_1.publicationStatus).toBe('draft')
    OMM_LAUNCH_CONTENT_BATCH_1.lessons.forEach((lesson) => {
      expect(lesson.theory.publicationStatus).toBe('draft')
      expect(lesson.theory.content.length).toBeGreaterThanOrEqual(700)
      lesson.steps.forEach((step) => step.theoryKeys.forEach((key) => expect(theories.has(key)).toBe(true)))
    })
  })

  it('reuses only the reviewed base/digit Problem candidates without inventing simulations', () => {
    const codes = [...new Set(OMM_LAUNCH_CONTENT_BATCH_1.lessons.flatMap((lesson) => lesson.steps.flatMap((step) => step.problemCodes)))]
    expect(codes).toEqual(['PUTNAM-2023-A5', 'PUTNAM-2023-B2'])
    expect(JSON.stringify(OMM_LAUNCH_CONTENT_BATCH_1)).not.toMatch(/simulacro/i)
  })

  it('detects empty leaves, duplicate order, unknown references, publication, and scope regressions', () => {
    const missing = structuredClone(OMM_LAUNCH_CONTENT_BATCH_1)
    missing.lessons.pop()
    expect(() => validateOmmLaunchContentBatch1(missing)).toThrow('zero Steps')

    const duplicateOrder = structuredClone(OMM_LAUNCH_CONTENT_BATCH_1)
    duplicateOrder.lessons[0].steps[1].order = 1
    expect(() => validateOmmLaunchContentBatch1(duplicateOrder)).toThrow('invalid Step order')

    const badReference = structuredClone(OMM_LAUNCH_CONTENT_BATCH_1)
    badReference.lessons[0].steps[0].problemCodes.push('INVENTADO-1')
    expect(() => validateOmmLaunchContentBatch1(badReference)).toThrow('nonexistent Problem')

    const published = structuredClone(OMM_LAUNCH_CONTENT_BATCH_1)
    published.lessons[0].theory.publicationStatus = 'published'
    expect(() => validateOmmLaunchContentBatch1(published)).toThrow('must remain draft')

    const futureCycle = structuredClone(OMM_LAUNCH_CONTENT_BATCH_1)
    futureCycle.lessons[0].pathSlug = 'entrenamiento-mixto-ciclo-4'
    expect(() => validateOmmLaunchContentBatch1(futureCycle)).toThrow('outside Batch 1')
  })
})

describe('Ciclo 1 Geometry editorial review', () => {
  const geometrySlugs = [
    'angulos-paralelas-y-perpendiculares',
    'semejanza-y-congruencia',
    'areas-y-razones',
    'teorema-de-pitagoras',
  ]
  const lessons = Object.fromEntries(
    OMM_LAUNCH_CONTENT_BATCH_1.lessons
      .filter((lesson) => geometrySlugs.includes(lesson.pathSlug))
      .map((lesson) => [lesson.pathSlug, lesson]),
  )

  it('keeps all four reviewed articles beginner-facing and substantial', () => {
    expect(Object.keys(lessons)).toHaveLength(4)
    Object.values(lessons).forEach((lesson) => {
      const wordCount = lesson.theory.content.trim().split(/\s+/u).length
      expect(wordCount).toBeGreaterThanOrEqual(400)
      expect(wordCount).toBeLessThanOrEqual(800)
      expect(new Set(lesson.steps.map((step) => step.title)).size).toBe(4)
    })
  })

  it('retains the core teaching targets without leaking advanced Geometry', () => {
    expect(lessons['angulos-paralelas-y-perpendiculares'].theory.content).toMatch(/360\^|opuestos por el vértice|ángulo exterior|sentido inverso/iu)
    expect(lessons['semejanza-y-congruencia'].theory.content).toMatch(/Teorema de Tales|factor de escala|LLL|ALL/iu)
    expect(lessons['areas-y-razones'].theory.content).toMatch(/misma altura|ceviana|descompone|k\^2/iu)
    expect(lessons['teorema-de-pitagoras'].theory.content).toMatch(/converso|hipotenusa|prueba por áreas|triángulos rectángulos ocultos/iu)

    const reviewedContent = Object.values(lessons).map((lesson) => lesson.theory.content).join('\n')
    expect(reviewedContent).not.toMatch(/ángulos dirigidos|cuadriláteros? cíclicos?|semejanza espiral|fórmula de Herón|abc\s*\/\s*4R|fórmula trigonométrica/iu)
  })

  it('renders every reviewed math expression with strict KaTeX parsing', () => {
    const expressions = Object.values(lessons).flatMap((lesson) => {
      const texts = [lesson.theory.content, ...lesson.steps.map((step) => step.description)]
      return texts.flatMap((content) => [...content.matchAll(/\$([^$]+)\$/gu)].map((match) => match[1]))
    })

    expect(expressions.length).toBeGreaterThan(50)
    expressions.forEach((expression) => {
      expect(() => katex.renderToString(expression, { throwOnError: true })).not.toThrow()
    })
  })
})

describe('Ciclo 1 Algebra editorial review', () => {
  const algebraSlugs = [
    'factorizacion-e-identidades',
    'manipulaciones-y-sustituciones-algebraicas',
    'ecuaciones-algebraicas',
  ]
  const lessons = Object.fromEntries(
    OMM_LAUNCH_CONTENT_BATCH_1.lessons
      .filter((lesson) => algebraSlugs.includes(lesson.pathSlug))
      .map((lesson) => [lesson.pathSlug, lesson]),
  )

  it('keeps all three reviewed articles substantial with distinct learning Steps', () => {
    expect(Object.keys(lessons)).toHaveLength(3)
    Object.values(lessons).forEach((lesson) => {
      const wordCount = lesson.theory.content.trim().split(/\s+/u).length
      expect(wordCount).toBeGreaterThanOrEqual(550)
      expect(wordCount).toBeLessThanOrEqual(800)
      expect(new Set(lesson.steps.map((step) => step.title)).size).toBe(4)
    })
  })

  it('retains the core Algebra teaching targets without later-cycle leakage', () => {
    expect(lessons['factorizacion-e-identidades'].theory.content).toMatch(/factor común|diferencia de cuadrados|suma.*cubos|¿CONVIENE DESARROLLAR O FACTORIZAR/isu)
    expect(lessons['manipulaciones-y-sustituciones-algebraicas'].theory.content).toMatch(/EMPIEZA POR EL OBJETIVO|simetría|variable temporal|TRANSFORMACIONES VÁLIDAS/iu)
    expect(lessons['ecuaciones-algebraicas'].theory.content).toMatch(/PRODUCTO CERO|RESTRICCIONES|candidatos extraños|ecuación original/iu)

    const reviewedContent = Object.values(lessons).map((lesson) => lesson.theory.content).join('\n')
    expect(reviewedContent).not.toMatch(/Vieta|progresiones? aritméticas?|progresiones? geométricas?|sumas? telescópicas?|raíces de la unidad|ecuaciones funcionales|números complejos/iu)
  })

  it('renders every reviewed Algebra expression with strict KaTeX parsing', () => {
    const expressions = Object.values(lessons).flatMap((lesson) => {
      const texts = [lesson.theory.content, ...lesson.steps.map((step) => step.description)]
      return texts.flatMap((content) => [...content.matchAll(/\$([^$]+)\$/gu)].map((match) => match[1]))
    })

    expect(expressions.length).toBeGreaterThan(70)
    expressions.forEach((expression) => {
      expect(() => katex.renderToString(expression, { throwOnError: true })).not.toThrow()
    })
  })
})

describe('OMM content application identity safety', () => {
  const theory = OMM_LAUNCH_CONTENT_BATCH_1.lessons[0].theory
  const theoryDocument = { ...theory, topics: [], tags: [], categories: [] }
  const step = OMM_LAUNCH_CONTENT_BATCH_1.lessons[0].steps[0]
  const stepDocument = {
    ...step,
    teacherperiReferences: [{ contentType: 'Theory', target: 'theory-id' }],
    extraResources: [],
  }

  it('accepts exact repeat application identities', () => {
    expect(theoryMatches(theoryDocument, theory)).toBe(true)
    expect(stepMatches(stepDocument, step, ['Theory:theory-id'])).toBe(true)
    expect(assertNoAuthoredContentConflict('Theory', theory.title, true)).toBe(true)
  })

  it('refuses Theory and Step conflicts instead of overwriting authored content', () => {
    expect(theoryMatches({ ...theoryDocument, content: 'Contenido independiente.' }, theory)).toBe(false)
    expect(stepMatches({ ...stepDocument, description: 'Trabajo independiente.' }, step, ['Theory:theory-id'])).toBe(false)
    expect(() => assertNoAuthoredContentConflict('Theory', theory.title, false)).toThrow('refusing to overwrite independently authored content')
    expect(() => assertNoAuthoredContentConflict('Step', 'ruta:1', false)).toThrow('refusing to overwrite independently authored content')
  })
})
