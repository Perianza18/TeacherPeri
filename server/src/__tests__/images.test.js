import { describe, it, expect } from 'vitest'
import request from 'supertest'
import sharp from 'sharp'
import app from '../app.js'
import ContentRevision from '../models/ContentRevision.js'
import Problem from '../models/Problem.js'
import ProblemImage from '../models/ProblemImage.js'
import ProblemSubmission from '../models/ProblemSubmission.js'
import Topic from '../models/Topic.js'
import User from '../models/User.js'
import { sniffFormat } from '../lib/images.js'

const STATEMENT = 'En el triángulo $ABC$ de la figura, encuentra el ángulo $\\angle BAC$.'
const as = (token) => ({ Authorization: `Bearer ${token}` })
const legacy = { año: '2024', tema: 'Geometría', tipo: 'Colección interna', dificultad: 'Media' }

async function account(username, role = 'user') {
  const res = await request(app).post('/api/auth/signup').send({ username, email: `${username}@test.com`, password: 'clave12345' })
  if (role !== 'user') await User.updateOne({ username }, { role })
  return { token: res.body.token, user: await User.findOne({ username }).lean() }
}

const png = (width = 2000, height = 1000) => sharp({ create: { width, height, channels: 3, background: '#ffffff' } }).png().toBuffer()
const upload = (token, buffer, type = 'image/png') => request(app).post('/api/images').set(as(token)).set('Content-Type', type).send(buffer)

async function setup() {
  const geometria = await Topic.create({ name: 'Geometría', slug: 'omm-geometry' })
  return { geometria, ana: await account('ana'), beto: await account('beto'), editor: await account('edith', 'editor'), admin: await account('elias', 'admin') }
}

describe('Subir imágenes', () => {
  it('pide sesión; reduce a 1200 px y guarda WebP en la base; se sirve con caché larga', async () => {
    const { ana } = await setup()
    expect((await request(app).post('/api/images').set('Content-Type', 'image/png').send(await png())).status).toBe(401)
    const res = await upload(ana.token, await png())
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({ width: 1200, height: 600 })
    const stored = await ProblemImage.findById(res.body._id).lean()
    expect(stored).toMatchObject({ contentType: 'image/webp', width: 1200 })
    const served = await request(app).get(`/api/images/${res.body._id}`).buffer(true).parse((r, done) => { const chunks = []; r.on('data', (c) => chunks.push(c)); r.on('end', () => done(null, Buffer.concat(chunks))) })
    expect(served.status).toBe(200)
    expect(served.headers['content-type']).toBe('image/webp')
    expect(served.headers['cache-control']).toContain('max-age=31536000')
    expect(sniffFormat(served.body)).toBe('webp')
  })

  it('acepta JPG y WebP; rechaza SVG, texto y archivos de más de 5 MB', async () => {
    const { ana } = await setup()
    const jpg = await sharp({ create: { width: 300, height: 200, channels: 3, background: '#000' } }).jpeg().toBuffer()
    const webp = await sharp({ create: { width: 300, height: 200, channels: 3, background: '#000' } }).webp().toBuffer()
    expect((await upload(ana.token, jpg, 'image/jpeg')).status).toBe(201)
    expect((await upload(ana.token, webp, 'image/webp')).status).toBe(201)
    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><script>alert(1)</script></svg>')
    expect((await upload(ana.token, svg, 'image/svg+xml')).status).toBe(415)
    // Lying about the type does not help: the bytes decide.
    expect((await upload(ana.token, svg, 'image/png')).status).toBe(415)
    expect((await upload(ana.token, Buffer.from('hola, esto no es una imagen'), 'image/png')).status).toBe(415)
    const big = Buffer.concat([await png(10, 10), Buffer.alloc(5 * 1024 * 1024)])
    expect((await upload(ana.token, big)).status).toBe(413)
  })
})

