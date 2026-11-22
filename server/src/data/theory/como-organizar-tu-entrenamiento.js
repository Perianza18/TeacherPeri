const pathSlug = 'como-organizar-tu-entrenamiento'
const collection = pathSlug
const summary = 'Diseñar una rutina de práctica realista que incluya resolver, escribir, revisar y volver a intentar problemas.'
const content = String.raw`## Preámbulo: El cuaderno que quedó abierto

Un domingo alguien encuentra una lista de problemas interesantes y decide resolverla toda esa semana. El lunes tiene tarea, el martes llega cansado y el miércoles solo dispone de un rato. Cuando por fin abre el cuaderno, no recuerda cuál era el problema que quería intentar ni por dónde había empezado.

¿Será necesario tener tardes enteras libres para entrenar? ¿O se puede preparar un plan que también funcione en semanas ocupadas? Organizarse consiste en hacer espacio para pensar y dejar una pista que facilite regresar, no en llenar cada minuto.

## Teoría

### Empezar por el tiempo disponible

Una rutina útil cabe en la vida de quien la usa. Conviene mirar primero los compromisos de la semana y elegir unos pocos espacios posibles. Una sesión corta en la que se intenta un problema y se anota una idea puede servir; una sesión más larga permite explorar y escribir con calma. Las cantidades que siguen son ejemplos, no una cuota que haya que cumplir.

Por ejemplo, una estudiante dispone de tres espacios: $25$ minutos el lunes, $30$ el miércoles y $20$ el sábado. Puede reservar el primero para intentar un problema, el segundo para continuar y redactar lo descubierto, y el tercero para revisar la solución o intentar una variante. Si el miércoles no puede, el plan se ajusta: no es necesario recuperar cada minuto perdido.

:::try ¿Cuánto tiempo suman esos tres espacios?
Sumamos $25+30+20=75$ minutos. El total ayuda a saber cuánto cabe en la semana, pero no determina por sí solo cuánto se aprenderá: importa también qué se hace durante las sesiones.
:::

### Darle un trabajo a cada sesión

Una sesión de entrenamiento puede combinar varias actividades. **Explorar** significa entender un enunciado, probar casos y buscar relaciones. **Escribir** significa ordenar una idea y justificarla. **Revisar** significa comprobar condiciones y pasos, o estudiar una solución después de haberlo intentado. No es indispensable completar las tres etapas en una sola tarde.

:::example
Una persona deja este registro al terminar una sesión:

«Problema: encontrar dos enteros consecutivos con producto $72$. Encontré $8$ y $9$, pero todavía debo comprobar si hay otras parejas. Próximo paso: llamar $n$ al menor y usar $n(n+1)=72$.»

El registro distingue una respuesta encontrada de la tarea pendiente. En la siguiente sesión no hace falta volver a empezar desde cero: hay una pregunta concreta y un posible primer paso.
:::

La nota no tiene que ser larga. Basta con conservar el enunciado o su ubicación, una idea probada, lo que aún falta y una acción para continuar. Si una idea no funcionó, registrar por qué puede evitar que se repita el mismo intento sin cambios.

### Mezclar y volver

También conviene regresar a un problema después de un intervalo. Sin mirar la solución, se puede intentar reconstruir su idea principal y explicar por qué funciona. Si se olvidó, consultar la parte necesaria y volver a intentarlo más tarde. Esto es distinto de leer una solución tantas veces que sus frases resulten familiares.

:::example
El lunes se estudia por qué la suma de dos enteros impares es par. ¿Cómo podría reconstruirse la explicación el sábado sin mirar los apuntes?

Se toman dos impares arbitrarios $2r+1$ y $2s+1$, con $r$ y $s$ enteros. Al sumar se obtiene $2(r+s+1)$, que es par porque $r+s+1$ es entero. Después se compara la explicación con la anterior para revisar si falta algún paso.
:::

Cambiar de tema de vez en cuando también ofrece una pregunta nueva: ¿qué herramienta es adecuada cuando nadie anuncia el nombre de la técnica? Una práctica mixta puede incluir problemas de números, conteo y álgebra que ya se conozcan, sin exigir estudiar todos los temas al mismo tiempo.

:::mistake
Medir una semana únicamente por la cantidad de problemas terminados. Un problema que todavía no se resuelve puede dejar una observación útil, un caso descartado o una duda precisa. Aun así, es importante regresar, estudiar lo que falta y no confundir actividad con una demostración terminada.
:::

### Ajustar el plan

Al final de una semana, revisar qué espacios sí funcionaron, qué quedó pendiente y qué se desea probar después. Si una sesión fue demasiado larga, se puede hacer más corta; si un problema fue inaccesible, se puede buscar uno relacionado más sencillo o leer una pista. Descansar y tener otras actividades también forma parte de un horario posible.

:::tip
Elegir la próxima acción antes de cerrar el cuaderno: por ejemplo, «comprobar el caso negativo» o «escribir por qué estas opciones son todas». Una tarea pequeña y concreta facilita retomar el hilo.
:::

Un plan no es un examen. Si cambian los horarios o aparece curiosidad por otro tema, se puede modificar. La meta es construir una manera de regresar a las preguntas, dar tiempo a las ideas y revisar lo aprendido.

## Agregados culturales

- Maryam Mirzakhani y Roya Beheshti integraron el equipo de Irán en la Olimpiada Internacional de Matemáticas de 1994. Mirzakhani participó nuevamente en 1995 y obtuvo medalla de oro en ambas ocasiones.
- La quinta Olimpiada Internacional se realizó en Wrocław, Polonia, en 1963. Participaron $64$ estudiantes de $8$ países.
- Una revisión de estudios sobre educación en profesiones de salud examinó la práctica distribuida y la recuperación de información de la memoria. Estas ideas motivan una prueba personal: volver a una explicación después de un tiempo e intentar reconstruirla antes de consultar los apuntes.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Elegir uno para una primera sesión. Al terminar, anotar qué se probó y cuál será el siguiente paso, aunque la solución todavía no esté completa.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Reservar tiempo para volver a la idea y escribir una demostración completa. Después de consultar una pista o solución, intentar reconstruir el argumento sin mirarlo.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problems = [
  exercise('O25', 'Un producto pendiente', String.raw`Encontrar todas las parejas de enteros consecutivos cuyo producto es $12$. Registrar un primer intento y después justificar que la lista es completa.`, ['Llamar $n$ al menor de los enteros y factorizar $n^2+n-12$.']),
  exercise('O26', 'Una idea para recuperar', String.raw`Demostrar que la suma de dos múltiplos enteros de $5$ es múltiplo de $5$. Después, intentar reconstruir la demostración sin consultar las notas.`, ['Escribir cada sumando como $5$ multiplicado por un entero.']),
  exercise('O27', 'Cambiar de pregunta', String.raw`Encontrar todos los enteros positivos cuyo cuadrado es menor que $20$. Explicar por qué no hay más.`, ['Comparar $4^2$ y $5^2$ con $20$.']),
  exercise('O28', 'Preparar el siguiente paso', String.raw`Encontrar todos los números de dos cifras cuya suma de cifras es $8$ y cuya cifra de las decenas es el triple de la de unidades.`, ['Llamar $u$ a la cifra de las unidades y expresar la cifra de las decenas en función de $u$.']),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-O25','TP-O26','TP-O27','TP-O28'], practice: ['TP-A02','TP-N02','TP-C05','TP-C06','TP-D03','TP-N08'], dificiles: ['TP-A01','TP-M02'] } } }
