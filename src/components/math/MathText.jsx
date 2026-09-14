import katex from 'katex'
import 'katex/dist/katex.min.css'

function inlineMath(text, keyPrefix) {
  return text.split(/(\$[^$]+\$)/g).map((part, index) => {
    const formula = part.startsWith('$') && part.endsWith('$') && part.length > 1
    if (!formula) return <span key={`${keyPrefix}-${index}`}>{part}</span>
    const html = katex.renderToString(part.slice(1, -1), { throwOnError: false })
    return <span key={`${keyPrefix}-${index}`} dangerouslySetInnerHTML={{ __html: html }} />
  })
}

// Only KaTeX generates inserted HTML. All other content stays in React text
// nodes, which keeps native Theory and legacy Problem text safely rendered.
export default function MathText({ text, className = '' }) {
  return <div className={className}>{String(text || '').split(/(\$\$[\s\S]+?\$\$)/g).map((block, index) => {
    const display = block.startsWith('$$') && block.endsWith('$$') && block.length > 4
    if (!display) return inlineMath(block, index)
    const html = katex.renderToString(block.slice(2, -2), { throwOnError: false, displayMode: true })
    return <div key={index} className="my-2 overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} />
  })}</div>
}
