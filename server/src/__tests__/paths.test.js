import { describe, expect, it } from 'vitest'
import mongoose from 'mongoose'
import request from 'supertest'
import app from '../app.js'
import Path from '../models/Path.js'
import PathReference from '../models/PathReference.js'
import RelatedPath from '../models/RelatedPath.js'
import PathSection from '../models/PathSection.js'
import Step from '../models/Step.js'
import PathCompletion from '../models/PathCompletion.js'
import Problem from '../models/Problem.js'
import Category from '../models/Category.js'
import Theory from '../models/Theory.js'
import List from '../models/List.js'
import Exam from '../models/Exam.js'
import Tag from '../models/Tag.js'

async function pathFixture(slug, overrides = {}) {
  return Path.create({
    slug,
    title: slug.replaceAll('-', ' '),
    description: `Descripción de ${slug}.`,
    publicationStatus: 'published',
    ...overrides,
  })
}

async function leafFixture(slug, overrides = {}) {
  const path = await pathFixture(slug, overrides)
  await Step.create({ path: path._id, order: 1, title: `Paso de ${slug}`, description: 'Instrucciones.' })
  return path
}

async function tokenFixture() {
  const response = await request(app).post('/api/auth/signup').send({
    username: `ruta_${Date.now()}`,
    email: `ruta_${Date.now()}@test.com`,
    password: 'clave12345',
  })
  return response.body.token
}

describe('Path graph model', () => {
  it('accepts optional descriptive Path levels without creating a Path type', async () => {
    const path = await pathFixture('nivel-omm', { level: 'omm' })
    expect(path.level).toBe('omm')
    await expect(pathFixture('nivel-invalido', { level: 'experto' })).rejects.toThrow()
  })

  it('uses stable, unique slugs that do not follow later title edits', async () => {
    const path = await pathFixture('slug-estable')
    path.title = 'Título editado'
    await path.save()
    expect(path.slug).toBe('slug-estable')
    await expect(pathFixture('slug-estable')).rejects.toMatchObject({ code: 11000 })
  })

  it('keeps Paths independent, supports multiple parents, and rejects duplicate edges/orders', async () => {
    const firstParent = await pathFixture('primer-padre')
    const secondParent = await pathFixture('segundo-padre')
    const child = await leafFixture('hijo-compartido')
    await PathReference.create({ parentPath: firstParent._id, childPath: child._id, order: 1 })
    await PathReference.create({ parentPath: secondParent._id, childPath: child._id, order: 1 })

    expect(await PathReference.countDocuments({ childPath: child._id })).toBe(2)
    await expect(PathReference.create({ parentPath: firstParent._id, childPath: child._id, order: 2 })).rejects.toThrow('same child')
    const other = await leafFixture('otro-hijo')
    await expect(PathReference.create({ parentPath: firstParent._id, childPath: other._id, order: 1 })).rejects.toThrow('order positions')
  })

  it('rejects self-references and indirect cycles', async () => {
    const a = await pathFixture('a')
    const b = await pathFixture('b')
    const c = await pathFixture('c')
    await expect(PathReference.create({ parentPath: a._id, childPath: a._id, order: 1 })).rejects.toThrow('itself')
    await PathReference.create({ parentPath: a._id, childPath: b._id, order: 1 })
    await PathReference.create({ parentPath: b._id, childPath: c._id, order: 1 })
    await expect(PathReference.create({ parentPath: c._id, childPath: a._id, order: 1 })).rejects.toThrow('indirect cycle')
  })

  it('enforces the child-Paths-or-Steps invariant and ordered leaf steps', async () => {
    const parent = await pathFixture('padre')
    const child = await leafFixture('hijo')
    await PathReference.create({ parentPath: parent._id, childPath: child._id, order: 1 })
    await expect(Step.create({ path: parent._id, order: 1, title: 'No permitido' })).rejects.toThrow('child Paths')

    const leaf = await leafFixture('hoja')
    await expect(PathReference.create({ parentPath: leaf._id, childPath: child._id, order: 1 })).rejects.toThrow('with Steps')
    await expect(Step.create({ path: leaf._id, order: 1, title: 'Duplicado' })).rejects.toThrow('Step order')
  })
})

