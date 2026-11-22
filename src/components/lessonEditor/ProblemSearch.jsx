import { useEffect, useId, useState } from 'react'
import { apiFetch } from '../../lib/api'
import { PROBLEM_BOX_KINDS } from '../../lib/lessonMarkup'

const MAX_PICKED = 20

// Searches the problem bank and collects the problems to put in one box.
// `onInsert(codes, kind)` writes the reference.
export default function ProblemSearch({ onInsert, autoFocus = false }) {
  const id = useId()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ query: null, items: [], error: null })
  const [picked, setPicked] = useState([])
  const [kind, setKind] = useState('ejercicios')
  const term = query.trim()

  useEffect(() => {
    if (term.length < 2) return undefined
    let cancelled = false
    const timer = setTimeout(() => {
      apiFetch(`/api/problems?q=${encodeURIComponent(term)}&limit=8`)
        .then((data) => { if (!cancelled) setResults({ query: term, items: data.items || [], error: null }) })
        .catch((error) => { if (!cancelled) setResults({ query: term, items: [], error: error.message }) })
    }, 250)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [term])

  const shown = term.length >= 2 && results.query === term ? results.items : []
  const isPicked = (code) => picked.some((item) => item.codigo === code)
  const toggle = (problem) => setPicked((current) => (isPicked(problem.codigo)
    ? current.filter((item) => item.codigo !== problem.codigo)
    : current.length < MAX_PICKED ? [...current, { codigo: problem.codigo, titulo: problem.titulo }] : current))

  return (
    <div className="flex flex-col gap-3 font-sans">
      <label htmlFor={`${id}-buscar`} className="text-sm font-bold">Buscar en el banco de problemas</label>
      <input id={`${id}-buscar`} type="search" value={query} onChange={(event) => setQuery(event.target.value)} autoFocus={autoFocus} placeholder="Código, título o competencia: TP-A01, congruencias…" className="tp-input" />
      {term.length >= 2 && results.query === term && !results.error && shown.length === 0 && <p className="text-sm text-tp-ink-muted">No hay problemas con «{term}».</p>}
      {results.error && <p role="alert" className="text-sm font-semibold text-red-700">{results.error}</p>}
      {shown.length > 0 && (
        <ul aria-label="Resultados" className="flex flex-col divide-y-2 divide-dashed divide-tp-rule rounded-[10px] border-2 border-tp-ink bg-tp-surface">
          {shown.map((problem) => {
            const on = isPicked(problem.codigo)
            return (
              <li key={problem._id}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(problem)}
                  className={`flex min-h-11 w-full items-center gap-3 px-3 py-2 text-left text-sm ${on ? 'bg-tp-mint-soft' : 'hover:bg-tp-yellow-soft'}`}
                >
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true" className="font-black">{on ? '✓' : '+'}</span>
                    <span className="shrink-0 whitespace-nowrap font-black text-tp-violet">{problem.codigo}</span>
                    <span className="font-semibold">{problem.titulo}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
      <div className="flex flex-col gap-2 border-t-2 border-dashed border-tp-rule pt-3">
        <p className="text-sm font-bold">Elegidos ({picked.length})</p>
        {picked.length === 0
          ? <p className="text-sm text-tp-ink-muted">Elige uno o varios; aparecen en la caja en este orden.</p>
          : <ol className="flex flex-wrap gap-2">{picked.map((item) => (
            <li key={item.codigo}>
              <button type="button" onClick={() => toggle(item)} aria-label={`Quitar ${item.codigo}`} className="tp-pill min-h-11 bg-tp-mint-soft text-xs">{item.codigo} ✕</button>
            </li>
          ))}</ol>}
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm font-semibold">
            Caja
            <select value={kind} onChange={(event) => setKind(event.target.value)} className="tp-input mt-1 font-normal">
              {PROBLEM_BOX_KINDS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <button type="button" disabled={!picked.length} onClick={() => onInsert(picked.map((item) => item.codigo), kind)} className="tp-button bg-tp-ink px-4 text-sm font-bold text-white disabled:opacity-60">Insertar en la lección</button>
        </div>
      </div>
    </div>
  )
}
