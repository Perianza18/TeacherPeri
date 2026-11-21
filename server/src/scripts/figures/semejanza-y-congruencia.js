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

const picture = (x, y, sx, sy, outline) => {
  const clip = `landscape-${x}-${y}`
  return `<g transform="translate(${x} ${y}) scale(${sx} ${sy})">
    <defs><clipPath id="${clip}"><rect width="80" height="60" rx="3"/></clipPath></defs>
    <g clip-path="url(#${clip})" fill="none" stroke="#111111" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="64" cy="12" r="5"/>
      <path d="M 7 14 C 7 11 10 9 13 10 C 15 7 19 7 21 10 C 24 9 27 11 27 14 M 30 11 Q 32 9 34 11 Q 36 9 38 11"/>
      <path d="M -2 47 C 6 42 12 31 19 22 C 23 25 27 31 31 35 C 36 29 42 20 47 14 C 55 20 67 35 82 45"/>
      <path d="M 14 28 C 16 28 18 27 19 25 C 21 27 23 29 25 30 M 41 22 C 43 23 46 22 47 19 C 49 21 51 23 54 24"/>
      <path d="M -2 50 C 12 45 24 45 38 50 C 53 55 67 55 82 48 L 82 62 L -2 62 Z" fill="white" stroke="none"/>
      <path d="M -2 50 C 12 45 24 45 38 50 C 53 55 67 55 82 48"/>
      <path d="M 35 55 C 39 54 43 54 47 55 M 54 56 C 58 55 62 55 66 55"/>
      <path d="M 3 46 L 9 34 L 15 46 Z M 65 47 L 70 37 L 75 47 Z" fill="white"/>
      <path d="M 9 46 V 50 M 70 47 V 51"/>
    </g>
    <rect width="80" height="60" rx="3" fill="none" stroke="${outline}" stroke-width="2.5" vector-effect="non-scaling-stroke"/>
  </g>`
}
const pictureWidth = (sx) => 80 * sx
const pictureHeight = (sy) => 60 * sy
const originalScale = 1.25
const zoomScale = 1.6875
const stretchX = 1.9375
assert.ok(Math.abs(pictureWidth(zoomScale) / pictureWidth(originalScale) - pictureHeight(zoomScale) / pictureHeight(originalScale)) < 1e-12)
assert.ok(Math.abs(pictureWidth(stretchX) / pictureWidth(originalScale) - 1.55) < 1e-12)
const originalHeight = pictureHeight(originalScale)
const stretchedHeight = pictureHeight(originalScale)
assert.equal(stretchedHeight, originalHeight)
const arrow = [line([119,105],[134,105],'#6D3EE8'),line([128,99],[134,105],'#6D3EE8'),line([128,111],[134,105],'#6D3EE8')]
save('pantalla', [picture(15,70,originalScale,originalScale,'#111111'),picture(145,56,zoomScale,zoomScale,'#6D3EE8'),...arrow], [label([35,185],'original'),label([188,185],'ampliada')])
save('estirada', [picture(15,70,originalScale,originalScale,'#111111'),picture(140,70,stretchX,originalScale,'#6D3EE8'),...arrow], [label([35,178],'original'),label([190,178],'estirada')])
const G=[25,165], H=[95,165], I=[25,113], J=[242,55], K=[137,55], L=[242,133]
const rotateAndEnlarge = (p) => [J[0]-1.5*(p[0]-G[0]), J[1]-1.5*(p[1]-G[1])]
assert.deepEqual(rotateAndEnlarge(H), K)
assert.deepEqual(rotateAndEnlarge(I), L)
assert.equal(length(J,K)/length(G,H),1.5)
assert.equal(length(J,L)/length(G,I),1.5)
assert.equal(length(K,L)/length(H,I),1.5)
save('giro', [line(G,H),line(H,I),line(I,G),line(J,K,'#6D3EE8'),line(K,L,'#6D3EE8'),line(L,J,'#6D3EE8')], [label(G,'A',-16,17),label(H,'B',5,17),label(I,'C',-15,-6),label(J,'D',6,-6),label(K,'E',-16,-6),label(L,'F',5,17)])