describe('Path Tags and presentation sections', () => {
  it('uses controlled Tags for public Path discovery without changing Path structure', async () => {
    const tag = await Tag.create({ name: 'Geometría OMM', label: 'Geometría OMM' })
    const tagged = await leafFixture('ruta-etiquetada', { tags: [tag._id] })
    await leafFixture('ruta-sin-etiqueta')

    expect(tagged.tags.map(String)).toEqual([tag._id.toString()])
    await expect(pathFixture('etiquetas-duplicadas', { tags: [tag._id, tag._id] })).rejects.toThrow('duplicate Tags')
    await expect(pathFixture('etiqueta-inexistente', { tags: ['507f1f77bcf86cd799439011'] })).rejects.toThrow('must exist')

    const response = await request(app).get(`/api/paths?tags=${tag._id}`)
    expect(response.body.items.map((item) => item.slug)).toEqual(['ruta-etiquetada'])
    expect(response.body.items[0].tags).toEqual([expect.objectContaining({ label: 'Geometría OMM' })])
    expect((await request(app).get('/api/paths?tags=no-es-un-id')).status).toBe(400)
  })

  it('inserts section headings into the canonical child-reference order without moving unsectioned children', async () => {
    const parent = await pathFixture('padre-con-secciones')
    const before = await leafFixture('hijo-antes')
    const first = await leafFixture('hijo-ciclo-uno')
    const between = await leafFixture('hijo-entre-ciclos')
    const second = await leafFixture('hijo-ciclo-dos')
    const after = await leafFixture('hijo-despues')
    const otherParent = await pathFixture('otro-padre')
    const firstSection = await PathSection.create({ path: parent._id, title: 'Ciclo 1' })
    const secondSection = await PathSection.create({ path: parent._id, title: 'Ciclo 2' })
    await PathReference.create({ parentPath: parent._id, childPath: before._id, order: 1 })
    await PathReference.create({ parentPath: parent._id, childPath: first._id, order: 2, section: firstSection._id })
    await PathReference.create({ parentPath: parent._id, childPath: between._id, order: 3 })
    await PathReference.create({ parentPath: parent._id, childPath: second._id, order: 4, section: secondSection._id })
    await PathReference.create({ parentPath: parent._id, childPath: after._id, order: 5 })

    await expect(PathSection.create({ path: first._id, title: 'No es padre' })).rejects.toThrow('with Steps')
    await expect(PathReference.create({ parentPath: otherParent._id, childPath: first._id, order: 1, section: firstSection._id })).rejects.toThrow('must belong')
    firstSection.path = otherParent._id
    await expect(firstSection.save()).rejects.toThrow('cannot be reassigned')

    const response = await request(app).get('/api/paths/padre-con-secciones')
    expect(response.status).toBe(200)
    expect(response.body.path.childPaths.map((child) => child.slug)).toEqual(['hijo-antes', 'hijo-ciclo-uno', 'hijo-entre-ciclos', 'hijo-ciclo-dos', 'hijo-despues'])
    expect(response.body.path.presentation.map((item) => item.type === 'section' ? `section:${item.section.title}` : `child:${item.child.slug}`)).toEqual([
      'child:hijo-antes',
      'section:Ciclo 1',
      'child:hijo-ciclo-uno',
      'child:hijo-entre-ciclos',
      'section:Ciclo 2',
      'child:hijo-ciclo-dos',
      'child:hijo-despues',
    ])
  })

  it('rejects adding a Step after a presentation Section and falls back safely for missing section metadata', async () => {
    const sectionParent = await pathFixture('padre-solo-seccion')
    await PathSection.create({ path: sectionParent._id, title: 'Encabezado' })
    await expect(Step.create({ path: sectionParent._id, order: 1, title: 'No permitido' })).rejects.toThrow('presentation Sections')

    const parent = await pathFixture('padre-seccion-perdida')
    const child = await leafFixture('hijo-seccion-perdida')
    const reference = await PathReference.create({ parentPath: parent._id, childPath: child._id, order: 1 })
    await PathReference.collection.updateOne({ _id: reference._id }, { $set: { section: new mongoose.Types.ObjectId() } })

    const response = await request(app).get('/api/paths/padre-seccion-perdida')
    expect(response.status).toBe(200)
    expect(response.body.path.childPaths).toEqual([expect.objectContaining({ slug: 'hijo-seccion-perdida', section: null })])
    expect(response.body.path.presentation).toEqual([expect.objectContaining({ type: 'child', child: expect.objectContaining({ slug: 'hijo-seccion-perdida' }) })])
  })
})

