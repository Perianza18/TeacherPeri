// Shared rules for Mi Espacio (profiles): preset avatars, the bio, and who is
// the owner of a profile. The website draws the avatars (src/lib/avatars.js);
// the server only knows their ids.

// Math shapes drawn in ink (only «π» is still offered, as the default; the
// others stay valid so old accounts load, and show the default), the free
// drawings, then the drawings bought with points (PREMIUM_AVATARS).
export const SHAPE_AVATAR_IDS = Object.freeze(['a01', 'a02', 'a03', 'a04', 'a05', 'a06', 'a07', 'a08', 'a09', 'a10', 'a11', 'a12'])
export const DEFAULT_AVATAR = 'a04'
export const DRAWING_AVATAR_IDS = Object.freeze([
  'pinguino-compu', 'ajolote-matematico', 'de-hecho', 'gato-programador', 'hamster-rapido', 'gato-estresado',
  'gato-llorando', 'gato-dormido', 'mucha-tarea', 'ternurin-cansado', 'vaquita-enojada', 'gatito-batalla',
])
// id → price in points, cheapest first. Bought once, kept for good.
export const PREMIUM_AVATARS = Object.freeze({
  'gato-de-traje': 30,
  'gato-pensando': 40,
  sabelotodo: 50,
  'gato-gamer': 75,
  'gatito-leon': 100,
})
export const PREMIUM_AVATAR_IDS = Object.freeze(Object.keys(PREMIUM_AVATARS))
export const AVATAR_IDS = Object.freeze([...SHAPE_AVATAR_IDS, ...DRAWING_AVATAR_IDS, ...PREMIUM_AVATAR_IDS])
// What «Editar perfil» offers.
export const CHOOSABLE_AVATAR_IDS = Object.freeze([DEFAULT_AVATAR, ...DRAWING_AVATAR_IDS, ...PREMIUM_AVATAR_IDS])

// Points spent on avatars, and what is left to spend. Spending never lowers
// the frame: frames follow the points earned (lib/levels.js).
export const spentPoints = (unlocked = []) => unlocked.reduce((sum, id) => sum + (PREMIUM_AVATARS[id] ?? 0), 0)
export const pointBalance = (points, unlocked = []) => Math.max(0, (Number.isFinite(points) ? points : 0) - spentPoints(unlocked))
export const ownsAvatar = (user, id) => !PREMIUM_AVATARS[id] || (user?.unlockedAvatars ?? []).includes(id)

// Background a person may choose for any avatar. Without one (null), each
// avatar keeps its own pastel fill.
export const AVATAR_COLORS = Object.freeze([
  'blanco', 'crema', 'amarillo', 'durazno', 'naranja', 'rosa', 'lila',
  'celeste', 'cielo', 'turquesa', 'menta', 'salvia', 'arena',
])
export const BIO_MAX = 160

// The saved avatar if it is still offered (and, for a bought one, owned);
// otherwise the default «π». Accounts that never chose, or chose a shape
// that is no longer offered, show the default.
export function avatarOf(user) {
  const id = user?.avatar
  return CHOOSABLE_AVATAR_IDS.includes(id) && (!PREMIUM_AVATARS[id] || !Array.isArray(user?.unlockedAvatars) || user.unlockedAvatars.includes(id)) ? id : DEFAULT_AVATAR
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
