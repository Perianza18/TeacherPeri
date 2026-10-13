# Theory writing lab — October 2026

Branch: `batch/theory-writing-lab`. Based on the unmerged
`batch/problem-discovery-pedagogy` batch. Neither batch is approved for merging.
This experiment changes exactly six canonical articles; the other 31 are unchanged.
It does not create parallel Theory records or modify Path/Problem identities.

## Review without touching the database

Switch to this branch and run `npm run dev`. Open the URL Vite prints, followed by
`/revision/teoria`. Only the frontend is needed. The page reads source drafts,
uses the same article renderer as the website, and labels every proposal A1–B3.
It makes no API requests to load the drafts. Links out to the live libraries need
the normal server and database. The review route and its data imports are excluded
from production builds, not just hidden in navigation.

| Proposal | Existing article | Editorial method |
| --- | --- | --- |
| A1 | Principios aditivo y multiplicativo | Build and perturb one counting model; discover why cases are needed |
| A2 | Permutaciones y combinaciones | Resolve apparently conflicting answers by defining what counts as different |
| A3 | Inducción matemática | Find the reusable step in a construction, then transfer it to algebra |
| B1 | Primos y factorización | Follow N1's sequence, connecting prime factors with residues |
| B2 | Congruencias | Follow N2's sequence, including arithmetic rules, cancellation, applications, recap and practice |
| B3 | Principio de casillas | Follow C3's sequence, from forcing repetition to increasingly difficult problems |

A uses a question that develops through the lesson; terminology is introduced
when it explains something the reader has already encountered. The three A
lessons deliberately use different investigations instead of a shared paragraph
formula. B follows the numbered section and subsection order of the corresponding
OMMBC lesson, with original prose, examples and exercises. Short source headings
are attributed through the review links; operation subheading wording in B2 is
shortened. The source's casual tone is adapted without copying personal anecdotes,
slang, jokes, or official contest problems.

Solutions and hints are collapsed, so questions are genuine opportunities to
think. These disclosures sit inside the section that owns them and do not add
extra numbered sections to B. Existing canonical bank previews come after the
article's practice sequence; the main Theory page retains its topic-filtered CTA
and contextual Path return navigation. The local review uses code searches for
bank links, because existing imported IDs can differ from generated IDs.

The six articles currently contain short, original embedded learning exercises.
These are not copies of the canonical Problems. Reusable bank problems continue
to be referenced rather than stored again in articles.

## Sources actually studied

The site's Angular training index was inspected, including both basic and
advanced material pages. The following documents were read to examine teaching
choices, not to reproduce a collection. Accessed October 12–13, 2026.

