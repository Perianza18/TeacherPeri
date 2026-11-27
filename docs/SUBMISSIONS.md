# Community submissions, exam folders and error reports

English · **[Español](es/SUBMISSIONS.md)**

Signed-in users (role `user` and up, see [ROLES.md](ROLES.md)) can propose
problems, propose exam folders and report errors. Nothing they send is public
until an admin reviews it.

## Problems

- **Propose:** `/entrenamiento/problemas/proponer`. The statement (KaTeX with
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

Up to 4 images may go with the statement (see [Images in problems](#images-in-problems)).

## Solution (optional)

The author may add a solution or just the final answer (`solution`, up to
20 000 characters, with `$…$` formulas checked like the statement). It goes
through review with the rest of the proposal and, once approved, becomes the
problem's «Solución». A proposal without one leaves the live solution as it is.

## Tema

The form never says «área» or «etiqueta»: the section is «Tema». It asks first
«¿De qué tema es?» with the four big temas, which are the áreas (Geometría,
Álgebra, Teoría de Números, Combinatoria; one or more), then optional temas (subtemas of the chosen áreas)
and an optional técnica de demostración (children of «Demostraciones»). Tags are only offered on staff screens.
Picking a subtema also marks its área. The same name can exist under two áreas
(«Combinatoria › Caminos» and «Álgebra › Caminos»), so the form always shows the
área next to a subtema.

The search also matches other names: the common ones live in
`server/src/data/topicAliases.js` (by tema name, so «palomar» finds «Principio
de casillas» in any área), plus the `aliases` stored on each `Topic`.

«Crear tema» proposes a subtema under an área (`POST /api/submissions/topics`).
It stays `pending` and only its author sees it. If the área already has a tema
with that name or other name, the server answers 409 with the existing one so
the form can offer it. In Revisión › Temas an editor approves it, renames it,
joins it with an existing tema (the proposed name becomes another name of that
tema, and pending problems switch to it) or rejects it (it is removed from
pending problems). A problem cannot be approved while one of its temas is
still pending.

## Exam folders

Exam folders are `Category` documents with `kind: exam` under one root,
«Exámenes» (created on first use). Example: `Exámenes › OMM Estatal › Jalisco ›
2023`. Users may create a subfolder under any folder they can see; it stays
`pending` and only its author sees it until it is approved. Sibling names are
unique ignoring case and accents. Because they are Categories, choosing a folder
in the Problemas filter includes everything below it.

## Exam folders on the Exámenes page

The Exámenes page groups published exams by their exam-folder path, hiding empty
main folders. Each competition, including «OMM Estatal», is a main folder. Year
folders that contain exams directly are displayed as exam cards without an extra navigation
step; other subfolders appear as folder cards. For example, published exams in
`OMMEB › 2024` appear as exam cards inside «OMMEB» without a code change. The
hand-made TeacherPeri exams appear under «TeacherPeri Originals», ordered by year.

The folder and `problemNumber` of each problem are the source of truth; the
`Exam` documents on Exámenes follow them (`server/src/lib/examSync.js`).

- Every exam folder that holds published problems has one published `Exam` whose
  `categories` include that folder. It is created when the first problem lands
  there. Its title comes from the folder path: the year is the name that looks
  like a year, the competition is the first other name, the rest is the round
  (`OMM › 2024` → «OMM 2024»; `OMM Estatal › Jalisco › 2023` → «OMM Estatal
  2023 · Jalisco»).
- Problems are in `problemNumber` order; problems without a number go last.
- It is kept in sync on approval (site and `npm run review`), when an editor
  changes the folder or number, when a problem is deleted or restored, and when a
  folder is renamed. An exam left with no problems is set to `draft`, never
  deleted.
- Hand-made exams are left alone: an exam whose `categories` hold no exam folder
  (the 3 TeacherPeri practice exams) keeps its own list, and a folder whose
  problems such an exam already lists gets no second exam.
- Backfill for problems already in folders: `npm run atlas:sync-exams:test` (or
  `:prod`) prints what it would create; add `-- --apply` to write. A second run
  changes nothing. Locally: `MONGO_EXAM_SYNC_URI=… npm run db:sync:exam-folders`.

## Suggestions and reports on problems and lessons

Every problem and lesson page has two actions for signed-in users:

| Action | What it is for | Stored as | Goes to |
| --- | --- | --- | --- |
| «Sugerir un cambio» | A content correction: wrong answer, typo, missing case. A message of 10–1000 characters | `Flag` (`POST /api/flags`) | Revisión |
| «Reportar» | Inappropriate content: spam, offensive, personal data… Same reasons as reporting a comment («otro» needs a note) | `ContentReport` (`POST /api/reports/content`) | Moderación |

One open suggestion and one open report per person per page. Every `Flag` is a
suggestion, including the ones sent before as «Reportar un error», so nothing
needed a migration.

- **Suggestions** are listed with `GET /api/flags` and closed with
  `POST /api/flags/:id/status` (`resolved` is shown as «Aplicada», `dismissed` as
  «Descartada», with an optional note). The review script works too
  (`npm run review -- flags | resolve-flag | dismiss-flag`).
- **Reports** are listed with `GET /api/reports/content` and closed with
  `POST /api/reports/content/:id/status` (resolved or dismissed, with an
  optional note). Comment reports keep their own routes (`/api/reports`).

## Proposed solutions, points and frames

- **«Proponer una solución»** sits under the official solution of every
  published problem. Signed-in users write a solution (20–20 000 characters,
  `$…$` formulas checked like the statement, with a live preview). It is stored
  as a `SolutionProposal` (`POST /api/solutions`), one pending per person per
  problem; many people may propose for the same problem.
- **Review:** Revisión › «Soluciones propuestas» (`GET /api/solutions/pending`,
  `POST /api/solutions/:id/approve | reject`, permission `solutions:review`).
  Rejecting needs a reason the author reads. Both are recorded in «Cambios de
  editores» and the author gets a notification with a link to the problem.
- **Published:** accepted solutions appear under «Soluciones de la comunidad»
  (closed until opened), each credited «Solución de @usuario» with the author's
  avatar and frame (`GET /api/solutions/problem/:id`). The problem's own
  «Solución» never changes. The author sees their proposals in Mi Espacio ›
  Mis envíos and can withdraw a pending one (`DELETE /api/solutions/:id`).
- **Points** (`server/src/lib/levels.js`) only come from what the team accepted,
  so nobody climbs by pressing «Resuelto» or posting comments: accepted problem
  +30, accepted solution +25, applied suggestion +10. `lib/badges.js` recounts
  them and stores `User.points` whenever a profile or its badges are read and
  right after an approval or an applied suggestion.
- **Frames:** Lápiz (0), Bronce (30), Plata (100), Oro (250), Olímpico (500),
  drawn around the avatar everywhere it appears (`src/lib/frames.js`,
  `.tp-frame-*` in `src/index.css`). In «Editar perfil» a person picks any
  frame they have unlocked (`PUT /api/profiles/me { frame }`, 403 for a locked
  one); without a choice, or if they no longer reach it, the best one shows.
  Insignias shows the points, the progress to the next frame and how to earn
  points. Badges add «Soluciones aceptadas»: Primera solución (1), Solucionador
  (5), Maestro de soluciones (20).

- **Avatars bought with points:** five drawings cost points (Gato de traje 30,
  Gato pensando 40, Sabelotodo 50, Gato gamer 75, Gatito que se siente león
  100; `PREMIUM_AVATARS` in `server/src/lib/profile.js` and `src/lib/avatars.js`).
  `POST /api/profiles/me/avatars/:id` buys one if the balance (points earned
  minus points spent) covers it; the owner's profile returns `unlockedAvatars`
  and `level.balance`. Spending never lowers the frame. Only «π» is still
  offered among the math shapes, as the default for new accounts; accounts that
  had another shape show «π».

## Review (editors and admins)

**On the site:** `/panel/revision` («Revisión» in «Panel del equipo»), for
editors and admins. It lists new problems, changes to published problems,
proposed exam folders and suggestions, with a filter: «Todo», «Problemas» (new
problems, changes and suggestions on problems), «Teoría» (suggestions on
lessons) and «Carpetas». Each proposal shows its automatic checks; «Revisar»
opens it, where the reviewer can fix the title, áreas, tags, exam folder and
number before «Aprobar y publicar», or write a reason and «Rechazar». Proposed
exam folders can be approved, renamed or rejected. Each suggestion shows the
page (with a link), the person, the message and the date, a link to «Editar
problema» or «Editar lección», and «Aplicada» / «Descartar» with an optional
note. The page calls `/api/review` and `/api/flags`, which run the same functions
in `server/src/lib/review/service.js` as the script, always applied, with the
signed-in person as reviewer.

**History and notifications:** every decision (approve, reject, rename a folder,
close a suggestion), on the site or with the script, is recorded in «Cambios de
editores» (`ContentRevision` with `kind: review`, `server/src/lib/activity.js`).
When an editor takes it, every admin also gets a notification that links to it.
Restoring a deleted problem stays admin-only.

**From a terminal:** `npm run review` (`server/src/scripts/review-submissions.js`)
uses the same functions (they can later run automatically after an upload).
With the private Atlas file, `npm run atlas:review:test -- <command>` and
`npm run atlas:review:prod -- <command>` run it without typing the address
(see [DEVELOPMENT.md](DEVELOPMENT.md#atlas-scripts)):

```sh
npm run review -- list                                   # pending problems and folders, open flags
npm run review -- show U-00001                           # full detail; for edits, what changes
npm run review -- approve U-00001 --as <editor or admin> --topics "Álgebra" [--tags "…"] [--folder "OMM › 2024" | --not-exam] [--number 3] [--title "…"] [--difficulty basico] [--attribution "…"]
npm run review -- reject U-00001 --as <editor or admin> --reason "Lo que debe corregir"
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

Applied on 2026-11-21 to the `teacherperi` test database
(`npm run atlas:migrate:test -- --apply`) and to the live `teacherperi_prod`
database (`npm run atlas:migrate:prod -- --apply`); a second run on each changes
nothing.

`npm run db:migrate:roles-users` (dry run by default; `--apply` needs
`MONGO_MIGRATION_TARGET_URI` and `MIGRATION_TARGET_CONFIRM`) rewrites legacy role
values, creates «Exámenes» with the empty folders «OMM», «OMM Estatal», «OMMEB»,
«Centroamericana», «Iberoamericana» and «IMO», and files the problems of
the existing practice exams into «Exámenes › Prácticas TeacherPeri › <round>».
It is additive and idempotent.


## Images in problems

- **Who adds them:** anyone proposing a problem (under the statement), and editors
  and admins on `/panel/problemas/:id/editar` (under the statement or inside the
  solution). Up to 4 per problem, each with a required Spanish description (alt
  text, 5–300 characters). Editors and admins see them, with their descriptions, in Revisión.
- **Math in the description:** the description may use `$…$`. It is never shown
  on the page. Writers see a KaTeX preview under the field, and Revisión shows it
  rendered next to each image. The `alt` attribute gets plain text without `$`
  (`src/lib/mathAlt.js`: `\angle` → «ángulo», `^\circ` → «°», `\frac{a}{b}` →
  «a/b»; other commands keep their name). A lone `$` is refused like in the
  statement.
- **Upload:** `POST /api/images` with the file as the body. PNG, JPG or WebP up to
  5 MB, detected from the file's bytes (SVG and anything else is refused). The
  server turns it into WebP, at most 1200 px wide, without metadata (sharp).
- **Storage:** the `ProblemImage` collection in the same MongoDB database, never
  on Render's disk. A problem or proposal keeps `images: [{ image, alt, placement }]`.
  An upload nobody uses is deleted after a day; a picture removed from a draft or
  by an editor is deleted when nothing else uses it. Each person may keep at most
  12 unused uploads.
- **Serving:** `GET /api/images/:id`, public, `Cache-Control: max-age=31536000,
  immutable`. An image never changes: «Reemplazar» uploads a new one.
- **Space:** lesson-style geometry figures are stored at 10–15 KB each (12 KB on
  average, measured on the 9 figures in `public/figuras`), so a problem with one or
  two figures uses about 12–25 KB. The worst possible image (pure noise) is about
  385 KB.
