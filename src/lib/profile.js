// Shared pieces for Mi Espacio. The server decides what each viewer may see
// (server/src/routes/profiles.routes.js); this file only builds links and
// formats dates and labels.

export const profilePath = (username) => `/perfil/${encodeURIComponent(username)}`
// A collection («Guardados» tab). The old /listas/ address still redirects.
export const userListPath = (username, id) => `${profilePath(username)}/colecciones/${id}`

const ROLE_NAMES = { user: 'Usuario', editor: 'Editor', admin: 'Admin' }
export const roleName = (role) => ROLE_NAMES[role] ?? 'Usuario'

// «hace 2 h», «ayer», «hace 3 días», then the date.
export function relativeTime(value, now = Date.now()) {
  const date = new Date(value)
  const seconds = Math.max(0, Math.round((now - date.getTime()) / 1000))
  if (seconds < 60) return 'hace un momento'
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `hace ${hours} h`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'ayer'
  if (days < 7) return `hace ${days} días`
  if (days < 30) {
    const weeks = Math.floor(days / 7)
    return weeks === 1 ? 'hace 1 semana' : `hace ${weeks} semanas`
  }
  return longDate(date)
}

export const longDate = (value) => new Date(value).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })

export const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`

// Tabs: who sees each one, and its color (the dot, and the fill when selected; always ink text).
export const PROFILE_TABS = [
  { id: 'actividad', label: 'Actividad', color: 'bg-tp-yellow', ownerOnly: true },
  { id: 'comentarios', label: 'Comentarios', color: 'bg-tp-sky' },
  { id: 'guardados', label: 'Guardados', color: 'bg-tp-orange' },
  { id: 'envios', label: 'Mis envíos', color: 'bg-tp-mint', ownerOnly: true },
  { id: 'insignias', label: 'Insignias', color: 'bg-tp-tint-violet', dot: 'bg-tp-violet' },
]

export const tabsFor = (isOwner) => PROFILE_TABS.filter((tab) => isOwner || !tab.ownerOnly)

// Status pills: Pendiente yellow, Aceptada/Aplicada mint, Rechazada/Descartada coral.
export const STATUS_PILLS = {
  pending: { label: 'Pendiente', className: 'bg-tp-yellow' },
  accepted: { label: 'Aceptada', className: 'bg-tp-mint' },
  rejected: { label: 'Rechazada', className: 'bg-tp-coral' },
  applied: { label: 'Aplicada', className: 'bg-tp-mint' },
  dismissed: { label: 'Descartada', className: 'bg-tp-coral' },
}

export const BADGE_COLORS = { mint: 'bg-tp-mint', sky: 'bg-tp-sky', yellow: 'bg-tp-yellow', coral: 'bg-tp-coral', violet: 'bg-tp-violet-soft' }

export const ACTIVITY_LABELS = {
  comment: 'Comentario',
  proposal: 'Problema propuesto',
  suggestion: 'Sugerencia',
  solution: 'Solución propuesta',
  saved: 'Guardado',
  solved: 'Resuelto',
  follow: 'Siguiendo',
}

// Next and previous tab for the arrow keys, Home and End (wraps around).
export function nextTabIndex(key, index, count) {
  if (key === 'ArrowRight') return (index + 1) % count
  if (key === 'ArrowLeft') return (index - 1 + count) % count
  if (key === 'Home') return 0
  if (key === 'End') return count - 1
  return null
}

// Área pills on «Problemas resueltos» (same colors as the problem cards).
export const AREA_PILLS = { 'Geometría': 'bg-tp-sky', 'Álgebra': 'bg-tp-tint-violet', 'Combinatoria': 'bg-tp-orange', 'Teoría de Números': 'bg-tp-mint' }

// «Buscar usuarios»: what is sent to the server, or '' while it is too short.
export const SEARCH_MIN = 2
export function userQuery(text) {
  const value = String(text ?? '').trim().replace(/^@/, '').slice(0, 30)
  return value.length >= SEARCH_MIN ? value : ''
}
