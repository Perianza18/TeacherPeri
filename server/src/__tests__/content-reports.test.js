import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import ContentReport from '../models/ContentReport.js'
import Flag from '../models/Flag.js'
import Problem from '../models/Problem.js'
import Theory from '../models/Theory.js'
import User from '../models/User.js'

async function account(username, role = 'user') {
  const res = await request(app).post('/api/auth/signup').send({ username, email: `${username}@test.com`, password: 'clave12345' })
  if (role !== 'user') await User.updateOne({ username }, { role })
  return { token: res.body.token, user: await User.findOne({ username }).lean() }
}

const legacy = { año: '2024', tema: 'Álgebra', tipo: 'Colección interna', dificultad: 'Media' }
const as = (token) => ({ Authorization: `Bearer ${token}` })

async function setup() {
  const problem = await Problem.create({ codigo: 'R-1', titulo: 'Uno', enunciado: 'Enunciado público.', ...legacy })
  const draft = await Problem.create({ codigo: 'R-2', titulo: 'Dos', enunciado: 'Borrador.', ...legacy, publicationStatus: 'draft' })
  const lesson = await Theory.create({ title: 'Paridad', summary: 'Resumen.', content: 'Texto.', level: 'basico', publicationStatus: 'published' })
  return { problem, draft, lesson, lector: await account('lector'), otra: await account('otra'), editor: await account('edith', 'editor'), admin: await account('elias', 'admin') }
}

const report = (token, body) => request(app).post('/api/reports/content').set(as(token)).send(body)

describe('Reportar un problema o una lección (Moderación)', () => {
  it('cualquier persona con sesión reporta con un motivo; no es una sugerencia', async () => {
    const { problem, lesson, lector } = await setup()
    expect((await request(app).post('/api/reports/content').send({ targetType: 'problem', targetId: String(problem._id), reason: 'spam' })).status).toBe(401)
    expect((await report(lector.token, { targetType: 'problem', targetId: String(problem._id), reason: 'spam' })).status).toBe(201)
    expect((await report(lector.token, { targetType: 'theory', targetId: String(lesson._id), reason: 'otro', note: 'Tiene un enlace a un casino.' })).status).toBe(201)
    expect(await ContentReport.countDocuments()).toBe(2)
    expect(await Flag.countDocuments()).toBe(0)
  })

  it('valida el motivo y la página; uno abierto por persona y página', async () => {
    const { problem, draft, lector, otra } = await setup()
    const body = { targetType: 'problem', targetId: String(problem._id), reason: 'ofensivo' }
    expect((await report(lector.token, { ...body, reason: 'feo' })).status).toBe(400)
    expect((await report(lector.token, { ...body, reason: 'otro' })).body.error).toBe('Escribe el motivo.')
    expect((await report(lector.token, { ...body, targetType: 'lista' })).status).toBe(400)
    expect((await report(lector.token, { ...body, targetId: String(draft._id) })).status).toBe(404)
    expect((await report(lector.token, body)).status).toBe(201)
    expect((await report(lector.token, body)).status).toBe(409)
    expect((await report(otra.token, body)).status).toBe(201)
  })

  it('solo editores y admins los ven y los cierran, con nota', async () => {
    const { problem, lector, editor, admin } = await setup()
    const created = await report(lector.token, { targetType: 'problem', targetId: String(problem._id), reason: 'spam' })
    expect((await request(app).get('/api/reports/content').set(as(lector.token))).status).toBe(403)
    expect((await request(app).post(`/api/reports/content/${created.body._id}/status`).set(as(lector.token)).send({ status: 'resolved' })).status).toBe(403)
    for (const token of [editor.token, admin.token]) {
      const list = await request(app).get('/api/reports/content').set(as(token))
      expect(list.status).toBe(200)
      expect(list.body[0]).toMatchObject({ targetType: 'problem', targetName: 'R-1 «Uno»', reason: 'spam', reporter: 'lector', status: 'open' })
    }
    const closed = await request(app).post(`/api/reports/content/${created.body._id}/status`).set(as(editor.token)).send({ status: 'dismissed', note: 'No es spam' })
    expect(closed.body.status).toBe('dismissed')
    expect((await request(app).get('/api/reports/content').set(as(editor.token))).body).toHaveLength(0)
    expect((await request(app).get('/api/reports/content?status=dismissed').set(as(editor.token))).body[0]).toMatchObject({ handledBy: 'edith', handledNote: 'No es spam' })
    expect((await request(app).post(`/api/reports/content/${created.body._id}/status`).set(as(editor.token)).send({ status: 'resolved' })).status).toBe(404)
  })

  it('los reportes de comentarios siguen igual: solo editores y admins', async () => {
    const { lector, editor } = await setup()
    expect((await request(app).get('/api/reports').set(as(lector.token))).status).toBe(403)
    expect((await request(app).get('/api/reports').set(as(editor.token))).status).toBe(200)
  })
})
