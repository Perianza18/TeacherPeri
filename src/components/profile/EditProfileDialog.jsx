import { createPortal } from 'react-dom'
import { useCallback, useId, useState } from 'react'
import useDialog from '../../hooks/useDialog'
import { AVATARS } from '../../lib/avatars'
import { apiFetch } from '../../lib/api'
import Avatar from './Avatar'

const BIO_MAX = 160

// «Editar perfil»: pick a preset avatar and write a short description.
export default function EditProfileDialog({ profile, token, onSaved, onClose }) {
  const id = useId()
  const close = useCallback(() => onClose(), [onClose])
  const ref = useDialog(close)
  const [avatar, setAvatar] = useState(profile.avatar)
  const [bio, setBio] = useState(profile.bio || '')
  const [state, setState] = useState({ saving: false, error: null })

  const submit = async (event) => {
    event.preventDefault()
    setState({ saving: true, error: null })
    try {
      const saved = await apiFetch('/api/profiles/me', { method: 'PUT', token, body: { avatar, bio } })
      onSaved(saved)
    } catch (error) {
      setState({ saving: false, error: error.message })
    }
  }

  return createPortal((
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-tp-ink/40 p-0 sm:items-center sm:p-6" onPointerDown={(event) => { if (event.target === event.currentTarget) close() }}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} className="tp-card max-h-[92vh] w-full max-w-[560px] overflow-y-auto bg-tp-surface p-6 sm:p-7">
        <h2 id={`${id}-title`} className="font-display text-[22px] font-extrabold tracking-[-0.02em]">Editar perfil</h2>
        <form onSubmit={submit} className="mt-5 flex flex-col gap-5">
          <fieldset>
            <legend className="text-sm font-bold">Elige tu avatar</legend>
            <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
              {AVATARS.map((option) => (
                <label key={option.id} className="relative grid cursor-pointer place-items-center rounded-full p-1 has-[:checked]:outline has-[:checked]:outline-[3px] has-[:checked]:outline-tp-violet has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-tp-violet">
                  <input type="radio" name={`${id}-avatar`} value={option.id} checked={avatar === option.id} onChange={() => setAvatar(option.id)} className="sr-only" />
                  <Avatar id={option.id} size="md" label={option.name} />
                </label>
              ))}
            </div>
          </fieldset>
          <div className="flex flex-col gap-2">
            <label htmlFor={`${id}-bio`} className="text-sm font-bold">Descripción corta</label>
            <textarea id={`${id}-bio`} value={bio} onChange={(event) => setBio(event.target.value)} rows={3} maxLength={BIO_MAX} placeholder="Por ejemplo: me preparo para la OMM y me gusta la geometría." className="tp-input" aria-describedby={`${id}-count`} />
            <p id={`${id}-count`} className="text-right text-xs text-tp-ink-muted">{bio.length}/{BIO_MAX}</p>
          </div>
          {state.error && <p role="alert" className="text-sm font-semibold text-red-700">{state.error}</p>}
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={state.saving} className="tp-button bg-tp-mint px-5 font-bold text-tp-ink disabled:opacity-60">{state.saving ? 'Guardando…' : 'Guardar'}</button>
            <button type="button" onClick={close} className="min-h-11 px-1 font-semibold text-tp-ink-muted underline underline-offset-2">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  ), document.body)
}
