import assert from 'node:assert/strict'
import { add, sub, scale, mid, dist, meet, foot, near, seg, tri, dotAt, rightMark, label, save, inside } from './geometry.js'

const name = (n) => `ceva-y-menelao-${n}`

// 1. Ceva: BD:DC = 2:3, CE:EA = 1:1, AF:FB = 3:2, and the three cevians meet at P.
{
  const A = [110, 22], B = [22, 194], C = [278, 194]
  const D = mid(B, C, 2 / 5), E = mid(C, A, 1 / 2), F = mid(A, B, 3 / 5)
  const P = meet(A, D, B, E)
  assert.ok(near(dist(B, D) / dist(D, C) * dist(C, E) / dist(E, A) * dist(A, F) / dist(F, B), 1))
  assert.ok(near(Math.abs((F[0] - C[0]) * (P[1] - C[1]) - (F[1] - C[1]) * (P[0] - C[0])), 0, 1e-6))
  inside(A, B, C, D, E, F, P)
  save(name('ceva'), [tri(A, B, C), seg(A, D, '#6D3EE8'), seg(B, E, '#6D3EE8'), seg(C, F, '#6D3EE8'), dotAt(P)],
    [label(A, 'A', -5, -8), label(B, 'B', -16, 10), label(C, 'C', 6, 10), label(D, 'D', -5, 20), label(E, 'E', 8, -2), label(F, 'F', -18, -2), label(P, 'P', 7, 16)])
}

// 2. Menelao: a line through F on AB (AF:FB = 7:3) and E on AC (AE:EC = 3:7) meets
// line BC at D beyond B; the perpendiculars from A, B, C to the line have feet A', B', C'.
{
  const shape = { A: [0.5, 0], B: [0.18, 1], C: [1, 1] }
  const fitPts = (() => {
    const { A, B, C } = shape, F = mid(A, B, 0.7), E = mid(A, C, 0.3), D = meet(F, E, B, C)
    return [A, B, C, D, foot(A, D, E), foot(B, D, E), foot(C, D, E), E]
  })()
  const xs = fitPts.map((p) => p[0]), ys = fitPts.map((p) => p[1])
  const k = Math.min(250 / (Math.max(...xs) - Math.min(...xs)), 180 / (Math.max(...ys) - Math.min(...ys)))
  const off = [150 - k * (Math.max(...xs) + Math.min(...xs)) / 2, 112 - k * (Math.max(...ys) + Math.min(...ys)) / 2]
  const place = (p) => add(scale(p, k), off)
  const A = place(shape.A), B = place(shape.B), C = place(shape.C)
  const F = mid(A, B, 0.7), E = mid(A, C, 0.3), D = meet(F, E, B, C)
  const A1 = foot(A, D, E), B1 = foot(B, D, E), C1 = foot(C, D, E)
  const ratio = (dist(B, D) / dist(D, C)) * (dist(C, E) / dist(E, A)) * (dist(A, F) / dist(F, B))
  assert.ok(near(ratio, 1))
  assert.ok(near(dist(B, D) / dist(D, C), dist(B, B1) / dist(C, C1)) && near(dist(C, E) / dist(E, A), dist(C, C1) / dist(A, A1)) && near(dist(A, F) / dist(F, B), dist(A, A1) / dist(B, B1)))
  const far = [E, A1, C1].reduce((p, q) => (dist(D, q) > dist(D, p) ? q : p))
  const lineEnd = add(far, scale(sub(far, D), 12 / dist(far, D)))
  inside(A, B, C, D, E, F, A1, B1, C1, lineEnd)
  save(name('menelao'), [tri(A, B, C), seg(D, B), seg(D, lineEnd, '#6D3EE8'), seg(A, A1), seg(B, B1), seg(C, C1), rightMark(A1, A, E, 7), rightMark(B1, B, E, 7), rightMark(C1, C, D, 7)],
    [label(A, 'A', -4, -8), label(B, 'B', -4, 20), label(C, 'C', 6, 10), label(D, 'D', -14, 16), label(E, 'E', 10, 16), label(F, 'F', -18, -2), label(A1, 'A′', -6, -8), label(B1, 'B′', -20, -2), label(C1, 'C′', 4, -8)])
}
