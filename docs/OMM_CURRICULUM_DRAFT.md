# Preparación para la OMM — curriculum draft

**Status:** Assumption-driven working draft for review.
**Implementation source:** [`server/src/data/ommCurriculum.js`](../server/src/data/ommCurriculum.js)
**Preview:** `npm run curriculum:preview:omm`

This document makes the proposed chronological OMM journey inspectable without promoting provisional curriculum choices into the canonical product contract. The generic Path behavior remains defined by [PRODUCT.md](PRODUCT.md) and [ARCHITECTURE.md](ARCHITECTURE.md).

For the subject-by-subject review view of the same 54-item baseline, see [OMM_SUBJECT_AUDIT.md](OMM_SUBJECT_AUDIT.md).

## Settled decisions

- `Preparación para la OMM` is one root Path in the generic reusable Path engine.
- Its five cycle titles are `PathSection` headings, not Paths.
- `PathReference.order` defines one global chronological sequence. Subjects are interleaved rather than grouped as a table of contents.
- Each cycle ends with its reusable leaf Path `Entrenamiento Mixto — Ciclo N`.
- Topic Paths use subject/topic identities rather than cycle-specific names. The mixed checkpoints are the intentional exception.
- All new curriculum records default to `draft`. Nothing becomes public merely because the structure is applied.
- The mixed Paths remain empty draft leaves. `Reconoce → Resuelve → Mezcla → Reflexiona` is editorial guidance for their progression, not four literal Steps.
- `Simulacros OMM` is intended to become a parent Path containing reusable individual simulation Paths. Those children will be defined only after approved Exams and Problems are reviewed.
- No Path completion, progress, access, or Phase 4 behavior is added or changed.

## Mixed-training editorial guidance

Earlier mixed training should emphasize recognizing broad problem areas, identifying recently learned tools, guided practice, and short complete solutions. Later checkpoints should progressively demand more independence, technique selection, combinations of old and new tools, difficult mixed problems, complete proof-writing, strategic experimentation, abandoning unproductive approaches, and reflection.

This progression guides later authoring. It does not prescribe Step titles or create content records. Actual Steps and Problem selections remain pending editorial review.

## Preview

```text
Preparación para la OMM
├── Fundamentos de la Olimpiada
├── Técnicas de Demostración
├── Consejos para Empezar a Entrenar
│
[PathSection] Ciclo 1 — Primeros Pasos
├── Ángulos, Triángulos y Configuraciones Básicas
├── Divisibilidad y Números Primos
├── Identidades y Manipulación Algebraica
├── Conteo Básico
├── Congruencia y Semejanza de Triángulos
├── Máximo Común Divisor y Algoritmo de Euclides
├── Factorización y Ecuaciones Elementales
├── Principio del Palomar
└── Entrenamiento Mixto — Ciclo 1
│
[PathSection] Ciclo 2 — Herramientas Fundamentales
├── Círculos: Ángulos y Propiedades Fundamentales
├── Congruencias y Residuos
├── Desigualdades Fundamentales
├── Permutaciones y Combinaciones
├── Potencia de un Punto
├── Ecuaciones Diofánticas Básicas
├── Principio de Inclusión-Exclusión
├── Sucesiones: Primeros Patrones
└── Entrenamiento Mixto — Ciclo 2
│
[PathSection] Ciclo 3 — Construyendo Técnica
├── Ceva y Menelao
├── Polinomios y Raíces
├── Teoremas Clásicos de Aritmética Modular
├── Invariantes
├── Desigualdades: Técnicas Intermedias
├── Ecuaciones Diofánticas: Técnicas Intermedias
├── Doble Conteo
├── Configuraciones de Círculos
├── Recurrencias
└── Entrenamiento Mixto — Ciclo 3
│
[PathSection] Ciclo 4 — Ampliando Herramientas
├── Transformaciones Geométricas
├── Sucesiones y Recurrencias Avanzadas
├── Órdenes y Estructura Modular
├── Principio Extremal
├── Desigualdades: Herramientas Avanzadas
├── Valuaciones y Exponentes en Teoría de Números
├── Grafos para Olimpiadas
├── Polinomios: Técnicas Avanzadas
├── Introducción a Ecuaciones Funcionales
└── Entrenamiento Mixto — Ciclo 4
│
[PathSection] Ciclo 5 — Integración y Estrategia
├── Geometría Sintética Avanzada
├── Descenso Infinito y Salto de Vieta
├── Ecuaciones Funcionales: Técnicas Intermedias
├── Combinatoria Avanzada: Coloraciones y Estructuras
├── Teoría de Números: Problemas de Integración
├── Desigualdades Avanzadas
├── Transformaciones y Configuraciones Geométricas Avanzadas
├── Estrategias de Ataque de Problemas
├── Redacción y Pulido de Soluciones
├── Problemas de Síntesis
└── Entrenamiento Mixto — Ciclo 5
│
├── Simulacros OMM
└── Consejos para Competir
```

