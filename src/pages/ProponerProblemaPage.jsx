import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import TrainingHeader from '../components/training/TrainingHeader'
import ProblemSubmissionForm from '../components/submissions/ProblemSubmissionForm'
import { MY_SUBMISSIONS_PATH, emptyProposal } from '../lib/submissions'

// /entrenamiento/problemas/proponer — anyone signed in proposes a problem.
// It stays «En revisión» until an admin approves it.
export default function ProponerProblemaPage() {
  const { auth, abrirModal } = useAuth()
  const [saved, setSaved] = useState(null)
  const [round, setRound] = useState(0)

  return (
    <section className="mx-auto max-w-[840px] px-4 pb-24 pt-12 sm:px-6">
      <Link to="/entrenamiento/problemas" className="text-sm font-semibold text-violet-700">← Volver a Problemas</Link>
      <div className="mt-6">
        <TrainingHeader eyebrow="Comunidad" title="Proponer un problema" subtitle="Comparte un problema con su enunciado completo. Lo revisamos antes de publicarlo: que las fórmulas se vean bien, que el enunciado esté completo y que las etiquetas y la carpeta sean correctas." />
      </div>

      {!auth && (
        <div className="tp-card-soft bg-white p-6">
          <span className="tp-kicker">Inicia sesión</span>
          <p className="mt-4 text-lg leading-8 text-brand-700">Necesitas una cuenta para proponer un problema y seguir su revisión en «Mis envíos».</p>
          <button type="button" onClick={abrirModal} className="tp-button mt-5 bg-tp-mint px-5 font-bold text-tp-ink">Entrar o crear cuenta</button>
        </div>
      )}

      {auth && saved && (
        <div className="tp-card-soft bg-white p-6" role="status">
          <span className="tp-kicker">En revisión</span>
          <p className="mt-4 text-lg leading-8 text-brand-700">¡Gracias! Tu problema <strong>{saved.codigo}</strong> quedó en revisión. Te avisaremos cuando se apruebe o si necesita cambios.</p>
          {saved.latest?.checks?.some((check) => check.level === 'warning') && (
            <ul className="mt-3 list-disc pl-5 text-sm text-tp-ink-muted">{saved.latest.checks.filter((check) => check.level === 'warning').map((check) => <li key={check.code}>{check.message}</li>)}</ul>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to={MY_SUBMISSIONS_PATH} className="tp-button bg-white px-5 font-bold text-brand-900">Ver mis envíos</Link>
            <button type="button" onClick={() => { setSaved(null); setRound(round + 1) }} className="tp-button bg-tp-mint px-5 font-bold text-tp-ink">Proponer otro</button>
          </div>
        </div>
      )}

      {auth && !saved && (
        <div className="tp-card-soft bg-white p-5 sm:p-7">
          <ProblemSubmissionForm key={round} token={auth.token} initial={emptyProposal()} onSaved={setSaved} />
        </div>
      )}
    </section>
  )
}
