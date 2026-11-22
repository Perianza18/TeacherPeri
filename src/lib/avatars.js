// Preset avatars for Mi Espacio (DESIGN §4: circles, 2px ink border, pastel
// fill; presets only, no uploads). Each one is a simple math shape drawn in
// ink on a 40×40 grid. The server knows only the ids (server/src/lib/profile.js).

const FILLS = ['#eee7ff', '#e5f1ff', '#fff4cc', '#d8f5e8', '#ffe4e1', '#e8ddff']

export const AVATARS = [
  { id: 'a01', name: 'Triángulo', paths: ['M20 9 L31 29 H9 Z'] },
  { id: 'a02', name: 'Círculo con centro', paths: ['M20 9 a11 11 0 1 0 0.01 0', 'M20 19.5 v1'] },
  { id: 'a03', name: 'Infinito', paths: ['M20 20 C16 13 9 13 9 20 C9 27 16 27 20 20 C24 13 31 13 31 20 C31 27 24 27 20 20 Z'] },
  { id: 'a04', name: 'Pi', paths: ['M10 13 H30', 'M15 13 V29', 'M25 13 V26 q0 3 3 3'] },
  { id: 'a05', name: 'Sigma', paths: ['M29 11 H11 L21 20 L11 29 H29'] },
  { id: 'a06', name: 'Raíz', paths: ['M8 22 L12 20 L16 30 L22 10 H32'] },
  { id: 'a07', name: 'Estrella', paths: ['M20 8 L23.5 16 L32 16.5 L25.5 22 L27.5 30.5 L20 26 L12.5 30.5 L14.5 22 L8 16.5 L16.5 16 Z'] },
  { id: 'a08', name: 'Hexágono', paths: ['M20 8 L30.4 14 V26 L20 32 L9.6 26 V14 Z'] },
  { id: 'a09', name: 'Parábola', paths: ['M9 11 Q20 40 31 11', 'M8 29 H32'] },
  { id: 'a10', name: 'Cuadrado con diagonal', paths: ['M10 10 H30 V30 H10 Z', 'M10 30 L30 10'] },
  { id: 'a11', name: 'Integral', paths: ['M24 9 q-4 -1 -4 4 V27 q0 5 -4 4'] },
  { id: 'a12', name: 'Ángulo', paths: ['M9 30 H31', 'M9 30 L27 12', 'M17 30 a8 8 0 0 0 -2.3 -5.7'] },
].map((avatar, index) => ({ ...avatar, fill: FILLS[index % FILLS.length] }))

const BY_ID = new Map(AVATARS.map((avatar) => [avatar.id, avatar]))

export function avatarById(id) {
  return BY_ID.get(id) ?? AVATARS[0]
}
