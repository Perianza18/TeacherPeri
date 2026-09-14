export const PUBLICATION_STATUSES = ['draft', 'published', 'archived']
export const DIFFICULTY_LEVELS = ['basico', 'intermedio', 'avanzado']

export function difficultyLabel(value) {
  return { basico: 'Básico', intermedio: 'Intermedio', avanzado: 'Avanzado' }[value] || value
}

export function normalizeSlug(value = '') {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const publicationFields = {
  publicationStatus: {
    type: String,
    enum: PUBLICATION_STATUSES,
    default: 'draft',
    index: true,
  },
}

export function publishedOrLegacyProblemQuery() {
  return { $or: [{ publicationStatus: 'published' }, { publicationStatus: { $exists: false } }] }
}
