# TeacherPeri product model

This is the authoritative agreed product direction. It describes requirements, including systems that are **not implemented yet**. [ARCHITECTURE.md](ARCHITECTURE.md) records the current application; [ROADMAP.md](ROADMAP.md) defines the implementation sequence. Legacy Axioma behavior and old README instructions do not establish TeacherPeri requirements.

TeacherPeri is a Spanish-language platform for mathematics Olympiad preparation and guidance for applying to highly competitive universities in the United States and selected universities in Canada. University guidance must also serve students without an Olympiad background. These documents define product behavior; they do not supply educational material or admissions advice.

## Public areas and navigation

The intended primary navigation, in order, is:

1. Inicio
2. Rutas
3. Zona de Entrenamiento
4. Universidad
5. Experiencias
6. Threads
7. Sobre mí
8. Mi Espacio

Mi Espacio is the logged-in user's private workspace. Public browsing and search do not require login. Login adds persistence, completion/progress, saving, personalization, and participation.

Contacto remains accessible but is not intended as a main navbar item. Agradecimientos/Colaboradores should eventually be incorporated into Inicio. These are target navigation decisions, not a description of today's routes, and do not authorize an immediate navigation redesign.

## Domain distinctions

| Concept | Purpose |
| --- | --- |
| Content | Material users consume, stored once and reused through references |
| Paths / Rutas | Curated guidance through existing content |
| Experiencias | Blog/post-style narrative content that Paths can reference |
| Threads | Independent community discussions |
| Mi Espacio | Private persistence and personal organization |
| Categories / folders | Hierarchical organization of library material |
| Tags | Classification across dimensions, complementary to folders |

Paths are not content libraries or folders. TeacherPeri should guide students without becoming a rigid LMS. Reusing material in a Path must not duplicate the material.

## Rutas / Paths

A Path is recursive and reusable. It contains **either** an ordered collection of child Paths **or** an ordered collection of Steps, never both. A Path containing Steps is a leaf Path. The same Path may appear in multiple larger Paths; nesting must not create cycles.

A Path is a unique standalone TeacherPeri object. One Path never owns another Path: an ordered Path reference connects an independent parent Path to an independent child Path. The same child Path can be referenced by several parents without duplication. A Path has no permanent parent, so breadcrumbs reflect the valid traversal through which a visitor reached it rather than a field stored on the Path itself.

A Path may also have non-structural Related Path references for discovery: `prerequisite` (Repasa primero), `deeper` (Profundiza), or `related` (También te puede interesar). These references never create hierarchy, breadcrumbs, ordering, descendants, or progress. They point to the same independent Path identity and must not duplicate it. An optional `introductorio`, `omm`, or `avanzado` level describes intended context only; it never controls access or completion. Curriculum depth remains a content-design choice, not a technical nesting limit.

`PathReference.order` is the canonical structural and presentation order of every child Path within its parent. A parent Path may optionally use lightweight presentation sections to annotate positions in that ordered sequence with headings; they never reorder children. An unsectioned child may appear before, between, or after sectioned children without moving. A section is not a Path: it has no slug, route, completion, progress, breadcrumb, search result, Related Paths, or effect on traversal and descendants. Unsectioned parent Paths retain their existing ordered child presentation.

An unavailable child reference is anonymous by default. An explicit planned-preview flag may show its title and `Próximamente` state in the parent without a link or any draft description, content, descendants, completion, or progress. Sections composed entirely of these previews may display `En construcción` as derived presentation copy.

A Step contains:

- Title.
- Description/instructions.
- References to TeacherPeri objects.
- Optional external or extra resources.

Steps do not have completion checkboxes in the current product model. Logged-in users may manually mark leaf Paths complete. Completion belongs to the **User ↔ Path identity**, so reusing a Path anywhere reuses that user's completion.

Parent progress is recursively derived from descendant leaf completion. For initial percentages, count **unique descendant leaf Paths equally**. A leaf reachable through multiple branches contributes only once to a given ancestor. Progress is descriptive, never restrictive: incomplete Paths must not lock content or other Paths.

Paths may later support versioning. Preserve these expectations without assuming a final schema:

