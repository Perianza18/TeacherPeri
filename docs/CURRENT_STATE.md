# TeacherPeri current state

This is a compact handoff snapshot for the current `main` baseline. It summarizes implemented work and established direction; [PRODUCT.md](PRODUCT.md), [ARCHITECTURE.md](ARCHITECTURE.md), [ROADMAP.md](ROADMAP.md), [TEACHERPERI_SPEC.md](TEACHERPERI_SPEC.md), and [MIGRATION.md](MIGRATION.md) remain the canonical sources.

**Current `main`:** `c9c21f5f5cead9013055c0c46e1da61dec833a1f`  
**Completed phases:** 1 — Foundation and safety; 2 — Shared content and library infrastructure; 3 — Rutas / generic Path engine.

## What is implemented

### Phase 1 — Foundation and safety

Phase 1 established TeacherPeri’s canonical documentation, project identity and runtime baseline, a secret-free environment example, explicit safe development reset behavior, database-safety guards, unit-test separation, and GitHub Actions CI. Generated build output is ignored rather than tracked. The application keeps its React/Vite frontend, Express backend, MongoDB/Mongoose persistence, and existing authentication foundation.

### Phase 2 — Shared content and library infrastructure

Phase 2 introduced shared controlled metadata and the common content-library foundation. Topics are hierarchical concepts; Tags are controlled flat descriptors; Categories are reusable material folders. Problems support additive multi-folder placement through `categories` while preserving legacy `category` compatibility during migration. Problemas, Teoría, Listas, and Exámenes have public, lifecycle-aware APIs and route-backed library/detail pages with server-side discovery, folder navigation, and local filtering. Public visibility keeps legacy Problems available temporarily for backward compatibility; new TeacherPeri content uses the canonical `draft` / `published` / `archived` lifecycle.

### Phase 3 — Rutas / generic Path engine

Phase 3 added public Rutas discovery and detail pages, standalone and contextual Path URLs, validated breadcrumbs, leaf Steps, safe references to existing Problems, Teoría, Listas, and Exámenes, and authenticated leaf completion. The server derives parent progress from unique reachable published leaf Paths. It also adds Path Tags, optional Path level, Related Paths, and presentation-only PathSections.

## Canonical Path-engine decisions

- A `Path` is a unique, reusable object with a stable global slug. It has no permanent parent field.
- A `PathReference` records an ordered parent-to-child reference. The graph is a DAG: self-references, duplicate edges, duplicate per-parent positions, and indirect cycles are invalid.
- A Path owns **either** ordered child Paths **or** ordered Steps, never both. Steps belong to leaf Paths and are not independently reusable objects.
- Reusing a child in multiple parent Paths does not duplicate the Path or its completion. Completion belongs to `User ↔ Path` and only published leaf Paths may be marked complete.
- Parent progress is server-derived, cycle-safe, and counts each unique descendant leaf once. Progress is descriptive only; it never locks content.
- Contextual URLs preserve how a visitor reached a reusable Path. Every segment pair must match a stored PathReference; standalone URLs do not invent a parent breadcrumb.
- Path Tags are descriptive discovery metadata. Optional `level` is one of `introductorio`, `omm`, or `avanzado` and never controls access or completion.
- `RelatedPath` is a separate non-structural recommendation relation: `prerequisite`, `deeper`, or `related`. It does not affect hierarchy, breadcrumbs, ordering, descendants, completion, or progress.
- `PathReference.order` is the only structural and presentation order for child Paths. A `PathSection` inserts a presentation heading into that ordered stream; it never reorders a child and is not a Path, route, breadcrumb, search result, completion unit, or progress unit.
- Public Path and Step rendering honors publication safety. Draft and archived Paths/content do not leak through discovery or detail; retained unavailable references remain identifiable without exposing their unpublished content.

## Current curriculum-design work: Preparación para la OMM

The current Path-design focus is the root Path **`Preparación para la OMM`**. Its five cycle subtitles are **PathSections**, not Paths. They are page-level headings that group the existing ordered child Path references; they have no slug, standalone page, progress, completion, or structural role.

The currently recorded section examples are:

1. `Ciclo 1 — Primeros Pasos`
2. `Ciclo 2 — Herramientas Fundamentales`
3. `Ciclo 3 — Construyendo Técnica`
4. `Ciclo 4 — Ampliando Herramientas`
5. `Ciclo 5 — Integración y Estrategia`

Each cycle ends with a normal reusable child Path named **`Entrenamiento Mixto — Ciclo N`**. That child Path remains part of the parent’s `PathReference.order`; it is not a section heading.

The repository now includes a declarative, validated working draft of this complete chronology and a database-free tree/inventory preview. Its proposed topic identities, levels, mixed-training guidance, assumptions, and unresolved editorial work are documented in [OMM_CURRICULUM_DRAFT.md](OMM_CURRICULUM_DRAFT.md). The mixed checkpoints have no authored Steps yet. `Simulacros OMM` is intended to become a parent of reusable individual simulation Paths. All proposed Paths default to `draft`; the definition has not itself published or applied curriculum records.

## Next phase: Phase 4 — Mi Espacio

Phase 4 builds private Mi Espacio on the existing Phase 3 completion/progress foundation. It will add followed Routes (Mis Rutas) with only `pinned` and `normal` placement for MVP, saved items, a personal dashboard, and continue/recent activity. Following a Path and saving an item remain distinct actions. Phase 4 must not create a second completion or progress system.

## Important deferred work

- Experiences storage, editorial workflow, listing, and detail pages.
- Independent Threads, replies, attachments, answer-state moderation, and auditable edit/deletion history.
- Roles, publication/review workflow, and the final moderation-retention/access policy.
- University guidance content composed through the same Path engine; no separate University Path system.
- Global cross-library training search, remaining content-model decisions for Lists and Exámenes, and structured Sources.
- Badges, public badge selection, Path versioning, and full Mi Espacio Thread views.
- Final navigation alignment, responsive/accessibility polish, deployment hardening, and operational safeguards.

Do not infer product requirements from legacy Axioma code, comments, routes, or documentation. Preserve working behavior incrementally and use the canonical documents above when planning later phases.
