// «Principio de casillas» in the lesson format of the theory page. Original
// TeacherPeri text. Exercises and problems live in the banco; the lesson
// only points to them.

const pathSlug = 'principio-de-casillas'
const collection = 'casillas'

const summary = 'Demostrar que una coincidencia es inevitable eligiendo bien los objetos y las casillas, y calcular cuántos objetos hacen falta para garantizarla.'

const content = String.raw`## Preámbulo: Trece personas y doce meses

En un grupo de trece personas siempre hay dos que cumplen años el mismo mes. Intentemos evitarlo: cada persona nació en exactamente uno de los doce meses. Si las primeras doce nacieron en meses distintos, ya ocupan los doce, y la número trece repite alguno. Si dos coincidieron antes, la repetición ya ocurrió.

El argumento no dice cuáles son esas dos personas ni qué mes comparten. Aun así, la coincidencia es segura, porque evitarla es imposible.

Quedan preguntas más difíciles: cuántas personas aseguran que tres comparten mes, y qué hacer cuando las «casillas» no son meses, sino residuos, parejas o regiones de una figura. Para eso hace falta un enunciado general, una forma de calcular cuántos objetos bastan y un método para elegir las casillas.

## Teoría

### El principio

En el preámbulo hay **objetos**, las personas, y **casillas**, los meses, y cada objeto está en exactamente una casilla. Esta condición importa: una persona no nació en dos meses, ni en ninguno.

:::theorem Principio de casillas
Si $n+1$ objetos se colocan en $n$ casillas, de modo que cada objeto queda en exactamente una casilla, entonces alguna casilla contiene al menos dos objetos.
:::

:::proof
Supongamos que cada casilla contiene a lo más un objeto. Al sumar lo que hay en las $n$ casillas, el total es entonces a lo más $n$. Pero cada objeto está en exactamente una casilla, así que esa suma cuenta cada objeto una vez y vale $n+1$. Como $n+1>n$, la suposición es imposible.
:::

La misma demostración funciona con más de $n+1$ objetos. Lo que garantiza es poco, y conviene leerlo con cuidado.

:::mistake
Concluir más de lo que el principio garantiza. Asegura que *alguna* casilla tiene *al menos* dos objetos. No dice cuál, no dice que tenga *exactamente* dos, porque podría tenerlos todos, y no dice nada de las demás, que pueden estar vacías. Con solo $n$ objetos no garantiza nada: puede quedar uno en cada casilla.
:::

### Más de dos objetos en una casilla

Volvamos a las tres personas con el mismo mes. Con $24$ personas todavía puede fallar: dos en cada mes. Con $25$, si cada mes tuviera a lo más dos, habría a lo más $24$ personas; por tanto, algún mes tiene al menos tres. Para decirlo en general usamos el **techo** de un número real $x$, que se escribe $\lceil x\rceil$ y es el menor entero mayor o igual que $x$. Por ejemplo, $\lceil 25/12\rceil=3$ y $\lceil 24/12\rceil=2$.

:::theorem Principio de casillas generalizado
Si $N$ objetos se colocan en $k$ casillas, cada objeto en exactamente una, entonces alguna casilla contiene al menos $\lceil N/k\rceil$ objetos.
:::

:::proof
Sea $m=\lceil N/k\rceil$ y supongamos que cada casilla contiene a lo más $m-1$ objetos. Entonces el total es a lo más $k(m-1)$. Como $m$ es el menor entero mayor o igual que $N/k$, el entero $m-1$ es menor que $N/k$, y por eso $k(m-1)<N$. Esto contradice que hay $N$ objetos.
:::

Con las desigualdades al revés se obtiene la afirmación gemela: alguna casilla contiene *como máximo* $N/k$ objetos. Y $\lceil N/k\rceil$ no se puede mejorar: en el reparto más parejo posible, ninguna casilla pasa de ese número.

:::try Se reparten $21$ canicas en $4$ cajas. ¿Cuántas canicas se pueden garantizar en una misma caja?
Seis, porque $\lceil 21/4\rceil=\lceil 5.25\rceil=6$: con a lo más cinco por caja habría a lo más $20$ canicas. Siete no, porque el reparto $6,5,5,5$ usa las $21$. Redondear hacia abajo y responder «cinco» sería un error: cinco ya se garantiza con $17$ canicas.
:::

En los problemas de «cuántos hacen falta» hay dos cosas que demostrar: que cierta cantidad basta y que una menos no basta.

:::example
En un cajón hay calcetines de cuatro colores, al menos cinco de cada color. Sin mirar, se sacan calcetines uno por uno. ¿Cuál es el menor número de calcetines que hay que sacar para asegurar que se tienen cinco del mismo color?

Los objetos son los calcetines que se sacan y las casillas, los cuatro colores. Con $17$ calcetines, el principio generalizado da un color con al menos $\lceil 17/4\rceil=5$, así que $17$ basta. Con $16$ puede fallar: como hay al menos cinco de cada color, se pueden sacar exactamente cuatro de cada uno. La respuesta es $17$.

La hipótesis sobre el cajón solo se usó en la segunda parte, pero es necesaria. Con solo tres calcetines rojos, a lo más $3+4+4+4=15$ calcetines evitarían cinco de un color, y bastaría sacar $16$.
:::

### Elegir las casillas

Hasta aquí las casillas venían dadas: meses, cajas, colores. En la mayoría de los problemas de olimpiada hay que inventarlas, y esa elección es casi toda la solución. Una buena casilla cumple una condición: dos objetos dentro de ella producen la conclusión buscada.

:::tip
Construir las casillas a partir de la conclusión. Primero se escribe qué relación entre dos objetos resolvería el problema; después se agrupan los objetos de modo que dos de una misma casilla cumplan esa relación. Solo al final se cuentan las casillas y se comparan con los objetos.
:::

Una relación muy útil viene de la división con residuo. Al dividir un entero $a$ entre un entero $n\ge2$ se obtienen un cociente $q$ y un **residuo** $r$, únicos, tales que $a=nq+r$ y $0\le r\le n-1$. Hay exactamente $n$ residuos posibles, así que los residuos son casillas naturales.

:::lemma Mismo residuo
Si dos enteros $a$ y $b$ dejan el mismo residuo al dividirlos entre $n$, entonces $a-b$ es múltiplo de $n$.
:::

:::proof
Si $a=nq+r$ y $b=nq'+r$, entonces $a-b=n(q-q')$, que es múltiplo de $n$.
:::

Con el lema, una conclusión del tipo «una diferencia es múltiplo de $n$» se traduce en casillas: los $n$ residuos. El ejemplo siguiente lo combina con un hecho de la lección de primos: si un número primo divide a un producto, divide a alguno de los factores.

:::example
Demostrar que algún número escrito solo con unos, como $1$, $11$ o $111$, es múltiplo de $2027$.

No conocemos ese número, así que forzamos su existencia con muchos candidatos. Sea $R_j$ el número formado por $j$ unos. Los $2028$ números $R_1,\ldots,R_{2028}$ son los objetos, y los $2027$ residuos al dividir entre $2027$ son las casillas. Dos de ellos, $R_i$ y $R_j$ con $i>j$, dejan el mismo residuo, y por el lema $2027$ divide a $R_i-R_j$.

Al restar, los últimos $j$ unos se cancelan y quedan $i-j$ unos seguidos de $j$ ceros: $R_i-R_j=R_{i-j}\cdot10^{j}$. El primo $2027$ no divide a $10^j$, cuyos únicos factores primos son $2$ y $5$; como divide al producto, divide a $R_{i-j}$, que es el número buscado. El argumento funciona igual con cualquier primo distinto de $2$ y de $5$.
:::

:::try ¿Bastan los $2027$ números $R_1,\ldots,R_{2027}$ en el ejemplo anterior?
Sí. Si alguno deja residuo $0$, ese número ya es múltiplo de $2027$. Si ninguno lo deja, los $2027$ números ocupan solo las $2026$ casillas de los residuos $1,2,\ldots,2026$, dos comparten residuo y el resto del argumento es igual. Separar una casilla especial, como la del residuo $0$, es un recurso frecuente.
:::

## Agregados culturales

- El principio suele atribuirse a Peter Gustav Lejeune Dirichlet, que en 1834 lo usó con el nombre alemán *Schubfachprinzip*, «principio de los cajones». En 2014, los investigadores Benoît Rittaud y Albrecht Heeffer mostraron que aparece dos siglos antes, en una sola frase de un libro de 1622 del jesuita francés Jean Leurechon: debe haber dos personas con el mismo número de cabellos. En inglés se le llama *pigeonhole principle*, «principio del palomar».
- En julio de 2026 se celebró en Shanghái, China, la 67.ª Olimpiada Internacional de Matemáticas, con casi 700 estudiantes de más de 110 países y territorios. Cada país envía como máximo seis estudiantes, que resuelven seis problemas en dos días, con cuatro horas y media por día. El equipo de México obtuvo cinco medallas de bronce.
- Las palomas, que dan nombre al principio en inglés, aprenden más de lo que parece. En un estudio publicado en 2016 en la revista *PNAS*, cuatro palomas aprendieron a distinguir palabras de cuatro letras en inglés de combinaciones de letras sin sentido. Llegaron a reconocer entre $26$ y $58$ palabras, y también acertaron, más que por azar, con palabras que nunca habían visto.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

En cada solución conviene decir cuáles son los objetos, cuáles las casillas y por qué dos objetos en una misma casilla resuelven el problema. Si se pide una cantidad mínima, hay que mostrar que basta y que una menos no basta.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Aquí las casillas no están a la vista. Antes de contar hay que transformar los objetos, por ejemplo en sumas acumuladas o en partes impares, hasta que compartir casilla implique la conclusión.

[[collection:${collection}:dificiles]]`

