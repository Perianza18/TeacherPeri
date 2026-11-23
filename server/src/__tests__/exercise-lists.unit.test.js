import { describe, expect, it } from 'vitest'
import { EXERCISE_CODES, EXERCISE_LISTS } from '../data/exerciseLists.js'
import { THEORY_COLLECTIONS, THEORY_PROBLEMS } from '../data/theory/index.js'
import { MVP_PROBLEMS } from '../data/mvpProblems.js'

describe('exercise list classification', () => {
  it('includes all lesson exercise boxes and resolves each code', () => {
    const known = new Set([...THEORY_PROBLEMS, ...MVP_PROBLEMS].map((item) => item.codigo))
    for (const { problemCodes } of THEORY_COLLECTIONS.filter((box) => box.kind === 'ejercicios')) {
      for (const code of problemCodes) expect(EXERCISE_CODES).toContain(code)
    }
    for (const list of EXERCISE_LISTS) {
      expect(new Set(list.codes).size).toBe(list.codes.length)
      for (const code of list.codes) expect(known.has(code)).toBe(true)
    }
  })
  it('includes direct applications outside the exercise boxes and supports multiple lists', () => {
    expect(EXERCISE_CODES).toContain('TP-G23')
    expect(EXERCISE_CODES).toContain('TP-A65')
    expect(EXERCISE_LISTS.filter((list) => list.codes.includes('TP-A55')).length).toBeGreaterThan(1)
    expect(EXERCISE_LISTS.filter((list) => list.codes.includes('TP-A03')).length).toBeGreaterThan(1)
    expect(EXERCISE_CODES).not.toContain('TP-C16')
  })
})
