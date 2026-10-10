import { describe, expect, it } from 'vitest'
import { buildMvpManifest, contentId, MVP_EXAMS } from '../data/mvpManifest.js'
import { validateMvpContent } from '../data/validateMvpContent.js'
import { MVP_PROBLEMS } from '../data/mvpProblems.js'
import { importTarget } from '../scripts/import-mvp-content.js'

const entries = buildMvpManifest()
describe('MVP release integrity', () => {
  it('renders every math expression strictly and resolves canonical references', () => {
    expect(validateMvpContent()).toMatchObject({ Problem: 36, Theory: 37, List: 9, Exam: 3, PathSection: 5 })
  })
  it('keeps identity stable across lists, Steps and examinations', () => {
    const problem = entries.find((e) => e.model === 'Problem' && e.key === 'TP-C05')
    const exam = entries.find((e) => e.model === 'Exam' && e.key === 'ciclo-1-a')
    const list = entries.find((e) => e.model === 'List' && e.key === 'mixto-ciclo-1')
    const step = entries.find((e) => e.model === 'Step' && e.key === 'entrenamiento-mixto-ciclo-1:2')
    expect(exam.data.problems[0].problem).toBe(problem._id)
    expect(list.data.problems[0].problem).toBe(problem._id)
    expect(step.data.teacherperiReferences.some((r) => r.target === problem._id)).toBe(true)
    expect(contentId('Problem', problem.key)).toBe(problem._id)
  })
  it('rejects missing references, malformed math and empty publication', () => {
    const missing = structuredClone(entries)
    missing.find((e) => e.model === 'Exam').data.problems[0].problem = '000000000000000000000000'
    expect(() => validateMvpContent(missing)).toThrow('Missing Problem')
    const math = structuredClone(entries)
    math.find((e) => e.model === 'Theory').data.content += '$\\notacommand$'
    expect(() => validateMvpContent(math)).toThrow()
    const empty = structuredClone(entries)
    const planned = empty.find((e) => e.model === 'Path' && e.key === 'eje-radical')
    planned.data.publicationStatus = 'published'
    expect(() => validateMvpContent(empty)).toThrow('Empty published Path')
  })
  it('checks worked numeric answers independently of displayed answer strings', () => {
    const answers = Object.fromEntries(MVP_PROBLEMS.map((p) => [p.codigo, p.answer]))
    expect(Number(answers['TP-G01'])).toBe(124 - 49)
    expect(Number(answers['TP-G03'])).toBe(7 * 10 / 4 - 7)
    expect(Number(answers['TP-G06'])).toBe(90 / 3)
    expect(Number(answers['TP-G07'])).toBe(Math.sqrt(17 ** 2 - 8 ** 2))
    expect(Number(answers['TP-G08'])).toBe(10 * Math.sqrt(13 ** 2 - 5 ** 2) / 2)
    expect(Number(answers['TP-A03'])).toBe(9 ** 2 - 2 * 14)
    expect(Number(answers['TP-A04'])).toBe(4 ** 2 - 2)
    expect(Number(answers['TP-C03'])).toBe(9 * 8 * 7 * 6 / 24)
    expect(Number(answers['TP-D01'])).toBe(2 * 27 + 9 + 2)
    expect(BigInt(answers['TP-M01'])).toBe(3n ** 25n % 7n)
    expect(answers['TP-M04'].split(',').map(Number)).toEqual(Array.from({ length: 15 }, (_, i) => i).filter((x) => (6 * x - 9) % 15 === 0))
    expect(answers['TP-D03'].split(',').map(Number)).toEqual(Array.from({ length: 90 }, (_, i) => i + 10).filter((n) => n === 4 * (Math.floor(n / 10) + n % 10)))
    for (let n = -30; n <= 30; n++) expect(n * (n + 1) * (n + 2) * (n + 3) + 1).toBe((n * n + 3 * n + 1) ** 2)
    expect(31 * -5 + 12 * 13).toBe(1)
  })
  it('labels exams as original practice and keeps unfinished cycles draft', () => {
    expect(MVP_EXAMS.every((exam) => /original|parcial/.test(exam.instructions))).toBe(true)
    for (const cycle of [2, 3, 4, 5]) expect(entries.find((e) => e.key === `entrenamiento-mixto-ciclo-${cycle}`).data.publicationStatus).toBe('draft')
    expect(entries.every((e) => !e.data.pdfUrl)).toBe(true)
  })
})
describe('Import target guard', () => {
  it('requires a separate explicit target and exact apply confirmation', () => {
    expect(() => importTarget({ MONGO_URI: 'mongodb://localhost/app' })).toThrow('explicit')
    expect(importTarget({ MONGO_CONTENT_IMPORT_URI: 'mongodb://localhost/teacherperi' }).dbName).toBe('teacherperi')
    expect(() => importTarget({ MONGO_CONTENT_IMPORT_URI: 'mongodb://localhost/teacherperi' }, true)).toThrow('CONTENT_IMPORT_CONFIRM')
    expect(() => importTarget({ MONGO_CONTENT_IMPORT_URI: 'mongodb://localhost/admin' })).toThrow('non-system')
    expect(() => importTarget({ MONGO_CONTENT_IMPORT_URI: 'mongodb://localhost/teacherperi?dbName=other' })).toThrow('override')
    expect(() => importTarget({ MONGO_CONTENT_IMPORT_URI: 'mongodb://localhost/' })).toThrow('database')
  })
})
