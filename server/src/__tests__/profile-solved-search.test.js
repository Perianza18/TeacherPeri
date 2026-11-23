import { describe, it, expect } from 'vitest'
import express from 'express'
import request from 'supertest'
import app from '../app.js'
import ProblemSolve from '../models/ProblemSolve.js'
import Problem from '../models/Problem.js'
import User from '../models/User.js'
import { SEARCH_LIMIT, searchLimiter } from '../routes/profiles.routes.js'
import { account, as, content } from './profile-helpers.js'

const get = (path, token) => (token ? request(app).get(path).set(as(token)) : request(app).get(path))
const solve = (token, problem) => request(app).put(`/api/problems/${problem._id}/solved`).set(as(token))

describe('Problemas resueltos (solo el dueño)', () => {
  it('el dueño recibe sus resueltos publicados, el más reciente primero, con área y fecha', async () => {
    const { problem, other, draft } = await content()
    await Problem.updateOne({ _id: other._id }, { tema: 'Geometría' })
    const ana = await account('ana')
    await solve(ana.token, problem)
    await solve(ana.token, other)
    await ProblemSolve.create({ user: ana.user._id, problem: draft._id }) // later unpublished: left out
    const res = await get('/api/profiles/ana/solved', ana.token)
    expect(res.status).toBe(200)
    expect(res.body.items.map((i) => String(i.id))).toEqual([String(other._id), String(problem._id)])
    expect(res.body.items[0]).toMatchObject({ preview: 'Otro enunciado.', area: 'Geometría', href: `/entrenamiento/problemas/${other._id}` })
    expect(res.body.items[0]).not.toHaveProperty('titulo')
    expect(new Date(res.body.items[0].solvedAt).getTime()).toBeGreaterThan(0)
    // Same number the profile shows in «En números».
    expect((await get('/api/profiles/ana', ana.token)).body.stats.solved).toBe(2)
  })

  it('visitantes y anónimos reciben 404, nunca la lista', async () => {
    const { problem } = await content()
    const ana = await account('ana')
    const beto = await account('beto')
    await solve(ana.token, problem)
    for (const token of [beto.token, null]) {
      const res = await get('/api/profiles/ana/solved', token)
      expect(res.status).toBe(404)
      expect(res.body).not.toHaveProperty('items')
    }
    // Visitors still see the number.
    expect((await get('/api/profiles/ana', beto.token)).body.stats.solved).toBe(1)
  })
})

describe('Buscar usuarios', () => {
  it('busca por inicio del usuario, sin distinguir mayúsculas, y solo devuelve datos públicos', async () => {
    await account('ana')
    await account('Andrea')
    await account('mariana')
    await account('beto', 'editor')
    const res = await get('/api/profiles?q=AN')
    expect(res.status).toBe(200)
    expect(res.body.items.map((p) => p.username)).toEqual(['Andrea', 'ana'])
    for (const person of res.body.items) expect(Object.keys(person).sort()).toEqual(['avatar', 'avatarColor', 'role', 'username'])
    expect(JSON.stringify(res.body)).not.toContain('@test.com')
    expect((await get('/api/profiles?q=@be')).body.items).toEqual([expect.objectContaining({ username: 'beto', role: 'editor' })])
  })

  it('pide al menos 2 caracteres y trata los símbolos como texto', async () => {
    await account('ana')
    for (const q of ['', 'a', '@a', ' a ']) expect((await get(`/api/profiles?q=${encodeURIComponent(q)}`)).status).toBe(400)
    expect((await get('/api/profiles')).status).toBe(400)
    expect((await get(`/api/profiles?q=${encodeURIComponent('.*')}`)).body.items).toEqual([])
    expect((await get(`/api/profiles?q=${encodeURIComponent('a'.repeat(31))}`)).status).toBe(400)
  })

  it(`devuelve como máximo ${SEARCH_LIMIT} personas`, async () => {
    await User.insertMany(Array.from({ length: 25 }, (_, i) => ({ username: `alumno${String(i).padStart(2, '0')}`, email: `alumno${i}@test.com`, passwordHash: 'x'.repeat(60) })))
    const res = await get('/api/profiles?q=alumno')
    expect(res.body.items).toHaveLength(SEARCH_LIMIT)
    expect(res.body.items[0].username).toBe('alumno00')
  })

  it('tiene su propio límite de peticiones', async () => {
    const mini = express().get('/', searchLimiter({ max: 3 }), (_req, res) => res.json({ ok: true }))
    for (let i = 0; i < 3; i += 1) expect((await request(mini).get('/')).status).toBe(200)
    const blocked = await request(mini).get('/')
    expect(blocked.status).toBe(429)
    expect(blocked.body.error).toMatch(/Demasiadas búsquedas/)
  })
})
