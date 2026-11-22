# Features

English · **[Español](es/FEATURES.md)**

Everything TeacherPeri does today or aims to do. Each feature has a status:

- **Done:** live on https://teacherperi.vercel.app.
- **In progress:** being built; the note says where (branch or pull request).
- **Partial:** part of it is live; the note says which part.
- **Planned:** agreed, not started. **Today** says what the site does instead.

Update this file, and [es/FEATURES.md](es/FEATURES.md), in the same pull request
that changes a feature (see [CONTRIBUTING.md](CONTRIBUTING.md)).

_Last updated: 2026-11-22._

## Inicio (home)

| Feature | Status | Notes |
| --- | --- | --- |
| Home page: mission, «¿Cómo empiezo?», links to every section | Done | |
| «Problema del día» | Done | Picks a problem by the date in Mexico City. Shows the statement, never a title |
| Thanks to collaborators on Inicio | Planned | **Today:** `/colaboradores` is a «Próximamente» page that no menu links to |

## Rutas (study paths)

A Ruta is an ordered path through existing material. See
[CONTENT.md](CONTENT.md#rutas) for how it works.

| Feature | Status | Notes |
| --- | --- | --- |
| Rutas page with search and tag filter | Done | `/rutas` |
| Ruta pages: breadcrumbs, «En la Ruta» strip, previous and next step | Done | The address follows the path you took, e.g. `/rutas/preparacion-para-la-omm/...` |
| Mark a step complete; progress of parent Rutas | Done | Signed-in users only. Progress never locks content |
| OMM Ruta: Preparación (18 lessons) and Ciclo 1 (17 lessons) | Done | |
| OMM Ruta: Ciclo 2 | Partial | 2 of 13 lessons are live (modular arithmetic and linear congruences). The rest show «Próximamente» |
| OMM Ruta: Ciclos 3–5 | Planned | **Today:** their titles show «Próximamente» |
| Follow a Ruta, save it for later | Planned | Part of Mi Espacio. **Today:** only completed steps are saved; lessons can be saved to personal lists |
| Universidad Ruta (applying to universities in the US and Canada) | Planned | Will use the same Ruta engine. **Today:** `/estudia-en-el-extranjero` is a «Próximamente» page («Universidad» in the footer) |

## Entrenamiento (libraries)

| Feature | Status | Notes |
| --- | --- | --- |
| Problemas: search, filters (área › subtema, exam folder), pagination | Done | 56 problems. A problem opens in a window with its comments |
| Simpler library filters: «Palabras clave» and Área › subtema | Done | Problemas, Teoría and Listas show one card: a keyword box that ignores accents and capitals (it also searches statements, tags and subtema names, and offers matching subtemas as shortcuts), then the 4 áreas as tiles; choosing one opens its subtemas. «Otros temas» holds «Cómo entrenar», «Demostraciones»… when they have items. Exam folders stay under «Buscar por examen o carpeta». The «Tema curricular», «Etiqueta», «Nivel», «Año», «Colección» filters are gone. The API takes `?area=<name>` (matches the Topic tree or the older `tema`) and `GET /api/topics/counts` |
| Problemas: hints (each behind its own toggle) and solutions | Done | |
| Problem page with a stable link | Done | `/entrenamiento/problemas/:id` |
| Exam folder tree (e.g. Exámenes › OMM Estatal › Jalisco › 2023), usable as a filter | Done | The tree, the «Carpeta o examen» filter and new folders proposed by users work. «Exámenes» holds OMM, OMM Estatal, OMMEB, Centroamericana, Iberoamericana, IMO and «Prácticas TeacherPeri» with the 3 practice exams (14 problems); added on the live database on 2026-11-21 |
| Teoría: 37 lessons with math, examples and practice | Done | |
| Teoría: new lesson format (definitions, theorems, figures, exercise boxes) | Partial | The renderer is live and 2 lessons use it («Ángulos, paralelas y perpendiculares», «Principio de casillas»). The other 35 still use the older format |
| «Sugerir un cambio» and «Reportar» on lessons | Done | Same two actions as on problems (see below) |
| Exámenes: 3 practice exams | Done | Original TeacherPeri practice, not official OMM papers |
| Exámenes: one exam per exam folder, built from its problems | Done | Each exam folder that holds published problems gets one exam on Exámenes, titled from the folder path («OMM 2024», «OMM Estatal 2023 · Jalisco»), with its problems in number order (no number goes last). It updates by itself when a problem is approved (site or `npm run review`), moved, renumbered, deleted or restored, or a folder is renamed; an exam with no problems left is unpublished, not deleted. The 3 practice exams are not touched. `npm run atlas:sync-exams:<test\|prod>` fills in folders that already had problems. See [SUBMISSIONS.md](SUBMISSIONS.md#exam-folders-on-the-exámenes-page) |
| Images in problems (geometry) | Done | Up to 4 per problem, each with a required Spanish description. Users add them when proposing; editors and admins see them in Revisión; editors add, replace or remove them (statement or solution). The description can use $…$ math: writers see a live preview, reviewers see it rendered next to each image, and the page never shows it (the `alt` text gets a plain version). Stored in MongoDB as WebP (max 1200 px), about 12 KB per figure. See [SUBMISSIONS.md](SUBMISSIONS.md#images-in-problems) |
| Global search across all libraries | Planned | **Today:** each library has its own search |
| Visual refresh of Inicio, Rutas, Entrenamiento, Listas, Contacto and lessons («cómic» style, penguin logo) | Done | Pull requests #18, #20 and #21 |

## Listas

| Feature | Status | Notes |
| --- | --- | --- |
| Curated lists inside Entrenamiento, in two tabs | Done | «Listas» (`/entrenamiento/listas`): the 6 TeacherPeri problem lists, with search and filters. «Recursos externos» (`/entrenamiento/recursos`): the 3 links to other publishers (OMM, IMO, NRICH), with search only. The main menu no longer has «Listas»; old `/listas` links redirect |
| Personal lists («Guardar en lista») | Done | On problem pages, the problem window and lessons: tick your lists or create one. Private unless marked «Pública»; rename, make public or private, delete from Mi Espacio › Listas; one list at `/perfil/<username>/listas/<id>`. Problems and lessons only; Experiencias posts and other content come later. See [PROFILES.md](PROFILES.md#lists-guardar-en-lista) |

## Community

| Feature | Status | Notes |
| --- | --- | --- |
| Comments on problems: replies up to 3 levels, math with `$...$`, role badges | Done | Shown in the problem window and, since Mi Espacio, on the problem page too. Each comment has a link (`#comentario-<id>`) that scrolls to it and highlights it. Usernames link to profiles |
| Report a comment; delete a comment with a reason | Done | Authors delete their own comments. Editors and admins delete any comment and must give a reason |
| «@ Mencionar» and «Enlazar problema» buttons in the comment box | Planned | **Today:** the comment box has only the «$ LaTeX» button |
| Figures in comments | Planned | **Today:** text and math only |
| Propose a problem (statement, áreas, tags, optional exam folder and number) | Done | `/entrenamiento/problemas/proponer`. Goes live only after an admin approves it. See [SUBMISSIONS.md](SUBMISSIONS.md) |
| Propose an exam folder | Done | Only its author sees it until an admin approves it |
| «Mis envíos»: see, edit and delete your proposals | Done | `/mis-envios`, in the avatar menu |
| Credit on approved problems («Propuesto por @usuario») | Done | |
| «Sugerir un cambio» and «Reportar» on problems and lessons | Done | «Sugerir un cambio» is a content correction (wrong answer, typo, missing case): a message of 10–1000 characters that goes to Revisión. «Reportar» is for inappropriate content (same reasons as reporting a comment) and goes to Moderación. Signed-in users only; one open of each per person and page. Suggestions sent earlier as «Reportar un error» appear in Revisión as suggestions, with no migration |
| In-site notifications (proposal approved or rejected) | Done | In the avatar menu |
| Automatic review when a problem is proposed | Planned | **Today:** automatic checks run when saving; an editor or admin approves or rejects on `/panel/revision` (or with `npm run review`) |
| Moderation page for reports of inappropriate content | Done | `/panel/moderacion`, editors and admins. Only reports: comments, and problems and lessons reported with «Reportar». A reported problem or lesson links to the page and to «Editar», and is marked resolved or dismissed with an optional note. Reported comments are dismissed with a note, or deleted with a reason. Filters: open, resolved, dismissed. Content corrections are not here: they go to Revisión |
| Suggest changes to official problems and lessons | Done | «Sugerir un cambio» (message only). Editors and admins see them in Revisión, open «Editar problema» or «Editar lección» from there, and mark each one «Aplicada» or «Descartar» with an optional note |
| Follow other users | Done | «Seguir» / «Siguiendo» on a profile; follower and following lists on each profile. No notification for new followers yet |
| Threads (a forum separate from problem comments) | Planned | **Today:** discussion happens only in the comments under each problem |

## Accounts and roles

| Feature | Status | Notes |
| --- | --- | --- |
| Sign up and log in with email and password | Done | |
| Three roles: User, Editor, Admin | Done | See [ROLES.md](ROLES.md). Accounts saved with the old six roles are read as the new ones |
| Editor screens: see every report, edit any problem or lesson | Done | «Panel del equipo» in the avatar menu (`/panel`). «Editar problema» on a problem page opens `/panel/problemas/:id/editar` (title, statement, hints, solution, áreas, tags, exam folder and number, with live math preview). «Editar lección» on a lesson opens `/panel/teoria/:id/editar` (title, summary and lesson text, with the real lesson renderer as preview, including its problem boxes). The lesson text is still plain markup, but each box, heading and formula is colored the way it looks on the page. A toolbar above it inserts markup at the cursor or around the selection: «Bloque» (every box, plus Figura and Tabla), «Título» (section or subsection), «Problema» (searches the problem bank and inserts a box with the chosen problems) and «$ LaTeX». Changes publish at once; each save records who, when and every field before and after |
| Review screen (editors and admins) and admin screens | Done | `/panel/revision`, editors and admins: every proposal in one list, with a «Todo / Problemas / Teoría / Carpetas» filter. Approve problems (fixing title, áreas, tags, exam folder or number first) or reject with a reason; approve, rename or reject proposed exam folders; close suggestions. Same logic as `npm run review`, which still works. Every decision shows in «Cambios de editores»; when an editor takes it, admins get a notification. Admins only: `/panel/usuarios`: give or remove the Editor role; nobody becomes admin from the site and the last admin keeps the role |
| Admins notified when an editor changes something | Done | In-site notification to every other admin («@edith editó TP-M03 «…»: pistas»), linking to `/panel/cambios/:id` with the before and after of each field. `/panel/cambios` lists every change |
| Sign in with Google | Planned | |
| Email verification | Planned | Needs an email service and our own domain |

## Mi Espacio (personal area)

| Feature | Status | Notes |
| --- | --- | --- |
| Profile page `/perfil/<username>` («Mi Espacio» in the avatar menu) | Done | Profile card, «En números» and tabs: Actividad, Comentarios, Listas, Mis envíos, Insignias. Visitors see only Comentarios, Listas and Insignias. The email, Actividad, Mis envíos and private lists are only sent to the owner by the server. See [PROFILES.md](PROFILES.md) |
| «Editar perfil»: preset avatars and a short description | Done | 12 preset avatars (no uploads) and up to 160 characters. Shown in the navbar, on comments and in follower lists |
| «Lo resolví» on problems | Done | The student marks a problem solved (nothing checks the answer). Counts as «problemas resueltos» |
| Earned badges | Done | Problems solved (1/10/50), comments (1/10/50), accepted problems (1/5/20), applied suggestions (1/5/20), and Editor/Admin. Never taken away. See [PROFILES.md](PROFILES.md#lo-resolví-and-badges) |
| Followed Rutas, «continue where you left off» | Planned | **Today:** Actividad lists your recent comments, saves, solves, proposals and suggestions |

## Other pages

| Feature | Status | Notes |
| --- | --- | --- |
| Recursos: external resources by category | Done | `/recursos`. No menu links to it yet. A tag filter is planned |
| Contacto | Partial | The contact form works for signed-in users. The «Correo» link and the Instagram and LinkedIn icons below it still point to placeholder addresses |
| Colabora (how to collaborate) | Planned | **Today:** use Contacto |
| Experiencias (blog by past olympians) | Planned | **Today:** «Próximamente» page |
| Equipo (team page) | Planned | **Today:** «Próximamente» page |
| Sobre mí | Planned | **Today:** «Próximamente» page, linked from Inicio and the footer |

## Site and hosting

| Feature | Status | Notes |
| --- | --- | --- |
| «Cómic refinado» design system | Done | Colors, fonts and shared styles in `src/index.css`. Rules in [DESIGN.md](DESIGN.md) |
| Works on phones (375 px and up) | Done | |
| Hosting: Vercel (website), Render (API), MongoDB Atlas (database) | Done | See [DEPLOYMENT.md](DEPLOYMENT.md) |
| Own domain | Planned | **Today:** teacherperi.vercel.app |