const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problem = (code, titulo, enunciado, difficulty = 'basico') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })

const problems = [
  exercise('C07', 'Seis enteros y cinco residuos', String.raw`Demostrar que entre seis enteros cualesquiera hay dos que dejan el mismo residuo al dividirlos entre $5$.`, [
    String.raw`¿Cuántos residuos distintos puede dejar un entero al dividirlo entre $5$?`,
    String.raw`Usar los residuos como casillas y los seis enteros como objetos.`,
  ]),
  exercise('C08', 'Cincuenta dulces', String.raw`Se reparten $50$ dulces entre $7$ niños. Demostrar que alguno recibe al menos $8$ dulces. ¿Se puede garantizar que alguno reciba al menos $9$?`, [
    String.raw`Suponer que cada niño recibe a lo más $7$ dulces y contar el total.`,
    String.raw`Para la segunda pregunta, buscar un reparto de los $50$ dulces en el que nadie reciba $9$.`,
  ]),
  exercise('C09', 'Cumpleaños en un grupo de treinta', String.raw`En un grupo de $30$ estudiantes, demostrar que al menos tres cumplen años el mismo mes. ¿Se puede asegurar que en algún mes cumplen años exactamente tres?`, [
    String.raw`Usar el principio generalizado con los $12$ meses como casillas.`,
    String.raw`Para la segunda pregunta, probar con repartos muy desiguales de los $30$ cumpleaños.`,
  ]),
  exercise('C10', 'Suma o diferencia múltiplo de 7', String.raw`Demostrar que entre cinco enteros cualesquiera hay dos cuya suma o cuya diferencia es múltiplo de $7$.`, [
    String.raw`Agrupar los residuos al dividir entre $7$ de modo que dos residuos de un mismo grupo sean iguales o sumen $7$.`,
    String.raw`Si dos enteros dejan residuos $r$ y $7-r$, su suma es múltiplo de $7$.`,
  ]),
  problem('C11', 'Dos consecutivos', String.raw`Se eligen $26$ números distintos del conjunto $\{1,2,\ldots,50\}$. Demostrar que dos de ellos son consecutivos. ¿Ocurre lo mismo si se eligen solo $25$?`),
  problem('C12', 'Tres con suma múltiplo de 3', String.raw`Demostrar que entre cinco enteros cualesquiera hay tres cuya suma es múltiplo de $3$.`),
  problem('C13', 'Cinco puntos en un cuadrado', String.raw`Se colocan $5$ puntos en un cuadrado de lado $2$, en su interior o sobre sus lados. Demostrar que hay dos de ellos a distancia menor o igual que $\sqrt2$.`),
  problem('C14', 'Conocidos en una reunión', String.raw`En una reunión hay $n\ge2$ personas, y cada una conoce a algunas de las otras; si $A$ conoce a $B$, entonces $B$ conoce a $A$. Demostrar que hay dos personas que conocen exactamente al mismo número de personas de la reunión.`),
  problem('C15', 'Bloques con suma múltiplo de 12', String.raw`Se escriben $12$ enteros en una fila. Demostrar que hay uno o varios de ellos, en posiciones consecutivas, cuya suma es múltiplo de $12$.`, 'intermedio'),
  problem('C16', 'Uno divide a otro', String.raw`Se eligen $16$ números distintos del conjunto $\{1,2,\ldots,30\}$. Demostrar que uno de ellos divide a otro.`, 'intermedio'),
]

export default {
  pathSlug,
  summary,
  content,
  problems,
  collections: {
    [collection]: {
      ejercicios: ['TP-C07', 'TP-C08', 'TP-C09', 'TP-C10'],
      practice: ['TP-C05', 'TP-C06', 'TP-C11', 'TP-C12', 'TP-C13', 'TP-C14'],
      dificiles: ['TP-C15', 'TP-C16'],
    },
  },
}
