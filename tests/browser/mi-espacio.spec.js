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

async function mockApi(page, { signedIn }) {
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
      '/api/profiles/ana/lists': { isOwner: owner, items: [{ id: 'l1', name: 'Geometría para el estatal', isPublic: true, count: 2, href: '/perfil/ana/listas/l1' }] },
      '/api/profiles/ana/badges': { earned: [{ id: 'solved-1', name: 'Primer problema', color: 'mint', description: '1 problema resuelto', earned: true, earnedAt: ago(48 * hour) }], locked: [{ id: 'solved-10', name: 'Constancia', color: 'mint', description: '10 problemas resueltos', earned: false, remaining: 7 }] },
      '/api/profiles/ana/followers': { total: 1, page: 1, pageSize: 50, items: [{ username: 'beto', avatar: 'a03', role: 'editor' }] },
      '/api/submissions/mine': [],
      '/api/flags/mine': [],
      '/api/problems/p1': problem,
      '/api/problems/p1/comments': comments,
      '/api/problems/p1/solved': { solved: false },
    }[pathname]
    if (pathname.startsWith('/api/paths')) return route.fulfill({ json: [] })
    if (json === undefined) return route.fulfill({ status: 404, json: { error: 'No existe' } })
    return route.fulfill({ json })
  })
}

const fits = (page) => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)

test('el dueño ve las cinco pestañas y las recorre con el teclado', async ({ page }) => {
  await mockApi(page, { signedIn: true })
  await page.goto('/perfil/ana')
  const tabs = page.getByRole('tab')
  await expect(tabs).toHaveText(['Actividad', 'Comentarios', 'Listas', 'Mis envíos', 'Insignias'])
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

test('un visitante ve Comentarios, Listas e Insignias, sin correo; la lista de seguidores no marca pestaña', async ({ page }) => {
  await mockApi(page, { signedIn: false })
  await page.goto('/perfil/ana')
  await expect(page.getByRole('tab')).toHaveText(['Comentarios', 'Listas', 'Insignias'])
  await expect(page.getByRole('button', { name: 'Seguir' })).toBeVisible()
  await expect(page.getByText('ana@example.test')).toHaveCount(0)
  await page.getByRole('tab', { name: 'Insignias' }).click()
  await expect(page.getByText('Le faltan 7')).toBeVisible()

  await page.getByRole('button', { name: '2 seguidores' }).click()
  await expect(page.getByRole('heading', { name: 'Seguidores de @ana' })).toBeVisible()
  await expect(page.getByText('@beto')).toBeVisible()
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
