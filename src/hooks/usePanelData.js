import { useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'

// Loads one API address for a panel; `reload` bumps to fetch again.
export function usePanelData(path, token, reload = 0) {
  const [state, setState] = useState({ key: null, data: null, error: null })
  const key = `${path}|${token ?? ''}|${reload}`
  useEffect(() => {
    let active = true
    apiFetch(path, { token })
      .then((data) => { if (active) setState({ key, data, error: null }) })
      .catch((error) => { if (active) setState({ key, data: null, error: error.message }) })
    return () => { active = false }
  }, [key, path, token])
  const current = state.key === key
  return { data: current ? state.data : null, error: current ? state.error : null, loading: !current }
}

