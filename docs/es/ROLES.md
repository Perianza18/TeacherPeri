# Roles y permisos

**[English](../ROLES.md)** · Español

Cada cuenta tiene un rol. Cada rol puede hacer todo lo del rol anterior. El
servidor revisa el rol en cada petición; el sitio solo esconde botones.

| Rol | Puede | Estado |
| --- | --- | --- |
| **Usuario** (todos al registrarse) | Leer; comentar; reportar comentarios; reportar errores en problemas y lecciones; proponer problemas y carpetas de examen; editar y borrar sus propias propuestas | Hecho |
| **Editor** | + borrar cualquier comentario, con motivo; ver todos los reportes de comentarios y de errores; editar cualquier problema o lección | Parcial. Borrar comentarios funciona en el sitio. Los reportes solo se pueden leer con la API (`GET /api/reports`, `GET /api/flags`). Editar cualquier contenido todavía no tiene pantalla ni endpoint |
| **Admin** | + aprobar o rechazar propuestas y carpetas de examen; restaurar problemas borrados; nombrar editores; recibir aviso cuando un editor cambia algo | Parcial. Revisar y restaurar funcionan con `npm run review` ([SUBMISSIONS.md](SUBMISSIONS.md)). Los roles se cambian con `npm run users:set-role`. Todavía no hay pantallas de admin ni avisos sobre editores |

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

Todavía no hay pantalla para esto. Usa el script protegido: cambia el rol de una
cuenta, primero muestra el cambio, y solo escribe con `--apply` y el nombre de la
base escrito para confirmar. Roles válidos: `user`, `editor`, `admin`.

```sh
# Muestra el cambio sin escribir nada:
MONGO_ROLE_URI='<dirección que termina en /teacherperi>' npm run users:set-role -- --user <correo o usuario> --role editor
# Lo aplica:
MONGO_ROLE_URI='<dirección que termina en /teacherperi>' ROLE_CHANGE_CONFIRM=teacherperi npm run users:set-role -- --user <correo o usuario> --role editor --apply
```

Guarda la dirección solo en tu terminal; el script nunca la imprime. El rol nuevo
aplica de inmediato; la persona solo tiene que recargar el sitio.

Nadie puede crear un admin desde el sitio. Solo este script puede.
