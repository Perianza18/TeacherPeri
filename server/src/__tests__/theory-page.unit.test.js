import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import TheoryView from '../../../src/components/theory/TheoryView.jsx'
import { AuthContext } from '../../../src/context/useAuth.js'
import { buildRutaContext, cicloShortName } from '../../../src/lib/rutaContext.js'
import { isHeadingLine, levelLabel, parseTheoryContent, readingMinutes, sentenceCase } from '../../../src/lib/theoryArticle.js'

// Placeholder text in the stored lesson format (not real lesson content).
const CONTENT = `Introducción de la lección.

IDEAS CLAVE
PRIMERA IDEA
Texto con $x^2$.

EJEMPLO TRABAJADO
EJEMPLO 1: UNA PRUEBA CORTA
Paso del ejemplo.

EJEMPLO 2: OTRA PRUEBA
Otro paso.

ERRORES FRECUENTES
Un error común.

PRACTICA
1. Primer ejercicio.
2. Segundo ejercicio.

Respuestas de control: 1. uno; 2. dos.

EN RESUMEN
Cierre.`

describe('Theory article parser', () => {
  it('splits the stored text into lead, numbered sections and blocks', () => {
    const { lead, items } = parseTheoryContent(CONTENT)
    expect(lead).toBe('Introducción de la lección.')
    expect(items.filter((item) => item.type === 'h2').map((item) => `${item.number}. ${item.title}`))
      .toEqual(['1. Ideas clave', '2. Ejemplo trabajado', '3. Errores frecuentes', '4. Práctica', '5. En resumen'])
    expect(items.find((item) => item.type === 'h3').title).toBe('Primera idea')
    expect(items.filter((item) => item.type === 'example').map((item) => [item.number, item.title])).toEqual([[1, 'Una prueba corta'], [2, 'Otra prueba']])
    expect(items.find((item) => item.type === 'mistakes').children).toEqual([{ type: 'paragraph', text: 'Un error común.' }])
    expect(items.find((item) => item.type === 'list')).toEqual({ type: 'list', start: 1, items: ['Primer ejercicio.', 'Segundo ejercicio.'] })
    expect(items.find((item) => item.type === 'answers').text).toBe('1. uno; 2. dos.')
  })

  it('wraps a worked-example section without sub-headings into one example', () => {
    const { items } = parseTheoryContent('Intro.\n\nEJEMPLO TRABAJADO\nTexto del ejemplo.')
    expect(items[1]).toMatchObject({ type: 'example', number: 1, title: '', children: [{ type: 'paragraph', text: 'Texto del ejemplo.' }] })
  })

  it('shows headings in sentence case and keeps names and math', () => {
    expect(sentenceCase('TEOREMA DE TALES: UNA PARALELA CREA SEMEJANZA')).toBe('Teorema de Tales: una paralela crea semejanza')
    expect(sentenceCase('MCD, MCM Y COPRIMALIDAD')).toBe('MCD, MCM y coprimalidad')
    expect(sentenceCase('POR QUÉ SE DIVIDE POR $k!$')).toBe('Por qué se divide por $k!$')
  })

  it('does not take a formula line for a heading', () => {
    expect(isHeadingLine('$360=2^3\\cdot3^2\\cdot5$.')).toBe(false)
    expect(isHeadingLine('POR QUÉ SE DIVIDE POR $k!$')).toBe(true)
  })

  it('estimates reading time and labels levels', () => {
    expect(readingMinutes('palabra '.repeat(540))).toBe(3)
    expect(readingMinutes('')).toBe(1)
    expect(levelLabel('basico')).toBe('Nivel básico')
    expect(levelLabel(undefined)).toBe('')
  })
})

const ROOT = { slug: 'raiz', title: 'Ruta raíz', presentation: [
  { type: 'section', section: { _id: 's1', title: 'Ciclo 1 — Primeros Pasos' } },
  { type: 'child', child: { slug: 'tema', title: 'Tema', section: 's1', available: true } },
] }
const PARENT = { slug: 'tema', title: 'Tema', presentation: [
  { type: 'child', child: { slug: 'a', title: 'Lección A', section: null, available: true } },
  { type: 'child', child: { slug: 'b', title: 'Lección B', section: null, available: true } },
  { type: 'child', child: { slug: 'c', title: 'Lección C', section: null, available: true } },
] }
const ROUTE = { breadcrumbs: [{ slug: 'raiz', title: 'Ruta raíz' }, { slug: 'tema', title: 'Tema' }, { slug: 'b', title: 'Lección B' }], path: { slug: 'b', kind: 'leaf', steps: [] } }

