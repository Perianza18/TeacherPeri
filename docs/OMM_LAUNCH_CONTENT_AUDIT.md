# OMM launch content audit

## Scope and method

This audit covers every intended Leaf Path in the three pre-cycle Groups and Ciclos 1–3 of `Preparación para la OMM`. It does not change the curriculum, create Steps, attach references, create content, publish Paths, or run a migration.

Evidence inspected on 2026-09-26:

- the configured local `teacherperi` database, using read-only queries;
- all 93 persisted Problem records, including their full statements rather than titles alone;
- the matching 93 source records in `server/src/data/problemasReales.js`;
- the Theory, List, Exam, Topic, Tag, and Category collections;
- the content models and their source/provenance, topic, tag, category, difficulty, and publication fields;
- the launch curriculum definition in `server/src/data/ommCurriculum.js`.

The database and repository source match exactly for the eight legacy Problem fields checked: code, title, statement, year, broad subject, contest label, legacy difficulty, and illustrative success value. The configured database contains 93 Problems and 14 competition/year Categories, but **0 Theory, 0 Lists, 0 Exams, 0 Topics, and 0 Tags**. No candidate below is an implemented Path mapping.

### Coverage rules

- **READY**: enough reviewed existing material to make the leaf meaningfully usable now.
- **PARTIAL**: at least one substantively relevant existing candidate exists, but explanation, suitable progression, solutions, metadata, and/or additional practice is missing.
- **EMPTY**: no suitable existing material was found. A merely adjacent broad category or word in a title does not count.
- Confidence describes the fit of the listed candidate to the leaf, not its provenance or readiness.
- `T`, `P`, `L`, and `E` mean Theory, Problem, List, and Exam candidates. `—` means none found.

Because every current candidate is a Problem statement without a stored solution and all provenance needs review, no leaf is classified READY.

## Coverage summary

| Scope | Leaves | READY | PARTIAL | EMPTY |
| --- | ---: | ---: | ---: | ---: |
| Pre-cycle | 18 | 0 | 0 | 18 |
| Ciclo 1 | 17 | 0 | 14 | 3 |
| Ciclo 2 | 14 | 0 | 8 | 6 |
| Ciclo 3 | 13 | 0 | 8 | 5 |
| **Total** | **62** | **0** | **30** | **32** |

The existing corpus is predominantly university-level: 60 Putnam Problems, 15 labeled OMMU Primera Ronda, and 18 labeled OMMU Nacional. Its broad subject distribution is 23 Análisis, 13 Álgebra Lineal, 19 Combinatoria, 8 Álgebra, 7 Geometría, 8 Probabilidad, and 15 Teoría de Números. Much of Análisis, Álgebra Lineal, and Probabilidad is outside the launch curriculum, and even topically relevant records are generally too advanced to be the sole practice progression for Ciclos 1–2.

## Pre-cycle

Problems are not forced into editorial Paths. These leaves require original explanatory material, examples, and editorial review; a bank of unsupported contest statements cannot substitute for that work.

