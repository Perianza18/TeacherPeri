import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import Comment from '../models/Comment.js'
import Flag from '../models/Flag.js'
import User from '../models/User.js'
import { account, as, content } from './profile-helpers.js'

const get = (path, token) => (token ? request(app).get(path).set(as(token)) : request(app).get(path))
const comment = (token, problem, body = 'Usa $x^2$ aquí.') => request(app).post(`/api/problems/${problem._id}/comments`).set(as(token)).send({ body })

describe('Mi Espacio: perfil público y privado', () => {
  it('el correo solo llega a su dueño; visitantes y anónimos nunca lo reciben', async () => {
    const ana = await account('ana')
    const beto = await account('beto')
    const own = await get('/api/profiles/ana', ana.token)
    expect(own.status).toBe(200)
    expect(own.body).toMatchObject({ username: 'ana', role: 'user', isOwner: true, email: 'ana@test.com', bio: '' })
    expect(own.body.avatar).toMatch(/^a\d\d$/)
    for (const token of [beto.token, null]) {
      const visit = await get('/api/profiles/ana', token)
      expect(visit.status).toBe(200)
      expect(visit.body.isOwner).toBe(false)
      expect(visit.body).not.toHaveProperty('email')
      expect(JSON.stringify(visit.body)).not.toContain('ana@test.com')
    }
    expect((await get('/api/profiles/nadie')).status).toBe(404)
  })

  it('la actividad es solo para el dueño (404 para cualquier otra persona)', async () => {
    const { problem } = await content()
    const ana = await account('ana')
    const beto = await account('beto')
    await comment(ana.token, problem)
    const own = await get('/api/profiles/ana/activity', ana.token)
    expect(own.status).toBe(200)
    expect(own.body.items[0]).toMatchObject({ kind: 'comment', target: { label: 'Casillas' } })
    expect(own.body.items[0].target.href).toMatch(new RegExp(`^/entrenamiento/problemas/${problem._id}#comentario-`))
    expect((await get('/api/profiles/ana/activity', beto.token)).status).toBe(404)
    expect((await get('/api/profiles/ana/activity')).status).toBe(404)
  })

  it('«Mis envíos»: las sugerencias propias, nunca las de otra persona', async () => {
    const { problem, lesson } = await content()
    const ana = await account('ana')
    const beto = await account('beto')
    await Flag.create({ targetType: 'theory', target: lesson._id, reporter: ana.user._id, message: 'Falta un caso en el ejemplo.' })
    await Flag.create({ targetType: 'problem', target: problem._id, reporter: beto.user._id, message: 'El enunciado tiene un error.', status: 'resolved' })
    const mine = await get('/api/flags/mine', ana.token)
    expect(mine.status).toBe(200)
    expect(mine.body).toHaveLength(1)
    expect(mine.body[0]).toMatchObject({ targetType: 'theory', status: 'open', target: { label: 'Principio de casillas' } })
    expect((await get('/api/flags/mine')).status).toBe(401)
  })

  it('editar perfil: avatar de la lista y descripción corta', async () => {
    const ana = await account('ana')
    const ok = await request(app).put('/api/profiles/me').set(as(ana.token)).send({ avatar: 'a07', bio: '  Me gusta   la geometría.  ' })
    expect(ok.status).toBe(200)
    expect(ok.body).toMatchObject({ avatar: 'a07', bio: 'Me gusta la geometría.' })
    expect((await request(app).put('/api/profiles/me').set(as(ana.token)).send({ avatar: 'https://foto.com/x.png' })).status).toBe(400)
    expect((await request(app).put('/api/profiles/me').set(as(ana.token)).send({ bio: 'x'.repeat(161) })).status).toBe(400)
    expect((await request(app).put('/api/profiles/me').send({ bio: 'hola' })).status).toBe(401)
    expect((await get('/api/auth/me', ana.token)).body.user).toMatchObject({ avatar: 'a07', bio: 'Me gusta la geometría.' })
  })

  it('editar perfil: un dibujo y su color de fondo, que se ven en la cuenta, el perfil y los comentarios', async () => {
    const ana = await account('ana')
    const put = (body) => request(app).put('/api/profiles/me').set(as(ana.token)).send(body)
    const ok = await put({ avatar: 'de-hecho', avatarColor: 'menta' })
    expect(ok.status).toBe(200)
    expect(ok.body).toMatchObject({ avatar: 'de-hecho', avatarColor: 'menta' })
    expect((await get('/api/auth/me', ana.token)).body.user).toMatchObject({ avatar: 'de-hecho', avatarColor: 'menta' })
    expect((await get('/api/profiles/ana')).body).toMatchObject({ avatar: 'de-hecho', avatarColor: 'menta' })

    const { problem } = await content()
    await request(app).post(`/api/problems/${problem._id}/comments`).set(as(ana.token)).send({ body: 'Hola' })
    const thread = await get(`/api/problems/${problem._id}/comments`)
    expect(thread.body[0].author).toMatchObject({ username: 'ana', avatar: 'de-hecho', avatarColor: 'menta' })

    // Cambiar solo el avatar conserva el color; null regresa al color propio del avatar.
    expect((await put({ avatar: 'a03' })).body).toMatchObject({ avatar: 'a03', avatarColor: 'menta' })
    expect((await put({ avatarColor: null })).body).toMatchObject({ avatar: 'a03', avatarColor: null })
    expect((await put({ avatarColor: '#ff0000' })).status).toBe(400)
    expect((await put({ avatarColor: 'rojo' })).status).toBe(400)
    expect((await User.findOne({ username: 'ana' }).lean()).avatarColor).toBeNull()
  })

  it('comentarios públicos: solo visibles y en problemas publicados, con enlace al comentario', async () => {
    const { problem, other, draft } = await content()
    const ana = await account('ana')
    const first = await comment(ana.token, problem, 'Primero')
    await comment(ana.token, other, 'Segundo')
    await Comment.create({ problem: draft._id, author: ana.user._id, body: 'En un borrador' })
    await request(app).delete(`/api/problems/${other._id}/comments/${(await Comment.findOne({ body: 'Segundo' }))._id}`).set(as(ana.token)).send({})
    const res = await get('/api/profiles/ana/comments')
    expect(res.status).toBe(200)
    expect(res.body.total).toBe(1)
    expect(res.body.items[0]).toMatchObject({ body: 'Primero', target: { label: 'Casillas', href: `/entrenamiento/problemas/${problem._id}#comentario-${first.body._id}` } })
    expect((await get('/api/profiles/ana')).body.stats.comments).toBe(1)
  })
})

