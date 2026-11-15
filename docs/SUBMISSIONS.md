# Community submissions, exam folders and error reports

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
message). One open flag per person per page. Editors and admins list them with
`GET /api/flags` and close them with `POST /api/flags/:id/status`, or with the
review script.

## Review (admins)

Approving and rejecting are not API endpoints. They run through
`npm run review` (`server/src/scripts/review-submissions.js`), which uses the
functions in `server/src/lib/review/service.js` (they can later run
automatically after an upload):

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
The author gets an in-site notification when a submission is approved or rejected.

## Migration

`npm run db:migrate:roles-users` (dry run by default; `--apply` needs
`MONGO_MIGRATION_TARGET_URI` and `MIGRATION_TARGET_CONFIRM`) rewrites legacy role
values, creates «Exámenes», «OMM» and «OMM Estatal», and files the problems of
the existing practice exams into «Exámenes › Prácticas TeacherPeri › <round>».
It is additive and idempotent.
