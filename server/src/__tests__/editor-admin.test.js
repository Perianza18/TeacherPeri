import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import Category from '../models/Category.js'
import Comment from '../models/Comment.js'
import ContentRevision from '../models/ContentRevision.js'
import Notification from '../models/Notification.js'
import Problem from '../models/Problem.js'
import ProblemSubmission from '../models/ProblemSubmission.js'
import Report from '../models/Report.js'
import Tag from '../models/Tag.js'
import Theory from '../models/Theory.js'
import Topic from '../models/Topic.js'
import User from '../models/User.js'
import { restoreProblem } from '../lib/review/service.js'

const STATEMENT = 'Demuestra que para todo entero $n$, el número $n^2+n$ es par.'
const legacy = { año: '2024', tema: 'Álgebra', tipo: 'Colección interna', dificultad: 'Media' }
const as = (token) => ({ Authorization: `Bearer ${token}` })

async function account(username, role = 'user') {
  const res = await request(app).post('/api/auth/signup').send({ username, email: `${username}@test.com`, password: 'clave12345' })
  if (role !== 'user') await User.updateOne({ username }, { role })
  return { token: res.body.token, user: await User.findOne({ username }).lean() }
}

async function setup() {
  const algebra = await Topic.create({ name: 'Álgebra', slug: 'omm-algebra' })
  const geometria = await Topic.create({ name: 'Geometría', slug: 'omm-geometry' })
  const paridad = await Tag.create({ name: 'paridad', label: 'Paridad' })
  const root = await Category.create({ name: 'Exámenes', kind: 'exam' })
  const omm = await Category.create({ name: 'OMM', kind: 'exam', parent: root._id })
  const pending = await Category.create({ name: '2031', kind: 'exam', parent: omm._id, reviewStatus: 'pending' })
  const problem = await Problem.create({ codigo: 'P-1', titulo: 'Uno', enunciado: 'Enunciado original del problema uno.', hint: 'Pista vieja.', ...legacy, topics: [algebra._id] })
  const lesson = await Theory.create({ title: 'Paridad', summary: 'Resumen.', content: 'Texto viejo.', level: 'basico', publicationStatus: 'published' })
  return {
    algebra, geometria, paridad, root, omm, pending, problem, lesson,
    usuario: await account('lector'),
    editor: await account('edith', 'editor'),
    admin: await account('elias', 'admin'),
    admin2: await account('cata', 'teacherperi'),
  }
}

const problemBody = (problem, extra = {}) => ({
  titulo: problem.titulo, enunciado: problem.enunciado, hint: problem.hint, solution: '', topics: problem.topics.map(String), tags: [], examFolder: null, problemNumber: null, ...extra,
})