| Path | Subject | Cycle | T | P | L | E | Fit confidence | Classification | Reason for fit | Major content gaps |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ¿Qué es la OMM? | Orientation | Pre-cycle | — | — | — | — | Low | EMPTY | No OMM overview or verified OMM record exists. | Author an accurate OMM overview, format, eligibility/context, and carefully sourced links. |
| ¿Por qué hacer Olimpiadas de Matemáticas? | Orientation | Pre-cycle | — | — | — | — | Low | EMPTY | No motivational or orientation content exists. | Author benefits, expectations, and balanced participation guidance. |
| ¿Cómo entrenar para una Olimpiada? | Orientation | Pre-cycle | — | — | — | — | Low | EMPTY | Problem statements do not explain a training process. | Author a sustainable training cycle, scheduling, reflection, and progression guidance. |
| ¿Cómo abordar un problema? | Strategy | Pre-cycle | — | — | — | — | Low | EMPTY | No worked strategy content, hints, or solutions exist. | Author a concrete read-explore-conjecture-prove-review workflow with worked examples. |
| Introducción a las Demostraciones | Proof | Pre-cycle | — | — | — | — | Low | EMPTY | Existing Problems ask for proofs but do not teach what proof is. | Author claims, hypotheses, logical implication, counterexamples, and proof-reading basics. |
| ¿Cómo escribir una solución? | Proof | Pre-cycle | — | — | — | — | Low | EMPTY | No model solutions or writing rubric exists. | Author structure, notation, justification, clarity, and a before/after solution example. |
| Cómo Organizar tu Entrenamiento | Orientation | Pre-cycle | — | — | — | — | Low | EMPTY | No planning resource exists. | Author weekly planning, topic/practice balance, and rest/review guidance. |
| Qué Hacer Cuando no Puedes Resolver un Problema | Strategy | Pre-cycle | — | — | — | — | Low | EMPTY | No hint ladder or stuck-protocol content exists. | Author diagnostic prompts, time boxes, productive hints, and when to read a solution. |
| Cómo Aprender de una Solución | Strategy | Pre-cycle | — | — | — | — | Low | EMPTY | The repository contains no stored solutions to study. | Author active solution reading, reconstruction, variation, and takeaway capture. |
| Cómo Usar Listas, Libros y Bancos de Problemas | Orientation | Pre-cycle | — | — | — | — | Low | EMPTY | The List collection is empty and no attributed resource guide exists. | Author selection/evaluation guidance after approved Lists and sources are gathered. |
| Cómo Revisar tus Soluciones y Detectar Errores | Proof | Pre-cycle | — | — | — | — | Low | EMPTY | No solution corpus or review checklist exists. | Author logic, edge-case, notation, and completeness checks with examples. |
| Cómo Elegir Qué Estudiar | Orientation | Pre-cycle | — | — | — | — | Low | EMPTY | No diagnostic or curriculum-selection guidance exists. | Author prerequisite-aware diagnostics and a method for selecting the next topic. |
| Demostración Directa | Proof | Pre-cycle | — | — | — | — | Low | EMPTY | Statements alone do not identify or demonstrate direct-proof structure. | Author explanation and worked direct proofs, then add reviewed exercises. |
| Demostración por Casos | Proof | Pre-cycle | — | — | — | — | Low | EMPTY | No worked case split is stored. | Author exhaustive/disjoint case design and worked examples. |
| Contraposición | Proof | Pre-cycle | — | — | — | — | Low | EMPTY | No content teaches logical equivalence or contrapositive proof. | Author logic explanation, worked examples, and comparison with contradiction. |
| Contradicción | Proof | Pre-cycle | — | — | — | — | Low | EMPTY | Existing Problems do not include solutions that expose this method. | Author assumption management, contradiction targets, and worked proofs. |
| Inducción Matemática | Proof | Pre-cycle | — | — | — | — | Low | EMPTY | No induction lesson or verified induction exercise set exists. | Author base/step structure, strong induction, common errors, and practice. |
| Construcción, Existencia y Unicidad | Proof | Pre-cycle | — | — | — | — | Low | EMPTY | No explanatory distinction or worked construction is stored. | Author constructive/nonconstructive existence, uniqueness, and counterexample examples. |

## Ciclo 1

