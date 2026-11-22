import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import { Mark } from '../components/decor/Decor'
import { SkeletonGrid } from '../components/Skeleton'
import PeriPenguin from '../components/decor/PeriPenguin'
import RouteGraph from '../components/decor/RouteGraph'
import { apiFetch } from '../lib/api'
import { usePageMeta } from '../hooks/usePageMeta'

const LEVEL_LABELS = { introductorio: 'Introductorio', omm: 'OMM', avanzado: 'Avanzado' }

// Card colors rotate: violet with white text, white, mint. The list is
// alphabetical, so cards carry no number: it would suggest a study order.
const CARD_TONES = [
  { card: 'bg-tp-violet text-white', muted: 'text-white/80' },
  { card: 'bg-tp-surface text-tp-ink', muted: 'text-tp-ink-muted' },
  { card: 'bg-tp-mint text-tp-ink', muted: 'text-tp-ink-soft' },
]

export default function RutasPage() {
  usePageMeta({ title: 'Rutas de entrenamiento para la olimpiada', description: 'Rutas para prepararte para la olimpiada de matemáticas: recorridos en orden que conectan teoría, problemas y exámenes. Tú eliges el ritmo.' })
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
      <main className="min-h-screen bg-tp-paper pt-[72px] text-tp-ink">
        <PageHero
          id="rutas-titulo"
          kicker="Rutas"
          title={<>Guías para avanzar con <Mark variant="arrow" color="var(--tp-violet)" width={6} delay={400}>dirección</Mark>.</>}
          lead="Explora recorridos que conectan contenido, práctica y siguientes pasos. Tú eliges el ritmo."
          artClassName="absolute right-6 top-1/2 hidden -translate-y-1/2 xl:block xl:right-10"
          art={<div className="flex flex-col items-end gap-1"><RouteGraph className="w-[min(430px,30vw)]" /><p aria-hidden="true" className="tp-hand -rotate-2 pr-4 text-[24px]">¡pasa el mouse por los puntos!</p></div>}
        >
          <div className="tp-card mt-3 grid w-full max-w-[860px] gap-3 bg-tp-surface p-3 md:grid-cols-[1fr_260px] xl:max-w-[640px]">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar Rutas" aria-label="Buscar Rutas" className="tp-input bg-tp-paper" />
            <select value={tag} onChange={(e) => setTag(e.target.value)} aria-label="Etiqueta" className="tp-input bg-tp-yellow font-semibold">
              <option value="">Todas las etiquetas</option>
              {tags.map((entry) => <option key={entry._id} value={entry._id}>{entry.label}</option>)}
            </select>
          </div>
        </PageHero>

        <section aria-label="Rutas publicadas" className="tp-container py-16 lg:py-20">
          {loading && <><p className="sr-only">Cargando Rutas…</p><SkeletonGrid count={3} strip={false} strong className="grid gap-8 md:grid-cols-2 xl:grid-cols-3" /></>}
          {error && <p className="tp-card-quiet bg-tp-coral-soft p-4">No fue posible cargar las Rutas: {error}</p>}
          {!loading && !error && paths.length === 0 && <div className="tp-card-soft flex items-center gap-5 bg-tp-surface p-6"><PeriPenguin className="h-24 w-auto shrink-0" /><p className="text-[17px] text-tp-ink-soft">Todavía no hay Rutas publicadas.</p></div>}
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {paths.map((path, index) => {
              const tone = CARD_TONES[index % CARD_TONES.length]
              return (
                <Link key={path._id} to={`/rutas/${path.slug}`} className={`tp-card tp-lift group relative flex flex-col gap-4 p-7 ${tone.card}`}>
                  <div className="flex items-center justify-between gap-4">
                    <span className="tp-sticker -rotate-2 bg-tp-surface">Ruta</span>
                    {path.level && <span className="tp-pill bg-tp-yellow text-xs">{LEVEL_LABELS[path.level]}</span>}
                  </div>
                  <h2 className="pt-5 font-display text-[30px] font-extrabold leading-[1.05] tracking-[-0.03em]">{path.title}</h2>
                  {path.description && <p className={`text-[15px] leading-6 ${tone.muted}`}>{path.description}</p>}
                  {path.tags?.length > 0 && <div className="flex flex-wrap gap-2">{path.tags.map((entry) => <span key={entry._id} className="tp-pill bg-tp-surface text-xs">{entry.label}</span>)}</div>}
                  <span className="mt-auto pt-2 text-[15px] font-extrabold">Explorar<span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">{' →'}</span></span>
                </Link>
              )
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
