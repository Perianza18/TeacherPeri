const pathSlug = 'como-revisar-tus-soluciones-y-detectar-errores'
const collection = pathSlug
const summary = 'Revisar una solución desde el enunciado, detectar pasos no reversibles y comprobar que la respuesta satisface todas las condiciones.'
const content = String.raw`## Preámbulo: Dos respuestas para una raíz

Al resolver una ecuación, dos estudiantes llegan a las mismas cuentas y encuentran dos posibles respuestas. Una sustituye ambas en el enunciado original; la otra entrega las dos sin comprobarlas. Al comparar sus hojas descubren que una candidata no funciona, aunque apareció en una cuenta correcta.

¿Cómo puede una operación válida producir una respuesta que no sirve? Revisar no consiste solamente en volver a sumar: también consiste en preguntar qué asegura cada paso y si el camino de regreso está justificado.

## Teoría

### Volver a la pregunta original

Una buena revisión comienza por leer de nuevo el enunciado. ¿Se buscaban enteros positivos o todos los enteros? ¿Había que encontrar una respuesta o demostrar que la lista era completa? Es posible hacer cuentas correctas y responder otra pregunta.

Para una solución que encuentra objetos, hay dos tareas: comprobar que los propuestos cumplen todas las condiciones y explicar por qué cualquier otro objeto que las cumpla tendría que estar en la lista. Una sustitución exitosa realiza la primera tarea, pero no siempre la segunda.

:::try Una persona afirma que $x=2$ es la única solución real de $x^2=4$. ¿Qué debe revisar?
Al sustituir se comprueba que $2^2=4$, pero falta revisar si hay más soluciones. También $(-2)^2=4$, así que $x=-2$ es otra solución. De hecho, $x^2-4=(x-2)(x+2)=0$ muestra que las únicas son $2$ y $-2$.
:::

### Seguir el sentido de cada paso

Si una igualdad se transforma mediante una operación, hay que preguntar si toda solución original satisface la nueva igualdad y si toda solución de la nueva satisface la original. Si ambas cosas ocurren, las ecuaciones son equivalentes. Si solo se sabe la primera, la transformación puede dar **candidatas** adicionales que después se deben comprobar.

:::example
Resolver en los reales $\sqrt{x+2}=x$ y revisar las candidatas.

La raíz cuadrada principal es no negativa, por lo que una solución debe cumplir $x\ge0$. Al elevar ambos lados al cuadrado, toda solución satisface $x+2=x^2$. Restando $x+2$ de ambos lados y factorizando, obtenemos $(x-2)(x+1)=0$. Por lo tanto, las únicas candidatas son $x=2$ y $x=-1$.

Comprobamos en la ecuación original: para $x=2$, $\sqrt{4}=2$, así que sí sirve. Para $x=-1$, $\sqrt{1}=1\ne-1$, así que no sirve. La única solución es $x=2$.
:::

La cuenta al cuadrar fue correcta para toda solución original. El problema sería afirmar, sin comprobación, que cada candidata satisface la ecuación inicial. En este ejemplo la condición $x\ge0$ también descarta $-1$; la sustitución confirma directamente la conclusión.

:::mistake
Cancelar un factor que podría ser cero sin examinar ese caso. De $x(x-1)=0$ no se puede dividir por $x$ para concluir que la única solución es $x=1$: se perdería $x=0$. La propiedad del producto cero da los dos casos, $x=0$ o $x-1=0$.
:::

### Revisar una demostración

En una prueba, identificar las hipótesis y comprobar que cada una esté disponible cuando se usa. Si se invoca un resultado, revisar sus condiciones. Si se separan casos, comprobar que cubren todas las posibilidades y que cada caso se resuelve. Si se usan letras, verificar qué representan y a qué conjunto pertenecen.

:::example
Una prueba afirma: «Si $a$ y $b$ son impares, entonces $a+b$ es impar, pues $1+1=2$». ¿Qué hay que corregir?

El ejemplo contradice la conclusión: $1$ y $1$ son impares, pero su suma $2$ es par. Para demostrar la conclusión correcta, sean $a=2r+1$ y $b=2s+1$, con $r$ y $s$ enteros. Entonces $a+b=2(r+s+1)$, que es par porque $r+s+1$ es entero. El ejemplo refuta la afirmación original; el argumento general demuestra la corregida.
:::

Una cuenta particular puede encontrar un error, pero varios ejemplos favorables no sustituyen una prueba para todos los casos. Conviene separar «encontré una falla en este argumento» de «la afirmación es falsa»: una afirmación verdadera puede tener una demostración equivocada.

### Hacer una revisión independiente

Al terminar, dejar el trabajo un momento y volver a leerlo como si fuera de otra persona. Para cada línea importante, buscar una razón en la línea anterior o en una propiedad conocida. Comprobar signos, operaciones y restricciones; después, volver al enunciado y preguntar si se contestó todo.

:::tip
Si aparece un error, marcar la primera línea que no está justificada y conservar las anteriores que sí lo están. Preguntar si el paso puede repararse o si hace falta otra idea. Corregir una prueba es parte del trabajo matemático.
:::

La revisión no promete detectar cualquier error de inmediato. Sí ofrece preguntas concretas: ¿la operación conserva todas las soluciones?, ¿se agregaron candidatas?, ¿se usaron hipótesis no dadas? Cada respuesta permite mejorar la explicación.

## Agregados culturales

- En 1998, Thomas Hales presentó una demostración de que ninguna forma de apilar esferas iguales ocupa más espacio que la pila de naranjas de los mercados; la pregunta venía de Johannes Kepler, en 1611. La prueba usaba muchos cálculos por computadora y los revisores no pudieron comprobarla por completo. En agosto de 2014, el proyecto Flyspeck terminó una versión verificada paso a paso por programas de computadora.
- La novena Olimpiada Internacional de Matemáticas se celebró en Cetinje, entonces Yugoslavia, en 1967. Participaron $99$ estudiantes de $13$ países.
- Los anillos de Saturno están formados por numerosas partículas, principalmente de hielo, junto con roca y polvo. Aunque en algunas imágenes parezcan sólidos, no son una sola pieza rígida.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Al terminar cada problema, revisar una vez el dominio y otra vez la conexión entre los pasos y la conclusión.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Comprobar que las hipótesis de cada herramienta se cumplen y que la explicación cubre todos los casos necesarios.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problems = [
  exercise('O41', 'Candidatas al cuadrar', String.raw`Resolver en los reales $\sqrt{x+12}=x$ y comprobar cada candidata en la ecuación original.`, ['Una solución debe ser no negativa; al cuadrar se obtiene una ecuación cuadrática.']),
  exercise('O42', 'Una cancelación peligrosa', String.raw`Una solución de $x(x-3)=0$ divide ambos lados entre $x$ y concluye que $x=3$ es la única respuesta. Encontrar el error y resolver la ecuación.`, ['Antes de dividir, considerar la posibilidad $x=0$.']),
  exercise('O43', 'Un contraejemplo', String.raw`Una persona afirma que todo entero divisible por $3$ es divisible por $6$. Revisar la afirmación y justificar la respuesta.`, ['Probar el entero positivo $3$.']),
  exercise('O44', 'Falta una pareja', String.raw`Una persona afirma que la única pareja de enteros consecutivos con producto $6$ es $(2,3)$. Determinar si la lista está completa.`, ['Probar enteros negativos y comprobar el producto.']),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-O41','TP-O42','TP-O43','TP-O44'], practice: ['TP-A05','TP-N02','TP-N08','TP-C05','TP-C06','TP-D04'], dificiles: ['TP-A01','TP-M02'] } } }
