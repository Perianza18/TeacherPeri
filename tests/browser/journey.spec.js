import { test, expect } from '@playwright/test'
import { buildMvpManifest } from '../../server/src/data/mvpManifest.js'
import { THEORY_REWRITES } from '../../server/src/data/theory/index.js'

const entries = buildMvpManifest().map((e) => ({ ...e, data: { _id: e._id, ...e.data } }))
const dataFor = (model) => entries.filter((e) => e.model === model).map((e) => e.data)
const entry = (model, key) => entries.find((e) => e.model === model && e.key === key).data
const populate = (items) => items.map((i) => ({ ...i, problems: i.problems?.map((r) => ({ ...r, problem: dataFor('Problem').find((p) => p._id === r.problem) })) }))


function pathDetail(slugs) {
  const paths = slugs.map((slug) => dataFor('Path').find((p) => p.slug === slug))
  const path = paths.at(-1)
  const references = dataFor('PathReference').filter((r) => r.parentPath === path._id).sort((a, b) => a.order - b.order)
  const steps = dataFor('Step').filter((s) => s.path === path._id).map((s) => ({ ...s, teacherperiReferences: s.teacherperiReferences.map((r) => {
    const target = dataFor(r.contentType).find((e) => e._id === r.target)
    const library = { Problem: 'problemas', Theory: 'teoria', List: 'listas', Exam: 'examenes' }[r.contentType]
    return { ...r, targetId: r.target, available: true, title: target.title || target.titulo || target.round, href: `/entrenamiento/${library}/${target._id}` }
  }) }))
  let previous = null
  const presentation = references.flatMap((r) => {
    const child = dataFor('Path').find((p) => p._id === r.childPath)
    const section = dataFor('PathSection').find((p) => p._id === r.section)
    const headings = section && previous !== section._id ? [{ type: 'section', section: { ...section, state: references.filter((e) => e.section === section._id).every((e) => dataFor('Path').find((p) => p._id === e.childPath).publicationStatus !== 'published') ? 'under-construction' : undefined } }] : []
    previous = section?._id
    return [...headings, { type: 'child', child: { ...child, order: r.order, available: child.publicationStatus === 'published', plannedPreview: child.publicationStatus !== 'published' } }]
  })
  return { path: { ...path, kind: references.length ? 'parent' : 'leaf', steps, presentation, relatedPaths: [] }, breadcrumbs: paths.map((p) => ({ slug: p.slug, title: p.title })) }
}

// Browser rendering and interaction fixture; actual Mongo/API behavior is
// exercised separately by the integration suite, never inferred from mocks.
test.beforeEach(async ({ page }) => {
  await page.route('**/api/**', async (route) => {
    const url = new URL(route.request().url())
    const parts = url.pathname.split('/').filter(Boolean)
    const model = { problems: 'Problem', theory: 'Theory', lists: 'List', exams: 'Exam', categories: 'Category', topics: 'Topic', tags: 'Tag' }[parts[1]]
    let body
    if (url.pathname === '/api/problems/facets') body = { years: ['2026'], subjects: ['Geometría', 'Álgebra', 'Combinatoria', 'Teoría de Números'], types: ['TeacherPeri'] }
    else if (parts[1] === 'collections' && parts[2]) {
      const slug = parts[2]
      const boxes = dataFor('ProblemCollection').filter((collection) => collection.slug === slug)
      body = { slug, collections: Object.fromEntries(boxes.map((collection) => [collection.kind, collection.problems.map(({ problem }) => dataFor('Problem').find((item) => item._id === problem)).filter(Boolean)])) }
    }
    else if (parts[3] === 'comments') body = []
    else if (parts[1] === 'paths' && (parts[2] || url.searchParams.has('traversal'))) body = pathDetail(parts[2] ? [parts[2]] : url.searchParams.get('traversal').split('/'))
    else if (parts[1] === 'paths') body = { items: [{ _id: 'fixture', slug: 'factorizacion-e-identidades', title: 'Factorización e Identidades', kind: 'leaf', lessonOnly: true, level: 'introductorio' }] }
    else if (model) {
      let items = dataFor(model)
      if (parts[2]) {
        body = populate(items.filter((i) => i._id === parts[2]))[0]
        if (!body) return route.fulfill({ status: 404, json: { error: 'No disponible' } })
      } else if (['Category', 'Topic', 'Tag'].includes(model)) body = items
      else {
        const q = (url.searchParams.get('q') || '').toLowerCase()
        if (q) items = items.filter((i) => (i.title || i.titulo || i.round).toLowerCase().includes(q))
        const pageNumber = Number(url.searchParams.get('page') || 1)
        body = { items: populate(items.slice((pageNumber - 1) * 12, pageNumber * 12)), total: items.length, totalPages: Math.ceil(items.length / 12) }
      }
    }
    await route.fulfill({ json: body || {} })
  })
})
const assertFits = async (page) => expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)

