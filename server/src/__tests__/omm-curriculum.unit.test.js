import { describe, expect, it } from 'vitest'
import {
  OMM_CURRICULUM,
  ommCurriculumTable,
  ommCurriculumTree,
  validateOmmCurriculumDefinition,
} from '../data/ommCurriculum.js'

function curriculumCopy() {
  return structuredClone(OMM_CURRICULUM)
}

describe('OMM curriculum definition', () => {
  it('defines five presentation sections in the agreed order without creating cycle Paths', () => {
    expect(validateOmmCurriculumDefinition()).toBe(true)
    expect(OMM_CURRICULUM.sections.map(({ title }) => title)).toEqual([
      'Ciclo 1 — Primeros Pasos',
      'Ciclo 2 — Herramientas Fundamentales',
      'Ciclo 3 — Construyendo Técnica',
      'Ciclo 4 — Ampliando Herramientas',
      'Ciclo 5 — Integración y Estrategia',
    ])
    expect(OMM_CURRICULUM.entries.some(({ path }) => /^ciclo-[1-5]$/.test(path.slug))).toBe(false)
  })

  it('keeps one global child order with pre-cycle, sectioned, and post-cycle Paths', () => {
    expect(OMM_CURRICULUM.entries.map(({ order }) => order)).toEqual(
      Array.from({ length: OMM_CURRICULUM.entries.length }, (_, index) => index + 1),
    )
    expect(OMM_CURRICULUM.entries.slice(0, 3).map(({ path }) => path.title)).toEqual([
      'Fundamentos de la Olimpiada',
      'Técnicas de Demostración',
      'Consejos para Empezar a Entrenar',
    ])
    expect(OMM_CURRICULUM.entries.slice(-2).map(({ path }) => path.title)).toEqual([
      'Simulacros OMM',
      'Consejos para Competir',
    ])
  })

  it('interleaves all four subject areas and ends every cycle with an unauthored mixed leaf Path', () => {
    OMM_CURRICULUM.sections.forEach((section, index) => {
      const entries = OMM_CURRICULUM.entries.filter(({ sectionKey }) => sectionKey === section.key)
      const areas = new Set(entries.map(({ path }) => path.area))
      for (const requiredArea of ['geometry', 'algebra', 'number-theory', 'combinatorics']) {
        expect(areas.has(requiredArea)).toBe(true)
      }
      const mixed = entries.at(-1).path
      expect(mixed.slug).toBe(`entrenamiento-mixto-ciclo-${index + 1}`)
      expect(mixed.steps).toEqual([])
    })
  })

  it('fails closed when a structural curriculum invariant is broken', () => {
    const duplicateOrder = curriculumCopy()
    duplicateOrder.entries[1].order = 1
    expect(() => validateOmmCurriculumDefinition(duplicateOrder)).toThrow('PathReference order')

    const cycleWithoutMixedEnding = curriculumCopy()
    const cycleOne = cycleWithoutMixedEnding.entries.filter(({ sectionKey }) => sectionKey === 'cycle-1')
    cycleOne.at(-1).path.slug = 'otro-final'
    expect(() => validateOmmCurriculumDefinition(cycleWithoutMixedEnding)).toThrow('must end')

    const mixedWithPlaceholderStep = curriculumCopy()
    const mixed = mixedWithPlaceholderStep.entries.find(({ path }) => path.slug === 'entrenamiento-mixto-ciclo-1').path
    mixed.steps.push({ order: 1, title: 'Reconoce' })
    expect(() => validateOmmCurriculumDefinition(mixedWithPlaceholderStep)).toThrow('without authored Steps')

    const withoutPostCyclePaths = curriculumCopy()
    withoutPostCyclePaths.entries = withoutPostCyclePaths.entries.filter(({ placement }) => placement !== 'post')
    expect(() => validateOmmCurriculumDefinition(withoutPostCyclePaths)).toThrow('Post-cycle Paths are missing')
  })

  it('produces an inspectable tree and complete inventory table', () => {
    const tree = ommCurriculumTree()
    const table = ommCurriculumTable()
    expect(tree).toContain('[PathSection] Ciclo 5 — Integración y Estrategia')
    expect(tree).toContain('Entrenamiento Mixto — Ciclo 5')
    expect(table.split('\n')).toHaveLength(OMM_CURRICULUM.entries.length + 2)
    expect(table).toContain('`potencia-de-un-punto`')
  })

  it('keeps Simulacros OMM as an empty draft Path after the five cycles', () => {
    const simulationPath = OMM_CURRICULUM.entries.find(({ path }) => path.slug === 'simulacros-omm')
    expect(simulationPath.placement).toBe('post')
    expect(simulationPath.path.publicationStatus).toBe('draft')
    expect(simulationPath.path.steps).toEqual([])
  })
})
