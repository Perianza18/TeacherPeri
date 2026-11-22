import { Link } from 'react-router-dom'
import { STATUS_PILLS, relativeTime } from '../../lib/profile'

export const LINK = 'font-semibold text-tp-ink underline decoration-tp-violet decoration-2 underline-offset-4 hover:text-tp-violet'

// One row of Actividad / Comentarios: a bold first line with a muted time,
// then the detail. Rows are split by dashed rules.
export function FeedRow({ title, at, children }) {
  return (
    <li className="border-t-2 border-dashed border-tp-rule py-4 first:border-t-0 first:pt-0 last:pb-0">
      <p className="font-bold text-tp-ink">{title} <span className="font-normal text-tp-ink-muted">· <time dateTime={at}>{relativeTime(at)}</time></span></p>
      <div className="mt-1 break-words leading-7 text-tp-ink-soft">{children}</div>
    </li>
  )
}

export function StatusPill({ status }) {
  const info = STATUS_PILLS[status]
  if (!info) return null
  return <span className={`tp-pill ml-2 align-middle text-xs ${info.className}`}>{info.label}</span>
}

export function TextLink({ href, children }) {
  if (!href) return <span className="font-semibold text-tp-ink">{children}</span>
  return <Link to={href} className={LINK}>{children}</Link>
}

export function SoloTu({ className = '' }) {
  return <span className={`tp-pill bg-tp-surface text-xs ${className}`}>Solo tú</span>
}

export function EmptyCard({ kicker, children }) {
  return (
    <div className="tp-card-soft bg-tp-surface p-6">
      <span className="tp-kicker">{kicker}</span>
      <p className="mt-3 leading-7 text-tp-ink-soft">{children}</p>
    </div>
  )
}

export function PanelStatus({ loading, error }) {
  if (error) return <p role="alert" className="tp-card-quiet bg-tp-coral-soft p-4">{error}</p>
  if (loading) return <p className="text-tp-ink-muted">Cargando…</p>
  return null
}
