import { useState } from 'react'
import { apiFetch } from '../../lib/api'
import { roleName } from '../../lib/profile'
import { frameById } from '../../lib/frames'
import Avatar from './Avatar'
import EditProfileDialog from './EditProfileDialog'

function LockIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="3" y="7" width="10" height="7" rx="1.5" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  )
}

// A soft lilac banner with a dot grid, behind the avatar.
const BANNER = {
  background: 'radial-gradient(circle, rgba(109,62,232,.22) 1.5px, transparent 2px) 0 0 / 16px 16px, linear-gradient(135deg, var(--tp-tint-violet), var(--tp-sky-soft))',
}

// The hero card on the left: avatar, @username, role, bio, follower counts,
// «Editar perfil» (owner) or «Seguir» (visitor), and the private email pill.
export default function ProfileCard({ profile, auth, onSignIn, onChange, onShowPeople, onProfileSaved, onBought }) {
  const [editing, setEditing] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const toggleFollow = async () => {
    if (!auth) { onSignIn(); return }
    setBusy(true)
    setError(null)
    try {
      const counts = await apiFetch(`/api/profiles/${encodeURIComponent(profile.username)}/follow`, { method: profile.isFollowing ? 'DELETE' : 'PUT', token: auth.token })
      onChange(counts)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const count = (n, label, which) => (
    <button type="button" onClick={() => onShowPeople(which)} aria-label={`${n} ${label}`} className="group flex min-h-11 flex-1 flex-col items-center justify-center rounded-[12px] px-2 py-2 hover:bg-tp-violet-soft focus-visible:bg-tp-violet-soft">
      <span className="font-display text-[22px] font-extrabold leading-none text-tp-ink">{n}</span>
      <span className="mt-1 text-[13px] font-semibold text-tp-ink-muted group-hover:text-tp-violet">{label}</span>
    </button>
  )

  return (
    <section aria-labelledby="perfil-usuario" className="tp-card overflow-hidden bg-tp-surface text-center">
      <div aria-hidden="true" className="h-24 border-b-2 border-tp-ink" style={BANNER} />
      <div className="-mt-14 flex flex-col items-center gap-3 px-6 pb-6">
        <span className="rounded-full bg-tp-surface p-1.5"><Avatar id={profile.avatar} color={profile.avatarColor} frame={profile.frame} size="lg" /></span>
        <div className="flex max-w-full flex-col items-center gap-2">
          <h1 id="perfil-usuario" className="max-w-full break-words font-display text-[26px] font-extrabold leading-tight tracking-[-0.02em]">@{profile.username}</h1>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="tp-pill bg-tp-violet-soft text-xs">{roleName(profile.role)}</span>
            {profile.level && <span className="tp-pill bg-tp-surface text-xs">Marco {frameById(profile.frame).name} · {profile.level.points} pts</span>}
          </div>
        </div>
        {profile.bio
          ? <p className="max-w-full break-words text-[15px] leading-6 text-tp-ink-soft">{profile.bio}</p>
          : profile.isOwner && <p className="text-sm text-tp-ink-muted">Agrega una descripción corta con «Editar perfil».</p>}
        <div className="mt-1 flex w-full items-stretch rounded-[14px] border-2 border-tp-ink/10 bg-tp-paper p-1">
          {count(profile.followers, profile.followers === 1 ? 'seguidor' : 'seguidores', 'seguidores')}
          <span aria-hidden="true" className="my-2 w-0.5 rounded-full bg-tp-rule/60" />
          {count(profile.following, 'siguiendo', 'siguiendo')}
        </div>
        {profile.isOwner
          ? <button type="button" onClick={() => setEditing(true)} className="tp-button mt-1 w-full justify-center bg-tp-surface px-5 font-bold text-tp-ink">Editar perfil</button>
          : <button type="button" onClick={toggleFollow} disabled={busy} aria-pressed={profile.isFollowing} className={`tp-button mt-1 w-full justify-center px-6 font-bold text-tp-ink disabled:opacity-60 ${profile.isFollowing ? 'bg-tp-surface' : 'bg-tp-mint'}`}>{profile.isFollowing ? 'Siguiendo' : 'Seguir'}</button>}
        {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}
        {profile.isOwner && profile.email && (
          <p className="inline-flex max-w-full items-center gap-1.5 text-xs font-semibold text-tp-ink-muted" title="Solo tú ves tu correo">
            <LockIcon />
            <span className="sr-only">Solo tú ves tu correo: </span>
            <span className="truncate">{profile.email}</span>
          </p>
        )}
      </div>
      {editing && <EditProfileDialog profile={profile} token={auth?.token} onBought={onBought} onClose={() => setEditing(false)} onSaved={(saved) => { setEditing(false); onProfileSaved(saved) }} />}
    </section>
  )
}

// «En números». For the owner, the solved count is a button that opens
// «Problemas resueltos»; visitors only see the number.
export function NumbersCard({ stats, onShowSolved }) {
  const rows = [
    ['solved', stats.solved, 'problemas resueltos', 'problema resuelto', 'bg-tp-mint-soft'],
    ['proposed', stats.proposed, 'problemas propuestos', 'problema propuesto', 'bg-tp-orange-soft'],
    ['solutions', stats.solutions ?? 0, 'soluciones aceptadas', 'solución aceptada', 'bg-tp-sky-soft'],
    ['badges', stats.badges, 'insignias', 'insignia', 'bg-tp-violet-soft'],
  ]
  return (
    <section aria-labelledby="en-numeros" className="tp-card-soft bg-tp-surface p-5">
      <h2 id="en-numeros" className="tp-kicker">En números</h2>
      <dl className="mt-4 grid grid-cols-2 gap-2.5">
        {rows.map(([key, value, many, one, tint]) => {
          const label = value === 1 ? one : many
          return (
            <div key={key} className={`flex flex-col-reverse justify-end rounded-[14px] px-3.5 pb-3 pt-1.5 ${tint}`}>
              <dt className="text-[13px] font-semibold leading-[18px] text-tp-ink-soft">{label}</dt>
              <dd className="flex h-11 items-center font-display text-[28px] font-extrabold leading-none">
                {key === 'solved' && onShowSolved
                  ? <button type="button" onClick={onShowSolved} aria-label={`${value} ${label}: ver cuáles`} className="flex h-11 min-w-11 items-center text-left underline decoration-tp-violet decoration-[3px] underline-offset-4 hover:text-tp-violet">{value}</button>
                  : value}
              </dd>
            </div>
          )
        })}
      </dl>
    </section>
  )
}
