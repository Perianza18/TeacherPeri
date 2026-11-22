# TeacherPeri

**[English](README.md)** · Español

TeacherPeri es un sitio gratuito, en español, para estudiantes que se preparan
para olimpiadas de matemáticas, empezando por la Olimpiada Mexicana de
Matemáticas (OMM). Reúne teoría, problemas, exámenes de práctica y rutas de
estudio guiadas en un solo lugar, para que cualquiera pueda entrenar sin andar
buscando material.

- **Sitio:** https://teacherperi.vercel.app
- **API:** https://teacherperi-api.onrender.com (por ejemplo `/api/problems`)

## Qué hay en el sitio

| Sección | Qué hace | Estado |
| --- | --- | --- |
| Inicio | Página de inicio con el «Problema del día» | Hecho |
| Rutas | Rutas de estudio ordenadas, con progreso. La Ruta OMM tiene Preparación y 5 ciclos | Parcial: Preparación y Ciclo 1 están completos; Ciclo 2 tiene 2 lecciones |
| Entrenamiento | Bibliotecas: Problemas (56), Teoría (37 lecciones), Exámenes (3), Listas (6) y Recursos externos (3) | Hecho. En curso: formato nuevo de lecciones y renovación visual |
| Comunidad | Comentarios, proponer problemas, sugerencias y reportes, moderación y revisión | Hecho. El foro y las @menciones están planeados |
| Mi Espacio | Perfil, listas personales, seguir, «Lo resolví», insignias | Hecho ([PROFILES.md](docs/es/PROFILES.md)) |
| Experiencias, Equipo, Universidad | Blog, equipo, guías para la universidad | Planeado (hoy dicen «Próximamente») |

Todas las funciones, con lo que funciona hoy y lo que está planeado:
[docs/es/FEATURES.md](docs/es/FEATURES.md).

## La tecnología en una línea

React 19 + Vite + Tailwind CSS v4 (sitio) · Express 5 + Mongoose (API) ·
MongoDB Atlas (base de datos) · KaTeX (matemáticas) · hospedado en Vercel y Render.

## Córrelo en tu computadora

Necesitas Node 22.13 o más nuevo, npm y MongoDB.

```sh
npm ci
cp .env.example .env          # luego define JWT_SECRET (ver docs/es/DEVELOPMENT.md)
npm run server                # API en http://localhost:4000
npm run dev                   # sitio en http://localhost:5173 (en otra terminal)
```

Para ver el contenido real en tu computadora, sigue
[docs/es/LOCAL_MVP.md](docs/es/LOCAL_MVP.md). Preparación, pruebas y todos los
scripts de npm: [docs/es/DEVELOPMENT.md](docs/es/DEVELOPMENT.md).

## Documentación

| Lee esto | Para saber |
| --- | --- |
| [FEATURES.md](docs/es/FEATURES.md) | Todas las funciones, hechas o planeadas, y cómo funciona el sitio hoy |
| [ARCHITECTURE.md](docs/es/ARCHITECTURE.md) | Cómo está dividido el código: carpetas, páginas, API, modelo de datos |
| [ROLES.md](docs/es/ROLES.md) | Usuario, Editor y Admin: quién puede hacer qué |
| [PROFILES.md](docs/es/PROFILES.md) | Mi Espacio: perfiles, privacidad, listas personales, seguir e insignias |
| [SUBMISSIONS.md](docs/es/SUBMISSIONS.md) | Problemas de la comunidad, carpetas de examen, reportes de errores y su revisión |
| [CONTENT.md](docs/es/CONTENT.md) | Cómo se escriben y publican lecciones, problemas, listas, exámenes y Rutas |
| [CONTENT_IMPORT.md](docs/es/CONTENT_IMPORT.md) | Cargar el contenido oficial a una base de datos |
| [DESIGN.md](docs/es/DESIGN.md) | La guía de diseño que sigue cada pantalla |
| [DEVELOPMENT.md](docs/es/DEVELOPMENT.md) | Preparación local, pruebas, scripts de npm |
| [LOCAL_MVP.md](docs/es/LOCAL_MVP.md) | Una base local con el contenido real |
| [DEPLOYMENT.md](docs/es/DEPLOYMENT.md) | Cómo está hospedado y cómo se actualiza el sitio |
| [CONTRIBUTING.md](docs/es/CONTRIBUTING.md) | Ramas, pull requests y las reglas de cada cambio |

Cada documento tiene su versión en inglés en [docs/](docs/). Los documentos de
planeación anteriores están en [docs/archive/](docs/archive/) como historial; no
describen el sitio actual.
