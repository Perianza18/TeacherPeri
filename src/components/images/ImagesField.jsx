import { useId, useRef, useState } from 'react'
import { ALT_MAX, IMAGES_PER_PROBLEM, imageSrc, uploadImage } from '../../lib/images'

// Add, describe, replace, reorder or remove a problem's pictures.
// `value` is [{ image, alt, placement }]. `allowSolution` (editors and admins)
// lets a picture go inside the solution instead of under the statement.
export default function ImagesField({ value, onChange, token, allowSolution = false }) {
  const id = useId()
  const fileInput = useRef(null)
  const replaceIndex = useRef(null)
  const [state, setState] = useState({ busy: false, error: null })
  const full = value.length >= IMAGES_PER_PROBLEM

  const pick = (index = null) => {
    replaceIndex.current = index
    fileInput.current?.click()
  }
  const onFile = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setState({ busy: true, error: null })
    try {
      const uploaded = await uploadImage(file, token)
      const index = replaceIndex.current
      if (index === null) onChange([...value, { image: uploaded._id, alt: '', placement: 'statement' }])
      else onChange(value.map((entry, i) => (i === index ? { ...entry, image: uploaded._id } : entry)))
      setState({ busy: false, error: null })
    } catch (error) {
      setState({ busy: false, error: error.message })
    }
  }
  const update = (index, patch) => onChange(value.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)))
  const move = (index, step) => {
    const next = [...value]
    const [entry] = next.splice(index, 1)
    next.splice(index + step, 0, entry)
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-sm font-bold">Imágenes (opcional)</p>
        <p id={`${id}-ayuda`} className="mt-1 text-sm text-tp-ink-muted">Hasta {IMAGES_PER_PROBLEM}: PNG, JPG o WebP de máximo 5 MB. Cada una necesita una descripción para quien no puede verla, por ejemplo «Triángulo ABC con la altura desde A marcada».</p>
      </div>
      <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp" onChange={onFile} className="sr-only" tabIndex={-1} aria-hidden="true" />
      {value.length > 0 && (
        <ol className="flex flex-col gap-3">
          {value.map((entry, index) => (
            <li key={entry.image} className="tp-card-quiet flex flex-col gap-3 bg-tp-surface p-3 sm:flex-row">
              <img src={imageSrc(entry.image)} alt="" className="h-28 w-full shrink-0 rounded-[10px] border-2 border-tp-ink bg-tp-paper object-contain sm:w-40" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <label htmlFor={`${id}-alt-${index}`} className="text-sm font-bold">Descripción de la imagen {index + 1}</label>
                <textarea id={`${id}-alt-${index}`} value={entry.alt} onChange={(event) => update(index, { alt: event.target.value })} rows={2} maxLength={ALT_MAX} required aria-describedby={`${id}-ayuda`} className="tp-input text-sm" />
                {allowSolution && (
                  <label className="text-sm font-semibold">
                    Dónde se muestra
                    <select value={entry.placement || 'statement'} onChange={(event) => update(index, { placement: event.target.value })} className="tp-input mt-1 font-normal">
                      <option value="statement">Debajo del enunciado</option>
                      <option value="solution">Dentro de la solución</option>
                    </select>
                  </label>
                )}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold">
                  <button type="button" onClick={() => pick(index)} disabled={state.busy} className="min-h-11 text-tp-violet underline underline-offset-2">Reemplazar</button>
                  {index > 0 && <button type="button" onClick={() => move(index, -1)} className="min-h-11 underline underline-offset-2">Subir</button>}
                  {index < value.length - 1 && <button type="button" onClick={() => move(index, 1)} className="min-h-11 underline underline-offset-2">Bajar</button>}
                  <button type="button" onClick={() => onChange(value.filter((_, i) => i !== index))} className="min-h-11 text-tp-ink-muted underline underline-offset-2">Quitar</button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
      <div>
        <button type="button" onClick={() => pick(null)} disabled={state.busy || full} className="tp-button bg-tp-surface px-4 text-sm font-bold disabled:opacity-60">
          {state.busy ? 'Subiendo…' : full ? `Ya hay ${IMAGES_PER_PROBLEM} imágenes` : 'Agregar imagen'}
        </button>
      </div>
      {state.error && <p role="alert" className="text-sm font-semibold text-red-700">{state.error}</p>}
    </div>
  )
}
