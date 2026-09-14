import { describe, expect, it } from 'vitest'
import mongoose from 'mongoose'
import request from 'supertest'
import app from '../app.js'
import Category from '../models/Category.js'
import Exam from '../models/Exam.js'
import List from '../models/List.js'
import Problem from '../models/Problem.js'
import Tag from '../models/Tag.js'
import Theory from '../models/Theory.js'
import Topic from '../models/Topic.js'

async function problemFixture(overrides = {}) {
  const category = overrides.category || await Category.create({ name: `Pruebas ${Date.now()}` })
  return Problem.create({
    codigo: overrides.codigo || `TP-TEST-${Date.now()}`,
    titulo: 'Prueba', enunciado: 'Demuestra algo.', año: '2026', tema: 'Álgebra', tipo: 'Prueba',
    dificultad: 'Media', categories: [category._id], difficulty: 'intermedio', publicationStatus: 'published', ...overrides,
  })
}

describe('controlled Topic and Tag metadata', () => {
  it('normalizes immutable unique slugs', async () => {
    const tag = await Tag.create({ name: 'Geometría Olímpica', label: 'Geometría Olímpica' })
    expect(tag.slug).toBe('geometria-olimpica')
    await expect(Tag.create({ name: 'Geometría Olímpica', label: 'Otra etiqueta' })).rejects.toThrow()
    const topic = await Topic.create({ name: 'Teoría de Números' })
    expect(topic.slug).toBe('teoria-de-numeros')
    topic.slug = 'cambio-no-permitido'
    await topic.save()
    expect(topic.slug).toBe('teoria-de-numeros')
  })

  it('prevents indirect Topic cycles and unsafe parents', async () => {
    const a = await Topic.create({ name: 'A' })
    const b = await Topic.create({ name: 'B', parent: a._id })
    const c = await Topic.create({ name: 'C', parent: b._id })
    a.parent = c._id
    await expect(a.save()).rejects.toThrow('cycle')
    await expect(Topic.create({ name: 'Sin padre', parent: '507f1f77bcf86cd799439011' })).rejects.toThrow('must exist')
    await expect(Topic.create({ name: 'Malformado', parent: 'no-es-un-id' })).rejects.toThrow()
  })
})

describe('publication visibility', () => {
  it.each([
    ['theory', Theory, { title: 'Publicada', summary: 'Resumen.', content: 'Texto.', level: 'basico' }],
    ['lists', List, { title: 'Lista pública', summary: 'Resumen.', sourceUrl: 'https://example.org/original.pdf' }],
    ['exams', Exam, { competition: 'OMM', year: '2026', round: 'Nacional' }],
  ])('exposes only published %s in public list and detail APIs', async (path, Model, fields) => {
    const published = await Model.create({ ...fields, publicationStatus: 'published' })
    const draft = await Model.create({ ...fields, title: `${fields.title || 'Examen'} borrador`, publicationStatus: 'draft' })
    const archived = await Model.create({ ...fields, title: `${fields.title || 'Examen'} archivado`, publicationStatus: 'archived' })
    const list = await request(app).get(`/api/${path}?page=1&limit=20`)
    expect(list.status).toBe(200)
    expect(list.body.items.map((item) => item._id)).toEqual([published._id.toString()])
    expect((await request(app).get(`/api/${path}/${published._id}`)).status).toBe(200)
    expect((await request(app).get(`/api/${path}/${draft._id}`)).status).toBe(404)
    expect((await request(app).get(`/api/${path}/${archived._id}`)).status).toBe(404)
  })

  it('keeps legacy published Problems visible while hiding explicit draft and archived records', async () => {
    const category = await Category.create({ name: 'Visibilidad' })
    const legacyId = new mongoose.Types.ObjectId()
    await Problem.collection.insertOne({ _id: legacyId, codigo: 'LEGACY-PUBLIC', titulo: 'Legado', enunciado: 'Texto.', category: category._id, año: '2026', tema: 'Álgebra', tipo: 'Prueba', dificultad: 'Media', createdAt: new Date(), updatedAt: new Date() })
    const draft = await problemFixture({ codigo: 'DRAFT-PROBLEM', category, publicationStatus: 'draft' })
    const archived = await problemFixture({ codigo: 'ARCHIVED-PROBLEM', category, publicationStatus: 'archived' })
    const list = await request(app).get('/api/problems?page=1&limit=20')
    expect(list.body.items.map((item) => item._id)).toContain(legacyId.toString())
    expect(list.body.items.map((item) => item._id)).not.toContain(draft._id.toString())
    expect((await request(app).get(`/api/problems/${draft._id}`)).status).toBe(404)
    expect((await request(app).get(`/api/problems/${archived._id}`)).status).toBe(404)
  })

  it('validates lifecycle values at the model boundary', async () => {
    await expect(Theory.create({ title: 'Estado inválido', summary: 'No.', content: 'No.', level: 'basico', publicationStatus: 'private' })).rejects.toThrow()
  })
})