| Path | Subject | Cycle | T | P | L | E | Fit confidence | Classification | Reason for fit | Major content gaps |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Ángulos, Paralelas y Perpendiculares | Geometry | 1 | — | `OMMU-PR-2026-1` — Concurrencia de rectas con pendiente recíproca | — | — | Low | PARTIAL | The statement uses triangle side slopes and concurrency, but it is analytic and does not directly teach angle/parallel/perpendicular facts. | Foundational theory, diagrams, elementary exercises, and verified solution. |
| Semejanza y Congruencia | Geometry | 1 | — | `PUTNAM-2024-B2` — Sucesión infinita de cuadriláteros “socios” | — | — | Low | PARTIAL | The statement explicitly uses reflection and congruence, but not a basic similarity/congruence progression. | Definitions, criteria, diagram-led examples, and introductory practice. |
| Áreas y Razones | Geometry | 1 | — | — | — | — | Low | EMPTY | The ellipse-area record is advanced analysis/geometry and is not suitable foundational area-ratio practice. | Full explanation and elementary triangle/polygon area-ratio set. |
| Teorema de Pitágoras | Geometry | 1 | — | `PUTNAM-2021-A1` — Saltos mínimos de un saltamontes a (2021, 2021) | — | — | Medium | PARTIAL | Length-5 integer-coordinate moves invoke Pythagorean triples, but the connection is implicit and the problem is not introductory. | Theorem/proof, converse, distance applications, graded practice, and solution. |
| Factorización e Identidades | Algebra | 1 | — | `OMMU-NAC-2024-1` — La ecuación x⁴ = p + 9y⁴; `PUTNAM-2021-A6` — ¿Es P(2) compuesto si P(x) factoriza? | — | — | Medium | PARTIAL | Both statements genuinely involve polynomial factorization; each is substantially above introductory level. | Identity toolkit, worked factorization, basic-to-OMM progression, and solutions. |
| Manipulaciones y Sustituciones Algebraicas | Algebra | 1 | — | `OMMU-NAC-2024-1`; `PUTNAM-2023-A2` — Un polinomio que satisface p(1/k) = k² | — | — | Low | PARTIAL | Algebraic rewriting/substitution is present, but it is not isolated or taught. | Explanatory sequence, elementary exercises, error checks, and worked solutions. |
| Ecuaciones Algebraicas | Algebra | 1 | — | `OMMU-NAC-2024-1`; `PUTNAM-2024-A1` — Enteros n con solución de 2aⁿ + 3bⁿ = 4cⁿ | — | — | Low | PARTIAL | These are genuine equations, but both are advanced Diophantine problems rather than foundational algebraic-equation practice. | Linear/quadratic methods, equivalence-preserving transformations, and graded practice. |
| Divisibilidad y Criterios de Divisibilidad | Number theory | 1 | — | `PUTNAM-2021-A5` — Sumas de potencias módulo 2021; `PUTNAM-2025-A6` — Divisibilidad en una sucesión binaria recursiva | — | — | Medium | PARTIAL | Divisibility is central in both statements, but modular/power arguments make them advanced. | Basic divisibility properties, standard criteria, elementary exercises, and solutions. |
| Primos y Factorización | Number theory | 1 | — | `OMMU-NAC-2024-1`; `PUTNAM-2024-A1`; `PUTNAM-2025-B3` — Conjunto cerrado bajo divisores de 2025ⁿ − 15ⁿ | — | — | Medium | PARTIAL | Prime/divisor structure is substantive, but no record builds prime factorization from first principles. | Fundamental theorem, valuations at an introductory level, graded practice, and solutions. |
| MCD, MCM y Algoritmo de Euclides | Number theory | 1 | — | `OMMU-NAC-2024-3` — Valores cercanos de una función multiplicativa; `PUTNAM-2025-A1` — Coprimalidad eventual de una recursión de fracciones | — | — | Low | PARTIAL | Both use gcd/coprimality, but neither teaches Euclid or lcm and both are advanced. | Euclidean algorithm, gcd/lcm identities, worked examples, and accessible practice. |
| Bézout y Combinaciones Lineales | Number theory | 1 | — | — | — | — | Low | EMPTY | No statement directly requires or identifies Bézout/linear combinations at a suitable level. | Complete explanation, Euclid-to-Bézout derivation, and targeted exercises. |
| Principio Aditivo y Multiplicativo | Combinatorics | 1 | — | `OMMU-PR-2025-1` — Suma alternante sobre subconjuntos; `PUTNAM-2024-B1` — Selección de casillas con valores 1 a n | — | — | Low | PARTIAL | Both count structured choices, but neither explicitly supplies elementary sum/product-rule practice. | Core rules, overcounting warnings, simple exercises, and worked solutions. |
| Permutaciones y Combinaciones | Combinatorics | 1 | — | `OMMU-NAC-2024-5` — Permutación que evita sumas cero; `PUTNAM-2025-A5` — Signos que maximizan permutaciones ordenadas | — | — | High | PARTIAL | Permutations are explicit and structurally central, but the problems are advanced and do not cover basic combinations. | Introductory formulas/derivations, selection practice, and reviewed solutions. |
| Principio de Casillas | Combinatorics | 1 | — | — | — | — | Low | EMPTY | No inspected statement provides a clear, reviewable pigeonhole application without inferring an unseen solution. | Explanation, canonical examples, escalating exercises, and solutions. |
| Representación en Distintas Bases | Number theory | 1 | — | `PUTNAM-2023-A5` — Suma con signos alternantes en base 3; `PUTNAM-2023-B2` — Mínimo de unos en la representación binaria de 2023n | — | — | High | PARTIAL | Both statements explicitly depend on base representation; they are strong advanced practice candidates. | Base conversion/place value theory, introductory exercises, and solutions. |
| Problemas de Dígitos | Number theory | 1 | — | `PUTNAM-2023-A5`; `PUTNAM-2023-B2` | — | — | High | PARTIAL | Digit counts in base 3 and binary are central, but no decimal or beginner progression exists. | Digit algebra, divisibility links, easier practice, and reviewed solutions. |
| Entrenamiento Mixto — Ciclo 1 | Mixed | 1 | — | Possible pool: `PUTNAM-2021-A1`, `OMMU-PR-2025-1`, `PUTNAM-2024-B1` | — | — | Low | PARTIAL | These are the closest statements to early geometry/counting, but all come from university-level collections. | A balanced beginner set aligned to every Ciclo 1 prerequisite, with solutions and sequencing. |

