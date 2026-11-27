import { Link } from 'react-router-dom'
import { STATUS_PILLS, relativeTime } from '../../lib/profile'

export const LINK = 'font-semibold text-tp-ink underline decoration-tp-violet decoration-2 underline-offset-4 hover:text-tp-violet'

// A small ink icon in a colored circle for each kind of activity.
const KIND_ICONS = {
  comment: ['bg-tp-sky-soft', <path key="i" d="M5 6.5h14v9H10l-4 3.5v-3.5H5z" />],
  proposal: ['bg-tp-mint-soft', <path key="i" d="M12 5v14M5 12h14" />],
  solution: ['bg-tp-violet-soft', <g key="i"><path d="M6 18.5 15.5 9l-2-2L4 16.5V19z" /><path d="M17 4.5l2.5 2.5M14 20h6" /></g>],
  suggestion: ['bg-tp-yellow-soft', <path key="i" d="M14.5 5.5l4 4L9 19H5v-4z" />],
  saved: ['bg-tp-orange-soft', <path key="i" d="M7 4.5h10v15l-5-3.5-5 3.5z" />],
  solved: ['bg-tp-mint-soft', <path key="i" d="M5.5 12.5l4 4 9-9" />],
  follow: ['bg-tp-violet-soft', <g key="i"><circle cx="10" cy="9" r="3.2" /><path d="M4.5 19c.8-3 3-4.5 5.5-4.5s4.7 1.5 5.5 4.5M17.5 8v6M14.5 11h6" /></g>],
}

function KindIcon({ kind }) {
  const [bg, icon] = KIND_ICONS[kind] ?? KIND_ICONS.comment
  return (
    <span aria-hidden="true" className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-tp-ink ${bg}`}>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
    </span>
  )
}

// One row of Actividad / Comentarios: an icon, a bold first line with a muted
// time, then the detail. Rows are split by dashed rules.
export function FeedRow({ title, at, kind, children }) {
  return (
    <li className="flex gap-4 border-t-2 border-dashed border-tp-rule/70 py-4 first:border-t-0 first:pt-0 last:pb-0">
      {kind && <KindIcon kind={kind} />}
      <div className="min-w-0 flex-1">
        <p className="font-bold text-tp-ink">{title} <span className="text-sm font-normal text-tp-ink-muted">· <time dateTime={at}>{relativeTime(at)}</time></span></p>
        <div className="mt-0.5 break-words leading-7 text-tp-ink-soft">{children}</div>
      </div>
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
