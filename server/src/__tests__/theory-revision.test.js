import { describe, expect, it } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import { importMvpContent, CONTENT_MODELS } from '../migrations/import-mvp-content.js'
import { reviseTheoryLessons } from '../migrations/revise-theory-lessons.js'
import { NEW_THEORY_SLUGS, PREVIOUS_THEORY } from '../data/mvpLessons.js'
import { OMM_CURRICULUM } from '../data/ommCurriculum.js'
import { THEORY_COLLECTIONS, THEORY_PROBLEMS, THEORY_REWRITES } from '../data/theory/index.js'
import { EARLIER_THEORY } from '../data/theory/earlier.js'

const { Theory, Path, Problem, ProblemCollection, Step } = CONTENT_MODELS
const revised = Object.keys(THEORY_REWRITES).filter((slug) => PREVIOUS_THEORY[slug])
const added = NEW_THEORY_SLUGS
const lessonCount = revised.length + added.length

// The Rutas that were published before the new lessons: every earlier lesson
// and the groups above it (the same rule as the release manifest).
function previouslyPublished() {
  const published = new Set(Object.keys(PREVIOUS_THEORY))
  let changed = true
  while (changed) {
    changed = false
    for (const { parentSlug, childSlug } of OMM_CURRICULUM.references) if (published.has(childSlug) && !published.has(parentSlug)) { published.add(parentSlug); changed = true }
  }
  return published
}

// A database as production holds it: previous lesson text and Ruta descriptions,
// no new problems or collections, and the Ciclo 2 lessons that never had a text
// missing, with their Rutas still the original drafts.
async function productionLike() {
  await importMvpContent({ apply: true })
  for (const slug of revised) {
    const previous = PREVIOUS_THEORY[slug]
    await Theory.updateOne({ title: previous.title }, { $set: { content: previous.content, summary: previous.summary } })
    await Path.updateOne({ slug }, { $set: { description: previous.summary } })
  }
  await Problem.deleteMany({ codigo: { $in: THEORY_PROBLEMS.map((problem) => problem.codigo) } })
  await ProblemCollection.deleteMany({})
  const newPaths = await Path.find({ slug: { $in: added } }).lean()
  await Step.deleteMany({ path: { $in: newPaths.map((path) => path._id) } })
  await Theory.deleteMany({ title: { $in: added.map((slug) => THEORY_REWRITES[slug].lesson.title) } })
  const published = previouslyPublished()
  for (const path of OMM_CURRICULUM.paths.filter((item) => !published.has(item.slug))) {
    await Path.updateOne({ slug: path.slug }, { $set: { description: path.description, publicationStatus: 'draft' } })
  }
}

const byStatus = (result, status) => result.lessons.filter((lesson) => lesson.status === status).map((lesson) => lesson.slug)

