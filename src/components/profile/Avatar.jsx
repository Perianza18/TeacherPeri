import { avatarById } from '../../lib/avatars'

const SIZES = { sm: 'h-9 w-9', md: 'h-11 w-11', lg: 'h-24 w-24' }

// A preset avatar: a circle with a 2px ink border, a pastel fill and a math
// shape in ink. Decorative by default (the username is always next to it).
export default function Avatar({ id, size = 'md', label = null, className = '' }) {
  const avatar = avatarById(id)
  return (
    <span
      className={`inline-grid shrink-0 place-items-center overflow-hidden rounded-full border-2 border-tp-ink ${SIZES[size] ?? SIZES.md} ${className}`}
      style={{ backgroundColor: avatar.fill }}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': 'true' })}
    >
      <svg viewBox="0 0 40 40" className="h-[72%] w-[72%]" fill="none" stroke="#111111" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        {avatar.paths.map((d) => <path key={d} d={d} />)}
      </svg>
    </span>
  )
}
