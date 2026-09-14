import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiFetch } from '../lib/api'
import MathText from '../components/math/MathText'

const CONFIG = {
  teoria: { api: 'theory', label: 'Teoría' },
  listas: { api: 'lists', label: 'Listas' },
  examenes: { api: 'exams', label: 'Exámenes' },
  problemas: { api: 'problems', label: 'Problemas' },
}

export default function LibraryDetailPage({ type }) {
  const { id } = useParams()
  const config = CONFIG[type]
  const [item, setItem] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    apiFetch(`/api/${config.api}/${id}`).then(setItem).catch((requestError) => setError(requestError.message))
  }, [config.api, id])

  const title = type === 'examenes' && item ? `${item.competition} ${item.year} · ${item.round}` : item?.title || item?.codigo
  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 pt-14 sm:px-6">
        <Link to={`/entrenamiento/${type}`} className="text-sm font-medium text-brand-600 hover:text-brand-900">← Volver a {config.label}</Link>
        {error && <p className="mt-8 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
        {!item && !error && <p className="mt-8 text-brand-600">Cargando contenido…</p>}
        {item && <article className="mt-6 rounded-2xl border border-brand-200 bg-[#FFFBF5] p-6 shadow-sm sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-500">{config.label}</p>
          <h1 className="mt-2 font-display text-3xl text-brand-900 sm:text-4xl">{title}</h1>
          {item.summary && <p className="mt-4 text-lg text-brand-600">{item.summary}</p>}
          {item.enunciado && <MathText text={item.enunciado} className="mt-6 whitespace-pre-wrap leading-8 text-brand-900" />}
          {item.content && <MathText text={item.content} className="mt-6 whitespace-pre-wrap leading-8 text-brand-900" />}
          {type === 'listas' && <ResourceLinks item={item} />}
          {type === 'examenes' && <ExamProblems problems={item.problems} />}
        </article>}
    </main>
  )
}

function ResourceLinks({ item }) {
  return <div className="mt-6 flex flex-wrap gap-3">{item.sourceUrl && <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="rounded-full bg-brand-900 px-4 py-2 text-sm text-white">Fuente original</a>}{item.pdfUrl && <a href={item.pdfUrl} target="_blank" rel="noreferrer" className="rounded-full border border-brand-300 px-4 py-2 text-sm text-brand-700">Abrir PDF</a>}</div>
}

function ExamProblems({ problems = [] }) {
  return <ol className="mt-6 list-decimal space-y-2 pl-5 text-brand-800">{problems.map(({ position, problem }) => <li key={position}>{problem ? <Link className="underline" to={`/entrenamiento/problemas/${problem._id}`}>{problem.codigo || problem.titulo}</Link> : 'Problema no disponible'}</li>)}</ol>
}
