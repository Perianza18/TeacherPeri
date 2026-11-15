// Brush-stroke penguin, a wink to the creator's favorite animal until the
// official penguin logo exists: a dark cap over a white face, and the body
// drawn by a few tapering ink strokes (back, chest, flipper, belly, feet)
// with the white left open. Decoration only (aria-hidden), and kept in this
// one file so the real drawing can replace it in one place.
//   color:    the strokes (ink by default; a light color on dark grounds)
//   fill:     the body behind the strokes ('none' lets the ground show)
//   flip:     face right instead of left
//   question: a hand-drawn «?» floats behind its head
export default function Penguin({ className = '', color = 'var(--tp-ink)', fill = 'var(--tp-surface)', flip = false, question = false }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 100 152" className={`overflow-visible ${className}`}>
      <g transform={flip ? 'translate(100 0) scale(-1 1)' : undefined} fill={color}>
        {question && (
          <g fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M80 4 C 80 -8, 98 -8, 98 4 C 98 13, 89 14, 89 22" />
            <circle cx="89" cy="31" r="1.6" fill={color} />
          </g>
        )}
        {/* body behind the strokes */}
        <path d="M23 30 C 25 13, 38 6, 50 6 C 64 6, 72 16, 71 30 C 82 50, 88 80, 85 110 C 83 128, 76 138, 64 141 C 48 145, 34 140, 28 126 C 20 108, 19 84, 23 62 C 19 50, 20 40, 23 30 Z" fill={fill} />
        {/* beak */}
        <path d="M7 31 C 12 28, 18 26, 23 26 L 22 32 C 17 32, 12 32, 7 31 Z" />
        {/* cap: forehead, crown and the back of the head, face left white */}
        <path d="M23 26 C 25 13, 37 5, 50 5 C 63 5, 72 14, 71 27 C 70 35, 66 41, 59 45 C 64 35, 62 23, 53 18 C 45 14, 36 18, 33 27 C 29 29, 26 31, 22 32 Z" />
        {/* eye */}
        <circle cx="39" cy="27" r="2.6" />
        {/* back: one long stroke, thick at the shoulder, thin at the tail */}
        <path d="M64 42 C 79 56, 86 80, 84 108 C 83 124, 78 134, 70 140 C 75 126, 77 110, 75 92 C 73 72, 66 56, 57 46 Z" />
        {/* chest under the beak */}
        <path d="M24 36 C 19 48, 21 62, 28 72 C 25 60, 26 48, 31 40 Z" />
        {/* flipper */}
        <path d="M34 62 C 24 78, 23 98, 33 116 C 34 102, 36 86, 43 72 C 41 67, 38 63, 34 62 Z" />
        {/* lower belly */}
        <path d="M28 116 C 34 133, 52 141, 68 136 C 54 136, 40 129, 32 113 Z" />
        {/* feet */}
        <path d="M26 146 C 32 141, 44 140, 52 144 L 46 148 C 40 146, 32 146, 26 146 Z" />
        <path d="M64 142 C 70 142, 77 144, 83 149 L 70 149 C 68 147, 66 144, 64 142 Z" />
      </g>
    </svg>
  )
}
