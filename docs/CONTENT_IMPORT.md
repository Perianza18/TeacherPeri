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
   the lessons that will change, the problems it will add and the collections it
   will create. Nothing is written.
3. Set `REVISION_DATABASE_CONFIRM` to the exact database name and run
   `npm run content:revise-theory -- --apply`.
4. Run the dry run again: every line should say «already up to date» or list nothing.

Compare-and-set: a lesson changes only while it holds the exact previous text and
summary (or already holds the new ones); its Ruta description likewise. Problems and
collections are created only when missing, and an existing one with different
content stops the run. Any conflict stops the whole run before writing; the writes
happen in one transaction. After a revision, `content:import -- --dry-run` reports
only `keep`. A fresh database gets everything from `content:import`.

With the private Atlas file, `npm run atlas:revise-theory:test` and
`npm run atlas:revise-theory:prod` (add `-- --apply` to write) set steps 1 and 3
for you (see [DEVELOPMENT.md](DEVELOPMENT.md#atlas-scripts)).

**Edits made on the site.** Editors can change a lesson on
`/panel/teoria/:id/editar`. A lesson changed there no longer holds the exact
previous text, so a later `content:revise-theory` run stops on it instead of
overwriting the editor's work. Copy the site's change into the lesson file first
(`/panel/cambios` shows the before and after), then run it again.

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
