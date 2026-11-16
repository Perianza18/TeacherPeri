import { roleLabel } from '../lib/roles'

// Insignia de rol junto al nombre (comentarios, menú de cuenta). Las cuentas
// con rol `user` no muestran nada.
export default function RoleBadge({ role, className = '' }) {
  const label = roleLabel(role)
  if (!label) return null
  return (
    <span className={`inline-flex items-center rounded-full border-2 border-black bg-accent-purple-soft px-2 py-0.5 text-xs font-bold leading-tight text-brand-900 ${className}`}>
      {label}
    </span>
  )
}