- Editorial/copy changes need not invalidate completion.
- Meaningful learning-requirement changes may increment a Path version.
- Historical completion remains preserved.

## Zona de Entrenamiento

The current design contains exactly four main material libraries:

- Problemas
- Listas
- Teoría
- Exámenes

The landing page will eventually offer global search across all four. Each library will support recursive folder navigation, local search, filters, and consistent shared metadata/tags.

Folders organize material. Tags classify it across dimensions and do not replace folders. Content may have multiple curated folder memberships when it needs to appear in distinct library views; do not create duplicate content records to represent those placements or reuse.

Topics are curated, hierarchical mathematical concepts that say what content is about. They are reusable across the content libraries and may be assigned many-to-many. Tags are centrally controlled, flat descriptors for filtering and discovery; public users cannot create official tags. Official content has a `draft`, `published`, or `archived` lifecycle: public discovery returns published material, while archived records retain their stable identity for existing references.

For the initial library foundation, canonical TeacherPeri difficulty is editorial metadata with exactly `basico`, `intermedio`, or `avanzado` values, displayed in Spanish with accents. Legacy difficulty/success fields remain only while existing records and UI require compatibility; estimated success percentages are not a TeacherPeri learning metric.

## Experiencias

Experiencias is a blog/post system. Listing entries contain a title, a short 2–3 sentence description, and metadata/tags. Individual pages can contain a title, rich text, headings, images, videos, and metadata/tags. Paths may reference Experiences.

## Threads

Threads are independent discussions, not comments embedded beneath Problems, Lists, Exams, or other material. A Thread may contain:

- Title and body with LaTeX support.
- References to TeacherPeri objects, such as Paths, Theory, Problems, Lists, Exams, and Experiences.
- Uploaded attachments.
- Tags and replies.
- Answer status.

A **reference** links an existing TeacherPeri object. An **attachment** is uploaded supporting material. These are separate concepts.

Replies should remain flat or have at most one nested level for MVP. Do not design unlimited reply nesting.

Answer states are `unanswered`, `answered`, and `no_answer_needed`. Authors may change their own Thread's state. Moderators/Admins may change and lock the state; authors cannot override a moderation lock.

Community edits, deletions, and moderation actions must eventually be auditable internally. Normal user-facing deletion must not destructively remove moderation-relevant history. Retained history is for legitimate administrative and moderation purposes, not public exposure of deleted content. Retention/access details still need an explicit policy before implementation.

### Identity and permissions

Public identity is lightweight: username, avatar, one chosen earned badge, and applicable automatic role badges. These identities are not currently intended to open social-network-style public profile pages. Private identity and account information must remain private.

Expected roles are user, content creator, moderator, and admin. Content Creator and Moderator represent different permissions. Ordinary users must not be able to freely publish official TeacherPeri educational material. Detailed publishing/review permissions remain to be defined; a badge is not a substitute for server-side authorization.

## Mi Espacio

The private workspace conceptually includes Mis Rutas, Guardados, Threads, Logros/Badges, and Continuar / recent activity.

These Path actions are distinct:

- **Add to My Routes:** actively follow a Path.
- **Save for later:** bookmark an object for future use.

Saved items may include Paths and other TeacherPeri objects. For MVP, followed routes have only `pinned` and `normal` placement. Do not introduce high/medium/low priorities or a complex priority system.

Badges may recognize meaningful Path completion/achievements or special roles such as Admin, Moderator, and Content Creator. A user may eventually choose one earned badge to showcase publicly; role badges may appear automatically. A general points system is not an agreed requirement.

## Universidad

Universidad is a major public navbar section. Its main university journey will be composed recursively from Paths down to Steps, using the **same generic Path engine** as Olympiad preparation. Do not create separate `OlympiadPath` and `UniversityPath` systems. University guidance must not assume an Olympiad background.

## Current foundation-phase boundary

The first implementation phase establishes documentation, database safety, runtime/development configuration, and CI while preserving existing application behavior. It does not implement Paths, independent Threads, Theory, Lists, Exams, the Experiences backend, badges, saved items, or Mi Espacio. It does not redesign the UI or invent educational content. Later phases need their own implementation scope.
