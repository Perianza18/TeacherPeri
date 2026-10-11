import { describe, expect, it, vi } from 'vitest'
import mongoose from 'mongoose'
import request from 'supertest'
import app from '../app.js'
import { importMvpContent, CONTENT_MODELS } from '../migrations/import-mvp-content.js'
import { buildMvpManifest } from '../data/mvpManifest.js'

const entry = (model, key) => buildMvpManifest().find((e) => e.model === model && e.key === key)
describe('MVP atomic import and public journey', () => {
  it('refuses standalone import before creating collections or writing content', async () => {
    const admin = vi.spyOn(mongoose.connection.db, 'admin').mockReturnValue({ command: vi.fn().mockResolvedValue({ isWritablePrimary: true }) })
    const create = vi.spyOn(CONTENT_MODELS.Category, 'createCollection')
    try {
      await expect(importMvpContent({ apply: true })).rejects.toMatchObject({ code: 'CONTENT_REPLICA_SET_REQUIRED' })
      expect(create).not.toHaveBeenCalled()
      expect(await CONTENT_MODELS.Path.countDocuments()).toBe(0)
    } finally {
      admin.mockRestore()
      create.mockRestore()
    }
  })
  it('preflights without writing, applies twice without new identities and rolls back conflicts', async () => {
    const before = await importMvpContent()
    expect(before.create).toBeGreaterThan(500)
    expect(await CONTENT_MODELS.Problem.countDocuments()).toBe(0)
    await importMvpContent({ apply: true })
    const problem = await CONTENT_MODELS.Problem.findOne({ codigo: 'TP-G01' })
    const second = await importMvpContent({ apply: true })
    expect(second).toEqual({ create: 0, promote: 0, keep: before.create })
    expect(String((await CONTENT_MODELS.Problem.findOne({ codigo: 'TP-G01' }))._id)).toBe(String(problem._id))
    problem.enunciado = 'Independent editorial change'
    await problem.save()
    await expect(importMvpContent({ apply: true })).rejects.toThrow('Content conflict')
    expect((await CONTENT_MODELS.Problem.findById(problem._id)).enunciado).toBe('Independent editorial change')
    expect(await CONTENT_MODELS.Problem.countDocuments()).toBe(36)
  }, 60000)
  it('resolves Paths → Theory → Problems → Lists → Exams publicly and hides draft targets', async () => {
    await importMvpContent({ apply: true })
    const root = await request(app).get('/api/paths/preparacion-para-la-omm')
    expect(root.status).toBe(200)
    expect(root.body.path.presentation.filter((p) => p.type === 'section')).toHaveLength(5)
    expect(root.body.path.childPaths.filter((c) => c.plannedPreview).length).toBeGreaterThan(20)
    const traversal = await request(app).get('/api/paths').query({ traversal: 'preparacion-para-la-omm/algebra-basica-para-olimpiadas/factorizacion-e-identidades' })
    expect(traversal.status).toBe(200)
    expect(traversal.body.path.steps.some((s) => s.teacherperiReferences.some((r) => r.contentType === 'Problem' && r.available))).toBe(true)
    const theory = await request(app).get(`/api/theory/${entry('Theory', 'factorizacion-e-identidades-guia')._id}`)
    expect(theory.status).toBe(200)
    const examId = entry('Exam', 'ciclo-1-a')._id
    let exam = await request(app).get(`/api/exams/${examId}`)
    expect(exam.body.problems.map((p) => p.position)).toEqual([1, 2, 3, 4, 5])
    expect(exam.body.problems[0].problem.codigo).toBe('TP-C05')
    const problem = await CONTENT_MODELS.Problem.findOne({ codigo: 'TP-C05' })
    problem.publicationStatus = 'draft'; await problem.save()
    exam = await request(app).get(`/api/exams/${examId}`)
    expect(exam.body.problems[0].problem).toBeNull()
    const list = await request(app).get(`/api/lists/${entry('List', 'mixto-ciclo-1')._id}`)
    expect(list.body.problems[0].problem).toBeNull()
    expect((await request(app).get(`/api/problems/${problem._id}`)).status).toBe(404)
    expect((await request(app).put('/api/paths/factorizacion-e-identidades/completion').send({ completed: true })).status).toBe(401)
    const rootFolder = entry('Category', 'omm')._id
    const library = await request(app).get('/api/theory').query({ categories: rootFolder, limit: 50 })
    expect(library.body.total).toBe(37)
    const reverse = await request(app).get('/api/paths').query({ contentType: 'Theory', contentId: theory.body._id })
    expect(reverse.body.items.map((p) => p.slug)).toContain('factorizacion-e-identidades')
  }, 60000)
  it('preserves existing natural identities and unrelated records', async () => {
    const original = await CONTENT_MODELS.Category.create({ name: 'Preparación para la OMM' })
    const unrelated = await CONTENT_MODELS.Category.create({ name: 'Unrelated material' })
    await importMvpContent({ apply: true })
    expect(await CONTENT_MODELS.Category.countDocuments({ name: 'Preparación para la OMM' })).toBe(1)
    expect(await CONTENT_MODELS.Category.exists({ _id: unrelated._id })).toBeTruthy()
    const child = await CONTENT_MODELS.Category.findOne({ name: 'Álgebra' })
    expect(String(child.parent)).toBe(String(original._id))
  }, 60000)
  it('rolls back a failure after content writes have started', async () => {
    const unrelated = await CONTENT_MODELS.Category.create({ name: 'Keep this folder' })
    const save = vi.spyOn(CONTENT_MODELS.Step.prototype, 'save').mockRejectedValueOnce(new Error('Injected save failure'))
    try { await expect(importMvpContent({ apply: true })).rejects.toThrow('Injected save failure') } finally { save.mockRestore() }
    expect(await CONTENT_MODELS.Problem.countDocuments()).toBe(0)
    expect(await CONTENT_MODELS.Theory.countDocuments()).toBe(0)
    expect(await CONTENT_MODELS.Exam.countDocuments()).toBe(0)
    expect(await CONTENT_MODELS.Path.countDocuments()).toBe(0)
    expect(await CONTENT_MODELS.Category.exists({ _id: unrelated._id })).toBeTruthy()
  }, 60000)
  it('runs transactional validation on a replica set', async () => {
    const hello = await mongoose.connection.db.admin().command({ hello: 1 })
    expect(hello.setName).toBeTruthy()
  })
})
