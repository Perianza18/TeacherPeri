const pathSlug = 'inversos-y-congruencias-lineales'
const collection = pathSlug
const summary = 'Usar inversos y el máximo común divisor para decidir la existencia de soluciones y encontrar todas las clases de una congruencia lineal.'
const content = String.raw`## Preámbulo: Deshacer un salto

En un juego, una ficha avanza siempre el mismo número de casillas y el tablero vuelve a empezar después de la última. Si se conoce la casilla final, ¿se puede recuperar siempre la casilla inicial? Con algunos tamaños de salto, cada posición conduce a una casilla diferente; con otros, dos posiciones pueden terminar en la misma.

En una congruencia lineal aparece una pregunta parecida: si conocemos el residuo de $ax$, ¿cuánto sabemos sobre $x$? La respuesta depende de la relación entre el salto $a$ y el módulo. A veces existe una operación inversa; otras veces hay varias posibilidades o ninguna.

## Teoría

### Inversos módulo un entero

Fijamos un entero $m\ge2$. Un **inverso de $a$ módulo $m$** es un entero $u$ tal que $au\equiv1\pmod m$. Por ejemplo, $3$ tiene inverso $5$ módulo $7$, pues $3\cdot5-1=14$ es múltiplo de $7$.

:::proposition Criterio de invertibilidad
Un entero $a$ tiene inverso módulo $m$ si y solo si $\gcd(a,m)=1$.
:::

:::proof
Si $u$ es inverso, $au\equiv1\pmod m$, así que existe un entero $k$ con $au-1=km$. Entonces $au-km=1$. Todo divisor común de $a$ y $m$ divide ambos términos del lado izquierdo y, por tanto, divide a $1$. El máximo común divisor es $1$.

En sentido inverso, si $\gcd(a,m)=1$, la identidad de Bézout da enteros $u,v$ tales que $au+mv=1$. Al restar $mv$ y $1$ de ambos lados, se obtiene $au-1=-mv$, múltiplo de $m$. Por definición, $au\equiv1\pmod m$, así que $u$ es un inverso.
:::

Si $u$ y $v$ son inversos del mismo $a$, entonces $av\equiv1$ y $ua\equiv1$ módulo $m$. Multiplicando la primera congruencia por $u$ y la segunda por $v$ se obtiene $u\equiv u(av)=(ua)v\equiv v\pmod m$. Por ello el inverso, cuando existe, determina una sola clase módulo $m$, aunque pueda tener muchos representantes enteros.

:::try ¿Tiene inverso $4$ módulo $6$?
No. Como $\gcd(4,6)=2$, el criterio descarta un inverso. También puede verse que $4u$ es par para todo entero $u$, mientras que $4u-1$ es impar y no puede ser múltiplo de $6$.
:::

### Una solución cuando hay inverso

:::example
Resolver $3x\equiv5\pmod7$.

Como $3\cdot5=15\equiv1\pmod7$, multiplicamos ambos lados por $5$: $x\equiv25\equiv4\pmod7$. Todo entero de esa clase sirve: si $x=4+7t$, entonces $3x-5=7+21t=7(1+3t)$. A la vez, multiplicar por el inverso mostró que cualquier solución debe pertenecer a esa clase.
:::

Multiplicar una congruencia por un entero conserva la congruencia. Cuando ese entero es el inverso, permite despejar la clase de $x$. No se debe usar esta operación como si todo coeficiente tuviera inverso.

:::mistake
De $6x\equiv8\pmod{14}$, dividir $6$ y $8$ entre $2$ y dejar el módulo $14$. La condición original es $14\mid(6x-8)$, equivalente a $7\mid(3x-4)$: también hay que dividir el módulo por $2$.
:::

### El criterio general

:::proposition Soluciones de una congruencia lineal
Sean $a,b$ enteros, $m\ge2$ y $d=\gcd(a,m)$. La congruencia $ax\equiv b\pmod m$ tiene solución si y solo si $d$ divide a $b$. Cuando tiene solución, hay exactamente $d$ clases distintas módulo $m$.
:::

:::proof
Si $x$ es solución, existe un entero $k$ con $ax-b=mk$, por lo que $b=ax-mk$. Como $d$ divide a $a$ y a $m$, divide a $b$.

Ahora supongamos que $d$ divide a $b$. Si $d=m$, tanto $a$ como $b$ son múltiplos de $m$, así que $ax-b$ es múltiplo de $m$ para todo entero $x$. Sirven las $m=d$ clases.

Si $d<m$, escribimos $a=da'$, $b=db'$ y $m=dm'$. La condición $m\mid(ax-b)$ equivale a $m'\mid(a'x-b')$: en una dirección se divide la igualdad $d(a'x-b')=dm'k$ entre el entero positivo $d$; en la otra se multiplica por $d$. Además $m'\ge2$ y $\gcd(a',m')=1$, de modo que $a'$ tiene inverso módulo $m'$. Al multiplicar por él se obtiene una única clase solución $x\equiv x_0\pmod{m'}$.

Todo representante de esa clase tiene la forma $x_0+tm'$. Al escribir $t=dh+j$ con $0\le j<d$, se ve que módulo $m=dm'$ pertenece a una de las clases $x_0+jm'$ para $j=0,\ldots,d-1$. Son distintas: si las clases con índices $i$ y $j$ fueran congruentes módulo $m$, existiría un entero $k$ con $m'(j-i)=dm'k$. Al dividir entre $m'>0$, quedaría $j-i=dk$. Pero el valor absoluto de $j-i$ es menor que $d$, así que $j-i=0$ y los índices son iguales. Por tanto hay exactamente $d$ clases.
:::

### Reducir y comprobar

:::example
Resolver $6x\equiv8\pmod{14}$ y dar todas las clases módulo $14$.

El máximo común divisor de $6$ y $14$ es $2$, que divide a $8$. Al dividir coeficiente, objetivo y módulo entre $2$, obtenemos $3x\equiv4\pmod7$. El inverso de $3$ módulo $7$ es $5$, así que $x\equiv20\equiv6\pmod7$.

Módulo $14$ aparecen las dos clases $x\equiv6$ y $x\equiv13$. Se comprueban: $6\cdot6-8=28$ y $6\cdot13-8=70$ son múltiplos de $14$. En cambio, $6x\equiv7\pmod{14}$ no tiene solución, porque $2$ no divide a $7$.
:::

:::tip
Calcular primero $d=\gcd(a,m)$ y revisar si divide al objetivo. Si se reduce, anotar el módulo nuevo; al final enumerar y comprobar las clases en el módulo original.
:::

## Agregados culturales

- Étienne Bézout escribió libros de matemáticas para la formación de oficiales franceses. También publicó una obra sobre ecuaciones algebraicas en 1779.
- La decimoquinta Olimpiada Internacional de Matemáticas se celebró en Moscú en 1973. Participaron $125$ estudiantes de $16$ países.
- Los pulpos tienen tres corazones. Dos impulsan sangre hacia las branquias y el tercero la distribuye por el cuerpo.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Encontrar inversos o reducir por el máximo común divisor, y verificar las respuestas en el módulo original.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Justificar tanto la existencia como la ausencia de otras clases; tratar explícitamente los casos en que no hay solución.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problem = (code, titulo, enunciado, difficulty = 'basico') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })
const problems = [
  exercise('M15', 'Un inverso pequeño', String.raw`Encontrar un inverso de $4$ módulo $7$ y comprobarlo.`, ['Buscar un entero $u$ para el que $4u-1$ sea múltiplo de $7$.']),
  exercise('M16', 'Despejar una clase', String.raw`Resolver $3x\equiv1\pmod7$ y dar todas las soluciones enteras.`, ['Buscar el inverso de $3$ módulo $7$.']),
  exercise('M17', 'Dos clases', String.raw`Resolver $4x\equiv2\pmod6$ y dar todas las clases de soluciones módulo $6$.`, ['El máximo común divisor es $2$; dividir también el módulo.']),
  exercise('M18', 'Una imposibilidad', String.raw`Decidir si $4x\equiv3\pmod6$ tiene soluciones enteras y justificar.`, ['Comparar la paridad de $4x-3$ con la de los múltiplos de $6$.']),
  problem('M19', 'Inverso módulo diez', String.raw`Encontrar todas las clases de inversos de $7$ módulo $10$ y justificar que no hay otras.`),
  problem('M20', 'Un coeficiente invertible', String.raw`Resolver $5x\equiv8\pmod{12}$ y describir todas las soluciones enteras.`),
  problem('M21', 'Cuatro clases', String.raw`Resolver $8x\equiv12\pmod{20}$ y dar todas las clases de soluciones módulo $20$.`),
  problem('M22', 'Tres clases', String.raw`Resolver $9x\equiv6\pmod{15}$ y dar todas las clases de soluciones módulo $15$.`),
  problem('M23', 'Todas o ninguna', String.raw`Resolver por separado $15x\equiv10\pmod5$ y $15x\equiv12\pmod5$. En cada caso indicar todas las clases solución módulo $5$.`, 'intermedio'),
  problem('M24', 'Un inverso compartido', String.raw`Encontrar todos los enteros $m\ge2$ para los que existe un entero $u$ que es inverso tanto de $10$ como de $3$ módulo $m$.`, 'intermedio'),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-M15','TP-M16','TP-M17','TP-M18'], practice: ['TP-M03','TP-M04','TP-M19','TP-M20','TP-M21','TP-M22'], dificiles: ['TP-M23','TP-M24'] } } }