| OMMBC material | Observation used in the experiment |
| --- | --- |
| [C1: counting principles](https://ommbc.org/sitio/Material/Combinatoria/C1_Principios.pdf) | Tiny enumerations and questions help explain where operations come from; exercises and problems serve different purposes |
| [C2: permutations and combinations](https://ommbc.org/sitio/Material/Combinatoria/C2_CombYPerm.pdf) | Prerequisite reminders can stay short when the learner is ready for applications; a follow-up lesson need not reteach everything |
| [C3: pigeonhole](https://ommbc.org/sitio/Material/Combinatoria/C3_Casillas.pdf) | Begin with a forced repetition, then generalize; progress from direct classifications to objects the solver must invent |
| [C4: games](https://ommbc.org/sitio/Material/Combinatoria/C4_Juegos.pdf) | Examples can precede the strategy discussion, rather than follow a long catalog of definitions |
| [D2: induction](https://ommbc.org/sitio/Material/Demostraciones/D2_Induccion.pdf) | Separate intuition from the components needed in a written proof; broaden practice after an accessible entry |
| [N1: prime factors and remainders](https://ommbc.org/sitio/Material/Numeros/N1_TFA.pdf) | Move between representations and use them to answer concrete divisibility questions |
| [N2: congruences](https://ommbc.org/sitio/Material/Numeros/N2_ModulosDivisibilidad.pdf) | Connect prior remainder knowledge to notation, operations, applications and increasingly demanding practice |
| [G4: power of a point](https://ommbc.org/sitio/Material/Geometria/G4_Potencias.pdf) | Advanced readers can begin with prerequisites and precise geometric relations; introductory storytelling is not universally appropriate |

The sources vary substantially. There is no single universal “OMMBC template.”
B1, B2 and B3 therefore each name one concrete reference and preserve its order.
No PDFs are included in the repository. Read the source links for the originals.

## Reusable writing protocol

This is a project editorial guide, not an installed agent skill. It is versioned
with the lessons so future revisions can use and improve the same criteria.

1. **Choose one change in the reader's thinking.** Describe what the student can
   explain or decide afterward. A list of covered definitions is not a learning goal.
2. **Name prerequisites and choose the amount of support.** `engagement` records
   editorial scaffolding, not ability, school grade, competition level or difficulty.
   At 9–10, let the reader construct small cases and explain a choice before symbols.
   At 6–8, keep an accessible bridge but move into full arguments sooner. At 1–5,
   presume the stated background and motivate a precise mathematical question.
   These are editorial targets, not validated measurements of student behavior.
3. **Solve the anchor problem before writing.** Record the decisive observation,
   its justification, a tempting wrong approach and the smallest useful hint.
4. **Choose a structure because it fits the mathematics.** Possible structures:
   guided construction; competing answers and overcounting; worked example followed
   by strategic reflection; prior concept extended to a new setting. Do not turn
   every topic into the same introduction/definitions/example/errors/summary shell.
5. **Draft transitions, not just sections.** Each paragraph must answer a question
   raised earlier or explain why the next question is worth asking. A friendly
   fictional setting alone does not make a lesson exploratory.
6. **Give real thinking space.** Ask a specific, answerable question, then put hints
   and the response behind disclosures. Do not ask “what do you think?” and reveal
   everything in the next visible sentence. The student must have enough information
   to attempt the question without guessing an unstated theorem.
7. **Explain discovery and proof separately.** Show why a solver might choose the
   move, then why it is valid. State domains, exceptional cases and whether a
   prerequisite theorem is being used. Never imply a numerical experiment proves
   a universal claim or present an unproved uniqueness assertion as established.
8. **Design a progression of tasks.** Include immediate checks, a variation that
   changes a condition, and at least one transfer problem requiring tool selection.
   Difficulty comes from the idea, not larger numbers. Supply enough solution
   reasoning for independent study; avoid a wall of bare answers.
9. **Respect ownership and identity.** Write original prose and activities. Name
   methodological sources. Keep official contest problems and PDFs at their source.
   Reference bank Problems by identity. Never copy an existing Problem into an article.
10. **Review twice.** First read as a novice: where is a new symbol, assumption or
    unexplained jump? Then read as a skeptical mathematician: where could a boundary
    case, counterexample or unjustified converse break the argument? Read rendered
    pages on mobile, including expanded solutions, before publication.

Reject a draft if it merely adds an anecdote before the old definition dump,
uses a question without any opportunity to answer, says “obvious” in place of the
central reasoning, or assumes every reader wants either childish jokes or a
university-textbook voice. Warmth can come from anticipating the reader's thought.

## Mathematical review record

- A1: exhaustive enumeration independently gives 30 even and 18 odd three-digit
  numbers with distinct digits from 0–4; the cases explain the zero restriction.
- A2: programs versus selections, fixed multiplicity, block compression and the
  order-swapping bijection were checked separately. All examples use distinct objects.
- A3: bases and domains are explicit; each inductive step was expanded and checked.
  The direct proof of the stick count is acknowledged. The false step-by-two
  example is identified as failing to reach the claimed domain, not as bad algebra.
- B1: prime testing includes the square-root boundary; factorization applies to
  integers greater than one. Uniqueness uses Euclid's lemma as a stated prerequisite.
  Divisor counts, square multipliers and irrationality reasoning were checked.
- B2: canonical residues and arbitrary representatives are distinguished. The
  cancellation counterexample, coprime cancellation proof and all residue tables
  were checked. Sums/differences of powers explicitly distinguish odd/even exponents.
- B3: lower-bound examples demonstrate sharp thresholds where claimed; numbers
  selected into pairs must be distinct. Geometry assigns boundary points once.
  The final partial-sum proof includes the empty prefix and produces a nonempty block.

The references are pedagogical models, not an unchecked mathematical authority.
For instance, source material contains a factorial arithmetic typo and a
sum/difference-of-powers inconsistency. The corresponding TeacherPeri statements
were checked independently. No claims of student-tested effectiveness are made.

## Evaluation

For each sample, mark 1–5 for continuity of explanation, quality of questions,
clarity of proof, practice progression and desire to keep reading. Note a specific
paragraph that lost you and a question that helped. Prefer a method by topic and
reader experience if appropriate; there need not be one winner for everything.
Different topics are a comparison confound. If the preference is uncertain, the
next experiment should rewrite the same topic in both favored methods before
revising the remaining library. This batch stops at the requested six articles.

## Existing database rollout — only after review

Pulling a branch does not change articles stored in MongoDB. For now use the review
page. No database import is needed to evaluate these drafts.

After approval, with the updated renderer in place and an explicit private
`MONGO_CONTENT_IMPORT_URI` including the database path:

```sh
npm run content:revise:editorial -- --dry-run
CONTENT_IMPORT_CONFIRM=teacherperi npm run content:revise:editorial -- --apply
npm run content:check
```

The database name in the confirmation must match the intended target. The revision
accepts exact original MVP text or exact first-batch text/engagement values, and
is idempotent for the six new values. It rejects independent edits, missing lessons
and ambiguous title matches. It updates only content and engagement in one
transaction, using the exact old values in each update filter. It does not alter
IDs, titles, summaries, Topics, Steps or Paths. Running the old branch afterward
will not silently roll the content back. A rollback would need a separate reviewed
compare-and-set migration; do not use the standard importer to overwrite conflicts.

The pure revision planner is unit tested. A live Atlas revision has not been run.
Database transaction behavior must be verified on a disposable replica set before
production rollout; local browser checks use fixture data or the API-free lab.

## Validation of this branch

- Lint and production build pass (the existing bundle-size advisory remains).
- Strict KaTeX and manifest validation pass for all 511 records.
- 130 database-free unit tests pass, including revision conflict and idempotency checks.
- All 16 desktop/mobile browser checks pass. The lab checks visit all six proposals,
  verify section order and optional disclosures, and assert zero API calls.
- Desktop reading and an expanded mobile solution were visually inspected; numbered
  solutions were subsequently separated into paragraphs for easier mobile reading.
- The production bundle was checked to exclude the development review page and draft data.
- No Atlas writes, live database integration run, or deployment was performed.

## Follow-up: two refined review examples

At the owner's request, continue on this same branch without merging. The lab now
shows new versions of counting and pigeonhole (marked “Actualizada”); the other
four articles retain their prose. Review titles show the topic name alone.

Both new versions share the prefixes Preámbulo, Teoría, Ejercicios, Agregados
culturales, Problemas, and Problemas de mayor dificultad. The text after the colon
varies with the topic. Each counting technique or pigeonhole variant has a guided
example. Purple definition panels make formal statements easy to locate.

The problem collection component displays at most five entries, with a link to
its complete review list. Each example has six practice problems and two harder
problems, with the same layout for both tiers and optional hints/solutions.
Four existing bank problems are referenced by code; twelve proposed problems are
stored once in `refinedTheorySamples.js` and referenced from ordered collections.
They are explicitly marked as drafts and do not pretend to exist in Atlas.

**This follow-up is review-only.** The original six database revision payloads
remain available unchanged. The new two texts, proposed problems, collection
references and shorter titles have NOT been added to the importer or applied to
MongoDB. Their canonical rollout should be designed only after the owner chooses
this format; do not run the revision command expecting these two new samples to
appear in the database. Use `/revision/teoria` to evaluate them now.

Checks: lint and production build pass; strict KaTeX validates both new texts and
all twelve proposed problems; collection references resolve without duplicates.
The answers 108 (four-digit multiples of five) and 50 (keys containing both symbols)
were independently enumerated. All 18 desktop/mobile browser checks pass, including
five-item previews, complete-list navigation, definitions and consistent prefixes.
Desktop definition panels and mobile problem collections were visually inspected.

The owner's final sentence about harder problems was incomplete. The implementation
uses the requested neutral label and matching presentation; further behavior awaits
the missing feedback, rather than inventing an additional requirement.
