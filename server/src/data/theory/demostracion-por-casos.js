const pathSlug = 'demostracion-por-casos'
const collection = pathSlug
const summary = 'Dividir una demostración en situaciones que cubren todas las posibilidades y cerrar cada caso con una conclusión justificada.'
const content = String.raw`## Preámbulo: Una pregunta sobre vecinos

Al mirar dos enteros consecutivos, como $8$ y $9$ o $15$ y $16$, siempre parece haber uno par. ¿Ocurrirá con cualquier pareja de enteros consecutivos, incluso si son negativos o uno de ellos es cero?

No podemos revisar todas las parejas una por una. Sí podemos observar que el primer entero tiene una de dos paridades. Si cada posibilidad lleva a la conclusión y no queda ninguna fuera, tendremos un argumento para todas las parejas.

## Teoría

### Cubrir todas las posibilidades

Una demostración por casos separa las situaciones permitidas por las hipótesis y prueba la conclusión en cada una. Antes de calcular, hay que explicar por qué los casos cubren todo el dominio. Para demostrar una afirmación los casos pueden traslaparse; al contar objetos, en cambio, un traslape puede causar repeticiones.

:::proposition Un producto par
Para todo entero $n$, el producto $n(n+1)$ es par.
:::

:::proof
Todo entero es par o impar. Esas dos posibilidades cubren el dominio, incluidos los enteros negativos y el cero.

Si $n$ es par, existe un entero $k$ con $n=2k$. Entonces $n(n+1)=2k(n+1)=2[k(n+1)]$. Como $k(n+1)$ es entero, el producto es par.

Si $n$ es impar, existe un entero $k$ con $n=2k+1$. Por eso $n+1=2(k+1)$ y $n(n+1)=2[n(k+1)]$. Como $n(k+1)$ es entero, el producto también es par. Hemos probado la conclusión en ambos casos.
:::

:::try ¿Por qué basta revisar «$n$ par» y «$n$ impar» cuando $n$ es entero?
Porque todo entero pertenece a uno de esos dos casos. No queda fuera un tercer tipo de entero, tampoco cuando $n$ es negativo o cero.
:::

La demostración no prueba que ambos factores sean pares. Muestra que en cada caso al menos uno de ellos tiene un factor $2$, que es suficiente para que el producto sea par.

La lista de casos no es una lista de ejemplos: cada caso representa una familia completa. Dentro de él, $k$ sigue siendo un entero cualquiera, de manera que el cálculo cubre todos los valores de esa familia.

### Elegir casos útiles

Una buena división de casos simplifica una operación que depende de la situación. Para el valor absoluto, la expresión cambia según el signo; el cero debe quedar incluido en alguna parte.

:::proposition Valor absoluto
Para todo número real $x$, se cumple $|x|\ge x$.
:::

:::proof
Si $x\ge0$, por definición $|x|=x$; por tanto $|x|\ge x$, con igualdad. Este caso incluye $x=0$.

Si $x<0$, por definición $|x|=-x$. Como $x<0$, multiplicar por $-2$ da $-2x>0$. Al sumar $x$ a ambos lados, $-x>x$; así $|x|>x$ y, en particular, $|x|\ge x$.

Todo real es no negativo o negativo, de modo que ambos casos cubren el dominio.
:::

:::mistake
Separar solo $x>0$ y $x<0$ al demostrar una afirmación para todos los reales. Esos casos dejan fuera $x=0$. Se puede añadir el caso cero o incluirlo, como arriba, en $x\ge0$.
:::

:::example
Demostrar que $|x|+|y|\ge x+y$ para cualesquiera reales $x$ e $y$.

La proposición da $|x|\ge x$ al aplicarla a $x$ y $|y|\ge y$ al aplicarla a $y$. Al sumar las dos desigualdades, $|x|+|y|\ge x+y$. No hace falta volver a separar los cuatro pares de signos porque ya justificamos la proposición para cualquier real.
:::

### Tres residuos

Para estudiar divisibilidad por $3$, cada entero se escribe de una sola de las formas $3k$, $3k+1$ o $3k+2$, con $k$ entero. Son los tres posibles residuos de la división entre $3$, también para enteros negativos.

:::proposition Cuadrados y residuos
El residuo de dividir el cuadrado de un entero entre $3$ es $0$ o $1$.
:::

:::proof
Sea $n$ entero. Dividimos en los tres residuos posibles.

Si $n=3k$, entonces $n^2=9k^2=3(3k^2)$, cuyo residuo es $0$.

Si $n=3k+1$, entonces $n^2=9k^2+6k+1=3(3k^2+2k)+1$, cuyo residuo es $1$.

Si $n=3k+2$, entonces $n^2=9k^2+12k+4=3(3k^2+4k+1)+1$, cuyo residuo es $1$. Como $k$ es entero en cada caso y no hay otros residuos, la conclusión cubre todos los enteros.
:::

:::example
Demostrar que ningún cuadrado de un entero deja residuo $2$ al dividirse entre $3$.

La proposición anterior muestra que los únicos residuos posibles son $0$ y $1$. Como $2$ no está en esa lista, ningún cuadrado entero puede dejar residuo $2$ al dividirse entre $3$.
:::

:::tip
Al terminar una prueba por casos, releer la lista de casos junto con el dominio: revisar extremos, cero y valores negativos cuando corresponda. En cada caso, escribir la conclusión antes de pasar al siguiente.
:::

## Agregados culturales

- George Pólya publicó la primera edición de *How to Solve It* en 1945. En el libro estudió maneras de abordar problemas matemáticos y revisar sus soluciones.
- La decimocuarta Olimpiada Internacional de Matemáticas se celebró en 1972 en Toruń, Polonia. Participaron $107$ estudiantes de $14$ países.
- Según la NASA, las alas de un colibrí pueden batir aproximadamente $50$ veces por segundo. La frecuencia depende del ave y de sus condiciones de vuelo.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Elegir primero una división exhaustiva y expresar con precisión qué se supone en cada caso. Justificar la conclusión dentro de cada uno.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Estos problemas requieren combinar varios residuos posibles y explicar por qué la lista de casos descarta todas las alternativas.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problem = (code, titulo, enunciado, difficulty = 'basico') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })
const problems = [
  exercise('P11','Paridad y dos unidades',String.raw`Demostrar por casos que $n$ y $n+2$ tienen la misma paridad para todo entero $n$.`,['Separar los casos en que $n$ es par y en que es impar.']),
  exercise('P12','Cuadrado y paridad',String.raw`Demostrar por casos que un entero $n$ y su cuadrado $n^2$ tienen la misma paridad.`,['Escribir $n=2k$ o $n=2k+1$.']),
  exercise('P13','Valor absoluto no negativo',String.raw`Demostrar por casos que $|x|\ge0$ para todo real $x$.`,[String.raw`Considerar $x\ge0$ y $x<0$, incluyendo el cero.`]),
  exercise('P14','Tres consecutivos',String.raw`Demostrar que entre $n$, $n+1$ y $n+2$ hay un múltiplo de $3$, para todo entero $n$.`,['Separar según el residuo de $n$ al dividir entre $3$.']),
  problem('P15','Producto de tres consecutivos',String.raw`Demostrar que $n(n+1)(n+2)$ es divisible por $3$ para todo entero $n$.`),
  problem('P16','Distancia al uno',String.raw`Demostrar por casos que $|x-1|\ge0$ para todo número real $x$.`),
  problem('P17','Cuadrados al dividir entre cuatro',String.raw`Demostrar que el cuadrado de un entero deja residuo $0$ o $1$ al dividirse entre $4$.`),
  problem('P18','Paridad de un producto',String.raw`Demostrar que $n(n+2)$ tiene la misma paridad que $n$ para todo entero $n$.`),
  problem('P19','Dos cuadrados y cuatro',String.raw`Demostrar que la suma de los cuadrados de dos enteros no puede dejar residuo $3$ al dividirse entre $4$.`,'intermedio'),
  problem('P20','Cuartas potencias y cinco',String.raw`Demostrar que el residuo de dividir $n^4$ entre $5$ es $0$ o $1$, para todo entero $n$.`,'intermedio'),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-P11','TP-P12','TP-P13','TP-P14'], practice: ['TP-A02','TP-C02','TP-P15','TP-P16','TP-P17','TP-P18'], dificiles: ['TP-P19','TP-P20'] } } }
