# Mi Espacio (perfiles)

**[English](../PROFILES.md)** · Español

Cada cuenta tiene un perfil en `/perfil/<usuario>`. «Mi Espacio» en el menú del
avatar abre el tuyo.

## Qué es público y qué es privado

La privacidad es fija; no hay ajustes. El **servidor** deja fuera los datos
privados de sus respuestas, así que nunca llegan al navegador de otra persona.

| Parte | Dueño | Cualquier otra persona |
| --- | --- | --- |
| @usuario, avatar, rol, descripción, seguidores, «En números» | ✓ | ✓ |
| Comentarios (los visibles, en problemas públicos) | ✓ | ✓ |
| Listas: listas públicas | ✓ | ✓ |
| Listas: listas privadas («Solo tú») | ✓ | – (404) |
| Insignias | ✓ | ✓ |
| Correo | ✓ | – |
| Actividad | ✓ | – (404) |
| Mis envíos (problemas propuestos y sugerencias de «Sugerir un cambio») | ✓ | – |

## La página

- **Izquierda:** la tarjeta del perfil (avatar, @usuario, rol, descripción,
  «N seguidores» y «N siguiendo», «Editar perfil» o «Seguir»/«Siguiendo», y el
  correo solo para el dueño), luego «En números»: problemas resueltos,
  comentarios, problemas propuestos (los publicados) e insignias.
- **Derecha:** pestañas (`?tab=` en la dirección). Dueño: Actividad,
  Comentarios, Listas, Mis envíos, Insignias. Visitantes: Comentarios, Listas,
  Insignias. Son pestañas reales: ←/→ avanzan (y dan la vuelta), Inicio y Fin
  saltan. Al hacer clic en seguidores o siguiendo se muestra esa lista
  (`?ver=seguidores` o `?ver=siguiendo`), sin pestaña marcada y con «Volver».
- **Editar perfil:** uno de 24 avatares prediseñados (sin fotos): 12 dibujos
  ilustrados y 12 figuras matemáticas. Uno de 13 colores de fondo claros para
  él (`AVATAR_COLORS` en `src/lib/avatars.js`), u «Original», el relleno
  propio del avatar. No hay fondos oscuros porque dejan un borde blanco
  alrededor de los dibujos. Y una descripción de hasta 160 caracteres. Las cuentas que nunca
  eligieron avatar tienen una figura fija, calculada de su id.

## Listas («Guardar en lista»)

- «Guardar en lista» está en cada página de problema, en la ventana del problema
  de la biblioteca y en cada lección. Muestra tus listas con casillas, y «Nueva
  lista». Sin sesión, abre el inicio de sesión.
- Hoy las listas guardan problemas y lecciones. Las publicaciones de
  Experiencias y otro contenido se agregarán cuando existan.
- Una lista nueva es privada salvo que marques «Pública». El dueño la renombra,
  la hace pública o privada y la borra desde la pestaña Listas. Una lista:
  `/perfil/<usuario>/listas/<id>`.
- Límites: 50 listas por persona, 500 elementos por lista, nombres de hasta 80
  caracteres. Solo se guarda contenido publicado; si algo deja de estar
  publicado, se oculta de la lista.

## «Lo resolví» e insignias

- «Lo resolví» en un problema lo marca como resuelto. Nada revisa la respuesta;
  es el registro del propio estudiante. Otro clic lo desmarca.
- Las insignias se calculan con lo que hiciste y se guardan cuando se lee tu
  perfil o tus insignias, así que la actividad anterior cuenta con su fecha real.
  Una insignia ganada nunca se pierde.

| Categoría | Niveles |
| --- | --- |
| Problemas resueltos («Lo resolví» en problemas publicados) | Primer problema 1 · Constancia 10 · Incansable 50 |
| Comentarios (visibles, en problemas publicados) | Primera palabra 1 · Conversador 10 · Voz de la comunidad 50 |
| Problemas aceptados (propuestas aprobadas) | Autor 1 · Autor frecuente 5 · Creador de problemas 20 |
| Sugerencias aplicadas («Aplicada» en Revisión) | Ojo atento 1 · Corrector 5 · Revisor de oro 20 |
| Rol | Editor (editores y admins) · Admin |

La pestaña Insignias muestra cada insignia ganada con su fecha, y el siguiente
nivel bloqueado de cada categoría con cuánto falta («Te faltan N»; los
visitantes leen «Le faltan N»). El conjunto está en
`server/src/lib/badgeRules.js`.

## Enlaces a un comentario

Comentarios y Actividad enlazan cada comentario a
`/entrenamiento/problemas/<id>#comentario-<idDelComentario>`. La página del
problema ahora muestra sus comentarios; baja hasta ese comentario y lo resalta
un momento (sin animación si se pidió menos movimiento). Si el comentario se
borró, la página abre en los comentarios.

## Código y API

- Páginas: `src/pages/PerfilPage.jsx`, `src/pages/UserListPage.jsx`; piezas en
  `src/components/profile/`. Avatares: `src/lib/avatars.js`, dibujos en
  `src/assets/avatars/` (WebP cuadrado de 256 px con fondo transparente).
- API: `server/src/routes/profiles.routes.js` (`/api/profiles`),
  `userLists.routes.js` (`/api/my-lists`), `solves.routes.js`
  (`/api/problems/:id/solved`) y `GET /api/flags/mine`. Ver
  [ARCHITECTURE.md](ARCHITECTURE.md#api).
- Modelos: `Follow`, `UserList`, `UserListItem`, `ProblemSolve`, `UserBadge`, y
  `bio`, `avatar` y `avatarColor` en `User`. **No hace falta migración:** los campos nuevos
  tienen valor por defecto y la API crea las colecciones e índices nuevos al
  arrancar.
- Pruebas: `server/src/__tests__/profiles.test.js`, `user-lists.test.js`,
  `badges.test.js`, `badge-rules.unit.test.js`, `profile-ui.unit.test.js` y
  `tests/browser/mi-espacio.spec.js`.

## Lo que falta

Comentarios en lecciones, guardar publicaciones de Experiencias, ajustes de
privacidad, subir fotos de avatar, avisos de nuevos seguidores, seguir una Ruta
y «continúa donde te quedaste».
