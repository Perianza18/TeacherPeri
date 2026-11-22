import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { THEORY_COLLECTIONS, THEORY_PROBLEMS, THEORY_REWRITES } from '../data/theory/index.js'
import { MVP_LESSONS, PREVIOUS_THEORY } from '../data/mvpLessons.js'
import { MVP_PROBLEMS } from '../data/mvpProblems.js'
import { OMM_LAUNCH_CONTENT_BATCH_1 } from '../data/ommLaunchContent.js'
import { decide, heldPrevious } from '../migrations/revise-theory-lessons.js'
import { EARLIER_THEORY } from '../data/theory/earlier.js'
import { revisionTarget } from '../scripts/revise-theory-lessons.js'
import { parseArticle } from '../../../src/lib/theoryArticle.js'

const lessons = Object.values(THEORY_REWRITES)
const blocksOf = (content) => {
  const all = []
  const walk = (list) => list.forEach((block) => {
    all.push(block)
    walk([block.statement, ...(block.hidden || []), ...(block.shown || []), ...(block.children || [])].filter(Boolean))
  })
  walk(parseArticle(content).blocks)
  return all
}

describe('Rewritten theory lessons', () => {
  it.each(lessons.map((lesson) => [lesson.pathSlug, lesson]))('%s follows the lesson structure', (_slug, lesson) => {
    const headings = [...lesson.content.matchAll(/^## (.+)$/gm)].map((match) => match[1])
    expect(headings[0]).toMatch(/^Preámbulo: /)
    expect(headings.slice(-3)).toEqual(['Ejercicios', 'Problemas', 'Problemas de mayor dificultad'])
    expect(headings.slice(1).every((heading) => !heading.includes(':'))).toBe(true)
    expect(lesson.summary.split(/(?<=\.)\s/).length).toBeLessThanOrEqual(2)
    const blocks = blocksOf(lesson.content)
    const kinds = blocks.filter((block) => block.type === 'box').map((block) => block.kind)
    expect(kinds.filter((kind) => kind === 'mistake').length).toBeGreaterThanOrEqual(1)
    expect(kinds.filter((kind) => kind === 'tip').length).toBeGreaterThanOrEqual(1)
    expect(kinds.filter((kind) => kind === 'try').length).toBeGreaterThanOrEqual(1)
    expect(kinds.filter((kind) => kind === 'try').length).toBeLessThanOrEqual(2)
    // Every theorem, proposition and lemma is followed by its proof.
    const top = parseArticle(lesson.content).blocks
    top.forEach((block, index) => {
      if (block.type === 'box' && ['theorem', 'proposition', 'lemma'].includes(block.kind)) expect(top[index + 1]).toMatchObject({ type: 'box', kind: 'proof' })
    })
    expect(lesson.content.replace(/\[\[collection:[^\]]+\]\]/g, '')).not.toMatch(/\b(tú|usted|puedes|imagina|obvio|obviamente|claramente|trivialmente)\b/iu)
  })

  it('points every box to its own collections, all three kinds once', () => {
    for (const lesson of lessons) {
      const refs = [...lesson.content.matchAll(/^\[\[collection:([a-z0-9-]+):([a-z]+)\]\]$/gm)].map((match) => `${match[1]}:${match[2]}`)
      const own = Object.entries(lesson.collections).flatMap(([slug, kinds]) => Object.keys(kinds).map((kind) => `${slug}:${kind}`))
      expect(refs).toEqual(own)
      expect(refs.map((ref) => ref.split(':')[1])).toEqual(['ejercicios', 'practice', 'dificiles'])
    }
  })

  it('adds new banco problems: exercises with 1–2 hints, problems with neither hints nor solutions', () => {
    const codes = THEORY_PROBLEMS.map((problem) => problem.codigo)
    expect(new Set(codes).size).toBe(codes.length)
    expect(codes.some((code) => MVP_PROBLEMS.some((problem) => problem.codigo === code))).toBe(false)
    const known = new Set([...MVP_PROBLEMS, ...THEORY_PROBLEMS].map((problem) => problem.codigo))
    for (const { kind, problemCodes } of THEORY_COLLECTIONS) {
      expect(problemCodes.every((code) => known.has(code))).toBe(true)
      expect(problemCodes.length).toBe({ ejercicios: 4, practice: 6, dificiles: 2 }[kind])
      for (const code of problemCodes) {
        const problem = THEORY_PROBLEMS.find((entry) => entry.codigo === code)
        if (!problem) continue
        expect(problem.solution).toBeUndefined()
        if (kind === 'ejercicios') expect(problem.hint.split('\n\n').length).toBeGreaterThanOrEqual(1)
        if (kind === 'ejercicios') expect(problem.hint.split('\n\n').length).toBeLessThanOrEqual(2)
        else expect(problem.hint).toBeUndefined()
      }
    }
  })

  it('draws every figure it names, with alt text and a caption', () => {
    for (const lesson of lessons) {
      for (const [, alt, src, title] of lesson.content.matchAll(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g)) {
        expect(src).toMatch(/^figuras\/[a-z0-9-]+\.svg$/)
        expect(alt.length).toBeGreaterThan(20)
        expect(title).toBeTruthy()
        const file = new URL(`../../../public/${src}`, import.meta.url)
        expect(existsSync(file)).toBe(true)
        const svg = readFileSync(file, 'utf8')
        expect(svg).toMatch(/viewBox="0 0 300 220"/)
        const landscapeFigures = ['figuras/semejanza-y-congruencia-pantalla.svg', 'figuras/semejanza-y-congruencia-estirada.svg']
        if (landscapeFigures.includes(src)) {
          const landscape = readFileSync(new URL('../../../public/figuras/semejanza-y-congruencia-paisaje.webp', import.meta.url)).toString('base64')
          expect(svg).toContain(`data:image/webp;base64,${landscape}`)
          expect([...svg.matchAll(/<use href="#paisaje"/g)]).toHaveLength(2)
        }
        expect([...svg.matchAll(/#[0-9A-Fa-f]{6}/g)].every(([color]) => ['#111111', '#6D3EE8', '#EEE7FF'].includes(color))).toBe(true)
      }
    }
  })

  it('is the last layer: the release uses the new text and keeps the exact previous one', () => {
    for (const lesson of lessons) {
      const base = OMM_LAUNCH_CONTENT_BATCH_1.lessons.find((entry) => entry.pathSlug === lesson.pathSlug).theory
      const released = MVP_LESSONS.find((entry) => entry.pathSlug === lesson.pathSlug).theory
      expect(released).toMatchObject({ title: base.title, summary: lesson.summary, content: lesson.content })
      expect(PREVIOUS_THEORY[lesson.pathSlug]).toMatchObject({ title: base.title, summary: base.summary })
      expect(PREVIOUS_THEORY[lesson.pathSlug].content.startsWith(base.content)).toBe(true)
    }
  })
})

describe('Theory revision guard', () => {
  it('needs an explicit target and the exact database name to apply', () => {
    expect(() => revisionTarget({ MONGO_URI: 'mongodb://localhost/teacherperi' })).toThrow('MONGO_REVISION_URI')
    expect(revisionTarget({ MONGO_REVISION_URI: 'mongodb://localhost/teacherperi' }).dbName).toBe('teacherperi')
    expect(() => revisionTarget({ MONGO_REVISION_URI: 'mongodb://localhost/teacherperi' }, true)).toThrow('REVISION_DATABASE_CONFIRM')
    expect(() => revisionTarget({ MONGO_REVISION_URI: 'mongodb://localhost/teacherperi_prod', REVISION_DATABASE_CONFIRM: 'teacherperi' }, true)).toThrow('REVISION_DATABASE_CONFIRM')
    expect(revisionTarget({ MONGO_REVISION_URI: 'mongodb://localhost/teacherperi_prod', REVISION_DATABASE_CONFIRM: 'teacherperi_prod' }, true).dbName).toBe('teacherperi_prod')
    expect(() => revisionTarget({ MONGO_REVISION_URI: 'mongodb://localhost/admin' })).toThrow('non-system')
    expect(() => revisionTarget({ MONGO_REVISION_URI: 'mongodb://localhost/teacherperi?dbName=other' })).toThrow('override')
  })

  it('changes only the exact previous text', () => {
    const desired = [['content', 'nuevo']]
    const previous = [['content', 'viejo']]
    expect(decide({ content: 'nuevo' }, desired, previous)).toBe('keep')
    expect(decide({ content: 'viejo' }, desired, previous)).toBe('revise')
    expect(decide({ content: 'viejo con un cambio' }, desired, previous)).toBeNull()
  })

  it('also accepts an earlier published rewrite, and filters on the version it found', () => {
    const desired = [['content', 'nuevo']]
    const original = [['content', 'viejo']]
    const published = [['content', 'piloto']]
    expect(decide({ content: 'piloto' }, desired, original, published)).toBe('revise')
    expect(heldPrevious({ content: 'piloto' }, original, published)).toBe(published)
    expect(heldPrevious({ content: 'viejo' }, original, published)).toBe(original)
    expect(decide({ content: 'piloto con un cambio' }, desired, original, published)).toBeNull()
  })

  it('lists earlier published versions only for rewritten lessons, each different from the current text', () => {
    for (const [slug, versions] of Object.entries(EARLIER_THEORY)) {
      expect(THEORY_REWRITES[slug]).toBeDefined()
      for (const version of versions) {
        expect(version.published).toMatch(/^\d{4}-\d{2}-\d{2}$/)
        expect(typeof version.summary).toBe('string')
        expect(version.content).not.toBe(THEORY_REWRITES[slug].content)
        expect(version.content).not.toBe(PREVIOUS_THEORY[slug].content)
      }
    }
  })
})
