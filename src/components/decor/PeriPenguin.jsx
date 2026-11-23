import penguin from '../../assets/penguin.webp'

// Peri's penguin: the hand-drawn penguin with a graph on its back, the same
// drawing as the logo seal (public/logo-seal.svg), with the shaded feet and
// the grey shadow under the belly of the later drawing, in
// src/assets/penguin.webp. It faces right. Decoration only (aria-hidden).
//   flip:     face left instead of right
//   question: a hand-drawn «?» floats behind its head
//   halo:     a colour for a sticker-like rim around it, so its dark outline
//             still shows on a dark background (the footer)

// Size of the drawing's viewBox.
const W = 108.8
const H = 186.0

// The drawing's outer outline, traced from the image.
const OUTLINE = 'M53.7 185.6 L49.6 185.2 L39.6 183.3 L33.4 177.2 L32.6 175.7 L31.4 169.7 L30.6 168.6 L25.9 171.1 L17.6 173.7 L9.7 173.9 L1.1 171.6 L0.3 170.6 L0.3 167.4 L9.2 160.0 L11.9 155.1 L8.1 124.7 L6.4 122.2 L6.4 120.5 L6.9 119.3 L8.8 117.4 L8.1 107.1 L6.3 105.5 L5.7 104.2 L5.9 101.4 L7.8 99.3 L8.2 90.6 L8.2 87.2 L6.4 84.7 L6.4 82.7 L7.8 80.7 L10.0 79.5 L19.6 60.1 L18.5 57.5 L19.1 55.1 L21.2 53.3 L22.6 53.1 L23.9 53.4 L26.8 47.7 L27.3 46.3 L26.0 43.4 L26.9 40.6 L28.8 39.1 L28.4 33.7 L30.0 24.7 L34.2 13.7 L37.5 9.1 L42.9 4.2 L49.4 1.3 L57.0 0.3 L63.1 0.3 L74.3 2.9 L81.1 5.9 L85.5 9.6 L90.1 18.5 L90.8 19.1 L103.9 27.6 L103.6 28.9 L100.3 32.2 L92.1 34.8 L91.5 35.4 L90.4 42.9 L92.5 49.8 L102.4 71.1 L105.1 80.7 L106.7 87.8 L108.3 98.7 L108.4 116.5 L107.6 125.0 L104.4 138.0 L99.7 150.5 L94.4 157.8 L89.9 161.6 L89.9 164.2 L90.8 165.0 L95.4 167.2 L98.5 171.3 L98.7 172.1 L97.6 173.2 L95.3 173.7 L94.9 174.1 L94.6 176.3 L93.6 177.4 L88.4 176.6 L86.6 178.5 L84.0 178.5 L77.2 177.9 L68.6 175.4 L66.0 173.7 L63.8 171.2 L63.2 171.2 L62.8 171.7 L62.8 174.1 L66.0 178.2 L66.2 179.7 L65.3 180.3 L62.9 181.1 L62.2 181.7 L61.7 183.8 L60.9 184.7 L55.1 183.5 L54.4 185.1 L53.7 185.6 Z'

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
