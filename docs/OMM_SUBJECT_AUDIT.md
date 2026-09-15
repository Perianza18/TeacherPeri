# OMM subject audit

**Status:** Working curriculum-design aid for human review.
**Source baseline:** [`server/src/data/ommCurriculum.js`](../server/src/data/ommCurriculum.js)

This document reorganizes the current 54 child Paths of `Preparación para la OMM` by subject. It does not change their names, levels, cycle placement, or chronological order. Scope notes only restate what the current titles and [OMM_CURRICULUM_DRAFT.md](OMM_CURRICULUM_DRAFT.md) already imply. Ambiguities remain open for subject-by-subject review.

The root Path is omitted from the tables because it is the curriculum container rather than one of its 54 ordered child Paths. Every child Path appears exactly once below.

# Geometry

Geometry currently contains nine reusable Path proposals. They are shown in their current pedagogical order.

| Order | Current Path and slug | Cycle | Level | Area | Scope placeholder / clarity | Existing overlap or open scope question |
| ---: | --- | --- | --- | --- | --- | --- |
| 4 | **Ángulos, Triángulos y Configuraciones Básicas**<br>`angulos-triangulos-y-configuraciones-basicas` | Ciclo 1 | introductorio | `geometry` | Angles, triangles, and basic configurations. Broad but reasonably clear as an introductory foundation. | Boundary with `Congruencia y Semejanza de Triángulos` needs review. |
| 8 | **Congruencia y Semejanza de Triángulos**<br>`congruencia-y-semejanza-de-triangulos` | Ciclo 1 | introductorio | `geometry` | Triangle congruence and similarity. Reasonably clear from the title. | May repeat part of the introductory triangle Path; intended depth needs distinction. |
| 13 | **Círculos: Ángulos y Propiedades Fundamentales**<br>`circulos-angulos-y-propiedades-fundamentales` | Ciclo 2 | omm | `geometry` | Circle angles and fundamental circle properties. Reasonably clear as a first circle Path. | Boundary with `Potencia de un Punto` and `Configuraciones de Círculos` needs review. |
| 17 | **Potencia de un Punto**<br>`potencia-de-un-punto` | Ciclo 2 | omm | `geometry` | Power of a point. Clear single-technique identity. | Depends on the intended scope of the preceding fundamental circle Path. |
| 22 | **Ceva y Menelao**<br>`ceva-y-menelao` | Ciclo 3 | omm | `geometry` | Ceva's and Menelaus's theorems. Clear paired-technique identity. | Relationship to triangle similarity and required prerequisites should be checked. |
| 29 | **Configuraciones de Círculos**<br>`configuraciones-de-circulos` | Ciclo 3 | omm | `geometry` | Circle configurations beyond the fundamental circle material. Exact included configurations are vague. | Overlaps conceptually with both earlier circle Paths and potentially the advanced synthetic/configuration Paths. |
| 32 | **Transformaciones Geométricas**<br>`transformaciones-geometricas` | Ciclo 4 | avanzado | `geometry` | Geometric transformations; the draft mentions rotation, reflection, and homothety as possible scope. | Exact transformation set and depth require review; overlaps the later advanced transformations Path. |
| 42 | **Geometría Sintética Avanzada**<br>`geometria-sintetica-avanzada` | Ciclo 5 | avanzado | `geometry` | Advanced synthetic geometry. The reusable mathematical boundary is still vague. | Could absorb or overlap advanced configurations and techniques introduced in earlier Geometry Paths. |
| 48 | **Transformaciones y Configuraciones Geométricas Avanzadas**<br>`transformaciones-y-configuraciones-geometricas-avanzadas` | Ciclo 5 | avanzado | `geometry` | Advanced transformations and geometric configurations. The exact reusable identity is not precise yet. | Explicitly overlaps `Transformaciones Geométricas`, `Configuraciones de Círculos`, and possibly `Geometría Sintética Avanzada`. |

### Potential missing concepts

*To be reviewed with Elias.*

### Potential merges

*To be reviewed with Elias.*

### Potential splits

*To be reviewed with Elias.*

### Dependency questions

*To be reviewed with Elias.*

### Proposed cycle changes

*To be reviewed with Elias.*

# Algebra

