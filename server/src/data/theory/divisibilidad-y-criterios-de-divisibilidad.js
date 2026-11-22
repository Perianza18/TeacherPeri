const pathSlug = 'divisibilidad-y-criterios-de-divisibilidad'
const collection = pathSlug
const summary = 'Justificar cuándo un entero divide a otro y explicar por qué funcionan algunos criterios de divisibilidad decimal.'
const content = String.raw`## Preámbulo: Repartos sin sobrantes

Al formar equipos iguales para una actividad, puede surgir una pregunta antes de repartir nada: ¿alcanzan las personas para que todos los equipos tengan el mismo tamaño y nadie quede fuera? La respuesta depende de cómo se relacionan la cantidad total y el tamaño de cada equipo.

Con números grandes, hacer la división completa no siempre es la única opción. A veces bastan unas pocas cifras; otras veces conviene transformar la cantidad sin cambiar la respuesta. Para saber cuándo funcionan esos atajos, empezaremos por explicar qué significa que una división sea exacta.

## Teoría

### Divisores y múltiplos

Trabajaremos con enteros, que incluyen los negativos y el cero. En la notación siguiente el divisor no es cero; el número que se divide sí puede serlo.

:::definition Divisibilidad
Si $d$ y $n$ son enteros y $d\ne0$, escribimos $d\mid n$ cuando existe un entero $k$ tal que $n=dk$. Decimos que $d$ divide a $n$, que $d$ es divisor de $n$ o que $n$ es múltiplo de $d$.
:::

Por ejemplo, $6\mid42$ porque $42=6(7)$. También $6\mid0$, pues $0=6(0)$. En cambio, $6$ no divide a $43$: los múltiplos consecutivos $42$ y $48$ dejan a $43$ entre ellos. El orden importa: $6\mid42$ no significa que $42\mid6$.

:::try ¿Divide $5$ a $-35$?
Sí, porque $-35=5(-7)$ y $-7$ es un entero.
:::

### Combinar múltiplos

Si una cantidad es múltiplo de $d$, sumarle o restarle otro múltiplo de $d$ conserva la divisibilidad. La siguiente propiedad incluye esas operaciones y permite fabricar una expresión útil a partir de otras conocidas.

:::proposition Combinaciones de múltiplos
Sean $d$, $a$, $b$, $u$ y $v$ enteros, con $d\ne0$. Si $d\mid a$ y $d\mid b$, entonces $d\mid(ua+vb)$.
:::

:::proof
Como $d\mid a$, existe un entero $r$ tal que $a=dr$. Como $d\mid b$, existe un entero $s$ tal que $b=ds$. Al sustituir estas igualdades,
$$ua+vb=u(dr)+v(ds)=d(ur+vs).$$
La cantidad $ur+vs$ es entera. Por la definición, $d\mid(ua+vb)$.
:::

:::example
Si $d$ es un entero no nulo que divide a $2n+1$ y a $n+4$, con $n$ entero, demostrar que $d\mid7$.

Buscamos eliminar $n$. Por la proposición, $d$ divide a $(2n+1)-2(n+4)=-7$. Así, existe un entero $k$ con $-7=dk$. Al multiplicar por $-1$, obtenemos $7=d(-k)$; como $-k$ es entero, $d\mid7$.
:::

La conclusión no obliga a que $d$ sea $7$: también puede ser otro divisor entero de $7$. Conviene distinguir entre «divide a» y «es igual a».

:::mistake
Suponer que si $d$ divide a una suma, debe dividir a cada sumando. Por ejemplo, $3\mid(1+2)$, pero $3$ no divide ni a $1$ ni a $2$.
:::

### Mirar las últimas cifras

La escritura decimal agrupa unidades de diez en diez. Si $N$ es un entero no negativo con última cifra $r$, podemos escribir $N=10q+r$, donde $q$ es entero no negativo y $r$ es una cifra entre $0$ y $9$.

:::proposition Criterios de las últimas cifras
Un entero no negativo es divisible por $2$ o por $5$ exactamente cuando su última cifra es divisible por el divisor correspondiente. Es divisible por $4$ exactamente cuando el número formado por sus últimas dos cifras es divisible por $4$; si tiene una sola cifra, se usa esa cifra.
:::

:::proof
Como $10=2(5)=5(2)$, tanto $2$ como $5$ dividen a $10q$. Si uno de ellos divide a $N=10q+r$, también divide a $N-10q=r$ por la proposición anterior. Si divide a $r$, divide a $10q+r=N$. Esto prueba las dos direcciones para cada divisor.

Para $4$, escribimos $N=100p+t$, donde $t$ está entre $0$ y $99$ y representa las últimas dos cifras, incluyendo un posible cero inicial. Como $100p=4(25p)$, es múltiplo de $4$. Si $4\mid N$, también $4\mid(N-100p)=t$; si $4\mid t$, entonces $4\mid(100p+t)=N$. Si $N$ tiene una cifra, tomamos $p=0$ y $t=N$.
:::

:::example
Decidir si $3\,716$ es divisible por $4$ y por $5$.

Las últimas dos cifras forman $16=4(4)$, por lo que $4\mid3716$. La última cifra es $6$, que no es múltiplo de $5$; por tanto $5$ no divide a $3716$.
:::

### Sumar las cifras

El criterio para $3$ y $9$ observa todas las cifras, no solo las últimas. La razón es que cada potencia de $10$ difiere de $1$ en un múltiplo de $9$.

:::proposition Criterio de la suma de cifras
Un entero no negativo es divisible por $3$ o por $9$ exactamente cuando la suma de sus cifras decimales es divisible por el divisor correspondiente.
:::

:::proof
Sea $N=a_0+a_1 10+\cdots+a_m10^m$, con cifras $a_i$, y sea $S=a_0+a_1+\cdots+a_m$. Al restar, $N-S=\sum_{i=1}^m a_i(10^i-1)$. Para cada $i\ge1$, la identidad $10^i-1=9(1+10+\cdots+10^{i-1})$ muestra que $10^i-1$ es múltiplo de $9$ y también de $3$. Por lo tanto $N-S$ es múltiplo de ambos.

Si $N$ es múltiplo del divisor elegido, restar el múltiplo $N-S$ muestra que $S$ también lo es. Si $S$ es múltiplo de ese divisor, sumar $N-S$ muestra que $N$ también lo es. Si $N$ tiene una sola cifra, $N=S$ y la conclusión sigue siendo válida.
:::

:::example
Determinar las cifras $a$ para las que el número decimal $\overline{2a4}$ es divisible por $9$.

La suma de cifras es $2+a+4=6+a$. Como $a$ es una cifra, $6+a$ está entre $6$ y $15$; el único múltiplo de $9$ en ese intervalo es $9$. Por tanto $6+a=9$ y $a=3$. La cifra encontrada produce $234$, cuya suma de cifras es $9$.
:::

:::tip
Para demostrar divisibilidad, buscar una diferencia que sea un múltiplo conocido. Dos enteros que difieren en un múltiplo de $d$ son, o no son, divisibles por $d$ a la vez.
:::

## Agregados culturales

- Los libros VII a IX de los *Elementos* de Euclides estudian teoría de números. El libro VII incluye un procedimiento para hallar el máximo común divisor, que aparecerá en una lección posterior.
- La séptima Olimpiada Internacional de Matemáticas se celebró en 1965 en Berlín. Participaron $80$ estudiantes de $10$ países.
- Marte tarda aproximadamente $24$ horas y $37$ minutos en completar una rotación. A un día marciano se le llama «sol».

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Anotar la definición o el criterio que se utilizará. Cuando se combinen cantidades divisibles, comprobar que cada coeficiente sea entero.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Estos problemas requieren organizar casos o transformar una expresión para exhibir un factor que no aparece de inmediato.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problem = (code, titulo, enunciado, difficulty = 'basico') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })
const problems = [
  exercise('N09','Un múltiplo negativo',String.raw`Decidir si $7\mid(-63)$ y justificar mediante un factor entero.`,['Buscar un entero que multiplicado por $7$ dé $-63$.']),
  exercise('N10','Últimas cifras',String.raw`Determinar si $4$ y $5$ dividen a $1\,240$, justificando cada respuesta.`,['Examinar las dos últimas cifras para $4$ y la última para $5$.']),
  exercise('N11','Una cifra desconocida',String.raw`Determinar todas las cifras $a$ para las que $\overline{3a2}$ es divisible por $9$.`,['La suma de sus cifras debe ser un múltiplo de $9$.']),
  exercise('N12','Una combinación entera',String.raw`Si $d$ es un entero no nulo, $d\mid u$ y $d\mid v$, demostrar que $d\mid(2u-3v)$.`,['Escribir $u$ y $v$ como productos de $d$ por enteros.']),
  problem('N13','Cifras para repartir',String.raw`Determinar todas las cifras $a$ para las que $\overline{5a6}$ es divisible por $3$ y por $4$.`),
  problem('N14','Dos cantidades relacionadas',String.raw`Si $d$ es un entero no nulo que divide a $3n+2$ y a $n+5$, donde $n$ es entero, demostrar que $d\mid13$.`),
  problem('N15','Dos vecinos',String.raw`Demostrar que $n(n+1)$ es divisible por $2$ para todo entero $n$.`),
  problem('N16','Tres cifras iguales',String.raw`Demostrar que, para cualquier cifra $a$ distinta de cero, el número decimal $\overline{aaa}$ es divisible por $3$.`),
  problem('N17','Cuadrados impares',String.raw`Demostrar que la diferencia de los cuadrados de dos enteros impares es divisible por $8$.`,'intermedio'),
  problem('N18','Tres factores consecutivos',String.raw`Demostrar que $n^3-n$ es divisible por $3$ para todo entero $n$.`,'intermedio'),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-N09','TP-N10','TP-N11','TP-N12'], practice: ['TP-N01','TP-N02','TP-N13','TP-N14','TP-N15','TP-N16'], dificiles: ['TP-N17','TP-N18'] } } }
