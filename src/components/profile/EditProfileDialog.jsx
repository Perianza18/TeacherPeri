import { createPortal } from 'react-dom'
import { useCallback, useId, useState } from 'react'
import useDialog from '../../hooks/useDialog'
import { AVATAR_COLORS, DRAWING_AVATARS, SHAPE_AVATARS, avatarById } from '../../lib/avatars'
import { apiFetch } from '../../lib/api'
import { FRAMES } from '../../lib/frames'
import Avatar from './Avatar'

const BIO_MAX = 160

// One option in a picker: a hidden radio button, so the arrow keys move
// through the group and a screen reader names each one, inside the tile you see.
function Option({ name, checked, onChange, children, shape = 'rounded-full', disabled = false }) {
  return (
    <label className={`relative grid place-items-center ${shape} p-1 has-[:checked]:outline has-[:checked]:outline-[3px] has-[:checked]:outline-tp-violet has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-tp-violet ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <input type="radio" name={name} checked={checked} onChange={onChange} disabled={disabled} className="sr-only" />
      {children}
    </label>
  )
}

// «Editar perfil»: pick a preset avatar (a drawing or a math shape), its
// background colour and one of the frames they have unlocked, and write a
// short description.
export default function EditProfileDialog({ profile, token, onSaved, onClose }) {
  const id = useId()
  const close = useCallback(() => onClose(), [onClose])
  const ref = useDialog(close)
  const [avatar, setAvatar] = useState(profile.avatar)
  const [avatarColor, setAvatarColor] = useState(profile.avatarColor ?? null)
  const [frame, setFrame] = useState(profile.frame ?? 'lapiz')
  const points = profile.level?.points ?? 0
  const [bio, setBio] = useState(profile.bio || '')
  const [state, setState] = useState({ saving: false, error: null })

  const submit = async (event) => {
    event.preventDefault()
    setState({ saving: true, error: null })
    try {
      const saved = await apiFetch('/api/profiles/me', { method: 'PUT', token, body: { avatar, avatarColor, frame, bio } })
      onSaved(saved)
    } catch (error) {
      setState({ saving: false, error: error.message })
    }
  }

  // Every option shows the colour chosen below, so you see the pair together.
  const avatarGroup = (title, options) => (
    <>
      <p aria-hidden="true" className="mt-3 text-xs font-black uppercase tracking-[0.12em] text-tp-ink-muted">{title}</p>
      <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6">
        {options.map((option) => (
          <Option key={option.id} name={`${id}-avatar`} checked={avatar === option.id} onChange={() => setAvatar(option.id)}>
            <Avatar id={option.id} color={avatarColor} size="picker" label={option.name} />
          </Option>
        ))}
      </div>
    </>
  )

  return createPortal((
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-tp-ink/40 p-0 sm:items-center sm:p-6" onPointerDown={(event) => { if (event.target === event.currentTarget) close() }}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} className="tp-card max-h-[92vh] w-full max-w-[560px] overflow-y-auto bg-tp-surface p-6 sm:p-7">
        <h2 id={`${id}-title`} className="font-display text-[22px] font-extrabold tracking-[-0.02em]">Editar perfil</h2>
        <form onSubmit={submit} className="mt-5 flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <Avatar id={avatar} color={avatarColor} frame={frame} size="lg" />
            <p className="text-sm leading-6 text-tp-ink-muted">Así se verá tu avatar en tu perfil, en la barra de arriba y en tus comentarios.</p>
          </div>
          <fieldset>
            <legend className="text-sm font-bold">Elige tu avatar</legend>
            {avatarGroup('Dibujos', DRAWING_AVATARS)}
            {avatarGroup('Figuras', SHAPE_AVATARS)}
          </fieldset>
          <fieldset>
            <legend className="text-sm font-bold">Color de fondo</legend>
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
              <Option name={`${id}-color`} shape="rounded-xl px-1.5" checked={avatarColor === null} onChange={() => setAvatarColor(null)}>
                <span className="grid justify-items-center gap-1">
                  <span aria-hidden="true" className="h-10 w-10 rounded-full border-2 border-tp-ink" style={{ backgroundColor: avatarById(avatar).fill }} />
                  <span className="text-xs font-semibold">Original</span>
                </span>
              </Option>
              {AVATAR_COLORS.map((color) => (
                <Option key={color.id} name={`${id}-color`} shape="rounded-xl px-1.5" checked={avatarColor === color.id} onChange={() => setAvatarColor(color.id)}>
                  <span className="grid justify-items-center gap-1">
                    <span aria-hidden="true" className="h-10 w-10 rounded-full border-2 border-tp-ink" style={{ backgroundColor: color.value }} />
                    <span className="text-xs font-semibold">{color.name}</span>
                  </span>
                </Option>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-bold">Marco</legend>
            <p className="mt-1 text-sm text-tp-ink-muted">Se desbloquean con puntos: cuando el equipo acepta un problema, una solución o una corrección tuya. Tienes {points} {points === 1 ? 'punto' : 'puntos'}.</p>
            <div className="mt-3 flex flex-wrap items-end gap-x-3 gap-y-3">
              {FRAMES.map((option) => {
                const locked = points < option.min
                return (
                  <Option key={option.id} name={`${id}-frame`} shape="rounded-xl px-1.5 pt-3" checked={frame === option.id} onChange={() => setFrame(option.id)} disabled={locked}>
                    <span className={`grid justify-items-center gap-1.5 ${locked ? 'opacity-45 grayscale' : ''}`}>
                      <Avatar id={avatar} color={avatarColor} frame={option.id} size="picker" />
                      <span className="text-xs font-semibold">{option.name}</span>
                    </span>
                    {locked && <span className="text-[11px] font-semibold text-tp-ink-muted">desde {option.min} pts<span className="sr-only">, bloqueado</span></span>}
                  </Option>
                )
              })}
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
