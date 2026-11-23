import { test, expect } from '@playwright/test'

// Browser fixture for Mi Espacio. What the API sends to whom (owner vs
// visitor) is tested against the database in server/src/__tests__; here we
// check rendering, keyboard tabs and the comment link.
const ANA = { id: 'u-ana', username: 'ana', email: 'ana@example.test', role: 'user', avatar: 'a07', bio: '' }
const hour = 3600e3
const ago = (ms) => new Date(Date.now() - ms).toISOString()

function profile(isOwner) {
  return {
    username: 'ana', avatar: 'a07', role: 'user', bio: 'Me preparo para la OMM.', followers: 2, following: 1,
    stats: { solved: 3, comments: 1, proposed: 1, badges: 2 }, isOwner, isFollowing: false, ...(isOwner ? { email: ANA.email } : {}),
  }
}

const problem = { _id: 'p1', codigo: 'TP-1', titulo: 'Calcetines', enunciado: 'Hay $10$ calcetines rojos y $10$ azules.', tema: 'Combinatoria', año: '2026', tipo: 'TeacherPeri', dificultad: 'Media' }
const comments = Array.from({ length: 16 }, (_, i) => ({
  _id: `c${i}`, problem: 'p1', parent: null, root: null, depth: 0, deleted: false, createdAt: ago((20 - i) * hour),
  body: i === 15 ? 'Con $3$ basta, por casillas.' : `Comentario ${i}`, author: { _id: 'u-x', username: i === 15 ? 'ana' : 'beto', role: 'user', avatar: 'a03' },
}))

const SOLVED = [
  { id: 'p1', preview: 'Hay $10$ calcetines rojos y $10$ azules.', area: 'Combinatoria', solvedAt: ago(2 * hour), href: '/entrenamiento/problemas/p1' },
  { id: 'p2', preview: 'Un triángulo tiene ángulos de $50^\\circ$ y $60^\\circ$.', area: 'Geometría', solvedAt: ago(30 * hour), href: '/entrenamiento/problemas/p2' },
  { id: 'p3', preview: 'Encuentra todos los $n$ tales que $n^2+1$ es primo.', area: 'Teoría de Números', solvedAt: ago(80 * hour), href: '/entrenamiento/problemas/p3' },
]
const PEOPLE = [{ username: 'beto', avatar: 'a03', role: 'editor' }, { username: 'Betania', avatar: 'a05', role: 'user' }]
let searches = []

async function mockApi(page, { signedIn }) {
  searches = []
  if (signedIn) await page.addInitScript((user) => localStorage.setItem('teacherperi_auth', JSON.stringify({ token: 'fixture-token', user })), ANA)
  await page.route('**/api/**', async (route) => {
    const { pathname } = new URL(route.request().url())
    const owner = signedIn
    const json = {
      '/api/auth/me': { user: ANA },
      '/api/notifications': { items: [], unread: 0 },
      '/api/profiles/ana': profile(owner),
      '/api/profiles/ana/activity': { items: [
        { kind: 'comment', at: ago(2 * hour), target: { label: 'Calcetines', href: '/entrenamiento/problemas/p1#comentario-c15' } },
        { kind: 'proposal', at: ago(26 * hour), target: { label: 'OMM Estatal › Jalisco › 2023, problema 4', href: '/mis-envios/p2' }, status: 'pending' },
      ] },
      '/api/profiles/ana/comments': { total: 1, page: 1, pageSize: 20, items: [{ id: 'c15', body: 'Con $3$ basta.', createdAt: ago(2 * hour), target: { label: 'Calcetines', href: '/entrenamiento/problemas/p1#comentario-c15' } }] },
      '/api/profiles/ana/lists': { isOwner: owner, items: [{ id: 'l1', name: 'Geometría para el estatal', isPublic: true, count: 2, href: '/perfil/ana/colecciones/l1' }] },
      '/api/profiles/ana/solved': owner ? { items: SOLVED } : undefined,
      '/api/my-lists/containing': { items: [{ id: 'l1', name: 'Geometría para el estatal', isPublic: true, count: 2, contains: false }] },
      '/api/my-lists/l1': { id: 'l1', name: 'Geometría para el estatal', isPublic: true, isOwner: owner, count: 0, items: [], owner: { username: 'ana', avatar: 'a07' } },
      '/api/profiles/ana/badges': { earned: [{ id: 'solved-1', name: 'Primer problema', color: 'mint', description: '1 problema resuelto', earned: true, earnedAt: ago(48 * hour) }], locked: [{ id: 'solved-10', name: 'Constancia', color: 'mint', description: '10 problemas resueltos', earned: false, remaining: 7 }] },
      '/api/profiles/ana/followers': { total: 1, page: 1, pageSize: 50, items: [{ username: 'beto', avatar: 'a03', role: 'editor' }] },
      '/api/submissions/mine': [],
      '/api/flags/mine': [],
      '/api/problems/p1': problem,
      '/api/problems/p1/comments': comments,
      '/api/problems/p1/solved': { solved: false },
    }[pathname]
    if (pathname.startsWith('/api/paths')) return route.fulfill({ json: [] })
    if (pathname === '/api/profiles') {
      const q = new URL(route.request().url()).searchParams.get('q') ?? ''
      searches.push(q)
      return route.fulfill({ json: { items: PEOPLE.filter((p) => p.username.toLowerCase().startsWith(q.toLowerCase())) } })
    }
    if (json === undefined) return route.fulfill({ status: 404, json: { error: 'No existe' } })
    return route.fulfill({ json })
  })
}

