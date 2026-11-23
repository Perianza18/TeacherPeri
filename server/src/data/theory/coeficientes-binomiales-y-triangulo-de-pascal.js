// «Coeficientes binomiales y triángulo de Pascal» in the lesson format of
// the theory page. Original TeacherPeri text. Exercises and problems live in
// the banco; the lesson only points to them. New lesson (no earlier text).

const pathSlug = 'coeficientes-binomiales-y-triangulo-de-pascal'
const collection = 'binomiales'

const lesson = { title: 'Coeficientes binomiales y triángulo de Pascal', area: 'combinatorics', level: 'intermedio' }

const summary = 'Contar caminos y subconjuntos con coeficientes binomiales, construir el triángulo de Pascal con una identidad demostrada contando, y usar el teorema del binomio para calcular coeficientes y sumas.'

const content = String.raw`## Preámbulo: Caminos en una cuadrícula

![Cuadrícula de 4 cuadros de ancho y 3 de alto; un camino resaltado va de la esquina inferior izquierda P a la superior derecha Q moviéndose solo hacia la derecha y hacia arriba.](figuras/coeficientes-binomiales-y-triangulo-de-pascal-caminos.svg "Un camino de P a Q con cuatro pasos a la derecha y tres hacia arriba")

En una colonia, las calles forman una cuadrícula de $4$ cuadras de ancho y $3$ de alto. Para ir de la esquina $P$ a la esquina $Q$ por el camino más corto, cada cuadra recorrida debe ir hacia la derecha o hacia arriba. ¿Cuántos caminos distintos hay?

Dibujarlos todos es lento y es fácil repetir o saltarse alguno. Si se cuenta, para cada esquina, cuántos caminos llegan a ella, aparece una tabla de números que también surge al desarrollar $(x+y)^n$ y al contar subconjuntos. Esta lección explica por qué los tres problemas tienen la misma respuesta.

## Teoría

### Caminos y elecciones

Recordemos de la lección «Permutaciones y combinaciones» que $\binom nk=\frac{n!}{k!\,(n-k)!}$ cuenta los subconjuntos de $k$ elementos de un conjunto de $n$ elementos, para $0\le k\le n$. Estos números se llaman **coeficientes binomiales**.

:::proposition Caminos en una cuadrícula
El número de caminos más cortos de $P$ a $Q$ en una cuadrícula de $m$ cuadras de ancho y $n$ de alto es $\binom{m+n}n$.
:::

:::proof
Todo camino más corto tiene exactamente $m$ pasos hacia la derecha y $n$ hacia arriba, porque cada paso avanza una cuadra y no se puede retroceder. Escribimos el camino como una palabra de $m+n$ letras, con D para un paso a la derecha y A para uno hacia arriba. Cada camino da una palabra y cada palabra con $m$ letras D y $n$ letras A describe un camino; así, contar caminos es contar palabras. Una palabra queda determinada al elegir en qué $n$ de las $m+n$ posiciones van las letras A, y hay $\binom{m+n}n$ maneras de elegirlas.
:::

En el preámbulo, el camino de la figura es DDADAAD, y hay $\binom73=35$ caminos.

### El triángulo de Pascal

:::proposition Identidad de Pascal
Para enteros $1\le k\le n-1$,
$$\binom nk=\binom{n-1}{k-1}+\binom{n-1}k.$$
:::

:::proof
Contamos de dos maneras los subconjuntos de $k$ elementos de $\{1,2,\dots,n\}$. Por definición son $\binom nk$. Por otro lado, se dividen en dos grupos sin elementos comunes: los que contienen a $n$ y los que no. Un subconjunto del primer grupo queda determinado por sus otros $k-1$ elementos, elegidos de $\{1,\dots,n-1\}$: hay $\binom{n-1}{k-1}$. Uno del segundo grupo es una elección de $k$ elementos de $\{1,\dots,n-1\}$: hay $\binom{n-1}k$. Por el principio aditivo, el total es la suma.
:::

Si se escriben los coeficientes en filas, con la fila $n$ formada por $\binom n0,\binom n1,\dots,\binom nn$, cada número interior es la suma de los dos que tiene encima. Este es el **triángulo de Pascal**:

| $n$ | Fila $n$ |
| --- | --- |
| $0$ | $1$ |
| $1$ | $1\quad1$ |
| $2$ | $1\quad2\quad1$ |
| $3$ | $1\quad3\quad3\quad1$ |
| $4$ | $1\quad4\quad6\quad4\quad1$ |
| $5$ | $1\quad5\quad10\quad10\quad5\quad1$ |
| $6$ | $1\quad6\quad15\quad20\quad15\quad6\quad1$ |

Cada fila se lee igual de izquierda a derecha que de derecha a izquierda: $\binom nk=\binom n{n-k}$, porque elegir los $k$ elementos que entran es lo mismo que elegir los $n-k$ que quedan fuera. En la cuadrícula, la identidad de Pascal dice que los caminos que llegan a una esquina son los que llegan a la esquina de la izquierda más los que llegan a la de abajo.

:::tip
Para demostrar una identidad entre coeficientes binomiales, conviene buscar un conjunto que cada lado cuente: un lado lo cuenta de una sola vez y el otro lo cuenta por casos. Una prueba así suele ser más corta y más clara que manipular factoriales.
:::

### El teorema del binomio

:::theorem Teorema del binomio
Para cualesquiera números reales $x$, $y$ y todo entero $n\ge0$,
$$(x+y)^n=\sum_{k=0}^n\binom nk x^{n-k}y^k=\binom n0x^n+\binom n1x^{n-1}y+\cdots+\binom nny^n.$$
:::

:::proof
El producto $(x+y)^n$ tiene $n$ factores $(x+y)$. Al desarrollarlo con la propiedad distributiva, se elige de cada factor un sumando, $x$ o $y$, se multiplican las $n$ elecciones y se suman todos los resultados. Una elección en la que $y$ se toma de exactamente $k$ factores da el término $x^{n-k}y^k$. Hay tantas de esas elecciones como maneras de escoger los $k$ factores que aportan $y$, es decir, $\binom nk$. Por eso el término $x^{n-k}y^k$ aparece $\binom nk$ veces.
:::

:::example
Encontrar el coeficiente de $x^2$ en el desarrollo de $(3x-1)^4$.

Tomamos el teorema con $3x$ en lugar de $x$, $-1$ en lugar de $y$ y $n=4$. El término con $x^2$ es el de $(3x)^2(-1)^2$, que corresponde a $k=2$: vale $\binom42(3x)^2(-1)^2=6\cdot9x^2\cdot1=54x^2$. El coeficiente es $54$.
:::

:::mistake
Tomar solo el coeficiente binomial y olvidar las potencias de los números que acompañan a $x$ y a $y$. En $(3x-1)^4$, el coeficiente de $x^2$ no es $\binom42=6$: el $3$ y el $-1$ también se elevan a sus potencias. Con signos negativos, además, conviene escribir el $-1$ entre paréntesis para no perder el signo.
:::

Al poner $x=y=1$ en el teorema se obtiene $\binom n0+\binom n1+\cdots+\binom nn=2^n$, que también se ve contando: cada subconjunto de un conjunto de $n$ elementos se forma decidiendo, para cada elemento, si entra o no.

:::try ¿Cuánto vale $\binom n0-\binom n1+\binom n2-\cdots+(-1)^n\binom nn$ para $n\ge1$?
Es el teorema con $x=1$ y $y=-1$: vale $(1-1)^n=0$.
:::

## Agregados culturales

- Blaise Pascal escribió hacia 1654 su *Tratado del triángulo aritmético*, que se publicó en 1665, después de su muerte. El triángulo ya era conocido mucho antes: en China se le llama triángulo de Yang Hui, por un matemático que lo describió en un libro de 1261.
- El tablero de Galton, que Francis Galton describió en su libro de 1889 *Natural Inheritance*, deja caer bolitas entre filas de clavos; en cada clavo una bolita se va a la izquierda o a la derecha. La cantidad de recorridos que llevan a cada casilla del fondo es un coeficiente binomial, y por eso las bolitas se acumulan en forma de campana.
- En noviembre de 2026 se celebra el Concurso Nacional de la 40.ª Olimpiada Mexicana de Matemáticas. Para llegar a él, los estudiantes de cada estado pasan antes por concursos y entrenamientos estatales.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

En cada problema conviene decidir qué conjunto se está contando y si un coeficiente binomial lo cuenta directamente; las identidades se demuestran mejor contando que con factoriales.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

La dificultad está en encontrar la correspondencia adecuada: un mismo número puede contar caminos, subconjuntos o maneras de repartir, y elegir la interpretación correcta es el paso clave.

[[collection:${collection}:dificiles]]`

