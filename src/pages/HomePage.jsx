import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../components/sections/Hero'
import { apiFetch } from '../lib/api'

const journeyCards = [
  { title: 'Prepararme para Olimpiadas', text: 'Sigue una Ruta estructurada y entrena con material reutilizable.', to: '/rutas', accent: 'from-violet-500 to-purple-700' },
  { title: 'Prepararme para Universidad', text: 'Entiende el proceso y construye tu camino paso a paso.', to: '/estudia-en-el-extranjero', accent: 'from-blue-500 to-indigo-700' },
  { title: 'Explorar por mi cuenta', text: 'Ve directo a problemas, teoría, listas y exámenes.', to: '/entrenamiento', accent: 'from-zinc-700 to-zinc-950' },
]

const libraries = [
  ['Problemas', 'Practica directamente con problemas organizados.', '/entrenamiento/problemas', 'π'],
  ['Teoría', 'Lee explicaciones matemáticas nativas y reutilizables.', '/entrenamiento/teoria', '∑'],
  ['Listas', 'Encuentra colecciones de entrenamiento de distintas fuentes.', '/entrenamiento/listas', '≡'],
  ['Exámenes', 'Explora exámenes y sus problemas en orden.', '/entrenamiento/examenes', '√'],
]

const searchConfig = [
  ['problems', 'Problemas', 'problemas'],
  ['theory', 'Teoría', 'teoria'],
  ['lists', 'Listas', 'listas'],
  ['exams', 'Exámenes', 'examenes'],
]

function Reveal({ children, className = '' }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55 }} className={className}>
      {children}
    </motion.div>
  )
}

