import { useDeferredValue, useId, useState } from 'react'
import PanelShell, { LoadState } from '../../components/panel/PanelShell'
import { apiFetch } from '../../lib/api'
import { ROLE_NAMES, useApiData } from '../../lib/panel'

const ROLE_TONES = { user: 'bg-tp-surface', editor: 'bg-tp-violet-soft', admin: 'bg-tp-yellow' }

function UserRow({ user, me, token, onChanged }) {
  const [confirm, setConfirm] = useState(null) // role waiting for confirmation
  const [state, setState] = useState({ busy: false, error: null })
  const change = async (role) => {
    setState({ busy: true, error: null })
    try {
      await apiFetch(`/api/users/${user._id}/role`, { method: 'PUT', token, body: { role } })
      setConfirm(null)
      setState({ busy: false, error: null })
      onChanged()
    } catch (error) {
      setState({ busy: false, error: error.message })
    }
  }
  const action = user.role === 'user'
    ? { role: 'editor', label: 'Nombrar editor', tone: 'bg-tp-mint' }
    : user.role === 'editor'
      ? { role: 'user', label: 'Quitar rol de editor', tone: 'bg-tp-surface' }
      : { role: 'editor', label: 'Pasar a Editor', tone: 'bg-tp-surface' }
  return (
    <li className="tp-card-soft flex flex-col gap-3 bg-tp-surface p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-2 font-bold">
          <span className="truncate">@{user.username}</span>
          <span className={`tp-pill text-xs ${ROLE_TONES[user.role]}`}>{ROLE_NAMES[user.role]}</span>
          {String(user._id) === String(me) && <span className="text-xs font-semibold text-tp-ink-muted">(tú)</span>}
        </p>
        <p className="truncate text-sm text-tp-ink-muted">{user.email}</p>
      </div>
      <div className="flex flex-col items-start gap-1 sm:items-end">
        {confirm === null
          ? <button type="button" onClick={() => setConfirm(action.role)} className={`tp-button px-4 text-sm font-bold text-tp-ink ${action.tone}`}>{action.label}</button>
          : (
            <span role="group" aria-label="Confirmar cambio de rol" className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold">¿{action.label.toLowerCase()} a @{user.username}?</span>
              <button type="button" disabled={state.busy} onClick={() => change(confirm)} className="tp-button bg-tp-ink px-3 text-sm font-bold text-white disabled:opacity-60">Sí</button>
              <button type="button" onClick={() => setConfirm(null)} className="min-h-11 px-1 text-sm font-semibold underline">Cancelar</button>
            </span>
          )}
        {state.error && <p role="alert" className="text-sm font-semibold text-red-700">{state.error}</p>}
      </div>
    </li>
  )
}

// /panel/usuarios — admins give or remove the Editor role.
export default function UsuariosPage() {
  return (
    <PanelShell title="Usuarios" lead="Nombra editores o quítales el rol. Nadie se vuelve admin desde el sitio; la última cuenta admin no puede perder su rol." minimum="admin">
      {(auth) => <Usuarios token={auth.token} me={auth.user.id} />}
    </PanelShell>
  )
}

function Usuarios({ token, me }) {
  const id = useId()
  const [query, setQuery] = useState('')
  const q = useDeferredValue(query.trim())
  const users = useApiData(`/api/users${q ? `?q=${encodeURIComponent(q)}` : ''}`, token)
  return (
    <div className="flex max-w-[840px] flex-col gap-5">
      <label htmlFor={id} className="text-sm font-bold">Buscar por usuario o correo</label>
      <input id={id} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Por ejemplo: ana" autoComplete="off" className="tp-input -mt-3" />
      <LoadState loading={users.loading && !users.data} error={users.error} empty={users.data?.length === 0} emptyText="No hay cuentas que coincidan." />
      {users.data?.length > 0 && <ul className="flex flex-col gap-3">{users.data.map((user) => <UserRow key={user._id} user={user} me={me} token={token} onChanged={users.reload} />)}</ul>}
      {users.data?.length === 100 && <p className="text-sm text-tp-ink-muted">Se muestran las 100 cuentas más recientes. Busca para encontrar otras.</p>}
    </div>
  )
}
