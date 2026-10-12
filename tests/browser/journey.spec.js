import { test, expect } from '@playwright/test'
import { buildMvpManifest } from '../../server/src/data/mvpManifest.js'

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
    else if (parts[3] === 'comments') body = []
    else if (parts[1] === 'paths' && (parts[2] || url.searchParams.has('traversal'))) body = pathDetail(parts[2] ? [parts[2]] : url.searchParams.get('traversal').split('/'))
    else if (parts[1] === 'paths') body = { items: [{ _id: 'fixture', slug: 'factorizacion-e-identidades', title: 'Factorización e Identidades', kind: 'leaf', level: 'introductorio' }] }
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
  await expect(page.getByText('36 resultados')).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('problems.png'), fullPage: true })
  await assertFits(page)
  await page.getByRole('button', { name: 'Siguiente', exact: true }).click()
  await expect(page.getByText('2 / 3')).toBeVisible()
  await page.getByRole('searchbox').fill('El ángulo exterior')
  await expect(page.getByText('1 resultados')).toBeVisible()
  await page.getByRole('button', { name: 'Comentarios', exact: true }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.getByRole('link', { name: 'El ángulo exterior', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'El ángulo exterior' })).toBeVisible()
  await page.getByText('Ver solución razonada', { exact: true }).click()
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
  await expect(page.getByRole('navigation', { name: 'Recorrido de aprendizaje' })).toContainText('Preparación para la OMM')
  await expect(page.getByRole('link', { name: 'Resolver problema →' }).first()).toBeVisible()
  await page.reload()
  await expect(page.getByRole('navigation', { name: 'Recorrido de aprendizaje' })).toContainText('Álgebra Básica')
  await page.screenshot({ path: testInfo.outputPath('lesson.png'), fullPage: true })
  await assertFits(page)
  await page.getByRole('link', { name: 'Explorar problemas del tema →' }).click()
  await expect(page).toHaveURL(/problemas\?topics=.+/)
})
