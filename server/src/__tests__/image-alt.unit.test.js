import { describe, it, expect } from 'vitest'
import { plainMathText } from '../../../src/lib/mathAlt.js'
import { parseImageList } from '../lib/images.js'

const id = '64b7f0c2a1b2c3d4e5f60718'

describe('image description → alt text', () => {
  it('drops the $ signs and turns common LaTeX into readable text', () => {
    expect(plainMathText('Triángulo $ABC$ con $\\angle ABC = 90^\\circ$.')).toBe('Triángulo ABC con ángulo ABC = 90°.')
    expect(plainMathText('Ángulo de $45^{\\circ}$')).toBe('Ángulo de 45°')
    expect(plainMathText('Razón $\\frac{a}{b}$ y $\\dfrac{p+1}{q}$')).toBe('Razón a/b y (p+1)/q')
    expect(plainMathText('$x^2 + y^{10} \\le \\sqrt{2}$')).toBe('x² + y^10 ≤ √2')
    expect(plainMathText('Segmento $\\overline{AB}$ y $\\triangle PQR$')).toBe('Segmento AB y triángulo PQR')
    expect(plainMathText('$$\\pi r^2$$')).toBe('π r²')
  })

  it('leaves other commands as their name and never shows a $', () => {
    expect(plainMathText('Gráfica de $\\log x$')).toBe('Gráfica de log x')
    expect(plainMathText('$\\constructor$')).toBe('constructor')
    expect(plainMathText('Precio de 5 $ suelto')).not.toContain('$')
  })

  it('existing descriptions without math stay the same', () => {
    expect(plainMathText('Triángulo ABC con la altura desde A marcada')).toBe('Triángulo ABC con la altura desde A marcada')
  })
})

describe('image description validation', () => {
  it('accepts math and rejects a lone $ with a clear message', () => {
    expect(parseImageList([{ image: id, alt: 'Ángulo $\\angle A = 30^\\circ$' }])).toEqual({ images: [{ image: id, alt: 'Ángulo $\\angle A = 30^\\circ$', placement: 'statement' }] })
    expect(parseImageList([{ image: id, alt: 'Ángulo $\\angle A = 30^\\circ' }]).error).toBe('Descripción de la imagen 1: hay un signo $ sin cerrar. Cada fórmula va entre $…$ (o $$…$$ para una fórmula aparte).')
    expect(parseImageList([{ image: id, alt: 'Fracción $\\frac{1}{2$ rota' }]).error).toMatch(/^Descripción de la imagen 1: una fórmula no se puede mostrar/)
  })
})
