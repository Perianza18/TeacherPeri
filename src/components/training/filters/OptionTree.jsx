import { useState } from 'react'
import { countLabel, pathOf } from './areaTree'
import { LevelPicker, MoreFilters } from './FilterParts'

// Option A · «Árbol lateral». A sidebar with the área tree: click
// «Geometría» to open it and see its subtemas; click a subtema to narrow down.
// Nivel and the exam folders sit below. On a phone the sidebar comes first,
// folded into «Filtrar».
export default function OptionTree({ tree, filters, change, categories, showFolders }) {
  const selected = pathOf(tree, filters.topics)
  const [open, setOpen] = useState(null)
  const expanded = open ?? (selected[0] ? String(selected[0].id) : null)
  const pick = (id) => change('topics', id)
  const toggleArea = (area) => {
    const id = String(area.id)
    if (expanded === id && String(filters.topics) === id) { setOpen(''); pick(''); return }
    setOpen(id)
    pick(area.id)
  }

  const areaRow = (area) => {
    const id = String(area.id)
    const isOpen = expanded === id
    const isSelected = String(filters.topics) === id
    return (
      <li key={id}>
        <button type="button" onClick={() => toggleArea(area)} aria-expanded={area.children.length > 0 ? isOpen : undefined} aria-pressed={isSelected} className={`flex min-h-11 w-full items-center gap-3 rounded-[10px] border-2 px-2.5 text-left text-[15px] font-bold transition-colors ${isSelected ? 'border-tp-ink bg-tp-yellow shadow-[3px_3px_0_var(--tp-ink)]' : 'border-transparent hover:border-tp-ink hover:bg-tp-paper'}`}>
          <span aria-hidden="true" className={`grid size-7 shrink-0 place-items-center rounded-md border-2 border-tp-ink text-xs font-extrabold ${area.color}`}>{area.glyph || '•'}</span>
          <span className="min-w-0 flex-1">{area.name}</span>
          {area.count !== null && <span className="text-xs font-semibold text-tp-ink-muted">{area.count}</span>}
          {area.children.length > 0 && <span aria-hidden="true" className={`text-xs transition-transform ${isOpen ? 'rotate-90' : ''}`}>▶</span>}
        </button>
        {isOpen && area.children.length > 0 && (
          <ul className="mb-2 ml-[22px] mt-1 flex flex-col gap-0.5 border-l-2 border-dashed border-tp-rule pl-3">
            {area.children.map((child) => {
              const active = String(filters.topics) === String(child.id)
              return (
                <li key={child.id}>
                  <button type="button" onClick={() => pick(active ? area.id : child.id)} aria-pressed={active} className={`flex min-h-10 w-full items-center justify-between gap-2 rounded-lg px-2.5 text-left text-sm transition-colors ${active ? 'bg-tp-ink font-bold text-white' : 'hover:bg-tp-yellow-soft'}`}>
                    <span>{child.name}</span>
                    {child.count !== null && <span className={`text-xs ${active ? 'text-white' : 'text-tp-ink-muted'}`}>{child.count}</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </li>
    )
  }

  const panel = (
    <div className="flex flex-col gap-6">
      <nav aria-label="Áreas y subtemas">
        <p className="tp-kicker">Área</p>
        <ul className="mt-3 flex flex-col gap-1">
          <li>
            <button type="button" onClick={() => { setOpen(''); pick('') }} aria-pressed={!filters.topics} className={`flex min-h-11 w-full items-center rounded-[10px] border-2 px-2.5 text-left text-[15px] font-bold transition-colors ${!filters.topics ? 'border-tp-ink bg-tp-yellow shadow-[3px_3px_0_var(--tp-ink)]' : 'border-transparent hover:border-tp-ink hover:bg-tp-paper'}`}>Todas las áreas</button>
          </li>
          {tree.main.map(areaRow)}
        </ul>
        {tree.others.length > 0 && <>
          <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.12em] text-tp-ink-muted">Otros temas</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {tree.others.map((topic) => {
              const active = String(filters.topics) === String(topic.id)
              return <li key={topic.id}><button type="button" onClick={() => pick(active ? '' : topic.id)} aria-pressed={active} className={`min-h-9 rounded-full border-2 border-tp-ink px-3 text-xs font-bold transition-colors ${active ? 'bg-tp-ink text-white' : 'bg-tp-surface hover:bg-tp-yellow-soft'}`}>{topic.name}{countLabel(topic.count)}</button></li>
            })}
          </ul>
        </>}
      </nav>
      <LevelPicker value={filters.level} onChange={(value) => change('level', value)} />
      {showFolders && <MoreFilters categories={categories} value={filters.categories} onChange={(ids) => change('categories', ids)} />}
    </div>
  )

  return (
    <aside className="tp-card-soft h-fit bg-tp-surface p-5">
      {/* Phones: folded so the results are one tap away. */}
      <details className="lg:hidden">
        <summary className="flex min-h-11 cursor-pointer items-center text-[15px] font-bold">Filtrar por área y nivel{selected.length ? ` · ${selected.map((n) => n.name).join(' › ')}` : ''}</summary>
        <div className="mt-4">{panel}</div>
      </details>
      <div className="hidden lg:block">{panel}</div>
    </aside>
  )
}
