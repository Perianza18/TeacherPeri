# Development

English · **[Español](es/DEVELOPMENT.md)**

## Setup

You need Node 22.13 or newer (22, 24 or 26+; `.nvmrc` says 22.13.0), npm and
MongoDB.

```sh
npm ci
cp .env.example .env
# Make a secret and put it in JWT_SECRET inside .env:
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
npm run server     # API on http://localhost:4000
npm run dev        # website on http://localhost:5173 (in a second terminal)
```

The API starts with an empty database. To load the real content (Rutas, lessons,
problems), follow [LOCAL_MVP.md](LOCAL_MVP.md). In short:
`npm run db:local:start` starts a local MongoDB replica set on port 27018,
`npm run content:import` loads the content, and `npm run content:check` shows
what the API sees.

Never point your local `.env` at the live database.

### Settings (`.env`)

| Variable | What it is |
| --- | --- |
| `MONGO_URI` | The database the API uses |
| `JWT_SECRET` | Secret that signs sign-in tokens. Required |
| `PORT` | API port (4000) |
| `CLIENT_ORIGIN` | The website address the API accepts requests from (`http://localhost:5173`) |
| `VITE_API_URL` | The API address the website calls (`http://localhost:4000`). Public: never put a secret in a `VITE_*` variable |
| `TRUST_PROXY_HOPS` | Only in production behind a proxy (see [DEPLOYMENT.md](DEPLOYMENT.md)). Leave it unset locally |

## Checks before a pull request

```sh
npm run content:validate   # the official content files are consistent
npm run lint
npm run test:unit
npm run build
```

Database tests need MongoDB running as a replica set on your own computer and a
throwaway database named `teacherperi_test` (or `teacherperi_test_<suffix>`).
They erase that database when they finish:

```sh
MONGO_TEST_URI=mongodb://127.0.0.1:27017/teacherperi_test npm run test:integration
```

Browser tests (desktop and phone) use fake API answers, so they need no database:

```sh
npx playwright install chromium
npm run test:browser
```

GitHub Actions (`.github/workflows/ci.yml`) runs all of these on every push and
pull request, plus a real content import into a fresh database on Linux and macOS.

## Test lesson

`npm run dev` adds a page that is not in the live site: `/dev/teoria-prueba`.
It shows every lesson block, so you can check a change to the lesson page
without touching real content.

## Resetting a local database

`npm run db:reset:dev` **erases** the problems and folders of a local database
and fills it with old sample problems. You rarely need it: `content:import` is
the normal way to get content. It only runs with all three settings below, only
on a database on your own computer named `teacherperi_dev`, and refuses a
database that holds comments. Accounts are kept.

```sh
NODE_ENV=development MONGO_DEV_RESET_URI=mongodb://127.0.0.1:27017/teacherperi_dev RESET_DATABASE_CONFIRM=teacherperi_dev npm run db:reset:dev
```

## npm scripts

| Script | What it does |
| --- | --- |
| `dev`, `build`, `preview` | Website: dev server, production build, preview the build |
| `server`, `start` | API: with auto-reload, or plain (production) |
| `lint` | ESLint |
| `test`, `test:unit`, `test:integration`, `test:browser` | Tests (`test` runs unit and integration) |
| `content:validate` | Checks the content files without a database |
| `content:import` | Loads the official content into a database ([CONTENT_IMPORT.md](CONTENT_IMPORT.md)) |
| `content:revise-theory` | Publishes rewritten lessons ([CONTENT_IMPORT.md](CONTENT_IMPORT.md#revising-rewritten-theory-lessons)) |
| `content:check` | Shows what content the API's database has (read-only) |
| `users:set-role` | Changes one account's role ([ROLES.md](ROLES.md)) |
| `review` | Reviews proposals, exam folders and error reports ([SUBMISSIONS.md](SUBMISSIONS.md)) |
| `db:migrate:roles-users` | One-time migration for the three roles and exam folders ([SUBMISSIONS.md](SUBMISSIONS.md#migration)) |
| `atlas:<tool>:test`, `atlas:<tool>:prod` | Run `migrate`, `review`, `set-role`, `revise-theory` or `import` against Atlas using the private Atlas file ([below](#atlas-scripts)) |
| `db:local:start` | Starts a local MongoDB replica set ([LOCAL_MVP.md](LOCAL_MVP.md)) |
| `db:reset:dev` | **Erases** the problems and folders of a local `teacherperi_dev` database and fills it with old sample problems. Local only |
| `curriculum:preview:omm`, `curriculum:preview:omm-content` | Print the OMM Ruta and its content without a database |
| `db:apply:omm-curriculum`, `db:apply:omm-content-batch1`, `db:backfill:problem-categories` | Older one-time local migrations from before `content:import` |

Scripts that write to a database run as a dry run unless you pass `--apply` and
confirm the database name. See the safety rules in
[ARCHITECTURE.md](ARCHITECTURE.md#safety-rules-built-into-the-code).

## Atlas scripts

The `atlas:*` scripts run a guarded database script against one Atlas database
without typing its address. They read a private file that lives outside the
repository and OneDrive, `~/.config/teacherperi/atlas.env` (`chmod 600`), with
two lines:

```sh
ATLAS_TEST_URI=mongodb+srv://<user>:<password>@<cluster>/teacherperi?<options>
ATLAS_PROD_URI=mongodb+srv://<user>:<password>@<cluster>/teacherperi_prod?<options>
```

An older file with a single `ATLAS_URI=` line also works: the scripts point it at
the right database. The wrapper (`server/src/scripts/atlas.js`) refuses a string
whose database name does not match its target, never prints a string, and hands
it to the tool through the tool's own variable.

| Script | Tool |
| --- | --- |
| `atlas:migrate:test`, `atlas:migrate:prod` | `db:migrate:roles-users` |
| `atlas:review:test`, `atlas:review:prod` | `review` |
| `atlas:set-role:test`, `atlas:set-role:prod` | `users:set-role` |
| `atlas:revise-theory:test`, `atlas:revise-theory:prod` | `content:revise-theory` |
| `atlas:import:test`, `atlas:import:prod` | `content:import` |
| `atlas:sync-exams:test`, `atlas:sync-exams:prod` | `db:sync:exam-folders` (one exam per exam folder on Exámenes) |

Each one is a dry run (or read only) unless `--apply` follows `--`, for example
`npm run atlas:migrate:test -- --apply`. With `--apply` the wrapper confirms the
database name for the tool. Writes to `teacherperi_prod` need the owner's OK first.