const fits = (page) => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)

test('el dueño ve las cinco pestañas y las recorre con el teclado', async ({ page }) => {
  await mockApi(page, { signedIn: true })
  await page.goto('/perfil/ana')
  const tabs = page.getByRole('tab')
  await expect(tabs).toHaveText(['Actividad', 'Comentarios', 'Guardados', 'Mis envíos', 'Insignias'])
  await expect(page.getByRole('tab', { name: 'Actividad' })).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByText('ana@example.test')).toBeVisible()
  await expect(page.getByRole('tabpanel')).toContainText('Comentario · hace 2 h')
  await expect(page.getByRole('tabpanel')).toContainText('Pendiente')

  await page.getByRole('tab', { name: 'Actividad' }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('tab', { name: 'Comentarios' })).toBeFocused()
  await expect(page.getByRole('tab', { name: 'Comentarios' })).toHaveAttribute('aria-selected', 'true')
  await expect(page).toHaveURL(/tab=comentarios/)
  await expect(page.getByRole('tabpanel')).toContainText('Con')
  await page.keyboard.press('End')
  await expect(page.getByRole('tab', { name: 'Insignias' })).toBeFocused()
  await expect(page.getByText('Obtenida el')).toBeVisible()
  await expect(page.getByText('Te faltan 7')).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('tab', { name: 'Actividad' })).toBeFocused()
  await page.keyboard.press('ArrowLeft')
  await expect(page.getByRole('tab', { name: 'Insignias' })).toHaveAttribute('aria-selected', 'true')
  await page.keyboard.press('Home')
  await expect(page.getByRole('tab', { name: 'Actividad' })).toHaveAttribute('aria-selected', 'true')
  // Only the selected tab takes Tab focus (roving tabindex).
  expect(await tabs.evaluateAll((nodes) => nodes.map((n) => n.tabIndex))).toEqual([0, -1, -1, -1, -1])
  expect(await fits(page)).toBe(true)
})

test('un visitante ve Comentarios, Guardados e Insignias, sin correo; los seguidores no marcan pestaña', async ({ page }) => {
  await mockApi(page, { signedIn: false })
  await page.goto('/perfil/ana')
  await expect(page.getByRole('tab')).toHaveText(['Comentarios', 'Guardados', 'Insignias'])
  await expect(page.getByRole('button', { name: 'Seguir' })).toBeVisible()
  await expect(page.getByText('ana@example.test')).toHaveCount(0)
  await page.getByRole('tab', { name: 'Insignias' }).click()
  await expect(page.getByText('Le faltan 7')).toBeVisible()

  await page.getByRole('button', { name: '2 seguidores' }).click()
  await expect(page.getByRole('heading', { name: 'Seguidores de @ana' })).toBeVisible()
  await expect(page.getByText('@beto')).toBeVisible()
  await expect(page.getByRole('main').getByText('Editor')).toBeVisible()
  expect(await page.getByRole('tab', { selected: true }).count()).toBe(0)
  await page.getByRole('button', { name: 'Volver' }).click()
  await expect(page.getByRole('tab', { name: 'Comentarios' })).toHaveAttribute('aria-selected', 'true')
  expect(await fits(page)).toBe(true)
})

test('el enlace a un comentario abre su página, baja hasta él y lo resalta', async ({ page }) => {
  await mockApi(page, { signedIn: false })
  await page.goto('/perfil/ana?tab=comentarios')
  await page.getByRole('link', { name: 'Calcetines' }).click()
  await expect(page).toHaveURL(/\/entrenamiento\/problemas\/p1#comentario-c15$/)
  const target = page.locator('#comentario-c15')
  await expect(target).toHaveClass(/tp-flash/)
  await expect(target).toBeInViewport()
  await expect(page.locator('#comentario-c3')).not.toHaveClass(/tp-flash/)
})

const noLista = async (locator) => expect(await locator.innerText()).not.toMatch(/\blistas?\b/i)

test('«Guardados»: colecciones en el perfil, en «Guardar» y en su página, sin la palabra «lista»', async ({ page }) => {
  await mockApi(page, { signedIn: true })
  await page.goto('/perfil/ana?tab=listas') // old links still open the tab
  await expect(page.getByRole('tab', { name: 'Guardados' })).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('button', { name: 'Nueva colección' })).toBeVisible()
  await expect(page.getByText('2 elementos')).toBeVisible()
  await noLista(page.getByRole('main'))
  await page.getByRole('button', { name: 'Nueva colección' }).click()
  await expect(page.getByLabel('Nombre de la colección')).toBeVisible()
  await noLista(page.getByRole('main'))

  await page.goto('/perfil/ana/listas/l1') // old address redirects
  await expect(page).toHaveURL(/\/perfil\/ana\/colecciones\/l1$/)
  await expect(page.getByText('Colección vacía')).toBeVisible()
  await expect(page.getByRole('link', { name: /Volver a los guardados de @ana/ })).toHaveAttribute('href', '/perfil/ana?tab=guardados')
  await noLista(page.getByRole('main'))

  await page.goto('/entrenamiento/problemas/p1')
  await page.getByRole('button', { name: 'Guardar', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Guardar en una colección' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Nueva colección' })).toBeVisible()
  await noLista(dialog)
})

