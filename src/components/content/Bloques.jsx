import MathText from '../math/MathText'

// Theory content blocks (DESIGN §5). Each type always has the same look;
// the reading text inside inherits the article's math font.

// Box label pill. UI text, so it stays in Inter inside the article.
export function BoxLabel({ className = 'bg-tp-yellow', children }) {
  return <span className={`tp-pill self-start px-[11px] py-0.5 font-sans text-[11px] font-extrabold uppercase leading-normal tracking-[0.12em] ${className}`}>{children}</span>
}

// Mint header strip «EJEMPLO n», numbered in reading order.
export function Ejemplo({ number, title, children }) {
  return (
    <div className="tp-card-quiet overflow-hidden bg-tp-surface">
      <h3 className="border-b-2 border-tp-ink bg-tp-mint px-5 py-2 font-sans text-xs font-extrabold uppercase tracking-[0.12em]">Ejemplo {number}</h3>
      <div className="flex flex-col gap-2.5 px-5 py-4">
        {title && <MathText text={title} className="font-bold" />}
        {children}
      </div>
    </div>
  )
}

export function ErrorComun({ children }) {
  return (
    <div className="tp-card-quiet flex flex-col gap-2 bg-tp-coral-soft px-5 py-4">
      <BoxLabel className="bg-tp-coral">Error común</BoxLabel>
      {children}
    </div>
  )
}

// Inténtalo-style box: the answers stay hidden until the reader opens it.
export function RespuestasDeControl({ text }) {
  return (
    <details className="tp-card-soft bg-tp-surface px-5 py-2">
      {/* py-2.5 keeps the native disclosure arrow and a 44px tap height. */}
      <summary className="cursor-pointer py-2.5 font-sans font-bold">Respuestas de control</summary>
      <MathText text={text} className="whitespace-pre-line pb-2" />
    </details>
  )
}
