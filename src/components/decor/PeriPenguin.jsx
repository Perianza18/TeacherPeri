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
const W = 108.7
const H = 186.0

// The drawing's outer outline, traced from the image.
const OUTLINE = 'M53.6 185.6 L49.4 185.2 L39.5 183.3 L33.2 177.3 L32.5 175.7 L31.3 169.7 L30.5 168.4 L25.9 171.0 L17.6 173.5 L9.7 173.8 L1.1 171.5 L0.3 170.4 L0.3 167.3 L9.2 159.9 L11.8 155.0 L8.1 124.6 L6.4 122.1 L6.4 120.4 L6.9 119.2 L8.8 117.4 L8.1 107.0 L6.3 105.5 L5.6 104.1 L5.9 101.3 L7.8 99.3 L8.2 90.5 L8.2 87.1 L6.4 84.7 L6.4 82.6 L7.8 80.6 L10.0 79.5 L19.6 60.0 L18.5 57.5 L19.1 55.0 L21.1 53.3 L22.6 53.0 L23.9 53.4 L26.8 47.6 L27.3 46.3 L25.9 43.4 L26.9 40.6 L28.7 39.1 L28.4 33.7 L29.9 24.7 L34.2 13.7 L37.5 9.1 L42.9 4.2 L49.3 1.3 L57.0 0.3 L63.1 0.3 L74.2 2.9 L81.0 5.9 L85.5 9.6 L90.1 18.5 L90.8 19.1 L103.8 27.6 L103.6 28.9 L100.2 32.1 L92.1 34.8 L91.4 35.4 L90.3 42.9 L92.4 49.8 L102.4 71.1 L105.0 80.7 L106.6 87.7 L108.2 98.6 L108.3 116.4 L107.6 124.9 L105.1 134.5 L103.6 134.5 L103.2 135.0 L101.7 140.7 L97.3 152.5 L93.1 157.9 L89.5 161.3 L89.5 164.1 L90.6 165.0 L95.2 167.2 L98.3 171.3 L98.5 172.2 L97.4 173.2 L95.1 173.7 L94.7 174.1 L94.5 176.3 L93.4 177.4 L88.2 176.6 L86.4 178.5 L83.8 178.5 L77.0 177.9 L68.4 175.4 L65.8 173.7 L63.5 171.1 L62.9 171.1 L62.5 171.5 L62.5 174.0 L65.8 178.2 L66.0 179.7 L65.1 180.4 L62.7 181.1 L62.0 181.7 L61.5 183.8 L60.7 184.7 L54.9 183.5 L54.2 185.1 L53.6 185.6 Z'

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