test('el dueño abre «Problemas resueltos» con el teclado y filtra por área', async ({ page }) => {
  await mockApi(page, { signedIn: true })
  await page.goto('/perfil/ana')
  const count = page.getByRole('button', { name: '3 problemas resueltos: ver cuáles' })
  await count.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Problemas resueltos' })).toBeVisible()
  await expect(page).toHaveURL(/ver=resueltos/)
  expect(await page.getByRole('tab', { selected: true }).count()).toBe(0)
  const rows = page.getByRole('region', { name: 'Problemas resueltos' }).getByRole('listitem')
  await expect(rows).toHaveCount(3)
  await expect(rows.first()).toContainText('Combinatoria')
  await expect(rows.first()).toContainText('Resuelto el')
  await expect(rows.first().getByRole('link')).toHaveAttribute('href', '/entrenamiento/problemas/p1')
  const filter = page.getByRole('group', { name: 'Filtrar por área' })
  await filter.getByText('Geometría', { exact: true }).click()
  await expect(page.getByRole('radio', { name: 'Geometría' })).toBeChecked()
  await expect(rows).toHaveCount(1)
  await expect(rows.first()).toContainText('triángulo')
  // Arrow keys move between the área radios.
  await page.getByRole('radio', { name: 'Geometría' }).focus()
  await page.keyboard.press('ArrowLeft')
  await expect(page.getByRole('radio', { name: 'Combinatoria' })).toBeChecked()
  await filter.getByText('Todas', { exact: true }).click()
  await expect(rows).toHaveCount(3)
  await page.getByRole('button', { name: 'Volver' }).click()
  await expect(page.getByRole('tab', { name: 'Actividad' })).toHaveAttribute('aria-selected', 'true')
  expect(await fits(page)).toBe(true)
})

test('un visitante solo ve el número de resueltos, sin botón', async ({ page }) => {
  await mockApi(page, { signedIn: false })
  await page.goto('/perfil/ana?ver=resueltos')
  await expect(page.getByRole('tab', { name: 'Comentarios' })).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByText('problemas resueltos')).toBeVisible()
  await expect(page.getByRole('button', { name: /resueltos/ })).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Problemas resueltos' })).toHaveCount(0)
})

test('«Buscar usuarios»: 2 caracteres mínimo, resultados con teclado, vacío y «Volver»', async ({ page }) => {
  await mockApi(page, { signedIn: false })
  await page.goto('/perfil/ana')
  const box = page.getByRole('searchbox', { name: 'Buscar usuarios' })
  await expect(box).toHaveAttribute('placeholder', '@usuario')
  await box.fill('@b')
  await expect(page.getByText('Escribe al menos 2 caracteres.')).toBeVisible()
  await page.waitForTimeout(500)
  expect(searches).toEqual([])

  await box.fill('@be')
  await expect(page.getByRole('heading', { name: 'Buscar usuarios' })).toBeVisible()
  expect([...new Set(searches)]).toEqual(['be'])
  expect(await page.getByRole('tab', { selected: true }).count()).toBe(0)
  await expect(page.getByText('@beto')).toBeVisible()
  await expect(page.getByText('@Betania')).toBeVisible()
  await expect(page.getByRole('main').getByText('Editor')).toBeVisible()
  // Keyboard: Tab from the box reaches the results' «Ver perfil» links.
  await box.focus()
  const link = page.getByRole('link', { name: 'Ver perfil' }).first()
  for (let i = 0; i < 20 && !(await link.evaluate((n) => n === document.activeElement)); i += 1) await page.keyboard.press('Tab')
  await expect(link).toBeFocused()
  await expect(link).toHaveAttribute('href', '/perfil/beto')

  await box.fill('zz')
  await expect(page.getByText('No encontramos a nadie con ese usuario.').first()).toBeVisible()
  await page.getByRole('button', { name: 'Volver' }).click()
  await expect(box).toHaveValue('')
  await expect(page.getByRole('tab', { name: 'Comentarios' })).toHaveAttribute('aria-selected', 'true')
  expect(await fits(page)).toBe(true)
})
