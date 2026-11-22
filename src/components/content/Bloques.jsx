import { useState } from 'react'
import RichText from './RichText'

// Theory content blocks (DESIGN §5). Each type always has the same look;
// reading text inside inherits the article's math font, labels use Inter.

const LABELS = { lemma: 'Lema', corollary: 'Corolario', proposition: 'Proposición' }

// «TEOREMA · NOMBRE», «LEMA 1» (number only when there is no name).
function boxLabel(word, title, number) {
  if (title) return `${word} · ${title}`
  return number ? `${word} ${number}` : word
}

// Box label pill. UI text, so it stays in Inter inside the article.
export function BoxLabel({ className = 'bg-tp-yellow', children }) {
  return <span className={`tp-pill self-start px-[11px] py-0.5 font-sans text-[11px] font-extrabold uppercase leading-normal tracking-[0.12em] ${className}`}>{children}</span>
}

export function Definicion({ title, children }) {
  return (
    <div className="tp-card-soft flex flex-col gap-2 bg-tp-sky-soft px-5 py-[18px]">
      <BoxLabel className="bg-tp-sky">{boxLabel('Definición', title)}</BoxLabel>
      {children}
    </div>
  )
}

// Strongest box. Display formulas ($$…$$) are centered by KaTeX.
export function Teorema({ title, children }) {
  return (
    <div className="tp-box-strong flex flex-col gap-2.5 bg-tp-violet-soft px-[22px] py-5">
      <BoxLabel className="bg-tp-violet text-white">{boxLabel('Teorema', title)}</BoxLabel>
      {children}
    </div>
  )
}

// Lema, Corolario and Proposición. ArticleText shows a paragraph that starts
// with «Idea:» as a quieter note.
export function Enunciado({ kind, title, number, children }) {
  return (
    <div className="tp-card-quiet flex flex-col gap-2 bg-tp-surface px-5 py-[18px]">
      <BoxLabel className="bg-tp-violet-soft">{boxLabel(LABELS[kind], title, number)}</BoxLabel>
      {children}
    </div>
  )
}

// Open by default in theory; dashed border; ends with ∎.
export function Demostracion({ title, children }) {
  return (
    <details open className="rounded-[14px] border-2 border-dashed border-tp-ink bg-tp-surface px-5 py-1">
      <summary className="cursor-pointer py-2.5 font-sans font-extrabold">{title ? `Demostración ${title}` : 'Demostración'}</summary>
      <div className="flex flex-col gap-2.5 pb-3">
        {children}
        <p className="text-right text-xl"><span role="img" aria-label="Fin de la demostración">∎</span></p>
      </div>
    </details>
  )
}

// Mint strip «EJEMPLO n». The statement is always visible (bold); the
// solution waits behind «Ver solución». Older lessons pass everything as
// `shown`, with no hidden part.
export function Ejemplo({ number, title, statement, solution, shown }) {
  return (
    <div className="tp-card-quiet overflow-hidden bg-tp-surface">
      <h3 className="border-b-2 border-tp-ink bg-tp-mint px-5 py-2 font-sans text-xs font-extrabold uppercase tracking-[0.12em]">
        Ejemplo {number}{title && <span className="normal-case tracking-normal"> · <RichText as="span" text={title} /></span>}
      </h3>
      <div className="flex flex-col gap-2.5 px-5 py-4">
        {statement && <div className="font-bold">{statement}</div>}
        {shown}
        {solution && (
          <details className="border-t-2 border-dashed border-tp-rule">
            <summary className="cursor-pointer py-2.5 font-sans font-bold">Ver solución</summary>
            <div className="flex flex-col gap-2.5 pb-1">{solution}</div>
          </details>
        )}
      </div>
    </div>
  )
}

// «Inténtalo: pregunta». The answer stays hidden until opened.
export function Intentalo({ question, children }) {
  return (
    <details className="tp-card-soft bg-tp-surface px-5 py-1">
      <summary className="cursor-pointer py-2.5 font-bold">Inténtalo: <RichText as="span" text={question} /></summary>
      <div className="flex flex-col gap-2.5 pb-3">{children}</div>
    </details>
  )
}

