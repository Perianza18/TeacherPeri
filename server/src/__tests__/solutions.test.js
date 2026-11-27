import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import ContentRevision from '../models/ContentRevision.js'
import Flag from '../models/Flag.js'
import Notification from '../models/Notification.js'
import SolutionProposal from '../models/SolutionProposal.js'
import User from '../models/User.js'
import UserBadge from '../models/UserBadge.js'
import { account, as, content } from './profile-helpers.js'

const BODY = 'Por casillas: hay 3 colores y 4 calcetines, así que dos coinciden. $3+1=4$.'
const propose = (token, body) => request(app).post('/api/solutions').set(as(token)).send(body)

async function setup() {
  const { problem, draft } = await content()
  return { problem, draft, ana: await account('ana'), beto: await account('beto'), editor: await account('edith', 'editor') }
}

describe('Proponer una solución', () => {
  it('cualquier persona con sesión propone; se valida el texto y el problema', async () => {
    const { problem, draft, ana } = await setup()
    const id = String(problem._id)
    expect((await request(app).post('/api/solutions').send({ problemId: id, body: BODY })).status).toBe(401)
    expect((await propose(ana.token, { problemId: id, body: 'corta' })).status).toBe(400)
    expect((await propose(ana.token, { problemId: id, body: 'Una fórmula sin cerrar: $x+1 y ya.' })).status).toBe(400)
    expect((await propose(ana.token, { problemId: String(draft._id), body: BODY })).status).toBe(404)
    expect((await propose(ana.token, { problemId: id, body: BODY })).status).toBe(201)
    expect((await propose(ana.token, { problemId: id, body: BODY })).status).toBe(409)
    const mine = await request(app).get('/api/solutions/mine').set(as(ana.token))
    expect(mine.body).toHaveLength(1)
    expect(mine.body[0]).toMatchObject({ status: 'pending', body: BODY, problem: { label: 'Casillas' } })
  })

  it('solo editores y admins la revisan; aceptada se publica con crédito, avisa y da puntos e insignia', async () => {
    const { problem, ana, beto, editor } = await setup()
    const id = String(problem._id)
    const created = await propose(ana.token, { problemId: id, body: BODY })
    await propose(beto.token, { problemId: id, body: `${BODY} Otra forma.` })

    expect((await request(app).get('/api/solutions/pending').set(as(ana.token))).status).toBe(403)
    expect((await request(app).post(`/api/solutions/${created.body.id}/approve`).set(as(ana.token))).status).toBe(403)
    const pending = await request(app).get('/api/solutions/pending').set(as(editor.token))
    expect(pending.body.items.map((item) => item.author)).toEqual(['ana', 'beto'])
    expect(pending.body.items[0].problem).toMatchObject({ codigo: 'P-1', titulo: 'Casillas' })

    // Nothing public until it is approved.
    expect((await request(app).get(`/api/solutions/problem/${id}`)).body.items).toEqual([])
    expect((await request(app).post(`/api/solutions/${created.body.id}/approve`).set(as(editor.token))).status).toBe(200)
    const published = await request(app).get(`/api/solutions/problem/${id}`)
    expect(published.body.items).toHaveLength(1)
    expect(published.body.items[0]).toMatchObject({ body: BODY, author: { username: 'ana', frame: 'lapiz' } })

    expect(await Notification.findOne({ user: ana.user._id, type: 'solution-approved' })).toBeTruthy()
    expect(await ContentRevision.findOne({ kind: 'review', action: 'approved' })).toBeTruthy()
    expect(await UserBadge.exists({ user: ana.user._id, badge: 'solutions-1' })).toBeTruthy()
    expect((await User.findById(ana.user._id).lean()).points).toBe(25)
    const profile = await request(app).get('/api/profiles/ana')
    expect(profile.body.level).toMatchObject({ points: 25, frame: 'lapiz', next: { id: 'bronce', remaining: 5 } })
    expect(profile.body.stats.solutions).toBe(1)
  })

  it('rechazar pide motivo y avisa; quien la envió puede retirarla mientras está en revisión', async () => {
    const { problem, ana, beto, editor } = await setup()
    const id = String(problem._id)
    const a = await propose(ana.token, { problemId: id, body: BODY })
    const b = await propose(beto.token, { problemId: id, body: BODY })
    expect((await request(app).post(`/api/solutions/${a.body.id}/reject`).set(as(editor.token)).send({ reason: 'no' })).status).toBe(400)
    expect((await request(app).post(`/api/solutions/${a.body.id}/reject`).set(as(editor.token)).send({ reason: 'Falta justificar el caso de 2 colores.' })).status).toBe(200)
    const notice = await Notification.findOne({ user: ana.user._id, type: 'solution-rejected' }).lean()
    expect(notice.message).toContain('Falta justificar')
    expect((await User.findById(ana.user._id).lean()).points ?? 0).toBe(0)
    // After a rejection the same person can try again.
    expect((await propose(ana.token, { problemId: id, body: BODY })).status).toBe(201)

    expect((await request(app).delete(`/api/solutions/${b.body.id}`).set(as(ana.token))).status).toBe(404)
    expect((await request(app).delete(`/api/solutions/${b.body.id}`).set(as(beto.token))).status).toBe(200)
    expect((await SolutionProposal.findById(b.body.id).lean()).status).toBe('withdrawn')
  })
})

