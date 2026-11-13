# TeacherPeri current state

## Final MVP sprint — October 2026

The sprint integrates the editorial design through `58a3b056` with the OMM
curriculum through `f6c3e368`. The stable baseline contained the initial curriculum
merge; six later curriculum commits had not yet reached main. Their lessons,
models, previews and tests are integrated, and both branch histories are preserved
without rewriting existing published commits.

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

Local recovery: `db:local:start` prepares a separate loopback replica set on port
27018; `content:check` inspects the application's database read-only. The importer
explains standalone-server refusal explicitly. See [LOCAL_MVP.md](LOCAL_MVP.md).
Existing local MongoDB data is not reset or reconfigured.
The launcher detaches through Node rather than MongoDB's unsupported macOS
`--fork` option, and preserves early startup errors in `.local/mongodb/startup.log`.

React/Vite + Express + MongoDB. Independent reusable Paths form a DAG, contain
children or Steps, and have no permanent parent. Cycles are presentation-only
PathSections. Content is stored once. Completion is User ↔ leaf Path; parent
progress counts unique public leaves and never restricts access.

Phase 4, Mi Espacio, independent Threads, community, roles/publishing workflows,
Experiencias storage and full university guidance remain deferred. Existing
comments are compatibility behavior, not a new community system. Their existing
permanent-delete endpoint remains documented migration debt.

## Reading experience — October 2026 feedback

Single-theory leaf Paths containing only Theory/Problem references open the canonical Theory page directly. Existing Path identities and completion APIs remain intact; the optional resources/progress link retains the old step view. Context is carried in the `ruta` query parameter, validated through the traversal API, and persists through reloads and problem previews. Parent Paths remain reusable. This is a presentation flattening, not a destructive database migration.

Theory pages interleave canonical referenced Problem previews with the original article and link to topic-filtered problem discovery. Preview positions are distributed through the article; explicit editorial placement is a future refinement. Straight comic cards, sky-blue reading headers, yellow practice panels, and mint practice links replace tilted cards. Sobre mí, Experiencias and Universidad show branded construction pages.

### Reading refinement
Theory-only wrappers are excluded from the Rutas discovery UI and related-route suggestions via the API's lessonOnly classification. Mixed training and multi-lesson routes remain visible. Old single-lesson URLs redirect even with the legacy pasos query. Theory return links lead to the contextual parent route; library entry shows only its library back link. The reading column is 840px within the unchanged 896px title container, with a consistent cream canvas and colored editorial section markers. No database migration is required.

### Unmerged editorial comparison batch

`batch/theory-writing-lab` extends the unmerged problem-discovery batch with six
original article rewrites: three guided-discovery proposals and three following
specific OMMBC section sequences. The development-only `/revision/teoria` page
allows review without MongoDB or imports. A shared article renderer supports
explicit headings, optional hints/solutions, and deliberate canonical Problem
preview placement. See [the editorial review guide](editorial/WRITING_LAB.md).
Existing database prose is unchanged until a separately reviewed transactional
revision is applied. Neither feedback batch is authorized for merge yet.

The same branch also contains two newer **review-only** examples (counting and
pigeonhole): shared section prefixes, topic-only review titles, guided examples,
definition panels and five-problem collection previews. Their drafts and proposed
Problems are not part of the database import payload. Review through
`/revision/teoria`; see the follow-up section of the editorial guide before rollout.
