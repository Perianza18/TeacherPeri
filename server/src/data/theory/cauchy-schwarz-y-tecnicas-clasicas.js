// «Cauchy-Schwarz y técnicas clásicas» in the lesson format of the theory
// page. Original TeacherPeri text. Exercises and problems live in the banco;
// the lesson only points to them. New lesson (no earlier text).

const pathSlug = 'cauchy-schwarz-y-tecnicas-clasicas'
const collection = 'cauchy-schwarz'

const lesson = { title: 'Cauchy-Schwarz y técnicas clásicas', area: 'algebra', level: 'intermedio' }

const summary = 'Acotar sumas de productos con la desigualdad de Cauchy-Schwarz, elegir bien los números que se emparejan y demostrar desigualdades escribiendo una diferencia como suma de cuadrados.'

const content = String.raw`## Preámbulo: El mayor valor de una suma

Los números reales $x$ y $y$ cumplen $x^2+y^2=1$. ¿Qué tan grande puede ser $3x+4y$? Con $x=y=\tfrac{\sqrt2}2$ se obtiene unos $4.95$; con $x=0.6$ y $y=0.8$ se obtiene exactamente $5$; otros valores parecen dar menos.

La desigualdad entre medias no ayuda directamente, porque $3x+4y$ no es una suma con producto fijo. Lo que se necesita es comparar una suma de productos, como $3\cdot x+4\cdot y$, con las sumas de cuadrados de cada lista de números. Esa comparación es la desigualdad de Cauchy-Schwarz.

## Teoría

### Dos parejas de números

:::theorem Cauchy-Schwarz para dos términos
Para números reales $a$, $b$, $x$ y $y$,
$$(ax+by)^2\le(a^2+b^2)(x^2+y^2),$$
con igualdad si y solo si $ay=bx$.
:::

:::proof
Al desarrollar el lado derecho se obtiene $a^2x^2+a^2y^2+b^2x^2+b^2y^2$, y el izquierdo es $a^2x^2+2abxy+b^2y^2$. Al restar el izquierdo del derecho quedan $a^2y^2-2abxy+b^2x^2=(ay-bx)^2$, que nunca es negativo. Por tanto el derecho es mayor o igual, con igualdad exactamente cuando $ay-bx=0$.
:::

:::example
Encontrar el mayor valor de $3x+4y$ si $x^2+y^2=1$.

Con $a=3$ y $b=4$, el teorema da $(3x+4y)^2\le(9+16)\cdot1=25$, así que $3x+4y\le5$. Para ver que $5$ se alcanza, la igualdad pide $3y=4x$; junto con $x^2+y^2=1$ y $x,y>0$ eso da $x=\tfrac35$ y $y=\tfrac45$, y entonces $3x+4y=\tfrac{9+16}5=5$.
:::

### La forma general

:::theorem Desigualdad de Cauchy-Schwarz
Para números reales $a_1,\dots,a_n$ y $b_1,\dots,b_n$,
$$(a_1b_1+a_2b_2+\cdots+a_nb_n)^2\le(a_1^2+\cdots+a_n^2)(b_1^2+\cdots+b_n^2).$$
La igualdad ocurre si los $a_i$ son todos cero o si existe un número $t$ con $b_i=ta_i$ para todo $i$.
:::

:::proof
Escribimos $A=a_1^2+\cdots+a_n^2$, $B=b_1^2+\cdots+b_n^2$ y $C=a_1b_1+\cdots+a_nb_n$. Si $A=0$, todos los $a_i$ son cero y los dos lados valen $0$. Supongamos $A>0$.

Para cualquier número real $s$, la suma $(a_1s-b_1)^2+\cdots+(a_ns-b_n)^2$ no es negativa. Al desarrollar cada cuadrado y agrupar, esa suma es $As^2-2Cs+B$. Tomamos $s=\tfrac CA$: queda $\tfrac{C^2}A-\tfrac{2C^2}A+B=B-\tfrac{C^2}A\ge0$. Al multiplicar por $A>0$, se obtiene $C^2\le AB$.

Si $C^2=AB$, la suma de cuadrados vale $0$ con $s=\tfrac CA$, así que cada término es cero y $b_i=sa_i$ para todo $i$. Recíprocamente, si $b_i=ta_i$ para todo $i$, ambos lados valen $t^2A^2$.
:::

Con $b_1=\cdots=b_n=1$ resulta $(a_1+\cdots+a_n)^2\le n(a_1^2+\cdots+a_n^2)$: es la desigualdad entre la media cuadrática y la aritmética para $n$ números.

:::try ¿Qué da Cauchy-Schwarz con $b_i=1$ para tres números $a$, $b$ y $c$?
Da $(a+b+c)^2\le3(a^2+b^2+c^2)$, con igualdad si $a=b=c$.
:::

### Elegir las parejas

La desigualdad sirve en cualquier problema donde aparezca un producto de dos sumas; el trabajo está en escribir cada sumando como un cuadrado.

:::example
Demostrar que $(a+b+c)\left(\dfrac1a+\dfrac1b+\dfrac1c\right)\ge9$ para números reales positivos $a$, $b$ y $c$.

Las dos sumas se ven como sumas de cuadrados si se escribe $a=(\sqrt a)^2$ y $\tfrac1a=\left(\tfrac1{\sqrt a}\right)^2$, y lo mismo con $b$ y $c$. Al emparejar $\sqrt a$ con $\tfrac1{\sqrt a}$, cada producto vale $1$, y Cauchy-Schwarz da
$$(a+b+c)\left(\tfrac1a+\tfrac1b+\tfrac1c\right)\ge\left(\sqrt a\cdot\tfrac1{\sqrt a}+\sqrt b\cdot\tfrac1{\sqrt b}+\sqrt c\cdot\tfrac1{\sqrt c}\right)^2=9.$$
:::

:::mistake
Emparejar los números sin raíces y escribir $(a+b+c)\left(\tfrac1a+\tfrac1b+\tfrac1c\right)\ge\left(a\cdot\tfrac1a+b\cdot\tfrac1b+c\cdot\tfrac1c\right)^2$. Eso no es Cauchy-Schwarz: la desigualdad compara $(\sum a_ib_i)^2$ con $\left(\sum a_i^2\right)\left(\sum b_i^2\right)$, y aquí $a$ no es el cuadrado de $a$. Hay que identificar cada sumando como un cuadrado antes de emparejar.
:::

La desigualdad útil de la lección anterior es un caso de Cauchy-Schwarz: con $a_i=\tfrac{u_i}{\sqrt{x_i}}$ y $b_i=\sqrt{x_i}$, el teorema dice $\left(\sum u_i\right)^2\le\left(\sum\tfrac{u_i^2}{x_i}\right)\left(\sum x_i\right)$.

### Sumas de cuadrados

Otra técnica clásica no usa ninguna desigualdad nueva: se escribe la diferencia entre los dos lados como una suma de cuadrados, que nunca es negativa.

:::example
Demostrar que $a^2+b^2+c^2\ge ab+bc+ca$ para cualesquiera números reales $a$, $b$ y $c$, y decir cuándo hay igualdad.

La diferencia de los dos lados es $a^2+b^2+c^2-ab-bc-ca$. Al multiplicarla por $2$ y repartir cada cuadrado en dos mitades,
$$2(a^2+b^2+c^2-ab-bc-ca)=(a^2-2ab+b^2)+(b^2-2bc+c^2)+(c^2-2ca+a^2)=(a-b)^2+(b-c)^2+(c-a)^2.$$
La suma de cuadrados no es negativa, así que la diferencia tampoco. La igualdad pide que los tres cuadrados valgan cero, es decir, $a=b=c$.
:::

### Ordenar antes de multiplicar

Una última técnica compara dos maneras de emparejar números: emparejar el mayor con el mayor da más que emparejarlo con el menor.

:::proposition Reordenamiento de dos términos
Si $a\ge b$ y $x\ge y$, entonces $ax+by\ge ay+bx$.
:::

:::proof
La diferencia entre los dos lados es $ax+by-ay-bx=a(x-y)-b(x-y)=(a-b)(x-y)$. Los dos factores son mayores o iguales que cero, así que su producto también lo es.
:::

Por ejemplo, para números positivos $a\ge b$ se tiene $a^2\ge b^2$; con $x=a^2$ y $y=b^2$ resulta $a^3+b^3\ge ab^2+ba^2$. Si $b>a$, la proposición con $b$ en el papel de $a$, y $b^2\ge a^2$, da $b^3+a^3\ge ba^2+ab^2$, que es la misma desigualdad.

:::tip
Ante una desigualdad nueva conviene preguntar primero cuándo hay igualdad. Si es cuando todas las variables son iguales, las diferencias $(a-b)^2$ suelen aparecer en una suma de cuadrados; si es cuando las variables son proporcionales a ciertos números, Cauchy-Schwarz con esos números suele ser el camino.
:::

## Agregados culturales

- Augustin-Louis Cauchy publicó la desigualdad para sumas en 1821. Viktor Bunyakovsky la extendió a integrales en 1859 y Hermann Schwarz dio una versión general en la década de 1880; por eso en algunos países se le llama desigualdad de Cauchy-Bunyakovsky-Schwarz.
- En 1929, Howard Percy Robertson dio una demostración general del principio de incertidumbre de la mecánica cuántica, que Werner Heisenberg había propuesto en 1927. El paso central es una desigualdad de Cauchy-Schwarz, y así se sigue presentando en los libros de física.
- En junio de 2017 se celebró en Oaxtepec, Morelos, la primera Olimpiada Mexicana de Matemáticas para Educación Básica, para estudiantes de primaria y secundaria. En 2026 se convocó su décimo concurso nacional.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

En cada problema conviene encontrar primero el caso de igualdad; indica qué números emparejar en Cauchy-Schwarz o qué cuadrados buscar.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Aquí hace falta encadenar dos desigualdades, o transformar la expresión antes de que alguna técnica de la lección se pueda aplicar.

[[collection:${collection}:dificiles]]`

