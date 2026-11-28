// Shared rules for Mi Espacio (profiles): preset avatars, the bio, and who is
// the owner of a profile. The website draws the avatars (src/lib/avatars.js);
// the server only knows their ids.

import { roleOf } from './permissions.js'

// Math shapes drawn in ink (only «π» is offered, free, as the default; the
// others stay valid so old accounts load, and show «π»), then every drawing,
// each bought with points (AVATAR_PRICES). The team (editors and admins) may
// use any of them without paying, and whoever already had one of the twelve
// original drawings before they cost points keeps that one for free
// (`freeAvatars`, never counted as spent).
export const SHAPE_AVATAR_IDS = Object.freeze(['a01', 'a02', 'a03', 'a04', 'a05', 'a06', 'a07', 'a08', 'a09', 'a10', 'a11', 'a12'])
export const DEFAULT_AVATAR = 'a04'
// id → price in points, cheapest first. Bought once, kept for good.
export const AVATAR_PRICES = Object.freeze({
  'pinguino-compu': 10,
  'ajolote-matematico': 10,
  'de-hecho': 15,
  'gato-programador': 15,
  'hamster-rapido': 15,
  'gato-estresado': 15,
  'gato-llorando': 20,
  'gato-dormido': 20,
  'mucha-tarea': 20,
  'ternurin-cansado': 20,
  'vaquita-enojada': 25,
  'gatito-batalla': 25,
  'gato-de-traje': 30,
  'gato-pensando': 40,
  sabelotodo: 50,
  'gato-gamer': 75,
  'gatito-leon': 100,
})
export const PREMIUM_AVATAR_IDS = Object.freeze(Object.keys(AVATAR_PRICES))
// The drawings anyone could pick for free before they cost points.
export const ORIGINAL_DRAWING_IDS = Object.freeze(PREMIUM_AVATAR_IDS.slice(0, 12))
export const AVATAR_IDS = Object.freeze([...SHAPE_AVATAR_IDS, ...PREMIUM_AVATAR_IDS])
// What «Editar perfil» offers.
export const CHOOSABLE_AVATAR_IDS = Object.freeze([DEFAULT_AVATAR, ...PREMIUM_AVATAR_IDS])

const isTeam = (user) => ['editor', 'admin'].includes(roleOf(user))

// Points spent on avatars, and what is left to spend. Spending never lowers
// the frame: frames follow the points earned (lib/levels.js).
export const spentPoints = (unlocked = []) => unlocked.reduce((sum, id) => sum + (AVATAR_PRICES[id] ?? 0), 0)
export const pointBalance = (points, unlocked = []) => Math.max(0, (Number.isFinite(points) ? points : 0) - spentPoints(unlocked))
// An original drawing saved as someone's avatar was chosen while it was free
// (since then nobody can save one they do not own), so it stays theirs.
export const keptAvatar = (user) => (ORIGINAL_DRAWING_IDS.includes(user?.avatar) ? user.avatar : null)
// The avatars someone may use: all of them for the team, otherwise the ones
// bought, the ones kept from before, and the original drawing they still show.
export function ownedAvatars(user) {
  if (isTeam(user)) return [...PREMIUM_AVATAR_IDS]
  const owned = new Set([...(user?.unlockedAvatars ?? []), ...(user?.freeAvatars ?? []), ...(keptAvatar(user) ? [keptAvatar(user)] : [])])
  return PREMIUM_AVATAR_IDS.filter((id) => owned.has(id))
}
export const ownsAvatar = (user, id) => id === DEFAULT_AVATAR || ownedAvatars(user).includes(id)

// Background a person may choose for any avatar. Without one (null), each
// avatar keeps its own pastel fill.
export const AVATAR_COLORS = Object.freeze([
  'blanco', 'crema', 'amarillo', 'durazno', 'naranja', 'rosa', 'lila',
  'celeste', 'cielo', 'turquesa', 'menta', 'salvia', 'arena',
])
export const BIO_MAX = 160

// The saved avatar if they may still use it; otherwise «π». The user document
// needs `role` and `unlockedAvatars` (USER_AVATAR_FIELDS).
export const USER_AVATAR_FIELDS = 'avatar avatarColor role unlockedAvatars freeAvatars'
export function avatarOf(user) {
  const id = user?.avatar
  return CHOOSABLE_AVATAR_IDS.includes(id) && ownsAvatar(user, id) ? id : DEFAULT_AVATAR
}

// The saved background colour, or null for the avatar's own fill.
export const avatarColorOf = (user) => (AVATAR_COLORS.includes(user?.avatarColor) ? user.avatarColor : null)

// Bio: one line of plain text, at most BIO_MAX characters. Returns
// { value } or { error }.
export function parseBio(value) {
  if (value == null) return { value: '' }
  if (typeof value !== 'string') return { error: 'La descripción debe ser texto.' }
  const text = value.replace(/\s+/g, ' ').trim()
  if (text.length > BIO_MAX) return { error: `La descripción puede tener hasta ${BIO_MAX} caracteres.` }
  return { value: text }
}

export const isOwner = (viewerId, user) => Boolean(viewerId) && String(user._id) === String(viewerId)

export const LIST_NAME_MAX = 80
export const MAX_LISTS_PER_USER = 50
export const MAX_ITEMS_PER_LIST = 500
// Experiencias posts will join this list when they exist.
export const LIST_ITEM_TYPES = Object.freeze(['problem', 'theory'])

export function parseListName(value) {
  if (typeof value !== 'string') return { error: 'Escribe un nombre para la colección.' }
  const text = value.replace(/\s+/g, ' ').trim()
  if (!text) return { error: 'Escribe un nombre para la colección.' }
  if (text.length > LIST_NAME_MAX) return { error: `El nombre puede tener hasta ${LIST_NAME_MAX} caracteres.` }
  return { value: text }
}
