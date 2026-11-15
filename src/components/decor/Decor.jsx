import { useInView } from '../../hooks/useInView'

// Hand-drawn decoration for the «Cómic refinado» look: marks around words,
// a comic starburst, a speech-bubble tail, margin notes and a ticker band.
// Every drawing is aria-hidden; the words they decorate stay plain text.

// One path per mark, drawn in a stretchable box. The stroke keeps its width
// (vector-effect in index.css), so any word length looks hand-drawn.
// Each mark has one job, so the page never repeats the same flourish:
// underline: the Inicio headline only · circle and scribble: Inicio section
// titles · lines: comic «¡!» emphasis strokes at a word's top-right corner ·
// arrow: an underline that ends in an arrowhead (Rutas, «dirección»).
// `fixed` marks keep their proportions instead of stretching with the word.
const MARK_PATHS = {
  underline: { viewBox: '0 0 200 20', d: 'M3 13 C 42 7, 92 5, 132 8 S 186 13, 197 7' },
  scribble: { viewBox: '0 0 200 24', d: 'M3 8 C 50 3, 130 3, 196 6 M 12 18 C 70 12, 130 13, 188 15' },
  circle: { viewBox: '0 0 200 100', d: 'M152 13 C 112 1, 40 4, 14 30 C -6 54, 24 90, 96 94 C 164 98, 198 72, 195 46 C 192 20, 150 5, 92 8 C 70 9, 52 13, 38 19' },
  arrow: { viewBox: '0 0 200 30', d: 'M4 18 C 46 8, 96 26, 150 16 S 182 12, 192 14 M 176 4 L 194 14 L 178 25' },
  lines: { viewBox: '0 0 100 100', d: 'M14 70 L 46 54 M 10 42 L 34 12 M 42 92 L 80 86', fixed: true },
}

// <Mark variant="underline|scribble|circle|arrow|lines" color="var(--tp-yellow)">
// draws once when the word scrolls into view.
export function Mark({ children, variant = 'underline', color, width, delay }) {
  const [ref, inView] = useInView({ threshold: 0.6 })
  const path = MARK_PATHS[variant] || MARK_PATHS.underline
  const style = {
    ...(color && { '--mark': color }),
    ...(width && { '--mark-width': `${width}px` }),
    ...(delay !== undefined && { '--mark-delay': `${delay}ms` }),
  }
  return (
    <span ref={ref} data-wait={inView ? undefined : ''} className={`tp-mark tp-mark-${variant}`} style={style}>
      {children}
      <svg aria-hidden="true" focusable="false" className="tp-mark-svg" viewBox={path.viewBox} preserveAspectRatio={path.fixed ? undefined : 'none'}>
        <path d={path.d} />
      </svg>
    </span>
  )
}

// Marker highlight behind words; wraps across lines.
export function Highlight({ children, color, delay }) {
  const [ref, inView] = useInView({ threshold: 0.6 })
  const style = {
    ...(color && { '--hl': color }),
    ...(delay !== undefined && { '--mark-delay': `${delay}ms` }),
  }
  return <span ref={ref} data-wait={inView ? undefined : ''} className="tp-highlight" style={style}>{children}</span>
}

// Big tilted sticker with a math symbol, for a page header's right side.
// A smaller companion tile floats beside it. Decoration only.
export function GlyphTile({ glyph, color = 'bg-tp-yellow', small, smallColor = 'bg-tp-surface', className = '' }) {
  return (
    <span aria-hidden="true" className={`relative block ${className}`}>
      <span className={`grid size-36 rotate-6 place-items-center rounded-[22px] border-3 border-tp-ink font-[family-name:var(--font-reading)] text-[92px] italic leading-none shadow-[6px_6px_0_var(--tp-ink)] lg:size-44 lg:text-[112px] ${color}`}>{glyph}</span>
      {small && <span className={`tp-float absolute -bottom-6 -left-8 grid size-14 -rotate-12 place-items-center rounded-xl border-2 border-tp-ink font-[family-name:var(--font-reading)] text-[26px] italic shadow-[3px_3px_0_var(--tp-ink)] ${smallColor}`}>{small}</span>}
    </span>
  )
}

// Comic starburst polygon («¡POW!»): alternating long and short spikes.
function burstPoints(spikes, outer, inner) {
  const points = []
  for (let index = 0; index < spikes * 2; index += 1) {
    const radius = index % 2 === 0 ? outer - (index % 4 === 0 ? 0 : 3) : inner
    const angle = (Math.PI * index) / spikes - Math.PI / 2
    points.push(`${(50 + radius * Math.cos(angle)).toFixed(2)},${(50 + radius * Math.sin(angle)).toFixed(2)}`)
  }
  return points.join(' ')
}

const BURST = burstPoints(13, 48, 37)

// A starburst with content centered on it. Size it with a className.
export function Burst({ children, className = '', color = 'var(--tp-yellow)' }) {
  return (
    <span className={`relative inline-grid place-items-center ${className}`}>
      <svg aria-hidden="true" focusable="false" viewBox="-2 -2 108 108" className="absolute inset-0 size-full overflow-visible">
        <polygon points={BURST} transform="translate(4 4)" fill="var(--tp-ink)" />
        <polygon points={BURST} fill={color} stroke="var(--tp-ink)" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
      <span className="relative text-center">{children}</span>
    </span>
  )
}

// Speech-bubble tail. Place it so its top edge overlaps the bubble's bottom
// border by the border width; its fill hides that piece of border.
export function BubbleTail({ className = '', fill = 'var(--tp-surface)' }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 48 40" className={`absolute h-10 w-12 overflow-visible ${className}`}>
      <path d="M2 0 L 6 36 L 40 0" fill={fill} stroke="var(--tp-ink)" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  )
}

// Curved hand-drawn arrow, pointing down-left from its top-right corner.
export function HandArrow({ className = '', color = 'currentColor' }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 80 64" className={`overflow-visible ${className}`} fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M74 6 C 58 2, 30 8, 20 30 C 15 41, 14 50, 15 58" />
      <path d="M6 46 L 15 59 L 26 49" />
    </svg>
  )
}

// Ticker band: the items twice, so the loop has no seam.
export function Marquee({ items, className = '' }) {
  const row = (hidden) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-6 pr-6">
          <span>{item}</span>
          <span aria-hidden="true" className="text-tp-yellow">✦</span>
        </li>
      ))}
    </ul>
  )
  return (
    <div className={`tp-marquee overflow-hidden ${className}`}>
      <div className="tp-marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
