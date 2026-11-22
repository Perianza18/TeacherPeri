import { describe, expect, it } from 'vitest'
import { summarize } from '../../../src/hooks/usePageMeta.js'

describe('Page descriptions for search engines', () => {
  it('turns $…$ math into plain text', () => {
    expect(summarize('En un triángulo $ABC$, el ángulo exterior en $C$ mide $124^\\circ$ y $\\angle A=49^\\circ$. Calcula $\\angle B$.'))
      .toBe('En un triángulo ABC, el ángulo exterior en C mide 124° y ángulo A=49°. Calcula ángulo B.')
  })

  it('keeps a short description as it is', () => {
    expect(summarize('Lecciones de teoría para la olimpiada.')).toBe('Lecciones de teoría para la olimpiada.')
  })

  it('cuts a long description at a word, near 160 characters', () => {
    const long = 'palabra '.repeat(40)
    const result = summarize(long)
    expect(result.length).toBeLessThanOrEqual(160)
    expect(result.endsWith('palabra…')).toBe(true)
  })
})
