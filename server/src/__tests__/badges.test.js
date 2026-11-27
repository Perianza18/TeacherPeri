import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import Comment from '../models/Comment.js'
import Flag from '../models/Flag.js'
import ProblemSolve from '../models/ProblemSolve.js'
import ProblemSubmission from '../models/ProblemSubmission.js'
import UserBadge from '../models/UserBadge.js'
import { account, as, content } from './profile-helpers.js'

const badges = (username) => request(app).get(`/api/profiles/${username}/badges`)

describe('Insignias', () => {
  it('sin actividad: nada ganado y el siguiente nivel de cada categoría bloqueado', async () => {
    await account('ana')
    const res = await badges('ana')
    expect(res.body.earned).toEqual([])
    expect(res.body.locked.map((b) => [b.id, b.remaining])).toEqual([['solved-1', 1], ['comments-1', 1], ['contributions-1', 1], ['solutions-1', 1], ['suggestions-1', 1]])
  })

  it('«Lo resolví» cuenta problemas resueltos y otorga la insignia con su fecha', async () => {
    const { problem, draft } = await content()
    const ana = await account('ana')
    expect((await request(app).put(`/api/problems/${problem._id}/solved`).set(as(ana.token))).body).toEqual({ solved: true })
    expect((await request(app).put(`/api/problems/${problem._id}/solved`).set(as(ana.token))).status).toBe(200)
    expect((await request(app).put(`/api/problems/${draft._id}/solved`).set(as(ana.token))).status).toBe(404)
    expect((await request(app).get(`/api/problems/${problem._id}/solved`).set(as(ana.token))).body).toEqual({ solved: true })
    expect((await request(app).put(`/api/problems/${problem._id}/solved`)).status).toBe(401)
    const solve = await ProblemSolve.findOne().lean()
    const res = await badges('ana')
    expect(res.body.earned).toMatchObject([{ id: 'solved-1', name: 'Primer problema', color: 'mint' }])
    expect(new Date(res.body.earned[0].earnedAt).getTime()).toBe(solve.createdAt.getTime())
    expect(res.body.locked.find((b) => b.category === 'solved')).toMatchObject({ id: 'solved-10', remaining: 9 })
    expect((await request(app).get('/api/profiles/ana')).body.stats).toMatchObject({ solved: 1, badges: 1 })
  })

  it('umbrales: 10 comentarios dan dos insignias, con la fecha del décimo', async () => {
    const { problem } = await content()
    const ana = await account('ana')
    const base = Date.UTC(2026, 9, 1)
    await Comment.insertMany(Array.from({ length: 10 }, (_, i) => ({ problem: problem._id, author: ana.user._id, body: `c${i}`, createdAt: new Date(base + i * 86400000) })))
    const res = await badges('ana')
    expect(res.body.earned.map((b) => b.id)).toEqual(['comments-1', 'comments-10'])
    expect(new Date(res.body.earned[1].earnedAt).toISOString()).toBe(new Date(base + 9 * 86400000).toISOString())
    expect(res.body.locked.find((b) => b.category === 'comments')).toMatchObject({ id: 'comments-50', remaining: 40 })
  })

  it('problemas aceptados, sugerencias aplicadas e insignia de rol', async () => {
    const { problem } = await content()
    const edith = await account('edith', 'editor')
    await ProblemSubmission.create({ problem: problem._id, author: edith.user._id, kind: 'create', proposed: { enunciado: 'Enunciado público.' }, status: 'approved', reviewedAt: new Date() })
    await Flag.create({ targetType: 'problem', target: problem._id, reporter: edith.user._id, message: 'Hay un error de signo.', status: 'resolved', handledAt: new Date() })
    await Flag.create({ targetType: 'problem', target: problem._id, reporter: edith.user._id, message: 'Otra sugerencia aquí.', status: 'dismissed' })
    const ids = (await badges('edith')).body.earned.map((b) => b.id)
    expect(ids).toEqual(['contributions-1', 'suggestions-1', 'role-editor'])
  })

  it('una insignia ganada no se pierde si después baja la cuenta', async () => {
    const { problem } = await content()
    const ana = await account('ana')
    await request(app).put(`/api/problems/${problem._id}/solved`).set(as(ana.token))
    await badges('ana')
    await request(app).delete(`/api/problems/${problem._id}/solved`).set(as(ana.token))
    const res = await badges('ana')
    expect(res.body.earned.map((b) => b.id)).toEqual(['solved-1'])
    expect(res.body.locked.find((b) => b.category === 'solved')).toMatchObject({ id: 'solved-10', remaining: 10 })
    expect(await UserBadge.countDocuments()).toBe(1)
  })
})
