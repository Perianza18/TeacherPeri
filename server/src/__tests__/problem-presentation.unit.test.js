import { describe, expect, it } from 'vitest'
import { problemTopics, sourceProblemTitle } from '../../../src/lib/problemPresentation.js'

describe('problem card presentation', () => {
  it('omits arbitrary titles and internal codes', () => {
    expect(sourceProblemTitle({ titulo: 'Un cuadrado menos uno', codigo: 'TP-A02', competition: 'TeacherPeri', año: '2026' })).toBe('')
    expect(sourceProblemTitle({ titulo: 'Un título cualquiera', codigo: 'P-1' })).toBe('')
  })
  it('identifies contest problems by source, year and position', () => {
    expect(sourceProblemTitle({ tipo: 'OMMU Nacional', año: '2024', codigo: 'OMMU-NAC-2024-1', titulo: 'Cualquier título' })).toBe('OMMU Nacional 2024 · Problema 1')
    expect(sourceProblemTitle({ competition: 'OMM', año: '2025', problemNumber: 1 })).toBe('OMM 2025 · Problema 1')
    expect(sourceProblemTitle({ tipo: 'Putnam', año: '2021', codigo: 'PUTNAM-2021-B2' })).toBe('Putnam 2021 · Problema B2')
    expect(sourceProblemTitle({ titulo: 'OMM 2025 Problema 1' })).toBe('OMM 2025 Problema 1')
  })
  it('shows the area and distinct available topic names', () => {
    expect(problemTopics({ tema: 'Geometría', topics: [{ name: 'Geometría' }, { name: 'Triángulos' }, { name: 'Triángulos' }] })).toEqual(['Geometría', 'Triángulos'])
    expect(problemTopics({ topics: ['unpopulated-id'] })).toEqual([])
  })
})
