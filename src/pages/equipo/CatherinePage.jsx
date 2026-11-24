import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CathCat from '../../components/decor/CathCat'
import Mascot from '../../components/decor/Mascot'
import { usePageMeta } from '../../hooks/usePageMeta'
import fotoPortada from '../../assets/equipo/portada.webp'
import fotoPremiacionOmm from '../../assets/equipo/premiacion-omm.webp'
import fotoOroFemenil from '../../assets/equipo/oro-femenil.webp'
import fotoPrimerNacional from '../../assets/equipo/primer-nacional.webp'
import fotoAmigos from '../../assets/equipo/amigos.webp'
import fotoStaffOmm from '../../assets/equipo/staff-omm.webp'
import fotoAxioma from '../../assets/equipo/axioma.webp'
import fotoStella from '../../assets/equipo/stella.webp'
import fotoHackathons from '../../assets/equipo/hackathons.webp'
import fotoClases from '../../assets/equipo/clases.webp'
import fotoFueraDeMate from '../../assets/equipo/fuera-de-mate.webp'
import fotoDiscurso from '../../assets/equipo/discurso.webp'
import borregaBolita from '../../assets/equipo/borrega-bolita.webp'

// Catherine's own page (TeacherCath), linked from Equipo and opened in its own
// tab, without the site menu. Everything on it lives in this file, so changes
// here don't touch anyone else's page.
//
// Its own look, not TeacherPeri's: a sticker-book / journal style. A candy
// palette, a moving ribbon of stars, the olympiads as little retro computer
// windows, an album of taped polaroids on a pink locker, bead letters, grid
// paper, stripes, scalloped edges and an arch with curved text.
//
// Photos: each <PhotoSpot> / <Polaroid> without `src` is an empty frame that
// says which photo goes there. To add one, put the image in
// src/assets/equipo/, import it and pass it as `src`.

const C = {
  blue: '#2f78bd',
  sky: '#a9d6f5',
  cream: '#fdf4e3',
  green: '#86cf68',
  pink: '#f7b2cf',
  hot: '#c8316f',
  yellow: '#f6c945',
  navy: '#1e2b5c',
  pinkOnBlue: '#ffd6e7',
  yellowOnBlue: '#ffe07a',
  lilac: '#b99cf0',
  lilacSoft: '#e9defd',
  teal: '#79c7bd',
  tealSoft: '#cdeeea',
  locker: '#f07aa9',
  periwinkle: '#aab7ee',
}
const ROUND = { fontFamily: "'Fredoka', 'Nunito', sans-serif" }
const SCRIPT = { fontFamily: "'Yellowtail', cursive" }
const BODY = { fontFamily: "'Nunito', sans-serif" }
const PIXEL = { fontFamily: "'Fredoka', 'Nunito', sans-serif", fontWeight: 600, letterSpacing: '0.06em' }
const FONTS = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&family=Yellowtail&display=swap'

const STAR_COLORS = [C.hot, C.yellow, C.teal, C.lilac, C.blue, '#f39a3d', C.green, C.pink]

// ---------- Content ----------

// What I'm up to right now, a short strip under the hero.
const NOW = [
  ['sparkle', 'Haciendo TeacherPeri con Elías'],
  ['laptop', 'Programando Stella, nuestro videojuego'],
  ['sigma', 'Directora de Investigación en Axioma'],
  ['book', 'Preparando alumnos en Aula Gandhi'],
  ['cap', 'Verano 2027: practicante en Duolingo'],
]

const OLYMPIADS = [
  {
    file: 'OMM.exe',
    title: 'OMM',
    full: 'Olimpiada Mexicana de Matemáticas',
    about: 'La olimpiada nacional de prepa, de donde se selecciona a quienes representan a México en competencias internacionales.',
    medals: [['bronze', 'Bronce · 38.ª OMM (2024)'], ['mention', 'Mención honorífica · 35.ª OMM (2021)'], ['mention', 'Mención honorífica · 37.ª OMM (2023)']],
    extra: 'En 2026 regresé a la OMM, pero esta vez como parte del equipo organizador de la 40.ª edición en Monterrey. ¡Fue muy bonito vivirla desde el otro lado!',
    bar: C.blue,
  },
  {
    file: 'OMMEB.exe',
    title: 'OMMEB',
    full: 'Olimpiada Mexicana de Matemáticas para Educación Básica',
    about: 'Aquí fue donde comenzaron mis viajes a los nacionales, cuando todavía estaba en primaria.',
    medals: [['silver', 'Plata · IV OMMEB (2021)'], ['bronze', 'Bronce · II OMMEB (2018)'], ['mention', 'Mención honorífica · III OMMEB (2020)']],
    bar: C.green,
  },
  {
    file: 'OMMFEM.exe',
    title: 'OMMFEM',
    full: 'Concurso Nacional Femenil de la Olimpiada Mexicana de Matemáticas',
    about: '¡Mi favorita! Aquí conseguí mi primera medalla de oro nacional.',
    medals: [['gold', 'Oro · II OMMFEM (2023)'], ['silver', 'Plata · I OMMFEM (2022)'], ['silver', 'Plata · IV OMMFEM (2025)'], ['bronze', 'Bronce · III OMMFEM (2024)']],
    extra: 'También fui preseleccionada para la PAGMO 2023, la Olimpiada Panamericana de Matemáticas para Niñas.',
    bar: C.hot,
  },
]

// Smaller than the three above. ONMAPS goes first and spans two columns.
const OTHER_OLYMPIADS = [
  {
    file: 'ONMAPS.exe', title: 'ONMAPS', bar: C.lilac, wide: true,
    full: 'Olimpiada Nacional de Matemáticas para Alumnos de Primaria y Secundaria',
    medals: [['silver', 'Plata · XIX ONMAPS (2019)'], ['silver', 'Plata · XXI ONMAPS (2021)'], ['bronze', 'Bronce · XVIII ONMAPS (2018)'], ['bronze', 'Bronce · XXII ONMAPS (2022)']],
  },
  {
    file: 'RRR.exe', title: 'R³', bar: C.blue,
    full: 'Olimpiada Nacional de Matemáticas «Roberto Ramírez Ramírez»',
    medals: [['silver', 'Plata · I edición (2023)'], ['silver', 'Plata · II edición (2024)']],
  },
  {
    file: 'GAUSS.exe', title: 'GAUSS', bar: C.teal,
    full: 'Concurso Nacional de Matemáticas GAU55',
    medals: [['bronze', 'Bronce · 2019, 2021, 2022 y 2024'], ['mention', 'Mención honorífica · III GAU55 (2020)']],
  },
  {
    file: 'CARMA.exe', title: 'CARMA', bar: C.hot,
    full: 'Olimpiada Femenil CARMA',
    medals: [['silver', 'Plata · VII edición (2020)']],
  },
  {
    file: 'MAYO.exe', title: 'Olimpiada de Mayo', bar: '#f39a3d',
    full: 'Competencia Juvenil Iberoamericana de Matemáticas',
    medals: [['globe', 'Mención honorífica internacional · XXVII edición (2021)']],
  },
]

const AWARDS = [
  {
    title: 'Beca Líderes del Mañana',
    year: '2025',
    text: 'Gracias a esta beca puedo estudiar en el Tec de Monterrey con el 100% de mi colegiatura cubierta. Reconoce tanto el desempeño académico como el compromiso social.',
    color: C.hot,
    soft: C.pink,
  },
  {
    title: 'Premio Estatal al Mérito Juvenil',
    year: '2023 · Logro Académico',
    text: 'Recibí este reconocimiento del Gobierno de Guerrero por mi trayectoria académica. Fui una de las 10 personas premiadas en todo el estado ese año.',
    color: C.blue,
    soft: C.sky,
  },
]

// Only what is not told elsewhere on the page (CODEX and the CBTis are in
// «escuela y prácticas», Axioma in «proyectos»).
const SMALL_AWARDS = [
  ['trophy', 'Olimpiada del Conocimiento Infantil · Primer lugar estatal en medio urbano (2019).'],
]

// School and internships, like little tickets.
const PATH = [
  { when: '2025–2029', where: 'Tec de Monterrey', color: C.blue, what: ['Estudio Ingeniería en Tecnologías Computacionales gracias a la beca Líderes del Mañana. También formo parte de CODEX, el programa de alto rendimiento académico de Computación.'] },
  { when: '2022–2025', where: 'CBTis No. 56', color: C.hot, what: ['Estudié la carrera técnica en Programación y me gradué con el mejor promedio de mi generación.'] },
  { when: 'Verano 2027', where: 'Duolingo, Pittsburgh', color: '#2f7d20', soon: true, what: ['¡Mi próxima aventura! Estaré en Pittsburgh como Software Engineering Thrive Intern en Duolingo. Serán 10 semanas aprendiendo y trabajando en un equipo de ingeniería. ¡Ya quiero que llegue el verano!'] },
  { when: 'Agosto 2025–actualidad', where: 'Tec de Monterrey', color: C.lilac, what: ['Trabajo como practicante de análisis de datos en LiFE, donde analizamos información de actividades e inscripciones de estudiantes de más de 30 campus del Tec.', 'Utilizo Python, Excel y herramientas como Looker Studio y Power BI para organizar datos, encontrar patrones y crear reportes que ayuden a tomar decisiones.'] },
  { when: 'Junio–julio 2026', where: 'Banco Plata', color: C.teal, what: ['Durante el verano fui practicante de análisis antifraude. Trabajé principalmente con SQL para analizar transacciones, disputas y contracargos, además de dar seguimiento a indicadores del equipo.', 'Fue mi primera experiencia en el sector financiero y aprendí muchísimo sobre cómo se utilizan los datos para identificar posibles fraudes.'] },
]

