import { useEffect, useId, useState } from 'react'
import { Link } from 'react-router-dom'
import MathText from '../math/MathText'
import Avatar from '../profile/Avatar'
import { apiFetch } from '../../lib/api'
import { POINTS } from '../../lib/frames'
import { profilePath } from '../../lib/profile'
import { useAuth } from '../../context/useAuth'

const MIN = 20
const MAX = 20000

// «Proponer una solución»: the text with a live preview of its formulas. It
// goes to Revisión; nothing is public until the team accepts it.
function ProposeForm({ problemId, token, onSent, onCancel }) {
  const id = useId()
  const [body, setBody] = useState('')
  const [state, setState] = useState({ sending: false, error: null })

  const submit = async (event) => {
    event.preventDefault()
    setState({ sending: true, error: null })
    try {
      await apiFetch('/api/solutions', { method: 'POST', token, body: { problemId, body } })
      onSent()
    } catch (error) {
      setState({ sending: false, error: error.message })
    }
  }

  return (
    <form onSubmit={submit} className="tp-card-quiet flex flex-col gap-3 bg-tp-surface p-4 sm:p-5">
      <label htmlFor={`${id}-body`} className="font-bold text-tp-ink">Tu solución</label>
      <p id={`${id}-help`} className="-mt-2 text-sm leading-6 text-tp-ink-muted">Explica cada paso, no solo la respuesta. Escribe fórmulas entre signos de dólar: <code>$x^2+1$</code>. La revisaremos y, si la aceptamos, se publicará con tu nombre.</p>
      <textarea
        id={`${id}-body`}
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={7}
        maxLength={MAX}
        required
        aria-describedby={`${id}-help`}
        placeholder="Por ejemplo: Como hay 3 colores y 4 calcetines, por el principio de casillas dos son del mismo color…"
        className="tp-input font-reading leading-7"
      />
      {body.trim() && (
        <div className="rounded-[12px] border-2 border-dashed border-tp-rule p-3.5">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-tp-ink-muted">Vista previa</p>
          <MathText text={body} className="tp-reading-text mt-2 whitespace-pre-wrap leading-8" />
        </div>
      )}
      {state.error && <p role="alert" className="text-sm font-semibold text-red-700">{state.error}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={state.sending || body.trim().length < MIN} className="tp-button bg-tp-ink px-4 font-bold text-white disabled:opacity-60">{state.sending ? 'Enviando…' : 'Enviar solución'}</button>
        <button type="button" onClick={onCancel} className="min-h-11 px-1 font-semibold text-tp-ink-muted underline underline-offset-2">Cancelar</button>
      </div>
    </form>
  )
}

function SolutionItem({ item }) {
  const author = item.author
  return (
    <li className="border-t-2 border-dashed border-tp-rule py-5 first:border-t-0 first:pt-1 last:pb-1">
      <p className="flex flex-wrap items-center gap-2.5 text-sm">
        {author && <Avatar id={author.avatar} color={author.avatarColor} frame={author.frame} size="sm" />}
        <span className="font-bold text-tp-ink">Solución de {author
          ? <Link to={profilePath(author.username)} className="underline decoration-tp-violet decoration-2 underline-offset-4 hover:text-tp-violet">@{author.username}</Link>
          : 'una cuenta eliminada'}</span>
      </p>
      <MathText text={item.body} className="tp-reading-text mt-3 whitespace-pre-wrap leading-8" />
    </li>
  )
}

// Under the official solution: the community's accepted solutions (closed
// until opened, so nobody reads one by accident) and «Proponer una solución».
export default function CommunitySolutions({ problemId }) {
  const { auth, abrirModal } = useAuth()
  const [result, setResult] = useState({ id: null, items: [] })
  const [mode, setMode] = useState('idle') // idle | writing | sent

  useEffect(() => {
    let active = true
    apiFetch(`/api/solutions/problem/${problemId}`)
      .then((data) => { if (active) setResult({ id: problemId, items: Array.isArray(data?.items) ? data.items : [] }) })
      .catch(() => { if (active) setResult({ id: problemId, items: [] }) })
    return () => { active = false }
  }, [problemId])

  const items = result.id === problemId ? result.items : []
  const start = () => {
    if (!auth) { abrirModal(); return }
    setMode('writing')
  }

  return (
    <section aria-labelledby="soluciones-comunidad" className="flex flex-col gap-4">
      {items.length > 0 && (
        <details className="group rounded-[14px] border-2 border-tp-ink bg-tp-surface">
          <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-5 py-3.5 font-bold [&::-webkit-details-marker]:hidden">
            <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-tp-ink bg-tp-violet-soft text-sm font-extrabold">{items.length}</span>
            <span id="soluciones-comunidad" className="min-w-0 flex-1">Soluciones de la comunidad</span>
            <span aria-hidden="true" className="text-xl transition-transform group-open:rotate-45">+</span>
          </summary>
          <ul className="border-t-2 border-dashed border-tp-rule px-5 pb-4 pt-4">
            {items.map((item) => <SolutionItem key={item.id} item={item} />)}
          </ul>
        </details>
      )}
      {items.length === 0 && <h2 id="soluciones-comunidad" className="sr-only">Soluciones de la comunidad</h2>}
      {mode === 'writing'
        ? <ProposeForm problemId={problemId} token={auth?.token} onCancel={() => setMode('idle')} onSent={() => setMode('sent')} />
        : (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[14px] border-2 border-dashed border-tp-rule px-5 py-4">
            <p className="min-w-0 flex-1 text-[15px] leading-6 text-tp-ink-soft">
              {mode === 'sent'
                ? <span role="status">¡Gracias! Revisaremos tu solución. Si la aceptamos, se publicará con tu nombre y ganarás {POINTS.solutions} puntos.</span>
                : <>¿Lo resolviste de otra forma? Comparte tu solución: si la aceptamos, sale con tu nombre y ganas <span className="font-bold text-tp-ink">{POINTS.solutions} puntos</span>.</>}
            </p>
            {mode !== 'sent' && <button type="button" onClick={start} className="tp-button bg-tp-violet-soft px-4 text-sm font-bold text-tp-ink">Proponer una solución</button>}
          </div>
        )}
    </section>
  )
}
