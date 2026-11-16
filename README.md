# TeacherPeri

English · **[Español](README.es.md)**

TeacherPeri is a free, Spanish-language website for students preparing for math
olympiads, starting with the Mexican Math Olympiad (OMM). It brings theory,
problems, practice exams and guided study paths together in one place, so anyone
can train without hunting for material.

- **Live site:** https://teacherperi.vercel.app
- **API:** https://teacherperi-api.onrender.com (for example `/api/problems`)

## What's on the site

| Section | What it does | Status |
| --- | --- | --- |
| Inicio | Home page with «Problema del día» | Done |
| Rutas | Ordered study paths with progress. The OMM Ruta has Preparación and 5 ciclos | Partial: Preparación and Ciclo 1 are complete; Ciclo 2 has 2 lessons |
| Entrenamiento | Libraries: Problemas (56), Teoría (37 lessons), Exámenes (3) | Done. New lesson format and a visual refresh in progress |
| Listas | 6 problem lists and 3 external resources | Done |
| Community | Comments, proposing problems, error reports | Partial: moderation and editor screens are planned |
| Mi Espacio | Profile, saved items, badges | Planned |
| Experiencias, Equipo, Universidad | Blog, team, university guides | Planned («Próximamente» today) |

Every feature, with what works today and what is planned:
[docs/FEATURES.md](docs/FEATURES.md).

## Tech in one line

React 19 + Vite + Tailwind CSS v4 (website) · Express 5 + Mongoose (API) ·
MongoDB Atlas (database) · KaTeX (math) · hosted on Vercel and Render.

## Run it locally

You need Node 22.13 or newer, npm and MongoDB.

```sh
npm ci
cp .env.example .env          # then set JWT_SECRET (see docs/DEVELOPMENT.md)
npm run server                # API on http://localhost:4000
npm run dev                   # website on http://localhost:5173 (second terminal)
```

To see real content locally, follow [docs/LOCAL_MVP.md](docs/LOCAL_MVP.md).
Setup, tests and every npm script: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Documentation

| Read this | To learn |
| --- | --- |
| [FEATURES.md](docs/FEATURES.md) | Every feature, done or planned, and how the site works today |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | How the code is split: folders, pages, API, data model |
| [ROLES.md](docs/ROLES.md) | User, Editor and Admin: who can do what |
| [SUBMISSIONS.md](docs/SUBMISSIONS.md) | Community problems, exam folders, error reports and their review |
| [CONTENT.md](docs/CONTENT.md) | How lessons, problems, lists, exams and Rutas are written and published |
| [CONTENT_IMPORT.md](docs/CONTENT_IMPORT.md) | Loading official content into a database |
| [DESIGN.md](docs/DESIGN.md) | The design guide every screen follows |
| [DEVELOPMENT.md](docs/DEVELOPMENT.md) | Local setup, tests, npm scripts |
| [LOCAL_MVP.md](docs/LOCAL_MVP.md) | A local database with the real content |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | How the live site is hosted and updated |
| [CONTRIBUTING.md](docs/CONTRIBUTING.md) | Branches, pull requests and the rules every change follows |

Each document has a Spanish version in [docs/es/](docs/es/).
Older planning documents are kept in [docs/archive/](docs/archive/) for history;
they do not describe the current site.