const VOICE = [
  ['wave', '2.º lugar nacional en el concurso de expresión literaria «La Juventud y la Mar» de la Secretaría de Marina (2021).'],
  ['flask', '2.º lugar estatal en el concurso de ensayo del Día Internacional de la Mujer y la Niña en la Ciencia (2022).'],
  ['book', '1.er lugar municipal en el concurso de Booktubers del Día del Libro (2020).'],
  ['flag', 'Oradora invitada en la ceremonia estatal del Día de la Bandera, encabezada por la Gobernadora de Guerrero (2022).'],
  ['chat', 'Panelista en «ConCiencia Inclusiva: Empoderando a Mujeres y Niñas en la Ciencia» (2024).'],
  ['mic', 'Participaciones y primeros lugares en concursos de poesía, declamación y eventos cívicos y culturales.'],
]

const ALBUM = [
  { src: fotoPrimerNacional, alt: 'Catherine de pequeña recibiendo su premio en su primer nacional', pos: '78% center', caption: 'mi primer nacional ♡', tilt: '-rotate-3', tape: C.pink },
  { src: fotoOroFemenil, alt: 'Catherine recibe su oro en el 2º Concurso Nacional Femenil', pos: 'center 60%', caption: '¡ese oro de 2023!', tilt: 'rotate-2', tape: C.yellow },
  { src: fotoAmigos, alt: 'Catherine con amigos al aire libre', pos: '70% center', caption: 'entre amigos', tilt: '-rotate-1', tape: C.teal },
  { src: fotoPremiacionOmm, alt: 'Catherine con su medalla en la premiación de la OMM', pos: 'center 30%', caption: 'ocho años de olimpiadas', tilt: 'rotate-3', tape: C.lilac },
  { src: fotoStaffOmm, alt: 'Catherine con el equipo organizador de la OMM 2026', pos: 'center 60%', caption: 'ahora del otro lado (2026)', tilt: '-rotate-2', tape: C.green },
]

const PROJECTS = [
  {
    name: 'TeacherPeri',
    tag: 'lo hago con Elías ♡',
    what: 'TeacherPeri es una plataforma gratuita que estamos creando para quienes quieren aprender matemáticas y prepararse para las olimpiadas. Estamos reuniendo teoría, problemas, rutas de estudio, exámenes y otras herramientas que nos hubiera gustado tener cuando empezamos.',
    me: 'Yo trabajo principalmente en el diseño y el frontend. Me gusta cuidar desde cómo se ve cada página hasta los pequeños detalles, como nuestras mascotas Peri y Cath, los avatares y las animaciones.',
    stack: ['React', 'Tailwind', 'Diseño'],
    link: { label: 'Ver TeacherPeri', to: '/' },
    image: { src: '/og-image.png', alt: 'Vista previa de TeacherPeri con Peri y Cath' },
    frame: C.blue,
  },
  {
    name: 'Axioma',
    tag: 'club de matemáticas del Tec',
    what: 'Como Directora de Investigación de Axioma, lideré el desarrollo de nuestra página web, donde reunimos más de 400 problemas de distintas olimpiadas, organizados por año, tema y dificultad para facilitar la práctica.',
    me: 'Trabajé con un equipo de tres personas y participé en la planeación, la estructura de la plataforma y el desarrollo del frontend, backend y la base de datos. También integramos soluciones en español, comentarios y herramientas para administrar el contenido.',
    stack: ['React', 'Express', 'MongoDB'],
    link: { label: 'Ver Axioma', href: 'https://axioma-five-brown.vercel.app/' },
    image: { src: fotoAxioma, alt: 'La página de Axioma' },
    frame: C.lilac,
  },
  {
    name: 'Stella',
    tag: 'en desarrollo con Elías ♡',
    what: 'Stella es un videojuego de aventura en pixel art que estamos haciendo Elías y yo, donde acompañas a una pequeña nutria espacial en un viaje lleno de acertijos y desafíos.',
    me: 'La idea es que niñas y niños de primaria y secundaria puedan desarrollar su lógica y aprender a resolver problemas mientras exploran distintos escenarios, superan niveles y avanzan en la historia, casi sin darse cuenta de que están aprendiendo. Porque las matemáticas son un lenguaje universal, y queremos que cualquiera pueda aprender a hablarlo jugando.',
    stack: ['Unity', 'C#', 'Pixel art'],
    image: { src: fotoStella, alt: 'Portada de Stella: la búsqueda de la piedra perfecta' },
    frame: C.teal,
  },
  {
    name: 'Competencias de programación y hackathons',
    tag: 'un poquito más de código ♡',
    what: 'Además de las olimpiadas de matemáticas, también me gusta participar en competencias de programación y hackathons.',
    list: [
      ['ICPC México 2025 · Finalista nacional', 'El ICPC es como la OMM, pero de programación y para universitarios. En 2025 clasifiqué junto con mi equipo a la Final Nacional, donde resolvimos problemas de programación y algoritmos contra reloj.'],
      ['Hack4Her 2026 · 1.er lugar', 'Junto con mi equipo desarrollamos una plataforma con IA para decidir qué pedidos convenía recuperar en una cadena de suministro.'],
      ['HackMTY 2026', 'Creamos una herramienta para detectar llamadas con voces generadas por inteligencia artificial.'],
      ['Coding Rush 2024 · Finalista', 'Una de mis primeras competencias de programación.'],
    ],
    stack: ['Python', 'C++', 'FastAPI', 'IA'],
    image: { src: fotoHackathons, alt: 'Catherine y su equipo programando en un hackathon' },
    frame: C.hot,
  },
]

const TEACHING = [
  {
    title: 'Aula Gandhi', note: 'donde empezó todo ♡',
    text: [
      'Aula Gandhi es la escuela que mi familia fundó en Guerrero en 2009. Prácticamente crecí ahí. Cuando era muy pequeña ayudaba enseñando letras y números, y a los ocho años ya daba clases de lectura, matemáticas e inglés.',
      'Con el tiempo empecé a preparar alumnos para distintas olimpiadas académicas, algo que sigo haciendo hasta hoy. Me gusta muchísimo ver cómo van avanzando, sobre todo cuando logran resolver algo que al principio les parecía muy difícil.',
      'He podido acompañar a alumnos desde sus primeros acercamientos a las matemáticas hasta competencias nacionales e internacionales, y eso es algo que me hace muy feliz.',
    ],
  },
  {
    title: 'Jóvenes Ayudando a Niñas y Niños A.C.', note: 'tutorías gratuitas',
    text: [
      'Participé como tutora voluntaria en un programa nacional de clases en línea, apoyando a estudiantes de secundaria y preparatoria con matemáticas.',
      'También colaboré en actividades de introducción a la inteligencia artificial.',
    ],
  },
  {
    title: 'Cursos de verano', note: 'Tepecoacuilco, Guerrero',
    text: [
      'He tenido la oportunidad de impartir talleres gratuitos para niñas, niños y adolescentes de mi municipio.',
      'En 2025 trabajamos con inteligencia artificial y en 2026 impartí «Aprende a aprender», un taller en el que usamos juegos, retos y videojuegos para explorar distintas formas de estudiar.',
    ],
  },
]

const MARQUEE = ['OMM', 'OMMEB', 'OMMFem', 'matemáticas', 'código', 'enseñar', 'TeacherPeri', 'Axioma', 'Stella', 'programación']

const LINKS = [
  { label: 'GitHub', href: 'https://github.com/catherinegd7', color: C.green, tilt: '-rotate-6' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/catherine-gonz%C3%A1lez-d%C3%ADaz-9a93a7281/', color: C.pink, tilt: 'rotate-3' },
  { label: 'TeacherPeri', href: '/', color: C.yellow, tilt: '-rotate-2' },
]

// ---------- Decorations ----------

function Cloud({ className = '' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 56" className={`absolute fill-white ${className}`}>
      <circle cx="32" cy="34" r="20" />
      <circle cx="58" cy="24" r="24" />
      <circle cx="86" cy="34" r="19" />
      <rect x="26" y="34" width="66" height="20" rx="10" />
    </svg>
  )
}

// A chunky hand-drawn star, like a sticker.
function Star({ color = C.yellow, className = '' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" className={className}>
      <path d="M20 3 L24.5 14.5 L37 15.5 L27.5 23.5 L30.5 36 L20 29 L9.5 36 L12.5 23.5 L3 15.5 L15.5 14.5 Z" fill={color} stroke={C.navy} strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  )
}

function StarRow({ className = '' }) {
  return (
    <div aria-hidden="true" className={`flex flex-wrap justify-center gap-3 ${className}`}>
      {Array.from({ length: 16 }, (_, i) => <Star key={i} color={STAR_COLORS[i % STAR_COLORS.length]} className={`h-7 w-7 ${i % 3 === 1 ? 'rotate-12' : i % 3 === 2 ? '-rotate-12' : ''}`} />)}
    </div>
  )
}

function Flower({ color, className = '' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" className={className}>
      {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="20" cy="10" rx="7" ry="10" fill={color} transform={`rotate(${a} 20 20)`} />)}
      <circle cx="20" cy="20" r="6" fill={C.yellow} />
    </svg>
  )
}

