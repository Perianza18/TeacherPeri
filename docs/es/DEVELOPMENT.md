# Desarrollo

**[English](../DEVELOPMENT.md)** · Español

## Preparación

Necesitas Node 22.13 o más nuevo (22, 24 o 26+; `.nvmrc` dice 22.13.0), npm y
MongoDB.

```sh
npm ci
cp .env.example .env
# Genera una clave y ponla en JWT_SECRET dentro de .env:
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
npm run server     # API en http://localhost:4000
npm run dev        # sitio en http://localhost:5173 (en otra terminal)
```

La API arranca con la base de datos vacía. Para cargar el contenido real (Rutas,
lecciones, problemas), sigue [LOCAL_MVP.md](LOCAL_MVP.md). En resumen:
`npm run db:local:start` inicia un replica set de MongoDB local en el puerto
27018, `npm run content:import` carga el contenido y `npm run content:check`
muestra lo que ve la API.

Nunca apuntes tu `.env` local a la base de datos del sitio publicado.

### Configuración (`.env`)

| Variable | Qué es |
| --- | --- |
| `MONGO_URI` | La base de datos que usa la API |
| `JWT_SECRET` | Clave secreta que firma las sesiones. Obligatoria |
| `PORT` | Puerto de la API (4000) |
| `CLIENT_ORIGIN` | La dirección del sitio de la que la API acepta peticiones (`http://localhost:5173`) |
| `VITE_API_URL` | La dirección de la API a la que llama el sitio (`http://localhost:4000`). Es pública: nunca pongas un secreto en una variable `VITE_*` |
| `TRUST_PROXY_HOPS` | Solo en producción detrás de un proxy (ver [DEPLOYMENT.md](DEPLOYMENT.md)). Déjala vacía en local |

## Revisiones antes de un pull request

```sh
npm run content:validate   # los archivos de contenido oficial son coherentes
npm run lint
npm run test:unit
npm run build
```

Las pruebas de base de datos necesitan MongoDB corriendo como replica set en tu
computadora y una base desechable llamada `teacherperi_test` (o
`teacherperi_test_<sufijo>`). La borran al terminar:

```sh
MONGO_TEST_URI=mongodb://127.0.0.1:27017/teacherperi_test npm run test:integration
```

Las pruebas de navegador (escritorio y celular) usan respuestas falsas de la API,
así que no necesitan base de datos:

```sh
npx playwright install chromium
npm run test:browser
```

GitHub Actions (`.github/workflows/ci.yml`) corre todo esto en cada push y cada
pull request, además de una importación real de contenido a una base nueva en
Linux y macOS.

## Lección de prueba

`npm run dev` agrega una página que no existe en el sitio publicado:
`/dev/teoria-prueba`. Muestra todos los bloques de lección, para revisar un
cambio a la página de lección sin tocar contenido real.

## Reiniciar una base local

`npm run db:reset:dev` **borra** los problemas y carpetas de una base local y la
llena con problemas de ejemplo antiguos. Casi nunca lo necesitas:
`content:import` es la forma normal de tener contenido. Solo corre con las tres
variables de abajo, solo en una base de tu computadora llamada `teacherperi_dev`,
y se niega si la base tiene comentarios. Las cuentas se conservan.

```sh
NODE_ENV=development MONGO_DEV_RESET_URI=mongodb://127.0.0.1:27017/teacherperi_dev RESET_DATABASE_CONFIRM=teacherperi_dev npm run db:reset:dev
```

## Scripts de npm

| Script | Qué hace |
| --- | --- |
| `dev`, `build`, `preview` | Sitio: servidor de desarrollo, versión de producción, vista previa de esa versión |
| `server`, `start` | API: con recarga automática, o normal (producción) |
| `lint` | ESLint |
| `test`, `test:unit`, `test:integration`, `test:browser` | Pruebas (`test` corre las unitarias y las de integración) |
| `content:validate` | Revisa los archivos de contenido sin base de datos |
| `content:import` | Carga el contenido oficial a una base ([CONTENT_IMPORT.md](CONTENT_IMPORT.md)) |
| `content:revise-theory` | Publica lecciones reescritas ([CONTENT_IMPORT.md](CONTENT_IMPORT.md#revisar-lecciones-reescritas)) |
| `content:check` | Muestra qué contenido tiene la base de la API (solo lectura) |
| `users:set-role` | Cambia el rol de una cuenta ([ROLES.md](ROLES.md)) |
| `review` | Revisa propuestas, carpetas de examen y reportes de errores ([SUBMISSIONS.md](SUBMISSIONS.md)) |
| `db:migrate:roles-users` | Migración única para los tres roles y las carpetas de examen ([SUBMISSIONS.md](SUBMISSIONS.md#migración)) |
| `db:local:start` | Inicia un replica set de MongoDB local ([LOCAL_MVP.md](LOCAL_MVP.md)) |
| `db:reset:dev` | **Borra** los problemas y carpetas de una base local `teacherperi_dev` y la llena con problemas de ejemplo antiguos. Solo local |
| `curriculum:preview:omm`, `curriculum:preview:omm-content` | Imprimen la Ruta OMM y su contenido sin base de datos |
| `db:apply:omm-curriculum`, `db:apply:omm-content-batch1`, `db:backfill:problem-categories` | Migraciones locales antiguas, de antes de `content:import` |

Los scripts que escriben en una base corren como simulación a menos que pases
`--apply` y confirmes el nombre de la base. Ve las reglas de seguridad en
[ARCHITECTURE.md](ARCHITECTURE.md#reglas-de-seguridad-dentro-del-código).
