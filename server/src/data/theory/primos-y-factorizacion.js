const pathSlug = 'primos-y-factorizacion'
const collection = pathSlug
const summary = 'Reconocer números primos y usar sus exponentes para contar divisores y encontrar cuadrados perfectos.'
const content = String.raw`## Preámbulo: ¿Cuántas maneras de repartir?

Dos grupos tienen distinta cantidad de integrantes. En cada uno se quieren formar equipos del mismo tamaño, sin dejar a nadie fuera. ¿Se puede saber cuántos tamaños de equipo son posibles sin ensayar uno por uno todos los números menores que el total?

Algunas cantidades se descomponen en grupos de muchas formas; otras solo admiten equipos de una persona o un solo equipo con todo el grupo. Las piezas que permiten describir esas descomposiciones son los números primos. Aprenderemos a encontrarlas y a leer en ellas los tamaños posibles.

## Teoría

### Las piezas básicas

En esta lección trabajamos con divisores positivos. Un divisor de un entero positivo $n$ es un entero positivo $d$ tal que $n=dk$ para algún entero $k$.

:::definition Primo y compuesto
Un entero $n>1$ es primo si sus únicos divisores positivos son $1$ y $n$. Es compuesto si tiene algún divisor positivo distinto de ambos.
:::

Por ejemplo, $7$ es primo: sus divisores positivos son $1$ y $7$. El número $12$ es compuesto, pues $3$ lo divide y no es ni $1$ ni $12$. El número $1$ no es primo ni compuesto: no cumple la condición $n>1$ y tiene un solo divisor positivo.

:::try ¿Es primo el número $2$?
Sí. Sus únicos divisores positivos son $1$ y $2$. Es el único primo par: cualquier otro entero par mayor que $2$ tiene a $2$ como divisor distinto de $1$ y de sí mismo.
:::

Si un número es compuesto, podemos escribirlo como producto de dos enteros mayores que $1$ y repetir la separación en cada factor compuesto. Cada factor nuevo es menor que el que se separó; por eso el proceso termina con factores primos. Por ejemplo, $72=8\cdot9=2\cdot2\cdot2\cdot3\cdot3=2^3\cdot3^2$.

Usaremos como antecedente el **teorema fundamental de la aritmética**: todo entero mayor que $1$ tiene una factorización en primos y esta es única salvo el orden de los factores. La terminación anterior explica la existencia; la demostración completa de la unicidad requiere herramientas que estudiaremos más adelante. Convenimos en que $1$ tiene factorización vacía, sin factores primos.

### Hasta dónde buscar

Para comprobar si un número es primo no hace falta dividirlo entre todos los enteros menores que él. Si es compuesto, uno de los factores de una descomposición debe ser suficientemente pequeño.

:::proposition Un divisor pequeño
Si un entero $n>1$ es compuesto, tiene un divisor primo $p$ con $p\le\sqrt n$.
:::

:::proof
Como $n$ es compuesto, existe una descomposición $n=ab$ con enteros $a,b>1$. Si ambos fueran mayores que $\sqrt n$, su producto sería mayor que $n$, contradicción. Por tanto al menos uno, digamos $a$, cumple $a\le\sqrt n$.

Si $a$ es primo, tomamos $p=a$. Si $a$ es compuesto, su factorización prima contiene algún primo $p$; por ser factor de $a$, se cumple $p\le a$. En ambos casos $p\mid a$ y $a\mid n$, de modo que $p\mid n$, y además $p\le\sqrt n$.
:::

:::example
Determinar si $83$ es primo.

Como $9^2=81<83<100=10^2$, cualquier divisor primo necesario es menor que $10$: basta revisar $2$, $3$, $5$ y $7$. El número $83$ no es par; su suma de cifras es $11$, no es múltiplo de $3$; no termina en $0$ ni en $5$; y está entre $77=7\cdot11$ y $84=7\cdot12$. Ninguno de esos primos lo divide. Por la proposición, $83$ no puede ser compuesto y, como es mayor que $1$, es primo.
:::

:::mistake
Llamar primo a un número solo porque no es divisible por $2$, $3$ o $5$. Por ejemplo, $49$ no es divisible por esos tres primos, pero $49=7\cdot7$ es compuesto. El límite que se debe revisar depende del número.
:::

### Contar divisores sin enumerarlos

En una factorización prima, un divisor puede usar menos copias de cada primo, pero no más. La unicidad garantiza que dos elecciones distintas de exponentes no den el mismo divisor.

:::proposition Número de divisores
Sean $p_1,\ldots,p_r$ primos distintos y $a_1,\ldots,a_r$ enteros positivos. El número de divisores positivos de $n=p_1^{a_1}\cdots p_r^{a_r}$ es
$$(a_1+1)(a_2+1)\cdots(a_r+1).$$
:::

:::proof
Sea $d$ un divisor positivo de $n$. Existe un entero positivo $k$ con $n=dk$. Al factorizar $d$ y $k$ en primos y usar la unicidad, los únicos primos que aparecen en $d$ son los $p_i$, y el exponente de $p_i$ en $d$ es un entero entre $0$ y $a_i$. Esto también incluye $d=1$, cuando todos los exponentes son cero.

Recíprocamente, si elegimos para cada $p_i$ un exponente entre $0$ y $a_i$, el producto elegido divide a $n$: el cociente se obtiene usando los exponentes que faltan, todos no negativos. Para $p_i$ hay $a_i+1$ elecciones. Cada lista da un divisor distinto por unicidad, y multiplicar las cantidades de elecciones cuenta todas las listas; se obtiene la fórmula.
:::

:::example
¿Cuántos divisores positivos tiene $180$?

Su factorización es $180=2^2\cdot3^2\cdot5$. Para los exponentes de $2$, $3$ y $5$ hay respectivamente $3$, $3$ y $2$ elecciones, incluyendo el exponente cero. La cantidad es $3\cdot3\cdot2=18$; entre ellos están $1$ y $180$.
:::

### Reconocer cuadrados

Si un entero positivo es un cuadrado, cada factor primo aparece un número par de veces al multiplicar una factorización por sí misma. También funciona la dirección contraria.

:::proposition Exponentes de un cuadrado
Un entero positivo es un cuadrado perfecto si y solo si todos los exponentes de su factorización prima son pares. Para $1$, la condición se cumple sin exponentes.
:::

:::proof
Si $n=m^2$, podemos elegir el entero $m$ positivo porque $n>0$. Si $m=1$, entonces $n=1$. Si $m>1$, al multiplicar la factorización prima de $m$ por sí misma, cada exponente se duplica; por unicidad, esos son los exponentes de $n$ y todos son pares.

Recíprocamente, si cada exponente de $n$ es par, podemos escribirlo como $2b_i$ con $b_i$ entero no negativo. Entonces $n=(p_1^{b_1}\cdots p_r^{b_r})^2$. Para $n=1$, se tiene $1=1^2$.
:::

:::tip
Para buscar el mayor divisor cuadrado de un número, reducir cada exponente impar al par inmediato inferior y conservar los exponentes pares. Así se usa la mayor potencia permitida de cada primo sin introducir factores nuevos.
:::

## Agregados culturales

- Antes de 1733, Leonhard Euler mostró que $2^{32}+1$ es divisible por $641$. Ese ejemplo refutó una conjetura de Fermat sobre cierta familia de números que se creían primos.
- La octava Olimpiada Internacional de Matemáticas se celebró en 1966 en Sofía, Bulgaria. Participaron $72$ estudiantes de $9$ países.
- En 1610 Galileo observó con un telescopio las cuatro lunas mayores de Júpiter. Hoy se conocen como satélites galileanos.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Al factorizar, comprobar que cada factor final sea primo. Para contar divisores, incluir la posibilidad de elegir exponente cero.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

En estos problemas hay que razonar sobre todas las posibilidades de los exponentes, no solo calcular la factorización de un número dado.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problem = (code, titulo, enunciado, difficulty = 'basico') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })
const problems = [
  exercise('N19','Factores de 84',String.raw`Escribir $84$ como producto de potencias de primos distintos.`,['Dividir por un primo y repetir con el cociente.']),
  exercise('N20','Una prueba de composición',String.raw`Decidir si $91$ es primo y justificar la respuesta.`,[String.raw`Buscar divisores primos no mayores que $\sqrt{91}$.`]),
  exercise('N21','Contar divisores',String.raw`Determinar cuántos divisores positivos tiene $60$.`,['Factorizar y contar las opciones de cada exponente, incluido el cero.']),
  exercise('N22','Un divisor cuadrado',String.raw`Encontrar el mayor divisor positivo de $72$ que sea un cuadrado perfecto.`,['En un cuadrado, todos los exponentes primos son pares.']),
  problem('N23','Factorización y conteo',String.raw`Factorizar $126$ en primos y determinar cuántos divisores positivos tiene.`),
  problem('N24','Cuadrados entre divisores',String.raw`Determinar cuántos divisores positivos de $200$ son cuadrados perfectos.`),
  problem('N25','Tres divisores',String.raw`Encontrar el menor entero positivo que tiene exactamente tres divisores positivos y demostrar que no hay otro menor.`),
  problem('N26','Un cuadrado divisible',String.raw`Si $n$ es un entero positivo y $3\mid n^2$, demostrar que $3\mid n$.`),
  problem('N27','Una cantidad impar de divisores',String.raw`Demostrar que el número de divisores positivos de $n^2$ es impar para todo entero positivo $n$.`,'intermedio'),
  problem('N28','Doce divisores',String.raw`Determinar el menor entero positivo que tiene exactamente $12$ divisores positivos y justificar que no existe uno menor.`,'intermedio'),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-N19','TP-N20','TP-N21','TP-N22'], practice: ['TP-N03','TP-N04','TP-N23','TP-N24','TP-N25','TP-N26'], dificiles: ['TP-N27','TP-N28'] } } }
