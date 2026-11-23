// «Homogeneización y sustituciones» in the lesson format of the theory page.
// Original TeacherPeri text. Exercises and problems live in the banco; the
// lesson only points to them. New lesson (no earlier text).

const pathSlug = 'homogeneizacion-y-sustituciones'
const collection = 'homogeneizacion'

const lesson = { title: 'Homogeneización y sustituciones', area: 'algebra', level: 'intermedio' }

const summary = 'Usar la condición de un problema para igualar los grados de una desigualdad, normalizar las variables cuando la desigualdad es homogénea, y cambiar de variables para quitar condiciones incómodas.'

const content = String.raw`## Preámbulo: Una condición que sobra o que falta

Los números positivos $a$, $b$ y $c$ suman $1$, y se quiere demostrar que $ab+bc+ca\le\tfrac13$. Las técnicas de las lecciones anteriores comparan expresiones como $a^2+b^2+c^2$ con $ab+bc+ca$, pero aquí un lado tiene productos de dos letras y el otro es un número. Las cuentas no encajan.

La condición $a+b+c=1$ es la que permite que encajen: el número $\tfrac13$ se puede escribir como $\tfrac{(a+b+c)^2}3$, que también está hecho de productos de dos letras. Esta lección explica cuándo se puede hacer ese cambio, cuándo se puede hacer el contrario, y qué otros cambios de variables simplifican un problema.

## Teoría

### Expresiones homogéneas

Una expresión $f(a,b,c)$ es **homogénea de grado** $d$ si al multiplicar todas las variables por un mismo número positivo $t$ la expresión queda multiplicada por $t^d$: $f(ta,tb,tc)=t^df(a,b,c)$. Por ejemplo, $ab+bc+ca$ y $(a+b+c)^2$ son homogéneas de grado $2$, y $a^3+abc$ lo es de grado $3$; en cambio, $a^2+b$ no es homogénea.

:::proposition Normalizar
Sean $f$ y $g$ homogéneas del mismo grado $d$. Si $f(a,b,c)\ge g(a,b,c)$ para todos los positivos con $a+b+c=1$, entonces $f(a,b,c)\ge g(a,b,c)$ para todos los positivos.
:::

:::proof
Sean $a$, $b$ y $c$ positivos cualesquiera y $t=\tfrac1{a+b+c}$, que es positivo. Los números $ta$, $tb$ y $tc$ son positivos y suman $1$, así que por hipótesis $f(ta,tb,tc)\ge g(ta,tb,tc)$. Por la homogeneidad, esto es $t^df(a,b,c)\ge t^dg(a,b,c)$; al dividir entre $t^d>0$ se obtiene la desigualdad.
:::

La suma $1$ no tiene nada especial. Si en la prueba se toma $t=\tfrac1{\sqrt[3]{abc}}$, los números $ta$, $tb$ y $tc$ tienen producto $1$, así que también se puede suponer $abc=1$; con $t=\tfrac1a$ se puede suponer $a=1$. En general sirve cualquier igualdad que se alcance multiplicando las tres variables por un mismo número positivo.

:::mistake
Normalizar una desigualdad que no es homogénea. La desigualdad $a^2+b^2\ge a+b$ se cumple si $a=b=1$, pero con $a=b=\tfrac12$ el lado izquierdo es $\tfrac12$ y el derecho es $1$. Como los dos lados tienen grados distintos, multiplicar las variables por un número cambia el lado izquierdo más que el derecho, y suponer $a+b=2$ no está justificado.
:::

### Homogeneizar con la condición

El camino contrario también es útil: si el problema da una condición, se puede usar para que todos los términos tengan el mismo grado.

:::example
Los números positivos $a$, $b$ y $c$ suman $1$. Demostrar que $ab+bc+ca\le\tfrac13$.

Como $a+b+c=1$, se tiene $\tfrac13=\tfrac{(a+b+c)^2}3$, y la desigualdad equivale a $3(ab+bc+ca)\le(a+b+c)^2$, que es homogénea de grado $2$. Al desarrollar el lado derecho y restar $2(ab+bc+ca)$ de ambos lados, queda $ab+bc+ca\le a^2+b^2+c^2$, que se demostró en la lección «Cauchy-Schwarz y técnicas clásicas» como suma de cuadrados. La igualdad ocurre con $a=b=c=\tfrac13$.
:::

:::tip
Antes de elegir una técnica, conviene anotar el grado de cada término. Si los grados no coinciden, la condición del problema casi siempre es la herramienta para igualarlos; si ya coinciden, se puede elegir la normalización que haga las cuentas más cortas.
:::

### Sustituciones

Una sustitución cambia las variables por otras en las que la condición del problema desaparece o se vuelve más sencilla.

Para los lados de un triángulo, la condición es la desigualdad del triángulo, que es incómoda de manejar. La lección «Bisectrices, incentro y excentros» da una salida: los segmentos tangentes desde cada vértice a la circunferencia inscrita miden $x$, $y$ y $z$, números positivos, y los lados son $a=y+z$, $b=z+x$ y $c=x+y$. Recíprocamente, para cualesquiera $x,y,z>0$ esos tres números cumplen la desigualdad del triángulo, porque $(y+z)+(z+x)=c+2z>c$, $(z+x)+(x+y)=a+2x>a$ y $(x+y)+(y+z)=b+2y>b$.

:::example
Demostrar que si $a$, $b$ y $c$ son los lados de un triángulo, entonces $(a+b-c)(b+c-a)(c+a-b)\le abc$.

Con la sustitución anterior, $a+b-c=2z$, $b+c-a=2x$ y $c+a-b=2y$, así que la desigualdad se vuelve $8xyz\le(y+z)(z+x)(x+y)$ para $x,y,z>0$, sin ninguna condición adicional. Esa es la desigualdad del segundo ejemplo de la lección «Desigualdades y medias fundamentales»: cada factor es al menos el doble de la raíz del producto de sus sumandos. La igualdad ocurre si $x=y=z$, es decir, en el triángulo equilátero.
:::

Para tres números positivos con $abc=1$, otra sustitución quita la condición: se pueden escribir $a=\tfrac xy$, $b=\tfrac yz$ y $c=\tfrac zx$ con $x,y,z>0$. Con $x=1$, $y=\tfrac1a$ y $z=\tfrac1{ab}$ se comprueba que $\tfrac xy=a$, $\tfrac yz=b$ y $\tfrac zx=\tfrac1{ab}=c$, esta última porque $abc=1$.

:::try Si $abc=1$, ¿en qué se convierte $\dfrac1{1+a+ab}$ con la sustitución $a=\tfrac xy$, $b=\tfrac yz$?
Como $ab=\tfrac xz$, la expresión es $\dfrac1{1+\frac xy+\frac xz}$. Al multiplicar arriba y abajo por $yz$, queda $\dfrac{yz}{yz+xz+xy}$.
:::

## Agregados culturales

- En su *Teoría analítica del calor*, de 1822, Joseph Fourier explicó que en una ecuación de la física solo se pueden sumar términos con las mismas unidades: longitudes con longitudes, tiempos con tiempos. Es la versión física de la homogeneidad, y sigue siendo la primera prueba que se hace a una fórmula nueva.
- La Olimpiada Internacional de 1983 se celebró en julio en París, con estudiantes de $32$ países. Su último problema era una desigualdad con los lados de un triángulo, y una de sus soluciones más conocidas escribe cada lado como suma de dos números positivos, como en esta lección.
- En 1934, G. H. Hardy, J. E. Littlewood y George Pólya publicaron *Inequalities*, el primer libro dedicado por completo a las desigualdades. Entre sus problemas aparece una desigualdad homogénea de tres variables que les comunicó Issai Schur; hoy se llama desigualdad de Schur y es una herramienta frecuente en desigualdades simétricas de olimpiada.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

En cada problema conviene revisar primero los grados de los dos lados; según el caso, la condición se usa para igualarlos o se elige una normalización.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Aquí la sustitución adecuada no es evidente, o hace falta combinar la homogeneización con una desigualdad de las lecciones anteriores.

[[collection:${collection}:dificiles]]`