function TrainingSearch() {
  const [query, setQuery] = useState('')
  const [state, setState] = useState({ loading: false, results: [], error: null })

  async function submit(event) {
    event.preventDefault()
    const q = query.trim()
    if (!q) return
    setState({ loading: true, results: [], error: null })
    try {
      const responses = await Promise.all(searchConfig.map(([api, label, path]) =>
        apiFetch(`/api/${api}?q=${encodeURIComponent(q)}&page=1&limit=4`)
          .then((data) => (data.items || []).map((item) => ({ item, label, path })))
          .catch(() => [])
      ))
      setState({ loading: false, results: responses.flat(), error: null })
    } catch {
      setState({ loading: false, results: [], error: 'No fue posible completar la búsqueda.' })
    }
  }

  function titleFor(result) {
    const { item, path } = result
    if (path === 'examenes') return `${item.competition} ${item.year} · ${item.round}`
    return item.title || item.codigo || 'Contenido'
  }

  return (
    <div className="mt-8">
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar problemas, teoría, listas o exámenes..." className="min-w-0 flex-1 rounded-2xl border border-brand-200 bg-white px-5 py-4 text-brand-900 shadow-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
        <button className="tp-gradient rounded-2xl px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-violet-950/10">Buscar</button>
      </form>
      {state.loading && <p className="mt-4 text-sm text-brand-500">Buscando…</p>}
      {state.error && <p className="mt-4 text-sm text-red-600">{state.error}</p>}
      {!state.loading && state.results.length > 0 && (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {state.results.map((result) => (
            <Link key={`${result.path}-${result.item._id}`} to={`/entrenamiento/${result.path}/${result.item._id}`} className="rounded-xl border border-brand-200 bg-white px-4 py-3 transition hover:border-violet-300 hover:shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">{result.label}</p>
              <p className="mt-1 text-sm font-semibold text-brand-900">{titleFor(result)}</p>
            </Link>
          ))}
        </div>
      )}
      {!state.loading && query.trim() && state.results.length === 0 && !state.error && <p className="mt-4 text-sm text-brand-500">No encontramos resultados para esa búsqueda.</p>}
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="bg-brand-50">
        <Hero />

        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">Empieza por aquí</p>
              <h2 className="mt-3 max-w-3xl text-4xl font-bold tracking-[-0.04em] text-brand-900 sm:text-5xl">¿Qué quieres hacer?</h2>
            </Reveal>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {journeyCards.map((card, index) => (
                <Reveal key={card.title}>
                  <Link to={card.to} className="group block h-full rounded-3xl border border-brand-200 bg-white p-6 shadow-[0_10px_30px_rgba(17,17,19,.04)] transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_18px_40px_rgba(17,17,19,.08)]">
                    <div className={`h-1.5 w-12 rounded-full bg-gradient-to-r ${card.accent}`} />
                    <h3 className="mt-8 text-xl font-semibold tracking-tight text-brand-900">{card.title}</h3>
                    <p className="mt-3 leading-7 text-brand-600">{card.text}</p>
                    <p className="mt-8 text-sm font-semibold text-brand-900">Explorar <span className="transition group-hover:translate-x-1 inline-block">→</span></p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-brand-200/70 bg-white px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">Rutas</p>
              <h2 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-brand-900">No tienes que descubrir el camino solo.</h2>
              <p className="mt-5 max-w-xl leading-7 text-brand-600">Las Rutas organizan qué hacer y en qué orden, sin convertir TeacherPeri en un sistema rígido.</p>
              <Link to="/rutas" className="mt-7 inline-flex rounded-xl border border-brand-200 bg-brand-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">Explorar todas las Rutas</Link>
            </Reveal>
            <Reveal>
              <div className="rounded-[2rem] border border-brand-200 bg-brand-50 p-7 sm:p-9">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-500">Preparación para la OMM</p>
                <div className="mt-7 space-y-0">
                  {['Primeros Pasos', 'Herramientas Fundamentales', 'Construyendo Técnica', 'Ampliando Herramientas', 'Integración y Estrategia'].map((label, index) => (
                    <div key={label} className="relative flex min-h-20 items-start gap-4">
                      {index < 4 && <span className="absolute left-[11px] top-6 h-full w-px bg-gradient-to-b from-violet-400 to-blue-400" />}
                      <span className={`relative z-10 mt-0.5 h-6 w-6 rounded-full border-4 border-brand-50 ${index < 2 ? 'tp-gradient' : 'bg-brand-300'}`} />
                      <div>
                        <p className="text-xs font-semibold text-brand-400">Ciclo {index + 1}</p>
                        <p className="mt-1 font-semibold text-brand-900">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Zona de Entrenamiento</p>
              <h2 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-brand-900">Entrena directamente con el material.</h2>
              <p className="mt-4 max-w-2xl leading-7 text-brand-600">Busca en las cuatro bibliotecas o entra directamente a la que necesitas.</p>
            </Reveal>
            <TrainingSearch />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {libraries.map(([title, text, to, symbol]) => (
                <Link key={title} to={to} className="group rounded-3xl border border-brand-200 bg-white p-6 transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-purple-soft text-xl font-semibold text-violet-700">{symbol}</span>
                  <h3 className="mt-7 text-lg font-semibold text-brand-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-brand-600">{text}</p>
                  <span className="mt-6 inline-block text-brand-400 transition group-hover:translate-x-1 group-hover:text-violet-600">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#0B0B0F] px-4 py-24 text-white sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute right-[10%] top-0 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">Universidad</p>
              <h2 className="mt-3 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">Construye tu camino para estudiar en el extranjero.</h2>
              <p className="mt-5 max-w-xl leading-7 text-white/60">TeacherPeri también organiza la preparación universitaria como una ruta abierta y flexible.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/estudia-en-el-extranjero" className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-900">Explorar Universidad</Link>
                <Link to="/rutas" className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white">Ver Rutas</Link>
              </div>
            </Reveal>
            <Reveal>
              <div className="space-y-3">
                {['Entender el proceso', 'Construir tu preparación', 'Preparar aplicaciones', 'Enviar y dar seguimiento', 'Comparar opciones'].map((item, index) => (
                  <div key={item} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-4 backdrop-blur">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-500/15 text-xs font-bold text-blue-200">{index + 1}</span>
                    <span className="font-medium text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal className="text-center">
              <h2 className="text-4xl font-bold tracking-[-0.04em] text-brand-900">¿Por qué TeacherPeri?</h2>
            </Reveal>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {[
                ['Encuentra una dirección', 'Entiende qué puedes hacer y en qué orden, sin depender de información fragmentada.'],
                ['Aprende sin restricciones', 'El progreso describe tu recorrido; nunca bloquea contenido público.'],
                ['Todo está conectado', 'Rutas y bibliotecas reutilizan los mismos objetos en lugar de duplicarlos.'],
              ].map(([title, text]) => (
                <Reveal key={title}>
                  <div className="border-t border-brand-300 pt-5">
                    <h3 className="text-lg font-semibold text-brand-900">{title}</h3>
                    <p className="mt-3 leading-7 text-brand-600">{text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-brand-200 bg-[#F5F2ED] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">Sobre TeacherPeri</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-[-0.035em] text-brand-900">Un proyecto construido desde la experiencia de aprender, competir y enseñar.</h2>
            </Reveal>
            <Reveal>
              <div className="flex gap-3">
                <Link to="/sobre-mi" className="rounded-xl bg-brand-900 px-5 py-3 text-sm font-semibold text-white">Sobre mí</Link>
                <Link to="/contacto" className="rounded-xl border border-brand-300 bg-white px-5 py-3 text-sm font-semibold text-brand-900">Contacto</Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
