import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import Category from '../models/Category.js'
import Notification from '../models/Notification.js'
import Problem from '../models/Problem.js'
import ProblemSubmission from '../models/ProblemSubmission.js'
import Tag from '../models/Tag.js'
import Topic from '../models/Topic.js'
import User from '../models/User.js'
import { approveFolder, approveSubmission, rejectFolder, rejectSubmission, restoreProblem } from '../lib/review/service.js'

const STATEMENT = 'Demuestra que para todo entero $n$, el número $n^2+n$ es par.'
const OTHER = 'Encuentra todos los enteros positivos $k$ tales que $k^2+3$ divide a $k^3+5$.'

async function account(username, role = 'user') {
  const res = await request(app).post('/api/auth/signup').send({ username, email: `${username}@test.com`, password: 'clave12345' })
  if (role !== 'user') await User.updateOne({ username }, { role })
  const user = await User.findOne({ username }).lean()
  return { token: res.body.token, user }
}

async function setup() {
  const geometria = await Topic.create({ name: 'Geometría', slug: 'omm-geometry' })
  const algebra = await Topic.create({ name: 'Álgebra', slug: 'omm-algebra' })
  const original = await Tag.create({ name: 'teacherperi-original', slug: 'teacherperi-original', label: 'Original TeacherPeri' })
  const paridad = await Tag.create({ name: 'paridad', label: 'Paridad' })
  const ana = await account('ana')
  const beto = await account('beto')
  const admin = await account('elias', 'admin')
  const editor = await account('edith', 'editor')
  return { geometria, algebra, original, paridad, ana, beto, admin, editor }
}

const as = (token) => ({ Authorization: `Bearer ${token}` })
const submit = (token, body) => request(app).post('/api/submissions').set(as(token)).send(body)

describe('Proponer un problema', () => {
  it('pide sesión', async () => {
    expect((await request(app).post('/api/submissions').send({ enunciado: STATEMENT })).status).toBe(401)
    expect((await request(app).get('/api/submissions/mine')).status).toBe(401)
  })

  it('queda en revisión: no es público, pero su autora lo ve en Mis envíos', async () => {
    const { ana, beto, algebra } = await setup()
    const res = await submit(ana.token, { enunciado: STATEMENT, topics: [String(algebra._id)] })
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({ codigo: 'U-00001', state: 'pending', isPublic: false, titulo: 'Problema propuesto' })

    expect((await request(app).get(`/api/problems/${res.body._id}`)).status).toBe(404)
    expect((await request(app).get('/api/problems')).body).toHaveLength(0)
    expect((await request(app).get('/api/submissions/mine').set(as(ana.token))).body).toHaveLength(1)
    expect((await request(app).get('/api/submissions/mine').set(as(beto.token))).body).toHaveLength(0)
    const stored = await Problem.findById(res.body._id).lean()
    expect(stored).toMatchObject({ publicationStatus: 'draft', tema: 'Álgebra', tipo: 'Comunidad', author: ana.user._id })
    expect(await ProblemSubmission.countDocuments({ problem: res.body._id, status: 'pending', kind: 'create' })).toBe(1)
  })

  it('ignora campos que el navegador no debe decidir (estado, autor, código)', async () => {
    const { ana, beto } = await setup()
    const res = await submit(ana.token, { enunciado: STATEMENT, publicationStatus: 'published', status: 'approved', author: String(beto.user._id), codigo: 'TP-X99', approvedAt: new Date() })
    expect(res.status).toBe(201)
    const stored = await Problem.findById(res.body._id).lean()
    expect(stored.publicationStatus).toBe('draft')
    expect(String(stored.author)).toBe(String(ana.user._id))
    expect(stored.codigo).toBe('U-00001')
    expect(stored.approvedAt).toBeNull()
  })

  it('revisa el enunciado y las etiquetas antes de guardar', async () => {
    const { ana, original } = await setup()
    const cases = [
      [{ enunciado: 'Muy corto' }, 'statement-short'],
      [{ enunciado: 'Calcula el valor de $\\frac{1}{2$ cuando todo está bien escrito.' }, 'math-error'],
      [{ enunciado: 'Si $x es un real positivo, demuestra la desigualdad pedida aquí.' }, 'math-unbalanced'],
      [{ enunciado: STATEMENT, tags: [String(original._id)] }, 'reserved-tag'],
      [{ enunciado: STATEMENT, topics: ['64b000000000000000000000'] }, 'unknown-topic'],
      [{ enunciado: STATEMENT, isExam: true }, 'exam-folder-missing'],
    ]
    for (const [body, code] of cases) {
      const res = await submit(ana.token, body)
      expect(res.status, code).toBe(422)
      expect(res.body.checks.map((c) => c.code)).toContain(code)
    }
    expect((await submit(ana.token, { enunciado: STATEMENT, tags: 'no-es-lista' })).status).toBe(400)
    expect(await Problem.countDocuments()).toBe(0)
  })

  it('no deja enviar dos veces el mismo enunciado', async () => {
    const { ana } = await setup()
    expect((await submit(ana.token, { enunciado: STATEMENT })).status).toBe(201)
    const again = await submit(ana.token, { enunciado: `  ${STATEMENT.toUpperCase()} ` })
    expect(again.status).toBe(422)
    expect(again.body.checks.map((c) => c.code)).toContain('duplicate')
  })

  it('no acepta comentarios mientras está en revisión', async () => {
    const { ana, beto } = await setup()
    const { body } = await submit(ana.token, { enunciado: STATEMENT })
    const res = await request(app).post(`/api/problems/${body._id}/comments`).set(as(beto.token)).send({ body: 'Hola' })
    expect(res.status).toBe(404)
  })
})

