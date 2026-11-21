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
   lecciones que cambiarán, los problemas que agregará y las colecciones que
   creará. No escribe nada.
3. Define `REVISION_DATABASE_CONFIRM` con el nombre exacto de la base y corre
   `npm run content:revise-theory -- --apply`.
4. Corre la simulación otra vez: cada línea debe decir «already up to date» o no
   listar nada.

Comparar y cambiar: una lección solo cambia si tiene exactamente el texto y el
resumen anteriores, o una reescritura ya publicada que esté en
`server/src/data/theory/earlier.js` (o ya tiene los nuevos); lo mismo con la
descripción de su Ruta. Cuando se corrige en su archivo una lección que ya está
publicada, agrega la versión publicada a `earlier.js` (nunca edites una entrada)
para que la siguiente corrida pueda reemplazarla. Los problemas y colecciones solo se crean si faltan, y si ya existe uno con
contenido distinto, el proceso se detiene. Cualquier conflicto detiene todo antes
de escribir; las escrituras ocurren en una sola transacción. Después de una
revisión, `content:import -- --dry-run` solo reporta `keep`. Una base nueva
recibe todo con `content:import`.

Con el archivo privado de Atlas, `npm run atlas:revise-theory:test` y
`npm run atlas:revise-theory:prod` (agrega `-- --apply` para escribir) hacen los
pasos 1 y 3 por ti (ver [DEVELOPMENT.md](DEVELOPMENT.md#scripts-de-atlas)).

**Cambios hechos en el sitio.** Los editores pueden cambiar una lección en
`/panel/teoria/:id/editar`. Una lección cambiada ahí ya no tiene exactamente el
texto anterior, así que una corrida posterior de `content:revise-theory` se
detiene en ella en vez de borrar el trabajo del editor. Primero copia el cambio
del sitio al archivo de la lección (`/panel/cambios` muestra el antes y el
después) y vuelve a correrlo.

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
