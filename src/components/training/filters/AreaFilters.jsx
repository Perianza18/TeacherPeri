import { countLabel, pathOf } from './areaTree'
import { KeywordSearch, MoreFilters } from './FilterParts'

const PILL = 'min-h-9 rounded-full border-2 border-tp-ink px-3 text-sm transition-colors'
const pillState = (active) => active ? 'bg-tp-ink font-bold text-white' : 'bg-tp-surface font-semibold hover:bg-tp-yellow-soft'

// Library filters: one card above the results with «Palabras clave», then
// the four áreas as big tiles. Choosing one opens a second row with its
// subtemas. The results use the full width below.
// `choose(área, subtema)` sets both at once; '' clears them.
export default function AreaFilters({ tree, filters, change, choose, categories, showFolders }) {
  const [area, subtopic] = pathOf(tree, filters.area, filters.topics)

  return (
    <div className="tp-card-soft flex flex-col gap-6 bg-tp-surface p-5 sm:p-6">
      <KeywordSearch value={filters.q} onChange={(value) => change('q', value)} tree={tree} onPick={(match) => { choose(match.area, match.topic); change('q', '') }} />

      <div>
        <p className="text-sm font-bold text-tp-ink">Área</p>
        {tree.error && <p role="alert" className="tp-card-quiet mt-2 bg-tp-orange-soft px-3 py-2 text-sm font-semibold">No fue posible cargar los subtemas. Las áreas siguen funcionando.</p>}
        <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4">
          {tree.main.map((entry) => {
            const active = area?.name === entry.name
            return (
              <button key={entry.name} type="button" aria-pressed={active} onClick={() => choose(active ? '' : entry.name, '')} className={`flex min-h-[64px] items-center gap-3 rounded-[12px] border-2 border-tp-ink px-3 py-2.5 text-left transition-transform ${active ? `${entry.color} -translate-y-0.5 shadow-[4px_4px_0_var(--tp-ink)]` : 'bg-tp-surface hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--tp-ink)]'}`}>
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
              const active = area?.name === topic.name
              return <button key={topic.name} type="button" aria-pressed={active} onClick={() => choose(active ? '' : topic.name, '')} className={`${PILL} text-xs ${pillState(active)}`}>{topic.name}{countLabel(topic.count)}</button>
            })}
          </div>
        )}
      </div>

      {area && area.children.length > 0 && (
        <div className="rounded-[12px] border-2 border-dashed border-tp-ink bg-tp-paper p-4">
          <p className="text-sm font-bold text-tp-ink">Subtemas de {area.name}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" aria-pressed={!subtopic} onClick={() => choose(area.name, '')} className={`${PILL} ${pillState(!subtopic)}`}>Todo {area.name}</button>
            {area.children.map((child) => {
              const active = subtopic && String(subtopic.id) === String(child.id)
              return <button key={child.id} type="button" aria-pressed={Boolean(active)} onClick={() => choose(area.name, active ? '' : child.id)} className={`${PILL} ${pillState(active)}`}>{child.name}{countLabel(child.count)}</button>
            })}
          </div>
        </div>
      )}

      {showFolders && <MoreFilters categories={categories} value={filters.categories} onChange={(ids) => change('categories', ids)} />}
    </div>
  )
}