export function Consejo({ title, children }) {
  return (
    <div className="tp-card-quiet flex flex-col gap-2 bg-tp-yellow-soft px-5 py-4">
      <BoxLabel className="bg-tp-yellow">Consejo de olimpiada</BoxLabel>
      {title && <RichText text={title} className="font-bold" />}
      {children}
    </div>
  )
}

export function ErrorComun({ title, children }) {
  return (
    <div className="tp-card-quiet flex flex-col gap-2 bg-tp-orange-soft px-5 py-4">
      <BoxLabel className="bg-tp-orange">Error común</BoxLabel>
      {title && <RichText text={title} className="font-bold" />}
      {children}
    </div>
  )
}

// Generic fold-out (`:::reveal Título`), closed by default.
export function Revelar({ title, children }) {
  return (
    <details className="tp-card-quiet bg-tp-surface px-5 py-1">
      <summary className="cursor-pointer py-2.5 font-sans font-bold"><RichText as="span" text={title || 'Ver más'} /></summary>
      <div className="flex flex-col gap-2.5 pb-3">{children}</div>
    </details>
  )
}

// Inténtalo-style box for the «Respuestas de control» of older lessons.
export function RespuestasDeControl({ text }) {
  return (
    <details className="tp-card-soft bg-tp-surface px-5 py-1">
      <summary className="cursor-pointer py-2.5 font-sans font-bold">Respuestas de control</summary>
      <RichText as="div" text={text} className="pb-3" />
    </details>
  )
}

// White table, header row in paper tone; scrolls sideways inside its box.
export function Tabla({ header, align, rows }) {
  const alignClass = (index) => ({ center: 'text-center', right: 'text-right', left: 'text-left' }[align[index]] || 'text-left')
  return (
    <div className="overflow-x-auto rounded-xl border-2 border-tp-ink bg-tp-surface">
      <table className="w-full border-collapse">
        <thead className="bg-brand-100">
          <tr>{header.map((cell, index) => <th key={index} scope="col" className={`border-b-2 border-tp-ink px-3 py-2 font-bold ${alignClass(index)}`}><RichText as="span" text={cell} /></th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-tp-rule first:border-t-0">
              {row.map((cell, index) => <td key={index} className={`px-3 py-2 ${alignClass(index)}`}><RichText as="span" text={cell} /></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Figure from public/figuras. A missing file shows its alt text in a dashed
// box instead of a broken image.
export function Figura({ alt, src, title, resolveSrc, className = '' }) {
  const url = resolveSrc(src)
  const [failed, setFailed] = useState(false)
  if (import.meta.env.DEV && !alt) console.warn(`Figura sin texto alternativo: ${src}`)
  return (
    <figure className={`tp-card-quiet m-0 flex flex-col items-center gap-2 bg-tp-surface p-3.5 ${className}`}>
      {url && !failed
        ? <img src={url} alt={alt} onError={() => setFailed(true)} className="block h-auto w-full max-w-[480px]" />
        : <div role="img" aria-label={alt || 'Figura no disponible'} className="w-full rounded-[10px] border-2 border-dashed border-tp-ink-muted px-4 py-6 text-center font-sans text-sm text-tp-ink-muted">{alt || 'Figura no disponible'}</div>}
      {title && <RichText as="figcaption" text={title} className="text-center font-sans text-[13px]" />}
    </figure>
  )
}

// One or several figures; several of one idea sit in a row and stack on mobile.
export function Figuras({ images, resolveSrc }) {
  if (images.length === 1) return <Figura {...images[0]} resolveSrc={resolveSrc} />
  return <div className="flex flex-wrap gap-3.5">{images.map((image, index) => <Figura key={index} {...image} resolveSrc={resolveSrc} className="flex-[1_1_220px]" />)}</div>
}

// «Agregados culturales»: one white card per bullet.
export function AgregadosCulturales({ items }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((item, index) => <li key={index} className="tp-card-quiet bg-tp-surface px-5 py-4"><RichText as="span" text={item} /></li>)}
    </ul>
  )
}
