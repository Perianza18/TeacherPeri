const pathSlug = 'que-es-la-omm'
const collection = pathSlug
const summary = 'Conocer el propósito de la Olimpiada Mexicana de Matemáticas y explorar qué hace que un razonamiento sea una solución.'
const content = String.raw`## Preámbulo: Una respuesta que necesita razones

En un juego se reciben tres tarjetas con números enteros consecutivos y se gana si la suma es múltiplo de tres. ¿Hay alguna elección que haga perder? La regla permite usar también números negativos y el cero.

Al probar $4+5+6=15$ y $10+11+12=33$ se gana en ambos casos. Pero probar ejemplos deja una pregunta abierta: ¿hay alguna razón que explique todos los casos a la vez? Esa búsqueda de una explicación es parte del tipo de trabajo que se practica en las olimpiadas de matemáticas.

## Teoría

### Una olimpiada de problemas

La Olimpiada Mexicana de Matemáticas, abreviada OMM, es un programa de la Sociedad Matemática Mexicana que promueve el estudio creativo de las matemáticas. Su Concurso Nacional está dirigido a estudiantes preuniversitarios. Además de calcular, los problemas invitan a explorar relaciones, formular ideas y justificar conclusiones.

Un problema puede empezar con una situación fácil de entender y necesitar una idea que no se anuncia en el enunciado. En esta lección exploraremos una idea, buscaremos una respuesta y explicaremos por qué funciona.

En varias etapas se piden razonamientos escritos. Las convocatorias y modalidades pueden cambiar y los procesos estatales tienen organización propia: para participar hay que consultar la convocatoria vigente y al comité correspondiente. Una estrategia de entrenamiento no reemplaza esas indicaciones.

### Del patrón a la explicación

Regresemos a los tres enteros consecutivos. En lugar de probar muchas ternas, podemos representar una terna cualquiera y observar qué permanece igual cuando cambia el primer número.

:::proposition Tres consecutivos
La suma de tres enteros consecutivos es divisible por $3$.
:::

:::proof
Sea $n$ un entero cualquiera. Los tres enteros consecutivos que empiezan en $n$ son $n$, $n+1$ y $n+2$. Al sumar y reunir términos,
$$n+(n+1)+(n+2)=3n+3.$$
Al sacar factor $3$, obtenemos $3n+3=3(n+1)$. Como $n+1$ es entero, la suma es $3$ por un entero y, por definición, es divisible por $3$. La elección de $n$ fue arbitraria, así que la conclusión incluye también ternas con cero o enteros negativos.
:::

Los dos ejemplos iniciales sugieren la afirmación; la expresión $3(n+1)$ explica por qué es verdadera. El papel de los ejemplos es ayudar a descubrir o comprobar una idea, no sustituir el argumento general.

:::try ¿Qué cambia si los tres enteros empiezan en $-2$?
La terna es $-2,-1,0$ y suma $-3$. La prueba también se aplica con $n=-2$: $3(n+1)=3(-1)=-3$.
:::

### Encontrar y justificar

En un problema que pide todos los valores posibles, hay dos tareas: encontrar candidatos y justificar que no falta ninguno. Para ver la diferencia, usemos las cifras de un número de dos dígitos.

:::example
Un número decimal de dos cifras no nulas tiene suma de cifras $9$. Al invertir sus cifras se obtiene un número $27$ menor que el original. Determinar el número y justificar que es el único.

Sea $a$ la cifra de las decenas y $b$ la de las unidades. La suma da $a+b=9$ y la diferencia entre el número y su inversión es $(10a+b)-(10b+a)=9(a-b)$. Por la segunda condición, $9(a-b)=27$, de modo que $a-b=3$.

Al sumar $a+b=9$ y $a-b=3$, los términos con $b$ se cancelan: $2a=12$ y $a=6$. Entonces $b=9-6=3$. Cualquier número que cumpla las condiciones debe ser $63$. Al comprobarlo, $6+3=9$ y $63-36=27$; por tanto $63$ cumple ambas condiciones y es el único.
:::

La comprobación final confirma que el candidato funciona. La deducción anterior explica por qué ningún otro número permitido puede ser solución; ambas partes hacen falta para cerrar la búsqueda.

:::mistake
Confundir una respuesta acertada con una solución completa. Si solo se escribe «$63$», falta explicar cómo se obtuvo, comprobar las condiciones y justificar por qué no hay otro número. Un argumento permite que otra persona revise esas decisiones.
:::

### Empezar a explorar

No hace falta reconocer una técnica desde la primera lectura. Una forma de comenzar es separar los datos de la pregunta, probar casos pequeños que respeten las condiciones y anotar qué cambia y qué permanece. Después se puede formular una conjetura precisa y buscar una razón general.

:::example
Determinar si la suma de dos enteros impares es siempre par.

Dos ejemplos son $1+3=4$ y $-1+5=4$, pero no bastan como prueba. Sean $a=2r+1$ y $b=2s+1$ impares cualesquiera, con $r,s$ enteros. Al sumar se obtiene $a+b=2r+2s+2$. Al sacar factor $2$,
$$a+b=2(r+s+1).$$
Como $r+s+1$ es entero, la suma es par. El razonamiento vale para cualesquiera dos enteros impares, no solo para los ejemplos calculados.
:::

:::tip
Al revisar un intento, buscar una afirmación concreta que falte justificar: por qué un número es entero, por qué los casos cubren todas las posibilidades o por qué un candidato cumple el enunciado. Esa pregunta puede señalar el siguiente paso.
:::

## Agregados culturales

- En 1987 la Sociedad Matemática Mexicana organizó la primera Olimpiada Mexicana de Matemáticas. Desde entonces la OMM ha reunido a estudiantes interesados en resolver problemas.
- La primera edición de *How to Solve It*, de George Pólya, apareció en 1945. El libro aborda estrategias para comprender y resolver problemas matemáticos.
- Las sondas Voyager, lanzadas en 1977, llevan discos con sonidos e imágenes seleccionados para representar aspectos de la vida y la cultura de la Tierra. Son dos ejemplares de un mismo mensaje.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Antes de resolver, identificar qué se pide y qué condiciones deben respetarse. Después de explorar ejemplos, escribir una explicación que permita comprobar la respuesta.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

En estos problemas hace falta transformar la información o descartar una posibilidad; probar unos pocos valores no basta para justificar la conclusión.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problems = [
  exercise('O01','Cuatro números consecutivos',String.raw`Demostrar que la suma de cuatro enteros consecutivos es par.`,['Llamar $n$ al primero y escribir los demás en función de $n$.']),
  exercise('O02','Una cifra y otra',String.raw`Un número decimal de dos cifras no nulas tiene suma de cifras $8$ y su cifra de las decenas supera por $2$ a la de las unidades. Determinar el número y justificar que es único.`,['Llamar $a$ y $b$ a las cifras y escribir las dos condiciones.']),
  exercise('O03','Una clave',String.raw`Una clave consta de una letra de $\{A,B,C\}$ seguida de un dígito de $\{0,1,2,3,4\}$. ¿Cuántas claves distintas hay? Justificar el conteo.`,['Para cada letra hay la misma cantidad de opciones para el dígito.']),
  exercise('O04','Otro impar',String.raw`Demostrar que si $n$ es un entero impar, entonces $n+2$ es impar.`,['Escribir $n=2k+1$ para algún entero $k$.']),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-O01','TP-O02','TP-O03','TP-O04'], practice: ['TP-N01','TP-A03','TP-C01','TP-G07','TP-N02','TP-C05'], dificiles: ['TP-A01','TP-M02'] } } }
