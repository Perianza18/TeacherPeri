import penguin from '../../assets/penguin.webp'

// Peri's penguin: the penguin with a graph on its back, the main mascot and
// the logo (public/logo-seal.svg). Cut out of its white background in
// src/assets/penguin.webp, in the same style as Cath (CathCat). It faces
// right. Decoration only (aria-hidden).
//   flip:     face left instead of right
//   question: a hand-drawn «?» floats behind its head
//   halo:     a colour for a sticker-like rim around it, so its dark outline
//             still shows on a dark background (the footer)

// Size of the drawing's viewBox.
const W = 118.5
const H = 186.0

// The drawing's outer outline, traced from the image.
const OUTLINE = 'M55.7 185.3 L51.3 185.1 L41.8 183.3 L35.3 176.8 L33.9 170.2 L32.8 169.1 L29.6 168.1 L20.0 161.1 L14.0 163.3 L5.8 163.3 L4.2 162.9 L3.5 162.0 L2.9 159.4 L6.5 154.4 L8.5 145.8 L3.7 133.5 L2.1 121.1 L1.1 118.9 L0.5 99.3 L1.3 97.7 L2.9 86.1 L2.9 84.9 L1.1 82.7 L1.1 80.7 L2.8 78.6 L4.6 78.0 L5.5 76.9 L7.7 68.9 L13.7 58.7 L12.9 56.5 L13.1 54.5 L15.6 52.2 L18.0 52.2 L21.1 46.4 L21.5 45.0 L20.1 42.2 L21.1 39.8 L22.7 38.4 L22.9 28.8 L28.1 15.4 L44.6 3.1 L59.3 0.7 L65.3 0.5 L79.5 3.3 L92.3 12.3 L99.6 26.8 L101.2 41.4 L99.2 49.5 L96.2 55.5 L102.4 66.3 L103.6 70.5 L108.8 78.5 L115.8 95.3 L117.8 106.5 L117.6 119.5 L114.5 124.8 L111.5 125.4 L109.5 124.0 L108.6 124.7 L106.8 138.7 L99.6 151.8 L85.6 163.0 L86.3 163.9 L94.9 167.7 L98.0 171.6 L98.2 172.8 L97.1 173.7 L95.5 173.9 L94.6 174.8 L94.4 176.6 L93.3 177.7 L88.5 176.9 L86.7 178.7 L84.1 178.7 L77.5 178.1 L68.9 175.5 L63.5 169.9 L57.9 170.1 L57.2 170.8 L57.9 171.7 L64.3 174.7 L67.4 179.6 L64.1 181.1 L62.1 184.7 L56.9 183.5 L55.7 185.3 Z'

export default function PeriPenguin({ className = '', flip = false, question = false, halo = null }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox={`0 0 ${W} ${H}`} className={`overflow-visible ${className}`}>
      <g transform={flip ? `translate(${W} 0) scale(-1 1)` : undefined}>
        {question && (
          <g fill="none" stroke="var(--tp-ink)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M0 -4 C 0 -19, 24 -19, 24 -4 C 24 8, 12 9, 12 19" />
            <circle cx="12" cy="30" r="2.2" fill="var(--tp-ink)" />
          </g>
        )}
        {halo && <path d={OUTLINE} fill={halo} stroke={halo} strokeWidth="12" strokeLinejoin="round" />}
        <image href={penguin} width={W} height={H} />
      </g>
    </svg>
  )
}
