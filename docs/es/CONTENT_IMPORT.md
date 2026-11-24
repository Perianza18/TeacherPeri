# Importar el contenido

**[English](../CONTENT_IMPORT.md)** · Español

`npm run content:validate` revisa todas las matemáticas del contenido con KaTeX
estricto, la estructura de publicación y las referencias. `content:import` no
depende de los comandos antiguos de reinicio ni de relleno. No borra, no reinicia
y no tiene ninguna dirección de producción por defecto.

## Cómo funciona

- Los objetos nuevos reciben IDs estables y deterministas; si un registro ya
  existe, se reutiliza su ID buscándolo por su identidad natural (código del
  problema, slug del Path, título de la lección o lista, datos del examen,
  conexión padre/hijo, Path y orden del paso).
- El mismo ID de problema se usa en pasos, listas y exámenes. Ningún examen crea
  copias de problemas. Las pistas y soluciones originales viven en el problema.
- Las identidades ambiguas, los campos ajenos ya existentes, el contenido editado
  y las estructuras incompatibles detienen la revisión previa. Los Paths y
  lecciones en borrador que coinciden exactamente con el repositorio se pueden
  publicar; los borradores editados por otro lado y los pasos viejos en conflicto
  necesitan revisión editorial.
- Los registros ajenos, usuarios, comentarios y avances se quedan intactos.
- Todas las escrituras de contenido y la publicación ocurren en una sola
  transacción de MongoDB. Si algo falla, los cambios se deshacen; repetir la misma
  importación solo reporta `keep`. Antes de la transacción pueden crearse
  colecciones e índices vacíos; eso no escribe contenido.
- Para aplicar se necesita MongoDB Atlas o un replica set. Un servidor standalone
  se niega antes de escribir. La simulación funciona en ambos y no crea
  colecciones ni índices.
- Las credenciales de la dirección nunca aparecen en la salida. El comando no
  muestra errores crudos del driver. Usa un archivo de entorno privado o la
  configuración de secretos del servicio.

## Comandos

Para un MongoDB standalone local, primero sigue [LOCAL_MVP.md](LOCAL_MVP.md) para
iniciar un replica set aislado sin tocar tu instancia actual. Una simulación
exitosa reporta los cambios planeados, no importa datos. `npm run content:check`
revisa, sin escribir, que la `MONGO_URI` de la aplicación tenga publicada la raíz
OMM.

1. Define `MONGO_CONTENT_IMPORT_URI` en privado, con el nombre de la base en la
   dirección. Nunca usa `MONGO_URI` como respaldo. Se rechazan las bases del
   sistema.
2. Corre `npm run content:import -- --dry-run`. Revisa los conteos de
   create/promote/keep.
3. Define `CONTENT_IMPORT_CONFIRM` con el nombre exacto de la base y corre
   `npm run content:import -- --apply`.
4. Corre la simulación otra vez. Si no cambió nada, espera `create:0`,
   `promote:0`.
5. Antes de publicar, revisa la raíz OMM, los pasos de una Ruta final y las
   cuatro bibliotecas.

Haz un respaldo antes de importar a una base que ya tenga contenido valioso. Si
hay un conflicto, revisa su identidad natural con herramientas de desarrollo
local; no borres registros ni hagas un reinicio para silenciarlo. Esta versión
se niega a propósito a sobrescribir trabajo editorial independiente. Los cambios
de contenido en una versión posterior necesitan una migración revisada; el
importador no es un editor general.

## Revisar lecciones reescritas

Las lecciones reescritas en el formato nuevo viven en `server/src/data/theory/`,
un archivo por lección: el resumen y el texto nuevos, los problemas nuevos del
banco que introduce y las colecciones de problemas a las que apuntan sus cajas
(`[[collection:<slug>:<kind>]]`). `mvpLessons.js` las aplica al final y guarda
el texto anterior exacto en `PREVIOUS_THEORY`. Las figuras son archivos SVG en
`public/figuras/`.

Una base que ya tiene el contenido importado se actualiza con
`content:revise-theory`, no con el importador:

1. Define `MONGO_REVISION_URI` en privado, con el nombre de la base en la
   dirección. Nunca usa `MONGO_URI` como respaldo.
2. Corre `npm run content:revise-theory` (simulación). Nombra la base y lista las
   lecciones que cambiarán, las lecciones nuevas que creará, las que omitirá por
   haber sido editadas en el sitio, los problemas que agregará y las colecciones que
   creará. No escribe nada.
3. Define `REVISION_DATABASE_CONFIRM` con el nombre exacto de la base y corre
   `npm run content:revise-theory -- --apply`.
