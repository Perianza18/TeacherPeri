# Arquitectura

**[English](../ARCHITECTURE.md)** · Español

Cómo está organizado el código. Para saber qué hace cada función, ve
[FEATURES.md](FEATURES.md).

## Las tres partes

```
Navegador ──► Sitio (React, en Vercel) ──► API (Express, en Render) ──► MongoDB Atlas
```

- **Sitio** (`src/`): una aplicación de una sola página con React 19, construida
  con Vite y con estilos de Tailwind CSS v4. No guarda contenido propio: cada
  página se lo pide a la API.
- **API** (`server/src/`): un servidor Express 5. Revisa quién eres (JWT), qué
  puedes hacer (roles), y lee y escribe en la base de datos con Mongoose. Las
  rutas usan Mongoose directamente; no hay una capa de servicios aparte, salvo la
  lógica de revisión en `server/src/lib/review/`.
- **Base de datos:** MongoDB. En Atlas, `teacherperi_prod` es la base del sitio
  y `teacherperi` es la de pruebas. En tu computadora usas tu propia base (ver
  [DEVELOPMENT.md](DEVELOPMENT.md)). El contenido oficial se carga con scripts,
  nunca a mano (ver [CONTENT.md](CONTENT.md)).

Un solo `package.json` sirve para el sitio y la API.

## Mapa de carpetas

```
src/                        Sitio
  main.jsx, App.jsx         Punto de entrada y todas las rutas de páginas
  pages/                    Un archivo por página (HomePage, Problemas, PathPage, LibraryDetailPage, ...)
  components/
    content/                Bloques de lección: Bloques.jsx (Definicion, Teorema, Ejemplo, Figura, ...),
                            PracticeBox.jsx (cajas de problemas), RichText.jsx
    theory/                 TheoryView.jsx: la página de lección
    training/               Piezas de las bibliotecas: LibraryCollection, FolderFilter, TrainingHeader, ArticleText, ...
    comments/               Hilos de comentarios, caja para escribir, motivos para borrar y reportar
    submissions/            Formulario «Proponer un problema», selector de carpeta de examen
    math/                   MathText: texto con matemáticas en KaTeX
    auth/, contact/         Ventana de inicio de sesión y formulario de contacto
    motion/, sections/      Utilidades de animación y la sección de Contacto
    lessonEditor/             Barra del editor de lecciones, campo de texto con formato, buscador de problemas
    Navbar, Footer, PageFeedback («Sugerir un cambio» + «Reportar»), RoleBadge, PagePlaceholder
  context/                  El usuario con sesión iniciada (AuthContext, useAuth)
  hooks/                    Hooks de React compartidos (useDialog)
  lib/                      api.js (apiFetch), theoryArticle.js (marcado de lecciones), roles.js, rutaContext.js, ...
  dev/                      La lección de prueba de /dev/teoria-prueba (solo en desarrollo local)
  index.css                 Variables de diseño (--tp-*) y clases compartidas (.tp-card, .tp-button, ...)
server/src/                 API
  app.js                    Configuración de Express, límites de peticiones y lista de rutas
  server.js                 Revisa la configuración, se conecta a MongoDB y empieza a escuchar
  routes/                   Un archivo por recurso (problems.routes.js, ...)
  models/                   Modelos de Mongoose
  middleware/auth.js        requireAuth y requirePermission
  lib/                      Lógica compartida: permissions.js, submissions.js, examFolders.js,
                            commentThread.js, moderation.js, review/
  data/                     Contenido oficial como código: lecciones, problemas, listas, exámenes, la Ruta OMM
  scripts/                  Lo que corren los scripts de npm (importar, revisar teoría, cambiar rol, revisión, ...)
  migrations/               Los cambios protegidos a la base de datos que aplican esos scripts
  database-safety.js        Candados que impiden que scripts y pruebas escriban en la base equivocada
  seed.js                   npm run db:reset:dev (solo local)
  __tests__/                Pruebas unitarias (*.unit.test.js) y de base de datos (*.test.js)
tests/browser/              Pruebas de Playwright (escritorio y celular)
public/                     Archivos estáticos; public/figuras tiene las figuras de las lecciones
docs/                       Esta documentación
```

## Páginas del sitio

Todas las rutas están en `src/App.jsx`. Todo el texto visible está en español.