describe('Editores: editar cualquier problema o lección', () => {
  it('solo editores y admins; nunca sin sesión ni un usuario', async () => {
    const { problem, lesson, usuario } = await setup()
    expect((await request(app).get(`/api/editor/problems/${problem._id}`)).status).toBe(401)
    expect((await request(app).get(`/api/editor/problems/${problem._id}`).set(as(usuario.token))).status).toBe(403)
    expect((await request(app).put(`/api/editor/problems/${problem._id}`).set(as(usuario.token)).send(problemBody(problem, { enunciado: STATEMENT }))).status).toBe(403)
    expect((await request(app).put(`/api/editor/theory/${lesson._id}`).set(as(usuario.token)).send({ title: 'X', summary: 'Y', content: 'Z' })).status).toBe(403)
    expect((await Problem.findById(problem._id).lean()).enunciado).toBe('Enunciado original del problema uno.')
  })

  it('un editor cambia un problema: queda guardado quién, cuándo y qué, y los admins reciben aviso', async () => {
    const { problem, editor, admin, admin2, geometria, paridad, omm } = await setup()
    const view = await request(app).get(`/api/editor/problems/${problem._id}`).set(as(editor.token))
    expect(view.status).toBe(200)
    const res = await request(app).put(`/api/editor/problems/${problem._id}`).set(as(editor.token)).send({
      ...problemBody(problem), enunciado: STATEMENT, hint: 'Pista 1.\n\nPista 2.', solution: 'Porque $n(n+1)$ es par.', topics: [String(geometria._id)], tags: [String(paridad._id)], examFolder: String(omm._id), problemNumber: 3, baseUpdatedAt: view.body.updatedAt, author: editor.user._id, publicationStatus: 'draft',
    })
    expect(res.status).toBe(200)
    expect(res.body.changed).toEqual(['enunciado', 'hint', 'solution', 'topics', 'tags', 'examFolder', 'problemNumber'])
    const stored = await Problem.findById(problem._id).lean()
    expect(stored).toMatchObject({ enunciado: STATEMENT, solution: 'Porque $n(n+1)$ es par.', problemNumber: 3, publicationStatus: 'published', author: null })
    expect(stored.categories.map(String)).toEqual([String(omm._id)])

    const revision = await ContentRevision.findById(res.body.revision).lean()
    expect(revision).toMatchObject({ targetType: 'problem', editorRole: 'editor', targetLabel: 'P-1 «Uno»' })
    expect(revision.changes.find((c) => c.field === 'topics')).toMatchObject({ before: ['Álgebra'], after: ['Geometría'] })
    expect(revision.changes.find((c) => c.field === 'examFolder')).toMatchObject({ before: null, after: 'OMM' })

    const notes = await Notification.find({ type: 'content-edited' }).lean()
    expect(notes.map((n) => String(n.user)).sort()).toEqual([String(admin.user._id), String(admin2.user._id)].sort())
    expect(notes[0]).toMatchObject({ link: `/panel/cambios/${revision._id}` })
    expect(notes[0].message).toContain('@edith editó P-1 «Uno»: enunciado, pistas')
    const inbox = await request(app).get('/api/notifications').set(as(admin.token))
    expect(inbox.body.items[0]).toMatchObject({ type: 'content-edited', link: `/panel/cambios/${revision._id}` })
  })

  it('un admin que edita avisa a los otros admins, no a sí mismo', async () => {
    const { lesson, admin, admin2 } = await setup()
    const res = await request(app).put(`/api/editor/theory/${lesson._id}`).set(as(admin.token)).send({ title: 'Paridad', summary: 'Resumen.', content: 'Texto nuevo con $x^2$.' })
    expect(res.status).toBe(200)
    expect((await Theory.findById(lesson._id).lean()).content).toBe('Texto nuevo con $x^2$.')
    const notes = await Notification.find({ type: 'content-edited' }).lean()
    expect(notes.map((n) => String(n.user))).toEqual([String(admin2.user._id)])
  })

  it('valida: fórmulas rotas, carpeta en revisión, sin cambios y cambios de otra persona', async () => {
    const { problem, editor, pending } = await setup()
    const broken = await request(app).put(`/api/editor/problems/${problem._id}`).set(as(editor.token)).send(problemBody(problem, { solution: 'Usa $\\frac{1}{2$.' }))
    expect(broken.status).toBe(422)
    expect(broken.body.error).toMatch(/^Solución:/)
    expect((await request(app).put(`/api/editor/problems/${problem._id}`).set(as(editor.token)).send(problemBody(problem, { examFolder: String(pending._id) }))).status).toBe(400)
    expect((await request(app).put(`/api/editor/problems/${problem._id}`).set(as(editor.token)).send(problemBody(problem))).status).toBe(400)
    const stale = await request(app).put(`/api/editor/problems/${problem._id}`).set(as(editor.token)).send(problemBody(problem, { enunciado: STATEMENT, baseUpdatedAt: '2020-01-01T00:00:00.000Z' }))
    expect(stale.status).toBe(409)
    expect(await ContentRevision.countDocuments()).toBe(0)
  })

  it('solo los admins leen el historial de cambios', async () => {
    const { lesson, editor, admin } = await setup()
    await request(app).put(`/api/editor/theory/${lesson._id}`).set(as(editor.token)).send({ title: 'Paridad 2', summary: 'Resumen.', content: 'Texto viejo.' })
    expect((await request(app).get('/api/editor/revisions').set(as(editor.token))).status).toBe(403)
    const list = await request(app).get('/api/editor/revisions').set(as(admin.token))
    expect(list.body).toHaveLength(1)
    expect(list.body[0]).toMatchObject({ editor: 'edith', targetType: 'theory', href: `/entrenamiento/teoria/${lesson._id}` })
    const detail = await request(app).get(`/api/editor/revisions/${list.body[0]._id}`).set(as(admin.token))
    expect(detail.body.changes).toEqual([{ field: 'title', label: 'Título', before: 'Paridad', after: 'Paridad 2' }])
  })
})

