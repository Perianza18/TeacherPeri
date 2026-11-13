import { describe, it, expect } from 'vitest'
import { planEditorialRevision } from '../data/editorialRevisionPlan.js'
import { MVP_LESSONS, PREVIOUS_EDITORIAL_THEORY, PREVIOUS_WRITING_LAB_THEORY } from '../data/mvpLessons.js'
import { THEORY_WRITING_LAB } from '../data/theoryWritingLab.js'

describe('reviewed editorial updates', () => {
  const lessons = MVP_LESSONS.filter((lesson) => Object.hasOwn(THEORY_WRITING_LAB, lesson.pathSlug))
  it('updates the six chosen canonical articles from either known baseline without changing identities or relationships', () => {
    expect(lessons).toHaveLength(6)
    expect(Object.values(THEORY_WRITING_LAB).filter((x) => x.model === 'A')).toHaveLength(3)
    expect(Object.values(THEORY_WRITING_LAB).filter((x) => x.model === 'B')).toHaveLength(3)
    for (const { theory } of lessons) {
      const baselines = [PREVIOUS_EDITORIAL_THEORY[theory.key], PREVIOUS_WRITING_LAB_THEORY[theory.key]]
      for (const baseline of baselines) {
        const current = { ...baseline, _id: 'existing-id', topics: ['keep-topic'] }
        const before = structuredClone(current)
        const change = planEditorialRevision(current, theory, baselines)
        expect(change.update).toEqual({ $set: { content: theory.content, engagement: theory.engagement } })
        expect(change.filter).toEqual({ _id: 'existing-id', content: baseline.content, engagement: baseline.engagement ?? null })
        expect(current).toEqual(before)
      }
      expect(planEditorialRevision(theory, theory, baselines)).toBeNull()
    }
  })
  it('refuses independently edited prose or editorial metadata', () => {
    const theory = lessons[0].theory
    const baseline = PREVIOUS_WRITING_LAB_THEORY[theory.key]
    expect(() => planEditorialRevision({ ...baseline, content: baseline.content + ' Teacher edit.' }, theory, [baseline])).toThrow(/Independent/)
    expect(() => planEditorialRevision({ ...baseline, engagement: 1 }, theory, [baseline])).toThrow(/Independent/)
  })
  it('does not revise the other 31 lessons', () => {
    for (const lesson of MVP_LESSONS.filter((item) => !Object.hasOwn(THEORY_WRITING_LAB, item.pathSlug))) {
      expect(lesson.theory).toEqual(PREVIOUS_WRITING_LAB_THEORY[lesson.theory.key])
    }
  })
})