const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'intermedio' })
const problem = (code, titulo, enunciado, difficulty = 'intermedio') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })

const problems = [
  exercise('C37', 'Una cuadrícula alargada', String.raw`¿Cuántos caminos más cortos hay de una esquina a la opuesta en una cuadrícula de $5$ cuadras de ancho y $2$ de alto?`, [
    String.raw`Cada camino es una palabra con $5$ letras D y $2$ letras A.`,
  ]),
  exercise('C38', 'La fila siete', String.raw`Escribir la fila $7$ del triángulo de Pascal a partir de la fila $6$ y comprobar que $\binom73=35$ con la fórmula de factoriales.`, [
    String.raw`Cada número interior de la fila $7$ es la suma de los dos que tiene encima en la fila $6$.`,
  ]),
  exercise('C39', 'No olvidar las potencias', String.raw`Encontrar el coeficiente de $x^2$ en el desarrollo de $(x+2)^5$.`, [
    String.raw`¿Qué valor de $k$ da el término con $x^2$ en $\binom5k x^{5-k}2^k$?`,
    String.raw`El $2$ también se eleva a la potencia $k$.`,
  ]),
  exercise('C40', 'Todos los subconjuntos', String.raw`Usar el teorema del binomio para calcular $\binom60+\binom61+\cdots+\binom66$ y explicar qué cuenta esa suma.`, [
    String.raw`Poner $x=y=1$ en el teorema.`,
  ]),
  problem('C41', 'Pasar por una esquina', String.raw`En una cuadrícula de $6$ cuadras de ancho y $4$ de alto, ¿cuántos caminos más cortos van de la esquina inferior izquierda a la superior derecha pasando por la esquina que está $2$ cuadras a la derecha y $2$ hacia arriba del inicio? ¿Cuántos no pasan por ella?`),
  problem('C42', 'El palo de hockey', String.raw`Demostrar que para enteros $0\le k\le n$ se cumple $\binom kk+\binom{k+1}k+\cdots+\binom nk=\binom{n+1}{k+1}$.`),
  problem('C43', 'Comités con presidente', String.raw`Demostrar que $1\cdot\binom n1+2\binom n2+\cdots+n\binom nn=n\,2^{n-1}$ para todo entero $n\ge1$.`),
  problem('C44', 'El número central', String.raw`Demostrar que $\binom{2n}n$ es par para todo entero $n\ge1$.`),
  problem('C45', 'Subconjuntos pares', String.raw`¿Cuántos subconjuntos del conjunto $\{1,2,\dots,10\}$ tienen una cantidad par de elementos? Contar también el conjunto vacío.`),
  problem('C46', 'Un coeficiente con dos binomios', String.raw`Encontrar el coeficiente de $x^4$ en el desarrollo de $(1+x)^3(1+x)^5$ de dos maneras: multiplicando los desarrollos de los dos factores, y desarrollando $(1+x)^8$. Deducir una igualdad entre coeficientes binomiales.`),
  problem('C47', 'Suma de cuadrados de una fila', String.raw`Demostrar que $\binom n0^2+\binom n1^2+\cdots+\binom nn^2=\binom{2n}n$ para todo entero $n\ge0$.`, 'avanzado'),
  problem('C48', 'Repartir diez dulces', String.raw`¿De cuántas maneras se pueden repartir $10$ dulces iguales entre tres niños, si alguno puede quedarse sin dulces? Es decir, ¿cuántas soluciones en enteros no negativos tiene $x+y+z=10$?`, 'avanzado'),
]

export default {
  pathSlug,
  lesson,
  summary,
  content,
  problems,
  collections: {
    [collection]: {
      ejercicios: ['TP-C37', 'TP-C38', 'TP-C39', 'TP-C40'],
      practice: ['TP-C41', 'TP-C42', 'TP-C43', 'TP-C44', 'TP-C45', 'TP-C46'],
      dificiles: ['TP-C47', 'TP-C48'],
    },
  },
}