| Order | Current Path and slug | Cycle | Level | Area | Scope clarity | Existing overlap or open scope question |
| ---: | --- | --- | --- | --- | --- | --- |
| 6 | **Identidades y Manipulación Algebraica**<br>`identidades-y-manipulacion-algebraica` | Ciclo 1 | introductorio | `algebra` | Reasonably clear introductory algebraic manipulation. | Boundary with elementary factorization should be checked. |
| 10 | **Factorización y Ecuaciones Elementales**<br>`factorizacion-y-ecuaciones-elementales` | Ciclo 1 | introductorio | `algebra` | Reasonably clear foundation in factorization and elementary equations. | May overlap later polynomial material. |
| 15 | **Desigualdades Fundamentales**<br>`desigualdades-fundamentales` | Ciclo 2 | omm | `algebra` | Broad but recognizable foundation in olympiad inequalities. | First of four inequality-titled Paths; its stopping point is not defined. |
| 20 | **Sucesiones: Primeros Patrones**<br>`sucesiones-primeros-patrones` | Ciclo 2 | omm | `algebra` | Introductory sequence patterns; exact mathematical scope remains broad. | Overlaps `Recurrencias` and `Sucesiones y Recurrencias Avanzadas`. |
| 23 | **Polinomios y Raíces**<br>`polinomios-y-raices` | Ciclo 3 | omm | `algebra` | Reasonably clear intermediate polynomial identity. | Boundary with elementary factorization and advanced polynomial techniques needs review. |
| 26 | **Desigualdades: Técnicas Intermedias**<br>`desigualdades-tecnicas-intermedias` | Ciclo 3 | omm | `algebra` | Intermediate inequality techniques; exact technique set is unspecified. | Needs a clear distinction from fundamental and both advanced inequality Paths. |
| 30 | **Recurrencias**<br>`recurrencias` | Ciclo 3 | omm | `algebra` | Recurrences at an unspecified middle level. | Strong overlap with both sequence Paths; naming and boundaries need review. |
| 33 | **Sucesiones y Recurrencias Avanzadas**<br>`sucesiones-y-recurrencias-avanzadas` | Ciclo 4 | avanzado | `algebra` | Advanced sequences and recurrences; exact scope is still broad. | Overlaps `Sucesiones: Primeros Patrones` and `Recurrencias`. |
| 36 | **Desigualdades: Herramientas Avanzadas**<br>`desigualdades-herramientas-avanzadas` | Ciclo 4 | avanzado | `algebra` | Advanced inequality tools; included tools are unspecified. | Conceptually overlaps `Desigualdades Avanzadas`; the two identities need distinction. |
| 39 | **Polinomios: Técnicas Avanzadas**<br>`polinomios-tecnicas-avanzadas` | Ciclo 4 | avanzado | `algebra` | Advanced polynomial techniques; exact scope is unspecified. | Needs a clean boundary from `Polinomios y Raíces`. |
| 40 | **Introducción a Ecuaciones Funcionales**<br>`introduccion-a-ecuaciones-funcionales` | Ciclo 4 | omm | `algebra` | Clear introductory functional-equation intent. | Scope and placement were already marked for review. |
| 44 | **Ecuaciones Funcionales: Técnicas Intermedias**<br>`ecuaciones-funcionales-tecnicas-intermedias` | Ciclo 5 | avanzado | `algebra` | Intermediate functional-equation techniques; exact technique set is unspecified. | Must build distinctly on the introductory Path. |
| 47 | **Desigualdades Avanzadas**<br>`desigualdades-avanzadas` | Ciclo 5 | avanzado | `algebra` | Advanced inequalities, but the title does not identify a distinct scope. | Direct conceptual overlap with `Desigualdades: Herramientas Avanzadas`. |

# Teoría de Números