The section lines above are presentation headings. Every other line is an ordinary reusable Path referenced directly by the root.

## Inventory

“New definition; reuse exact match” means no curriculum Path was previously defined in repository source. The guarded application command searches the target development database by exact slug and title, reuses one matching identity, and stops on ambiguous/conflicting identities. No database application was run while preparing this draft.

| Order | Path title | Slug | PathSection | Level | New status | Existing/new | Steps | Educational references | Assumption / editorial gap |
| ---: | --- | --- | --- | --- | --- | --- | ---: | --- | --- |
| 1 | Fundamentos de la Olimpiada | `fundamentos-de-la-olimpiada` | — | introductorio | draft | New definition; reuse exact match | 0 | 0 | Needs approved orientation content. |
| 2 | Técnicas de Demostración | `tecnicas-de-demostracion` | — | introductorio | draft | New definition; reuse exact match | 0 | 0 | Needs a reviewed proof sequence and examples. |
| 3 | Consejos para Empezar a Entrenar | `consejos-para-empezar-a-entrenar` | — | introductorio | draft | New definition; reuse exact match | 0 | 0 | Title and content are provisional. |
| 4 | Ángulos, Triángulos y Configuraciones Básicas | `angulos-triangulos-y-configuraciones-basicas` | Ciclo 1 | introductorio | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 5 | Divisibilidad y Números Primos | `divisibilidad-y-numeros-primos` | Ciclo 1 | introductorio | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 6 | Identidades y Manipulación Algebraica | `identidades-y-manipulacion-algebraica` | Ciclo 1 | introductorio | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 7 | Conteo Básico | `conteo-basico` | Ciclo 1 | introductorio | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 8 | Congruencia y Semejanza de Triángulos | `congruencia-y-semejanza-de-triangulos` | Ciclo 1 | introductorio | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 9 | Máximo Común Divisor y Algoritmo de Euclides | `maximo-comun-divisor-y-algoritmo-de-euclides` | Ciclo 1 | introductorio | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 10 | Factorización y Ecuaciones Elementales | `factorizacion-y-ecuaciones-elementales` | Ciclo 1 | introductorio | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 11 | Principio del Palomar | `principio-del-palomar` | Ciclo 1 | introductorio | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 12 | Entrenamiento Mixto — Ciclo 1 | `entrenamiento-mixto-ciclo-1` | Ciclo 1 | introductorio | draft | New definition; reuse exact match | 0 | 0 | Needs authored Steps and a reviewed accessible mixed-problem selection. |
| 13 | Círculos: Ángulos y Propiedades Fundamentales | `circulos-angulos-y-propiedades-fundamentales` | Ciclo 2 | omm | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 14 | Congruencias y Residuos | `congruencias-y-residuos` | Ciclo 2 | omm | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 15 | Desigualdades Fundamentales | `desigualdades-fundamentales` | Ciclo 2 | omm | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 16 | Permutaciones y Combinaciones | `permutaciones-y-combinaciones` | Ciclo 2 | omm | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 17 | Potencia de un Punto | `potencia-de-un-punto` | Ciclo 2 | omm | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 18 | Ecuaciones Diofánticas Básicas | `ecuaciones-diofanticas-basicas` | Ciclo 2 | omm | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 19 | Principio de Inclusión-Exclusión | `principio-de-inclusion-exclusion` | Ciclo 2 | omm | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 20 | Sucesiones: Primeros Patrones | `sucesiones-primeros-patrones` | Ciclo 2 | omm | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 21 | Entrenamiento Mixto — Ciclo 2 | `entrenamiento-mixto-ciclo-2` | Ciclo 2 | omm | draft | New definition; reuse exact match | 0 | 0 | Needs authored Steps and a reviewed unlabeled mixed-problem selection. |
| 22 | Ceva y Menelao | `ceva-y-menelao` | Ciclo 3 | omm | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 23 | Polinomios y Raíces | `polinomios-y-raices` | Ciclo 3 | omm | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 24 | Teoremas Clásicos de Aritmética Modular | `teoremas-clasicos-de-aritmetica-modular` | Ciclo 3 | omm | draft | New definition; reuse exact match | 0 | 0 | Fermat/Euler scope needs editorial review. |
| 25 | Invariantes | `invariantes` | Ciclo 3 | omm | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 26 | Desigualdades: Técnicas Intermedias | `desigualdades-tecnicas-intermedias` | Ciclo 3 | omm | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 27 | Ecuaciones Diofánticas: Técnicas Intermedias | `ecuaciones-diofanticas-tecnicas-intermedias` | Ciclo 3 | omm | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 28 | Doble Conteo | `doble-conteo` | Ciclo 3 | omm | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 29 | Configuraciones de Círculos | `configuraciones-de-circulos` | Ciclo 3 | omm | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 30 | Recurrencias | `recurrencias` | Ciclo 3 | omm | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 31 | Entrenamiento Mixto — Ciclo 3 | `entrenamiento-mixto-ciclo-3` | Ciclo 3 | omm | draft | New definition; reuse exact match | 0 | 0 | Needs authored Steps and a reviewed multi-technique problem selection. |
| 32 | Transformaciones Geométricas | `transformaciones-geometricas` | Ciclo 4 | avanzado | draft | New definition; reuse exact match | 0 | 0 | Rotation/reflection/homothety scope needs review. |
| 33 | Sucesiones y Recurrencias Avanzadas | `sucesiones-y-recurrencias-avanzadas` | Ciclo 4 | avanzado | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 34 | Órdenes y Estructura Modular | `ordenes-y-estructura-modular` | Ciclo 4 | avanzado | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 35 | Principio Extremal | `principio-extremal` | Ciclo 4 | omm | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 36 | Desigualdades: Herramientas Avanzadas | `desigualdades-herramientas-avanzadas` | Ciclo 4 | avanzado | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 37 | Valuaciones y Exponentes en Teoría de Números | `valuaciones-y-exponentes-en-teoria-de-numeros` | Ciclo 4 | avanzado | draft | New definition; reuse exact match | 0 | 0 | LTE inclusion remains conditional on OMM scope. |
| 38 | Grafos para Olimpiadas | `grafos-para-olimpiadas` | Ciclo 4 | omm | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 39 | Polinomios: Técnicas Avanzadas | `polinomios-tecnicas-avanzadas` | Ciclo 4 | avanzado | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 40 | Introducción a Ecuaciones Funcionales | `introduccion-a-ecuaciones-funcionales` | Ciclo 4 | omm | draft | New definition; reuse exact match | 0 | 0 | Scope and placement need review. |
| 41 | Entrenamiento Mixto — Ciclo 4 | `entrenamiento-mixto-ciclo-4` | Ciclo 4 | avanzado | draft | New definition; reuse exact match | 0 | 0 | Needs authored Steps and a reviewed viewpoint-selection problem set. |
| 42 | Geometría Sintética Avanzada | `geometria-sintetica-avanzada` | Ciclo 5 | avanzado | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 43 | Descenso Infinito y Salto de Vieta | `descenso-infinito-y-salto-de-vieta` | Ciclo 5 | avanzado | draft | New definition; reuse exact match | 0 | 0 | Scope and sequencing need review. |
| 44 | Ecuaciones Funcionales: Técnicas Intermedias | `ecuaciones-funcionales-tecnicas-intermedias` | Ciclo 5 | avanzado | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 45 | Combinatoria Avanzada: Coloraciones y Estructuras | `combinatoria-avanzada-coloraciones-y-estructuras` | Ciclo 5 | avanzado | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 46 | Teoría de Números: Problemas de Integración | `teoria-de-numeros-problemas-de-integracion` | Ciclo 5 | avanzado | draft | New definition; reuse exact match | 0 | 0 | Exact mathematical scope needs review. |
| 47 | Desigualdades Avanzadas | `desigualdades-avanzadas` | Ciclo 5 | avanzado | draft | New definition; reuse exact match | 0 | 0 | Needs approved Steps/content. |
| 48 | Transformaciones y Configuraciones Geométricas Avanzadas | `transformaciones-y-configuraciones-geometricas-avanzadas` | Ciclo 5 | avanzado | draft | New definition; reuse exact match | 0 | 0 | Possible overlap with earlier geometry Paths needs review. |
| 49 | Estrategias de Ataque de Problemas | `estrategias-de-ataque-de-problemas` | Ciclo 5 | avanzado | draft | New definition; reuse exact match | 0 | 0 | Needs an approved strategy sequence. |
| 50 | Redacción y Pulido de Soluciones | `redaccion-y-pulido-de-soluciones` | Ciclo 5 | avanzado | draft | New definition; reuse exact match | 0 | 0 | Relationship to Técnicas de Demostración needs review. |
| 51 | Problemas de Síntesis | `problemas-de-sintesis` | Ciclo 5 | avanzado | draft | New definition; reuse exact match | 0 | 0 | Exact role versus mixed training needs review. |
| 52 | Entrenamiento Mixto — Ciclo 5 | `entrenamiento-mixto-ciclo-5` | Ciclo 5 | avanzado | draft | New definition; reuse exact match | 0 | 0 | Needs authored Steps, hard mixed problems, and contest-like sets. |
| 53 | Simulacros OMM | `simulacros-omm` | — | avanzado | draft | New definition; reuse exact match | 0 | 0 | Intended parent; individual simulation Paths require approved Exam/Problem review. |
| 54 | Consejos para Competir | `consejos-para-competir` | — | avanzado | draft | New definition; reuse exact match | 0 | 0 | Title and content are provisional. |

