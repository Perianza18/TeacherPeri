const pathSlug = 'ecuaciones-algebraicas'
const collection = pathSlug
const summary = 'Encontrar todas las soluciones de una ecuación y distinguir los pasos reversibles de los que necesitan comprobación.'
const content = String.raw`## Preámbulo: Deshacer una máquina de números

Una máquina recibe un número, realiza una operación y muestra un resultado. Si se conoce el resultado y la operación, ¿siempre se puede recuperar el número de entrada? Algunas máquinas podrían aceptar varias entradas que producen la misma salida; otras podrían no aceptar ninguna para el resultado deseado.

Una ecuación plantea una búsqueda parecida: pide todos los números que hacen verdadera una igualdad. Para encontrar la lista completa hace falta saber qué transformaciones se pueden deshacer y cuándo una operación puede ocultar o añadir candidatos.

## Teoría

### Soluciones y pasos reversibles

Una solución de una ecuación en los números reales es un número real para el cual ambas expresiones están definidas y tienen el mismo valor. Resolverla significa encontrar todas sus soluciones y justificar que no hay otras.

Sumar o restar la misma cantidad en ambos lados conserva las soluciones: la operación inversa recupera la igualdad inicial. Multiplicar o dividir ambos lados por una constante distinta de cero también es reversible. En cambio, si esa cantidad depende de la incógnita, antes de dividir hay que considerar si puede valer cero.

:::example
Resolver en los reales $4x-7=13$.

Sumamos $7$ a ambos lados y obtenemos $4x=20$. Dividimos ambos lados entre $4$, que no es cero, y resulta $x=5$. Los pasos son reversibles, de modo que no se perdió ninguna solución; además, al sustituir en la ecuación original, $4(5)-7=13$. La única solución es $5$.
:::

:::try ¿Cuántas soluciones reales tiene $x+2=x+3$?
Al restar $x$ de ambos lados se obtiene $2=3$, una igualdad falsa. No hay soluciones reales.
:::

Una igualdad falsa después de pasos reversibles indica que no hay solución. Si en cambio queda una igualdad verdadera para todos los valores del dominio, todos ellos son soluciones; el dominio sigue siendo necesario cuando hay denominadores o raíces.

### Un producto igual a cero

La factorización permite separar una ecuación en casos más sencillos. Usaremos una propiedad de los números reales, no una regla para productos que valen cualquier número.

:::proposition Producto cero
Si $a$ y $b$ son números reales, entonces $ab=0$ si y solo si $a=0$ o $b=0$.
:::

:::proof
Si $ab=0$ y $a=0$, se cumple la primera posibilidad. Si $ab=0$ y $a\ne0$, dividimos ambos lados entre $a$ y obtenemos $b=0/a=0$. Recíprocamente, si $a=0$, entonces $ab=0\cdot b=0$; si $b=0$, entonces $ab=a\cdot0=0$. Así se prueban ambas direcciones.
:::

:::example
Resolver en los reales $x^2-6x=0$.

Ambos términos tienen factor $x$, así que la ecuación equivale a $x(x-6)=0$. Por producto cero, $x=0$ o $x-6=0$; la segunda ecuación da $x=6$. Ambos números verifican la igualdad original y no hay otros, porque el producto cero cubre los dos casos posibles.
:::

:::mistake
Dividir por una expresión que podría ser cero sin revisar ese caso. En el ejemplo, dividir entre $x$ deja $x=6$ y pierde la solución $x=0$. La factorización permite conservarla.
:::

### Fracciones y valores prohibidos

Una fracción solo está definida cuando su denominador no es cero. La restricción se obtiene de la ecuación original y acompaña a todos los pasos posteriores, incluso si un factor desaparece al simplificar.

:::example
Resolver en los reales $\dfrac{x^2-16}{x-4}=6$.

El denominador exige $x\ne4$. En ese dominio, $x^2-16=(x-4)(x+4)$ y se puede dividir el factor no nulo $x-4$: la ecuación equivale a $x+4=6$. Por tanto $x=2$, valor permitido. Al sustituirlo en la ecuación original, $(4-16)/(2-4)=6$. La única solución es $2$.
:::

:::try ¿Es solución $x=4$ de $\dfrac{x^2-16}{x-4}=8$?
No. El denominador de la expresión original vale cero cuando $x=4$, así que esa expresión no está definida allí, aunque la fórmula simplificada $x+4$ sí lo esté.
:::

La comprobación no sustituye a la búsqueda completa: además de verificar cada valor propuesto, debemos explicar por qué los pasos anteriores no dejaron otros candidatos fuera.

:::tip
Antes de operar, anotar el dominio y buscar una transformación reversible. Si un paso solo garantiza que las soluciones aparecen entre varios candidatos, comprobar cada candidato en la ecuación original.
:::

### Raíces y candidatos

En los reales, $\sqrt{A}$ existe si $A\ge0$ y representa el número no negativo cuyo cuadrado es $A$. Al elevar una igualdad al cuadrado se conserva toda solución, pero puede aparecer un candidato nuevo: por ejemplo, $2$ y $-2$ tienen el mismo cuadrado aunque no son iguales.

:::example
Resolver en los reales $\sqrt{x+5}=x-1$.

Una solución debe cumplir $x+5\ge0$ para que exista la raíz y $x-1\ge0$ porque la raíz es no negativa. Juntas, estas condiciones exigen $x\ge1$. Al elevar ambos lados al cuadrado, toda solución cumple $x+5=(x-1)^2=x^2-2x+1$. Restamos $x+5$ de ambos lados y obtenemos $0=x^2-3x-4=(x-4)(x+1)$.

Por producto cero, los únicos candidatos son $x=4$ y $x=-1$. El segundo no cumple $x\ge1$; además, en la ecuación original daría $2=-2$. Para $x=4$, la igualdad original es $\sqrt9=3=4-1$. Por tanto la única solución es $4$.
:::

No hemos supuesto que elevar al cuadrado sea reversible. Encontramos todos los candidatos a partir de una condición necesaria y después identificamos cuáles satisfacen la igualdad inicial.

## Agregados culturales

- En el siglo IX, Al-Juarismi escribió un tratado que estudia métodos para resolver ecuaciones. Su título contiene las palabras *al-jabr* y *al-muqabala*, relacionadas con las operaciones usadas en ese trabajo.
- La sexta Olimpiada Internacional de Matemáticas se celebró en 1964 en Moscú. Participaron $72$ estudiantes de $9$ países.
- La Tierra tarda aproximadamente $365.25$ días en dar una vuelta alrededor del Sol. El calendario incorpora días adicionales para mantener las fechas cerca de las estaciones.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Antes de resolver, registrar el dominio y elegir entre despejar, factorizar o simplificar. Al final, revisar las soluciones en la ecuación original.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

La dificultad está en controlar los valores excluidos mientras se transforman las expresiones y en describir el conjunto completo de soluciones.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problem = (code, titulo, enunciado, difficulty = 'basico') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })
const problems = [
  exercise('A27','Ecuación lineal',String.raw`Resolver en los reales $3x+4=19$.`,['Restar la misma cantidad de ambos lados antes de dividir.']),
  exercise('A28','Conservar el cero',String.raw`Resolver en los reales $x(x-7)=0$.`,['Un producto de reales es cero si al menos uno de sus factores es cero.']),
  exercise('A29','Una fracción',String.raw`Resolver en los reales $\dfrac{x^2-25}{x-5}=9$.`,['Anotar el valor prohibido y factorizar el numerador.']),
  exercise('A30','Comprobar una raíz',String.raw`Resolver en los reales $\sqrt{x+9}=x+3$.`,['El lado derecho debe ser no negativo.','Después de elevar al cuadrado, comprobar los candidatos.']),
  problem('A31','Dos factores',String.raw`Resolver en los reales $x^2-5x+4=0$.`),
  problem('A32','El valor prohibido',String.raw`Resolver en los reales $\dfrac{x^2-4}{x-2}=4$.`),
  problem('A33','Una raíz y dos candidatos',String.raw`Resolver en los reales $\sqrt{x+4}=x-2$.`),
  problem('A34','Una solución que no debe perderse',String.raw`Resolver en los reales $x^2=3x$.`),
  problem('A35','Una igualdad con restricción',String.raw`Determinar todos los números reales $x$ que satisfacen $\dfrac{x^2-1}{x-1}=x+1$.`,'intermedio'),
  problem('A36','Suma de fracciones',String.raw`Resolver en los reales $\dfrac1{x-1}+\dfrac1{x+1}=1$.`,'intermedio'),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-A27','TP-A28','TP-A29','TP-A30'], practice: ['TP-A05','TP-A06','TP-A31','TP-A32','TP-A33','TP-A34'], dificiles: ['TP-A35','TP-A36'] } } }
