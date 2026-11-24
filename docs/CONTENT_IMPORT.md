# MVP content import

English · **[Español](es/CONTENT_IMPORT.md)**

`npm run content:validate` validates all source math with strict KaTeX, publication
structure and canonical references. `content:import` is independent of legacy
reset/backfill commands. It contains no deletes, resets or production URI defaults.

## Contract

- Stable deterministic ObjectIds for new release objects; natural identity lookup
  reuses existing IDs (Problem code, Path slug, Theory/List title, exam metadata,
  parent/child edge, Path/order Step).
- The same Problem ID is referenced in Steps, Lists and Exams. No exam creates
  copies of Problems. Original hints and solutions live on the canonical Problem.
- Ambiguous identities, unrelated existing fields, edited content and incompatible
  structure abort preflight. Exact checked-in draft Paths/Theory can be promoted;
  independently edited drafts and conflicting old Steps require editorial review.
- Existing unrelated records, users, comments and completions remain untouched.
- All content writes and publication occur in one MongoDB transaction. A failure
  rolls back the content changes; successful identical reruns report only `keep`.
  Empty collection/index creation may precede the transaction; it writes no content.
- MongoDB Atlas or a replica set is required to apply. A standalone server refuses
  before content writes. Dry-run works on either and disables automatic collection
  and index creation.
- URI credentials never appear in command output. The CLI does not expose raw
  driver errors. Use a private environment file or host secret configuration.

## Commands

For a local standalone MongoDB, first follow [LOCAL_MVP.md](LOCAL_MVP.md) to start
an isolated replica set without reconfiguring your existing instance. A successful
dry-run reports planned changes, not imported data. `npm run content:check` checks
the application's `MONGO_URI` for the published OMM root without writing data.

1. Set `MONGO_CONTENT_IMPORT_URI` privately, with an explicit database path.
   It never falls back to `MONGO_URI`. System database names are rejected.
2. Run `npm run content:import -- --dry-run`. Review create/promote/keep counts.
3. Set `CONTENT_IMPORT_CONFIRM` to the exact database name and run
   `npm run content:import -- --apply`.
4. Run dry-run again. For an unchanged release expect `create:0`, `promote:0`.
5. Browse the OMM root, a leaf's Steps and all four libraries before deploying.

Take a backup before any import into a database with existing valuable content.
If a conflict occurs, review its natural identity with local development tools;
do not delete records or run a reset to silence it. This release deliberately
refuses to overwrite independent editorial work. Content changes in a later
release need an explicit reviewed migration; the importer is not a generic editor.

## Revising rewritten theory lessons

Lessons rewritten in the new lesson format live in `server/src/data/theory/`, one
file per lesson: the new summary and text, the new banco problems it introduces and
the problem collections its boxes point to (`[[collection:<slug>:<kind>]]`).
`mvpLessons.js` applies them as the last layer and keeps the exact previous text in
`PREVIOUS_THEORY`. Figures are SVG files in `public/figuras/`.

A database that already holds the imported content is updated with
`content:revise-theory`, not with the importer:

1. Set `MONGO_REVISION_URI` privately, with an explicit database path. It never
   falls back to `MONGO_URI`.
2. Run `npm run content:revise-theory` (dry run). It names the database and lists
   the lessons that will change, the new lessons it will create, the lessons it
   will skip because they were edited on the site, the problems it will add and the
   collections it will create. Nothing is written.
3. Set `REVISION_DATABASE_CONFIRM` to the exact database name and run
   `npm run content:revise-theory -- --apply`.
4. Run the dry run again: every line should say «already up to date» or list nothing.

Each lesson is decided on its own, and nothing is ever overwritten silently:

- **Rewritten lessons** (they have a previous text): the text, summary and Ruta
  description change only while they hold the exact previous version, or an earlier
  published rewrite listed in `server/src/data/theory/earlier.js`. When a lesson that
  is already published gets corrected in its file, add the published version to
  `earlier.js` (never edit an entry).
