// Shared rules for Mi Espacio (profiles): preset avatars, the bio, and who is
// the owner of a profile. The website draws the avatars (src/lib/avatars.js);
// the server only knows their ids.

// Math shapes drawn in ink, then the illustrated drawings (pictures with a
// transparent background).
export const SHAPE_AVATAR_IDS = Object.freeze(['a01', 'a02', 'a03', 'a04', 'a05', 'a06', 'a07', 'a08', 'a09', 'a10', 'a11', 'a12'])
export const DRAWING_AVATAR_IDS = Object.freeze([
  'pinguino-compu', 'ajolote-matematico', 'de-hecho', 'gato-programador', 'hamster-rapido', 'gato-estresado',
  'gato-llorando', 'gato-dormido', 'mucha-tarea', 'ternurin-cansado', 'vaquita-enojada', 'gatito-batalla',
])
export const AVATAR_IDS = Object.freeze([...SHAPE_AVATAR_IDS, ...DRAWING_AVATAR_IDS])
// Background a person may choose for any avatar. Without one (null), each
// avatar keeps its own pastel fill.
export const AVATAR_COLORS = Object.freeze([
  'blanco', 'crema', 'amarillo', 'durazno', 'naranja', 'rosa', 'lila',
  'celeste', 'cielo', 'turquesa', 'menta', 'salvia', 'arena',
])
export const BIO_MAX = 160

// The saved avatar, or a stable one picked from the account id. The fallback
// only picks among the shapes, so accounts that never chose keep the avatar
// they always had.
export function avatarOf(user) {
  if (AVATAR_IDS.includes(user?.avatar)) return user.avatar
  const hex = String(user?._id ?? '').slice(-6)
  const n = Number.parseInt(hex || '0', 16)
  return SHAPE_AVATAR_IDS[(Number.isFinite(n) ? n : 0) % SHAPE_AVATAR_IDS.length]
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
  if (typeof value !== 'string') return { error: 'Escribe un nombre para la lista.' }
  const text = value.replace(/\s+/g, ' ').trim()
  if (!text) return { error: 'Escribe un nombre para la lista.' }
  if (text.length > LIST_NAME_MAX) return { error: `El nombre puede tener hasta ${LIST_NAME_MAX} caracteres.` }
  return { value: text }
}