describe('Related Paths', () => {
  it('stores recommendation references separately from the structural Path graph', async () => {
    const source = await leafFixture('ruta-origen')
    const target = await leafFixture('ruta-recomendada')
    const relation = await RelatedPath.create({ sourcePath: source._id, targetPath: target._id, relationshipType: 'deeper' })
    expect(relation.relationshipType).toBe('deeper')
    expect(await PathReference.countDocuments({ parentPath: source._id })).toBe(0)
    await expect(RelatedPath.create({ sourcePath: source._id, targetPath: target._id, relationshipType: 'deeper' })).rejects.toThrow('equivalent')
    await expect(RelatedPath.create({ sourcePath: source._id, targetPath: source._id, relationshipType: 'related' })).rejects.toThrow('itself')
  })
})

describe('Step references', () => {
  it('keeps valid Problem, Theory, List, and Exam references by identity', async () => {
    const category = await Category.create({ name: 'Path test category' })
    const problem = await Problem.create({ codigo: 'PATH-REF', titulo: 'Problema', enunciado: 'Texto.', año: '2026', tema: 'Álgebra', tipo: 'Prueba', dificultad: 'Media', category: category._id })
    const theory = await Theory.create({ title: 'Teoría', summary: 'Resumen', content: 'Texto', level: 'basico', publicationStatus: 'published' })
    const list = await List.create({ title: 'Lista', summary: 'Resumen', sourceUrl: 'https://example.org/lista', publicationStatus: 'published' })
    const exam = await Exam.create({ competition: 'OMM', year: '2026', round: 'Nacional', publicationStatus: 'published' })
    const leaf = await pathFixture('referencias')
    const step = await Step.create({
      path: leaf._id,
      order: 1,
      title: 'Consulta material',
      teacherperiReferences: [
        { contentType: 'Problem', target: problem._id },
        { contentType: 'Theory', target: theory._id },
        { contentType: 'List', target: list._id },
        { contentType: 'Exam', target: exam._id },
      ],
      extraResources: [{ label: 'Recurso externo', url: 'https://example.org/recurso' }],
    })
    expect(step.teacherperiReferences).toHaveLength(4)
    await expect(Step.create({ path: leaf._id, order: 2, title: 'Inválido', teacherperiReferences: [{ contentType: 'Theory', target: '507f1f77bcf86cd799439011' }] })).rejects.toThrow('must exist')
    await expect(Step.create({ path: leaf._id, order: 2, title: 'Tipo inválido', teacherperiReferences: [{ contentType: 'Experience', target: theory._id }] })).rejects.toThrow()
  })
})

