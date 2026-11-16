import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MathText from '../components/math/MathText'
import ProblemSubmissionForm from '../components/submissions/ProblemSubmissionForm'
import { useAuth } from '../context/useAuth'
import { apiFetch } from '../lib/api'
import { MY_SUBMISSIONS_PATH, PROPOSE_PATH, STATE_INFO } from '../lib/submissions'

function Shell({ title, children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] bg-brand-50 px-4 pb-24 pt-32 sm:px-6">
        <div className="mx-auto max-w-[840px]">
          <h1 className="text-4xl font-black leading-[1.05] tracking-[-0.02em] text-brand-900 sm:text-[52px]">{title}</h1>
          {children}
        </div>
      </main>
      <Footer />
    </>
  )
}

function SignInCard({ abrirModal }) {
  return (
    <section className="tp-card-soft mt-8 bg-white p-6">
      <span className="tp-kicker">Inicia sesión</span>
      <p className="mt-4 text-lg leading-8 text-brand-700">Entra a tu cuenta para ver los problemas que propusiste y su revisión.</p>
      <button type="button" onClick={abrirModal} className="tp-button mt-5 bg-tp-mint px-5 font-bold text-tp-ink">Entrar</button>
    </section>
  )
}

function StatePill({ state }) {
  const info = STATE_INFO[state] || STATE_INFO.pending
  return <span className={`tp-pill text-xs ${info.className}`}>{info.label}</span>
}

