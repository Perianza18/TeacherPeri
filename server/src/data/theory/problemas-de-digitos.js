const pathSlug = 'problemas-de-digitos'
const collection = pathSlug
const summary = 'Traducir condiciones sobre cifras decimales a ecuaciones y usar el valor posicional para demostrar qué números son posibles.'
const content = String.raw`## Preámbulo: Un número escrito al revés

Una persona escribe un número de dos cifras, lo invierte y resta el menor del mayor. Su amiga repite el juego con otro número y observa algo curioso: las dos diferencias son múltiplos de nueve. ¿Será una coincidencia o habrá algo en la forma de escribir los números que obligue a que eso ocurra?

Para investigar no basta con cambiar los nombres de las cifras. La primera cifra vale decenas antes de invertir y unidades después. Al expresar ese cambio con cuidado, una pregunta sobre símbolos se convierte en una relación entre enteros.

## Teoría

### Una cifra no vale lo mismo en cada posición

Si $a$ es la cifra de las decenas y $b$ la de las unidades, el número decimal de dos cifras se escribe $\overline{ab}$ y vale $10a+b$. La barra indica que las cifras están juntas; no significa el producto $ab$.

:::definition Restricciones de las cifras
En un número decimal de dos cifras $\overline{ab}$ se tiene $a,b$ enteros, $1\le a\le9$ y $0\le b\le9$. Si al invertirlas se exige otro número de dos cifras, también se necesita $b\ge1$.
:::

Por ejemplo, $\overline{40}=40$ es de dos cifras, pero al invertir sus símbolos se obtiene $04$, que representa el número $4$ de una sola cifra. La condición sobre el número invertido no debe suponerse si el problema no la incluye.

:::try Si $a=6$ y $b=2$, ¿cuánto valen $\overline{ab}$ y $\overline{ba}$?
El primero vale $10\cdot6+2=62$. Al invertir, el segundo vale $10\cdot2+6=26$. La cifra de las decenas cambia con el orden.
:::

### Invertir y restar

:::proposition Diferencia al invertir dos cifras
Para cifras decimales $a$ y $b$, la diferencia entre $10a+b$ y $10b+a$ es múltiplo de $9$.
:::

:::proof
Restamos el segundo número del primero:
$$(10a+b)-(10b+a)=9a-9b.$$
Al sacar factor común queda $9(a-b)$. Como $a-b$ es entero, la diferencia es múltiplo de $9$. Si se resta en el orden contrario, se obtiene $9(b-a)$, que también es múltiplo de $9$.
:::

Esto explica el juego inicial para cualquier elección de cifras. Si se resta el menor del mayor se obtiene una diferencia no negativa; el argumento funciona en ambos órdenes. La diferencia puede ser cero cuando las cifras son iguales.

:::mistake
Suponer que $\overline{ab}=a+b$. El número $\overline{ab}$ vale $10a+b$; $a+b$ es la suma de sus cifras. Por ejemplo, $\overline{23}=23$, mientras que $2+3=5$.
:::

### Traducir, resolver y verificar

:::example
Encontrar todos los números de dos cifras tales que el número sea cinco veces la suma de sus cifras.

Sea $\overline{ab}=10a+b$, con $1\le a\le9$ y $0\le b\le9$. La condición se traduce a $10a+b=5(a+b)$. Al desarrollar y restar $5a+b$ de ambos lados obtenemos $5a=4b$.

Como $4$ divide a $5a$ y $5a=4a+a$, también divide a $a$: al restar el múltiplo $4a$ de $5a$ queda $a$. En el intervalo permitido, $a=4$ o $a=8$. Si $a=4$, la ecuación $5a=4b$ da $b=5$. Si $a=8$, da $b=10$, que no es una cifra decimal. La única candidata es $45$; se comprueba que $45=5(4+5)$.
:::

Las restricciones hicieron posible terminar la búsqueda y descartar $b=10$. La comprobación final asegura que la candidata sí satisface el enunciado; el análisis de $a$ muestra que no se omitieron otras posibilidades.

### Más de dos cifras

Para un número decimal de tres cifras $\overline{abc}$, la cifra de las centenas $a$ es un entero de $1$ a $9$ y las cifras $b,c$ son enteros de $0$ a $9$. El valor es $100a+10b+c$. Si la escritura invertida $\overline{cba}$ debe tener tres cifras, se requiere además $c\ne0$. Al restar la escritura invertida de la original, la cifra central se cancela: $100a+10b+c-(100c+10b+a)=99(a-c)$. Por tanto la diferencia es múltiplo de $99$. El signo depende de cuál de las cifras extremas sea mayor; si son iguales, la diferencia es cero.

:::example
Un número de tres cifras tiene $3$ centenas, $4$ decenas y $2$ unidades. ¿Cuánto aumenta al intercambiar las centenas y las unidades?

El número original es $342$ y el invertido es $243$. El cambio se obtiene restando el valor original del nuevo: $243-342=-99$. Por tanto, no aumenta; disminuye en $99$. En ambas escrituras la primera cifra es distinta de cero.
:::

:::tip
Traducir cada frase por separado: «la suma de las cifras» es $a+b$, «el número invertido» es $10b+a$ y «la cifra de las decenas supera en dos a la de unidades» es $a=b+2$. Al final comprobar todas las condiciones en los números encontrados.
:::

## Agregados culturales

- El matemático D. R. Kaprekar estudió patrones en las cifras decimales. En 1949 presentó un resultado relacionado con el número $6174$, conocido como constante de Kaprekar.
- La duodécima Olimpiada Internacional de Matemáticas se celebró en Keszthely, Hungría, en 1970. Participaron $112$ estudiantes de $14$ países.
- Júpiter es el planeta más grande del sistema solar. Su diámetro ecuatorial es aproximadamente once veces el de la Tierra.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Definir las cifras, escribir sus restricciones y comprobar las respuestas en el enunciado original.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Buscar una relación entre las cifras antes de enumerar posibilidades y justificar que la búsqueda es completa.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problem = (code, titulo, enunciado, difficulty = 'basico') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })
const problems = [
  exercise('D15', 'Decenas y unidades', String.raw`Un número tiene $8$ decenas y $3$ unidades. Escribir el número y el que se obtiene al invertir sus cifras.`, ['La cifra de las decenas se multiplica por $10$.']),
  exercise('D16', 'Invertir y restar', String.raw`Encontrar todos los números de dos cifras que, al restarles el número de dos cifras obtenido al invertirlas, dan $45$.`, ['Si las cifras son $a$ y $b$, la diferencia es $9(a-b)$; ambas cifras deben ser positivas.']),
  exercise('D17', 'La suma y el doble', String.raw`Encontrar todos los números de dos cifras cuya suma de cifras es $9$ y cuya cifra de las decenas es el doble de la de unidades.`, ['Llamar $u$ a la cifra de las unidades y expresar ambas condiciones con $u$.']),
  exercise('D18', 'Dos condiciones', String.raw`Un número de dos cifras supera en $18$ al número de dos cifras que se obtiene al invertirlo. Si sus cifras suman $8$, encontrarlo.`, ['Expresar la diferencia como $9(a-b)$ y combinarla con $a+b=8$.']),
  problem('D19', 'Tres veces la suma', String.raw`Encontrar todos los números decimales de dos cifras que son tres veces la suma de sus cifras.`),
  problem('D20', 'Suma y diferencia', String.raw`Un número de dos cifras y su invertido, también de dos cifras, tienen suma $143$. El mayor supera al menor en $45$. Encontrar ambos números.`),
  problem('D21', 'Tres cifras invertidas', String.raw`Un número de tres cifras y el que resulta de invertirlas son ambos de tres cifras. Encontrar todos aquellos para los que el primero supera al segundo en $198$.`),
  problem('D22', 'Cifras relacionadas', String.raw`Un número de tres cifras tiene suma de cifras $9$. Su cifra de las unidades es el doble de la de las centenas y la de las decenas supera en $1$ a la de las centenas. Encontrarlo.`),
  problem('D23', 'El doble del invertido', String.raw`Demostrar que ningún número decimal de dos cifras es el doble del número de dos cifras que se obtiene al invertirlo.`, 'intermedio'),
  problem('D24', 'Suma de cuadrados', String.raw`Determinar todos los números decimales de dos cifras que son iguales a la suma de los cuadrados de sus cifras. Justificar la respuesta.`, 'intermedio'),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-D15','TP-D16','TP-D17','TP-D18'], practice: ['TP-D03','TP-D04','TP-D19','TP-D20','TP-D21','TP-D22'], dificiles: ['TP-D23','TP-D24'] } } }
