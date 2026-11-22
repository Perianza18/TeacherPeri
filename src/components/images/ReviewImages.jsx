import { imageSrc } from '../../lib/images'
import { plainMathText } from '../../lib/mathAlt'
import MathText from '../math/MathText'

// For reviewers (Panel del equipo): each picture with its description next to
// it, math rendered with KaTeX, so they can read what a screen reader will
// say. The public page never shows the description (see ProblemImages).
export default function ReviewImages({ images }) {
  if (!images?.length) return null
  return (
    <ol className="flex flex-col gap-3" aria-label="Imágenes y sus descripciones">
      {images.map((entry, index) => (
        <li key={entry.image} className="tp-card-quiet flex flex-col gap-3 bg-tp-surface p-3 sm:flex-row sm:items-start">
          <img src={imageSrc(entry.image)} alt={plainMathText(entry.alt)} loading="lazy" className="h-auto max-h-56 w-full shrink-0 rounded-[10px] border-2 border-tp-ink bg-tp-paper object-contain sm:w-56" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-tp-ink-muted">
              Imagen {index + 1}{entry.placement === 'solution' ? ' · dentro de la solución' : ''} · descripción para lectores de pantalla
            </p>
            <MathText text={entry.alt} className="mt-1 break-words text-sm leading-6 text-tp-ink" />
          </div>
        </li>
      ))}
    </ol>
  )
}
