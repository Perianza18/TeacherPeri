import { describe, expect, it } from 'vitest'
import { examImportTarget, parseImportArgs, recordProblems, stableId } from '../scripts/import-exam-problems.js'

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
