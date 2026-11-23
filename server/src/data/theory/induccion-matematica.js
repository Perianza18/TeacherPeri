const pathSlug = 'induccion-matematica'
const collection = pathSlug
const summary = 'Demostrar afirmaciones para enteros sucesivos mediante un caso inicial y un paso que conecta cada caso con el siguiente.'
const content = String.raw`## Preámbulo: Una regla para cada ronda

Un juego tiene rondas numeradas sin un límite fijado de antemano. Una regla permite pasar de una ronda a la siguiente siempre que ya se haya llegado a la ronda actual. ¿Qué información falta para saber que se puede llegar a cualquier ronda permitida?

En matemáticas aparece una idea semejante: una afirmación puede depender de un entero $n$, y conviene relacionar lo que ocurre en $n$ con lo que ocurre en $n+1$. Para convertir esa relación en una prueba, tendremos que precisar qué se supone, qué se demuestra y qué valores quedan cubiertos.

## Teoría

### El principio de inducción

Sea $P(n)$ una afirmación para cada entero $n$ desde un valor inicial $n_0$. Una prueba por inducción establece primero $P(n_0)$ y después demuestra que, para cualquier entero $k\ge n_0$, la validez de $P(k)$ implica la de $P(k+1)$.

En el paso inductivo se supone temporalmente $P(k)$: esa es la **hipótesis inductiva**. No se supone $P(k+1)$, que es precisamente lo que se debe demostrar a partir de ella. El índice inicial puede ser $0$, $1$ u otro entero indicado por el problema.

Para justificar el principio usaremos el buen orden de los enteros no negativos: todo conjunto no vacío de ellos tiene un elemento mínimo.

:::theorem Principio de inducción
Sea $n_0$ un entero. Si $P(n_0)$ es verdadera y, para todo entero $k\ge n_0$, la afirmación $P(k)$ implica $P(k+1)$, entonces $P(n)$ es verdadera para todo entero $n\ge n_0$.
:::

:::proof
Supongamos que existe algún entero $n\ge n_0$ para el que $P(n)$ es falsa. Los números $n-n_0$ correspondientes son enteros no negativos y forman un conjunto no vacío. Por buen orden tienen un mínimo; sea $m$ el entero asociado a ese mínimo.

Como $P(n_0)$ es verdadera, $m\ne n_0$, así que $m-1\ge n_0$. La afirmación $P(m-1)$ es verdadera: si fuera falsa, $(m-1)-n_0$ sería un número menor en el conjunto elegido. Aplicando el paso inductivo con $k=m-1$, de $P(m-1)$ se sigue $P(m)$, en contradicción con la elección de $m$. Por tanto no existe ningún contraejemplo.
:::

El valor inicial no tiene que ser $0$ ni $1$; lo fija el problema.

:::try Si el paso inductivo comienza en $k=3$, ¿cuál es el primer caso que debe comprobarse para concluir la afirmación desde $n=3$?
Hay que comprobar $P(3)$. El paso permite después pasar de $P(3)$ a $P(4)$, de $P(4)$ a $P(5)$, y así sucesivamente.
:::

### Una suma

La hipótesis inductiva debe aparecer realmente en el cálculo. Para una suma, el caso siguiente contiene todos los términos anteriores y un término nuevo: ahí podemos sustituir la expresión conocida.

:::example
Demostrar por inducción que $1+2+\cdots+n=n(n+1)/2$ para todo entero $n\ge1$.

**Caso inicial.** Para $n=1$, el lado izquierdo es $1$ y el derecho es $1(1+1)/2=1$.

**Paso inductivo.** Sea $k\ge1$ y supongamos que $1+2+\cdots+k=k(k+1)/2$. La suma hasta $k+1$ se obtiene sumando $k+1$ a la suma hasta $k$. Al sustituir la hipótesis, es
$$\frac{k(k+1)}2+(k+1)=\frac{(k+1)(k+2)}2.$$
Esta es la fórmula pedida con $n=k+1$. El caso inicial y el paso prueban la igualdad para todo $n\ge1$.
:::

:::mistake
Comprobar unos cuantos valores y llamar inducción a esa lista. Verificar $P(1)$, $P(2)$ y $P(3)$ no demuestra que $P(k)$ implique $P(k+1)$ para un $k$ arbitrario. También se necesitan tanto el caso inicial como el paso: ninguno de los dos sustituye al otro.
:::

### Divisibilidad en el paso

Una hipótesis de divisibilidad permite nombrar un factor entero. Para el caso siguiente conviene transformar la expresión hasta que reaparezca la cantidad que sabemos que es divisible.

:::example
Demostrar por inducción que $4^n-1$ es divisible por $3$ para todo entero $n\ge0$.

**Caso inicial.** Para $n=0$, $4^0-1=0=3(0)$, así que $3$ divide a la expresión.

**Paso inductivo.** Sea $k\ge0$ y supongamos que $4^k-1=3m$ para algún entero $m$. Separamos un múltiplo de la expresión de la hipótesis:
$$4^{k+1}-1=4(4^k-1)+3.$$
Al sustituir $4^k-1=3m$, obtenemos $4^{k+1}-1=4(3m)+3=3(4m+1)$. Como $4m+1$ es entero, $3$ divide a la expresión del caso $k+1$. La inducción cubre todos los enteros $n\ge0$.
:::

:::tip
Escribir por separado lo que dice $P(k+1)$ antes de empezar el paso. Después buscar dónde se puede sustituir $P(k)$ y comprobar que las operaciones respeten el dominio de $k$.
:::

### Una desigualdad

Al trabajar con desigualdades, la hipótesis inductiva puede sustituir una expresión por una cota. Es necesario justificar cualquier multiplicación y la comparación que queda después.

:::example
Demostrar por inducción que $2^n\ge n+1$ para todo entero $n\ge0$.

Para $n=0$, $2^0=1=0+1$. Sea ahora $k\ge0$ y supongamos $2^k\ge k+1$. Al multiplicar ambos lados por $2>0$, resulta $2^{k+1}\ge2k+2$. Como $k\ge0$, se cumple $2k+2\ge k+2$; por tanto $2^{k+1}\ge(k+1)+1$, que es el caso siguiente. La inducción prueba la desigualdad.
:::

## Agregados culturales

- En 1889 Giuseppe Peano publicó un sistema de axiomas para los números naturales. La inducción forma parte de las ideas utilizadas para estudiar su estructura.
- La decimoséptima Olimpiada Internacional de Matemáticas se celebró en 1975 en Burgas, Bulgaria. Participaron $135$ estudiantes de $17$ países.
- En 2022 la misión Artemis I realizó un vuelo sin tripulación alrededor de la Luna y regresó a la Tierra. Fue una prueba de la nave Orion y del cohete SLS.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Escribir el índice inicial y la afirmación del caso siguiente. En el paso, indicar exactamente dónde se usa la hipótesis inductiva.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

La dificultad está en transformar la expresión del caso siguiente o en elegir una cota que permita completar el paso para todos los índices indicados.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problem = (code, titulo, enunciado, difficulty = 'basico') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })
const problems = [
  exercise('P41','Suma de pares',String.raw`Demostrar por inducción que $2+4+\cdots+2n=n(n+1)$ para todo entero $n\ge1$.`,['Añadir el término $2(k+1)$ a la suma hasta $k$.']),
  exercise('P42','Una potencia y cuatro',String.raw`Demostrar por inducción que $5^n-1$ es divisible por $4$ para todo entero $n\ge0$.`,[String.raw`Escribir $5^{k+1}-1$ usando $5^k-1$.`]),
  exercise('P43','Una cota exponencial',String.raw`Demostrar por inducción que $3^n\ge2n+1$ para todo entero $n\ge0$.`,['Multiplicar la hipótesis por $3$ y comparar con la cota deseada.']),
  exercise('P44','Suma de impares',String.raw`Demostrar por inducción que $1+3+\cdots+(2n-1)=n^2$ para todo entero $n\ge1$.`,[String.raw`El término que sigue a $2k-1$ es $2k+1$.`]),
  problem('P45','Suma de cuadrados',String.raw`Demostrar por inducción que $1^2+2^2+\cdots+n^2=n(n+1)(2n+1)/6$ para todo entero $n\ge1$.`),
  problem('P46','Potencias de siete',String.raw`Demostrar por inducción que $7^n-1$ es divisible por $6$ para todo entero $n\ge0$.`),
  problem('P47','Una cota para potencias de dos',String.raw`Demostrar por inducción que $2^n\ge n+2$ para todo entero $n\ge2$.`),
  problem('P48','Otra cota para potencias de dos',String.raw`Demostrar por inducción que $2^n\ge2n$ para todo entero $n\ge1$.`),
  problem('P49','Suma de potencias',String.raw`Demostrar por inducción que $1+2+4+\cdots+2^n=2^{n+1}-1$ para todo entero $n\ge0$.`),
  problem('P50','Una potencia y veinticuatro',String.raw`Demostrar por inducción que $5^{2n}-1$ es divisible por $24$ para todo entero $n\ge0$.`),
  problem('P51','Un cubo y su índice',String.raw`Demostrar por inducción que $n^3+2n$ es divisible por $3$ para todo entero $n\ge1$.`,'intermedio'),
  problem('P52','Factoriales y potencias',String.raw`Demostrar por inducción que $n!\ge2^{n-1}$ para todo entero $n\ge1$.`,'intermedio'),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-P41','TP-P42','TP-P43','TP-P44'], practice: ['TP-P45','TP-P46','TP-P47','TP-P48','TP-P49','TP-P50'], dificiles: ['TP-P51','TP-P52'] } } }
