import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePageMeta } from '../../hooks/usePageMeta'
import periArmadura from '../../assets/equipo/peri-armadura.webp'
import periVolando from '../../assets/equipo/peri-volando.webp'
import periPlanos from '../../assets/equipo/peri-planos.webp'
import fotoConCath from '../../assets/equipo/con-elias.webp'
import fotoStella from '../../assets/equipo/stella.webp'
import fotoMicrosoft from '../../assets/equipo/elias-microsoft.webp'
import fotoMascara from '../../assets/equipo/elias-mascara.webp'

// Elías's own page (TeacherPeri), linked from Equipo and opened in its own
// tab, without the site menu. Everything on it lives in this file (plus the
// three Peri pictures in src/assets/equipo/), so changes here don't touch
// anyone else's page.
//
// Its own look, not TeacherPeri's: Peri's workshop. Peri wears a red-and-gold
// suit of armour, and the page is a lab seen through a helmet display: corner
// brackets, a readout of the section you are in and an altitude gauge that
// follows the scroll. One story runs down the page and ties it together: the
// system boots, the armour is built from its blueprint as you scroll, we open
// Elías's file, his missions (olympiads) and his training centre (teaching), a
// jet made of bricks builds itself in the hangar and takes off with his
// projects on board, then his flight log (school and jobs), and the page ends
// in the sky.
//
// What is written about Elías comes from his CVs (2024 and 2026). Personal
// details on them (phone, e-mail, address, grades) stay off the page. A field
// left null shows as a hatched «classified» bar, which suits the look, until
// someone fills it in.
//
// Pictures: peri-armadura.webp and peri-volando.webp are the armoured Peri
// drawings cut out of their white background; peri-planos.webp is
// peri-armadura turned into a cyan blueprint (its black outlines as lines, its
// gold trims as orange circuitry). Redo it if the drawing changes.

const C = {
  void: '#04070f',
  cyan: '#5fd8ff',
  ice: '#e8f8ff',
  text: '#d3e3f3',
  muted: '#93a9c2',
  red: '#d6282f',
  gold: '#ffb627',
  ink: '#0b1020',
}
const FONTS = 'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Exo+2:wght@400;500;600;700&family=Share+Tech+Mono&display=swap'

// ---------- Content ----------

const BOOT = [
  'iniciando PERI·OS v4.0',
  'calibrando reactor π ...... OK',
  'revisando aletas .......... OK',
  'bienvenido de vuelta, Elías',
]

// What I'm up to right now, a strip under the hero.
const NOW = [
  'Estudiando Computación en Toronto',
  'Construyendo TeacherPeri con Catherine',
  'Programando Stella, nuestro videojuego',
  'Entrenando a la selección de Chiapas',
  'Sobreviviendo a finales',
]

// The armour's systems, in the order the assembly reaches them (it is built
// from the feet up). `at`: how much of the armour must be built for it to say OK.
const SYSTEMS = [
  { name: 'Propulsores', ok: 'en línea', at: 0.12 },
  { name: 'Aletas', ok: 'listas para escribir demostraciones', at: 0.4 },
  { name: 'Reactor π', ok: 'carga completa', at: 0.62 },
  { name: 'Casco', ok: 'modo concentración', at: 0.86 },
  { name: 'Modo olimpiada', ok: 'desbloqueado', at: 0.96 },
]

// Elías's file. null = not written yet (shows as classified).
const DOSSIER = [
  ['Nombre', 'Elías Perianza Robles'],
  ['Alias', 'TeacherPeri'],
  ['Origen', 'Chiapas, México'],
  ['Base', 'Mississauga, Canadá'],
  ['Estudia', 'Ciencias de la Computación · U of T Mississauga'],
  ['Idiomas', 'Español, inglés y un poco de francés'],
  ['Equipo', 'Con Catherine (TeacherCath)'],
]

const BIO = [
  '¡Hola! Soy Elías, de Chiapas. Hoy estudio Ciencias de la Computación en la Universidad de Toronto Mississauga, en Canadá. Entrar ahí fue el resultado de años de preparación, sobre todo en las olimpiadas, y no habría sido posible sin mis amigos, mis profesores y, sobre todo, mi familia.',
  'Empecé en las olimpiadas de matemáticas en primaria, con los campeonatos estatales de Chiapas en 2016, y llevo más de ocho años entre entrenamientos y competencias. En el camino pasé por la OMMEB, la ONMAPS, el GAU55 y la OMM, donde gané bronce en 2023 y plata en 2024, y di el discurso de la ceremonia de premiación.',
  'Me interesa combinar el pensamiento lógico con la creatividad para crear cosas nuevas, sobre todo en computación y emprendimiento.',
  'Desde 2023 también enseño. Entreno a estudiantes de Chiapas para la olimpiada y doy talleres a profes de matemáticas.',
  'Junto con Catherine hago TeacherPeri, un lugar con los recursos que nos hubiera gustado tener cuando empezamos a prepararnos para las olimpiadas.',
]

// Scholarships and other honours, as chips under the file.
const HONOURS = [
  ['silver', 'Plata nacional en la 38.ª OMM (2024) y discurso de la premiación'],
  ['gold', 'Reconocimiento René Descartes por el promedio más alto de la generación 2022–2025'],
  ['gold', 'Reconocimiento Anáhuac a la Excelencia Académica (generación 2025)'],
  ['gold', 'Beca UNAM al Mérito Académico'],
  ['gold', 'President’s Scholar of Excellence · U of T'],
  ['gold', 'U of T International Scholar Award'],
  ['gold', 'Dean’s List Scholar · UTM (invierno 2026)'],
  ['gold', 'UTM Entrance Award'],
]

// Olympiads, one card each: the two big ones, then the rest behind «ver
// más». medals: [kind, text]. kind: 'gold' | 'silver' | 'bronze' (also used
// for 1.º, 2.º and 3.er lugar), 'mention', or 'team' (selected for a team).
// The tally below counts every text that starts with «Plata/Bronce/Oro
// nacional», so write national medals that way.
const MISSIONS = [
  {
    title: 'OMM', full: 'Olimpiada Mexicana de Matemáticas',
    about: 'La olimpiada nacional de prepa, la más difícil del país.',
    medals: [['silver', 'Plata nacional · 38.ª OMM (2024)'], ['bronze', 'Bronce nacional · 37.ª OMM (2023)'], ['team', 'Seleccionado por Chiapas · 36.ª OMM (2022)'], ['gold', 'Oro · Olimpiada Regional del Sureste (2024)'], ['silver', 'Plata · Olimpiada Regional del Sureste (2023)'], ['gold', 'Oro, plata y bronce estatales · Chiapas (2020–2024)']],
    extra: 'Además, di el discurso de la ceremonia de premiación.',
  },
  {
    title: 'OMMEB', full: 'Olimpiada Mexicana de Matemáticas para Educación Básica',
    about: 'Aquí llegaron mis primeros nacionales.',
    medals: [['silver', 'Plata nacional · 5.ª OMMEB (2021)'], ['bronze', 'Bronce nacional · 4.ª OMMEB (2020)'], ['bronze', 'Bronce nacional · 2.ª OMMEB (2018)'], ['gold', 'Oro estatal · OMMEB en Chiapas (2017–2021)']],
  },
]
const MORE_MISSIONS = [
  {
    title: 'ONMAPS', full: 'Olimpiada Nacional de Matemáticas para Alumnos de Primaria y Secundaria',
    medals: [['silver', 'Plata nacional · XX ONMAPS (2021)'], ['silver', 'Plata nacional · XXI ONMAPS (2021)'], ['bronze', 'Bronce nacional · XXII ONMAPS (2022)'], ['gold', 'Oro y plata estatales · Chiapas (2021–2022)']],
  },
  {
    title: 'R³', full: 'Olimpiada Nacional de Matemáticas «Roberto Ramírez Ramírez»',
    medals: [['bronze', 'Bronce nacional (2024–2025)'], ['gold', 'Oro estatal · Chiapas (2023–2024)'], ['team', 'Seleccionado por Chiapas · 1.ª edición (2023)']],
  },
  {
    title: 'GAU55', full: 'Concurso Nacional de Matemáticas Carl Friedrich Gauss',
    medals: [['silver', 'Plata nacional · VII GAU55 (2024)'], ['bronze', 'Bronce nacional · VI GAU55 (2023)'], ['silver', '2.º lugar nacional · II GAU55 (2019)'], ['bronze', '3.er lugar nacional · III GAU55 (2020)'], ['mention', 'Mención honorífica · IV GAU55 (2021)']],
  },
  {
    title: 'Otoño', full: 'Olimpiada de Otoño (CARMA)',
    medals: [['mention', 'Mención honorífica nacional · IX edición (2019)']],
  },
  {
    title: 'Física', full: 'Olimpiada Nacional de Física y Concurso Mexicano de Física',
    medals: [['bronze', 'Bronce · Olimpiada Nacional de Física en Chiapas (2024)'], ['team', 'Seleccionado por Chiapas · Concurso Mexicano de Física (2022)']],
  },
]
const NATIONAL = [...MISSIONS, ...MORE_MISSIONS].flatMap((m) => m.medals).filter(([, text]) => /^(Oro|Plata|Bronce) nacional/.test(text))
const count = (word) => String(NATIONAL.filter(([, text]) => text.startsWith(word)).length)
const TALLY = [['Medallas nacionales', String(NATIONAL.length)], ['Platas', count('Plata')], ['Bronces', count('Bronce')], ['Años compitiendo', '8+']]

// Teaching. SQUADS: each number is drawn as that many little penguins (n).
const SQUADS = [
  { n: 100, big: '100+', label: 'estudiantes entrenados, de 3.º de primaria a prepa', color: C.cyan },
  { n: 30, big: '30+', label: 'profes en mis talleres', color: C.gold },
  { n: 5, big: '5+', label: 'doctores con quienes diseñé materiales', color: C.ice },
  { n: 2, big: '2', label: 'alumnos que llevé a clasificar a la EMIC', color: '#ff6b6b' },
]
// Each role gets an embroidered badge on the badge board. icon: 'compass' | 'mic' | 'board' | 'globe'.
const TRAINING = [
  { icon: 'compass', when: '2023 – hoy', title: 'Entrenador de olimpiada', where: 'Selección de Chiapas de la OMM e instituciones aliadas', text: 'Preparo a estudiantes para las selecciones estatales y diseño materiales junto con profesores con doctorado.' },
  { icon: 'mic', when: '2023', title: 'Ponente invitado', where: 'XIV Congreso Estatal de la Enseñanza de las Matemáticas', text: 'Di un taller de matemáticas por invitación de la Secretaría de Educación de Chiapas y la Asociación Nacional de Profesores de Matemáticas.' },
  { icon: 'board', when: '2024', title: 'Profesor invitado', where: 'XXVIII OEMAPS y II OEMMS', text: 'Di los talleres de introducción a la olimpiada para profes de matemáticas.' },
  { icon: 'globe', when: 'Voluntariado', title: 'Embajador', where: 'University of Wisconsin–Madison', text: 'Represento sus programas preuniversitarios.' },
]

// Projects. A project without a picture shows `visual` instead: 'bars' (a
// small chart of `bars`) or 'flow' (the steps in `flow`).
const PROJECTS = [
  {
    bay: 'Bahía 01',
    name: 'TeacherPeri',
    tag: 'con Catherine',
    what: 'Una plataforma gratuita para aprender matemáticas y prepararse para las olimpiadas, con teoría, problemas, exámenes de práctica y rutas de estudio que guardan tu progreso.',
    stack: ['React 19', 'Express 5', 'MongoDB', 'Vitest', 'Playwright'],
    link: { label: 'Entrar a TeacherPeri', to: '/' },
    image: { src: '/og-image.png', alt: 'Vista previa de TeacherPeri con Peri y Cath' },
  },
  {
    bay: 'Bahía 02',
    name: 'Stella',
    tag: 'en desarrollo con Catherine',
    what: 'Un videojuego de aventura en pixel art donde acompañas a una pequeña nutria espacial en un viaje lleno de acertijos y desafíos, para que niñas y niños aprendan a resolver problemas jugando.',
    stack: ['Unity', 'C#', 'Python'],
    image: { src: fotoStella, alt: 'Portada de Stella, la búsqueda de la piedra perfecta' },
  },
  {
    bay: 'Bahía 03',
    name: 'Clasificador de problemas',
    tag: 'IA para olimpiadas',
    what: 'Un modelo que lee un problema de olimpiada y adivina su tema. Lo entrené desde cero con 4 459 problemas y acierta el 88.3% de las veces, más que unas reglas por palabras clave y que un modelo de lenguaje pequeño.',
    stack: ['Python', 'PyTorch', 'Hugging Face'],
    visual: 'bars',
    bars: [['Mi modelo', 88.3], ['Palabras clave', 72.4], ['LLM pequeño', 26.3]],
  },
  {
    bay: 'Bahía 04',
    name: 'Agente de contacto',
    tag: 'automatización con IA',
    what: 'Un agente con un modelo de lenguaje que investiga a quién escribirle y redacta correos en español e inglés usando Gmail y Drive. Una persona revisa cada paso antes de enviar nada.',
    stack: ['JavaScript', 'Apps Script', 'MCP'],
    visual: 'flow',
    flow: ['Investigar', 'Redactar', 'Revisar', 'Enviar'],
  },
]

// The flight from Chiapas to Toronto: the two airports (Tuxtla Gutiérrez and
// Toronto Pearson, which is in Mississauga) and the great-circle distance
// between them.
const ROUTE = {
  from: { code: 'TGZ', city: 'Tuxtla Gutiérrez, Chiapas', coord: '16.56° N · 93.02° O' },
  to: { code: 'YYZ', city: 'Toronto, Ontario', coord: '43.68° N · 79.62° O' },
  km: 3269,
}

// School and jobs, oldest first: the itinerary on the boarding pass.
const LOG = [
  { when: '2022 – 2025', place: 'Chiapas', where: 'Universidad de Ciencia y Tecnología Descartes', what: 'La prepa. Terminé con promedio de 10, el más alto de mi generación, y me llevé el Reconocimiento René Descartes, el Reconocimiento Anáhuac a la Excelencia Académica y la beca UNAM al Mérito Académico.' },
  { when: 'Sept. 2025 – 2030', place: 'Mississauga', where: 'University of Toronto Mississauga', what: 'Ciencias de la Computación (Specialist), con minor en Negocios, Ciencia y Emprendimiento. En el programa Co-op de prácticas desde agosto de 2026.' },
  { when: 'Jun. – ago. 2026', place: 'Oakville', where: 'Appleby College', what: 'Staff del programa internacional de verano. Me encargaba de la seguridad, las actividades y las excursiones durante ocho semanas.' },
  { when: 'Ago. 2026 – hoy', place: 'Mississauga', where: 'Residencias de UTM', what: 'Facilitador de comunidad. Organizo sesiones académicas y de repaso para exámenes en una residencia de primer año.' },
]

