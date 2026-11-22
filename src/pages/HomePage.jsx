import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useInView } from '../hooks/useInView'
import { usePageMeta } from '../hooks/usePageMeta'
import { BubbleTail, Burst, HandArrow, Highlight, Mark, Marquee } from '../components/decor/Decor'
import PeriPenguin from '../components/decor/PeriPenguin'
import { useAuth } from '../context/useAuth'
import { apiFetch } from '../lib/api'
import { LIBRARY_BASE } from '../lib/libraryPaths'
import { cicloNames, pickProblemOfTheDay, problemSourceLabel, stripDayPrefix } from '../lib/inicio'

const FEATURED_RUTA_SLUG = 'preparacion-para-la-omm'

// KaTeX is heavy; Inicio only needs it for the problem of the day, so it
// loads on demand instead of with the first page.
const MathText = lazy(() => import('../components/math/MathText'))

const STEPS = [
  { title: 'Escoge una Ruta', text: 'Te guía en qué entrenar y en qué orden.', to: '/rutas', card: 'bg-tp-tint-violet', badge: 'bg-tp-violet text-white' },
  { title: 'Aprende', text: 'Lee las páginas de teoría de cada tema.', to: LIBRARY_BASE.theory, card: 'bg-tp-tint-sky', badge: 'bg-tp-sky text-tp-ink' },
  { title: 'Resuelve y comparte', text: 'Intenta los problemas recomendados y compártelos con tus amigos.', to: LIBRARY_BASE.problems, card: 'bg-tp-tint-mint', badge: 'bg-tp-mint text-tp-ink' },
]

const EXPLORE = [
  { kicker: 'Entrenamiento', art: 'bg-tp-sky', glyph: 'π', title: 'Resolver problemas por tema', text: 'Problemas, teoría y exámenes, con filtros por tema.', cta: 'Abrir Entrenamiento', to: '/entrenamiento' },
  { kicker: 'Exámenes', art: 'bg-tp-coral', glyph: '≥', title: 'Practicar con exámenes reales', text: 'OMMU Primera Ronda, OMMU Nacional y Putnam.', cta: 'Ver exámenes', to: LIBRARY_BASE.exams },
  { kicker: 'Listas', art: 'bg-tp-mint', glyph: '√', title: 'Practicar con una selección', text: 'Colecciones de problemas elegidas por el equipo.', cta: 'Ver Listas', to: LIBRARY_BASE.lists },
]

const TICKER = ['Álgebra', 'Geometría', 'Combinatoria', 'Teoría de números', 'Rutas guiadas', 'Problema del día', 'Teoría con ejemplos', 'Exámenes de práctica']

// The arrow is decoration; screen readers read only the words. A no-break
// space, because flex buttons drop a normal leading space.
function Arrow() {
  return <span aria-hidden="true">{'\u00a0→'}</span>
}

function SectionHeading({ id, kicker, children }) {
  return (
    <div className="flex flex-col items-start gap-4">
      <span className="tp-sticker -rotate-2 bg-tp-surface">{kicker}</span>
      <h2 id={id} className="tp-section-title max-w-[820px]">{children}</h2>
    </div>
  )
}

// Small floating math tile around the hero card (desktop only).
function SymbolTile({ children, className }) {
  return (
    <span aria-hidden="true" className={`tp-float absolute hidden size-14 place-items-center rounded-xl border-2 border-tp-ink font-[family-name:var(--font-reading)] text-[28px] italic shadow-[3px_3px_0_var(--tp-ink)] lg:grid ${className}`}>
      {children}
    </span>
  )
}

// One published problem per day (see lib/inicio.js). While loading, the card
// says «Cargando problema…»; on an error or an empty bank the hero shows a
// decorative collage instead.
function useProblemOfTheDay() {
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
  return state
}

