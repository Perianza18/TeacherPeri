import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MathText from '../components/math/MathText'
import { apiFetch } from '../lib/api'
import { LIBRARY_BASE } from '../lib/libraryPaths'
import { cicloNames, pickProblemOfTheDay, problemSourceLabel, stripDayPrefix } from '../lib/inicio'

const FEATURED_RUTA_SLUG = 'preparacion-para-la-omm'

const STEPS = [
  { title: 'Escoge una Ruta', text: 'Te guía en qué entrenar y en qué orden.', to: '/rutas', fill: 'bg-tp-tint-violet' },
  { title: 'Aprende', text: 'Lee las páginas de teoría de cada tema.', to: LIBRARY_BASE.theory, fill: 'bg-tp-tint-sky' },
  { title: 'Resuelve y comparte', text: 'Intenta los problemas recomendados y compártelos con tus amigos.', to: LIBRARY_BASE.problems, fill: 'bg-tp-tint-mint' },
]

const EXPLORE = [
  { kicker: 'Entrenamiento', strip: 'bg-tp-tint-sky', title: 'Resolver problemas por tema', text: 'Problemas, teoría y exámenes, con filtros por tema.', cta: 'Abrir Entrenamiento', to: '/entrenamiento' },
  { kicker: 'Exámenes', strip: 'bg-tp-tint-coral', title: 'Practicar con exámenes reales', text: 'OMMU Primera Ronda, OMMU Nacional y Putnam.', cta: 'Ver exámenes', to: LIBRARY_BASE.exams },
  { kicker: 'Listas', strip: 'bg-tp-tint-mint', title: 'Practicar con una selección', text: 'Colecciones de problemas elegidas por el equipo.', cta: 'Ver Listas', to: LIBRARY_BASE.lists },
]

// The arrow is decoration; screen readers read only the words. A no-break
// space, because flex buttons drop a normal leading space.
function Arrow() {
  return <span aria-hidden="true">{' →'}</span>
}

function SectionHeading({ id, kicker, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="tp-eyebrow">{kicker}</span>
      <h2 id={id} className="tp-h2">{children}</h2>
    </div>
  )
}

function Hero() {
  return (
    <section aria-labelledby="inicio-titulo" className="border-b-3 border-tp-ink bg-tp-sky">
      <div className="tp-container flex flex-col items-center gap-3.5 pb-12 pt-[52px] text-center">
        <span className="tp-kicker">Olimpiada de matemáticas · En español</span>
        <h1 id="inicio-titulo" className="tp-h1 max-w-[780px]">Entrena para la olimpiada con un camino claro.</h1>
        <p className="tp-lead max-w-[580px]">Rutas, problemas, teoría y exámenes en un solo lugar, para que cualquier persona, sin importar su nivel, pueda prepararse.</p>
        {/* Plain anchor: index.css scrolls smoothly unless reduced motion is on. */}
        <a href="#como-empezar" className="tp-button mt-1.5 bg-tp-violet px-[18px] font-bold text-white">¿Cómo empiezo?<Arrow /></a>
      </div>
    </section>
  )
}

// One published problem per day (see lib/inicio.js). While loading, the box
// stays with «Cargando problema…»; on an error or an empty bank it is hidden.
function ProblemaDelDia() {
  const [state, setState] = useState({ status: 'loading', problem: null })

  useEffect(() => {
    let active = true
    apiFetch('/api/problems')
      .then((problems) => {
        if (!active) return
        const problem = pickProblemOfTheDay(problems)
        setState(problem ? { status: 'ready', problem } : { status: 'empty', problem: null })
      })
      .catch(() => { if (active) setState({ status: 'error', problem: null }) })
    return () => { active = false }
  }, [])

  if (state.status === 'empty' || state.status === 'error') return null
  const { problem } = state

  return (
    <section aria-labelledby="problema-del-dia" aria-busy={!problem} className="tp-card flex flex-col gap-3.5 bg-tp-yellow px-[26px] py-6">
      <div className="flex flex-wrap items-center gap-2.5">
        <h2 id="problema-del-dia" className="tp-kicker tp-kicker-ink font-sans">Problema del día</h2>
        {problem && <span className="text-sm font-bold">{problemSourceLabel(problem)}</span>}
        {problem?.tema && <span className="tp-pill bg-tp-surface py-px text-xs font-semibold">{problem.tema}</span>}
      </div>
      {problem
        ? <MathText text={stripDayPrefix(problem.enunciado)} className="line-clamp-5 max-w-[840px] whitespace-pre-line text-lg leading-[1.6]" />
        : <p className="text-lg leading-[1.6]">Cargando problema…</p>}
      {problem && (
        <div className="flex flex-wrap items-center gap-x-[18px] gap-y-3">
          <Link to={`${LIBRARY_BASE.problems}/${problem._id}`} className="tp-button bg-tp-mint px-4 font-bold text-tp-ink">Resolver<Arrow /></Link>
          <span className="text-sm font-semibold">Cambia cada día. Comenta tu idea con los demás.</span>
        </div>
      )}
    </section>
  )
}

