import katex from 'katex'
import { buildMvpManifest } from './mvpManifest.js'

export function validateMvpContent(entries = buildMvpManifest()) {
  const ids = new Set(entries.map((e) => `${e.model}:${e._id}`))
  if (ids.size !== entries.length) throw new Error('Duplicate content identity.')
  const reference = (model, id) => { if (!ids.has(`${model}:${id}`)) throw new Error(`Missing ${model} reference ${id}`) }
  const render = (value) => {
    if (typeof value === 'string') {
      const plain = value.replace(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g, (_match, display, inline) => { katex.renderToString(display || inline, { throwOnError: true, strict: 'error', displayMode: Boolean(display) }); return '' })
      if (plain.includes('$')) throw new Error('Unbalanced mathematical delimiters.')
    } else if (Array.isArray(value)) value.forEach(render)
    else if (value && typeof value === 'object') Object.values(value).forEach(render)
  }
  const leaves = new Set(entries.filter((e) => e.model === 'Step').map((e) => e.data.path))
  const parents = new Set(entries.filter((e) => e.model === 'PathReference').map((e) => e.data.parentPath))
  if ([...leaves].some((id) => parents.has(id))) throw new Error('A Path cannot own Steps and child Paths.')
  for (const entry of entries) {
    render(entry.data)
    const data = entry.data
    for (const [field, model] of [['topics', 'Topic'], ['categories', 'Category'], ['tags', 'Tag']]) (data[field] || []).forEach((id) => reference(model, id))
    if (entry.model === 'Path' && data.publicationStatus === 'published' && !leaves.has(entry._id) && !parents.has(entry._id)) throw new Error('Empty published Path.')
    if (entry.model === 'PathReference') { reference('Path', data.parentPath); reference('Path', data.childPath); if (data.section) reference('PathSection', data.section) }
    if (entry.model === 'Step') { reference('Path', data.path); data.teacherperiReferences.forEach((r) => reference(r.contentType, r.target)) }
    if (data.problems) {
      if (new Set(data.problems.map((r) => r.problem)).size !== data.problems.length) throw new Error('Repeated Problem reference.')
      data.problems.forEach((r, i) => { if (r.position !== i + 1) throw new Error('Invalid problem order.'); reference('Problem', r.problem) })
    }
    if (data.pdfUrl || data.hostedFileReference) throw new Error('The release must not host third-party PDFs.')
  }
  return Object.fromEntries([...new Set(entries.map((e) => e.model))].map((model) => [model, entries.filter((e) => e.model === model).length]))
}