describe('Exam reference integrity', () => {
  it('orders existing unique Problem references without copying their statements', async () => {
    const category = await Category.create({ name: 'Exámenes' })
    const first = await problemFixture({ codigo: 'EXAM-1', category })
    const second = await problemFixture({ codigo: 'EXAM-2', category })
    const exam = await Exam.create({ competition: 'OMM', year: '2026', round: 'Nacional', problems: [{ problem: second._id, position: 2 }, { problem: first._id, position: 1 }], publicationStatus: 'published' })
    expect(exam.toObject().problems[0]).not.toHaveProperty('enunciado')
    first.titulo = 'Problema actualizado'
    await first.save()
    const response = await request(app).get(`/api/exams/${exam._id}`)
    expect(response.body.problems.map((entry) => entry.problem.codigo)).toEqual(['EXAM-1', 'EXAM-2'])
    expect(response.body.problems[0].problem.titulo).toBe('Problema actualizado')
  })

  it('rejects nonexistent, malformed, and duplicate Problem references', async () => {
    await expect(Exam.create({ competition: 'OMM', year: '2026', round: 'Nacional', problems: [{ problem: '507f1f77bcf86cd799439011', position: 1 }] })).rejects.toThrow('must exist')
    await expect(Exam.create({ competition: 'OMM', year: '2026', round: 'Nacional', problems: [{ problem: 'not-an-id', position: 1 }] })).rejects.toThrow()
    const problem = await problemFixture({ codigo: 'NO-DUPLICATE' })
    await expect(Exam.create({ competition: 'OMM', year: '2026', round: 'Nacional', problems: [{ problem: problem._id, position: 1 }, { problem: problem._id, position: 2 }] })).rejects.toThrow('more than once')
  })
})

describe('multi-folder Problems and discovery compatibility', () => {
  it('uses one Problem record for multiple category memberships and rejects duplicate memberships', async () => {
    const topicFolder = await Category.create({ name: 'Geometría' })
    const contestFolder = await Category.create({ name: 'OMM 2026' })
    const problem = await problemFixture({ codigo: 'MULTI-FOLDER', categories: [topicFolder._id, contestFolder._id] })
    expect((await Problem.countDocuments({ codigo: 'MULTI-FOLDER' }))).toBe(1)
    for (const category of [topicFolder, contestFolder]) {
      const response = await request(app).get(`/api/problems?page=1&limit=10&categories=${category._id}`)
      expect(response.body.items.map((item) => item._id)).toContain(problem._id.toString())
    }
    await expect(problemFixture({ codigo: 'DUPLICATE-FOLDER', categories: [topicFolder._id, topicFolder._id] })).rejects.toThrow('duplicate category')
  })

  it('keeps the legacy array response and validates canonical difficulty filters', async () => {
    await problemFixture({ codigo: 'CANONICAL-DIFFICULTY', difficulty: 'avanzado' })
    expect(Array.isArray((await request(app).get('/api/problems')).body)).toBe(true)
    const searched = await request(app).get('/api/problems?page=1&limit=10&difficulty=avanzado')
    expect(searched.status).toBe(200)
    expect(searched.body.items.map((item) => item.codigo)).toContain('CANONICAL-DIFFICULTY')
    expect((await request(app).get('/api/problems?page=1&difficulty=4')).status).toBe(400)
  })
})

describe('Theory and List content contracts', () => {
  it('allows independent Theory articles for one Topic and uses canonical levels', async () => {
    const topic = await Topic.create({ name: 'Círculos' })
    await Theory.create({ title: 'Introducción', summary: 'Primera parte.', content: 'Usa $r^2$.', level: 'basico', topics: [topic._id], publicationStatus: 'published' })
    await Theory.create({ title: 'Técnicas', summary: 'Segunda parte.', content: 'Usa $$x^2$$.', level: 'avanzado', topics: [topic._id], publicationStatus: 'published' })
    await expect(Theory.create({ title: 'Escala inválida', summary: 'No.', content: 'No.', level: 'medio' })).rejects.toThrow()
    expect((await request(app).get(`/api/theory?page=1&limit=10&topics=${topic._id}`)).body.total).toBe(2)
  })

  it('keeps Lists as attributed external resources without requiring a hosted file', async () => {
    const list = await List.create({ title: 'Lista externa', summary: 'Recurso atribuido.', authors: ['Autora'], sourceOrganization: 'Organización', sourceUrl: 'https://example.org/original', pdfUrl: 'https://example.org/original.pdf', publicationStatus: 'published' })
    expect(list.hostedFileReference).toBeUndefined()
  })
})
