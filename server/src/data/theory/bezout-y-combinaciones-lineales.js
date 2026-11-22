const pathSlug = 'bezout-y-combinaciones-lineales'
const collection = pathSlug
const summary = 'Construir combinaciones enteras mediante el algoritmo de Euclides y decidir cuándo una ecuación tiene soluciones enteras.'
const content = String.raw`## Preámbulo: Una diferencia con medidas fijas

Una tienda tiene pesas de dos tamaños enteros y una balanza de dos platillos. Al colocar pesas de ambos tamaños en distintos platillos, ¿qué diferencias de peso se pueden conseguir? Puede que una cantidad aparezca al combinar varias pesas, aunque no sea múltiplo de ninguno de los dos tamaños por separado.

El problema cambia si se permiten restas: poner una pesa de un lado o del otro produce contribuciones de signos opuestos. Queremos una regla que indique cuándo una diferencia es posible y un método para encontrar una combinación, sin tener que ensayar indefinidamente.

## Teoría

### Combinar enteros

Sean $a$ y $b$ enteros positivos. Una **combinación lineal entera** de ellos es un número de la forma $ax+by$, donde los coeficientes $x$ e $y$ son enteros: pueden ser positivos, negativos o cero.

En la situación de la balanza, un coeficiente positivo indica una cantidad de pesas de un lado y uno negativo, del otro. Trabajamos con diferencias enteras y suponemos que hay suficientes pesas de cada tamaño.

:::example
Expresar $7$ como combinación lineal entera de $5$ y $3$.

Como $10-3=7$, se obtiene $7=5(2)+3(-1)$. Los coeficientes son $2$ y $-1$: no es necesario que ambos sean positivos.
:::

:::try ¿Puede una combinación entera de $6$ y $10$ valer $3$?
No. Ambas cantidades son pares, así que cualquier combinación entera $6x+10y=2(3x+5y)$ es par. El número $3$ es impar.
:::

### El MCD también se puede construir

Todo divisor común de $a$ y $b$ divide a sus combinaciones enteras: si $a=du$ y $b=dv$, entonces $ax+by=d(ux+vy)$. En particular, el MCD divide a cada combinación. Lo sorprendente es que también se puede obtener mediante una de ellas.

:::theorem Identidad de Bézout
Para cualesquiera enteros positivos $a$ y $b$ existen enteros $x$ e $y$ tales que
$$ax+by=\operatorname{mcd}(a,b).$$
:::

:::proof
Aplicamos el algoritmo de Euclides. Los dos números iniciales son combinaciones enteras: $a=1a+0b$ y $b=0a+1b$.

Supongamos que dos números consecutivos del algoritmo son $r=ua+vb$ y $s=wa+zb$, con coeficientes enteros. Si al dividir $r$ entre $s$ el cociente es $q$ y el residuo es $t=r-qs$, sustituimos ambas expresiones:
$$t=(u-qw)a+(v-qz)b.$$
Como $u-qw$ y $v-qz$ son enteros, el nuevo residuo también es una combinación de $a$ y $b$. Esta operación se puede repetir en cada división; por el algoritmo de Euclides, el último residuo no nulo es el MCD. Ese residuo es, por tanto, una combinación entera de los números iniciales.
:::

La prueba afirma que existe una combinación; para encontrar sus coeficientes podemos escribir los residuos en orden inverso y sustituir hasta volver a los números iniciales.

:::example
Expresar $\operatorname{mcd}(26,15)$ como combinación lineal entera de $26$ y $15$.

Las divisiones son $26=15+11$, $15=11+4$, $11=2(4)+3$ y $4=3+1$. El MCD es $1$. Partimos de la última igualdad y sustituimos cada residuo usando la división anterior:

$$1=4-3=4-(11-2\cdot4).$$

Al distribuir el signo menos, $1=3\cdot4-11$.

Como $4=15-11$ y $11=26-15$, resulta
$$1=3(15-11)-11=3\cdot15-4\cdot11.$$

Sustituimos $11=26-15$ y distribuimos el signo menos:
$$1=3\cdot15-4(26-15).$$

Al reunir los términos, $1=7\cdot15-4\cdot26$.

Así, una respuesta es $1=26(-4)+15(7)$. Se comprueba porque $-104+105=1$.
:::

:::tip
Al sustituir un residuo precedido de un signo menos, conservar los paréntesis hasta distribuirlo. Una comprobación final de la combinación ayuda a detectar errores de signo.
:::

### Cuándo existe una solución entera

La identidad de Bézout permite responder la pregunta de existencia para una ecuación $ax+by=c$. Aquí $a$ y $b$ son positivos y $c$ es cualquier entero; no exigimos que $x$ o $y$ sean positivos.

:::theorem Criterio de existencia
Sean $a$ y $b$ enteros positivos, $c$ un entero y $d=\operatorname{mcd}(a,b)$. La ecuación $ax+by=c$ tiene una solución con $x,y$ enteros si y solo si $d\mid c$.
:::

:::proof
Si existen enteros $x,y$ con $ax+by=c$, como $d$ divide a $a$ y a $b$, también divide a la combinación $ax+by=c$. Esto prueba que la divisibilidad es necesaria.

Recíprocamente, si $d\mid c$, existe un entero $k$ con $c=dk$. Por Bézout existen enteros $u,v$ con $au+bv=d$. Multiplicamos esta igualdad por $k$ y obtenemos $a(ku)+b(kv)=dk=c$. Los coeficientes $ku$ y $kv$ son enteros, de modo que proporcionan una solución.
:::

:::example
Decidir si $26x+15y=2$ tiene solución entera y encontrar una.

Como $\operatorname{mcd}(26,15)=1$ divide a $2$, el criterio garantiza una solución. Ya obtuvimos $26(-4)+15(7)=1$; al multiplicar cada lado por $2$ queda $26(-8)+15(14)=2$. Por tanto $x=-8$ y $y=14$ forman una solución.
:::

:::mistake
Tratar una solución entera como si fuera automáticamente una solución con coeficientes no negativos. Por ejemplo, $6x+10y=2$ tiene la solución entera $x=2$, $y=-1$, pero con $x,y\ge0$ no puede sumar $2$: cada término no nulo sería al menos $6$ o $10$.
:::

## Agregados culturales

- El matemático francés Étienne Bézout escribió libros de matemáticas destinados a estudiantes de la marina. También estudió métodos para resolver ecuaciones algebraicas.
- La décima Olimpiada Internacional de Matemáticas se celebró en Moscú en 1968. Participaron $96$ estudiantes de $12$ países.
- En 1977 se lanzaron dos sondas Voyager para estudiar planetas exteriores. Voyager 2 salió en agosto y Voyager 1, en septiembre.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Antes de buscar coeficientes, calcular el MCD y revisar si divide a la cantidad solicitada. Si existe solución, verificar la combinación encontrada.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Además de encontrar una solución, habrá que describir todas las soluciones enteras y justificar que la descripción está completa.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problem = (code, titulo, enunciado, difficulty = 'basico') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })
const problems = [
  exercise('N39','Construir el MCD',String.raw`Expresar $\operatorname{mcd}(6,9)$ como combinación lineal entera de $6$ y $9$.`,['Calcular primero el MCD y comparar los dos números.']),
  exercise('N40','Decidir existencia',String.raw`Determinar si existen enteros $x,y$ tales que $8x+12y=20$.`,['Comprobar si el MCD de $8$ y $12$ divide a $20$.']),
  exercise('N41','Una ecuación imposible',String.raw`Determinar si existen enteros $x,y$ tales que $8x+12y=7$.`,['Todo divisor común de $8$ y $12$ divide al lado izquierdo.']),
  exercise('N42','Una combinación pequeña',String.raw`Encontrar enteros $x,y$ que satisfagan $2x+3y=1$.`,['Restar una vez $2$ de $3$.']),
  problem('N43','Construir tres',String.raw`Encontrar enteros $x,y$ que satisfagan $21x+15y=3$.`),
  problem('N44','Decidir y construir',String.raw`Determinar si existen enteros $x,y$ tales que $10x+16y=14$ y, si existen, encontrar una pareja.`),
  problem('N45','Un múltiplo necesario',String.raw`Determinar si existen enteros $x,y$ tales que $9x+15y=5$ y justificar la respuesta.`),
  problem('N46','Una diferencia de uno',String.raw`Expresar $1$ como combinación lineal entera de $8$ y $15$.`),
  problem('N47','Todas las soluciones pequeñas',String.raw`Determinar todas las parejas de enteros $(x,y)$ que satisfacen $8x+12y=20$.`,'intermedio'),
  problem('N48','Todas las soluciones de Bézout',String.raw`Determinar todas las parejas de enteros $(x,y)$ que satisfacen $35x+22y=1$.`,'intermedio'),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-N39','TP-N40','TP-N41','TP-N42'], practice: ['TP-N07','TP-N08','TP-N43','TP-N44','TP-N45','TP-N46'], dificiles: ['TP-N47','TP-N48'] } } }
