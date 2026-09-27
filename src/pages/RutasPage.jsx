import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
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
      .then((result) => !cancelled && setResults({ requestKey, items: result.items, error: null }))
      .catch((requestError) => !cancelled && setResults({ requestKey, items: [], error: requestError.message }))
    return () => { cancelled = true }
  }, [query, requestKey, tag])

  useEffect(() => { apiFetch('/api/tags').then(setTags).catch(() => setTags([])) }, [])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-50">
        <section className="border-b border-brand-200 bg-white px-4 pb-12 pt-28 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">Rutas</p>
            <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-brand-900 sm:text-5xl">Guías para avanzar con dirección.</h1>
            <p className="mt-4 max-w-2xl leading-7 text-brand-600">Explora Rutas publicadas y encuentra un recorrido que conecte contenido, práctica y siguientes pasos.</p>
            <div className="mt-8 grid gap-3 md:grid-cols-[1fr_260px]">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar Rutas" className="rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3.5 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
              <select value={tag} onChange={(e) => setTag(e.target.value)} className="rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3.5 text-brand-700 outline-none focus:border-violet-400">
                <option value="">Todas las etiquetas</option>
                {tags.map((entry) => <option key={entry._id} value={entry._id}>{entry.label}</option>)}
              </select>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {loading && <p className="text-brand-500">Cargando Rutas…</p>}
          {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">No fue posible cargar las Rutas: {error}</p>}
          {!loading && !error && paths.length === 0 && <p className="rounded-2xl border border-brand-200 bg-white p-6 text-brand-600">Todavía no hay Rutas publicadas.</p>}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {paths.map((path, index) => (
              <Link key={path._id} to={`/rutas/${path.slug}`} className={`group rounded-3xl border p-6 transition hover:-translate-y-1 hover:shadow-xl ${index === 0 ? 'border-violet-200 bg-gradient-to-br from-white to-violet-50/70 md:col-span-2 xl:col-span-1' : 'border-brand-200 bg-white'}`}>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-600">{path.kind === 'parent' ? 'Ruta' : 'Ruta hoja'}</span>
                  {path.level && <span className="rounded-full bg-brand-100 px-2.5 py-1 text-xs text-brand-600">{LEVEL_LABELS[path.level]}</span>}
                </div>
                <div className="mt-8 flex items-start gap-4">
                  <div className="flex flex-col items-center pt-1">
                    <span className="h-3 w-3 rounded-full bg-violet-500 ring-4 ring-violet-100" />
                    <span className="mt-2 h-10 w-px bg-gradient-to-b from-violet-300 to-blue-300" />
                    <span className="h-3 w-3 rounded-full bg-blue-500 ring-4 ring-blue-100" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight text-brand-900">{path.title}</h2>
                    {path.description && <p className="mt-3 text-sm leading-6 text-brand-600">{path.description}</p>}
                  </div>
                </div>
                {path.tags?.length > 0 && <div className="mt-6 flex flex-wrap gap-2">{path.tags.map((entry) => <span key={entry._id} className="rounded-full bg-accent-purple-soft px-2.5 py-1 text-xs text-violet-700">{entry.label}</span>)}</div>}
                <span className="mt-7 inline-block text-sm font-semibold text-brand-900 transition group-hover:translate-x-1">Explorar →</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
