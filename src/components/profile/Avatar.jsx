import { avatarById, avatarFill } from '../../lib/avatars'
import { frameById } from '../../lib/frames'

const SIZES = { sm: 'h-9 w-9', md: 'h-11 w-11', picker: 'h-14 w-14', lg: 'h-24 w-24' }
// Ring thickness of a frame around each size.
const RING = { sm: 'p-[2px]', md: 'p-[3px]', picker: 'p-[3px]', lg: 'p-[5px]' }

function Sparkle({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M12 1.5c.7 4.6 2.6 6.9 7.5 8.5-4.9 1.6-6.8 3.9-7.5 8.5-.7-4.6-2.6-6.9-7.5-8.5 4.9-1.6 6.8-3.9 7.5-8.5Z" fill="#ffd65a" stroke="#111" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function Crown({ className }) {
  return (
    <svg viewBox="0 0 32 22" aria-hidden="true" className={className}>
      <path d="M3 19 1.5 5l8 6 6.5-9.5L22.5 11l8-6L29 19Z" fill="#ffd65a" stroke="#111" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="16" cy="13" r="2" fill="#ff7f79" stroke="#111" strokeWidth="1.2" />
    </svg>
  )
}

function Circle({ avatar, color, size, className, a11y }) {
  return (
    <span
      className={`inline-grid shrink-0 place-items-center overflow-hidden rounded-full border-2 border-tp-ink ${SIZES[size] ?? SIZES.md} ${className}`}
      style={{ backgroundColor: avatarFill(avatar, color) }}
      {...a11y}
    >
      {avatar.src
        ? <img src={avatar.src} alt="" draggable="false" className="h-full w-full object-cover" />
        : (
          <svg viewBox="0 0 40 40" className="h-[72%] w-[72%]" fill="none" stroke="#111111" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            {avatar.paths.map((d) => <path key={d} d={d} />)}
          </svg>
        )}
    </span>
  )
}

// A preset avatar: a circle with a 2px ink border on the chosen background
// colour (or the avatar's own pastel fill), with a math shape in ink or an
// illustrated drawing. Decorative by default (the username is always next to it).
// `frame` (lib/frames.js) adds a ring that goes up with points: copper,
// silver, gold with a sparkle, and the olympic rainbow with a crown. «Lápiz»
// is the plain circle.
export default function Avatar({ id, color = null, size = 'md', label = null, frame = null, className = '' }) {
  const avatar = avatarById(id)
  const a11y = label ? { role: 'img', 'aria-label': frame && frame !== 'lapiz' ? `${label}, marco ${frameById(frame).name}` : label } : { 'aria-hidden': 'true' }
  if (!frame || frame === 'lapiz') return <Circle avatar={avatar} color={color} size={size} className={className} a11y={a11y} />
  const big = size === 'lg' || size === 'picker'
  return (
    <span className={`tp-frame tp-frame-${frame} relative inline-grid shrink-0 place-items-center rounded-full border-2 border-tp-ink ${RING[size] ?? RING.md} ${className}`} {...a11y}>
      <Circle avatar={avatar} color={color} size={size} className="" a11y={{}} />
      {frame === 'oro' && size !== 'sm' && <Sparkle className={`absolute ${big ? '-right-2 -top-2 h-7 w-7' : '-right-1.5 -top-1.5 h-4 w-4'}`} />}
      {frame === 'olimpico' && size !== 'sm' && <Crown className={`absolute left-1/2 -translate-x-1/2 ${big ? '-top-5 h-7 w-10' : '-top-3 h-3.5 w-5'}`} />}
    </span>
  )
}
