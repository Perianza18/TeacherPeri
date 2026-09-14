# Migration from Axioma to TeacherPeri

TeacherPeri reuses an application originally created for Axioma. Existing code is evidence of implementation, not automatic evidence of product intent. [PRODUCT.md](PRODUCT.md) is the agreed product model and [ARCHITECTURE.md](ARCHITECTURE.md) describes current behavior. This migration should be incremental, not a framework rewrite.

## Preserve and evolve

| Existing infrastructure | Migration value |
| --- | --- |
| React/Vite frontend and Express/Mongoose backend | Working foundation to extend |
| Express app/startup separation | Supports development and integration testing |
| Password hashing, JWT middleware, shared auth context, API helper | Authentication foundation to harden incrementally |
| Category model and nested folder helpers | Reusable library organization/navigation |
| Problem model, API, cards, modal, KaTeX, filters | First functional content library and mathematical rendering foundation |
| Backend tests | Regression coverage for existing API behavior |
| Shared headers, folder cards, motion components | Reusable UI building blocks; this phase does not redesign them |
| Authenticated contact flow | Existing TeacherPeri functionality to preserve |

Preserve existing working routes and behavior until a scoped migration explicitly replaces them. Extract large components as needed rather than rewriting everything to match a speculative architecture. Do not reuse Category as a Path engine.

## Stale assumptions

The former README described a club one-pager, anchor navigation, `/problemas`, deleted section/page files, an unsent contact form, nonexistent CI, and old file-ownership restrictions. These descriptions and instructions are superseded by the canonical documents and current README.

Other stale assumptions remain in source comments and fixtures:

- “Interno Axioma” folder/contest examples in models, problem-tree commentary, and test fixtures.
- Comments saying the folder UI is still a future step despite its implementation.
- Historical rules against touching shared files or adding auth routes.
- Navbar commentary counting nine links although eight routes are present.
- The idea that every Problem is itself a discussion thread.
- Contest/year/code-derived problem titles and hardcoded metadata options as if they cover all future material.
- Homepage promises of points/progress/badges despite absent implementations. A general points system is not an agreed requirement.

These should be corrected when relevant code is touched or in a dedicated cleanup. They do not justify a blind global replacement or an unrelated UI change.

## Remaining Axioma names and assets

The foundation phase corrects project-level package identity and disposable database naming. Visual/history remnants intentionally remain for a later scoped cleanup:

- `public/axioma-mark.png` and `public/axioma-wordmark.png`.
- `public/AXIOMA LOGOS (2).png` and `public/AXIOMA LOGOS (3).png`.
- The Axioma favicon reference in `index.html`.
- `AXIOMA_*` color constants in `src/pages/Problemas.jsx` and palette attribution in `src/components/sections/Hero.jsx`.
- Axioma examples and historical comments in source and API tests.

The active color palette is already reused by TeacherPeri. An old variable name alone is not a reason to change its rendered appearance. The Navbar uses a TeacherPeri text wordmark while a dedicated image identity remains undefined. Generated Axioma-era files from `dist/` are stale build output, not source assets or a deployment specification.

## Existing TeacherPeri adaptation

The repository already has a TeacherPeri home/presentation, dedicated routes, a training hub, shared login state, the `teacherperi_auth` storage key, an API helper, contact submissions, an external-resource directory, a university guidance page, and an empty Experience listing scaffold. Exámenes/Listas and some personal content remain placeholders. Preserve useful adaptation while comparing its promises and assumptions against PRODUCT.md.

Existing university copy and problem seeds are not automatically approved or current editorial content. Do not invent replacements during foundation work. Seed difficulty/success metadata is illustrative, not a measured result system; editorial provenance/review work belongs to a later scoped phase.

## Comments and community migration

`Comment` records currently belong to a Problem and author. The UI displays them below the Problem; creation requires login and deletion is author-only. The existing endpoint permanently deletes the selected record. That remains unchanged in this foundation phase.

The target is independent Threads referencing existing TeacherPeri objects, with simple replies and internally auditable edits/deletions/moderation. Do not copy permanent deletion into the final community design.

**Do not remove the Comment model or casually destroy legacy Comment records. Do not perform a Comment → Thread migration in this phase.** Before that transition, decide whether old comments become Threads, an archive, or another preserved-history representation. Any authorized migration needs record/author/content identity preservation, a verified backup and recovery approach, and validation of the resulting relationships. History already removed by the old delete endpoint cannot be assumed recoverable.

## Database operations and stable identities

The historical seed cleared categories, problems, and comments and recreated category/problem IDs. That was a destructive development reset, not an idempotent migration or an operation to run on real data. The guarded development reset now requires an explicit disposable loopback development database and exact-name confirmation, has no fallback to `MONGO_URI`, and refuses databases containing comments. It does not delete Comment records. Resetting category/problem IDs remains inappropriate for real data and future references. Users and contact messages are not reset by this operation. Never execute it merely to demonstrate that it works.

Tests likewise require a loopback target named `teacherperi_test` or `teacherperi_test_<suffix>` and verification of the connected database before cleanup. A variable name such as `MONGO_TEST_URI` alone is not verification. Consult the guarded setup and README rather than reusing old commands from README history.

Future migrations must preserve stable content identities and relationships so that references, bookmarks, and progress remain valid. No production data is changed by the foundation phase.

## Foundation boundary

This phase establishes canonical documentation, database safety, supported runtime/environment setup, CI, accurate package identity, and source-based build handling. It preserves application behavior and does not implement Paths, Threads, new material libraries, Experiences storage, badges, saving, or Mi Espacio. [ROADMAP.md](ROADMAP.md) describes the later sequence; it is not authorization to start those phases automatically.
