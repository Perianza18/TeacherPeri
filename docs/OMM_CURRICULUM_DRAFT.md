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

The following Groups intentionally have no children yet and are permitted only as empty, unpublished planned identities:

- Estrategias de Desigualdades
- Estrategias Algebraicas
- Estrategias Combinatorias
- Simulacros de Entrenamiento
- Simulacros Completos — Nivel OMM

## Safe application

The curriculum application remains additive, identity-safe, non-destructive, and guarded by the development migration target. Unresolved Groups no longer block the whole application, but validation requires them to remain draft and rejects Steps or invented child references. Root references in Ciclos 4–5 opt into title-only coming-soon previews; nested references, Ciclos 1–3, and post-cycle material do not. Running the migration remains an explicit operator action and was not part of this change.

## Editorial questions

- What reusable children belong under the three pending Ciclo 5 strategy Groups?
- What approved Exam and Problem material should determine individual simulation Paths?
- Which subject boundaries and dependencies should change after the Geometry, Algebra, Number Theory, and Combinatorics reviews?
