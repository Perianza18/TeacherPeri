const pathSlug = 'factorizacion-e-identidades'
const collection = pathSlug
const summary = 'Transformar sumas y diferencias en productos para calcular, reconocer cuadrados y demostrar propiedades de divisibilidad.'
const content = String.raw`## Preámbulo: Un cálculo sin cuadrados grandes

El número $101^2-99^2$ se puede calcular elevando cada número al cuadrado y después restando. Hay otra ruta: $101$ y $99$ difieren en $2$ y suman $200$, cuyo producto es $400$. Esa observación sugiere que la resta de cuadrados puede esconder un producto sencillo.

Una igualdad verificada con estos números no garantiza que funcione en otros casos. Para convertir la idea en una herramienta necesitamos demostrarla con letras y reconocer cuándo conviene aplicarla. También hace falta aprender a formar un cuadrado o un factor común que no aparece a primera vista.

## Teoría

### Sacar un factor común

Factorizar una expresión significa escribirla como producto de otras expresiones. Usaremos las propiedades distributiva, asociativa y conmutativa de los números reales. La igualdad siguiente funciona en ambas direcciones: permite desarrollar un producto o reunir términos en uno solo.

:::proposition Factor común
Para cualesquiera números reales $a$, $b$ y $c$ se cumple
$$ab+ac=a(b+c).$$
:::

:::proof
Por la propiedad distributiva, $a(b+c)=ab+ac$. Intercambiar los lados de esta igualdad da $ab+ac=a(b+c)$.
:::

El factor común también puede ser una expresión con varios términos. La igualdad siguiente lo muestra sin exigir que ese factor sea distinto de cero.

:::example
Factorizar $x(x+3)+5(x+3)$ para todo número real $x$.

Los dos términos contienen el factor $x+3$. En la propiedad anterior tomamos $a=x+3$, $b=x$ y $c=5$. Como la multiplicación de reales es conmutativa, resulta $x(x+3)+5(x+3)=(x+3)(x+5)$. La igualdad sigue siendo válida para $x=-3$: ambos lados valen cero.
:::

:::try ¿Cuál es el factor común de $6n^2+9n$ que incluye el mayor factor entero positivo y la mayor potencia de $n$ presentes en ambos términos?
Es $3n$: $6n^2+9n=3n(2n+3)$. Esta igualdad vale para todo número real $n$, incluido $n=0$.
:::

### Diferencia de cuadrados

Volvamos al cálculo del preámbulo. Una forma de descubrir el producto es desarrollar una suma por una diferencia y observar qué términos se cancelan.

:::theorem Diferencia de cuadrados
Para cualesquiera números reales $a$ y $b$,
$$a^2-b^2=(a-b)(a+b).$$
:::

:::proof
Por la propiedad distributiva, $(a-b)(a+b)=a^2+ab-ba-b^2$. Como $ab=ba$, los términos $ab$ y $-ba$ suman cero. Queda $(a-b)(a+b)=a^2-b^2$; al intercambiar los lados se obtiene la identidad.
:::

El producto puede ser más fácil de calcular cuando la suma y la diferencia de los dos números son sencillas.

:::example
Calcular $101^2-99^2$ sin calcular los dos cuadrados por separado.

La expresión es una diferencia de cuadrados. Tomamos $a=101$ y $b=99$ en la identidad: $101^2-99^2=(101-99)(101+99)=2\cdot200=400$.
:::

:::mistake
Aplicar la fórmula a una suma de cuadrados. En general, $a^2+b^2$ no es $(a-b)(a+b)$: el producto de la derecha es $a^2-b^2$. Por ejemplo, con $a=b=1$ la suma vale $2$ y el producto vale $0$.
:::

### Reconocer un cuadrado

Al desarrollar un cuadrado de una suma aparecen dos productos iguales. Conocerlos permite leer la igualdad de derecha a izquierda y transformar tres términos en un cuadrado.

:::proposition Cuadrados de una suma y una diferencia
Para cualesquiera números reales $a$ y $b$ se cumplen las dos igualdades:
$$(a+b)^2=a^2+2ab+b^2.$$

También se cumple
$$(a-b)^2=a^2-2ab+b^2.$$
:::

:::proof
Por distributividad, $(a+b)^2=(a+b)(a+b)=a^2+ab+ba+b^2$. Como $ab=ba$, la suma $ab+ba$ es $2ab$, y queda la primera igualdad.

Para la segunda, $(a-b)^2=(a-b)(a-b)=a^2-ab-ba+b^2$. Como $ab=ba$, la suma $-ab-ba$ es $-2ab$, y queda $(a-b)^2=a^2-2ab+b^2$.
:::

Estas igualdades también valen para números negativos; no requieren que $a$ o $b$ sean positivos.

:::example
Demostrar que $n(n+2)+1$ es un cuadrado perfecto para todo entero $n$.

Primero desarrollamos el producto: $n(n+2)+1=n^2+2n+1$. Esta expresión coincide con $a^2+2ab+b^2$ al tomar $a=n$ y $b=1$. Por la identidad, $n^2+2n+1=(n+1)^2$. Como $n+1$ es entero, el resultado es un cuadrado perfecto, incluso cuando $n$ es negativo o cero.
:::

:::tip
Si varios factores contienen expresiones parecidas, multiplicar primero los que producen términos relacionados. Después se puede nombrar esa expresión común y buscar una identidad conocida.
:::

### Agrupar antes de factorizar

En ocasiones ningún factor aparece en todos los términos desde el principio. Agrupar permite construir dos sumandos con un factor común. La agrupación debe conservar los signos de todos los términos.

:::example
Factorizar $x^3+2x^2+3x+6$ para todo número real $x$.

Los primeros dos términos tienen factor $x^2$ y los últimos dos tienen factor $3$. Al agruparlos obtenemos $x^2(x+2)+3(x+2)$. Ahora el factor común es $x+2$, de modo que la expresión es $(x+2)(x^2+3)$. Al desarrollar este producto se recuperan los cuatro términos iniciales.
:::

## Agregados culturales

- En octubre de 1903, en una reunión de la Sociedad Matemática Estadounidense, Frank Nelson Cole calculó $2^{67}-1$ en el pizarrón y después, en otro, el producto $193\,707\,721\cdot761\,838\,257\,287$. Los dos resultados coincidían. Sin decir una palabra, mostró así que $2^{67}-1$ no es primo; contó después que encontrar esa factorización le había llevado «los domingos de tres años».
- La tercera Olimpiada Internacional de Matemáticas tuvo lugar en Veszprém, Hungría, en 1961. Participaron $48$ estudiantes.
- Según la NASA, Mercurio tarda unos $88$ días terrestres en dar una vuelta alrededor del Sol, pero unos $59$ en girar una vez sobre su eje. Al combinar los dos movimientos, de un amanecer al siguiente en Mercurio pasan unos $176$ días terrestres, el doble de su año.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Antes de desarrollar todos los productos, conviene buscar factores comunes y diferencias de cuadrados. La forma factorizada puede mostrar una propiedad de divisibilidad o un cuadrado entero.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

La dificultad está en introducir una expresión auxiliar o reagrupar términos para descubrir una identidad que no se ve en la forma inicial.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problem = (code, titulo, enunciado, difficulty = 'basico') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })
const problems = [
  exercise('A07','Factor común',String.raw`Factorizar $8x^2+12x$ para todo número real $x$.`,['Buscar el mayor factor entero positivo común y la potencia de $x$ común.']),
  exercise('A08','Diferencia de cuadrados',String.raw`Factorizar $25y^2-9$ para todo número real $y$.`,['Escribir cada término como un cuadrado.']),
  exercise('A09','Trinomio cuadrado',String.raw`Escribir $t^2-10t+25$ como el cuadrado de una expresión, para todo número real $t$.`,['Comparar el término central con $-2ab$.']),
  exercise('A10','Agrupar términos',String.raw`Factorizar $x^3+4x^2+2x+8$ para todo número real $x$.`,['Agrupar los dos primeros términos y después los dos últimos.']),
  problem('A11','Dos cuadrados cercanos',String.raw`Calcular $1001^2-999^2$ sin calcular los cuadrados por separado.`),
  problem('A12','Tres enteros consecutivos',String.raw`Demostrar que $n^3-n$ es divisible entre $6$ para todo entero $n$.`),
  problem('A13','Suma y producto',String.raw`Los números reales $a$ y $b$ cumplen $a+b=8$ y $ab=12$. Calcular $(a-b)^2$.`),
  problem('A14','Una diferencia de cuartas potencias',String.raw`Factorizar $x^4-16$ como producto de polinomios con coeficientes enteros, de manera que ninguno de los factores tenga grado mayor que $2$.`),
  problem('A15','Cuarta potencia más cuatro',String.raw`Demostrar que $n^4+4$ es compuesto para todo entero $n>1$.`,'intermedio'),
  problem('A16','Quinta potencia y divisibilidad',String.raw`Demostrar que $n^5-n$ es divisible entre $30$ para todo entero $n$.`,'intermedio'),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-A07','TP-A08','TP-A09','TP-A10'], practice: ['TP-A01','TP-A02','TP-A11','TP-A12','TP-A13','TP-A14'], dificiles: ['TP-A15','TP-A16'] } } }
