# Architecture

English · **[Español](es/ARCHITECTURE.md)**

How the code is organized. For what each feature does, see
[FEATURES.md](FEATURES.md).

## The three parts

```
Browser ──► Website (React, on Vercel) ──► API (Express, on Render) ──► MongoDB Atlas
```

- **Website** (`src/`): a React 19 single-page app built with Vite and styled
  with Tailwind CSS v4. It stores no content of its own; every page asks the API.
- **API** (`server/src/`): an Express 5 server. It checks who you are (JWT),
  what you may do (roles), and reads and writes the database with Mongoose.
  Route handlers talk to Mongoose directly; there is no separate service layer,
  except the review logic in `server/src/lib/review/`.
- **Database:** MongoDB. On Atlas, `teacherperi_prod` is the live database and
  `teacherperi` is for testing. Locally you use your own database (see
  [DEVELOPMENT.md](DEVELOPMENT.md)). Official content is loaded by scripts, never
  typed in by hand (see [CONTENT.md](CONTENT.md)).

One `package.json` covers both the website and the API.

## Folder map

```
src/                        Website
  main.jsx, App.jsx         Entry point and every page route
  pages/                    One file per page (HomePage, Problemas, PathPage, LibraryDetailPage, ...)
  components/
    content/                Lesson blocks: Bloques.jsx (Definicion, Teorema, Ejemplo, Figura, ...),
                            PracticeBox.jsx (problem boxes), RichText.jsx
    theory/                 TheoryView.jsx: the lesson page
    training/               Library pieces: LibraryCollection, FolderFilter, TrainingHeader, ArticleText, ...
    comments/               Comment threads, comment box, delete and report reasons
    submissions/            «Proponer un problema» form, exam folder picker
    math/                   MathText: text with KaTeX math
    auth/, contact/         Sign-in window and contact form
    motion/, sections/      Animation helpers and the Contacto section
    Navbar, Footer, FlagButton, RoleBadge, PagePlaceholder
  context/                  The signed-in user (AuthContext, useAuth)
  hooks/                    Shared React hooks (useDialog)
  lib/                      api.js (apiFetch), theoryArticle.js (lesson markup), roles.js, rutaContext.js, ...
  dev/                      The test lesson for /dev/teoria-prueba (local development only)
  index.css                 Design tokens (--tp-*) and shared classes (.tp-card, .tp-button, ...)
server/src/                 API
  app.js                    Express setup, rate limits and the list of routes
  server.js                 Checks the settings, connects to MongoDB and starts listening
  routes/                   One file per resource (problems.routes.js, ...)
  models/                   Mongoose models
  middleware/auth.js        requireAuth and requirePermission
  lib/                      Shared logic: permissions.js, submissions.js, examFolders.js,
                            commentThread.js, moderation.js, review/
  data/                     Official content as code: lessons, problems, lists, exams, the OMM Ruta
  scripts/                  What the npm scripts run (import, revise theory, set role, review, ...)
  migrations/               The guarded database changes those scripts apply
  database-safety.js        Guards that stop scripts and tests from writing to the wrong database
  seed.js                   npm run db:reset:dev (local only)
  __tests__/                Unit tests (*.unit.test.js) and database tests (*.test.js)
tests/browser/              Playwright tests (desktop and phone)
public/                     Static files; public/figuras holds the lesson figures
docs/                       This documentation
```

## Website pages

All routes are in `src/App.jsx`. Every visible text is in Spanish.

