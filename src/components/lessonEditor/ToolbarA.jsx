import { useEffect, useId, useRef, useState } from 'react'
import { LESSON_BLOCKS, blockSnippet, figureSnippet, headingSnippet, mathSnippet, problemsSnippet, tableSnippet } from '../../lib/lessonMarkup'
import ProblemSearch from './ProblemSearch'

const BUTTON = 'tp-button inline-flex items-center gap-1 bg-tp-surface px-3 text-sm font-bold'

// OPCIÓN A — one row of labeled buttons above the text. «Bloque», «Título»
// and «Problema» open a panel under the row; «$ LaTeX» acts at once.
// `insert(build)` comes from the editor: build(selected) → snippet.
export default function ToolbarA({ insert }) {
  const id = useId()
  const [open, setOpen] = useState(null)
  const root = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => { if (event.key === 'Escape') setOpen(null) }
    const onClick = (event) => { if (!root.current?.contains(event.target)) setOpen(null) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick) }
  }, [open])

  const run = (build) => { insert(build); setOpen(null) }
  const toggle = (name) => setOpen((current) => (current === name ? null : name))
  const menuButton = (name, label) => (
    <button type="button" aria-expanded={open === name} aria-controls={`${id}-${name}`} onClick={() => toggle(name)} className={`${BUTTON} ${open === name ? 'bg-tp-yellow-soft' : ''}`}>
      {label} <span aria-hidden="true">▾</span>
    </button>
  )
  const item = (label, build, hint) => (
    <li key={label}>
      <button type="button" onClick={() => run(build)} className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-3 text-left text-sm font-semibold hover:bg-tp-yellow-soft">
        <span>{label}</span>{hint && <code className="text-xs text-tp-ink-muted">{hint}</code>}
      </button>
    </li>
  )

  return (
    <div ref={root} className="flex flex-col gap-2">
      <div role="toolbar" aria-label="Insertar formato" className="flex flex-wrap gap-2">
        {menuButton('bloque', 'Bloque')}
        {menuButton('titulo', 'Título')}
        {menuButton('problema', 'Problema')}
        <button type="button" onClick={() => run(mathSnippet)} aria-label="Insertar matemáticas en línea ($…$)" className={BUTTON}>$ LaTeX</button>
      </div>
      {open === 'bloque' && (
        <ul id={`${id}-bloque`} aria-label="Bloques" className="tp-card-quiet grid gap-1 bg-tp-surface p-2 sm:grid-cols-2">
          {LESSON_BLOCKS.map((block) => item(block.label, (selected) => blockSnippet(block.kind, selected), `:::${block.kind}`))}
          {item('Figura', figureSnippet, '![…](figuras/…)')}
          {item('Tabla', tableSnippet, '| … |')}
        </ul>
      )}
      {open === 'titulo' && (
        <ul id={`${id}-titulo`} aria-label="Títulos" className="tp-card-quiet grid gap-1 bg-tp-surface p-2 sm:max-w-xs">
          {item('Sección', (selected) => headingSnippet(2, selected), '##')}
          {item('Subsección', (selected) => headingSnippet(3, selected), '###')}
        </ul>
      )}
      {open === 'problema' && (
        <div id={`${id}-problema`} className="tp-card-quiet bg-tp-surface p-4">
          <ProblemSearch layout="compact" autoFocus onInsert={(codes, kind) => run(() => problemsSnippet(codes, kind))} />
        </div>
      )}
    </div>
  )
}
