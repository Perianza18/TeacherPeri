import { readdirSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  FIGURES_DIR, OMMEB_GUERRERO_EXAMS, buildOmmebProblems, examFolderPath, examInstructions, validateOmmebGuerrero,
} from '../data/ommebGuerrero/index.js'
import { importReport, parseTranscribedArgs } from '../scripts/import-transcribed-exams.js'
import { EXAMENES_ENTRENAMIENTO, SIN_RESPUESTA } from '../data/examenesEntrenamiento/index.js'
import { COLLECTIONS } from '../lib/transcribedExams.js'
import { toolEnv } from '../scripts/atlas.js'
import { sourceProblemTitle } from '../../../src/lib/problemPresentation.js'

const problems = buildOmmebProblems()

describe('OMMEB Guerrero transcription', () => {
  it('has the 24 exams of the 7a to 10a edición, 15 problems each, and validates', () => {
    expect(validateOmmebGuerrero()).toMatchObject({ exams: 24, problems: 360 })
    const keys = OMMEB_GUERRERO_EXAMS.map((exam) => `${exam.year}-${exam.etapa}-${exam.nivel}`)
    for (const year of ['2023', '2024', '2025', '2026']) {
      for (const etapa of ['Estatal', 'Selectivo']) for (const nivel of [1, 2, 3]) expect(keys).toContain(`${year}-${etapa}-${nivel}`)
    }
    for (const exam of OMMEB_GUERRERO_EXAMS) expect(exam.problemas).toHaveLength(15)
    const files = readdirSync(path.dirname(FIGURES_DIR)).filter((file) => /^20\d\d-(estatal|selectivo)-n[123]\.js$/.test(file))
    expect(files).toHaveLength(OMMEB_GUERRERO_EXAMS.length)
  })

  it('files every exam under Exámenes › OMMEB › Guerrero › year › stage › level', () => {
    const exam = OMMEB_GUERRERO_EXAMS.find((e) => e.year === '2025' && e.etapa === 'Estatal' && e.nivel === 1)
    expect(examFolderPath(exam)).toEqual(['OMMEB', 'Guerrero', '2025', 'Estatal', 'Nivel 1'])
    const first = problems.find((p) => p.fields.codigo === 'OMMEB-GRO-2025-EST-N1-01')
    expect(first.fields).toMatchObject({
      titulo: 'OMMEB Guerrero · Estatal Nivel 1 · 2025 · Problema 1',
      competition: 'OMMEB', round: 'Guerrero · Estatal · Nivel 1', problemNumber: 1, año: '2025', tipo: 'Examen', publicationStatus: 'published',
    })
    expect(sourceProblemTitle(first.fields)).toBe('OMMEB Guerrero · Estatal Nivel 1 · 2025 · Problema 1')
    expect(first.fields.enunciado).toContain('(e) $278.5$ m$^2$')
    expect(first.fields.solution).toBe('Respuesta: (e) $278.5$ m$^2$')
    expect(examInstructions(exam)).toContain('9a OMMEB Guerrero · Concurso Estatal · Nivel 1')
  })

  it('writes money without a lone $ and keeps the official solutions of the written problems', () => {
    for (const p of problems) expect(p.fields.enunciado).not.toContain('\\$')
    expect(problems.find((p) => p.fields.codigo === 'OMMEB-GRO-2025-EST-N1-12').fields.enunciado).toContain('53.20 pesos')
    const written = problems.find((p) => p.fields.codigo === 'OMMEB-GRO-2025-EST-N1-14')
    expect(written.fields.solution).toMatch(/^Respuesta: 76 años\n\nSolución oficial:\n\n/)
  })

  it('marks the problems whose official key gives no answer', () => {
    const noAnswer = problems.filter((p) => !p.fields.solution.startsWith('Respuesta')).map((p) => p.fields.codigo)
    expect(noAnswer).toEqual(expect.arrayContaining(['OMMEB-GRO-2024-EST-N1-06', 'OMMEB-GRO-2024-SEL-N2-01', 'OMMEB-GRO-2023-SEL-N3-01']))
    for (const code of noAnswer.filter((c) => c !== 'OMMEB-GRO-2025-SEL-N2-15')) {
      expect(problems.find((p) => p.fields.codigo === code).fields.solution).toMatch(/^Nota: /)
    }
    const twoKeys = problems.find((p) => p.fields.codigo === 'OMMEB-GRO-2023-EST-N1-04')
    expect(twoKeys.fields.solution).toMatch(/^Respuesta: \(b\) Martes o \(c\) Miércoles/)
  })

  it('uses every figure file and has at most 4 figures per problem', () => {
    const used = new Set(problems.flatMap((p) => p.figures.map((f) => f.file)))
    expect(readdirSync(FIGURES_DIR).filter((file) => !used.has(file))).toEqual([])
    for (const p of problems) expect(p.figures.length).toBeLessThanOrEqual(4)
  })

  it('catches a broken transcription', () => {
    const exam = structuredClone(OMMEB_GUERRERO_EXAMS[0])
    exam.problemas[0].enunciado = 'Costó $5 la paleta.'
    expect(() => validateOmmebGuerrero([exam])).toThrow(/\$ sin cerrar/)
    exam.problemas[0].enunciado = 'Bien.'
    exam.problemas[0].respuesta = 'z'
    expect(() => validateOmmebGuerrero([exam])).toThrow(/opción múltiple/)
  })
})

