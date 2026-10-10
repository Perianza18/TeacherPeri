import { describe, expect, it } from 'vitest'
import { OMM_CURRICULUM, curriculumCounts, ommCurriculumTree, validateOmmCurriculumDefinition } from '../data/ommCurriculum.js'

describe('OMM Curriculum Draft v2', () => {
  it('keeps exactly five root-owned presentation sections and the approved chronology', () => {
    expect(validateOmmCurriculumDefinition()).toBe(true)
    expect(OMM_CURRICULUM.sections).toHaveLength(5)
    expect(OMM_CURRICULUM.rootEntries.map((item) => item.child.title).slice(0, 3)).toEqual(['Fundamentos para Olimpiadas', 'Consejos para Empezar a Entrenar', 'Técnicas de Demostración'])
    expect(OMM_CURRICULUM.rootEntries.map((item) => item.child.title).slice(-2)).toEqual(['Consejos para Competir', 'Simulacros para la OMM'])
  })

  it('places sections only on root references and ends every cycle with mixed training', () => {
    expect(OMM_CURRICULUM.references.filter((item) => item.sectionKey && item.parentSlug !== OMM_CURRICULUM.root.slug)).toEqual([])
    OMM_CURRICULUM.sections.forEach((section, index) => {
      const entries = OMM_CURRICULUM.rootEntries.filter((item) => item.sectionKey === section.key)
      expect(entries.at(-1).child.slug).toBe(`entrenamiento-mixto-ciclo-${index + 1}`)
    })
    expect(OMM_CURRICULUM.paths.filter((item) => item.slug.startsWith('entrenamiento-mixto-')).every((item) => item.steps.length === 0)).toBe(true)
  })

  it('opts only Ciclos 4–5 root topics into safe unavailable previews', () => {
    const previews = OMM_CURRICULUM.references.filter((item) => item.previewWhenUnavailable)
    expect(new Set(previews.map((item) => item.sectionKey))).toEqual(new Set(['cycle-4', 'cycle-5']))
    expect(previews).toHaveLength(19)
    expect(previews.map((item) => item.childSlug)).toEqual([
      'eje-radical',
      'teoremas-modulares',
      'sucesiones-y-recurrencias',
      'transformaciones-geometricas',
      'funciones-aritmeticas-y-valuaciones',
      'biyecciones-y-conteo-recursivo',
      'ecuaciones-funcionales-1',
      'juegos-y-estrategias',
      'entrenamiento-mixto-ciclo-4',
      'semejanza-espiral',
      'ecuaciones-funcionales-2',
      'trigonometria-olimpica',
      'grafos-para-olimpiadas',
      'construcciones-auxiliares-y-estrategias-geometricas',
      'estrategias-de-teoria-de-numeros',
      'estrategias-de-desigualdades',
      'estrategias-algebraicas',
      'estrategias-combinatorias',
      'entrenamiento-mixto-ciclo-5',
    ])
    expect(OMM_CURRICULUM.references.filter((item) => item.parentSlug !== OMM_CURRICULUM.root.slug).every((item) => !item.previewWhenUnavailable)).toBe(true)
  })

  it('preserves ordered nested groups and confirmed simulation/number-theory children', () => {
    const bySlug = new Map(OMM_CURRICULUM.paths.map((item) => [item.slug, item]))
    expect(bySlug.get('fundamentos-para-olimpiadas').children.map((item) => item.slug)).toEqual(['que-es-la-omm', 'por-que-hacer-olimpiadas-de-matematicas', 'como-entrenar-para-una-olimpiada', 'como-abordar-un-problema', 'introduccion-a-las-demostraciones', 'como-escribir-una-solucion'])
    expect(bySlug.get('simulacros-para-la-omm').children.map((item) => item.slug)).toEqual(['simulacros-de-entrenamiento', 'como-aprovechar-un-simulacro', 'simulacros-completos-nivel-omm'])
    expect(bySlug.get('estrategias-de-teoria-de-numeros').children.map((item) => item.slug)).toEqual(['descenso-infinito', 'salto-de-vieta'])
    expect(['estrategias-de-desigualdades', 'estrategias-algebraicas', 'estrategias-combinatorias'].every((slug) => bySlug.get(slug).childrenPending)).toBe(true)
  })

  it('renders a recursive inspectable tree and exposes the expected structural counts', () => {
    const tree = ommCurriculumTree(); const counts = curriculumCounts()
    expect(tree).toContain('Fundamentos para Olimpiadas [Group Path]')
    expect(tree).toContain('Homotecia [Intended Leaf]')
    expect(tree).toContain('Estrategias Algebraicas [Group pending review]')
    expect(counts).toEqual({ paths: 128, rootReferences: 46, nestedReferences: 81, groups: 34, intendedLeaves: 94, unresolvedGroups: 5, sections: 5, authoredSteps: 0, educationalReferences: 0 })
  })
})