const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'intermedio' })
const problem = (code, titulo, enunciado, difficulty = 'intermedio') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })

const problems = [
  exercise('A61', 'Un máximo en un círculo', String.raw`Los números reales $x$ y $y$ cumplen $x^2+y^2=13$. Encontrar el mayor valor de $2x+3y$ y los valores de $x$ y $y$ que lo alcanzan.`, [
    String.raw`Usar Cauchy-Schwarz con las parejas $(2,3)$ y $(x,y)$.`,
  ]),
  exercise('A62', 'Media cuadrática', String.raw`Demostrar que $(a+b+c)^2\le3(a^2+b^2+c^2)$ para cualesquiera números reales $a$, $b$ y $c$.`, [
    String.raw`Emparejar $(a,b,c)$ con $(1,1,1)$.`,
  ]),
  exercise('A63', 'Raíces para emparejar', String.raw`Demostrar con Cauchy-Schwarz que $(a+b)\left(\dfrac1a+\dfrac1b\right)\ge4$ para números reales positivos $a$ y $b$.`, [
    String.raw`Escribir $a=(\sqrt a)^2$ y $\tfrac1a=\left(\tfrac1{\sqrt a}\right)^2$ antes de emparejar.`,
  ]),
  exercise('A64', 'Un mínimo con una restricción lineal', String.raw`Los números reales $x$, $y$ y $z$ cumplen $x+2y+3z=14$. Encontrar el menor valor de $x^2+y^2+z^2$.`, [
    String.raw`Emparejar $(x,y,z)$ con $(1,2,3)$.`,
    String.raw`La igualdad ocurre cuando $(x,y,z)$ es proporcional a $(1,2,3)$.`,
  ]),
  problem('A65', 'Suma de raíces', String.raw`Los números positivos $a$, $b$ y $c$ suman $1$. Demostrar que $\sqrt a+\sqrt b+\sqrt c\le\sqrt3$.`),
  problem('A66', 'Cuartas potencias', String.raw`Demostrar que $(x+y)^4\le8(x^4+y^4)$ para cualesquiera números reales $x$ y $y$.`),
  problem('A67', 'Dos ecuaciones que fijan todo', String.raw`Los números reales $x$, $y$ y $z$ cumplen $x+y+z=6$ y $x^2+y^2+z^2=12$. Demostrar que $x=y=z=2$.`),
  problem('A68', 'Un máximo en una esfera', String.raw`Los números reales $x$, $y$ y $z$ cumplen $x^2+y^2+z^2=1$. Encontrar el mayor valor de $x+2y+2z$.`),
  problem('A69', 'Fracciones cíclicas', String.raw`Demostrar que $\left(\dfrac ab+\dfrac bc+\dfrac ca\right)\left(\dfrac ba+\dfrac cb+\dfrac ac\right)\ge9$ para números reales positivos $a$, $b$ y $c$.`),
  problem('A70', 'Una suma de cuadrados', String.raw`Demostrar que $a^2+b^2+1\ge ab+a+b$ para cualesquiera números reales $a$ y $b$, y decir cuándo hay igualdad.`),
  problem('A71', 'Producto igual a uno', String.raw`Los números reales positivos $a$, $b$ y $c$ cumplen $abc=1$. Demostrar que $a^2+b^2+c^2\ge a+b+c$.`, 'avanzado'),
  problem('A72', 'Una suma que no pasa de uno', String.raw`Demostrar que $\dfrac a{2a+b}+\dfrac b{2b+c}+\dfrac c{2c+a}\le1$ para números reales positivos $a$, $b$ y $c$.`, 'avanzado'),
]

export default {
  pathSlug,
  lesson,
  summary,
  content,
  problems,
  collections: {
    [collection]: {
      ejercicios: ['TP-A61', 'TP-A62', 'TP-A63', 'TP-A64'],
      practice: ['TP-A65', 'TP-A66', 'TP-A67', 'TP-A68', 'TP-A69', 'TP-A70'],
      dificiles: ['TP-A71', 'TP-A72'],
    },
  },
}