## Working assumptions

- The provisional titles and sequence from the curriculum brief are used exactly unless a known reusable identity already exists.
- Ciclo 1 uses `introductorio`; Ciclos 2–3 use `omm`; clearly higher-level Paths in Ciclos 4–5 use `avanzado`. Level remains descriptive.
- `Invariantes` and `Principio Extremal` are placed with combinatorial/problem-solving material for balance, but remain reusable beyond that subject context.
- `Sucesiones: Primeros Patrones` and `Recurrencias` are currently labeled algebra for the inventory; this does not constrain future Topics or Tags.
- No controlled Tags are created automatically. Tag governance and exact taxonomy remain deferred.
- `Simulacros OMM` stays an empty draft until reusable individual simulation Paths can be designed from reviewed Exams and Problems.
- Exact title/slug matches may be reused by the database application. Near or ambiguous matches stop the command for human review rather than being repurposed.

## Editorial gaps

- The repository has no existing source-defined Paths or approved Theory/List/Exam mappings for this curriculum. Test Paths are fixtures and are not reusable product content.
- The existing Problem dataset contains OMM/OMMU and Putnam material, but its suitability, difficulty, rights/provenance, and exact curriculum placement have not been reviewed here. No Problem was attached automatically.
- Every topic Path is intentionally an empty draft and needs ordered Steps plus approved references before publication.
- Each mixed Path is also an empty draft. Editorial review must author its Steps, select appropriate existing Problems, and decide whether additional Theory, Lists, or Exams belong there.
- The two advice Paths, proof foundations, strategic-solving Paths, synthesis work, and simulations need authored content.
- The practice-density progression is represented by the curriculum intent and mixed checkpoints; actual problem counts remain undecided.

