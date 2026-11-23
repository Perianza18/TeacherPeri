import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PeriPenguin from './decor/PeriPenguin'
import CathCat from './decor/CathCat'

const LINKS = [
  ['Rutas', '/rutas'],
  ['Entrenamiento', '/entrenamiento'],
  ['Experiencias', '/experiencias'],
  ['Equipo', '/equipo'],
  ['Universidad', '/estudia-en-el-extranjero'],
  ['Contacto', '/contacto'],
]

// Ink footer that ends in a poster-sized wordmark, cropped by the page edge.
// With a mouse over it, the grid lights up around the pointer. The pointer
// position lives in CSS variables on the footer, so moving the mouse never
// re-renders React.
export default function Footer() {
  const footer = useRef(null)
  // Which word the big footer shows this time (see the comment on it).
  const [cathWord] = useState(() => Math.random() < 0.5)

  function trackPointer(event) {
    if (event.pointerType !== 'mouse' || !footer.current) return
    const box = footer.current.getBoundingClientRect()
    const x = event.clientX - box.left
    const y = event.clientY - box.top
    const style = footer.current.style
    style.setProperty('--gx', `${x}px`)
    style.setProperty('--gy', `${y}px`)
  }

  const spotlight = 'radial-gradient(240px circle at var(--gx, -999px) var(--gy, -999px), #000 0%, rgb(0 0 0 / .45) 45%, transparent 100%)'

  return (
    <footer ref={footer} onPointerMove={trackPointer} className="group/grid relative overflow-hidden border-t-3 border-tp-ink bg-tp-ink text-white">
      <div aria-hidden="true" className="tp-graph absolute inset-0 [--grid-line:rgb(255_255_255/.045)]" />
      <div aria-hidden="true" className="tp-graph pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [--grid-line:rgb(255_255_255/.32)] group-hover/grid:opacity-100" style={{ maskImage: spotlight, WebkitMaskImage: spotlight }} />
      <div className="tp-container relative grid gap-10 pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
        <div className="flex flex-col items-start gap-4">
          <p aria-hidden="true" className="tp-hand -rotate-2 text-[32px] text-tp-yellow">¡Nos vemos en la olimpiada!</p>
          <p className="max-w-md text-[15px] leading-7 text-white/65">
            Matemáticas olímpicas y orientación universitaria, organizadas para que puedas encontrar un camino y seguir explorando por tu cuenta.
          </p>
        </div>
        <nav aria-label="Pie de página" className="grid grid-cols-2 gap-x-6 gap-y-1 text-[15px] font-semibold sm:grid-cols-4 lg:justify-self-end">
          {LINKS.map(([label, to]) => (
            <Link key={to} to={to} className="flex min-h-11 items-center text-white/75 transition-colors hover:text-tp-yellow">{label}</Link>
          ))}
        </nav>
      </div>
      {/* The big word takes turns at random: «TeacherPeri» or «TeacherCath».
          Both mascots stand on it either way. In TeacherPeri, Cath sits on
          the top of the «T» and Peri stands on the «i» as its dot (a dotless
          ı below it); in TeacherCath, Peri stands on the «T» and Cath sits on
          the «h». «Peri» is violet and «Cath» pink, like her ears. TeacherCath
          is a little wider, so its font is a little
          smaller and both words span the same width. The visible letters are
          aria-hidden behind a plain label, and the top margin grows with the
          word so the mascot on the «T» clears the text above. */}
      {cathWord ? (
        <Link to="/" aria-label="TeacherCath" className="relative mt-[max(3rem,0.44em)] block select-none whitespace-nowrap text-center font-display text-[clamp(60px,17.7vw,270px)] font-extrabold leading-[.8] tracking-[-0.055em] text-tp-paper transition-colors hover:text-white">
          <span aria-hidden="true">
            <span className="relative">T<PeriPenguin halo="var(--tp-paper)" className="pointer-events-none absolute bottom-[0.93em] left-1/2 h-[max(44px,0.4em)] w-auto -translate-x-1/2" /></span>eacher<span className="text-[#ff8fb8]">Cat<span className="relative">h<CathCat halo="#ff8fb8" className="pointer-events-none absolute bottom-[0.98em] left-[0.13em] h-[max(36px,0.34em)] w-auto -translate-x-1/2" /></span></span>
          </span>
        </Link>
      ) : (
        <Link to="/" aria-label="TeacherPeri" className="relative mt-[max(2.5rem,0.34em)] block select-none whitespace-nowrap text-center font-display text-[clamp(64px,19vw,290px)] font-extrabold leading-[.8] tracking-[-0.055em] text-tp-paper transition-colors hover:text-white">
          <span aria-hidden="true">
            <span className="relative">T<CathCat halo="var(--tp-paper)" className="pointer-events-none absolute bottom-[0.93em] left-1/2 h-[max(36px,0.34em)] w-auto -translate-x-1/2" /></span>eacher<span className="text-[#9d7cff]">Per<span className="relative">ı<PeriPenguin flip halo="#9d7cff" className="pointer-events-none absolute bottom-[0.79em] left-1/2 h-[max(44px,0.4em)] w-auto -translate-x-1/2" /></span></span>
          </span>
        </Link>
      )}
      <div className="relative border-t border-white/10 py-5 text-center text-xs text-white/40">
        Hecho con cariño para quienes aman resolver problemas.
      </div>
    </footer>
  )
}