| Order | Current Path and slug | Cycle | Level | Area | Scope clarity | Existing overlap or open scope question |
| ---: | --- | --- | --- | --- | --- | --- |
| 5 | **Divisibilidad y Números Primos**<br>`divisibilidad-y-numeros-primos` | Ciclo 1 | introductorio | `number-theory` | Reasonably clear foundation in divisibility and primes. | Relationship to the following GCD/Euclidean algorithm Path needs sequencing review. |
| 9 | **Máximo Común Divisor y Algoritmo de Euclides**<br>`maximo-comun-divisor-y-algoritmo-de-euclides` | Ciclo 1 | introductorio | `number-theory` | Clear paired foundation in GCD and Euclid's algorithm. | Partly adjacent to the broad divisibility foundation. |
| 14 | **Congruencias y Residuos**<br>`congruencias-y-residuos` | Ciclo 2 | omm | `number-theory` | Reasonably clear introduction to congruences and residues. | Foundation for later modular-theorem and order/structure Paths. |
| 18 | **Ecuaciones Diofánticas Básicas**<br>`ecuaciones-diofanticas-basicas` | Ciclo 2 | omm | `number-theory` | Clear basic Diophantine-equation intent. | Must be distinguished by depth from the intermediate Diophantine Path. |
| 24 | **Teoremas Clásicos de Aritmética Modular**<br>`teoremas-clasicos-de-aritmetica-modular` | Ciclo 3 | omm | `number-theory` | Classical modular theorems; Fermat/Euler scope was explicitly left for review. | Overlaps the broader later `Órdenes y Estructura Modular` identity. |
| 27 | **Ecuaciones Diofánticas: Técnicas Intermedias**<br>`ecuaciones-diofanticas-tecnicas-intermedias` | Ciclo 3 | omm | `number-theory` | Intermediate Diophantine techniques; exact technique set is unspecified. | Needs a defined boundary from the basic Path and later descent/Vieta material. |
| 34 | **Órdenes y Estructura Modular**<br>`ordenes-y-estructura-modular` | Ciclo 4 | avanzado | `number-theory` | Orders and modular structure; exact reusable scope remains broad. | May overlap classical modular theorems and valuations/exponents. |
| 37 | **Valuaciones y Exponentes en Teoría de Números**<br>`valuaciones-y-exponentes-en-teoria-de-numeros` | Ciclo 4 | avanzado | `number-theory` | Valuations and exponent methods. | Whether LTE belongs in OMM scope was explicitly left open. |
| 43 | **Descenso Infinito y Salto de Vieta**<br>`descenso-infinito-y-salto-de-vieta` | Ciclo 5 | avanzado | `number-theory` | Two named advanced Diophantine techniques. | Scope and sequencing relative to intermediate Diophantine work need review. |
| 46 | **Teoría de Números: Problemas de Integración**<br>`teoria-de-numeros-problemas-de-integracion` | Ciclo 5 | avanzado | `number-theory` | Integration-oriented number-theory problems; reusable mathematical identity is vague. | May duplicate mixed training rather than define a durable topic Path. |

# Combinatoria

| Order | Current Path and slug | Cycle | Level | Area | Scope clarity | Existing overlap or open scope question |
| ---: | --- | --- | --- | --- | --- | --- |
| 7 | **Conteo Básico**<br>`conteo-basico` | Ciclo 1 | introductorio | `combinatorics` | Clear introductory counting intent, though its upper boundary is unspecified. | Adjacent to permutations/combinations and double counting. |
| 11 | **Principio del Palomar**<br>`principio-del-palomar` | Ciclo 1 | introductorio | `combinatorics` | Clear single-principle identity. | No explicit overlap recorded beyond general counting foundations. |
| 16 | **Permutaciones y Combinaciones**<br>`permutaciones-y-combinaciones` | Ciclo 2 | omm | `combinatorics` | Clear standard counting-tools identity. | Boundary from `Conteo Básico` needs review. |
| 19 | **Principio de Inclusión-Exclusión**<br>`principio-de-inclusion-exclusion` | Ciclo 2 | omm | `combinatorics` | Clear single-principle identity. | No explicit overlap question recorded. |
| 25 | **Invariantes**<br>`invariantes` | Ciclo 3 | omm | `combinatorics` | Clear technique family, but broader than a strictly combinatorial identity. | Classification as combinatorics is provisional; it is reusable cross-cutting material. |
| 28 | **Doble Conteo**<br>`doble-conteo` | Ciclo 3 | omm | `combinatorics` | Clear technique identity. | Relates to earlier counting tools; required depth needs review. |
| 35 | **Principio Extremal**<br>`principio-extremal` | Ciclo 4 | omm | `combinatorics` | Clear technique family, but broader than a strictly combinatorial identity. | Classification as combinatorics is provisional; it is reusable cross-cutting material. |
| 38 | **Grafos para Olimpiadas**<br>`grafos-para-olimpiadas` | Ciclo 4 | omm | `combinatorics` | Broad but recognizable olympiad-graph introduction. | Exact graph topics and boundary with advanced structures are unspecified. |
| 45 | **Combinatoria Avanzada: Coloraciones y Estructuras**<br>`combinatoria-avanzada-coloraciones-y-estructuras` | Ciclo 5 | avanzado | `combinatorics` | Advanced colorings and structures; exact included structures remain vague. | May overlap graph material depending on the eventual scope. |

# Cross-cutting / Strategy / Proof

