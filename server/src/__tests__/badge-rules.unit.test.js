import { describe, it, expect } from 'vitest'
import { BADGE_IDS, badgeView, dueBadges } from '../lib/badgeRules.js'
import { AVATAR_IDS, avatarColorOf, avatarOf, parseBio, parseListName, pointBalance } from '../lib/profile.js'

describe('reglas de insignias', () => {
  it('cada nivel usa la fecha de su elemento N; el rol usa ahora', () => {
    const d = (n) => new Date(Date.UTC(2026, 0, n))
    const now = d(30)
    const due = dueBadges({ solved: Array.from({ length: 10 }, (_, i) => d(i + 1)), comments: [d(5)] }, 'admin', now)
    expect(due).toEqual([
      { badge: 'solved-1', earnedAt: d(1) }, { badge: 'solved-10', earnedAt: d(10) },
      { badge: 'comments-1', earnedAt: d(5) },
      { badge: 'role-editor', earnedAt: now }, { badge: 'role-admin', earnedAt: now },
    ])
    expect(dueBadges({}, 'user')).toEqual([])
  })

  it('la vista muestra lo ganado en orden y el siguiente nivel bloqueado con lo que falta', () => {
    const view = badgeView([{ badge: 'comments-1', earnedAt: 'x' }, { badge: 'solved-1', earnedAt: 'y' }], { solved: 3, comments: 1 })
    expect(view.earned.map((b) => b.id)).toEqual(['solved-1', 'comments-1'])
    expect(view.earned[0]).toMatchObject({ name: 'Primer problema', description: '1 problema resuelto' })
    expect(view.locked.map((b) => [b.id, b.remaining])).toEqual([['solved-10', 7], ['comments-10', 9], ['contributions-1', 1], ['solutions-1', 1], ['suggestions-1', 1]])
    expect(new Set(BADGE_IDS).size).toBe(BADGE_IDS.length)
  })
})

describe('perfil', () => {
  it('avatar: el guardado si se sigue ofreciendo; si no, «π»', () => {
    expect(avatarOf({ avatar: 'gato-dormido', unlockedAvatars: ['gato-dormido'] })).toBe('gato-dormido')
    expect(avatarOf({ avatar: 'gato-dormido' })).toBe('gato-dormido')
    expect(avatarOf({ avatar: 'gato-gamer' })).toBe('a04')
    expect(avatarOf({ avatar: 'gato-dormido', role: 'admin' })).toBe('gato-dormido')
    expect(avatarOf({ avatar: 'a04' })).toBe('a04')
    expect(avatarOf({ _id: '65f0c0ffee00000000000abc' })).toBe('a04')
    expect(avatarOf({ avatar: 'a03' })).toBe('a04')
    expect(avatarOf({ avatar: 'nope' })).toBe('a04')
    expect(AVATAR_IDS).toContain('a03')
  })

  it('un avatar de puntos solo se muestra si se compró', () => {
    expect(avatarOf({ avatar: 'gato-gamer', unlockedAvatars: [] })).toBe('a04')
    expect(avatarOf({ avatar: 'gato-gamer', unlockedAvatars: ['gato-gamer'] })).toBe('gato-gamer')
    expect(pointBalance(100, ['gato-de-traje', 'gato-pensando'])).toBe(30)
    expect(pointBalance(20, ['gato-gamer'])).toBe(0)
  })

  it('color de fondo: el guardado si existe, o null', () => {
    expect(avatarColorOf({ avatarColor: 'menta' })).toBe('menta')
    expect(avatarColorOf({ avatarColor: 'rojo' })).toBeNull()
    expect(avatarColorOf({})).toBeNull()
  })

  it('descripción y nombre de lista: una línea, con límite', () => {
    expect(parseBio('  hola\n  mundo ')).toEqual({ value: 'hola mundo' })
    expect(parseBio('x'.repeat(161)).error).toBeTruthy()
    expect(parseBio(5).error).toBeTruthy()
    expect(parseListName('   ').error).toBeTruthy()
    expect(parseListName(' Álgebra  ').value).toBe('Álgebra')
  })
})
