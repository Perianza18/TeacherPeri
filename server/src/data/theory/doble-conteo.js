// «Doble conteo» in the lesson format of the theory page. Original
// TeacherPeri text. Exercises and problems live in the banco; the lesson
// only points to them. New lesson (no earlier text).

const pathSlug = 'doble-conteo'
const collection = 'doble-conteo'

const lesson = { title: 'Doble conteo', area: 'combinatorics', level: 'intermedio' }

const summary = 'Contar un mismo conjunto de parejas de dos maneras para obtener ecuaciones, demostrar identidades y garantizar que algún objeto aparece muchas veces.'

const content = String.raw`## Preámbulo: Comités de un club

En un club de $20$ estudiantes, cada estudiante participa en exactamente $3$ comités, y cada comité tiene exactamente $5$ integrantes. ¿Cuántos comités hay?

Una primera idea sería sumar «$3$ comités por estudiante» y obtener $60$ comités, pero eso cuenta cada comité varias veces: una por cada uno de sus integrantes. Otra sería dividir $20$ entre $5$, como si los comités no compartieran integrantes. Ninguna de las dos cuentas es correcta, y el problema parece no tener datos suficientes. Los tiene: la clave es dejar de contar comités o estudiantes por separado y contar las parejas que los relacionan.

## Teoría

### Contar parejas de dos maneras

Una **pareja de pertenencia** es una pareja (estudiante, comité) en la que el estudiante pertenece al comité. Se pueden organizar en una tabla con una fila por estudiante y una columna por comité, marcando la casilla de cada pareja. Por ejemplo, con cuatro estudiantes y tres comités:

| | Comité I | Comité II | Comité III | Total de la fila |
| --- | --- | --- | --- | --- |
| Ana | $\checkmark$ | $\checkmark$ | | $2$ |
| Beto | | $\checkmark$ | $\checkmark$ | $2$ |
| Caro | $\checkmark$ | | $\checkmark$ | $2$ |
| Dani | | $\checkmark$ | | $1$ |
| Total de la columna | $2$ | $3$ | $2$ | $7$ |

Las filas suman $2+2+2+1=7$ y las columnas $2+3+2=7$. La tabla muestra un caso; la proposición siguiente dice por qué las dos sumas siempre coinciden.

:::proposition Doble conteo
Sean $A$ y $B$ conjuntos finitos y $R$ un conjunto de parejas $(a,b)$ con $a$ en $A$ y $b$ en $B$. Para cada $a$, sea $r(a)$ el número de parejas de $R$ que empiezan con $a$, y para cada $b$, sea $c(b)$ el número de parejas que terminan con $b$. Entonces
$$\sum_{a\in A}r(a)=|R|=\sum_{b\in B}c(b).$$
:::

:::proof
Las parejas de $R$ se dividen en grupos sin elementos comunes según su primer elemento; el grupo de $a$ tiene $r(a)$ parejas, y por el principio aditivo el total es la suma de los $r(a)$. Si en cambio se agrupan según su segundo elemento, el grupo de $b$ tiene $c(b)$ parejas, y el total es la suma de los $c(b)$. Las dos sumas cuentan el mismo conjunto $R$.
:::

:::example
En un club de $20$ estudiantes, cada uno participa en exactamente $3$ comités y cada comité tiene exactamente $5$ integrantes. Calcular el número de comités.

Sea $c$ el número de comités y contemos las parejas de pertenencia. Por filas, cada uno de los $20$ estudiantes aporta $3$ parejas: son $60$. Por columnas, cada uno de los $c$ comités aporta $5$: son $5c$. Así, $5c=60$ y $c=12$. Ninguna de las dos cuentas del preámbulo era correcta porque cada una contaba solo un lado de la tabla.
:::

### Saludos

Si en una reunión se cuentan los saludos de mano, cada saludo es una pareja de personas. El **número de saludos** de una persona es cuántas veces saludó.

:::proposition Lema de los saludos
En una reunión, la suma de los números de saludos de todas las personas es el doble del número total de saludos. En consecuencia, la cantidad de personas que dieron un número impar de saludos es par.
:::

:::proof
Contamos las parejas (persona, saludo) en las que la persona participó en el saludo. Por personas, la cuenta es la suma de los números de saludos. Por saludos, cada saludo tiene exactamente dos participantes y aporta $2$ parejas; si hay $s$ saludos, la cuenta es $2s$. Así, la suma es $2s$, un número par. Si se quitan de esa suma los sumandos pares, lo que queda sigue siendo par, y es una suma de números impares; una suma de números impares es par solo si tiene una cantidad par de sumandos.
:::

El lema sirve sobre todo para descartar situaciones imposibles.

:::try ¿Pueden $7$ personas saludar cada una a exactamente $3$ de las otras?
No. La suma de los números de saludos sería $7\cdot3=21$, que es impar, y el lema dice que debe ser par.
:::

:::mistake
Contar un objeto una vez por cada participante sin dividir después. Si $6$ personas conocen cada una a $4$ de las otras, el producto $6\cdot4=24$ cuenta cada pareja de conocidos dos veces, una desde cada persona; hay $12$ parejas. Antes de dividir, conviene preguntar cuántas veces aparece cada objeto en la cuenta.
:::

### Identidades y promedios

El doble conteo también demuestra identidades: si las dos cuentas producen fórmulas distintas, esas fórmulas son iguales.

:::example
Demostrar que $k\binom nk=n\binom{n-1}{k-1}$ para enteros $1\le k\le n$.

Contamos las maneras de formar, entre $n$ personas, un comité de $k$ personas con un presidente que pertenece al comité. Primero el comité y después el presidente: hay $\binom nk$ comités y $k$ opciones de presidente en cada uno, en total $k\binom nk$. Primero el presidente y después el resto: hay $n$ presidentes posibles y, para cada uno, $\binom{n-1}{k-1}$ maneras de elegir a los otros $k-1$ integrantes. Las dos cuentas cuentan lo mismo.
:::

Cuando las cuentas dan una suma total, el promedio ayuda a encontrar un objeto grande. Si $T$ parejas se reparten entre $m$ columnas, alguna columna tiene al menos $T/m$ parejas: si todas tuvieran menos, la suma sería menor que $m\cdot\tfrac Tm=T$.

:::tip
Cuando un enunciado da datos «por cada uno» (cada estudiante lee tres libros, cada equipo juega cinco partidos), conviene nombrar las parejas que relacionan los dos tipos de objetos y contarlas por filas y por columnas. Si el enunciado pide «alguno tiene al menos», el promedio de las columnas suele dar la respuesta.
:::

## Agregados culturales

- El artículo de Leonhard Euler sobre los siete puentes de Königsberg, fechado en 1736 y publicado en 1741, se considera el inicio de la teoría de gráficas. Su análisis depende de cuántos puentes llegan a cada zona de la ciudad, y de ahí sale la idea del lema de los saludos.
- Paul Erdős publicó alrededor de $1\,500$ artículos con $511$ coautores distintos. En el número de Erdős, cada colaboración une a dos personas; al sumar, para cada matemático, cuántos coautores tiene, cada colaboración se cuenta dos veces, como en el lema de los saludos.
- En la Olimpiada Internacional de Matemáticas de 2024, celebrada en julio en Bath, Inglaterra, participaron $609$ estudiantes de $108$ países. Cada país puede enviar hasta seis estudiantes, así que quedaron sin ocupar a lo más $6\cdot108-609=39$ lugares; como cada equipo incompleto deja al menos un lugar vacío, al menos $108-39=69$ países enviaron equipo completo.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Antes de calcular conviene decidir cuáles son las parejas que se van a contar y escribir las dos cuentas por separado; la ecuación aparece al igualarlas.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

En estos problemas las parejas no son evidentes: a veces se cuentan tríos, o parejas de parejas, y a veces una de las dos cuentas solo da una desigualdad.

[[collection:${collection}:dificiles]]`

