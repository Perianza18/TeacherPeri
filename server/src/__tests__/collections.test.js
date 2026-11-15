import { describe, expect, it } from 'vitest'
import mongoose from 'mongoose'
import request from 'supertest'
import app from '../app.js'
import Category from '../models/Category.js'
import Comment from '../models/Comment.js'
import Problem from '../models/Problem.js'
import ProblemCollection from '../models/ProblemCollection.js'

async function problems(count, overrides = {}) {
  const category = await Category.create({ name: `Colecciones ${Date.now()}` })
  return Promise.all(Array.from({ length: count }, (_, index) => Problem.create({
    codigo: `TP-COL-${index + 1}`, titulo: `Interno ${index + 1}`, enunciado: `Enunciado ${index + 1} con $x$.`,
    hint: 'Primera pista.\n\nSegunda pista.', solution: 'No se muestra.', año: '2026', tema: 'Combinatoria', tipo: 'Ejercicio',
    dificultad: 'Fácil', difficulty: 'basico', categories: [category._id], publicationStatus: 'published', ...overrides,
  })))
}

const ordered = (list) => list.map((problem, index) => ({ problem: problem._id, position: index + 1 }))

describe('problem collections', () => {
  it('returns every published box of a slug in its order, with public problems only', async () => {
    const [a, b, c] = await problems(3)
    const draft = await Problem.create({ codigo: 'TP-COL-DRAFT', titulo: 'Borrador', enunciado: 'No público.', año: '2026', tema: 'Combinatoria', tipo: 'Ejercicio', dificultad: 'Fácil', publicationStatus: 'draft' })
    await ProblemCollection.create({ slug: 'prueba', kind: 'ejercicios', problems: ordered([b, draft, a]), publicationStatus: 'published' })
    await ProblemCollection.create({ slug: 'prueba', kind: 'dificiles', problems: ordered([c]), publicationStatus: 'published' })
    await ProblemCollection.create({ slug: 'prueba', kind: 'practice', problems: ordered([a]), publicationStatus: 'draft' })
    const author = new mongoose.Types.ObjectId()
    await Comment.collection.insertMany([
      { problem: a._id, author, body: 'Visible', status: 'visible' },
      { problem: a._id, author, body: 'Otro', status: 'visible' },
      { problem: a._id, author, body: 'Eliminado', status: 'deleted' },
    ])

    const response = await request(app).get('/api/collections/prueba')
    expect(response.status).toBe(200)
    expect(response.body.slug).toBe('prueba')
    expect(Object.keys(response.body.collections).sort()).toEqual(['dificiles', 'ejercicios'])
    const exercises = response.body.collections.ejercicios
    expect(exercises.map((problem) => problem.codigo)).toEqual(['TP-COL-2', 'TP-COL-1'])
    expect(exercises[1]).toMatchObject({ enunciado: 'Enunciado 1 con $x$.', hint: 'Primera pista.\n\nSegunda pista.', difficulty: 'basico', commentCount: 2 })
    expect(exercises[0].commentCount).toBe(0)
    expect(exercises[0]).not.toHaveProperty('titulo')
    expect(exercises[0]).not.toHaveProperty('solution')
    expect(response.body.collections.dificiles.map((problem) => problem.codigo)).toEqual(['TP-COL-3'])
  })

  it('rejects malformed slugs and hides missing or unpublished collections', async () => {
    const [a] = await problems(1)
    await ProblemCollection.create({ slug: 'solo-borrador', kind: 'practice', problems: ordered([a]) })
    expect((await request(app).get('/api/collections/No_Valido')).status).toBe(400)
    expect((await request(app).get('/api/collections/no-existe')).status).toBe(404)
    expect((await request(app).get('/api/collections/solo-borrador')).status).toBe(404)
  })

  it('allows one collection per slug and kind, with valid slugs, kinds and positions', async () => {
    const [a, b] = await problems(2)
    await ProblemCollection.create({ slug: 'casillas', kind: 'practice', problems: ordered([a]) })
    await expect(ProblemCollection.create({ slug: 'casillas', kind: 'practice', problems: ordered([b]) })).rejects.toThrow()
    await expect(ProblemCollection.create({ slug: 'Casillas_2', kind: 'practice' })).rejects.toThrow()
    await expect(ProblemCollection.create({ slug: 'casillas', kind: 'otro' })).rejects.toThrow()
    await expect(ProblemCollection.create({ slug: 'casillas', kind: 'dificiles', problems: [{ problem: a._id, position: 2 }] })).rejects.toThrow('contiguous')
    await expect(ProblemCollection.create({ slug: 'casillas', kind: 'ejercicios', problems: [{ problem: new mongoose.Types.ObjectId(), position: 1 }] })).rejects.toThrow('must exist')
  })
})
