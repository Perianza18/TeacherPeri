import assert from 'node:assert/strict'
import { seg, path, dotAt, label, save, inside } from './geometry.js'

// A 4 × 3 grid of streets; one path from P (bottom left) to Q (top right)
// with moves to the right (D) and up (A), from P to Q, highlighted: D D A D A A D.
const cols = 4, rows = 3, size = 52, x0 = 46, y0 = 186
const P = (i, j) => [x0 + i * size, y0 - j * size]
const moves = ['D', 'D', 'A', 'D', 'A', 'A', 'D']
assert.equal(moves.filter((m) => m === 'D').length, cols)
assert.equal(moves.filter((m) => m === 'A').length, rows)
const route = [[0, 0]]
for (const m of moves) { const [i, j] = route.at(-1); route.push(m === 'D' ? [i + 1, j] : [i, j + 1]) }
assert.deepEqual(route.at(-1), [cols, rows])
const lines = []
for (let i = 0; i <= cols; i += 1) lines.push(seg(P(i, 0), P(i, rows)))
for (let j = 0; j <= rows; j += 1) lines.push(seg(P(0, j), P(cols, j)))
inside(P(0, 0), P(cols, rows))
save('coeficientes-binomiales-y-triangulo-de-pascal-caminos', [...lines, path(route.map(([i, j]) => P(i, j)), '#6D3EE8'), dotAt(P(0, 0)), dotAt(P(cols, rows))],
  [label(P(0, 0), 'P', -20, 8), label(P(cols, rows), 'Q', 8, -6)])
