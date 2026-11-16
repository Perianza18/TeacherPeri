# Correr el sitio en tu computadora con el contenido real

**[English](../LOCAL_MVP.md)** · Español

El contenido vive en archivos del repositorio, pero la API lee MongoDB, no esos
archivos. Una simulación que reporta `create:537` significa que todavía no se ha
cargado ninguno de los 537 registros. Un MongoDB standalone permite la
simulación, pero rechaza `--apply`, porque el importador usa una transacción. No
quites esa protección.

## Preparación local sin cambiar tu MongoDB actual

Necesitas `mongod` instalado y en tu PATH (la instalación normal de MongoDB en
macOS o Linux). Desde la raíz del repositorio:

```sh
npm ci
npm run db:local:start
```

Esto inicia un replica set dedicado, enlazado solo a `127.0.0.1:27018`, con sus
datos en `.local/mongodb` dentro del repositorio (Git lo ignora). No toca un
MongoDB que ya esté corriendo en `27017`. Puedes repetirlo: revisa el proceso
antes de configurar nada. Si otro proceso usa `27018`, se detiene sin cambiarlo.
No borres `.local/mongodb`; es la base local de este proyecto. El comando usa un
proceso de Node aparte en vez de `mongod --fork`, que MongoDB rechaza en macOS.
Si falla antes de crear `mongod.log`, el error de arranque se guarda en
`.local/mongodb/startup.log` y se muestra en la terminal.

En tu `.env` privado, usa **la misma dirección** para la API y el importador:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27018/teacherperi_dev?directConnection=true
MONGO_CONTENT_IMPORT_URI=mongodb://127.0.0.1:27018/teacherperi_dev?directConnection=true
```

Conserva tu `JWT_SECRET`, `PORT=4000`, `CLIENT_ORIGIN=http://localhost:5173` y
`VITE_API_URL=http://localhost:4000`. Esta base empieza vacía; las cuentas que
creaste en otra base local se quedan allá y no se copian.

```sh
npm run content:import -- --dry-run
CONTENT_IMPORT_CONFIRM=teacherperi_dev npm run content:import -- --apply
npm run content:import -- --dry-run
npm run content:check
```

La segunda simulación debe decir `create:0`, `promote:0` y `keep:537` en una
importación nueva del contenido actual. `content:check` lee **MONGO_URI**, la
base que usa la API, sin escribir. Debe mostrar `atomicImportSupported:true` y
`ommRoot:"published"`.

Reinicia `npm run server` y `npm run dev` después de editar `.env` (en terminales
separadas). Luego abre:

- http://localhost:5173/rutas/preparacion-para-la-omm
- http://localhost:4000/api/paths/preparacion-para-la-omm

La dirección de la API debe responder con la Ruta. Si la API funciona y la página
no, revisa `VITE_API_URL` y reinicia Vite. Si `content:check` ve contenido pero la
API no, reinicia el servidor: puede seguir usando la dirección anterior.

El proceso de la base sigue corriendo cuando termina el comando. Para detenerlo
de forma ordenada, desde la raíz del repositorio usa
`mongod --shutdown --dbpath "$PWD/.local/mongodb"` si tu versión lo permite, o
manda SIGTERM al PID que aparece en `.local/mongodb/mongod.log`. No detengas el
servicio de `27017`. Vuelve a correr `npm run db:local:start` después de
reiniciar tu computadora.

Para el sitio publicado, ve [DEPLOYMENT.md](DEPLOYMENT.md) y la guía del
importador [CONTENT_IMPORT.md](CONTENT_IMPORT.md). Esta base local nunca debe
quedar expuesta a internet ni usarse como infraestructura de producción.