function ProblemaDelDia({ problem }) {
  return (
    <section aria-labelledby="problema-del-dia" aria-busy={!problem} className="tp-card relative flex flex-col gap-4 bg-tp-yellow px-6 pb-7 pt-7 sm:px-8">
      <span aria-hidden="true" className="absolute -right-4 -top-11 rotate-12 sm:-right-7">
        <Burst className="size-[92px] sm:size-[104px]" color="var(--tp-coral)">
          <span className="font-display text-[19px] font-extrabold leading-none sm:text-[21px]">¡Hoy!</span>
        </Burst>
      </span>
      <div className="flex flex-wrap items-center gap-2.5 pr-14">
        <h2 id="problema-del-dia" className="tp-kicker tp-kicker-ink font-sans">Problema del día</h2>
        {problem && <span className="text-sm font-bold">{problemSourceLabel(problem)}</span>}
        {problem?.tema && <span className="tp-pill bg-tp-surface py-px text-xs font-semibold">{problem.tema}</span>}
      </div>
      {problem
        ? <Suspense fallback={<p className="text-[19px] leading-[1.6]">Cargando problema…</p>}><MathText text={stripDayPrefix(problem.enunciado)} className="line-clamp-6 whitespace-pre-line text-[19px] leading-[1.6]" /></Suspense>
        : <p className="text-[19px] leading-[1.6]">Cargando problema…</p>}
      {problem && (
        <div className="flex flex-wrap items-center gap-x-[18px] gap-y-3 pt-1">
          <Link to={`${LIBRARY_BASE.problems}/${problem._id}`} className="tp-button bg-tp-mint px-5 font-bold text-tp-ink">Resolver<Arrow /></Link>
          <span className="text-sm font-semibold">Cambia cada día. Comenta tu idea con los demás.</span>
        </div>
      )}
    </section>
  )
}

// Shown in place of the problem when the bank can't be loaded.
function SymbolCollage() {
  const tiles = [['π', 'bg-tp-mint', '-rotate-6'], ['√2', 'bg-tp-surface', 'rotate-3'], ['Δ', 'bg-tp-coral', 'rotate-6'], ['n!', 'bg-tp-sky', '-rotate-3'], ['x²', 'bg-tp-yellow', 'rotate-2'], ['∞', 'bg-tp-tint-violet', '-rotate-6']]
  return (
    <div aria-hidden="true" className="tp-card relative grid grid-cols-3 gap-4 bg-tp-surface p-7">
      {tiles.map(([symbol, color, tilt]) => (
        <span key={symbol} className={`grid aspect-square place-items-center rounded-2xl border-2 border-tp-ink font-[family-name:var(--font-reading)] text-[40px] italic shadow-[3px_3px_0_var(--tp-ink)] ${color} ${tilt}`}>{symbol}</span>
      ))}
    </div>
  )
}

// Handwritten invitation under the hero buttons: opens «Crear cuenta»
// directly; a signed-in reader gets a greeting instead.
function CuentaNote() {
  const { auth, abrirModal } = useAuth()
  if (auth) {
    return <p className="tp-hand -rotate-2 pl-1 text-[28px] text-tp-ink">¡Qué gusto verte de nuevo, <span className="text-tp-violet">{auth.user.username}</span>!</p>
  }
  return (
    <button type="button" onClick={() => abrirModal('signup')} className="tp-hand group flex min-h-11 -rotate-2 items-center pl-1 text-left text-[28px] text-tp-ink">
      <span className="underline decoration-tp-violet decoration-wavy decoration-2 underline-offset-[7px] transition-colors group-hover:text-tp-violet">¡Crea tu cuenta y guarda tu progreso!</span>
    </button>
  )
}

