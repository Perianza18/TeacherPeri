import { describe, it, expect } from 'vitest'
import Category from '../models/Category.js'
import Exam from '../models/Exam.js'
import Problem from '../models/Problem.js'
import User from '../models/User.js'
import { migrateRolesUsers } from '../migrations/migrate-roles-users.js'
import { approveSubmission, findReviewer, listPending } from '../lib/review/service.js'
import { parseReviewArgs, runReviewCommand } from '../scripts/review-submissions.js'

const legacy = { año: '2026', tema: 'Álgebra', tipo: 'TeacherPeri', dificultad: 'Media' }

async function seed() {
  for (const [username, role] of [['elias', 'teacherperi'], ['mod', 'moderador'], ['jr', 'editor_junior'], ['ana', 'usuario'], ['nuevo', 'user']]) {
    await User.collection.insertOne({ username, email: `${username}@test.com`, passwordHash: 'h', role })
  }
  await User.collection.insertOne({ username: 'viejo', email: 'viejo@test.com', passwordHash: 'h' })
  const area = await Category.create({ name: 'Álgebra' })
  const problems = await Problem.create(['TP-A01', 'TP-A02', 'TP-A03'].map((codigo) => ({ codigo, titulo: codigo, enunciado: `Enunciado ${codigo}`, categories: [area._id], ...legacy })))
  await Exam.create({ competition: 'TeacherPeri', year: '2026', round: 'Ciclo 1 · Práctica A', problems: problems.slice(0, 2).map((p, i) => ({ problem: p._id, position: i + 1 })), publicationStatus: 'published' })
  return { area, problems }
}

describe('db:migrate:roles-users', () => {
  it('the dry run lists every change and writes nothing', async () => {
    await seed()
    const result = await migrateRolesUsers()
    expect(result.mode).toBe('dry-run')
    expect(result.changes).toEqual(expect.arrayContaining([
      'role teacherperi → admin: 1 account(s)',
      'role moderador → user: 1 account(s)',
      'role editor_junior → editor: 1 account(s)',
      'role usuario → user: 1 account(s)',
      'no stored role → user: 1 account(s)',
      'create folder «Exámenes»',
      'create folder «Exámenes › OMM Estatal»',
      'create folder «Exámenes › Prácticas TeacherPeri › Ciclo 1 · Práctica A»',
      'file 2 problem(s) of «Ciclo 1 · Práctica A» into «Exámenes › Prácticas TeacherPeri › Ciclo 1 · Práctica A»: TP-A01, TP-A02',
    ]))
    expect(await Category.countDocuments({ kind: 'exam' })).toBe(0)
    expect((await User.findOne({ username: 'elias' }).lean()).role).toBe('teacherperi')
  })

  it('applies once, keeps the area folders, and a second run changes nothing', async () => {
    const { area, problems } = await seed()
    await migrateRolesUsers({ apply: true })
    const roles = Object.fromEntries((await User.find().lean()).map((u) => [u.username, u.role]))
    expect(roles).toEqual({ elias: 'admin', mod: 'user', jr: 'editor', ana: 'user', nuevo: 'user', viejo: 'user' })

    const practice = await Category.findOne({ name: 'Ciclo 1 · Práctica A', kind: 'exam' }).lean()
    const filed = await Problem.findById(problems[0]._id).lean()
    expect(filed.categories.map(String)).toEqual([String(area._id), String(practice._id)])
    expect((await Problem.findById(problems[2]._id).lean()).categories.map(String)).toEqual([String(area._id)])
    expect(await Exam.countDocuments()).toBe(1)

    const again = await migrateRolesUsers({ apply: true })
    expect(again.changes).toEqual([])
  })

  it('after it, the admin reviews with the script functions', async () => {
    await seed()
    await migrateRolesUsers({ apply: true })
    const reviewer = await findReviewer('elias')
    expect(reviewer.role).toBe('admin')
    expect((await listPending()).submissions).toEqual([])
    await expect(approveSubmission({ ref: 'U-00001', reviewer })).rejects.toThrow(/No pending submission/)
    const list = await runReviewCommand(parseReviewArgs(['list']))
    expect(list.openFlags).toBe(0)
    await expect(runReviewCommand(parseReviewArgs(['approve', 'U-00001', '--as', 'nadie']))).rejects.toThrow(/exactly one account/)
  })
})
