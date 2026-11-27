// ---------------------------------------------------------------------------
// Roles de TeacherPeri. Cada rol hereda los permisos del anterior, así que el
// ORDEN de esta lista importa: de menos a más poder.
//
//   user    -> leer, comentar, reportar, sugerir cambios, proponer problemas
//              y carpetas de examen, editar y borrar (suave) sus propios
//              problemas
//   editor  -> + Moderación (reportes), Revisión (propuestas, carpetas y
//              sugerencias), editar cualquier problema o página de teoría
//   admin   -> + nombrar editores, restaurar lo borrado y recibir avisos
//              cuando un editor cambia o revisa algo
//
// Los permisos se revisan SIEMPRE en el servidor; la interfaz solo los refleja.
// ---------------------------------------------------------------------------

export const ROLES = ['user', 'editor', 'admin']

export const DEFAULT_ROLE = 'user'

// Valores del sistema anterior (seis roles). Se siguen leyendo para que las
// cuentas existentes funcionen antes de migrarlas, pero nunca se asignan.
export const LEGACY_ROLES = Object.freeze({
  usuario: 'user',
  moderador: 'user',
  editor_junior: 'editor',
  editor_senior: 'editor',
  teacherperi: 'admin',
})

// Rol efectivo de una cuenta. Sin rol guardado, o con uno desconocido, cuenta
// como `user`; un valor antiguo se traduce a su rol nuevo.
export function roleOf(user) {
  const stored = user?.role
  if (ROLES.includes(stored)) return stored
  return LEGACY_ROLES[stored] ?? DEFAULT_ROLE
}

// Cada permiso indica el rol MÍNIMO que lo tiene; los roles de arriba lo
// heredan. Un permiso que no esté en esta tabla se niega siempre.
export const PERMISSIONS = Object.freeze({
  'comments:create': 'user',
  'comments:report': 'user',
  'suggestions:create': 'user', // «Sugerir un cambio» en un problema o una lección (va a Revisión)
  'content:report': 'user', // «Reportar» un problema o una lección inapropiados (va a Moderación)
  'problems:submit': 'user',
  'problems:edit-own': 'user', // queda en revisión; la versión aprobada sigue publicada
  'problems:delete-own': 'user', // borrado suave, recuperable por un admin
  'folders:propose': 'user', // subcarpetas de examen, en revisión
  'topics:propose': 'user', // temas nuevos dentro de un área, en revisión
  'comments:moderate': 'editor', // borrar comentarios ajenos con motivo; ver sus reportes
  'reports:moderate': 'editor', // ver y cerrar reportes de problemas y lecciones (Moderación)
  'suggestions:review': 'editor', // ver y cerrar sugerencias de cambio (Revisión)
  'content:edit-any': 'editor', // editar problemas y teoría de cualquiera (/api/editor)
  'submissions:review': 'editor', // aprobar o rechazar envíos (/api/review y npm run review)
  'folders:review': 'editor',
  'topics:review': 'editor',
  'content:restore': 'admin',
  'roles:assign-editor': 'admin', // /api/users
  'activity:notified': 'admin', // avisos e historial de cambios de editores (/api/editor/revisions)
})

function rank(role) {
  return ROLES.indexOf(role)
}

export function can(user, permission) {
  const minimum = PERMISSIONS[permission]
  if (!minimum || !user) return false
  return rank(roleOf(user)) >= rank(minimum)
}

// Quién puede dar qué rol desde el sitio: un admin nombra editores (o los
// regresa a `user`). Nadie nombra admins desde el sitio: eso solo lo hace el
// script protegido `npm run users:set-role`.
export function canAssignRole(actor, targetRole) {
  if (!['user', 'editor'].includes(targetRole)) return false
  return can(actor, 'roles:assign-editor')
}
