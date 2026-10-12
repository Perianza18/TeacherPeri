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
      .then((result) => !cancelled && setResults({ requestKey, items: result.items.filter((path) => !path.lessonOnly), error: null }))
      .catch((requestError) => !cancelled && setResults({ requestKey, items: [], error: requestError.message }))
    return () => { cancelled = true }
  }, [query, requestKey, tag])

  useEffect(() => { apiFetch('/api/tags').then(setTags).catch(() => setTags([])) }, [])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-50">
        <section className="relative overflow-hidden border-b-4 border-black bg-accent-sky px-4 pb-14 pt-28 sm:px-6 lg:px-8">
          <div className="tp-dot-grid pointer-events-none absolute inset-0 opacity-[.09]" />
          <div className="mx-auto max-w-7xl">
            <div className="relative">
            <span className="tp-kicker rotate-0">Rutas</span>
            <h1 className="mt-5 max-w-4xl text-5xl font-black uppercase leading-[.94] tracking-[-0.06em] text-brand-900 sm:text-6xl">Guías para avanzar con dirección.</h1>
            <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-brand-700">Explora recorridos que conectan contenido, práctica y siguientes pasos. Tú eliges el ritmo.</p>
            <div className="tp-card mt-9 grid gap-3 bg-white p-3 md:grid-cols-[1fr_260px]">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar Rutas" className="rounded-xl border-2 border-black bg-brand-50 px-4 py-3.5 outline-none focus:bg-white" />
              <select value={tag} onChange={(e) => setTag(e.target.value)} className="rounded-xl border-2 border-black bg-accent-yellow px-4 py-3.5 font-semibold text-brand-900 outline-none">
                <option value="">Todas las etiquetas</option>
                {tags.map((entry) => <option key={entry._id} value={entry._id}>{entry.label}</option>)}
              </select>
            </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {loading && <p className="text-brand-500">Cargando Rutas…</p>}
          {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">No fue posible cargar las Rutas: {error}</p>}
          {!loading && !error && paths.length === 0 && <p className="rounded-2xl border border-brand-200 bg-white p-6 text-brand-600">Todavía no hay Rutas publicadas.</p>}
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {paths.map((path, index) => (
              <Link key={path._id} to={`/rutas/${path.slug}`} className={`tp-card group relative p-6 transition hover:-translate-y-2 rotate-0 ${index % 3 === 0 ? 'bg-accent-purple text-white rotate-0' : index % 3 === 1 ? 'bg-white rotate-0' : 'bg-accent-mint rotate-0'}`}>
                <div className="flex items-center justify-between gap-4">
                  <span className={`text-xs font-black uppercase tracking-[0.14em] ${index % 3 === 0 ? 'text-white/75' : 'text-brand-700'}`}>Ruta</span>
                  {path.level && <span className="border-2 border-black bg-accent-yellow px-2.5 py-1 text-xs font-bold text-brand-900">{LEVEL_LABELS[path.level]}</span>}
                </div>
                <div className="mt-8 flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center border-2 border-black bg-white text-lg font-black text-brand-900">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h2 className={`text-xl font-black uppercase tracking-[-.03em] ${index % 3 === 0 ? 'text-white' : 'text-brand-900'}`}>{path.title}</h2>
                    {path.description && <p className={`mt-3 text-sm font-medium leading-6 ${index % 3 === 0 ? 'text-white/75' : 'text-brand-700'}`}>{path.description}</p>}
                  </div>
                </div>
                {path.tags?.length > 0 && <div className="mt-6 flex flex-wrap gap-2">{path.tags.map((entry) => <span key={entry._id} className="border border-black bg-white px-2.5 py-1 text-xs font-bold text-brand-900">{entry.label}</span>)}</div>}
                <span className={`mt-7 inline-block text-sm font-black transition group-hover:translate-x-1 ${index % 3 === 0 ? 'text-white' : 'text-brand-900'}`}>EXPLORAR →</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
