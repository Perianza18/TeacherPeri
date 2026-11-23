// «Inclusión-exclusión» in the lesson format of the theory page. Original
// TeacherPeri text. Exercises and problems live in the banco; the lesson
// only points to them. New lesson (no earlier text).

const pathSlug = 'inclusion-exclusion'
const collection = 'inclusion-exclusion'

const lesson = { title: 'Inclusión-exclusión', area: 'combinatorics', level: 'intermedio' }

const summary = 'Contar los elementos de una unión de conjuntos que se traslapan sumando y restando intersecciones, y contar por complemento los objetos que no cumplen ninguna condición.'

const content = String.raw`## Preámbulo: Cien números y tres divisores

¿Cuántos números del $1$ al $100$ son divisibles entre $2$, entre $3$ o entre $5$? Hay $50$ múltiplos de $2$, $33$ de $3$ y $20$ de $5$. Su suma es $103$, más que los $100$ números que hay: la suma no puede ser la respuesta.

El problema es que un número como $6$ es múltiplo de $2$ y de $3$, y se contó dos veces; el $30$ se contó tres. Restar lo que se contó de más parece sencillo, pero al restar también se puede quitar de más. La lección «Principio aditivo y multiplicativo» resolvió el caso de dos conjuntos; aquí lo extendemos a tres y a cualquier cantidad.

## Teoría

### Tres conjuntos

Para un conjunto finito $A$ escribimos $|A|$ para su número de elementos y $A\cap B$ para los elementos comunes a $A$ y a $B$. Recordemos que $|A\cup B|=|A|+|B|-|A\cap B|$.

![Tres circunferencias que se traslapan, llamadas A, B y C; la región común a las tres está sombreada.](figuras/inclusion-exclusion-venn.svg "La región sombreada está en los tres conjuntos")

:::theorem Inclusión-exclusión para tres conjuntos
Para conjuntos finitos $A$, $B$ y $C$,
$$|A\cup B\cup C|=|A|+|B|+|C|-|A\cap B|-|B\cap C|-|C\cap A|+|A\cap B\cap C|.$$
:::

:::proof
Basta ver que cada elemento de $A\cup B\cup C$ se cuenta exactamente una vez en el lado derecho, y que los demás no se cuentan. Un elemento que no está en ninguno de los tres conjuntos no aparece en ningún término. Para los demás, sea $j$ el número de conjuntos, entre $A$, $B$ y $C$, a los que pertenece.

Si $j=1$, aparece en uno de los tres primeros términos y en ninguna intersección: se cuenta $1$ vez. Si $j=2$, aparece en dos de los primeros términos y en una intersección de dos conjuntos, que se resta: se cuenta $2-1=1$ vez. Si $j=3$, como los de la región sombreada, aparece en los tres primeros términos, en las tres intersecciones de dos y en la intersección de tres: se cuenta $3-3+1=1$ vez.
:::

:::example
¿Cuántos números del $1$ al $100$ son divisibles entre $2$, entre $3$ o entre $5$?

Sean $A$, $B$ y $C$ los múltiplos de $2$, $3$ y $5$ entre $1$ y $100$. Un número es múltiplo de $2$ y de $3$ si y solo si es múltiplo de $6$, porque $2$ y $3$ no tienen factores primos en común. Por esa misma condición sobre los primos, ser múltiplo de $2$ y de $5$ equivale a ser múltiplo de $10$, ser múltiplo de $3$ y de $5$ equivale a ser múltiplo de $15$, y ser múltiplo de los tres equivale a ser múltiplo de $30$. Al contar múltiplos hasta $100$: $|A|=50$, $|B|=33$, $|C|=20$, $|A\cap B|=16$, $|C\cap A|=10$, $|B\cap C|=6$ y $|A\cap B\cap C|=3$. El teorema da $50+33+20-16-10-6+3=74$.
:::

:::mistake
Tomar la intersección de «múltiplo de $a$» y «múltiplo de $b$» como los múltiplos de $ab$. Entre $1$ y $120$, los múltiplos de $4$ y de $6$ a la vez son los múltiplos de $12$, el mínimo común múltiplo, y no los de $24$: el $12$ cumple ambas condiciones. Solo cuando $a$ y $b$ son primos relativos el mínimo común múltiplo es $ab$.
:::

### Cualquier cantidad de conjuntos

:::theorem Inclusión-exclusión
Para conjuntos finitos $A_1,\dots,A_n$, el número de elementos de su unión es
$$\sum_i|A_i|-\sum_{i<j}|A_i\cap A_j|+\sum_{i<j<k}|A_i\cap A_j\cap A_k|-\cdots+(-1)^{n+1}|A_1\cap\cdots\cap A_n|.$$
:::

:::proof
Como en el caso de tres conjuntos, un elemento que no está en la unión no aparece en ningún término. Tomemos un elemento que pertenece exactamente a $j\ge1$ de los conjuntos. Aparece en las intersecciones de $i$ conjuntos que se forman eligiendo $i$ de esos $j$, y hay $\binom ji$ de ellas; en las demás no aparece. Por tanto se cuenta
$$\binom j1-\binom j2+\binom j3-\cdots+(-1)^{j+1}\binom jj$$
veces. Por el teorema del binomio (lección «Coeficientes binomiales y triángulo de Pascal»), $0=(1-1)^j=\binom j0-\binom j1+\binom j2-\cdots+(-1)^j\binom jj$. Al despejar, la suma anterior vale $\binom j0=1$.
:::

### Contar por complemento

Muchas veces interesa lo contrario: los objetos que no cumplen ninguna de las condiciones. Si todos los conjuntos están dentro de un conjunto $U$, esos objetos son $|U|$ menos los de la unión.

:::try ¿Cuántos números del $1$ al $30$ no son divisibles ni entre $2$ ni entre $3$?
Hay $15$ múltiplos de $2$, $10$ de $3$ y $5$ de $6$. La unión tiene $15+10-5=20$ elementos, así que quedan $30-20=10$.
:::

:::example
¿De cuántas maneras se pueden repartir cuatro cartas con nombre entre sus cuatro dueños de modo que nadie reciba la suya?

Sea $U$ el conjunto de los $4!=24$ repartos y $A_i$ los repartos en los que la persona $i$ recibe su carta. Si $i$ personas fijas reciben su carta, las otras $4-i$ cartas se reparten de $(4-i)!$ maneras, y hay $\binom4i$ maneras de elegir a esas personas. Los repartos en la unión son $\binom41 3!-\binom42 2!+\binom43 1!-\binom44 0!=24-12+4-1=15$. Por complemento, nadie recibe su carta en $24-15=9$ repartos.
:::

:::tip
Cuando «al menos una condición» es difícil de contar directamente, conviene definir un conjunto por condición y revisar que sus intersecciones sean fáciles de contar. Si lo que se pide es «ninguna condición», se calcula la unión y se resta del total.
:::

## Agregados culturales

- En 1708, Pierre Rémond de Montmort publicó un libro sobre juegos de azar que incluía el «problema del trece»: se voltean las cartas de un mazo una por una mientras se cuenta del $1$ al $13$, y se pregunta qué tan probable es que ninguna carta coincida con el número dicho. Es el problema de los repartos sin coincidencias del último ejemplo.
- En 1901, Karl Landsteiner descubrió que la sangre humana se divide en grupos según dos sustancias, A y B, que pueden estar en los glóbulos rojos. Al año siguiente, estudiantes suyos encontraron el grupo AB, que tiene las dos; el grupo O no tiene ninguna. Landsteiner recibió el Premio Nobel de Fisiología o Medicina en 1930.
- La Olimpiada Internacional de Matemáticas de 2025 se celebró en julio en la Sunshine Coast, en Australia, con $630$ estudiantes de $110$ países, según el registro oficial de la competencia.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Antes de sumar y restar conviene nombrar los conjuntos, describir con palabras cada intersección y revisar que se pueda contar con facilidad.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

La dificultad está en elegir los conjuntos: a veces cada condición «mala» es un conjunto y lo que se pide es el complemento de su unión.

[[collection:${collection}:dificiles]]`

