import { createPortal } from 'react-dom'
import { useCallback, useEffect, useId, useState } from 'react'
import { useAuth } from '../../context/useAuth'
import useDialog from '../../hooks/useDialog'
import { apiFetch } from '../../lib/api'
import { plural } from '../../lib/profile'
import { ListNameForm } from './ListsPanel'

function SaveDialog({ itemType, itemId, token, onClose }) {
  const id = useId()
  const close = useCallback(() => onClose(), [onClose])
  const ref = useDialog(close)
  const [state, setState] = useState({ lists: null, error: null })
  const [creating, setCreating] = useState(false)
  const [busy, setBusy] = useState(null)

  const load = useCallback(() => apiFetch(`/api/my-lists/containing?itemType=${itemType}&item=${itemId}`, { token })
    .then((data) => setState({ lists: data.items, error: null }))
    .catch((error) => setState({ lists: [], error: error.message })), [itemType, itemId, token])
  useEffect(() => { load() }, [load])

  const toggle = async (list) => {
    setBusy(list.id)
    try {
      if (list.contains) await apiFetch(`/api/my-lists/${list.id}/items/${itemType}/${itemId}`, { method: 'DELETE', token })
      else await apiFetch(`/api/my-lists/${list.id}/items`, { method: 'POST', token, body: { itemType, item: itemId } })
      await load()
    } catch (error) {
      setState((s) => ({ ...s, error: error.message }))
    } finally {
      setBusy(null)
    }
  }

  const create = async (body) => {
    const list = await apiFetch('/api/my-lists', { method: 'POST', token, body })
    await apiFetch(`/api/my-lists/${list.id}/items`, { method: 'POST', token, body: { itemType, item: itemId } })
    setCreating(false)
    await load()
  }

  return createPortal((
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-tp-ink/40 sm:items-center sm:p-6" onPointerDown={(event) => { if (event.target === event.currentTarget) close() }}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} className="tp-card max-h-[90vh] w-full max-w-[480px] overflow-y-auto bg-tp-surface p-6 font-sans text-tp-ink">
        <h2 id={`${id}-title`} className="font-display text-[22px] font-extrabold tracking-[-0.02em]">Guardar en lista</h2>
        {state.lists == null ? <p className="mt-4 text-tp-ink-muted">Cargando tus listas…</p> : (
          <fieldset className="mt-4">
            <legend className="sr-only">Tus listas</legend>
            {state.lists.length === 0 && !creating && <p className="text-tp-ink-soft">Aún no tienes listas. Crea la primera.</p>}
            <ul className="flex flex-col">
              {state.lists.map((list) => (
                <li key={list.id} className="border-t-2 border-dashed border-tp-rule first:border-t-0">
                  <label className="flex min-h-12 cursor-pointer items-center gap-3 py-2">
                    <input type="checkbox" checked={list.contains} disabled={busy === list.id} onChange={() => toggle(list)} className="h-5 w-5 shrink-0 accent-tp-violet" />
                    <span className="min-w-0 flex-1 break-words font-semibold">{list.name}</span>
                    <span className="shrink-0 text-xs text-tp-ink-muted">{plural(list.count, 'elemento', 'elementos')} · {list.isPublic ? 'Pública' : 'Solo tú'}</span>
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        )}
        {state.error && <p role="alert" className="mt-3 text-sm font-semibold text-red-700">{state.error}</p>}
        <div className="mt-4 border-t-2 border-dashed border-tp-rule pt-4">
          {creating
            ? <ListNameForm submitLabel="Crear y guardar" withPrivacy onCancel={() => setCreating(false)} onSubmit={create} />
            : <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => setCreating(true)} className="tp-button bg-tp-mint px-4 text-sm font-bold text-tp-ink">Nueva lista</button>
              <button type="button" onClick={close} className="tp-button bg-tp-surface px-4 text-sm font-bold text-tp-ink">Listo</button>
            </div>}
        </div>
      </div>
    </div>
  ), document.body)
}

// «Guardar en lista» on a problem or a lesson. Signed out: opens sign-in.
export default function SaveToListButton({ itemType, itemId, className = '' }) {
  const { auth, abrirModal } = useAuth()
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => (auth ? setOpen(true) : abrirModal())} className={`tp-button bg-tp-surface px-4 text-sm font-bold text-tp-ink ${className}`}>Guardar en lista</button>
      {open && auth && <SaveDialog itemType={itemType} itemId={itemId} token={auth.token} onClose={() => setOpen(false)} />}
    </>
  )
}
