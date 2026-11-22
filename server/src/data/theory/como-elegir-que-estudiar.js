const pathSlug = 'como-elegir-que-estudiar'
const collection = pathSlug
const summary = 'Elegir el siguiente tema a partir de la curiosidad, los intentos recientes y las herramientas que hacen falta para avanzar.'
const content = String.raw`## Preámbulo: Muchas puertas abiertas

Una persona abre una ruta de matemáticas y encuentra nombres que le llaman la atención: divisibilidad, conteo, congruencia, inducción. Algunos le resultan familiares y otros no. Una amiga recomienda empezar por su tema favorito; otra dice que conviene seguir el orden de la lista sin saltarse nada.

¿Cómo elegir cuando varias puertas parecen interesantes? La respuesta puede cambiar con el tiempo. Una pregunta concreta, una dificultad repetida o la curiosidad por un problema pueden servir de brújula para decidir qué estudiar a continuación.

## Teoría

### Escuchar lo que dicen los intentos

Revisar algunos problemas recientes puede revelar una necesidad. Si una persona entiende un enunciado pero no sabe qué significa «divisible», estudiar esa definición puede abrir el camino. Si conoce la definición y no sabe cómo empezar una prueba, quizá convenga practicar cómo usarla con letras y justificar los pasos.

La diferencia importa: volver a leer una definición conocida no siempre resuelve una dificultad de escritura, y estudiar una técnica avanzada no reemplaza entender sus hipótesis. Describir el obstáculo con precisión ayuda a escoger una acción pequeña.

:::try En un problema se sabe que $a$ es múltiplo de $5$, pero no se sabe cómo usar ese dato. ¿Qué se podría estudiar?
Conviene revisar la definición: existe un entero $k$ tal que $a=5k$. Después se puede practicar sustituyendo esa expresión en problemas sencillos de divisibilidad. Si la definición ya se conoce, la pregunta siguiente es qué se quiere demostrar con ella.
:::

### Buscar una herramienta cercana

No es necesario dominar todas las matemáticas antes de probar un problema interesante. Se puede comenzar con lo que se sabe, identificar una pregunta más pequeña y buscar la herramienta relacionada. Luego hay que regresar al problema original para comprobar si esa herramienta ayuda.

:::example
Una estudiante quiere demostrar que la suma de dos múltiplos enteros de $5$ es múltiplo de $5$. Conoce algunos ejemplos, pero no sabe cómo explicar todos los casos. ¿Qué paso puede estudiar?

Puede estudiar la definición de múltiplo y la propiedad distributiva. Si $a$ y $b$ son múltiplos enteros de $5$, existen enteros $r$ y $s$ con $a=5r$ y $b=5s$. Al sumar y sacar factor común, $a+b=5(r+s)$. Como $r+s$ es entero, la suma es múltiplo de $5$. La definición transforma la hipótesis en una expresión que permite demostrar la conclusión.
:::

La idea de escribir múltiplos con un factor común también puede servir con otro entero en lugar de $5$, pero cada nueva afirmación necesita una explicación con sus propias hipótesis. Estudiar un concepto incluye entender cuándo se puede usar y practicar cómo justificarlo.

### Combinar necesidad y curiosidad

No todo tema se elige para reparar una dificultad. La curiosidad por contar caminos, investigar cifras o entender por qué una prueba funciona también es una razón para empezar. Si aparece una herramienta desconocida, se puede consultar una introducción y regresar a la pregunta que la hizo interesante.

Una posibilidad es elegir un tema principal durante varias sesiones y reservar otra para problemas variados de temas ya estudiados. Otra persona puede preferir alternar dos temas desde el comienzo. Son opciones, no reglas: el tiempo disponible, la experiencia y el interés pueden orientar la decisión. Una conversación con una compañera o un profesor también puede ayudar a reconocer qué conocimiento previo falta. Si dos recomendaciones difieren, probar una durante unas sesiones y observar qué preguntas nuevas aparecen permite tomar una decisión informada.

:::mistake
Suponer que un tema debe abandonarse porque el primer problema resultó difícil. El problema puede requerir un conocimiento previo, una pista o simplemente más tiempo. También es válido cambiar temporalmente a una pregunta más sencilla y regresar después.
:::

### Revisar la elección

Después de algunas sesiones, preguntar: ¿puedo explicar la idea principal?, ¿sé aplicarla en un ejemplo nuevo?, ¿qué parte todavía me confunde? Una respuesta negativa no significa que no se aprendió nada; puede indicar cuál será la siguiente pregunta útil.

:::example
Una persona estudió paridad y afirma: «el producto de dos enteros consecutivos es par». ¿Cómo puede revisar que entiende la idea?

Sea $n$ un entero. Si $n$ es par, existe un entero $k$ con $n=2k$; al sustituir, $n(n+1)=2k(n+1)$ es par. Si $n$ es impar, existe un entero $k$ con $n=2k+1$; entonces $n+1=2(k+1)$ y $n(n+1)=2n(k+1)$ es par. Los dos casos cubren todos los enteros $n$.
:::

:::tip
Elegir una meta que se pueda revisar: «explicar qué significa ser múltiplo y usarlo en una demostración» es más concreta que «aprender toda la teoría de números». Guardar una duda para orientar la sesión siguiente.
:::

No hay una única secuencia que funcione para todas las personas. Se puede avanzar por una ruta sugerida y hacer desvíos cuando aparezca una pregunta. Lo importante es comprobar qué se entendió y mantener problemas a los que valga la pena regresar.

## Agregados culturales

- Hipatia de Alejandría trabajó en matemáticas y astronomía. Su padre, Teón, también fue matemático y enseñó en Alejandría.
- La décima Olimpiada Internacional de Matemáticas se celebró en Moscú en 1968. Participaron $96$ estudiantes de $12$ países.
- Europa es una luna de Júpiter cuya superficie contiene hielo de agua. Hay indicios fuertes de un océano bajo su corteza helada, aunque su presencia aún espera confirmación directa.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Elegir un problema que despierte curiosidad. Si aparece una herramienta desconocida, anotar qué definición o propiedad sería útil estudiar.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Intentar identificar qué se sabe y qué falta antes de buscar una técnica nueva. Después, regresar al enunciado y comprobar la solución.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problems = [
  exercise('O45', 'Una definición útil', String.raw`Demostrar que la diferencia de dos múltiplos enteros de $7$ es múltiplo de $7$. Indicar qué definición permite comenzar.`, ['Escribir ambos enteros con un factor $7$.']),
  exercise('O46', 'Explorar una pregunta', String.raw`Encontrar todos los enteros positivos $n$ cuyo cuadrado es menor que $18$ y justificar la lista.`, ['Comparar $4^2$ y $5^2$ con $18$.']),
  exercise('O47', 'Paridad en una suma', String.raw`Demostrar que la suma de dos enteros impares y un entero par es par. Indicar qué definición de paridad se está usando.`, ['Escribir los tres enteros como $2a+1$, $2b+1$ y $2c$.']),
  exercise('O48', 'Decidir qué falta', String.raw`Una persona comprobó que $6$ y $7$ son consecutivos y tienen producto $42$. Encontrar todas las parejas de enteros consecutivos con ese producto y justificar que no hay más.`, ['Si $n$ es el menor entero, estudiar la ecuación $n(n+1)=42$.']),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-O45','TP-O46','TP-O47','TP-O48'], practice: ['TP-A03','TP-N01','TP-N03','TP-C01','TP-C04','TP-D02'], dificiles: ['TP-A01','TP-M01'] } } }
