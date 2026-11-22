import { test, expect } from '@playwright/test'
import { THEORY_REWRITES } from '../../server/src/data/theory/index.js'

test('rewritten lessons render their blocks, figures and collections', async ({ page }) => {
  test.setTimeout(240000)
  for (const slug of Object.keys(THEORY_REWRITES)) {
    await page.goto(`/dev/teoria-borrador/${slug}`)
    await expect(page.locator('h1')).toBeVisible()
    for (const heading of ['Ejercicios', 'Problemas', 'Problemas de mayor dificultad']) {
      await expect(page.locator('article h2').filter({ hasText: new RegExp(`${heading}$`) })).toBeVisible()
    }
    const boxes = page.locator('section.tp-box-strong')
    await expect(boxes).toHaveCount(3)
    for (const box of await boxes.all()) await expect(box.locator('ol > li').first()).toBeVisible()
    for (const details of await page.locator('details').all()) await details.evaluate((node) => { node.open = true })
    await expect(page.locator('.katex-error')).toHaveCount(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), slug).toBe(true)
    const brokenImages = await page.locator('img[src*="figuras/"]').evaluateAll((images) => images.filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.getAttribute('src')))
    expect(brokenImages, slug).toEqual([])
  }
})
