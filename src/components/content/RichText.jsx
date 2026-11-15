import { useMemo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { parseInline } from '../../lib/inlineMarkup'

// Only KaTeX output is inserted as HTML (trust stays off, so \href and
// similar commands are refused). Every other character stays a React text
// node, so lesson text can never inject markup.
function renderNodes(nodes, prefix = '') {
  return nodes.map((node, index) => {
    const key = `${prefix}${index}`
    switch (node.type) {
      case 'math':
        return <span key={key} dangerouslySetInnerHTML={{ __html: katex.renderToString(node.tex, { throwOnError: false }) }} />
      case 'display':
        return <span key={key} className="my-2 block overflow-x-auto overflow-y-hidden" dangerouslySetInnerHTML={{ __html: katex.renderToString(node.tex, { throwOnError: false, displayMode: true }) }} />
      case 'strong':
        return <strong key={key}>{renderNodes(node.children, `${key}-`)}</strong>
      case 'em':
        return <em key={key}>{renderNodes(node.children, `${key}-`)}</em>
      default:
        return node.text
    }
  })
}

// Text with inline lesson markup. Line breaks inside the text are kept
// unless `keepLines` is false (short previews).
export default function RichText({ text, as: Tag = 'p', className = '', keepLines = true }) {
  const nodes = useMemo(() => parseInline(text), [text])
  return <Tag className={`${keepLines ? 'whitespace-pre-line' : ''} ${className}`.trim()}>{renderNodes(nodes)}</Tag>
}
