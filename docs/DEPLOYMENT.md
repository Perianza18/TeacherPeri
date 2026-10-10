# Final production configuration

The repository is prepared for a static Vite frontend and a separately hosted
Node API. No production account, data or deployment has been configured here.

1. **Database:** create an Atlas database/user with only the required application
   permissions, configure allowed network access, and store the URI privately as
   `MONGO_URI` on the API host. Do not put it in any `VITE_*` variable.
2. **Content:** use a separate private `MONGO_CONTENT_IMPORT_URI` pointing to that
   same explicit database. Follow [CONTENT_IMPORT.md](CONTENT_IMPORT.md): dry-run,
   review, exact name confirmation, atomic apply, then an unchanged dry-run.
3. **API:** host a persistent Node process. Install with `npm ci`, start with
   `npm start`; set `NODE_ENV=production`, `MONGO_URI`, a fresh random `JWT_SECRET`
   of at least 32 characters, `CLIENT_ORIGIN` to the exact HTTPS frontend origin,
   and the host's assigned `PORT`. Use TLS and configure the host's documented
   proxy behavior before changing Express `trust proxy`; never blindly trust all
   forwarding headers. The included CLI server is not a serverless adapter.
4. **Frontend:** build with `npm run build` and publish `dist/`. Set
   `VITE_API_URL=https://your-api-host.example` at build time (no trailing slash).
   Configure an SPA fallback to `/index.html` for frontend routes so refreshes of
   `/rutas/...` and `/entrenamiento/...` work. If a same-origin reverse proxy is
   configured, omit `VITE_API_URL`; production defaults to same-origin requests.
5. **Verify:** open every library and a contextual Path URL on desktop/mobile;
   register a test account, log in, mark a leaf complete and confirm its parent
   progress. Check CORS, expired sessions, unknown content, direct URL refreshes,
   rate limits and frontend→API connectivity. Remove only your temporary test
   account through a reviewed administrative process; never reset production.

No production credentials belong in commits, PR descriptions or browser bundles.
`db:reset:dev` is destructive and local-only. It is not part of deployment.