test('problem discovery, pagination, math, solution and comments', async ({ page }, testInfo) => {
  await page.goto('/entrenamiento/problemas')
  await expect(page.getByText(`${dataFor('Problem').length} resultados`)).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('problems.png'), fullPage: true })
  await assertFits(page)
  await page.getByRole('button', { name: 'Siguiente', exact: true }).click()
  await expect(page.getByText(`2 / ${Math.ceil(dataFor('Problem').length / 12)}`)).toBeVisible()
  await page.getByRole('searchbox').fill('El ángulo exterior')
  await expect(page.getByText('1 resultado', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Comentarios', exact: true }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.getByRole('link', { name: 'El ángulo exterior', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'El ángulo exterior' })).toBeVisible()
  await page.getByText('Ver solución razonada', { exact: true }).click()
  await expect(page.getByText('¿Ya lo intentaste? Date 5 minutos más.')).toBeVisible()
  await expect(page.locator('details[open] .katex')).toHaveCount(0)
  await page.getByRole('button', { name: 'Sí, ver la solución' }).click()
  await expect(page.locator('details[open] .katex').first()).toBeVisible()
  await expect(page.locator('.katex-error')).toHaveCount(0)
  await assertFits(page)
})

test('theory pagination and direct navigation do not show stale content', async ({ page }, testInfo) => {
  await page.goto('/entrenamiento/teoria')
  await expect(page.getByText('37 resultados')).toBeVisible()
  await assertFits(page)
  await page.goto(`/entrenamiento/teoria/${entry('Theory', 'factorizacion-e-identidades-guia')._id}`)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Factorización')
  await page.screenshot({ path: testInfo.outputPath('theory.png'), fullPage: true })
  await expect(page.locator('.katex-error')).toHaveCount(0)
  await assertFits(page)
  await page.goto('/entrenamiento/teoria/000000000000000000000000')
  await expect(page.getByRole('alert')).toContainText('no está disponible')
  await expect(page.getByRole('heading', { name: /Factorización/ })).toHaveCount(0)
})

test('exam and list reuse canonical problem links', async ({ page }, testInfo) => {
  await page.goto(`/entrenamiento/examenes/${entry('Exam', 'ciclo-1-a')._id}`)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Práctica A')
  await expect(page.locator('main ol > li')).toHaveCount(5)
  await page.screenshot({ path: testInfo.outputPath('collection.png'), fullPage: true })
  await expect(page.getByRole('link', { name: 'La diferencia divisible →' })).toHaveAttribute('href', `/entrenamiento/problemas/${entry('Problem', 'TP-C05')._id}`)
  await assertFits(page)
  await page.goto(`/entrenamiento/listas/${entry('List', 'mixto-ciclo-1')._id}`)
  await expect(page.locator('main ol > li')).toHaveCount(5)
  await expect(page.getByRole('link', { name: 'La diferencia divisible →' })).toHaveAttribute('href', `/entrenamiento/problemas/${entry('Problem', 'TP-C05')._id}`)
  await assertFits(page)
})


