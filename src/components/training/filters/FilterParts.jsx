import { useId } from 'react'
import FolderFilter from '../FolderFilter'
import { folderPathNames } from '../../../lib/submissions'
import { LEVELS, countLabel, matchingTopics, pathOf } from './areaTree'

// «Palabras clave»: one search box. The server ignores accents and capitals,
// and also looks in subtema names. While typing, matching áreas and subtemas
// appear as shortcuts to that branch of the tree.
export function KeywordSearch({ value, onChange, tree, onPickTopic, label = 'Palabras clave', className = '' }) {
  const id = useId()
  const suggestions = matchingTopics(tree, value)
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-bold text-tp-ink">{label}</label>
      <input id={id} type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Por ejemplo: triangulo, mcd, paridad" className="tp-input mt-2 bg-tp-paper" autoComplete="off" />
      <p className="mt-1.5 text-xs text-tp-ink-muted">No importan los acentos ni las mayúsculas.</p>
      {suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-2" aria-label="Temas que coinciden">
          <span className="text-xs font-bold text-tp-ink-muted">Ir al tema:</span>
          {suggestions.map((topic) => (
            <button key={topic.id} type="button" onClick={() => onPickTopic(topic.id)} className="tp-pill min-h-9 bg-tp-surface px-3 py-1 text-xs transition-colors hover:bg-tp-yellow">
              {topic.label}{countLabel(topic.count)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Nivel as four pills (Todos, Básico, Intermedio, Avanzado).
export function LevelPicker({ value, onChange, className = '' }) {
  return (
    <fieldset className={className}>
      <legend className="text-sm font-bold text-tp-ink">Nivel</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {[['', 'Todos'], ...Object.entries(LEVELS)].map(([id, name]) => (
          <button key={id || 'todos'} type="button" aria-pressed={value === id} onClick={() => onChange(id)} className={`min-h-9 rounded-full border-2 border-tp-ink px-3 text-xs font-bold transition-colors ${value === id ? 'bg-tp-ink text-white' : 'bg-tp-surface hover:bg-tp-yellow-soft'}`}>{name}</button>
        ))}
      </div>
    </fieldset>
  )
}

// Exam folders (Problemas only), folded away: most students filter by área.
export function MoreFilters({ categories, value, onChange }) {
  return (
    <details className="group rounded-[12px] border-2 border-dashed border-tp-ink bg-tp-paper px-4 py-3" open={value.length > 0 || undefined}>
      <summary className="cursor-pointer text-sm font-bold">Buscar por examen o carpeta{value.length > 0 ? ` (${value.length})` : ''}</summary>
      <FolderFilter categories={categories} value={value} onChange={onChange} />
    </details>
  )
}

// The filters in use, each removable, plus «Limpiar todo».
export function ActiveFilters({ tree, filters, categories, change, onClear }) {
  const path = pathOf(tree, filters.topics)
  const chips = [
    path.length > 0 && { key: 'area', label: path.map((node) => node.name).join(' › '), remove: () => change('topics', '') },
    filters.q.trim() && { key: 'q', label: `«${filters.q.trim()}»`, remove: () => change('q', '') },
    filters.level && { key: 'level', label: LEVELS[filters.level], remove: () => change('level', '') },
    ...filters.categories.map((id) => ({ key: id, label: folderPathNames(id, categories).join(' › ') || 'Carpeta', remove: () => change('categories', filters.categories.filter((c) => c !== id)) })),
  ].filter(Boolean)
  if (!chips.length) return null
  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Filtros activos">
      {chips.map((chip) => (
        <span key={chip.key} className="tp-pill bg-tp-yellow-soft py-1 text-sm">
          {chip.label}
          <button type="button" onClick={chip.remove} aria-label={`Quitar ${chip.label}`} className="grid h-6 w-6 place-items-center rounded-full hover:bg-tp-surface">×</button>
        </span>
      ))}
      <button type="button" onClick={onClear} className="text-sm font-bold text-tp-violet underline underline-offset-2">Limpiar todo</button>
    </div>
  )
}
