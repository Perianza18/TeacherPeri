# TeacherPeri

Plataforma en español para preparar estudiantes en resolución de problemas y
olimpiadas de matemáticas. El MVP se centra en **Preparación para la OMM**:
contenido original, práctica graduada y Rutas reutilizables con progreso opcional.

## Qué puedes explorar

- **Problemas:** búsqueda, filtros combinables, carpetas recursivas, pistas,
  soluciones razonadas y comentarios existentes.
- **Teoría:** 37 guías originales, con LaTeX, ejemplos y práctica.
- **Listas:** seis colecciones de problemas originales y tres recursos externos
  atribuidos, consultados en el sitio del editor.
- **Exámenes:** tres prácticas originales con problemas ordenados del mismo banco.
- **Rutas:** preparación inicial y Ciclo 1 completos; un primer bloque de
  congruencias de Ciclo 2. Los cinco ciclos conservan su estructura; los tramos
  pendientes muestran «Próximamente» y no se publican como lecciones vacías.

La lectura es pública. Iniciar sesión permite marcar Rutas hoja como completas;
el progreso nunca bloquea contenido. Mi Espacio, Threads, comunidad y orientación
universitaria completa permanecen fuera de este sprint.

## Arquitectura

React 19 / Vite, Express 5, MongoDB / Mongoose, JWT y KaTeX. El contenido se guarda
una vez y se referencia desde listas, exámenes y Steps. Los ciclos son
`PathSections`, no Paths adicionales. El grafo de Paths es acíclico y reutilizable;
un Path contiene hijos o Steps, nunca ambos.

## Desarrollo

Node 22.13+ compatible con `engines`, npm y MongoDB. Para el importador atómico se
requiere un replica set de MongoDB (Atlas lo proporciona).

```sh
npm ci
cp .env.example .env
# Genera una clave y colócala únicamente en JWT_SECRET de tu .env:
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
npm run server
# En otra terminal:
npm run dev
```

Frontend: `http://localhost:5173`; API: `http://localhost:4000`. Las bibliotecas
están en `/entrenamiento/problemas`, `/teoria`, `/listas` y `/examenes` bajo
`/entrenamiento`. La API puede arrancar sin contenido; no necesita un reset.
Si la ruta OMM no aparece, sigue [la preparación local del MVP](docs/LOCAL_MVP.md):
`npm run db:local:start` prepara un replica set separado y `npm run content:check`
comprueba la base que usa la API. Un dry-run no importa contenido.

## Importar el contenido del MVP

[Guía del importador](docs/CONTENT_IMPORT.md). Valida el manifiesto sin MongoDB:

```sh
npm run content:validate
```

El importador usa una URI **separada**, no toma `MONGO_URI`, y comienza en modo
solo lectura. No imprime credenciales. Conecta únicamente cuando se proporciona
un destino explícito.

```sh
# Define MONGO_CONTENT_IMPORT_URI en tu entorno privado; incluye nombre de base.
npm run content:import -- --dry-run
# Solo después de revisar el resultado, confirma el nombre exacto de la base:
CONTENT_IMPORT_CONFIRM=teacherperi npm run content:import -- --apply
```

La aplicación completa se ejecuta en una transacción: conserva IDs existentes,
rechaza contenido o estructura incompatibles, no borra registros y una repetición
idéntica no modifica datos. No importa los 93 problemas de la antigua fixture ni
PDFs ajenos. Nunca uses `db:reset:dev` para preparar producción.

## Validación

```sh
npm run content:validate
npm run lint
npm run test:unit
npm run build
# Solo una base local desechable teacherperi_test o teacherperi_test_<sufijo>:
MONGO_TEST_URI=mongodb://127.0.0.1:27017/teacherperi_test npm run test:integration
npx playwright install chromium
npm run test:browser
```

Las pruebas de integración limpian y eliminan su base local verificada. Requieren
un replica set para comprobar el importador transaccional; el guard de seguridad
exige conexión directa de loopback. Nunca uses datos reales en esa base.
GitHub Actions proporciona MongoDB 8.0 efímero, ejecuta estas comprobaciones e
incluye pruebas de navegación en escritorio y móvil. Las pruebas de navegador
usan una fixture explícita de API; las relaciones y la importación reales se
verifican por separado contra MongoDB.

## Producción

Solo resta conectar infraestructura y configurar secretos privados. Sigue
[DEPLOYMENT.md](docs/DEPLOYMENT.md): Atlas, importación revisada, API con `npm start`,
frontend con `npm run build`, URL pública de API y fallback de rutas SPA.
No hay despliegue ni base de producción incluida en este repositorio.

## Documentación

[Estado actual](docs/CURRENT_STATE.md) · [Producto](docs/PRODUCT.md) ·
[Arquitectura](docs/ARCHITECTURE.md) · [Especificación](docs/TEACHERPERI_SPEC.md) ·
[Roadmap](docs/ROADMAP.md) · [Migración](docs/MIGRATION.md) ·
[Desarrollo](docs/DEVELOPMENT.md)