## Ciclo 2

| Path | Subject | Cycle | T | P | L | E | Fit confidence | Classification | Reason for fit | Major content gaps |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rectas y Puntos Notables | Geometry | 2 | — | `OMMU-PR-2026-1` — Concurrencia de rectas con pendiente recíproca | — | — | Medium | PARTIAL | Triangle midpoints and concurrence are explicit, but the approach is coordinate-based and does not survey notable lines/points. | Synthetic definitions, diagrams, standard centers, elementary practice, and solution. |
| Bisectrices, Incentro y Excentros | Geometry | 2 | — | — | — | — | Low | EMPTY | No inspected statement substantively uses angle bisectors, incenter, or excenters. | Full lesson, diagrams, length/area relations, and practice. |
| Áreas y Razones en Triángulos | Geometry | 2 | — | — | — | — | Low | EMPTY | No suitable triangle area-ratio statement was found. | Theory, ratio lemmas, worked configurations, and graded exercises. |
| Aritmética Modular | Number theory | 2 | — | `PUTNAM-2021-A5`; `PUTNAM-2022-A3` — Sucesiones módulo p y una congruencia módulo 5; `PUTNAM-2024-A4` — Reordenamiento de potencias con diferencia constante mod p | — | — | High | PARTIAL | Congruences are explicit and central in all three, providing a strong advanced practice pool. | Foundational theory, routine exercises, technique sequencing, provenance review, and solutions. |
| Inversos y Congruencias Lineales | Number theory | 2 | — | `PUTNAM-2025-B5` — Descensos del inverso modular; `PUTNAM-2023-B5` — Permutaciones que satisfacen π(π(k)) ≡ mk | — | — | High | PARTIAL | Modular inverse/congruence structure is explicit; both are far beyond an introductory exercise. | Inverse existence, extended Euclid, linear congruence method, easier practice, and solutions. |
| Desigualdades y Medias Fundamentales | Algebra | 2 | — | `PUTNAM-2021-B2` — Máximo de una suma con media geométrica; `OMMU-NAC-2026-2` — Desigualdad entre grados y una función en los vértices | — | — | Medium | PARTIAL | Means/inequalities are substantive, but the settings are advanced infinite sums/graphs. | AM-GM and mean hierarchy, equality cases, graded exercises, and solutions. |
| La Desigualdad Útil | Algebra | 2 | — | — | — | — | Low | EMPTY | The curricular title is still provisional and its intended inequality is not defined, so no evidence-based mapping is safe. | Resolve scope first, then author explanation and select matching practice. |
| Coeficientes Binomiales y Triángulo de Pascal | Combinatorics | 2 | — | `OMMU-PR-2025-1` — Suma alternante sobre subconjuntos; `PUTNAM-2024-B5` — Polinomio de conteo con coeficientes no negativos | — | — | Low | PARTIAL | Both concern subset/sequence counting, but neither explicitly targets Pascal or binomial identities in the statement. | Core theory, combinatorial/algebraic interpretations, direct exercises, and solutions. |
| Doble Conteo | Combinatorics | 2 | — | — | — | — | Low | EMPTY | No statement can be assigned confidently to double counting without inspecting an absent solution. | Explanatory examples, identity proofs, incidence counting, and practice. |
| Inclusión-Exclusión | Combinatorics | 2 | — | — | — | — | Low | EMPTY | No suitable explicit inclusion-exclusion statement was found. | Formula derivation, Venn/examples, restrained generalization, and practice. |
| Ceva y Menelao | Geometry | 2 | — | — | — | — | Low | EMPTY | No statement uses either theorem or the characteristic triangle ratios. | Theorems/proofs, directed-length conventions, diagrams, and exercises. |
| Cauchy-Schwarz y Técnicas Clásicas | Algebra | 2 | — | `OMMU-NAC-2026-2`; `PUTNAM-2025-A2` — Cotas óptimas cuadráticas para sin x | — | — | Low | PARTIAL | Both are genuine inequalities, but the statements do not establish that Cauchy-Schwarz is the intended method. | Cauchy forms/equality cases, classical transformations, direct practice, and solutions. |
| Homogeneización y Sustituciones | Algebra | 2 | — | `OMMU-NAC-2024-1`; `PUTNAM-2023-A2` | — | — | Low | PARTIAL | Homogeneous powers/substitution appear, but neither statement teaches the technique or confirms it as the solution route. | Method explanation, recognition exercises, graded examples, and solutions. |
| Entrenamiento Mixto — Ciclo 2 | Mixed | 2 | — | Possible pool: `OMMU-PR-2026-1`, `PUTNAM-2021-A5`, `PUTNAM-2025-B5`, `OMMU-PR-2025-1` | — | — | Medium | PARTIAL | The pool touches triangle concurrency, modular arithmetic, inverses, and counting, but lacks most Ciclo 2 techniques and suitable progression. | Balanced cycle-aligned set, especially geometry/inequalities/counting, with solutions. |

