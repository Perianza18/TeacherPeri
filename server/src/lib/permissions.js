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
