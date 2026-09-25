# Preparación para la OMM — Curriculum Draft v2

**Status:** Human-reviewed hierarchical working draft. All Paths remain draft.

This replaces the superseded flat curriculum draft. It uses the generic reusable Path graph: Group Paths contain child Paths; intended leaf Paths remain empty until approved Steps and content are authored. The five cycles are root-owned PathSections only.

The machine-readable definition and recursive preview are in [ommCurriculum.js](../server/src/data/ommCurriculum.js). The subject review view is [OMM_SUBJECT_AUDIT.md](OMM_SUBJECT_AUDIT.md).

## Settled structural decisions

- The root is Preparación para la OMM.
- Pre-training order is Fundamentos para Olimpiadas, Consejos para Empezar a Entrenar, then Técnicas de Demostración.
- Post-cycle order is Consejos para Competir, then Simulacros para la OMM.
- Every cycle ends with Entrenamiento Mixto — Ciclo N; these are intended leaves with no authored Steps.
- Introducción a las Demostraciones belongs under foundations; Técnicas de Demostración is a separate Group Path for proof methods.
- Simulacros para la OMM is a Group Path with Simulacros de Entrenamiento, Cómo Aprovechar un Simulacro, and Simulacros Completos — Nivel OMM.
- Estrategias de Teoría de Números contains Descenso Infinito and Salto de Vieta.

## Editorial guidance

Mixed training progresses from recognition and guided practice toward independent technique selection, combining tools, difficult problems, proof quality, strategy, and reflection. This is guidance for future authoring, not a Step schema.

## Pending Group Paths

The following Groups intentionally have no children yet and cause the guarded migration to fail closed before connecting to MongoDB:

- Estrategias de Desigualdades
- Estrategias Algebraicas
- Estrategias Combinatorias
- Simulacros de Entrenamiento
- Simulacros Completos — Nivel OMM

## Safe application

The curriculum application remains additive, identity-safe, non-destructive, and guarded by the development migration target. It must not be run for Draft v2: unresolved Groups intentionally prevent database connection or mutation. No database operation was performed while creating this draft.

## Editorial questions

- What reusable children belong under the three pending Ciclo 5 strategy Groups?
- What approved Exam and Problem material should determine individual simulation Paths?
- Which subject boundaries and dependencies should change after the Geometry, Algebra, Number Theory, and Combinatorics reviews?
