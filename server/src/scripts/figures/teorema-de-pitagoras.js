import { writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { line, polyline, triangle } from './strokes.js'

const label=(p,t,dx=0,dy=0)=>`<text x="${p[0]+dx}" y="${p[1]+dy}">${t}</text>`
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1])
const add=(a,b)=>a.map((n,i)=>n+b[i])
const scale=(a,k)=>a.map((n)=>n*k)
const difference=(a,b)=>a.map((n,i)=>n-b[i])
const unit=(a)=>scale(a,1/Math.hypot(...a))
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]
const squareMark=(vertex,u,v,size=9)=>polyline([add(vertex,scale(u,size)),add(vertex,scale(add(u,v),size)),add(vertex,scale(v,size))])
const save=(name,lines,labels)=>writeFileSync(new URL(`../../../../public/figuras/teorema-de-pitagoras-${name}.svg`,import.meta.url),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220"><g fill="none" stroke="#111111" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${lines.join('')}</g><g fill="#111111" font-size="17" font-family="KaTeX_Main, 'Times New Roman', serif" font-style="italic">${labels.join('')}</g></svg>\n`)
const screen=(w,h,name)=>{
  const x=150-w/2,y=105-h/2, A=[x,y],B=[x+w,y],C=[x+w,y+h],D=[x,y+h]
  assert.ok(Math.abs(dist(A,C)-160)<1e-9)
  save(name,[line(A,C,'#6D3EE8'),polyline([A,B,C,D],'#111111',true)],[label([150,105],'d',8,-6)])
}
screen(128,96,'pantalla-cuatro-tres')
screen(160*16/Math.sqrt(337),160*9/Math.sqrt(337),'pantalla-dieciseis-nueve')
const A=[55,38],B=[235,173],C=[55,173]
const AB=difference(B,A), AC=difference(C,A)
const t=dot(AC,AB)/dot(AB,AB), H=add(A,scale(AB,t))
assert.ok(t>0 && t<1)
assert.ok(Math.abs(dot(difference(C,H),AB))<1e-8)
assert.equal(dist(A,B),225);assert.equal(dist(A,C),135);assert.equal(dist(B,C),180)
const baseLabels=[label(A,'A',-17,-6),label(B,'B',6,16),label(C,'C',-17,16),label([145,173],'a',0,19),label([55,105],'b',-20,0),label([158,106],'c',4,-9)]
const rightC=squareMark(C,unit(difference(A,C)),unit(difference(B,C)))
save('triangulo',[triangle(A,B,C),rightC],baseLabels)
const rightH=squareMark(H,unit(difference(C,H)),unit(difference(B,H)))
save('altura',[line(C,H,'#6D3EE8'),triangle(A,B,C),rightH],[...baseLabels,label(H,'H',5,-10)])
const B2=[54,174],C2=[246,174],A2=[150,46],M=scale(add(B2,C2),0.5)
assert.equal(dist(A2,B2),160);assert.equal(dist(A2,C2),160);assert.equal(dist(B2,C2),192);assert.equal(dist(A2,M),128)
save('isosceles',[line(A2,M,'#6D3EE8'),triangle(A2,B2,C2),squareMark(M,unit(difference(A2,M)),unit(difference(C2,M)))],[label(A2,'A',-4,-8),label(B2,'B',-17,16),label(C2,'C',5,16),label(M,'M',-7,18)])
const p=[30,177],q=[105,177],r=[30,77],p2=[175,177],q2=[250,177],r2=[175,77]
assert.equal(dist(p,q),dist(p2,q2));assert.equal(dist(p,r),dist(p2,r2));assert.equal(dist(q,r),dist(q2,r2))
save('converso',[triangle(p,q,r),triangle(p2,q2,r2),squareMark(p2,unit(difference(q2,p2)),unit(difference(r2,p2)))],[label(p,'A',-15,16),label(q,'B',5,16),label(r,'C',-16,-5),label(p2,"A′",-18,16),label(q2,"B′",5,16),label(r2,"C′",-20,-5),label([68,177],"a",0,18),label([30,128],"b",-20,0),label([68,128],"c",7,-6),label([213,177],"a",0,18),label([175,128],"b",-20,0),label([213,128],"d",7,-6)])