## Ciclo 3

| Path | Subject | Cycle | T | P | L | E | Fit confidence | Classification | Reason for fit | Major content gaps |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Ángulos en Circunferencias | Geometry | 3 | — | — | — | — | Low | EMPTY | Existing circle records concern an ellipse/tangent family, a random chord, or circumcenters—not inscribed/central angle relations. | Circle-angle theory, diagrams, standard configurations, and practice. |
| Cuadriláteros Cíclicos | Geometry | 3 | — | — | — | — | Low | EMPTY | The quadrilateral record concerns reflection/congruence, not cyclicity. | Characterizations, angle/power relations, diagrams, and exercises. |
| Ecuaciones Diofánticas Lineales | Number theory | 3 | — | — | — | — | Low | EMPTY | Existing Diophantine candidates are nonlinear exponential/quartic equations. | gcd/Bézout solvability, parameterization, constraints, and targeted practice. |
| Diofánticas por Factorización | Number theory | 3 | — | `OMMU-NAC-2024-1` — La ecuación x⁴ = p + 9y⁴; `PUTNAM-2024-A1` — Enteros n con solución de 2aⁿ + 3bⁿ = 4cⁿ | — | — | High | PARTIAL | Both are nonlinear integer equations where factorization/divisibility is materially relevant. | Technique lesson, easier precursor problems, verified solutions, and provenance review. |
| Principio Extremal | Combinatorics | 3 | — | `PUTNAM-2025-A5` — Signos que maximizan permutaciones ordenadas; `PUTNAM-2024-A5` — Radio que minimiza la intersección de una cuerda con un disco | — | — | Low | PARTIAL | Both optimize an extremal quantity, but neither is a clean introductory combinatorial extremal-principle example. | Canonical finite extremal arguments, simpler practice, and solutions. |
| Coloraciones | Combinatorics | 3 | — | `PUTNAM-2022-B3` — Recoloreo iterado por distancias repetidas; `PUTNAM-2025-B1` — Coloración del plano cerrada bajo circuncentros | — | — | High | PARTIAL | Coloring is explicit and central in both statements; the problems are advanced and geometric/infinite. | Finite coloring invariants, accessible examples, progression, and solutions. |
| Potencia de un Punto | Geometry | 3 | — | — | — | — | Low | EMPTY | No inspected statement uses secant/tangent power or an equivalent product relation. | Full theory/proof, diagrams, configurations, and practice. |
| Raíces, Factores y Divisibilidad | Algebra | 3 | — | `OMMU-PR-2024-1` — Raíces de la derivada de p²; `OMMU-NAC-2024-6` — Cota para (p²)″ en términos de (p′)²; `PUTNAM-2021-A6` — ¿Es P(2) compuesto si P(x) factoriza? | — | — | High | PARTIAL | Roots/factors/divisibility are explicit, but two candidates require calculus and all are university-level. | Factor/root theorems without calculus, graded OMM practice, solutions, and level filtering. |
| Relaciones de Vieta | Algebra | 3 | — | — | — | — | Low | EMPTY | No statement explicitly invokes coefficient-root symmetric relations; inferring Vieta from a possible solution would be unsafe. | Vieta theory, reverse construction, symmetric expressions, and exercises. |
| Polinomios en Problemas Olímpicos | Algebra | 3 | — | `PUTNAM-2024-A2` — Polinomios p con esta factorización de p(p(x)) − x; `PUTNAM-2023-A2`; `PUTNAM-2022-A2` — Coeficientes negativos máximos de p(x)² | — | — | High | PARTIAL | Polynomials are the central objects and provide a useful advanced practice pool. | OMM-level progression, non-calculus selection, worked strategies, and solutions. |
| Ecuaciones Diofánticas con Congruencias | Number theory | 3 | — | `OMMU-NAC-2024-1`; `PUTNAM-2024-A1` | — | — | High | PARTIAL | Both integer equations admit meaningful divisibility/congruence analysis. | Explicit method lesson, easier examples, verified solutions, and provenance review. |
| Invariantes y Monovariantes | Combinatorics | 3 | — | `OMMU-NAC-2025-2` — Ventiladores cíclicos y botones de fila-columna; `PUTNAM-2023-B1` — Configuraciones alcanzables deslizando monedas; `PUTNAM-2022-A5` — Juego de fichas en una fila de 2022 casillas | — | — | High | PARTIAL | State-changing processes are central and plausibly support invariant/monovariant practice; solution review is still required before assignment. | Technique explanation, confirmed solution methods, accessible precursors, and solutions. |
| Entrenamiento Mixto — Ciclo 3 | Mixed | 3 | — | Possible pool: `OMMU-NAC-2024-1`, `PUTNAM-2022-B3`, `PUTNAM-2023-B1`, `PUTNAM-2024-A2` | — | — | Medium | PARTIAL | The pool covers Diophantine, coloring, state processes, and polynomials, but omits the cycle’s circle geometry and Vieta. | Balanced cycle-aligned set, especially geometry/Vieta/linear Diophantine, with solutions. |

