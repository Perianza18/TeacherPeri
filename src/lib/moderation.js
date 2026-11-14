// Motivos para reportar o eliminar un comentario, con su etiqueta visible.
// Los valores deben coincidir con server/src/lib/moderation.js.
export const MODERATION_REASONS = [
  { value: 'spam', label: 'Spam o publicidad' },
  { value: 'ofensivo', label: 'Lenguaje ofensivo o acoso' },
  { value: 'spoiler', label: 'Revela la solución sin aviso' },
  { value: 'fuera_de_tema', label: 'Fuera de tema' },
  { value: 'informacion_personal', label: 'Comparte información personal' },
  { value: 'otro', label: 'Otro' },
]

export const REASON_NOTE_MAX = 300
export const COMMENT_MAX = 2000