describe('Imágenes en propuestas', () => {
  it('cada imagen necesita su descripción; máximo 4; solo imágenes propias; solo en el enunciado', async () => {
    const { ana, beto, geometria } = await setup()
    const mine = (await upload(ana.token, await png(400, 300))).body._id
    const others = (await upload(beto.token, await png(400, 300))).body._id
    const send = (images) => request(app).post('/api/submissions').set(as(ana.token)).send({ enunciado: STATEMENT, topics: [String(geometria._id)], images })
    expect((await send([{ image: mine, alt: '' }])).status).toBe(400)
    expect((await send([{ image: others, alt: 'Triángulo ABC con el ángulo en A marcado.' }])).status).toBe(403)
    expect((await send([{ image: mine, alt: 'Triángulo ABC.', placement: 'solution' }])).status).toBe(400)
    const five = await Promise.all([1, 2, 3, 4, 5].map(async () => ({ image: (await upload(ana.token, await png(50, 50))).body._id, alt: 'Figura de prueba.' })))
    expect((await send(five)).status).toBe(400)

    const ok = await send([{ image: mine, alt: 'Triángulo ABC con el ángulo en A marcado.' }])
    expect(ok.status).toBe(201)
    expect(ok.body.proposal.images).toEqual([{ image: mine, alt: 'Triángulo ABC con el ángulo en A marcado.', placement: 'statement' }])
    const draft = await Problem.findById(ok.body._id).lean()
    expect(draft.images.map((entry) => String(entry.image))).toEqual([mine])
  })

  it('el admin las ve en la revisión y, al aprobar, pasan al problema publicado', async () => {
    const { ana, admin, geometria } = await setup()
    const id = (await upload(ana.token, await png(400, 300))).body._id
    const sent = await request(app).post('/api/submissions').set(as(ana.token)).send({ enunciado: STATEMENT, topics: [String(geometria._id)], images: [{ image: id, alt: 'Triángulo ABC.' }] })
    const queue = await request(app).get('/api/review').set(as(admin.token))
    expect(queue.body.submissions[0].images).toEqual([{ image: id, alt: 'Triángulo ABC.', placement: 'statement', url: `/api/images/${id}` }])
    const submission = await ProblemSubmission.findOne({ problem: sent.body._id }).lean()
    expect((await request(app).post(`/api/review/submissions/${submission._id}/approve`).set(as(admin.token)).send({})).status).toBe(200)
    const live = await request(app).get(`/api/problems/${sent.body._id}`)
    expect(live.body.images).toEqual([{ image: id, alt: 'Triángulo ABC.', placement: 'statement' }])
  })

  it('al quitar una imagen de un borrador, la imagen se borra', async () => {
    const { ana, geometria } = await setup()
    const id = (await upload(ana.token, await png(400, 300))).body._id
    const sent = await request(app).post('/api/submissions').set(as(ana.token)).send({ enunciado: STATEMENT, topics: [String(geometria._id)], images: [{ image: id, alt: 'Triángulo ABC.' }] })
    expect((await request(app).put(`/api/submissions/mine/${sent.body._id}`).set(as(ana.token)).send({ enunciado: STATEMENT, topics: [String(geometria._id)], images: [] })).status).toBe(200)
    expect(await ProblemImage.exists({ _id: id })).toBeNull()
  })
})

describe('Editores e imágenes', () => {
  it('agregan imágenes al enunciado y a la solución, las reemplazan o quitan; queda en el historial', async () => {
    const { editor, ana } = await setup()
    const problem = await Problem.create({ codigo: 'G-1', titulo: 'Figura', enunciado: 'Enunciado de geometría con figura.', ...legacy })
    const base = { titulo: 'Figura', enunciado: problem.enunciado, hint: '', solution: 'Ver figura.', topics: [], tags: [] }
    const a = (await upload(editor.token, await png(600, 400))).body._id
    const b = (await upload(editor.token, await png(600, 400))).body._id
    // A user may not edit images through the editor endpoint.
    expect((await request(app).put(`/api/editor/problems/${problem._id}`).set(as(ana.token)).send({ ...base, images: [{ image: a, alt: 'Figura uno.' }] })).status).toBe(403)

    const first = await request(app).put(`/api/editor/problems/${problem._id}`).set(as(editor.token)).send({ ...base, images: [{ image: a, alt: 'Figura del enunciado.' }, { image: b, alt: 'Figura de la solución.', placement: 'solution' }] })
    expect(first.status).toBe(200)
    expect(first.body.changed).toContain('images')
    const c = (await upload(editor.token, await png(600, 400))).body._id
    const replaced = await request(app).put(`/api/editor/problems/${problem._id}`).set(as(editor.token)).send({ ...base, images: [{ image: c, alt: 'Figura del enunciado, corregida.' }] })
    expect(replaced.status).toBe(200)
    expect(await ProblemImage.exists({ _id: a })).toBeNull()
    expect(await ProblemImage.exists({ _id: b })).toBeNull()
    const revision = await ContentRevision.findById(replaced.body.revision).lean()
    expect(revision.changes.find((change) => change.field === 'images').after).toEqual([`1. Figura del enunciado, corregida. (${c})`])
  })
})
