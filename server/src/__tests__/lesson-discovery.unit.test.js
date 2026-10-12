import { describe, it, expect } from 'vitest'
import { isLessonOnly } from '../routes/paths.utils.js'
describe('lesson-only discovery classification', () => {
  const theory = { contentType: 'Theory', target: 'lesson-a' }
  it('recognizes repeated references to one lesson with practice', () => {
    expect(isLessonOnly('leaf', [theory, theory, { contentType: 'Problem', target: 'p' }])).toBe(true)
  })
  it('keeps genuine curricula and mixed training discoverable', () => {
    expect(isLessonOnly('parent', [theory])).toBe(false)
    expect(isLessonOnly('leaf', [theory, { ...theory, target: 'lesson-b' }])).toBe(false)
    expect(isLessonOnly('leaf', [{ contentType: 'Problem', target: 'p' }])).toBe(false)
    expect(isLessonOnly('leaf', [theory, { contentType: 'Exam', target: 'e' }])).toBe(false)
    expect(isLessonOnly('leaf', [])).toBe(false)
  })
})
