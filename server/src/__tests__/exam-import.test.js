import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, it, expect } from 'vitest'
import Category from '../models/Category.js'
import Exam from '../models/Exam.js'
import Problem from '../models/Problem.js'
import ProblemImage from '../models/ProblemImage.js'
import Tag from '../models/Tag.js'
import Topic from '../models/Topic.js'
import User from '../models/User.js'
import { importExamProblems } from '../scripts/import-exam-problems.js'

const record = (n, extra = {}) => ({
  codigo: `OMMR-SUR-2024-P${n}`, titulo: `Regional Sureste 2024 · Problema ${n}`,
  enunciado: n === 1 ? 'Demuestra que $n^2+n$ es par para todo entero $n$.' : 'Encuentra todos los enteros positivos $k$ tales que $k+1$ divide a $k^2+1$.',
  solution: '', sourceAttribution: `Regional Sureste 2024, Problema ${n}.`, año: '2024', tema: 'Teoría de Números', tipo: 'OMM Regional',
  problemNumber: n, competition: 'OMM Regional', round: 'Sureste', subtopics: ['Paridad'], subtopicTopics: ['Paridad'],
  difficulty: 'basico', dificultad: 'Fácil', publicationStatus: 'published', figure: null, ...extra,
})

function examFolder(records) {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'exam-import-'))
  fs.mkdirSync(path.join(folder, 'figures'))
  fs.writeFileSync(path.join(folder, 'figures', 'cuadro.svg'), '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect x="5" y="5" width="30" height="30" fill="none" stroke="#111" stroke-width="2.5"/></svg>')
  fs.writeFileSync(path.join(folder, 'sureste-2024.json'), JSON.stringify(records))
  return folder
}

async function vocabulary() {
  const area = await Topic.create({ name: 'Teoría de Números', slug: 'omm-number-theory' })
  await Topic.create({ name: 'Paridad', slug: 'omm-teoria-de-numeros-paridad', parent: area._id })
  await Tag.create({ name: 'paridad', label: 'Paridad' })
  await User.create({ username: 'elias', email: 'elias@test.com', passwordHash: 'x', role: 'admin' })
  await Category.create({ name: 'Exámenes', kind: 'exam' })
}

describe('exam problems import', () => {
  it('creates folders, problems, figures and the exam card once', async () => {
    await vocabulary()
    const folder = examFolder([record(1, { figure: { id: 'cuadro', kind: 'svg', alt: 'Un cuadrado sin marcas.' } }), record(2)])

    const dry = await importExamProblems({ folder, apply: false })
    expect(dry.folders.map((f) => f.name)).toEqual(['OMM Regional', 'Sureste', '2024'])
    expect(dry.problems).toHaveLength(2)
    expect(await Problem.countDocuments()).toBe(0)
    expect(await Category.countDocuments()).toBe(1)

    const applied = await importExamProblems({ folder, apply: true })
    expect(applied.problems).toHaveLength(2)
    const stored = await Problem.findOne({ codigo: 'OMMR-SUR-2024-P1' }).lean()
    expect(stored).toMatchObject({ competition: 'OMM Regional', round: 'Sureste', problemNumber: 1, publicationStatus: 'published' })
    expect(stored.topics).toHaveLength(2)
    expect(stored.tags).toHaveLength(1)
    expect(stored.images[0].alt).toBe('Un cuadrado sin marcas.')
    expect((await ProblemImage.findById(stored.images[0].image).lean()).contentType).toBe('image/webp')
    const exam = await Exam.findOne({ competition: 'OMM Regional' }).lean()
    expect(exam).toMatchObject({ year: '2024', round: 'Sureste', publicationStatus: 'published' })
    expect(exam.problems).toHaveLength(2)

    const again = await importExamProblems({ folder, apply: true })
    expect(again.problems).toEqual([])
    expect(again.kept).toEqual(['OMMR-SUR-2024-P1', 'OMMR-SUR-2024-P2'])
    expect(await Problem.countDocuments()).toBe(2)
    expect(await Exam.countDocuments()).toBe(1)
  })

  it('files an exam without a round under competition › year, with solution figures', async () => {
    await vocabulary()
    const folder = examFolder([
      record(1, { codigo: 'OMCC-2008-P1', titulo: 'OMCC 2008 · Problema 1', competition: 'Centroamericana', round: undefined, año: '2008', tipo: 'OMCC', solution: 'Fuente: Revista Tzaloa.', figure: undefined, figures: [{ id: 'cuadro', kind: 'svg', alt: 'Un cuadrado sin marcas.' }, { id: 'cuadro', kind: 'svg', alt: 'El mismo cuadrado en la solución.', placement: 'solution' }] }),
    ])
    const applied = await importExamProblems({ folder, apply: true })
    expect(applied.folders.map((f) => f.name)).toEqual(['Centroamericana', '2008'])
    const stored = await Problem.findOne({ codigo: 'OMCC-2008-P1' }).lean()
    expect(stored.round).toBeUndefined()
    expect(stored.images.map((i) => i.placement)).toEqual(['statement', 'solution'])
    expect(await ProblemImage.countDocuments()).toBe(2)
    const exam = await Exam.findOne({ competition: 'Centroamericana' }).lean()
    expect(exam).toMatchObject({ year: '2008', round: null })
  })

  it('stops before writing when a tag is missing or a code holds another statement', async () => {
    await vocabulary()
    await expect(importExamProblems({ folder: examFolder([record(1, { subtopics: ['Nueva etiqueta'] })]), apply: true })).rejects.toThrow(/never creates tags/)
    expect(await Problem.countDocuments()).toBe(0)
    expect(await Category.countDocuments()).toBe(1)
    expect(await Tag.countDocuments()).toBe(1)

    await importExamProblems({ folder: examFolder([record(1)]), apply: true })
    await expect(importExamProblems({ folder: examFolder([record(1, { enunciado: 'Otro enunciado distinto con $x$ y suficiente texto.' })]), apply: true })).rejects.toThrow(/different statement/)
  })
})
