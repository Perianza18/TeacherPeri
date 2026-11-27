// Points and avatar frames («marcos»). Only what the team reviews and accepts
// earns points, so nobody climbs by pressing «Resuelto» or posting comments:
// an accepted problem, an accepted solution, an applied suggestion.
// lib/badges.js counts them and stores the total on the User (`points`); the
// site draws the frames (src/lib/frames.js keeps the same ids and thresholds).

export const POINTS = Object.freeze({ contributions: 30, solutions: 25, suggestions: 10 })

// From the plain ink ring to the olympic one. `min` is the points needed.
export const FRAMES = Object.freeze([
  { id: 'lapiz', name: 'Lápiz', min: 0 },
  { id: 'bronce', name: 'Bronce', min: 30 },
  { id: 'plata', name: 'Plata', min: 100 },
  { id: 'oro', name: 'Oro', min: 250 },
  { id: 'olimpico', name: 'Olímpico', min: 500 },
])
export const FRAME_IDS = Object.freeze(FRAMES.map((frame) => frame.id))

// counts: { contributions, solutions, suggestions, … } → total points.
export const pointsFrom = (counts = {}) => Object.entries(POINTS).reduce((sum, [key, value]) => sum + value * (counts[key] ?? 0), 0)

const safePoints = (points) => (Number.isFinite(points) && points > 0 ? points : 0)

// The best frame those points reach.
export function topFrame(points) {
  const p = safePoints(points)
  return [...FRAMES].reverse().find((frame) => p >= frame.min)
}

export const isUnlocked = (frameId, points) => {
  const frame = FRAMES.find((f) => f.id === frameId)
  return Boolean(frame) && safePoints(points) >= frame.min
}

// The frame a person shows: the one they chose in «Editar perfil» if they
// still reach it, otherwise their best one.
export function frameOf(user) {
  return isUnlocked(user?.frame, user?.points) ? user.frame : topFrame(user?.points).id
}

// For Mi Espacio: points, current best frame and how far the next one is.
export function levelView(points) {
  const p = safePoints(points)
  const current = topFrame(p)
  const next = FRAMES.find((frame) => frame.min > p) ?? null
  return {
    points: p,
    frame: current.id,
    unlocked: FRAMES.filter((frame) => p >= frame.min).map((frame) => frame.id),
    next: next ? { id: next.id, name: next.name, min: next.min, remaining: next.min - p } : null,
  }
}
