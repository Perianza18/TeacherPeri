// Inline markup for lesson text: **negritas**, *cursivas*, $math$ and
// $$display math$$. Returns plain data nodes; RichText turns them into React
// elements. Nothing here produces HTML, so lesson text can never inject any.
//
// Nodes: { type: 'text', text } · { type: 'math', tex } · { type: 'display', tex }
//        { type: 'strong', children } · { type: 'em', children }

const MATH = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g
// Private-use characters mark where each formula was set aside.
const PLACEHOLDER = /(\d+)/g
const EMPHASIS = /\*\*(?=\S)([\s\S]*?\S)\*\*|\*(?=[^\s*])([^*]*?[^\s*])\*/g
const ESCAPED_STAR = ''

function expand(text, maths) {
  const nodes = []
  let last = 0
  for (const match of text.matchAll(PLACEHOLDER)) {
    if (match.index > last) nodes.push({ type: 'text', text: text.slice(last, match.index) })
    nodes.push(maths[Number(match[1])])
    last = match.index + match[0].length
  }
  if (last < text.length) nodes.push({ type: 'text', text: text.slice(last) })
  return nodes.map((node) => (node.type === 'text' ? { ...node, text: node.text.replaceAll(ESCAPED_STAR, '*') } : node))
}

function emphasis(text, maths) {
  const nodes = []
  let last = 0
  for (const match of text.matchAll(EMPHASIS)) {
    nodes.push(...expand(text.slice(last, match.index), maths))
    nodes.push(match[1] != null
      ? { type: 'strong', children: emphasis(match[1], maths) }
      : { type: 'em', children: emphasis(match[2], maths) })
    last = match.index + match[0].length
  }
  nodes.push(...expand(text.slice(last), maths))
  return nodes.filter((node) => node.type !== 'text' || node.text)
}

export function parseInline(text) {
  const maths = []
  // Math is set aside first, so a `*` inside a formula is never emphasis.
  const protectedText = String(text ?? '')
    .replaceAll('\\*', ESCAPED_STAR)
    .replace(MATH, (_, display, inline) => {
      maths.push(display != null ? { type: 'display', tex: display.trim() } : { type: 'math', tex: inline })
      return `${maths.length - 1}`
    })
  return emphasis(protectedText, maths)
}

// Plain words, for reading time and labels.
export function plainText(text) {
  return String(text ?? '').replace(MATH, ' x ').replace(/[*_#|]/g, ' ')
}
