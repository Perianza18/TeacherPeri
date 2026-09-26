import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ChildPathCard, PathSectionHeading } from '../../../src/pages/PathPage.jsx'

describe('Path planned-preview UI', () => {
  it('renders a coming-soon card without a link or navigation treatment', () => {
    const html = renderToStaticMarkup(React.createElement(ChildPathCard, {
      child: { order: 28, title: 'Eje Radical', available: false, plannedPreview: true },
      slugs: ['preparacion-para-la-omm'],
    }))

    expect(html).toContain('Eje Radical')
    expect(html).toContain('Próximamente')
    expect(html).toContain('aria-disabled="true"')
    expect(html).not.toMatch(/<a(?:\s|>)/)
    expect(html).not.toContain('href=')
    expect(html).not.toContain('hover:')
  })

  it('renders generic under-construction section copy from API state', () => {
    const html = renderToStaticMarkup(React.createElement(PathSectionHeading, {
      section: { _id: 'future', title: 'Ciclo futuro', state: 'under-construction' },
      index: 0,
    }))

    expect(html).toContain('En construcción')
    expect(html).toContain('Estamos preparando y organizando el contenido de este ciclo.')
  })
})
