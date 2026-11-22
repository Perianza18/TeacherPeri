const pathSlug = 'demostracion-directa'
const collection = pathSlug
const summary = 'Construir una demostración desde las hipótesis hasta la conclusión, usando definiciones y pasos justificados.'
const content = String.raw`## Preámbulo: ¿Cuántas pruebas bastan?

Una máquina toma un entero $n$ y calcula $n^2+n+11$. Al introducir $0$, $1$, $2$ y $3$ aparecen $11$, $13$, $17$ y $23$: todos son primos. ¿Será primo el resultado para cualquier entero que se introduzca?

Comprobar ejemplos ayuda a descubrir patrones y puede revelar un error. Pero una afirmación sobre todos los enteros abarca muchos más casos que los ensayados. Para justificarla necesitamos un argumento que explique por qué funciona para un entero cualquiera y que dependa de las hipótesis dadas.

## Teoría

### De los ejemplos a una afirmación

La observación inicial no alcanza para afirmar que la máquina siempre produce un primo. De hecho, con $n=10$ produce $10^2+10+11=121=11\cdot11$, que es compuesto. Un solo contraejemplo basta para refutar una afirmación universal, aunque muchos ejemplos la hayan apoyado.

Para demostrar una afirmación verdadera de la forma «si se cumplen ciertas hipótesis, entonces se cumple una conclusión», una **demostración directa** parte de las hipótesis y llega a la conclusión mediante definiciones y resultados conocidos. El objeto elegido debe ser cualquiera que satisfaga las hipótesis, no uno seleccionado por conveniencia.

:::example
Demostrar directamente que la suma de dos enteros pares es par.

Sean $a$ y $b$ enteros pares cualesquiera. Por definición existen enteros $r$ y $s$ tales que $a=2r$ y $b=2s$. Al sumar estas igualdades y factorizar $2$, obtenemos $a+b=2r+2s=2(r+s)$. Como $r+s$ es entero, la definición de número par muestra que $a+b$ es par.
:::

La prueba no depende de que $r$ y $s$ sean positivos: también cubre enteros negativos y el cero. En cambio, calcular solo $2+4=6$ habría mostrado un caso particular.

Una afirmación y su recíproca no son lo mismo: intercambiar hipótesis y conclusión plantea otra pregunta. Por ejemplo, si un entero es divisible por $4$, es par, pues $4k=2(2k)$. La recíproca es falsa: $6$ es par pero no es divisible por $4$.

:::try Si $n$ es un entero impar, ¿cómo se escribe usando un entero $k$?
Por definición de impar, existe un entero $k$ tal que $n=2k+1$. El entero $k$ puede ser negativo o cero.
:::

### Abrir la definición

Una conclusión como «es divisible por $3$» pide exhibir un factor entero después de sacar el $3$. Escribir explícitamente los enteros garantizados por las hipótesis ayuda a ver ese factor.

:::proposition Una combinación divisible
Si los enteros $a$ y $b$ son divisibles por $3$, entonces $2a-b$ es divisible por $3$.
:::

:::proof
Como $3\mid a$, existe un entero $r$ con $a=3r$. Como $3\mid b$, existe un entero $s$ con $b=3s$. Al sustituir estas igualdades,
$$2a-b=2(3r)-3s=3(2r-s).$$
El número $2r-s$ es entero. Por definición de divisibilidad, $3\mid(2a-b)$.
:::

El último paso es parte del argumento: la expresión entre paréntesis debe ser entera. No hemos supuesto que $a$ y $b$ tengan el mismo cociente al dividir entre $3$.

:::example
Demostrar que el cuadrado de cualquier entero impar es impar.

Sea $n$ un entero impar. Por definición, $n=2k+1$ para algún entero $k$. Desarrollando y agrupando los términos pares,
$$n^2=(2k+1)^2=4k^2+4k+1.$$
Al sacar factor $2$ de los dos primeros términos, $n^2=2(2k^2+2k)+1$. Como $2k^2+2k$ es entero, esta expresión tiene la forma de un entero impar. Por tanto $n^2$ es impar para todo entero impar $n$.
:::

:::mistake
Comprobar una propiedad para varios valores y concluir que vale para todos. Las primeras salidas primas de la máquina no descartan la salida compuesta obtenida con $n=10$. Una prueba universal debe justificar un caso arbitrario; un contraejemplo basta para mostrar que la afirmación universal es falsa.
:::

### Usar cada hipótesis

Las hipótesis también pueden garantizar el signo de una expresión. Al multiplicar desigualdades, conviene señalar qué factores son no negativos; sin esa información, la dirección de una desigualdad podría cambiar.

:::proposition Comparar cuadrados
Si $a$ y $b$ son números reales con $a\ge b\ge0$, entonces $a^2\ge b^2$.
:::

:::proof
De $a\ge b$ se obtiene $a-b\ge0$. Como $a$ y $b$ son no negativos, $a+b\ge0$. El producto de dos números no negativos es no negativo, así que $(a-b)(a+b)\ge0$. Por diferencia de cuadrados, $a^2-b^2\ge0$; al sumar $b^2$ a ambos lados queda $a^2\ge b^2$.
:::

La condición $b\ge0$ importa. Por ejemplo, $-1>-3$, pero $(-1)^2<(-3)^2$. Ese ejemplo no contradice la proposición porque no satisface todas sus hipótesis.

:::tip
Antes de escribir, anotar qué forma exige la conclusión: un factor entero para divisibilidad, una expresión $2k+1$ para imparidad o una diferencia no negativa para comparar números. Después buscar cómo obtener esa forma desde los datos.
:::

## Agregados culturales

- Los *Elementos* de Euclides presentan resultados matemáticos acompañados de demostraciones. Varios de sus libros se ocupan de propiedades de los números.
- La decimotercera Olimpiada Internacional de Matemáticas se celebró en 1971 en Žilina, entonces en Checoslovaquia. Participaron $115$ estudiantes de $15$ países.
- La Estación Espacial Internacional tarda aproximadamente $90$ minutos en completar una órbita alrededor de la Tierra. El tiempo exacto depende de la altura de su órbita.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Identificar las hipótesis y la conclusión antes de empezar. En cada paso, indicar qué definición o propiedad permite pasar al siguiente.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Estos problemas requieren encontrar una factorización o una forma equivalente que haga visible la conclusión para todos los valores permitidos.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problem = (code, titulo, enunciado, difficulty = 'basico') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })
const problems = [
  exercise('P01','Par más impar',String.raw`Demostrar directamente que la suma de un entero par y un entero impar es impar.`,['Escribir cada entero con la forma correspondiente a su paridad.']),
  exercise('P02','Sumar múltiplos',String.raw`Si $d$ es un entero no nulo que divide a los enteros $a$ y $b$, demostrar que $d\mid(a+b)$.`,['Escribir $a=dr$ y $b=ds$ con $r,s$ enteros.']),
  exercise('P03','Un cuadrado',String.raw`Demostrar que si $x$ es real y $x\ge3$, entonces $x^2\ge9$.`,['Considerar el signo de $(x-3)(x+3)$.']),
  exercise('P04','Consecutivo impar',String.raw`Demostrar directamente que si $n$ es un entero impar, entonces $n+1$ es par.`,['Escribir $n=2k+1$ para algún entero $k$.']),
  problem('P05','Un factor común',String.raw`Demostrar que $5n-5$ es divisible por $5$ para todo entero $n$.`),
  problem('P06','Cuadrado de un par',String.raw`Demostrar que el cuadrado de todo entero par es divisible por $4$.`),
  problem('P07','Dos divisibilidades',String.raw`Si los enteros $a$ y $b$ cumplen $4\mid a$ y $6\mid b$, demostrar que $2\mid(a+b)$.`),
  problem('P08','Conservar una desigualdad',String.raw`Si $a$ y $b$ son reales y $a\ge b$, demostrar que $2a+3\ge2b+3$.`),
  problem('P09','Dos cuadrados impares',String.raw`Demostrar que si $a$ y $b$ son enteros impares, entonces $a^2+b^2-2$ es divisible por $8$.`,'intermedio'),
  problem('P10','Comparar cubos',String.raw`Si $a$ y $b$ son reales y $a>b\ge0$, demostrar que $a^3>b^3$.`,'intermedio'),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-P01','TP-P02','TP-P03','TP-P04'], practice: ['TP-A01','TP-N02','TP-P05','TP-P06','TP-P07','TP-P08'], dificiles: ['TP-P09','TP-P10'] } } }