## Existing content worth reusing

Reuse is conditional on provenance and solution review. The strongest matches based on the actual statements are:

| Existing record(s) | Best potential reuse | Why it is useful | Required cleanup/review |
| --- | --- | --- | --- |
| `PUTNAM-2023-A5`, `PUTNAM-2023-B2` | Representación en Distintas Bases; Problemas de Dígitos | Base 3/binary representation and digit counts are explicit. | Verify source and translation; add controlled topics, level, solutions, and easier precursors. |
| `PUTNAM-2025-B5` | Inversos y Congruencias Lineales | Modular inverse is the named central object. | Verify provenance; mark advanced; author prerequisite practice and solution. |
| `PUTNAM-2021-A5`, `PUTNAM-2022-A3`, `PUTNAM-2024-A4` | Aritmética Modular | Congruences modulo composite/prime moduli are explicit. | Verify provenance and intended round; add levels/topics and solutions. |
| `PUTNAM-2022-B3`, `PUTNAM-2025-B1` | Coloraciones | Both statements explicitly define colorings and closure/recoloring conditions. | Verify provenance; add finite introductory examples and solutions. |
| `OMMU-NAC-2025-2`, `PUTNAM-2023-B1`, `PUTNAM-2022-A5` | Invariantes y Monovariantes | Each has a discrete state-change process suitable for technique review. | Confirm actual solution method before mapping; verify provenance; add solutions. |
| `OMMU-NAC-2024-1`, `PUTNAM-2024-A1` | Diofánticas por Factorización / con Congruencias | Integer equations, prime/divisibility constraints, and factorization are substantive. | Verify OMMU/Putnam source claims; add method notes, levels, and solutions. |
| `OMMU-PR-2024-1`, `OMMU-NAC-2024-6`, `PUTNAM-2021-A6` | Raíces, Factores y Divisibilidad | Roots/factors are explicit in the statements. | Exclude calculus-heavy records from the core progression or clearly mark prerequisites. |
| `OMMU-NAC-2024-5`, `PUTNAM-2025-A5` | Permutaciones y Combinaciones | Permutations are central rather than incidental. | Add foundational combinations material and verified solutions. |
| `OMMU-PR-2026-1` | Rectas y Puntos Notables; possibly late Ciclo 1 geometry | Uses triangle midpoints and concurrency. | Mathematical/source review is essential; the “reciprocal slope” wording should be checked against the source because perpendicular slopes normally use the negative reciprocal. |

