import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import SuggestionForm from './FlagButton'
import ReportForm from './ReportButton'

const LINK = 'inline-flex min-h-11 items-center px-1 font-semibold text-tp-ink-muted underline underline-offset-2 hover:text-tp-ink'
const THANKS = {
  suggest: 'Gracias. Revisaremos tu sugerencia.',
  report: 'Gracias. Revisaremos tu reporte.',
}

// The two actions under a problem or a lesson:
//   «Sugerir un cambio» → a content correction, goes to Revisión
//   «Reportar»          → inappropriate content, goes to Moderación
// Signed-out visitors get the sign-in modal. One form is open at a time.
export default function PageFeedback({ targetType, targetId }) {
  const { auth, abrirModal } = useAuth()
  const [open, setOpen] = useState(null)
  const [sent, setSent] = useState(null)

  const start = (kind) => {
    if (!auth) { abrirModal(); return }
    setSent(null)
    setOpen(kind)
  }
  const props = { targetType, targetId, token: auth?.token, onCancel: () => setOpen(null), onSent: () => { setSent(open); setOpen(null) } }

  return (
    <div className="font-sans text-[15px]">
      {!open && (
        <div className="flex flex-wrap items-center gap-x-4">
          <button type="button" onClick={() => start('suggest')} aria-expanded="false" className={LINK}>Sugerir un cambio</button>
          <button type="button" onClick={() => start('report')} aria-expanded="false" className={LINK}>Reportar</button>
        </div>
      )}
      {sent && !open && <p role="status" className="text-sm text-tp-ink-muted">{THANKS[sent]}</p>}
      {open === 'suggest' && <SuggestionForm {...props} />}
      {open === 'report' && <ReportForm {...props} />}
    </div>
  )
}
