# TeacherPeri implementation roadmap

This is a phased direction, not a promise that the systems below already exist or authorization to implement every phase in one task. [PRODUCT.md](PRODUCT.md) defines domain requirements; [ARCHITECTURE.md](ARCHITECTURE.md) describes the current application. Complete the currently requested phase and stop.

## 1. Foundation and safety — current phase

Establish canonical documentation, verified disposable-database guards, explicit development-reset behavior, a secret-free environment example, the lowest supported runtime compatible with the locked dependencies, and CI for lint/build plus safely isolated database tests where available. Correct stale package/project configuration and generated-build tracking. Preserve working UI and APIs.

Do not execute a destructive reset merely for validation. Do not change production data, remove comments, redesign navigation, invent educational content, or implement later product systems in this phase.

## 2. Shared content and library infrastructure

Agree on stable object identity, reference conventions, controlled metadata/tags, canonical folder placement, and publishing permissions. Incrementally extract reusable Problem rendering/folder/filter code. Build the shared basis for Problemas, Listas, Teoría, and Exámenes, including addressable content, library-local discovery, pagination, and global training search.

Define each material type's needs before choosing storage structures. Lists/Exams may need combinations of problem references, documents, or richer material; that representation is still a product decision. Preserve content records rather than copying them into each context. Server-side permission boundaries must accompany official publishing capabilities.

## 3. Rutas / generic Path engine

Implement ordered child Paths **or** ordered Steps, reference-based content reuse, stable Path identity, and cycle prevention. Support one engine for Olympiad and university journeys. Steps have no completion checkboxes and Paths introduce no prerequisite locks.

Define the leaf-completion and recursive-progress contract here so the next phase can persist it correctly: User ↔ Path completion, equal weighting of unique descendant leaves, and preserved historical completion with future versioning in mind. Do not assume parent-child nesting means exclusive ownership of a child Path.

## 4. Mi Espacio, progress, and saving

Implement private user persistence: manually completed leaf Paths, recursively derived parent progress, followed routes, bookmarks, and continue/recent activity. Keep following separate from saving; followed routes have only pinned/normal placement for MVP.

Add meaningful achievement/badge behavior and public earned-badge selection according to the agreed permission/privacy model. Preserve public browsing and avoid introducing a general points or complex priority system without a product decision.

## 5. Experiencias

Implement the narrative-content backend and detail pages, with listing descriptions, controlled metadata/tags, rich text, headings, images, and videos. Use the shared identity/reference conventions so Paths can reference Experiences without duplication. Include the appropriate editorial workflow and media handling; do not invent posts to fill empty states.

## 6. Independent Threads and moderation

Establish roles, audit-history retention/access policy, attachment constraints, and server authorization before enabling the new community write operations. Implement independent Threads, content references distinct from uploads, LaTeX, tags, flat or one-level replies, and the three answer states with moderator/admin locks.

Keep private account data out of public identity. Add avatars and relevant badge display without public social-profile pages. Decide the preserved-history treatment of legacy comments before attempting any conversion. Community edits/deletes and moderation actions must retain appropriate internal history; do not adopt destructive user-facing deletion as the final design.

## 7. University integration

Compose the main university journey from the same Paths and Steps used for Olympiad guidance. Integrate approved content and shared references. The journey must serve students with or without an Olympiad background. Do not create a parallel University Path implementation or invent admissions advice.

## 8. Navigation and content polish

Align navigation with Inicio, Rutas, Zona de Entrenamiento, Universidad, Experiencias, Threads, Sobre mí, and Mi Espacio. Keep Contacto accessible outside primary navigation and incorporate Agradecimientos/Colaboradores into Inicio. Resolve the placement of the current external-resource directory and any route redirects as part of this scoped work.

Replace legacy assets and placeholders with approved material, review mathematical/admissions provenance and freshness, and improve responsive behavior, accessibility, modal focus, reduced-motion behavior, and route-based continuation.

## 9. Launch hardening

Verify authorization/privacy boundaries, input validation, session lifecycle, upload handling, moderation-history access, search performance, and rate limits. Establish deployment/environment procedures, backups, migration recovery, and operational monitoring. Add targeted integration/browser coverage for important user flows and domain invariants. Validate the actual deployment artifact from current source.

## Dependencies and decisions

The sequence keeps Experiences after initial Paths because Paths can first reference existing material; shared reference conventions must still anticipate Experiences. Content publishing needs role authorization during shared-library work, before the fuller moderation feature phase. The Path phase defines progress invariants before Mi Espacio implements private persistence. These are dependencies within the sequence, not separate engines or premature feature implementations.

Remaining product decisions should be resolved when needed for the relevant phase:

- Publishing authority and review workflow for official content.
- The material representation of Lists and Exams and the controlled-tag governance workflow.
- How future meaningful Path changes affect the current completion view while preserving historical completion; badge behavior when completion changes.
- Preserved-history treatment of old comments, moderation retention/access policy, and permitted upload types/sizes.
- MVP emphasis of the existing Putnam/OMMU corpus alongside OMM preparation, and placement of Más Recursos in the intended navigation.

Do not reopen settled decisions such as unique-leaf progress weighting, canonical folder placement, pinned/normal route organization, shared University/Olympiad Paths, or nonrestrictive progress without an explicit change in product direction.