function Bow({ className = '' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 80 70" className={className}>
      <g fill={C.pink} stroke={C.hot} strokeWidth="3" strokeLinejoin="round">
        <path d="M40 24 C 26 6, 6 10, 10 26 C 13 38, 30 34, 40 28 Z" />
        <path d="M40 24 C 54 6, 74 10, 70 26 C 67 38, 50 34, 40 28 Z" />
        <path d="M36 30 L 24 66 L 32 62 L 38 68 L 40 32 Z" />
        <path d="M44 30 L 56 66 L 48 62 L 42 68 L 40 32 Z" />
        <circle cx="40" cy="27" r="6" />
      </g>
    </svg>
  )
}

// ---------- The ending: checkered paper with flowers, then a meadow ----------

const CHECKER = { background: `repeating-conic-gradient(#ebe4fb 0 25%, #fff8ec 0 50%) 0 0 / 112px 112px` }
const ORANGE = '#f5a524'

// A soft pink five-petal flower with a red dot in the middle (no outline).
function PetalFlower({ color = '#f7a8c4', className = '' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 60 60" className={className}>
      {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="30" cy="15" rx="10" ry="14" fill={color} transform={`rotate(${a} 30 30)`} />)}
      <circle cx="30" cy="30" r="6" fill="#ea4a2f" />
    </svg>
  )
}

// A smiling daisy with an orange outline.
function Daisy({ petals = C.lilacSoft, className = '' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" className={className}>
      {Array.from({ length: 10 }, (_, i) => <ellipse key={i} cx="50" cy="19" rx="10" ry="17" fill={petals} stroke={ORANGE} strokeWidth="3.5" transform={`rotate(${i * 36} 50 50)`} />)}
      <circle cx="50" cy="50" r="19" fill="#fff3c9" stroke={ORANGE} strokeWidth="3.5" />
      <path d="M43 44 v4 M57 44 v4" stroke={ORANGE} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M41 54 C 45 61, 55 61, 59 54" fill="none" stroke={ORANGE} strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}

// A four-point sparkle: solid orange, or pastel inside an orange outline.
function Sparkle({ outline = false, className = '' }) {
  const d = 'M20 1 C 21.5 13, 27 18.5, 39 20 C 27 21.5, 21.5 27, 20 39 C 18.5 27, 13 21.5, 1 20 C 13 18.5, 18.5 13, 20 1 Z'
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" className={className}>
      {outline ? <><path d={d} fill={C.lilacSoft} stroke={ORANGE} strokeWidth="2.6" strokeLinejoin="round" /><path d="M20 10 C 20.8 16, 24 19.2, 30 20 C 24 20.8, 20.8 24, 20 30 C 19.2 24, 16 20.8, 10 20 C 16 19.2, 19.2 16, 20 10 Z" fill="#ffd6e7" /></> : <path d={d} fill={ORANGE} />}
    </svg>
  )
}

// A little tulip-like flower for the meadow: three round petals on two stems.
function MeadowFlower({ color, className = '', style }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" className={className} style={style}>
      <path d="M14 22 L12 38 M26 22 L28 38 M20 24 V38" stroke="#6f9f4f" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="10" cy="16" rx="6" ry="8" fill={color} />
      <ellipse cx="20" cy="13" rx="6" ry="8.5" fill={color} />
      <ellipse cx="30" cy="16" rx="6" ry="8" fill={color} />
    </svg>
  )
}

// Where the meadow flowers grow: [left, bottom, colour, width].
const MEADOW = [
  ['3%', '10px', '#f6b3c3', '51px'], ['9%', '57px', '#ffd75e', '42px'], ['20%', '18px', '#bfa8f0', '54px'],
  ['30%', '66px', '#9fd8f5', '39px'], ['37%', '7px', '#f6b3c3', '48px'], ['46%', '42px', '#ffd75e', '45px'],
  ['55%', '13px', '#9fd8f5', '54px'], ['63%', '62px', '#bfa8f0', '39px'], ['70%', '24px', '#f6b3c3', '51px'],
  ['78%', '78px', '#9fd8f5', '36px'], ['84%', '9px', '#ffd75e', '51px'], ['91%', '50px', '#f6b3c3', '45px'],
  ['96%', '18px', '#bfa8f0', '42px'],
]

// Little stickers drawn here, used instead of emojis: candy colours with the
// navy outline, so they match the page.
const MEDAL = { gold: C.yellow, silver: '#d5dbe8', bronze: '#e39a5c' }
function Icon({ name, className = 'h-6 w-6' }) {
  const line = { stroke: C.navy, strokeWidth: 2, strokeLinejoin: 'round', strokeLinecap: 'round' }
  const art = {
    cupcake: <><path d="M8 17 H24 L21.5 28 H10.5 Z" fill={C.yellow} {...line} /><path d="M13 18 L13.6 27 M16 18 V27 M19 18 L18.4 27" {...line} /><path d="M7 17 C 5 11, 10 8, 13 9 C 14 5, 20 5, 21 9 C 25 8, 28 12, 25 17 Z" fill={C.pink} {...line} /><circle cx="16" cy="5" r="2.6" fill={C.hot} {...line} /></>,
    heart: <><path d="M16 27 C 6 20, 3 14, 6 9 C 9 5, 14 6, 16 10 C 18 6, 23 5, 26 9 C 29 14, 26 20, 16 27 Z" fill={C.hot} {...line} /><path d="M9.5 11 C 10.5 9.5, 12 9, 13 9.4" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" /></>,
    cat: <><path d="M6 13 L7 4 L13 9 H19 L25 4 L26 13 C 28 22, 22 27, 16 27 C 10 27, 4 22, 6 13 Z" fill="#cfd1da" {...line} /><path d="M8.5 8 L9 11 L11 9.5 Z M23.5 8 L23 11 L21 9.5 Z" fill={C.pink} /><circle cx="12" cy="17" r="1.6" fill={C.navy} /><circle cx="20" cy="17" r="1.6" fill={C.navy} /><path d="M15 20 H17 L16 21.4 Z" fill={C.hot} /><path d="M16 21.4 C 15 23, 13.5 23, 13 22 M16 21.4 C 17 23, 18.5 23, 19 22" fill="none" {...line} strokeWidth="1.4" /></>,
    gold: null, silver: null, bronze: null,
    mention: <><path d="M11 18 L8 29 L12 27 L14 30 L16 19 Z M21 18 L24 29 L20 27 L18 30 L16 19 Z" fill={C.lilac} {...line} /><circle cx="16" cy="13" r="9" fill={C.pink} {...line} /><path d="M16 8 L17.5 11.5 L21 11.7 L18.3 14 L19.2 17.5 L16 15.6 L12.8 17.5 L13.7 14 L11 11.7 L14.5 11.5 Z" fill="white" {...line} strokeWidth="1.4" /></>,
    globe: <><circle cx="16" cy="16" r="12" fill={C.sky} {...line} /><path d="M9 10 C 12 9, 14 12, 12 14 C 10 16, 13 19, 11 22 M19 7 C 18 10, 22 11, 23 14 C 24 17, 20 18, 21 22" fill="none" stroke="#3f9a2c" strokeWidth="3" strokeLinecap="round" /></>,
    trophy: <><path d="M9 5 H23 V12 C 23 17, 19 20, 16 20 C 13 20, 9 17, 9 12 Z" fill={C.yellow} {...line} /><path d="M9 8 H5 C 5 13, 7 15, 10 15 M23 8 H27 C 27 13, 25 15, 22 15" fill="none" {...line} /><path d="M14 20 H18 V24 H14 Z M10 24 H22 V28 H10 Z" fill={C.hot} {...line} /></>,
    laptop: <><rect x="6" y="7" width="20" height="14" rx="2" fill={C.lilacSoft} {...line} /><path d="M3 25 H29 L27 21 H5 Z" fill={C.lilac} {...line} /><path d="M11 14 L13.5 11.5 M11 14 L13.5 16.5 M21 14 L18.5 11.5 M21 14 L18.5 16.5" {...line} /></>,
    cap: <><path d="M16 6 L30 12 L16 18 L2 12 Z" fill={C.lilac} {...line} /><path d="M8 15 V21 C 8 24, 24 24, 24 21 V15" fill={C.lilacSoft} {...line} /><path d="M28 13 V21" {...line} /><circle cx="28" cy="22" r="2" fill={C.yellow} {...line} /></>,
    sigma: <><rect x="4" y="4" width="24" height="24" rx="7" fill={C.yellow} {...line} /><path d="M21 10 H11 L16.5 16 L11 22 H21" fill="none" {...line} strokeWidth="2.6" /></>,
    pencil: <><path d="M6 26 L8 19 L21 6 L26 11 L13 24 Z" fill={C.yellow} {...line} /><path d="M21 6 L23.5 3.5 L28.5 8.5 L26 11 Z" fill={C.pink} {...line} /><path d="M6 26 L8 19 L13 24 Z" fill={C.cream} {...line} /></>,
    mic: <><rect x="11" y="3" width="10" height="15" rx="5" fill={C.lilac} {...line} /><path d="M7 14 C 7 21, 25 21, 25 14 M16 21 V27 M11 27 H21" fill="none" {...line} /><path d="M13 8 H19 M13 12 H19" stroke="white" strokeWidth="1.6" /></>,
    wave: <><path d="M3 13 C 7 9, 10 9, 13 13 C 16 17, 19 17, 22 13 C 25 9, 27 10, 29 12" fill="none" stroke={C.blue} strokeWidth="3.2" strokeLinecap="round" /><path d="M3 21 C 7 17, 10 17, 13 21 C 16 25, 19 25, 22 21 C 25 17, 27 18, 29 20" fill="none" stroke={C.sky} strokeWidth="3.2" strokeLinecap="round" /></>,
    flask: <><path d="M12 4 H20 M13 4 V12 L6 25 C 5 27, 6 28, 8 28 H24 C 26 28, 27 27, 26 25 L19 12 V4" fill={C.cream} {...line} /><path d="M9.5 20 H22.5 L25 25 C 25.5 26.4, 25 27, 24 27 H8 C 7 27, 6.5 26.4, 7 25 Z" fill={C.green} /><circle cx="14" cy="23" r="1.4" fill="white" /><circle cx="18" cy="21.5" r="1" fill="white" /></>,
    book: <><path d="M5 23 H27 V28 H5 Z" fill={C.pink} {...line} /><path d="M7 17 H25 V23 H7 Z" fill={C.sky} {...line} /><path d="M6 11 H26 V17 H6 Z" fill={C.yellow} {...line} /><path d="M9 14 H20 M10 20 H18 M9 25.5 H22" stroke={C.navy} strokeWidth="1.4" /></>,
    flag: <><path d="M7 4 V29" {...line} strokeWidth="2.4" /><path d="M7 6 H27 V18 H7 Z" fill="white" {...line} /><path d="M7 6 H13.6 V18 H7 Z" fill="#4fae3a" /><path d="M20.4 6 H27 V18 H20.4 Z" fill={C.hot} /><path d="M7 6 H27 V18 H7 Z" fill="none" {...line} /><circle cx="17" cy="12" r="1.8" fill={C.yellow} /></>,
    chat: <><path d="M5 7 H27 V21 H14 L8 27 V21 H5 Z" fill={C.pink} {...line} /><circle cx="11" cy="14" r="1.6" fill={C.navy} /><circle cx="16" cy="14" r="1.6" fill={C.navy} /><circle cx="21" cy="14" r="1.6" fill={C.navy} /></>,
    camera: <><rect x="4" y="9" width="24" height="17" rx="4" fill={C.lilacSoft} {...line} /><path d="M11 9 L13 5 H19 L21 9" fill={C.lilacSoft} {...line} /><circle cx="16" cy="17" r="5" fill="white" {...line} /><circle cx="16" cy="17" r="2" fill={C.sky} /></>,
    pin: <><path d="M16 29 C 10 21, 7 17, 7 12 A 9 9 0 0 1 25 12 C 25 17, 22 21, 16 29 Z" fill={C.hot} {...line} /><circle cx="16" cy="12" r="3.4" fill="white" {...line} /></>,
    sparkle: <><path d="M16 3 C 17 12, 20 15, 29 16 C 20 17, 17 20, 16 29 C 15 20, 12 17, 3 16 C 12 15, 15 12, 16 3 Z" fill={C.yellow} {...line} /></>,
  }[name]
  const medal = MEDAL[name]
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className={`inline-block shrink-0 ${className}`}>
      {medal ? <><path d="M10 3 L14 14 H18 L22 3 Z" fill={C.blue} {...line} /><path d="M13 3 L16 12 L19 3" fill="none" stroke={C.hot} strokeWidth="2" /><circle cx="16" cy="20" r="9" fill={medal} {...line} /><circle cx="16" cy="20" r="5.5" fill="none" stroke="white" strokeWidth="1.6" opacity=".8" /></> : art}
    </svg>
  )
}

