import { describe, it, expect } from 'vitest'
import { LESSON_BLOCKS, blockSnippet, figureSnippet, headingSnippet, insertSnippet, markupLines, mathParts, mathSnippet, problemsSnippet, tableSnippet } from '../../../src/lib/lessonMarkup.js'
import { codesOfKey, parseArticle, problemReferences } from '../../../src/lib/theoryArticle.js'

const write = (value, start, end, snippet) => insertSnippet(value, start, end, snippet)

describe('lesson editor toolbar markup', () => {
  it('offers every block the renderer draws', () => {
    expect(LESSON_BLOCKS.map((block) => block.kind)).toEqual(['definition', 'theorem', 'lemma', 'corollary', 'proposition', 'proof', 'example', 'try', 'tip', 'mistake', 'reveal'])
  })

  it('a block goes on its own lines, wraps the selection and parses as that box', () => {
    const value = 'Texto antes.\nUn número es par si 2 lo divide.\nTexto después.'
    const start = value.indexOf('Un número')
    const end = start + 'Un número es par si 2 lo divide.'.length
    const result = write(value, start, end, blockSnippet('definition', value.slice(start, end)))
    expect(result.value).toBe('Texto antes.\n\n:::definition Nombre\nUn número es par si 2 lo divide.\n:::\n\nTexto después.')
    expect(result.value.slice(result.start, result.end)).toBe('Nombre')
    const box = parseArticle(result.value).blocks.find((block) => block.type === 'box')
    expect(box).toMatchObject({ kind: 'definition', title: 'Nombre' })
  })

  it('every block snippet parses back to its own kind', () => {
    for (const { kind } of LESSON_BLOCKS.filter((block) => block.kind !== 'reveal')) {
      const { blocks } = parseArticle(write('', 0, 0, blockSnippet(kind)).value)
      expect(kind === 'example' ? blocks[0].type : blocks[0].kind).toBe(kind)
    }
  })

  it('an example keeps the statement visible and the solution hidden', () => {
    const [example] = parseArticle(write('', 0, 0, blockSnippet('example')).value).blocks
    expect(example.statement).toMatchObject({ type: 'paragraph', text: 'Enunciado del ejemplo.' })
    expect(example.hidden).toHaveLength(1)
  })

  it('headings, math, figures and tables', () => {
    expect(write('Hola', 4, 4, headingSnippet(2)).value).toBe('Hola\n\n## Sección')
    expect(write('x', 0, 1, headingSnippet(3, 'x')).value).toBe('### x')
    const math = write('sea n entero', 4, 5, mathSnippet('n'))
    expect(math.value).toBe('sea $n$ entero')
    expect(math.value.slice(math.start, math.end)).toBe('n')
    expect(write('', 0, 0, mathSnippet()).value).toBe('$x$')
    expect(parseArticle(write('', 0, 0, tableSnippet()).value).blocks[0].type).toBe('table')
    expect(parseArticle(write('', 0, 0, figureSnippet()).value).blocks[0].type).toBe('figures')
  })

  it('a problem reference shows as a problem box and can be loaded', () => {
    const text = write('Practica:', 9, 9, problemsSnippet(['TP-A01', 'TP-G08'], 'ejercicios')).value
    expect(text).toBe('Practica:\n\n[[problems:TP-A01,TP-G08:ejercicios]]')
    const box = parseArticle(text).blocks.find((block) => block.type === 'collection')
    expect(box).toEqual({ type: 'collection', slug: 'problems:TP-A01,TP-G08', kind: 'ejercicios' })
    expect(codesOfKey(box.slug)).toEqual(['TP-A01', 'TP-G08'])
    expect(problemReferences(text)).toEqual([{ key: 'problems:TP-A01,TP-G08', codes: ['TP-A01', 'TP-G08'], kind: 'ejercicios' }])
    expect(problemReferences('[[problems:TP-A01]]')).toEqual([])
  })
})

describe('editor text in its page format', () => {
  it('marks each line with its box (inner one when nested) and role', () => {
    const text = ['## Teoría', ':::theorem Tales', 'Enunciado.', ':::reveal Pista', 'Mira el ángulo.', ':::', ':::', '', '[[problems:TP-A01:ejercicios]]', '| a | b |', '![alt](figuras/x.svg)', 'Texto.'].join('\n')
    expect(markupLines(text).map((line) => [line.box, line.role])).toEqual([
      [null, 'h2'], ['theorem', 'open'], ['theorem', 'body'], ['reveal', 'open'], ['reveal', 'body'], ['reveal', 'close'], ['theorem', 'close'],
      [null, 'text'], [null, 'problems'], [null, 'table'], [null, 'figure'], [null, 'text'],
    ])
  })

  it('keeps every character, so the colored layer lines up with the text', () => {
    const text = 'a\n\n:::tip X\nb $x$\n:::\n'
    expect(markupLines(text).map((line) => line.text).join('\n')).toBe(text)
    expect(mathParts('sea $n$ y $$m$$ fin')).toEqual([{ text: 'sea ', math: false }, { text: '$n$', math: true }, { text: ' y ', math: false }, { text: '$$m$$', math: true }, { text: ' fin', math: false }])
  })
})
