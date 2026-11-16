# Run the site locally with real content

English · **[Español](es/LOCAL_MVP.md)**

The content lives in files in the repository, but the API reads MongoDB, not
those files. A dry run that reports `create:537` means none of the 537 records
are loaded yet. A standalone MongoDB allows the dry run but refuses `--apply`,
because the importer uses a transaction. Do not remove that protection.

## Local setup without touching your existing MongoDB

You need `mongod` installed and on your PATH (the usual MongoDB install on macOS
or Linux). From the repository root:

```sh
npm ci
npm run db:local:start
```

This starts a dedicated replica set, bound only to `127.0.0.1:27018`, with its
data in `.local/mongodb` inside the repository (ignored by Git). It does not
touch a MongoDB already running on `27017`. You can run it again: it checks the
running process before setting anything up. If another process uses `27018`, it
stops without changing it. Do not delete `.local/mongodb`; it is this project's
local database. The command uses a separate Node process instead of
`mongod --fork`, which MongoDB refuses on macOS. If it fails before creating
`mongod.log`, the startup error is saved in `.local/mongodb/startup.log` and shown
in the terminal.

In your private `.env`, use **the same address** for the API and the importer:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27018/teacherperi_dev?directConnection=true
MONGO_CONTENT_IMPORT_URI=mongodb://127.0.0.1:27018/teacherperi_dev?directConnection=true
```

Keep your `JWT_SECRET`, `PORT=4000`, `CLIENT_ORIGIN=http://localhost:5173` and
`VITE_API_URL=http://localhost:4000`. This database starts empty; accounts you
created in another local database stay there and are not copied.

```sh
npm run content:import -- --dry-run
CONTENT_IMPORT_CONFIRM=teacherperi_dev npm run content:import -- --apply
npm run content:import -- --dry-run
npm run content:check
```

The second dry run must report `create:0`, `promote:0` and `keep:537` for a fresh
import of the current content. `content:check` reads **MONGO_URI**, the database
the API uses, without writing. It must show `atomicImportSupported:true` and
`ommRoot:"published"`.

Restart `npm run server` and `npm run dev` after editing `.env` (in separate
terminals). Then open:

- http://localhost:5173/rutas/preparacion-para-la-omm
- http://localhost:4000/api/paths/preparacion-para-la-omm

The API address must answer with the Ruta. If the API works and the page does
not, check `VITE_API_URL` and restart Vite. If `content:check` sees content but
the API does not, restart the server: it may still use the old address.

The database process keeps running after the command ends. To stop it cleanly,
from the repository root run `mongod --shutdown --dbpath "$PWD/.local/mongodb"`
if your version supports it, or send SIGTERM to the PID shown in
`.local/mongodb/mongod.log`. Do not stop the service on `27017`. Run
`npm run db:local:start` again after restarting your computer.

For the live site, see [DEPLOYMENT.md](DEPLOYMENT.md) and the importer guide
[CONTENT_IMPORT.md](CONTENT_IMPORT.md). This local database must never be exposed
to the internet or used as production infrastructure.