| Order | Current Path and slug | Cycle | Level | Area | Scope clarity | Existing overlap or open scope question |
| ---: | --- | --- | --- | --- | --- | --- |
| 2 | **Técnicas de Demostración**<br>`tecnicas-de-demostracion` | Pre-training | introductorio | `proof` | Early foundations for reading, constructing, and communicating proofs. | Relationship to later solution-writing work needs review. |
| 49 | **Estrategias de Ataque de Problemas**<br>`estrategias-de-ataque-de-problemas` | Ciclo 5 | avanzado | `strategy` | Strategic problem-attack methods; exact sequence is not authored. | May overlap the purpose of advanced mixed training and synthesis work. |
| 50 | **Redacción y Pulido de Soluciones**<br>`redaccion-y-pulido-de-soluciones` | Ciclo 5 | avanzado | `proof` | Writing and polishing complete solutions. | Its relationship to `Técnicas de Demostración` was explicitly left open. |

# Mixed Training

The five cycle checkpoints are intended leaf Paths but currently have no authored Steps or selected Problems. `Reconoce → Resuelve → Mezcla → Reflexiona` remains an editorial analogy rather than a Step schema.

| Order | Current Path and slug | Cycle | Level | Area | Scope clarity | Existing overlap or open scope question |
| ---: | --- | --- | --- | --- | --- | --- |
| 12 | **Entrenamiento Mixto — Ciclo 1**<br>`entrenamiento-mixto-ciclo-1` | Ciclo 1 | introductorio | `mixed` | Accessible recognition, guided practice, and short complete solutions. Actual material is unauthored. | Needs reviewed Problems and authored Steps. |
| 21 | **Entrenamiento Mixto — Ciclo 2**<br>`entrenamiento-mixto-ciclo-2` | Ciclo 2 | omm | `mixed` | Technique selection among known tools and less obvious subject labels. Actual material is unauthored. | Needs reviewed Problems and authored Steps. |
| 31 | **Entrenamiento Mixto — Ciclo 3**<br>`entrenamiento-mixto-ciclo-3` | Ciclo 3 | omm | `mixed` | Combined techniques, multi-stage arguments, and recovery from failed approaches. Actual material is unauthored. | Needs reviewed Problems and authored Steps. |
| 41 | **Entrenamiento Mixto — Ciclo 4**<br>`entrenamiento-mixto-ciclo-4` | Ciclo 4 | avanzado | `mixed` | Viewpoint selection, difficult classification, and independent combination of tools. Actual material is unauthored. | Needs reviewed Problems and authored Steps. |
| 51 | **Problemas de Síntesis**<br>`problemas-de-sintesis` | Ciclo 5 | avanzado | `mixed` | Synthesis problems across material; exact reusable identity is vague. | Its role versus `Entrenamiento Mixto — Ciclo 5` was explicitly left open. |
| 52 | **Entrenamiento Mixto — Ciclo 5**<br>`entrenamiento-mixto-ciclo-5` | Ciclo 5 | avanzado | `mixed` | Difficult mixed work, complete proofs, strategy, experimentation, and contest-like practice. Actual material is unauthored. | Needs reviewed Problems and authored Steps; may overlap `Problemas de Síntesis`. |

# Pre-training / Post-training

| Order | Current Path and slug | Placement | Level | Area | Scope clarity | Existing overlap or open scope question |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | **Fundamentos de la Olimpiada**<br>`fundamentos-de-la-olimpiada` | Pre-training | introductorio | `orientation` | Orientation to olympiad mathematics, expectations, training, and TeacherPeri use. | Needs approved orientation content. |
| 3 | **Consejos para Empezar a Entrenar**<br>`consejos-para-empezar-a-entrenar` | Pre-training | introductorio | `orientation` | Advice before structured training. | Title and content remain provisional; distinct purpose from competition-stage advice. |
| 53 | **Simulacros OMM**<br>`simulacros-omm` | Post-training | avanzado | `simulation` | Settled intended parent for reusable individual simulation Paths. It remains empty and draft. | Individual children require review of approved Exams/Problems; none are created yet. |
| 54 | **Consejos para Competir**<br>`consejos-para-competir` | Post-training | avanzado | `orientation` | Advice for the later competition stage. | Title and content remain provisional; distinct purpose from pre-training advice. |

## Audit sequence

Human-guided review proceeds through Geometry, Algebra, Teoría de Números, Combinatoria, and cross-cutting techniques before revising the chronological five-cycle curriculum. This audit records the current baseline and does not settle those subject reviews.