function ComoEmpezar() {
  return (
    <section id="como-empezar" aria-labelledby="como-empezar-titulo" className="flex scroll-mt-24 flex-col gap-[18px]">
      <SectionHeading id="como-empezar-titulo" kicker="Si es tu primera vez">Cómo empezar en 3 pasos</SectionHeading>
      <ol className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex">
            <Link to={step.to} className="tp-card-soft flex w-full flex-col gap-2 bg-tp-surface p-[18px] text-tp-ink transition-colors hover:text-tp-violet">
              <span aria-hidden="true" className={`grid size-[34px] place-items-center rounded-full border-2 border-tp-ink font-extrabold text-tp-ink ${step.fill}`}>{index + 1}</span>
              <h3 className="tp-card-title">{step.title}</h3>
              <span className="text-tp-ink-muted">{step.text}</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}

// Ciclo names and the link come from the Ruta when it loads; until then (or
// if it fails) the guide's names and the Rutas page are used.
function RutaDestacada() {
  const [ruta, setRuta] = useState(null)

  useEffect(() => {
    let active = true
    apiFetch(`/api/paths/${FEATURED_RUTA_SLUG}`)
      .then((data) => { if (active) setRuta(data?.path || null) })
      .catch(() => {})
    return () => { active = false }
  }, [])

  const href = ruta?.slug ? `/rutas/${ruta.slug}` : '/rutas'

  return (
    <section aria-labelledby="ruta-destacada" className="tp-card flex flex-col gap-5 bg-tp-surface p-[26px]">
      <div className="flex flex-wrap items-end justify-between gap-3.5">
        <div className="flex max-w-[600px] flex-col gap-1.5">
          <span className="tp-kicker self-start">Ruta destacada</span>
          <h2 id="ruta-destacada" className="tp-h2">Preparación para la OMM</h2>
        </div>
        <Link to={href} className="tp-button bg-tp-violet px-[18px] font-bold text-white">Ver la Ruta<Arrow /></Link>
      </div>
      <ol className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3.5">
        {cicloNames(ruta).map((name, index) => (
          <li key={name} className="flex items-center gap-2.5 rounded-xl border-2 border-tp-ink bg-tp-paper p-3.5">
            <span aria-hidden="true" className={`grid size-[30px] shrink-0 place-items-center rounded-full border-2 border-tp-ink text-sm font-extrabold ${index === 0 ? 'bg-tp-yellow' : 'bg-tp-surface'}`}>{index + 1}</span>
            <span className="font-bold">{name}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Explora() {
  return (
    <section aria-labelledby="explora-titulo" className="flex flex-col gap-[18px]">
      <SectionHeading id="explora-titulo" kicker="O explora por tu cuenta">¿Qué quieres hacer hoy?</SectionHeading>
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
        {EXPLORE.map((card) => (
          <li key={card.to} className="flex">
            <Link to={card.to} className="tp-card-soft flex w-full flex-col overflow-hidden bg-tp-surface text-tp-ink transition-colors hover:text-tp-violet">
              <span className={`tp-eyebrow border-b-2 border-tp-ink px-[18px] py-2.5 tracking-[0.12em] text-tp-ink ${card.strip}`}>{card.kicker}</span>
              <div className="flex flex-1 flex-col gap-2 p-[18px]">
                <h3 className="tp-card-title">{card.title}</h3>
                <span className="text-tp-ink-muted">{card.text}</span>
                <span className="mt-auto pt-1.5 font-bold">{card.cta}<Arrow /></span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

function SobreTeacherPeri() {
  return (
    <section aria-labelledby="sobre-titulo" className="flex flex-wrap items-stretch gap-5">
      <div className="tp-card-quiet flex flex-[999_1_460px] flex-col gap-3 bg-tp-surface p-6">
        <span className="tp-eyebrow">Sobre TeacherPeri</span>
        <h2 id="sobre-titulo" className="tp-h2">Construido desde la experiencia de aprender, competir y enseñar.</h2>
        {/* Mission wording from QueEsTeacherPeri.jsx. */}
        <p className="leading-[1.65]"><strong>Misión:</strong> hacer que el entrenamiento para olimpiadas de matemáticas sea accesible para todos. Inspirados por la experiencia de dar talleres gratuitos a estudiantes y profesores.</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/sobre-mi" className="inline-flex min-h-11 items-center rounded-xl border-2 border-tp-ink bg-tp-ink px-4 font-bold text-white">Sobre mí</Link>
          <Link to="/contacto" className="tp-button bg-tp-surface px-4 font-bold text-tp-ink">Contacto</Link>
        </div>
      </div>
      <div className="tp-card-quiet flex flex-[1_1_260px] flex-col gap-2 bg-tp-surface p-6">
        <span className="tp-kicker self-start">Próximamente</span>
        <h3 className="tp-card-title">Experiencias</h3>
        <p className="text-tp-ink-muted">Historias de exolímpicos para inspirarte a dar el siguiente paso.</p>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      {/* pt-[72px] clears the fixed Navbar (69px row + 3px border). */}
      <main className="bg-tp-paper pt-[72px] text-tp-ink">
        <Hero />
        <div className="tp-container flex flex-col gap-12 pb-14 pt-8">
          <ProblemaDelDia />
          <ComoEmpezar />
          <RutaDestacada />
          <Explora />
          <SobreTeacherPeri />
        </div>
      </main>
      <Footer />
    </>
  )
}