4. Corre la simulación otra vez: cada línea debe decir «already up to date» o no
   listar nada.

Cada lección se decide por separado y nada se sobrescribe sin aviso:

- **Lecciones reescritas** (tienen un texto anterior): el texto, el resumen y la
  descripción de la Ruta solo cambian si tienen exactamente la versión anterior, o
  una reescritura ya publicada que esté en `server/src/data/theory/earlier.js`.
  Cuando se corrige en su archivo una lección ya publicada, agrega la versión
  publicada a `earlier.js` (nunca edites una entrada).
- **Lecciones nuevas** (sin texto anterior; el archivo define
  `lesson: { title, area, level }`, por ejemplo las del Ciclo 2): la corrida crea la
  lección, sus cuatro pasos, sus problemas y cajas, y publica su Ruta y los grupos en
  borrador que tiene arriba, siempre que esas Rutas conserven el borrador del código.
- **Cambios hechos en el sitio.** Los editores pueden cambiar lecciones en
  `/panel/teoria/:id/editar`. Una lección cuyos registros en vivo tengan otra cosa
  se **omite**, y las demás siguen. La simulación muestra, para cada lección omitida,
  las líneas que difieren y una huella de 12 caracteres de lo que tiene. Puedes copiar
  el cambio del sitio al archivo de la lección (`/panel/cambios` muestra el antes y
  el después) y correr otra vez, o, después de revisar la diferencia, reemplazar
  exactamente esa versión en vivo con `--accept-live <slug-de-lección>@<huella>`
  (una vez por lección). Si la lección vuelve a cambiar después de la simulación, su
  huella cambia y la aceptación ya no aplica. Los problemas y cajas propios de una
  lección omitida esperan con ella.
- **Problemas y cajas** solo se agregan. Si uno ya existe con otro contenido
  (editado en el sitio), se reporta y se deja como está.

Las escrituras ocurren en una sola transacción, cada una con un filtro de comparar y
cambiar: si un registro cambia entre el plan y la escritura, no se escribe nada.
Después de una revisión completa, `content:import -- --dry-run` solo reporta `keep`.
Una base nueva recibe todo con `content:import`.

