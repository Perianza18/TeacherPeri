# TeacherPeri architecture

This document separates the **implemented application** from **future architectural constraints**. Product requirements live in [PRODUCT.md](PRODUCT.md); migration context and sequencing live in [MIGRATION.md](MIGRATION.md) and [ROADMAP.md](ROADMAP.md). Future constraints below are not implemented models or finalized database schemas.

## Current stack and boundaries

One root npm package and lockfile manage an ECMAScript-module application:

- React with Vite, React Router, and Tailwind CSS in `src/`.
- Framer Motion and shader/visual components for presentation.
- Express in `server/src/`, with MongoDB accessed through Mongoose.
- bcryptjs and JSON Web Tokens for authentication.
- KaTeX for mathematical statements.
- ESLint for lint and Vitest/Supertest for backend tests.

`src/main.jsx` mounts React. `src/App.jsx` defines BrowserRouter routes and wraps them in the shared authentication provider. Pages usually render their own Navbar. `src/lib/api.js` provides `apiFetch`, JSON body/response handling, bearer-token headers, and errors with HTTP status. `VITE_API_URL` selects the backend origin.

`server/src/app.js` configures Express, CORS, JSON parsing, rate limits, and routes without listening or connecting to MongoDB. `server/src/server.js` checks runtime environment, connects the database, and starts listening. Route handlers currently access Mongoose directly; there is no separate service/controller layer.

See the root [README](../README.md), [package.json](../package.json), and [.env.example](../.env.example) for supported runtime, commands, and environment setup.

## Current frontend routes

| Route | Implemented page |
| --- | --- |
| `/` | TeacherPeri introduction and home sections |
| `/rutas` | Public published-Path discovery with text search |
| `/rutas/:slug` | Standalone public Path page |
| `/rutas/:parent/.../:slug` | Contextual public Path traversal with validated breadcrumbs |
| `/entrenamiento` | Redirects to the public Problemas library |
| `/entrenamiento/problemas`, `/entrenamiento/problemas/:id` | Legacy Problem browser and stable public Problem detail URL |
| `/entrenamiento/teoria`, `/entrenamiento/teoria/:id` | Published Theory library and detail URL |
| `/entrenamiento/listas`, `/entrenamiento/listas/:id` | Published List library and detail URL |
| `/entrenamiento/examenes`, `/entrenamiento/examenes/:id` | Published Exam library and detail URL |
| `/recursos` | Static external-resource directory |
| `/experiencias` | Empty blog-listing scaffold |
| `/estudia-en-el-extranjero` | Static university guidance page |
| `/contacto` | Authenticated contact form |
| `/sobre-mi` | Personal presentation, with placeholder material |
| `/colaboradores` | Placeholder |

There are no frontend routes for Threads or Mi Espacio. `/problemas` and `/materiales` are not current routes. Training libraries have stable nested URLs; the legacy Problem browser still keeps its selected modal, filters, and folder position in component state. The intended primary navigation in PRODUCT.md has not yet been applied beyond the Rutas link.

## Current API and persistence

| API | Current responsibility |
| --- | --- |
| `POST /api/auth/signup`, `POST /api/auth/login` | Registration and authentication |
| `GET /api/categories`, `GET /api/topics`, `GET /api/tags` | Public folder and controlled-metadata listings |
| `GET /api/problems`, `GET /api/problems/:id` | Public Problem listing/detail; query parameters opt into server-side discovery pagination |
| `GET /api/theory`, `GET /api/theory/:id` | Published Theory listing/detail |
| `GET /api/lists`, `GET /api/lists/:id` | Published externally authored List listing/detail |
| `GET /api/exams`, `GET /api/exams/:id` | Published Exam listing/detail with ordered Problem references |
| `GET /api/paths`, `GET /api/paths/:slug` | Public discovery and standalone detail for structurally valid published Paths |
| `GET /api/paths?traversal=a/b` | Validated contextual Path traversal and breadcrumbs without reserving a Path slug |
| `GET /api/paths/:slug/progress` | Authenticated recursively derived Path progress |
| `PUT /api/paths/:slug/completion` | Authenticated leaf-Path completion toggle/set |
| `GET /api/problems/:problemId/comments` | Public embedded comments |
| `POST /api/problems/:problemId/comments` | Authenticated comment creation |
| `DELETE /api/problems/:problemId/comments/:commentId` | Author-only permanent comment deletion, retained legacy behavior |
| `POST /api/contact` | Authenticated private contact submission |

