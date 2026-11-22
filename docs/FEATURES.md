# Features

English · **[Español](es/FEATURES.md)**

Everything TeacherPeri does today or aims to do. Each feature has a status:

- **Done:** live on https://teacherperi.vercel.app.
- **In progress:** being built; the note says where (branch or pull request).
- **Partial:** part of it is live; the note says which part.
- **Planned:** agreed, not started. **Today** says what the site does instead.

Update this file, and [es/FEATURES.md](es/FEATURES.md), in the same pull request
that changes a feature (see [CONTRIBUTING.md](CONTRIBUTING.md)).

_Last updated: 2026-11-21._

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
| Follow a Ruta, save it for later | Planned | Part of Mi Espacio. **Today:** only completed steps are saved |
| Universidad Ruta (applying to universities in the US and Canada) | Planned | Will use the same Ruta engine. **Today:** `/estudia-en-el-extranjero` is a «Próximamente» page («Universidad» in the footer) |

## Entrenamiento (libraries)

| Feature | Status | Notes |
| --- | --- | --- |
| Problemas: search, filters (área, tag, level, year, folder), pagination | Done | 56 problems. A problem opens in a window with its comments |
| Problemas: hints (each behind its own toggle) and solutions | Done | |
| Problem page with a stable link | Done | `/entrenamiento/problemas/:id` |
| Exam folder tree (e.g. Exámenes › OMM Estatal › Jalisco › 2023), usable as a filter | Done | The tree, the «Carpeta o examen» filter and new folders proposed by users work. «Exámenes» holds OMM, OMM Estatal, OMMEB, Centroamericana, Iberoamericana, IMO and «Prácticas TeacherPeri» with the 3 practice exams (14 problems); added on the live database on 2026-11-21 |
| Teoría: 37 lessons with math, examples and practice | Done | |
| Teoría: new lesson format (definitions, theorems, figures, exercise boxes) | Partial | The renderer is live and 2 lessons use it («Ángulos, paralelas y perpendiculares», «Principio de casillas»). The other 35 still use the older format |
| Local theory draft preview | In progress | Development only: `/dev/teoria-borrador/<lesson-slug>` renders rewrite data and collections without a database, with the lesson’s curriculum label |
| «Reportar un error» and «Sugerir cambio» on lessons | Done | «Sugerir cambio» opens Contacto |
| Exámenes: 3 practice exams | Done | Original TeacherPeri practice, not official OMM papers |
| Images in problems (geometry) | Done | Up to 4 per problem, each with a required Spanish description. Users add them when proposing; admins see them in Revisión; editors add, replace or remove them (statement or solution). Stored in MongoDB as WebP (max 1200 px), about 12 KB per figure. See [SUBMISSIONS.md](SUBMISSIONS.md#images-in-problems) |
| Global search across all libraries | Planned | **Today:** each library has its own search |
| Visual refresh of Inicio, Rutas, Entrenamiento, Listas, Contacto and lessons («cómic» style, penguin logo) | Done | Pull requests #18, #20 and #21 |

## Listas

| Feature | Status | Notes |
| --- | --- | --- |
| Curated lists on their own page | Done | `/listas`: 6 TeacherPeri lists and 3 external resources (OMM, IMO, NRICH). Old `/entrenamiento/listas` links redirect |
| Personal lists («Guardar en lista») | Planned | Part of Mi Espacio. **Today:** users cannot save problems or lessons |

## Community

| Feature | Status | Notes |
| --- | --- | --- |
| Comments on problems: replies up to 3 levels, math with `$...$`, role badges | Done | |
| Report a comment; delete a comment with a reason | Done | Authors delete their own comments. Editors and admins delete any comment and must give a reason |
| «@ Mencionar» and «Enlazar problema» buttons in the comment box | Planned | **Today:** the comment box has only the «$ LaTeX» button |
| Figures in comments | Planned | **Today:** text and math only |
| Propose a problem (statement, áreas, tags, optional exam folder and number) | Done | `/entrenamiento/problemas/proponer`. Goes live only after an admin approves it. See [SUBMISSIONS.md](SUBMISSIONS.md) |
| Propose an exam folder | Done | Only its author sees it until an admin approves it |
| «Mis envíos»: see, edit and delete your proposals | Done | `/mis-envios`, in the avatar menu |
| Credit on approved problems («Propuesto por @usuario») | Done | |
| «Reportar un error» on problems and lessons | Done | |
| In-site notifications (proposal approved or rejected) | Done | In the avatar menu |
| Automatic review when a problem is proposed | Planned | **Today:** automatic checks run when saving; an admin approves or rejects on `/panel/revision` (or with `npm run review`) |
| Moderation page for comment reports and error reports | Done | `/panel/moderacion`, editors and admins. Error reports link to the problem or lesson (and to «Editar»); each one is marked resolved or dismissed with an optional note. Reported comments are dismissed with a note, or deleted with a reason. Filters: open, resolved, dismissed |
| Suggest changes to official problems and lessons | Planned | **Today:** «Reportar un error», or «Sugerir cambio» on lessons, which opens Contacto |
| Follow other users | Planned | |
| Threads (a forum separate from problem comments) | Planned | **Today:** discussion happens only in the comments under each problem |

## Accounts and roles

| Feature | Status | Notes |
| --- | --- | --- |
| Sign up and log in with email and password | Done | |
| Three roles: User, Editor, Admin | Done | See [ROLES.md](ROLES.md). Accounts saved with the old six roles are read as the new ones |
| Editor screens: see every report, edit any problem or lesson | Done | «Panel del equipo» in the avatar menu (`/panel`). «Editar problema» on a problem page opens `/panel/problemas/:id/editar` (title, statement, hints, solution, áreas, tags, exam folder and number, with live math preview). «Editar lección» on a lesson opens `/panel/teoria/:id/editar` (title, summary and lesson text, with the real lesson renderer as preview). Changes publish at once; each save records who, when and every field before and after |
| Admin screens: review proposals, name editors | Done | `/panel/revision`: approve (fixing title, áreas, tags, exam folder or number first) or reject with a reason; approve, rename or reject proposed exam folders. Same logic as `npm run review`, which still works. `/panel/usuarios`: give or remove the Editor role; nobody becomes admin from the site and the last admin keeps the role |
| Admins notified when an editor changes something | Done | In-site notification to every other admin («@edith editó TP-M03 «…»: pistas»), linking to `/panel/cambios/:id` with the before and after of each field. `/panel/cambios` lists every change |
| Sign in with Google | Planned | |
| Email verification | Planned | Needs an email service and our own domain |

## Mi Espacio (personal area)

| Feature | Status | Notes |
| --- | --- | --- |
| Profile with public parts (username, avatar, role, badges, comments) and private parts (email, lists) | Planned | **Today:** the avatar menu has «Mis envíos», notifications and «Cerrar sesión» |
| Followed Rutas, saved items, «continue where you left off» | Planned | |
| Preset avatars | Planned | **Today:** the avatar is the first letter of the username |
| Earned badges | Planned | |

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
