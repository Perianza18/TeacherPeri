const pathSlug = 'contradiccion'
const collection = pathSlug
const summary = 'Demostrar una afirmación suponiendo su negación y señalando con precisión la imposibilidad que se obtiene.'
const content = String.raw`## Preámbulo: Un registro de saludos

En una reunión de cinco personas se registra un saludo cada vez que dos personas distintas se saludan. Al final, cada una afirma haber saludado exactamente a tres de las otras cuatro. ¿Es posible que el registro sea correcto?

Una forma de explorar la pregunta es intentar construir los saludos. Otra es suponer que el registro existe y contar la misma información de dos maneras. Si esa suposición obliga a obtener dos propiedades incompatibles para una misma cantidad, habremos encontrado una razón para descartarla.

## Teoría

### Suponer y encontrar una imposibilidad

Para demostrar una afirmación por contradicción, suponemos que es falsa y razonamos hasta obtener algo incompatible con las hipótesis o con un hecho ya demostrado. Entonces la suposición era imposible y la afirmación es verdadera.

Si se quiere probar «si $P$, entonces $Q$», se mantienen las hipótesis $P$ y se supone falsa la conclusión $Q$. No se puede abandonar una hipótesis a mitad de la prueba; tampoco basta llegar a algo inesperado si todavía podría ser cierto.

:::example
En una reunión de cinco personas, cada saludo ocurre entre dos personas distintas. Demostrar que es imposible que cada persona participe en exactamente tres saludos.

Supongamos que sí ocurre. Al sumar los saludos por persona obtenemos $5\cdot3=15$ participaciones. Pero cada saludo tiene exactamente dos participantes, así que, si hay $s$ saludos, el número de participaciones es $2s$ y debe ser par.

La misma cantidad sería $15$ y $2s$; eso es imposible porque $15$ es impar y $2s$ es par. Por tanto no existe un registro con las condiciones indicadas.
:::

La contradicción no depende de la manera de ordenar a las personas ni de quién saluda a quién. Depende de contar cada saludo exactamente dos veces al sumar las participaciones.

:::try ¿Cuál es la negación de «existe un entero mayor que todos los demás enteros»?
Es «no existe un entero mayor que todos los demás enteros». Para refutar la existencia, se puede suponer que existe uno y buscar un entero mayor.
:::

### Una suposición que se puede superar

En una afirmación de inexistencia, negar la conclusión significa suponer que existe un objeto con la propiedad prohibida. Conviene darle un nombre y conservar todas las condiciones que lo definen.

:::proposition No hay un entero máximo
No existe un entero mayor que todos los demás enteros.
:::

:::proof
Supongamos que existe un entero $N$ mayor que todos los demás enteros. Como $N$ es entero, $N+1$ también es entero; además $N+1>N$ porque $1>0$. Esto contradice que $N$ sea mayor que todos los demás enteros. Por tanto no existe tal $N$.
:::

La fuerza de la prueba está en señalar exactamente qué dos afirmaciones chocan.

:::mistake
Llamar contradicción a una conclusión que solo parece extraña. Una contradicción debe señalar dos afirmaciones incompatibles, como «$N$ es mayor que todo otro entero» y «$N+1$ es un entero mayor que $N$».
:::

### Una fracción imposible

Un número racional es el cociente de dos enteros con denominador no nulo. Para demostrar que un número no es racional, suponemos que puede escribirse como una fracción simplificada y examinamos sus consecuencias.

:::theorem Irracionalidad de la raíz de dos
El número $\sqrt2$ no es racional.
:::

:::proof
Supongamos que $\sqrt2$ es racional. Entonces podemos escribir $\sqrt2=a/b$, con enteros positivos $a,b$ sin divisor común positivo mayor que $1$: partimos de una fracción entera y dividimos numerador y denominador entre su MCD.

Al elevar al cuadrado y multiplicar por $b^2$, obtenemos $a^2=2b^2$. Así $a^2$ es par. Como el cuadrado de un entero impar es impar, $a$ debe ser par; escribimos $a=2k$ con $k$ entero.

Sustituimos en $a^2=2b^2$: $4k^2=2b^2$. Al dividir ambos lados entre $2$, queda $b^2=2k^2$. Si $b$ fuera impar, su cuadrado sería impar; como $b^2=2k^2$ es par, $b$ no es impar y por tanto es par.

Por tanto $2$ divide a $a$ y a $b$, lo que contradice que la fracción estuviera simplificada. La suposición de que $\sqrt2$ es racional es falsa; luego $\sqrt2$ es irracional.
:::

La prueba usa el resultado anterior de paridad: si un entero fuera impar, su cuadrado sería impar. La conclusión sobre $a$ y $b$ no se obtiene simplemente de que su producto o su suma sean pares.

:::tip
Antes de suponer la negación, escribir qué hecho podría contradecirse: una restricción del enunciado, una definición o una igualdad imposible. Al final, nombrar las dos afirmaciones incompatibles y señalar qué suposición se descarta.
:::

### Contradicción y contraposición

La contraposición demuestra «no $Q$ implica no $P$». Una prueba por contradicción de «$P$ implica $Q$» supone $P$ y no $Q$ a la vez y llega a una imposibilidad. Las dos técnicas están relacionadas, pero en cada argumento debe quedar claro cuál es la suposición temporal y dónde aparece el conflicto.

:::example
Demostrar por contradicción que no existen enteros $x,y$ con $4x+6y=1$.

Supongamos que existen tales enteros. Entonces $4x+6y=2(2x+3y)$ es par, porque $2x+3y$ es entero. La igualdad supuesta dice que ese mismo número es $1$, que es impar. Un entero no puede ser par e impar a la vez; por tanto no existen esos $x,y$.
:::

## Agregados culturales

- En el libro IX de los *Elementos*, Euclides presentó una demostración de que existen infinitos números primos. Su argumento muestra cómo una lista finita de primos no puede incluirlos a todos.
- La decimosexta Olimpiada Internacional de Matemáticas se celebró en 1974 en Erfurt. Participaron $140$ estudiantes de $18$ países.
- En agosto de 1989 la sonda Voyager 2 pasó cerca de Neptuno y envió imágenes del planeta. Fue el primer sobrevuelo de Neptuno por una nave espacial.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Enunciar la suposición temporal y explicar por qué cada paso se deduce de ella y de las hipótesis. Terminar identificando la contradicción.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

En estos problemas hay que construir un objeto o analizar una fracción para obtener un conflicto que no se ve al principio.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problem = (code, titulo, enunciado, difficulty = 'basico') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })
const problems = [
  exercise('P31','Un entero máximo',String.raw`Demostrar por contradicción que no existe un entero par que sea mayor que todos los enteros pares.`,['Si existiera uno, sumar $2$ produciría otro entero par.']),
  exercise('P32','Una igualdad imposible',String.raw`Demostrar que no existen enteros $a,b$ tales que $2a+4b=7$.`,['Examinar la paridad del lado izquierdo.']),
  exercise('P33','Un cuadrado impar',String.raw`Demostrar por contradicción que si $n^2$ es impar para un entero $n$, entonces $n$ es impar.`,['Suponer que $n$ es par y examinar su cuadrado.']),
  exercise('P34','Un racional positivo menor',String.raw`Demostrar que no existe un menor número racional positivo.`,['Si existiera uno, considerar su mitad.']),
  problem('P35','Una combinación imposible',String.raw`Demostrar que no existen enteros $x,y$ con $6x+9y=1$.`),
  problem('P36','Múltiplos sin máximo',String.raw`Demostrar que no existe un mayor múltiplo entero de $3$.`),
  problem('P37','Un cuadrado entero',String.raw`Demostrar que no existe un entero $n$ tal que $n^2=2$.`),
  problem('P38','Cuadrado impar y paridad',String.raw`Demostrar por contradicción que si un entero $n$ es par, entonces $n^2+1$ es impar.`),
  problem('P39','Una lista de primos',String.raw`Demostrar que existen infinitos números primos.`, 'intermedio'),
  problem('P40','Una raíz irracional',String.raw`Demostrar que $\sqrt6$ es irracional.`, 'intermedio'),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-P31','TP-P32','TP-P33','TP-P34'], practice: ['TP-N08','TP-M02','TP-P35','TP-P36','TP-P37','TP-P38'], dificiles: ['TP-P39','TP-P40'] } } }
