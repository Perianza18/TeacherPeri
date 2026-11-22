import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import Category from '../models/Category.js'
import Exam from '../models/Exam.js'
import Problem from '../models/Problem.js'
import ProblemSubmission from '../models/ProblemSubmission.js'
import Topic from '../models/Topic.js'
import User from '../models/User.js'
import { approveSubmission, renameFolder, restoreProblem } from '../lib/review/service.js'
import { syncAllFolderExams } from '../lib/examSync.js'

const as = (token) => ({ Authorization: `Bearer ${token}` })
const legacy = { año: '2024', tema: 'Álgebra', tipo: 'Examen', dificultad: 'Media' }
const statements = [
  'Demuestra que para todo entero $n$, el número $n^2+n$ es par.',
  'Encuentra todos los enteros positivos $k$ tales que $k^2+1$ divide a $k^3+5$.',
  'Prueba que la suma de tres enteros consecutivos siempre es múltiplo de $3$.',
]

async function account(username, role = 'user') {
  const res = await request(app).post('/api/auth/signup').send({ username, email: `${username}@test.com`, password: 'clave12345' })
  if (role !== 'user') await User.updateOne({ username }, { role })
  return { token: res.body.token, user: await User.findOne({ username }).lean() }
}

async function setup() {
  const algebra = await Topic.create({ name: 'Álgebra', slug: 'omm-algebra' })
  const root = await Category.create({ name: 'Exámenes', kind: 'exam' })
  const omm = await Category.create({ name: 'OMM', kind: 'exam', parent: root._id })
  const omm2024 = await Category.create({ name: '2024', kind: 'exam', parent: omm._id })
  const omm2025 = await Category.create({ name: '2025', kind: 'exam', parent: omm._id })
  const estatal = await Category.create({ name: 'OMM Estatal', kind: 'exam', parent: root._id })
  const jalisco = await Category.create({ name: 'Jalisco', kind: 'exam', parent: estatal._id })
  const jalisco2023 = await Category.create({ name: '2023', kind: 'exam', parent: jalisco._id })
  return { algebra, root, omm, omm2024, omm2025, estatal, jalisco, jalisco2023, ana: await account('ana'), editor: await account('edith', 'editor'), admin: await account('elias', 'admin') }
}

// Proposes an exam problem as `token` and approves it in «Panel del equipo».
async function proposeAndApprove(ctx, { statement, folder, number }) {
  const sent = await request(app).post('/api/submissions').set(as(ctx.ana.token)).send({ enunciado: statement, topics: [String(ctx.algebra._id)], isExam: true, examFolder: String(folder._id), ...(number ? { problemNumber: number } : {}) })
  expect(sent.status).toBe(201)
  const submission = await ProblemSubmission.findOne({ problem: sent.body._id }).lean()
  const ok = await request(app).post(`/api/review/submissions/${submission._id}/approve`).set(as(ctx.admin.token)).send({})
  expect(ok.status).toBe(200)
  return sent.body
}

const codesOf = async (exam) => {
  const ids = [...exam.problems].sort((a, b) => a.position - b.position).map((entry) => entry.problem)
  const problems = await Problem.find({ _id: { $in: ids } }).select('codigo').lean()
  return ids.map((id) => problems.find((p) => String(p._id) === String(id)).codigo)
}

