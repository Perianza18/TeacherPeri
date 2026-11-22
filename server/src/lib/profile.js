// Shared rules for Mi Espacio (profiles): preset avatars, the bio, and who is
// the owner of a profile. The website draws the avatars (src/lib/avatars.js);
// the server only knows their ids.

export const AVATAR_IDS = Object.freeze(['a01', 'a02', 'a03', 'a04', 'a05', 'a06', 'a07', 'a08', 'a09', 'a10', 'a11', 'a12'])
export const BIO_MAX = 160

// The saved avatar, or a stable one picked from the account id.
export function avatarOf(user) {
  if (AVATAR_IDS.includes(user?.avatar)) return user.avatar
  const hex = String(user?._id ?? '').slice(-6)
  const n = Number.parseInt(hex || '0', 16)
  return AVATAR_IDS[(Number.isFinite(n) ? n : 0) % AVATAR_IDS.length]
}

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