// A card inside the cream arch whose outline keeps the same distance from
// the arch all the way round: the sides are as far from the arch's sides as
// the curved top corners are from the arch's curve (the same circle, a bit
// smaller). The outline is drawn as an SVG measured against the arch (the
// card's parent), so it adapts to every screen width.
function ArchCard({ className = '', children }) {
  const ref = useRef(null)
  const [d, setD] = useState(null)
  useLayoutEffect(() => {
    const card = ref.current
    const arch = card?.parentElement
    if (!card || !arch) return undefined
    const draw = () => {
      const a = arch.getBoundingClientRect(), c = card.getBoundingClientRect()
      const R = a.width / 2
      const gap = c.left - a.left
      const r = R - gap                          // the card's circle
      const cx = a.left + R - c.left             // circle centre, in card coordinates
      const cy = a.top + R - c.top
      const s = 1.5, w = c.width, h = c.height, rb = 24
      let top
      const rho = r - s                          // the circle the stroke runs along
      const f = rb                               // the top corners get the same roundness as the bottom ones
      if (cy > s + f + 1 && rho - f > cy - s - f) {
        // A small circle of radius f that touches both the top line and the big circle rounds each top corner.
        const fx = cx - Math.sqrt((rho - f) ** 2 - (cy - s - f) ** 2)
        const fy = s + f
        const k = rho / (rho - f)
        const px = cx + (fx - cx) * k, py = cy + (fy - cy) * k
        const mx = (x) => w - x
        top = `M ${s} ${h - rb} L ${s} ${cy} A ${rho} ${rho} 0 0 1 ${px} ${py} A ${f} ${f} 0 0 1 ${fx} ${s} `
          + `L ${mx(fx)} ${s} A ${f} ${f} 0 0 1 ${mx(px)} ${py} A ${rho} ${rho} 0 0 1 ${w - s} ${cy}`
      } else {
        top = `M ${s} ${h - rb} L ${s} ${s + rb} Q ${s} ${s} ${s + rb} ${s} L ${w - s - rb} ${s} Q ${w - s} ${s} ${w - s} ${s + rb}`
      }
      setD(`${top} L ${w - s} ${h - rb} Q ${w - s} ${h - s} ${w - s - rb} ${h - s} L ${s + rb} ${h - s} Q ${s} ${h - s} ${s} ${h - rb} Z`)
    }
    draw()
    const ro = new ResizeObserver(draw)
    ro.observe(card); ro.observe(arch)
    return () => ro.disconnect()
  }, [])
  return (
    <article ref={ref} className={`relative isolate ${className}`}>
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 h-full w-full overflow-visible">
        {d && <path d={d} fill="white" stroke={C.pink} strokeWidth="3" />}
      </svg>
      {children}
    </article>
  )
}




// A little green chalkboard with sums and a smiley, for the teaching section.
function Chalkboard({ className = '' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 240 170" className={className}>
      <rect x="6" y="6" width="228" height="140" rx="12" fill="#c98d55" stroke={C.navy} strokeWidth="4" />
      <rect x="18" y="18" width="204" height="116" rx="6" fill="#3f7d5c" stroke={C.navy} strokeWidth="3" />
      <g fill="none" stroke="white" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" opacity=".92">
        <path d="M34 46 L46 64 M46 46 L34 64" /><path d="M58 55 H70 M64 49 V61" /><path d="M80 46 C 92 44, 92 56, 82 58 C 94 60, 92 70, 80 66" />
        <path d="M104 52 H116 M104 59 H116" /><path d="M128 47 C 140 42, 142 54, 128 66 H142" />
        <circle cx="178" cy="56" r="17" /><path d="M171 52 V53 M185 52 V53" /><path d="M170 61 C 174 67, 182 67, 186 61" />
        <path d="M36 96 C 60 86, 84 106, 108 96 C 132 86, 156 106, 180 96" /><path d="M40 118 H96 M112 118 L124 110 L136 118" />
      </g>
      <text x="196" y="124" fontSize="22" fill={C.yellow} style={SCRIPT}>π</text>
      <rect x="150" y="146" width="50" height="10" rx="3" fill="white" stroke={C.navy} strokeWidth="2.5" />
      <rect x="34" y="146" width="22" height="10" rx="3" fill={C.pink} stroke={C.navy} strokeWidth="2.5" />
    </svg>
  )
}


// An award rosette with ribbon tails.
function Rosette({ color, className = '' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 120" className={className}>
      <path d="M34 62 L22 116 L36 106 L46 118 L52 66 Z" fill={color} stroke={C.navy} strokeWidth="3" strokeLinejoin="round" />
      <path d="M66 62 L78 116 L64 106 L54 118 L48 66 Z" fill={color} stroke={C.navy} strokeWidth="3" strokeLinejoin="round" />
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2
        return <circle key={i} cx={50 + Math.cos(a) * 33} cy={44 + Math.sin(a) * 33} r="10" fill={color} stroke={C.navy} strokeWidth="3" />
      })}
      <circle cx="50" cy="44" r="33" fill={color} />
      <circle cx="50" cy="44" r="24" fill="white" stroke={C.navy} strokeWidth="3" />
      <path d="M50 30 L54 40 L64 40.5 L56 47 L59 57 L50 51.5 L41 57 L44 47 L36 40.5 L46 40 Z" fill={C.yellow} stroke={C.navy} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

// A piece of washi tape.
function Tape({ color, className = '' }) {
  return <span aria-hidden="true" className={`absolute h-6 w-20 opacity-85 ${className}`} style={{ background: `repeating-linear-gradient(45deg, ${color} 0 8px, color-mix(in srgb, ${color} 70%, white) 8px 16px)` }} />
}

// A row of half circles hanging from the band above (flip: rising into the band below).
function Scallops({ color, flip = false }) {
  return (
    <div aria-hidden="true" className={`h-6 w-full ${flip ? 'rotate-180' : ''}`} style={{ background: `radial-gradient(circle at 22px 0, ${color} 21px, transparent 22px) 0 0 / 44px 24px repeat-x` }} />
  )
}

const GRID = { backgroundColor: '#fbf8ff', backgroundImage: 'linear-gradient(#7d9ce8 1.5px, transparent 1.5px), linear-gradient(90deg, #7d9ce8 1.5px, transparent 1.5px)', backgroundSize: '34px 34px' }
const STRIPES = (a, b) => ({ background: `repeating-linear-gradient(90deg, ${a} 0 44px, ${b} 44px 88px)` })