// A frame without `src` is an empty slot that says which photo goes there.
const ALBUM = [
  // pos: which part of the photo stays in the frame (the selfie is square and
  // Catherine is at its left edge, so it keeps the left side)
  { code: 'ARCH-01', src: fotoConCath, pos: 'left center', alt: 'Selfie de Elías con Catherine en la OMM 2024, los dos con playeras de «homotecia positiva»', caption: 'TeacherPeri y TeacherCath · OMM 2024' },
  { code: 'ARCH-02', src: fotoMicrosoft, pos: 'center 40%', alt: 'Elías de traje, sonriendo frente al logo de Microsoft en una oficina', caption: 'En las oficinas de Microsoft' },
  { code: 'ARCH-03', src: fotoMascara, pos: 'center 35%', alt: 'Elías con una máscara roja de Spider-Man y una sudadera de la Universidad de Toronto', caption: 'Identidad secreta · Toronto' },
]

const LINKS = [
  { label: 'Entrar a TeacherPeri', to: '/', primary: true },
  { label: 'Visitar a TeacherCath', to: '/equipo/catherine' },
  { label: 'Equipo', to: '/equipo' },
  { label: 'GitHub', href: 'https://github.com/Perianza18' },
]

// ---------- Motion helpers ----------

const prefersStill = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const clamp01 = (v) => Math.min(1, Math.max(0, v))

// Runs `measure` now and on every scroll and resize, at most once a frame.
function useOnScroll(measure) {
  useEffect(() => {
    let frame = 0
    const run = () => { frame = 0; measure() }
    const queue = () => { if (!frame) frame = requestAnimationFrame(run) }
    run()
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    return () => {
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
      cancelAnimationFrame(frame)
    }
  }, [measure])
}

// For a tall section whose stage sticks to the screen: writes how far along
// it is as --p on the section (0 when its top reaches the top of the screen,
// 1 when its bottom reaches the bottom) and hands it to onChange. The CSS
// below turns --p into the animation. With reduced motion it stays at
// `still`: one calm frame, and the section is no taller than its stage.
function useStageProgress(ref, still, onChange) {
  const measure = useCallback(() => {
    const el = ref.current
    if (!el) return
    let p = still
    if (!prefersStill()) {
      const r = el.getBoundingClientRect()
      const span = r.height - window.innerHeight
      p = span > 0 ? clamp01(-r.top / span) : 1
    }
    el.style.setProperty('--p', p.toFixed(4))
    onChange(p)
  }, [ref, still, onChange])
  useOnScroll(measure)
}

// ---------- Small pieces ----------

// A hatched bar standing in for something not written yet.
function Redacted({ w = '8ch' }) {
  return <span className="peri-redacted" style={{ width: w }}><span className="sr-only">pendiente</span></span>
}

function RedactedLines({ widths = ['100%', '94%', '58%'] }) {
  return (
    <span className="flex flex-col gap-2.5 py-1">
      {widths.map((w, i) => <span key={i} aria-hidden="true" className="peri-redacted block h-[14px]" style={{ width: w }} />)}
      <span className="sr-only">Pendiente.</span>
    </span>
  )
}

function Kicker({ children, className = '', color = C.cyan }) {
  return <p className={`peri-mono text-[12px] ${className}`} style={{ color }}><span aria-hidden="true">// </span>{children}</p>
}

// room: a little smaller on phones, to fit inside a room of the ship.
function SectionHead({ id, kicker, title, children, center = false, room = false }) {
  return (
    <div className={center ? 'text-center' : ''}>
      <Kicker>{kicker}</Kicker>
      <h2 id={id} className={`peri-display peri-glow mt-2 font-bold uppercase leading-[.92] ${room ? 'text-[clamp(28px,6.4vw,76px)]' : 'text-[clamp(40px,6.4vw,76px)]'}`} style={{ color: C.ice }}>{title}</h2>
      {children && <p className={`mt-4 max-w-[620px] text-[17px] leading-7 ${center ? 'mx-auto' : ''}`} style={{ color: C.muted }}>{children}</p>}
    </div>
  )
}

// A line of light that carries the story from one section to the next.
function Conduit({ to }) {
  return (
    <div aria-hidden="true" className="relative mx-auto flex h-36 w-full flex-col items-center">
      <span className="absolute left-1/2 top-0 h-28 w-px -translate-x-1/2" style={{ background: `linear-gradient(transparent, ${C.cyan}88, transparent)` }} />
      <span className="absolute left-1/2 top-0 h-6 w-[3px] -translate-x-1/2 rounded-full motion-safe:animate-[peri-flow_2.4s_linear_infinite]" style={{ background: C.ice, boxShadow: `0 0 12px 2px ${C.cyan}` }} />
      <span className="peri-mono absolute bottom-0 whitespace-nowrap text-[11px]" style={{ color: `${C.cyan}cc` }}>▼ transfiriendo a {to}</span>
    </div>
  )
}

// A targeting ring, drawn behind Peri. The two rings that turn are separate
// <svg>s, so the browser just rotates them (no repainting every frame).
function Reticle({ className = '' }) {
  const ring = 'absolute inset-0 h-full w-full'
  return (
    <div aria-hidden="true" className={`aspect-square ${className}`}>
      <svg viewBox="0 0 400 400" fill="none" stroke={C.cyan} className={ring}>
        <circle cx="200" cy="200" r="194" strokeOpacity=".16" />
        <circle cx="200" cy="200" r="122" strokeOpacity=".14" strokeDasharray="2 7" />
        <path d="M200 0 V18 M200 382 V400 M0 200 H18 M382 200 H400" strokeOpacity=".6" strokeWidth="2" />
      </svg>
      <svg viewBox="0 0 400 400" fill="none" stroke={C.cyan} className={`${ring} motion-safe:animate-[peri-spin_48s_linear_infinite]`}>
        <circle cx="200" cy="200" r="176" strokeOpacity=".55" strokeWidth="2" strokeDasharray="70 16 8 16" />
      </svg>
      <svg viewBox="0 0 400 400" fill="none" stroke={C.cyan} className={`${ring} motion-safe:animate-[peri-spin_30s_linear_infinite_reverse]`}>
        {Array.from({ length: 72 }, (_, i) => {
          const a = (i / 72) * Math.PI * 2
          const r1 = i % 6 ? 152 : 144
          return <line key={i} x1={200 + Math.cos(a) * r1} y1={200 + Math.sin(a) * r1} x2={200 + Math.cos(a) * 158} y2={200 + Math.sin(a) * 158} strokeOpacity={i % 6 ? 0.35 : 0.8} />
        })}
      </svg>
    </div>
  )
}

// The glowing disc Peri stands on.
function Platform({ className = '' }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none ${className}`}>
      <div className="absolute inset-x-[6%] top-1/2 h-[46%] -translate-y-1/2 rounded-[50%] blur-xl" style={{ background: `radial-gradient(${C.cyan}66, transparent 70%)` }} />
      <div className="absolute inset-0" style={{ transform: 'scaleY(.26)' }}>
        <svg viewBox="0 0 200 200" fill="none" stroke={C.cyan} className="h-full w-full motion-safe:animate-[peri-spin_14s_linear_infinite]">
          <circle cx="100" cy="100" r="96" strokeWidth="2.5" strokeOpacity=".9" strokeDasharray="40 10 4 10" />
          <circle cx="100" cy="100" r="74" strokeWidth="1.5" strokeOpacity=".5" />
          <circle cx="100" cy="100" r="52" strokeWidth="5" strokeOpacity=".25" strokeDasharray="3 6" />
        </svg>
      </div>
    </div>
  )
}

// Medals as small hexagons, like Peri's reactor.
const MEDAL = { gold: C.gold, silver: '#d6dee9', bronze: '#d98a4e' }
function MedalHex({ kind, className = 'h-6 w-6' }) {
  const d = 'M16 2 L28 9 V23 L16 30 L4 23 V9 Z'
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className={`shrink-0 ${className}`}>
      {MEDAL[kind] && <><path d={d} fill={MEDAL[kind]} stroke={C.ink} strokeWidth="2" strokeLinejoin="round" /><path d="M16 9 L22 12.5 V19.5 L16 23 L10 19.5 V12.5 Z" fill="none" stroke="white" strokeOpacity=".7" strokeWidth="1.6" /></>}
      {kind === 'mention' && <path d={d} fill="none" stroke={C.cyan} strokeWidth="2" strokeLinejoin="round" />}
      {/* selected for a team: a check inside */}
      {kind === 'team' && <><path d={d} fill={`${C.cyan}33`} stroke={C.cyan} strokeWidth="2" strokeLinejoin="round" /><path d="M11 16.5 L14.5 20 L21 12.5" fill="none" stroke={C.ice} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></>}
      {!kind && <path d={d} fill="none" stroke={C.cyan} strokeWidth="2" strokeLinejoin="round" strokeDasharray="3 3" />}
    </svg>
  )
}

// ---------- The brick jet ----------

const J = { o: C.ink, red: '#d6282f', redS: '#a3161d', gold: C.gold, gray: '#5d6676', grayS: '#3a414e', glass: '#8fe6ff' }
const LINE = { stroke: J.o, strokeWidth: 3, strokeLinejoin: 'round', strokeLinecap: 'round' }

function Studs({ x, y, n, gap = 20, fill }) {
  return Array.from({ length: n }, (_, i) => <rect key={i} x={x + i * gap} y={y} width="12" height="7" rx="2" fill={fill} {...LINE} strokeWidth="2.5" />)
}

// One group of bricks. It flies in from (dx, dy), turned r degrees, and
// clicks into place once --p passes d.
function Part({ dx, dy, r, d, children }) {
  return <g className="peri-part" style={{ '--dx': `${dx}px`, '--dy': `${dy}px`, '--r': `${r}deg`, '--d': d }}>{children}</g>
}

// Peri's jet, built from bricks with studs on top, in the armour's colours
// and with the same black outline as the drawings. Faces right.
function BrickJet({ className = '' }) {
  return (
    <svg aria-hidden="true" viewBox="-130 0 760 250" className={`overflow-visible ${className}`}>
      <defs>
        <linearGradient id="peri-flame" x1="1" x2="0" y1="0" y2="0">
          <stop offset="0" stopColor="#f2fdff" />
          <stop offset=".35" stopColor={C.cyan} />
          <stop offset="1" stopColor={C.cyan} stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className="peri-flame-on">
        <g className="motion-safe:animate-[peri-flicker_.14s_steps(2)_infinite]" style={{ transformBox: 'fill-box', transformOrigin: '100% 50%' }}>
          <path d="M30 114 C -10 120, -70 128, -128 136 C -70 144, -10 152, 30 158 Z" fill="url(#peri-flame)" />
          <path d="M30 126 C 0 128, -30 132, -58 136 C -30 140, 0 144, 30 146 Z" fill="#f4fdff" />
        </g>
      </g>
      {/* far tail fin */}
      <Part dx={-60} dy={-160} r={-40} d={0}>
        <path d="M136 104 L194 104 L164 34 L126 34 Z" fill={J.redS} {...LINE} />
      </Part>
      {/* engine */}
      <Part dx={-180} dy={40} r={-30} d={0.02}>
        <rect x="28" y="114" width="18" height="42" rx="4" fill={J.grayS} {...LINE} />
        <rect x="42" y="106" width="82" height="58" rx="10" fill={J.gray} {...LINE} />
        <path d="M66 106 V164 M92 106 V164" stroke={J.o} strokeWidth="2.5" />
        <circle cx="108" cy="135" r="7" fill={J.gold} {...LINE} strokeWidth="2.5" />
      </Part>
      {/* belly */}
      <Part dx={-30} dy={160} r={6} d={0.05}>
        <rect x="112" y="132" width="356" height="32" fill={J.grayS} {...LINE} />
        <path d="M172 132 V164 M232 132 V164 M292 132 V164 M352 132 V164 M412 132 V164" stroke={J.o} strokeWidth="2.5" />
      </Part>
      {/* near tail fin */}
      <Part dx={-110} dy={-130} r={-25} d={0.08}>
        <path d="M112 104 L174 104 L142 28 L100 28 Z" fill={J.red} {...LINE} />
        <path d="M106 62 L157 62 L161 72 L108 72 Z" fill={J.gold} {...LINE} strokeWidth="2.5" />
        <Studs x={104} y={21} n={2} gap={18} fill={J.red} />
      </Part>
      {/* hull, with portholes and the reactor */}
      <Part dx={40} dy={-140} r={10} d={0.1}>
        <rect x="112" y="100" width="372" height="34" fill={J.red} {...LINE} />
        <path d="M182 100 V134 M402 100 V134 M452 100 V134" stroke={J.o} strokeWidth="2.5" />
        {[206, 238, 270].map((x) => <circle key={x} cx={x} cy="117" r="7" fill={J.glass} {...LINE} strokeWidth="2.5" />)}
        <path d="M340 104 L351.3 110.5 V123.5 L340 130 L328.7 123.5 V110.5 Z" fill={J.gold} {...LINE} strokeWidth="2.5" />
        <path d="M340 111 L345.2 114 V120 L340 123 L334.8 120 V114 Z" fill="#eafcff" />
      </Part>
      {/* wing */}
      <Part dx={-50} dy={180} r={-18} d={0.14}>
        <path d="M214 150 L356 150 L318 226 L162 226 Z" fill={J.redS} {...LINE} />
        <path d="M168 214 L324 214 L318 226 L162 226 Z" fill={J.gold} {...LINE} strokeWidth="2.5" />
        <path d="M262 150 L232 214 M310 150 L280 214" stroke={J.o} strokeWidth="2" opacity=".55" />
      </Part>
      {/* roof, studs on top */}
      <Part dx={20} dy={-200} r={-12} d={0.18}>
        <rect x="162" y="78" width="222" height="24" fill={J.red} {...LINE} />
        <path d="M236 78 V102 M310 78 V102" stroke={J.o} strokeWidth="2.5" />
        <Studs x={170} y={71} n={11} fill={J.red} />
      </Part>
      {/* nose */}
      <Part dx={200} dy={40} r={28} d={0.21}>
        <path d="M484 100 L500 100 L604 134 L574 152 L468 164 L468 132 L484 132 Z" fill={J.gold} {...LINE} />
        <path d="M560 125 L604 134 L574 152 L552 150 Z" fill={J.grayS} {...LINE} strokeWidth="2.5" />
      </Part>
      {/* canopy */}
      <Part dx={180} dy={-160} r={30} d={0.24}>
        <path d="M384 100 L402 60 L452 60 L502 100 Z" fill={J.glass} {...LINE} />
        <path d="M428 60 L436 100" stroke={J.o} strokeWidth="2.5" />
        <path d="M408 70 L422 70" stroke="white" strokeWidth="4" strokeLinecap="round" opacity=".85" />
      </Part>
    </svg>
  )
}

// ---------- Helmet display ----------

function Corner({ className = '' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" fill="none" stroke={C.cyan} strokeWidth="2" className={`absolute h-9 w-9 ${className}`}>
      <path d="M1 26 V1 H26" strokeOpacity=".75" />
      <path d="M6 12 V6 H12" strokeOpacity=".4" />
    </svg>
  )
}

// Fixed over the page on wide screens: corner brackets, the section you are
// in and how far down («altitud») you are.
function Hud() {
  const alt = useRef(null)
  const bar = useRef(null)
  const [where, setWhere] = useState('Arranque')
  const measure = useCallback(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    const p = max > 0 ? clamp01(window.scrollY / max) : 0
    if (alt.current) alt.current.textContent = String(Math.round(p * 100)).padStart(3, '0')
    if (bar.current) bar.current.style.transform = `scaleY(${p})`
  }, [])
  useOnScroll(measure)
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setWhere(e.target.dataset.hud)
    }, { rootMargin: '-45% 0px -54% 0px' })
    document.querySelectorAll('.peri-page [data-hud]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-3 z-30 hidden lg:block">
      <Corner className="left-0 top-0" />
      <Corner className="right-0 top-0 rotate-90" />
      <Corner className="bottom-0 right-0 rotate-180" />
      <Corner className="bottom-0 left-0 -rotate-90" />
      <p className="peri-mono absolute bottom-2 left-12 flex items-center gap-2 text-[11px]" style={{ color: C.cyan }}>
        <span className="size-1.5 rounded-full motion-safe:animate-[peri-pulse_1.6s_ease-in-out_infinite]" style={{ background: C.gold }} />
        {where}
      </p>
      <div className="absolute right-1 top-1/2 flex -translate-y-1/2 flex-col items-center gap-2">
        <span className="peri-mono text-[10px]" style={{ color: `${C.cyan}aa` }}>alt</span>
        <span className="relative h-[30vh] w-[2px]" style={{ background: `${C.cyan}26` }}>
          <span ref={bar} className="absolute inset-0 origin-top" style={{ background: C.cyan, boxShadow: `0 0 8px ${C.cyan}`, transform: 'scaleY(0)' }} />
        </span>
        <span className="peri-mono text-[11px] tracking-[.08em]" style={{ color: C.ice }}><span ref={alt}>000</span>%</span>
      </div>
    </div>
  )
}

// ---------- Sections ----------

// Labels around Peri in the hero, each with a line to the part it names.
// Positions are percentages of the rig box: the label's corner (x, y), where
// its line starts (ax, ay) and the point it touches (tx, ty).
const CALLOUTS = [
  { name: 'Casco', value: 'modo concentración', side: 'left', x: 0, y: 3, ax: 25, ay: 7, tx: 41, ty: 11 },
  { name: 'Reactor π', value: 'carga 100%', side: 'right', x: 0, y: 29, ax: 77, ay: 33, tx: 62, ty: 37 },
  { name: 'Propulsores', value: 'en espera', side: 'left', x: 0, y: 70, ax: 25, ay: 74, tx: 46, ty: 79 },
]

function Hero() {
  const ref = useRef(null)
  // The rig tilts a little towards the pointer, like a hologram.
  useEffect(() => {
    const el = ref.current
    if (!el || prefersStill() || !window.matchMedia('(pointer: fine)').matches) return undefined
    let frame = 0
    const move = (e) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const r = el.getBoundingClientRect()
        el.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3))
        el.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3))
      })
    }
    el.addEventListener('pointermove', move)
    return () => { el.removeEventListener('pointermove', move); cancelAnimationFrame(frame) }
  }, [])
  return (
    <header ref={ref} data-hud="Arranque" className="relative overflow-hidden">
      {/* light from above, falling on Peri */}
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[820px] w-[1200px] -translate-x-1/2 md:left-[68%]" style={{ background: `radial-gradient(ellipse 26% 64% at 50% 0%, ${C.cyan}5c, ${C.cyan}12 55%, transparent 76%)` }} />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[820px] w-[1200px] -translate-x-1/2 md:left-[68%]" style={{ background: 'repeating-conic-gradient(from 150deg at 50% -8%, rgba(190,240,255,.11) 0deg 1.6deg, transparent 1.6deg 6deg)', maskImage: 'radial-gradient(ellipse 34% 72% at 50% 0%, black, transparent 78%)', WebkitMaskImage: 'radial-gradient(ellipse 34% 72% at 50% 0%, black, transparent 78%)' }} />
      {/* floor grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[36%] overflow-hidden [perspective:600px]">
        <div className="absolute -inset-x-1/2 bottom-0 h-[220%] origin-bottom" style={{ transform: 'rotateX(70deg)', backgroundImage: `linear-gradient(${C.cyan}30 1px, transparent 1px), linear-gradient(90deg, ${C.cyan}30 1px, transparent 1px)`, backgroundSize: '64px 64px', maskImage: 'linear-gradient(to top, black, transparent 75%)', WebkitMaskImage: 'linear-gradient(to top, black, transparent 75%)' }} />
      </div>

      <div className="relative mx-auto max-w-[1180px] px-5 pb-10 pt-6 sm:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="peri-mono text-[12px] hover:underline" style={{ color: C.cyan }}>← TeacherPeri</Link>
          <span className="peri-mono text-[12px]" style={{ color: `${C.cyan}aa` }}>Taller de Peri</span>
        </div>

        <div className="mt-10 grid items-center gap-10 md:mt-6 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="relative z-10">
            <div aria-hidden="true" className="mb-8 flex flex-col gap-1 text-[12px]" style={{ fontFamily: "'Share Tech Mono', ui-monospace, monospace", color: C.cyan }}>
              {BOOT.map((t, i) => (
                <span key={t} className="flex"><span className="opacity-50">&gt;&nbsp;</span><span className="peri-type" style={{ '--n': t.length, animationDelay: `${0.2 + i * 0.6}s` }}>{t}</span></span>
              ))}
            </div>
            <p className="peri-mono text-[14px]" style={{ color: C.gold }}>Hola, soy</p>
            <h1 className="peri-display peri-glow text-[clamp(88px,15vw,176px)] font-bold uppercase leading-[.82] tracking-[-.01em]" style={{ color: C.ice }}>Elías</h1>
            <p className="mt-5 text-[22px] font-semibold">pero aquí me dicen <span className="peri-display font-bold" style={{ color: C.gold }}>TeacherPeri</span></p>
            <p className="mt-1 text-[15px]" style={{ color: C.muted }}>(sí, el pingüino de la armadura soy yo)</p>
            <p className="mt-6 max-w-[470px] text-[17px] leading-7">Te doy la bienvenida a mi taller. Soy de Chiapas y estudio Computación en Toronto. Aquí se arman pingüinos, problemas de olimpiada y uno que otro proyecto con Catherine. Pásale, nada más no toques el reactor.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#ensamblaje" className="peri-cut peri-display px-6 py-3 text-[15px] font-bold uppercase tracking-[.08em] transition-transform hover:-translate-y-0.5" style={{ background: C.gold, color: C.ink }}>Iniciar ensamblaje ↓</a>
              <a href="#hangar" className="peri-cut peri-display border px-6 py-3 text-[15px] font-bold uppercase tracking-[.08em] transition-colors hover:bg-[#5fd8ff1a]" style={{ borderColor: `${C.cyan}88`, color: C.ice }}>Ir al hangar</a>
            </div>
          </div>

          {/* Peri on the holo-platform, with labels */}
          <div className="relative mx-auto aspect-[5/6] w-full max-w-[470px]" style={{ transform: 'perspective(1000px) rotateY(calc(var(--mx, 0) * 9deg)) rotateX(calc(var(--my, 0) * -7deg))', transition: 'transform .3s ease-out' }}>
            <Reticle className="absolute left-1/2 top-[38%] w-[118%] max-w-none -translate-x-1/2 -translate-y-1/2" />
            <Platform className="absolute bottom-[4%] left-1/2 h-[16%] w-[74%] -translate-x-1/2" />
            <img src={periArmadura} alt="Peri, el pingüino de TeacherPeri, con su armadura roja y dorada" className="absolute left-1/2 top-[2%] z-10 h-[80%] w-auto -translate-x-1/2 drop-shadow-[0_0_28px_rgba(95,216,255,.35)] motion-safe:animate-[peri-float_6s_ease-in-out_infinite]" />
            {/* scanning line */}
            <span aria-hidden="true" className="absolute inset-x-[14%] top-[2%] z-20 h-[2px] motion-safe:animate-[peri-scan_4.5s_ease-in-out_infinite] motion-reduce:hidden" style={{ background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)`, boxShadow: `0 0 14px 2px ${C.cyan}88` }} />
            <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 z-20 hidden h-full w-full sm:block">
              {CALLOUTS.map((c) => <polyline key={c.name} points={`${c.ax},${c.ay} ${c.side === 'left' ? c.tx - 6 : c.tx + 6},${c.ay} ${c.tx},${c.ty}`} fill="none" stroke={C.cyan} strokeWidth="1" vectorEffect="non-scaling-stroke" strokeOpacity=".8" />)}
            </svg>
            {CALLOUTS.map((c) => (
              <div key={c.name} aria-hidden="true" className="absolute z-20 hidden sm:block" style={{ top: `${c.y}%`, [c.side]: `${c.x}%`, textAlign: c.side }}>
                <p className="peri-mono text-[11px]" style={{ color: C.gold }}>{c.name}</p>
                <p className="text-[13px] font-semibold leading-4" style={{ color: C.ice }}>{c.value}</p>
              </div>
            ))}
            {CALLOUTS.map((c) => <span key={`${c.name}-dot`} aria-hidden="true" className="absolute z-20 hidden size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 sm:block" style={{ left: `${c.tx}%`, top: `${c.ty}%`, borderColor: C.cyan, background: C.void, boxShadow: `0 0 8px ${C.cyan}` }} />)}
          </div>
        </div>
      </div>
    </header>
  )
}

