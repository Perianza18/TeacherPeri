# Deployment

English · **[Español](es/DEPLOYMENT.md)**

The site is live. Every merge to `main` redeploys the website and the API
automatically.

| Part | Host | Address |
| --- | --- | --- |
| Website | Vercel (Hobby plan), project `teacherperi` | https://www.teacherperi.com (`teacherperi.com` and `teacherperi.vercel.app` redirect to it) |
| API | Render (free plan, US East), service `teacherperi-api` | https://teacherperi-api.onrender.com |
| Database | MongoDB Atlas (free M0 cluster), database `teacherperi_prod` | — |

The free Render plan sleeps when nobody uses it, so the first request after a
quiet period can take about a minute.

Vercel also builds a preview of every pull request; its link appears in the pull
request checks.

## Settings

Secrets live only in the hosts' dashboards, never in the repository, a pull
request or a `VITE_*` variable.

**Render (API):** `NODE_ENV=production`, `MONGO_URI` (a database user that can
only read and write `teacherperi_prod`), `JWT_SECRET`,
`CLIENT_ORIGIN=https://www.teacherperi.com` and `TRUST_PROXY_HOPS=3`.
Build with `npm ci`; start with `npm start`.

`TRUST_PROXY_HOPS` tells the API how many proxies sit in front of it, so the
request limits count each visitor and not the proxy. On Render it must be 3
(Cloudflare plus two Render relays). It was measured: with 3, the general
request limit counter (300 per 15 minutes on `/api`) drops by exactly one per
request from one computer, and a fake
`X-Forwarded-For` header does not reset it. With 1 or 2 the counter splits
across several addresses. If the hosting changes, measure again with the same
two checks (watch the `RateLimit-Remaining` response header).

**Vercel (website):** `VITE_API_URL=https://teacherperi-api.onrender.com` (no
trailing slash), build `npm run build`, output `dist`. `vercel.json` sends every
page address to `index.html`, so refreshing a deep link such as `/rutas/...`
works.

## Changing data on the live database

Only through the guarded scripts ([CONTENT.md](CONTENT.md),
[ROLES.md](ROLES.md), [SUBMISSIONS.md](SUBMISSIONS.md)): dry run first, then
apply with the database name confirmed. Try them on the test database
`teacherperi` before `teacherperi_prod`. Take a backup before a large change.
Never run `db:reset:dev` against Atlas.

## Sitemap

`npm run build` generates `dist/sitemap.xml` after Vite. Production builds
(`VERCEL_ENV=production`) read the public API and include problems, lessons,
exams, lists, resources and public Rutas, with modification dates when available.
All result pages are fetched and duplicate addresses are removed. Lesson-only
Rutas are omitted, matching the catalog.

Preview builds keep `public/sitemap.xml`. To test the full sitemap locally, run
`SITEMAP=1 npm run build`. `VITE_API_URL` selects the API and `SITE_URL` selects
the canonical domain; both default to production. If the API fails after two
attempts, the static sitemap remains and deployment continues. New content is
included on the next production deployment.

After deployment, check `https://www.teacherperi.com/sitemap.xml` and submit that
URL in Search Console. Tests are included in `npm run test:unit`.

## After a deploy

Open https://www.teacherperi.com on a computer and a phone and check: the
libraries load with their math, a Ruta opens from a direct link, an unknown
address shows «Página no encontrada», and the browser console has no errors.
