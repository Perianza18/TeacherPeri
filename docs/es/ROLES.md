# Roles y permisos

**[English](../ROLES.md)** · Español

Cada cuenta tiene un rol. Cada rol puede hacer todo lo del rol anterior. El
servidor revisa el rol en cada petición; el sitio solo esconde botones.

| Rol | Puede | Estado |
| --- | --- | --- |
| **Usuario** (todos al registrarse) | Leer; comentar; reportar comentarios; «Sugerir un cambio» y «Reportar» en problemas y lecciones; proponer problemas y carpetas de examen; editar y borrar sus propias propuestas | Hecho |
| **Editor** | + borrar cualquier comentario, con motivo; atender todos los reportes (Moderación); aprobar o rechazar propuestas y carpetas de examen y cerrar sugerencias (Revisión); editar cualquier problema o lección | Hecho. «Panel del equipo» (`/panel`): Moderación y Revisión, y «Editar problema» y «Editar lección» en cada problema y lección. Ver [FEATURES.md](FEATURES.md#cuentas-y-roles) |
| **Admin** | + restaurar problemas borrados; nombrar editores; recibir aviso cuando un editor cambia o revisa algo | Hecho, salvo restaurar: Usuarios (`/panel/usuarios`), Cambios de editores (`/panel/cambios`) y un aviso por cada cambio o decisión de revisión de un editor. Restaurar problemas borrados sigue siendo solo `npm run review -- restore` ([SUBMISSIONS.md](SUBMISSIONS.md)) |

Insignias de rol: los comentarios muestran «Editor» o «Admin» junto al nombre de
usuario. Los usuarios normales no llevan insignia.

## Dónde está en el código

- `server/src/lib/permissions.js`: la lista de roles (`ROLES`) y la tabla de
  permisos (`PERMISSIONS`). Cada permiso dice el rol más bajo que lo tiene. Un
  permiso que no está en la tabla siempre se niega. `can(user, permiso)` da la
  respuesta.
- Las rutas usan `requireAuth` y luego `requirePermission('<permiso>')`, ambos en
  `server/src/middleware/auth.js`.
- `src/lib/roles.js` repite los roles en el sitio para mostrar u ocultar botones.
- El registro nunca acepta un rol. Las cuentas nuevas son `user`.

## Cuentas con un rol anterior

Antes había seis roles. Los valores viejos que sigan guardados en la base de datos
se traducen cada vez que se leen, así que esas cuentas siguen funcionando:

| Valor guardado | Se lee como |
| --- | --- |
| `usuario`, `moderador` | `user` |
| `editor_junior`, `editor_senior` | `editor` |
| `teacherperi` | `admin` |
| sin rol | `user` |

`npm run db:migrate:roles-users` reescribe los valores guardados una sola vez (ver
[SUBMISSIONS.md](SUBMISSIONS.md#migración)).

## Cambiar el rol de alguien

**En el sitio (admins):** `/panel/usuarios` («Usuarios» en «Panel del equipo»).
Busca la cuenta y usa «Nombrar editor» o «Quitar rol de editor». Un admin también
puede pasar a otro admin a Editor, pero nunca a la última cuenta admin. El servidor
revisa todo esto (`PUT /api/users/:id/role`); nadie se vuelve admin desde el sitio.

**Desde una terminal:** usa el script protegido: cambia el rol de una
cuenta, primero muestra el cambio, y solo escribe con `--apply` y el nombre de la
base escrito para confirmar. Roles válidos: `user`, `editor`, `admin`.

```sh
# Muestra el cambio sin escribir nada:
MONGO_ROLE_URI='<dirección que termina en /teacherperi>' npm run users:set-role -- --user <correo o usuario> --role editor
# Lo aplica:
MONGO_ROLE_URI='<dirección que termina en /teacherperi>' ROLE_CHANGE_CONFIRM=teacherperi npm run users:set-role -- --user <correo o usuario> --role editor --apply
```

Guarda la dirección solo en tu terminal; el script nunca la imprime.
Con el archivo privado de Atlas (ver [DEVELOPMENT.md](DEVELOPMENT.md#scripts-de-atlas)),
`npm run atlas:set-role:test -- --user <correo o usuario> --role editor` hace lo
mismo sin escribir la dirección (`atlas:set-role:prod` para el sitio; agrega
`--apply` para escribir). El rol nuevo
aplica de inmediato; la persona solo tiene que recargar el sitio.

Nadie puede crear un admin desde el sitio. Solo este script puede.

## Dónde están las páginas del equipo

| Página | Quién | Qué |
| --- | --- | --- |
| `/panel` | Editor, Admin | Inicio («Panel del equipo» en el menú del avatar) |
| `/panel/moderacion` | Editor, Admin | Reportes de contenido inapropiado: comentarios, problemas y lecciones |
| `/panel/problemas/:id/editar`, `/panel/teoria/:id/editar` | Editor, Admin | Editar un problema o una lección; se publica al guardar |
| `/panel/revision` | Editor, Admin | Problemas propuestos, cambios a problemas, carpetas de examen y sugerencias en problemas y lecciones |
| `/panel/usuarios` | Admin | Nombrar o quitar editores |
| `/panel/cambios`, `/panel/cambios/:id` | Admin | Cada cambio de un editor, con el antes y el después, y cada decisión tomada en Revisión |