function PhotoSpot({ hint, src = null, alt = '', pos = 'center', className = '', style = {} }) {
  if (src) return <img src={src} alt={alt} loading="lazy" className={`object-cover ${className}`} style={{ ...style, objectPosition: pos }} />
  return (
    <div className={`grid place-items-center bg-white/85 p-4 text-center ${className}`} style={style}>
      <p className="max-w-[24ch] text-[14px] leading-5" style={{ ...BODY, color: C.navy }}><Icon name="camera" className="mx-auto mb-1 block h-7 w-7" />{hint}</p>
    </div>
  )
}

function Polaroid({ hint, caption, tilt = '', tape = C.pink, src = null, alt = '', pos, className = '' }) {
  return (
    <figure className={`relative bg-white p-2.5 pb-3 shadow-[4px_6px_0_rgba(30,43,92,.18)] ${tilt} ${className}`}>
      <Tape color={tape} className="-top-3 left-1/2 -translate-x-1/2 -rotate-3" />
      <PhotoSpot hint={hint} src={src} alt={alt} pos={pos} className="aspect-square w-full" style={{ background: '#f3eefc' }} />
      <figcaption className="mt-2 text-center text-[22px] leading-none" style={{ ...SCRIPT, color: C.navy }}>{caption}</figcaption>
    </figure>
  )
}

// Navy text on light colours and white on dark ones, so labels stay readable.
const LIGHT = new Set([C.green, C.lilac, C.teal, C.yellow, C.pink, C.sky, '#f39a3d'])
const inkOn = (bg) => (LIGHT.has(bg) ? C.navy : 'white')

// A little retro computer window.
function Win({ title, bar = C.blue, compact = false, className = '', children }) {
  return (
    <div className={`overflow-hidden rounded-[6px] border-[3px] bg-[#fffaf2] shadow-[6px_6px_0_rgba(30,43,92,.25)] ${className}`} style={{ borderColor: C.navy }}>
      <div className="flex items-center justify-between gap-2 px-3 py-1.5" style={{ background: bar, color: inkOn(bar) }}>
        <span className="flex min-w-0 items-center gap-1.5 truncate text-[14px] uppercase" style={PIXEL}><Icon name="cat" className="h-4 w-4" />{title}</span>
        <span aria-hidden="true" className="flex gap-1">
          {['_', '□', '×'].map((b) => <span key={b} className="grid size-5 place-items-center border-2 bg-[#fffaf2] text-[12px] leading-none" style={{ ...PIXEL, letterSpacing: 0, borderColor: C.navy, color: C.navy }}>{b}</span>)}
        </span>
      </div>
      <div className={compact ? 'p-3' : 'p-4 sm:p-5'}>{children}</div>
    </div>
  )
}


function Beads({ text, className = '' }) {
  return (
    <div aria-hidden="true" className={`flex flex-wrap justify-center gap-1 sm:gap-1.5 ${className}`}>
      {[...text].map((ch, i) => (
        <span key={i} className={`grid h-8 w-7 place-items-center rounded-[9px] border-[3px] bg-white text-[18px] font-bold sm:h-10 sm:w-9 sm:text-[22px] ${i % 2 ? 'rotate-3' : '-rotate-2'}`} style={{ ...ROUND, borderColor: C.navy, color: C.navy }}>{ch}</span>
      ))}
    </div>
  )
}

