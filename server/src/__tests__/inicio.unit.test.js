import { describe, expect, it } from 'vitest'
import { DEFAULT_CICLOS, cicloNames, daysSinceEpoch, pickProblemOfTheDay, problemSourceLabel, stripDayPrefix } from '../../../src/lib/inicio.js'

const day = (year, month, date) => Date.UTC(year, month - 1, date) / 86_400_000

describe('Inicio: Problema del día', () => {
  it('counts days on the Mexico City calendar, not UTC', () => {
    // 23:30 on Nov 14 in Mexico City (UTC-6) is already Nov 15 in UTC.
    expect(daysSinceEpoch(new Date('2026-11-15T05:30:00Z'))).toBe(day(2026, 11, 14))
    expect(daysSinceEpoch(new Date('2026-11-15T06:30:00Z'))).toBe(day(2026, 11, 15))
  })

  it('picks the same problem for any input order and a new one the next day', () => {
    const problems = ['c3', 'a1', 'b2'].map((_id) => ({ _id }))
    const today = new Date('2026-11-14T18:00:00Z')
    const tomorrow = new Date('2026-11-15T18:00:00Z')
    const expected = ['a1', 'b2', 'c3'][day(2026, 11, 14) % 3]

    expect(pickProblemOfTheDay(problems, today)._id).toBe(expected)
    expect(pickProblemOfTheDay([...problems].reverse(), today)._id).toBe(expected)
    expect(pickProblemOfTheDay(problems, tomorrow)._id).not.toBe(expected)
  })

  it('returns nothing for an empty or missing bank', () => {
    expect(pickProblemOfTheDay([])).toBeNull()
    expect(pickProblemOfTheDay(undefined)).toBeNull()
  })

  it('strips only a leading «(Día n)» prefix', () => {
    expect(stripDayPrefix('(Día 1) Sea $G$ un grupo.')).toBe('Sea $G$ un grupo.')
    expect(stripDayPrefix('  (Dia 2)Considera la sucesión.')).toBe('Considera la sucesión.')
    expect(stripDayPrefix('Encuentra el valor de la integral (Día 1):')).toBe('Encuentra el valor de la integral (Día 1):')
  })

  it('builds the source label from data and never shows the title', () => {
    const ommu = { tipo: 'OMMU Nacional', año: '2024', codigo: 'OMMU-NAC-2024-1', titulo: 'Un título' }
    expect(problemSourceLabel(ommu)).toBe('OMMU Nacional 2024 · Problema 1')
    expect(problemSourceLabel({ competition: 'TeacherPeri', tipo: 'TeacherPeri', año: '2026', codigo: 'TP-G01', titulo: 'El ángulo exterior' })).toBe('TeacherPeri 2026')
    expect(problemSourceLabel({ competition: 'Putnam', año: '2023', problemNumber: 3 })).toBe('Putnam 2023 · Problema 3')
    expect(problemSourceLabel({ competition: 'OMM Regional', round: 'Sureste', año: '2024', problemNumber: 3 })).toBe('OMM Regional Sureste 2024 · Problema 3')
    expect(problemSourceLabel(ommu)).not.toContain('título')
  })
})

describe('Inicio: Ruta destacada', () => {
  it('reads ciclo names from the Ruta section headings', () => {
    const path = { presentation: [
      { type: 'child', child: { title: 'Fundamentos' } },
      { type: 'section', section: { title: 'Ciclo 1 — Primeros Pasos' } },
      { type: 'section', section: { title: 'Ciclo 2 — Herramientas Fundamentales' } },
    ] }
    expect(cicloNames(path)).toEqual(['Primeros Pasos', 'Herramientas Fundamentales'])
  })

  it('falls back to the guide names without data', () => {
    expect(cicloNames(null)).toEqual(DEFAULT_CICLOS)
    expect(cicloNames({ presentation: [] })).toEqual(DEFAULT_CICLOS)
  })
})
