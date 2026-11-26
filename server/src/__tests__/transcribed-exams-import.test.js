import { describe, expect, it } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import Category from '../models/Category.js'
import Exam from '../models/Exam.js'
import Problem from '../models/Problem.js'
import ProblemImage from '../models/ProblemImage.js'
import Topic from '../models/Topic.js'
import User from '../models/User.js'
import { OMMEB_GUERRERO_EXAMS } from '../data/ommebGuerrero/index.js'
import { EXAMENES_ENTRENAMIENTO } from '../data/examenesEntrenamiento/index.js'
import { importCollection, importOmmebGuerrero } from '../lib/transcribedExams.js'

// Two exams keep the test quick: one with figures in the statement and the
// solution, one with a problem that has no official answer.
const pick = (year, etapa, nivel) => OMMEB_GUERRERO_EXAMS.find((e) => e.year === year && e.etapa === etapa && e.nivel === nivel)
const exams = [pick('2025', 'Estatal', 2), pick('2024', 'Estatal', 1)]

async function setup() {
  await User.create({ username: 'elias', email: 'elias@test.com', passwordHash: 'hash-de-prueba', role: 'admin' })
  await Topic.create({ name: 'Geometría', slug: 'omm-geometria' })
  const root = await Category.create({ name: 'Exámenes', kind: 'exam' })
  const ommeb = await Category.create({ name: 'OMMEB', kind: 'exam', parent: root._id })
  return { root, ommeb }
}

describe('OMMEB Guerrero import', () => {
  it('plans without writing, then adds folders, problems, figures and exams once', async () => {
    const { ommeb } = await setup()
    const plan = await importOmmebGuerrero({ exams })
    expect(plan).toMatchObject({ applied: false, exams: 2, problems: 30, keep: [], differs: [] })
    expect(plan.create).toHaveLength(30)
    expect(plan.foldersToCreate).toEqual([
      'OMMEB › Guerrero', 'OMMEB › Guerrero › 2025', 'OMMEB › Guerrero › 2025 › Estatal', 'OMMEB › Guerrero › 2025 › Estatal › Nivel 2',
      'OMMEB › Guerrero › 2024', 'OMMEB › Guerrero › 2024 › Estatal', 'OMMEB › Guerrero › 2024 › Estatal › Nivel 1',
    ])
    expect(await Problem.countDocuments()).toBe(0)
    expect(await Category.countDocuments()).toBe(2)

    const applied = await importOmmebGuerrero({ apply: true, exams })
    expect(applied.applied).toBe(true)
    expect(await Problem.countDocuments({ publicationStatus: 'published' })).toBe(30)
    expect(await ProblemImage.countDocuments()).toBe(plan.images)
    const guerrero = await Category.findOne({ name: 'Guerrero', parent: ommeb._id })
    expect(guerrero).toBeTruthy()

    const p15 = await Problem.findOne({ codigo: 'OMMEB-GRO-2025-EST-N2-15' }).lean()
    expect(p15.images.map((i) => i.placement)).toEqual(['statement', 'solution', 'solution'])
    expect(p15.topics).toHaveLength(1)
    expect(p15.solution).toMatch(/^Respuesta: 35 cm\$\^2\$\n\nSolución oficial:/)

    const examDocs = await Exam.find().lean()
    expect(examDocs).toHaveLength(2)
    const estatal2 = examDocs.find((e) => e.year === '2025')
    expect(estatal2).toMatchObject({ competition: 'OMMEB', round: 'Guerrero · Estatal · Nivel 2', publicationStatus: 'published', durationMinutes: 150, organization: 'OMMEB Guerrero' })
    expect(estatal2.problems).toHaveLength(15)
    expect(estatal2.instructions).toContain('Concurso Estatal')

    const page = await request(app).get(`/api/exams/${estatal2._id}`)
    expect(page.status).toBe(200)

    const again = await importOmmebGuerrero({ apply: true, exams })
    expect(again).toMatchObject({ create: [], foldersToCreate: [], examChanges: [] })
    expect(again.keep).toHaveLength(30)
    expect(await Problem.countDocuments()).toBe(30)
    expect(await ProblemImage.countDocuments()).toBe(plan.images)
  }, 60000)

  it('leaves a problem edited on the site as it is and reports it', async () => {
    await setup()
    await importOmmebGuerrero({ apply: true, exams })
    await Problem.updateOne({ codigo: 'OMMEB-GRO-2024-EST-N1-03' }, { enunciado: 'Editado en el sitio.' })
    const result = await importOmmebGuerrero({ apply: true, exams })
    expect(result.differs).toEqual([{ codigo: 'OMMEB-GRO-2024-EST-N1-03', fields: ['enunciado'] }])
    expect((await Problem.findOne({ codigo: 'OMMEB-GRO-2024-EST-N1-03' })).enunciado).toBe('Editado en el sitio.')
  }, 60000)

  it('stops when a folder it needs is waiting for review', async () => {
    const { ommeb } = await setup()
    await Category.create({ name: 'guerrero', kind: 'exam', parent: ommeb._id, reviewStatus: 'pending' })
    await expect(importOmmebGuerrero({ apply: true, exams })).rejects.toMatchObject({ code: 'TRANSCRIBED_PENDING_FOLDER' })
    expect(await Problem.countDocuments()).toBe(0)
  })

  it('imports another collection next to it, with an editor owning the figures', async () => {
    await Topic.create({ name: 'Geometría', slug: 'omm-geometria' })
    await User.create({ username: 'edith', email: 'edith@test.com', passwordHash: 'hash-de-prueba', role: 'editor' })
    await Category.create({ name: 'Exámenes', kind: 'exam' })
    const exams = EXAMENES_ENTRENAMIENTO.exams.filter((exam) => exam.carpeta[0] !== 'IMC' || exam.carpeta[3] === 'Examen 1')
    const result = await importCollection(EXAMENES_ENTRENAMIENTO, { apply: true, exams })
    expect(result.create).toHaveLength(15 + 3 + 6)
    const owner = await User.findOne({ username: 'edith' })
    expect(await ProblemImage.countDocuments({ owner: owner._id })).toBe(result.images)
    const titles = (await Exam.find().lean()).map((e) => [e.competition, e.year, e.round].join(' · ')).sort()
    expect(titles).toEqual(['IMC · 2021 · Selectivo de México (secundaria) · Examen 1', 'OMM Estatal · 2026 · Guerrero', 'PAGMO · 2021 · Selectivo de México · Examen 1'])
    const pagmo = await Exam.findOne({ competition: 'PAGMO' }).lean()
    expect(pagmo).toMatchObject({ durationMinutes: 270, organization: 'Selectivo mexicano para la PAGMO' })
  }, 60000)
})
