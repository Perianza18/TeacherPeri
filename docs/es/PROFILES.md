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
| Guardados: colecciones públicas | ✓ | ✓ |
| Guardados: colecciones privadas («Solo tú») | ✓ | – (404) |
| «Problemas resueltos» (cuáles) | ✓ | – (404; los visitantes solo ven el número) |
| Insignias | ✓ | ✓ |
| Correo | ✓ | – |
| Actividad | ✓ | – (404) |
| Mis envíos (problemas propuestos y sugerencias de «Sugerir un cambio») | ✓ | – |

## La página

- **Izquierda:** la tarjeta del perfil (avatar, @usuario, rol, descripción,
  «N seguidores» y «N siguiendo», «Editar perfil» o «Seguir»/«Siguiendo», y el
  correo solo para el dueño), luego «Buscar usuarios», luego «En números»:
  problemas resueltos, comentarios, problemas propuestos (los publicados) e
  insignias. Para el dueño, el número de resueltos es un botón que abre
  «Problemas resueltos».
- **Derecha:** pestañas (`?tab=` en la dirección). Dueño: Actividad,
  Comentarios, Guardados, Mis envíos, Insignias. Visitantes: Comentarios,
  Guardados, Insignias. Los enlaces viejos con `?tab=listas` abren Guardados. Son pestañas reales: ←/→ avanzan (y dan la vuelta), Inicio y Fin
  saltan. Al hacer clic en seguidores o siguiendo se muestra esa lista
  (`?ver=seguidores` o `?ver=siguiendo`), sin pestaña marcada y con «Volver».
  Lo mismo pasa con «Problemas resueltos» (`?ver=resueltos`, solo el dueño) y
  con los resultados de búsqueda (`?buscar=`).
- **Editar perfil:** uno de 24 avatares prediseñados (sin fotos): 12 dibujos
  ilustrados y 12 figuras matemáticas. Uno de 13 colores de fondo claros para
  él (`AVATAR_COLORS` en `src/lib/avatars.js`), u «Original», el relleno
  propio del avatar. No hay fondos oscuros porque dejan un borde blanco
  alrededor de los dibujos. Y una descripción de hasta 160 caracteres. Las cuentas que nunca
  eligieron avatar tienen una figura fija, calculada de su id.

## Guardados (colecciones)

«Listas» es el nombre de la página Listas de Entrenamiento, así que el perfil y
el flujo de guardar nunca usan esa palabra: la pestaña es «Guardados» y cada
grupo con nombre es una «colección». En el código siguen siendo listas
personales (`UserList`, `UserListItem`, `/api/my-lists`).

- «Guardar» está en cada página de problema, en la ventana del problema de la
  biblioteca y en cada lección. Abre «Guardar en una colección»: tus colecciones
  con casillas, y «Nueva colección». Sin sesión, abre el inicio de sesión.
- Hoy las colecciones guardan problemas y lecciones. Las publicaciones de
  Experiencias todavía no tienen «Guardar»; usarán el mismo botón cuando se
  puedan guardar.
- Una colección nueva es privada salvo que marques «Pública». El dueño la
  renombra, la hace pública o privada y la borra desde la pestaña Guardados.
  Una colección: `/perfil/<usuario>/colecciones/<id>` (los enlaces viejos
  `/perfil/<usuario>/listas/<id>` redirigen ahí).
- Límites: 50 colecciones por persona, 500 elementos por colección, nombres de
  hasta 80 caracteres. Solo se guarda contenido publicado; si algo deja de
  estar publicado, se oculta de la colección.

## Problemas resueltos

- Solo el dueño la abre: el número de resueltos en «En números» es un botón
  (también con teclado). Los visitantes ven el número sin enlace, y la API
  responde 404 a cualquiera que no sea el dueño.
- Filas: el enunciado (sin título), la píldora del área y la fecha en que se
  resolvió, del más reciente al más viejo, cada una con enlace al problema.
  Arriba, botones para filtrar por área. Solo aparecen problemas publicados,
  los mismos que cuenta el número.

## Buscar usuarios

- Un buscador en todos los perfiles, entre la tarjeta del perfil y «En
  números». Escribe parte de un usuario (desde el inicio, sin importar
  mayúsculas; la «@» inicial se ignora). Busca desde 2 caracteres, 300 ms
  después de que dejas de escribir.
- Hasta 20 resultados en la columna derecha, con las mismas filas que los
  seguidores (avatar, @usuario, rol, «Ver perfil») y «Volver». Sin
  coincidencias: «No encontramos a nadie con ese usuario.»
- La API (`GET /api/profiles?q=`) solo devuelve usuario, avatar y rol, nunca el
  correo. Permite 60 búsquedas por minuto desde una misma dirección.

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
- API: `server/src/routes/profiles.routes.js` (`/api/profiles`, con la
  búsqueda y `/:username/solved`),
  `userLists.routes.js` (`/api/my-lists`), `solves.routes.js`
  (`/api/problems/:id/solved`) y `GET /api/flags/mine`. Ver
  [ARCHITECTURE.md](ARCHITECTURE.md#api).
- Modelos: `Follow`, `UserList`, `UserListItem`, `ProblemSolve`, `UserBadge`, y
  `bio`, `avatar` y `avatarColor` en `User`. **No hace falta migración:** los campos nuevos
  tienen valor por defecto y la API crea las colecciones e índices nuevos al
  arrancar.
- Pruebas: `server/src/__tests__/profiles.test.js`, `profile-solved-search.test.js`,
  `no-lista-text.unit.test.js`, `user-lists.test.js`,
  `badges.test.js`, `badge-rules.unit.test.js`, `profile-ui.unit.test.js` y
  `tests/browser/mi-espacio.spec.js`.

## Lo que falta

Comentarios en lecciones, guardar publicaciones de Experiencias, ajustes de
privacidad, subir fotos de avatar, avisos de nuevos seguidores, seguir una Ruta
y «continúa donde te quedaste».
