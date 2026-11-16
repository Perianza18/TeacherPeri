// Roles tal como se muestran en la interfaz. El servidor decide los permisos
// (server/src/lib/permissions.js); aquí solo se usa el rol para mostrar
// insignias y esconder botones que de todos modos el servidor rechazaría.

export const ROLES = ['user', 'editor', 'admin']

// Una sesión guardada antes del cambio de roles puede traer un valor antiguo
// hasta que /api/auth/me la actualiza; se traduce igual que en el servidor.
const LEGACY_ROLES = { usuario: 'user', moderador: 'user', editor_junior: 'editor', editor_senior: 'editor', teacherperi: 'admin' }

export function normalizeRole(role) {
  if (ROLES.includes(role)) return role
  return LEGACY_ROLES[role] ?? 'user'
}

const ROLE_LABELS = { editor: 'Editor', admin: 'Admin' }

// Nombre corto para la insignia, o null para `user` (que no lleva insignia).
export function roleLabel(role) {
  return ROLE_LABELS[normalizeRole(role)] ?? null
}

export function isAtLeast(role, minimum) {
  return ROLES.indexOf(normalizeRole(role)) >= ROLES.indexOf(minimum)
}

export function canModerate(role) {
  return isAtLeast(role, 'editor')
}
