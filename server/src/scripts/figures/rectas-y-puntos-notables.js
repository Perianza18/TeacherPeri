import assert from 'node:assert/strict'
import { add, sub, scale, mid, perp, unit, dist, meet, foot, cross, circumcenter, near, nearPoint, seg, tri, circle, dotAt, rightMark, tick, label, save, inside } from './geometry.js'

const name = (n) => `rectas-y-puntos-notables-${n}`

// 1. Mediatriz: P on the perpendicular bisector of AB is equidistant from A and B.
{
  const A = [60, 165], B = [240, 165], M = mid(A, B), P = [150, 45]
  const top = [150, 22], bottom = [150, 205]
  assert.ok(near(dist(P, A), dist(P, B)))
  assert.ok(near((top[0] - M[0]) * (B[0] - A[0]) + (top[1] - M[1]) * (B[1] - A[1]), 0))
  inside(A, B, P, top, bottom)
  save(name('mediatriz'), [seg(top, bottom, '#6D3EE8'), seg(A, B), seg(P, A), seg(P, B), rightMark(M, B, top), tick(A, M), tick(M, B), dotAt(P)],
    [label(A, 'A', -16, 6), label(B, 'B', 6, 6), label(M, 'M', -17, 19), label(P, 'P', 8, -2), label(bottom, 'm', 8, -6)])
}

// 2. Circuncentro: the three perpendicular bisectors meet at O, the centre of the circumscribed circle.
{
  const O0 = [150, 112], R = 95, at = (deg) => [O0[0] + R * Math.cos(deg * Math.PI / 180), O0[1] - R * Math.sin(deg * Math.PI / 180)]
  const A = at(215), B = at(325), C = at(100), O = circumcenter(A, B, C)
  assert.ok(nearPoint(O, O0, 1e-9) && near(dist(O, A), R) && near(dist(O, B), R) && near(dist(O, C), R))
  const bisector = (p, q) => { const m = mid(p, q), u = unit(perp(sub(q, p))), s = Math.sign(cross(sub(q, p), sub(O, m))) || 1; return [add(m, scale(u, -s * 14)), add(m, scale(u, s * (dist(m, O) + 20)))] }
  const lines = [bisector(A, B), bisector(B, C), bisector(C, A)]
  lines.forEach(([p, q]) => { assert.ok(near(cross(sub(q, p), sub(O, p)), 0, 1e-6)); inside(p, q) })
  save(name('circuncentro'), [circle(O, R), tri(A, B, C), ...lines.map(([p, q]) => seg(p, q, '#6D3EE8')), dotAt(O)],
    [label(A, 'A', -18, 8), label(B, 'B', 6, 8), label(C, 'C', -4, -6), label(O, 'O', 6, 16)])
}

// 3. Medianas: G divides each median 2:1; the midline MN is parallel to AB and half as long.
{
  const A = [40, 192], B = [262, 192], C = [112, 28]
  const M = mid(B, C), N = mid(C, A), P = mid(A, B), G = meet(A, M, B, N)
  assert.ok(near(dist(A, G), 2 * dist(G, M)) && near(dist(B, G), 2 * dist(G, N)))
  assert.ok(near(cross(sub(G, C), sub(P, C)), 0, 1e-6))
  assert.ok(near(cross(sub(N, M), sub(B, A)), 0) && near(dist(M, N), dist(A, B) / 2))
  inside(A, B, C, M, N, P, G)
  save(name('medianas'), [tri(A, B, C), seg(A, M), seg(B, N), seg(C, P), seg(M, N, '#6D3EE8'), tick(B, M), tick(M, C), tick(C, N, 2), tick(N, A, 2), tick(A, P, 3), tick(P, B, 3), dotAt(G)],
    [label(A, 'A', -16, 8), label(B, 'B', 5, 8), label(C, 'C', -5, -7), label(M, 'M', 7, -2), label(N, 'N', -20, -2), label(P, 'P', -5, 20), label(G, 'G', 6, 17)])
}

// 4. Ortocentro: the altitudes of ABC are the perpendicular bisectors of the
// triangle A'B'C' formed by the parallels to the sides through the vertices.
{
  const A = [130, 30], B = [98, 122], C = [208, 122]
  const A1 = add(B, sub(C, A)), B1 = add(A, sub(C, B)), C1 = add(A, sub(B, C))
  assert.ok(nearPoint(mid(B1, C1), A) && nearPoint(mid(C1, A1), B) && nearPoint(mid(A1, B1), C))
  const fa = foot(A, B, C), fb = foot(B, C, A), fc = foot(C, A, B), H = meet(A, fa, B, fb)
  assert.ok(near(cross(sub(fc, C), sub(H, C)), 0, 1e-6))
  inside(A1, B1, C1, A, B, C, H, fa, fb, fc)
  save(name('ortocentro'), [tri(A1, B1, C1), tri(A, B, C), seg(A, fa, '#6D3EE8'), seg(B, fb, '#6D3EE8'), seg(C, fc, '#6D3EE8'), rightMark(fa, C, A, 8), rightMark(fb, A, B, 8), rightMark(fc, B, C, 8), dotAt(H)],
    [label(A, 'A', -4, -9), label(B, 'B', -20, 4), label(C, 'C', 8, 4), label(A1, 'A′', 9, 0), label(B1, 'B′', 3, -8), label(C1, 'C′', -2, -8), label(H, 'H', -15, 17)])
}