describe('public Paths, traversal, and progress', () => {
  it('exposes valid published Paths and hides draft, archived, and invalid structures', async () => {
    const published = await leafFixture('publicada')
    const draft = await leafFixture('borrador', { publicationStatus: 'draft' })
    const archived = await leafFixture('archivada', { publicationStatus: 'archived' })
    await pathFixture('vacia')

    const discovery = await request(app).get('/api/paths')
    expect(discovery.body.items.map((item) => item.slug)).toEqual(['publicada'])
    expect((await request(app).get(`/api/paths/${published.slug}`)).status).toBe(200)
    expect((await request(app).get(`/api/paths/${draft.slug}`)).status).toBe(404)
    expect((await request(app).get(`/api/paths/${archived.slug}`)).status).toBe(404)
    expect((await request(app).get('/api/paths/vacia')).status).toBe(404)
  })

  it('keeps traverse available as a valid standalone Path slug', async () => {
    const traversalNamedPath = await leafFixture('traverse')

    const response = await request(app).get('/api/paths/traverse')
    expect(response.status).toBe(200)
    expect(response.body.path.slug).toBe(traversalNamedPath.slug)
  })

  it('validates contextual traversal and reconstructs context-specific breadcrumbs for one reused Path', async () => {
    const omm = await pathFixture('omm')
    const geometry = await pathFixture('geometria')
    const advanced = await pathFixture('geometria-avanzada')
    const circles = await pathFixture('circulos')
    const shared = await leafFixture('potencia-de-un-punto')

    await PathReference.create({ parentPath: omm._id, childPath: geometry._id, order: 1 })
    await PathReference.create({ parentPath: geometry._id, childPath: shared._id, order: 1 })
    await PathReference.create({ parentPath: advanced._id, childPath: circles._id, order: 1 })
    await PathReference.create({ parentPath: circles._id, childPath: shared._id, order: 1 })

    const first = await request(app).get('/api/paths?traversal=omm/geometria/potencia-de-un-punto')
    expect(first.status).toBe(200)
    expect(first.body.breadcrumbs.map((crumb) => crumb.slug)).toEqual(['omm', 'geometria', 'potencia-de-un-punto'])

    const second = await request(app).get('/api/paths?traversal=geometria-avanzada/circulos/potencia-de-un-punto')
    expect(second.status).toBe(200)
    expect(second.body.breadcrumbs.map((crumb) => crumb.slug)).toEqual(['geometria-avanzada', 'circulos', 'potencia-de-un-punto'])
    expect((await request(app).get('/api/paths?traversal=omm/circulos')).status).toBe(404)
    expect((await request(app).get('/api/paths/potencia-de-un-punto')).status).toBe(200)
  })

  it('rejects contextual traversal through a draft Path', async () => {
    const parent = await pathFixture('padre-publico')
    const draftLeaf = await leafFixture('hoja-borrador', { publicationStatus: 'draft' })
    await PathReference.create({ parentPath: parent._id, childPath: draftLeaf._id, order: 1 })

    expect((await request(app).get('/api/paths?traversal=padre-publico/hoja-borrador')).status).toBe(404)
  })

  it('reveals only safe metadata for explicitly planned unavailable child references', async () => {
    const parent = await pathFixture('padre-con-plan')
    const planned = await pathFixture('ruta-planeada', {
      title: 'Ruta Planeada',
      description: 'Descripción editorial que no debe publicarse.',
      publicationStatus: 'draft',
    })
    const nested = await leafFixture('detalle-borrador', {
      title: 'Detalle Borrador Secreto',
      publicationStatus: 'draft',
    })
    const ordinary = await leafFixture('borrador-ordinario', {
      title: 'Título Borrador Ordinario',
      publicationStatus: 'draft',
    })
    const section = await PathSection.create({ path: parent._id, title: 'Ciclo futuro' })
    await PathReference.create({ parentPath: parent._id, childPath: planned._id, order: 1, section: section._id, previewWhenUnavailable: true })
    await PathReference.create({ parentPath: planned._id, childPath: nested._id, order: 1 })
    await PathReference.create({ parentPath: parent._id, childPath: ordinary._id, order: 2 })

    const response = await request(app).get('/api/paths/padre-con-plan')
    expect(response.status).toBe(200)
    expect(response.body.path.childPaths[0]).toEqual({
      childPath: planned._id.toString(),
      order: 1,
      section: section._id.toString(),
      available: false,
      title: 'Ruta Planeada',
      plannedPreview: true,
      state: 'coming-soon',
    })
    expect(response.body.path.childPaths[0]).not.toHaveProperty('slug')
    expect(response.body.path.childPaths[0]).not.toHaveProperty('description')
    expect(response.body.path.childPaths[1]).not.toHaveProperty('title')
    expect(response.text).not.toContain('Descripción editorial')
    expect(response.text).not.toContain('Detalle Borrador Secreto')
    expect(response.text).not.toContain('Título Borrador Ordinario')
    expect((await request(app).get('/api/paths/ruta-planeada')).status).toBe(404)
    expect((await request(app).get('/api/paths?traversal=padre-con-plan/ruta-planeada')).status).toBe(404)
    expect((await request(app).get('/api/paths')).body.items.map((item) => item.slug)).not.toContain('ruta-planeada')
  })

  it('marks a section under construction only when all of its children are planned previews', async () => {
    const parent = await pathFixture('padre-secciones-planeadas')
    const plannedA = await leafFixture('planeada-a', { publicationStatus: 'draft' })
    const plannedB = await leafFixture('planeada-b', { publicationStatus: 'draft' })
    const ordinary = await leafFixture('no-planeada', { publicationStatus: 'draft' })
    const plannedSection = await PathSection.create({ path: parent._id, title: 'Todo planeado' })
    const mixedSection = await PathSection.create({ path: parent._id, title: 'Mixto' })
    await PathReference.create({ parentPath: parent._id, childPath: plannedA._id, order: 1, section: plannedSection._id, previewWhenUnavailable: true })
    await PathReference.create({ parentPath: parent._id, childPath: plannedB._id, order: 2, section: plannedSection._id, previewWhenUnavailable: true })
    await PathReference.create({ parentPath: parent._id, childPath: ordinary._id, order: 3, section: mixedSection._id })

    const response = await request(app).get('/api/paths/padre-secciones-planeadas')
    const headings = response.body.path.presentation.filter((item) => item.type === 'section').map((item) => item.section)
    expect(headings[0]).toMatchObject({ title: 'Todo planeado', state: 'under-construction' })
    expect(headings[1]).toEqual(expect.objectContaining({ title: 'Mixto' }))
    expect(headings[1]).not.toHaveProperty('state')
  })

  it('keeps a draft Step target by identity but does not expose its unpublished content', async () => {
    const theory = await Theory.create({ title: 'Borrador interno', summary: 'No publicar.', content: 'No filtrar.', level: 'basico', publicationStatus: 'draft' })
    const leaf = await pathFixture('referencia-no-disponible')
    await Step.create({ path: leaf._id, order: 1, title: 'Paso seguro', teacherperiReferences: [{ contentType: 'Theory', target: theory._id }] })

    const response = await request(app).get('/api/paths/referencia-no-disponible')
    expect(response.status).toBe(200)
    expect(response.body.path.steps[0].teacherperiReferences[0]).toMatchObject({ contentType: 'Theory', available: false })
    expect(response.text).not.toContain('Borrador interno')
  })

  it('renders public Related Paths without making them structural children', async () => {
    const source = await leafFixture('ruta-con-relacion')
    const target = await leafFixture('ruta-profunda', { level: 'avanzado' })
    await RelatedPath.create({ sourcePath: source._id, targetPath: target._id, relationshipType: 'deeper' })

    const response = await request(app).get('/api/paths/ruta-con-relacion')
    expect(response.status).toBe(200)
    expect(response.body.path.childPaths).toEqual([])
    expect(response.body.path.relatedPaths).toEqual([expect.objectContaining({ slug: 'ruta-profunda', relationshipType: 'deeper', label: 'Profundiza', available: true })])
  })

  it('persists one reusable leaf completion and derives unique descendant progress for each parent', async () => {
    const rootA = await pathFixture('raiz-a')
    const rootB = await pathFixture('raiz-b')
    const branchA = await pathFixture('rama-a')
    const branchB = await pathFixture('rama-b')
    const shared = await leafFixture('hoja-compartida')
    const other = await leafFixture('otra-hoja')

    await PathReference.create({ parentPath: rootA._id, childPath: branchA._id, order: 1 })
    await PathReference.create({ parentPath: rootA._id, childPath: branchB._id, order: 2 })
    await PathReference.create({ parentPath: branchA._id, childPath: shared._id, order: 1 })
    await PathReference.create({ parentPath: branchB._id, childPath: shared._id, order: 1 })
    await PathReference.create({ parentPath: rootB._id, childPath: shared._id, order: 1 })
    await PathReference.create({ parentPath: rootB._id, childPath: other._id, order: 2 })
    await RelatedPath.create({ sourcePath: rootA._id, targetPath: other._id, relationshipType: 'related' })

    const token = await tokenFixture()
    expect((await request(app).put('/api/paths/raiz-a/completion').set('Authorization', `Bearer ${token}`).send({ completed: true })).status).toBe(400)
    expect((await request(app).put('/api/paths/hoja-compartida/completion').send({ completed: true })).status).toBe(401)

    const complete = await request(app)
      .put('/api/paths/hoja-compartida/completion')
      .set('Authorization', `Bearer ${token}`)
      .send({ completed: true })
    expect(complete.status).toBe(200)
    expect(await PathCompletion.countDocuments()).toBe(1)

    const progressA = await request(app).get('/api/paths/raiz-a/progress').set('Authorization', `Bearer ${token}`)
    const progressB = await request(app).get('/api/paths/raiz-b/progress').set('Authorization', `Bearer ${token}`)
    expect(progressA.body).toMatchObject({ totalLeaves: 1, completedLeaves: 1, percentage: 100 })
    expect(progressB.body).toMatchObject({ totalLeaves: 2, completedLeaves: 1, percentage: 50 })

    const unmark = await request(app)
      .put('/api/paths/hoja-compartida/completion')
      .set('Authorization', `Bearer ${token}`)
      .send({ completed: false })
    expect(unmark.body.progress).toMatchObject({ percentage: 0 })
    expect(await PathCompletion.countDocuments()).toBe(0)
  })

  it('excludes coming-soon draft descendants from progress', async () => {
    const parent = await pathFixture('progreso-sin-borradores')
    const published = await leafFixture('hoja-publicada-progreso')
    const draft = await leafFixture('hoja-planeada-progreso', { publicationStatus: 'draft' })
    await PathReference.create({ parentPath: parent._id, childPath: published._id, order: 1 })
    await PathReference.create({ parentPath: parent._id, childPath: draft._id, order: 2, previewWhenUnavailable: true })
    const token = await tokenFixture()

    const progress = await request(app).get('/api/paths/progreso-sin-borradores/progress').set('Authorization', `Bearer ${token}`)
    expect(progress.body).toEqual({ totalLeaves: 1, completedLeaves: 0, percentage: 0 })
  })
})
