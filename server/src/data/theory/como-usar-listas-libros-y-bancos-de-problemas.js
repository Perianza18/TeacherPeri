const pathSlug = 'como-usar-listas-libros-y-bancos-de-problemas'
const collection = pathSlug
const summary = 'Elegir recursos de práctica según una pregunta, registrar los intentos y aprovechar pistas y soluciones sin depender de una sola fuente.'
const content = String.raw`## Preámbulo: Una mochila llena de problemas

Una estudiante recibe una lista de cien problemas, encuentra un libro con cientos más y descubre un banco que permite buscar por tema. Cada recurso parece prometer una buena preparación. Al final de la tarde ha guardado muchas páginas, pero todavía no ha elegido un problema para intentar.

¿Cómo se decide por dónde empezar cuando hay tanto material? No hace falta terminar todos los libros ni reunir todas las listas. Un recurso se vuelve útil cuando permite elegir una pregunta, pensar en ella y regresar a lo aprendido.

## Teoría

### Elegir una herramienta para una meta

Una **lista de problemas** reúne preguntas para practicar; puede enfocarse en un tema o mezclar varios. Un **libro** puede ofrecer explicaciones y ejemplos, además de problemas. Un **banco de problemas** permite consultar una colección y, según el sitio, buscar por tema, dificultad u otras características. Un mismo recurso puede combinar estas formas.

La elección depende de lo que se busca. Si una definición es nueva, un texto con ejemplos puede ayudar a comprenderla. Si ya se conoce una herramienta y se quiere practicar su uso, una lista temática ofrece oportunidades para ensayarla. Si se desea decidir qué técnica usar sin que el título la anuncie, una selección mixta puede ser más apropiada.

:::try Una persona entiende la definición de impar, pero quiere practicar cómo usarla en demostraciones. ¿Qué podría buscar?
Una lista breve de problemas sobre paridad y demostración sería una opción. También puede elegir en un banco problemas que pidan justificar propiedades de pares e impares. Conviene leer cada enunciado, porque una etiqueta por sí sola no garantiza que el ejercicio sea adecuado.
:::

### Leer el enunciado antes de mirar la respuesta

Elegir pocos problemas permite dedicarles atención. Conviene comprobar qué se pide, qué condiciones hay y qué conocimientos parecen necesarios. Una etiqueta de dificultad orienta, pero no es una medida exacta para todas las personas: un problema que resulta conocido para una puede ser nuevo para otra.

:::example
Una lista propone: «Demostrar que la suma de dos enteros pares es par». ¿Cómo se puede usar este problema después de leer la definición de par?

Sean $a$ y $b$ enteros pares. Por definición existen enteros $r$ y $s$ con $a=2r$ y $b=2s$. Al sumar, $a+b=2(r+s)$. Como $r+s$ es entero, la suma es par. Después de escribir esta prueba se puede preguntar qué cambia si uno de los sumandos es impar.
:::

Para esa variante, si el primer sumando es $2r$ y el segundo es $2s+1$, su suma es $2(r+s)+1$, que es impar porque $r+s$ es entero. Comparar las dos pruebas ayuda a ver dónde se usó cada condición.

### Usar el libro como compañero

Al leer un capítulo, puede ser tentador avanzar de corrido hasta el último ejemplo. Una alternativa es pausar antes de la solución e intentar el problema con las definiciones disponibles. Después, comparar las ideas y revisar los pasos que no se habían encontrado. Si un pasaje depende de una definición anterior, vale la pena regresar a ella.

:::mistake
Considerar que se domina un tema por haber terminado una lectura o marcado todas las páginas. Una mejor comprobación es explicar una idea sin consultar el texto y usarla en un problema nuevo. Si no sale, volver al ejemplo aporta información sobre qué falta practicar.
:::

Una solución publicada también se puede revisar. Comprobar que las hipótesis coinciden con el enunciado, preguntar por qué funciona cada paso y verificar las cuentas. Si hay una duda o un posible error, conservar la referencia exacta facilita pedir ayuda y consultar otra fuente.

### Hacer un registro que permita regresar

Un registro sencillo puede incluir el título o enlace del recurso, el enunciado o número del problema, la fecha, una idea intentada y una próxima acción. No necesita ser una tabla complicada. La marca «pendiente» es útil si va acompañada de algo más concreto: «entendí por qué ambos números son pares; falta justificar que la suma también lo es».

:::example
En una sesión se intenta encontrar todos los enteros positivos $n$ con $n^2<10$. ¿Qué anotación permite retomar el trabajo?

Una posible nota es: «Probé $1$, $2$ y $3$; sus cuadrados son $1$, $4$ y $9$. Falta explicar por qué no sirven enteros positivos mayores». Para terminar, si $n\ge4$, entonces $n^2\ge16>10$. Por ello las únicas respuestas son $1$, $2$ y $3$.
:::

:::tip
Usar las pistas por etapas: leer una, cerrar el texto y volver al intento. Si todavía no basta, consultar otra o estudiar la solución completa. Después, escribir con palabras propias qué permitió avanzar y por qué el argumento es válido.
:::

Una colección extensa no es una carrera. Está bien saltar temporalmente un problema, estudiar un ejemplo más sencillo o volver después. Conservar la fuente y lo intentado convierte una carpeta de materiales en un camino que se puede recorrer.

## Agregados culturales

- Christian Goldbach y Leonhard Euler intercambiaron cartas sobre problemas de teoría de números. En esa correspondencia discutieron preguntas acerca de números primos y otras propiedades de los enteros.
- La octava Olimpiada Internacional de Matemáticas se celebró en Sofía, Bulgaria, en 1966. Participaron $72$ estudiantes de $9$ países.
- Los colibríes pueden mantenerse suspendidos en el aire y volar hacia atrás. Sus alas producen sustentación tanto en el movimiento hacia abajo como en el movimiento hacia arriba.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Elegir un problema, anotar dónde se encontró y escribir una pregunta concreta antes de consultar una pista.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Después de estudiar un argumento, intentar reconstruirlo sin mirar y señalar qué hipótesis se usaron.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problems = [
  exercise('O37', 'Una lista de paridad', String.raw`Demostrar que la suma de un entero par y uno impar es impar. Registrar qué definición se usa para cada sumando.`, ['Escribir los sumandos como $2r$ y $2s+1$, con $r$ y $s$ enteros.']),
  exercise('O38', 'Después del ejemplo', String.raw`Encontrar todos los enteros positivos $n$ tales que $n^2<30$. Justificar por qué no hay otros.`, ['Comparar $5^2$ y $6^2$ con $30$.']),
  exercise('O39', 'Revisar una afirmación', String.raw`Una lista afirma que la suma de dos enteros impares siempre es impar. ¿Es correcta? Justificar la respuesta.`, ['Probar primero con $1+3$ y después considerar dos impares arbitrarios.']),
  exercise('O40', 'Una variante', String.raw`Demostrar que la suma de tres enteros pares es par. Explicar cómo se adapta la idea de la suma de dos pares.`, ['Escribir cada sumando como $2$ multiplicado por un entero.']),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-O37','TP-O38','TP-O39','TP-O40'], practice: ['TP-A03','TP-A06','TP-N01','TP-N03','TP-C01','TP-D01'], dificiles: ['TP-A01','TP-M02'] } } }
