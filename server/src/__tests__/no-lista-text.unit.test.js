// «Listas» is the name of the Listas page, so the profile and the save flow
// never say «lista»: they say «Guardados» and «colección». This reads the
// source of those screens and checks every string a person can see.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../../../', import.meta.url))
const FILES = [
  'src/pages/PerfilPage.jsx',
  'src/pages/UserListPage.jsx',
  'src/components/profile/ListsPanel.jsx',
  'src/components/profile/SaveToListButton.jsx',
  'src/components/profile/ProfileCard.jsx',
  'src/components/profile/ProfileTabs.jsx',
  'src/components/profile/UserSearch.jsx',
  'src/components/profile/panels.jsx',
  'src/components/profile/shared.jsx',
  'src/lib/profile.js',
  'server/src/routes/userLists.routes.js',
  'server/src/lib/profile.js',
]

// Code comments are not shown; neither is the old `?tab=listas` alias.
const stripComments = (code) => code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/\{\s*listas: 'guardados'\s*\}/g, '')

describe('ningún texto visible dice «lista» en el perfil ni al guardar', () => {
  for (const file of FILES) {
    it(file, () => {
      const code = stripComments(readFileSync(root + file, 'utf8'))
      expect(code.match(/\blistas?\b/gi) ?? []).toEqual([])
    })
  }

  it('el botón dice «Guardar» y abre «Guardar en una colección»', () => {
    const code = readFileSync(root + 'src/components/profile/SaveToListButton.jsx', 'utf8')
    expect(code).toContain('>Guardar</button>')
    expect(code).toContain('Guardar en una colección')
    expect(code).toContain('Nueva colección')
  })
})
