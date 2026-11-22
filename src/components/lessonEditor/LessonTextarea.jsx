import { useRef } from 'react'
import { markupLines, mathParts } from '../../lib/lessonMarkup'

// Each box keeps its color from the lesson page (src/components/content/Bloques.jsx):
// the band behind its lines, and the stronger «label» color on its `:::` lines.
const BOX_TONES = {
  definition: { band: 'bg-tp-sky-soft', label: 'bg-tp-sky' },
  theorem: { band: 'bg-tp-violet-soft', label: 'bg-tp-violet text-white' },
  lemma: { band: 'bg-tp-surface', label: 'bg-tp-violet-soft' },
  corollary: { band: 'bg-tp-surface', label: 'bg-tp-violet-soft' },
  proposition: { band: 'bg-tp-surface', label: 'bg-tp-violet-soft' },
  proof: { band: 'bg-tp-paper', label: 'bg-tp-paper text-tp-ink-soft' },
  example: { band: 'bg-tp-surface', label: 'bg-tp-mint' },
  try: { band: 'bg-tp-paper', label: 'bg-tp-mint-soft' },
  tip: { band: 'bg-tp-yellow-soft', label: 'bg-tp-yellow' },
  mistake: { band: 'bg-tp-coral-soft', label: 'bg-tp-coral' },
  reveal: { band: 'bg-tp-paper', label: 'bg-tp-paper text-tp-ink-soft' },
}
const ROLE_TONES = {
  h2: 'text-tp-violet',
  h3: 'text-tp-violet',
  problems: 'bg-tp-yellow-soft',
  figure: 'text-tp-ink-muted',
  table: 'text-tp-ink-soft',
}

function lineClass({ box, role }) {
  const tone = box ? BOX_TONES[box] : null
  if (tone && (role === 'open' || role === 'close')) return tone.label
  return [tone?.band, ROLE_TONES[role]].filter(Boolean).join(' ')
}

// The lesson text field. The markup stays plain text (what is saved), but a
// layer behind it shows each part in the format it has on the page: box
// colors, section titles and math. The real <textarea> sits on top with the
// same font and size and transparent text, so typing, selecting, undo and
// screen readers work as in any text field.
const SHARED = 'col-start-1 row-start-1 m-0 h-full min-h-0 w-full whitespace-pre-wrap break-words px-3.5 py-2.5 font-mono text-sm leading-6 [scrollbar-gutter:stable]'

export default function LessonTextarea({ ref, id, value, onChange, maxLength }) {
  const layer = useRef(null)
  return (
    <div className="grid h-[70vh] min-w-0 grid-rows-[minmax(0,1fr)] overflow-hidden rounded-[10px] border-2 border-tp-ink bg-tp-surface">
      <div ref={layer} aria-hidden="true" className={`${SHARED} overflow-hidden text-tp-ink`}>
        {markupLines(value).map((line, index) => (
          <div key={index} className={lineClass(line)}>
            {line.text === '' ? '\u200b' : mathParts(line.text).map((part, i) => (part.math ? <span key={i} className="text-tp-violet">{part.text}</span> : part.text))}
          </div>
        ))}
      </div>
      <textarea
        ref={ref}
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onScroll={(event) => { if (layer.current) layer.current.scrollTop = event.currentTarget.scrollTop }}
        maxLength={maxLength}
        spellCheck
        className={`${SHARED} relative resize-none overflow-y-auto border-0 bg-transparent text-transparent caret-tp-ink outline-offset-[-4px] selection:bg-tp-violet/25`}
      />
    </div>
  )
}
