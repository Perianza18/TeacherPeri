const pathSlug = 'representacion-en-distintas-bases'
const collection = pathSlug
const summary = 'Interpretar el valor posicional, convertir enteros entre bases y usar las restricciones de sus cifras para resolver problemas.'
const content = String.raw`## Preámbulo: ¿Cuánto vale «10»?

En un juego, una máquina muestra el número «10» y otra muestra «10», pero la primera entrega diez fichas y la segunda solo dos. Ninguna está descompuesta: usan formas distintas de agrupar las fichas.

Si una máquina cambia cada diez fichas por una ficha de la siguiente posición y la otra hace el cambio cada dos, ¿qué significa cada una de sus pantallas? Una misma cadena de símbolos puede representar cantidades diferentes. Para saber cuál es, necesitamos conocer la base y el valor de cada posición.

## Teoría

### Agrupar para escribir

En el sistema decimal agrupamos de diez en diez. Por ejemplo, $243$ representa dos centenas, cuatro decenas y tres unidades: $2\cdot10^2+4\cdot10+3$. La cifra $2$ vale dos centenas por su posición; la cifra $3$ vale tres unidades.

En una base entera $b\ge2$, cada posición vale $b$ veces la que está a su derecha. Usaremos las cifras $0,1,\ldots,b-1$; para bases mayores que diez hacen falta símbolos adicionales. En particular, la cifra $b$ no está permitida en base $b$: $b$ unidades se agrupan en una unidad de la siguiente posición.

:::definition Valor posicional
Para cifras $a_i$ entre $0$ y $b-1$, la escritura $(a_ka_{k-1}\cdots a_0)_b$ representa el entero $a_kb^k+a_{k-1}b^{k-1}+\cdots+a_1b+a_0$. Si el número es distinto de cero, se acostumbra que la primera cifra sea distinta de cero.
:::

El subíndice indica la base y no es una cifra del número. Así, $(10)_2=2$ y $(10)_{10}=10$. Cuando no se indique otra base, los números de esta lectura están escritos en decimal.

:::try ¿Cuánto vale $(1011)_2$ en decimal?
Las posiciones valen $8$, $4$, $2$ y $1$. Por tanto, $(1011)_2=1\cdot8+0\cdot4+1\cdot2+1=11$.
:::

### Pasar a decimal

Para interpretar una escritura en otra base, multiplicamos cada cifra por la potencia correspondiente y sumamos. Antes de calcular, hay que revisar que todas las cifras sean menores que la base.

:::example
Convertir $(243)_5$ a decimal.

Las posiciones son $5^2$, $5$ y $1$. Por ello $(243)_5=2\cdot25+4\cdot5+3=73$. Las cifras $2$, $4$ y $3$ son válidas en base $5$.
:::

:::mistake
Leer $(102)_2$ como un número binario válido. En base $2$ solo se permiten las cifras $0$ y $1$; el símbolo $2$ no puede ocupar ninguna posición. En cambio, $(102)_3$ sí es válido y vale $1\cdot9+0\cdot3+2=11$.
:::

### Pasar de decimal a otra base

Para convertir un entero positivo, podemos dividirlo repetidamente entre la base. Cada residuo es una cifra, comenzando por la de las unidades. Al dividir el cociente nuevamente obtenemos la cifra siguiente. Cuando el cociente es cero, leemos los residuos en orden inverso al que aparecieron.

:::example
Escribir $47$ en base $3$.

Las divisiones son $47=3\cdot15+2$, $15=3\cdot5+0$, $5=3\cdot1+2$ y $1=3\cdot0+1$. Al leer los residuos desde el último hasta el primero obtenemos $(1202)_3$. La comprobación es $1\cdot27+2\cdot9+0\cdot3+2=47$.
:::

¿Por qué funciona? La primera división escribe $N=bq+r$, donde $r$ está entre $0$ y $b-1$: $r$ es la cifra de unidades. Si después $q=bq_1+r_1$, al sustituir se obtiene $N=b^2q_1+br_1+r$. Cada nueva división determina otra cifra. Para un entero positivo, cada cociente es un entero no negativo menor que el dividendo, por lo que las divisiones llegan a cociente cero; el cero se escribe $(0)_b$.

:::proposition La última cifra es única
Si $N=bq+r=bq'+r'$ para enteros $q,q'$ y cifras $0\le r,r'<b$, entonces $r=r'$ y $q=q'$.
:::

:::proof
Igualamos $bq+r=bq'+r'$. Al restar $bq$ y $r'$ de ambos lados obtenemos $r-r'=bq'-bq=b(q'-q)$, así que $r-r'$ es múltiplo de $b$. Como ambas cifras están entre $0$ y $b-1$, se cumple $-(b-1)\le r-r'\le b-1$. El único múltiplo de $b$ en ese intervalo es $0$; por tanto $r=r'$. Al sustituir esta igualdad en $bq+r=bq'+r'$ y restar $r$, queda $bq=bq'$, de donde $q=q'$ porque $b\ne0$.
:::

Al aplicar el mismo argumento a cada cociente, las demás cifras también quedan determinadas. Con la convención de no escribir ceros iniciales, la representación de cada entero no negativo en una base dada es única.

### Cuando la base es desconocida

:::example
Encontrar la base entera $b$ si $(32)_b=17$.

La cifra $3$ exige $b\ge4$. Por valor posicional, $3b+2=17$; al restar $2$ y dividir entre $3$, obtenemos $b=5$. La base cumple $b\ge4$ y $(32)_5=3\cdot5+2=17$, así que es válida.
:::

:::tip
Antes de operar, anotar el intervalo de cada cifra. Al terminar una conversión, volver a calcular su valor con potencias de la base: es una comprobación independiente del orden de los residuos.
:::

## Agregados culturales

- Los babilonios utilizaron un sistema de numeración relacionado con la base $60$. Su notación histórica no coincidía exactamente con la escritura posicional moderna descrita aquí.
- La undécima Olimpiada Internacional de Matemáticas se celebró en Bucarest en 1969. Participaron $112$ estudiantes de $14$ países.
- Las computadoras usan código binario para procesar y almacenar información. La base $2$ emplea solo las cifras $0$ y $1$.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Justificar el valor de cada posición y comprobar que las cifras son válidas en la base indicada.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Buscar una propiedad que relacione las potencias de la base con las cifras de la representación.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problem = (code, titulo, enunciado, difficulty = 'basico') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })
const problems = [
  exercise('D05', 'Leer en binario', String.raw`Escribir $(10110)_2$ en base diez y explicar el valor de cada posición.`, ['Las posiciones valen $16$, $8$, $4$, $2$ y $1$.']),
  exercise('D06', 'Agrupar de tres en tres', String.raw`Escribir $29$ en base $3$ y comprobar la respuesta.`, ['Dividir sucesivamente entre $3$ o descomponer $29$ en potencias de $3$.']),
  exercise('D07', 'Una cifra prohibida', String.raw`¿Es válida la escritura $(102)_2$? Explicar y dar una escritura válida del número decimal $6$ en base $2$.`, ['En base $2$ las únicas cifras permitidas son $0$ y $1$.']),
  exercise('D08', 'Base desconocida', String.raw`Encontrar la base entera $b$ para la cual $(23)_b=13$ en decimal. Comprobar que sus cifras son válidas.`, ['Traducir la escritura como $2b+3$ y observar que $b>3$.']),
  problem('D09', 'De base cinco a decimal', String.raw`Convertir $(314)_5$ a base diez y explicar el valor de cada cifra.`),
  problem('D10', 'De decimal a base cuatro', String.raw`Escribir $78$ en base $4$ y verificar la respuesta mediante potencias de $4$.`),
  problem('D11', 'Una suma ternaria', String.raw`Calcular $(12)_3+(10)_3$ y escribir el resultado en base $3$.`),
  problem('D12', 'Dos cifras en base cinco', String.raw`Encontrar todas las escrituras de dos cifras $(ab)_5$ que representan $19$ en decimal y cuyas cifras suman $7$.`),
  problem('D13', 'La suma de las cifras', String.raw`Demostrar que, para cualquier entero $b\ge2$, la diferencia entre un entero no negativo y la suma de sus cifras en base $b$ es divisible por $b-1$.`, 'intermedio'),
  problem('D14', 'Una divisibilidad imposible', String.raw`Demostrar que $(101)_b$ no es divisible por $b+1$ para ninguna base entera $b\ge2$.`, 'intermedio'),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-D05','TP-D06','TP-D07','TP-D08'], practice: ['TP-D01','TP-D02','TP-D09','TP-D10','TP-D11','TP-D12'], dificiles: ['TP-D13','TP-D14'] } } }
