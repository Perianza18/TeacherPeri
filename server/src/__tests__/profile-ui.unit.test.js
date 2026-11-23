import { describe, it, expect } from 'vitest'
import { nextTabIndex, plural, profilePath, relativeTime, tabsFor, userListPath, userQuery } from '../../../src/lib/profile.js'
import { AVATARS, AVATAR_COLORS, DRAWING_AVATARS, avatarById, avatarFill } from '../../../src/lib/avatars.js'
import { AVATAR_COLORS as COLOR_IDS, AVATAR_IDS } from '../lib/profile.js'

describe('Mi Espacio en el sitio', () => {
  it('visitantes ven Comentarios, Guardados e Insignias; el dueño ve las cinco pestañas', () => {
    expect(tabsFor(false).map((t) => t.label)).toEqual(['Comentarios', 'Guardados', 'Insignias'])
    expect(tabsFor(true).map((t) => t.label)).toEqual(['Actividad', 'Comentarios', 'Guardados', 'Mis envíos', 'Insignias'])
    expect(tabsFor(true).find((t) => t.id === 'guardados').color).toBe('bg-tp-coral')
    expect(tabsFor(true).every((t) => !/text-white/.test(t.color))).toBe(true)
  })

  it('flechas, Inicio y Fin recorren las pestañas en círculo', () => {
    expect(nextTabIndex('ArrowRight', 4, 5)).toBe(0)
    expect(nextTabIndex('ArrowLeft', 0, 5)).toBe(4)
    expect(nextTabIndex('Home', 3, 5)).toBe(0)
    expect(nextTabIndex('End', 1, 5)).toBe(4)
    expect(nextTabIndex('Enter', 1, 5)).toBeNull()
  })

  it('tiempo relativo en español', () => {
    const now = Date.UTC(2026, 10, 22, 12)
    const ago = (ms) => new Date(now - ms)
    expect(relativeTime(ago(2 * 3600e3), now)).toBe('hace 2 h')
    expect(relativeTime(ago(26 * 3600e3), now)).toBe('ayer')
    expect(relativeTime(ago(3 * 86400e3), now)).toBe('hace 3 días')
    expect(relativeTime(ago(5 * 60e3), now)).toBe('hace 5 min')
  })

  it('enlaces y plurales', () => {
    expect(profilePath('ana maría')).toBe('/perfil/ana%20mar%C3%ADa')
    expect(plural(1, 'elemento', 'elementos')).toBe('1 elemento')
    expect(plural(3, 'elemento', 'elementos')).toBe('3 elementos')
  })

  it('el sitio dibuja exactamente los avatares que el servidor acepta', () => {
    expect(AVATARS.map((a) => a.id)).toEqual([...AVATAR_IDS])
    expect(AVATAR_COLORS.map((c) => c.id)).toEqual([...COLOR_IDS])
  })

  it('cada dibujo tiene su imagen y cada figura sus trazos', () => {
    expect(DRAWING_AVATARS).toHaveLength(12)
    for (const avatar of AVATARS) expect(avatar.src || avatar.paths?.length, avatar.id).toBeTruthy()
  })

  it('el fondo es el color elegido, o el propio del avatar', () => {
    const avatar = avatarById('de-hecho')
    expect(avatarFill(avatar, 'menta')).toBe('var(--tp-mint)')
    expect(avatarFill(avatar, null)).toBe(avatar.fill)
    expect(avatarFill(avatar, 'rojo')).toBe(avatar.fill)
  })
})

describe('«Guardados» y «Buscar usuarios» en el sitio', () => {
  it('las colecciones viven en /colecciones/', () => {
    expect(userListPath('ana', 'l1')).toBe('/perfil/ana/colecciones/l1')
  })

  it('la búsqueda pide al menos 2 caracteres e ignora la @ inicial', () => {
    expect(userQuery('')).toBe('')
    expect(userQuery(' a ')).toBe('')
    expect(userQuery('@a')).toBe('')
    expect(userQuery('@an')).toBe('an')
    expect(userQuery('  Beto ')).toBe('Beto')
  })
})
