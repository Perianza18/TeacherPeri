const pathSlug = 'como-abordar-un-problema'
const collection = pathSlug
const summary = 'Entrar en un problema nuevo separando sus condiciones, explorando casos y convirtiendo una observación en una explicación completa.'
const content = String.raw`## Preámbulo: Tres números para una meta

En un juego se eligen tres números distintos del $1$ al $8$ y se suman. ¿De cuántas maneras se puede obtener $17$? El orden en que se nombran los tres números no cambia la elección.

Una primera terna puede aparecer pronto, pero encontrar una no indica si hay otras. La pregunta invita a probar opciones y también a buscar una forma de saber cuándo se ha terminado la búsqueda.

## Teoría

### Entender qué se cuenta

Antes de calcular, separemos las condiciones: se eligen tres enteros distintos, cada uno está entre $1$ y $8$, y la suma debe ser $17$. Una terna como $2,7,8$ funciona porque sus elementos son distintos y $2+7+8=17$.

Pero $7,2,8$ representa la misma elección: solo cambió el orden al escribirla. Para evitar repeticiones, escribiremos cada terna en orden creciente como $x<y<z$. El objetivo es encontrar todas las ternas así escritas y justificar que no falta ninguna.

:::try ¿Es válida la terna $1,8,8$ para el juego?
No. Aunque $1+8+8=17$, el número $8$ aparece dos veces y las reglas exigen tres números distintos.
:::

### Explorar con una pregunta

La terna $2,7,8$ sugiere mirar el número mayor. Si el mayor fuera pequeño, incluso la suma de las tres elecciones más grandes disponibles podría quedar por debajo de la meta.

:::proposition Una cota para tres números
Si $x$, $y$ y $z$ son enteros positivos con $x<y<z\le6$, entonces $x+y+z\le15$.
:::

:::proof
Como $z\le6$ y $y<z$, los enteros cumplen $y\le5$. Como $x<y\le5$, se tiene $x\le4$. Sumando $x\le4$, $y\le5$ y $z\le6$, obtenemos $x+y+z\le4+5+6=15$.
:::

Esta cota no enumera las ternas que suman $17$, pero descarta todas aquellas cuyo mayor número es a lo más $6$. En el juego solo quedan dos posibilidades para $z$: $7$ y $8$.

:::tip
Una observación se vuelve más útil cuando responde una pregunta concreta. En vez de anotar solo una lista de ternas, preguntar qué valor puede tener el mayor número ayuda a organizar los casos que faltan.
:::

### Completar la búsqueda

Una búsqueda completa debe cubrir cada caso posible y evitar que una misma respuesta aparezca varias veces. Ya decidimos escribir los números en orden creciente; ahora podemos usar esa convención en cada caso.

:::example
Determinar todas las elecciones de tres números distintos del $1$ al $8$ cuya suma es $17$, sin considerar el orden.

Sean $x<y<z$ los números elegidos. Por la cota anterior, $z$ no puede ser $6$ o menor. Como tampoco supera $8$, solo hay dos casos.

Si $z=8$, necesitamos $x+y=9$ con $1\le x<y<8$. Las parejas posibles son $(2,7)$, $(3,6)$ y $(4,5)$. La pareja $(1,8)$ no sirve porque repetiría el $8$.

Si $z=7$, necesitamos $x+y=10$ con $1\le x<y<7$. La única pareja posible es $(4,6)$: $(3,7)$ repetiría el mayor y $(5,5)$ repetiría un número. Las demás parejas positivas tienen un segundo número mayor que $7$ o son las mismas escritas al revés.

Las elecciones son $\{2,7,8\}$, $\{3,6,8\}$, $\{4,5,8\}$ y $\{4,6,7\}$. Cada una cumple las reglas y suma $17$. La cota y los dos casos muestran que no hay otras; el orden creciente evita contar dos veces la misma elección.
:::

:::mistake
Detenerse después de encontrar una respuesta cuando el problema pide todas. Una terna válida demuestra que al menos una existe; no explica por qué no hay otras. Para cerrar el problema hace falta una búsqueda exhaustiva o una razón que descarte los casos restantes.
:::

### Trabajar desde la meta

Si el enunciado fija una suma, a veces podemos expresar los números a partir de una sola cantidad. La ecuación resultante da candidatos; después hay que volver a comprobar las condiciones originales.

:::example
Tres enteros consecutivos suman $42$. Determinar cuáles son y justificar que no hay otros.

Sea $n$ el menor de ellos. Los números son $n$, $n+1$ y $n+2$, así que $3n+3=42$. Al restar $3$ de ambos lados, $3n=39$; al dividir entre $3$, $n=13$. La única terna posible es $13,14,15$. Son consecutivos y su suma es $42$, por lo que sí cumplen el enunciado.
:::

En la exploración se vale probar, modificar una conjetura o buscar un caso más pequeño. En la solución final debe quedar visible qué se demostró, qué opciones se descartaron y por qué las respuestas anunciadas cumplen todas las condiciones.

## Agregados culturales

- En *How to Solve It*, publicado en 1945, George Pólya presentó una forma de organizar la resolución de problemas que incluye comprender, planear, ejecutar y revisar. Esas etapas orientan la búsqueda, aunque no sean una receta que resuelva todos los problemas.
- La segunda Olimpiada Internacional de Matemáticas se celebró en 1960 en Sinaia, Rumania. Participaron $39$ estudiantes de $5$ países.
- En 1984 una misión del transbordador espacial llevó abejas en un módulo especial. La tripulación observó cómo se adaptaban al vuelo durante la misión.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Escribir los datos, las restricciones y lo que se pide antes de operar. Al terminar, comprobar los candidatos y justificar que no se omitieron posibilidades.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

En estos problemas será necesario organizar las posibilidades o encontrar una representación que haga visible una propiedad general.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problems = [
  exercise('O13','Tres números y dieciséis',String.raw`Encontrar todas las elecciones de tres números distintos del $1$ al $7$ cuya suma sea $16$, sin importar el orden.`,['Considerar primero el mayor número de la elección.']),
  exercise('O14','Una terna consecutiva',String.raw`Tres enteros consecutivos suman $36$. Determinarlos y justificar que no hay otros.`,['Llamar $n$ al menor de los tres enteros.']),
  exercise('O15','Una suma imposible',String.raw`Determinar si existen tres enteros consecutivos cuya suma sea $22$. Justificar la respuesta.`,['Examinar si la suma de tres enteros consecutivos tiene un divisor común.']),
  exercise('O16','Tres números y dieciocho',String.raw`Encontrar todas las elecciones de tres números distintos del $1$ al $7$ cuya suma sea $18$, sin importar el orden.`,['Comparar la meta con la mayor suma que se puede obtener.']),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-O13','TP-O14','TP-O15','TP-O16'], practice: ['TP-C06','TP-D03','TP-N01','TP-A03','TP-C02','TP-G07'], dificiles: ['TP-A01','TP-M02'] } } }
