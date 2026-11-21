# Community submissions, exam folders and error reports

English · **[Español](es/SUBMISSIONS.md)**

Signed-in users (role `user` and up, see [ROLES.md](ROLES.md)) can propose
problems, propose exam folders and report errors. Nothing they send is public
until an admin reviews it.

## Problems

- **Propose:** `/entrenamiento/problemas/proponer`. Statement only (KaTeX with
  `$…$` and `$$…$$`), áreas and tags picked from the existing vocabulary
  (Topics and Tags; «Original TeacherPeri» is reserved for staff), and optionally
  «Es un problema de examen» with a folder and a problem number.
- **Stored as:** a `Problem` with `author` and `publicationStatus: draft`, plus a
  `ProblemSubmission` (`kind: create`, `status: pending`) holding the proposal.
  Code `U-00001`, title, year, área and collection are filled automatically
  (exam problems take title and year from their folder).
- **Edit:** a draft is updated in place. A published problem keeps its approved
  version public; the change waits as a `ProblemSubmission` (`kind: edit`). There
  is at most one pending submission per problem.
- **Delete:** soft delete (`deletedAt`, `publicationStatus: archived`); pending
  submissions become `withdrawn`. An admin can restore it.
- **«Mis envíos»** (`/mis-envios`, avatar menu) lists the person's problems with
  their state: en revisión, publicado, rechazado (with the reason), or publicado
  with changes in review.
- **Checks** (`server/src/lib/review/checks.js`) run when saving and again at
  review: statement length, KaTeX rendering, unbalanced `$`, vocabulary, exam
  folder, duplicates and near duplicates, links, repeated characters and all caps.
  Errors block saving; warnings are for the reviewer.

## Exam folders

Exam folders are `Category` documents with `kind: exam` under one root,
«Exámenes» (created on first use). Example: `Exámenes › OMM Estatal › Jalisco ›
2023`. Users may create a subfolder under any folder they can see; it stays
`pending` and only its author sees it until it is approved. Sibling names are
unique ignoring case and accents. Because they are Categories, choosing a folder
in the Problemas filter includes everything below it.

## Error reports (flags)

«Reportar un error» on a problem or a theory page stores a `Flag` (page, person,
message). One open flag per person per page. Editors and admins handle them on
`/panel/moderacion` (resolve or dismiss, with an optional note), which uses
`GET /api/flags` and `POST /api/flags/:id/status`; the review script works too.

## Review (admins)

**On the site:** `/panel/revision` («Revisión» in «Panel del equipo»). Each
proposal shows its automatic checks; «Revisar» opens it, where the admin can fix
the title, áreas, tags, exam folder and number before «Aprobar y publicar», or
write a reason and «Rechazar». Proposed exam folders can be approved, renamed or
rejected. The page calls `/api/review` (admins only), which runs the same
functions in `server/src/lib/review/service.js` as the script, always applied,
with the signed-in admin as reviewer.

**From a terminal:** `npm run review` (`server/src/scripts/review-submissions.js`)
uses the same functions (they can later run automatically after an upload).
With the private Atlas file, `npm run atlas:review:test -- <command>` and
`npm run atlas:review:prod -- <command>` run it without typing the address
(see [DEVELOPMENT.md](DEVELOPMENT.md#atlas-scripts)):

```sh
npm run review -- list                                   # pending problems and folders, open flags
npm run review -- show U-00001                           # full detail; for edits, what changes
npm run review -- approve U-00001 --as <admin> --topics "Álgebra" [--tags "…"] [--folder "OMM › 2024" | --not-exam] [--number 3] [--title "…"] [--difficulty basico] [--attribution "…"]
npm run review -- reject U-00001 --as <admin> --reason "Lo que debe corregir"
npm run review -- folders | approve-folder <id|path> | reject-folder <id|path> --reason "…" | rename-folder <id|path> --name "…"
npm run review -- flags | resolve-flag <id> [--note "…"] | dismiss-flag <id> [--note "…"]
npm run review -- deleted | restore U-00001
```

Changing commands are a dry run by default (or with `--dry-run`) and print what
would change. `--apply` writes and needs `REVIEW_DATABASE_CONFIRM` equal to the
database name. The target comes only from `MONGO_REVIEW_URI`, which must name
the database; the script never prints it. `--as` must be an admin account in
that database. Approving a problem in a pending folder approves that folder too.
An approved problem is credited «Propuesto por @usuario» (after the exam path for
exam problems); `--attribution` replaces it. The author gets an in-site
notification when a submission is approved or rejected.

## Migration

Applied to the `teacherperi` test database on 2026-11-21 with
`npm run atlas:migrate:test -- --apply`; the live database runs
`npm run atlas:migrate:prod -- --apply`.

`npm run db:migrate:roles-users` (dry run by default; `--apply` needs
`MONGO_MIGRATION_TARGET_URI` and `MIGRATION_TARGET_CONFIRM`) rewrites legacy role
values, creates «Exámenes» with the empty folders «OMM», «OMM Estatal», «OMMEB»,
«Centroamericana», «Iberoamericana» and «IMO», and files the problems of
the existing practice exams into «Exámenes › Prácticas TeacherPeri › <round>».
It is additive and idempotent.
