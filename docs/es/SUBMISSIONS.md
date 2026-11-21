# Envíos de la comunidad, carpetas de examen y reportes de errores

**[English](../SUBMISSIONS.md)** · Español

Los usuarios con sesión iniciada (rol `user` en adelante, ver
[ROLES.md](ROLES.md)) pueden proponer problemas, proponer carpetas de examen y
reportar errores. Nada de lo que mandan es público hasta que un admin lo revisa.

## Problemas

- **Proponer:** `/entrenamiento/problemas/proponer`. Solo el enunciado (KaTeX con
  `$…$` y `$$…$$`), áreas y etiquetas elegidas del vocabulario existente (Topics y
  Tags; «Original TeacherPeri» está reservada para el equipo) y, si quieres,
  «Es un problema de examen» con una carpeta y un número de problema.
- **Se guarda como:** un `Problem` con `author` y `publicationStatus: draft`, más
  un `ProblemSubmission` (`kind: create`, `status: pending`) con la propuesta. El
  código `U-00001`, el título, el año, el área y la colección se llenan solos
  (los problemas de examen toman título y año de su carpeta).
- **Editar:** un borrador se actualiza en su lugar. Un problema publicado
  conserva su versión aprobada en público; el cambio espera como un
  `ProblemSubmission` (`kind: edit`). Hay a lo más un envío pendiente por problema.
- **Borrar:** borrado suave (`deletedAt`, `publicationStatus: archived`); los
  envíos pendientes pasan a `withdrawn`. Un admin puede restaurarlo.
- **«Mis envíos»** (`/mis-envios`, en el menú del avatar) muestra los problemas
  de la persona con su estado: en revisión, publicado, rechazado (con el motivo),
  o publicado con cambios en revisión.
- **Revisiones automáticas** (`server/src/lib/review/checks.js`): corren al
  guardar y otra vez en la revisión: largo del enunciado, que KaTeX lo pueda
  mostrar, `$` sin cerrar, vocabulario, carpeta de examen, duplicados y casi
  duplicados, enlaces, caracteres repetidos y todo en mayúsculas. Los errores
  impiden guardar; las advertencias son para quien revisa.

## Carpetas de examen

Las carpetas de examen son documentos `Category` con `kind: exam` bajo una sola
raíz, «Exámenes» (se crea la primera vez que se usa). Ejemplo:
`Exámenes › OMM Estatal › Jalisco › 2023`. Los usuarios pueden crear una
subcarpeta dentro de cualquier carpeta que vean; queda `pending` y solo su autor
la ve hasta que se aprueba. Los nombres de carpetas hermanas son únicos sin
importar mayúsculas ni acentos. Como son Categories, elegir una carpeta en el
filtro de Problemas incluye todo lo que está dentro.

## Reportes de errores (flags)

«Reportar un error» en un problema o en una lección guarda un `Flag` (página,
persona, mensaje). Hay un solo reporte abierto por persona y página. Editores y
admins los atienden en `/panel/moderacion` (resolver o descartar, con nota
opcional), que usa `GET /api/flags` y `POST /api/flags/:id/status`; el script de
revisión también sirve.

## Revisión (admins)

**En el sitio:** `/panel/revision` («Revisión» en «Panel del equipo»). Cada
propuesta muestra sus revisiones automáticas; «Revisar» la abre, y ahí el admin
puede corregir título, áreas, etiquetas, carpeta y número antes de «Aprobar y
publicar», o escribir un motivo y «Rechazar». Las carpetas de examen propuestas
se aprueban, renombran o rechazan. La página llama a `/api/review` (solo admins),
que corre las mismas funciones de `server/src/lib/review/service.js` que el
script, siempre aplicadas y con el admin que inició sesión como revisor.

**Desde una terminal:** `npm run review` (`server/src/scripts/review-submissions.js`)
usa las mismas funciones (más adelante podrán correr solas después de cada
envío). Con el archivo privado de Atlas, `npm run atlas:review:test -- <comando>`
y `npm run atlas:review:prod -- <comando>` lo corren sin escribir la dirección
(ver [DEVELOPMENT.md](DEVELOPMENT.md#scripts-de-atlas)):

```sh
npm run review -- list                                   # problemas y carpetas pendientes, reportes abiertos
npm run review -- show U-00001                           # detalle completo; en ediciones, qué cambia
npm run review -- approve U-00001 --as <admin> --topics "Álgebra" [--tags "…"] [--folder "OMM › 2024" | --not-exam] [--number 3] [--title "…"] [--difficulty basico] [--attribution "…"]
npm run review -- reject U-00001 --as <admin> --reason "Lo que debe corregir"
npm run review -- folders | approve-folder <id|ruta> | reject-folder <id|ruta> --reason "…" | rename-folder <id|ruta> --name "…"
npm run review -- flags | resolve-flag <id> [--note "…"] | dismiss-flag <id> [--note "…"]
npm run review -- deleted | restore U-00001
```

Los comandos que cambian algo son simulaciones por defecto (o con `--dry-run`) e
imprimen lo que cambiaría. `--apply` escribe y necesita
`REVIEW_DATABASE_CONFIRM` igual al nombre de la base. La base se toma solo de
`MONGO_REVIEW_URI`, que debe nombrarla; el script nunca la imprime. `--as` debe
ser una cuenta admin en esa base. Aprobar un problema que está en una carpeta
pendiente también aprueba la carpeta. Un problema aprobado lleva el crédito
«Propuesto por @usuario» (después de la ruta del examen en los problemas de
examen); `--attribution` lo reemplaza. El autor recibe una notificación en el
sitio cuando su envío se aprueba o se rechaza.

## Migración

Se aplicó a la base de prueba `teacherperi` el 2026-11-21 con
`npm run atlas:migrate:test -- --apply`; la base del sitio usa
`npm run atlas:migrate:prod -- --apply`.

`npm run db:migrate:roles-users` (simulación por defecto; `--apply` necesita
`MONGO_MIGRATION_TARGET_URI` y `MIGRATION_TARGET_CONFIRM`) reescribe los valores
de rol antiguos, crea «Exámenes» con las carpetas vacías «OMM», «OMM Estatal»,
«OMMEB», «Centroamericana», «Iberoamericana» e «IMO», y archiva los problemas de
los exámenes de práctica existentes en
«Exámenes › Prácticas TeacherPeri › <ronda>». Solo agrega y se puede correr
varias veces sin cambiar nada más.
