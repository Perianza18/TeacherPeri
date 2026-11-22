import { useEffect, useState } from 'react'
import { useAuth } from '../../context/useAuth'
import { apiFetch } from '../../lib/api'

// «Lo resolví»: the student marks a problem as solved (nothing checks the
// answer). Counts toward «Problemas resueltos» in Mi Espacio.
export default function SolvedToggle({ problemId, className = '' }) {
  const { auth, abrirModal } = useAuth()
  const token = auth?.token
  const [state, setState] = useState({ key: null, solved: false })
  const [busy, setBusy] = useState(false)
  const key = `${problemId}|${token ?? ''}`

  useEffect(() => {
    if (!token) return
    let active = true
    apiFetch(`/api/problems/${problemId}/solved`, { token }).then((data) => { if (active) setState({ key, solved: data.solved }) }).catch(() => {})
    return () => { active = false }
  }, [key, problemId, token])

  const solved = Boolean(token) && state.key === key && state.solved
  const toggle = async () => {
    if (!token) { abrirModal(); return }
    setBusy(true)
    try {
      const data = await apiFetch(`/api/problems/${problemId}/solved`, { method: solved ? 'DELETE' : 'PUT', token })
      setState({ key, solved: data.solved })
    } finally {
      setBusy(false)
    }
  }

  return (
    <button type="button" onClick={toggle} disabled={busy} aria-pressed={solved} className={`tp-button gap-2 px-4 text-sm font-bold text-tp-ink disabled:opacity-60 ${solved ? 'bg-tp-mint' : 'bg-tp-surface'} ${className}`}>
      <span aria-hidden="true" className={`grid h-5 w-5 place-items-center rounded-full border-2 border-tp-ink ${solved ? 'bg-tp-surface' : ''}`}>{solved ? '✓' : ''}</span>
      Lo resolví
    </button>
  )
}
