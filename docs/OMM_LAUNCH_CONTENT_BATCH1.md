# OMM launch content — Batch 1

## Scope

Batch 1 covers all intended leaves under:

- Fundamentos para Olimpiadas;
- Consejos para Empezar a Entrenar;
- Técnicas de Demostración;
- Geometría Básica para Olimpiadas;
- Álgebra Básica para Olimpiadas;
- Divisibilidad y Primos;
- Conteo Básico;
- Principio de Casillas;
- Dígitos y Sistemas de Numeración;
- Entrenamiento Mixto — Ciclo 1.

No Ciclo 2–5 or simulation content is part of this batch.

## Authored content

- 35 draft Theory records: one substantial Spanish guide per intended leaf.
- 140 Steps: four per leaf, with specific study, reconstruction, practice, and review actions.
- 18 pre-cycle guides covering orientation, training workflows, solution review, resource use, and proof techniques.
- 17 Ciclo 1 guides covering foundational Geometry, Algebra, Number Theory, Combinatorics, digits/bases, and mixed practice.
- The mixed practice is explicitly TeacherPeri-authored training, not an official or simulated exam.

The substantial lesson body lives in Theory. Step descriptions tell the learner what to do and reference the reusable Theory record.

## Reused Problems

Only two existing Problems are reused, both as optional advanced challenges after the foundational teaching:

- `PUTNAM-2023-A5` — Suma con signos alternantes en base 3;
- `PUTNAM-2023-B2` — Mínimo de unos en la representación binaria de 2023n.

The actual statements were reviewed for their direct base/digit fit. No provenance field or existing label was changed or strengthened. Both remain `provenance unclear — requires review` and require human source verification before publication.

## Application safety

`npm run db:apply:omm-content-batch1` is a guarded additive development application command. It:

- accepts only the explicitly confirmed local development migration target;
- requires the reviewed curriculum Paths to exist and remain draft leaves;
- creates Theory and Steps as draft content only;
- resolves existing Problems by their stored codes and public/legacy lifecycle;
- refuses missing or ambiguous Problems instead of fabricating IDs;
- refuses ambiguous Theory titles or any independently authored Theory/Step conflict;
- is repeatable when stored records exactly match the source definition;
- never deletes, publishes, or overwrites educational content.

The command was not run while authoring this batch.

## Validation and preview

`npm run curriculum:preview:omm-content` validates and prints leaf-level counts without lesson bodies. The source validator checks:

- every intended Batch 1 leaf has 3–5 ordered Steps;
- Batch 1 Group Paths have children and receive no Steps;
- Theory and Problem references resolve in the source definitions;
- Step descriptions/references are meaningful;
- Theory articles contain the required teaching sections and balanced math delimiters;
- all authored and curriculum content remains draft;
- no Ciclo 2–5 or simulation material enters the batch.

## Remaining review flags

- A Spanish-language mathematical/editorial review is still required before application and publication.
- KaTeX rendering should receive a visual pass after draft application in a disposable environment.
- The two reused Problems require source/provenance and translation-fidelity verification.
- Current Theory records intentionally have no invented Topics, Tags, Categories, authors, or sources; metadata should be added only through a reviewed taxonomy.
- No external Lists or Exams were added because no verified sources exist in the repository.

## Publication boundary

All Paths and Theory remain draft. This batch does not authorize applying the content, publishing Paths or Theory, changing Problem provenance, merging to `main`, or populating later cycles.
