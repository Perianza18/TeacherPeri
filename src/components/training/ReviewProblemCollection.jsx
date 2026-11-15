import PracticeBox from '../content/PracticeBox'
import { REVIEW_COLLECTIONS, REVIEW_PROBLEMS } from '../../../server/src/data/refinedTheorySamples'
import { MVP_PROBLEMS } from '../../../server/src/data/mvpProblems'

const byCode = new Map([...MVP_PROBLEMS, ...REVIEW_PROBLEMS].map((problem) => [problem.codigo, problem]))

// Review/dev only (never on the live page): draws a lesson collection from
// the draft review data, or from an explicit list of problem codes, in the
// same practice box the live page uses. Draft problems are not published,
// so they get no «Resolver» link; bank problems link to the bank search.
// `kind`: ejercicios, practice or dificiles (the review data calls it challenge).
export default function ReviewProblemCollection({ collection, kind, codes }) {
  const list = codes || REVIEW_COLLECTIONS[collection]?.[kind === 'dificiles' ? 'challenge' : kind] || []
  const problems = list.map((code) => byCode.get(code)).filter(Boolean).map((problem) => ({
    ...problem,
    _id: problem.codigo,
    href: problem.draft ? null : `/entrenamiento/problemas?q=${encodeURIComponent(problem.codigo)}`,
  }))
  return problems.length > 0 ? <PracticeBox kind={kind} problems={problems} /> : null
}
