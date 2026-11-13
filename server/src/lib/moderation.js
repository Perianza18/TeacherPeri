// ---------------------------------------------------------------------------
// Reglas compartidas de comentarios y moderación.
// ---------------------------------------------------------------------------

// Un comentario de primer nivel tiene profundidad 0; sus respuestas, 1, 2 y 3.
// Una respuesta a un comentario de nivel 3 se queda en nivel 3.
export const MAX_COMMENT_DEPTH = 3

// Motivos para eliminar o reportar un comentario. «otro» exige una nota.
// Las etiquetas visibles viven en src/lib/moderation.js (interfaz).
export const MODERATION_REASONS = ['spam', 'ofensivo', 'spoiler', 'fuera_de_tema', 'informacion_personal', 'otro']

export const REASON_NOTE_MAX = 300

// Valida un motivo recibido del navegador. Regresa { reason, note } listo para
// guardar, o { error } con un mensaje en español.
export function parseReason(input) {
  const reason = typeof input?.reason === 'string' ? input.reason : ''
  const note = typeof input?.note === 'string' ? input.note.trim() : ''
  if (!MODERATION_REASONS.includes(reason)) return { error: 'Elige un motivo de la lista.' }
  if (reason === 'otro' && !note) return { error: 'Escribe el motivo.' }
  if (note.length > REASON_NOTE_MAX) return { error: `El motivo no puede pasar de ${REASON_NOTE_MAX} caracteres.` }
  return { reason, note: note || null }
}