describe('Puntos y marcos', () => {
  it('resolver y comentar no dan puntos; una sugerencia aplicada sí', async () => {
    const { problem, ana, editor } = await setup()
    const id = String(problem._id)
    await request(app).put(`/api/problems/${id}/solved`).set(as(ana.token))
    await request(app).post(`/api/problems/${id}/comments`).set(as(ana.token)).send({ body: 'Me salió con casillas.' })
    expect((await request(app).get('/api/profiles/ana')).body.level.points).toBe(0)

    const flag = await request(app).post('/api/flags').set(as(ana.token)).send({ targetType: 'problem', targetId: id, message: 'En el enunciado falta decir cuántos colores hay.' })
    await request(app).post(`/api/flags/${flag.body._id}/status`).set(as(editor.token)).send({ status: 'resolved' })
    expect((await Flag.findById(flag.body._id).lean()).status).toBe('resolved')
    expect((await User.findById(ana.user._id).lean()).points).toBe(10)
  })

  it('solo se puede elegir un marco desbloqueado; sin elegir se muestra el mejor', async () => {
    const { ana } = await setup()
    expect((await request(app).put('/api/profiles/me').set(as(ana.token)).send({ frame: 'oro' })).status).toBe(403)
    expect((await request(app).put('/api/profiles/me').set(as(ana.token)).send({ frame: 'arcoiris' })).status).toBe(400)
    await User.updateOne({ _id: ana.user._id }, { points: 120 })
    const me = await request(app).get('/api/auth/me').set(as(ana.token))
    expect(me.body.user.frame).toBe('plata')
    const saved = await request(app).put('/api/profiles/me').set(as(ana.token)).send({ frame: 'bronce' })
    expect(saved.status).toBe(200)
    expect(saved.body.frame).toBe('bronce')
    expect((await request(app).put('/api/profiles/me').set(as(ana.token)).send({ frame: null })).body.frame).toBe('plata')
  })
})

describe('Avatares que se compran con puntos', () => {
  const buy = (token, id) => request(app).post(`/api/profiles/me/avatars/${id}`).set(as(token))

  it('las cuentas nuevas y las figuras que ya no se ofrecen muestran «π»', async () => {
    const { ana } = await setup()
    expect((await request(app).get('/api/profiles/ana')).body.avatar).toBe('a04')
    await User.updateOne({ _id: ana.user._id }, { avatar: 'a07' })
    expect((await request(app).get('/api/profiles/ana')).body.avatar).toBe('a04')
    expect((await request(app).put('/api/profiles/me').set(as(ana.token)).send({ avatar: 'a07' })).status).toBe(400)
    expect((await request(app).put('/api/profiles/me').set(as(ana.token)).send({ avatar: 'gato-dormido' })).status).toBe(200)
  })

  it('se compra con el saldo; gastar no baja el marco y no se puede usar sin comprar', async () => {
    const { problem, ana, editor } = await setup()
    expect((await request(app).put('/api/profiles/me').set(as(ana.token)).send({ avatar: 'gato-de-traje' })).status).toBe(403)
    expect((await buy(ana.token, 'gato-de-traje')).status).toBe(403)
    expect((await buy(ana.token, 'no-existe')).status).toBe(404)

    // Two accepted solutions: 50 points.
    for (const body of [BODY, `${BODY} Bis.`]) {
      const sent = await propose(ana.token, { problemId: String(problem._id), body })
      await request(app).post(`/api/solutions/${sent.body.id}/approve`).set(as(editor.token))
    }
    const bought = await buy(ana.token, 'gato-pensando')
    expect(bought.status).toBe(200)
    expect(bought.body).toEqual({ unlockedAvatars: ['gato-pensando'], balance: 10 })
    expect((await buy(ana.token, 'gato-de-traje')).status).toBe(403)
    expect((await buy(ana.token, 'gato-pensando')).body.balance).toBe(10)

    expect((await request(app).put('/api/profiles/me').set(as(ana.token)).send({ avatar: 'gato-pensando' })).status).toBe(200)
    const profile = await request(app).get('/api/profiles/ana').set(as(ana.token))
    expect(profile.body).toMatchObject({ avatar: 'gato-pensando', unlockedAvatars: ['gato-pensando'], level: { points: 50, balance: 10, frame: 'bronce' } })
    // Visitors do not see what someone bought.
    expect((await request(app).get('/api/profiles/ana')).body.unlockedAvatars).toBeUndefined()
  })
})