describe('Editores y admins: revisión en el sitio', () => {
  async function proposal(token, topic) {
    return request(app).post('/api/submissions').set(as(token)).send({ enunciado: STATEMENT, topics: topic ? [String(topic._id)] : [] })
  }

  it('un usuario no ve la cola; un admin aprueba y queda en el historial sin avisar a nadie', async () => {
    const { usuario, admin, algebra } = await setup()
    const sent = await proposal(usuario.token, algebra)
    const submission = await ProblemSubmission.findOne({ problem: sent.body._id }).lean()
    expect((await request(app).get('/api/review').set(as(usuario.token))).status).toBe(403)
    expect((await request(app).post(`/api/review/submissions/${submission._id}/approve`).set(as(usuario.token)).send({})).status).toBe(403)
    const queue = await request(app).get('/api/review').set(as(admin.token))
    expect(queue.body.submissions).toHaveLength(1)
    const ok = await request(app).post(`/api/review/submissions/${submission._id}/approve`).set(as(admin.token)).send({ fixes: { title: 'Paridad de n^2+n' } })
    expect(ok.status).toBe(200)
    expect((await Problem.findById(sent.body._id).lean())).toMatchObject({ publicationStatus: 'published', titulo: 'Paridad de n^2+n' })
    expect(await Notification.countDocuments({ user: usuario.user._id, type: 'submission-approved' })).toBe(1)
    expect(await ContentRevision.findOne({ kind: 'review' }).lean()).toMatchObject({ action: 'approved', editorRole: 'admin', targetType: 'problem' })
    expect(await Notification.countDocuments({ type: 'editor-reviewed' })).toBe(0)
  })

  it('un editor aprueba o rechaza; cada decisión sale en Cambios y avisa a los admins', async () => {
    const { usuario, editor, admin, admin2, algebra } = await setup()
    const first = await proposal(usuario.token, algebra)
    const second = await request(app).post('/api/submissions').set(as(usuario.token)).send({ enunciado: 'Encuentra todos los enteros positivos $k$ tales que $k^2+1$ divide a $k^3+5$.', topics: [String(algebra._id)] })
    const [a, b] = await Promise.all([first, second].map((sent) => ProblemSubmission.findOne({ problem: sent.body._id }).lean()))
    expect((await request(app).get('/api/review').set(as(editor.token))).body.submissions).toHaveLength(2)
    expect((await request(app).post(`/api/review/submissions/${a._id}/approve`).set(as(editor.token)).send({})).status).toBe(200)
    expect((await request(app).post(`/api/review/submissions/${b._id}/reject`).set(as(editor.token)).send({ reason: 'Falta un dato en el enunciado.' })).status).toBe(200)

    const history = await request(app).get('/api/editor/revisions').set(as(admin.token))
    expect(history.body.map((r) => [r.kind, r.action, r.editor])).toEqual([['review', 'rejected', 'edith'], ['review', 'approved', 'edith']])
    expect(history.body[0]).toMatchObject({ note: 'Falta un dato en el enunciado.', href: `/entrenamiento/problemas/${second.body._id}` })
    const notes = await Notification.find({ type: 'editor-reviewed' }).lean()
    expect(notes).toHaveLength(4)
    expect(new Set(notes.map((n) => String(n.user)))).toEqual(new Set([String(admin.user._id), String(admin2.user._id)]))
    expect(notes.find((n) => n.message.startsWith('@edith aprobó el problema nuevo'))).toBeTruthy()
    expect(notes.every((n) => n.link.startsWith('/panel/cambios/'))).toBe(true)
  })

  it('restaurar un problema borrado sigue siendo solo de admins', async () => {
    const { editor, admin, problem } = await setup()
    await Problem.updateOne({ _id: problem._id }, { deletedAt: new Date(), publicationStatus: 'archived' })
    await expect(restoreProblem({ ref: problem.codigo, reviewer: editor.user, apply: true })).rejects.toThrow(/permission/)
    await restoreProblem({ ref: problem.codigo, reviewer: admin.user, apply: true })
    expect((await Problem.findById(problem._id).lean()).deletedAt).toBeNull()
  })

  it('al aprobar se pueden corregir áreas y carpeta; sin área no se aprueba', async () => {
    const { usuario, admin, geometria, omm } = await setup()
    const sent = await proposal(usuario.token, null)
    const submission = await ProblemSubmission.findOne({ problem: sent.body._id }).lean()
    const missing = await request(app).post(`/api/review/submissions/${submission._id}/approve`).set(as(admin.token)).send({})
    expect(missing.status).toBe(400)
    expect(missing.body.checks.map((c) => c.message)).toContain('Agrega al menos un área antes de aprobar.')
    const fixed = await request(app).post(`/api/review/submissions/${submission._id}/approve`).set(as(admin.token)).send({ fixes: { topics: [String(geometria._id)], folder: String(omm._id), number: 2 } })
    expect(fixed.status).toBe(200)
    const stored = await Problem.findById(sent.body._id).lean()
    expect(stored.categories.map(String)).toContain(String(omm._id))
    expect(stored).toMatchObject({ problemNumber: 2, tipo: 'Examen' })
  })

  it('rechazar pide un motivo, que llega a la persona autora', async () => {
    const { usuario, admin, algebra } = await setup()
    const sent = await proposal(usuario.token, algebra)
    const submission = await ProblemSubmission.findOne({ problem: sent.body._id }).lean()
    const empty = await request(app).post(`/api/review/submissions/${submission._id}/reject`).set(as(admin.token)).send({ reason: '' })
    expect(empty.status).toBe(400)
    expect(empty.body.error).toMatch(/motivo/)
    expect((await request(app).post(`/api/review/submissions/${submission._id}/reject`).set(as(admin.token)).send({ reason: 'Falta un dato en el enunciado.' })).status).toBe(200)
    expect((await ProblemSubmission.findById(submission._id).lean())).toMatchObject({ status: 'rejected', reason: 'Falta un dato en el enunciado.' })
  })

  it('carpetas: un usuario no; un editor aprueba, renombra y rechaza, y queda registrado', async () => {
    const { usuario, editor, omm } = await setup()
    const a = await Category.create({ name: 'Jalisco', kind: 'exam', parent: omm._id, reviewStatus: 'pending', createdBy: usuario.user._id })
    const b = await Category.create({ name: 'Basura', kind: 'exam', parent: omm._id, reviewStatus: 'pending', createdBy: usuario.user._id })
    expect((await request(app).post(`/api/review/folders/${a._id}/approve`).set(as(usuario.token))).status).toBe(403)
    expect((await request(app).post(`/api/review/folders/${a._id}/rename`).set(as(editor.token)).send({ name: 'Jalisco (estatal)' })).status).toBe(200)
    expect((await request(app).post(`/api/review/folders/${a._id}/approve`).set(as(editor.token))).status).toBe(200)
    expect((await request(app).post(`/api/review/folders/${b._id}/reject`).set(as(editor.token)).send({ reason: 'No es un examen real.' })).status).toBe(200)
    expect((await Category.findById(a._id).lean())).toMatchObject({ name: 'Jalisco (estatal)', reviewStatus: 'approved' })
    expect((await Category.findById(b._id).lean()).reviewStatus).toBe('rejected')
    const actions = (await ContentRevision.find({ kind: 'review' }).sort({ createdAt: 1 }).lean()).map((r) => [r.targetType, r.action])
    expect(actions).toEqual([['folder', 'renamed'], ['folder', 'approved'], ['folder', 'rejected']])
  })
})

