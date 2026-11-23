const pathSlug = 'por-que-hacer-olimpiadas-de-matematicas'
const collection = pathSlug
const summary = 'Explorar qué se puede aprender al intentar problemas olímpicos y cómo reconocer avances más allá de una calificación.'
const content = String.raw`## Preámbulo: Una tarde con una pregunta

Un problema ha ocupado buena parte de una tarde y la solución todavía no aparece. ¿Valió la pena el intento? La respuesta puede depender de lo que pasó durante ese tiempo: quizá se descubrió un caso imposible, se encontró una pregunta más precisa o se aprendió a explicar una idea que antes solo parecía cierta.

Una competencia ofrece una meta, pero también se puede disfrutar el proceso de explorar. En esta lección observaremos cómo un intento, una corrección y una explicación pueden convertirse en herramientas para el siguiente problema.

## Teoría

### Buscar una razón

En una olimpiada no todos los problemas anuncian la técnica que habrá que usar. A veces el primer avance consiste en cambiar la pregunta: en lugar de calcular una suma larga, podemos buscar una relación entre sus términos.

:::example
Calcular $1+2+\cdots+9$ y explicar por qué el método cuenta cada término una vez.

Llamemos $S$ a la suma. Al escribir sus términos en orden inverso, sigue siendo $S=9+8+\cdots+1$. Sumamos ambas expresiones término a término: hay nueve sumas y cada una vale $10$. Por tanto $2S=9\cdot10=90$ y, al dividir entre $2$, $S=45$.

Cada número del $1$ al $9$ aparece una vez en cada escritura de $S$; por eso la suma de las dos escrituras es $2S$. El cálculo no depende de sumar primero los nueve términos uno por uno.
:::

La idea sugiere una afirmación general. Para demostrarla debemos describir qué ocurre con una cantidad arbitraria de términos, incluyendo el caso en que esa cantidad sea impar.

:::proposition Suma de enteros consecutivos
Para todo entero positivo $n$,
$$1+2+\cdots+n=\frac{n(n+1)}2.$$
:::

:::proof
Sea $S=1+2+\cdots+n$. Como el orden de una suma finita se puede invertir, también $S=n+(n-1)+\cdots+1$. Al sumar las dos expresiones posición por posición, cada una de las $n$ parejas suma $n+1$: la primera es $1+n$, la segunda es $2+(n-1)$ y la pareja en la posición $i$ es $i+(n+1-i)$.

Por tanto $2S=n(n+1)$. Al dividir ambos lados entre $2$, resulta $S=n(n+1)/2$. El argumento incluye $n$ impar: el término central aparece una vez en cada escritura de $S$, igual que los demás.
:::

Conviene comprobar la fórmula con un caso pequeño.

:::try ¿Qué valor da la fórmula para $1+2+3+4+5$?
Con $n=5$ se obtiene $5(5+1)/2=15$. La suma directa también es $15$.
:::

### Aprovechar lo que sí se sabe

Un problema puede pedir una cantidad sin pedir cada número que interviene en ella. Reconocer qué información es necesaria evita cálculos que no acercan a la respuesta.

:::example
Dos números reales $a$ y $b$ cumplen $a+b=10$ y $ab=21$. Calcular $a^2+b^2$ sin encontrar cada número por separado.

Al desarrollar el cuadrado de la suma, $(a+b)^2=a^2+2ab+b^2$. Restamos $2ab$ de ambos lados y obtenemos $a^2+b^2=(a+b)^2-2ab$. Sustituimos los datos: $a^2+b^2=10^2-2(21)=58$.

La respuesta depende de la suma y el producto, que ya se conocen. Encontrar $a$ y $b$ también sería posible, pero no era necesario para calcular la cantidad pedida.
:::

El avance de un entrenamiento no consiste solamente en recordar esta identidad. También puede consistir en aprender a mirar una expresión y preguntar si contiene exactamente la información del enunciado.

:::mistake
Medir una sesión solo por el número de problemas terminados. Una hoja con intentos sin revisar puede dejar dudas sin resolver; una sesión que termina con una conjetura precisa o un error corregido puede dejar una herramienta para volver a intentarlo. Esto no garantiza una solución inmediata, pero sí permite continuar desde información concreta.
:::

### Revisar, compartir y volver

Explicar una solución a otra persona permite descubrir si faltan definiciones o pasos. También es útil comparar dos soluciones distintas y preguntarse en qué momento usan la misma propiedad de maneras diferentes.

Después de leer una solución ajena, conviene cerrarla e intentar reconstruirla con palabras propias. Si no se puede justificar un paso, esa dificultad señala qué idea hace falta estudiar. Más adelante se puede regresar al problema para comprobar si la explicación sigue siendo comprensible sin consultar la solución.

:::example
Alguien afirma: «Todo entero cuyo cuadrado es par es par, porque $2^2=4$ y $4^2=16$». Explicar qué falta para justificar la afirmación.

Los dos ejemplos muestran que el cuadrado de ciertos enteros pares es par; no cubren todos los enteros ni demuestran la dirección pedida. Para una prueba, supongamos que un entero $n$ es impar: $n=2k+1$ para algún entero $k$. Entonces $n^2=2(2k^2+2k)+1$. Como $2k^2+2k$ es entero, $n^2$ es impar. Por contraposición, si $n^2$ es par, $n$ es par.
:::

:::tip
Al terminar un intento, registrar una idea concreta junto con la siguiente pregunta. Por ejemplo: «La suma se conserva al invertir el orden; ¿qué ocurre si agrego un término?». Así es más fácil retomar el problema sin empezar de cero.
:::

## Agregados culturales

- En enero de 1816, Sophie Germain se convirtió en la primera mujer en ganar un premio de la Academia de Ciencias de París, por su estudio matemático de las vibraciones de placas elásticas. Lo consiguió en su tercer intento, después de que sus dos primeras memorias fueran rechazadas; también hizo aportes a la teoría de números.
- Pablo Soberón Bravo representó a México en la Olimpiada Internacional de Matemáticas de 2006 y recibió una medalla de oro. El registro de la competencia también muestra su participación de 2005.
- El colibrí garganta rubí bate las alas unas $53$ veces por segundo durante el vuelo. El número es aproximado y describe una especie concreta.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Antes de buscar una técnica, escribir qué información ofrece el enunciado y qué cantidad o afirmación se pide. Después comparar la idea usada con otras posibles rutas.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Estos problemas invitan a reconocer una estructura y justificar por qué funciona en todos los casos, no solo en ejemplos pequeños.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problems = [
  exercise('O05','Una suma breve',String.raw`Calcular $1+2+\cdots+8$ y explicar cómo se agruparon los términos.`,['Comparar el primer término con el último.']),
  exercise('O06','Suma y producto',String.raw`Si $a$ y $b$ son reales, $a+b=12$ y $ab=20$, calcular $a^2+b^2$.`,['Desarrollar el cuadrado de la suma.']),
  exercise('O07','Dos impares',String.raw`Demostrar que la suma de dos enteros impares es par.`,['Escribir cada impar como el doble de un entero más uno.']),
  exercise('O08','Una afirmación falsa',String.raw`Una persona afirma que todo entero mayor que $1$ es primo. Dar un contraejemplo y explicar por qué lo es.`,['Buscar un entero mayor que $1$ que tenga un divisor distinto de $1$ y de sí mismo.']),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-O05','TP-O06','TP-O07','TP-O08'], practice: ['TP-D01','TP-A03','TP-C01','TP-G07','TP-N01','TP-C05'], dificiles: ['TP-A01','TP-M02'] } } }
