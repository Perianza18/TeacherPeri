import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import Category from '../models/Category.js'
import Problem from '../models/Problem.js'
import Report from '../models/Report.js'
import User from '../models/User.js'

async function signup(username) {
  const res = await request(app).post('/api/auth/signup').send({ username, email: `${username}@test.com`, password: 'clave12345' })
  return res.body.token
}

async function setup() {
  const categoria = await Category.create({ name: 'Cat' })
  const problema = await Problem.create({ codigo: 'R-1', titulo: 'Problema', enunciado: 'E.', category: categoria._id, año: '2024', tema: 'Álgebra', tipo: 'Colección interna', dificultad: 'Media', exito: 50 })
  const autor = await signup('autor')
  const lector = await signup('lector')
  const otro = await signup('otro')
  const mod = await signup('moder')
  await User.updateOne({ username: 'moder' }, { role: 'editor' })
  const c = await request(app).post(`/api/problems/${problema._id}/comments`).set('Authorization', `Bearer ${autor}`).send({ body: 'Comentario reportable' })
  const base = `/api/problems/${problema._id}/comments/${c.body._id}`
  return { problema, autor, lector, otro, mod, commentId: c.body._id, base }
}

const reportar = (base, token, body) => request(app).post(`${base}/reports`).set('Authorization', `Bearer ${token}`).send(body)

describe('Reportar comentarios', () => {
  it('pide sesión, un motivo válido y que no sea tu propio comentario', async () => {
    const { base, autor, lector } = await setup()
    expect((await request(app).post(`${base}/reports`).send({ reason: 'spam' })).status).toBe(401)
    expect((await reportar(base, lector, { reason: 'inventado' })).status).toBe(400)
    expect((await reportar(base, lector, { reason: 'otro' })).status).toBe(400)
    expect((await reportar(base, autor, { reason: 'spam' })).status).toBe(400)
  })

  it('cada persona reporta una vez', async () => {
    const { base, lector } = await setup()
    expect((await reportar(base, lector, { reason: 'spam' })).status).toBe(201)
    expect((await reportar(base, lector, { reason: 'ofensivo' })).status).toBe(409)
  })
})

describe('Cola de moderación', () => {
  it('solo editores en adelante la ven, agrupada por comentario', async () => {
    const { base, lector, otro, mod, commentId } = await setup()
    await reportar(base, lector, { reason: 'spam' })
    await reportar(base, otro, { reason: 'otro', note: 'Publicidad' })

    expect((await request(app).get('/api/reports').set('Authorization', `Bearer ${lector}`)).status).toBe(403)
    const res = await request(app).get('/api/reports').set('Authorization', `Bearer ${mod}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0]).toMatchObject({ count: 2, comment: { _id: commentId, body: 'Comentario reportable' }, problem: { codigo: 'R-1' } })
    expect(res.body[0].reports.map((r) => r.reason)).toEqual(['spam', 'otro'])
  })

  it('descartar vacía la cola; eliminar el comentario resuelve sus reportes', async () => {
    const { base, lector, otro, mod, commentId } = await setup()
    await reportar(base, lector, { reason: 'spam' })
    const descartar = await request(app).post(`/api/reports/comments/${commentId}/dismiss`).set('Authorization', `Bearer ${mod}`)
    expect(descartar.body).toEqual({ dismissed: 1 })
    expect((await request(app).get('/api/reports').set('Authorization', `Bearer ${mod}`)).body).toEqual([])

    await reportar(base, otro, { reason: 'spam' })
    await request(app).delete(base).set('Authorization', `Bearer ${mod}`).send({ reason: 'spam' })
    expect((await request(app).get('/api/reports').set('Authorization', `Bearer ${mod}`)).body).toEqual([])
    expect(await Report.countDocuments({ status: 'resolved' })).toBe(1)
    expect((await reportar(base, lector, { reason: 'spam' })).status).toBe(409) // ya eliminado
  })
})
