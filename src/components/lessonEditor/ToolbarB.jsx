import { useRef } from 'react'
import { LESSON_BLOCKS, blockSnippet, figureSnippet, headingSnippet, mathSnippet, problemsSnippet, tableSnippet } from '../../lib/lessonMarkup'
import ProblemSearch from './ProblemSearch'

const CHIP = 'inline-flex min-h-11 shrink-0 items-center rounded-full border-2 border-tp-ink bg-tp-surface px-3 text-sm font-semibold hover:bg-tp-yellow-soft'

// OPCIÓN B — a block palette in a column beside the text (a strip that
// scrolls sideways on phones), grouped by kind. The problem picker opens in a
// modal window. `insert(build)` comes from the editor.
export default function ToolbarB({ insert }) {
  const dialog = useRef(null)
  const groups = [
    { title: 'Cajas', items: LESSON_BLOCKS.map((block) => ({ label: block.label, build: (selected) => blockSnippet(block.kind, selected) })) },
    { title: 'Estructura', items: [
      { label: 'Sección', build: (selected) => headingSnippet(2, selected) },
      { label: 'Subsección', build: (selected) => headingSnippet(3, selected) },
      { label: 'Figura', build: figureSnippet },
      { label: 'Tabla', build: tableSnippet },
    ] },
    { title: 'Matemáticas', items: [{ label: '$ LaTeX', aria: 'Insertar matemáticas en línea ($…$)', build: mathSnippet }] },
  ]

  return (
    <nav aria-label="Insertar formato" className="flex min-w-0 gap-4 overflow-x-auto pb-2 md:w-48 md:shrink-0 md:flex-col md:overflow-visible md:pb-0">
      {groups.map((group) => (
        <section key={group.title} aria-label={group.title} className="flex shrink-0 gap-2 md:flex-col">
          <h3 className="hidden text-xs font-black uppercase tracking-[0.12em] text-tp-ink-muted md:block">{group.title}</h3>
          <div className="flex gap-2 md:flex-wrap">
            {group.items.map((item) => <button key={item.label} type="button" aria-label={item.aria} onClick={() => insert(item.build)} className={CHIP}>{item.label}</button>)}
          </div>
        </section>
      ))}
      <section aria-label="Problemas" className="flex shrink-0 gap-2 md:flex-col">
        <h3 className="hidden text-xs font-black uppercase tracking-[0.12em] text-tp-ink-muted md:block">Problemas</h3>
        <button type="button" onClick={() => { dialog.current?.showModal(); dialog.current?.querySelector('input[type=search]')?.focus() }} className={`${CHIP} bg-tp-violet-soft`}>Buscar problemas…</button>
      </section>
      <dialog ref={dialog} aria-labelledby="buscar-problemas-titulo" className="tp-card m-auto w-[min(640px,calc(100vw-32px))] max-h-[85vh] overflow-y-auto bg-tp-paper p-5 text-tp-ink backdrop:bg-tp-ink/40 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="buscar-problemas-titulo" className="font-display text-[22px] font-extrabold">Insertar problemas</h2>
          <button type="button" onClick={() => dialog.current?.close()} className="min-h-11 px-2 font-semibold underline underline-offset-2">Cerrar</button>
        </div>
        <ProblemSearch layout="cards" onInsert={(codes, kind) => { insert(() => problemsSnippet(codes, kind)); dialog.current?.close() }} />
      </dialog>
    </nav>
  )
}