describe('Revisión (servicio que usan los scripts)', () => {
  it('solo un admin aprueba: ni la autora ni un editor pueden', async () => {
    const { ana, editor, algebra } = await setup()
    const { body } = await submit(ana.token, { enunciado: STATEMENT, topics: [String(algebra._id)] })
    await expect(approveSubmission({ ref: body.codigo, reviewer: ana.user, apply: true })).rejects.toThrow(/permission/)
    await expect(approveSubmission({ ref: body.codigo, reviewer: editor.user, apply: true })).rejects.toThrow(/permission/)
    await expect(approveSubmission({ ref: body.codigo, reviewer: null, apply: true })).rejects.toThrow(/reviewer/)
    expect((await Problem.findById(body._id).lean()).publicationStatus).toBe('draft')
  })

  it('el modo de prueba describe el cambio y no escribe nada', async () => {
    const { ana, admin, algebra } = await setup()
    const { body } = await submit(ana.token, { enunciado: STATEMENT, topics: [String(algebra._id)] })
    const plan = await approveSubmission({ ref: body.codigo, reviewer: admin.user })
    expect(plan.mode).toBe('dry-run')
    expect(plan.changes.join('\n')).toMatch(/publish U-00001/)
    expect((await Problem.findById(body._id).lean()).publicationStatus).toBe('draft')
    expect(await ProblemSubmission.countDocuments({ status: 'pending' })).toBe(1)
  })

  it('aprobar lo publica, da crédito a la autora y le avisa', async () => {
    const { ana, admin, algebra, paridad } = await setup()
    const { body } = await submit(ana.token, { enunciado: STATEMENT, topics: [String(algebra._id)] })
    const result = await approveSubmission({ ref: body.codigo, reviewer: admin.user, fixes: { tags: ['Paridad'], difficulty: 'basico' }, apply: true })
    expect(result.mode).toBe('applied')

    const pub = await request(app).get(`/api/problems/${body._id}`)
    expect(pub.status).toBe(200)
    expect(pub.body.sourceAttribution).toBe('Propuesto por @ana.')
    expect(pub.body.difficulty).toBe('basico')
    expect(pub.body.tags.map((t) => t.label)).toEqual([paridad.label])
    expect((await request(app).get('/api/submissions/mine').set(as(ana.token))).body[0].state).toBe('published')

    const notes = await request(app).get('/api/notifications').set(as(ana.token))
    expect(notes.body.unread).toBe(1)
    expect(notes.body.items[0]).toMatchObject({ type: 'submission-approved' })
    await request(app).post('/api/notifications/read').set(as(ana.token))
    expect((await request(app).get('/api/notifications').set(as(ana.token))).body.unread).toBe(0)
  })

  it('pide al menos un área para aprobar', async () => {
    const { ana, admin } = await setup()
    const { body } = await submit(ana.token, { enunciado: STATEMENT })
    await expect(approveSubmission({ ref: body.codigo, reviewer: admin.user, apply: true })).rejects.toThrow(/Fix the errors/)
    await approveSubmission({ ref: body.codigo, reviewer: admin.user, fixes: { topics: ['Álgebra'] }, apply: true })
    expect((await Problem.findById(body._id).lean()).tema).toBe('Álgebra')
  })

  it('rechazar exige un motivo; la autora lo ve, corrige y vuelve a enviarlo', async () => {
    const { ana, admin, algebra } = await setup()
    const { body } = await submit(ana.token, { enunciado: STATEMENT, topics: [String(algebra._id)] })
    await expect(rejectSubmission({ ref: body.codigo, reviewer: admin.user, reason: '', apply: true })).rejects.toThrow(/reason/)
    await rejectSubmission({ ref: body.codigo, reviewer: admin.user, reason: 'Falta decir que n es entero positivo.', apply: true })

    const [mine] = (await request(app).get('/api/submissions/mine').set(as(ana.token))).body
    expect(mine).toMatchObject({ state: 'rejected', latest: { status: 'rejected', reason: 'Falta decir que n es entero positivo.' } })
    expect((await Notification.findOne({ user: ana.user._id }).lean()).type).toBe('submission-rejected')

    const edited = await request(app).put(`/api/submissions/mine/${body._id}`).set(as(ana.token)).send({ enunciado: `${STATEMENT} Aquí $n$ es positivo.`, topics: [String(algebra._id)] })
    expect(edited.status).toBe(200)
    expect(edited.body.state).toBe('pending')
    expect(await ProblemSubmission.countDocuments({ problem: body._id, status: 'pending' })).toBe(1)
  })

  it('editar un problema publicado deja la versión aprobada visible hasta aprobar el cambio', async () => {
    const { ana, admin, algebra } = await setup()
    const { body } = await submit(ana.token, { enunciado: STATEMENT, topics: [String(algebra._id)] })
    await approveSubmission({ ref: body.codigo, reviewer: admin.user, apply: true })

    const same = await request(app).put(`/api/submissions/mine/${body._id}`).set(as(ana.token)).send({ enunciado: STATEMENT, topics: [String(algebra._id)] })
    expect(same.status).toBe(400)

    const changed = `${STATEMENT} Generaliza a $n^3-n$.`
    const edit = await request(app).put(`/api/submissions/mine/${body._id}`).set(as(ana.token)).send({ enunciado: changed, topics: [String(algebra._id)] })
    expect(edit.body.state).toBe('published-pending')
    expect((await request(app).get(`/api/problems/${body._id}`)).body.enunciado).toBe(STATEMENT)

    // A second edit replaces the waiting proposal instead of stacking another one.
    await request(app).put(`/api/submissions/mine/${body._id}`).set(as(ana.token)).send({ enunciado: `${changed} Bonus.`, topics: [String(algebra._id)] })
    expect(await ProblemSubmission.countDocuments({ problem: body._id, status: 'pending' })).toBe(1)

    await approveSubmission({ ref: body.codigo, reviewer: admin.user, apply: true })
    expect((await request(app).get(`/api/problems/${body._id}`)).body.enunciado).toBe(`${changed} Bonus.`)
  })

  it('nadie edita ni borra el problema de otra persona', async () => {
    const { ana, beto, editor } = await setup()
    const { body } = await submit(ana.token, { enunciado: STATEMENT })
    expect((await request(app).put(`/api/submissions/mine/${body._id}`).set(as(beto.token)).send({ enunciado: OTHER })).status).toBe(403)
    expect((await request(app).delete(`/api/submissions/mine/${body._id}`).set(as(beto.token))).status).toBe(403)
    expect((await request(app).put(`/api/submissions/mine/${body._id}`).set(as(editor.token)).send({ enunciado: OTHER })).status).toBe(403)
    expect((await request(app).get(`/api/submissions/mine/${body._id}`).set(as(beto.token))).status).toBe(403)
    expect((await request(app).put('/api/submissions/mine/64b000000000000000000000').set(as(ana.token)).send({ enunciado: OTHER })).status).toBe(404)
    expect((await Problem.findById(body._id).lean()).enunciado).toBe(STATEMENT)
  })

  it('borrar es suave: se oculta, retira lo pendiente y un admin lo restaura', async () => {
    const { ana, admin, editor, algebra } = await setup()
    const { body } = await submit(ana.token, { enunciado: STATEMENT, topics: [String(algebra._id)] })
    await approveSubmission({ ref: body.codigo, reviewer: admin.user, apply: true })
    await request(app).put(`/api/submissions/mine/${body._id}`).set(as(ana.token)).send({ enunciado: OTHER, topics: [String(algebra._id)] })

    expect((await request(app).delete(`/api/submissions/mine/${body._id}`).set(as(ana.token))).status).toBe(200)
    expect((await request(app).get(`/api/problems/${body._id}`)).status).toBe(404)
    expect((await request(app).get('/api/submissions/mine').set(as(ana.token))).body).toHaveLength(0)
    expect(await ProblemSubmission.countDocuments({ problem: body._id, status: 'withdrawn' })).toBe(1)
    expect(await Problem.exists({ _id: body._id, deletedAt: { $ne: null } })).toBeTruthy()
    expect((await request(app).delete(`/api/submissions/mine/${body._id}`).set(as(ana.token))).status).toBe(404)

    await expect(restoreProblem({ ref: body.codigo, reviewer: editor.user, apply: true })).rejects.toThrow(/permission/)
    await restoreProblem({ ref: body.codigo, reviewer: admin.user, apply: true })
    expect((await request(app).get(`/api/problems/${body._id}`)).body.enunciado).toBe(STATEMENT)
    expect(await ProblemSubmission.countDocuments({ problem: body._id, status: 'pending' })).toBe(1)
  })
})

