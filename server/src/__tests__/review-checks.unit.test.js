import { describe, it, expect } from 'vitest'
import { duplicateFindings, folderFindings, hasErrors, mathFindings, mathSegments, runSubmissionChecks, similarity, spamFindings, statementFindings, vocabularyFindings } from '../lib/review/checks.js'
import { derivedProblemFields, parseProposal, submissionState } from '../lib/submissions.js'
import { examPathLabel, parseFolderName } from '../lib/examFolders.js'

const codes = (findings) => findings.map((f) => f.code)

describe('math checks (same split as MathText)', () => {
  it('finds inline and display formulas', () => {
    const { formulas, unbalanced } = mathSegments('Sea $x$ real y $$x^2\\ge0.$$ Fin.')
    expect(formulas).toEqual([{ source: 'x', display: false }, { source: 'x^2\\ge0.', display: true }])
    expect(unbalanced).toBe(false)
  })

  it('reports a formula KaTeX cannot render and a lone $', () => {
    expect(codes(mathFindings('Calcula $\\frac{1}{2$ ya.'))).toEqual(['math-error'])
    expect(codes(mathFindings('Precio: $5 por kilo y nada más.'))).toEqual(['math-unbalanced'])
    expect(mathFindings('Todo bien: $\\angle ABC = 90^\\circ$.')).toEqual([])
  })
})

describe('statement, duplicates and spam', () => {
  it('requires a complete statement', () => {
    expect(codes(statementFindings(''))).toEqual(['statement-empty'])
    expect(codes(statementFindings('Muy corto.'))).toEqual(['statement-short'])
    expect(codes(statementFindings('x'.repeat(5001)))).toEqual(['statement-long'])
    expect(statementFindings('Demuestra que la suma de dos impares es par.')).toEqual([])
  })

  it('flags exact duplicates as errors and near copies as warnings', () => {
    const existing = [{ codigo: 'TP-A01', enunciado: 'Demuestra que n(n+1)(n+2)(n+3)+1 es un cuadrado perfecto para todo entero n.' }]
    expect(codes(duplicateFindings('demuestra que  n(n+1)(n+2)(n+3)+1 es un cuadrado perfecto para todo entero n.', existing))).toEqual(['duplicate'])
    expect(codes(duplicateFindings('Demuestra que n(n+1)(n+2)(n+3)+1 es un cuadrado perfecto para todo entero positivo n.', existing))).toEqual(['similar'])
    expect(duplicateFindings('Un problema completamente distinto sobre triángulos.', existing)).toEqual([])
    expect(similarity('a b c d', 'a b c d')).toBe(1)
  })

  it('warns about links, repeated characters and shouting', () => {
    expect(codes(spamFindings('Visita https://ejemplo.com para la respuesta'))).toEqual(['link'])
    expect(codes(spamFindings('Resuelve estoooooooooo ya'))).toEqual(['repeated-characters'])
    expect(codes(spamFindings('DEMUESTRA QUE TODO NUMERO PAR ES SUMA DE DOS PRIMOS'))).toEqual(['all-caps'])
  })
})

