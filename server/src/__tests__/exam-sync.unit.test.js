import { describe, it, expect } from 'vitest'
import { examFieldsFromPath, examTitle, orderExamProblems } from '../lib/examSync.js'
import { examProblemTitle, examTitle as pageTitle } from '../../../src/lib/libraryPaths.js'

describe('exam card from the folder path', () => {
  it('takes competition, year and round from the folder names', () => {
    expect(examFieldsFromPath(['OMM', '2024'])).toEqual({ competition: 'OMM', year: '2024', round: null })
    expect(examFieldsFromPath(['OMM Estatal', 'Jalisco', '2023'])).toEqual({ competition: 'OMM Estatal', year: '2023', round: 'Jalisco' })
    expect(examFieldsFromPath(['OMMEB', '2024', 'Nivel 1'])).toEqual({ competition: 'OMMEB', year: '2024', round: 'Nivel 1' })
    expect(examFieldsFromPath(['IMO'])).toEqual({ competition: 'IMO', year: null, round: null })
  })

  it('reads naturally in Spanish, the same on the server and the page', () => {
    const cases = [
      [{ competition: 'OMM', year: '2024', round: null }, 'OMM 2024'],
      [{ competition: 'OMM Estatal', year: '2023', round: 'Jalisco' }, 'OMM Estatal 2023 · Jalisco'],
      [{ competition: 'IMO', year: null, round: null }, 'IMO'],
      [{ competition: 'TeacherPeri', year: '2026', round: 'Ciclo 1 · Práctica A' }, 'TeacherPeri 2026 · Ciclo 1 · Práctica A'],
    ]
    for (const [fields, title] of cases) {
      expect(examTitle(fields)).toBe(title)
      expect(pageTitle(fields)).toBe(title)
    }
  })

  it('orders by problem number; problems without a number go last', () => {
    const list = [{ codigo: 'U-3' }, { codigo: 'U-2', problemNumber: 4 }, { codigo: 'U-1', problemNumber: 1 }, { codigo: 'U-0' }]
    expect(orderExamProblems(list).map((p) => p.codigo)).toEqual(['U-1', 'U-2', 'U-0', 'U-3'])
  })

  it('uses the original problem number on an incomplete exam', () => {
    expect(examProblemTitle({ titulo: 'OMM 2025 - Problema 5', problemNumber: 5 })).toBe('Problema 5')
    expect(examProblemTitle({ titulo: 'Práctica original', codigo: 'TP-A01' })).toBe('Práctica original')
    expect(examProblemTitle({ codigo: 'TP-A01' })).toBe('TP-A01')
  })
})
