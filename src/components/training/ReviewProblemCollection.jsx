import { Link } from 'react-router-dom'
import MathText from '../math/MathText'
import { REVIEW_COLLECTIONS, REVIEW_PROBLEMS } from '../../../server/src/data/refinedTheorySamples'
import { MVP_PROBLEMS } from '../../../server/src/data/mvpProblems'

const byCode = new Map([...MVP_PROBLEMS, ...REVIEW_PROBLEMS].map((problem) => [problem.codigo, problem]))

// Review-only: four bank references plus proposed canonical Problems stored once.
export default function ReviewProblemCollection({ collection, tier, full = false }) {
  const list = REVIEW_COLLECTIONS[collection]
  if (!list || !['practice', 'challenge'].includes(tier)) return null
  const codes = list[tier]
  const shown = full ? codes : codes.slice(0, 5)
  const remaining = codes.length - shown.length
  return <section aria-label={tier === 'challenge' ? 'Lista de problemas de mayor dificultad' : 'Lista de problemas'} className="tp-card-soft my-8 overflow-hidden bg-accent-yellow">
    <div className="border-b-2 border-black px-5 py-4 sm:px-7"><p className="text-xs font-black uppercase tracking-widest">{tier === 'challenge' ? 'Problemas de mayor dificultad' : 'Problemas'} · {shown.length} de {codes.length}</p><p className="mt-2 text-sm leading-6">Intenta una solución antes de abrir las pistas. Los problemas nuevos de esta revisión todavía no están publicados.</p></div>
    <ol className="divide-y-2 divide-black/20">{shown.map((code, index) => {
      const problem = byCode.get(code)
      return <li key={code} className="p-5 sm:p-7" data-problem-code={code}>
        <p className="text-xs font-bold">{index + 1} · {code} · {problem.draft ? 'Propuesta nueva' : 'Referencia al banco'}</p>
        <MathText text={problem.enunciado} className="mt-3 whitespace-pre-wrap leading-8" />
        <details className="mt-4 border border-black/30 bg-white/50 p-3"><summary className="cursor-pointer font-bold">Ver pista · {code}</summary><MathText text={problem.hint} className="mt-3 leading-7" /></details>
        <details className="mt-3 border border-black/30 bg-white/50 p-3"><summary className="cursor-pointer font-bold">Ver solución · {code}</summary><MathText text={problem.solution} className="mt-3 whitespace-pre-wrap leading-8" /></details>
        {!problem.draft && <Link className="mt-4 inline-block text-sm font-bold underline" to={`/entrenamiento/problemas?q=${encodeURIComponent(code)}`}>Abrir en el banco →</Link>}
      </li>
    })}</ol>
    {!full && <div className="border-t-2 border-black p-5 sm:px-7"><Link className="tp-button inline-block bg-white px-4 py-3 font-bold" to={`/revision/teoria?collection=${collection}&tier=${tier}`}>{remaining ? `Ver el resto de la lista (${remaining} más) →` : 'Abrir la lista completa →'}</Link></div>}
  </section>
}
