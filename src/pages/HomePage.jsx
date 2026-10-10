import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../components/sections/Hero'
import { apiFetch } from '../lib/api'

const journeyCards = [
  { number: '01', title: 'Prepararme para Olimpiadas', text: 'Sigue una Ruta estructurada y entrena con material reutilizable.', to: '/rutas', color: 'bg-accent-purple text-white', rotate: '-rotate-1' },
  { number: '02', title: 'Prepararme para Universidad', text: 'Entiende el proceso y construye tu camino paso a paso.', to: '/estudia-en-el-extranjero', color: 'bg-accent-sky text-brand-900', rotate: 'lg:rotate-1' },
  { number: '03', title: 'Explorar por mi cuenta', text: 'Ve directo a problemas, teoría, listas y exámenes.', to: '/entrenamiento', color: 'bg-accent-coral text-brand-900', rotate: 'lg:-rotate-1' },
]

const libraries = [
  ['Problemas', 'Practica con problemas organizados.', '/entrenamiento/problemas', 'π', 'bg-accent-yellow'],
  ['Teoría', 'Lee explicaciones matemáticas reutilizables.', '/entrenamiento/teoria', '∑', 'bg-accent-mint'],
  ['Listas', 'Encuentra colecciones de distintas fuentes.', '/entrenamiento/listas', '≡', 'bg-accent-sky'],
  ['Exámenes', 'Explora exámenes y sus problemas en orden.', '/entrenamiento/examenes', '√', 'bg-accent-coral'],
]

const searchConfig = [
  ['problems', 'Problemas', 'problemas'],
  ['theory', 'Teoría', 'teoria'],
  ['lists', 'Listas', 'listas'],
  ['exams', 'Exámenes', 'examenes'],
]

function Reveal({ children, className = '' }) {
  const reduceMotion = useReducedMotion()
  return <motion.div initial={reduceMotion ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.4 }} className={className}>{children}</motion.div>
}

