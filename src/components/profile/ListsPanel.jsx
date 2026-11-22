import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import { plural } from '../../lib/profile'
import { usePanelData } from '../../hooks/usePanelData'
import { EmptyCard, LINK, PanelStatus, SoloTu } from './shared'

const ACTION = `${LINK} inline-flex min-h-11 items-center text-sm`

// Small form for a list name: used by «Nueva lista» and «Renombrar».
export function ListNameForm({ initial = '', submitLabel, withPrivacy = false, onSubmit, onCancel }) {
  const id = useId()
  const [name, setName] = useState(initial)
  const [isPublic, setIsPublic] = useState(false)
  const [state, setState] = useState({ busy: false, error: null })
  const submit = async (event) => {
    event.preventDefault()
    setState({ busy: true, error: null })
    try {
      await onSubmit({ name, ...(withPrivacy ? { isPublic } : {}) })
    } catch (error) {
      setState({ busy: false, error: error.message })
    }
  }
  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <label htmlFor={`${id}-name`} className="text-sm font-bold">Nombre de la lista</label>
      <input id={`${id}-name`} value={name} onChange={(e) => setName(e.target.value)} maxLength={80} required autoFocus className="tp-input" placeholder="Por ejemplo: Geometría para el estatal" />
      {withPrivacy && (
        <label className="flex min-h-11 items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="h-5 w-5 accent-tp-violet" />
          Pública (cualquiera la ve en tu perfil)
        </label>
      )}
      {state.error && <p role="alert" className="text-sm font-semibold text-red-700">{state.error}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={state.busy || !name.trim()} className="tp-button bg-tp-mint px-4 text-sm font-bold text-tp-ink disabled:opacity-60">{submitLabel}</button>
        <button type="button" onClick={onCancel} className="min-h-11 px-1 text-sm font-semibold text-tp-ink-muted underline underline-offset-2">Cancelar</button>
      </div>
    </form>
  )
}

function ListCard({ list, owner, token, onChanged }) {
  const [mode, setMode] = useState(null)
  const [error, setError] = useState(null)
  const call = async (method, body) => {
    setError(null)
    try {
      await apiFetch(`/api/my-lists/${list.id}`, { method, token, body })
      setMode(null)
      onChanged()
    } catch (err) {
      setError(err.message)
    }
  }
  return (
    <li className="tp-card-soft flex flex-col gap-2 bg-tp-surface p-5">
      {mode === 'rename'
        ? <ListNameForm initial={list.name} submitLabel="Guardar" onCancel={() => setMode(null)} onSubmit={({ name }) => apiFetch(`/api/my-lists/${list.id}`, { method: 'PATCH', token, body: { name } }).then(() => { setMode(null); onChanged() })} />
        : <>
          <Link to={list.href} className="break-words font-display text-[19px] font-extrabold leading-tight hover:text-tp-violet">{list.name}</Link>
          <p className="flex flex-wrap items-center gap-2 text-sm text-tp-ink-muted">
            {plural(list.count, 'elemento', 'elementos')}
            {list.isPublic ? <span>· Pública</span> : <SoloTu />}
          </p>
        </>}
      {owner && mode !== 'rename' && (
        <div className="mt-1 flex flex-wrap gap-x-4 border-t-2 border-dashed border-tp-rule pt-2">
          <button type="button" className={ACTION} onClick={() => setMode('rename')}>Renombrar</button>
          <button type="button" className={ACTION} onClick={() => call('PATCH', { isPublic: !list.isPublic })}>{list.isPublic ? 'Hacer privada' : 'Hacer pública'}</button>
          {mode === 'delete'
            ? <span className="flex flex-wrap items-center gap-x-3 text-sm">
              <span className="font-semibold">¿Eliminar la lista?</span>
              <button type="button" className="min-h-11 font-bold text-red-700 underline underline-offset-2" onClick={() => call('DELETE')}>Sí, eliminar</button>
              <button type="button" className="min-h-11 font-semibold text-tp-ink-muted underline underline-offset-2" onClick={() => setMode(null)}>No</button>
            </span>
            : <button type="button" className={`${ACTION} text-red-700`} onClick={() => setMode('delete')}>Eliminar</button>}
        </div>
      )}
      {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}
    </li>
  )
}

export default function ListsPanel({ profile, token }) {
  const [reload, setReload] = useState(0)
  const [creating, setCreating] = useState(false)
  const { data, error, loading } = usePanelData(`/api/profiles/${encodeURIComponent(profile.username)}/lists`, token, reload)
  const refresh = () => setReload((n) => n + 1)
  const owner = profile.isOwner
  return (
    <div className="flex flex-col gap-4">
      {owner && (creating
        ? <div className="tp-card-soft bg-tp-surface p-5"><ListNameForm submitLabel="Crear lista" withPrivacy onCancel={() => setCreating(false)} onSubmit={(body) => apiFetch('/api/my-lists', { method: 'POST', token, body }).then(() => { setCreating(false); refresh() })} /></div>
        : <button type="button" onClick={() => setCreating(true)} className="tp-button self-start bg-tp-mint px-5 font-bold text-tp-ink">Nueva lista</button>)}
      {(loading || error) ? <PanelStatus loading={loading} error={error} /> : data.items.length === 0
        ? <EmptyCard kicker="Sin listas">{owner ? 'Crea una lista y usa «Guardar en lista» en problemas y lecciones de teoría.' : `@${profile.username} no tiene listas públicas.`}</EmptyCard>
        : <ul className="grid gap-4 sm:grid-cols-2">{data.items.map((list) => <ListCard key={list.id} list={list} owner={owner} token={token} onChanged={refresh} />)}</ul>}
    </div>
  )
}