describe('Exámenes sigue a las carpetas de examen', () => {
  it('aprobar en el panel crea el examen de la carpeta y aparece en Exámenes, en orden de número', async () => {
    const ctx = await setup()
    const third = await proposeAndApprove(ctx, { statement: statements[0], folder: ctx.omm2024, number: 3 })
    let exams = await Exam.find({ categories: ctx.omm2024._id }).lean()
    expect(exams).toHaveLength(1)
    expect(exams[0]).toMatchObject({ competition: 'OMM', year: '2024', publicationStatus: 'published' })
    expect(exams[0].round).toBeNull()

    const loose = await proposeAndApprove(ctx, { statement: statements[1], folder: ctx.omm2024 })
    const first = await proposeAndApprove(ctx, { statement: statements[2], folder: ctx.omm2024, number: 1 })
    exams = await Exam.find({ categories: ctx.omm2024._id }).lean()
    expect(exams).toHaveLength(1)
    expect(await codesOf(exams[0])).toEqual([first.codigo, third.codigo, loose.codigo])

    const page = await request(app).get('/api/exams')
    expect(page.body.items.map((e) => [e.competition, e.year])).toEqual([['OMM', '2024']])
    const detail = await request(app).get(`/api/exams/${exams[0]._id}`)
    expect(detail.body.problems.map((p) => p.problem.codigo)).toEqual([first.codigo, third.codigo, loose.codigo])
    expect(detail.body.problems.map((p) => p.problem.problemNumber ?? null)).toEqual([1, 3, null])
  })

  it('aprobar con npm run review (el mismo servicio) llena competencia, año y ronda desde la ruta', async () => {
    const ctx = await setup()
    const sent = await request(app).post('/api/submissions').set(as(ctx.ana.token)).send({ enunciado: statements[0], topics: [String(ctx.algebra._id)] })
    const plan = await approveSubmission({ ref: sent.body.codigo, reviewer: ctx.admin.user, fixes: { folder: 'OMM Estatal › Jalisco › 2023', number: 2 } })
    expect(plan.changes.join('\n')).toContain('update the Exámenes card of «Exámenes › OMM Estatal › Jalisco › 2023»')
    expect(await Exam.countDocuments()).toBe(0)
    await approveSubmission({ ref: sent.body.codigo, reviewer: ctx.admin.user, fixes: { folder: 'OMM Estatal › Jalisco › 2023', number: 2 }, apply: true })
    const exam = await Exam.findOne({ categories: ctx.jalisco2023._id }).lean()
    expect(exam).toMatchObject({ competition: 'OMM Estatal', year: '2023', round: 'Jalisco', publicationStatus: 'published' })
  })

  it('un editor que cambia carpeta o número mueve el problema de examen; el examen vacío se despublica', async () => {
    const ctx = await setup()
    const a = await proposeAndApprove(ctx, { statement: statements[0], folder: ctx.omm2024, number: 1 })
    const b = await proposeAndApprove(ctx, { statement: statements[1], folder: ctx.omm2024, number: 2 })
    const edit = async (problem, changes) => {
      const view = await request(app).get(`/api/editor/problems/${problem._id}`).set(as(ctx.editor.token))
      const body = { titulo: view.body.titulo, enunciado: view.body.enunciado, hint: '', solution: '', topics: view.body.topics, tags: [], examFolder: view.body.examFolder, problemNumber: view.body.problemNumber, images: [], baseUpdatedAt: view.body.updatedAt, ...changes }
      const res = await request(app).put(`/api/editor/problems/${problem._id}`).set(as(ctx.editor.token)).send(body)
      expect(res.status).toBe(200)
    }
    await edit(a, { problemNumber: 5 })
    let exam2024 = await Exam.findOne({ categories: ctx.omm2024._id }).lean()
    expect(await codesOf(exam2024)).toEqual([b.codigo, a.codigo])

    await edit(a, { examFolder: String(ctx.omm2025._id) })
    await edit(b, { examFolder: String(ctx.omm2025._id) })
    exam2024 = await Exam.findOne({ categories: ctx.omm2024._id }).lean()
    expect(exam2024).toMatchObject({ publicationStatus: 'draft', problems: [] })
    const exam2025 = await Exam.findOne({ categories: ctx.omm2025._id }).lean()
    expect(exam2025).toMatchObject({ competition: 'OMM', year: '2025', publicationStatus: 'published' })
    expect(await codesOf(exam2025)).toEqual([b.codigo, a.codigo])
    expect((await request(app).get('/api/exams')).body.items.map((e) => e.year)).toEqual(['2025'])
  })

  it('borrar el último problema despublica el examen sin borrarlo; restaurarlo lo vuelve a publicar', async () => {
    const ctx = await setup()
    const a = await proposeAndApprove(ctx, { statement: statements[0], folder: ctx.omm2024, number: 1 })
    expect((await request(app).delete(`/api/submissions/mine/${a._id}`).set(as(ctx.ana.token))).status).toBe(200)
    const exam = await Exam.findOne({ categories: ctx.omm2024._id }).lean()
    expect(exam).toMatchObject({ publicationStatus: 'draft', problems: [] })
    expect((await request(app).get('/api/exams')).body.items).toHaveLength(0)

    await restoreProblem({ ref: a.codigo, reviewer: ctx.admin.user, apply: true })
    const back = await Exam.find({ categories: ctx.omm2024._id }).lean()
    expect(back).toHaveLength(1)
    expect(String(back[0]._id)).toBe(String(exam._id))
    expect(back[0].publicationStatus).toBe('published')
    expect(await codesOf(back[0])).toEqual([a.codigo])
  })

  it('renombrar una carpeta cambia el título de su examen', async () => {
    const ctx = await setup()
    await proposeAndApprove(ctx, { statement: statements[0], folder: ctx.jalisco2023, number: 1 })
    await renameFolder({ ref: String(ctx.jalisco._id), name: 'Jalisco (estatal)', reviewer: ctx.admin.user, apply: true })
    expect(await Exam.findOne({ categories: ctx.jalisco2023._id }).lean()).toMatchObject({ competition: 'OMM Estatal', year: '2023', round: 'Jalisco (estatal)' })
  })
})