Existing Mongoose models are:

| Model | Current data |
| --- | --- |
| `User` | Username, email, password hash |
| `Category` | Folder name and nullable self-referencing parent |
| `Problem` | Legacy readable code/title/statement and Category reference, plus additive multi-folder, Topic, Tag, attribution, canonical three-level difficulty, and lifecycle fields |
| `Topic` | Curated self-referencing mathematical concept hierarchy with slug and cycle prevention |
| `Tag` | Centrally controlled flat name/slug/label descriptor |
| `Theory` | Native mathematical article with summary, rich text/LaTex source, level, shared metadata, folders, and lifecycle |
| `List` | Attributed external-resource record with source/PDF links, optional level, shared metadata, folders, and lifecycle |
| `Exam` | Competition/year/round metadata and ordered references to existing Problems |
| `Comment` | Problem reference, author reference, flat text body |
| `ContactMessage` | Author reference, profile category, contact reason, message |
| `Path` | Standalone slugged guide with controlled Tags, optional descriptive level, and lifecycle |
| `PathReference` | Ordered parent-to-child Path reference in an acyclic reusable graph |
| `RelatedPath` | Non-structural typed Path recommendation reference |
| `PathSection` | Parent-owned presentation heading for grouping Path references |
| `Step` | Ordered leaf-owned instruction with typed TeacherPeri references and external resources |
| `PathCompletion` | Unique User-to-leaf-Path completion record |

All have timestamps. Existing references are not a complete integrity layer: MongoDB does not automatically enforce referenced-record existence or hierarchy acyclicity, so Path and Step model validation explicitly protects their MVP invariants.

## Authentication foundation

Signup hashes passwords with bcrypt; login/signup issue seven-day JWTs with the user ID in `sub`. The client stores the token and returned account data in localStorage under `teacherperi_auth`. `AuthProvider` exposes session state and a global authentication modal. The problem modal also has an inline authentication form.

`requireAuth` verifies bearer-token signature/expiry and attaches the user ID to the request. It does not currently check account existence/status, implement roles, or provide token revocation. There is no refresh, password-recovery, email-verification, or session-validation endpoint. Logout clears the client's stored session. Session-expiry handling is not fully centralized.

The current public comment response projects username and author ID, not private email or password hash. Contact submissions have no public listing endpoint. Public data projections must remain explicit as identity features expand.

## Reusable folders and Problems

`Category.parent` represents a single-parent folder tree and rejects self-referential/cyclic writes. `src/pages/Problemas.jsx` rebuilds that tree, computes descendants/counts, and offers folders and breadcrumbs. The legacy `Problem.category` is retained only for migration/current-UI compatibility; new TeacherPeri content uses `Problem.categories` for multiple curated placements without copied Problems. The guarded `db:backfill:problem-categories` utility copies legacy memberships idempotently on an explicitly confirmed local development database; it never resets or deletes records. The legacy field should be retired only after its consumers and all persisted records have migrated.

Topics, Categories, and Tags remain separate persistence concepts: a Topic says what mathematics a record concerns, a Category says where a visitor browses to it, and a Tag is a controlled flat descriptor for filtering/search/discovery. Their references are intentionally many-to-many where content reuse requires it; none is a substitute for the others.

The same component contains problem loading, filters, cards, a problem modal, KaTeX rendering for inline/display mathematics, authentication UI, comments, and animations. This working implementation is valuable but combines many responsibilities; extract reusable parts incrementally when a task requires it.

The legacy Problem view still loads all Problems and Categories and filters in the browser. New library endpoints use server-side query filters and pagination; the new route-backed Theory, List, and Exam views use those endpoints and provide folder navigation plus local text search. A cross-library search endpoint/UI is still future work.

- OR within a selected metadata dimension; AND between dimensions.
- Year, topic, contest type, and category filters.
- A category selection includes its descendants.
- Any active filter shows matching results across the library, independent of the browsed folder.
- Hardcoded metadata options; no text search or pagination.

These are present behaviors to preserve until explicitly replaced, not the final search contract. Difficulty/success values in the seed are illustrative estimates and must not be treated as measured learning analytics.

## Path engine

Categories organize material; Paths guide learners through it. The Phase 3 engine uses independent `Path` documents connected by ordered `PathReference` documents, never a `parentPath` field. A child Path can be referenced by multiple parents while preserving one stable identity. `PathReference` rejects self-references, duplicate parent/child edges, duplicate per-parent positions, Paths with Steps, and indirect cycles. `Step` rejects non-leaf ownership and duplicate positions, so a Path contains ordered child Paths or ordered Steps, never both.