describe('vocabulary and folders', () => {
  const topics = new Map([['t1', { _id: 't1', name: 'Álgebra' }]])
  const tags = new Map([['g1', { _id: 'g1', slug: 'teacherperi-original', label: 'Original TeacherPeri' }], ['g2', { _id: 'g2', slug: 'paridad', label: 'Paridad' }]])
  it('allows existing terms only and reserves the TeacherPeri tag', () => {
    expect(codes(vocabularyFindings({ topics: ['t1'], tags: ['g2'] }, { topics, tags }))).toEqual([])
    expect(codes(vocabularyFindings({ topics: ['t1'], tags: ['g1'] }, { topics, tags }))).toEqual(['reserved-tag'])
    expect(codes(vocabularyFindings({ topics: ['zz'], tags: ['zz'] }, { topics, tags }))).toEqual(['unknown-topic', 'unknown-tag'])
    expect(codes(vocabularyFindings({ topics: [], tags: [] }, { topics, tags }))).toEqual(['no-topic'])
  })

  const folders = [
    { _id: 'r', name: 'Exámenes', parent: null, kind: 'exam', reviewStatus: 'approved' },
    { _id: 'o', name: 'OMM', parent: 'r', kind: 'exam', reviewStatus: 'approved' },
    { _id: 'y', name: '2024', parent: 'o', kind: 'exam', reviewStatus: 'pending' },
    { _id: 'g', name: 'Geometría', parent: null, kind: 'general' },
  ]
  it('checks the exam folder', () => {
    expect(folderFindings({ isExam: false }, folders)).toEqual([])
    expect(codes(folderFindings({ isExam: true, examFolder: null }, folders))).toEqual(['exam-folder-missing'])
    expect(codes(folderFindings({ isExam: true, examFolder: 'g' }, folders))).toEqual(['exam-folder-invalid'])
    expect(codes(folderFindings({ isExam: true, examFolder: 'r' }, folders))).toEqual(['exam-folder-root'])
    expect(codes(folderFindings({ isExam: true, examFolder: 'o' }, folders))).toEqual(['exam-folder-not-leaf'])
    expect(codes(folderFindings({ isExam: true, examFolder: 'y' }, folders))).toEqual(['exam-folder-pending'])
  })

  it('derives title, year and collection from the folder', () => {
    const fields = derivedProblemFields({ enunciado: 'x', topics: ['t1'], tags: [], isExam: true, examFolder: 'y', problemNumber: 2 }, { folders, topics })
    expect(fields).toMatchObject({ titulo: 'OMM · 2024 · Problema 2', año: '2024', tema: 'Álgebra', tipo: 'Examen', competition: 'OMM', categories: ['y'] })
    const plain = derivedProblemFields({ enunciado: 'x', topics: [], tags: [], isExam: false, examFolder: null, problemNumber: null }, { folders, topics, current: { categories: ['g', 'o'] }, now: new Date('2026-11-15') })
    expect(plain).toMatchObject({ titulo: 'Problema propuesto', año: '2026', tema: 'Por clasificar', tipo: 'Comunidad', categories: ['g'] })
    expect(examPathLabel('y', folders)).toEqual(['OMM', '2024'])
  })

  it('runs everything together and blocks only on errors', () => {
    const ok = runSubmissionChecks({ enunciado: 'Demuestra que $2^n > n$ para todo entero positivo.', topics: [], tags: [], isExam: false }, { topics, tags, folders, problems: [] })
    expect(hasErrors(ok)).toBe(false)
    expect(codes(ok)).toEqual(['no-topic'])
  })
})

describe('reading a proposal from the browser', () => {
  const id = '64b000000000000000000001'
  it('keeps only known fields and validates ids and numbers', () => {
    expect(parseProposal({ enunciado: ' Hola \r\n', topics: [id, id], publicationStatus: 'published' }).proposal).toEqual({ enunciado: 'Hola', topics: [id], tags: [], isExam: false, examFolder: null, problemNumber: null, images: [] })
    expect(parseProposal({ enunciado: 'Hola', images: [{ image: id, alt: 'Triángulo ABC.', placement: 'solution' }] }).error).toMatch(/enunciado/)
    expect(parseProposal({ enunciado: 'Hola', images: [{ image: id, alt: ' Triángulo   ABC. ' }] }).proposal.images).toEqual([{ image: id, alt: 'Triángulo ABC.', placement: 'statement' }])
    expect(parseProposal({ topics: ['x'] }).error).toMatch(/áreas/)
    expect(parseProposal({ isExam: true, examFolder: id, problemNumber: 0 }).error).toMatch(/número/)
    expect(parseProposal({ isExam: false, examFolder: id, problemNumber: 4 }).proposal).toMatchObject({ examFolder: null, problemNumber: null })
    expect(parseProposal({ isExam: 'true' }).proposal.isExam).toBe(false)
  })

  it('validates folder names', () => {
    expect(parseFolderName('  OMM   Estatal ')).toEqual({ name: 'OMM Estatal' })
    expect(parseFolderName('').error).toBeTruthy()
    expect(parseFolderName('<b>').error).toBeTruthy()
    expect(parseFolderName('x'.repeat(81)).error).toBeTruthy()
  })
})

describe('submissionState', () => {
  it('names what the author sees', () => {
    expect(submissionState({ publicationStatus: 'draft' }, { status: 'pending' })).toBe('pending')
    expect(submissionState({ publicationStatus: 'draft' }, { status: 'rejected', kind: 'create' })).toBe('rejected')
    expect(submissionState({ publicationStatus: 'published' }, { status: 'approved' })).toBe('published')
    expect(submissionState({ publicationStatus: 'published' }, { status: 'pending', kind: 'edit' })).toBe('published-pending')
    expect(submissionState({ publicationStatus: 'published' }, { status: 'rejected', kind: 'edit' })).toBe('published-rejected')
  })
})
