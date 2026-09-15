import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { apiFetch } from '../lib/api'

const LEVEL_LABELS = { introductorio: 'Introductorio', omm: 'OMM', avanzado: 'Avanzado' }

export default function RutasPage() {
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState('')
  const [results, setResults] = useState({ requestKey: null, items: [], error: null })
  const [tags, setTags] = useState([])
  const requestKey = `${query}\u0000${tag}`
  const loading = results.requestKey !== requestKey
  const paths = loading ? [] : results.items
  const error = loading ? null : results.error

  useEffect(() => {
    let cancelled = false
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (tag) params.set('tags', tag)
    apiFetch(`/api/paths?${params}`)
      .then((result) => {
        if (cancelled) return
        setResults({ requestKey, items: result.items, error: null })
      })
      .catch((requestError) => !cancelled && setResults({ requestKey, items: [], error: requestError.message }))
    return () => { cancelled = true }
  }, [query, requestKey, tag])

  useEffect(() => {
    apiFetch('/api/tags').then(setTags).catch(() => setTags([]))
  }, [])

  return (
    <main className="min-h-screen bg-[#FFFBF5]">
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Rutas</p>
        <h1 className="mt-2 font-display text-4xl text-brand-900 sm:text-5xl">Guías reutilizables</h1>
        <p className="mt-4 max-w-2xl text-brand-600">Explora Rutas publicadas. Cada una organiza una guía sin limitar el acceso al contenido.</p>
        <label className="mt-8 block">
          <span className="sr-only">Buscar Rutas</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar Rutas"
            className="w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-brand-900 shadow-sm outline-none focus:border-[#E57505]"
          />
        </label>
        <label className="mt-4 block max-w-sm text-sm text-brand-700">
          Etiqueta
          <select value={tag} onChange={(event) => setTag(event.target.value)} className="mt-1 w-full rounded-xl border border-brand-200 bg-white p-3 text-brand-900">
            <option value="">Todas las etiquetas</option>
            {tags.map((entry) => <option key={entry._id} value={entry._id}>{entry.label}</option>)}
          </select>
        </label>

        {loading && <p className="mt-8 text-brand-600">Cargando Rutas…</p>}
        {error && <p className="mt-8 rounded-xl bg-red-50 p-4 text-red-700">No fue posible cargar las Rutas: {error}</p>}
        {!loading && !error && paths.length === 0 && <p className="mt-8 rounded-xl border border-brand-200 bg-white p-6 text-brand-600">Todavía no hay Rutas publicadas.</p>}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {paths.map((path) => (
            <Link key={path._id} to={`/rutas/${path.slug}`} className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">{path.kind === 'parent' ? 'Ruta con secciones' : 'Ruta con pasos'}</p>
              <h2 className="mt-2 text-xl font-semibold text-brand-900">{path.title}</h2>
              {path.level && <p className="mt-2 text-xs font-medium text-brand-600">Nivel: {LEVEL_LABELS[path.level]}</p>}
              {path.description && <p className="mt-2 text-sm text-brand-600">{path.description}</p>}
              {path.tags?.length > 0 && <div className="mt-3 flex flex-wrap gap-1">{path.tags.map((entry) => <span key={entry._id} className="rounded-full bg-brand-100 px-2 py-1 text-xs text-brand-700">{entry.label}</span>)}</div>}
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
