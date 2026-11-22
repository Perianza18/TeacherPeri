const pathSlug = 'contraposicion'
const collection = pathSlug
const summary = 'Reformular una implicación mediante su contraposición y demostrarla sin confundirla con la recíproca.'
const content = String.raw`## Preámbulo: Una pista en el juego

En un juego, la pantalla se ilumina siempre que todas las respuestas son correctas. Si al terminar no se iluminó, ¿pueden haber sido correctas todas las respuestas? La regla describe qué ocurre cuando se acierta todo; la pregunta parte de lo que no ocurrió.

En matemáticas, esta clase de pista permite cambiar una pregunta por otra sin cambiar su respuesta. La dificultad está en negar las dos partes con precisión y en no intercambiarlas sin negarlas. Veremos cuándo el cambio simplifica la prueba y cómo regresar a la afirmación original.

## Teoría

### Una implicación y su contrapositiva

Sean $P$ y $Q$ dos afirmaciones sobre un mismo objeto de un dominio fijado. La implicación «si $P$, entonces $Q$» afirma que no existe un objeto para el cual $P$ sea verdadera y $Q$ sea falsa. Su **contrapositiva** es «si no $Q$, entonces no $P$».

La negación depende del dominio y de la afirmación completa. Por ejemplo, si $n$ es entero, negar «$n$ es par» da «$n$ es impar»; si $x$ es real, negar «$x>0$» da «$x\le0$», que incluye el cero.

:::proposition Equivalencia de la contraposición
Una implicación «si $P$, entonces $Q$» es verdadera exactamente cuando su contrapositiva «si no $Q$, entonces no $P$» es verdadera.
:::

:::proof
Supongamos verdadera la implicación original y consideremos un objeto para el cual $Q$ es falsa. Si $P$ fuera verdadera para ese objeto, la implicación original obligaría a que $Q$ fuera verdadera, lo cual contradice que es falsa. Por tanto $P$ es falsa: queda probada la contrapositiva.

Recíprocamente, supongamos verdadera la contrapositiva y consideremos un objeto para el cual $P$ es verdadera. Si $Q$ fuera falsa, la contrapositiva obligaría a que $P$ fuera falsa, contradiciendo que es verdadera. Por tanto $Q$ es verdadera y queda probada la implicación original.
:::

Una prueba por contraposición demuestra directamente «no $Q$ implica no $P$» y después usa esta equivalencia para concluir «$P$ implica $Q$». Las hipótesis sobre el dominio siguen vigentes durante toda la prueba.

:::try Si $x$ es real, ¿cuál es la negación de $x\ge2$?
Es $x<2$. El valor $x=2$ pertenece a la afirmación original y no a su negación.
:::

### Negar y desarrollar

La contraposición resulta útil cuando negar la conclusión ofrece una forma algebraica manejable. Para enteros, «no es par» equivale a «es impar».

:::proposition Un cuadrado par
Si $n$ es un entero y $n^2$ es par, entonces $n$ es par.
:::

:::proof
Demostraremos la contrapositiva: si $n$ es impar, entonces $n^2$ es impar. Si $n$ es impar, existe un entero $k$ con $n=2k+1$. Al desarrollar el cuadrado,
$$n^2=4k^2+4k+1.$$
Como $n^2=2(2k^2+2k)+1$ y $2k^2+2k$ es entero, $n^2$ es impar. Esto prueba la contrapositiva. Por su equivalencia con la implicación original, si $n^2$ es par, entonces $n$ es par.
:::

:::example
Demostrar por contraposición que si el triple de un entero $n$ es impar, entonces $n$ es impar.

La contrapositiva dice: si $n$ es par, entonces $3n$ es par. Si $n=2k$ para algún entero $k$, entonces $3n=3(2k)=2(3k)$. Como $3k$ es entero, $3n$ es par. Por contraposición queda demostrada la afirmación pedida.
:::

:::mistake
Confundir contrapositiva y recíproca. La recíproca de «si un entero es divisible por $4$, entonces es par» es «si es par, entonces es divisible por $4$»; es falsa para $6$. La contrapositiva cambia el orden y niega ambas partes: «si no es par, entonces no es divisible por $4$».
:::

### Negar una condición compuesta

Cuando la conclusión contiene «y», su negación indica que al menos una de las dos partes falla. Por ejemplo, «$a$ y $b$ son impares» se niega diciendo «$a$ es par o $b$ es par»; el «o» incluye que ambos sean pares.

:::example
Demostrar que si el producto de dos enteros $a$ y $b$ es impar, entonces ambos son impares.

Probamos la contrapositiva: si $a$ es par o $b$ es par, entonces $ab$ es par. Si $a=2r$ con $r$ entero, $ab=2(rb)$, y $rb$ es entero; por eso $ab$ es par. Si $b=2s$ con $s$ entero, $ab=2(as)$, y $as$ es entero; también en este caso $ab$ es par.

Los casos cubren que al menos uno sea par, incluso si ambos lo son. Por contraposición, si $ab$ es impar, ninguno de los dos es par y ambos son impares.
:::

:::tip
Escribir primero la implicación original con sus dominios, luego negar su conclusión y su hipótesis por separado. Solo después intercambiar el orden y comprobar que la nueva afirmación sea más fácil de demostrar.
:::

### La dirección importa

Una implicación no dice que su conclusión solo pueda obtenerse de una manera. Demostrar la recíproca por accidente puede dejar sin resolver el problema, aunque esa otra afirmación también sea verdadera.

:::example
Escribir la contrapositiva de «si $x$ es un real mayor que $5$, entonces $x$ es positivo» y justificarla.

La negación de «$x$ es positivo» es $x\le0$; la negación de «$x>5$» es $x\le5$. La contrapositiva es: si $x\le0$, entonces $x\le5$. Es verdadera porque $x\le0<5$. Por la equivalencia, la afirmación original también es verdadera.
:::

## Agregados culturales

- Aristóteles estudió formas de razonamiento deductivo y escribió obras sobre lógica. Sus *Analíticos* examinan cómo se relacionan premisas y conclusiones.
- La decimoquinta Olimpiada Internacional de Matemáticas se celebró en 1973 en Moscú. Participaron $125$ estudiantes de $16$ países.
- En 1984 una misión del transbordador espacial llevó abejas al espacio. Después de dificultades iniciales, las abejas pudieron volar en su módulo durante la misión.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Escribir la negación completa de cada parte antes de intercambiarlas. Demostrar la contrapositiva y terminar indicando qué afirma la implicación original.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

La dificultad está en combinar negaciones o estudiar varios residuos para justificar una implicación sobre todos los enteros permitidos.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problem = (code, titulo, enunciado, difficulty = 'basico') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })
const problems = [
  exercise('P21','Cuadrado impar',String.raw`Demostrar por contraposición que si el cuadrado de un entero $n$ es impar, entonces $n$ es impar.`,['Considerar qué ocurre con el cuadrado de un entero par.']),
  exercise('P22','Cinco veces un entero',String.raw`Demostrar por contraposición que si $5n$ es impar para un entero $n$, entonces $n$ es impar.`,['Suponer que $n$ es par y escribirlo como el doble de un entero.']),
  exercise('P23','Una desigualdad negada',String.raw`Escribir la contrapositiva de «si $x$ es real y $x>3$, entonces $x>1$» y demostrarla.`,['Negar cada desigualdad incluyendo el caso de igualdad.']),
  exercise('P24','Un producto no nulo',String.raw`Demostrar por contraposición que si $ab\ne0$ para reales $a,b$, entonces $a\ne0$ y $b\ne0$.`,['Negar la conclusión: al menos uno de los dos factores es cero.']),
  problem('P25','Un cuadrado y tres',String.raw`Demostrar por contraposición que si $n^2$ es divisible por $3$ para un entero $n$, entonces $n$ es divisible por $3$.`),
  problem('P26','Cuadrado no múltiplo de cuatro',String.raw`Demostrar por contraposición que si $n^2$ no es divisible por $4$ para un entero $n$, entonces $n$ es impar.`),
  problem('P27','Producto negativo',String.raw`Demostrar por contraposición que si $ab<0$ para reales $a,b$, entonces al menos uno de ellos es negativo.`),
  problem('P28','Un cuadrado múltiplo de cuatro',String.raw`Demostrar por contraposición que si $n^2$ es divisible por $4$ para un entero $n$, entonces $n$ es par.`),
  problem('P29','Divisibilidad por seis',String.raw`Si $n$ es entero y $n^2$ es divisible por $6$, demostrar que $n$ es divisible por $6$.`,'intermedio'),
  problem('P30','Un primo mayor que dos',String.raw`Demostrar por contraposición que todo número primo mayor que $2$ es impar.`,'intermedio'),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-P21','TP-P22','TP-P23','TP-P24'], practice: ['TP-A02','TP-N08','TP-P25','TP-P26','TP-P27','TP-P28'], dificiles: ['TP-P29','TP-P30'] } } }
