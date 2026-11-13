// Roles tal como se muestran en la interfaz. El servidor decide los permisos
// (server/src/lib/permissions.js); aquí solo se usa el rol para mostrar
// insignias y esconder botones que de todos modos el servidor rechazaría.

export const ROLES = ['usuario', 'moderador', 'editor_junior', 'editor_senior', 'admin', 'teacherperi']

const ROLE_LABELS = {
  moderador: 'Moderador',
  editor_junior: 'Editor',
  editor_senior: 'Editor',
  admin: 'Admin',
  teacherperi: 'TeacherPeri',
}

// Nombre corto para la insignia, o null para `usuario` (que no lleva insignia).
export function roleLabel(role) {
  return ROLE_LABELS[role] ?? null
}

export function isAtLeast(role, minimum) {
  const index = ROLES.indexOf(role)
  return index !== -1 && index >= ROLES.indexOf(minimum)
}

export function canModerate(role) {
  return isAtLeast(role, 'moderador')
}
