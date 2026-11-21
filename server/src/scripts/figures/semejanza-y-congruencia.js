import { writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220"><g fill="none" stroke="#111111" stroke-width="2.5" stroke-linejoin="round">${body.lines}</g><g fill="#111111" font-size="17" font-family="KaTeX_Main, 'Times New Roman', serif" font-style="italic">${body.labels}</g></svg>\n`
const line = (a, b, color = '#111111') => `<path stroke="${color}" d="M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}"/>`
const label = (p, s, dx = 0, dy = 0) => `<text x="${p[0] + dx}" y="${p[1] + dy}">${s}</text>`
const point = (a, b, t) => a.map((v, i) => v + t * (b[i] - v))
const length = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])
const save = (name, lines, labels) => writeFileSync(new URL(`../../../../public/figuras/semejanza-y-congruencia-${name}.svg`, import.meta.url), svg({ lines: lines.join(''), labels: labels.join('') }))
const A = [42, 176], B = [122, 176], C = [42, 116], D = [166, 186], E = [286, 186], F = [166, 96]
assert.equal(length(D, E) / length(A, B), 1.5)
assert.equal(length(D, F) / length(A, C), 1.5)
save('correspondencia', [line(A,B),line(B,C),line(C,A),line(D,E,'#6D3EE8'),line(E,F),line(F,D)], [label(A,'A',-15,17),label(B,'B',5,17),label(C,'C',-16,-5),label(D,'D',-15,17),label(E,'E',4,17),label(F,'F',-15,-5)])
const P=[145,25], Q=[35,190], R=[265,190], S=point(P,Q,0.4), T=point(P,R,0.4)
assert.ok(Math.abs(length(S,T)/length(Q,R)-0.4)<1e-12)
save('paralela', [line(P,Q),line(Q,R),line(R,P),line(S,T,'#6D3EE8'),line([145,184],[151,190]),line([145,196],[151,190]),line([145,85],[151,91]),line([145,97],[151,91])], [label(P,'A',-4,-7),label(Q,'B',-17,16),label(R,'C',5,16),label(S,'D',-18,0),label(T,'E',6,0)])
const U=[150,30], V=[40,185], W=[260,185], M=point(V,W,0.5)
assert.equal(length(U,V),length(U,W)); assert.equal(length(V,M),length(M,W))
save('mediana', [line(U,V),line(V,W),line(W,U),line(U,M,'#6D3EE8')], [label(U,'A',-5,-8),label(V,'B',-17,16),label(W,'C',5,16),label(M,'M',-7,18)])

const house = (x, y, sx, sy, outline) => `<g transform="translate(${x} ${y}) scale(${sx} ${sy})"><path d="M -27 0 L 0 -24 L 27 0 L 21 0 L 21 24 L -21 24 L -21 0 Z" fill="none" stroke="${outline}" stroke-width="2.5" stroke-linejoin="round" vector-effect="non-scaling-stroke"/><path d="M -12 24 V 8 H -3 V 24 M 5 3 H 14 V 12 H 5 Z" fill="none" stroke="#111111" stroke-width="2.5" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></g>`
const houseLabels = [label([42,125], 'original'), label([183,135], 'ampliada'), label([117,215], 'estirada')]
const houseWidth = (sx) => 54 * sx
const houseHeight = (sy) => 48 * sy
assert.ok(Math.abs(houseWidth(1.4) / houseWidth(1) - houseHeight(1.4) / houseHeight(1)) < 1e-12)
assert.equal(houseWidth(1.7) / houseWidth(1), 1.7)
assert.equal(houseHeight(1) / houseHeight(1), 1)
save('pantalla', [house(65,75,1,1,'#111111'),house(215,75,1.4,1.4,'#6D3EE8'),house(150,170,1.7,1,'#6D3EE8')], houseLabels)
const G=[25,165], H=[95,165], I=[25,113], J=[242,55], K=[137,55], L=[242,133]
const rotateAndEnlarge = (p) => [J[0]-1.5*(p[0]-G[0]), J[1]-1.5*(p[1]-G[1])]
assert.deepEqual(rotateAndEnlarge(H), K)
assert.deepEqual(rotateAndEnlarge(I), L)
assert.equal(length(J,K)/length(G,H),1.5)
assert.equal(length(J,L)/length(G,I),1.5)
assert.equal(length(K,L)/length(H,I),1.5)
save('giro', [line(G,H),line(H,I),line(I,G),line(J,K,'#6D3EE8'),line(K,L,'#6D3EE8'),line(L,J,'#6D3EE8')], [label(G,'A',-16,17),label(H,'B',5,17),label(I,'C',-15,-6),label(J,'D',6,-6),label(K,'E',-16,-6),label(L,'F',5,17)])