function Marquee() {
  const items = [...MARQUEE, ...MARQUEE]
  return (
    <div aria-hidden="true" className="overflow-hidden border-b-[3px] py-2" style={{ background: C.pink, borderColor: C.navy }}>
      <div className="flex w-max gap-6 motion-safe:animate-[cath-marquee_38s_linear_infinite]">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center gap-6">
            {items.map((word, i) => (
              <span key={`${copy}-${i}`} className="flex items-center gap-6 text-[13px] font-bold uppercase tracking-[0.18em]" style={{ ...ROUND, color: C.navy }}>
                {word}<Star color={STAR_COLORS[i % STAR_COLORS.length]} className="h-5 w-5" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// A sticker shaped like a membership card.
function IdCard({ className = '' }) {
  return (
    <div aria-hidden="true" className={`w-[200px] rounded-[14px] border-[3px] p-2 shadow-[4px_4px_0_rgba(30,43,92,.25)] ${className}`} style={{ background: C.yellow, borderColor: C.hot }}>
      <p className="rounded-[8px] px-2 py-1 text-center text-[13px] font-bold uppercase tracking-wider text-white" style={{ ...ROUND, background: C.hot }}>Olímpica oficial</p>
      <div className="mt-2 flex gap-2">
        <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-[8px] border-2 bg-white" style={{ borderColor: C.hot }}><CathCat className="h-11 w-auto" /></span>
        <div className="text-[13px] font-bold leading-5" style={{ ...ROUND, color: C.navy }}>
          <p><span style={{ ...SCRIPT, color: C.hot }} className="text-[18px] font-normal">Catherine</span></p>
          <p>Guerrero</p>
          <p>Desde 2018 ✓</p>
        </div>
      </div>
    </div>
  )
}

function StickyNote({ children, color = C.yellow, className = '' }) {
  return (
    <p aria-hidden="true" className={`w-32 p-3 text-[20px] leading-6 shadow-[3px_4px_0_rgba(30,43,92,.2)] ${className}`} style={{ ...SCRIPT, background: color, color: C.navy }}>{children}</p>
  )
}

const marker = (color) => ({ background: `linear-gradient(transparent 58%, ${color} 58%, ${color} 92%, transparent 92%)` })

// ---------- Page ----------

export default function CatherinePage() {
  usePageMeta({ title: 'Catherine González | TeacherCath · TeacherPeri', fullTitle: true, description: '¡Hola! Soy Catherine, estudiante de Computación en el Tec de Monterrey. Me gustan las olimpiadas de matemáticas, programar y enseñar. Conoce mis proyectos y un poquito de mi historia.' })
  return (
    <div id="arriba" className="cath-edges min-h-screen overflow-x-clip" style={{ ...BODY, backgroundColor: C.cream, color: C.navy }}>
      <link rel="stylesheet" precedence="default" href={FONTS} />
      <style>{`
        @keyframes cath-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .cath-more > summary::-webkit-details-marker { display: none }
        html:has(.cath-edges) { scroll-behavior: smooth }
        /* On wide screens the plain cream parts get candy-stripe borders on both edges,
           with a scalloped inner edge. The coloured bands cover them. */
        @media (min-width: 1280px) {
          .cath-edges {
            background-image:
              radial-gradient(circle at 0 18px, ${C.pink} 15px, transparent 16px),
              radial-gradient(circle at 100% 18px, ${C.pink} 15px, transparent 16px),
              repeating-linear-gradient(180deg, ${C.pink} 0 18px, #fde3ee 18px 36px),
              repeating-linear-gradient(180deg, ${C.pink} 0 18px, #fde3ee 18px 36px);
            background-size: 16px 36px, 16px 36px, 52px 100%, 52px 100%;
            background-position: 52px 0, calc(100% - 52px) 0, 0 0, 100% 0;
            background-repeat: repeat-y;
          }
        }
      `}</style>

      <Marquee />

      {/* ---------- Hero: blue sky ---------- */}
      <header className="relative overflow-hidden" style={{ background: C.blue }}>
        <Cloud className="-left-4 top-28 hidden w-40 sm:block" />
        <Cloud className="right-[6%] top-16 w-24 sm:w-32" />
        <Cloud className="bottom-16 left-[42%] hidden w-24 opacity-90 md:block" />
        <Star color={C.yellow} className="absolute left-[46%] top-10 hidden h-9 w-9 rotate-12 md:block" />
        <div className="relative mx-auto max-w-[1080px] px-4 pb-20 pt-6 text-white sm:px-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-sm font-bold hover:underline" style={ROUND}>← TeacherPeri</Link>
            <span className="text-[28px] leading-none" style={{ ...SCRIPT, color: C.pinkOnBlue }}>TeacherCath</span>
          </div>
          <div className="mt-10 grid items-center gap-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="relative">
              <p className="text-[clamp(36px,5vw,52px)] leading-none" style={{ ...SCRIPT, color: C.yellowOnBlue }}>Hola, soy</p>
              <h1 className="text-[clamp(60px,10vw,112px)] font-bold leading-[.9]" style={{ ...ROUND, color: C.cream }}>Catherine</h1>
              <p className="mt-3 text-[22px] font-semibold" style={ROUND}>pero aquí me dicen <span className="text-[32px]" style={{ ...SCRIPT, color: C.pinkOnBlue }}>TeacherCath</span></p>
              <p className="mt-1 text-[15px] font-semibold text-white/90">(Cath suena como <i>cat</i> en inglés, así que tenía que tener una gatita como mascota, ¿no?)</p>
              <p className="mt-6 max-w-[440px] text-[17px] font-semibold leading-7 text-white">Me gustan las matemáticas, programar y enseñar. Ah, ¡y también hago TeacherPeri con Elías!</p>
              <CathCat halo="white" className="absolute -top-8 right-2 h-20 w-auto rotate-6 sm:right-10 sm:h-24 md:-top-12" />
            </div>
            <div className="relative mx-auto w-full max-w-[330px]">
              <div className="rotate-2 p-4 shadow-[6px_8px_0_rgba(30,43,92,.25)]" style={GRID}>
                <PhotoSpot src={fotoPortada} alt="Catherine" pos="center 35%" className="aspect-square w-full" />
              </div>
              <Bow className="absolute -left-8 -top-6 w-20 -rotate-12" />
              <Bow className="absolute -bottom-8 -right-6 w-20 rotate-12" />
              <IdCard className="absolute -bottom-14 -left-6 -rotate-6 scale-90 sm:-left-14 sm:scale-100" />
            </div>
          </div>
        </div>
        <div style={{ background: C.cream }}><Scallops color={C.blue} /></div>
      </header>

      <main>
        {/* ---------- Now: what I'm up to ---------- */}
        <section aria-labelledby="ahora" className="mx-auto max-w-[1080px] px-4 pt-12 sm:px-6">
          <h2 id="ahora" className="text-center text-[30px] leading-none" style={{ ...SCRIPT, color: C.hot }}>ahora mismo…</h2>
          <ul className="mt-4 flex flex-wrap justify-center gap-2.5">
            {NOW.map(([icon, text]) => (
              <li key={text} className="flex items-center gap-2 rounded-full border-[3px] bg-white py-1.5 pl-2 pr-4 text-[15px] font-semibold" style={{ ...ROUND, borderColor: C.lilac }}>
                <Icon name={icon} className="h-6 w-6" />{text}
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- Hello ---------- */}
        <section aria-label="Hola" className="relative mx-auto max-w-[760px] px-4 pb-10 pt-12 text-center text-[19px] leading-[1.8] sm:px-6">
          <Star color={C.pink} className="absolute -left-16 top-10 hidden h-10 w-10 -rotate-12 md:block" />
          <Star color={C.teal} className="absolute -right-4 bottom-20 hidden h-9 w-9 rotate-12 md:block" />
          <p>
            ¡Holaaa! Soy Catherine, de Guerrero, aunque ahora vivo en Monterrey porque estudio <span className="font-bold" style={marker(C.pink)}>Ingeniería en Tecnologías Computacionales</span> en el Tec.
          </p>
          <p className="mt-4">
            Empecé a participar en <span className="font-bold" style={marker(C.yellow)}>olimpiadas de matemáticas</span> cuando estaba en primaria y, sin darme cuenta, terminaron siendo una parte enorme de mi vida.
            Gracias a ellas conocí muchísimos lugares, hice grandes amistades y pasé incontables horas tratando de resolver problemas que a veces ni me salían.
          </p>
          <p className="mt-4">
            Pero hay algo que disfruto tanto como las matemáticas y es <span className="font-bold" style={marker(C.green)}>enseñar</span>. Desde chiquita daba clases en la escuela de mi familia y es algo que sigo haciendo hasta hoy.
          </p>
          <p className="mt-4">
            TeacherPeri nació de una idea que compartimos Elías y yo. Queríamos crear un espacio con los recursos que nos hubiera gustado tener cuando empezamos a prepararnos para las olimpiadas.
            Todavía tenemos muchísimas ideas por hacer, pero me emociona mucho todo lo que estamos construyendo.
          </p>
          <p className="mt-4 font-semibold">¡Espero que te guste! <Icon name="heart" className="-mt-1 h-5 w-5" /></p>
          <p aria-hidden="true" className="mt-6 -rotate-3 text-[44px] leading-none" style={{ ...SCRIPT, color: C.hot }}>Catherine</p>
          <StarRow className="mt-10" />
        </section>

        {/* ---------- Awards: two big rosettes ---------- */}
        <section aria-labelledby="premios" className="mx-auto max-w-[1080px] px-4 pb-16 pt-4 sm:px-6">
          <h2 id="premios" className="text-center text-[clamp(36px,6vw,56px)] font-bold leading-none" style={ROUND}>
            <span className="text-[0.75em] font-normal" style={{ ...SCRIPT, color: C.hot }}>mis </span>reconocimientos
          </h2>
          <div className="mt-20 grid gap-20 md:grid-cols-2 md:gap-10">
            {AWARDS.map((a, i) => (
              <article key={a.title} className={`relative rounded-[28px] border-[3px] px-6 pb-7 pt-20 text-center shadow-[6px_6px_0_rgba(30,43,92,.2)] ${i ? 'md:rotate-1' : 'md:-rotate-1'}`} style={{ background: a.soft, borderColor: C.navy }}>
                <Rosette color={a.color} className="absolute -top-14 left-1/2 w-24 -translate-x-1/2" />
                <p className="text-[13px] font-bold uppercase tracking-[0.16em]" style={ROUND}>{a.year}</p>
                <h3 className="mt-1 text-[clamp(26px,3.4vw,34px)] font-bold leading-tight" style={ROUND}>{a.title}</h3>
                <p className="mx-auto mt-3 max-w-[420px] text-[17px] leading-7">{a.text}</p>
              </article>
            ))}
          </div>
          <ul className="mt-10 flex flex-wrap justify-center gap-3">
            {SMALL_AWARDS.map(([icon, text]) => <li key={text} className="flex items-center gap-2 rounded-full border-[3px] bg-white py-2 pl-3 pr-4 text-[15px] font-semibold leading-6" style={{ borderColor: C.lilac }}><Icon name={icon} className="h-7 w-7" />{text}</li>)}
          </ul>
        </section>

        {/* ---------- Olympiads: a retro computer ---------- */}
        <section aria-labelledby="olimpiadas" className="mx-auto max-w-[1120px] px-3 pb-20 pt-6 sm:px-6">
          <div className="text-center">
            <p className="text-[38px] leading-none" style={{ ...SCRIPT, color: C.hot }}>mis</p>
            <h2 id="olimpiadas" className="text-[clamp(40px,7vw,64px)] font-bold leading-none" style={ROUND}>olimpiadas</h2>
            <p className="mx-auto mt-3 max-w-[620px] text-[17px] leading-7">Todo empezó en 2018, con mi primer nacional. Desde entonces, las olimpiadas fueron parte de mi vida durante ocho años. Representé a Guerrero en distintas competencias y tuve la oportunidad de conocer a muchísimas personas que comparten mi gusto por las matemáticas.</p>
            <p className="mx-auto mt-3 max-w-[620px] text-[17px] font-semibold leading-7">Estas son algunas de las olimpiadas en las que participé. ♡</p>
          </div>

          {/* monitor */}
          <div className="mt-10 rounded-[36px] border-[4px] p-3 shadow-[8px_10px_0_rgba(30,43,92,.2)] sm:p-5" style={{ background: C.periwinkle, borderColor: C.navy }}>
            <div className="relative overflow-hidden rounded-[22px] border-[4px] px-3 py-6 sm:px-6 sm:py-8" style={{ borderColor: C.navy, background: `linear-gradient(180deg, ${C.pink} 0%, #f9d6e6 45%, ${C.sky} 100%)` }}>
              <Cloud className="left-[8%] top-6 w-24 opacity-80" />
              <Cloud className="right-[30%] top-[45%] hidden w-28 opacity-70 md:block" />
              <div className="relative">
                <div className="grid gap-6 md:grid-cols-3">
                  {OLYMPIADS.map((o, i) => (
                    <Win key={o.file} title={o.file} bar={o.bar} className={i === 1 ? 'md:mt-8' : i === 2 ? 'md:-rotate-1' : 'md:rotate-1'}>
                      <h3 className="text-[34px] font-bold leading-none" style={ROUND}>{o.title}</h3>
                      <p className="mt-1 text-[14px] font-bold uppercase tracking-wide opacity-75">{o.full}</p>
                      <p className="mt-3 text-[15px] leading-6">{o.about}</p>
                      <ul className="mt-4 flex flex-col gap-2">
                        {o.medals.map(([icon, text]) => (
                          <li key={text} className="flex items-center gap-2 rounded-[10px] px-3 py-2 text-[14px] font-semibold leading-5" style={{ background: C.lilacSoft }}>
                            <Icon name={icon} className="h-6 w-6" /><span>{text}</span>
                          </li>
                        ))}
                      </ul>
                      {o.extra && <p className="mt-3 text-[14px] font-semibold leading-6" style={{ color: C.hot }}>{o.extra}</p>}
                    </Win>
                  ))}
                </div>
              </div>

              <details className="cath-more group relative mt-10">
                <summary className="mx-auto flex w-fit cursor-pointer list-none items-center gap-2 rounded-full border-[3px] bg-white px-5 py-2 text-[17px] font-semibold shadow-[3px_3px_0_rgba(30,43,92,.2)]" style={{ ...ROUND, borderColor: C.navy }}>
                  <span className="text-[26px] leading-none" style={SCRIPT}>y también…</span>
                  <span className="group-open:hidden">ver más olimpiadas</span><span className="hidden group-open:inline">ver menos</span>
                  <span aria-hidden="true" className="transition-transform group-open:rotate-180">▾</span>
                </summary>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {OTHER_OLYMPIADS.map((o) => (
                    <Win key={o.file} title={o.file} bar={o.bar} compact className={o.wide ? 'sm:col-span-2' : ''}>
                      <h3 className="text-[20px] font-bold leading-tight" style={ROUND}>{o.title}</h3>
                      <p className="mt-0.5 text-[13px] font-bold uppercase leading-5 tracking-wide opacity-75">{o.full}</p>
                      <ul className={`mt-2 grid gap-1 text-[15px] font-semibold leading-6 ${o.wide ? 'sm:grid-cols-2' : ''}`}>
                        {o.medals.map(([icon, text]) => <li key={text} className="flex items-center gap-1.5"><Icon name={icon} className="h-5 w-5" />{text}</li>)}
                      </ul>
                    </Win>
                  ))}
                  <Win title="resumen.txt" bar={C.navy} compact className="sm:col-span-2">
                    <ul className="grid grid-cols-3 gap-2 text-center" style={ROUND}>
                      {[['18', 'medallas nacionales'], ['1', 'oro'], ['8', 'platas'], ['9', 'bronces'], ['4', 'menciones nacionales'], ['1', 'mención internacional']].map(([big, small]) => (
                        <li key={small} className="rounded-[10px] p-1.5" style={{ background: C.cream }}>
                          <span className="block text-[22px] font-bold leading-none">{big}</span>
                          <span className="text-[13px] font-semibold leading-4">{small}</span>
                        </li>
                      ))}
                    </ul>
                  </Win>
                </div>
              </details>
            </div>
            <div aria-hidden="true" className="mx-auto mt-4 flex max-w-[420px] items-center justify-center gap-3">
              {['cupcake', 'sparkle', 'cupcake', 'heart', 'cupcake'].map((name, i) => <Icon key={i} name={name} className="h-7 w-7" />)}
            </div>
          </div>
        </section>

        {/* ---------- Album: polaroids on a pink locker ---------- */}
        <section aria-labelledby="album" className="relative px-3 py-16 sm:px-6" style={{ background: C.locker }}>
          <div className="pointer-events-none absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.7) 1.2px, transparent 1.2px)', backgroundSize: '10px 10px' }} />
          <div className="relative mx-auto max-w-[1080px]">
            <h2 id="album" className="text-center text-[clamp(40px,7vw,60px)] leading-none text-white" style={{ ...SCRIPT, textShadow: `3px 3px 0 ${C.navy}` }}>¿a dónde se fue el tiempo?</h2>
            <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
              {ALBUM.map((p) => <Polaroid key={p.caption} {...p} />)}
            </div>
            <div aria-hidden="true" className="mt-12 flex flex-wrap items-center justify-center gap-6">
              <StickyNote className="-rotate-3">un problemita más y ya</StickyNote>
              <StickyNote color={C.sky} className="rotate-2">sí, sí me gustan las mates</StickyNote>
              <StickyNote color={C.green} className="-rotate-1">¿y si intentamos otra solución?</StickyNote>
              <Star color={C.yellow} className="h-12 w-12 rotate-12" />
              <Mascot pose="cath-patita" className="h-24" />
            </div>
          </div>
        </section>

        {/* ---------- Teaching: a cream arch on teal stripes ---------- */}
        <section aria-labelledby="ensenar" className="relative" style={STRIPES(C.teal, C.tealSoft)}>
          <Scallops color={C.locker} />
          <div className="h-8" />
          <div className="relative mx-auto max-w-[1000px] px-4 sm:px-6">
            <div className="rounded-t-[999px] px-6 pb-14 pt-14 sm:px-14 sm:pt-16" style={{ background: C.cream }}>
              <svg viewBox="0 0 600 175" role="img" aria-labelledby="ensenar" className="mx-auto w-full max-w-[560px]">
                <title id="ensenar">Enseñar es lo mío</title>
                <path id="arco" d="M 55 168 A 320 320 0 0 1 545 168" fill="none" />
                <text fontSize="50" fontWeight="700" fill={C.navy} style={ROUND}>
                  <textPath href="#arco" startOffset="50%" textAnchor="middle">
                    Enseñar <tspan fill={C.hot}>es</tspan> lo mío
                  </textPath>
                </text>
              </svg>
              {/* Aula Gandhi first, across the whole width: it is where it all started */}
              {/* Cath lying on top of the Aula Gandhi card, filling the space under the curved title */}
              <div aria-hidden="true" className="relative z-10 -mb-[14px] -mt-6 flex justify-center sm:-mb-[18px] sm:-mt-14">
                <Mascot pose="cath-acostada" className="h-[84px] sm:h-[120px]" />
              </div>
              <ArchCard className="mt-0 px-5 pb-6 pt-8 text-left sm:px-8 md:pt-10">
                <Flower color={C.hot} className="absolute -top-5 right-5 w-11 sm:right-[22%]" />
                <Star color={C.yellow} className="absolute -top-5 left-5 h-9 w-9 -rotate-12 sm:left-[22%]" />
                <p className="text-center text-[22px] font-semibold" style={ROUND}>{TEACHING[0].title} <span className="text-[21px] font-normal" style={{ ...SCRIPT, color: C.hot }}>{TEACHING[0].note}</span></p>
                {TEACHING[0].text.map((text) => <p key={text} className="mt-2 leading-7">{text}</p>)}
              </ArchCard>
              <div className="mt-10 grid items-start gap-10 md:grid-cols-[260px_minmax(0,1fr)]">
                {/* Left column: the class photo and a little desk of school things */}
                <div className="mx-auto flex w-full max-w-[250px] flex-col items-center gap-8">
                  <Polaroid src={fotoClases} alt="Catherine de niña dando clase a otros niños en Aula Gandhi" pos="18% center" caption="dando clase ♡" tilt="-rotate-2" tape={C.teal} />
                  <Chalkboard className="w-full rotate-1" />
                </div>
                <div className="flex flex-col gap-4 text-left">
                  <ul className="flex flex-col gap-4">
                    {TEACHING.slice(1).map((item) => (
                      <li key={item.title} className="rounded-[24px] border-[3px] bg-white px-5 py-4" style={{ borderColor: C.pink }}>
                        <p className="flex flex-wrap items-baseline gap-x-2 text-[20px] font-semibold" style={ROUND}>{item.title}<span className="text-[19px] font-normal" style={{ ...SCRIPT, color: C.hot }}>{item.note}</span></p>
                        {item.text.map((text) => <p key={text} className="mt-2 leading-7">{text}</p>)}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-[18px] font-semibold leading-7">Enseñar es algo que hago desde que tengo memoria y definitivamente es una de las cosas que más disfruto.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Projects: grid-paper cards on lilac stripes ---------- */}
        <section aria-labelledby="proyectos" className="relative" style={STRIPES(C.lilacSoft, '#d9c8fb')}>
          <div className="mx-auto max-w-[1080px] px-3 pb-20 pt-16 sm:px-6">
            <h2 id="proyectos" className="sr-only">Mis proyectos</h2>
            <Beads text="PROYECTOS" />
            <StarRow className="mt-5" />
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {PROJECTS.map((p, i) => (
                <article key={p.name} className={`relative rounded-[22px] border-[3px] p-3 shadow-[6px_6px_0_rgba(30,43,92,.2)] ${i % 2 ? 'md:rotate-1' : 'md:-rotate-1'}`} style={{ ...GRID, borderColor: C.navy }}>
                  <Tape color={p.frame} className="-top-3 left-8 -rotate-6" />
                  <PhotoSpot hint={p.hint} src={p.image?.src} alt={p.image?.alt} className="aspect-[1200/630] w-full rounded-[14px] border-[3px]" style={{ borderColor: C.navy }} />
                  <div className="mt-3 rounded-[14px] border-[3px] p-4" style={{ background: 'white', borderColor: C.navy }}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-[26px] font-bold leading-none" style={ROUND}>{p.name}</h3>
                      <span className="text-[20px] leading-none" style={{ ...SCRIPT, color: C.hot }}>{p.tag}</span>
                    </div>
                    <p className="mt-3 leading-7">{p.what}</p>
                    {p.list && (
                      <ul className="mt-3 flex flex-col gap-2.5">
                        {p.list.map(([title, text]) => (
                          <li key={title} className="flex gap-2 leading-6">
                            <Star color={C.yellow} className="mt-1 h-4 w-4 shrink-0" />
                            <span><b style={ROUND}>{title}</b><br />{text}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {p.me && <p className="mt-3 leading-7 opacity-80">{p.me}</p>}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {p.stack.map((s) => <span key={s} className="rounded-full px-3 py-1 text-[13px] font-bold" style={{ ...ROUND, background: C.lilacSoft }}>{s}</span>)}
                      {p.link?.to && <Link to={p.link.to} className="ml-auto rounded-full px-4 py-1.5 text-[14px] font-bold text-white" style={{ ...ROUND, background: p.frame === C.blue ? C.blue : C.hot }}>{p.link.label} →</Link>}
                      {p.link?.href && <a href={p.link.href} target="_blank" rel="noreferrer" className="ml-auto rounded-full px-4 py-1.5 text-[14px] font-bold text-white" style={{ ...ROUND, background: C.hot }}>{p.link.label} ↗</a>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- School and internships: tickets ---------- */}
        <section aria-labelledby="camino" className="mx-auto max-w-[1080px] px-4 py-20 sm:px-6">
          <h2 id="camino" className="text-center text-[clamp(34px,5.5vw,52px)] font-bold leading-none" style={ROUND}>
            <span className="text-[0.75em] font-normal" style={{ ...SCRIPT, color: C.hot }}>escuela y </span>prácticas
          </h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-2">
            {PATH.map((t) => (
              <li key={t.where + t.when} className={`flex overflow-hidden rounded-[18px] border-[3px] bg-white shadow-[5px_5px_0_rgba(30,43,92,.18)] ${t.soon ? 'md:col-span-2' : ''}`} style={{ borderColor: C.navy }}>
                <div className="flex w-24 shrink-0 items-center justify-center border-r-[3px] border-dashed p-3 text-center text-[14px] font-bold leading-5 sm:w-28" style={{ ...PIXEL, background: t.color, color: inkOn(t.color), borderColor: C.navy }}>{t.when}</div>
                <div className="p-4">
                  <p className="flex flex-wrap items-center gap-2 text-[20px] font-semibold leading-tight" style={ROUND}>
                    {t.where}{t.soon && <span className="rounded-full px-2.5 py-0.5 text-[13px] font-bold uppercase tracking-wide text-white" style={{ background: C.hot }}>próximamente ♡</span>}
                  </p>
                  {t.what.map((text) => <p key={text} className="mt-1 leading-7">{text}</p>)}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- Outside math: a white sheet on checkered paper, flowers at its corners ---------- */}
        <div className="relative overflow-hidden px-3 pb-24 pt-16 sm:px-6 sm:pb-36 sm:pt-24" style={CHECKER}>
          <Daisy className="absolute -left-10 top-6 w-28 sm:-left-6 sm:w-40" />
          <Daisy petals="#fbd3ea" className="absolute -left-8 top-40 hidden w-24 sm:block" />
          <Daisy petals="#fbd3ea" className="absolute -right-12 bottom-[38%] w-28 sm:-right-8 sm:w-36" />
          <Sparkle className="absolute right-[14%] top-8 w-6 sm:w-8" />
          <Sparkle outline className="absolute right-[5%] top-12 w-12 sm:w-20" />
          <Sparkle className="absolute right-[3%] top-36 hidden w-7 sm:block" />
          <Sparkle outline className="absolute -left-3 bottom-16 w-16 sm:left-[2%] sm:w-24" />
          <Sparkle className="absolute bottom-6 left-[16%] w-8 sm:w-10" />
          <Sparkle className="absolute bottom-40 left-[10%] hidden w-6 sm:block" />
        <section aria-labelledby="fuera" className="relative mx-auto max-w-[900px] rounded-[28px] border-[3px] bg-white px-5 py-14 text-center shadow-[6px_8px_0_rgba(185,156,240,.35)] sm:px-12 sm:py-16" style={{ borderColor: '#f7a8c4' }}>
          <PetalFlower className="absolute -left-6 -top-6 w-16 sm:-left-8 sm:-top-8 sm:w-20" />
          <PetalFlower className="absolute -right-6 -top-6 w-16 rotate-12 sm:-right-8 sm:-top-8 sm:w-20" />
          <PetalFlower className="absolute -bottom-6 -left-6 w-16 rotate-6 sm:-bottom-8 sm:-left-8 sm:w-20" />
          <PetalFlower className="absolute -bottom-6 -right-6 w-16 -rotate-12 sm:-bottom-8 sm:-right-8 sm:w-20" />
          <h2 id="fuera" className="sr-only">Fuera de las mates</h2>
          <p className="text-[clamp(22px,3.4vw,34px)] font-semibold leading-[1.4]" style={ROUND}>
            Aunque las matemáticas ocupan una parte enorme de mi vida, también me gusta mucho <span className="text-[1.15em]" style={{ ...SCRIPT, color: C.hot }}>escribir</span> <Icon name="pencil" className="h-[0.9em] w-[0.9em]" />,{' '}
            <span className="text-[1.15em]" style={{ ...SCRIPT, color: C.blue }}>declamar</span> <Icon name="mic" className="h-[0.9em] w-[0.9em]" /> y{' '}
            <span className="text-[1.15em]" style={{ ...SCRIPT, color: '#3f9a2c' }}>nadar</span> <Icon name="wave" className="h-[0.9em] w-[0.9em]" />.
          </p>
          <p className="mx-auto mt-6 max-w-[640px] text-[17px] leading-7">
            Desde pequeña he participado en concursos de poesía, oratoria y escritura. Me gusta preparar discursos, aprenderme textos y estar frente al micrófono, aunque eso no significa que nunca me ponga nerviosa, jajaja.
          </p>
          <details className="cath-more group mt-8">
            <summary className="mx-auto flex w-fit cursor-pointer list-none items-center gap-2 rounded-full border-[3px] bg-white px-5 py-2 text-[17px] font-semibold" style={{ ...ROUND, borderColor: C.pink }}>
              <span className="group-open:hidden">Algunas de mis experiencias</span><span className="hidden group-open:inline">Ocultar mis experiencias</span>
              <span aria-hidden="true" className="transition-transform group-open:rotate-180">▾</span>
            </summary>
          <ul className="mx-auto mt-6 grid max-w-[860px] gap-3 text-left sm:grid-cols-2">
            {VOICE.map(([icon, text]) => <li key={text} className="flex items-start gap-3 rounded-[18px] border-[3px] bg-white px-4 py-3 leading-6" style={{ borderColor: C.pink }}><Icon name={icon} className="mt-0.5 h-7 w-7" />{text}</li>)}
          </ul>
          </details>
          <p className="mx-auto mt-8 max-w-[640px] text-[17px] leading-7">
            También practiqué natación competitiva durante varios años y participé en competencias locales y estatales. Es un deporte al que le tengo muchísimo cariño.
          </p>
          <p className="mx-auto mt-4 max-w-[640px] text-[17px] leading-7">
            Y si hay algo que me importa especialmente es animar a más niñas a acercarse a las matemáticas, la ciencia y la tecnología. Me hubiera encantado conocer a más mujeres en estas áreas cuando era pequeña, así que ahora me gusta poder compartir un poquito de lo que he aprendido.
          </p>
          <div className="mx-auto mt-12 grid max-w-[560px] grid-cols-2 gap-6">
            <Polaroid src={fotoFueraDeMate} alt="Catherine afuera de una cafetería" pos="center 45%" caption="fuera de las mates ♡" tilt="-rotate-3" tape={C.yellow} />
            <Polaroid src={fotoDiscurso} alt="Catherine dando un discurso en un podio" pos="center 40%" caption="con micrófono" tilt="rotate-2" tape={C.pink} />
          </div>
        </section>
        </div>
      </main>

      {/* ---------- Footer ---------- */}
      {/* A meadow under a light sky, with the lamb grazing on the hill. */}
      <footer className="relative" style={{ background: 'linear-gradient(#a6dcf7, #cdebfb)' }}>
        <div aria-hidden="true" className="absolute inset-x-0 -top-[46px] h-[47px] sm:-top-[62px] sm:h-[63px]" style={{ background: 'radial-gradient(ellipse 50% 100% at 50% 100%, #a6dcf7 calc(100% - 1px), transparent 100%) 0 0 / var(--bump) 100% repeat-x', '--bump': 'clamp(110px, 12vw, 170px)' }} />
        <div className="absolute inset-0 overflow-hidden">
          <Cloud className="-left-6 top-10 w-32 sm:w-44" />
          <Cloud className="right-[4%] top-6 w-28 opacity-95 sm:w-40" />
          <Cloud className="left-[44%] top-24 hidden w-24 opacity-80 md:block" />
        </div>
        <div className="relative mx-auto flex max-w-[1080px] flex-col gap-8 px-4 pb-6 pt-16 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-[56px] leading-none" style={{ ...SCRIPT, color: C.hot }}>TeacherCath ♡</p>
            <p className="mt-2 max-w-[420px] text-[16px] font-semibold leading-6">¿Te preparas para la olimpiada o quieres platicar? ¡Escríbeme por LinkedIn!</p>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold"><span className="flex items-center gap-1.5"><Icon name="pin" className="h-5 w-5" />De Guerrero, ahora en Monterrey</span><span className="flex items-center gap-1.5"><Icon name="cap" className="h-5 w-5" />Tec de Monterrey</span></p>
          </div>
          <nav aria-label="Mis enlaces" className="flex flex-wrap gap-4">
            {LINKS.map(({ label, href, color, tilt }) => {
              const cls = `grid h-16 min-w-24 place-items-center rounded-[45%_55%_50%_50%/55%_45%_55%_45%] border-[3px] border-white px-5 text-[17px] font-semibold ${tilt}`
              const style = { ...ROUND, background: color, color: C.navy }
              if (!href) return <span key={label} className={`${cls} opacity-70`} style={style} title="Pon aquí tu link">{label} · pronto</span>
              if (href.startsWith('/')) return <Link key={label} to={href} className={cls} style={style}>{label}</Link>
              return <a key={label} href={href} target="_blank" rel="noreferrer" className={cls} style={style}>{label} ↗</a>
            })}
          </nav>
        </div>
        <div aria-hidden="true" className="relative h-[170px] sm:h-[200px]">
          <svg viewBox="0 0 1440 260" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <path d="M0 120 C 260 60, 520 70, 760 110 C 1000 150, 1220 70, 1440 50 V260 H0 Z" fill="#a3c97e" />
            <path d="M0 175 C 300 140, 640 160, 900 185 C 1120 205, 1300 170, 1440 150 V260 H0 Z" fill="#94bd6d" />
          </svg>
          {MEADOW.map(([left, bottom, color, size]) => <MeadowFlower key={`${left}-${bottom}`} color={color} className="absolute" style={{ left, bottom, width: size }} />)}
          {/* Catherine is a borrega, the Tec's mascot */}
          <img src={borregaBolita} alt="" loading="lazy" draggable="false" className="absolute bottom-5 left-1/2 h-[120px] w-auto -translate-x-1/2 drop-shadow-[0_4px_0_rgba(80,120,50,.25)] sm:bottom-8 sm:left-[14%] sm:h-[150px] sm:translate-x-0" />
        </div>
      </footer>

      <a href="#arriba" className="fixed bottom-5 right-5 z-40 grid size-12 place-items-center rounded-full border-[3px] bg-white text-[22px] font-bold shadow-[3px_3px_0_rgba(30,43,92,.25)] transition-transform hover:-translate-y-0.5" style={{ ...ROUND, borderColor: C.navy, color: C.navy }}>
        <span aria-hidden="true">↑</span><span className="sr-only">Volver arriba</span>
      </a>
    </div>
  )
}
