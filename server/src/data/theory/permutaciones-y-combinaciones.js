const pathSlug = 'permutaciones-y-combinaciones'
const collection = pathSlug
const summary = 'Contar ordenamientos y selecciones, explicando cuándo el orden cambia el resultado y cuándo produce repeticiones.'
const content = String.raw`## Preámbulo: Un equipo o una fila

Para una actividad se eligen algunas personas de un grupo. Si solo importa quiénes integran el equipo, cambiar el orden en que se nombran no crea otro equipo. Si en cambio esas personas ocupan cargos distintos, cambiar quién ocupa cada cargo sí cambia el resultado.

Las mismas personas pueden dar lugar a preguntas de conteo diferentes. ¿Cómo se relaciona el número de equipos con el número de maneras de asignarles cargos? Para responder, contaremos primero los órdenes y después veremos cuántas veces aparece cada selección.

## Teoría

### Ordenar objetos distintos

Una permutación de objetos distintos es una manera de ordenarlos todos. Si cambiamos de posición dos objetos distintos, obtenemos otro ordenamiento.

Para un entero positivo $n$, escribimos $n!=n(n-1)\cdots2\cdot1$ y leemos «$n$ factorial». También definimos $0!=1$: hay una manera de ordenar cero objetos, la secuencia vacía.

:::proposition Ordenamientos de objetos distintos
Hay $n!$ maneras de ordenar $n$ objetos distintos, para todo entero $n\ge0$.
:::

:::proof
Si $n\ge2$, hay $n$ opciones para la primera posición. Una vez elegida, quedan $n-1$ opciones para la segunda; después quedan $n-2$, y así hasta una opción para la última. Por el principio multiplicativo, hay $n(n-1)\cdots1=n!$ ordenamientos. Para $n=1$ hay un solo orden, que coincide con $1!=1$; para $n=0$ hay una secuencia vacía, que coincide con $0!=1$.
:::

:::example
¿De cuántas maneras se pueden ordenar las letras de la palabra LUNA, usando cada letra una vez?

Sus cuatro letras son distintas. Para las posiciones sucesivas hay $4$, $3$, $2$ y $1$ opciones; por tanto hay $4!=4\cdot3\cdot2\cdot1=24$ ordenamientos. No exigimos que cada orden forme una palabra del diccionario.
:::

:::try ¿Cuántos órdenes distintos tienen tres objetos diferentes?
Son $3!=3\cdot2\cdot1=6$.
:::

### Elegir con cargos

Si se seleccionan solo algunos objetos y el orden importa, el producto se detiene cuando se llenan las posiciones solicitadas. No hace falta ordenar los objetos que quedan fuera.

:::proposition Selección ordenada
Para enteros $n\ge0$ y $0\le k\le n$, hay
$$\frac{n!}{(n-k)!}$$
formas de elegir y ordenar $k$ objetos distintos de un conjunto de $n$ objetos distintos.
:::

:::proof
Si $k>0$, para las $k$ posiciones hay, sucesivamente, $n$, $n-1$, hasta $n-k+1$ opciones. El principio multiplicativo da ese producto. Como $n!$ es ese mismo producto multiplicado por $(n-k)!$, el resultado es $n!/(n-k)!$. Si $k=0$, hay una sola selección ordenada vacía y la fórmula da $n!/n!=1$.
:::

:::example
De $7$ estudiantes distintos se eligen una coordinadora o un coordinador y una persona secretaria. Nadie ocupa ambos cargos. ¿Cuántas asignaciones hay?

Hay $7$ opciones para coordinación y después $6$ para secretaría. Cada asignación identifica quién ocupa cada cargo, así que hay $7\cdot6=42$. Intercambiar los cargos de dos personas produce una asignación distinta.
:::

### Elegir sin ordenar

En un equipo sin cargos, enumerar a sus integrantes en distinto orden no cambia el equipo. Si contamos primero las listas ordenadas, cada equipo aparece varias veces y debemos corregir ese conteo.

:::proposition Combinaciones
Para enteros $n\ge0$ y $0\le k\le n$, la cantidad de subconjuntos de $k$ elementos de un conjunto de $n$ elementos es
$$\binom nk=\frac{n!}{k!(n-k)!}.$$
:::

:::proof
Hay $n!/(n-k)!$ listas ordenadas de $k$ elementos distintos. Cada subconjunto elegido aparece exactamente $k!$ veces en esas listas: sus $k$ elementos pueden ordenarse de $k!$ formas. Además, cada lista proviene de un único subconjunto, el formado por sus elementos.

Si llamamos $C$ al número de subconjuntos, entonces $C\cdot k!=n!/(n-k)!$. Al dividir ambos lados entre $k!$, que es positivo, resulta la fórmula. Para $k=0$, se cuenta el único subconjunto vacío; la fórmula también da $1$.
:::

:::example
De $7$ estudiantes distintos se elige un equipo de $2$ personas sin cargos. ¿Cuántos equipos hay?

Si se asignaran dos cargos habría $7\cdot6=42$ listas ordenadas. Cada equipo de dos personas aparece en dos órdenes, así que hay $42/2=21$ equipos. También se obtiene $\binom72=7!/(2!5!)=21$.
:::

:::mistake
Dividir entre $k!$ cuando los cargos sí distinguen los resultados. Con dos personas, intercambiar coordinación y secretaría cambia la asignación; en un equipo sin cargos, nombrar a esas personas en orden inverso no cambia el equipo.
:::

### Letras repetidas

Si dos letras son iguales, intercambiarlas no cambia la cadena visible. Podemos distinguirlas temporalmente, contar y después agrupar los órdenes que solo difieren en esas etiquetas.

:::example
¿Cuántas cadenas distintas se obtienen al reordenar las cuatro letras de CASA, usando cada una una vez?

Llamemos temporalmente $A_1$ y $A_2$ a las dos letras A. Las cuatro letras etiquetadas admiten $4!=24$ órdenes. Cada cadena visible corresponde exactamente a $2!=2$ órdenes etiquetados, pues se pueden intercambiar $A_1$ y $A_2$ sin cambiarla. Por eso hay $24/2=12$ cadenas distintas.
:::

:::tip
Antes de usar una fórmula, identificar el resultado que se cuenta y preguntar cuántas listas ordenadas representan ese mismo resultado. El divisor debe ser esa cantidad, no una regla aplicada de memoria.
:::

## Agregados culturales

- En 1808 Christian Kramp utilizó la notación $n!$ para el producto de los enteros positivos desde $n$ hasta $1$. Esa escritura permite expresar conteos de ordenamientos de manera breve.
- La duodécima Olimpiada Internacional de Matemáticas se celebró en 1970 en Keszthely, Hungría. Participaron $112$ estudiantes de $14$ países.
- El espejo principal del telescopio espacial James Webb tiene $18$ segmentos. Esos segmentos se alinearon para trabajar como una sola unidad.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Determinar si cambiar el orden modifica el resultado. Si hay letras repetidas, contar cuántas etiquetas distintas representarían la misma cadena visible.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Aquí se combinan las elecciones con restricciones o se cuentan cadenas que tienen más de una clase de símbolo repetido.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problem = (code, titulo, enunciado, difficulty = 'basico') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })
const problems = [
  exercise('C27','Ordenar cuatro',String.raw`¿De cuántas maneras se pueden ordenar cuatro tarjetas distintas?`,['Hay cuatro opciones al inicio y una menos en cada posición siguiente.']),
  exercise('C28','Un equipo',String.raw`De cinco estudiantes distintos se elige un equipo de tres sin cargos. ¿Cuántos equipos hay?`,['Cada equipo aparece en varios órdenes al listar sus integrantes.']),
  exercise('C29','Dos cargos',String.raw`De seis estudiantes distintos se eligen dos para cargos diferentes, sin que nadie ocupe ambos. ¿Cuántas asignaciones hay?`,['Contar las opciones del primer cargo y después las del segundo.']),
  exercise('C30','Letras repetidas',String.raw`¿Cuántas cadenas distintas se forman al reordenar las cuatro letras de MAMA?`,['Distinguir temporalmente las dos M y las dos A.']),
  problem('C31','Equipo de tres',String.raw`De siete estudiantes distintos se elige un equipo de tres sin cargos. ¿Cuántos equipos hay?`),
  problem('C32','Dos funciones',String.raw`De ocho personas distintas se asignan los cargos diferentes de presidencia, secretaría y tesorería. Nadie puede ocupar más de un cargo. ¿Cuántas asignaciones hay?`),
  problem('C33','Dos libros separados',String.raw`Se ordenan cinco libros distintos en una fila. Dos libros determinados no deben quedar juntos. ¿Cuántos órdenes cumplen la condición?`),
  problem('C34','Reordenar ANANA',String.raw`¿Cuántas cadenas distintas se obtienen al reordenar las letras de ANANA, usando todas?`),
  problem('C35','Equipo con restricción',String.raw`De ocho estudiantes distintos se elige un equipo de cuatro sin cargos. Dos estudiantes determinados no pueden estar ambos en el equipo. ¿Cuántos equipos se pueden formar?`,'intermedio'),
  problem('C36','Una cadena de colores',String.raw`¿Cuántas cadenas distintas de seis símbolos se forman con tres R iguales, dos A iguales y una V, usando todos los símbolos?`,'intermedio'),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-C27','TP-C28','TP-C29','TP-C30'], practice: ['TP-C03','TP-C04','TP-C31','TP-C32','TP-C33','TP-C34'], dificiles: ['TP-C35','TP-C36'] } } }