describe('Ruta context', () => {
  it('builds breadcrumbs with the ciclo and the step position', () => {
    const { crumbs, strip } = buildRutaContext(ROUTE, [ROOT, PARENT])
    expect(crumbs.map((crumb) => crumb.label)).toEqual(['Rutas', 'Ruta raíz', 'Ciclo 1', 'Tema', 'Lección B'])
    expect(crumbs.at(-1).current).toBe(true)
    expect(crumbs[3].href).toBe('/rutas/raiz/tema')
    expect(strip).toMatchObject({ label: 'Tema', href: '/rutas/raiz/tema', position: 2, total: 3, leafSlug: 'b', parentSlug: 'tema' })
    expect(strip.prev).toEqual({ title: 'Lección A', href: '/rutas/raiz/tema/a' })
    expect(strip.next).toEqual({ title: 'Lección C', href: '/rutas/raiz/tema/c' })
  })

  it('names the ciclo when the parent is the root', () => {
    const route = { breadcrumbs: [{ slug: 'raiz', title: 'Ruta raíz' }, { slug: 'tema', title: 'Tema' }], path: { slug: 'tema' } }
    expect(buildRutaContext(route, [ROOT]).strip).toMatchObject({ label: 'Ruta raíz · Ciclo 1', position: 1, total: 1, prev: null, next: null })
    expect(cicloShortName('Ciclo 12 — Final')).toBe('Ciclo 12')
  })
})

const ITEM = { _id: 't1', title: 'Lección de prueba', summary: 'Resumen breve.', level: 'basico', topics: [{ name: 'Teoría de Números' }], content: CONTENT }
const PROBLEMS = [{ _id: 'p1', titulo: 'TÍTULO OCULTO', enunciado: 'Enunciado con $y$.', difficulty: 'basico', commentCount: 0 }]
const auth = { auth: null, logout: () => {}, abrirModal: () => {} }

function render(props) {
  return renderToStaticMarkup(React.createElement(MemoryRouter, null,
    React.createElement(AuthContext.Provider, { value: auth }, React.createElement(TheoryView, props))))
}

describe('Theory page', () => {
  it('opened from a Ruta: Ruta breadcrumbs, strip, completion and step cards', () => {
    const html = render({ item: ITEM, route: ROUTE, ancestors: [ROOT, PARENT], problems: PROBLEMS, context: '?ruta=raiz%2Ftema%2Fb' })
    expect(html.match(/<h1/g)).toHaveLength(1)
    expect(html).toContain('aria-label="Migas"')
    expect(html).toContain('Ciclo 1')
    expect(html).toContain('En la Ruta')
    expect(html).toContain('Paso 2 de 3')
    expect(html).toContain('Marcar paso como completado')
    expect(html).toContain('Paso anterior')
    expect(html).toContain('href="/entrenamiento/problemas/p1?ruta=raiz%2Ftema%2Fb"')
    expect(html).toContain('Nivel básico · Sin comentarios')
    expect(html).not.toContain('TÍTULO OCULTO')
  })

  it('opened from the library: Entrenamiento breadcrumbs and none of the Ruta parts', () => {
    const html = render({ item: ITEM, route: null, problems: PROBLEMS, relatedRoutes: [{ _id: 'r1', slug: 'ruta-x', title: 'Ruta X' }] })
    expect(html).toContain('>Entrenamiento</a>')
    expect(html).toContain('aria-current="page">Lección de prueba')
    expect(html).not.toContain('En la Ruta')
    expect(html).not.toContain('Marcar paso como completado')
    expect(html).not.toContain('Paso anterior')
    expect(html).toContain('Guardar en lista')
    expect(html).toContain('Continúa en una Ruta')
    expect(html).toContain('href="/entrenamiento/problemas/p1"')
  })

  it('hides the practice box when the lesson has no problems', () => {
    expect(render({ item: ITEM, route: null, problems: [] })).not.toContain('Practica')
  })
})
