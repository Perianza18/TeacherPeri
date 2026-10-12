import { describe, expect, it } from 'vitest'
import { trainingContextFilter } from '../models/trainingContext.js'
import Problem from '../models/Problem.js'
import Theory from '../models/Theory.js'

describe('contextual challenge', () => {
  it('matches all dimensions in one assessment, not across different contexts', () => {
    expect(trainingContextFilter({ contest: 'OMM', stage: 'nacional', challenge: '2' })).toEqual({ trainingContexts: { $elemMatch: { contest: 'OMM', stage: 'nacional', challenge: 2 } } })
    expect(trainingContextFilter({})).toEqual({})
  })
  it('rejects ambiguous ratings and invalid context values', () => {
    expect(() => trainingContextFilter({ challenge: '2' })).toThrow()
    expect(() => trainingContextFilter({ contest: 'OMM', stage: 'nacional', challenge: '7' })).toThrow()
    expect(() => trainingContextFilter({ contest: 'unknown' })).toThrow()
  })
  it('allows one canonical problem to hold different contextual ratings', () => {
    const problem = new Problem({ codigo: 'TEST', enunciado: 'Original', año: '2026', tema: 'Álgebra', tipo: 'TeacherPeri', dificultad: 'Media', trainingContexts: [
      { contest: 'OMM', stage: 'estatal', schoolStage: 'secundaria', challenge: 6, rationale: 'Example only' },
      { contest: 'OMM', stage: 'nacional', schoolStage: 'secundaria', challenge: 2, rationale: 'Example only' },
    ] })
    expect(problem.validateSync()).toBeUndefined()
    problem.trainingContexts[0].challenge = 2.5
    expect(problem.validateSync()).toBeDefined()
  })
  it('keeps editorial engagement independent and bounded', () => {
    const theory = new Theory({ title: 'Example', summary: 'Example', content: 'Example', level: 'basico', engagement: 10 })
    expect(theory.validateSync()).toBeUndefined()
    theory.engagement = 11
    expect(theory.validateSync()).toBeDefined()
  })
})
