import { describe, expect, it } from 'vitest'
import { problemCredit, problemTopics, sourceProblemTitle } from '../../../src/lib/problemPresentation.js'

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
    expect(sourceProblemTitle({ titulo: 'OMM · Estatal · Jalisco · 2024 · Problema 2', competition: 'OMM', año: '2024', problemNumber: 2, codigo: 'U-00005' })).toBe('OMM · Estatal · Jalisco · 2024 · Problema 2')
    expect(sourceProblemTitle({ competition: 'OMM', año: '2024', codigo: 'U-00005' })).toBe('')
  })
  it('shows the area and distinct available topic names', () => {
    expect(problemTopics({ tema: 'Geometría', topics: [{ name: 'Geometría' }, { name: 'Triángulos' }, { name: 'Triángulos' }] })).toEqual(['Geometría', 'Triángulos'])
    expect(problemTopics({ topics: ['unpopulated-id'] })).toEqual([])
  })
})

describe('problem credits', () => {
  it('uses the exact original-material credit', () => {
    expect(problemCredit({ competition: 'TeacherPeri', sourceAttribution: 'Material original de TeacherPeri. Práctica editorial.' })).toEqual({ label: 'Fuente', source: 'Material original de TeacherPeri.' })
  })
  it('expands competition names and does not mistake a submitter for the original proposer', () => {
    expect(problemCredit({ competition: 'OMM Estatal', sourceAttribution: 'OMM › 2024. Propuesto por @ana.' })).toEqual({ label: 'Créditos y fuente', source: 'Olimpiada Mexicana de Matemáticas.', author: undefined })
    expect(problemCredit({ tipo: 'OMMU Nacional' }).source).toBe('Olimpiada Mexicana de Matemáticas para Universitarios.')
    expect(problemCredit({ competition: 'OMM', sourceAttribution: 'Autor: Nombre Conocido' }).author).toBe('Nombre Conocido')
  })
  it('retains attribution for other community material', () => {
    expect(problemCredit({ sourceAttribution: 'Propuesto por @ana.' })).toEqual({ label: 'Fuente', source: 'Propuesto por @ana.' })
  })
})