const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'intermedio' })
const problem = (code, titulo, enunciado, difficulty = 'intermedio') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })

const problems = [
  exercise('C61', 'Dos divisores', String.raw`¿Cuántos números del $1$ al $60$ son divisibles entre $2$ o entre $3$?`, [
    String.raw`Contar los múltiplos de $2$, los de $3$ y restar los que se contaron dos veces.`,
  ]),
  exercise('C62', 'Dos deportes', String.raw`En un grupo de $40$ estudiantes, $25$ juegan futbol, $18$ juegan basquetbol y $7$ juegan los dos. ¿Cuántos no juegan ninguno de los dos?`, [
    String.raw`Calcular primero cuántos juegan al menos uno.`,
  ]),
  exercise('C63', 'Una intersección engañosa', String.raw`¿Cuántos números del $1$ al $120$ son divisibles entre $4$ o entre $6$?`, [
    String.raw`¿Qué números son múltiplos de $4$ y de $6$ a la vez? No son los múltiplos de $24$.`,
  ]),
  exercise('C64', 'Ninguno de tres', String.raw`¿Cuántos números del $1$ al $100$ no son divisibles entre $2$, ni entre $3$, ni entre $5$?`, [
    String.raw`Usar el ejemplo de la lección y contar por complemento.`,
  ]),
  problem('C65', 'Cinco cartas', String.raw`¿De cuántas maneras se pueden repartir cinco cartas con nombre entre sus cinco dueños de modo que nadie reciba la suya?`),
  problem('C66', 'Cuatro primos pequeños', String.raw`¿Cuántos números del $1$ al $1000$ no son divisibles entre ninguno de los primos $2$, $3$, $5$ y $7$?`),
  problem('C67', 'Primos relativos con 360', String.raw`¿Cuántos números del $1$ al $360$ son primos relativos con $360$?`),
  problem('C68', 'Cajas sin vaciar', String.raw`¿De cuántas maneras se pueden colocar $5$ pelotas distintas en $3$ cajas distintas de modo que ninguna caja quede vacía?`),
  problem('C69', 'Letras vecinas distintas', String.raw`¿Cuántas palabras distintas de seis letras se forman con las letras A, A, B, B, C, C de modo que no haya dos letras iguales juntas?`),
  problem('C70', 'Tres clubes', String.raw`En una escuela de $100$ estudiantes, $45$ están en el club de matemáticas, $40$ en el de ajedrez y $35$ en el de ciencias. Hay $15$ en matemáticas y ajedrez, $12$ en matemáticas y ciencias, $10$ en ajedrez y ciencias, y $10$ estudiantes no están en ningún club. ¿Cuántos están en los tres?`),
  problem('C71', 'Sumandos acotados', String.raw`¿Cuántas soluciones tiene la ecuación $x+y+z=15$ con $x$, $y$ y $z$ enteros entre $0$ y $6$, inclusive?`, 'avanzado'),
  problem('C72', 'Repartos sin coincidencias', String.raw`Sea $D_n$ el número de maneras de repartir $n$ cartas con nombre entre sus $n$ dueños de modo que nadie reciba la suya. Demostrar que $D_n=n!\left(1-\dfrac1{1!}+\dfrac1{2!}-\cdots+\dfrac{(-1)^n}{n!}\right)$.`, 'avanzado'),
]

export default {
  pathSlug,
  lesson,
  summary,
  content,
  problems,
  collections: {
    [collection]: {
      ejercicios: ['TP-C61', 'TP-C62', 'TP-C63', 'TP-C64'],
      practice: ['TP-C65', 'TP-C66', 'TP-C67', 'TP-C68', 'TP-C69', 'TP-C70'],
      dificiles: ['TP-C71', 'TP-C72'],
    },
  },
}