describe('Carpetas de examen', () => {
  it('crea la raíz «Exámenes» al usarse y oculta las carpetas en revisión a los demás', async () => {
    const { ana, beto } = await setup()
    const first = await request(app).get('/api/submissions/folders').set(as(ana.token))
    expect(first.body).toHaveLength(1)
    const root = first.body[0]
    expect(root).toMatchObject({ name: 'Exámenes', parent: null, reviewStatus: 'approved' })

    const omm = await request(app).post('/api/submissions/folders').set(as(ana.token)).send({ name: 'OMM', parent: root._id })
    expect(omm.status).toBe(201)
    expect(omm.body).toMatchObject({ reviewStatus: 'pending', mine: true, path: ['Exámenes', 'OMM'] })

    expect((await request(app).get('/api/submissions/folders').set(as(ana.token))).body.map((f) => f.name)).toContain('OMM')
    expect((await request(app).get('/api/submissions/folders').set(as(beto.token))).body.map((f) => f.name)).not.toContain('OMM')
    expect((await request(app).get('/api/categories')).body.map((f) => f.name)).not.toContain('OMM')

    // Same name under the same parent (ignoring case/accents) is refused; a
    // pending folder of someone else can't be used as a parent.
    expect((await request(app).post('/api/submissions/folders').set(as(beto.token)).send({ name: 'omm', parent: root._id })).status).toBe(409)
    expect((await request(app).post('/api/submissions/folders').set(as(beto.token)).send({ name: '2024', parent: omm.body._id })).status).toBe(400)
    expect((await request(app).post('/api/submissions/folders').set(as(ana.token)).send({ name: '<script>', parent: root._id })).status).toBe(400)
  })

  it('un problema de examen toma título y año de su carpeta; aprobarlo aprueba las carpetas', async () => {
    const { ana, beto, admin, algebra } = await setup()
    const root = (await request(app).get('/api/submissions/folders').set(as(ana.token))).body[0]
    const estatal = await Category.create({ name: 'OMM Estatal', parent: root._id, kind: 'exam' })
    const jalisco = (await request(app).post('/api/submissions/folders').set(as(ana.token)).send({ name: 'Jalisco', parent: String(estatal._id) })).body
    const year = (await request(app).post('/api/submissions/folders').set(as(ana.token)).send({ name: '2023', parent: jalisco._id })).body

    const res = await submit(ana.token, { enunciado: STATEMENT, topics: [String(algebra._id)], isExam: true, examFolder: year._id, problemNumber: 3 })
    expect(res.status).toBe(201)
    expect(res.body.examFolderPath).toEqual(['Exámenes', 'OMM Estatal', 'Jalisco', '2023'])
    expect(res.body.examFolderPending).toBe(true)
    const stored = await Problem.findById(res.body._id).lean()
    expect(stored).toMatchObject({ titulo: 'OMM Estatal · Jalisco · 2023 · Problema 3', año: '2023', tipo: 'Examen', competition: 'OMM Estatal', problemNumber: 3 })

    // Someone else can't file into Ana's pending folder.
    expect((await submit(beto.token, { enunciado: OTHER, isExam: true, examFolder: year._id })).status).toBe(422)

    // A folder that still has a pending problem can't be rejected.
    await expect(rejectFolder({ ref: year._id, reviewer: admin.user, reason: 'Nombre incorrecto', apply: true })).rejects.toThrow(/pending submission/)

    const plan = await approveSubmission({ ref: res.body.codigo, reviewer: admin.user, apply: true })
    expect(plan.changes.filter((line) => line.startsWith('approve exam folder'))).toHaveLength(2)
    expect((await Problem.findById(res.body._id).lean()).sourceAttribution).toBe('OMM Estatal › Jalisco › 2023. Propuesto por @ana.')
    const publicNames = (await request(app).get('/api/categories')).body.map((f) => f.name)
    expect(publicNames).toEqual(expect.arrayContaining(['Exámenes', 'OMM Estatal', 'Jalisco', '2023']))

    // Choosing «OMM Estatal» in the filter includes every state and year below it.
    const filtered = await request(app).get(`/api/problems?categories=${estatal._id}`)
    expect(filtered.body.items.map((p) => p.codigo)).toEqual([res.body.codigo])
  })

  it('el revisor puede mover el problema a otra carpeta y aprobar o rechazar carpetas sueltas', async () => {
    const { ana, admin, algebra } = await setup()
    const root = (await request(app).get('/api/submissions/folders').set(as(ana.token))).body[0]
    const omm = await Category.create({ name: 'OMM', parent: root._id, kind: 'exam' })
    const y2024 = await Category.create({ name: '2024', parent: omm._id, kind: 'exam' })
    const typo = (await request(app).post('/api/submissions/folders').set(as(ana.token)).send({ name: '2O24', parent: String(omm._id) })).body
    const res = await submit(ana.token, { enunciado: STATEMENT, topics: [String(algebra._id)], isExam: true, examFolder: typo._id })

    await approveSubmission({ ref: res.body.codigo, reviewer: admin.user, fixes: { folder: 'OMM › 2024' }, apply: true })
    const stored = await Problem.findById(res.body._id).lean()
    expect(stored.categories.map(String)).toEqual([String(y2024._id)])
    expect(stored.titulo).toBe('OMM · 2024')

    await rejectFolder({ ref: typo._id, reviewer: admin.user, reason: 'Duplicado de 2024', apply: true })
    expect((await Category.findById(typo._id).lean()).reviewStatus).toBe('rejected')

    const extra = (await request(app).post('/api/submissions/folders').set(as(ana.token)).send({ name: '2025', parent: String(omm._id) })).body
    await approveFolder({ ref: extra._id, reviewer: admin.user, apply: true })
    expect((await Category.findById(extra._id).lean()).reviewStatus).toBe('approved')
  })
})
