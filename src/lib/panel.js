// Paths and small helpers for the team pages (/panel). The server checks
// every permission; these only decide which links and buttons to show.
import { useEffect, useState } from 'react'
import { apiFetch } from './api'
import { isAtLeast } from './roles'

export const PANEL_PATH = '/panel'
export const PANEL = {
  moderacion: '/panel/moderacion',
  revision: '/panel/revision',
  usuarios: '/panel/usuarios',
  cambios: '/panel/cambios',
}
export const editProblemPath = (id) => `/panel/problemas/${id}/editar`
export const editLessonPath = (id) => `/panel/teoria/${id}/editar`

export const canEdit = (auth) => Boolean(auth && isAtLeast(auth.user?.role, 'editor'))
export const isAdmin = (auth) => Boolean(auth && isAtLeast(auth.user?.role, 'admin'))

export const ROLE_NAMES = { user: 'Usuario', editor: 'Editor', admin: 'Admin' }

export const fechaHora = (value) => new Date(value).toLocaleString('es-MX', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

// Loads `path` with the session token. `reload()` asks again; while it
// loads, the previous data for the same path stays on screen.
export function useApiData(path, token) {
  const [round, setRound] = useState(0)
  const [state, setState] = useState({ key: null, path: null, data: null, error: null })
  const key = `${token}|${path}|${round}`
  useEffect(() => {
    if (!token || !path) return undefined
    let cancelled = false
    apiFetch(path, { token })
      .then((data) => { if (!cancelled) setState({ key, path, data, error: null }) })
      .catch((error) => { if (!cancelled) setState({ key, path, data: null, error: error.message }) })
    return () => { cancelled = true }
  }, [key, path, token])
  const samePath = state.path === path
  return {
    data: samePath ? state.data : null,
    error: samePath ? state.error : null,
    loading: state.key !== key,
    reload: () => setRound((value) => value + 1),
  }
}
