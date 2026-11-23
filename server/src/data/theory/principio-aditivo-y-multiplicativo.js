const pathSlug = 'principio-aditivo-y-multiplicativo'
const collection = pathSlug
const summary = 'Contar elecciones por casos y etapas, evitando omisiones y repeticiones.'
const content = String.raw`## Preámbulo: Elegir sin hacer una lista interminable

Al crear una clave para un juego, se pueden elegir letras y cifras siguiendo ciertas reglas. ¿Cuántas claves distintas son posibles? Escribirlas todas puede funcionar al principio, pero una lista larga hace fácil saltarse alguna o contarla dos veces.

Una clave se construye mediante varias elecciones; en otros problemas, en cambio, se debe escoger entre opciones de tipos diferentes. Aprenderemos a distinguir esas dos situaciones y a comprobar que cada resultado se cuente exactamente una vez.

## Teoría

### Sumar casos que no se traslapan

Al contar por casos, cada resultado debe pertenecer a uno y solo uno de ellos. Si un resultado pertenece a dos, sumarlo en ambos conteos lo contaría dos veces.

:::proposition Principio aditivo
Si un conjunto finito se divide en dos grupos sin elementos comunes, con $m$ y $n$ elementos respectivamente, el total es $m+n$.
:::

:::proof
El primer grupo aporta $m$ elementos y el segundo aporta $n$. Como no comparten elementos, al reunirlos no se repite ninguno; como los dos grupos contienen todos los elementos del conjunto, no falta ninguno. Por eso el total es $m+n$.
:::

:::example
Una biblioteca ofrece $4$ revistas distintas y $6$ libros distintos. Si se elige exactamente una publicación, ¿cuántas elecciones hay?

Elegir una revista y elegir un libro son casos excluyentes: la publicación elegida no es de ambos tipos. El primer caso tiene $4$ opciones y el segundo $6$, así que hay $4+6=10$ elecciones. Todos los elementos de cada tipo se consideran distintos.
:::

:::try Si se elige una de $5$ canciones distintas o uno de $3$ podcasts distintos, ¿cuántas elecciones hay?
Los dos tipos no se traslapan. Se suman $5+3=8$ elecciones.
:::

Para tres o más casos disjuntos, se puede reunir primero dos grupos y sumar después el siguiente. Es necesario comprobar que el nuevo grupo tampoco comparta elementos con los anteriores.

### Multiplicar etapas

Una construcción puede tener una primera elección y después otra. La multiplicación sirve cuando cada primera elección admite el mismo número de continuaciones y cada secuencia produce un resultado diferente.

:::proposition Principio multiplicativo
Supongamos que una elección tiene $m$ posibilidades y que, para cada una, una segunda elección tiene $n$ posibilidades. Si cada pareja produce un resultado y cada resultado corresponde a una única pareja de elecciones, hay $mn$ resultados.
:::

:::proof
Dividimos los resultados en grupos según la primera elección. Hay $m$ grupos y cada uno tiene $n$ resultados, uno por cada segunda elección. Los grupos no se traslapan porque sus primeras elecciones son distintas; al sumar $n$ un total de $m$ veces se obtiene $mn$.
:::

:::example
Una clave consta de una letra de $\{A,B,C\}$ seguida de un dígito de $\{0,1,2,3\}$. ¿Cuántas claves distintas hay?

La letra tiene $3$ opciones y, para cada una, el dígito tiene $4$. Cada pareja determina una clave y de la clave se recuperan ambas elecciones, así que no hay repeticiones. El total es $3\cdot4=12$; el cero está permitido porque la clave empieza con una letra.
:::

:::mistake
Multiplicar sin verificar cuántas continuaciones tiene cada elección. Si se forman números de dos cifras con $\{0,1,2\}$, el cero no puede ser la primera cifra. No hay $3\cdot3$ números de dos cifras: hay $2$ opciones para la primera cifra y $3$ para la segunda, si se permite repetir.
:::

Cuando se prohíbe repetir una cifra, elegirla una vez reduce las opciones posteriores. Es importante decidir qué es un resultado distinto: en una clave, cambiar el orden de sus símbolos normalmente cambia la clave.

### Cuando los casos se traslapan

A veces interesa contar los elementos que cumplen una condición u otra y algunos cumplen ambas. Sumarlos por separado cuenta dos veces la parte común; debemos descontarla una vez.

:::proposition Dos condiciones
Si $A$ y $B$ son conjuntos finitos, la cantidad de elementos que están en $A$ o en $B$ es
$$|A|+|B|-|A\cap B|.$$
Aquí $A\cap B$ es el conjunto de elementos que pertenecen a ambos.
:::

:::proof
Los elementos de $A$ que no están en $B$ aparecen una vez en $|A|+|B|$, y los elementos de $B$ que no están en $A$ aparecen una vez. Cada elemento común aparece dos veces, una en $|A|$ y otra en $|B|$. Al restar $|A\cap B|$ quitamos una de esas dos apariciones. Queda contado una vez cada elemento que pertenece por lo menos a uno de los conjuntos.
:::

:::example
En un grupo de $10$ estudiantes, $6$ estudian música, $5$ estudian teatro y $2$ estudian ambas actividades. ¿Cuántos estudian al menos una?

Los dos estudiantes que estudian ambas actividades aparecen en los dos conteos. Aplicamos la proposición: $6+5-2=9$. Así, $9$ estudiantes estudian música o teatro, posiblemente ambos; la información restante indica que $1$ no estudia ninguna de las dos.
:::

### Elegir un orden para contar

A veces la elección más restringida conviene hacerse primero. Después se pueden separar casos cuando el número de opciones restantes cambia.

:::example
Con las cifras $\{0,1,2,3,4\}$, ¿cuántos números pares de tres cifras distintas se pueden formar?

La última cifra debe ser $0$, $2$ o $4$. Si es $0$, la primera tiene $4$ opciones no nulas y la segunda tiene $3$ de las cifras restantes: hay $4\cdot3=12$ números.

Si la última cifra es $2$ o $4$, hay $2$ opciones para ella. La primera cifra no puede ser cero ni repetir la última, por lo que tiene $3$ opciones; la cifra central tiene $3$ de las restantes. Este caso aporta $2\cdot3\cdot3=18$ números. Los casos son disjuntos y cubren todas las terminaciones pares: el total es $12+18=30$.
:::

:::tip
Antes de sumar o multiplicar, describir qué identifica a cada resultado. Separar casos si alguna elección cambia la cantidad de continuaciones; contar el conjunto completo y restar los casos prohibidos también puede ser útil.
:::

## Agregados culturales

- En la India se desarrolló una tradición de contar combinaciones relacionada con Pingala. Una disposición triangular de esos números se conoce como *Meru Prastara*.
- La undécima Olimpiada Internacional de Matemáticas se celebró en 1969 en Bucarest, Rumania. Participaron $112$ estudiantes de $14$ países.
- El cubo de Rubik tiene $43\,252\,003\,274\,489\,856\,000$ posiciones distintas, un número que se obtiene con los principios de esta lección. En julio de 2010, un equipo de cuatro personas demostró, con unos $35$ años de cálculo de computadora donados por Google, que cualquier posición se resuelve en $20$ movimientos o menos.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Definir qué cuenta como un resultado distinto. Separar casos que no se traslapen y registrar las opciones disponibles en cada etapa.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

La dificultad está en organizar restricciones que cambian las opciones disponibles y demostrar que ningún resultado se omitió ni se contó dos veces.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problem = (code, titulo, enunciado, difficulty = 'basico') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })
const problems = [
  exercise('C17','Una elección',String.raw`Se elige una de $7$ pinturas distintas o una de $4$ fotografías distintas. ¿Cuántas elecciones hay?`,['Separar los dos tipos de obra.']),
  exercise('C18','Dos etapas',String.raw`Una clave tiene una letra de $\{P,Q\}$ seguida de un dígito de $\{1,2,3,4,5\}$. ¿Cuántas claves hay?`,['Contar las opciones del dígito para cada letra.']),
  exercise('C19','Cifras sin repetición',String.raw`¿Cuántos números de dos cifras distintas se forman con $\{0,2,4,6\}$?`,['La primera cifra no puede ser cero.']),
  exercise('C20','Dos actividades',String.raw`De $15$ estudiantes, $8$ juegan ajedrez, $7$ juegan voleibol y $3$ practican ambos. ¿Cuántos practican al menos uno?`,['Quienes practican ambos aparecen en los dos conteos.']),
  problem('C21','Tres etapas',String.raw`Una clave consta de dos letras de $\{A,B,C\}$ seguidas de un dígito de $\{0,1,2,3\}$. Las letras pueden repetirse. ¿Cuántas claves distintas hay?`),
  problem('C22','Uno o dos dígitos',String.raw`¿Cuántos enteros positivos de una o dos cifras distintas se pueden formar con $\{0,2,5,7\}$?`),
  problem('C23','Dos gustos',String.raw`De $20$ estudiantes, $11$ prefieren leer, $9$ prefieren dibujar y $4$ prefieren ambas actividades. ¿Cuántos no prefieren ninguna de las dos?`),
  problem('C24','Cifras repetidas permitidas',String.raw`¿Cuántos números de tres cifras se forman con $\{0,1,2,3\}$ si se permiten repeticiones y el número debe terminar en cifra impar?`),
  problem('C25','Al menos un cero',String.raw`¿Cuántos números de tres cifras formados con $\{0,1,2,3,4\}$ tienen al menos un cero? Se permiten repeticiones.`,'intermedio'),
  problem('C26','Terminación par',String.raw`¿Cuántos números pares de tres cifras distintas se pueden formar con $\{0,1,2,3,4,5\}$?`,'intermedio'),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-C17','TP-C18','TP-C19','TP-C20'], practice: ['TP-C01','TP-C02','TP-C21','TP-C22','TP-C23','TP-C24'], dificiles: ['TP-C25','TP-C26'] } } }
