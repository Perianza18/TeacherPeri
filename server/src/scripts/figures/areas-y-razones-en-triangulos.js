import assert from 'node:assert/strict'
import { mid, dist, meet, area, near, seg, tri, fill, dotAt, label, save, inside } from './geometry.js'

const name = (n) => `areas-y-razones-en-triangulos-${n}`

// 1. Ángulo común: [AB'C']/[ABC] = (AB'/AB)(AC'/AC), through the triangle AB'C.
{
  const A = [50, 30], B = [24, 196], C = [278, 170]
  const B1 = mid(A, B, 2 / 3), C1 = mid(A, C, 1 / 2)
  assert.ok(near(area(A, B1, C1) / area(A, B, C), (2 / 3) * (1 / 2)))
  assert.ok(near(area(A, B1, C1) / area(A, B1, C), 1 / 2) && near(area(A, B1, C) / area(A, B, C), 2 / 3))
  inside(A, B, C, B1, C1)
  save(name('comun'), [fill([A, B1, C1]), tri(A, B, C), seg(B1, C1, '#6D3EE8'), seg(B1, C)],
    [label(A, 'A', -6, -8), label(B, 'B', -14, 12), label(C, 'C', 6, 8), label(B1, 'B′', -24, 4), label(C1, 'C′', 2, -9)])
}

// 2. Una ceviana: P on AD gives [ABP]/[ACP] = BD/DC.
{
  const A = [120, 24], B = [26, 192], C = [276, 192], D = mid(B, C, 0.4), P = mid(A, D, 0.55)
  assert.ok(near(area(A, B, P) / area(A, C, P), dist(B, D) / dist(D, C)))
  inside(A, B, C, D, P)
  save(name('ceviana'), [fill([A, B, P]), tri(A, B, C), seg(A, D, '#6D3EE8'), seg(B, P), seg(C, P), dotAt(P)],
    [label(A, 'A', -5, -8), label(B, 'B', -16, 10), label(C, 'C', 6, 10), label(D, 'D', -5, 20), label(P, 'P', 8, 2)])
}

// 3. Dos cevianas: BD:DC = 1:2, E midpoint of CA; then AP:PD = 3:1 and BP = PE.
{
  const A = [96, 22], B = [22, 194], C = [278, 194], D = mid(B, C, 1 / 3), E = mid(C, A), P = meet(A, D, B, E)
  assert.ok(near(dist(A, P) / dist(P, D), 3) && near(dist(B, P), dist(P, E)))
  inside(A, B, C, D, E, P)
  save(name('dos-cevianas'), [tri(A, B, C), seg(A, D, '#6D3EE8'), seg(B, E, '#6D3EE8'), dotAt(P)],
    [label(A, 'A', -5, -8), label(B, 'B', -16, 10), label(C, 'C', 6, 10), label(D, 'D', -5, 20), label(E, 'E', 8, -2), label(P, 'P', -18, -4)])
}
