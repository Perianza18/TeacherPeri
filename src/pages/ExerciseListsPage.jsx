import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiFetch } from '../lib/api'
import MathText from '../components/math/MathText'
import PageHero from '../components/PageHero'
import { usePageMeta } from '../hooks/usePageMeta'

export default function ExerciseListsPage() {
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  usePageMeta({ title: data?.title || 'Listas de ejercicios', description: 'Ejercicios por tema para practicar las ideas de teoría.' })
  useEffect(() => {
    let cancelled = false
    apiFetch(`/api/exercise-lists${slug ? `/${encodeURIComponent(slug)}` : ''}`)
      .then((result) => { if (!cancelled) { setData(result); setError('') } })
      .catch((err) => { if (!cancelled) setError(err.message) })
    return () => { cancelled = true }
  }, [slug])
  const normalize = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  const lists = Array.isArray(data) ? data.filter((list) => normalize(`${list.title} ${list.area}`).includes(normalize(query))) : []
  return <article className="min-h-[70vh] bg-tp-paper text-tp-ink">
    <PageHero tone="mint" kicker="Entrenamiento" title={slug ? data?.title || 'Lista de ejercicios' : 'Listas de ejercicios'} lead={slug ? 'Practica las ideas de este tema; abre las pistas y soluciones cuando las necesites.' : 'Practica aplicaciones directas de la teoría, reunidas por tema. Un ejercicio puede aparecer en más de una lista.'} before={slug && <Link to="/entrenamiento/listas" className="text-sm font-bold underline underline-offset-2">← Volver a las listas</Link>} />
    <div className="tp-container pb-24 pt-10">
      {error && <p role="alert">No fue posible cargar las listas: {error}</p>}
      {!data && !error && <p>Cargando…</p>}
      {!slug && Array.isArray(data) && <>
        <label className="block max-w-xl text-sm font-bold">Buscar por tema<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} className="tp-input mt-2 bg-tp-surface" /></label>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{lists.map((list) => <Link key={list.slug} to={`/entrenamiento/listas/ejercicios/${list.slug}`} className="tp-card-soft tp-lift flex flex-col gap-3 bg-tp-surface p-5">
          <span className="text-xs font-bold uppercase tracking-wide">{list.area}</span><h2 className="font-display text-xl font-extrabold">{list.title}</h2><span className="text-sm">{list.count} {list.count === 1 ? 'ejercicio' : 'ejercicios'}</span><span className="font-bold text-tp-violet">Ver lista →</span>
        </Link>)}</div>
        {!lists.length && <p className="mt-6">No hay listas que coincidan con la búsqueda.</p>}
      </>}
      {slug && data?.exercises && <ol className="mx-auto flex max-w-[800px] flex-col gap-5">{data.exercises.map((exercise, index) => <li key={exercise._id} className="tp-card-soft bg-tp-surface p-5 sm:p-6">
        <p className="text-sm font-bold">Ejercicio {index + 1} · {exercise.codigo}</p>
        <MathText text={exercise.enunciado} className="tp-reading-text mt-4 whitespace-pre-wrap leading-7" />
        {exercise.hint && <details className="mt-4"><summary className="cursor-pointer font-bold">Ver pista</summary><MathText text={exercise.hint} className="mt-3 leading-7" /></details>}
        {exercise.solution && <details className="mt-4"><summary className="cursor-pointer font-bold">Ver solución</summary><MathText text={exercise.solution} className="mt-3 whitespace-pre-wrap leading-7" /></details>}
        <Link to={`/entrenamiento/problemas/${exercise._id}`} className="mt-4 inline-block text-sm font-bold text-tp-violet underline">Abrir ejercicio y comentarios →</Link>
      </li>)}</ol>}
    </div>
  </article>
}
