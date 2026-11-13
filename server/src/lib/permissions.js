// ---------------------------------------------------------------------------
// Roles de TeacherPeri. Cada rol hereda los permisos del anterior, así que el
// ORDEN de esta lista importa: de menos a más poder.
//
//   usuario        -> leer, comentar, listas, reportar
//   moderador      -> + borrar comentarios (con motivo)
//   editor_junior  -> + editar problemas y teoría (aún sin flujo de aprobación)
//   editor_senior  -> + aprobar publicaciones
//   admin          -> + dar permisos
//   teacherperi    -> + asignar cualquier rol, incluido admin
//
// Los permisos se revisan SIEMPRE en el servidor; la interfaz solo los refleja.
// ---------------------------------------------------------------------------

export const ROLES = ['usuario', 'moderador', 'editor_junior', 'editor_senior', 'admin', 'teacherperi']

export const DEFAULT_ROLE = 'usuario'

// Documentos creados antes de que existiera el campo `role` no lo tienen
// guardado; para efectos de permisos cuentan como `usuario`.
export function roleOf(user) {
  return ROLES.includes(user?.role) ? user.role : DEFAULT_ROLE
}

// Cada permiso indica el rol MÍNIMO que lo tiene; los roles de arriba lo
// heredan. Un permiso que no esté en esta tabla se niega siempre.
export const PERMISSIONS = Object.freeze({
  'comments:create': 'usuario',
  'comments:report': 'usuario',
  'lists:manage': 'usuario',
  'edits:suggest': 'usuario',
  'comments:moderate': 'moderador', // borrar comentarios ajenos, con motivo; ver reportes
  'content:edit': 'editor_junior',
  'content:publish': 'editor_senior',
  'roles:grant': 'admin',
  'roles:assign-any': 'teacherperi',
})

function rank(role) {
  return ROLES.indexOf(role)
}

export function can(user, permission) {
  const minimum = PERMISSIONS[permission]
  if (!minimum) return false
  return rank(roleOf(user)) >= rank(minimum)
}

// Quién puede dar qué rol: un admin asigna roles por debajo de admin;
// solo teacherperi puede nombrar admins (o a otro teacherperi).
export function canAssignRole(actor, targetRole) {
  if (!ROLES.includes(targetRole)) return false
  if (can(actor, 'roles:assign-any')) return true
  return can(actor, 'roles:grant') && rank(targetRole) < rank('admin')
}