The remaining corpus can still serve future advanced/extra practice, especially its Analysis, Linear Algebra, and Probability records, but those topics do not justify forced mappings into the current launch leaves.

## Metadata and provenance concerns

1. **Every one of the 93 Problems has the same status:** `provenance unclear — requires review`.
   - `sourceAttribution`, canonical `competition`, `round`, and `problemNumber` are empty.
   - There are no source/PDF URLs on Problems.
   - The source-file comment says the statements were transcribed from team-provided LaTeX, but those source files and a verification trail are not present in this repository.
   - Codes, `tipo`, and year labels are useful leads, not sufficient proof of official OMMU or Putnam provenance.
2. Nothing in this corpus should be presented as official OMM material. The records are labeled OMMU and Putnam, not OMM, and no OMM Problems or Exams exist.
3. OMMU appears as a university-level collection in the repository context. It must not be conflated with the school-level OMM launch curriculum.
4. The 93 legacy records have no explicit `publicationStatus`; current API compatibility treats them as public. That technical visibility is not editorial or provenance approval.
5. All 93 lack controlled Topics and Tags. Their `tema` values are only seven broad legacy labels and do not establish leaf-level suitability.
6. Categories encode only competition/year placement: Putnam 2021–2025 and OMMU Primera Ronda/Nacional 2024–2026. They do not encode mathematical prerequisites or curriculum fit.
7. All 93 lack the canonical `difficulty` field. The source explicitly says legacy `dificultad` and `exito` are illustrative estimates based on position, not measured performance. There are 22 `Media`, 71 `Difícil`, and no `Fácil` records.
8. There is no stored author, solution, hint, rubric, or source-language/translation-review field. Candidate assignment should wait for statement accuracy and solution review.
9. `OMMU-PR-2026-1` deserves specific statement verification because it says “reciprocal” slope where a perpendicular construction conventionally uses “negative reciprocal.” This audit does not correct the record.