| Dirección | Página |
| --- | --- |
| `/` | Inicio |
| `/rutas` | Lista de Rutas, con búsqueda y filtro por etiqueta |
| `/rutas/...` | Una Ruta. La dirección sigue el camino que tomaste, p. ej. `/rutas/preparacion-para-la-omm/fundamentos-para-olimpiadas` |
| `/entrenamiento` | Redirige a `/entrenamiento/problemas` |
| `/entrenamiento/problemas`, `/entrenamiento/problemas/:id` | Biblioteca de problemas y página de un problema |
| `/entrenamiento/problemas/proponer` | Proponer un problema |
| `/entrenamiento/teoria`, `/entrenamiento/teoria/:id` | Biblioteca de lecciones y página de una lección |
| `/entrenamiento/examenes`, `/entrenamiento/examenes/:id` | Biblioteca de exámenes y página de un examen |
| `/entrenamiento/listas`, `/entrenamiento/listas/:id` | Pestaña «Listas»: listas de problemas de TeacherPeri, y la página de una lista |
| `/entrenamiento/recursos`, `/entrenamiento/recursos/:id` | Pestaña «Recursos externos»: enlaces a otras organizaciones (OMM, IMO, NRICH), y la página de un recurso |
| `/listas`, `/listas/:id` | Direcciones viejas: redirigen a `/entrenamiento/listas` |
| `/mis-envios`, `/mis-envios/:id` | Las propuestas del usuario y la página para editar una |
| `/perfil/:username`, `/perfil/:username/listas/:id` | Mi Espacio: un perfil (pestañas en `?tab=`, seguidores en `?ver=`) y una lista personal (ver [PROFILES.md](PROFILES.md)) |
| `/panel`, `/panel/moderacion`, `/panel/revision`, `/panel/problemas/:id/editar`, `/panel/teoria/:id/editar` | Páginas del equipo para editores y admins (ver [ROLES.md](ROLES.md#dónde-están-las-páginas-del-equipo)) |
| `/panel/usuarios`, `/panel/cambios`, `/panel/cambios/:id` | Páginas del equipo solo para admins |
| `/recursos` | Recursos externos |
| `/contacto` | Formulario de contacto |
| `/experiencias`, `/equipo`, `/estudia-en-el-extranjero`, `/sobre-mi`, `/colaboradores` | Páginas «Próximamente» |
| `/dev/teoria-prueba` | Lección de prueba con todos los bloques (solo con `npm run dev`) |
| cualquier otra | «Página no encontrada» |

Una lección o un problema abierto desde una Ruta lleva `?ruta=...` en la
dirección. Eso agrega la franja «En la Ruta» y el paso anterior y siguiente.

## API

Todas las rutas empiezan con `/api`. Leer contenido es público. Todo lo que
escribe necesita sesión iniciada, y el servidor revisa el rol en cada petición
(ver [ROLES.md](ROLES.md)).

| Ruta | Endpoints |
| --- | --- |
| `/api/auth` | `POST /signup`, `POST /login`, `GET /me` |
| `/api/problems` | `GET /` (búsqueda, filtros, páginas), `GET /facets`, `GET /:id`. En `/api/problems`, `/api/theory` y `/api/lists`: `?q=` ignora acentos y mayúsculas y también busca en nombres de etiquetas y temas; `?area=<nombre>` toma un área con todos sus subtemas (o el campo viejo `tema`); `?topics=` incluye subtemas |
| `/api/problems/:problemId/comments` | `GET /`, `POST /`, `DELETE /:commentId`, `POST /:commentId/reports` |
| `/api/theory`, `/api/lists`, `/api/exams` | `GET /`, `GET /:id`. `GET /api/lists?source=teacherperi` o `?source=external` devuelve solo las listas de TeacherPeri o solo los recursos externos |
| `/api/collections` | `GET /:slug`: las cajas de problemas de una lección. `GET /?codes=A,B`: los problemas de una caja `[[problems:…]]` |
| `/api/paths` | `GET /` (también `?traversal=a/b` para un camino a través de varias Rutas), `GET /:slug`, `GET /:slug/progress`, `PUT /:slug/completion` |
| `/api/categories`, `/api/topics`, `/api/tags` | `GET /`: carpetas, áreas y etiquetas. `GET /api/topics/counts?library=problems\|theory\|lists` cuenta el contenido por área y por tema |
| `/api/reports` | Editores y admins: `GET /`, `POST /comments/:commentId/dismiss` (con `note` opcional) |
| `/api/reports/content` | Con sesión: `POST /` («Reportar» un problema o una lección). Editores y admins: `GET /`, `POST /:id/status` |
| `/api/submissions` | Con sesión: `GET /folders`, `POST /folders`, `POST /`, `GET /mine`, `GET /mine/:id`, `PUT /mine/:id`, `DELETE /mine/:id` |
| `/api/flags` | Sugerencias. Con sesión: `POST /`, `GET /mine` (las tuyas). Editores y admins: `GET /`, `POST /:id/status` |
| `/api/profiles` | Público: `GET /:username` (`email` solo para el dueño), `GET /:username/followers`, `/following`, `/comments`, `/lists` (las privadas solo para el dueño), `/badges`. Solo el dueño: `GET /:username/activity` (404 para cualquier otra persona). Con sesión: `PUT /me` (`avatar`, `avatarColor`, `bio`), `PUT`/`DELETE /:username/follow` |
| `/api/my-lists` | Listas personales. Con sesión: `GET /containing?itemType=&item=`, `POST /`. Dueño: `PATCH /:id`, `DELETE /:id`, `POST /:id/items`, `DELETE /:id/items/:itemType/:item`. `GET /:id`: el dueño, o cualquiera si la lista es pública (si no, 404) |
| `/api/problems/:problemId/solved` | Con sesión: `GET`, `PUT`, `DELETE` («Lo resolví») |
| `/api/notifications` | Con sesión: `GET /`, `POST /read` |
| `/api/editor` | Editores y admins: `GET`/`PUT /problems/:id`, `GET`/`PUT /theory/:id`. Admins: `GET /revisions`, `GET /revisions/:id` |
| `/api/review` | Editores y admins: `GET /`, `GET /folders`, `GET /submissions/:id`, `POST /submissions/:id/approve`, `POST /submissions/:id/reject`, `POST /folders/:id/approve`, `POST /folders/:id/reject`, `POST /folders/:id/rename` |
| `/api/images` | Con sesión: `POST /` (el archivo de la imagen como cuerpo). Pública: `GET /:id` (en caché un año) |
| `/api/users` | Admins: `GET /` (`?q=` para buscar), `PUT /:id/role` (solo `user` o `editor`) |
| `/api/contact` | Con sesión: `POST /` |

Editores y admins aprueban y rechazan propuestas en `/panel/revision` (`/api/review`) o
con `npm run review`; los dos usan `server/src/lib/review/service.js` (ver
[SUBMISSIONS.md](SUBMISSIONS.md)).

**Límites:** cada dirección IP puede hacer 300 peticiones a la API cada 15
minutos, y 20 intentos fallidos de inicio de sesión cada 15 minutos. Ambos
límites se apagan en las pruebas.

**Sesiones:** al registrarte o iniciar sesión recibes un JWT que dura 7 días. El
sitio lo guarda en el navegador (`localStorage`, clave `teacherperi_auth`) y lo
manda en cada petición con `apiFetch` de `src/lib/api.js`. `requireAuth` lee la
cuenta y su rol de la base de datos en cada petición, así que un cambio de rol
aplica de inmediato.

## El modelo de datos en breve

Los modelos están en `server/src/models/`.

- **El contenido se guarda una vez y se referencia.** Un problema vive en
  `Problem`; `List`, `Exam`, las cajas de las lecciones (`ProblemCollection`) y
  los pasos de las Rutas (`Step`) apuntan a él en lugar de copiarlo. Las
  lecciones son registros `Theory`.
- **Las Rutas** son registros `Path`. Un Path contiene otros Paths (con
  `PathReference`) o `Step`s, nunca ambos, y el mismo Path puede usarse en varias
  Rutas. `PathSection` agrega encabezados como los cinco ciclos. `RelatedPath`
  agrega enlaces «También te puede interesar». El avance se guarda por usuario y
  por Path final (`PathCompletion`).
- **Las carpetas** son registros `Category` en forma de árbol. Las carpetas de
  examen son Categories con `kind: exam` dentro de «Exámenes»; cada una con
  problemas publicados tiene un `Exam` armado con ellos
  (`server/src/lib/examSync.js`). **Las áreas** son
  `Topic`s y **las etiquetas** son `Tag`s.
- **Comunidad:** `Comment` (respuestas hasta 3 niveles, borrado suave), `Report`
  (un comentario reportado), `ProblemSubmission` (una propuesta o una edición
  esperando revisión), `Flag` (una sugerencia, «Sugerir un cambio»),
  `ContentReport` (un problema o lección reportado con «Reportar»), `Notification`,
  `ProblemImage` (una imagen de problema, guardada como WebP en la base),
  `ContentRevision` (un cambio directo de un editor o admin, con cada campo antes
  y después, o una decisión tomada en Revisión), `ContactMessage`.
- **Los usuarios** (`User`) tienen un rol: `user`, `editor` o `admin`, además de
  un `avatar` prediseñado con su color de fondo (`avatarColor`) y una
  descripción corta (`bio`).
- **Mi Espacio:** `Follow` (quién sigue a quién), `UserList` y `UserListItem`
  (listas personales de problemas y lecciones), `ProblemSolve` («Lo resolví») y
  `UserBadge` (insignias ganadas, nunca se quitan). Ver [PROFILES.md](PROFILES.md).

## Reglas de seguridad dentro del código

- Los scripts que escriben en una base de datos necesitan su propia variable con
  la dirección, que debe nombrar la base (nunca `MONGO_URI`); corren como
  simulación (dry run) por defecto, y para aplicar piden escribir el nombre de la
  base en otra variable. Nunca imprimen la dirección.
- `npm run db:reset:dev` borra una base local. Solo acepta una base en tu propia
  computadora llamada `teacherperi_dev` (o `teacherperi_dev_<sufijo>`) y se niega
  si tiene comentarios.
- Las pruebas de base de datos solo corren contra una base desechable en tu
  computadora llamada `teacherperi_test` (o `teacherperi_test_<sufijo>`).
