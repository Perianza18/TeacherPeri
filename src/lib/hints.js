// A problem's `hint` may hold several hints, one per paragraph (blank line
// between them). Each is shown behind its own toggle, «Ver pista 1», «Ver
// pista 2»; a single hint keeps the label «Ver pista».
export function splitHints(hint) {
  return String(hint || '').split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean)
}

export function hintLabel(index, count) {
  return count > 1 ? `Ver pista ${index + 1}` : 'Ver pista'
}