- **New lessons** (no previous text; the file sets `lesson: { title, area, level }`,
  for example the Ciclo 2 lessons): the run creates the lesson, its four Steps, its
  problems and boxes, and publishes its Ruta and the draft groups above it, as long
  as those Rutas still hold the checked-in draft.
- **Edits made on the site.** Editors can change lessons on
  `/panel/teoria/:id/editar`. A lesson whose live records hold anything else is
  **skipped**, and the others go ahead. The dry run prints, for each skipped lesson,
  the lines that differ and a 12-character fingerprint of what it holds. Either copy
  the site's change into the lesson file (`/panel/cambios` shows the before and
  after) and run again, or, after reviewing the difference, replace that exact live
  version with `--accept-live <lesson-slug>@<fingerprint>` (repeat it for each
  lesson). If the lesson changes again after the dry run, its fingerprint changes and
  the acceptance no longer applies. A skipped lesson's own problems and boxes wait
  with it.
- **Problems and boxes** are only added. One that exists with different content
  (edited on the site) is reported and left as it is.

The writes happen in one transaction, each with a compare-and-set filter: if a record
changes between the plan and the write, nothing is written. After a complete
revision, `content:import -- --dry-run` reports only `keep`. A fresh database gets
everything from `content:import`.

With the private Atlas file, `npm run atlas:revise-theory:test` and
`npm run atlas:revise-theory:prod` (add `-- --apply` to write, and any
`--accept-live` options) set steps 1 and 3 for you (see
[DEVELOPMENT.md](DEVELOPMENT.md#atlas-scripts)). Suggested order: merge the pull
request first so the figures are deployed, then run on the test database, then a dry
run on production, reviewed before `--apply`.

## Importing official exam problems

`content:import-exams` loads official exam problems (first used for the OMM
regional exams: Sureste, Occidente and Centro) from a folder of prepared files,
one JSON file per exam, plus their figures in `figures/`. The files are kept
outside the repository; the script is in
`server/src/scripts/import-exam-problems.js`, which describes the record format.

- Each exam goes into the folder `Exámenes › <competition> › <round> › <year>`
  (for example `Exámenes › OMM Regional › Sureste › 2024`); missing folders are
  created as approved folders.
- Problems use existing tags, áreas and subtopics only. An unknown one stops the
  run: the script never creates a tag or a topic.
- Figures (SVG drawn to the `Figura` rules, or a PNG crop) are stored like any
  uploaded image: WebP, at most 1200 px wide, with Spanish alt text.
- Folders, problems and figures are written in one transaction; then the same
  exam sync the site uses creates or updates the exam cards on Exámenes.
- Ids are stable, so a second run reports every problem as already there. A code
  that already holds a different statement stops the run.

1. Set `MONGO_EXAM_IMPORT_URI` privately, with an explicit database path.
2. Run `npm run content:import-exams -- <folder>` (dry run). It lists the folders,
   problems and figures it would create. Nothing is written.
3. Set `EXAM_IMPORT_CONFIRM` to the exact database name and add `--apply`.
4. Run the dry run again: it should create nothing.

With the private Atlas file, `npm run atlas:import-exams:test -- <folder>` and
`npm run atlas:import-exams:prod -- <folder>` (add `--apply` to write) set
steps 1 and 3 for you.

## Included content and sources

37 Spanish Theory lessons, 56 original Problems (20 of them from the rewritten lessons), six lesson problem collections, six canonical problem Lists,
three attributed external resources, three original practice Exams and the
five-cycle curriculum structure. Only preparation/Ciclo 1 and two congruence
leaves of Ciclo 2 are published. Future cycles retain draft Paths and title-only
previews at the OMM root; pending Group Paths remain unpublished.

External resources were checked on 2026-10-10: OMM (`ommenlinea.org`), IMO official
problem archive (`imo-official.org/problems/`) and NRICH (`nrich.maths.org`). Their
material remains at the publisher's site. The legacy third-party problem fixture
is excluded from this import. The practice Exams are TeacherPeri originals and
are not represented as official OMM papers or complete national-level simulations.
