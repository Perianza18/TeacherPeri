# TeacherPeri current state

## Final MVP sprint — October 2026

The sprint integrates the editorial design through `58a3b056` with the OMM
curriculum. The original baseline merge recorded the later curriculum commits
but omitted their tree changes; those lessons, model changes and tests have been
restored without changing existing published history.

Implemented release:

- Cohesive public libraries with recursive folders, search, metadata filters and
  pagination; the Problem library preserves comment access and adds stable detail
  URLs, original hints and solutions.
- 37 original Spanish lessons, 36 original practice Problems, six curated Problem
  Lists, three attributed external resources and three ordered practice Exams.
- Preparation and Ciclo 1 have Steps, theory, targeted practice and mixed training.
  Two congruence lessons extend Ciclo 2. Cycles 3–5 and remaining Ciclo 2 content
  remain explicitly unfinished. Five PathSections preserve the agreed structure;
  no empty leaf is published. Mixed Paths for unfinished cycles remain draft.
- Lists and Exams reference canonical Problems in order. Unpublished targets
  remain unavailable without leaking their statements.
- Transactional, non-destructive release import with explicit target, dry-run,
  conflict detection and identity preservation. See CONTENT_IMPORT.md.
- Auth middleware verifies account existence; the frontend clears expired bearer
  sessions; API errors return safe JSON. Browse access remains public.
- Browser checks cover desktop/mobile interactions using explicit API fixtures;
  MongoDB integration checks separately cover actual relationships and imports.

The release data is prepared in source; this does not claim it has been loaded
into a production database or deployed. Production setup remains the owner's
next step: [DEPLOYMENT.md](DEPLOYMENT.md).

## Preserved architecture and boundaries

React/Vite + Express + MongoDB. Independent reusable Paths form a DAG, contain
children or Steps, and have no permanent parent. Cycles are presentation-only
PathSections. Content is stored once. Completion is User ↔ leaf Path; parent
progress counts unique public leaves and never restricts access.

Phase 4, Mi Espacio, independent Threads, community, roles/publishing workflows,
Experiencias storage and full university guidance remain deferred. Existing
comments are compatibility behavior, not a new community system. Their existing
permanent-delete endpoint remains documented migration debt.