describe('Exámenes de entrenamiento transcription', () => {
  const entrenamiento = EXAMENES_ENTRENAMIENTO.buildProblems()

  it('has the 4 IMC exams, the PAGMO exam and the OMM Guerrero state exam, and validates', () => {
    expect(EXAMENES_ENTRENAMIENTO.validate()).toMatchObject({ exams: 6, problems: 69 })
    expect(EXAMENES_ENTRENAMIENTO.exams.map((exam) => exam.carpeta.join(' › '))).toContain('IMC › Selectivo de México (secundaria) › 2021 › Examen 5')
    const files = readdirSync(path.dirname(EXAMENES_ENTRENAMIENTO.figuresDir)).filter((file) => /^[a-z-]+-20\d\d-.+\.js$/.test(file))
    expect(files).toHaveLength(EXAMENES_ENTRENAMIENTO.exams.length)
  })

  it('titles the problems so the problem page shows them whole, and says there is no answer', () => {
    const first = entrenamiento.find((p) => p.fields.codigo === 'IMC-MX-2021-SEL1-01')
    expect(sourceProblemTitle(first.fields)).toBe('Selectivo IMC México, examen 1 · 2021 · Problema 1')
    expect(first.fields).toMatchObject({ competition: 'IMC', round: 'Selectivo de México (secundaria) · Examen 1', solution: `Nota: ${SIN_RESPUESTA}` })
  })

  it('uses every figure file, and no code is shared with another collection', () => {
    const used = new Set(entrenamiento.flatMap((p) => p.figures.map((f) => f.file)))
    expect(readdirSync(EXAMENES_ENTRENAMIENTO.figuresDir).filter((file) => !used.has(file))).toEqual([])
    const all = Object.values(COLLECTIONS).flatMap((collection) => collection.buildProblems().map((p) => p.fields.codigo))
    expect(new Set(all).size).toBe(all.length)
  })
})

describe('Transcribed exams import command', () => {
  it('takes a collection, --apply, --dry-run and --owner only', () => {
    expect(parseTranscribedArgs(['ommeb-guerrero'])).toEqual({ collection: 'ommeb-guerrero', apply: false, owner: null })
    expect(parseTranscribedArgs(['examenes-entrenamiento', '--apply', '--owner', 'elias'])).toEqual({ collection: 'examenes-entrenamiento', apply: true, owner: 'elias' })
    expect(() => parseTranscribedArgs([])).toThrow()
    expect(() => parseTranscribedArgs(['ommeb-guerrero', '--apply', '--dry-run'])).toThrow()
    expect(() => parseTranscribedArgs(['ommeb-guerrero', '--force'])).toThrow()
    expect(() => parseTranscribedArgs(['otra'])).toThrow()
  })

  it('reports a dry run without connection details', () => {
    const text = importReport('OMMEB Guerrero', 'teacherperi', { applied: false, exams: 24, problems: 360, foldersToCreate: ['OMMEB › Guerrero'], create: ['A', 'B'], keep: [], differs: [{ codigo: 'C', fields: ['enunciado'] }], images: 3, examChanges: [] })
    expect(text).toContain('OMMEB Guerrero · dry-run · database: teacherperi')
    expect(text).toContain('C: enunciado')
    expect(text).toContain('Nothing was written.')
  })

  it('runs on Atlas through the shared wrapper', () => {
    const uri = 'mongodb+srv://u:p@cluster.example.net/teacherperi?retryWrites=true'
    const { env, apply } = toolEnv({ ATLAS_TEST_URI: uri }, 'test', 'import-transcribed', ['examenes-entrenamiento', '--apply'])
    expect(apply).toBe(true)
    expect(env.MONGO_TRANSCRIBED_IMPORT_URI).toBe(uri)
    expect(env.TRANSCRIBED_IMPORT_CONFIRM).toBe('teacherperi')
  })
})
