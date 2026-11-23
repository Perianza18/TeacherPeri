# Content

English · **[Español](es/CONTENT.md)**

How lessons, problems, lists, exams and Rutas are stored and published.

## Where official content comes from

Official TeacherPeri content is written as files in `server/src/data/` and loaded
into the database by scripts. Nobody types it into the live site. That way every
change is reviewed in a pull request.

| Content | Source | Loaded by |
| --- | --- | --- |
| Problems, lessons, lists, exams and the OMM Ruta (first release) | `server/src/data/` (`mvpManifest.js`, `mvpLessons.js`, `mvpProblems.js`, `ommCurriculum.js`, `ommLaunchContent*.js`) | `npm run content:import` ([CONTENT_IMPORT.md](CONTENT_IMPORT.md)) |
| Rewritten lessons and the problems they add | `server/src/data/theory/`, one file per lesson | `npm run content:revise-theory` ([CONTENT_IMPORT.md](CONTENT_IMPORT.md#revising-rewritten-theory-lessons)) |
| New lessons with no earlier text (they set `lesson: { title, area, level }`) | `server/src/data/theory/`, one file per lesson | `npm run content:revise-theory` (it creates them) |
| Lesson figures | `public/figuras/*.svg` | Published with the website |
| Community problems and exam folders | Proposed on the site | Admin review ([SUBMISSIONS.md](SUBMISSIONS.md)) |

Both scripts run as a dry run first, apply everything in one transaction, never
delete anything, and change nothing when run a second time.
`npm run content:validate` checks the content files without a database: math
renders with KaTeX, references point to real records, and the structure is valid.

## Problems

A problem (`Problem`) has a statement (text with `$...$` math), optional hints
and solution, áreas (`Topic`), tags, folders (`Category`), a level (`basico`,
`intermedio` or `avanzado`) and an optional source. Problems have internal codes
(e.g. `TP-C07`) and titles, but the site shows the statement, never the title.

Several hints go in one field, separated by a blank line. Each one is shown
behind its own toggle («Ver pista 1», «Ver pista 2»).

Planned: images in problems, for geometry. **Today:** text and math only.

## Lessons (Teoría)

> **Status:** Partial. The new lesson format is live. In the code, all 49 lessons
> before Ciclo 3 use it (37 rewritten and 12 new Ciclo 2 lessons); the live site
> shows each one once it is published.

A lesson in the new format has these sections, in this order: Preámbulo →
Teoría → Agregados culturales → Ejercicios → Problemas → Problemas de mayor
dificultad. Extra sections are allowed. Sections are `##` headings and
subsections are `###` headings.

Inside the text, boxes are written as blocks:

```
:::definition Divisor
Text of the definition, with $math$.
:::
```

| Block | Shows |
| --- | --- |
| `definition` | DEFINICIÓN box |
| `theorem` | TEOREMA box, the strongest one |
| `lemma`, `corollary`, `proposition` | LEMA, COROLARIO, PROPOSICIÓN (numbered when they have no name) |
| `proof` | «Demostración», ends with ∎ |
| `example` | EJEMPLO n, statement visible and solution behind «Ver solución» |
| `try` | «Inténtalo», answer hidden until opened |
| `tip` | CONSEJO DE OLIMPIADA |
| `mistake` | ERROR COMÚN |
| `reveal` | A fold-out inside another block (for example a hint) |

Other markup:

- Figures: `![alt text](figuras/name.svg "caption")`. Several on one line show
  in a row. Only files in `public/figuras/` load.
- Tables: Markdown tables.
- «Agregados culturales»: a bulleted list under that heading; each bullet becomes
  a card.
- Problem boxes: `[[collection:<slug>:ejercicios]]` (EJERCICIOS, with hints),
  `[[collection:<slug>:practice]]` (PRACTICA) and
  `[[collection:<slug>:dificiles]]` (RETO).
- Problems picked one by one: `[[problems:TP-A01,TP-G08:ejercicios]]` (up to 20
  codes, in the order shown; the kind is `ejercicios`, `practice` or
  `dificiles`). Same box as a collection, but it needs no `ProblemCollection` in
  the database: the page loads those codes with `GET /api/collections?codes=…`.
  Codes that are not public are left out.

**Editing on the site:** editors and admins change a lesson on
`/panel/teoria/:id/editar` («Editar lección»). The text stays this markup, but
each box, heading and formula is colored the way it looks on the page. The
toolbar above the text inserts the markup at the cursor, or around the selected
text: «Bloque» (every block above, plus a figure and a table), «Título» (`##` or
`###`), «Problema» (searches the problem bank and inserts a
`[[problems:…]]` box) and «$ LaTeX». The preview next to it uses the lesson
renderer, with the real problem boxes. See [ROLES.md](ROLES.md).

Each block has one fixed look; authors never style boxes by hand. The parser is
`src/lib/theoryArticle.js` and the boxes are in `src/components/content/`.
Run `npm run dev` and open `/dev/teoria-prueba` to see every block.
The look of each box is in [DESIGN.md](DESIGN.md#5-theory-content-blocks-one-style-per-type).

Rules:

- Exercises and problems live in the problem bank. A lesson only shows a box that
  points to them (a `ProblemCollection`). Exercises have hints; the other boxes
  link to the problem page.
- Every geometry argument gets a figure (an SVG in `public/figuras/`, with alt
  text), placed just before the paragraph that uses it.
- Everything a visitor sees is in Spanish (Mexico).

## Lists and exams

Both are ordered lists of references to problems in the bank; they never copy a
problem. A list can instead link to an external resource (e.g. the IMO problem
archive). Exams also have metadata (competition, year, round, duration,
instructions). Exam folders (e.g. Exámenes › OMM › 2024) are explained in
[SUBMISSIONS.md](SUBMISSIONS.md#exam-folders).

## Rutas

A Ruta (`Path`) is a guided order through existing material:

- A Path contains **either** other Paths **or** Steps, never both.
- A Step has a title, instructions and references to content.
- The same Path can appear in several Rutas. Completing it once counts everywhere.
- Progress counts each leaf Path once and never locks content.
- The OMM Ruta (`server/src/data/ommCurriculum.js`) has Preparación and five
  ciclos (`PathSection`s). Unfinished parts show «Próximamente» instead of empty
  lessons; their Paths stay as drafts.
- A Ruta whose only step is one lesson opens the lesson page directly, with the
  «En la Ruta» strip.
