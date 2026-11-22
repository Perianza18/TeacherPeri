import { readFileSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import sharp from 'sharp'
import { arrow, chevron, highlightedEdge, line, triangle } from './strokes.js'

const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220"><g fill="none" stroke="#111111" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${body.lines}</g><g fill="#111111" font-size="17" font-family="KaTeX_Main, 'Times New Roman', serif" font-style="italic">${body.labels}</g></svg>\n`
const label = (p, s, dx = 0, dy = 0) => `<text x="${p[0] + dx}" y="${p[1] + dy}">${s}</text>`
const point = (a, b, t) => a.map((v, i) => v + t * (b[i] - v))
const length = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])
const save = (name, lines, labels) => writeFileSync(new URL(`../../../../public/figuras/semejanza-y-congruencia-${name}.svg`, import.meta.url), svg({ lines: lines.join(''), labels: labels.join('') }))
const A = [42, 176], B = [122, 176], C = [42, 116], D = [166, 186], E = [286, 186], F = [166, 96]
assert.equal(length(D, E) / length(A, B), 1.5)
assert.equal(length(D, F) / length(A, C), 1.5)
save('correspondencia', [triangle(A,B,C),triangle(D,E,F),highlightedEdge(D,E,'#6D3EE8')], [label(A,'A',-15,17),label(B,'B',5,17),label(C,'C',-16,-5),label(D,'D',-15,17),label(E,'E',4,17),label(F,'F',-15,-5)])
const P=[145,25], Q=[35,190], R=[265,190], S=point(P,Q,0.4), T=point(P,R,0.4)
assert.ok(Math.abs(length(S,T)/length(Q,R)-0.4)<1e-12)
save('paralela', [line(S,T,'#6D3EE8'),triangle(P,Q,R),chevron([151,Q[1]]),chevron([151,S[1]])], [label(P,'A',-4,-7),label(Q,'B',-17,16),label(R,'C',5,16),label(S,'D',-18,0),label(T,'E',6,0)])
const U=[150,30], V=[40,185], W=[260,185], M=point(V,W,0.5)
assert.equal(length(U,V),length(U,W)); assert.equal(length(V,M),length(M,W))
save('mediana', [line(U,M,'#6D3EE8'),triangle(U,V,W)], [label(U,'A',-5,-8),label(V,'B',-17,16),label(W,'C',5,16),label(M,'M',-7,18)])

const landscape = readFileSync(new URL('../../../../public/figuras/semejanza-y-congruencia-paisaje.webp', import.meta.url))
assert.equal(landscape.subarray(0, 4).toString(), 'RIFF')
assert.equal(landscape.subarray(8, 12).toString(), 'WEBP')
const { width: landscapeWidth, height: landscapeHeight, format: landscapeFormat } = await sharp(landscape).metadata()
assert.equal(landscapeFormat, 'webp')
assert.ok(landscapeWidth > 0 && landscapeHeight > 0)
const landscapeDefinition = `<defs><image id="paisaje" width="${landscapeWidth}" height="${landscapeHeight}" href="data:image/webp;base64,${landscape.toString('base64')}"/></defs>`
const picture = (x, y, sx, sy) => `<g transform="translate(${x} ${y}) scale(${sx} ${sy})"><use href="#paisaje"/></g>`
const originalScale = 100 / landscapeWidth
const zoomScale = originalScale * 1.35
const stretchX = originalScale * 1.55
const size = (sx, sy) => [landscapeWidth * sx, landscapeHeight * sy]
const originalSize = size(originalScale, originalScale)
const zoomSize = size(zoomScale, zoomScale)
const stretchedSize = size(stretchX, originalScale)
assert.ok(Math.abs(zoomSize[0] / originalSize[0] - zoomSize[1] / originalSize[1]) < 1e-12)
assert.ok(Math.abs(stretchedSize[0] / originalSize[0] - 1.55) < 1e-12)
assert.equal(stretchedSize[1], originalSize[1])
const centerY = 105
const scaleArrow = arrow([119,105],[134,105],[128,99],[128,111],'#6D3EE8')
save('pantalla', [landscapeDefinition,picture(15,centerY-originalSize[1]/2,originalScale,originalScale),picture(145,centerY-zoomSize[1]/2,zoomScale,zoomScale),scaleArrow], [label([35,170],'original'),label([188,170],'ampliada')])
save('estirada', [landscapeDefinition,picture(15,centerY-originalSize[1]/2,originalScale,originalScale),picture(140,centerY-stretchedSize[1]/2,stretchX,originalScale),scaleArrow], [label([35,170],'original'),label([190,170],'estirada')])
const G=[25,165], H=[95,165], I=[25,113], J=[242,55], K=[137,55], L=[242,133]
const rotateAndEnlarge = (p) => [J[0]-1.5*(p[0]-G[0]), J[1]-1.5*(p[1]-G[1])]
assert.deepEqual(rotateAndEnlarge(H), K)
assert.deepEqual(rotateAndEnlarge(I), L)
assert.equal(length(J,K)/length(G,H),1.5)
assert.equal(length(J,L)/length(G,I),1.5)
assert.equal(length(K,L)/length(H,I),1.5)
save('giro', [triangle(G,H,I),triangle(J,K,L,'#6D3EE8')], [label(G,'A',-16,17),label(H,'B',5,17),label(I,'C',-15,-6),label(J,'D',6,-6),label(K,'E',-16,-6),label(L,'F',5,17)])
