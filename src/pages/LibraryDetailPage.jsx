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

  useEffect(() => { apiFetch(`/api/${config.api}/${id}`).then(setItem).catch((requestError) => setError(requestError.message)) }, [config.api, id])

  const title = type === 'examenes' && item ? `${item.competition} ${item.year} · ${item.round}` : item?.title || item?.codigo

  return (
    <main className="tp-reading min-h-[70vh] px-4 pb-24 pt-12 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link to={`/entrenamiento/${type}`} className="text-sm font-semibold text-brand-500 transition hover:text-violet-700">← Volver a {config.label}</Link>
        {error && <p className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>}
        {!item && !error && <p className="mt-8 text-brand-500">Cargando contenido…</p>}
        {item && (
          <article className="mt-8">
            <header className="border-b border-brand-200 pb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">{config.label}</p>
              <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-brand-900 sm:text-5xl">{title}</h1>
              {item.summary && <p className="mt-5 max-w-3xl text-lg leading-8 text-brand-600">{item.summary}</p>}
            </header>

            <div className="mx-auto max-w-[760px] py-10">
              {item.enunciado && <MathText text={item.enunciado} className="whitespace-pre-wrap text-[1.05rem] leading-8 text-brand-900" />}
              {item.content && <MathText text={item.content} className="whitespace-pre-wrap text-[1.02rem] leading-8 text-brand-900" />}
              {type === 'listas' && <ResourceLinks item={item} />}
              {type === 'examenes' && <ExamProblems problems={item.problems} />}
            </div>
          </article>
        )}
      </div>
    </main>
  )
}

function ResourceLinks({ item }) {
  return <div className="mt-10 flex flex-wrap gap-3">{item.sourceUrl && <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-brand-900 px-4 py-2.5 text-sm font-semibold text-white">Fuente original</a>}{item.pdfUrl && <a href={item.pdfUrl} target="_blank" rel="noreferrer" className="rounded-xl border border-brand-300 bg-white px-4 py-2.5 text-sm font-semibold text-brand-800">Abrir PDF</a>}</div>
}

function ExamProblems({ problems = [] }) {
  return <ol className="mt-8 space-y-3">{problems.map(({ position, problem }) => <li key={position} className="rounded-2xl border border-brand-200 bg-white p-4"><span className="mr-3 text-xs font-bold text-violet-600">{position}.</span>{problem ? <Link className="font-medium text-brand-900 hover:text-violet-700" to={`/entrenamiento/problemas/${problem._id}`}>{problem.codigo || problem.titulo}</Link> : 'Problema no disponible'}</li>)}</ol>
}
