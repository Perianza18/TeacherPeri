# Problem discovery and pedagogy — review batch

Branch: `batch/problem-discovery-pedagogy`. Do not merge before Elias approves.

## Browse and practice

Problems lead with the full mathematical statement and stable code. Titles remain optional legacy metadata, not public headings. Search also matches statement text. The primary search has a single input; additional filters live under “Afinar búsqueda”. Controls are real keyboard-focusable buttons with pressed states, not native selects. Problem detail suggests up to six published theory pages sharing topic metadata; suggestions are tools to review, not claims that a specific technique is required.

## Contextual challenge

`Problem.trainingContexts[]` stores independent editorial assessments on ONE canonical document:

- `schoolStage`: primaria / secundaria / bachillerato.
- `grade`: optional local school year (1–6 primary, 1–3 secondary or upper secondary).
- `contest`: OMM / OMMEB.
- `stage`: escolar / municipal / estatal / nacional.
- `challenge`: integer 1–6, relative to the chosen audience and competition stage.
- `rationale`: required explanation of the assessment.

These are preparation targets, not official eligibility rules or claims of provenance. School year alone does not determine competition eligibility. Existing `competition`, `round`, and source metadata still record provenance. Old broad difficulty metadata remains for compatibility but is no longer shown as problem Nivel.

Example of permitted DATA SHAPE (not a rating assigned to a live problem): the same Problem may have OMM/estatal/secundaria 6 and OMM/nacional/secundaria 2. No automatic conversion between contexts is valid. Query dimensions are combined with `$elemMatch`, so a national rating cannot accidentally match an unrelated state rating in the same document. Missing ratings never become zero. Unclassified problems remain in unfiltered results and are excluded from context-filtered results. This batch deliberately does not invent ratings for the existing bank; contextual filtering will return empty results until assessments are reviewed and stored.

Challenge rubric: 1 direct application after a lesson; 2 one familiar connection; 3 choose a tool and justify multiple steps; 4 non-obvious combination; 5 sustained strategic work; 6 demanding within this specific cohort. These are editorial estimates, not official scales or measured solve rates.

## Teaching style

`Theory.engagement` is an optional integer 1–10 describing the intended amount of narrative and guided discovery. It does NOT measure quality, entertainment, age, or mathematical difficulty. A low value still requires motivation and explanation.

- 9–10: concrete question, small cases, pattern, reasoning, then terminology.
- 6–8: meaningful model or mathematical puzzle, explicit bridge to proof.
- 3–5: concise mathematical motivation and carefully explained examples.
- 1–2: formal exposition with clear prerequisites and proof structure.

No score is guessed for untouched articles. This batch rewrites three representative lessons: additive/multiplicative counting (10), permutations/combinations (10), induction (8). Each includes original motivation, connected derivation, at least two worked developments, three exercises with reasoning checks, existing canonical problem previews where references exist, and the final practice-bank link. Other articles remain unchanged pending feedback on this voice. Advanced material need not adopt a childlike narrative. Future audience versions should share a conceptual topic, not duplicate Problems.

Pedagogical reference: OMMBC, *Inducción*, training #10 (2016), https://ommbc.org/sitio/Material/Demostraciones/D2_Induccion.pdf ; resource portal https://ommbc.org/sitio/#/entrenate . The reviewed guide motivates a formal method intuitively and extends it through varied practice. TeacherPeri's prose and examples are original; no source PDF or copied explanation is hosted.

## Preview and rollout

Frontend and search/model changes need only this branch's server and dev processes. Existing Atlas lesson bodies will NOT change just by pulling the branch. The browser tests use the updated manifest to preview rewritten articles without database writes.

For an existing database, after reviewing the draft articles and intentionally choosing the target:

```
npm run content:revise:editorial -- --dry-run
CONTENT_IMPORT_CONFIRM=teacherperi npm run content:revise:editorial -- --apply
```

The revision script reuses explicit MONGO_CONTENT_IMPORT_URI guards, requires replica-set transactions, compares exact old article content, refuses independently edited articles, preserves IDs/relationships, and is idempotent. Run it only after approval of the content; it has NOT been run against Atlas in this work session. For a new empty database the standard content import includes the revised articles. Running the ordinary importer against an old installation before the editorial migration intentionally reports conflicts rather than silently overwriting it.
