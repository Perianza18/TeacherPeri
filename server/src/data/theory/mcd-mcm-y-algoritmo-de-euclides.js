const pathSlug = 'mcd-mcm-y-algoritmo-de-euclides'
const collection = pathSlug
const summary = 'Elegir entre el máximo común divisor y el mínimo común múltiplo, y calcularlos mediante factorización o el algoritmo de Euclides.'
const content = String.raw`## Preámbulo: Coincidir y repartir

Dos actividades comienzan al mismo tiempo y después se repiten con ritmos distintos. ¿Cuánto habrá que esperar para que vuelvan a coincidir? En otra situación, se quieren repartir dos cantidades entre el mayor número posible de equipos iguales, sin que sobre nada.

Ambas preguntas relacionan pares de números, pero buscan cosas diferentes: la primera pide un tiempo compartido y la segunda, una cantidad que divida dos totales. Aprenderemos a reconocer cuál de las dos herramientas corresponde y por qué un procedimiento de divisiones permite calcular una de ellas.

## Teoría

### Dos preguntas distintas

Trabajaremos con enteros positivos $a$ y $b$. Un divisor común divide a ambos; un múltiplo común es divisible por ambos. El número $1$ siempre es divisor común y $ab$ siempre es múltiplo común, así que existen candidatos para las dos preguntas.

:::definition MCD y MCM
El máximo común divisor de $a$ y $b$, escrito $\operatorname{mcd}(a,b)$, es el mayor de sus divisores comunes positivos. El mínimo común múltiplo, escrito $\operatorname{mcm}(a,b)$, es el menor de sus múltiplos comunes positivos.
:::

Si el MCD es $1$, decimos que los números son **coprimos**. Esto no exige que cada uno sea primo: por ejemplo, $8$ y $15$ son compuestos y no tienen ningún divisor común mayor que $1$.

:::try ¿Cuál es el MCD de dos enteros positivos consecutivos $n$ y $n+1$?
Todo divisor común divide también su diferencia $(n+1)-n=1$. Como $1$ es su único divisor positivo, el MCD es $1$.
:::

### Leer los exponentes

Por la unicidad de la factorización prima, un divisor positivo de un número usa cada primo con un exponente que no supera al del número. Para comparar $a$ y $b$ incluimos todos los primos que aparecen en cualquiera de ellos y usamos exponente $0$ cuando un primo no aparece.

:::proposition MCD y MCM a partir de primos
Para cada primo, el exponente en el MCD es el menor de sus exponentes en $a$ y $b$; el exponente en el MCM es el mayor.
:::

:::proof
Un divisor común debe tener, para cada primo, un exponente que no supere ninguno de los dos exponentes dados. El producto formado con todos los mínimos divide a $a$ y a $b$, y cualquier otro divisor común lo divide; por tanto no puede ser mayor que él y es el MCD.

Por otra parte, un múltiplo común positivo debe contener cada primo con exponente al menos igual a los dos exponentes dados. El producto formado con todos los máximos es múltiplo de $a$ y de $b$ y divide a cualquier otro múltiplo común positivo. Por tanto no puede ser mayor que ninguno de ellos y es el MCM.
:::

:::example
Calcular el MCD y el MCM de $24$ y $90$.

Factorizamos: $24=2^3\cdot3$ y $90=2\cdot3^2\cdot5$. Los exponentes mínimos son $1$ para $2$, $1$ para $3$ y $0$ para $5$, así que el MCD es $2\cdot3=6$. Los máximos son $3$, $2$ y $1$, respectivamente; el MCM es $2^3\cdot3^2\cdot5=360$.
:::

:::mistake
Confundir «un divisor común» con «el máximo común divisor». Tanto $2$ como $6$ dividen a $24$ y $90$, pero $2$ no es el mayor. Para el MCM tampoco basta encontrar cualquier múltiplo común: se busca el menor positivo.
:::

### El algoritmo de Euclides

Cuando las factorizaciones no están a la vista, dividir con residuo puede ser más práctico. La clave es reemplazar el par sin cambiar sus divisores comunes.

:::proposition Conservar los divisores comunes
Sean $a$, $b$, $q$ y $r$ enteros, con $a,b>0$, $r\ge0$ y $a=bq+r$. Un entero positivo divide a $a$ y $b$ si y solo si divide a $b$ y $r$.
:::

:::proof
Si un entero positivo $d$ divide a $a$ y $b$, divide a la combinación $a-bq=r$. Entonces $d$ divide a $b$ y $r$.

Recíprocamente, si $d$ divide a $b$ y $r$, divide a la combinación $bq+r=a$. Por tanto $d$ divide a $a$ y $b$. Los dos pares tienen exactamente los mismos divisores comunes.
:::

En cada paso dividimos el primer número entre el segundo: $a=bq+r$ con $0\le r<b$. Si $r>0$, sustituimos el par por $(b,r)$ y repetimos. Los residuos son enteros no negativos y cada uno es menor que el anterior, así que en algún paso aparece $r=0$. En ese paso, el par es $(b,r')$ con $b=r'q$: el divisor $r'$ divide a $b$, y ningún divisor de $r'$ es mayor que $r'$, de modo que el MCD de ese par es $r'$. Por la proposición, cada sustitución conserva el conjunto de divisores comunes; por tanto todos los pares del proceso, incluido el inicial, tienen el mismo MCD, el último residuo no nulo $r'$.

:::example
Usar el algoritmo de Euclides para calcular $\operatorname{mcd}(168,60)$.

Las divisiones sucesivas son $168=2(60)+48$, $60=1(48)+12$ y $48=4(12)+0$. Cada sustitución conserva los divisores comunes. Como el último residuo no nulo es $12$, el MCD es $12$.
:::

:::try ¿Cuál es el MCD de $35$ y $20$ usando residuos?
$35=1(20)+15$, $20=1(15)+5$ y $15=3(5)+0$. El último residuo no nulo es $5$, así que el MCD es $5$.
:::

### Una relación útil

El MCD y el MCM también permiten comprobarse entre sí. La igualdad siguiente vale para enteros positivos y se deduce de los exponentes primos.

:::proposition Producto del MCD y el MCM
Para enteros positivos $a$ y $b$,
$$\operatorname{mcd}(a,b)\operatorname{mcm}(a,b)=ab.$$
:::

:::proof
Para cada primo, llamemos $u$ y $v$ a sus exponentes en $a$ y $b$. El exponente en el producto del MCD y el MCM es $\min(u,v)+\max(u,v)=u+v$, que es el exponente en $ab$. Esto vale también si alguno de los exponentes es cero. Ambos productos tienen la misma factorización prima, así que son iguales; si $a=b=1$, ambos productos valen $1$.
:::

:::tip
Si dos procesos empiezan juntos y se repiten cada $a$ y $b$ unidades, sus coincidencias posteriores ocurren en múltiplos comunes positivos de $a$ y $b$. Para la primera coincidencia se necesita el MCM.
:::

## Agregados culturales

- El libro VII de los *Elementos* de Euclides presenta un procedimiento para encontrar un máximo común divisor. Su idea de reemplazar cantidades conservando sus divisores comunes sigue siendo útil para números grandes.
- La novena Olimpiada Internacional de Matemáticas se celebró en 1967 en Cetinje, entonces parte de Yugoslavia. Participaron $99$ estudiantes.
- En enero de 2005, la sonda Huygens descendió a través de la atmósfera de Titán, la luna más grande de Saturno. Durante el descenso tomó datos e imágenes.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Decidir primero si se buscan divisores comunes o múltiplos comunes. Después elegir entre la factorización y las divisiones sucesivas.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

En estos problemas hay que combinar propiedades del MCD y el MCM o justificar una afirmación para todos los enteros de una familia.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problem = (code, titulo, enunciado, difficulty = 'basico') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })
const problems = [
  exercise('N29','MCD y MCM pequeños',String.raw`Calcular el MCD y el MCM de $12$ y $18$.`,['Factorizar ambos números y comparar exponentes.']),
  exercise('N30','Divisiones sucesivas',String.raw`Calcular el MCD de $96$ y $36$ con el algoritmo de Euclides.`,['Dividir $96$ entre $36$ y continuar con el residuo.']),
  exercise('N31','Números coprimos',String.raw`Decidir si $14$ y $25$ son coprimos y justificar la respuesta.`,['Comparar sus factores primos.']),
  exercise('N32','Dos señales',String.raw`Dos señales coinciden ahora y se repiten cada $6$ y $8$ minutos, respectivamente. ¿Cuántos minutos transcurren hasta su primera coincidencia posterior?`,['Buscar el menor múltiplo común positivo.']),
  problem('N33','Dos factorizaciones',String.raw`Calcular el MCD y el MCM de $45$ y $75$.`),
  problem('N34','Producto conocido',String.raw`Dos enteros positivos tienen MCD $6$ y producto $432$. Determinar su MCM.`),
  problem('N35','Bolsas iguales',String.raw`Se distribuyen $84$ dulces rojos y $108$ azules en el mayor número posible de bolsas. Todas las bolsas deben tener la misma cantidad de cada color y no debe sobrar ningún dulce. ¿Cuántas bolsas se forman y cuántos dulces de cada color contiene cada una?`),
  problem('N36','Impares consecutivos',String.raw`Demostrar que dos enteros positivos impares consecutivos son coprimos.`),
  problem('N37','Una diferencia pequeña',String.raw`Para un entero positivo $n$, demostrar que todo divisor común positivo de $2n+1$ y $n+3$ divide a $5$.`,'intermedio'),
  problem('N38','MCD, MCM y suma',String.raw`Dos enteros positivos tienen MCD $12$, MCM $180$ y suma $96$. Determinar los dos enteros y justificar la respuesta.`,'intermedio'),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-N29','TP-N30','TP-N31','TP-N32'], practice: ['TP-N05','TP-N06','TP-N33','TP-N34','TP-N35','TP-N36'], dificiles: ['TP-N37','TP-N38'] } } }
