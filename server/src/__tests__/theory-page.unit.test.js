import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import TheoryView from '../../../src/components/theory/TheoryView.jsx'
import ArticleText from '../../../src/components/training/ArticleText.jsx'
import PracticeBox from '../../../src/components/content/PracticeBox.jsx'
import { AuthContext } from '../../../src/context/useAuth.js'
import { buildRutaContext, cicloShortName } from '../../../src/lib/rutaContext.js'
import { parseInline } from '../../../src/lib/inlineMarkup.js'
import { figureUrl, isHeadingLine, levelLabel, parseArticle, readingMinutes, sentenceCase } from '../../../src/lib/theoryArticle.js'

// Placeholder text in the older stored lesson format (not real lesson content).
const OLD_CONTENT = `Introducción de la lección.

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

// Placeholder text in the new markup, with every block type.
const NEW_CONTENT = String.raw`Intro con **negritas**.

## Enunciados

:::definition Término
Cuerpo de la definición.
:::

:::theorem Nombre
Enunciado:
$$a^2+b^2=c^2$$
:::

:::lemma
Primer lema.

Idea: una nota.
:::

:::lemma Con nombre
Segundo lema.
:::

:::corollary
Un corolario.
:::

:::proposition
Una proposición.
:::

:::proof
Pasos.
:::

## Ejemplos

:::example Título
Enunciado visible.

Solución oculta.

:::reveal Detalle
Texto anidado.
:::
:::

### Ejemplo viejo
Visible.

:::try ¿Pregunta?
Respuesta.
:::

:::tip
Consejo.
:::

:::mistake
Error.
:::

:::reveal Desplegable
Oculto.
:::

## Material

Antes de la lista:
- uno
- dos

| A | B | C |
| --- | :---: | ---: |
| $a|b$ | 2 | 3 |

![Una figura](figuras/una.svg "Pie **uno**")

![Dos](figuras/dos.svg "Pie dos") ![Tres](figuras/tres.svg)

[[collection:tema:ejercicios]]

[[collection:tema:practice]]

[[collection:tema:challenge]]

## En resumen

Cierre.

## Agregados culturales

- Dato uno.
- Dato dos.

