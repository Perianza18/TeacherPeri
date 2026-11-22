const pathSlug = 'como-entrenar-para-una-olimpiada'
const collection = pathSlug
const summary = 'Organizar el trabajo con una idea matemática: aprenderla, intentar problemas, revisar una solución y volver a usarla.'
const content = String.raw`## Preámbulo: ¿Qué hacer con una solución?

Después de leer una solución, todo parece encajar. Al día siguiente, frente a un problema parecido, quizá no sea tan fácil recordar por qué se hizo aquel paso. ¿Cómo se convierte una idea que se entendió al leer en una herramienta que se pueda usar de nuevo?

Entrenar para una olimpiada incluye estudiar, intentar, revisar y regresar a las ideas. No existe una sola rutina adecuada para todas las personas. Podemos, sin embargo, observar cómo cambia una misma idea cuando la exploramos en más de un problema.

## Teoría

### Aprender una idea

Al encontrar una identidad nueva conviene conocer tanto su enunciado como la razón de que sea válida. Tomemos un producto que, después de sumar uno, parece producir un cuadrado.

:::proposition Un cuadrado escondido
Para todo entero $n$, el número $n(n+2)+1$ es un cuadrado perfecto.
:::

:::proof
Aplicamos la propiedad distributiva y después reconocemos el cuadrado de una suma:
$$n(n+2)+1=n^2+2n+1.$$
La identidad del cuadrado de una suma da $n^2+2n+1=(n+1)^2$. Como $n+1$ es entero, su cuadrado es un cuadrado perfecto. La igualdad también vale para enteros negativos y para cero.
:::

Por ejemplo, con $n=3$ se obtiene $3(5)+1=16=4^2$. Ese caso sirve para comprobar la fórmula, mientras que la demostración explica todos los valores permitidos.

:::try ¿Qué cuadrado se obtiene en la proposición cuando $n=0$?
Se obtiene $0(2)+1=1=1^2$, de acuerdo con $(n+1)^2$.
:::

### Intentar y registrar

En un problema nuevo, antes de consultar una solución, conviene identificar los datos y escribir qué se busca. Un caso pequeño puede mostrar una dirección; si no funciona, también puede revelar que una conjetura debe cambiarse.

:::example
Determinar si $n(n+4)+4$ es un cuadrado perfecto para todo entero $n$.

Para $n=1$ se obtiene $1(5)+4=9$, y para $n=2$, $2(6)+4=16$. Esto sugiere buscar un cuadrado, pero no demuestra la afirmación. Desarrollamos la expresión: $n(n+4)+4=n^2+4n+4$. Como $4n=2(n)(2)$, coincide con el desarrollo de $(n+2)^2$.

Por tanto $n(n+4)+4=(n+2)^2$. El número $n+2$ es entero, así que la expresión es un cuadrado perfecto para cualquier entero $n$.
:::

La observación útil no es solo que las respuestas de los dos primeros casos son cuadrados. La forma de los términos $n^2$, $4n$ y $4$ indica qué identidad podría conectar todos los casos.

:::tip
Al anotar un intento, conservar una frase sobre la decisión tomada: «busqué un cuadrado porque aparecieron dos extremos cuadrados». Si el camino no funcionó, escribir qué condición faltaba también ayuda a elegir el siguiente intento.
:::

### Revisar una explicación

Revisar no significa comparar solamente la respuesta final. Cada igualdad debe ser válida y cada variable debe conservar el dominio que se le dio. Si el argumento usa casos, hay que verificar que no falte ninguno.

:::example
Una solución afirma: «$n(n-1)$ es par porque $n$ es par». Explicar qué falta y demostrar que $n(n-1)$ es par para todo entero $n$.

La explicación propuesta solo cubre el caso en que $n$ es par. Si $n=3$, la conclusión sigue siendo cierta, pero la frase «$n$ es par» no se cumple.

Si $n=2k$ para un entero $k$, entonces $n(n-1)=2[k(n-1)]$, que es par. Si $n=2k+1$, entonces $n-1=2k$ y $n(n-1)=2(nk)$, que también es par. Los dos casos cubren todos los enteros; en cada uno, el factor que multiplica a $2$ es entero.
:::

:::mistake
Leer una solución hasta que resulte familiar y pasar a otro tema sin comprobarla. Comprender cada paso y poder reconstruir la idea sin mirar son tareas distintas; al intentarlo pueden aparecer las preguntas que todavía faltan responder.
:::

### Volver a usar la idea

Después de revisar, se puede cerrar la solución e intentar explicarla desde el principio. Si algún paso no sale, volver a consultarlo y repetir la explicación ayuda a localizar la duda: no hace falta fingir que se recuerda todo.

También conviene cambiar una condición y examinar si el argumento aún funciona. Si cambia un signo o una constante, una identidad anterior puede dejar de aplicarse. Primero se prueba la nueva afirmación y después se justifica con las condiciones de ese problema.

Una sesión puede terminar con una solución escrita, un error corregido o una pregunta concreta. En una sesión posterior se puede elegir un problema relacionado y verificar si la idea se adapta; la dificultad y el tiempo disponible pueden variar de una persona a otra.

## Agregados culturales

- En 1889 Giuseppe Peano publicó un sistema de axiomas para los números naturales. El trabajo matemático también incluye revisar las definiciones desde las que se construyen los argumentos.
- La primera Olimpiada Internacional de Matemáticas se celebró en 1959 en Rumania. Participaron $52$ estudiantes de $7$ países.
- En 2008 Jeffrey Karpicke y Henry Roediger publicaron un experimento sobre el aprendizaje de pares de palabras. Estudiaron qué ocurría al practicar la recuperación de lo aprendido, además de volver a estudiarlo.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Antes de consultar una pista, registrar una primera observación. Después de resolver o revisar cada problema, explicar qué paso depende de las condiciones del enunciado.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Estos problemas ofrecen oportunidades para ensayar, corregir y justificar una idea general. Comparar el intento inicial con una solución terminada puede revelar dónde cambió la estrategia.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problems = [
  exercise('O09','Otro cuadrado',String.raw`Demostrar que $n(n+6)+9$ es un cuadrado perfecto para todo entero $n$.`,['Comparar la expresión desarrollada con el cuadrado de una suma.']),
  exercise('O10','Diferencia de cuadrados',String.raw`Calcular $7^2-5^2$ usando una factorización y verificar el resultado.`,['Usar la diferencia de cuadrados.']),
  exercise('O11','Una conjetura',String.raw`Una persona afirma que la diferencia entre los cuadrados de dos enteros que difieren en $2$ siempre es la misma. Usar los pares $(8,6)$ y $(9,7)$ para decidir si la afirmación es verdadera.`,['Calcular las dos diferencias y compararlas.']),
  exercise('O12','Dos enteros consecutivos',String.raw`Demostrar que $n(n+1)$ es par para todo entero $n$.`,['Separar los casos en que $n$ es par y en que es impar.']),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-O09','TP-O10','TP-O11','TP-O12'], practice: ['TP-A02','TP-N01','TP-N02','TP-C01','TP-C05','TP-D01'], dificiles: ['TP-A01','TP-M02'] } } }
