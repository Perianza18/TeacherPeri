import { useId, useState } from 'react'
import { RESERVED_TAG_SLUGS, normalize } from '../../lib/submissions'

// Type-ahead over the EXISTING áreas (Topics) and tags. People can only pick;
// nothing here creates a new term. Staff screens pass `allowReserved` to
// offer the tags only the team applies («Original TeacherPeri»).
export default function VocabularyPicker({ topics, tags, value, onChange, allowReserved = false, help = 'Elige de la lista existente. Para aprobarlo hace falta al menos un área.' }) {
  const id = useId()
  const [query, setQuery] = useState('')
  const options = [
    ...topics.map((topic) => ({ kind: 'topics', id: String(topic._id), label: topic.name, group: 'Área' })),
    ...tags.filter((tag) => allowReserved || !RESERVED_TAG_SLUGS.includes(tag.slug)).map((tag) => ({ kind: 'tags', id: String(tag._id), label: tag.label, group: 'Etiqueta' })),
  ]
  const chosen = options.filter((option) => value[option.kind].includes(option.id))
  const wanted = normalize(query)
  const suggestions = options.filter((option) => !value[option.kind].includes(option.id) && (!wanted || normalize(option.label).includes(wanted))).slice(0, 8)

  const add = (option) => {
    onChange({ ...value, [option.kind]: [...value[option.kind], option.id] })
    setQuery('')
  }
  const remove = (option) => onChange({ ...value, [option.kind]: value[option.kind].filter((item) => item !== option.id) })

  return (
    <div>
      <label htmlFor={id} className="text-sm font-bold text-tp-ink">Áreas y etiquetas</label>
      <p id={`${id}-ayuda`} className="mt-1 text-sm text-tp-ink-muted">{help}</p>
      {chosen.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Elegidas">
          {chosen.map((option) => (
            <li key={`${option.kind}-${option.id}`} className={`tp-pill ${option.kind === 'topics' ? 'bg-tp-sky-soft' : 'bg-tp-violet-soft'}`}>
              <span><span className="sr-only">{option.group}: </span>{option.label}</span>
              <button type="button" onClick={() => remove(option)} aria-label={`Quitar ${option.label}`} className="grid h-6 w-6 place-items-center rounded-full hover:bg-tp-surface">×</button>
            </li>
          ))}
        </ul>
      )}
      <input
        id={id}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); if (suggestions[0]) add(suggestions[0]) } }}
        placeholder="Escribe para buscar: Geometría, Álgebra…"
        aria-describedby={`${id}-ayuda`}
        autoComplete="off"
        className="tp-input mt-3"
      />
      {suggestions.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2" aria-label="Sugerencias">
          {suggestions.map((option) => (
            <li key={`${option.kind}-${option.id}`}>
              <button type="button" onClick={() => add(option)} className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-dashed border-tp-ink bg-tp-surface px-3 text-sm font-semibold hover:bg-tp-yellow-soft">
                <span className="text-xs font-bold uppercase tracking-wider text-tp-ink-muted">{option.group}</span>{option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      {query && suggestions.length === 0 && <p className="mt-2 text-sm text-tp-ink-muted">No hay un área o etiqueta con ese nombre.</p>}
    </div>
  )
}
