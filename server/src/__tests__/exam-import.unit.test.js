import { describe, expect, it } from 'vitest'
import { examImportTarget, parseImportArgs, recordFigures, recordProblems, stableId } from '../scripts/import-exam-problems.js'

const record = (n, extra = {}) => ({
  codigo: `OMMR-SUR-2024-P${n}`, titulo: `Regional Sureste 2024 · Problema ${n}`, enunciado: 'Demuestra que $n^2+n$ es par para todo entero $n$.',
  solution: '', sourceAttribution: `Regional Sureste 2024, Problema ${n}.`, año: '2024', tema: 'Teoría de Números', tipo: 'OMM Regional',
  problemNumber: n, competition: 'OMM Regional', round: 'Sureste', subtopics: ['Paridad'], subtopicTopics: [],
  difficulty: 'basico', dificultad: 'Fácil', publicationStatus: 'published', figure: null, ...extra,
})

describe('exam problems import', () => {
  it('accepts a complete exam file', () => {
    expect(recordProblems([record(1), record(2)], 'sureste-2024.json')).toEqual([])
  })
  it('rejects broken math, gaps in the numbering, mixed exams and bad figures', () => {
    expect(recordProblems([record(1, { enunciado: 'Sea $\\frac{1}{2 un número entero cualquiera.' })], 'a.json').join(' ')).toMatch(/fórmula|\$/)
    expect(recordProblems([record(1), record(3, { problemNumber: 3 })], 'a.json').join(' ')).toMatch(/problem numbers/)
    expect(recordProblems([record(1), record(2, { round: 'Centro' })], 'a.json').join(' ')).toMatch(/same exam/)
    expect(recordProblems([record(1, { figure: { id: 'x', kind: 'gif', alt: 'Una figura' } })], 'a.json').join(' ')).toMatch(/invalid figure/)
    expect(recordProblems([record(1, { tema: 'Física' })], 'a.json').join(' ')).toMatch(/unknown área/)
  })
  it('accepts exams without a round and several figures, statement or solution', () => {
    const figs = [{ id: 'a', kind: 'svg', alt: 'Figura del enunciado.' }, { id: 'b', kind: 'png', alt: 'Figura de la solución.', placement: 'solution' }]
    expect(recordProblems([record(1, { round: undefined, figure: undefined, figures: figs, solution: 'Basta notar que $n(n+1)$ es par.' })], 'omcc-2008.json')).toEqual([])
    expect(recordFigures(record(1, { figure: { id: 'a', kind: 'svg', alt: 'Una figura' } }))).toEqual([{ id: 'a', kind: 'svg', alt: 'Una figura', placement: 'statement' }])
  })
  it('rejects a solution figure without a solution and more than four figures', () => {
    const fig = (id, placement) => ({ id, kind: 'png', alt: 'Una figura cualquiera.', placement })
    expect(recordProblems([record(1, { figures: [fig('a', 'solution')] })], 'a.json').join(' ')).toMatch(/needs a solution/)
    expect(recordProblems([record(1, { figures: ['a', 'b', 'c', 'd', 'e'].map((id) => fig(id)) })], 'a.json').join(' ')).toMatch(/at most 4/)
    expect(recordProblems([record(1, { round: '  ' })], 'a.json').join(' ')).toMatch(/round/)
  })
  it('needs a folder and an explicit confirmation to write', () => {
    expect(() => parseImportArgs(['--apply'])).toThrow(/folder/)
    expect(parseImportArgs(['data', '--apply'])).toEqual({ folder: 'data', apply: true })
    expect(() => examImportTarget({ MONGO_EXAM_IMPORT_URI: 'mongodb://h/teacherperi' }, true)).toThrow(/EXAM_IMPORT_CONFIRM/)
    expect(examImportTarget({ MONGO_EXAM_IMPORT_URI: 'mongodb://h/teacherperi', EXAM_IMPORT_CONFIRM: 'teacherperi' }, true).dbName).toBe('teacherperi')
  })
  it('gives the same ids on every run', () => {
    expect(String(stableId('problem', 'OMMR-SUR-2024-P1'))).toBe(String(stableId('problem', 'OMMR-SUR-2024-P1')))
    expect(String(stableId('problem', 'OMMR-SUR-2024-P1'))).not.toBe(String(stableId('problem', 'OMMR-SUR-2024-P2')))
  })
})
