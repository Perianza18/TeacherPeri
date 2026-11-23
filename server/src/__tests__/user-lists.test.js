import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import UserListItem from '../models/UserListItem.js'
import { account, as, content } from './profile-helpers.js'

const create = (token, body) => request(app).post('/api/my-lists').set(as(token)).send(body)
const add = (token, id, body) => request(app).post(`/api/my-lists/${id}/items`).set(as(token)).send(body)

describe('Listas personales', () => {
  it('crear, renombrar, hacer pública o privada y borrar (solo el dueño)', async () => {
    const ana = await account('ana')
    const beto = await account('beto')
    const made = await create(ana.token, { name: '  Geometría para el estatal ' })
    expect(made.status).toBe(201)
    expect(made.body).toMatchObject({ name: 'Geometría para el estatal', isPublic: false, count: 0 })
    const id = made.body.id
    expect((await create(ana.token, { name: '' })).status).toBe(400)
    expect((await create(ana.token, { name: 'x'.repeat(81) })).status).toBe(400)
    expect((await create(null, { name: 'Sin sesión' })).status).toBe(401)

    expect((await request(app).patch(`/api/my-lists/${id}`).set(as(beto.token)).send({ name: 'Mía' })).status).toBe(404)
    expect((await request(app).delete(`/api/my-lists/${id}`).set(as(beto.token))).status).toBe(404)
    const renamed = await request(app).patch(`/api/my-lists/${id}`).set(as(ana.token)).send({ name: 'Ángulos', isPublic: true })
    expect(renamed.body).toMatchObject({ name: 'Ángulos', isPublic: true })
    expect((await request(app).patch(`/api/my-lists/${id}`).set(as(ana.token)).send({ isPublic: 'sí' })).status).toBe(400)

    expect((await request(app).delete(`/api/my-lists/${id}`).set(as(ana.token))).status).toBe(204)
    expect((await request(app).get(`/api/my-lists/${id}`).set(as(ana.token))).status).toBe(404)
  })

  it('una lista privada nunca llega a otra persona, ni en el perfil ni por su id', async () => {
    const { problem } = await content()
    const ana = await account('ana')
    const beto = await account('beto')
    const privada = (await create(ana.token, { name: 'Secreta' })).body
    const publica = (await create(ana.token, { name: 'Abierta', isPublic: true })).body
    await add(ana.token, privada.id, { itemType: 'problem', item: String(problem._id) })

    const own = await request(app).get('/api/profiles/ana/lists').set(as(ana.token))
    expect(own.body.items.map((l) => l.name).sort()).toEqual(['Abierta', 'Secreta'])
    for (const token of [beto.token, null]) {
      const visit = token ? await request(app).get('/api/profiles/ana/lists').set(as(token)) : await request(app).get('/api/profiles/ana/lists')
      expect(visit.body.items.map((l) => l.name)).toEqual(['Abierta'])
      expect(JSON.stringify(visit.body)).not.toContain('Secreta')
      const byId = token ? await request(app).get(`/api/my-lists/${privada.id}`).set(as(token)) : await request(app).get(`/api/my-lists/${privada.id}`)
      expect(byId.status).toBe(404)
      expect(JSON.stringify(byId.body)).not.toContain('Casillas')
    }
    expect((await request(app).get(`/api/my-lists/${publica.id}`)).body).toMatchObject({ name: 'Abierta', isOwner: false, owner: { username: 'ana' } })
    expect((await request(app).get(`/api/my-lists/${privada.id}`).set(as(ana.token))).body).toMatchObject({ isOwner: true, count: 1, items: [{ itemType: 'problem', label: 'Casillas' }] })
  })

  it('guardar problemas y lecciones publicados, sin duplicar; quitar; borrar la lista borra sus elementos', async () => {
    const { problem, draft, lesson, hiddenLesson } = await content()
    const ana = await account('ana')
    const beto = await account('beto')
    const list = (await create(ana.token, { name: 'Repaso' })).body
    expect((await add(ana.token, list.id, { itemType: 'problem', item: String(problem._id) })).status).toBe(201)
    expect((await add(ana.token, list.id, { itemType: 'problem', item: String(problem._id) })).status).toBe(200)
    expect((await add(ana.token, list.id, { itemType: 'theory', item: String(lesson._id) })).status).toBe(201)
    expect((await add(ana.token, list.id, { itemType: 'problem', item: String(draft._id) })).status).toBe(404)
    expect((await add(ana.token, list.id, { itemType: 'theory', item: String(hiddenLesson._id) })).status).toBe(404)
    expect((await add(ana.token, list.id, { itemType: 'post', item: String(problem._id) })).status).toBe(400)
    expect((await add(beto.token, list.id, { itemType: 'problem', item: String(problem._id) })).status).toBe(404)

    const containing = await request(app).get(`/api/my-lists/containing?itemType=theory&item=${lesson._id}`).set(as(ana.token))
    expect(containing.body.items).toMatchObject([{ name: 'Repaso', contains: true, count: 2 }])
    expect((await request(app).get(`/api/my-lists/containing?itemType=theory&item=${lesson._id}`).set(as(beto.token))).body.items).toEqual([])

    expect((await request(app).delete(`/api/my-lists/${list.id}/items/theory/${lesson._id}`).set(as(ana.token))).status).toBe(204)
    expect((await request(app).get(`/api/my-lists/${list.id}`).set(as(ana.token))).body.count).toBe(1)
    await request(app).delete(`/api/my-lists/${list.id}`).set(as(ana.token))
    expect(await UserListItem.countDocuments()).toBe(0)
  })

  it('«Guardado» aparece en la actividad del dueño', async () => {
    const { lesson } = await content()
    const ana = await account('ana')
    const list = (await create(ana.token, { name: 'Teoría' })).body
    await add(ana.token, list.id, { itemType: 'theory', item: String(lesson._id) })
    const activity = await request(app).get('/api/profiles/ana/activity').set(as(ana.token))
    expect(activity.body.items[0]).toMatchObject({ kind: 'saved', target: { label: 'Principio de casillas' }, list: { name: 'Teoría', href: `/perfil/ana/colecciones/${list.id}` } })
  })
})
