# Envíos de la comunidad, carpetas de examen y reportes de errores

**[English](../SUBMISSIONS.md)** · Español

Los usuarios con sesión iniciada (rol `user` en adelante, ver
[ROLES.md](ROLES.md)) pueden proponer problemas, proponer carpetas de examen y
reportar errores. Nada de lo que mandan es público hasta que un admin lo revisa.

## Problemas

- **Proponer:** `/entrenamiento/problemas/proponer`. El enunciado (KaTeX con
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

Con el enunciado pueden ir hasta 4 imágenes (ver [Imágenes en los problemas](#imágenes-en-los-problemas)).

## Carpetas de examen

Las carpetas de examen son documentos `Category` con `kind: exam` bajo una sola
raíz, «Exámenes» (se crea la primera vez que se usa). Ejemplo:
`Exámenes › OMM Estatal › Jalisco › 2023`. Los usuarios pueden crear una
subcarpeta dentro de cualquier carpeta que vean; queda `pending` y solo su autor
la ve hasta que se aprueba. Los nombres de carpetas hermanas son únicos sin
importar mayúsculas ni acentos. Como son Categories, elegir una carpeta en el
filtro de Problemas incluye todo lo que está dentro.

## Carpetas de examen en la página Exámenes

La página Exámenes agrupa los exámenes publicados por su ruta de carpetas y
oculta las carpetas principales vacías. Cada competencia, incluida «OMM
Estatal», es una carpeta principal. Los años que contienen exámenes directamente se muestran como
tarjetas de examen, sin un paso adicional; las demás subcarpetas aparecen como
tarjetas de carpeta. Por ejemplo, los exámenes publicados en `OMMEB › 2024`
aparecen como tarjetas dentro de «OMMEB», sin cambiar código. Los exámenes de TeacherPeri
hechos a mano aparecen en «TeacherPeri Originals», ordenados por año.

La carpeta y el `problemNumber` de cada problema son la fuente de verdad; los
documentos `Exam` de Exámenes los siguen (`server/src/lib/examSync.js`).

- Cada carpeta de examen con problemas publicados tiene un `Exam` publicado cuyas
  `categories` incluyen esa carpeta. Se crea cuando llega el primer problema. Su
  título sale de la ruta de la carpeta: el año es el nombre que parece año, la
  competencia es el primer otro nombre y el resto es la ronda (`OMM › 2024` →
  «OMM 2024»; `OMM Estatal › Jalisco › 2023` → «OMM Estatal 2023 · Jalisco»).
- Los problemas van en orden de `problemNumber`; los que no tienen número van al
  final.
- Se mantiene al día al aprobar (en el sitio y con `npm run review`), cuando un
  editor cambia la carpeta o el número, cuando se borra o se restaura un problema
  y cuando se renombra una carpeta. Un examen que se queda sin problemas pasa a
  `draft`; nunca se borra.
- Los exámenes hechos a mano no se tocan: un examen cuyas `categories` no tienen
  ninguna carpeta de examen (los 3 exámenes de práctica de TeacherPeri) conserva
  su propia lista, y una carpeta cuyos problemas ya lista un examen así no recibe
  un segundo examen.
- Para los problemas que ya estaban en carpetas: `npm run atlas:sync-exams:test`
  (o `:prod`) muestra lo que crearía; agrega `-- --apply` para escribir. Una
  segunda vuelta no cambia nada. En local:
  `MONGO_EXAM_SYNC_URI=… npm run db:sync:exam-folders`.

## Sugerencias y reportes en problemas y lecciones

Cada página de problema y de lección tiene dos acciones para quien tiene sesión:

| Acción | Para qué sirve | Se guarda como | Va a |
| --- | --- | --- | --- |
| «Sugerir un cambio» | Una corrección de contenido: respuesta equivocada, errata, caso faltante. Un mensaje de 10 a 1000 caracteres | `Flag` (`POST /api/flags`) | Revisión |
| «Reportar» | Contenido inapropiado: spam, ofensivo, datos personales… Los mismos motivos que al reportar un comentario («otro» pide una nota) | `ContentReport` (`POST /api/reports/content`) | Moderación |

Una sugerencia abierta y un reporte abierto por persona y página. Todo `Flag` es
una sugerencia, incluidos los que se enviaron antes como «Reportar un error», así
que no hizo falta migración.

- **Sugerencias:** se listan con `GET /api/flags` y se cierran con
  `POST /api/flags/:id/status` (`resolved` se muestra como «Aplicada» y
  `dismissed` como «Descartada», con nota opcional). El script de revisión
  también sirve (`npm run review -- flags | resolve-flag | dismiss-flag`).
- **Reportes:** se listan con `GET /api/reports/content` y se cierran con
  `POST /api/reports/content/:id/status` (resuelto o descartado, con nota
  opcional). Los reportes de comentarios siguen en sus rutas (`/api/reports`).

## Soluciones propuestas, puntos y marcos

- **«Proponer una solución»** está debajo de la solución oficial de cada
  problema publicado. Con sesión iniciada se escribe una solución (20 a 20 000
  caracteres, con fórmulas `$…$` revisadas como en el enunciado y vista
  previa). Se guarda como `SolutionProposal` (`POST /api/solutions`): una en
  revisión por persona y problema; varias personas pueden proponer para el mismo.
- **Revisión:** Revisión › «Soluciones propuestas» (`GET /api/solutions/pending`,
  `POST /api/solutions/:id/approve | reject`, permiso `solutions:review`).
  Rechazar pide un motivo que la persona lee. Ambas decisiones quedan en
  «Cambios de editores» y la persona recibe un aviso con enlace al problema.
- **Publicada:** las soluciones aceptadas aparecen en «Soluciones de la
  comunidad» (cerrada hasta abrirla), cada una con «Solución de @usuario», su
  avatar y su marco (`GET /api/solutions/problem/:id`). La «Solución» oficial
  no cambia. La persona ve sus propuestas en Mi Espacio › Mis envíos y puede
  retirar una en revisión (`DELETE /api/solutions/:id`).
- **Puntos** (`server/src/lib/levels.js`): solo cuenta lo que el equipo aceptó,
  así nadie sube marcando «Resuelto» o comentando: problema aceptado +30,
  solución aceptada +25, sugerencia aplicada +10. `lib/badges.js` los recalcula
  y guarda `User.points` al leer un perfil o sus insignias, y justo después de
  una aprobación o una sugerencia aplicada.
- **Marcos:** Lápiz (0), Bronce (30), Plata (100), Oro (250), Olímpico (500),
  alrededor del avatar en todo el sitio (`src/lib/frames.js`, `.tp-frame-*` en
  `src/index.css`). En «Editar perfil» cada quien elige un marco que ya
  desbloqueó (`PUT /api/profiles/me { frame }`, 403 si está bloqueado); sin
  elegir, o si ya no lo alcanza, se ve el mejor. Insignias muestra los puntos,
  el avance al siguiente marco y cómo ganar puntos. Hay insignias nuevas de
  «Soluciones aceptadas»: Primera solución (1), Solucionador (5) y Maestro de
  soluciones (20).

- **Avatares que se compran con puntos:** todos los dibujos cuestan puntos:
  los doce originales de 10 a 25, y luego Gato de traje 30, Gato pensando 40,
  Sabelotodo 50, Gato gamer 75 y Gatito que se siente león 100 (`AVATAR_PRICES`
  en `server/src/lib/profile.js`, `price` en `src/lib/avatars.js`). El único
  gratis es «π», el de las cuentas nuevas; quien tenía una figura o un dibujo
  sin comprarlo ve «π». Editores y admins pueden usar todos sin pagar.
  `POST /api/profiles/me/avatars/:id` compra uno si el saldo (puntos ganados
  menos gastados) alcanza; el perfil propio trae `unlockedAvatars` y
  `level.balance`. Gastar nunca baja el marco.

## Revisión (editores y admins)

**En el sitio:** `/panel/revision` («Revisión» en «Panel del equipo»), para
editores y admins. Lista problemas nuevos, cambios a problemas publicados,
carpetas de examen propuestas y sugerencias, con un filtro: «Todo», «Problemas»
(problemas nuevos, cambios y sugerencias en problemas), «Teoría» (sugerencias en
lecciones) y «Carpetas». Cada propuesta muestra sus revisiones automáticas;
«Revisar» la abre, y ahí se puede corregir título, áreas, etiquetas, carpeta y
número antes de «Aprobar y publicar», o escribir un motivo y «Rechazar». Las
carpetas de examen propuestas se aprueban, renombran o rechazan. Cada sugerencia
muestra la página (con enlace), la persona, el mensaje y la fecha, un enlace a
«Editar problema» o «Editar lección», y «Aplicada» / «Descartar» con nota
opcional. La página llama a `/api/review` y `/api/flags`, que corren las mismas
funciones de `server/src/lib/review/service.js` que el script, siempre aplicadas
y con la persona que inició sesión como revisora.

**Historial y avisos:** cada decisión (aprobar, rechazar, renombrar una carpeta,
cerrar una sugerencia), en el sitio o con el script, queda en «Cambios de
editores» (`ContentRevision` con `kind: review`, `server/src/lib/activity.js`).
Si la toma un editor, cada admin recibe además un aviso que enlaza a ella.
Restaurar un problema borrado sigue siendo solo de admins.

**Desde una terminal:** `npm run review` (`server/src/scripts/review-submissions.js`)
usa las mismas funciones (más adelante podrán correr solas después de cada
envío). Con el archivo privado de Atlas, `npm run atlas:review:test -- <comando>`
y `npm run atlas:review:prod -- <comando>` lo corren sin escribir la dirección
(ver [DEVELOPMENT.md](DEVELOPMENT.md#scripts-de-atlas)):

```sh
npm run review -- list                                   # problemas y carpetas pendientes, reportes abiertos
npm run review -- show U-00001                           # detalle completo; en ediciones, qué cambia
npm run review -- approve U-00001 --as <editor o admin> --topics "Álgebra" [--tags "…"] [--folder "OMM › 2024" | --not-exam] [--number 3] [--title "…"] [--difficulty basico] [--attribution "…"]
npm run review -- reject U-00001 --as <editor o admin> --reason "Lo que debe corregir"
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

Se aplicó el 2026-11-21 a la base de prueba `teacherperi`
(`npm run atlas:migrate:test -- --apply`) y a la base del sitio `teacherperi_prod`
(`npm run atlas:migrate:prod -- --apply`); correrla otra vez no cambia nada.

`npm run db:migrate:roles-users` (simulación por defecto; `--apply` necesita
`MONGO_MIGRATION_TARGET_URI` y `MIGRATION_TARGET_CONFIRM`) reescribe los valores
de rol antiguos, crea «Exámenes» con las carpetas vacías «OMM», «OMM Estatal»,
«OMMEB», «Centroamericana», «Iberoamericana» e «IMO», y archiva los problemas de
los exámenes de práctica existentes en
«Exámenes › Prácticas TeacherPeri › <ronda>». Solo agrega y se puede correr
varias veces sin cambiar nada más.


## Imágenes en los problemas

- **Quién las agrega:** quien propone un problema (debajo del enunciado), y editores
  y admins en `/panel/problemas/:id/editar` (debajo del enunciado o dentro de la
  solución). Hasta 4 por problema, cada una con una descripción obligatoria en
  español (texto alternativo, de 5 a 300 caracteres). Editores y admins las ven, con su
  descripción, en Revisión.
- **Fórmulas en la descripción:** la descripción acepta `$…$`. Nunca se muestra
  en la página. Quien escribe ve una vista previa con KaTeX debajo del campo, y
  Revisión la muestra renderizada junto a cada imagen. El atributo `alt` recibe
  texto simple sin `$` (`src/lib/mathAlt.js`: `\angle` → «ángulo», `^\circ` →
  «°», `\frac{a}{b}` → «a/b»; los demás comandos quedan con su nombre). Un `$`
  sin cerrar se rechaza igual que en el enunciado.
- **Subida:** `POST /api/images` con el archivo como cuerpo. PNG, JPG o WebP de
  hasta 5 MB, detectado por los bytes del archivo (SVG y cualquier otro formato se
  rechazan). El servidor la convierte a WebP, de máximo 1200 px de ancho y sin
  metadatos (sharp).
- **Dónde se guardan:** la colección `ProblemImage` en la misma base de MongoDB,
  nunca en el disco de Render. Un problema o una propuesta guarda
  `images: [{ image, alt, placement }]`. Una imagen subida que nadie usa se borra
  al día siguiente; una imagen que se quita de un borrador o que quita un editor
  se borra si nada más la usa. Cada persona puede tener como máximo 12 imágenes
  subidas sin usar.
- **Cómo se sirven:** `GET /api/images/:id`, pública, con
  `Cache-Control: max-age=31536000, immutable`. Una imagen nunca cambia:
  «Reemplazar» sube una nueva.
- **Espacio:** las figuras de geometría como las de las lecciones ocupan 10–15 KB
  cada una (12 KB en promedio, medido con las 9 figuras de `public/figuras`), así
  que un problema con una o dos figuras usa unos 12–25 KB. La peor imagen posible
  (ruido puro) ocupa unos 385 KB.
