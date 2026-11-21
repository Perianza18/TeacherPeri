import { useId, useState } from 'react'
import { apiFetch } from '../../lib/api'
import { folderPathNames, normalize } from '../../lib/submissions'

// Browse the exam folder tree («Exámenes › OMM Estatal › Jalisco › 2023»),
// pick a folder, or create a subfolder that stays «En revisión» until an
// admin approves it. `folders` comes from GET /api/submissions/folders.
// `allowCreate={false}` hides «Crear carpeta» (the editor screen only moves
// problems into approved folders).
export default function ExamFolderPicker({ folders, value, onChange, onFolderCreated, token, allowCreate = true }) {
  const id = useId()
  const root = folders.find((folder) => !folder.parent)
  const selected = folders.find((folder) => String(folder._id) === String(value)) || null
  const current = selected || root
  const [search, setSearch] = useState('')
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState(null)

  if (!root) return <p className="text-sm text-tp-ink-muted">Cargando carpetas…</p>

  const children = folders.filter((folder) => String(folder.parent) === String(current._id))
  const crumbs = []
  for (let cursor = current, guard = 0; cursor && guard < 50; guard += 1) {
    crumbs.unshift({ name: cursor.name, id: cursor._id })
    cursor = cursor.parent ? folders.find((folder) => String(folder._id) === String(cursor.parent)) : null
  }
  const wanted = normalize(search)
  const matches = wanted ? folders.filter((folder) => folder.parent && normalize(folderPathNames(folder._id, folders).slice(1).join(' ')).includes(wanted)).slice(0, 8) : []
  const choose = (folderId) => { onChange(String(folderId) === String(root._id) ? null : String(folderId)); setError(null) }

  // Not a <form>: this box sits inside the submission form.
  const create = async () => {
    if (!newName.trim() || creating) return
    setCreating(true)
    setError(null)
    try {
      const folder = await apiFetch('/api/submissions/folders', { method: 'POST', token, body: { name: newName, parent: current._id } })
      onFolderCreated(folder)
      onChange(String(folder._id))
      setNewName('')
    } catch (err) {
      setError(err.message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="tp-card-quiet bg-tp-surface p-4 sm:p-5">
      <p className="text-sm font-bold text-tp-ink">Carpeta del examen</p>
      <p className="mt-1 text-sm" aria-live="polite">
        {selected ? <><span className="text-tp-ink-muted">Elegida: </span><strong>{folderPathNames(selected._id, folders).slice(1).join(' › ')}</strong>{selected.reviewStatus === 'pending' && <span className="tp-pill ml-2 bg-tp-yellow-soft text-xs">En revisión</span>}</>
          : <span className="text-tp-ink-muted">Todavía no eliges carpeta. Entra hasta el año o la etapa del examen.</span>}
      </p>

      <label htmlFor={`${id}-buscar`} className="mt-4 block text-sm font-semibold text-tp-ink">Buscar carpeta</label>
      <input id={`${id}-buscar`} type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Por ejemplo: Jalisco 2023" autoComplete="off" className="tp-input mt-1" />
      {matches.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1.5">
          {matches.map((folder) => (
            <li key={folder._id}>
              <button type="button" onClick={() => { choose(folder._id); setSearch('') }} className="min-h-11 w-full rounded-[10px] border-2 border-dashed border-tp-ink px-3 py-2 text-left text-sm font-semibold hover:bg-tp-yellow-soft">
                {folderPathNames(folder._id, folders).slice(1).join(' › ')}{folder.reviewStatus === 'pending' && ' · en revisión'}
              </button>
            </li>
          ))}
        </ul>
      )}

      <nav aria-label="Ruta de carpetas" className="mt-4 flex flex-wrap items-center gap-1 text-sm">
        {crumbs.map((crumb, index) => (
          <span key={`${crumb.name}-${index}`} className="inline-flex items-center gap-1">
            {index > 0 && <span aria-hidden="true">›</span>}
            <button type="button" onClick={() => crumb.id && choose(crumb.id)} aria-current={index === crumbs.length - 1 ? 'true' : undefined} className={`min-h-11 rounded-lg px-2 font-semibold ${index === crumbs.length - 1 ? 'text-tp-ink underline decoration-tp-violet decoration-[3px] underline-offset-4' : 'text-tp-violet hover:underline'}`}>{crumb.name}</button>
          </span>
        ))}
      </nav>

      {children.length > 0 ? (
        <ul className="mt-2 flex flex-wrap gap-2" aria-label={`Carpetas dentro de ${current.name}`}>
          {children.map((folder) => (
            <li key={folder._id}>
              <button type="button" onClick={() => choose(folder._id)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-tp-ink bg-tp-paper px-3 text-sm font-semibold hover:bg-tp-yellow">
                {folder.name}{folder.reviewStatus === 'pending' && <span className="text-xs font-bold text-tp-ink-muted">· en revisión</span>} <span aria-hidden="true">→</span>
              </button>
            </li>
          ))}
        </ul>
      ) : <p className="mt-2 text-sm text-tp-ink-muted">«{current.name}» no tiene subcarpetas.</p>}

      {allowCreate && <>
      <div className="mt-4 flex flex-col gap-2 border-t-2 border-dashed border-tp-rule pt-4 sm:flex-row sm:items-end">
        <label className="flex-1 text-sm font-semibold text-tp-ink">
          ¿No está tu carpeta? Crea una dentro de «{current.name}»
          <input value={newName} onChange={(event) => setNewName(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); create() } }} maxLength={80} placeholder="Por ejemplo: Jalisco o 2023" className="tp-input mt-1 font-normal" />
        </label>
        <button type="button" onClick={create} disabled={creating || !newName.trim()} className="tp-button bg-tp-surface px-4 text-sm font-bold disabled:opacity-50">{creating ? 'Creando…' : 'Crear carpeta'}</button>
      </div>
      <p className="mt-2 text-xs text-tp-ink-muted">Las carpetas nuevas quedan en revisión; solo tú las ves hasta que se aprueben.</p>
      </>}
      {error && <p role="alert" className="mt-2 text-sm font-semibold text-red-700">{error}</p>}
    </div>
  )
}
