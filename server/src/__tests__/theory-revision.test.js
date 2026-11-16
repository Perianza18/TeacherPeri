import { describe, expect, it } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import { importMvpContent, CONTENT_MODELS } from '../migrations/import-mvp-content.js'
import { reviseTheoryLessons } from '../migrations/revise-theory-lessons.js'
import { PREVIOUS_THEORY } from '../data/mvpLessons.js'
import { THEORY_PROBLEMS, THEORY_REWRITES } from '../data/theory/index.js'

const { Theory, Path, Problem, ProblemCollection } = CONTENT_MODELS
const slugs = Object.keys(THEORY_REWRITES)

// A database as the import left it before the rewrite: previous lesson text,
// previous Ruta descriptions, no new problems and no collections.
async function previousRelease() {
  await importMvpContent({ apply: true })
  for (const slug of slugs) {
    const previous = PREVIOUS_THEORY[slug]
    await Theory.updateOne({ title: previous.title }, { $set: { content: previous.content, summary: previous.summary } })
    await Path.updateOne({ slug }, { $set: { description: previous.summary } })
  }
  await Problem.deleteMany({ codigo: { $in: THEORY_PROBLEMS.map((problem) => problem.codigo) } })
  await ProblemCollection.deleteMany({})
}

describe('Theory lesson revision', () => {
  it('previews, applies once, then finds nothing left to do', async () => {
    await previousRelease()
    const preview = await reviseTheoryLessons()
    expect(preview.lessons.map((lesson) => [lesson.text, lesson.ruta])).toEqual([['revise', 'revise'], ['revise', 'revise']])
    expect(preview.problemsAdded).toHaveLength(20)
    expect(preview.collectionsCreated).toHaveLength(6)
    expect(await Problem.countDocuments({ codigo: 'TP-C07' })).toBe(0)

    await reviseTheoryLessons({ apply: true })
    const casillas = await Theory.findOne({ title: PREVIOUS_THEORY['principio-de-casillas'].title }).lean()
    expect(casillas).toMatchObject({ content: THEORY_REWRITES['principio-de-casillas'].content, summary: THEORY_REWRITES['principio-de-casillas'].summary })
    expect((await Path.findOne({ slug: 'principio-de-casillas' }).lean()).description).toBe(THEORY_REWRITES['principio-de-casillas'].summary)
    const boxes = await request(app).get('/api/collections/casillas')
    expect(boxes.status).toBe(200)
    expect(boxes.body.collections.ejercicios.map((problem) => problem.codigo)).toEqual(['TP-C07', 'TP-C08', 'TP-C09', 'TP-C10'])
    expect(boxes.body.collections.practice[0].codigo).toBe('TP-C05')
    expect(boxes.body.collections.dificiles).toHaveLength(2)

    const again = await reviseTheoryLessons({ apply: true })
    expect(again.lessons.map((lesson) => [lesson.text, lesson.ruta])).toEqual([['keep', 'keep'], ['keep', 'keep']])
    expect(again.problemsAdded).toEqual([])
    expect(again.collectionsCreated).toEqual([])
    // The content import now agrees with the database.
    expect(await importMvpContent()).toMatchObject({ create: 0, promote: 0 })
  }, 120000)

  it('stops without writing when a lesson holds independent text', async () => {
    await previousRelease()
    await Theory.updateOne({ title: PREVIOUS_THEORY['principio-de-casillas'].title }, { $set: { content: 'Texto editado a mano.' } })
    await expect(reviseTheoryLessons({ apply: true })).rejects.toMatchObject({ code: 'THEORY_REVISION_CONFLICT' })
    const angulos = await Theory.findOne({ title: PREVIOUS_THEORY['angulos-paralelas-y-perpendiculares'].title }).lean()
    expect(angulos.content).toBe(PREVIOUS_THEORY['angulos-paralelas-y-perpendiculares'].content)
    expect(await Problem.countDocuments({ codigo: 'TP-G09' })).toBe(0)
    expect(await ProblemCollection.countDocuments()).toBe(0)
  }, 120000)
})
