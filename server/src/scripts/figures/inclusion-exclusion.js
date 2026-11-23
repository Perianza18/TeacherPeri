import assert from 'node:assert/strict'
import { add, sub, scale, unit, dist, cross, circle, label, save, inside } from './geometry.js'

// Three equal circles A, B, C; the region inside all three is filled with the accent.
const r = 62
const OA = [118, 88], OB = [182, 88], OC = [150, 146]
const circleIntersections = (p, q) => {
  const d = dist(p, q), a = d / 2, h = Math.sqrt(r * r - a * a), m = add(p, scale(sub(q, p), 0.5)), u = unit(sub(q, p)), n = [-u[1], u[0]]
  return [add(m, scale(n, h)), add(m, scale(n, -h))]
}
const insideCircle = (p, o) => dist(p, o) < r - 1e-9
const pick = (p, q, third) => circleIntersections(p, q).find((x) => insideCircle(x, third))
const pAB = pick(OA, OB, OC), pBC = pick(OB, OC, OA), pCA = pick(OC, OA, OB)
assert.ok(pAB && pBC && pCA)
// The arc of circle O from P to Q that stays inside the other two circles.
const arcTo = (P, Q, O, others) => {
  const m = unit(sub(add(P, Q), scale(O, 2))), M1 = add(O, scale(m, r)), M2 = add(O, scale(m, -r))
  const M = others.every((o) => dist(M1, o) <= r + 1e-9) ? M1 : M2
  assert.ok(others.every((o) => dist(M, o) <= r + 1e-9))
  const sweep = cross(sub(P, O), sub(M, O)) > 0 ? 1 : 0
  return `A ${r} ${r} 0 0 ${sweep} ${Q.map((n) => Math.round(n * 10) / 10).join(' ')}`
}
const f = (p) => p.map((n) => Math.round(n * 10) / 10).join(' ')
const region = `<path fill="#EEE7FF" stroke="none" d="M ${f(pAB)} ${arcTo(pAB, pBC, OB, [OA, OC])} ${arcTo(pBC, pCA, OC, [OA, OB])} ${arcTo(pCA, pAB, OA, [OB, OC])} Z"/>`
inside([OA[0] - r, OA[1] - r], [OB[0] + r, OB[1] + r], [OC[0], OC[1] + r])
save('inclusion-exclusion-venn', [region, circle(OA, r), circle(OB, r), circle(OC, r)],
  [label(add(OA, [-r * 0.72, -r * 0.72]), 'A', -12, 0), label(add(OB, [r * 0.72, -r * 0.72]), 'B', 4, 0), label(add(OC, [r * 0.8, r * 0.6]), 'C', 6, 8)])
