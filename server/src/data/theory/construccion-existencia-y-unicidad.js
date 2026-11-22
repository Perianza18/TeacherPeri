const pathSlug = 'construccion-existencia-y-unicidad'
const collection = pathSlug
const summary = 'Construir y verificar ejemplos, y distinguir demostrar existencia de demostrar que una solución es única.'
const content = String.raw`## Preámbulo: Las pistas de una clave

En un juego hay que descubrir una clave de dos cifras distintas. Se sabe que la primera es una unidad mayor que la segunda y que ambas suman nueve. ¿Alcanzan esas pistas para encontrar una clave? Y, si se encuentra una, ¿podría haber otra que también funcione?

La primera pregunta pide una posibilidad; la segunda pide comparar todas las posibilidades permitidas. Para responder con seguridad necesitaremos construir una candidata, comprobar las pistas y explicar qué ocurre con cualquier otra candidata.

## Teoría

### Existencia: mostrar un ejemplo

Una afirmación de existencia dice que al menos un objeto del dominio tiene cierta propiedad. Una prueba constructiva propone un objeto y verifica cada condición. Una fórmula para el objeto no basta por sí sola: también hay que mostrar que pertenece al dominio y cumple lo pedido.

:::example
Demostrar que para todo entero $n$ existe un entero par mayor que $n$.

Fijemos un entero $n$ cualquiera y construyamos $m=2|n|+2$. Como $|n|$ es entero, $m=2(|n|+1)$ es un entero par. Además, $|n|\ge n$ y $|n|\ge0$; por eso
$$m-n=(|n|-n)+|n|+2>0.$$
Por tanto $m>n$. La construcción funciona también para $n$ negativo y para $n=0$.
:::

La existencia de ese $m$ no demuestra que sea el único. De hecho, $m+2$ también es par y es mayor que $m$, así que proporciona otro ejemplo para el mismo $n$.

:::try ¿Basta encontrar un entero par mayor que $7$ para demostrar que hay uno mayor que cualquier entero?
No. Una construcción para $7$ solo resuelve ese caso. La prueba general debe funcionar para un entero $n$ arbitrario.
:::

### Existir no siempre significa construir

Algunos argumentos garantizan que hay un objeto sin indicar cuál es. En ese caso hay que explicar por qué las hipótesis obligan a que exista, aunque la prueba no lo identifique.

:::example
En un grupo de $367$ estudiantes, cada cumpleaños corresponde a una de las $366$ fechas posibles de día y mes. Demostrar que dos estudiantes cumplen años en la misma fecha.

Supongamos que no hay dos estudiantes con la misma fecha. Entonces cada una de las $366$ fechas corresponde a lo más a una persona, y habría como máximo $366$ estudiantes. Esto contradice que haya $367$. Por tanto existen al menos dos con la misma fecha, aunque el argumento no identifica quiénes son.
:::

:::mistake
Suponer que una prueba de existencia identifica necesariamente un ejemplo. En el problema de los cumpleaños sabemos que existe una pareja, pero no conocemos sus nombres ni la fecha. Para construir una pareja concreta se necesitaría información adicional.
:::

### Unicidad: comparar dos candidatos

«Existe un único objeto» contiene dos afirmaciones: existe al menos uno y no puede haber dos distintos. Para la segunda, se toman dos objetos cualesquiera que cumplan las condiciones y se demuestra que son iguales.

:::theorem Una ecuación lineal
Si $a$, $b$ y $c$ son reales y $a\ne0$, existe un único real $x$ que satisface $ax+b=c$.
:::

:::proof
**Existencia.** Tomamos $x=(c-b)/a$, que es real porque $a\ne0$. Al sustituir, $ax+b=a[(c-b)/a]+b=c-b+b=c$. Así, la candidata satisface la ecuación.

**Unicidad.** Sean $x$ e $y$ dos soluciones reales. Entonces $ax+b=c$ y $ay+b=c$. Al restar la segunda igualdad de la primera, $ax-ay=0$, es decir, $a(x-y)=0$. Como $a\ne0$, dividir entre $a$ da $x-y=0$, así que $x=y$. Cualesquiera dos soluciones coinciden, y la candidata construida es la única.
:::

La condición $a\ne0$ es necesaria para esta conclusión. Si $a=0$ y $b=c$, todos los reales satisfacen la ecuación; si $a=0$ y $b\ne c$, ninguno la satisface.

:::tip
Separar la escritura en «existencia» y «unicidad». En la primera parte verificar una candidata; en la segunda tomar dos candidatas arbitrarias y explicar por qué no pueden diferir.
:::

### Volver a las pistas

En la clave del preámbulo importa el orden: la primera y la segunda cifra desempeñan papeles distintos. Encontrar una clave sirve para la existencia; las ecuaciones permiten revisar si hay otras.

:::example
Una clave tiene dos cifras distintas; la primera es una unidad mayor que la segunda y ambas suman $9$. Demostrar que existe una única clave y encontrarla.

La clave $54$ cumple las condiciones: sus cifras son distintas, $5=4+1$ y $5+4=9$. Esto prueba la existencia.

Para la unicidad, sean $x$ e $y$ las cifras de cualquier clave que cumpla las pistas, en ese orden. Entonces $x=y+1$ y $x+y=9$. Al sustituir la primera igualdad en la segunda, $2y+1=9$; al restar $1$ y dividir entre $2$, $y=4$. Por tanto $x=5$. Cualquier clave válida es $54$, que ya verificamos.
:::

Una condición puede admitir varias soluciones. Por ejemplo, $x^2=4$ tiene las dos soluciones reales distintas $2$ y $-2$: al factorizar, $(x-2)(x+2)=0$, y ambas satisfacen la ecuación. Por eso encontrar una solución no basta para afirmar unicidad.

## Agregados culturales

- En 1874 Georg Cantor publicó un resultado que muestra que los números reales no se pueden poner en correspondencia uno a uno con los enteros positivos. Su trabajo abrió nuevas preguntas sobre conjuntos infinitos.
- La decimoctava Olimpiada Internacional de Matemáticas se celebró en 1976 en Lienz, Austria. Participaron $139$ estudiantes de $18$ países.
- El telescopio espacial Hubble fue lanzado en abril de 1990. Una vez en órbita, sus instrumentos comenzaron a obtener imágenes astronómicas.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Para cada afirmación, distinguir si se pide una construcción, una verificación o una prueba de unicidad. Especificar el dominio de los objetos.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Los últimos problemas exigen encontrar más de un ejemplo o justificar que dos descripciones aparentemente distintas representan el mismo objeto.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problem = (code, titulo, enunciado, difficulty = 'basico') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })
const problems = [
  exercise('P53','Un impar mayor',String.raw`Para cualquier entero $n$, construir un entero impar mayor que $n$ y verificar ambas propiedades.`,['Buscar un número impar usando el valor absoluto de $n$.']),
  exercise('P54','Una ecuación lineal',String.raw`Demostrar que existe un único real que satisface $3x+2=11$ y encontrarlo.`,['Verificar una candidata y comparar dos soluciones cualesquiera.']),
  exercise('P55','Dos parejas',String.raw`Encontrar dos parejas distintas de enteros positivos cuya suma sea $7$; en cada pareja el orden no importa.`,['Buscar dos elecciones con números distintos.']),
  exercise('P56','Una raíz positiva',String.raw`Demostrar que existe un único real positivo $x$ con $x^2=9$ y encontrarlo.`,['Factorizar $x^2-9$ y usar la restricción de positividad.']),
  problem('P57','Un múltiplo mayor',String.raw`Para todo entero $n$, construir un múltiplo de $3$ que sea mayor que $n$ y justificarlo.`),
  problem('P58','Una ecuación y su solución',String.raw`Demostrar que existe un único real $x$ que satisface $7x+4=3$ y encontrarlo.`),
  problem('P59','Dos raíces',String.raw`Determinar todas las soluciones reales de $x^2=9$ y justificar que no hay otras.`),
  problem('P60','Entre dos racionales',String.raw`Si $a$ y $b$ son racionales con $a<b$, construir dos racionales distintos que estén entre ambos.`),
  problem('P61','Dos cuadrados alcanzables',String.raw`Para todo entero positivo $n$, demostrar que existen al menos dos enteros positivos distintos $m$ tales que $n+m$ es un cuadrado perfecto.`,'intermedio'),
  problem('P62','Cociente y residuo',String.raw`Demostrar que para cada entero $n$ existe una única pareja de enteros $(q,r)$ tal que $n=3q+r$ y $r\in\{0,1,2\}$.`,'intermedio'),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-P53','TP-P54','TP-P55','TP-P56'], practice: ['TP-A05','TP-A06','TP-P57','TP-P58','TP-P59','TP-P60'], dificiles: ['TP-P61','TP-P62'] } } }
