import { countLabel, pathOf } from './areaTree'
import { KeywordSearch, LevelPicker, MoreFilters } from './FilterParts'

// Option B · «Pasos arriba». One card above the results: palabras clave and
// nivel, then the four áreas as big tiles. Choosing one opens a second row
// with its subtemas. Everything stays in one place and the results use the
// full width.
export default function OptionSteps({ tree, filters, change, categories, showFolders }) {
  const selected = pathOf(tree, filters.topics)
  const area = selected[0]
  const pick = (id) => change('topics', id)

  return (
    <div className="tp-card-soft flex flex-col gap-6 bg-tp-surface p-5 sm:p-6">
      <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-start">
        <KeywordSearch value={filters.q} onChange={(value) => change('q', value)} tree={tree} onPickTopic={(id) => { pick(id); change('q', '') }} />
        <LevelPicker value={filters.level} onChange={(value) => change('level', value)} />
      </div>

      <div>
        <p className="text-sm font-bold text-tp-ink">Área</p>
        <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4">
          {tree.main.map((entry) => {
            const active = area && String(area.id) === String(entry.id)
            return (
              <button key={entry.id} type="button" aria-pressed={active} onClick={() => pick(active ? '' : entry.id)} className={`flex min-h-[64px] items-center gap-3 rounded-[12px] border-2 border-tp-ink px-3 py-2.5 text-left transition-transform ${active ? `${entry.color} -translate-y-0.5 shadow-[4px_4px_0_var(--tp-ink)]` : 'bg-tp-surface hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--tp-ink)]'}`}>
                <span aria-hidden="true" className={`grid size-9 shrink-0 place-items-center rounded-lg border-2 border-tp-ink bg-tp-surface text-sm font-extrabold ${active ? '' : entry.color}`}>{entry.glyph}</span>
                <span className="min-w-0">
                  <span className="block font-display text-[16px] font-extrabold leading-tight">{entry.name}</span>
                  {entry.count !== null && <span className="text-xs font-semibold text-tp-ink-muted">{entry.count === 1 ? '1 resultado' : `${entry.count} resultados`}</span>}
                </span>
              </button>
            )
          })}
        </div>
        {tree.others.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-tp-ink-muted">Otros temas:</span>
            {tree.others.map((topic) => {
              const active = area && String(area.id) === String(topic.id)
              return <button key={topic.id} type="button" aria-pressed={active} onClick={() => pick(active ? '' : topic.id)} className={`min-h-9 rounded-full border-2 border-tp-ink px-3 text-xs font-bold transition-colors ${active ? 'bg-tp-ink text-white' : 'bg-tp-surface hover:bg-tp-yellow-soft'}`}>{topic.name}{countLabel(topic.count)}</button>
            })}
          </div>
        )}
      </div>

      {area && area.children.length > 0 && (
        <div className="rounded-[12px] border-2 border-dashed border-tp-ink bg-tp-paper p-4">
          <p className="text-sm font-bold text-tp-ink">Subtemas de {area.name}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" aria-pressed={selected.length === 1} onClick={() => pick(area.id)} className={`min-h-9 rounded-full border-2 border-tp-ink px-3 text-sm font-bold transition-colors ${selected.length === 1 ? 'bg-tp-ink text-white' : 'bg-tp-surface hover:bg-tp-yellow-soft'}`}>Todo {area.name}</button>
            {area.children.map((child) => {
              const active = String(filters.topics) === String(child.id)
              return <button key={child.id} type="button" aria-pressed={active} onClick={() => pick(active ? area.id : child.id)} className={`min-h-9 rounded-full border-2 border-tp-ink px-3 text-sm font-semibold transition-colors ${active ? 'bg-tp-ink text-white' : 'bg-tp-surface hover:bg-tp-yellow-soft'}`}>{child.name}{countLabel(child.count)}</button>
            })}
          </div>
        </div>
      )}

      {showFolders && <MoreFilters categories={categories} value={filters.categories} onChange={(ids) => change('categories', ids)} />}
    </div>
  )
}
