const pathSlug = 'entrenamiento-mixto-ciclo-1'
const collection = pathSlug
const summary = 'Integrar herramientas del ciclo al resolver problemas sin recibir de antemano el nombre de la técnica.'
const content = String.raw`## Preámbulo: ¿Qué herramienta cabe aquí?

Una estudiante abre un cuaderno de problemas mezclados. En una página se habla de números escritos con cifras, en otra de personas que eligen una clave y en otra aparece una pregunta sobre enteros. A diferencia de una lista temática, ningún título le dice qué herramienta usar.

¿Hay que probar todas las fórmulas conocidas hasta que una funcione? A veces el camino empieza con una observación sencilla: una igualdad que conviene reorganizar, unas posibilidades que se pueden agrupar o una condición que restringe una cifra. La práctica mixta entrena también esa primera decisión.

## Teoría

### Leer antes de clasificar

Al comenzar, distinguir lo dado de lo que se pide. Después conviene probar una representación: escribir un número mediante sus cifras, expresar enteros consecutivos con una variable o hacer una lista corta de posibilidades. No es necesario ponerle nombre a la técnica antes de entender el problema.

Si se pide encontrar todos los objetos, conviene distinguir dos preguntas: ¿cada respuesta propuesta cumple las condiciones?, ¿por qué no hay otras? Si se pide demostrar una afirmación para cualquier entero, se necesita una razón general. Para contar, en cambio, hay que asegurarse de que cada objeto se cuente una vez y de que ninguno quede fuera. Estas preguntas siguen siendo útiles aunque todavía no se haya elegido una técnica.

Una palabra puede orientar, pero no decide por sí sola. «Número» aparece en problemas de divisibilidad, de conteo y de álgebra. La pregunta útil es qué relación puede extraerse de las condiciones y cómo se conecta con la conclusión.

:::try Tres enteros consecutivos se escriben $n$, $n+1$ y $n+2$. ¿Qué se puede decir de su suma?
Al sumar y agrupar, $n+(n+1)+(n+2)=3n+3=3(n+1)$. Como $n+1$ es entero, la suma es múltiplo de $3$ para cualquier entero $n$.
:::

La representación de consecutivos permitió ver un factor común. Probar $4+5+6=15$ ayuda a entender la afirmación, pero no reemplaza el argumento que cubre todos los enteros.

### Encontrar la relación importante

:::example
Dos números reales $a$ y $b$ cumplen $a+b=7$ y $ab=10$. Encontrar $a^2+b^2$ sin calcular $a$ y $b$ por separado.

Al desarrollar la suma al cuadrado, $(a+b)^2=a^2+2ab+b^2$. Restamos $2ab$ de ambos lados y sustituimos los datos $a+b=7$ y $ab=10$:
$$a^2+b^2=7^2-2\cdot10=29.$$
El valor está determinado por las dos cantidades dadas. En este caso existen números que cumplen las condiciones, por ejemplo $a=5$ y $b=2$, cuya suma de cuadrados también es $29$.
:::

El problema no pidió resolver una ecuación para hallar cada número. La identidad conecta directamente los datos con la expresión buscada. En otra pregunta podría ser útil encontrar los valores por separado; aquí no fue necesario.

### Organizar posibilidades

:::example
Se eligen seis números distintos de $1,2,\ldots,9$. Demostrar que dos de los elegidos suman $10$.

Agrupamos los números en cinco conjuntos: $\{1,9\}$, $\{2,8\}$, $\{3,7\}$, $\{4,6\}$ y $\{5\}$. Si cada conjunto contuviera como máximo un número elegido, habría a lo más cinco elegidos. Como hay seis, algún conjunto contiene al menos dos. El conjunto $\{5\}$ no puede contener dos números distintos, de modo que ese conjunto es una de las cuatro parejas; sus integrantes suman $10$.
:::

La elección de los grupos importa: cada pareja reúne números con la suma deseada. La última revisión explica por qué el grupo formado solo por $5$ no puede ser el que contiene dos elegidos.

:::mistake
Tratar una lista de ejemplos como una demostración de que siempre ocurre algo. En el problema anterior no basta encontrar dos números que suman $10$ en una selección particular: se necesita un argumento para cualquier selección permitida.
:::

### Preparar y revisar una sesión mixta

Se pueden elegir varios problemas de temas diferentes sin mirar sus soluciones. Para cada uno, anotar qué se sabe, qué se busca y una primera observación. Una hoja puede incluir intentos incompletos; después habrá que separar lo descubierto de lo que aún falta demostrar.

Si un problema no avanza, es razonable cambiar de representación, hacer una pausa o consultar una pista. Conviene registrar en qué momento apareció la ayuda. Al volver, intentar reconstruir la solución y señalar por qué se podía usar la herramienta elegida.

:::tip
Al terminar cada problema, escribir una frase sobre la decisión decisiva: «agrupé por parejas que suman $10$» o «desarrollé el cuadrado de la suma». Después revisar que las condiciones de esa decisión se cumplieron.
:::

Una sesión mixta no es una competencia oficial ni necesita resolverse con reloj. El propósito es practicar la elección de herramientas y la claridad de las explicaciones. Un problema pendiente también puede servir para decidir qué concepto conviene repasar.

## Agregados culturales

- Los *Elementos* de Euclides están organizados en trece libros. Entre sus temas hay geometría y teoría de números; el libro séptimo incluye el algoritmo para el máximo común divisor.
- La decimotercera Olimpiada Internacional de Matemáticas se celebró en Žilina, entonces Checoslovaquia, en 1971. Participaron $115$ estudiantes de $15$ países.
- Las abejas de miel construyen panales de cera con celdas hexagonales. Un panal permite observar formas geométricas en una estructura hecha por animales.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Intentar identificar los datos y la pregunta antes de buscar una herramienta. Explicar por qué se puede aplicar en cada caso.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Conservar los intentos parciales, revisar las hipótesis y escribir una demostración que cubra todos los casos.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problems = [
  exercise('X01', 'Cinco consecutivos', String.raw`Demostrar que la suma de cinco enteros consecutivos es divisible por $5$.`, ['Llamar $n$ al menor de los cinco enteros.']),
  exercise('X02', 'Cifras diferentes', String.raw`¿Cuántos números de tres cifras distintas se pueden formar con las cifras $1$, $2$, $3$ y $4$?`, ['Elegir sucesivamente la centena, la decena y la unidad.']),
  exercise('X03', 'Una escritura distinta', String.raw`Convertir $(21)_3$ a decimal y explicar el valor de sus cifras.`, ['La primera posición vale $3$ y la segunda vale $1$.']),
  exercise('X04', 'Una suma conocida', String.raw`Si $a$ y $b$ son reales, $a+b=8$ y $ab=12$, calcular $a^2+b^2$.`, ['Desarrollar $(a+b)^2$ y despejar la suma buscada.']),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-X01','TP-X02','TP-X03','TP-X04'], practice: ['TP-G07','TP-A03','TP-N01','TP-C02','TP-D01','TP-C05'], dificiles: ['TP-A01','TP-M02'] } } }
