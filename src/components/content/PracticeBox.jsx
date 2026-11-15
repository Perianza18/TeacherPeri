import { useId } from 'react'
import { Link } from 'react-router-dom'
import RichText from './RichText'
import { LIBRARY_BASE } from '../../lib/libraryPaths'
import { levelLabel } from '../../lib/theoryArticle'

// Yellow problem box (DESIGN §5): ink pill, count, then compact white rows
// (meta, statement, «Resolver →»). Problems have no titles: never `titulo`.
// `ejercicios` rows also get a «Ver pista» toggle.
const KINDS = {
  ejercicios: { label: 'Ejercicios', one: 'ejercicio para esta lección', many: 'ejercicios para esta lección', hints: true },
  practice: { label: 'Practica', one: 'problema para esta lección', many: 'problemas para esta lección' },
  dificiles: { label: 'Reto', one: 'problema de reto', many: 'problemas de reto' },
}

const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`

function commentLabel(count) {
  if (count == null) return ''
  return count === 0 ? 'Sin comentarios' : plural(count, 'comentario', 'comentarios')
}

// `problem.href` overrides the link; null hides «Resolver» (draft problems).
export default function PracticeBox({ kind = 'practice', problems, context = '' }) {
  const id = useId()
  const config = KINDS[kind] || KINDS.practice
  return (
    <section aria-labelledby={id} className="tp-box-strong flex flex-col gap-3 bg-tp-yellow px-5 py-[18px]">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="tp-kicker tp-kicker-ink font-sans tracking-[0.12em]">{config.label}</span>
        <h3 id={id} className="font-sans text-[15px] font-bold">{plural(problems.length, config.one, config.many)}</h3>
      </div>
      <ol className="flex flex-col gap-2.5">
        {problems.map((problem, index) => {
          const meta = [levelLabel(problem.difficulty), commentLabel(problem.commentCount)].filter(Boolean).join(' · ')
          const href = problem.href !== undefined ? problem.href : `${LIBRARY_BASE.problems}/${problem._id}${context}`
          return (
            <li key={problem._id || problem.codigo} className="flex flex-wrap items-center gap-x-4 gap-y-2.5 rounded-xl border-2 border-tp-ink bg-tp-surface px-4 py-3.5">
              <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-0.5">
                {meta && <span className="font-sans text-[13px] font-semibold text-tp-ink-muted">{meta}</span>}
                <RichText as="div" text={problem.enunciado} keepLines={false} className="line-clamp-3" />
                {config.hints && problem.hint && (
                  <details className="mt-1">
                    <summary className="cursor-pointer py-3 font-sans text-sm font-bold">Ver pista</summary>
                    <RichText text={problem.hint} className="pb-1 text-[17px] text-tp-ink-soft" />
                  </details>
                )}
              </div>
              {href && <Link to={href} aria-label={`Resolver ${config.label === 'Ejercicios' ? 'ejercicio' : 'problema'} ${index + 1}`} className="tp-button whitespace-nowrap bg-tp-mint px-4 font-sans text-[15px] font-bold text-tp-ink">Resolver<span aria-hidden="true">{' →'}</span></Link>}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