describe('Theory lesson revision', () => {
  it('revises earlier lessons, creates the new ones, then finds nothing left to do', async () => {
    await productionLike()
    expect(await Path.findOne({ slug: 'triangulos-1-estructura-y-razones' }).lean()).toMatchObject({ publicationStatus: 'draft' })

    const preview = await reviseTheoryLessons()
    expect(preview.lessons).toHaveLength(lessonCount)
    expect(byStatus(preview, 'change').sort()).toEqual([...revised, ...added].sort())
    for (const lesson of preview.lessons.filter((item) => item.kind === 'revised')) expect([lesson.text, lesson.ruta]).toEqual(['revise', 'revise'])
    for (const lesson of preview.lessons.filter((item) => item.kind === 'new')) expect([lesson.text, lesson.ruta, lesson.steps]).toEqual(['create', 'promote', ['create', 'create', 'create', 'create']])
    expect(preview.groupsPublished).toEqual(expect.arrayContaining(['triangulos-1-estructura-y-razones', 'tecnicas-de-conteo', 'desigualdades-fundamentales-1', 'desigualdades-fundamentales-2']))
    expect(preview.problemsAdded).toHaveLength(THEORY_PROBLEMS.length)
    expect(preview.collectionsCreated).toHaveLength(THEORY_COLLECTIONS.length)
    expect(await Problem.countDocuments({ codigo: 'TP-C07' })).toBe(0)

    await reviseTheoryLessons({ apply: true })
    const casillas = await Theory.findOne({ title: PREVIOUS_THEORY['principio-de-casillas'].title }).lean()
    expect(casillas).toMatchObject({ content: THEORY_REWRITES['principio-de-casillas'].content, summary: THEORY_REWRITES['principio-de-casillas'].summary })
    expect((await Path.findOne({ slug: 'principio-de-casillas' }).lean()).description).toBe(THEORY_REWRITES['principio-de-casillas'].summary)
    const notables = THEORY_REWRITES['rectas-y-puntos-notables']
    expect(await Theory.findOne({ title: notables.lesson.title }).lean()).toMatchObject({ content: notables.content, publicationStatus: 'published' })
    const notablesPath = await Path.findOne({ slug: 'rectas-y-puntos-notables' }).lean()
    expect(notablesPath).toMatchObject({ publicationStatus: 'published', description: notables.summary })
    expect(await Step.countDocuments({ path: notablesPath._id })).toBe(4)
    expect(await Path.findOne({ slug: 'triangulos-1-estructura-y-razones' }).lean()).toMatchObject({ publicationStatus: 'published' })
    const boxes = await request(app).get('/api/collections/puntos-notables')
    expect(boxes.status).toBe(200)
    expect(boxes.body.collections.ejercicios.map((problem) => problem.codigo)).toEqual(['TP-G49', 'TP-G50', 'TP-G51', 'TP-G52'])
    const mixed = await request(app).get('/api/collections/mixto-ciclo-2')
    expect(mixed.body.collections.practice.map((problem) => problem.codigo)).toEqual(THEORY_REWRITES['entrenamiento-mixto-ciclo-2'].collections['mixto-ciclo-2'].practice)

    const again = await reviseTheoryLessons({ apply: true })
    expect(byStatus(again, 'keep')).toHaveLength(lessonCount)
    expect(again.writes).toBe(0)
    // The content import now agrees with the database.
    expect(await importMvpContent()).toMatchObject({ create: 0, promote: 0 })
  }, 180000)

  it('replaces an earlier published rewrite with the corrected one', async () => {
    await productionLike()
    await reviseTheoryLessons({ apply: true })
    const slug = 'angulos-paralelas-y-perpendiculares'
    const [pilot] = EARLIER_THEORY[slug]
    const { title } = PREVIOUS_THEORY[slug]
    await Theory.updateOne({ title }, { $set: { content: pilot.content, summary: pilot.summary } })

    const preview = await reviseTheoryLessons()
    expect(byStatus(preview, 'change')).toEqual([slug])
    expect(byStatus(preview, 'keep')).toHaveLength(lessonCount - 1)
    await reviseTheoryLessons({ apply: true })
    expect((await Theory.findOne({ title }).lean()).content).toBe(THEORY_REWRITES[slug].content)
  }, 180000)

  it('skips a lesson edited on the live site, goes ahead with the others, and replaces it only when that exact version is accepted', async () => {
    await productionLike()
    const { title } = PREVIOUS_THEORY['principio-de-casillas']
    const edited = `${PREVIOUS_THEORY['principio-de-casillas'].content}\nUn párrafo que agregó otra persona en el sitio.`
    await Theory.updateOne({ title }, { $set: { content: edited } })

    const preview = await reviseTheoryLessons()
    const casillas = preview.lessons.find((lesson) => lesson.slug === 'principio-de-casillas')
    expect(casillas).toMatchObject({ status: 'skipped', text: 'skip', fingerprint: expect.stringMatching(/^[0-9a-f]{12}$/) })
    expect(casillas.live[0].changes.examples).toContain('+ Un párrafo que agregó otra persona en el sitio.')
    expect(byStatus(preview, 'change')).toHaveLength(lessonCount - 1)

    await reviseTheoryLessons({ apply: true })
    expect((await Theory.findOne({ title }).lean()).content).toBe(edited)
    expect((await Theory.findOne({ title: PREVIOUS_THEORY['angulos-paralelas-y-perpendiculares'].title }).lean()).content).toBe(THEORY_REWRITES['angulos-paralelas-y-perpendiculares'].content)
    // The skipped lesson's own problems and boxes wait with it.
    expect(await Problem.countDocuments({ codigo: 'TP-C07' })).toBe(0)
    expect(await ProblemCollection.countDocuments({ slug: 'casillas' })).toBe(0)

    // An acceptance for another version changes nothing.
    await reviseTheoryLessons({ apply: true, acceptLive: { 'principio-de-casillas': '000000000000' } })
    expect((await Theory.findOne({ title }).lean()).content).toBe(edited)

    const accepted = await reviseTheoryLessons({ apply: true, acceptLive: { 'principio-de-casillas': casillas.fingerprint } })
    expect(accepted.lessons.find((lesson) => lesson.slug === 'principio-de-casillas')).toMatchObject({ status: 'accepted', text: 'revise' })
    expect((await Theory.findOne({ title }).lean()).content).toBe(THEORY_REWRITES['principio-de-casillas'].content)
    expect(await Problem.countDocuments({ codigo: 'TP-C07' })).toBe(1)
  }, 180000)

  it('leaves live edits to new lessons, Rutas and problems alone without stopping the others', async () => {
    await productionLike()
    await Path.updateOne({ slug: 'ceva-y-menelao' }, { $set: { description: 'Descripción escrita en el sitio.' } })

    const result = await reviseTheoryLessons({ apply: true })
    expect(byStatus(result, 'skipped')).toEqual(['ceva-y-menelao'])
    expect(await Path.findOne({ slug: 'ceva-y-menelao' }).lean()).toMatchObject({ publicationStatus: 'draft', description: 'Descripción escrita en el sitio.' })
    expect(await Theory.countDocuments({ title: THEORY_REWRITES['ceva-y-menelao'].lesson.title })).toBe(0)
    expect(await Problem.countDocuments({ codigo: 'TP-G85' })).toBe(0)
    expect(await Theory.countDocuments({ title: THEORY_REWRITES['doble-conteo'].lesson.title })).toBe(1)
    // TP-G90 belongs to «Ceva y Menelao», but the mixed practice box also uses it, so it is added.
    expect(await Problem.countDocuments({ codigo: 'TP-G90' })).toBe(1)

    await Problem.updateOne({ codigo: 'TP-C07' }, { $set: { enunciado: 'Enunciado corregido en el sitio.' } })
    const later = await reviseTheoryLessons({ apply: true })
    expect(later.problemsEditedLive).toEqual(['TP-C07'])
    expect((await Problem.findOne({ codigo: 'TP-C07' }).lean()).enunciado).toBe('Enunciado corregido en el sitio.')
    expect(byStatus(later, 'skipped')).toEqual(['ceva-y-menelao'])
  }, 180000)
})