Con el archivo privado de Atlas, `npm run atlas:revise-theory:test` y
`npm run atlas:revise-theory:prod` (agrega `-- --apply` para escribir, y las opciones
`--accept-live` que hagan falta) hacen los pasos 1 y 3 por ti (ver
[DEVELOPMENT.md](DEVELOPMENT.md#scripts-de-atlas)). Orden sugerido: fusionar primero
el pull request para que las figuras estén desplegadas, después correr en la base de
prueba, y luego una simulación en producción, revisada antes de `--apply`.

## Importar problemas de exámenes oficiales

`content:import-exams` carga problemas de exámenes oficiales (se usó para los
regionales de la OMM, la OMCC y la PAGMO) desde una carpeta de
archivos preparados, un JSON por examen, con sus figuras en `figures/`. Los
archivos se guardan fuera del repositorio; el script está en
`server/src/scripts/import-exam-problems.js`, que describe el formato.

- Cada examen va a la carpeta `Exámenes › <competencia> › <ronda> › <año>`
  (por ejemplo `Exámenes › OMM Regional › Sureste › 2024`), o a
  `Exámenes › <competencia> › <año>` cuando el examen no tiene ronda (por
  ejemplo `Exámenes › Centroamericana › 2016`); las carpetas que faltan se crean
  ya aprobadas.
- Los problemas solo usan etiquetas, áreas y subtemas que ya existen. Uno
  desconocido detiene la corrida: el script nunca crea etiquetas ni temas.
- Las figuras (SVG dibujado con las reglas de `Figura`, o un recorte PNG) se
  guardan como cualquier imagen subida: WebP, de 1200 px de ancho como máximo, con
  texto alternativo en español. Un problema tiene hasta 4 figuras; cada una va
  con el enunciado o con la solución.
- Carpetas, problemas y figuras se escriben en una sola transacción; después, la
  misma sincronización de exámenes del sitio crea o actualiza las tarjetas en
  Exámenes.
- Los identificadores son estables, así que una segunda corrida reporta todos los
  problemas como ya existentes. Un código que ya tiene otro enunciado detiene la
  corrida.

1. Define `MONGO_EXAM_IMPORT_URI` en privado, con el nombre de la base en la ruta.
2. Corre `npm run content:import-exams -- <carpeta>` (simulación). Muestra las
   carpetas, problemas y figuras que crearía. No escribe nada.
3. Define `EXAM_IMPORT_CONFIRM` con el nombre exacto de la base y agrega `--apply`.
4. Corre la simulación otra vez: no debe crear nada.

Con el archivo privado de Atlas, `npm run atlas:import-exams:test -- <carpeta>` y
`npm run atlas:import-exams:prod -- <carpeta>` (agrega `--apply` para escribir)
hacen los pasos 1 y 3 por ti.

## Importar exámenes transcritos (OMMEB Guerrero y otros)

Algunos exámenes oficiales se transcriben a mano desde sus PDF al repositorio, un
archivo por examen, con sus figuras recortadas del PDF en una carpeta `figuras/`.
`server/src/data/examCollections.js` describe los campos y valida las fórmulas con
KaTeX estricto. Hay dos colecciones:

| Colección | Carpeta | Contenido |
| --- | --- | --- |
| `ommeb-guerrero` | `server/src/data/ommebGuerrero/` | Exámenes Estatal y Selectivo de la OMMEB en Guerrero, de la 7a a la 10a edición (2023–2026), niveles 1 a 3: 24 exámenes, 360 problemas, con las respuestas oficiales y las soluciones oficiales de los problemas de redacción (sin copiar los criterios de calificación) |
| `examenes-entrenamiento` | `server/src/data/examenesEntrenamiento/` | Exámenes selectivos y de entrenamiento que llegaron como PDF sueltos: exámenes 1, 2, 3 y 5 del selectivo mexicano 2021 para la IMC (secundaria), el primer examen selectivo 2021 de la delegación mexicana a la PAGMO y la final Walabi de la VI Olimpiada Femenil CARMA (2020): 6 exámenes, 67 problemas. Los PDF no traen respuestas, así que cada problema lo dice en una nota |

`npm run content:import-transcribed -- <colección>` agrega una colección a una base
que ya tiene contenido:

1. Define `MONGO_TRANSCRIBED_IMPORT_URI` en privado, con la base en la ruta. Nunca
   usa `MONGO_URI`.
2. Corre `npm run content:import-transcribed -- <colección>` (simulación). Lista las
   carpetas y problemas que va a crear y los que ya existen. No escribe nada.
3. Define `TRANSCRIBED_IMPORT_CONFIRM` con el nombre exacto de la base y agrega
   `--apply`. Las figuras se guardan como imágenes de la cuenta admin más antigua, o
   si no hay, del editor más antiguo, o de `--owner <usuario>`.
4. Corre otra vez la simulación: todo debe decir que ya existe.

Qué hace:

- Crea las carpetas de examen de la colección (por ejemplo `Exámenes › OMMEB ›
  Guerrero › <año> › <Estatal|Selectivo> › Nivel <n>` o `Exámenes › IMC ›
  Selectivo de México (secundaria) › 2021 › Examen 1`; reutiliza las que ya existen) y
  publica cada problema con su código (`OMMEB-GRO-2025-EST-N1-01`,
  `IMC-MX-2021-SEL1-01`), número y área, en una sola transacción.
- Después cada carpeta recibe su examen en la página de Exámenes («OMMEB 2025 ·
  Guerrero · Estatal · Nivel 1»), con la duración y las indicaciones del examen.
- Un problema que ya existe nunca se cambia. Si es distinto de la transcripción
  (se editó en el sitio), se reporta y se deja como está.
- Si alguna carpeta que necesita está en revisión, se detiene antes de escribir.

El dinero se escribe «53.20 pesos», porque un `$` suelto inicia una fórmula. Los
problemas sin respuesta oficial lo dicen en una nota junto a la respuesta. Con el
archivo privado de Atlas, `npm run atlas:import-transcribed:test -- <colección>` y
`npm run atlas:import-transcribed:prod -- <colección>` (agrega `--apply` para
escribir) hacen los pasos 1 y 3 por ti.

## Qué incluye y de dónde viene

37 lecciones de teoría en español, 56 problemas originales (20 de ellos de las
lecciones reescritas), seis colecciones de problemas de lecciones, seis listas de
problemas, tres recursos externos con su atribución, tres exámenes de práctica
originales y la estructura de cinco ciclos. Solo están publicados Preparación,
Ciclo 1 y dos lecciones de congruencias de Ciclo 2. Los ciclos futuros conservan
Paths en borrador y vistas previas con solo el título en la raíz OMM; los grupos
pendientes no se publican.

Los recursos externos se revisaron el 2026-10-10: OMM (`ommenlinea.org`), el
archivo oficial de problemas de la IMO (`imo-official.org/problems/`) y NRICH
(`nrich.maths.org`). Su material se queda en el sitio de cada editor. La fixture
antigua de problemas de terceros no se importa. Los exámenes de práctica son
originales de TeacherPeri y no se presentan como exámenes oficiales de la OMM ni
como simulacros completos de nivel nacional.