## Content we must author before launch

### Explanatory/editorial material

- All 18 pre-cycle leaves need authored explanatory content. Problem references are not a substitute.
- All 44 Ciclos 1–3 leaves need a coherent explanation or worked-example layer; there is currently no Theory at all.
- Every mathematical leaf needs at least one reviewed solution/example because the existing Problems store statements only.
- `La Desigualdad Útil` needs an explicit editorial scope before content selection or authoring.

### Practice with no suitable existing candidate

Original or externally sourced, properly attributed practice is required for:

- Ciclo 1: Áreas y Razones; Bézout y Combinaciones Lineales; Principio de Casillas.
- Ciclo 2: Bisectrices, Incentro y Excentros; Áreas y Razones en Triángulos; La Desigualdad Útil (after scope approval); Doble Conteo; Inclusión-Exclusión; Ceva y Menelao.
- Ciclo 3: Ángulos en Circunferencias; Cuadriláteros Cíclicos; Ecuaciones Diofánticas Lineales; Potencia de un Punto; Relaciones de Vieta.

### Practice that exists but is not sufficient

- Ciclo 1 needs beginner-level exercises before almost every listed university-level candidate.
- Ciclo 2 needs direct, technique-specific exercises for triangle geometry, Pascal/binomial coefficients, classical inequalities, and homogenization.
- Ciclo 3 needs bridge problems and solutions before the strong but advanced candidates in colorings, polynomials, Diophantine equations, and invariants.
- All three Entrenamiento Mixto leaves need curated, balanced sets matched to material actually taught in their cycle; the current broad corpus cannot be dumped into them safely.

### Reuse-enabling work

- Verify source, competition, year, round/problem number, statement fidelity, and translation for each candidate.
- Add controlled Topics and reviewed canonical difficulty only after mathematical review.
- Add or link reviewed solutions/hints; do not infer techniques solely from statement titles.
- Gather attributed Lists and Exams only from approved sources. None exist today.

## Recommended authoring priority

1. **Pre-cycle launch spine:** author ¿Cómo abordar un problema?, Introducción a las Demostraciones, ¿Cómo escribir una solución?, Cómo entrenar, and the six proof-technique leaves. These make every later Path more usable.
2. **Ciclo 1 foundations:** author the complete theory and basic exercise progression for geometry, algebra, divisibility, counting, and bases. Fill the three EMPTY practice areas first, then place reviewed advanced candidates only as optional challenges.
3. **Ciclo 2 missing core:** author triangle geometry, Ceva/Menelao, double counting, inclusion-exclusion, and resolve `La Desigualdad Útil`. These are the largest structural gaps in the middle cycle.
4. **Ciclo 3 geometry and Vieta:** author circle angles, cyclic quadrilaterals, power of a point, and Vieta; no suitable existing practice currently supports these leaves.
5. **Review and unlock the strongest reuse batch:** provenance/solution review for the base-representation, modular arithmetic, coloring, polynomial, Diophantine, and invariant candidates listed above.
6. **Mixed training last:** curate each mixed set only after its cycle’s teaching content and prerequisite practice are approved, so the set measures the intended cycle rather than the available database.

## Audit conclusion

TeacherPeri already has a potentially useful **advanced Problem bank**, especially for modular arithmetic, base representations, permutations, colorings, polynomial problems, nonlinear Diophantine equations, and state-process invariants. It does **not** yet have a launch-ready curriculum content layer: Theory, Lists, Exams, controlled Topics/Tags, solutions, and verified provenance are absent. The safest next production batch is therefore authored pre-cycle/Ciclo 1 explanation plus foundational practice, in parallel with human provenance and mathematical review of the strongest reusable Problems.
