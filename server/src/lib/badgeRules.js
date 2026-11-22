// Mi Espacio badges: the fixed set, and the pure rules that decide which ones
// a person has earned. lib/badges.js reads the counts from the database and
// stores the result. Names are visible text, so they are in Spanish.

export const BADGE_CATEGORIES = Object.freeze([
  {
    id: 'solved',
    label: 'Problemas resueltos',
    color: 'mint',
    unit: ['problema resuelto', 'problemas resueltos'],
    tiers: [
      { id: 'solved-1', name: 'Primer problema', threshold: 1 },
      { id: 'solved-10', name: 'Constancia', threshold: 10 },
      { id: 'solved-50', name: 'Incansable', threshold: 50 },
    ],
  },
  {
    id: 'comments',
    label: 'Comentarios',
    color: 'sky',
    unit: ['comentario', 'comentarios'],
    tiers: [
      { id: 'comments-1', name: 'Primera palabra', threshold: 1 },
      { id: 'comments-10', name: 'Conversador', threshold: 10 },
      { id: 'comments-50', name: 'Voz de la comunidad', threshold: 50 },
    ],
  },
  {
    id: 'contributions',
    label: 'Problemas aceptados',
    color: 'yellow',
    unit: ['problema aceptado', 'problemas aceptados'],
    tiers: [
      { id: 'contributions-1', name: 'Autor', threshold: 1 },
      { id: 'contributions-5', name: 'Autor frecuente', threshold: 5 },
      { id: 'contributions-20', name: 'Creador de problemas', threshold: 20 },
    ],
  },
  {
    id: 'suggestions',
    label: 'Sugerencias aplicadas',
    color: 'coral',
    unit: ['sugerencia aplicada', 'sugerencias aplicadas'],
    tiers: [
      { id: 'suggestions-1', name: 'Ojo atento', threshold: 1 },
      { id: 'suggestions-5', name: 'Corrector', threshold: 5 },
      { id: 'suggestions-20', name: 'Revisor de oro', threshold: 20 },
    ],
  },
])

export const ROLE_BADGES = Object.freeze([
  { id: 'role-editor', name: 'Editor', color: 'violet', roles: ['editor', 'admin'], description: 'Parte del equipo editorial' },
  { id: 'role-admin', name: 'Admin', color: 'violet', roles: ['admin'], description: 'Administra TeacherPeri' },
])

export const BADGE_IDS = Object.freeze([...BADGE_CATEGORIES.flatMap((c) => c.tiers.map((t) => t.id)), ...ROLE_BADGES.map((b) => b.id)])

const BY_ID = new Map([
  ...BADGE_CATEGORIES.flatMap((category) => category.tiers.map((tier) => [tier.id, { ...tier, category: category.id, color: category.color, description: `${tier.threshold} ${tier.threshold === 1 ? category.unit[0] : category.unit[1]}` }])),
  ...ROLE_BADGES.map((badge) => [badge.id, { ...badge, category: 'role' }]),
])
export const badgeInfo = (id) => BY_ID.get(id) ?? null

// dates: { solved: [Date…], comments: […], … } — one date per counted item,
// oldest first. Returns the badges due now: [{ badge, earnedAt }]. A tier's
// date is when its Nth item happened; a role badge's date is `now`.
export function dueBadges(dates, role, now = new Date()) {
  const due = []
  for (const category of BADGE_CATEGORIES) {
    const list = dates[category.id] ?? []
    for (const tier of category.tiers) {
      if (list.length >= tier.threshold) due.push({ badge: tier.id, earnedAt: new Date(list[tier.threshold - 1]) })
    }
  }
  for (const badge of ROLE_BADGES) if (badge.roles.includes(role)) due.push({ badge: badge.id, earnedAt: now })
  return due
}

// What the Insignias tab shows: every earned badge (stored), then the next
// locked tier of each category with how many are missing.
export function badgeView(earned, counts) {
  const have = new Map(earned.map((b) => [b.badge, b.earnedAt]))
  const order = new Map(BADGE_IDS.map((id, i) => [id, i]))
  const earnedView = [...have.entries()]
    .filter(([id]) => BY_ID.has(id))
    .sort((a, b) => order.get(a[0]) - order.get(b[0]))
    .map(([id, earnedAt]) => ({ ...publicBadge(id), earned: true, earnedAt }))
  const locked = []
  for (const category of BADGE_CATEGORIES) {
    const next = category.tiers.find((tier) => !have.has(tier.id))
    if (next) locked.push({ ...publicBadge(next.id), earned: false, remaining: Math.max(1, next.threshold - (counts[category.id] ?? 0)) })
  }
  return { earned: earnedView, locked }
}

function publicBadge(id) {
  const info = BY_ID.get(id)
  return { id, name: info.name, category: info.category, color: info.color, description: info.description }
}