describe('Admins: nombrar editores', () => {
  it('solo admins; solo se da Editor o Usuario; nunca admin desde el sitio', async () => {
    const { usuario, editor, admin } = await setup()
    expect((await request(app).get('/api/users').set(as(editor.token))).status).toBe(403)
    expect((await request(app).put(`/api/users/${usuario.user._id}/role`).set(as(editor.token)).send({ role: 'editor' })).status).toBe(403)
    const list = await request(app).get('/api/users?q=lec').set(as(admin.token))
    expect(list.body.map((u) => u.username)).toEqual(['lector'])
    expect((await request(app).put(`/api/users/${usuario.user._id}/role`).set(as(admin.token)).send({ role: 'admin' })).status).toBe(400)
    const named = await request(app).put(`/api/users/${usuario.user._id}/role`).set(as(admin.token)).send({ role: 'editor' })
    expect(named.body.role).toBe('editor')
    // The new editor can edit right away (the role is read on every request).
    expect((await request(app).get('/api/reports').set(as(usuario.token))).status).toBe(200)
    expect((await request(app).put(`/api/users/${usuario.user._id}/role`).set(as(admin.token)).send({ role: 'user' })).body.role).toBe('user')
  })

  it('no se le puede quitar el rol a la última cuenta admin', async () => {
    const { admin, admin2 } = await setup()
    expect((await request(app).put(`/api/users/${admin2.user._id}/role`).set(as(admin.token)).send({ role: 'editor' })).status).toBe(200)
    const last = await request(app).put(`/api/users/${admin.user._id}/role`).set(as(admin.token)).send({ role: 'user' })
    expect(last.status).toBe(409)
    expect((await User.findById(admin.user._id).lean()).role).toBe('admin')
  })
})

describe('Moderación: descartar reportes de comentarios con nota', () => {
  it('editor+ descarta con nota; un usuario no puede', async () => {
    const { problem, usuario, editor } = await setup()
    const otra = await account('otra')
    const comment = await Comment.create({ problem: problem._id, author: otra.user._id, body: 'Hola' })
    await Report.create({ comment: comment._id, problem: problem._id, reporter: usuario.user._id, reason: 'spam' })
    expect((await request(app).post(`/api/reports/comments/${comment._id}/dismiss`).set(as(usuario.token)).send({ note: 'x' })).status).toBe(403)
    expect((await request(app).post(`/api/reports/comments/${comment._id}/dismiss`).set(as(editor.token)).send({ note: 'No es spam.' })).status).toBe(200)
    expect((await Report.findOne({ comment: comment._id }).lean())).toMatchObject({ status: 'dismissed', handledNote: 'No es spam.' })
  })
})