## Safe application behavior

`npm run db:apply:omm-curriculum` is an additive local-development migration, not a reset or production deployment command. It requires `NODE_ENV=development`, an explicit loopback `MONGO_MIGRATION_URI` named `teacherperi_dev` or `teacherperi_dev_<suffix>`, and an exact `MIGRATION_DATABASE_CONFIRM`.

The command:

- validates the source definition before connecting;
- reuses exact Path title/slug matches and aborts on identity conflicts;
- preserves authored descriptions, levels, Tags, publication status, and existing Steps;
- creates only missing Paths as drafts;
- creates/reuses the five root-owned PathSections;
- creates or updates only the specified root PathReferences and preserves unrelated references;
- does not create, replace, or remove any Steps;
- never deletes or resets any record.

The command has not been run as part of this draft. Run the database-free preview first:

```sh
npm run curriculum:preview:omm
```

Only after verifying a disposable local development database may the guarded application be run:

```sh
NODE_ENV=development \
MONGO_MIGRATION_URI=mongodb://127.0.0.1:27017/teacherperi_dev \
MIGRATION_DATABASE_CONFIRM=teacherperi_dev \
npm run db:apply:omm-curriculum
```

## Questions for later review

1. Which topic titles should be merged with or renamed to match future approved Path identities?
2. Does each cycle’s order reflect the desired prerequisites without implying access locks?
3. Which Ciclo 4–5 Paths should remain `avanzado`, and which should be `omm`?
4. Which existing Problems are pedagogically and legally suitable for each topic and mixed checkpoint?
5. Is `Problemas de Síntesis` distinct enough from `Entrenamiento Mixto — Ciclo 5`?
6. How should `Redacción y Pulido de Soluciones` reuse or relate to `Técnicas de Demostración`?
