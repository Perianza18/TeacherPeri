import assert from 'node:assert/strict'
import { add, sub, scale, mid, unit, dist, foot, cross, angle, incenter, near, seg, tri, circle, dotAt, rightMark, arc, label, save, inside } from './geometry.js'

const name = (n) => `bisectrices-incentro-y-excentros-${n}`

// 1. A point of the bisector of angle XOY is at the same distance from both sides.
{
  const O = [40, 180], X = [270, 180], Y = add(O, scale(unit([1, -0.9]), 220))
  const bis = add(O, scale(unit(add(unit(sub(X, O)), unit(sub(Y, O)))), 250))
  const P = add(O, scale(unit(sub(bis, O)), 165)), D = foot(P, O, X), E = foot(P, O, Y)
  assert.ok(near(dist(P, D), dist(P, E)) && near(angle(X, O, P), angle(P, O, Y)))
  inside(O, X, Y, bis, P, D, E)
  save(name('bisectriz'), [seg(O, X), seg(O, Y), seg(O, bis, '#6D3EE8'), seg(P, D), seg(P, E), rightMark(D, O, P), rightMark(E, O, P), arc(O, X, P, 34), arc(O, P, Y, 40), dotAt(P)],
    [label(O, 'O', -16, 6), label(X, 'X', -6, 20), label(Y, 'Y', 6, 4), label(P, 'P', 8, -4), label(D, 'D', -5, 20), label(E, 'E', -18, -2)])
}

// 2. Incentro: the internal bisectors meet at I, centre of the inscribed circle.
{
  const A = [118, 26], B = [30, 192], C = [272, 192], I = incenter(A, B, C)
  const D = foot(I, B, C), E = foot(I, C, A), F = foot(I, A, B), r = dist(I, D)
  assert.ok(near(r, dist(I, E)) && near(r, dist(I, F)))
  assert.ok(near(angle(B, A, I), angle(I, A, C)) && near(angle(A, B, I), angle(I, B, C)) && near(angle(B, C, I), angle(I, C, A)))
  inside(A, B, C, I, D, E, F)
  save(name('incentro'), [circle(I, r), tri(A, B, C), seg(A, I, '#6D3EE8'), seg(B, I, '#6D3EE8'), seg(C, I, '#6D3EE8'), seg(I, D), rightMark(D, C, I, 8), dotAt(I)],
    [label(A, 'A', -5, -8), label(B, 'B', -18, 8), label(C, 'C', 6, 8), label(I, 'I', 7, -5), label(D, 'D', -5, 20), label(E, 'E', 7, -4), label(F, 'F', -18, -2), label(mid(I, D), 'r', 6, 6)])
}

// 3. Teorema de la bisectriz: L on BC with BL/LC = AB/AC; L is at the same distance from AB and AC.
{
  const A = [96, 30], B = [24, 190], C = [276, 190]
  const L = add(B, scale(sub(C, B), dist(A, B) / (dist(A, B) + dist(A, C))))
  assert.ok(near(angle(B, A, L), angle(L, A, C)))
  assert.ok(near(dist(B, L) / dist(L, C), dist(A, B) / dist(A, C)))
  const P = foot(L, A, B), Q = foot(L, A, C)
  assert.ok(near(dist(L, P), dist(L, Q)))
  inside(A, B, C, L, P, Q)
  save(name('teorema'), [tri(A, B, C), seg(A, L, '#6D3EE8'), seg(L, P), seg(L, Q), rightMark(P, A, L, 8), rightMark(Q, A, L, 8), arc(A, B, L, 26), arc(A, L, C, 32)],
    [label(A, 'A', -5, -8), label(B, 'B', -18, 8), label(C, 'C', 6, 8), label(L, 'L', -4, 20), label(P, 'P', -18, 0), label(Q, 'Q', 6, -6)])
}

// 4. Excentro: the external bisectors at B and C and the internal bisector at A meet at I_A.
{
  // Shape first, then scale and translate so that A, the extended sides and the excircle fit the box.
  const shape = { A: [0.35, 0], B: [0, 0.62], C: [1, 0.62] }
  const exc = (A, B, C) => { const a = dist(B, C), b = dist(C, A), c = dist(A, B); return [(-a * A[0] + b * B[0] + c * C[0]) / (-a + b + c), (-a * A[1] + b * B[1] + c * C[1]) / (-a + b + c)] }
  const I0 = exc(shape.A, shape.B, shape.C), r0 = Math.abs(cross(sub(shape.C, shape.B), sub(I0, shape.B))) / dist(shape.B, shape.C)
  const minX = Math.min(shape.B[0], I0[0] - r0), maxX = Math.max(shape.C[0], I0[0] + r0), minY = shape.A[1], maxY = I0[1] + r0
  const k = Math.min(270 / (maxX - minX), 196 / (maxY - minY)), off = [150 - k * (minX + maxX) / 2, 12 - k * minY]
  const place = (p) => add(scale(p, k), off)
  const A = place(shape.A), B = place(shape.B), C = place(shape.C)
  const a = dist(B, C), b = dist(C, A), c = dist(A, B)
  const IA = [(-a * A[0] + b * B[0] + c * C[0]) / (-a + b + c), (-a * A[1] + b * B[1] + c * C[1]) / (-a + b + c)]
  const lineDist = (p, u, v) => Math.abs(cross(sub(v, u), sub(p, u))) / dist(u, v)
  const ra = lineDist(IA, B, C)
  assert.ok(near(ra, lineDist(IA, A, B)) && near(ra, lineDist(IA, A, C)))
  assert.ok(near(angle(B, A, IA), angle(IA, A, C)))
  // the far ends of the extended sides
  const ab = add(A, scale(unit(sub(B, A)), dist(A, foot(IA, A, B)) + 14)), ac = add(A, scale(unit(sub(C, A)), dist(A, foot(IA, A, C)) + 14))
  const TB = foot(IA, A, B), TC = foot(IA, A, C), TD = foot(IA, B, C)
  inside(A, B, C, IA, add(IA, [0, ra]), add(IA, [ra, 0]), add(IA, [-ra, 0]))
  save(name('excentro'), [circle(IA, ra), seg(A, ab), seg(A, ac), seg(B, C), seg(B, IA, '#6D3EE8'), seg(C, IA, '#6D3EE8'), seg(A, IA, '#6D3EE8'), dotAt(IA), dotAt(TB), dotAt(TC), dotAt(TD)],
    [label(A, 'A', 9, 6), label(B, 'B', -18, -2), label(C, 'C', 6, -6), label(IA, 'I_A'.replace('I_A', 'I<tspan font-size="12" dy="4">A</tspan>'), 8, -2)])
}