function SubmissionCard({ item, token, onDeleted }) {
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const showProposal = item.state !== 'published' && item.state !== 'published-rejected'
  const remove = async () => {
    setBusy(true)
    setError(null)
    try {
      await apiFetch(`/api/submissions/mine/${item._id}`, { method: 'DELETE', token })
      onDeleted(item._id)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }
  return (
    <article className="tp-card-soft flex flex-col gap-3 bg-white p-5 sm:p-6" aria-labelledby={`envio-${item._id}`}>
      <div className="flex flex-wrap items-center gap-2">
        <h2 id={`envio-${item._id}`} className="text-xs font-black uppercase tracking-wider text-accent-violet">{item.codigo}</h2>
        <StatePill state={item.state} />
        {item.examFolderPending && <span className="tp-pill bg-tp-yellow-soft text-xs">Carpeta en revisión</span>}
      </div>
      <MathText text={showProposal ? item.proposal.enunciado : item.enunciado} className="line-clamp-6 whitespace-pre-wrap break-words leading-7 text-brand-900" />
      {item.state === 'published-pending' && <p className="text-sm text-tp-ink-muted">Tus cambios están en revisión; mientras tanto se muestra la versión publicada.</p>}
      {(item.state === 'rejected' || item.state === 'published-rejected') && item.latest?.reason && (
        <p className="tp-card-quiet bg-tp-coral-soft p-3 text-sm leading-6"><strong>Motivo: </strong>{item.latest.reason}</p>
      )}
      <div className="flex flex-wrap gap-2 text-sm">
        {item.examFolderPath.length > 0 && <span className="tp-pill bg-white text-xs">{item.examFolderPath.slice(1).join(' › ')}{item.proposal.problemNumber ? ` · Problema ${item.proposal.problemNumber}` : ''}</span>}
        {item.topics.map((topic) => <span key={topic._id} className="tp-pill bg-tp-sky-soft text-xs">{topic.name}</span>)}
        {item.tags.map((tag) => <span key={tag._id} className="tp-pill bg-tp-violet-soft text-xs">{tag.label}</span>)}
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-3 border-t-2 border-dashed border-tp-rule pt-4 text-sm font-bold">
        <Link to={`${MY_SUBMISSIONS_PATH}/${item._id}`} className="tp-button bg-white px-4 text-brand-900">Editar</Link>
        {item.isPublic && <Link to={`/entrenamiento/problemas/${item._id}`} className="min-h-11 content-center px-1 text-violet-700 underline underline-offset-2">Ver publicado</Link>}
        {!confirming && <button type="button" onClick={() => setConfirming(true)} className="min-h-11 px-1 text-tp-ink-muted underline underline-offset-2">Eliminar</button>}
        {confirming && (
          <span className="flex flex-wrap items-center gap-2" role="group" aria-label="Confirmar eliminación">
            <span className="font-semibold">¿Eliminar este problema?</span>
            <button type="button" onClick={remove} disabled={busy} className="tp-button bg-tp-coral px-3 text-tp-ink disabled:opacity-60">Sí, eliminar</button>
            <button type="button" onClick={() => setConfirming(false)} className="min-h-11 px-1 font-semibold underline">Cancelar</button>
          </span>
        )}
      </div>
      {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}
    </article>
  )
}

// /mis-envios — the person's own proposals and their review state.
export default function MisEnviosPage() {
  const { auth, abrirModal } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const token = auth?.token
  const [result, setResult] = useState({ token: null, items: [], error: null })
  const loading = token && result.token !== token
  // A notice from the edit page shows once; a reload must not repeat it.
  const [notice] = useState(location.state?.notice || null)
  useEffect(() => {
    if (location.state?.notice) navigate(location.pathname, { replace: true, state: null })
  }, [location.state, location.pathname, navigate])

  useEffect(() => {
    if (!token) return
    let cancelled = false
    apiFetch('/api/submissions/mine', { token })
      .then((items) => { if (!cancelled) setResult({ token, items, error: null }) })
      .catch((error) => { if (!cancelled) setResult({ token, items: [], error: error.message }) })
    return () => { cancelled = true }
  }, [token])

  return (
    <Shell title="Mis envíos">
      <p className="mt-4 max-w-2xl leading-7 text-brand-600">Los problemas que propusiste. Se publican cuando se aprueban; puedes editarlos o eliminarlos cuando quieras.</p>
      {notice && <p role="status" className="tp-card-quiet mt-6 bg-tp-mint-soft p-4 text-sm font-semibold">{notice}</p>}
      {!auth && <SignInCard abrirModal={abrirModal} />}
      {auth && (
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={PROPOSE_PATH} className="tp-button bg-tp-mint px-5 font-bold text-tp-ink">Proponer un problema</Link>
        </div>
      )}
      {auth && loading && <p className="mt-8 text-brand-500" aria-live="polite">Cargando tus envíos…</p>}
      {auth && !loading && result.error && <p role="alert" className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">No fue posible cargar tus envíos: {result.error}</p>}
      {auth && !loading && !result.error && result.items.length === 0 && (
        <section className="tp-card-soft mt-8 bg-white p-6">
          <span className="tp-kicker">Mis envíos</span>
          <p className="mt-4 text-lg leading-8 text-brand-700">Todavía no has propuesto problemas.</p>
        </section>
      )}
      {auth && !loading && result.items.length > 0 && (
        <div className="mt-8 flex flex-col gap-5">
          {result.items.map((item) => <SubmissionCard key={item._id} item={item} token={token} onDeleted={(id) => setResult((current) => ({ ...current, items: current.items.filter((entry) => entry._id !== id) }))} />)}
        </div>
      )}
    </Shell>
  )
}

// /mis-envios/:id — change one of your problems.
export function EditarEnvioPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { auth, abrirModal } = useAuth()
  const token = auth?.token
  const key = `${token}:${id}`
  const [result, setResult] = useState({ key: null, item: null, error: null })

  useEffect(() => {
    if (!token) return
    let cancelled = false
    apiFetch(`/api/submissions/mine/${id}`, { token })
      .then((item) => { if (!cancelled) setResult({ key, item, error: null }) })
      .catch((error) => { if (!cancelled) setResult({ key, item: null, error: error.message }) })
    return () => { cancelled = true }
  }, [token, id, key])

  const item = result.key === key ? result.item : null
  const error = result.key === key ? result.error : null
  return (
    <Shell title={item ? `Editar ${item.codigo}` : 'Editar envío'}>
      <Link to={MY_SUBMISSIONS_PATH} className="mt-4 inline-block text-sm font-semibold text-violet-700">← Volver a Mis envíos</Link>
      {!auth && <SignInCard abrirModal={abrirModal} />}
      {auth && !item && !error && <p className="mt-8 text-brand-500" aria-live="polite">Cargando…</p>}
      {auth && error && <p role="alert" className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>}
      {auth && item && (
        <div className="tp-card-soft mt-6 bg-white p-5 sm:p-7">
          <ProblemSubmissionForm
            token={token}
            problemId={item._id}
            isLive={item.isPublic}
            initial={item.proposal}
            onCancel={() => navigate(MY_SUBMISSIONS_PATH)}
            onSaved={(saved) => navigate(MY_SUBMISSIONS_PATH, { state: { notice: `Guardamos los cambios de ${saved.codigo}; quedaron en revisión.` } })}
          />
        </div>
      )}
    </Shell>
  )
}
