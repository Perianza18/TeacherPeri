import { describe, expect, it } from 'vitest'
import { examBrowseTree } from '../../../src/lib/examBrowse.js'

describe('exam browsing folders', () => {
  it('shows only competitions with exams and preserves the folder path', () => {
    const categories = [
      { _id: 'root', name: 'Exámenes', kind: 'exam' },
      { _id: 'omm', name: 'OMM', parent: 'root', kind: 'exam' },
      { _id: 'omm-year', name: '2024', parent: 'omm', kind: 'exam' },
      { _id: 'omm-eb', name: 'OMMEB', parent: 'root', kind: 'exam' },
      { _id: 'eb-year', name: '2025', parent: 'omm-eb', kind: 'exam' },
      { _id: 'empty', name: 'IMO', parent: 'root', kind: 'exam' },
      { _id: 'general', name: 'Entrenamiento mixto', kind: 'general' },
    ]
    const originals = { _id: 'a', competition: 'TeacherPeri', year: '2026', categories: [{ _id: 'general' }] }
    const omm = { _id: 'b', categories: [{ _id: 'omm-year' }] }
    const eb = { _id: 'c', categories: [{ _id: 'eb-year' }] }
    const tree = examBrowseTree([originals, omm, eb], categories)
    expect(tree.children.map((c) => c.name)).toEqual(['TeacherPeri Originals', 'OMMEB', 'OMM'])
    expect(tree.children[0].children[0]).toMatchObject({ name: '2026', exams: [originals] })
    expect(tree.children[1].children[0]).toMatchObject({ name: '2025', exams: [eb] })
    expect(tree.children[2].children[0]).toMatchObject({ name: '2024', exams: [omm] })
  })
})
