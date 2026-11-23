import { useState } from 'react'
import { apiFetch } from '../../lib/api'
import { plural, roleName } from '../../lib/profile'
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

// The hero card on the left: avatar, @username, role, bio, follower counts,
// «Editar perfil» (owner) or «Seguir» (visitor), and the private email pill.
export default function ProfileCard({ profile, auth, onSignIn, onChange, onShowPeople, onProfileSaved }) {
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

  const countButton = 'min-h-11 px-1 text-sm font-semibold text-tp-ink underline decoration-tp-violet decoration-2 underline-offset-4 hover:text-tp-violet'

  return (
    <section aria-labelledby="perfil-usuario" className="tp-card flex flex-col items-center gap-3 bg-tp-surface px-6 py-7 text-center">
      <Avatar id={profile.avatar} color={profile.avatarColor} size="lg" />
      <h1 id="perfil-usuario" className="max-w-full break-words font-display text-[28px] font-extrabold leading-tight tracking-[-0.02em]">@{profile.username}</h1>
      <span className="tp-pill bg-tp-violet-soft text-xs">{roleName(profile.role)}</span>
      {profile.bio
        ? <p className="max-w-full break-words text-[15px] leading-6 text-tp-ink-soft">{profile.bio}</p>
        : profile.isOwner && <p className="text-sm text-tp-ink-muted">Agrega una descripción corta con «Editar perfil».</p>}
      <div className="flex flex-wrap justify-center gap-x-4">
        <button type="button" className={countButton} onClick={() => onShowPeople('seguidores')}>{plural(profile.followers, 'seguidor', 'seguidores')}</button>
        <button type="button" className={countButton} onClick={() => onShowPeople('siguiendo')}>{profile.following} siguiendo</button>
      </div>
      {profile.isOwner
        ? <button type="button" onClick={() => setEditing(true)} className="tp-button mt-1 bg-tp-surface px-5 font-bold text-tp-ink">Editar perfil</button>
        : <button type="button" onClick={toggleFollow} disabled={busy} aria-pressed={profile.isFollowing} className={`tp-button mt-1 px-6 font-bold text-tp-ink disabled:opacity-60 ${profile.isFollowing ? 'bg-tp-surface' : 'bg-tp-mint'}`}>{profile.isFollowing ? 'Siguiendo' : 'Seguir'}</button>}
      {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}
      {profile.isOwner && profile.email && (
        <p className="mt-1 inline-flex max-w-full items-center gap-1.5 rounded-full border-2 border-dashed border-tp-rule px-3 py-1 text-xs font-semibold text-tp-ink-muted" title="Solo tú ves tu correo">
          <LockIcon />
          <span className="sr-only">Solo tú ves tu correo: </span>
          <span className="truncate">{profile.email}</span>
        </p>
      )}
      {editing && <EditProfileDialog profile={profile} token={auth?.token} onClose={() => setEditing(false)} onSaved={(saved) => { setEditing(false); onProfileSaved(saved) }} />}
    </section>
  )
}

export function NumbersCard({ stats }) {
  const rows = [
    [stats.solved, 'problemas resueltos', 'problema resuelto'],
    [stats.comments, 'comentarios', 'comentario'],
    [stats.proposed, 'problemas propuestos', 'problema propuesto'],
    [stats.badges, 'insignias', 'insignia'],
  ]
  return (
    <section aria-labelledby="en-numeros" className="tp-card-soft bg-tp-surface p-6">
      <h2 id="en-numeros" className="tp-kicker">En números</h2>
      <dl className="mt-4 grid grid-cols-2 gap-4">
        {rows.map(([value, many, one]) => (
          <div key={many} className="flex flex-col-reverse">
            <dt className="text-sm leading-5 text-tp-ink-muted">{value === 1 ? one : many}</dt>
            <dd className="font-display text-[28px] font-extrabold leading-none">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