function SectionHeading({ eyebrow, children, light = false }) {
  return (
    <div>
      <span className="tp-kicker">{eyebrow}</span>
      <h2 className={`mt-5 max-w-4xl text-4xl font-black uppercase leading-[.98] tracking-[-.055em] sm:text-5xl ${light ? 'text-white' : 'text-brand-900'}`}>{children}</h2>
    </div>
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
    const responses = await Promise.all(searchConfig.map(([api, label, path]) => apiFetch(`/api/${api}?q=${encodeURIComponent(q)}&page=1&limit=4`).then((data) => (data.items || []).map((item) => ({ item, label, path }))).catch(() => [])))
    setState({ loading: false, results: responses.flat(), error: null })
  }

  function titleFor({ item, path }) {
    if (path === 'examenes') return `${item.competition} ${item.year} · ${item.round}`
    return item.title || item.codigo || 'Contenido'
  }

  return (
    <div className="mt-8">
      <form onSubmit={submit} className="tp-card flex flex-col gap-3 bg-white p-3 sm:flex-row">
        <label className="sr-only" htmlFor="global-search">Buscar en todas las bibliotecas</label>
        <input id="global-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Busca en todo TeacherPeri…" className="min-w-0 flex-1 rounded-xl border-2 border-black bg-brand-50 px-5 py-4 font-semibold outline-none focus:bg-white" />
        <button className="tp-button bg-accent-purple px-7 py-4 text-sm font-black text-white">BUSCAR →</button>
      </form>
      {state.loading && <p className="mt-5 font-semibold text-brand-600">Buscando…</p>}
      {state.error && <p className="mt-5 text-red-700">{state.error}</p>}
      {!state.loading && state.results.length > 0 && <div className="mt-5 grid gap-3 sm:grid-cols-2">{state.results.map((result) => <Link key={`${result.path}-${result.item._id}`} to={`/entrenamiento/${result.path}/${result.item._id}`} className="tp-card-soft bg-white px-4 py-3 transition hover:-translate-y-0.5"><p className="text-xs font-black uppercase tracking-wide text-accent-violet">{result.label}</p><p className="mt-1 font-bold">{titleFor(result)}</p></Link>)}</div>}
      {!state.loading && query.trim() && state.results.length === 0 && !state.error && <p className="mt-5 text-brand-600">No encontramos resultados para esa búsqueda.</p>}
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden bg-brand-50">
        <Hero />

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal><SectionHeading eyebrow="Empieza por aquí">¿Qué quieres hacer?</SectionHeading></Reveal>
            <div className="mt-10 grid gap-7 lg:grid-cols-3">
              {journeyCards.map((card) => <Reveal key={card.title}><Link to={card.to} className={`tp-card group block h-full p-7 transition hover:-translate-y-2 hover:rotate-0 ${card.color} ${card.rotate}`}><span className="grid h-11 w-11 place-items-center border-2 border-black bg-white font-black text-brand-900">{card.number}</span><h3 className="mt-10 text-2xl font-black uppercase leading-tight tracking-[-.035em]">{card.title}</h3><p className="mt-4 font-medium leading-7 opacity-80">{card.text}</p><p className="mt-8 font-black">EXPLORAR <span className="inline-block transition group-hover:translate-x-1">→</span></p></Link></Reveal>)}
            </div>
          </div>
        </section>

        <section className="border-y-4 border-black bg-accent-blue-soft px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end"><div className="lg:pb-8"><SectionHeading eyebrow="Rutas">No tienes que descubrir el camino solo.</SectionHeading><p className="mt-5 max-w-xl text-lg leading-8 text-brand-700">Las Rutas organizan qué hacer y en qué orden sin convertir tu aprendizaje en un sistema rígido.</p><Link to="/rutas" className="tp-button mt-7 bg-brand-900 px-5 py-3 text-sm font-black text-white">VER TODAS LAS RUTAS →</Link></div><div className="tp-card relative bg-white p-6 sm:p-8"><span className="absolute -right-3 -top-4 rotate-3 border-2 border-black bg-accent-coral px-3 py-2 text-xs font-black">RUTA DESTACADA</span><p className="text-sm font-black uppercase tracking-[.15em] text-accent-violet">Preparación para la OMM</p><div className="mt-7 grid gap-3 sm:grid-cols-5">{['Primeros Pasos', 'Herramientas Fundamentales', 'Construyendo Técnica', 'Ampliando Herramientas', 'Integración y Estrategia'].map((label, index) => <div key={label} className="relative border-2 border-black bg-brand-50 p-4 sm:min-h-40"><span className="grid h-8 w-8 place-items-center bg-accent-yellow text-sm font-black">{index + 1}</span><p className="mt-5 text-xs font-black uppercase leading-5">{label}</p>{index < 4 && <span className="absolute -right-3 top-1/2 z-10 hidden text-xl font-black sm:block">→</span>}</div>)}</div></div></Reveal>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal><SectionHeading eyebrow="Zona de Entrenamiento">Todo el material. Una sola búsqueda.</SectionHeading><p className="mt-4 max-w-2xl text-lg leading-8 text-brand-700">Busca en las cuatro bibliotecas o entra directamente a la que necesitas.</p></Reveal>
            <TrainingSearch />
            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{libraries.map(([title, text, to, symbol, color], index) => <Link key={title} to={to} className={`tp-card group p-6 transition hover:-translate-y-2 hover:rotate-0 ${color} ${index === 1 ? 'lg:rotate-1' : index === 3 ? 'lg:-rotate-1' : ''}`}><span className="grid h-12 w-12 place-items-center border-2 border-black bg-white text-2xl font-black">{symbol}</span><h3 className="mt-7 text-xl font-black uppercase">{title}</h3><p className="mt-3 text-sm font-medium leading-6 text-brand-700">{text}</p><span className="mt-7 inline-block font-black transition group-hover:translate-x-1">ABRIR →</span></Link>)}</div>
          </div>
        </section>

        <section className="relative border-y-4 border-black bg-[#111111] px-4 py-20 text-white sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center"><Reveal><SectionHeading eyebrow="Universidad" light>Construye tu camino para estudiar en el extranjero.</SectionHeading><p className="mt-5 max-w-xl text-lg leading-8 text-white/70">TeacherPeri organiza la preparación universitaria como una ruta abierta y flexible.</p><Link to="/estudia-en-el-extranjero" className="tp-button mt-7 bg-accent-sky px-5 py-3 text-sm font-black text-brand-900">EXPLORAR UNIVERSIDAD →</Link></Reveal><Reveal><div className="grid gap-3 sm:grid-cols-2">{['Entender el proceso', 'Construir tu preparación', 'Preparar aplicaciones', 'Comparar opciones'].map((item, index) => <div key={item} className={`tp-card-soft p-4 text-brand-900 ${index % 2 ? 'bg-accent-purple text-white' : 'bg-white'}`}><span className="text-xs font-black">0{index + 1}</span><p className="mt-3 font-black uppercase">{item}</p></div>)}</div></Reveal></div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><Reveal><SectionHeading eyebrow="El método">¿Por qué TeacherPeri?</SectionHeading></Reveal><div className="mt-10 grid gap-5 md:grid-cols-3">{[['Encuentra una dirección', 'Entiende qué puedes hacer y en qué orden.'], ['Aprende sin restricciones', 'Tu progreso describe el recorrido; nunca bloquea contenido.'], ['Todo está conectado', 'Rutas y bibliotecas reutilizan los mismos objetos.']].map(([title, text], index) => <Reveal key={title}><div className="h-full border-l-4 border-black bg-white p-6"><span className="text-sm font-black text-accent-violet">0{index + 1}</span><h3 className="mt-4 text-xl font-black uppercase">{title}</h3><p className="mt-3 leading-7 text-brand-600">{text}</p></div></Reveal>)}</div></div></section>

        <section className="border-t-4 border-black bg-accent-yellow px-4 py-16 sm:px-6 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between"><Reveal><p className="text-sm font-black uppercase tracking-[.16em]">Sobre TeacherPeri</p><h2 className="mt-3 max-w-3xl text-3xl font-black uppercase leading-tight tracking-[-.04em]">Construido desde la experiencia de aprender, competir y enseñar.</h2></Reveal><Reveal><div className="flex flex-wrap gap-3"><Link to="/sobre-mi" className="tp-button bg-brand-900 px-5 py-3 text-sm font-black text-white">SOBRE MÍ</Link><Link to="/contacto" className="tp-button bg-white px-5 py-3 text-sm font-black">CONTACTO</Link></div></Reveal></div></section>
      </main>
      <Footer />
    </>
  )
}