test('OMM traversal, unfinished cycles and return to the learning Path', async ({ page }, testInfo) => {
  await page.goto('/rutas/preparacion-para-la-omm')
  await expect(page.getByRole('heading', { name: 'Preparación para la OMM', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Ciclo 1 — Primeros Pasos' })).toBeVisible()
  await expect(page.getByText('En construcción', { exact: true })).toHaveCount(3)
  await page.screenshot({ path: testInfo.outputPath('omm.png'), fullPage: true })
  await assertFits(page)
  await page.getByRole('link').filter({ has: page.getByRole('heading', { name: 'Álgebra Básica para Olimpiadas', exact: true }) }).click()
  await page.getByRole('link').filter({ has: page.getByRole('heading', { name: 'Factorización e Identidades', exact: true }) }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Factorización')
  const crumbs = page.getByRole('navigation', { name: 'Migas' })
  await expect(crumbs).toContainText('Preparación para la OMM')
  await expect(page.getByRole('link', { name: 'Resolver problema 1' })).toBeVisible()
  await page.reload()
  await expect(crumbs).toContainText('Álgebra Básica')
  await expect(page.getByText('En la Ruta', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: '← Volver a Teoría', exact: true })).toHaveCount(0)
  const returnLink = crumbs.getByRole('link', { name: 'Álgebra Básica para Olimpiadas', exact: true })
  await expect(returnLink).toHaveAttribute('href', '/rutas/preparacion-para-la-omm/algebra-basica-para-olimpiadas')
  await page.screenshot({ path: testInfo.outputPath('lesson.png'), fullPage: true })
  await assertFits(page)
  await page.getByRole('link', { name: 'Resolver problema 1' }).click()
  await expect(page).toHaveURL(/\/entrenamiento\/problemas\/[0-9a-f]{24}\?ruta=preparacion-para-la-omm/)
})

test('lesson wrappers are absent from route discovery', async ({ page }) => {
  await page.goto('/rutas')
  await expect(page.getByText('Todavía no hay Rutas publicadas.')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Factorización e Identidades', exact: true })).toHaveCount(0)
})

test('exam folders show competitions and their years', async ({ page }, testInfo) => {
  const folders = [
    { _id: 'root', name: 'Exámenes', kind: 'exam', parent: null },
    { _id: 'omm', name: 'OMM', kind: 'exam', parent: 'root' },
    { _id: 'year', name: '2024', kind: 'exam', parent: 'omm' },
    { _id: 'empty', name: 'OMMEB', kind: 'exam', parent: 'root' },
    { _id: 'state', name: 'OMM Estatal', kind: 'exam', parent: 'omm' },
    { _id: 'chiapas', name: 'Chiapas', kind: 'exam', parent: 'state' },
  ]
  const exams = [
    { _id: 'original', competition: 'TeacherPeri', year: '2026', round: 'Práctica A', problems: [] },
    { _id: 'official', competition: 'OMM', year: '2024', categories: [{ _id: 'year' }], problems: [{ position: 1, problem: { _id: 'p5', titulo: 'OMM 2024 - Problema 5', problemNumber: 5, enunciado: 'Enunciado nacional' } }] },
    { _id: 'state-exam', competition: 'OMM Estatal', round: 'Chiapas', categories: [{ _id: 'chiapas' }], problems: [{ position: 1, problem: { _id: 'p3', titulo: 'Estatal - Problema 3', problemNumber: 3, enunciado: 'Enunciado estatal' } }] },
  ]
  await page.route('**/api/exams/official', (route) => route.fulfill({ json: exams[1] }))
  await page.route('**/api/exams/state-exam', (route) => route.fulfill({ json: exams[2] }))
  await page.route('**/api/categories', (route) => route.fulfill({ json: folders }))
  await page.route('**/api/exams/browse?*', (route) => route.fulfill({ json: { items: exams, total: exams.length, totalPages: 1 } }))
  await page.goto('/entrenamiento/examenes')
  const nav = page.getByRole('navigation', { name: 'Carpetas de exámenes' })
  await expect(nav.getByRole('button', { name: 'TeacherPeri Originals' })).toBeVisible()
  await expect(nav.getByRole('button', { name: 'OMM', exact: true })).toBeVisible()
  await expect(nav.getByText('Olimpiada Mexicana de Matemáticas.', { exact: true })).toBeVisible()
  await expect(nav.getByText('Exámenes de práctica originales de TeacherPeri.', { exact: true })).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('exam-folders.png'), fullPage: true })
  await assertFits(page)
  await expect(nav.getByRole('button', { name: 'OMMEB' })).toHaveCount(0)
  await nav.getByRole('button', { name: 'OMM', exact: true }).click()
  await expect(nav.getByRole('button', { name: 'OMM Estatal' })).toBeVisible()
  await expect(nav.getByRole('button', { name: '2024' })).toHaveCount(0)
  await page.getByRole('link', { name: 'OMM 2024', exact: true }).click()
  await expect(page.getByRole('link', { name: 'Problema 5 →' })).toBeVisible()
  await assertFits(page)
  await page.goBack()
  await nav.getByRole('button', { name: 'Exámenes', exact: true }).click()
  await nav.getByRole('button', { name: 'TeacherPeri Originals' }).click()
  await expect(nav.getByRole('button', { name: '2026' })).toHaveCount(0)
  await expect(page.getByRole('link', { name: /Práctica A/ })).toBeVisible()
  await nav.getByRole('button', { name: 'Exámenes', exact: true }).click()
  await nav.getByRole('button', { name: 'OMM', exact: true }).click()
  await nav.getByRole('button', { name: 'OMM Estatal' }).click()
  await nav.getByRole('button', { name: 'Chiapas' }).click()
  await page.getByRole('link', { name: 'OMM Estatal · Chiapas', exact: true }).click()
  await expect(page.getByRole('link', { name: 'Problema 3 →' })).toBeVisible()
  await assertFits(page)
})


test('rewritten lesson boxes link to their bank problems', async ({ page }) => {
  test.setTimeout(240000)
  for (const [slug, draft] of Object.entries(THEORY_REWRITES)) {
    const theory = entry('Theory', `${slug}-guia`)
    await page.goto(`/entrenamiento/teoria/${theory._id}`)
    const kinds = Object.values(draft.collections)[0]
    const boxes = page.locator('article section.tp-box-strong')
    await expect(boxes).toHaveCount(3)
    for (const [index, kind] of ['ejercicios', 'practice', 'dificiles'].entries()) {
      const links = boxes.nth(index).locator('ol > li a')
      await expect(links).toHaveCount(kinds[kind].length)
      for (const [position, code] of kinds[kind].entries()) {
        await expect(links.nth(position)).toHaveAttribute('href', `/entrenamiento/problemas/${entry('Problem', code)._id}`)
      }
    }
    const firstCode = kinds.ejercicios[0]
    await boxes.first().locator('ol > li a').first().click()
    await expect(page).toHaveURL(new RegExp(`/entrenamiento/problemas/${entry('Problem', firstCode)._id}$`))
    await expect(page.getByRole('heading', { level: 1 })).toContainText(entry('Problem', firstCode).titulo)
  }
})
