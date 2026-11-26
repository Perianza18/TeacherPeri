import { useEffect } from 'react'
import { plainMathText } from '../lib/mathAlt'

// Title, description and canonical link of the open page, for search engines
// (Google runs the app and reads them) and the browser tab. index.html holds
// the same defaults for crawlers that do not run JavaScript, so keep
// DEFAULT_TITLE and DEFAULT_DESCRIPTION in step with it.
//   title:       the page's own title; « | TeacherPeri» is added after it
//   fullTitle:   true to use `title` as it is, without « | TeacherPeri»
//   description: one or two sentences; $…$ math becomes plain text
//                («90^\circ» → «90°») and it is cut near 160 characters,
//                the length Google shows
//   noindex:     keep the page out of search results. Only for content that
//                does not exist (a 404): a passing error, such as too many
//                requests or the API waking up, must not tell Google to
//                drop a real page
// Leaving the page restores the defaults, so a page that does not call this
// hook never shows the previous page's title.

export const DEFAULT_TITLE = 'TeacherPeri | Material para la olimpiada de matemáticas'
export const DEFAULT_DESCRIPTION = 'TeacherPeri: material en español para la olimpiada de matemáticas. Rutas de entrenamiento, problemas, teoría y exámenes para prepararte para la OMM desde cualquier nivel.'

const MAX_DESCRIPTION = 160

export function summarize(text) {
  const plain = plainMathText(text)
  if (plain.length <= MAX_DESCRIPTION) return plain
  const cut = plain.slice(0, MAX_DESCRIPTION - 1)
  return `${cut.slice(0, cut.lastIndexOf(' ') > 100 ? cut.lastIndexOf(' ') : cut.length)}…`
}

function headTag(selector, create) {
  let tag = document.head.querySelector(selector)
  if (!tag && create) {
    tag = create()
    document.head.appendChild(tag)
  }
  return tag
}

function setDescription(text) {
  headTag('meta[name="description"]', () => Object.assign(document.createElement('meta'), { name: 'description' }))
    .setAttribute('content', text)
}

function setCanonical(url) {
  if (!url) return headTag('link[rel="canonical"]')?.remove()
  headTag('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' })).href = url
}

function setNoindex(on) {
  if (!on) return headTag('meta[name="robots"]')?.remove()
  headTag('meta[name="robots"]', () => Object.assign(document.createElement('meta'), { name: 'robots' }))
    .setAttribute('content', 'noindex')
}

export function usePageMeta({ title, description, noindex = false, fullTitle = false } = {}) {
  useEffect(() => {
    document.title = title ? (fullTitle ? title : `${title} | TeacherPeri`) : DEFAULT_TITLE
    setDescription(description ? summarize(description) : DEFAULT_DESCRIPTION)
    setCanonical(noindex ? null : `${window.location.origin}${window.location.pathname}`)
    setNoindex(noindex)
    return () => {
      document.title = DEFAULT_TITLE
      setDescription(DEFAULT_DESCRIPTION)
      setCanonical(null)
      setNoindex(false)
    }
  }, [title, description, noindex, fullTitle])
}
