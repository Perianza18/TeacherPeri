import { Link } from 'react-router-dom'
import PanelShell from '../../components/panel/PanelShell'
import { PANEL, canReview, isAdmin, useApiData } from '../../lib/panel'

function Tile({ to, title, text, count, tone }) {
  return (
    <Link to={to} className={`tp-card-soft tp-lift flex flex-col gap-2 p-5 sm:p-6 ${tone}`}>
      <span className="flex items-center justify-between gap-3">
        <span className="font-display text-[22px] font-extrabold leading-tight tracking-[-0.02em]">{title}</span>
        {count > 0 && <span className="tp-pill bg-tp-surface text-xs">{count} {count === 1 ? 'pendiente' : 'pendientes'}</span>}
      </span>
      <span className="leading-6 text-tp-ink-soft">{text}</span>
      <span aria-hidden="true" className="mt-auto pt-2 font-bold">Abrir →</span>
    </Link>
  )
}

// /panel — where editors and admins start.
export default function PanelPage() {
  return (
    <PanelShell title="Panel del equipo" lead="Reportes, revisiones y cambios del contenido. Para editar un problema o una lección, ábrelo y usa «Editar»." back={null}>
      {(auth) => <Tiles auth={auth} />}
    </PanelShell>
  )
}

function Tiles({ auth }) {
  const admin = isAdmin(auth)
  const reviewer = canReview(auth)
  const reports = useApiData('/api/reports', auth.token)
  const contentReports = useApiData('/api/reports/content', auth.token)
  const flags = useApiData(reviewer ? '/api/flags' : null, auth.token)
  const review = useApiData(reviewer ? '/api/review' : null, auth.token)
  const pendingReview = (review.data ? review.data.submissions.length + review.data.folders.length : 0) + (flags.data?.length || 0)
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Tile to={PANEL.moderacion} title="Moderación" text="Reportes de contenido inapropiado en comentarios, problemas y lecciones." count={(reports.data?.length || 0) + (contentReports.data?.length || 0)} tone="bg-tp-yellow-soft" />
      {reviewer && <Tile to={PANEL.revision} title="Revisión" text="Todo lo que propone la comunidad: problemas nuevos, cambios, carpetas de examen y sugerencias en problemas y lecciones." count={pendingReview} tone="bg-tp-mint-soft" />}
      {admin && <Tile to={PANEL.usuarios} title="Usuarios" text="Nombrar editores o quitarles el rol." tone="bg-tp-sky-soft" />}
      {admin && <Tile to={PANEL.cambios} title="Cambios de editores" text="Quién cambió o revisó qué y cuándo, con el antes y el después." tone="bg-tp-violet-soft" />}
    </div>
  )
}
