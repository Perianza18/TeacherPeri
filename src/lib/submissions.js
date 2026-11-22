// Shared pieces for proposing problems and «Mis envíos». The server decides
// everything (server/src/routes/submissions.routes.js); this file only names
// states and builds folder paths for display.

export const PROPOSE_PATH = '/entrenamiento/problemas/proponer'
export const MY_SUBMISSIONS_PATH = '/mis-envios'

// Tags only the TeacherPeri team applies (same list as the server).
export const RESERVED_TAG_SLUGS = ['teacherperi-original']

export const STATE_INFO = {
  pending: { label: 'En revisión', className: 'bg-tp-yellow-soft' },
  rejected: { label: 'Rechazado', className: 'bg-tp-orange-soft' },
  published: { label: 'Publicado', className: 'bg-tp-mint' },
  'published-pending': { label: 'Publicado · cambios en revisión', className: 'bg-tp-yellow-soft' },
  'published-rejected': { label: 'Publicado · cambios rechazados', className: 'bg-tp-orange-soft' },
}

export const normalize = (text) => String(text || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

// Names from the top folder down to `id`.
export function folderPathNames(id, folders) {
  const byId = new Map(folders.map((folder) => [String(folder._id), folder]))
  const names = []
  const seen = new Set()
  let cursor = id ? byId.get(String(id)) : null
  while (cursor && !seen.has(String(cursor._id))) {
    seen.add(String(cursor._id))
    names.unshift(cursor.name)
    cursor = cursor.parent ? byId.get(String(cursor.parent)) : null
  }
  return names
}

export const emptyProposal = () => ({ enunciado: '', topics: [], tags: [], isExam: false, examFolder: null, problemNumber: '', images: [] })
