import { Link } from 'react-router-dom'
import MathText from '../math/MathText'
import { examTitle } from '../../lib/libraryPaths'
import { problemTopics, sourceProblemTitle } from '../../lib/problemPresentation'

const LEVELS = { basico: 'Básico', intermedio: 'Intermedio', avanzado: 'Avanzado' }
const AREA_STRIPS = { 'Geometría': 'bg-tp-sky', 'Álgebra': 'bg-tp-tint-violet', 'Combinatoria': 'bg-tp-orange', 'Teoría de Números': 'bg-tp-mint' }

export default function LibraryCard({ item, type, title, strip, base, onOpen, preview = false }) {
  const heading = type === 'problems' ? sourceProblemTitle(item) : type === 'exams' ? examTitle(item) : item.title || item.titulo
  const href = `${base}/${item._id}`
  const topics = problemTopics(item).slice(0, 2)
  const fullTopics = topics.join(' · ')
  return <article className="tp-card-soft tp-lift flex min-w-0 flex-col overflow-hidden bg-tp-surface">
    <div className={`flex min-h-11 items-center border-b-2 border-tp-ink px-5 py-2.5 ${AREA_STRIPS[item.tema] || strip}`}>
      <p className="min-w-0 break-words text-xs font-extrabold uppercase tracking-[0.12em]" aria-label={type === 'problems' ? fullTopics : undefined}>{type === 'problems' ? fullTopics : <>{title}{type !== 'theory' && item.level ? ` · ${LEVELS[item.level]}` : ''}</>}</p>
    </div>
    <div className="flex flex-1 flex-col p-5">
      {heading && <h3 className="font-display text-[21px] font-extrabold leading-tight tracking-[-0.02em]">{preview ? heading : <Link to={href} className="hover:text-tp-violet">{heading}</Link>}</h3>}
      {item.enunciado ? <MathText text={item.enunciado} className="mt-3 line-clamp-4 text-sm leading-6 text-tp-ink-muted" /> : item.summary && <p className="mt-3 line-clamp-4 text-sm leading-6 text-tp-ink-muted">{item.summary}</p>}
      {item.sourceOrganization && <p className="mt-4 text-xs text-tp-ink-muted">Fuente: {item.sourceOrganization}</p>}
      {type === 'exams' && <p className="mt-4 text-xs text-tp-ink-muted">{item.problems?.length === 1 ? '1 problema' : `${item.problems?.length || 0} problemas`} · {item.durationMinutes || 'Sin límite de'} minutos</p>}
      <div className="mt-auto flex flex-wrap items-center gap-4 pt-6 text-sm font-bold">{preview ? <span className="rounded-lg border-2 border-tp-ink bg-tp-mint px-3 py-1.5">Abrir →</span> : <Link to={href} className="rounded-lg border-2 border-tp-ink bg-tp-mint px-3 py-1.5 transition-colors hover:bg-tp-yellow">Abrir →</Link>}{preview ? <span className="text-tp-violet">Comentarios</span> : onOpen && <button onClick={() => onOpen(item)} className="text-tp-violet underline-offset-2 hover:underline">Comentarios</button>}</div>
    </div>
  </article>
}