function Hero() {
  const { status, problem } = useProblemOfTheDay()
  const showProblem = status === 'loading' || status === 'ready'

  return (
    <section aria-labelledby="inicio-titulo" className="relative overflow-hidden border-b-3 border-tp-ink bg-tp-sky">
      <div aria-hidden="true" className="tp-graph absolute inset-0" />
      <div aria-hidden="true" className="tp-halftone absolute -left-24 -top-24 size-[440px] opacity-[.16] [mask-image:radial-gradient(circle,black_20%,transparent_68%)]" />
      <div className="tp-container relative grid items-center gap-x-16 gap-y-16 pb-20 pt-12 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)] lg:pb-24 lg:pt-20">
        <div className="flex flex-col items-start gap-6">
          <span className="tp-sticker -rotate-2 bg-tp-yellow">Olimpiada de matemáticas · En español</span>
          <h1 id="inicio-titulo" className="tp-display">
            Entrena para la <Highlight color="var(--tp-yellow)">olimpiada</Highlight> con un <Mark color="var(--tp-violet)" delay={650}>camino claro.</Mark>
          </h1>
          <p className="tp-lead max-w-[540px] text-[18px] text-tp-ink-soft">Rutas, problemas, teoría y exámenes en un solo lugar, para que cualquier persona, sin importar su nivel, pueda prepararse.</p>
          <div className="flex flex-wrap items-center gap-4 pt-1">
            {/* Plain anchor: index.css scrolls smoothly unless reduced motion is on. */}
            <a href="#como-empezar" className="tp-button min-h-[52px] bg-tp-violet px-6 text-[17px] font-bold text-white">¿Cómo empiezo?<Arrow /></a>
            <Link to="/rutas" className="tp-button min-h-[52px] bg-tp-surface px-6 text-[17px] font-bold text-tp-ink">Ver las Rutas</Link>
          </div>
          <CuentaNote />
        </div>

        <div className="relative mx-auto w-full max-w-[560px] lg:mr-0">
          <div aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-4 rotate-[3deg] rounded-[18px] border-3 border-tp-ink bg-tp-violet" />
          {showProblem ? <ProblemaDelDia problem={problem} /> : <SymbolCollage />}
          <SymbolTile className="-left-9 top-1/3 -rotate-12 bg-tp-mint">π</SymbolTile>
          <SymbolTile className="-bottom-9 right-14 rotate-6 bg-tp-surface [animation-delay:-2s]">√2</SymbolTile>
        </div>
      </div>
    </section>
  )
}

function Ticker() {
  return (
    <div className="border-b-3 border-tp-ink bg-tp-ink py-4 font-display text-[22px] font-extrabold tracking-[-0.01em] text-tp-paper sm:text-[26px]">
      <Marquee items={TICKER} />
    </div>
  )
}

// Real totals from the libraries. A total that can't be loaded is left
// out; with none the band isn't shown.
const STATS = [
  { api: 'problems', label: 'problemas para practicar', to: LIBRARY_BASE.problems, bar: 'bg-tp-violet' },
  { api: 'theory', label: 'lecciones de teoría', to: LIBRARY_BASE.theory, bar: 'bg-tp-sky' },
  { api: 'lists', label: 'listas de problemas', to: LIBRARY_BASE.lists, bar: 'bg-tp-mint' },
  { api: 'exams', label: 'exámenes de práctica', to: LIBRARY_BASE.exams, bar: 'bg-tp-coral' },
]

function useLibraryTotals() {
  const [totals, setTotals] = useState({})
  useEffect(() => {
    let active = true
    Promise.all(STATS.map(({ api }) => apiFetch(`/api/${api}?page=1&limit=1`).then((data) => [api, data?.total]).catch(() => [api, null])))
      .then((entries) => { if (active) setTotals(Object.fromEntries(entries.filter(([, total]) => total > 0))) })
    return () => { active = false }
  }, [])
  return totals
}

// Counts up from 0 once it scrolls into view (instantly with reduced motion).
function CountUp({ value }) {
  const [ref, inView] = useInView({ threshold: 0.6 })
  const output = useRef(null)
  useEffect(() => {
    if (!inView || !output.current) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { output.current.textContent = value; return undefined }
    let frame
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / 1200, 1)
      if (output.current) output.current.textContent = Math.round(value * (1 - (1 - t) ** 3))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, value])
  return <span ref={ref}><span ref={output}>0</span></span>
}

