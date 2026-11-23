import { afterEach, describe, expect, it, vi } from 'vitest'
import { writeFile } from 'node:fs/promises'
import { MAIN_PAGES, contentEntries, main, sitemapXml } from '../../../scripts/build-sitemap.js'

vi.mock('node:fs/promises', () => ({ writeFile: vi.fn() }))
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.restoreAllMocks(); vi.clearAllMocks() })

describe('sitemap', () => {
  it('uses public detail routes and omits lesson-only paths', () => {
    const item = { _id: '123', updatedAt: '2026-11-22T10:00:00Z' }
    const entries = contentEntries({ problems: [item], theory: [item], exams: [item], lists: [item], resources: [item], paths: [{ slug: 'omm' }, { slug: 'hidden', lessonOnly: true }, {}] })
    expect(entries.map(e => e.path)).toEqual(['/entrenamiento/problemas/123', '/entrenamiento/teoria/123', '/entrenamiento/examenes/123', '/entrenamiento/listas/123', '/entrenamiento/recursos/123', '/rutas/omm'])
    expect(entries[0].lastmod).toBe('2026-11-22')
    expect(contentEntries({ theory: [{ _id: 'a', updatedAt: 'invalid' }] })[0].lastmod).toBeNull()
  })
  it('escapes XML, removes duplicate addresses and omits missing dates', () => {
    const xml = sitemapXml('https://www.teacherperi.com', [{ path: '/a?x=1&y=2' }, { path: '/a?x=1&y=2' }])
    expect(xml.match(/<url>/g)).toHaveLength(1)
    expect(xml).toContain('/a?x=1&amp;y=2</loc>')
    expect(xml).not.toContain('<lastmod>')
  })
  it('does not fetch or overwrite the fallback in preview builds', async () => {
    vi.stubEnv('VERCEL_ENV', 'preview'); vi.stubEnv('SITEMAP', '')
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch)
    await main()
    expect(fetch).not.toHaveBeenCalled()
    expect(writeFile).not.toHaveBeenCalled()
  })
  it('fetches every page and writes the production sitemap', async () => {
    vi.stubEnv('SITEMAP', '1')
    const fetch = vi.fn(async url => ({ ok: true, json: async () => url.includes('/api/problems') ? { items: [{ _id: url.includes('page=2') ? 'second' : 'first' }], totalPages: 2 } : { items: [] } }))
    vi.stubGlobal('fetch', fetch)
    await main()
    expect(fetch).toHaveBeenCalledTimes(7)
    const xml = vi.mocked(writeFile).mock.calls[0][1]
    expect(xml).toContain('/entrenamiento/problemas/first</loc>')
    expect(xml).toContain('/entrenamiento/problemas/second</loc>')
    for (const path of MAIN_PAGES) expect(xml).toContain(`https://www.teacherperi.com${path}</loc>`)
  })
  it('retries failed requests and preserves the static fallback on API failure', async () => {
    vi.stubEnv('SITEMAP', '1')
    const fetch = vi.fn(async () => ({ ok: false, status: 503 }))
    vi.stubGlobal('fetch', fetch)
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    await main()
    expect(fetch).toHaveBeenCalledTimes(12)
    expect(writeFile).not.toHaveBeenCalled()
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('kept the main pages'))
  })
})
