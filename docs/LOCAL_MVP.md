# Mostrar el MVP en localhost

El currículo está integrado en `main`, pero la API lee MongoDB, no los archivos
del currículo. Un dry-run con `create:511` significa que los 511 registros todavía
no están importados. MongoDB standalone permite el dry-run, pero rechaza `--apply`
porque el importador usa una transacción. No se debe quitar esa protección.

## Preparación local sin cambiar tu MongoDB existente

Requiere `mongod` instalado y disponible en PATH (la instalación habitual de
MongoDB en macOS/Linux). Desde la raíz del repositorio:

```sh
npm ci
npm run db:local:start
```

Esto inicia un replica set dedicado, enlazado solo a `127.0.0.1:27018`, con datos
persistentes en `.local/mongodb` dentro del repositorio. No toca el proceso ni los
datos del MongoDB existente en `27017`. Se puede repetir: verifica la configuración
del proceso antes de inicializarlo. Si otro proceso ocupa `27018`, se detiene sin
modificarlo. No borres `.local/mongodb`; es la base local de este proyecto.

En tu `.env` privado, usa **la misma URI** para API e importador:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27018/teacherperi_dev?directConnection=true
MONGO_CONTENT_IMPORT_URI=mongodb://127.0.0.1:27018/teacherperi_dev?directConnection=true
```

Conserva tu `JWT_SECRET`, `PORT=4000`, `CLIENT_ORIGIN=http://localhost:5173` y
`VITE_API_URL=http://localhost:4000`. Este entorno parte de una base nueva; tus
cuentas y registros anteriores siguen intactos en la instancia de `27017`.
No es una migración de esas cuentas.

```sh
npm run content:import -- --dry-run
CONTENT_IMPORT_CONFIRM=teacherperi_dev npm run content:import -- --apply
npm run content:import -- --dry-run
npm run content:check
```

La segunda ejecución del dry-run debe indicar `create:0`, `promote:0` y `keep:511`
en una importación nueva de este manifiesto. `content:check` consulta **MONGO_URI**,
la base que usa la aplicación, sin escribir datos. Debe mostrar
`atomicImportSupported:true` y `ommRoot:"published"`.

Reinicia `npm run server` y `npm run dev` después de editar `.env` (en terminales
separadas). Abre:

- http://localhost:5173/rutas/preparacion-para-la-omm
- http://localhost:4000/api/paths/preparacion-para-la-omm

La URL de API debe responder con el currículo. Si la API funciona y la página no,
revisa `VITE_API_URL` y reinicia Vite. Si `content:check` ve contenido pero la API
no, reinicia el servidor: puede seguir usando la URI anterior.

El proceso dedicado queda corriendo después del comando. Para detenerlo de forma
ordenada, desde la raíz del repositorio usa
`mongod --shutdown --dbpath "$PWD/.local/mongodb"` si tu versión lo admite, o
envía SIGTERM al PID indicado en `.local/mongodb/mongod.log`. No detengas el servicio
de `27017`. Vuelve a ejecutar `npm run db:local:start` tras reiniciar tu equipo.

Para producción se conserva [DEPLOYMENT.md](DEPLOYMENT.md) y el importador
[CONTENT_IMPORT.md](CONTENT_IMPORT.md). Esta instancia local no debe exponerse
a Internet ni usarse como infraestructura de producción.