function Now() {
  return (
    <section data-hud="Estado" aria-labelledby="ahora" className="relative mx-auto max-w-[1180px] px-5 pt-4 sm:px-8">
      <h2 id="ahora" className="peri-mono text-center text-[12px]" style={{ color: C.cyan }}>// Estado actual</h2>
      <ul className="mt-4 flex flex-wrap justify-center gap-3">
        {NOW.map((t) => (
          <li key={t} className="peri-cut flex items-center gap-2.5 border px-4 py-2 text-[15px] font-semibold" style={{ borderColor: `${C.cyan}44`, background: `${C.cyan}0d` }}>
            <span aria-hidden="true" className="size-2 rounded-full motion-safe:animate-[peri-pulse_1.8s_ease-in-out_infinite]" style={{ background: C.gold, boxShadow: `0 0 8px ${C.gold}` }} />{t}
          </li>
        ))}
      </ul>
    </section>
  )
}

function Assembly() {
  const ref = useRef(null)
  const pct = useRef(null)
  const onChange = useCallback((p) => {
    if (pct.current) pct.current.textContent = String(Math.round(clamp01((p - 0.06) / 0.78) * 100)).padStart(3, '0')
  }, [])
  useStageProgress(ref, 1, onChange)
  return (
    <section ref={ref} id="ensamblaje" data-hud="Ensamblaje" aria-labelledby="ensamblaje-titulo" className="peri-assembly peri-stage-wrap relative h-[260vh]" style={{ '--p': 0 }}>
      <div className="peri-stage sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse 50% 60% at 70% 50%, ${C.cyan}14, transparent 70%)` }} />
        <div className="relative mx-auto grid w-full max-w-[1180px] items-center gap-4 px-5 sm:px-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-10">
          <div>
            <SectionHead id="ensamblaje-titulo" kicker="Protocolo Mk-π" title="Ensamblando a Peri">
              <span className="hidden sm:inline">Toda buena armadura empieza como un plano. Baja despacio y mira cómo se arma pieza por pieza.</span>
            </SectionHead>
            <p className="peri-mono mt-5 text-[13px] md:mt-8" style={{ color: C.cyan }}>Armadura <span ref={pct} className="text-[28px] tracking-[.04em] md:text-[40px]" style={{ color: C.ice }}>000</span>%</p>
            <ul className="mt-3 grid gap-1.5 text-[14px] sm:gap-2 md:mt-5 md:text-[15px]" aria-label="Sistemas de la armadura">
              {SYSTEMS.map((s) => (
                <li key={s.name} className="flex items-baseline gap-3 border-b pb-1.5" style={{ borderColor: `${C.cyan}22`, '--t': s.at }}>
                  <span className="peri-mono w-[130px] shrink-0 text-[11px] md:w-[150px] md:text-[12px]" style={{ color: C.muted }}>{s.name}</span>
                  <span className="inline-grid">
                    <span className="peri-sys-wait peri-mono [grid-area:1/1] text-[12px]" style={{ color: `${C.cyan}88` }}>esperando…</span>
                    <span className="peri-sys-ok [grid-area:1/1] font-semibold" style={{ color: C.ice }}><span style={{ color: C.gold }}>✓</span> {s.ok}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="peri-rig relative mx-auto">
            <Reticle className="absolute left-1/2 top-1/2 w-[190%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-60" />
            <Platform className="absolute -bottom-[6%] left-1/2 h-[14%] w-[130%] -translate-x-1/2" />
            <img src={periPlanos} alt="" className="peri-blueprint absolute inset-0 h-full w-full motion-safe:animate-[peri-glitch_5s_linear_infinite]" />
            <img src={periArmadura} alt="Peri con la armadura completa" className="peri-armour absolute inset-0 h-full w-full" />
            <span aria-hidden="true" className="peri-head absolute -inset-x-[18%] h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${C.gold}, #fff, ${C.gold}, transparent)`, boxShadow: `0 0 18px 4px ${C.gold}88` }} />
            <p aria-hidden="true" className="peri-ready peri-display absolute -bottom-[16%] left-1/2 w-max -translate-x-1/2 border px-4 py-1.5 text-[14px] font-bold uppercase tracking-[.2em]" style={{ borderColor: C.gold, color: C.gold, background: `${C.void}cc` }}>Armadura lista</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Dossier() {
  return (
    <section id="expediente" data-hud="Expediente" aria-labelledby="expediente-titulo" className="mx-auto max-w-[1180px] px-5 sm:px-8">
      <SectionHead id="expediente-titulo" kicker="Archivo 001 · acceso concedido" title="Expediente" />
      <div className="mt-10 grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="peri-panel p-6">
          <div className="flex items-center gap-4">
            <div className="peri-scanlines size-20 shrink-0 overflow-hidden" style={{ clipPath: 'polygon(25% 3%, 75% 3%, 100% 50%, 75% 97%, 25% 97%, 0 50%)', background: '#0b2238' }}>
              <img src={periPlanos} alt="" className="max-w-none" style={{ height: '290%', marginLeft: '-46%', marginTop: '-2%' }} />
            </div>
            <div>
              <p className="peri-mono text-[11px]" style={{ color: C.cyan }}>Identificación</p>
              <p className="peri-display text-[34px] font-bold uppercase leading-none" style={{ color: C.ice }}>Elías</p>
              <p className="peri-display text-[16px] font-semibold" style={{ color: C.gold }}>TeacherPeri</p>
            </div>
          </div>
          <dl className="mt-6 grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-2.5 text-[15px]">
            {DOSSIER.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="peri-mono pt-0.5 text-[11px]" style={{ color: C.muted }}>{k}</dt>
                <dd className="font-semibold" style={{ color: C.ice }}>{v ?? <Redacted w="11ch" />}</dd>
              </div>
            ))}
          </dl>
          <div aria-hidden="true" className="mt-6 h-8 opacity-50" style={{ background: `repeating-linear-gradient(90deg, ${C.cyan} 0 2px, transparent 2px 5px, ${C.cyan} 5px 6px, transparent 6px 10px, ${C.cyan} 10px 13px, transparent 13px 15px)` }} />
        </div>
        <div className="peri-panel p-6 sm:p-8">
          <p className="peri-mono flex items-center gap-2 text-[11px]" style={{ color: C.gold }}>
            <span aria-hidden="true" className="size-1.5 rounded-full motion-safe:animate-[peri-pulse_1.2s_ease-in-out_infinite]" style={{ background: C.red }} />Transmisión entrante
          </p>
          <div className="mt-4 flex flex-col gap-5 text-[18px] leading-8">
            {BIO.map((text, i) => <p key={i}>{text ?? <RedactedLines />}</p>)}
          </div>
          <p className="peri-mono mt-6 text-[12px]" style={{ color: C.muted }}>Fin del mensaje<span aria-hidden="true" className="ml-1 inline-block h-3.5 w-2 align-[-2px] motion-safe:animate-[peri-caret_1s_steps(1)_infinite]" style={{ background: C.cyan }} /></p>
        </div>
      </div>
      <h3 className="peri-mono mt-10 text-center text-[12px]" style={{ color: C.gold }}>// Condecoraciones</h3>
      <ul className="mt-4 flex flex-wrap justify-center gap-2.5">
        {HONOURS.map(([kind, text]) => (
          <li key={text} className="peri-cut flex items-center gap-2.5 border px-3.5 py-2 text-[14px] font-semibold leading-5" style={{ borderColor: `${C.cyan}33`, background: `${C.cyan}0b` }}>
            <MedalHex kind={kind} className="h-5 w-5" />{text}
          </li>
        ))}
      </ul>
    </section>
  )
}

function MissionCard({ m, compact = false }) {
  return (
    <li className={`peri-panel relative overflow-hidden ${compact ? 'p-5' : 'p-6'}`}>
      <div className="peri-mono flex justify-between gap-3 text-[11px]" style={{ color: C.cyan }}>
        <span>Misión</span><span>{m.medals.length} {m.medals.length === 1 ? 'registro' : 'registros'}</span>
      </div>
      <h3 className={`peri-display mt-3 font-bold uppercase leading-none ${compact ? 'text-[24px]' : 'text-[34px]'}`} style={{ color: C.ice }}>{m.title}</h3>
      <p className="mt-2 text-[13px] font-semibold uppercase leading-5 tracking-wide" style={{ color: C.muted }}>{m.full}</p>
      {m.about && <p className="mt-3 text-[15px] leading-6">{m.about}</p>}
      <ul className="mt-4 flex flex-col gap-2">
        {m.medals.map(([kind, text]) => (
          <li key={text} className="flex items-center gap-2.5 px-3 py-2 text-[14px] font-semibold leading-5" style={{ background: `${C.cyan}0f` }}>
            <MedalHex kind={kind} />{text}
          </li>
        ))}
      </ul>
      {m.extra && <p className="mt-3 text-[14px] font-semibold leading-6" style={{ color: C.gold }}>{m.extra}</p>}
    </li>
  )
}

function Missions() {
  return (
    <section id="misiones" data-hud="Misiones" aria-labelledby="misiones-titulo" className="mx-auto max-w-[1180px] px-5 sm:px-8">
      <SectionHead id="misiones-titulo" kicker="Olimpiadas" title="Registro de misiones" center>
        Desde 2016, con mi primer campeonato estatal en Chiapas, las olimpiadas fueron más de ocho años de entrenar, viajar a nacionales y pelearme con problemas. Estas son las principales.
      </SectionHead>
      <ul className="mx-auto mt-12 grid max-w-[940px] items-start gap-6 md:grid-cols-2">
        {MISSIONS.map((m) => <MissionCard key={m.title} m={m} />)}
      </ul>
      <details className="peri-more group mt-8">
        <summary className="peri-cut peri-display mx-auto flex w-fit cursor-pointer list-none items-center gap-2 border px-5 py-2.5 text-[14px] font-bold uppercase tracking-[.08em]" style={{ borderColor: `${C.cyan}88`, color: C.ice }}>
          <span className="group-open:hidden">Ver más misiones</span><span className="hidden group-open:inline">Ver menos</span>
          <span aria-hidden="true" className="transition-transform group-open:rotate-180">▾</span>
        </summary>
        <ul className="mt-6 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MORE_MISSIONS.map((m) => <MissionCard key={m.title} m={m} compact />)}
        </ul>
      </details>
      <dl className="peri-panel mx-auto mt-8 grid max-w-[760px] grid-cols-2 text-center sm:grid-cols-4">
        {TALLY.map(([k, v]) => (
          <div key={k} className="flex flex-col-reverse gap-1.5 border-[#5fd8ff22] px-2 py-4 sm:[&:not(:first-child)]:border-l">
            <dt className="peri-mono text-[10px] sm:text-[11px]" style={{ color: C.muted }}>{k}</dt>
            <dd className="peri-display text-[34px] font-bold leading-none" style={{ color: C.ice }}>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

// Adds `is-on` to the element the first time its top rises past 70% of the
// screen;
// the CSS hangs its entrance on that class (lines that draw themselves,
// penguins that light up). With reduced motion it is on from the start.
function useReveal(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (prefersStill()) {
      el.classList.add('is-on')
      return undefined
    }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      el.classList.add('is-on')
      io.disconnect()
    }, { rootMargin: '0px 0px -30% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
}

// A geometry hologram rising from a glowing table: a triangle with its
// circumcircle, its three angle bisectors meeting at the incentre I, and the
// incircle. The points are computed, not eyeballed: I = (aA + bB + cC)/(a+b+c),
// r = area / s, and each bisector ends where it divides the opposite side in
// the ratio of the adjacent sides.
function Holotable({ className = '' }) {
  const draw = (dl) => ({ className: 'peri-draw', pathLength: 1, style: { '--dl': `${dl}s` } })
  const pop = (dl) => ({ className: 'peri-pop', style: { '--dl': `${dl}s` } })
  const label = { fontFamily: "'Share Tech Mono', ui-monospace, monospace", fontSize: 20 }
  return (
    <svg viewBox="0 0 560 600" role="img" aria-label="Holograma de un triángulo con su circuncírculo, sus tres bisectrices que se cortan en el incentro I, y su incírculo" className={className}>
      <defs>
        <linearGradient id="peri-beam" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={C.cyan} stopOpacity=".3" />
          <stop offset="1" stopColor={C.cyan} stopOpacity="0" />
        </linearGradient>
        <radialGradient id="peri-table">
          <stop offset="0" stopColor={C.cyan} stopOpacity=".55" />
          <stop offset=".6" stopColor={C.cyan} stopOpacity=".12" />
          <stop offset="1" stopColor={C.cyan} stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M200 512 L360 512 L548 14 L12 14 Z" fill="url(#peri-beam)" />
      <ellipse cx="280" cy="520" rx="260" ry="60" fill="url(#peri-table)" />
      <g fill="none" stroke={C.cyan}>
        <ellipse cx="280" cy="520" rx="210" ry="42" strokeWidth="2" strokeOpacity=".75" />
        <ellipse cx="280" cy="520" rx="160" ry="31" strokeOpacity=".4" strokeDasharray="6 8" />
        <ellipse cx="280" cy="520" rx="96" ry="19" stroke={C.gold} strokeOpacity=".7" strokeWidth="1.5" />
      </g>
      <g transform="translate(0 -46)">
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="270" cy="260.6" r="192.9" stroke={C.cyan} strokeOpacity=".55" strokeWidth="1.5" {...draw(0)} />
          <path d="M90 330 L450 330 L300 70 Z" stroke={C.ice} strokeWidth="3" {...draw(0.35)} />
          <path d="M90 330 L372.2 195.2 M450 330 L204.5 188.2 M300 70 L279.7 330" stroke={C.gold} strokeWidth="1.8" strokeOpacity=".9" {...draw(1)} />
          <circle cx="287" cy="235.9" r="94.1" stroke={C.gold} strokeWidth="2.5" {...draw(1.5)} />
          {/* the two equal halves of the angle at A */}
          <path d="M130 330 A40 40 0 0 0 126.1 312.8 M126.1 312.8 A40 40 0 0 0 115.1 298.9 M123.2 322.5 L134.9 319.8 M116.7 308.9 L126.1 301.5" stroke={C.cyan} strokeWidth="1.6" {...draw(1.9)} />
          {[[368.6, 188.8], [213.8, 176.7], [287, 330]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="3.5" fill={C.gold} {...pop(2)} />)}
          {[[90, 330], [450, 330], [300, 70]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="5" fill={C.ice} {...pop(0.9)} />)}
          <circle cx="287" cy="235.9" r="6" fill={C.gold} stroke={C.void} strokeWidth="2" {...pop(1.7)} />
          <g fill={C.ice} style={label}>
            <text x="64" y="356" {...pop(0.9)}>A</text>
            <text x="462" y="356" {...pop(0.9)}>B</text>
            <text x="316" y="78" {...pop(0.9)}>C</text>
            <text x="298" y="230" fill={C.gold} {...pop(1.7)}>I</text>
          </g>
        </g>
      </g>
    </svg>
  )
}

// Little penguins, one per person, that light up in turn.
function Cadets({ n, color, delay = 0, className = '' }) {
  return (
    <div aria-hidden="true" className={`flex flex-wrap gap-x-[5px] gap-y-1.5 ${className}`}>
      {Array.from({ length: n }, (_, i) => (
        <svg key={i} viewBox="0 0 12 16" className="peri-cadet h-[17px] w-[13px]" style={{ color, '--i': i, '--sd': `${delay}s` }}><use href="#peri-cadet" /></svg>
      ))}
    </div>
  )
}

const PATCH_ICONS = {
  globe: <><circle cx="24" cy="22" r="17" /><path d="M7 22 H41 M24 5 C 15 13, 15 31, 24 39 M24 5 C 33 13, 33 31, 24 39" /><path d="M12 12 C 18 15, 30 15, 36 12 M12 32 C 18 29, 30 29, 36 32" stroke={C.gold} /></>,
  compass: <><circle cx="24" cy="8" r="4.5" /><path d="M21.5 12 L10 42 M26.5 12 L38 42" /><path d="M8 33 C 16 43, 32 43, 40 33" stroke={C.gold} /></>,
  mic: <><rect x="17" y="3" width="14" height="23" rx="7" /><path d="M10 20 C 10 33, 38 33, 38 20 M24 32 V42 M16 42 H32" /></>,
  board: <><rect x="4" y="5" width="40" height="28" rx="2" /><path d="M14 44 L19 33 M34 44 L29 33" /><path d="M14 14 H34 M19 14 V27 M29 14 V25 C 29 27.5, 31 28, 33 26.5" stroke={C.gold} /></>,
}

// An embroidered badge: a hexagon with stitches round the edge.
function Patch({ icon, className = '' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 132" className={className}>
      <path d="M60 4 L114 35 V97 L60 128 L6 97 V35 Z" fill="#0b1b30" stroke={C.gold} strokeWidth="5" strokeLinejoin="round" />
      <path d="M60 15 L104 40 V92 L60 117 L16 92 V40 Z" fill="none" stroke={C.cyan} strokeWidth="1.8" strokeDasharray="4 4" strokeOpacity=".85" />
      <g transform="translate(36 42)" fill="none" stroke={C.ice} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">{PATCH_ICONS[icon]}</g>
    </svg>
  )
}

function Training() {
  const ref = useRef(null)
  useReveal(ref)
  const [students, ...others] = SQUADS
  return (
    <Room ref={ref} id="entrenamiento" hud="Sala de entrenamiento" labelledBy="entrenamiento-titulo" floor="hex" number="02" stencil="Entrenamiento">
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <symbol id="peri-cadet" viewBox="0 0 12 16">
          <path d="M6 .8 C 9 .8 10.6 3.4 10.6 6.6 L 11.2 12.4 C 11.2 14.4 9 15.4 6 15.4 C 3 15.4 .8 14.4 .8 12.4 L 1.4 6.6 C 1.4 3.4 3 .8 6 .8 Z" fill="currentColor" />
          <path d="M6 6.6 C 8.3 6.6 9.1 8.7 9.1 10.6 C 9.1 12.9 7.7 13.9 6 13.9 C 4.3 13.9 2.9 12.9 2.9 10.6 C 2.9 8.7 3.7 6.6 6 6.6 Z" fill={C.void} fillOpacity=".45" />
          <circle cx="7.6" cy="4.2" r=".95" fill={C.void} />
          <path d="M10.3 4.6 L12 5.4 L10.3 6.2 Z" fill={C.gold} />
        </symbol>
      </svg>
      <SectionHead id="entrenamiento-titulo" kicker="Sala 02 · Enseñar" title="Centro de entrenamiento" room>
        Después de tantos años compitiendo, ahora me toca estar del otro lado y preparar a quienes vienen detrás.
      </SectionHead>

      <div className="mt-6 grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
        <Holotable className="mx-auto w-full max-w-[500px]" />
        <div>
          <p className="peri-mono text-[12px]" style={{ color: C.gold }}>// Escuadrón Chiapas</p>
          <p className="mt-3 flex flex-wrap items-baseline gap-x-4">
            <span className="peri-display peri-glow text-[clamp(64px,8vw,96px)] font-bold leading-none" style={{ color: C.ice }}>{students.big}</span>
            <span className="max-w-[260px] text-[16px] font-semibold leading-6" style={{ color: C.text }}>{students.label}</span>
          </p>
          <Cadets n={students.n} color={students.color} className="mt-4 max-w-[360px]" />
          <ul className="mt-9 grid gap-7 border-t pt-7 sm:grid-cols-3 sm:gap-5" style={{ borderColor: `${C.cyan}22` }}>
            {others.map((s, k) => (
              <li key={s.label}>
                <p className="peri-display text-[44px] font-bold leading-none" style={{ color: s.color }}>{s.big}</p>
                <p className="mt-1.5 text-[14px] font-semibold leading-5" style={{ color: C.muted }}>{s.label}</p>
                <Cadets n={s.n} color={s.color} delay={1.2 + k * 0.4} className="mt-3" />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* the roles: a board of badges, two columns, each badge beside its text */}
      <div className="relative mt-16 rounded-[20px] border px-6 pb-8 pt-9 sm:px-9" style={{ borderColor: '#2b3546', background: 'linear-gradient(160deg, #0d1828, #0a121f)', outline: `2px dashed ${C.gold}44`, outlineOffset: '-10px' }}>
        <h3 className="peri-mono absolute -top-3 left-6 px-2 text-[11px]" style={{ background: '#101a28', color: C.gold }}>Insignias</h3>
        <ul className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          {TRAINING.map((t) => (
            <li key={t.title} className="flex flex-col items-start gap-3 sm:flex-row sm:gap-5">
              <Patch icon={t.icon} className="w-[52px] shrink-0 drop-shadow-[0_6px_12px_rgba(0,0,0,.5)] sm:w-[76px]" />
              <div className="min-w-0 sm:pt-1">
                <p className="peri-mono text-[11px]" style={{ color: C.gold }}>{t.when}</p>
                <h4 className="peri-display mt-1 text-[21px] font-bold uppercase leading-tight" style={{ color: C.ice }}>{t.title}</h4>
                <p className="mt-0.5 text-[14px] font-semibold leading-5" style={{ color: C.cyan }}>{t.where}</p>
                <p className="mt-2 text-[15px] leading-6" style={{ color: C.text }}>{t.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Room>
  )
}

const LAMPS = [8, 22, 36, 50, 64, 78, 92]

function Hangar() {
  const ref = useRef(null)
  const pieces = useRef(null)
  const onChange = useCallback((p) => {
    if (pieces.current) pieces.current.textContent = String(Math.round(clamp01(p / 0.56) * 1024)).padStart(4, '0')
  }, [])
  // With reduced motion: the jet stands built in the hangar.
  useStageProgress(ref, 0.615, onChange)
  return (
    <section ref={ref} id="hangar" data-hud="Hangar" aria-labelledby="hangar-titulo" className="peri-hangar peri-stage-wrap relative h-[300vh]" style={{ '--p': 0 }}>
      <div className="peri-stage sticky top-0 h-[100svh] overflow-hidden" style={{ background: 'linear-gradient(#070a12, #0b0f19 60%, #0e1320)' }}>
        {/* ceiling lamps */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[60%]">
          {LAMPS.map((x, i) => (
            <div key={x} className={`absolute top-[5%] -translate-x-1/2 ${i % 2 ? 'hidden sm:block' : ''}`} style={{ left: `${x}%` }}>
              <div className="h-1.5 w-14 rounded-full" style={{ background: '#ffe3b0', boxShadow: '0 0 24px 6px rgba(255,182,39,.45)' }} />
              <div className="absolute left-1/2 top-1 h-[42vh] w-[22vw] -translate-x-1/2" style={{ background: 'linear-gradient(rgba(255,196,90,.10), transparent)', clipPath: 'polygon(45% 0, 55% 0, 100% 100%, 0 100%)' }} />
            </div>
          ))}
        </div>
        {/* the hangar door, opening onto the sky */}
        <div aria-hidden="true" className="absolute right-[3%] top-[16%] h-[58%] w-[34%] overflow-hidden border-x-[6px] border-t-[6px] md:w-[30%]" style={{ borderColor: '#2a3140' }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(#0a1b44, #1d2f6e 60%, #5a3f8a)' }} />
          <div className="absolute inset-0 opacity-80" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.9) 1px, transparent 1.6px), radial-gradient(rgba(169,236,255,.7) 1px, transparent 1.6px)', backgroundSize: '70px 70px, 110px 110px', backgroundPosition: '0 0, 35px 50px' }} />
          <div className="peri-door absolute inset-0" style={{ background: 'repeating-linear-gradient(#3a4252 0 18px, #2b313d 18px 22px)' }}>
            <div className="peri-hazard absolute inset-x-0 bottom-0 h-4" />
          </div>
        </div>
        {/* floor */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[26%] overflow-hidden [perspective:500px]" style={{ background: '#0a0e17' }}>
          <div className="peri-hazard absolute inset-x-0 top-0 h-2.5 opacity-90" />
          <div className="absolute -inset-x-1/2 bottom-0 h-[260%] origin-bottom" style={{ transform: 'rotateX(72deg)', backgroundImage: `linear-gradient(${C.cyan}2a 1px, transparent 1px), linear-gradient(90deg, ${C.cyan}2a 1px, transparent 1px)`, backgroundSize: '70px 70px', maskImage: 'linear-gradient(to top, black, transparent 80%)', WebkitMaskImage: 'linear-gradient(to top, black, transparent 80%)' }} />
        </div>

        <div className="relative mx-auto max-w-[1180px] px-5 pt-[9vh] sm:px-8 md:pt-[12vh]">
          <div className="max-w-[460px]">
            <Kicker color={C.gold}>Hangar 02</Kicker>
            <h2 id="hangar-titulo" className="peri-display peri-glow mt-2 text-[clamp(40px,6.4vw,76px)] font-bold uppercase leading-[.92]" style={{ color: C.ice }}>El Peri-Jet</h2>
            <p className="mt-3 text-[16px] leading-7" style={{ color: C.muted }}>Modelo armable de 1 024 piezas. Sigue bajando y verás cómo se arma solo y despega.</p>
            <dl aria-hidden="true" className="peri-mono mt-4 grid w-max grid-cols-[auto_auto] gap-x-4 gap-y-1 text-[11px] md:text-[12px]" style={{ color: C.muted }}>
              <dt>Piezas</dt><dd style={{ color: C.ice }}><span ref={pieces}>0000</span>/1024</dd>
              <dt>Compuerta</dt>
              <dd className="inline-grid" style={{ color: C.ice }}><span className="peri-s1 [grid-area:1/1]">cerrada</span><span className="peri-s23 [grid-area:1/1]" style={{ color: C.gold }}>abierta</span></dd>
              <dt>Estado</dt>
              <dd className="inline-grid" style={{ color: C.ice }}><span className="peri-s1 [grid-area:1/1]">ensamblando…</span><span className="peri-s2 [grid-area:1/1]">listo para despegar</span><span className="peri-s3 [grid-area:1/1]" style={{ color: C.gold }}>¡despegue! ✓</span></dd>
            </dl>
          </div>
        </div>

        <div className="absolute left-[2%] top-[52%] w-[min(780px,96vw)] md:left-[5%] md:top-[44%]">
          <div className="peri-jet"><BrickJet className="w-full" /></div>
        </div>
        <img src={periVolando} alt="" className="peri-escort absolute bottom-[4%] left-[6%] w-[90px] md:w-[130px]" />
      </div>
    </section>
  )
}

function Cargo() {
  return (
    <Room id="carga" hud="Bodega de carga" labelledBy="carga-titulo" floor="tread" number="03" stencil="Bodega">
      <div>
        <SectionHead id="carga-titulo" kicker="Sala 03 · Proyectos" title="Bodega de carga" room>Lo que llevo a bordo.</SectionHead>
        <div className="relative mt-12 border-2 border-dashed p-3 pt-6 sm:p-6" style={{ borderColor: `${C.gold}55` }}>
        <span aria-hidden="true" className="peri-mono absolute -top-3 left-4 px-2 text-[11px]" style={{ background: '#151b25', color: C.gold }}>Zona de carga</span>
        <div className="grid gap-8 md:grid-cols-2">
          {PROJECTS.map((p) => (
            <article key={p.name} className="peri-panel flex flex-col overflow-hidden">
              <div className="peri-mono flex items-center justify-between border-b px-4 py-2 text-[11px]" style={{ borderColor: `${C.cyan}22`, color: C.cyan }}>
                <span>{p.bay}</span><span className="peri-hazard h-2 w-20 opacity-80" aria-hidden="true" />
              </div>
              <div className="relative">
                {p.image
                  ? <img src={p.image.src} alt={p.image.alt} loading="lazy" className="aspect-[1200/630] w-full object-cover" />
                  : <ProjectVisual p={p} />}
                <div aria-hidden="true" className="peri-scanlines pointer-events-none absolute inset-0" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="peri-display text-[30px] font-bold uppercase leading-none" style={{ color: C.ice }}>{p.name}</h3>
                  <span className="peri-mono text-[11px]" style={{ color: C.gold }}>{p.tag}</span>
                </div>
                <p className="mt-3 leading-7">{p.what}</p>
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                  {p.stack.map((s) => <span key={s} className="peri-mono border px-2.5 py-1 text-[10px]" style={{ borderColor: `${C.cyan}44`, color: C.cyan }}>{s}</span>)}
                  {p.link && <Link to={p.link.to} className="peri-cut peri-display ml-auto px-4 py-2 text-[13px] font-bold uppercase tracking-[.08em]" style={{ background: C.gold, color: C.ink }}>{p.link.label} →</Link>}
                </div>
              </div>
            </article>
          ))}
        </div>
        </div>
        <p className="peri-panel peri-mono mt-8 flex items-center justify-center gap-3 border-dashed px-4 py-6 text-center text-[12px]" style={{ color: C.muted }}>
          <span aria-hidden="true" className="text-[18px]" style={{ color: C.cyan }}>+</span>Bahía {String(PROJECTS.length + 1).padStart(2, '0')} · disponible para el próximo proyecto
        </p>
      </div>
    </Room>
  )
}

// The picture of a project that has none: a small holographic chart or flow.
function ProjectVisual({ p }) {
  const frame = { background: `radial-gradient(ellipse at 50% 120%, ${C.cyan}22, transparent 60%), #071224` }
  if (p.visual === 'bars') {
    return (
      <figure className="flex aspect-[1200/630] w-full flex-col justify-center gap-4 px-[8%]" style={frame}>
        <figcaption className="peri-mono text-[11px]" style={{ color: C.cyan }}>Aciertos al adivinar el tema</figcaption>
        {p.bars.map(([label, value], i) => (
          <div key={label} className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_3.2rem] items-center gap-3 text-[13px] font-semibold sm:grid-cols-[9rem_minmax(0,1fr)_3.5rem]">
            <span className="truncate" style={{ color: i ? C.muted : C.ice }}>{label}</span>
            <span className="h-3.5" style={{ background: `${C.cyan}14` }}>
              <span className="block h-full" style={{ width: `${value}%`, background: i ? `${C.cyan}66` : C.gold, boxShadow: i ? undefined : `0 0 14px ${C.gold}88` }} />
            </span>
            <span className="peri-display text-right text-[16px] font-bold" style={{ color: i ? C.muted : C.gold }}>{value}%</span>
          </div>
        ))}
      </figure>
    )
  }
  return (
    <figure className="flex aspect-[1200/630] w-full flex-col items-center justify-center gap-5 px-[6%]" style={frame}>
      <ol className="flex w-full items-center">
        {p.flow.map((step, i) => (
          <li key={step} className="flex min-w-0 flex-1 items-center">
            <span className={`grid min-h-14 min-w-0 flex-1 place-items-center border px-0.5 text-center text-[9px] uppercase tracking-normal sm:text-[11px] sm:tracking-[.1em] ${i === 2 ? 'peri-cut' : ''}`} style={{ fontFamily: "'Share Tech Mono', ui-monospace, monospace", ...(i === 2 ? { borderColor: C.gold, color: C.gold, background: `${C.gold}14` } : { borderColor: `${C.cyan}77`, color: C.ice, background: `${C.cyan}10` }) }}>{step}</span>
            {i < p.flow.length - 1 && <span aria-hidden="true" className="w-3 shrink-0 text-center sm:w-6" style={{ color: C.cyan }}>›</span>}
          </li>
        ))}
      </ol>
      <figcaption className="peri-mono text-center text-[11px] leading-5" style={{ color: C.muted }}>Una persona aprueba cada paso · 80+ registros · 14 estados</figcaption>
    </figure>
  )
}

// For a section that scrolls past normally: writes how far it has gone
// through the screen as --p (0 when its top is low on the screen, 1 when its
// bottom has risen to 40% of it) and hands it to onChange. With reduced motion
// it stays at 1, the finished state.
function usePassProgress(ref, onChange) {
  const measure = useCallback(() => {
    const el = ref.current
    if (!el) return
    let p = 1
    if (!prefersStill()) {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      p = clamp01((vh * 0.85 - r.top) / (vh * 0.45 + r.height))
    }
    el.style.setProperty('--p', p.toFixed(4))
    onChange(p)
  }, [ref, onChange])
  useOnScroll(measure)
}

const spaced = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

// A stepped temple like the ones in Palenque, with the Chiapas mountains
// behind it. Drawn around (0, 0), the middle of its base.
function Temple() {
  return (
    <g fill="none" strokeLinejoin="round">
      <path d="M-170 0 L-128 -58 L-96 -32 L-60 -84 L-28 -50 L10 -96 L44 -60 L80 -88 L118 -40 L150 0" stroke={C.cyan} strokeOpacity=".35" fill={`${C.cyan}0a`} />
      <g stroke={C.cyan} strokeWidth="1.6" fill={C.void}>
        {Array.from({ length: 6 }, (_, i) => <rect key={i} x={-(150 - i * 20) / 2} y={-(i + 1) * 12} width={150 - i * 20} height="12" />)}
      </g>
      <path d="M-9 0 V-72 H9 V0 M-9 -12 H9 M-9 -24 H9 M-9 -36 H9 M-9 -48 H9 M-9 -60 H9" stroke={C.gold} strokeWidth="1.4" />
      <rect x="-26" y="-94" width="52" height="22" stroke={C.cyan} strokeWidth="1.6" fill={C.void} />
      <path d="M-16 -72 V-86 H-8 V-72 M-4 -72 V-86 H4 V-72 M8 -72 V-86 H16 V-72" stroke={C.cyan} strokeWidth="1.2" />
      <path d="M-14 -94 V-110 H14 V-94 M-14 -102 H14 M-5 -110 V-94 M5 -110 V-94" stroke={C.gold} strokeWidth="1.2" />
    </g>
  )
}

// Toronto from the lake: towers with lit windows, the stadium dome and the
// tall tower with its pod. Drawn around (0, 0), the shore under the tower.
const TOWERS = [[-158, 58, 30], [-124, 92, 26], [-94, 70, 28], [60, 116, 26], [90, 84, 34], [128, 54, 30]]
function Skyline({ windows }) {
  return (
    <g fill="none" strokeLinejoin="round">
      <path d="M-175 10 H175 M-150 21 H150 M-118 32 H118" stroke={C.cyan} strokeOpacity=".28" strokeDasharray="8 6" />
      {TOWERS.map(([x, h, w]) => <rect key={x} x={x} y={-h} width={w} height={h} stroke={C.cyan} strokeWidth="1.5" fill={`url(#${windows})`} />)}
      <path d="M-62 0 A 37 25 0 0 1 12 0 Z" stroke={C.cyan} strokeWidth="1.5" fill={C.void} />
      <path d="M-44 -17 V0 M-25 -24 V0 M-6 -17 V0" stroke={C.cyan} strokeOpacity=".5" />
      <g stroke={C.ice} strokeWidth="1.8" fill={C.void}>
        <path d="M20 0 L30 -46 M48 0 L38 -46" />
        <path d="M30 -150 L28 -20 M38 -150 L40 -20" />
        <path d="M31.5 -162 L32.5 -196 M36.5 -162 L35.5 -196" />
        <rect x="21" y="-163" width="26" height="15" rx="5" />
        <path d="M21 -155.5 H47" stroke={C.gold} />
        <rect x="30" y="-204" width="8" height="10" rx="2" />
        <path d="M34 -204 V-262" />
      </g>
    </g>
  )
}

// The map comes in two shapes: wide for big screens, tall for phones.
// from/to: where the temple and the skyline stand (x, y, scale); route: the
// path Peri flies, from the top of the temple (start) to over the city (end).
const MAPS = {
  wide: { w: 1200, h: 540, from: [210, 460, 1], to: [1010, 300, 1], route: 'M 210 340 C 390 40, 760 10, 975 205', start: [210, 340], end: [975, 205], fromLabel: [210, 498, 'middle'], toLabel: [1010, 372, 'middle'], plane: 84, className: 'hidden sm:block' },
  tall: { w: 400, h: 660, from: [120, 560, 0.8], to: [255, 330, 0.72], route: 'M 120 468 C -40 380, 20 200, 175 190', start: [120, 468], end: [175, 190], fromLabel: [120, 594, 'middle'], toLabel: [265, 398, 'middle'], plane: 62, className: 'sm:hidden' },
}

function MapLabel({ at: [x, y, anchor], place }) {
  return (
    <text x={x} y={y} textAnchor={anchor} style={{ fontFamily: "'Share Tech Mono', ui-monospace, monospace" }}>
      <tspan x={x} fontSize="30" fill={C.ice} letterSpacing="4">{place.code}</tspan>
      <tspan x={x} dy="22" fontSize="14" fill={C.text}>{place.city}</tspan>
      <tspan x={x} dy="18" fontSize="12" fill={C.cyan}>{place.coord}</tspan>
    </text>
  )
}

// Peri flying from Chiapas to Toronto: the route fills in and Peri moves
// along it as the map scrolls past, turned to follow the curve. Three layers:
// the map itself (never repainted), the gold route (a small layer of its own,
// the only thing repainted while scrolling) and Peri and the two pins, which
// are moved by the compositor without repainting anything.
function RouteMap({ map }) {
  const wrap = useRef(null)
  const route = useRef(null)
  const plane = useRef(null)
  const km = useRef(null)
  const state = useRef(null)
  const windows = `peri-win-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const onChange = useCallback((p) => {
    const path = route.current
    const box = wrap.current
    if (!path || !plane.current || !box || !box.offsetWidth) return
    const len = path.getTotalLength()
    const at = path.getPointAtLength(len * p)
    const a = path.getPointAtLength(Math.max(0, len * p - 2))
    const b = path.getPointAtLength(Math.min(len, len * p + 2))
    // The drawing flies up and to the right, about 60° above the horizontal.
    const turn = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 60
    const k = box.offsetWidth / map.w
    plane.current.style.transform = `translate(${(at.x * k).toFixed(1)}px, ${(at.y * k).toFixed(1)}px) translate(-50%, -60%) rotate(${turn.toFixed(1)}deg)`
    if (km.current) km.current.textContent = spaced(Math.round(p * ROUTE.km))
    if (state.current) state.current.textContent = p >= 0.995 ? 'aterrizado ✓' : p > 0.01 ? 'en vuelo' : 'listo para despegar'
  }, [map.w])
  usePassProgress(wrap, onChange)
  const [fx, fy, fs] = map.from
  const [tx, ty, ts] = map.to
  const box = `0 0 ${map.w} ${map.h}`
  const pct = ([x, y]) => ({ left: `${(x / map.w) * 100}%`, top: `${(y / map.h) * 100}%` })
  return (
    <div ref={wrap} className={`relative ${map.className}`} style={{ '--p': 0 }}>
      <dl aria-hidden="true" className="peri-mono absolute left-0 top-0 z-10 grid grid-cols-[auto_auto] gap-x-4 gap-y-1 text-[11px]" style={{ color: C.muted }}>
        <dt>Ruta</dt><dd style={{ color: C.ice }}>{ROUTE.from.code} → {ROUTE.to.code}</dd>
        <dt>Distancia</dt><dd style={{ color: C.ice }}><span ref={km}>0</span> / {spaced(ROUTE.km)} km</dd>
        <dt>Estado</dt><dd ref={state} style={{ color: C.gold }}>listo para despegar</dd>
      </dl>
      <svg viewBox={box} role="img" aria-label={`Ruta de vuelo de ${ROUTE.from.city} a ${ROUTE.to.city}, ${spaced(ROUTE.km)} km`} className="block w-full">
        <defs>
          <pattern id={windows} width="6" height="8" patternUnits="userSpaceOnUse">
            <rect width="6" height="8" fill={C.void} />
            <rect x="2" y="2" width="2" height="3" fill={C.gold} fillOpacity=".6" />
          </pattern>
        </defs>
        {/* a faint grid of parallels and meridians */}
        <g fill="none" stroke={C.cyan} strokeOpacity=".07">
          {[0.2, 0.4, 0.6, 0.8].map((f) => <path key={f} d={`M -40 ${f * 600} Q 600 ${f * 600 - 70} 1240 ${f * 600}`} />)}
          {[0.1, 0.25, 0.4, 0.55, 0.7, 0.85].map((f) => <path key={f} d={`M ${f * 1200} -20 Q ${f * 1200 + 50} 300 ${f * 1200 + 10} 700`} />)}
        </g>
        <g transform={`translate(${fx} ${fy}) scale(${fs})`}><Temple /></g>
        <g transform={`translate(${tx} ${ty}) scale(${ts})`}><Skyline windows={windows} /></g>
        <MapLabel at={map.fromLabel} place={ROUTE.from} />
        <MapLabel at={map.toLabel} place={ROUTE.to} />
        {/* the whole route, dotted */}
        <path d={map.route} fill="none" stroke={C.cyan} strokeOpacity=".45" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />
      </svg>
      {/* the gold route up to where Peri is, with a soft glow drawn as a wider stroke */}
      <svg aria-hidden="true" viewBox={box} className="absolute inset-0 h-full w-full" style={{ willChange: 'transform' }}>
        <path d={map.route} pathLength="1" fill="none" stroke={C.gold} strokeOpacity=".25" strokeWidth="10" strokeLinecap="round" className="peri-route" />
        <path ref={route} d={map.route} pathLength="1" fill="none" stroke={C.gold} strokeWidth="3" strokeLinecap="round" className="peri-route" />
      </svg>
      {[map.start, map.end].map((at, i) => (
        <span key={i} aria-hidden="true" className="absolute size-[10px] -translate-x-1/2 -translate-y-1/2" style={pct(at)}>
          <span className="peri-ping absolute -inset-[3px] rounded-full border-2 motion-reduce:hidden" style={{ borderColor: i ? C.gold : C.cyan }} />
          <span className={`absolute inset-0 rounded-full ${i ? 'peri-landed' : ''}`} style={{ background: i ? C.gold : C.cyan }} />
        </span>
      ))}
      <img ref={plane} src={periVolando} alt="" aria-hidden="true" className="absolute left-0 top-0 h-auto max-w-none" style={{ width: `${(map.plane / map.w) * 100}%`, transformOrigin: '50% 60%', willChange: 'transform', transform: `translate(${(map.start[0] / map.w) * 100}%, 0)` }} />
    </div>
  )
}

// The boarding pass: the only paper on the page. The left part has the route
// and the itinerary (school and jobs); the stub on the right, the passenger.
function BoardingPass() {
  const paper = '#f4efe4'
  const notch = 'absolute size-7 rounded-full'
  return (
    <article aria-label="Pase de abordar de Chiapas a Toronto" className="relative mx-auto mt-6 grid max-w-[1020px] overflow-hidden rounded-[18px] shadow-[0_30px_80px_-30px_rgba(0,0,0,.9)] md:grid-cols-[minmax(0,1fr)_250px]" style={{ background: paper, color: C.ink }}>
      <div className="relative">
        <img src={periPlanos} alt="" aria-hidden="true" className="pointer-events-none absolute -right-6 bottom-0 h-[85%] opacity-[.07] invert" />
        <div className="flex items-center justify-between gap-4 px-6 py-3 text-white" style={{ background: C.red }}>
          <span className="peri-mono text-[12px]">Pase de abordar</span>
          <span className="peri-mono text-[11px] opacity-90">Peri-Jet · vuelo PE-2025</span>
        </div>
        <div className="relative px-6 pb-7 pt-5 sm:px-8">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="peri-mono text-[10px] opacity-60">Origen</p>
              <p className="peri-display text-[clamp(44px,7vw,64px)] font-bold leading-none">{ROUTE.from.code}</p>
              <p className="text-[13px] font-semibold">{ROUTE.from.city}</p>
            </div>
            <svg aria-hidden="true" viewBox="0 0 160 30" className="mb-6 w-[28%] max-w-[180px]">
              <path d="M2 15 H150" stroke={C.ink} strokeWidth="2" strokeDasharray="4 5" />
              <path d="M140 7 L158 15 L140 23 L144 15 Z" fill={C.red} />
            </svg>
            <div className="text-right">
              <p className="peri-mono text-[10px] opacity-60">Destino</p>
              <p className="peri-display text-[clamp(44px,7vw,64px)] font-bold leading-none">{ROUTE.to.code}</p>
              <p className="text-[13px] font-semibold">{ROUTE.to.city}</p>
            </div>
          </div>
          <p className="peri-mono mt-6 border-t-2 border-dashed pt-4 text-[11px]" style={{ borderColor: `${C.ink}33`, color: C.red }}>Itinerario</p>
          <ol className="mt-3 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {LOG.map((e, i) => (
              <li key={e.where + e.when} className="flex gap-3">
                <span className="peri-display grid size-7 shrink-0 place-items-center rounded-full text-[13px] font-bold text-white" style={{ background: C.ink }}>{i + 1}</span>
                <div>
                  <p className="peri-mono text-[10px]" style={{ color: C.red }}>{e.when} · {e.place}</p>
                  <h3 className="peri-display mt-0.5 text-[17px] font-bold uppercase leading-tight">{e.where}</h3>
                  <p className="mt-1 text-[14px] leading-6 opacity-80">{e.what}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* the stub, torn off along the dashed line */}
      <div className="relative border-t-2 border-dashed px-6 py-6 md:border-l-2 md:border-t-0" style={{ borderColor: `${C.ink}40` }}>
        <span aria-hidden="true" className={`${notch} -left-3.5 -top-3.5 md:hidden`} style={{ background: C.void }} />
        <span aria-hidden="true" className={`${notch} -right-3.5 -top-3.5 md:hidden`} style={{ background: C.void }} />
        <span aria-hidden="true" className={`${notch} -left-3.5 -top-3.5 hidden md:block`} style={{ background: C.void }} />
        <span aria-hidden="true" className={`${notch} -bottom-3.5 -left-3.5 hidden md:block`} style={{ background: C.void }} />
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-1">
          {[['Pasajero', 'Elías Perianza Robles'], ['Alias', 'TeacherPeri'], ['Distancia', `${spaced(ROUTE.km)} km`], ['Clase', 'Computación']].map(([k, v]) => (
            <div key={k}>
              <dt className="peri-mono text-[10px] opacity-60">{k}</dt>
              <dd className="font-bold leading-5">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5 flex items-end justify-between gap-3">
          <div aria-hidden="true" className="h-12 flex-1" style={{ background: `repeating-linear-gradient(90deg, ${C.ink} 0 2px, transparent 2px 4px, ${C.ink} 4px 7px, transparent 7px 9px, ${C.ink} 9px 10px, transparent 10px 13px)` }} />
          {/* a holographic seal */}
          <span aria-hidden="true" className="peri-display grid size-14 shrink-0 place-items-center rounded-full text-[12px] font-bold text-white" style={{ background: 'conic-gradient(from 30deg, #5fd8ff, #b99cf0, #ff8fb8, #ffb627, #8ef0c4, #5fd8ff)', boxShadow: 'inset 0 0 0 3px rgba(255,255,255,.6)', textShadow: '0 1px 2px rgba(0,0,0,.4)' }}>Mk-π</span>
        </div>
      </div>
    </article>
  )
}

// ---------- Inside the ship ----------
//
// After the jet takes off you go aboard: the ship seen from above, nose at the
// top. Its hull frames four rooms; a corridor runs down the left side and Peri
// walks along it while you scroll. Each room has its own floor, walls, a door
// onto the corridor and its name painted on the floor.

const svgUrl = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
// A honeycomb of pointy-top hexagons with side 32 (width 55.4, period 96).
const HEX_TILE = svgUrl('<svg xmlns="http://www.w3.org/2000/svg" width="55.43" height="96" viewBox="0 0 55.43 96"><path d="M27.71 0 L55.43 16 V48 L27.71 64 L0 48 V16 Z M27.71 64 V96" fill="none" stroke="#5fd8ff" stroke-opacity=".09" stroke-width="2"/></svg>')
const FLOORS = {
  carpet: { backgroundColor: '#0e1524', backgroundImage: 'repeating-linear-gradient(45deg, rgba(95,216,255,.035) 0 2px, transparent 2px 9px)' },
  hex: { backgroundColor: '#101a28', backgroundImage: HEX_TILE, backgroundSize: '55.43px 96px' },
  tread: { backgroundColor: '#151b25', backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,.03) 0 6px, transparent 6px 18px), repeating-linear-gradient(-45deg, rgba(255,255,255,.03) 0 6px, transparent 6px 18px)' },
  grate: { backgroundColor: '#0d1119', backgroundImage: 'radial-gradient(ellipse 36% 46% at 20% 58%, rgba(255,140,50,.16), transparent 70%), repeating-linear-gradient(0deg, #080b11 0 3px, transparent 3px 16px), repeating-linear-gradient(90deg, #080b11 0 3px, transparent 3px 16px)' },
}

// The tools on the CV, as the modules that keep the reactor running.
const ENGINE = [
  { name: 'Lenguajes', items: ['Python', 'JavaScript', 'Java', 'C#', 'HTML/CSS', 'LaTeX'] },
  { name: 'Frameworks', items: ['React', 'React Router', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'Mongoose', 'PyTorch', 'KaTeX'] },
  { name: 'Pruebas y despliegue', items: ['Vitest', 'Playwright', 'GitHub Actions', 'Git', 'GitHub', 'Vercel', 'Render', 'MongoDB Atlas', 'ESLint', 'npm', 'Unix/Linux'] },
]
const CONCEPTS = ['Estructuras de datos y algoritmos', 'Diseño orientado a objetos', 'APIs REST', 'Autenticación con JWT', 'Roles y permisos', 'Pruebas automáticas', 'CI/CD', 'Agile/Scrum', 'Agentes con LLM (MCP)']

// One room of the ship, seen from above: walls round it, its own floor, a
// number plaque by the door, its name painted along the floor, and the door
// onto the corridor in its left wall.
function Room({ ref, id, hud, labelledBy, floor, number, stencil, children }) {
  return (
    <section ref={ref} id={id} data-hud={hud} aria-labelledby={labelledBy} className="peri-room relative" style={FLOORS[floor]}>
      <span aria-hidden="true" className="peri-hatch" />
      <span aria-hidden="true" className="peri-mono absolute left-3 top-3 border px-1.5 py-0.5 text-[10px]" style={{ borderColor: `${C.gold}88`, color: C.gold, background: '#0b1220' }}>{number}</span>
      <span aria-hidden="true" className="peri-stencil">{stencil}</span>
      <div className="relative px-4 pb-14 pt-14 sm:px-10 lg:pl-14 lg:pr-28">{children}</div>
    </section>
  )
}

// The corridor down the left side. Peri walks along it, staying in view, and
// only takes steps while the page is scrolling.
function Corridor() {
  const walker = useRef(null)
  useEffect(() => {
    if (prefersStill()) return undefined
    let timer = 0
    const step = () => {
      walker.current?.classList.add('is-walking')
      window.clearTimeout(timer)
      timer = window.setTimeout(() => walker.current?.classList.remove('is-walking'), 160)
    }
    window.addEventListener('scroll', step, { passive: true })
    return () => {
      window.removeEventListener('scroll', step)
      window.clearTimeout(timer)
    }
  }, [])
  return (
    <div aria-hidden="true" className="peri-corridor relative">
      <div className="sticky top-[44vh] flex justify-center pt-6">
        <div ref={walker} className="peri-walker relative">
          <span className="absolute -bottom-1 left-1/2 h-2 w-[80%] -translate-x-1/2 rounded-[50%] bg-black/50 blur-[2px]" />
          <img src={periArmadura} alt="" className="relative h-[46px] w-auto sm:h-[86px]" />
        </div>
      </div>
    </div>
  )
}

// The dashboard under the windshield, seen from above: little screens,
// rows of buttons, two sticks and some sliders. Decoration only.
function Console() {
  const buttons = [C.red, C.gold, C.cyan, '#8ef0c4', C.cyan, C.red, C.gold, '#8ef0c4', C.gold, C.cyan, C.red, C.cyan]
  return (
    <div aria-hidden="true" className="relative mx-auto -mt-2 flex h-[70px] max-w-[94%] items-center justify-between gap-4 rounded-b-[30px] rounded-t-[8px] border-[3px] px-4 sm:h-[92px] sm:px-8" style={{ background: 'linear-gradient(#1e2737, #131a26)', borderColor: '#2e384a' }}>
      <svg viewBox="0 0 90 46" className="h-[38px] shrink-0 rounded-[6px] sm:h-[50px]" style={{ background: '#06101f', border: `1px solid ${C.cyan}55` }}>
        <path d="M4 30 L14 22 L22 28 L32 12 L42 24 L52 18 L62 26 L72 10 L86 20" fill="none" stroke={C.cyan} strokeWidth="2" />
      </svg>
      <div className="hidden grid-cols-6 gap-1.5 sm:grid">
        {buttons.map((b, i) => <span key={i} className="size-3.5 rounded-[4px]" style={{ background: b, boxShadow: `0 0 6px ${b}99`, opacity: i % 3 ? 0.85 : 1 }} />)}
      </div>
      <div className="flex gap-4">
        {[0, 1].map((i) => <span key={i} className="grid size-9 place-items-center rounded-full border-[3px] sm:size-12" style={{ borderColor: '#3a4457', background: '#0c121c' }}><span className="size-3.5 rounded-full sm:size-5" style={{ background: i ? C.red : C.gold }} /></span>)}
      </div>
      <div className="hidden gap-3 md:flex">
        {[0.3, 0.7, 0.5].map((v, i) => <span key={i} className="relative h-12 w-1.5 rounded-full" style={{ background: '#0c121c' }}><span className="absolute left-1/2 h-2.5 w-5 -translate-x-1/2 rounded-sm" style={{ top: `${v * 100}%`, background: '#8a96ab' }} /></span>)}
      </div>
      <span className="relative size-[38px] shrink-0 overflow-hidden rounded-full sm:size-[52px]" style={{ background: '#06101f', border: `1px solid ${C.cyan}66` }}>
        <span className="absolute inset-0 rounded-full motion-safe:animate-[peri-spin_3s_linear_infinite]" style={{ background: `conic-gradient(from 0deg, ${C.cyan}88, transparent 25%)` }} />
        <span className="absolute left-[60%] top-[30%] size-1.5 rounded-full" style={{ background: C.gold }} />
      </span>
    </div>
  )
}

// The bridge, in the nose: the flight route shows on the windshield, with the
// dashboard below and the boarding pass left on top of it.
function Cockpit() {
  return (
    <section id="bitacora" data-hud="Puente de mando" aria-labelledby="bitacora-titulo" className="peri-bridge relative px-3 pb-12 pt-4 sm:px-10 sm:pt-6" style={FLOORS.carpet}>
      <span aria-hidden="true" className="peri-hatch-h" />
      <div className="peri-windshield relative px-3 pb-6 sm:px-10">
        <div aria-hidden="true" className="absolute inset-0 rounded-[inherit] opacity-70" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.85) 1px, transparent 1.6px), radial-gradient(rgba(169,236,255,.6) 1px, transparent 1.6px)', backgroundSize: '80px 80px, 130px 130px', backgroundPosition: '0 0, 40px 60px' }} />
        <div aria-hidden="true" className="absolute inset-0 rounded-[inherit]" style={{ background: 'linear-gradient(115deg, transparent 28%, rgba(255,255,255,.05) 36%, transparent 44%)' }} />
        <div className="relative">
          <SectionHead id="bitacora-titulo" kicker="Sala 01 · Puente de mando" title="Bitácora de vuelo" center room>
            De Chiapas a Toronto hay {spaced(ROUTE.km)} km en línea recta. Baja y acompaña a Peri.
          </SectionHead>
          <div className="mt-8">
            <RouteMap map={MAPS.wide} />
            <RouteMap map={MAPS.tall} />
          </div>
        </div>
      </div>
      <Console />
      <div className="relative z-10 -rotate-1 sm:px-6"><BoardingPass /></div>
    </section>
  )
}

// The reactor: a glowing hexagon like the one on Peri's chest, with two rings
// turning round it. The glow and the rings are separate layers, so they move
// without repainting the hexagon.
function Reactor({ className = '' }) {
  const hex = (r) => Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2
    return `${(120 + r * Math.cos(a)).toFixed(1)},${(120 + r * Math.sin(a)).toFixed(1)}`
  }).join(' ')
  const layer = 'absolute inset-0 h-full w-full'
  return (
    <div aria-hidden="true" className={`relative aspect-square ${className}`}>
      <div className={`${layer} rounded-full opacity-30 motion-safe:animate-[peri-pulse_2.6s_ease-in-out_infinite]`} style={{ background: `radial-gradient(closest-side, #ffffff, #bff1ff 30%, ${C.cyan}00)` }} />
      <svg viewBox="0 0 240 240" fill="none" stroke={C.cyan} className={`${layer} motion-safe:animate-[peri-spin_14s_linear_infinite]`}>
        <circle cx="120" cy="120" r="104" strokeWidth="3" strokeDasharray="38 12 6 12" strokeOpacity=".8" />
      </svg>
      <svg viewBox="0 0 240 240" fill="none" stroke={C.cyan} className={`${layer} motion-safe:animate-[peri-spin_9s_linear_infinite_reverse]`}>
        <circle cx="120" cy="120" r="88" strokeWidth="8" strokeDasharray="3 9" strokeOpacity=".45" />
      </svg>
      <svg viewBox="0 0 240 240" className={layer}>
        <circle cx="120" cy="120" r="44" fill={C.cyan} fillOpacity=".25" />
        <polygon points={hex(66)} fill="#0b1b30" stroke={C.gold} strokeWidth="6" strokeLinejoin="round" />
        <polygon points={hex(48)} fill="none" stroke={C.gold} strokeOpacity=".45" strokeWidth="2" />
        <polygon points={hex(36)} fill={C.cyan} fillOpacity=".35" />
        <polygon points={hex(32)} fill="#eafcff" />
        <text x="120" y="131" textAnchor="middle" fontSize="30" fontWeight="700" fill={C.ink} style={{ fontFamily: "'Chakra Petch', sans-serif" }}>π</text>
      </svg>
    </div>
  )
}

function EngineRoom() {
  return (
    <Room id="maquinas" hud="Sala de máquinas" labelledBy="maquinas-titulo" floor="grate" number="04" stencil="Máquinas">
      <SectionHead id="maquinas-titulo" kicker="Sala 04 · Tecnologías" title="Sala de máquinas" room>
        Aquí están los lenguajes y herramientas con los que construyo, lo que hace funcionar la nave.
      </SectionHead>
      <div className="mt-10 grid items-center gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <div className="text-center">
          <Reactor className="mx-auto w-[190px] lg:w-full" />
          <p className="peri-mono mt-3 text-[11px]" style={{ color: C.cyan }}>Reactor Mk-π · <span style={{ color: C.gold }}>estable</span></p>
        </div>
        <div className="relative grid items-start gap-5 md:grid-cols-3">
          <span aria-hidden="true" className="absolute -left-10 top-1/2 hidden h-[4px] w-10 lg:block" style={{ background: `linear-gradient(90deg, ${C.cyan}, ${C.cyan}33)` }} />
          {ENGINE.map((m) => (
            <div key={m.name} className="relative overflow-hidden rounded-[26px] border-2 px-4 pb-8 pt-5" style={{ borderColor: `${C.cyan}55`, background: `linear-gradient(transparent 50%, ${C.cyan}1f)` }}>
              <span aria-hidden="true" className="absolute left-1/2 top-0 h-2 w-16 -translate-x-1/2 rounded-b-md" style={{ background: '#3a4457' }} />
              <h3 className="peri-mono text-[11px]" style={{ color: C.gold }}>{m.name}</h3>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {m.items.map((item) => (
                  <li key={item} className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[13px] font-semibold" style={{ borderColor: `${C.cyan}44`, background: '#0b1422', color: C.ice }}>
                    <span aria-hidden="true" className="size-1.5 rounded-full" style={{ background: C.cyan, boxShadow: `0 0 6px ${C.cyan}` }} />{item}
                  </li>
                ))}
              </ul>
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-3 motion-safe:animate-[peri-pulse_2.6s_ease-in-out_infinite]" style={{ background: `${C.cyan}33` }} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10 border-t pt-6" style={{ borderColor: `${C.cyan}22` }}>
        <h3 className="peri-mono text-[11px]" style={{ color: C.muted }}>Manual de operación</h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {CONCEPTS.map((c) => <li key={c} className="peri-cut border px-3 py-1.5 text-[13px] font-semibold" style={{ borderColor: `${C.gold}55`, color: C.text, background: `${C.gold}0d` }}>{c}</li>)}
        </ul>
      </div>
    </Room>
  )
}

// The two engines under the tail, firing.
function Thrusters() {
  return (
    <div aria-hidden="true" className="mx-auto flex w-[56%] max-w-[560px] justify-between">
      {[0, 1].map((i) => (
        <div key={i} className="flex w-[34%] flex-col items-center">
          <div className="h-6 w-full sm:h-9" style={{ background: 'linear-gradient(#3a4457, #1a2030)', clipPath: 'polygon(0 0, 100% 0, 86% 100%, 14% 100%)' }} />
          <div className="h-20 w-[70%] origin-top sm:h-28 motion-safe:animate-[peri-thrust_.16s_steps(2)_infinite]" style={{ background: `radial-gradient(ellipse 50% 100% at 50% 0%, #f2fdff, ${C.cyan} 38%, transparent 72%)` }} />
        </div>
      ))}
    </div>
  )
}

function Ship() {
  return (
    <div className="relative px-2 sm:px-6">
      <p className="peri-mono text-center text-[12px]" style={{ color: C.gold }}>// A bordo del Peri-Jet</p>
      <div className="relative mx-auto mt-6 max-w-[1240px]">
        <span aria-hidden="true" className="peri-rivets -left-2 hidden sm:block" />
        <span aria-hidden="true" className="peri-rivets -right-2 hidden sm:block" />
        <div className="peri-hull">
          <Cockpit />
          <div className="grid grid-cols-[48px_minmax(0,1fr)] sm:grid-cols-[110px_minmax(0,1fr)]">
            <Corridor />
            <div className="min-w-0">
              <Training />
              <Cargo />
              <EngineRoom />
            </div>
          </div>
        </div>
      </div>
      <Thrusters />
    </div>
  )
}

function Album() {
  return (
    <section id="archivos" data-hud="Archivos" aria-labelledby="archivos-titulo" className="mx-auto max-w-[1180px] px-5 sm:px-8">
      <SectionHead id="archivos-titulo" kicker="Registro visual" title="Archivos" center />
      <div className="mx-auto mt-12 grid max-w-[340px] gap-6 sm:max-w-[1000px] sm:grid-cols-3">
        {ALBUM.map((a) => (
          <figure key={a.code} className="group">
            <div className="peri-panel relative aspect-[4/5] overflow-hidden">
              {a.src
                ? <img src={a.src} alt={a.alt} loading="lazy" className="h-full w-full object-cover saturate-[.85] transition duration-500 group-hover:saturate-100" style={{ objectPosition: a.pos ?? 'center' }} />
                : (
                  <div className="grid h-full place-items-center p-4 text-center">
                    <p className="peri-mono text-[11px] leading-5" style={{ color: C.muted }}>
                      <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" stroke={C.cyan} strokeWidth="2" className="mx-auto mb-2 h-8 w-8"><rect x="4" y="9" width="24" height="17" rx="3" /><path d="M11 9 L13 5 H19 L21 9" /><circle cx="16" cy="17" r="5" /></svg>
                      {a.hint}
                    </p>
                  </div>
                )}
              <div aria-hidden="true" className="peri-scanlines pointer-events-none absolute inset-0 transition-opacity duration-500 group-hover:opacity-0" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 mix-blend-screen transition-opacity duration-500 group-hover:opacity-0" style={{ background: `linear-gradient(transparent 40%, ${C.cyan}33)` }} />
              <span aria-hidden="true" className="peri-mono absolute left-2 top-2 px-1.5 py-0.5 text-[10px]" style={{ background: `${C.void}cc`, color: C.cyan }}>{a.code}</span>
            </div>
            <figcaption className="peri-mono mt-2.5 text-[11px] leading-5" style={{ color: a.src ? C.ice : C.muted }}>{a.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

function Sky() {
  return (
    <footer data-hud="Transmisión" className="relative mt-24 overflow-hidden" style={{ background: 'linear-gradient(transparent, #0a1538 45%, #1b1652)' }}>
      <div aria-hidden="true" className="absolute inset-0 opacity-70" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.9) 1px, transparent 1.6px), radial-gradient(rgba(169,236,255,.7) 1px, transparent 1.6px), radial-gradient(rgba(255,214,140,.6) 1.2px, transparent 2px)', backgroundSize: '90px 90px, 140px 140px, 230px 230px', backgroundPosition: '0 0, 45px 70px, 120px 30px', maskImage: 'linear-gradient(transparent, black 35%)', WebkitMaskImage: 'linear-gradient(transparent, black 35%)' }} />
      {/* the edge of the planet */}
      <div aria-hidden="true" className="absolute left-1/2 aspect-square w-[max(180%,1400px)] -translate-x-1/2 rounded-full" style={{ top: 'calc(100% - 120px)', background: '#070d22', boxShadow: `0 0 0 2px ${C.cyan}66, 0 -12px 90px 10px ${C.cyan}40` }} />
      <div className="relative mx-auto grid max-w-[1180px] items-center gap-10 px-5 pb-40 pt-28 sm:px-8 md:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <Kicker color={C.gold}>Fin de la transmisión</Kicker>
          <p className="peri-display peri-glow mt-3 text-[clamp(44px,7vw,84px)] font-bold uppercase leading-[.9]" style={{ color: C.ice }}>Nos vemos<br />allá arriba</p>
          <p className="mt-5 max-w-[460px] text-[17px] leading-7" style={{ color: C.text }}>¿Te preparas para la olimpiada? Entrena gratis con nosotros en TeacherPeri, con teoría, problemas y rutas de estudio.</p>
          <nav aria-label="Enlaces" className="mt-8 flex flex-wrap gap-3">
            {LINKS.map((l) => {
              const cls = `peri-cut peri-display px-5 py-2.5 text-[14px] font-bold uppercase tracking-[.08em] transition-transform hover:-translate-y-0.5 ${l.primary ? '' : 'border'}`
              const style = l.primary ? { background: C.gold, color: C.ink } : { borderColor: `${C.cyan}88`, color: C.ice }
              if (l.href) return <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className={cls} style={style}>{l.label} ↗</a>
              return <Link key={l.to} to={l.to} className={cls} style={style}>{l.label}</Link>
            })}
          </nav>
        </div>
        <img src={periVolando} alt="" loading="lazy" className="mx-auto w-[180px] drop-shadow-[0_0_30px_rgba(95,216,255,.35)] motion-safe:animate-[peri-float_5s_ease-in-out_infinite] md:w-[260px]" />
      </div>
      <p className="peri-mono relative pb-6 text-center text-[11px]" style={{ color: `${C.cyan}99` }}>PERI·OS v4.0 · TeacherPeri</p>
    </footer>
  )
}

// Back to the top: Peri takes off.
function BackToTop() {
  const [launch, setLaunch] = useState(false)
  const go = (e) => {
    if (prefersStill()) return
    e.preventDefault()
    setLaunch(true)
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300)
    window.setTimeout(() => setLaunch(false), 1500)
  }
  return (
    <a href="#arriba" onClick={go} className="group fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full border lg:right-14" style={{ borderColor: `${C.cyan}88`, background: `${C.void}dd`, boxShadow: `0 0 18px ${C.cyan}33` }}>
      <img src={periVolando} alt="" className={`h-12 w-auto -rotate-[38deg] transition-all duration-700 ${launch ? '-translate-y-[70vh] opacity-0' : 'group-hover:-translate-y-1'}`} />
      <span className="sr-only">Volver arriba</span>
    </a>
  )
}

// ---------- Page ----------

export default function EliasPage() {
  usePageMeta({ title: 'Elías Perianza | TeacherPeri', fullTitle: true, description: '¡Hola! Soy Elías, de Chiapas. Estudio Computación en la Universidad de Toronto, gané plata en la OMM y hago TeacherPeri con Catherine. Pásale a mi taller.' })
  return (
    <div id="arriba" className="peri-page relative min-h-screen overflow-x-clip" style={{ fontFamily: "'Exo 2', 'Nunito', sans-serif", backgroundColor: C.void, backgroundImage: `linear-gradient(${C.cyan}09 1px, transparent 1px), linear-gradient(90deg, ${C.cyan}09 1px, transparent 1px)`, backgroundSize: '56px 56px', color: C.text }}>
      <link rel="stylesheet" precedence="default" href={FONTS} />
      <style>{`
        @keyframes peri-float { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-12px) } }
        @keyframes peri-spin { to { transform: rotate(360deg) } }
        @keyframes peri-type { from { width: 0 } }
        @keyframes peri-caret { 50% { opacity: 0 } }
        @keyframes peri-pulse { 0%, 100% { opacity: 1 } 50% { opacity: .3 } }
        @keyframes peri-scan { 0% { top: 2%; opacity: 0 } 10%, 90% { opacity: 1 } 100% { top: 80%; opacity: 0 } }
        @keyframes peri-flicker { 0%, 100% { transform: scaleX(1) } 50% { transform: scaleX(.86) } }
        @keyframes peri-flow { 0% { transform: translateY(0); opacity: 0 } 15%, 80% { opacity: 1 } 100% { transform: translateY(100px); opacity: 0 } }
        @keyframes peri-glitch { 0%, 90%, 100% { opacity: 1 } 91% { opacity: .45 } 92% { opacity: 1 } 94% { opacity: .65 } 95% { opacity: 1 } }

        html:has(.peri-page) { scroll-behavior: smooth; background: ${C.void} }
        .peri-more > summary::-webkit-details-marker { display: none }
        .peri-page ::selection { background: ${C.cyan}; color: ${C.void} }
        .peri-display { font-family: 'Chakra Petch', 'Exo 2', sans-serif }
        .peri-mono { font-family: 'Share Tech Mono', ui-monospace, monospace; letter-spacing: .16em; text-transform: uppercase }
        .peri-glow { text-shadow: 0 0 24px rgba(95,216,255,.5), 0 0 3px rgba(220,248,255,.6) }
        .peri-cut { clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px) }
        .peri-hazard { background: repeating-linear-gradient(-45deg, ${C.gold} 0 12px, ${C.ink} 12px 24px) }
        .peri-scanlines { background-image: repeating-linear-gradient(0deg, rgba(95,216,255,.07) 0 1px, transparent 1px 4px) }
        .peri-panel {
          position: relative;
          background: linear-gradient(160deg, rgba(16,40,68,.6), rgba(6,16,30,.72));
          border: 1px solid rgba(95,216,255,.22);
          box-shadow: inset 0 0 40px rgba(95,216,255,.05), 0 24px 60px -30px rgba(0,0,0,.9);
        }
        /* corner brackets */
        .peri-panel::before {
          content: ''; position: absolute; inset: -1px; pointer-events: none; z-index: 1;
          --c: ${C.cyan};
          background:
            linear-gradient(var(--c), var(--c)) top left / 18px 2px no-repeat,
            linear-gradient(var(--c), var(--c)) top left / 2px 18px no-repeat,
            linear-gradient(var(--c), var(--c)) top right / 18px 2px no-repeat,
            linear-gradient(var(--c), var(--c)) top right / 2px 18px no-repeat,
            linear-gradient(var(--c), var(--c)) bottom left / 18px 2px no-repeat,
            linear-gradient(var(--c), var(--c)) bottom left / 2px 18px no-repeat,
            linear-gradient(var(--c), var(--c)) bottom right / 18px 2px no-repeat,
            linear-gradient(var(--c), var(--c)) bottom right / 2px 18px no-repeat;
        }
        .peri-redacted {
          display: inline-block; height: .95em; vertical-align: -.12em; border-radius: 2px; max-width: 100%;
          background: repeating-linear-gradient(-45deg, rgba(95,216,255,.24) 0 5px, rgba(95,216,255,.07) 5px 10px);
          box-shadow: inset 0 0 0 1px rgba(95,216,255,.28);
        }
        .peri-type { display: inline-block; overflow: hidden; white-space: nowrap; width: calc(var(--n) * 1ch); animation: peri-type calc(var(--n) * 28ms) steps(var(--n)) both }

        /* Training: lines that draw themselves, points and penguins that light up once on screen. */
        @keyframes peri-draw { to { stroke-dashoffset: 0 } }
        @keyframes peri-pop { from { opacity: 0; transform: scale(.5) } to { opacity: 1; transform: none } }
        @keyframes peri-ping { 0% { transform: scale(.6); opacity: .9 } 100% { transform: scale(2.6); opacity: 0 } }
        .peri-draw { stroke-dasharray: 1; stroke-dashoffset: 1 }
        .is-on .peri-draw { animation: peri-draw 1.4s ease-out forwards; animation-delay: var(--dl, 0s) }
        .peri-pop { opacity: 0; transform-box: fill-box; transform-origin: center }
        .is-on .peri-pop { animation: peri-pop .5s ease-out forwards; animation-delay: var(--dl, 0s) }
        .peri-cadet { opacity: .14; transition: opacity .3s ease-out; transition-delay: calc(var(--sd, 0s) + var(--i) * 12ms) }
        .is-on .peri-cadet { opacity: 1 }

        /* Flight log: the gold route fills in up to where Peri is. */
        .peri-route { stroke-dasharray: 1; stroke-dashoffset: calc(1 - var(--p, 0)) }
        .peri-landed { opacity: clamp(.25, calc((var(--p, 0) - .95) * 20), 1) }
        .peri-ping { transform-box: fill-box; transform-origin: center; animation: peri-ping 2.2s ease-out infinite }

        /* Inside the ship: hull, rooms, doors, the corridor and Peri walking. */
        @keyframes peri-walk { 0%, 100% { transform: translateY(0) rotate(-5deg) } 50% { transform: translateY(-5px) rotate(5deg) } }
        @keyframes peri-thrust { 0%, 100% { transform: scaleY(1) } 50% { transform: scaleY(.84) } }
        .peri-hull {
          position: relative; background: #0f1520;
          border: 10px solid #283041; border-radius: 50% 50% 32px 32px / 120px 120px 32px 32px;
          box-shadow: 0 0 0 2px #151b26, 0 40px 120px -40px rgba(95,216,255,.35);
        }
        .peri-rivets {
          position: absolute; top: 300px; bottom: 80px; width: 34px; z-index: 5; pointer-events: none;
          background:
            radial-gradient(circle at 17px 40px, #0b1735 0 9px, #5fd8ff 9px 10.5px, #3a4457 10.5px 15px, transparent 15.5px) 0 0 / 34px 380px repeat-y,
            radial-gradient(circle at 17px 6px, #4d586c 0 2px, transparent 2.6px) 0 0 / 34px 26px repeat-y;
        }
        .peri-windshield {
          border: 8px solid #1a212e; padding-top: 64px;
          border-radius: 50% 50% 22px 22px / 110px 110px 22px 22px;
          background: radial-gradient(ellipse at 50% 0%, #0d1d40, #050a16 70%);
          box-shadow: inset 0 0 60px rgba(95,216,255,.12);
        }
        @media (min-width: 640px) {
          .peri-hull { border-width: 18px; border-radius: 50% 50% 64px 64px / 260px 260px 64px 64px }
          .peri-windshield { border-width: 12px; padding-top: 120px; border-radius: 50% 50% 26px 26px / 230px 230px 26px 26px }
          .peri-bridge { border-radius: 50% 50% 0 0 / 242px 242px 0 0 }
          .peri-corridor { border-bottom-left-radius: 46px }
          #maquinas { border-bottom-right-radius: 46px }
        }
        .peri-bridge { border-bottom: 10px solid #222a39; border-radius: 50% 50% 0 0 / 110px 110px 0 0 }
        .peri-corridor { border-bottom-left-radius: 22px }
        #maquinas { border-bottom-right-radius: 22px }
        .peri-room { border: 10px solid #222a39; margin-top: -10px; box-shadow: inset 0 0 0 1px #323c4f, inset 0 26px 50px -30px rgba(0,0,0,.7) }
        .peri-room + .peri-room { margin-top: -10px }
        /* doors: a gap in the wall with gold jambs */
        .peri-hatch { position: absolute; left: -10px; top: 72px; width: 10px; height: 128px; background: #0f1520; z-index: 2 }
        .peri-hatch::before, .peri-hatch::after { content: ''; position: absolute; left: -5px; width: 20px; height: 6px; border-radius: 2px; background: ${C.gold} }
        .peri-hatch::before { top: -6px }
        .peri-hatch::after { bottom: -6px }
        .peri-hatch-h { position: absolute; bottom: -10px; left: 8px; width: 32px; height: 10px; background: #0f1520; z-index: 2 }
        .peri-hatch-h::before, .peri-hatch-h::after { content: ''; position: absolute; top: -5px; width: 6px; height: 20px; border-radius: 2px; background: ${C.gold} }
        .peri-hatch-h::before { left: -6px }
        .peri-hatch-h::after { right: -6px }
        @media (min-width: 640px) { .peri-hatch-h { left: 22px; width: 66px } }
        .peri-stencil {
          display: none; position: absolute; right: 18px; top: 50%; translate: 0 -50%; writing-mode: vertical-rl;
          font-family: 'Chakra Petch', sans-serif; font-weight: 700; text-transform: uppercase; letter-spacing: .06em;
          font-size: 76px; line-height: 1; color: transparent; -webkit-text-stroke: 2px rgba(255,182,39,.16); pointer-events: none;
        }
        @media (min-width: 1024px) { .peri-stencil { display: block } }
        .peri-corridor {
          background:
            radial-gradient(circle, ${C.cyan} 0 2px, transparent 3px) 6px 20px / 12px 90px repeat-y,
            radial-gradient(circle, ${C.cyan} 0 2px, transparent 3px) calc(100% - 6px) 20px / 12px 90px repeat-y,
            repeating-linear-gradient(180deg, rgba(255,182,39,.5) 0 22px, transparent 22px 60px) 50% 0 / 3px 100% no-repeat,
            #0f1520;
        }
        .peri-walker img { transform-origin: 50% 92% }
        .peri-walker.is-walking img { animation: peri-walk .42s ease-in-out infinite }

        /* Assembly: the armour is built over its blueprint from the feet up. */
        .peri-rig { --h: 40svh; height: var(--h); width: calc(var(--h) * .4933) }
        @media (min-width: 768px) { .peri-rig { --h: min(66svh, 600px) } }
        .peri-assembly { --a: clamp(0, calc((var(--p) - .06) / .78), 1); --done: clamp(0, calc((var(--p) - .86) * 12), 1) }
        .peri-assembly .peri-armour { clip-path: inset(calc((1 - var(--a)) * 100%) -20% 0 -20%) }
        .peri-assembly .peri-blueprint { opacity: calc(1 - var(--done) * .9) }
        .peri-assembly .peri-head { top: calc((1 - var(--a)) * 100%); opacity: calc((1 - var(--done)) * clamp(0, calc(var(--a) * 40), 1)) }
        .peri-sys-ok { opacity: clamp(0, calc((var(--a) - var(--t)) * 60), 1) }
        .peri-sys-wait { opacity: calc(1 - clamp(0, calc((var(--a) - var(--t)) * 60), 1)) }
        .peri-ready { opacity: var(--done); scale: calc(1.2 - var(--done) * .2) }

        /* Hangar: the jet's bricks fly into place, the door opens, it takes off. */
        .peri-part {
          transform-box: fill-box; transform-origin: center;
          --b: clamp(0, calc((var(--p) - var(--d)) * 3.2), 1);
          transform: translate(calc(var(--dx) * (1 - var(--b))), calc(var(--dy) * (1 - var(--b)))) rotate(calc(var(--r) * (1 - var(--b))));
          opacity: calc(.1 + var(--b) * .9);
        }
        .peri-hangar { --door: clamp(0, calc((var(--p) - .55) * 12), 1); --f: clamp(0, calc((var(--p) - .62) * 2.7), 1) }
        .peri-jet { transform: translate(calc(var(--f) * 80vw), calc(var(--f) * -40vh)) rotate(calc(var(--f) * -9deg)) }
        .peri-flame-on { transform-box: fill-box; transform-origin: 100% 50%; transform: scaleX(calc(.35 + var(--f) * 1.1)); opacity: var(--door) }
        .peri-door { transform: translateY(calc(var(--door) * -100%)) }
        .peri-escort { opacity: clamp(0, calc((var(--p) - .63) * 10), 1); transform: translate(calc(var(--f) * 75vw), calc(var(--f) * -58vh)) }
        .peri-s1 { opacity: calc(1 - clamp(0, calc((var(--p) - .55) * 60), 1)) }
        .peri-s2 { opacity: calc(clamp(0, calc((var(--p) - .55) * 60), 1) - clamp(0, calc((var(--p) - .62) * 60), 1)) }
        .peri-s3 { opacity: clamp(0, calc((var(--p) - .62) * 60), 1) }
        .peri-s23 { opacity: clamp(0, calc((var(--p) - .55) * 60), 1) }

        @media (prefers-reduced-motion: reduce) {
          html:has(.peri-page) { scroll-behavior: auto }
          .peri-page *, .peri-page *::before, .peri-page *::after { animation: none !important; transition: none !important }
          .peri-stage-wrap { height: auto }
          .peri-stage { position: relative; height: auto; min-height: 100svh; padding-block: 64px }
          .peri-draw { stroke-dashoffset: 0 }
          .peri-pop, .peri-cadet { opacity: 1 }
        }
      `}</style>

      <Hud />
      <Hero />
      <Conduit to="estado actual" />
      <main>
        <Now />
        <Conduit to="ensamblaje" />
        <Assembly />
        <Conduit to="expediente" />
        <Dossier />
        <Conduit to="misiones" />
        <Missions />
        <Conduit to="hangar" />
        <Hangar />
        <Conduit to="la nave" />
        <Ship />
        <Conduit to="archivos" />
        <Album />
      </main>
      <Sky />
      <BackToTop />
    </div>
  )
}
