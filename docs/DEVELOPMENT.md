# TeacherPeri development guidelines

This repository contains legacy Axioma code being migrated incrementally into TeacherPeri.

- Read [PRODUCT.md](PRODUCT.md) and [ARCHITECTURE.md](ARCHITECTURE.md) before product-level architectural changes. Use [MIGRATION.md](MIGRATION.md) for legacy context and [ROADMAP.md](ROADMAP.md) for phase boundaries.
- Do not infer TeacherPeri requirements from legacy Axioma code, comments, assets, or the old README. Distinguish implemented behavior from agreed future requirements.
- Preserve working functionality unless the current migration task explicitly replaces it. Prefer incremental changes over a framework rewrite.
- Do not invent educational content or university advice.
- Categories are material folders; Paths are reusable guidance through content. They are different domain concepts.
- Store TeacherPeri content once and reference its stable identity wherever it is reused.
- Keep browsing/search public. Login adds persistence, progress, saving, personalization, and participation; Path progress must never lock content.
- User-facing deletion of moderation-relevant community content must eventually remain auditable internally. Existing embedded comments are legacy behavior: preserve their records during migration and do not casually delete or convert them.
- Never run destructive database commands against an unverified database. Use the repository's runtime guards, verify that the target is disposable, and keep development resets separate from migrations. Never treat a seed/reset as a production migration.
- Run appropriate lint, tests, and build after changes when safe. Database tests require a verified disposable database; do not run destructive seed/reset commands merely for validation. Report checks not run and why.
- Keep canonical documentation aligned with changes, and do not implement later roadmap systems unless the current task includes them.