| Address | Page |
| --- | --- |
| `/` | Inicio |
| `/rutas` | Ruta list, with search and a tag filter |
| `/rutas/...` | A Ruta page. The address follows the path you took, e.g. `/rutas/preparacion-para-la-omm/fundamentos-para-olimpiadas` |
| `/entrenamiento` | Redirects to `/entrenamiento/problemas` |
| `/entrenamiento/problemas`, `/entrenamiento/problemas/:id` | Problem library and problem page |
| `/entrenamiento/problemas/proponer` | Propose a problem |
| `/entrenamiento/teoria`, `/entrenamiento/teoria/:id` | Lesson library and lesson page |
| `/entrenamiento/examenes`, `/entrenamiento/examenes/:id` | Exam library and exam page |
| `/listas`, `/listas/:id` | Lists. Old `/entrenamiento/listas` links redirect here |
| `/mis-envios`, `/mis-envios/:id` | The user's proposals, and the page to edit one |
| `/panel`, `/panel/moderacion`, `/panel/problemas/:id/editar`, `/panel/teoria/:id/editar` | Team pages for editors and admins (see [ROLES.md](ROLES.md#where-the-team-pages-are)) |
| `/panel/revision`, `/panel/usuarios`, `/panel/cambios`, `/panel/cambios/:id` | Team pages for admins only |
| `/recursos` | External resources |
| `/contacto` | Contact form |
| `/experiencias`, `/equipo`, `/estudia-en-el-extranjero`, `/sobre-mi`, `/colaboradores` | «Próximamente» pages |
| `/dev/teoria-prueba` | Test lesson with every lesson block (only in `npm run dev`) |
| anything else | «Página no encontrada» |

A lesson or problem opened from a Ruta carries `?ruta=...` in the address. That
adds the «En la Ruta» strip and the previous and next step.

## API

Every route starts with `/api`. Reading content is public. Anything that writes
needs a signed-in user, and the server checks the role on every request (see
[ROLES.md](ROLES.md)).

| Route | Endpoints |
| --- | --- |
| `/api/auth` | `POST /signup`, `POST /login`, `GET /me` |
| `/api/problems` | `GET /` (search, filters, pages), `GET /facets`, `GET /:id` |
| `/api/problems/:problemId/comments` | `GET /`, `POST /`, `DELETE /:commentId`, `POST /:commentId/reports` |
| `/api/theory`, `/api/lists`, `/api/exams` | `GET /`, `GET /:id` |
| `/api/collections` | `GET /:slug`: the problem boxes of one lesson |
| `/api/paths` | `GET /` (also `?traversal=a/b` for a path through several Rutas), `GET /:slug`, `GET /:slug/progress`, `PUT /:slug/completion` |
| `/api/categories`, `/api/topics`, `/api/tags` | `GET /`: folders, áreas and tags |
| `/api/reports` | Editors and admins: `GET /`, `POST /comments/:commentId/dismiss` (with an optional `note`) |
| `/api/submissions` | Signed in: `GET /folders`, `POST /folders`, `POST /`, `GET /mine`, `GET /mine/:id`, `PUT /mine/:id`, `DELETE /mine/:id` |
| `/api/flags` | Signed in: `POST /`. Editors and admins: `GET /`, `POST /:id/status` |
| `/api/notifications` | Signed in: `GET /`, `POST /read` |
| `/api/editor` | Editors and admins: `GET`/`PUT /problems/:id`, `GET`/`PUT /theory/:id`. Admins: `GET /revisions`, `GET /revisions/:id` |
| `/api/review` | Admins: `GET /`, `GET /folders`, `GET /submissions/:id`, `POST /submissions/:id/approve`, `POST /submissions/:id/reject`, `POST /folders/:id/approve`, `POST /folders/:id/reject`, `POST /folders/:id/rename` |
| `/api/users` | Admins: `GET /` (`?q=` to search), `PUT /:id/role` (`user` or `editor` only) |
| `/api/contact` | Signed in: `POST /` |

Admins approve and reject proposals on `/panel/revision` (`/api/review`) or with
`npm run review`; both use `server/src/lib/review/service.js` (see
[SUBMISSIONS.md](SUBMISSIONS.md)).

**Limits:** each address may make 300 API requests per 15 minutes, and 20
failed sign-in attempts per 15 minutes. Both limits are off in tests.

**Sessions:** signing up or logging in returns a JWT that lasts 7 days. The
website keeps it in the browser (`localStorage`, key `teacherperi_auth`) and
sends it with each request through `apiFetch` in `src/lib/api.js`.
`requireAuth` reads the account and its role from the database on every
request, so a role change applies at once.

## Data model in short

Models live in `server/src/models/`.

- **Content is stored once and referenced.** A problem lives in `Problem`;
  `List`, `Exam`, lesson boxes (`ProblemCollection`) and Ruta steps (`Step`)
  point to it instead of copying it. Lessons are `Theory` records.
- **Rutas** are `Path` records. A Path holds either child Paths (through
  `PathReference`) or `Step`s, never both, and the same Path can be reused in
  several Rutas. `PathSection` adds headings such as the five ciclos.
  `RelatedPath` adds «También te puede interesar» links. Completion is stored
  per user and leaf Path (`PathCompletion`).
- **Folders** are `Category` records in a tree. Exam folders are Categories with
  `kind: exam` under «Exámenes». **Áreas** are `Topic`s; **tags** are `Tag`s.
- **Community:** `Comment` (replies up to 3 levels, soft delete), `Report`
  (a reported comment), `ProblemSubmission` (a proposal or an edit waiting for
  review), `Flag` («Reportar un error»), `Notification`, `ContentRevision` (a
  direct change by an editor or admin, with each field before and after),
  `ContactMessage`.
- **Users** (`User`) have one role: `user`, `editor` or `admin`.

## Safety rules built into the code

- Scripts that write to a database need their own address variable that names the
  database (never `MONGO_URI`), run as a dry run by default, and need the database
  name typed in a second variable to apply. They never print the address.
- `npm run db:reset:dev` erases a local database. It only accepts a database on
  your own computer named `teacherperi_dev` (or `teacherperi_dev_<suffix>`), and
  refuses one that holds comments.
- Database tests only run against a throwaway database on your own computer named
  `teacherperi_test` (or `teacherperi_test_<suffix>`).
