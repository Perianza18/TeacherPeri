# TeacherPeri migration and compatibility notes

TeacherPeri is evolved incrementally. Existing implementation details are evidence of current behavior, not automatic evidence of product intent. [PRODUCT.md](PRODUCT.md) is the agreed product model, [ARCHITECTURE.md](ARCHITECTURE.md) describes current behavior, and [ROADMAP.md](ROADMAP.md) defines sequencing.

## Preserve and evolve

Keep working routes and behavior until a scoped migration explicitly replaces them. Extract large components as needed rather than rewriting the application around speculative architecture.

Current infrastructure worth preserving includes:

- React/Vite frontend and Express/Mongoose backend.
- Express app/startup separation.
- Password hashing, JWT middleware, shared auth context, and API helper.
- Category model and nested folder helpers.
- Problem model, API, cards, mathematical rendering, and filters.
- Backend regression tests.
- Reusable UI and motion components.
- Authenticated contact flow.

## Compatibility boundaries

Stale comments, fixtures, placeholder copy, or historical implementation details do not define TeacherPeri requirements. Correct them when relevant code is touched or during a dedicated cleanup.

Preserve stable identities and working relationships during migrations. Do not reseed or regenerate IDs when an additive migration can update existing records safely.

## Comments and community migration

Current `Comment` records belong to a Problem and author. Creation requires login and the current endpoint permanently deletes the selected record.

The target community model is independent Threads with internally auditable edits, deletions, and moderation. Do not remove Comment records or migrate them into Threads until the preserved-history treatment, backup/recovery approach, and relationship validation are explicitly defined.

## Database operations and stable identities

Development resets and test cleanup are destructive operations and must only target verified disposable local databases.

The guarded development reset requires an explicit disposable loopback development database and exact-name confirmation. It must never silently fall back to the normal application database.

Tests require a loopback database named `teacherperi_test` or `teacherperi_test_<suffix>` and verification of the connected target before cleanup.

Future migrations must preserve stable content identities and relationships so references, bookmarks, and progress remain valid.

## Shared-library backfill

Phase 2 added the additive `Problem.categories` array while retaining the singular `Problem.category` field for compatibility. New TeacherPeri content uses `categories`.

`npm run db:backfill:problem-categories` copies the existing singular category into the array with `$addToSet`. The operation is repeatable and does not remove, reseed, or regenerate records. It requires development mode, an explicit loopback migration URI using the approved TeacherPeri development database name, and exact database confirmation.

Retire the compatibility field only after every consumer and persisted record has migrated.

## Path engine migration boundary

The generic Path engine uses standalone Paths connected by ordered acyclic Path references. Leaf-owned Steps reference existing TeacherPeri content by stable identity.

Published traversal remains contextual and shareable. Completion is stored once per User ↔ leaf Path and parent progress derives from unique reachable published leaves.

Related Paths, presentation sections, tags, and descriptive levels must remain separate from structural hierarchy and progress.

## Operational rule

A roadmap phase is not authorization to implement later phases automatically. Complete the requested scope, keep canonical documentation aligned, validate safely, and stop.
