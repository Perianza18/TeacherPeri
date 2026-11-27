// Avatar frames («marcos») that go up with points. Same ids and thresholds as
// server/src/lib/levels.js, which decides who has which (a unit test checks
// they match). Only what the team accepted earns points.

export const POINTS = Object.freeze({ contributions: 30, solutions: 25, suggestions: 10 })

export const POINT_RULES = Object.freeze([
  { key: 'contributions', label: 'Problema propuesto y aceptado' },
  { key: 'solutions', label: 'Solución aceptada' },
  { key: 'suggestions', label: 'Corrección aplicada' },
])

export const FRAMES = Object.freeze([
  { id: 'lapiz', name: 'Lápiz', min: 0 },
  { id: 'bronce', name: 'Bronce', min: 30 },
  { id: 'plata', name: 'Plata', min: 100 },
  { id: 'oro', name: 'Oro', min: 250 },
  { id: 'olimpico', name: 'Olímpico', min: 500 },
])

export const frameById = (id) => FRAMES.find((frame) => frame.id === id) ?? FRAMES[0]
