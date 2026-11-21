import penguin from '../../assets/penguin.svg'

// Peri's penguin: the hand-drawn penguin with a graph on its back, the same
// drawing as the logo seal, traced to SVG in src/assets/penguin.svg. It
// faces right. Decoration only (aria-hidden).
//   flip:     face left instead of right
//   question: a hand-drawn «?» floats behind its head
//   halo:     a colour for a sticker-like rim around it, so its dark outline
//             still shows on a dark background (the footer)

// Size of the drawing's viewBox.
const W = 107
const H = 185.9

// The drawing's outer outline, in the traced drawing's own coordinates
// (shifted into the viewBox like the drawing in penguin.svg).
const OUTLINE = 'M71.5 190.2l-.5 0-1.3-.2-.4-.1-9.2-1.5-1.7-.3-.4-.2-5.7-4.7-.2-.2-1.2-4.9-.1-.4-.9-4-.2-.5-6.5-5.6-.7 .3-5.5 3-6.2 1.9-1.9 .6-1 .1-2.4 .1-.5 0-2.3 .1-.4 0-.8 0-8-2-.5-.3-.6-.8-.4-1 0-.3 0-.5 .2-1 .3-.6 .3-.3 7.8-6.2 2.1-3.7 .7-1.4-.1-1.1-.1-1-.1-.6-.1-1-.3-2.1-.4-3.4-.3-2.2-.4-3.2-.4-2.9-.1-1-.6-4.8-.1-.6-.2-1.7-.5-3.5-.1-.2-.6-.6-.5-.7-.3-.8-.1-.6 0-.7 .2-.8 .3-.6 .6-.8 1.3-.9 0-.3-.7-9.7-.1-.2-1-.6-.5-.5-.3-.4-.3-.6-.2-.9 0-1.2 .3-1 .4-.6 .7-.7 .6-.5 .1-.1 0-1.9 0-.5 .1-1.5 0-.5 .1-1.3 0-.4 .1-1.4 0-.5 .1-1.4 0-.5 0-1.8-1-1-.7-1.3-.1-.5-.1-.4 .1-.7 .1-.5 .3-.7 .5-.7 .3-.3 1.2-.7 .8-.2 .2-.2 4.1-8.6 4.6-9.1 .6-1.1 0-.2-.5-.7-.2-.4-.3-1.2 0-.6 .1-.6 .4-.9 .5-.7 .5-.5 .8-.5 .6-.2 .8-.1 .8 .1 .7 .2 .2-.1 2.5-5.6 .4-1.1-.1-.2-.5-.7-.3-.6-.2-.6-.1-.7 .1-.8 .2-.8 .6-1 .5-.5 .5-.4 .6-.3 .1-.1 0-.8 0-.4-.1-1 0-.3-.1-.9 0-.3-.1-1.5 1.5-8.7 2-5.6 .6-1.7 1-2.5 3.6-5.1 1.7-1.6 1.3-1.2 1-.9 1-.9 6.4-2.9 2.4-.3 1.1-.1 .6-.1 .3 0 .6-.1 1.7-.2 .6-.1 2.1-.2 .7-.1 1.1-.1 2.9 .6 .9 .2 .9 .1 .5 .1 1.6 .5 2.6 .6 3 .7 .5 .1 5.7 2.5 .3 .2 .9 .7 2.9 2.3 .5 .5 2.9 5.2 1.8 3.7 12.5 7.9 .3 .3 .2 .3 0 .7-.3 .6-3.2 3-.7 .3-7.4 2.4-.2 .1-.1 .5-1 7 2 6.7 9.4 20.2 2.4 8.5 1.7 7.5 1.4 9.8 .1 .7 0 .4 .1 2.1 0 .5 .1 2.3 0 .5 .1 2.1 0 .5 .1 2.1 0 .8 0 1.9 0 .4-.2 2.2 0 .3-.1 .9 0 .3-.1 .9 0 .3-.1 .9 0 .3-.1 .9 0 .3-.1 .9 0 .3-.3 3-3.2 12.7-4.3 11.6-.3 .6-5 6.6-.3 .3-.6 .5-4.3 3.4-.1 .2 1 3.4 .3 .8 5.8 1.8 1 .4 2.6 1.4 2.2 1.1 1.4 .8 .7 .8 2.2 3.1 .1 .6-.2 .7-.3 .3-.4 .2-2.2 .5-.4 .1-.1 .2 0 .5-.1 1-.2 .8-.4 .6-.4 .3-.4 .1-.4 0-1.1-.2-1.9-.4-1.6-.3-.1 .1-.1 .8-.3 .4-.7 .5-.4 .1-.7 0-.3 0-.8-.1-1.4-.1-.9-.1-.3 0-1-.1-.4 0-1-.1-.4 0-2.2-.2-5-1.5-3.4-1-.5-.3-3.3-3.3-.8-.9-.2-.4-1.4-4.5-.2-.5-.1-.1-.5 .1-5.6 .9-.4 .1-1 .2-.1 .1-.1 .1 .2 .3 1.1 2.1 .5 .7 .4 .4 1.1 .6 2.5 1.2 4.6 2.3 .2 .2 2.5 3.8 .1 .5 0 .3-.1 .3-.2 .3-.2 .2-.4 .2-2.8 .9-.1 .2-.7 2.4-.3 .4-.2 .2-.4 .1-.5 0-5.1-1.2-.2 .1 0 1.1-.1 .3-.2 .3Z'

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
        {halo && <path d={OUTLINE} transform="translate(-10.5 -5.9)" fill={halo} stroke={halo} strokeWidth="12" strokeLinejoin="round" />}
        <image href={penguin} width={W} height={H} />
      </g>
    </svg>
  )
}
