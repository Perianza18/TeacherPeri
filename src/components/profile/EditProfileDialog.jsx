import { createPortal } from 'react-dom'
import { useCallback, useId, useState } from 'react'
import useDialog from '../../hooks/useDialog'
import { AVATAR_COLORS, DEFAULT_AVATAR, PREMIUM_AVATARS, avatarById } from '../../lib/avatars'
import { apiFetch } from '../../lib/api'
import { FRAMES } from '../../lib/frames'
import Avatar from './Avatar'

const BIO_MAX = 160

// One option in a picker: a hidden radio button, so the arrow keys move
// through the group and a screen reader names each one, inside the tile you see.
function Option({ name, checked, onChange, children, shape = 'rounded-full', disabled = false }) {
  return (
    <label className={`relative grid place-items-center place-self-center ${shape} p-1 has-[:checked]:outline has-[:checked]:outline-[3px] has-[:checked]:outline-tp-violet has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-tp-violet ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <input type="radio" name={name} checked={checked} onChange={onChange} disabled={disabled} className="sr-only" />
      {children}
    </label>
  )
}

// A drawing still for sale: its price and «Desbloquear» (or how many points
// are missing). Buying spends points but never lowers the frame.
function LockedAvatar({ option, color, balance, busy, onBuy }) {
  const short = option.price - balance
  return (
    <div className="grid justify-items-center gap-1.5 rounded-xl p-1 text-center">
      <span className="relative">
        <Avatar id={option.id} color={color} size="picker" label={`${option.name}, bloqueado`} className="opacity-50 grayscale" />
        <span aria-hidden="true" className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border-2 border-tp-ink bg-tp-yellow">
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" /></svg>
        </span>
      </span>
      {short > 0
        ? <span className="text-[11px] font-semibold leading-tight text-tp-ink-muted">{option.price} pts<br />te faltan {short}</span>
        : <button type="button" disabled={busy} onClick={() => onBuy(option)} className="min-h-9 rounded-full border-2 border-tp-ink bg-tp-yellow px-2.5 text-[11px] font-extrabold leading-tight disabled:opacity-60" aria-label={`Desbloquear ${option.name} por ${option.price} puntos`}>Desbloquear<br />{option.price} pts</button>}
    </div>
  )
}

// «Editar perfil»: pick a preset avatar («π», a free drawing or one bought
// with points), its background colour and one of the frames they have
// unlocked, and write a short description.
export default function EditProfileDialog({ profile, token, onSaved, onClose, onBought = () => {} }) {
  const id = useId()
  const close = useCallback(() => onClose(), [onClose])
  const ref = useDialog(close)
  const [avatar, setAvatar] = useState(profile.avatar)
  const [avatarColor, setAvatarColor] = useState(profile.avatarColor ?? null)
  const [frame, setFrame] = useState(profile.frame ?? 'lapiz')
  const points = profile.level?.points ?? 0
  const [shop, setShop] = useState({ owned: profile.unlockedAvatars ?? [], balance: profile.level?.balance ?? points, busy: false, error: null })

  const buy = async (option) => {
    setShop((current) => ({ ...current, busy: true, error: null }))
    try {
      const result = await apiFetch(`/api/profiles/me/avatars/${option.id}`, { method: 'POST', token })
      setShop({ owned: result.unlockedAvatars, balance: result.balance, busy: false, error: null })
      setAvatar(option.id)
      onBought(result)
    } catch (error) {
      setShop((current) => ({ ...current, busy: false, error: error.message }))
    }
  }
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
            {avatarGroup('Gratis', [avatarById(DEFAULT_AVATAR)])}
            <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-tp-ink-muted">Dibujos: se desbloquean con puntos</p>
              <p className="text-sm font-semibold">Puedes gastar <span className="font-extrabold">{shop.balance}</span> {shop.balance === 1 ? 'punto' : 'puntos'}</p>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-x-2 gap-y-3 sm:grid-cols-5">
              {PREMIUM_AVATARS.map((option) => (shop.owned.includes(option.id)
                ? (
                  <Option key={option.id} name={`${id}-avatar`} checked={avatar === option.id} onChange={() => setAvatar(option.id)}>
                    <Avatar id={option.id} color={avatarColor} size="picker" label={option.name} />
                  </Option>
                )
                : <LockedAvatar key={option.id} option={option} color={avatarColor} balance={shop.balance} busy={shop.busy} onBuy={buy} />))}
            </div>
            <p className="mt-2 text-xs leading-5 text-tp-ink-muted">Gastar puntos no te baja de marco: el marco depende de todo lo que has ganado.</p>
            {shop.error && <p role="alert" className="mt-2 text-sm font-semibold text-red-700">{shop.error}</p>}
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
