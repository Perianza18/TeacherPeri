// Small plane-geometry helpers for the lesson figures. Every figure script
// computes its points with these functions and checks the claims the lesson
// text makes about them before writing the SVG.
import { writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'

export const add = (p, q) => [p[0] + q[0], p[1] + q[1]]
export const sub = (p, q) => [p[0] - q[0], p[1] - q[1]]
export const scale = (p, k) => [p[0] * k, p[1] * k]
export const dot = (p, q) => p[0] * q[0] + p[1] * q[1]
export const cross = (p, q) => p[0] * q[1] - p[1] * q[0]
export const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1])
export const unit = (p) => scale(p, 1 / Math.hypot(p[0], p[1]))
export const mid = (p, q, t = 0.5) => add(p, scale(sub(q, p), t))
export const perp = (p) => [-p[1], p[0]]
export const round = (p) => p.map((n) => Math.round(n * 10) / 10)

// Intersection of line p + s·u with line q + t·v.
export function intersect(p, u, q, v) {
  const d = cross(u, v)
  assert.ok(Math.abs(d) > 1e-9, 'parallel lines')
  return add(p, scale(u, cross(sub(q, p), v) / d))
}
export const lineThrough = (p, q) => [p, sub(q, p)]
export const meet = (p1, p2, q1, q2) => intersect(p1, sub(p2, p1), q1, sub(q2, q1))
export const foot = (p, a, b) => { const u = sub(b, a); return add(a, scale(u, dot(sub(p, a), u) / dot(u, u))) }
export const area = (a, b, c) => Math.abs(cross(sub(b, a), sub(c, a))) / 2
export const angle = (a, v, b) => { const u = sub(a, v), w = sub(b, v); return Math.acos(dot(u, w) / Math.hypot(...u) / Math.hypot(...w)) * 180 / Math.PI }
export const circumcenter = (a, b, c) => intersect(mid(a, b), perp(sub(b, a)), mid(b, c), perp(sub(c, b)))
export const incenter = (a, b, c) => { const la = dist(b, c), lb = dist(c, a), lc = dist(a, b), s = la + lb + lc; return [(la * a[0] + lb * b[0] + lc * c[0]) / s, (la * a[1] + lb * b[1] + lc * c[1]) / s] }
export const near = (x, y, eps = 1e-6) => Math.abs(x - y) < eps
export const nearPoint = (p, q, eps = 1e-6) => dist(p, q) < eps

// SVG pieces. Ink #111111, accent #6D3EE8 (lines) or #EEE7FF (fills).
const c = (p) => `${Math.round(p[0] * 10) / 10} ${Math.round(p[1] * 10) / 10}`
export const path = (points, color = '#111111', closed = false) => `<path stroke="${color}" d="M ${points.map(c).join(' L ')}${closed ? ' Z' : ''}"/>`
export const seg = (p, q, color = '#111111') => path([p, q], color)
export const tri = (a, b, cc, color = '#111111') => path([a, b, cc], color, true)
export const fill = (points) => `<path fill="#EEE7FF" stroke="none" d="M ${points.map(c).join(' L ')} Z"/>`
export const circle = (o, r, color = '#111111') => `<circle cx="${Math.round(o[0] * 10) / 10}" cy="${Math.round(o[1] * 10) / 10}" r="${Math.round(r * 10) / 10}" stroke="${color}"/>`
export const dotAt = (p, color = '#111111') => `<circle cx="${Math.round(p[0] * 10) / 10}" cy="${Math.round(p[1] * 10) / 10}" r="3.2" fill="${color}" stroke="none"/>`
export const rightMark = (v, p, q, size = 9) => { const u = scale(unit(sub(p, v)), size), w = scale(unit(sub(q, v)), size); return path([add(v, u), add(add(v, u), w), add(v, w)]) }
export const tick = (p, q, n = 1, color = '#111111') => {
  const m = mid(p, q), u = unit(sub(q, p)), n0 = scale(perp(u), 6)
  return Array.from({ length: n }, (_, i) => { const o = add(m, scale(u, (i - (n - 1) / 2) * 5)); return seg(sub(o, n0), add(o, n0), color) }).join('')
}
// An arc marking the angle at v from ray v→p to ray v→q (the smaller one).
export const arc = (v, p, q, r = 18, color = '#111111') => {
  const a = add(v, scale(unit(sub(p, v)), r)), b = add(v, scale(unit(sub(q, v)), r))
  const sweep = cross(sub(p, v), sub(q, v)) > 0 ? 1 : 0
  return `<path stroke="${color}" d="M ${c(a)} A ${r} ${r} 0 0 ${sweep} ${c(b)}"/>`
}
export const label = (p, text, dx = 0, dy = 0) => `<text x="${Math.round((p[0] + dx) * 10) / 10}" y="${Math.round((p[1] + dy) * 10) / 10}">${text}</text>`

export function save(name, shapes, labels) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220"><g fill="none" stroke="#111111" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${shapes.join('')}</g><g fill="#111111" font-size="17" font-family="KaTeX_Main, 'Times New Roman', serif" font-style="italic">${labels.join('')}</g></svg>\n`
  writeFileSync(new URL(`../../../../public/figuras/${name}.svg`, import.meta.url), svg)
}
// Every drawn point must stay inside the 300×220 box with a margin.
export const inside = (...points) => points.forEach((p) => assert.ok(p[0] >= 4 && p[0] <= 296 && p[1] >= 4 && p[1] <= 216, `outside the box: ${p}`))
