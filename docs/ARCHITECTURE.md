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

There are no frontend routes for Paths, Threads, or Mi Espacio. `/problemas` and `/materiales` are not current routes. Training libraries have stable nested URLs; the legacy Problem browser still keeps its selected modal, filters, and folder position in component state. The intended primary navigation in PRODUCT.md has not yet been applied.

## Current API and persistence

| API | Current responsibility |
| --- | --- |
| `POST /api/auth/signup`, `POST /api/auth/login` | Registration and authentication |
| `GET /api/categories`, `GET /api/topics`, `GET /api/tags` | Public folder and controlled-metadata listings |
| `GET /api/problems`, `GET /api/problems/:id` | Public Problem listing/detail; query parameters opt into server-side discovery pagination |
| `GET /api/theory`, `GET /api/theory/:id` | Published Theory listing/detail |
| `GET /api/lists`, `GET /api/lists/:id` | Published externally authored List listing/detail |
| `GET /api/exams`, `GET /api/exams/:id` | Published Exam listing/detail with ordered Problem references |
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

All have timestamps. These are the only implemented domain models; future systems in PRODUCT.md do not yet have storage or APIs. Existing references are not a complete integrity layer: MongoDB does not automatically enforce referenced-record existence or hierarchy acyclicity.

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

## Future architectural constraints

### Folders, Paths, and stable identity

Categories organize material; Paths guide learners through it. A single-parent Category tree cannot stand in for a reusable Path graph. A future Path may have multiple parents and must remain acyclic, with ordered children **or** ordered Steps. A Step references content rather than owning duplicate copies.

Content and Paths need stable object identity across references, editorial changes, bookmarks, completion, and activity. Do not regenerate persisted object identities as an ordinary update mechanism. Completion is keyed conceptually by User ↔ Path; unique descendant leaves count once per ancestor. Preserve historical completion and future versioning expectations without choosing a final schema in this phase.

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
