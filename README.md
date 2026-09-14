# TeacherPeri

Plataforma en español para preparación en olimpiadas de matemáticas y orientación
universitaria en Estados Unidos y universidades seleccionadas de Canadá. Este
repositorio migra infraestructura de Axioma de forma incremental.

## Documentación canónica

- [Guía de desarrollo y contribución](docs/DEVELOPMENT.md): prácticas de ingeniería, seguridad y validación.
- [Producto](docs/PRODUCT.md): modelo acordado y límites de alcance.
- [Arquitectura](docs/ARCHITECTURE.md): implementación actual e invariantes futuras.
- [Migración](docs/MIGRATION.md): infraestructura reutilizable y legado pendiente.
- [Roadmap](docs/ROADMAP.md): orden de implementación.

Hoy funcionan el banco de Problemas, sus carpetas/filtros/comentarios, la sesión
compartida y el formulario de contacto. Las páginas informativas combinan contenido
estático y placeholders. Rutas, Threads independientes, Mi Espacio y las nuevas
bibliotecas todavía no están implementados. El código legado no define requisitos.

## Desarrollo local

Se necesitan Node y npm, y MongoDB para la API y las pruebas de integración.
`.nvmrc` fija **Node 22.13.0**, el mínimo compatible con todo el lockfile
(incluido ESLint). El rango de `engines` también admite Node 24 y 26 o superior
según las restricciones actuales. No se actualizaron dependencias en esta fase.

```sh
nvm install
nvm use
npm ci
cp .env.example .env
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

Copia el secreto generado a `JWT_SECRET` en `.env`. Conserva una `.env` existente
si ya configuraste el proyecto; no la sobrescribas. No uses una base con datos
reales para desarrollo ni para pruebas/reset.

| Variable | Uso |
| --- | --- |
| `MONGO_URI` | Obligatoria para la API; la plantilla apunta a `teacherperi_dev` local. |
| `JWT_SECRET` | Obligatoria para la API; secreto privado generado localmente. |
| `PORT` | Puerto de API; por defecto `4000`. |
| `CLIENT_ORIGIN` | Origen permitido por CORS; por defecto `http://localhost:5173`. |
| `VITE_API_URL` | URL pública de API usada por el frontend; por defecto `http://localhost:4000`. |
| `MONGO_TEST_URI` | Solo pruebas; se exporta en la terminal/CI, no se carga desde `.env`. |
| `MONGO_DEV_RESET_URI` | Destino explícito del reset de desarrollo; nunca usa `MONGO_URI`. |
| `RESET_DATABASE_CONFIRM` | Nombre exacto de la base a restablecer; sin valor por defecto. |

Inicia MongoDB y ejecuta en terminales separadas:

```sh
npm run server
npm run dev
```

Frontend: `http://localhost:5173`; API: `http://localhost:4000`. El banco está en
`/entrenamiento`, no en `/problemas`. La API puede arrancar con la biblioteca vacía;
el reset no es un paso obligatorio. `npm run build` genera `dist/` y
`npm run preview` permite revisar ese frontend generado. `dist/` no se versiona.

## Validación y CI

```sh
npm run lint
npm run build
npm run test:unit
# Requiere un MongoDB local dedicado a datos desechables:
MONGO_TEST_URI=mongodb://127.0.0.1:27017/teacherperi_test npm run test:integration
```

`npm test` ejecuta ambas suites. Las pruebas unitarias de seguridad no conectan a
MongoDB. Las de integración exigen `NODE_ENV=test` (Vitest lo establece), una URI
local y una base llamada `teacherperi_test` o `teacherperi_test_<sufijo>`. Sin
variable usan `mongodb://127.0.0.1:27017/teacherperi_test`. Comprueban el destino
antes de conectar y antes de limpiar. **Borran datos entre pruebas y eliminan esa
base al terminar**: nunca guardes información valiosa bajo esos nombres.

[GitHub Actions](.github/workflows/ci.yml) ejecuta `npm ci`, lint, build y ambas
suites con Node de `.nvmrc` y un servicio MongoDB 8.0 efímero en el runner, usando
`teacherperi_test_ci`. No necesita secretos ni el MongoDB personal de un desarrollador.
Estas pruebas cubren la API actual y las barreras de seguridad, no la UI completa.

## Reset explícito de desarrollo

El antiguo `npm run seed` fue reemplazado por `npm run db:reset:dev`. **Es un reset
destructivo de categorías/problemas de desarrollo, no una migración ni un comando
para producción.** Recrea sus identificadores. Conserva usuarios y mensajes de
contacto, y se niega a ejecutar si existen comentarios para proteger su historia.
Detén la API antes de usarlo: opera sobre una base desechable sin actividad y no
es una transacción. Si falla parcialmente, no ofrece rollback de datos reales.

Solo si verificaste que la base local es desechable y quieres cargar las 14
categorías y 93 problemas existentes:

```sh
NODE_ENV=development \
MONGO_DEV_RESET_URI=mongodb://127.0.0.1:27017/teacherperi_dev \
RESET_DATABASE_CONFIRM=teacherperi_dev \
npm run db:reset:dev
```

El destino debe ser de loopback, con nombre `teacherperi_dev` o
`teacherperi_dev_<sufijo>`, y coincidir con la confirmación. No hay destino por
defecto ni fallback a `MONGO_URI`. Se rechazan conexiones remotas/ambiguas y se
comprueba también la conexión real antes de borrar. Nunca apuntes estos comandos
a un túnel/proxy hacia una base real. Las futuras migraciones deberán preservar
identidades e historia; este script no cumple esa función.

Las etiquetas de dificultad y porcentajes del dataset son estimaciones
ilustrativas, no estadísticas verificadas. Esta fase no revisa ni inventa contenido
educativo y mantiene los comentarios incrustados como comportamiento legado.
