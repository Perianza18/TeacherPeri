// Writes dist/sitemap.xml after `vite build`: the main pages plus every
// published problem, lesson, exam, list and Ruta, read from the public API.
// It only asks the API on Vercel's production build (or with SITEMAP=1);
// otherwise, or if the API doesn't answer, public/sitemap.xml (main pages
// only, copied into dist by Vite) stays as it is. It never fails the build.
import { writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

const SITE = process.env.SITE_URL || 'https://www.teacherperi.com'
const API = process.env.VITE_API_URL || 'https://teacherperi-api.onrender.com'

export const MAIN_PAGES = ['/', '/rutas', '/entrenamiento/problemas', '/entrenamiento/teoria', '/entrenamiento/examenes', '/entrenamiento/listas', '/entrenamiento/recursos', '/recursos', '/contacto']

const escapeXml = (text) => String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c])
const day = (value) => (value && !Number.isNaN(Date.parse(value)) ? new Date(value).toISOString().slice(0, 10) : null)

// [{ path, lastmod? }] → sitemap XML, without repeated addresses.
export function sitemapXml(site, entries) {
  const seen = new Set()
  const rows = entries.filter(({ path }) => !seen.has(path) && seen.add(path)).map(({ path, lastmod }) =>
    `  <url><loc>${escapeXml(site + path)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`)
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join('\n')}\n</urlset>\n`
}

// The public address of each item, as the site links it.
export function contentEntries({ problems = [], theory = [], exams = [], lists = [], resources = [], paths = [] }) {
  const entry = (base, key = '_id') => (item) => ({ path: `${base}/${item[key]}`, lastmod: day(item.updatedAt) })
  return [
    ...problems.map(entry('/entrenamiento/problemas')),
    ...theory.map(entry('/entrenamiento/teoria')),
    ...exams.map(entry('/entrenamiento/examenes')),
    ...lists.map(entry('/entrenamiento/listas')),
    ...resources.map(entry('/entrenamiento/recursos')),
    ...paths.filter((path) => !path.lessonOnly && path.slug).map(entry('/rutas', 'slug')),
  ]
}

async function getJson(path) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      const res = await fetch(API + path, { signal: AbortSignal.timeout(90_000) }) // the free API may be waking up
      if (!res.ok) throw new Error(`${res.status} ${path}`)
      return await res.json()
    } catch (error) {
      if (attempt >= 2) throw error
    }
  }
}

async function allPages(path) {
  const items = []
  for (let page = 1; ; page += 1) {
    const data = await getJson(`${path}${path.includes('?') ? '&' : '?'}page=${page}&limit=50`)
    items.push(...data.items)
    if (page >= (data.totalPages || 1)) return items
  }
}

export async function main() {
  if (process.env.VERCEL_ENV !== 'production' && process.env.SITEMAP !== '1') {
    console.log('sitemap: main pages only (the full list is built on production deploys, or with SITEMAP=1)')
    return
  }
  try {
    const [problems, theory, exams, lists, resources, paths] = await Promise.all([
      allPages('/api/problems'), allPages('/api/theory'), allPages('/api/exams'),
      allPages('/api/lists?source=teacherperi'), allPages('/api/lists?source=external'),
      getJson('/api/paths').then((data) => data.items),
    ])
    const entries = [...MAIN_PAGES.map((path) => ({ path })), ...contentEntries({ problems, theory, exams, lists, resources, paths })]
    await writeFile(new URL('../dist/sitemap.xml', import.meta.url), sitemapXml(SITE, entries))
    console.log(`sitemap: ${entries.length} addresses`)
  } catch (error) {
    console.warn(`sitemap: kept the main pages only, the API did not answer (${error.message})`)
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main()