const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'intermedio' })
const problem = (code, titulo, enunciado, difficulty = 'intermedio') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })

const problems = [
  exercise('C49', 'Clubes de seis', String.raw`En una escuela de $30$ estudiantes, cada uno pertenece a exactamente $2$ clubes y cada club tiene exactamente $6$ integrantes. ¿Cuántos clubes hay?`, [
    String.raw`Contar las parejas (estudiante, club) por estudiantes y por clubes.`,
  ]),
  exercise('C50', 'Nueve personas', String.raw`¿Pueden $9$ personas saludar de mano cada una a exactamente $3$ de las otras? Justificar.`, [
    String.raw`Calcular la suma de los números de saludos y usar el lema de los saludos.`,
  ]),
  exercise('C51', 'Parejas de conocidos', String.raw`En un grupo de $6$ personas, cada una conoce exactamente a $4$ de las otras, y si $A$ conoce a $B$, entonces $B$ conoce a $A$. ¿Cuántas parejas de conocidos hay?`, [
    String.raw`¿Cuántas veces aparece cada pareja en el producto $6\cdot4$?`,
  ]),
  exercise('C52', 'Comités con presidente', String.raw`Explicar con un doble conteo por qué $3\binom73=7\binom62$, y comprobar la igualdad calculando ambos lados.`, [
    String.raw`Contar los comités de $3$ personas, entre $7$, que tienen un presidente dentro del comité.`,
  ]),
  problem('C53', 'Un poliedro de triángulos', String.raw`Un poliedro tiene $20$ caras y todas son triángulos. ¿Cuántas aristas tiene?`),
  problem('C54', 'Problemas resueltos', String.raw`En un examen de $8$ problemas, cada uno de los $25$ participantes resolvió exactamente $3$. Demostrar que algún problema fue resuelto por al menos $10$ participantes.`),
  problem('C55', 'Un torneo sin empates', String.raw`En un torneo, $8$ jugadores juegan todos contra todos una sola vez y no hay empates. ¿Puede cada jugador ganar exactamente $3$ partidos?`),
  problem('C56', 'Cruces de diagonales', String.raw`En un octágono convexo, ninguna terna de diagonales pasa por un mismo punto interior. ¿Cuántos puntos de cruce de diagonales hay en el interior del octágono?`),
  problem('C57', 'Divisores de los primeros números', String.raw`Para un entero positivo $k$, sea $d(k)$ el número de divisores positivos de $k$. Demostrar que $d(1)+d(2)+\cdots+d(n)=\left\lfloor\tfrac n1\right\rfloor+\left\lfloor\tfrac n2\right\rfloor+\cdots+\left\lfloor\tfrac nn\right\rfloor$, donde $\lfloor x\rfloor$ es el mayor entero menor o igual que $x$, y calcular la suma para $n=10$.`),
  problem('C58', 'Una tabla de números', String.raw`En una tabla de $6$ filas y $8$ columnas se escribieron números. Cada fila suma $12$ y todas las columnas tienen la misma suma. ¿Cuánto suma cada columna?`),
  problem('C59', 'Siete personas y siete comités', String.raw`Un grupo de $7$ personas forma $7$ comités de $3$ personas cada uno, de modo que cada pareja de personas está junta en exactamente un comité. Demostrar que cada persona está en exactamente $3$ comités y que dos comités cualesquiera tienen exactamente una persona en común.`, 'avanzado'),
  problem('C60', 'Sin triángulos de conocidos', String.raw`En un grupo de $n$ personas no hay tres que se conozcan entre sí por parejas. Demostrar que hay a lo más $\tfrac{n^2}4$ parejas de conocidos.`, 'avanzado'),
]

export default {
  pathSlug,
  lesson,
  summary,
  content,
  problems,
  collections: {
    [collection]: {
      ejercicios: ['TP-C49', 'TP-C50', 'TP-C51', 'TP-C52'],
      practice: ['TP-C53', 'TP-C54', 'TP-C55', 'TP-C56', 'TP-C57', 'TP-C58'],
      dificiles: ['TP-C59', 'TP-C60'],
    },
  },
}
