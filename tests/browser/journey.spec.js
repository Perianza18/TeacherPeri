import { test, expect } from '@playwright/test'
import { buildMvpManifest } from '../../server/src/data/mvpManifest.js'

const entries = buildMvpManifest().map((e) => ({ ...e, data: { _id: e._id, ...e.data } }))
const dataFor = (model) => entries.filter((e) => e.model === model).map((e) => e.data)
const entry = (model, key) => entries.find((e) => e.model === model && e.key === key).data
const populate = (items) => items.map((i) => ({ ...i, problems: i.problems?.map((r) => ({ ...r, problem: dataFor('Problem').find((p) => p._id === r.problem) })) }))

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

test('problem discovery, pagination, math, solution and comments', async ({ page }) => {
  await page.goto('/entrenamiento/problemas')
  await expect(page.getByText('36 resultados')).toBeVisible()
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

test('theory pagination and direct navigation do not show stale content', async ({ page }) => {
  await page.goto('/entrenamiento/teoria')
  await expect(page.getByText('37 resultados')).toBeVisible()
  await assertFits(page)
  await page.goto(`/entrenamiento/teoria/${entry('Theory', 'factorizacion-e-identidades-guia')._id}`)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Factorización')
  await expect(page.locator('.katex-error')).toHaveCount(0)
  await assertFits(page)
  await page.goto('/entrenamiento/teoria/000000000000000000000000')
  await expect(page.getByRole('alert')).toContainText('no está disponible')
  await expect(page.getByRole('heading', { name: /Factorización/ })).toHaveCount(0)
})

test('exam and list reuse canonical problem links', async ({ page }) => {
  await page.goto(`/entrenamiento/examenes/${entry('Exam', 'ciclo-1-a')._id}`)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Práctica A')
  await expect(page.locator('main ol > li')).toHaveCount(5)
  await expect(page.getByRole('link', { name: 'La diferencia divisible →' })).toHaveAttribute('href', `/entrenamiento/problemas/${entry('Problem', 'TP-C05')._id}`)
  await assertFits(page)
  await page.goto(`/entrenamiento/listas/${entry('List', 'mixto-ciclo-1')._id}`)
  await expect(page.locator('main ol > li')).toHaveCount(5)
  await expect(page.getByRole('link', { name: 'La diferencia divisible →' })).toHaveAttribute('href', `/entrenamiento/problemas/${entry('Problem', 'TP-C05')._id}`)
  await assertFits(page)
})
