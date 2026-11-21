import { writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { chevron, line, polyline, triangle } from './strokes.js'
const label=(p,t,dx=0,dy=0)=>`<text x="${p[0]+dx}" y="${p[1]+dy}">${t}</text>`
const mid=(a,b,t)=>a.map((v,i)=>v+t*(b[i]-v))
const cross=(a,b,c)=>Math.abs((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))/2
const save=(name,lines,labels)=>writeFileSync(new URL(`../../../../public/figuras/areas-y-razones-${name}.svg`,import.meta.url),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220"><g fill="none" stroke="#111111" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${lines.join('')}</g><g fill="#111111" font-size="17" font-family="KaTeX_Main, 'Times New Roman', serif" font-style="italic">${labels.join('')}</g></svg>\n`)
const A=[145,30],B=[35,185],C=[265,185],D=mid(B,C,0.4), H=[145,185]
assert.ok(Math.abs(cross(A,B,D)/cross(A,D,C)-2/3)<1e-12)
save('bases',[line(A,D,'#6D3EE8'),line(A,H),triangle(A,B,C)],[label(A,'A',-4,-8),label(B,'B',-16,16),label(C,'C',5,16),label(D,'D',-12,18),label(H,'H',6,18)])
const E=mid(A,H,0.4)
assert.ok(Math.abs(cross(E,B,C)/cross(A,B,C)-0.6)<1e-12)
save('alturas',[line(A,H),polyline([B,E,C],'#6D3EE8'),triangle(A,B,C)],[label(A,'A',-5,-8),label(B,'B',-17,16),label(C,'C',5,16),label(H,'H',-5,18),label(E,'E',8,3)])
const P=[145,25],Q=[35,190],R=[265,190],S=mid(P,Q,0.5),T=mid(P,R,0.5)
assert.ok(Math.abs(cross(P,S,T)/cross(P,Q,R)-0.25)<1e-12)
save('semejantes',[line(S,T,'#6D3EE8'),line(P,[P[0],Q[1]]),triangle(P,Q,R),chevron([129,Q[1]]),chevron([129,S[1]])],[label(P,'A',-5,-7),label(Q,'B',-17,16),label(R,'C',5,16),label(S,'D',-18,0),label(T,'E',6,0),label([145,107.5],'K',5,16),label([145,190],'H',6,18)])
