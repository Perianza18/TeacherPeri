import { useId, useState } from 'react'
import { folderPathNames, normalize } from '../../lib/submissions'

// Folder filter for the Problemas library: type part of a folder's path
// («OMM Estatal», «Jalisco 2023») and add it as a chip. The server includes
// every subfolder, so «OMM Estatal» shows all states and years, and «Jalisco»
// narrows it down.
export default function FolderFilter({ categories, value, onChange }) {
  const id = useId()
  const [query, setQuery] = useState('')
  const label = (folderId) => folderPathNames(folderId, categories).join(' › ')
  const wanted = normalize(query)
  // Folders whose own name matches come first, then the shallower ones:
  // «jalisco» suggests «… › Jalisco» before «… › Jalisco › 2023».
  const rank = (folder) => [normalize(folder.name).includes(wanted) ? 0 : 1, folderPathNames(folder._id, categories).length]
  const suggestions = wanted
    ? categories
      .filter((folder) => !value.includes(folder._id) && normalize(folderPathNames(folder._id, categories).join(' ')).includes(wanted))
      .sort((a, b) => rank(a)[0] - rank(b)[0] || rank(a)[1] - rank(b)[1])
      .slice(0, 8)
    : []
  const add = (folderId) => { onChange([...value, folderId]); setQuery('') }

  return (
    <div className="mt-4">
      <label htmlFor={id} className="text-sm font-bold text-tp-ink-soft">Carpeta o examen</label>
      {value.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2" aria-label="Carpetas elegidas">
          {value.map((folderId) => (
            <li key={folderId} className="tp-pill bg-tp-yellow-soft text-sm">
              {label(folderId) || 'Carpeta'}
              <button type="button" onClick={() => onChange(value.filter((item) => item !== folderId))} aria-label={`Quitar ${label(folderId)}`} className="grid h-6 w-6 place-items-center rounded-full hover:bg-tp-surface">×</button>
            </li>
          ))}
        </ul>
      )}
      {/* type="text": the library's main search stays the page's only searchbox. */}
      <input
        id={id}
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); if (suggestions[0]) add(suggestions[0]._id) } }}
        placeholder="Por ejemplo: OMM Estatal o Jalisco"
        autoComplete="off"
        className="tp-input mt-2"
      />
      {suggestions.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1.5" aria-label="Carpetas que coinciden">
          {suggestions.map((folder) => (
            <li key={folder._id}>
              <button type="button" onClick={() => add(folder._id)} className="min-h-11 w-full rounded-lg border-2 border-tp-ink bg-tp-surface px-3 py-2 text-left text-sm hover:bg-tp-yellow">{label(folder._id)}</button>
            </li>
          ))}
        </ul>
      )}
      {wanted && suggestions.length === 0 && <p className="mt-2 text-sm text-tp-ink-muted">No hay carpetas con ese nombre.</p>}
    </div>
  )
}
