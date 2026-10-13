import { Link } from 'react-router-dom'
import MathText from '../math/MathText'

const MAJOR = ['IDEAS CLAVE', 'EJEMPLO TRABAJADO', 'ERRORES FRECUENTES', 'PRACTICA', 'EN RESUMEN', 'AMPLIACIÓN Y COMPROBACIONES']

// Deliberately small plain-text format: headings, optional disclosures and a
// canonical-practice insertion point. No arbitrary HTML or Markdown execution.
export default function ArticleText({ text, problems = [], context = '', renderCollection }) {
  const explicitPractice = String(text).includes('[[practice]]')
  const chunks = String(text).split(/(:::(?:reveal|definition) [^\n]+\n[\s\S]*?\n:::)/g).filter(Boolean)
  const blocks = chunks.flatMap((chunk) => /^:::(reveal|definition) /.test(chunk) ? [chunk] : chunk.split(/\n\n/).filter((block) => block.trim()))
  let headingNumber = 0
  return blocks.flatMap((block, i) => {
    const definition = block.match(/^:::definition ([^\n]+)\n([\s\S]*?)\n:::$/)
    if (definition) return <aside key={i} aria-label={`Definición: ${definition[1]}`} className="my-8 border-2 border-brand-900 border-l-8 bg-[#e8ddff] p-5 sm:p-6"><p className="text-xs font-black uppercase tracking-widest">Definición</p><h3 className="mt-2 text-lg font-black">{definition[1]}</h3><MathText text={definition[2]} className="mt-3 whitespace-pre-wrap leading-8" /></aside>
    const collection = block.trim().match(/^\[\[collection:([a-z-]+):(practice|challenge)\]\]$/)
    if (collection && renderCollection) return <div key={i}>{renderCollection(collection[1], collection[2])}</div>
    const reveal = block.match(/^:::reveal ([^\n]+)\n([\s\S]*?)\n:::$/)
    if (reveal) return <details key={i} className="my-6 border-2 border-brand-900 bg-accent-sky/20 p-5"><summary className="cursor-pointer font-bold focus-visible:outline-2 focus-visible:outline-offset-4">{reveal[1]}</summary><div className="mt-4"><ArticleText text={reveal[2]} /></div></details>
    if (block.trim() === '[[practice]]') return problems.map((problem) => <ProblemPreview key={`practice-${problem._id}`} problem={problem} context={context} />)
    const source = block.trim().match(/^\[\[source:(https:\/\/[^\s\]]+)\]\]$/)
    if (source) return <p key={i} className="my-8 border-t border-brand-300 pt-5 text-sm leading-6">Explicaciones y actividades originales de TeacherPeri. Orden de secciones basado en <a className="font-bold underline" href={source[1]} target="_blank" rel="noreferrer">el material de OMMBC ↗</a>.</p>
    const lines = block.trim().split('\n')
    const headings = []
    while (lines.length && (/^#{2,3} /.test(lines[0]) || (/^[A-ZÁÉÍÓÚÜÑ][A-ZÁÉÍÓÚÜÑ0-9 —:–,¿?()./-]+$/.test(lines[0]) && lines[0].length < 110))) {
      const raw = lines.shift()
      const title = raw.replace(/^#{2,3} /, '')
      const major = raw.startsWith('## ') || MAJOR.includes(title)
      headings.push(major
        ? <h2 key={`${i}-h${headings.length}`} className={`tp-lesson-heading tp-lesson-heading-${headingNumber++ % 4} mt-10 mb-4 text-lg font-black text-brand-900`}>{title === 'PRACTICA' ? 'PRÁCTICA' : title}</h2>
        : <h3 key={`${i}-h${headings.length}`} className="mt-6 text-base font-black text-brand-900">{title}</h3>)
    }
    const practice = explicitPractice ? [] : problems.filter((_, index) => Math.min(blocks.length - 1, Math.floor((index + 1) * blocks.length / (problems.length + 1))) === i)
    return [...headings, ...(lines.length ? [<MathText key={i} text={lines.join('\n')} className="my-5 whitespace-pre-wrap text-base leading-8 text-brand-900" />] : []), ...practice.map((problem) => <ProblemPreview key={`practice-${problem._id}`} problem={problem} context={context} />)]
  })
}

function ProblemPreview({ problem, context }) {
  return <aside className="tp-card-soft my-10 bg-accent-yellow p-5 sm:p-7">
    <p className="text-xs font-black uppercase tracking-widest">Tu turno · Del banco de problemas</p>
    <h3 className="mt-3 text-xl font-black">{`Problema ${problem.codigo}`}</h3>
    <MathText text={problem.enunciado} className="mt-4 whitespace-pre-wrap leading-8" />
    <Link className="tp-button mt-5 bg-white px-4 py-2 font-bold" to={problem.reviewHref || `/entrenamiento/problemas/${problem._id}${context}`}>Resolver problema →</Link>
  </aside>
}
