# Contenido

**[English](../CONTENT.md)** · Español

Cómo se guardan y se publican las lecciones, los problemas, las listas, los
exámenes y las Rutas.

## De dónde sale el contenido oficial

El contenido oficial de TeacherPeri se escribe en archivos dentro de
`server/src/data/` y se carga a la base de datos con scripts. Nadie lo captura a
mano en el sitio. Así cada cambio se revisa en un pull request.

| Contenido | Origen | Se carga con |
| --- | --- | --- |
| Problemas, lecciones, listas, exámenes y la Ruta OMM (primera versión) | `server/src/data/` (`mvpManifest.js`, `mvpLessons.js`, `mvpProblems.js`, `ommCurriculum.js`, `ommLaunchContent*.js`) | `npm run content:import` ([CONTENT_IMPORT.md](CONTENT_IMPORT.md)) |
| Lecciones reescritas y los problemas que agregan | `server/src/data/theory/`, un archivo por lección | `npm run content:revise-theory` ([CONTENT_IMPORT.md](CONTENT_IMPORT.md#revisar-lecciones-reescritas)) |
| Lecciones nuevas sin texto anterior (definen `lesson: { title, area, level }`) | `server/src/data/theory/`, un archivo por lección | `npm run content:revise-theory` (las crea) |
| Exámenes oficiales transcritos (OMMEB Guerrero 2023–2026; selectivos IMC y PAGMO 2021; Olimpiada Femenil CARMA 2020) | `server/src/data/ommebGuerrero/` y `server/src/data/examenesEntrenamiento/`, un archivo por examen, figuras en `figuras/` | `npm run content:import-transcribed -- <colección>` ([CONTENT_IMPORT.md](CONTENT_IMPORT.md#importar-exámenes-transcritos-ommeb-guerrero-y-otros)) |
| Figuras de las lecciones | `public/figuras/*.svg` | Se publican con el sitio |
| Problemas y carpetas de examen de la comunidad | Se proponen en el sitio | Revisión de un admin ([SUBMISSIONS.md](SUBMISSIONS.md)) |

Ambos scripts corren primero como simulación (dry run), aplican todo en una sola
transacción, nunca borran nada y no cambian nada si se corren dos veces.
`npm run content:validate` revisa los archivos de contenido sin base de datos:
que las matemáticas se vean bien en KaTeX, que las referencias apunten a
registros reales y que la estructura sea válida.

## Problemas

Un problema (`Problem`) tiene un enunciado (texto con matemáticas entre `$...$`),
pistas y solución opcionales, áreas (`Topic`), etiquetas, carpetas (`Category`),
un nivel (`basico`, `intermedio` o `avanzado`) y una fuente opcional. Los
problemas tienen códigos internos (p. ej. `TP-C07`) y títulos, pero el sitio
muestra el enunciado, nunca el título.

Varias pistas van en un mismo campo, separadas por una línea en blanco. Cada una
aparece con su propio botón («Ver pista 1», «Ver pista 2»).

Planeado: imágenes en los problemas, para geometría. **Hoy:** solo texto y
matemáticas.

En público, los originales llevan «Fuente: Material original de TeacherPeri.».
Los problemas de concurso llevan «Créditos y fuente:» y el nombre completo de la
competencia; agrega «Autor:» solo cuando se conozca quién propuso originalmente
el problema, no quien lo subió al sitio. No busques nombres faltantes solo para
llenar el campo. No muestres dificultad en páginas ni tarjetas públicas de
problemas o teoría. En las listas, usa «Ejercicio n» sin códigos internos.

## Lecciones (Teoría)

> **Estado:** Parcial. El formato nuevo ya funciona. En el código, las 49
> lecciones anteriores al Ciclo 3 lo usan (37 reescritas y 12 nuevas del Ciclo 2);
> el sitio muestra cada una cuando se publica.

Una lección en el formato nuevo tiene estas secciones, en este orden: Preámbulo →
Teoría → Agregados culturales → Ejercicios → Problemas → Problemas de mayor
dificultad. Se pueden agregar secciones. Las secciones son encabezados `##` y
las subsecciones `###`.

Dentro del texto, las cajas se escriben como bloques:

```
:::definition Divisor
Texto de la definición, con $matemáticas$.
:::
```

| Bloque | Se ve como |
| --- | --- |
| `definition` | Caja DEFINICIÓN |
| `theorem` | Caja TEOREMA, la más fuerte |
| `lemma`, `corollary`, `proposition` | LEMA, COROLARIO, PROPOSICIÓN (numerados si no tienen nombre) |
| `proof` | «Demostración», termina con ∎ |
| `example` | EJEMPLO n, con el enunciado visible y la solución detrás de «Ver solución» |
| `try` | «Inténtalo», con la respuesta oculta hasta abrirla |
| `tip` | CONSEJO DE OLIMPIADA |
| `mistake` | ERROR COMÚN |
| `reveal` | Un desplegable dentro de otro bloque (p. ej. una pista) |

Otro marcado:

- Figuras: `![texto alternativo](figuras/nombre.svg "pie de figura")`. Varias en
  una línea se ven en fila. Solo cargan archivos de `public/figuras/`.
- Tablas: tablas de Markdown.
- «Agregados culturales»: una lista con viñetas bajo ese encabezado; cada viñeta
  se vuelve una tarjeta.
- Cajas de problemas: `[[collection:<slug>:ejercicios]]` (EJERCICIOS, con pistas),
  `[[collection:<slug>:practice]]` (PRACTICA) y
  `[[collection:<slug>:dificiles]]` (RETO).
- Problemas elegidos uno por uno: `[[problems:TP-A01,TP-G08:ejercicios]]` (hasta
  20 códigos, en el orden en que se muestran; el tipo es `ejercicios`,
  `practice` o `dificiles`). Es la misma caja que una colección, pero no necesita
  una `ProblemCollection` en la base: la página carga esos códigos con
  `GET /api/collections?codes=…`. Los códigos que no son públicos se omiten.

**Editar en el sitio:** editores y admins cambian una lección en
`/panel/teoria/:id/editar` («Editar lección»). El texto sigue siendo este
marcado, pero cada caja, título y fórmula se colorea como se ve en la página. La
barra sobre el texto inserta el marcado en el cursor, o alrededor del texto
seleccionado: «Bloque» (todos los bloques de arriba, más una figura y una
tabla), «Título» (`##` o `###`), «Problema» (busca en el banco de problemas e
inserta una caja `[[problems:…]]`) y «$ LaTeX». La vista previa al lado usa el
renderizador de lecciones, con las cajas de problemas reales. Ver
[ROLES.md](ROLES.md).

Cada bloque tiene un solo aspecto; los autores nunca le dan estilo a mano. El
lector del marcado es `src/lib/theoryArticle.js` y las cajas están en
`src/components/content/`. Corre `npm run dev` y abre `/dev/teoria-prueba` para
ver todos los bloques. El aspecto de cada caja está en
[DESIGN.md](DESIGN.md#5-bloques-de-teoría-un-estilo-por-tipo).

Reglas:

- Los ejercicios y problemas viven en el banco de problemas. Una lección solo
  muestra una caja que apunta a ellos (una `ProblemCollection`). Los ejercicios
  traen pistas; las otras cajas llevan a la página del problema.
- Todo argumento de geometría lleva figura (un SVG en `public/figuras/`, con
  texto alternativo), justo antes del párrafo que la usa.
- Todo lo que ve un visitante está en español de México.

## Listas y exámenes

Ambos son listas ordenadas de referencias a problemas del banco; nunca copian un
problema. Una lista puede, en cambio, enlazar a un recurso externo (p. ej. el
archivo de problemas de la IMO). Los exámenes también tienen datos propios
(competencia, año, ronda, duración, instrucciones). Las carpetas de examen (p. ej.
Exámenes › OMM › 2024) se explican en
[SUBMISSIONS.md](SUBMISSIONS.md#carpetas-de-examen).

## Rutas

Una Ruta (`Path`) es un orden guiado por material que ya existe:

- Un Path contiene **o** otros Paths **o** pasos (Steps), nunca ambos.
- Un paso tiene título, instrucciones y referencias a contenido.
- El mismo Path puede aparecer en varias Rutas. Completarlo una vez cuenta en
  todas.
- El progreso cuenta cada Path final una sola vez y nunca bloquea contenido.
- La Ruta OMM (`server/src/data/ommCurriculum.js`) tiene Preparación y cinco
  ciclos (`PathSection`s). Las partes sin terminar muestran «Próximamente» en vez
  de lecciones vacías; sus Paths se quedan como borradores.
- Una Ruta cuyo único paso es una lección abre directamente la página de la
  lección, con la franja «En la Ruta».