describe('Backfill de exámenes (npm run atlas:sync-exams:*)', () => {
  it('modo de prueba describe, --apply crea, y una segunda vuelta no cambia nada', async () => {
    const ctx = await setup()
    await Problem.create({ codigo: 'P-2', titulo: 'Dos', enunciado: statements[1], ...legacy, categories: [ctx.omm2024._id], problemNumber: 2 })
    await Problem.create({ codigo: 'P-1', titulo: 'Uno', enunciado: statements[0], ...legacy, categories: [ctx.omm2024._id], problemNumber: 1 })
    await Problem.create({ codigo: 'P-9', titulo: 'Borrador', enunciado: statements[2], ...legacy, categories: [ctx.omm2024._id], publicationStatus: 'draft' })

    const plan = await syncAllFolderExams()
    expect(plan).toEqual(['create exam «OMM 2024» for «Exámenes › OMM › 2024» with 2 problem(s): P-1, P-2'])
    expect(await Exam.countDocuments()).toBe(0)

    expect(await syncAllFolderExams({ apply: true })).toEqual(plan)
    const exam = await Exam.findOne({ categories: ctx.omm2024._id }).lean()
    expect(await codesOf(exam)).toEqual(['P-1', 'P-2'])
    expect(await syncAllFolderExams({ apply: true })).toEqual([])
  })

  it('no toca los exámenes de práctica hechos a mano ni su orden', async () => {
    const ctx = await setup()
    const area = await Category.create({ name: 'Mixtos', kind: 'general' })
    const practice = await Category.create({ name: 'Prácticas TeacherPeri', kind: 'exam', parent: ctx.root._id })
    const cicloA = await Category.create({ name: 'Ciclo 1 · Práctica A', kind: 'exam', parent: practice._id })
    const b = await Problem.create({ codigo: 'TP-B', titulo: 'B', enunciado: statements[1], ...legacy, categories: [area._id, cicloA._id] })
    const a = await Problem.create({ codigo: 'TP-A', titulo: 'A', enunciado: statements[0], ...legacy, categories: [area._id, cicloA._id] })
    const handMade = await Exam.create({ competition: 'TeacherPeri', year: '2026', round: 'Ciclo 1 · Práctica A', categories: [area._id], problems: [{ problem: b._id, position: 1 }, { problem: a._id, position: 2 }], publicationStatus: 'published' })

    expect(await syncAllFolderExams({ apply: true })).toEqual([])
    expect(await Exam.countDocuments()).toBe(1)
    const stored = await Exam.findById(handMade._id).lean()
    expect(await codesOf(stored)).toEqual(['TP-B', 'TP-A'])
    expect(stored).toMatchObject({ round: 'Ciclo 1 · Práctica A', publicationStatus: 'published' })
  })
})
