const pathSlug = 'aritmetica-modular'
const collection = pathSlug
const summary = 'Trabajar con residuos y congruencias para simplificar cálculos, estudiar potencias y demostrar imposibilidades.'
const content = String.raw`## Preámbulo: Volver al mismo día

Un martes comienza una actividad que se repetirá dentro de cien días. Una persona cuenta día por día en el calendario; otra propone quitar semanas completas antes de empezar a contar. Las dos buscan el mismo día de la semana, pero la segunda no necesita distinguir entre cien días y el tiempo que sobra después de retirar todas las semanas completas.

¿Qué información se conserva al quitar grupos de siete? Esa pregunta aparece también al estudiar las últimas cifras de una potencia o al decidir si una ecuación entera puede tener solución. La aritmética modular permite hablar con precisión de estas repeticiones.

## Teoría

### Congruencia y residuo

:::definition Congruencia
Sean $a,b$ enteros y $m\ge2$ un entero. Decimos que $a$ es congruente con $b$ módulo $m$, y escribimos $a\equiv b\pmod m$, si $m$ divide a $a-b$. Es decir, existe un entero $k$ tal que $a-b=km$.
:::

La congruencia no afirma que $a$ y $b$ sean iguales. Afirma que su diferencia es un múltiplo del módulo. Por ejemplo, $17\equiv3\pmod7$ porque $17-3=14=2\cdot7$; también $-3\equiv4\pmod7$ porque $-3-4=-7$.

Cada entero tiene un único residuo entre $0$ y $m-1$ al dividirse entre $m$. Dos enteros son congruentes módulo $m$ precisamente cuando tienen el mismo residuo. Para verlo, escribimos $a=mq+r$ y $b=mp+s$, donde $r,s$ son sus residuos. Si $a-b$ es múltiplo de $m$, también lo es $r-s=(a-b)-m(q-p)$. Como $r-s$ está entre $-(m-1)$ y $m-1$, debe ser cero. En sentido inverso, si $r=s$, al restar las expresiones de $a$ y $b$ queda $a-b=m(q-p)$, un múltiplo de $m$.

:::try Si hoy es martes, ¿qué día será dentro de $100$ días?
Como $100=14\cdot7+2$, al retirar $14$ semanas completas quedan $2$ días. Dos días después del martes es jueves.
:::

### Sumar y multiplicar

:::proposition Operaciones con congruencias
Si $a\equiv b\pmod m$ y $c\equiv d\pmod m$, entonces $a+c\equiv b+d\pmod m$ y $ac\equiv bd\pmod m$.
:::

:::proof
Por las hipótesis existen enteros $k$ y $\ell$ con $a-b=km$ y $c-d=\ell m$. Para la suma, restamos los dos resultados:
$$(a+c)-(b+d)=m(k+\ell).$$
Como $k+\ell$ es entero, $m$ divide a la diferencia. Para el producto, sumamos y restamos $bc$:
$$ac-bd=(a-b)c+b(c-d).$$
Al sustituir $a-b=km$ y $c-d=\ell m$, queda $ac-bd=m(kc+b\ell)$. El factor entre paréntesis es entero, así que $m$ divide a esta diferencia. Esto demuestra ambas congruencias.
:::

Al repetir la regla del producto, también se pueden reemplazar factores por representantes congruentes en potencias de exponente entero no negativo. Por ejemplo, $9\equiv2\pmod7$ permite usar $2$ para calcular un residuo de $9^n$.

:::mistake
Cancelar un factor en una congruencia sin justificarlo. Se cumple $2\cdot1\equiv2\cdot4\pmod6$, porque $2-8=-6$, pero $1$ y $4$ no son congruentes módulo $6$: su diferencia $-3$ no es múltiplo de $6$. La cancelación requiere condiciones adicionales.
:::

### Potencias y ciclos

:::example
Encontrar el residuo de $2^{20}$ al dividir entre $7$.

Como $2^3=8\equiv1\pmod7$ y $20=3\cdot6+2$, escribimos $2^{20}=(2^3)^6\cdot2^2$. Al reemplazar cada factor $2^3$ por $1$ módulo $7$, obtenemos $2^{20}\equiv1^6\cdot4\equiv4\pmod7$. El residuo pedido es $4$, que está entre $0$ y $6$.
:::

El ciclo se justifica a partir de una potencia congruente con $1$ y de las reglas de multiplicación. No basta observar que algunos residuos se repiten: hay que explicar cómo se usa esa repetición para el exponente solicitado.

:::example
Encontrar el residuo de $(-2)^{13}$ al dividir entre $5$.

Como $(-2)^4=16$ y $16-1=15$ es múltiplo de $5$, se tiene $(-2)^4\equiv1\pmod5$. Escribimos $13=4\cdot3+1$ y sustituimos en la potencia: $(-2)^{13}=((-2)^4)^3(-2)$. Por la regla del producto, el resultado es congruente con $-2$, y $-2\equiv3\pmod5$. El residuo entre $0$ y $4$ es $3$.
:::

Un representante negativo puede hacer más corta una cuenta, aunque el residuo final se expresa aquí como un entero no negativo menor que el módulo.

### Descartar una posibilidad

:::example
Demostrar que no existen enteros $n$ y $k$ con $n^2=3k+2$.

Al dividir $n$ entre $3$, su residuo es $0$, $1$ o $2$. Si es $0$, entonces $n\equiv0\pmod3$ y $n^2\equiv0\pmod3$. Si es $1$, entonces $n^2\equiv1\pmod3$. Si es $2$, entonces $n^2\equiv4\equiv1\pmod3$. En todos los casos el residuo del cuadrado es $0$ o $1$, mientras que $3k+2$ tiene residuo $2$. Por tanto la igualdad es imposible.
:::

:::tip
Antes de elegir un módulo para una imposibilidad, probar qué residuos pueden tomar las expresiones involucradas. Después justificar que se cubrieron todos los residuos posibles y compararlos con el residuo exigido.
:::

## Agregados culturales

- En *Disquisitiones Arithmeticae*, publicado en 1801, Carl Friedrich Gauss usó el símbolo $\equiv$ para las congruencias. La notación permite expresar relaciones entre enteros según un módulo.
- La decimocuarta Olimpiada Internacional de Matemáticas se celebró en Toruń, Polonia, en 1972. Participaron $107$ estudiantes de $14$ países.
- La Tierra gira alrededor de su eje mientras orbita el Sol. Un día solar medio dura aproximadamente $24$ horas.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Justificar las operaciones con congruencias y expresar los residuos finales en el intervalo pedido.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Al proponer un ciclo o una imposibilidad, explicar por qué el argumento cubre todos los exponentes o residuos relevantes.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problem = (code, titulo, enunciado, difficulty = 'basico') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })
const problems = [
  exercise('M05', 'Residuo negativo', String.raw`Encontrar el residuo de $-17$ al dividir entre $5$ y justificar la respuesta.`, [String.raw`Buscar un entero $q$ con $-17=5q+r$ y $0\le r<5$.`]),
  exercise('M06', 'Una congruencia', String.raw`Encontrar el residuo de $23$ al dividir entre $7$ y escribir la congruencia correspondiente.`, ['Restar un múltiplo de $7$ que deje un número entre $0$ y $6$.']),
  exercise('M07', 'Una potencia', String.raw`Encontrar el residuo de $4^5$ al dividir entre $7$.`, ['Calcular $4^2$ y $4^3$ módulo $7$.']),
  exercise('M08', 'Cuadrados módulo cuatro', String.raw`Demostrar que ningún cuadrado de un entero deja residuo $3$ al dividirse entre $4$.`, ['Separar el caso de un entero par y el de uno impar.']),
  problem('M09', 'Una potencia grande', String.raw`Encontrar el residuo de $7^{100}$ al dividir entre $5$.`),
  problem('M10', 'La última cifra', String.raw`Determinar la última cifra decimal de $13^{2025}$ y justificar la respuesta.`),
  problem('M11', 'Un cuadrado impar', String.raw`Demostrar que el cuadrado de todo entero impar deja residuo $1$ al dividir entre $8$.`),
  problem('M12', 'Un residuo imposible', String.raw`Demostrar que ningún cuadrado de un entero deja residuo $5$ al dividir entre $8$.`),
  problem('M13', 'Potencias módulo siete', String.raw`Para un entero $n\ge0$, demostrar que $2^n\equiv1\pmod7$ si y solo si $n$ es múltiplo de $3$.`, 'intermedio'),
  problem('M14', 'Un producto divisible', String.raw`Demostrar que $n^5-n$ es divisible por $30$ para todo entero $n$.`, 'intermedio'),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-M05','TP-M06','TP-M07','TP-M08'], practice: ['TP-M01','TP-M02','TP-M09','TP-M10','TP-M11','TP-M12'], dificiles: ['TP-M13','TP-M14'] } } }
