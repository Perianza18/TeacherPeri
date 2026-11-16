import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import Flag from '../models/Flag.js'
import Problem from '../models/Problem.js'
import Theory from '../models/Theory.js'
import User from '../models/User.js'
import { setFlagStatus } from '../lib/review/service.js'

async function account(username, role = 'user') {
  const res = await request(app).post('/api/auth/signup').send({ username, email: `${username}@test.com`, password: 'clave12345' })
  if (role !== 'user') await User.updateOne({ username }, { role })
  return { token: res.body.token, user: await User.findOne({ username }).lean() }
}

const legacy = { año: '2024', tema: 'Álgebra', tipo: 'Colección interna', dificultad: 'Media' }
const as = (token) => ({ Authorization: `Bearer ${token}` })
const MESSAGE = 'En el segundo párrafo dice 3 pero debería ser 5.'

async function setup() {
  const problem = await Problem.create({ codigo: 'F-1', titulo: 'Uno', enunciado: 'Enunciado público.', ...legacy })
  const draft = await Problem.create({ codigo: 'F-2', titulo: 'Dos', enunciado: 'Borrador.', ...legacy, publicationStatus: 'draft' })
  const lesson = await Theory.create({ title: 'Paridad', summary: 'Resumen.', content: 'Texto.', level: 'basico', publicationStatus: 'published' })
  return { problem, draft, lesson, lector: await account('lector'), otra: await account('otra'), editor: await account('edith', 'editor'), admin: await account('elias', 'admin') }
}

const flag = (token, body) => request(app).post('/api/flags').set(as(token)).send(body)

describe('Reportar un error', () => {
  it('cualquier persona con sesión reporta un problema o una página de teoría', async () => {
    const { problem, lesson, lector } = await setup()
    expect((await request(app).post('/api/flags').send({ targetType: 'problem', targetId: String(problem._id), message: MESSAGE })).status).toBe(401)
    expect((await flag(lector.token, { targetType: 'problem', targetId: String(problem._id), message: MESSAGE })).status).toBe(201)
    expect((await flag(lector.token, { targetType: 'theory', targetId: String(lesson._id), message: MESSAGE })).status).toBe(201)
    const stored = await Flag.find().lean()
    expect(stored).toHaveLength(2)
    expect(stored[0]).toMatchObject({ message: MESSAGE, status: 'open', reporter: lector.user._id })
  })

  it('valida el mensaje y la página', async () => {
    const { problem, draft, lector } = await setup()
    expect((await flag(lector.token, { targetType: 'problem', targetId: String(problem._id), message: 'corto' })).status).toBe(400)
    expect((await flag(lector.token, { targetType: 'problem', targetId: String(problem._id), message: 'x'.repeat(1001) })).status).toBe(400)
    expect((await flag(lector.token, { targetType: 'lista', targetId: String(problem._id), message: MESSAGE })).status).toBe(400)
    expect((await flag(lector.token, { targetType: 'problem', targetId: String(draft._id), message: MESSAGE })).status).toBe(404)
    expect((await flag(lector.token, { targetType: 'theory', targetId: String(problem._id), message: MESSAGE })).status).toBe(404)
  })

  it('un reporte abierto por persona y página; otra persona sí puede reportar', async () => {
    const { problem, lector, otra } = await setup()
    const body = { targetType: 'problem', targetId: String(problem._id), message: MESSAGE }
    expect((await flag(lector.token, body)).status).toBe(201)
    expect((await flag(lector.token, body)).status).toBe(409)
    expect((await flag(otra.token, body)).status).toBe(201)
  })

  it('solo editores y admins ven y cierran los reportes', async () => {
    const { problem, lector, editor, admin } = await setup()
    const created = await flag(lector.token, { targetType: 'problem', targetId: String(problem._id), message: MESSAGE })
    expect((await request(app).get('/api/flags').set(as(lector.token))).status).toBe(403)
    expect((await request(app).post(`/api/flags/${created.body._id}/status`).set(as(lector.token)).send({ status: 'resolved' })).status).toBe(403)

    for (const token of [editor.token, admin.token]) {
      const list = await request(app).get('/api/flags').set(as(token))
      expect(list.status).toBe(200)
      expect(list.body[0]).toMatchObject({ targetType: 'problem', targetName: 'F-1 «Uno»', message: MESSAGE, reporter: 'lector' })
    }
    const closed = await request(app).post(`/api/flags/${created.body._id}/status`).set(as(editor.token)).send({ status: 'resolved', note: 'Corregido' })
    expect(closed.body.status).toBe('resolved')
    expect((await request(app).get('/api/flags').set(as(editor.token))).body).toHaveLength(0)
    // Once closed, the same person can report the page again.
    expect((await flag(lector.token, { targetType: 'problem', targetId: String(problem._id), message: MESSAGE })).status).toBe(201)
  })

  it('el script cierra reportes solo con un editor o admin', async () => {
    const { problem, lector, editor } = await setup()
    const created = await flag(lector.token, { targetType: 'problem', targetId: String(problem._id), message: MESSAGE })
    await expect(setFlagStatus({ ref: created.body._id, status: 'dismissed', reviewer: lector.user, apply: true })).rejects.toThrow(/permission/)
    await setFlagStatus({ ref: created.body._id, status: 'dismissed', reviewer: editor.user, apply: true })
    expect((await Flag.findById(created.body._id).lean()).status).toBe('dismissed')
  })
})
