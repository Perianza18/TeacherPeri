const pathSlug = 'que-hacer-cuando-no-puedes-resolver-un-problema'
const collection = pathSlug
const summary = 'Transformar un bloqueo en preguntas concretas, probar una versión relacionada y usar pistas de manera gradual.'
const content = String.raw`## Preámbulo: Tres tarjetas y un número imposible

Sobre una mesa hay tarjetas con los números $1$, $3$, $5$, $7$ y $9$. La consigna pide escoger tres tarjetas distintas cuya suma sea $14$. Alguien prueba $1+3+9=13$, después $1+5+9=15$ y luego cambia una tarjeta una y otra vez. Ninguna suma da $14$.

¿Falta probar la combinación correcta o hay una razón por la que no puede existir? Cuando un problema se resiste, repetir el mismo intento no siempre aporta información. A veces conviene detenerse, precisar la pregunta y mirar una propiedad que comparten los casos probados.

## Teoría

### Nombrar el obstáculo

Estar atorado no significa que se haya trabajado en vano. Puede significar que falta entender una condición, encontrar una idea o justificar un paso. Cada situación pide una acción distinta.

En el problema de las tarjetas sabemos que deben elegirse tres, que son distintas y que cada número escrito es impar. Si las cuentas probadas no dan $14$, podemos preguntar algo más preciso: «¿Qué paridad tiene la suma de tres impares?». Esa pregunta todavía no es una solución, pero apunta a una propiedad que vale para todas las elecciones.

:::try ¿Qué paridad tiene la suma de tres enteros impares?
Sean $2a+1$, $2b+1$ y $2c+1$, con $a$, $b$ y $c$ enteros. Al sumar y agrupar se obtiene $2(a+b+c+1)+1$. Como $a+b+c+1$ es entero, la suma es impar.
:::

El número $14$ es par, así que no puede ser la suma de tres impares. Esto descarta todas las elecciones permitidas, sin revisar una por una. La condición de que las tarjetas sean distintas no fue necesaria para esta imposibilidad: incluso si se permitieran repeticiones, la suma seguiría siendo impar.

### Cambiar una pregunta a la vez

Si no aparece una propiedad útil, se puede estudiar una versión relacionada. Para las mismas tarjetas, pedir una suma de $15$ produce una pregunta distinta: $1+5+9=15$ muestra que esa versión sí tiene solución. Comparar $14$ con $15$ invita a considerar la paridad, pero no demuestra por sí solo la imposibilidad original.

:::example
¿Qué se puede aprender al reducir el problema a dos tarjetas impares?

Si los números son $2a+1$ y $2b+1$, su suma es $2(a+b+1)$ y, por tanto, es par. Dos impares suman un par; al añadir un tercer impar $2c+1$, el resultado es $2(a+b+c+1)+1$, que es impar porque $a+b+c+1$ es entero. La observación sugiere mirar la paridad de la cantidad de tarjetas elegidas. Para resolver la pregunta original se debe justificar el caso de tres, como se hizo arriba.
:::

Otras modificaciones posibles son probar cantidades pequeñas, eliminar temporalmente una condición o resolver el problema para un dato concreto. Es importante anotar qué cambió: resolver la versión sencilla no resuelve automáticamente la original. La pregunta útil es qué parte de la idea puede trasladarse y qué falta comprobar.

### Cambiar de representación

Un enunciado verbal puede escribirse mediante variables, una tabla o una lista ordenada. La representación elegida debe ayudar a ver relaciones, no solo ocupar espacio. Si se busca una suma, escribir los términos como $2a+1$ hace visible su paridad; si se busca contar, una lista organizada puede revelar qué casos se repiten o faltan.

:::example
Encontrar todos los enteros positivos $n$ tales que $n(n+1)=12$.

Como $n$ es positivo, si $n\ge4$ entonces $n(n+1)\ge4\cdot5=20>12$. Solo quedan $n=1,2,3$. Sus productos son $2$, $6$ y $12$, respectivamente. Por tanto la única solución positiva es $n=3$. La cota permite saber dónde termina la búsqueda.
:::

:::mistake
Probar algunos casos y concluir que no hay solución porque ninguno funcionó. Para una lista finita hay que justificar que se revisaron todas las opciones; para una afirmación general se necesita una razón que cubra todos los casos permitidos.
:::

### Pedir ayuda sin perder la pregunta

Una pista puede ser un empujón pequeño: «¿qué propiedad comparten las tarjetas?». Antes de leer más, conviene regresar al problema e intentar usarla. Si no basta, se puede pedir otra pista o estudiar una solución; después, cerrar la fuente e intentar reconstruir el argumento propio, comprobando lo que no se entendió.

:::tip
Al hacer una pausa, guardar tres cosas: lo que se sabe, lo que se intentó y la pregunta concreta que falta responder. Por ejemplo: «las tres tarjetas son impares; probé varias sumas; ¿puede una suma de tres impares ser par?».
:::

No hay una cantidad universal de minutos que demuestre que alguien ya intentó lo suficiente. El tiempo disponible, el cansancio y la dificultad importan. Hacer una pausa, conversar con otra persona o volver otro día también son decisiones válidas; lo valioso es conservar una pregunta a la cual regresar.

## Agregados culturales

- George Pólya escribió sobre la resolución de problemas y aconsejó buscar una pregunta más sencilla relacionada cuando no se sabe cómo avanzar. Su libro *How to Solve It* apareció en inglés en 1945.
- La sexta Olimpiada Internacional de Matemáticas se celebró en Moscú en 1964. Participaron $72$ estudiantes de $9$ países.
- Un día marciano dura aproximadamente $24$ horas y $40$ minutos terrestres. El personal que opera vehículos en Marte utiliza la palabra «sol» para referirse al día marciano.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Antes de buscar una pista, anotar una pregunta concreta y probar un caso pequeño o una representación distinta.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Si aparece una idea parcial, explicar qué demuestra y qué falta. Después de usar una ayuda, intentar reconstruir la solución completa.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problems = [
  exercise('O29', 'Cuatro tarjetas', String.raw`Se eligen cuatro enteros impares. ¿Puede su suma ser $17$? Justificar la respuesta.`, ['Escribir cada impar como $2k+1$ y agrupar los cuatro términos.']),
  exercise('O30', 'Probar una versión', String.raw`Encontrar todos los enteros positivos $n$ tales que $n(n+1)=30$. Explicar cómo saber que no faltan valores.`, ['Comparar el producto para $n=5$ y para enteros positivos mayores.']),
  exercise('O31', 'Una pregunta sobre cifras', String.raw`¿Existe un número decimal de dos cifras cuya suma de cifras sea $2$ y cuya cifra de unidades sea mayor que la de decenas? Justificar.`, ['La cifra de las decenas es al menos $1$.']),
  exercise('O32', 'Explorar y demostrar', String.raw`Demostrar que el producto de dos enteros consecutivos es par. Antes de demostrarlo, probar tres ejemplos y anotar qué tienen en común.`, ['Separar en casos según la paridad del primer entero.']),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-O29','TP-O30','TP-O31','TP-O32'], practice: ['TP-A03','TP-A05','TP-N01','TP-C01','TP-C02','TP-D04'], dificiles: ['TP-N04','TP-M01'] } } }