describe('Mi Espacio: seguir', () => {
  it('seguir y dejar de seguir, sin duplicados; no puedes seguirte a ti', async () => {
    const ana = await account('ana')
    const beto = await account('beto')
    const follow = () => request(app).put('/api/profiles/ana/follow').set(as(beto.token))
    expect((await follow()).body).toMatchObject({ followers: 1, isFollowing: true })
    expect((await follow()).body).toMatchObject({ followers: 1, isFollowing: true })
    expect((await get('/api/profiles/ana', beto.token)).body).toMatchObject({ followers: 1, following: 0, isFollowing: true })
    expect((await get('/api/profiles/beto')).body).toMatchObject({ followers: 0, following: 1 })
    const followers = await get('/api/profiles/ana/followers')
    expect(followers.body).toMatchObject({ total: 1, items: [{ username: 'beto', role: 'user' }] })
    expect((await get('/api/profiles/beto/following')).body.items[0].username).toBe('ana')
    expect((await request(app).put('/api/profiles/ana/follow').set(as(ana.token))).status).toBe(400)
    expect((await request(app).put('/api/profiles/ana/follow')).status).toBe(401)
    expect((await request(app).delete('/api/profiles/ana/follow').set(as(beto.token))).body).toMatchObject({ followers: 0, isFollowing: false })
    expect((await request(app).delete('/api/profiles/ana/follow').set(as(beto.token))).status).toBe(200)
  })

  it('las listas de seguidores nunca incluyen el correo', async () => {
    await account('ana')
    const beto = await account('beto')
    await request(app).put('/api/profiles/ana/follow').set(as(beto.token))
    const res = await get('/api/profiles/ana/followers')
    expect(JSON.stringify(res.body)).not.toContain('@test.com')
    expect(await User.countDocuments()).toBe(2)
  })
})