[[source:https://example.com/fuente]]`

describe('Lesson parser: older format', () => {
  it('splits the stored text into lead, numbered sections and blocks', () => {
    const { blocks, sections, summaryIndex } = parseArticle(OLD_CONTENT)
    expect(blocks[0]).toMatchObject({ type: 'paragraph', lead: true, text: 'Introducción de la lección.' })
    expect(sections.map((section) => `${section.number}. ${section.title}`))
      .toEqual(['1. Ideas clave', '2. Ejemplo trabajado', '3. Errores frecuentes', '4. Práctica', '5. En resumen'])
    expect(blocks.find((block) => block.type === 'heading' && block.level === 3).title).toBe('Primera idea')
    const examples = blocks.filter((block) => block.type === 'example')
    expect(examples.map((example) => [example.number, example.title, example.statement, example.hidden.length])).toEqual([[1, 'Una prueba corta', null, 0], [2, 'Otra prueba', null, 0]])
    expect(blocks.find((block) => block.type === 'box')).toMatchObject({ kind: 'mistake', children: [{ type: 'paragraph', text: 'Un error común.' }] })
    expect(blocks.find((block) => block.type === 'list')).toEqual({ type: 'list', ordered: true, start: 1, items: ['Primer ejercicio.', 'Segundo ejercicio.'] })
    expect(blocks.find((block) => block.type === 'answers').text).toBe('1. uno; 2. dos.')
    expect(blocks[summaryIndex].title).toBe('En resumen')
  })

  it('wraps a worked-example section without sub-headings into one example', () => {
    const { blocks } = parseArticle('Intro.\n\nEJEMPLO TRABAJADO\nTexto del ejemplo.')
    expect(blocks[2]).toMatchObject({ type: 'example', number: 1, shown: [{ type: 'paragraph', text: 'Texto del ejemplo.' }] })
  })

  it('shows caps headings in sentence case and keeps names and math', () => {
    expect(sentenceCase('TEOREMA DE TALES: UNA PARALELA CREA SEMEJANZA')).toBe('Teorema de Tales: una paralela crea semejanza')
    expect(sentenceCase('MCD, MCM Y COPRIMALIDAD')).toBe('MCD, MCM y coprimalidad')
    expect(sentenceCase('POR QUÉ SE DIVIDE POR $k!$')).toBe('Por qué se divide por $k!$')
    expect(isHeadingLine('$360=2^3\\cdot3^2\\cdot5$.')).toBe(false)
    expect(isHeadingLine('POR QUÉ SE DIVIDE POR $k!$')).toBe(true)
  })

  it('estimates reading time at 200 words a minute and labels levels', () => {
    expect(readingMinutes('palabra '.repeat(600))).toBe(3)
    expect(readingMinutes(':::theorem X\n:::\n[[practice]]')).toBe(1)
    expect(levelLabel('basico')).toBe('Nivel básico')
    expect(levelLabel(undefined)).toBe('')
  })
})

describe('Lesson parser: new markup', () => {
  const { blocks, sections, hasPracticeMarker, summaryIndex } = parseArticle(NEW_CONTENT)
  const all = (list) => list.flatMap((block) => [block, ...all(block.children || []), ...all([block.statement, ...(block.hidden || []), ...(block.shown || [])].filter(Boolean))])
  const flat = all(blocks)

  it('reads every block type, numbering lemmas per type and examples together', () => {
    expect(flat.filter((block) => block.type === 'box').map((block) => [block.kind, block.title, block.number])).toEqual([
      ['definition', 'Término', undefined], ['theorem', 'Nombre', undefined], ['lemma', '', 1], ['lemma', 'Con nombre', 2],
      ['corollary', '', 1], ['proposition', '', 1], ['proof', '', undefined], ['reveal', 'Detalle', undefined],
      ['try', '¿Pregunta?', undefined], ['tip', '', undefined], ['mistake', '', undefined], ['reveal', 'Desplegable', undefined],
    ])
    const [example, oldExample] = blocks.filter((block) => block.type === 'example')
    expect(example).toMatchObject({ number: 1, title: 'Título', statement: { type: 'paragraph', text: 'Enunciado visible.' } })
    expect(example.hidden.map((block) => block.type)).toEqual(['paragraph', 'box'])
    expect(oldExample).toMatchObject({ number: 2, title: 'Viejo', statement: null, shown: [{ type: 'paragraph', text: 'Visible.' }] })
  })

  it('reads lists, tables, figures, collections, culture cards and the source', () => {
    expect(blocks.find((block) => block.type === 'list')).toMatchObject({ ordered: false, items: ['uno', 'dos'] })
    expect(blocks.find((block) => block.type === 'table')).toEqual({ type: 'table', header: ['A', 'B', 'C'], align: [null, 'center', 'right'], rows: [['$a|b$', '2', '3']] })
    expect(blocks.filter((block) => block.type === 'figures').map((block) => block.images.length)).toEqual([1, 2])
    expect(blocks.find((block) => block.type === 'figures').images[0]).toEqual({ alt: 'Una figura', src: 'figuras/una.svg', title: 'Pie **uno**' })
    expect(blocks.filter((block) => block.type === 'collection').map((block) => block.kind)).toEqual(['ejercicios', 'practice', 'dificiles'])
    expect(blocks.find((block) => block.type === 'cultural').items).toEqual(['Dato uno.', 'Dato dos.'])
    expect(blocks.at(-1)).toEqual({ type: 'source', url: 'https://example.com/fuente' })
    expect(hasPracticeMarker).toBe(true)
    expect(sections.map((section) => section.title)).toEqual(['Enunciados', 'Ejemplos', 'Material', 'En resumen', 'Agregados culturales'])
    expect(blocks[summaryIndex].title).toBe('En resumen')
  })

  it('only loads figures from public/figuras', () => {
    expect(figureUrl('figuras/a-b.svg')).toBe('/figuras/a-b.svg')
    expect(figureUrl('https://example.com/a.svg')).toBeNull()
    expect(figureUrl('figuras/../secreto.svg')).toBeNull()
  })
})

describe('Inline markup', () => {
  it('reads bold, italic and math, and keeps * inside formulas', () => {
    expect(parseInline('**a $x*y$** y *b*')).toEqual([
      { type: 'strong', children: [{ type: 'text', text: 'a ' }, { type: 'math', tex: 'x*y' }] },
      { type: 'text', text: ' y ' },
      { type: 'em', children: [{ type: 'text', text: 'b' }] },
    ])
    expect(parseInline('Antes $$x^2$$ después')[1]).toEqual({ type: 'display', tex: 'x^2' })
    expect(parseInline(String.raw`5 \* 3`)).toEqual([{ type: 'text', text: '5 * 3' }])
  })
})

const wrap = (element) => renderToStaticMarkup(React.createElement(MemoryRouter, null, element))
const PROBLEM = (id, extra = {}) => ({ _id: id, titulo: `TÍTULO ${id}`, enunciado: `Enunciado ${id}.`, hint: `Pista ${id}.`, difficulty: 'basico', ...extra })

describe('ArticleText rendering', () => {
  const html = wrap(React.createElement(ArticleText, {
    text: NEW_CONTENT,
    renderCollection: (slug, kind) => React.createElement(PracticeBox, { kind, problems: [PROBLEM(`${kind}-1`)] }),
  }))

  it('shows every block with its Spanish label', () => {
    for (const label of ['Definición · Término', 'Teorema · Nombre', 'Lema 1', 'Lema · Con nombre', 'Corolario 1', 'Proposición 1', 'Demostración', 'Fin de la demostración', 'Ver solución', 'Inténtalo: ', 'Consejo de olimpiada', 'Error común', 'Desplegable']) {
      expect(html).toContain(label)
    }
    expect(html).toMatch(/Ejemplo (<!-- -->)?1/)
    expect(html).toMatch(/Ejemplo (<!-- -->)?2/)
    expect(html).toContain('<details open=""')
    expect(html).toContain('text-[17px] text-tp-ink-soft')
  })

  it('draws tables, figures, culture cards and the three problem boxes', () => {
    expect(html).toContain('<th scope="col"')
    expect(html).toContain('text-center')
    expect(html.match(/<figure/g)).toHaveLength(3)
    expect(html).toContain('src="/figuras/una.svg"')
    expect(html).toContain('<figcaption')
    expect(html).toContain('Dato dos.')
    expect(html).toContain('>Ejercicios<')
    expect(html).toContain('Ver pista')
    expect(html).toContain('>Practica<')
    expect(html).toContain('>Reto<')
    expect(html).not.toContain('TÍTULO')
  })

  it('never runs raw HTML from lesson text', () => {
    const markup = wrap(React.createElement(ArticleText, { text: 'Hola <script>alert(1)</script> y <b>no</b>.' }))
    expect(markup).toContain('&lt;script&gt;')
    expect(markup).not.toContain('<script>')
    expect(markup).not.toContain('<b>')
  })

  it('shows the alt text instead of loading a figure from outside public/figuras', () => {
    const markup = wrap(React.createElement(ArticleText, { text: '![Texto alternativo](https://example.com/x.svg)' }))
    expect(markup).not.toContain('<img')
    expect(markup).toContain('Texto alternativo')
  })

  it('keeps older lessons: visible examples, no hidden solution', () => {
    const markup = wrap(React.createElement(ArticleText, { text: OLD_CONTENT }))
    expect(markup).toMatch(/Ejemplo (<!-- -->)?2/)
    expect(markup).not.toContain('Ver solución')
    expect(markup).toContain('Respuestas de control')
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

const ITEM = { _id: 't1', title: 'Lección de prueba', summary: 'Resumen breve.', level: 'basico', topics: [{ name: 'Teoría de Números' }], content: OLD_CONTENT }
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
    expect(render({ item: ITEM, route: null, problems: [] })).not.toContain('>Practica<')
  })
})