function EnNumeros() {
  const totals = useLibraryTotals()
  const stats = STATS.filter(({ api }) => totals[api])
  if (!stats.length) return null
  return (
    <section aria-label="TeacherPeri en números" className="border-b-3 border-tp-ink bg-tp-surface">
      <ul className="tp-container grid grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <li key={stat.api} className={`border-dashed border-tp-rule ${index % 2 === 1 ? 'border-l-2' : ''} ${index >= 2 ? 'border-t-2 lg:border-t-0' : ''} ${index === 2 ? 'lg:border-l-2' : ''}`}>
            <Link to={stat.to} className="group flex flex-col items-start gap-2 px-4 py-9 sm:px-8 lg:py-12">
              <span className="font-display text-[clamp(52px,6vw,84px)] font-extrabold leading-none tracking-[-0.05em]">
                <span className="sr-only">{totals[stat.api]}</span>
                <span aria-hidden="true"><CountUp value={totals[stat.api]} /></span>
              </span>
              <span aria-hidden="true" className={`h-2 w-12 rounded-full border-2 border-tp-ink transition-[width] duration-300 group-hover:w-20 ${stat.bar}`} />
              <span className="text-[15px] font-semibold text-tp-ink-soft group-hover:text-tp-ink">{stat.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

function ComoEmpezar() {
  return (
    <section id="como-empezar" aria-labelledby="como-empezar-titulo" className="scroll-mt-24 bg-tp-paper">
      <div className="tp-container py-20 lg:py-28">
        <SectionHeading id="como-empezar-titulo" kicker="Si es tu primera vez">
          Cómo empezar en <span className="tp-inline-num">3</span> pasos
        </SectionHeading>
        <ol className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-6">
          <span aria-hidden="true" className="absolute inset-x-[12%] top-[52px] hidden border-t-3 border-dashed border-tp-ink md:block" />
          {STEPS.map((step, index) => (
            <li key={step.title} className="relative flex">
              {index === 0 && (
                <span aria-hidden="true" className="tp-hand absolute -top-12 right-3 hidden rotate-[-5deg] items-end gap-1 text-[26px] text-tp-violet md:flex">
                  ¡empieza aquí!
                  <HandArrow className="mb-[-30px] h-10 w-12" />
                </span>
              )}
              <Link to={step.to} className={`tp-card-soft tp-lift group flex w-full flex-col gap-3 p-6 pt-5 text-tp-ink ${step.card}`}>
                <span aria-hidden="true" className={`tp-num-badge ${step.badge}`}>{index + 1}</span>
                <h3 className="tp-card-title pt-2 text-[24px] tracking-[-0.02em]">{step.title}</h3>
                <span className="text-tp-ink-soft">{step.text}</span>
                <span aria-hidden="true" className="mt-auto pt-2 text-xl font-bold transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

// Signed-in progress in a Ruta ({ completedLeaves, totalLeaves, percentage }),
// or null when signed out or when it can't be loaded.
function useRutaProgress(slug) {
  const { auth } = useAuth()
  const token = auth?.token
  const [state, setState] = useState({ token: null, progress: null })
  useEffect(() => {
    if (!token) return undefined
    let active = true
    apiFetch(`/api/paths/${encodeURIComponent(slug)}/progress`, { token })
      .then((progress) => { if (active) setState({ token, progress }) })
      .catch(() => { if (active) setState({ token, progress: null }) })
    return () => { active = false }
  }, [slug, token])
  return token && state.token === token ? state.progress : null
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
  const ciclos = cicloNames(ruta)
  const progress = useRutaProgress(FEATURED_RUTA_SLUG)

  return (
    <section aria-labelledby="ruta-destacada" className="relative overflow-hidden border-y-3 border-tp-ink bg-tp-violet text-white">
      <div aria-hidden="true" className="tp-graph absolute inset-0 [--grid-line:rgb(255_255_255/.09)]" />
      <div aria-hidden="true" className="tp-halftone absolute -bottom-28 -right-24 size-[420px] opacity-25 [--dot:#fff] [mask-image:radial-gradient(circle,black_15%,transparent_68%)]" />
      <div className="tp-container relative py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="flex max-w-[680px] flex-col items-start gap-5">
            <span className="tp-sticker rotate-2 bg-tp-yellow">Ruta destacada</span>
            <h2 id="ruta-destacada" className="tp-section-title">Preparación para la <Mark variant="lines" color="var(--tp-yellow)" width={6}>OMM</Mark></h2>
            <p className="tp-lead max-w-[520px] text-white/85">{ciclos.length} ciclos para entrenar en orden, a tu ritmo.</p>
            {progress?.totalLeaves > 0 && (
              <div className="w-full max-w-[460px] pt-1">
                <p className="flex items-baseline justify-between gap-4 text-sm font-bold">
                  <span>Tu avance</span>
                  <span>{progress.completedLeaves} de {progress.totalLeaves} completados</span>
                </p>
                <div aria-hidden="true" className="mt-2 h-4 overflow-hidden rounded-full border-2 border-tp-ink bg-tp-surface">
                  <div className="h-full border-r-2 border-tp-ink bg-tp-yellow" style={{ width: `${progress.percentage}%` }} />
                </div>
              </div>
            )}
          </div>
          <Link to={href} className="tp-button min-h-[52px] bg-tp-yellow px-6 text-[17px] font-bold text-tp-ink">Ver la Ruta<Arrow /></Link>
        </div>
        <ol className="relative mt-16 grid gap-5 md:grid-cols-5 md:gap-4">
          <span aria-hidden="true" className="absolute inset-x-[10%] top-[29px] hidden border-t-3 border-dashed border-white/60 md:block" />
          <span aria-hidden="true" className="absolute bottom-6 left-[29px] top-6 border-l-3 border-dashed border-white/60 md:hidden" />
          {ciclos.map((name, index) => (
            <li key={name} className="relative flex items-center gap-4 md:flex-col md:text-center">
              <span aria-hidden="true" className={`grid size-[60px] shrink-0 place-items-center rounded-full border-3 border-tp-ink font-display text-[24px] font-extrabold text-tp-ink shadow-[4px_4px_0_var(--tp-ink)] ${index === 0 ? 'bg-tp-yellow' : 'bg-tp-surface'}`}>{index + 1}</span>
              <span className="flex flex-col gap-0.5">
                <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-white/80">Ciclo {index + 1}</span>
                <span className="text-lg font-bold leading-tight">{name}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Explora() {
  return (
    <section aria-labelledby="explora-titulo" className="bg-tp-paper">
      <div className="tp-container py-20 lg:py-28">
        <SectionHeading id="explora-titulo" kicker="O explora por tu cuenta">
          ¿Qué quieres hacer <Mark variant="scribble" color="var(--tp-coral)" width={5}>hoy</Mark>?
        </SectionHeading>
        <ul className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-7">
          {EXPLORE.map((card) => (
            <li key={card.to} className="flex">
              <Link to={card.to} className="tp-card-soft tp-lift group flex w-full flex-col overflow-hidden bg-tp-surface text-tp-ink">
                <span className={`relative block h-40 overflow-hidden border-b-2 border-tp-ink ${card.art}`}>
                  <span aria-hidden="true" className="tp-halftone absolute inset-0 opacity-[.18] [mask-image:linear-gradient(to_left,black,transparent_75%)]" />
                  <span aria-hidden="true" className="absolute -bottom-10 right-5 font-[family-name:var(--font-reading)] text-[150px] italic leading-none transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">{card.glyph}</span>
                  <span className="tp-sticker absolute left-5 top-5 -rotate-3 bg-tp-surface">{card.kicker}</span>
                </span>
                <div className="flex flex-1 flex-col gap-2 p-6">
                  <h3 className="tp-card-title text-[23px] tracking-[-0.02em]">{card.title}</h3>
                  <span className="text-tp-ink-muted">{card.text}</span>
                  <span className="mt-auto pt-3 font-bold">{card.cta}<span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">{'\u00a0→'}</span></span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function SobreTeacherPeri() {
  return (
    <section aria-labelledby="sobre-titulo" className="relative overflow-hidden border-t-3 border-tp-ink bg-tp-yellow">
      <div aria-hidden="true" className="tp-halftone absolute -right-20 -top-20 size-[460px] opacity-[.14] [mask-image:radial-gradient(circle,black_20%,transparent_68%)]" />
      {/* The title spans the section; below it the penguin's bubble and the
          Experiencias card share a row, tops aligned. */}
      <div className="tp-container relative flex flex-col gap-10 py-20 lg:gap-12 lg:py-28">
        <div className="flex flex-col items-start gap-5">
          <span className="tp-sticker -rotate-2 bg-tp-surface">Sobre TeacherPeri</span>
          <h2 id="sobre-titulo" className="tp-section-title max-w-[1000px]">Construido desde la experiencia de aprender, competir y <Highlight color="var(--tp-sky)">enseñar</Highlight>.</h2>
        </div>
        <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          {/* Peri's penguin says the mission. On a phone the bubble sits above
              it, its tail pointing down at the head; from sm up the penguin
              stands to the left of the bubble, the tail pointing at its beak,
              and the buttons go under the bubble. */}
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-end gap-x-5 gap-y-3 [grid-template-areas:'bubble_bubble'_'penguin_buttons'] sm:items-start sm:gap-x-11 sm:gap-y-7 sm:[grid-template-areas:'penguin_bubble'_'penguin_buttons']">
            <div className="tp-bubble max-w-[640px] bg-tp-surface px-6 py-5 [grid-area:bubble] sm:px-7">
              <p className="text-[17px] leading-[1.65]"><strong>Misión:</strong> hacer que el entrenamiento para olimpiadas de matemáticas sea accesible para todos. Inspirados por la experiencia de dar talleres gratuitos a estudiantes y profesores.</p>
              <BubbleTail className="left-12 top-[calc(100%-3px)] sm:hidden" />
              <BubbleTail className="left-[3px] top-7 hidden origin-top-left rotate-90 sm:block" />
            </div>
            <PeriPenguin className="mt-11 h-[160px] w-auto [grid-area:penguin] sm:mt-0 sm:h-[220px] lg:h-[240px]" />
            <div className="flex flex-wrap gap-3 pb-1 [grid-area:buttons]">
              <Link to="/sobre-mi" className="tp-button bg-tp-ink px-5 font-bold text-white">Sobre mí</Link>
              <Link to="/contacto" className="tp-button bg-tp-surface px-5 font-bold text-tp-ink">Contacto</Link>
            </div>
          </div>
          <aside aria-labelledby="experiencias-titulo" className="tp-card relative flex flex-col gap-3 bg-tp-surface p-7 lg:rotate-0">
            <span className="tp-sticker -rotate-3 self-start bg-tp-coral">Próximamente</span>
            <h3 id="experiencias-titulo" className="font-display text-[34px] font-extrabold leading-none tracking-[-0.03em]">Experiencias</h3>
            <p className="text-[17px] text-tp-ink-muted">Historias de exolímpicos para inspirarte a dar el siguiente paso.</p>
            <span aria-hidden="true" className="tp-hand rotate-[-3deg] self-end pt-2 text-[26px] text-tp-violet">¡pronto aquí!</span>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  usePageMeta()
  return (
    <>
      <Navbar />
      {/* pt-[72px] clears the fixed Navbar (69px row + 3px border). */}
      <main className="bg-tp-paper pt-[72px] text-tp-ink">
        <Hero />
        <Ticker />
        <EnNumeros />
        <ComoEmpezar />
        <RutaDestacada />
        <Explora />
        <SobreTeacherPeri />
      </main>
      <Footer />
    </>
  )
}
