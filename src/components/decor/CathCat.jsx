import cath from '../../assets/cath.webp'

// Cath, TeacherCath's cat: the second mascot, next to Peri's penguin
// (PeriPenguin). A cartoon tabby sitting with her head tilted, drawn in the same
// style as Peri and cut out of its white background in src/assets/cath.webp. Decoration only (aria-hidden).
// Same options as PeriPenguin:
//   flip:     mirror her
//   question: a hand-drawn «?» floats behind her head
//   halo:     a colour for a sticker-like rim around her, so her dark outline
//             still shows on a dark background (the footer)

// Size of the drawing's viewBox (the image's proportions, 186 high like Peri).
const W = 127.4
const H = 186.0

// The drawing's outer outline, traced from the image.
const OUTLINE = 'M38.3 185.3 L29.7 184.3 L14.4 178.3 L5.3 169.9 L0.5 158.7 L0.5 156.7 L5.5 143.3 L16.4 136.2 L17.2 124.0 L24.4 108.8 L37.8 93.9 L32.0 89.9 L23.6 76.6 L22.4 61.6 L13.3 47.8 L11.3 36.7 L13.6 31.8 L24.9 29.8 L37.1 31.8 L52.4 21.8 L69.2 18.0 L70.7 16.5 L73.9 10.6 L79.6 4.4 L84.1 0.9 L86.5 0.5 L93.8 6.6 L99.0 16.7 L100.8 27.7 L111.5 40.5 L114.3 53.6 L114.3 55.8 L111.7 67.0 L106.0 75.8 L114.7 88.3 L118.5 101.3 L122.3 109.2 L124.7 116.4 L126.7 127.6 L126.7 131.6 L123.3 144.9 L115.7 155.5 L118.9 159.5 L119.1 164.9 L115.4 169.4 L108.8 171.3 L104.3 170.0 L103.4 171.2 L102.0 175.6 L95.9 179.3 L87.3 178.9 L80.7 173.7 L75.0 177.3 L67.6 178.7 L61.4 176.5 L58.6 171.1 L55.0 171.5 L54.3 172.2 L54.7 177.0 L49.0 183.5 L38.3 185.3 Z'

export default function CathCat({ className = '', flip = false, question = false, halo = null }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox={`0 0 ${W} ${H}`} className={`overflow-visible ${className}`}>
      <g transform={flip ? `translate(${W} 0) scale(-1 1)` : undefined}>
        {question && (
          <g fill="none" stroke="var(--tp-ink)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" transform="translate(96 -2)">
            <path d="M0 -4 C 0 -19, 24 -19, 24 -4 C 24 8, 12 9, 12 19" />
            <circle cx="12" cy="30" r="2.2" fill="var(--tp-ink)" />
          </g>
        )}
        {halo && <path d={OUTLINE} fill={halo} stroke={halo} strokeWidth="12" strokeLinejoin="round" />}
        <image href={cath} width={W} height={H} />
      </g>
    </svg>
  )
}
