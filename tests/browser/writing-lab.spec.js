import { test, expect } from '@playwright/test'
import { THEORY_WRITING_LAB } from '../../server/src/data/theoryWritingLab.js'

test('six source-backed drafts can be reviewed without an API and disclosures remain optional', async ({ page }, testInfo) => {
  const apiCalls = []
  page.on('request', (request) => { if (request.url().includes('/api/')) apiCalls.push(request.url()) })
  for (const [slug, lesson] of Object.entries(THEORY_WRITING_LAB)) {
    await page.goto(`/revision/teoria?lesson=${slug}`)
    await expect(page.locator('article')).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Propuestas de escritura' }).getByRole('link')).toHaveCount(6)
    const headings = lesson.content.split('\n').filter((line) => line.startsWith('## ')).map((line) => line.slice(3))
    await expect(page.locator('article .tp-lesson-body > h2')).toHaveText(headings)
    await expect(page.locator('article details[open]')).toHaveCount(0)
    await page.locator('article summary').first().click()
    await expect(page.locator('article details[open]')).toHaveCount(1)
    await expect(page.locator('article details[open] .katex').first()).toBeVisible()
    await expect(page.locator('.katex-error')).toHaveCount(0)
    await expect(page.locator('article')).not.toContainText(':::reveal')
    await expect(page.locator('article')).not.toContainText('[[practice]]')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
    if (lesson.model === 'B') await expect(page.getByRole('link', { name: 'consultar el material de OMMBC ↗' })).toHaveAttribute('href', lesson.source)
    if (slug === 'permutaciones-y-combinaciones' || slug === 'principio-de-casillas') {
      await page.locator('article').scrollIntoViewIfNeeded()
      await page.screenshot({ path: testInfo.outputPath(`${slug}.png`), fullPage: true })
    }
  }
  expect(apiCalls).toEqual([])
})