Published Path discovery/detail only exposes structurally valid published Paths. Traversal URLs are contextual: `/rutas/a/b` is valid only when the stored reference `a → b` exists, and the API returns breadcrumbs for that exact chain. Standalone URLs have no fabricated parent breadcrumb. A Step stores typed identity references to existing Problem, Theory, List, or Exam records. Public rendering resolves only publicly visible targets; retained references to draft or archived content render as unavailable without copying or leaking the target content.

`Path.tags` reuses the controlled Tag system and supports public Path discovery filtering; tags are descriptive and never alter structural behavior. `RelatedPath` is a separate recommendation-only relation with controlled prerequisite, deeper, and related labels. It is excluded from structural traversal, breadcrumbs, ordering, and progress. `PathReference.order` is the canonical order of every structural child. `PathSection` is optional parent presentation metadata: it annotates positions in that sequence with headings without reordering any child, and the public API returns an ordered presentation stream. A missing or mismatched section falls back to an unsectioned child so presentation metadata cannot hide a valid structural reference. Sections have no identity outside the page and do not affect the graph. `Path.level` is optional `introductorio`, `omm`, or `avanzado` metadata and is descriptive only. None creates a separate Path engine or nesting limit.

`PathCompletion` is unique by User and Path. Only a published leaf may be manually completed. Server-side progress traverses the published graph with visited sets, gathers unique descendant leaves, and counts each once; parent progress is descriptive and cannot lock content. Completion is reused across every traversal that reaches the same leaf. Following, saving, dashboard views, badges, and Path versioning are deliberately not part of this implementation.

### Shared content and metadata

Use references to reuse one stored object across Paths and discussions. Different libraries may need different material structures, but share consistent identity, metadata/tagging, discovery, and reference conventions. Initial content organization is one canonical folder placement plus multiple controlled tags. Tags complement folders.

Define common metadata and reference contracts before extending each library independently. Topics should be a curated acyclic hierarchy of mathematical concepts; Tags should be centrally controlled flat descriptors. Content may have multiple Category references for distinct curated navigation views without duplication. Official library records need draft/published/archived visibility semantics, with archived records retaining their identities for references. No universal content collection or final polymorphic-reference schema is prescribed here. Experiences are referenceable narrative content; Thread attachments are separate uploads, not references to existing content.

### Public access, persistence, and authorization

Browsing and searching remain available without login. Completion, followed routes, bookmarks, personal workspace data, and participation require a user session. Progress is descriptive; no prerequisite locks or separate University Path engine should be introduced.

Future authorization must distinguish users, content creators, moderators, and admins on the server. Publishing official educational material and moderating discussion are different powers. Role badges alone cannot authorize actions. Mi Espacio is private; public identity must not expose account information or imply public social-profile pages.

### Community history

Future Threads must retain appropriate edit/deletion/moderation history, including answer-status locks, under a defined retention/access policy. User-facing removal must not erase moderation-relevant history. Preserve original identity and relationships during any eventual comment transition.

**Current comment deletion is still a permanent database delete.** Foundation work does not replace that endpoint, remove the Comment model, or migrate comments to Threads. This discrepancy is documented migration debt, not a pattern to copy into new community systems.

## Development, tests, and delivery

Frontend and backend are separate development processes. Generated frontend output belongs in `dist/` and should be rebuilt from source, not used as architectural evidence for current source behavior.

Backend integration tests use Vitest and Supertest against a disposable loopback MongoDB database named `teacherperi_test` or `teacherperi_test_<suffix>`. Cleanup verifies the connected target before deletion. Separate database-safety unit tests do not connect to MongoDB. Test cleanup and development resets are destructive operations and require verified targets plus runtime guards; neither may borrow an application database through a silent fallback.

The development reset requires an explicit `MONGO_DEV_RESET_URI`, development mode, a loopback target named `teacherperi_dev` or `teacherperi_dev_<suffix>`, and confirmation of the exact database name. It refuses a target containing comments. This reset is not a migration. See README for the exact guarded commands and CI configuration.

Lint and a frontend build provide the non-database baseline. Integration tests cover auth, categories, problems, comments, and contact; there are no frontend/browser interaction tests yet. Rate limits are disabled under test, so integration results do not establish production rate-limit behavior. Future tests should protect real domain invariants and migration safety as those systems are introduced.