const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'intermedio' })
const problem = (code, titulo, enunciado, difficulty = 'intermedio') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })

const problems = [
  exercise('A73', 'Cuadrados con suma uno', String.raw`Los números positivos $a$, $b$ y $c$ suman $1$. Demostrar que $a^2+b^2+c^2\ge\tfrac13$.`, [
    String.raw`Escribir $\tfrac13$ como $\tfrac{(a+b+c)^2}3$.`,
  ]),
  exercise('A74', '¿Se puede normalizar?', String.raw`Decidir si $a^2+b^2\ge a+b$ se cumple para todos los números reales positivos $a$ y $b$. Justificar.`, [
    String.raw`¿Son homogéneos los dos lados? Probar con números menores que $1$.`,
  ]),
  exercise('A75', 'Lados de un triángulo', String.raw`Demostrar que si $a$, $b$ y $c$ son los lados de un triángulo, entonces $a^2+b^2+c^2<2(ab+bc+ca)$.`, [
    String.raw`Usar la sustitución $a=y+z$, $b=z+x$, $c=x+y$ y desarrollar los dos lados.`,
  ]),
  exercise('A76', 'Producto uno', String.raw`Los números positivos $a$, $b$ y $c$ cumplen $abc=1$. Encontrar números positivos $x$, $y$ y $z$ con $a=\tfrac xy$, $b=\tfrac yz$ y $c=\tfrac zx$ cuando $a=2$, $b=3$ y $c=\tfrac16$.`, [
    String.raw`Tomar $x=1$ y despejar $y$ y $z$ de las dos primeras igualdades.`,
  ]),
  problem('A77', 'Suma tres', String.raw`Los números positivos $a$, $b$ y $c$ suman $3$. Demostrar que $ab+bc+ca\le3$.`),
  problem('A78', 'Cubos con suma uno', String.raw`Los números positivos $x$ y $y$ suman $1$. Demostrar que $x^3+y^3\ge\tfrac14$.`),
  problem('A79', 'Tres sumas con producto uno', String.raw`Los números positivos $a$, $b$ y $c$ cumplen $abc=1$. Demostrar que $(a+b)(b+c)(c+a)\ge8$.`),
  problem('A80', 'Fracciones con lados', String.raw`Demostrar que si $a$, $b$ y $c$ son los lados de un triángulo, entonces $\dfrac a{b+c-a}+\dfrac b{c+a-b}+\dfrac c{a+b-c}\ge3$.`),
  problem('A81', 'Un producto de tres factores', String.raw`Los números positivos $a$, $b$ y $c$ suman $1$. Demostrar que $\left(1+\dfrac1a\right)\left(1+\dfrac1b\right)\left(1+\dfrac1c\right)\ge64$.`),
  problem('A82', 'Una suma que siempre vale uno', String.raw`Los números positivos $a$, $b$ y $c$ cumplen $abc=1$. Demostrar que $\dfrac1{1+a+ab}+\dfrac1{1+b+bc}+\dfrac1{1+c+ca}=1$.`),
  problem('A83', 'La desigualdad de Schur', String.raw`Demostrar que $a(a-b)(a-c)+b(b-a)(b-c)+c(c-a)(c-b)\ge0$ para cualesquiera números reales no negativos $a$, $b$ y $c$.`, 'avanzado'),
  problem('A84', 'Cocientes y sumas', String.raw`Los números positivos $a$, $b$ y $c$ cumplen $abc=1$. Demostrar que $\dfrac ab+\dfrac bc+\dfrac ca\ge a+b+c$.`, 'avanzado'),
]

export default {
  pathSlug,
  lesson,
  summary,
  content,
  problems,
  collections: {
    [collection]: {
      ejercicios: ['TP-A73', 'TP-A74', 'TP-A75', 'TP-A76'],
      practice: ['TP-A77', 'TP-A78', 'TP-A79', 'TP-A80', 'TP-A81', 'TP-A82'],
      dificiles: ['TP-A83', 'TP-A84'],
    },
  },
}
