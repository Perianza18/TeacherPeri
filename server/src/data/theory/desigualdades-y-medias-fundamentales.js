// «Desigualdades y medias fundamentales» in the lesson format of the theory
// page. Original TeacherPeri text. Exercises and problems live in the banco;
// the lesson only points to them. New lesson (no earlier text).

const pathSlug = 'desigualdades-y-medias-fundamentales'
const collection = 'medias'

const lesson = { title: 'Desigualdades y medias fundamentales', area: 'algebra', level: 'intermedio' }

const summary = 'Demostrar desigualdades a partir de que un cuadrado nunca es negativo, comparar las cuatro medias de dos números y usar la desigualdad entre la media aritmética y la geométrica para encontrar máximos y mínimos.'

const content = String.raw`## Preámbulo: Cuarenta metros de cerca

Con $40$ metros de cerca se quiere encerrar un jardín rectangular. Si mide $15\times5$, el área es $75$ metros cuadrados; si mide $12\times8$, es $96$; si mide $10\times10$, es $100$. Los rectángulos más alargados encierran menos, y el cuadrado parece ganar.

Probar más medidas no basta: hay infinitas, y entre $10\times10$ y $10.1\times9.9$ la diferencia es de una centésima. Para estar seguros hay que demostrar que ningún rectángulo con ese perímetro supera $100$. La herramienta resulta ser un hecho muy simple sobre los cuadrados de los números reales.

## Teoría

### Un cuadrado nunca es negativo

:::lemma Cuadrados
Para todo número real $t$ se cumple $t^2\ge0$, con igualdad solo si $t=0$.
:::

:::proof
Si $t>0$, el producto $t\cdot t$ de dos positivos es positivo. Si $t<0$, el producto de dos negativos también es positivo. Si $t=0$, entonces $t^2=0$.
:::

Casi todas las desigualdades de esta lección salen de escoger bien el número $t$ que se eleva al cuadrado.

:::theorem Media aritmética y media geométrica
Para números reales $a,b\ge0$,
$$\frac{a+b}2\ge\sqrt{ab},$$
con igualdad si y solo si $a=b$.
:::

:::proof
Tomamos $t=\sqrt a-\sqrt b$, que existe porque $a,b\ge0$. El lema da $(\sqrt a-\sqrt b)^2\ge0$. Al desarrollar, $a-2\sqrt{ab}+b\ge0$; al sumar $2\sqrt{ab}$ a ambos lados y dividir entre $2$, queda la desigualdad. La igualdad ocurre solo si $\sqrt a-\sqrt b=0$, es decir, si $a=b$.
:::

:::example
Demostrar que ningún rectángulo de perímetro $40$ tiene área mayor que $100$, y que solo el cuadrado de lado $10$ la alcanza.

Si los lados miden $x$ e $y$, el perímetro da $2x+2y=40$, es decir, $x+y=20$. La desigualdad se aplica a $x$ y $y$, que son positivos: $\sqrt{xy}\le\tfrac{x+y}2=10$. Al elevar al cuadrado, que conserva el orden entre números no negativos, el área cumple $xy\le100$. La igualdad exige $x=y$, y con $x+y=20$ eso da $x=y=10$.
:::

La desigualdad sirve para máximos porque el lado mayor, $\tfrac{a+b}2$, quedó fijo. Para mínimos se fija el producto.

:::try Si $x>0$, ¿cuál es el menor valor posible de $x+\tfrac1x$?
El producto de $x$ y $\tfrac1x$ es $1$, así que $x+\tfrac1x\ge2\sqrt1=2$. Se alcanza con $x=\tfrac1x$, es decir, con $x=1$. El menor valor es $2$.
:::

:::mistake
Dar como mínimo una cota que no se alcanza. Si se pide el mínimo de $x+\tfrac1x$ con $x\ge3$, la desigualdad sigue dando $x+\tfrac1x\ge2$, pero la igualdad pediría $x=1$, que no está permitido; el mínimo verdadero es $3+\tfrac13=\tfrac{10}3$. Una cota es un mínimo solo cuando se muestra un valor permitido que la alcanza.
:::

### Cuatro medias de dos números

Para dos números positivos $a$ y $b$ se usan cuatro medias: la **cuadrática** $\sqrt{\tfrac{a^2+b^2}2}$, la **aritmética** $\tfrac{a+b}2$, la **geométrica** $\sqrt{ab}$ y la **armónica** $\tfrac2{1/a+1/b}=\tfrac{2ab}{a+b}$. Con $a=1$ y $b=9$:

| Media | Fórmula | Valor con $a=1$, $b=9$ |
| --- | --- | --- |
| Cuadrática | $\sqrt{(a^2+b^2)/2}$ | $\sqrt{41}\approx6.40$ |
| Aritmética | $(a+b)/2$ | $5$ |
| Geométrica | $\sqrt{ab}$ | $3$ |
| Armónica | $2ab/(a+b)$ | $1.8$ |

La tabla muestra un caso; el teorema siguiente dice que el orden es siempre el mismo.

:::theorem Desigualdad de las medias
Para números reales positivos $a$ y $b$,
$$\sqrt{\frac{a^2+b^2}2}\ \ge\ \frac{a+b}2\ \ge\ \sqrt{ab}\ \ge\ \frac{2ab}{a+b},$$
y cada igualdad ocurre si y solo si $a=b$.
:::

:::proof
La desigualdad central ya está demostrada. Para la primera, los dos lados son positivos, así que basta comparar sus cuadrados: $\tfrac{a^2+b^2}2\ge\tfrac{(a+b)^2}4$. Al multiplicar por $4$ y desarrollar, esto es $2a^2+2b^2\ge a^2+2ab+b^2$; al restar el lado derecho queda $a^2-2ab+b^2\ge0$, es decir, $(a-b)^2\ge0$, que es el lema con $t=a-b$.

Para la última, aplicamos la desigualdad central a los positivos $\tfrac1a$ y $\tfrac1b$: $\tfrac12\left(\tfrac1a+\tfrac1b\right)\ge\tfrac1{\sqrt{ab}}$. Ambos lados son positivos; al tomar los recíprocos el orden se invierte, y queda $\tfrac2{1/a+1/b}\le\sqrt{ab}$. En los tres casos la igualdad se reduce a $a=b$.
:::

### Más de dos números

:::theorem Media aritmética y geométrica de tres números
Para números reales $a,b,c\ge0$,
$$\frac{a+b+c}3\ge\sqrt[3]{abc},$$
con igualdad si y solo si $a=b=c$.
:::

:::proof
Primero lo probamos para cuatro números $a,b,c,d\ge0$. Al aplicar dos veces el caso de dos números,
$$\frac{a+b+c+d}4=\frac12\left(\frac{a+b}2+\frac{c+d}2\right)\ge\frac{\sqrt{ab}+\sqrt{cd}}2\ge\sqrt{\sqrt{ab}\sqrt{cd}}=\sqrt[4]{abcd},$$
con igualdad solo si $a=b$, $c=d$ y $\sqrt{ab}=\sqrt{cd}$, es decir, si los cuatro son iguales.

Ahora sea $m=\tfrac{a+b+c}3$ y tomemos $d=m$. El lado izquierdo es $\tfrac{3m+m}4=m$, así que $m\ge\sqrt[4]{abcm}$. Si $m=0$, los tres números son $0$ y no hay nada que probar. Si $m>0$, al elevar a la cuarta potencia se obtiene $m^4\ge abc\,m$, y al dividir entre $m$, $m^3\ge abc$, que es la desigualdad. La igualdad exige $a=b=c=m$.
:::

:::example
Demostrar que $(a+b)(b+c)(c+a)\ge8abc$ para números reales positivos $a$, $b$ y $c$.

Cada factor de la izquierda es una suma de dos números, y la derecha es un producto: es la forma de la desigualdad de dos números. Se tiene $a+b\ge2\sqrt{ab}$, $b+c\ge2\sqrt{bc}$ y $c+a\ge2\sqrt{ca}$. Las seis cantidades son positivas, así que al multiplicar las tres desigualdades se conserva el orden: $(a+b)(b+c)(c+a)\ge8\sqrt{a^2b^2c^2}=8abc$. La igualdad ocurre si $a=b=c$.
:::

:::tip
Para usar la desigualdad de las medias en un mínimo, partir la expresión en sumandos cuyo producto sea constante. Por ejemplo, para $x>0$ conviene escribir $x^2+\tfrac2x=x^2+\tfrac1x+\tfrac1x$: los tres sumandos tienen producto $1$, así que la suma es al menos $3$, con igualdad cuando $x^2=\tfrac1x$, es decir, $x=1$.
:::

## Agregados culturales

- En su *Curso de análisis* de 1821, Augustin-Louis Cauchy demostró la desigualdad entre la media aritmética y la geométrica para cualquier cantidad de números. Usó el mismo truco de esta lección: pasar de $2$ a $4$, a $8$ y a todas las potencias de $2$, y después bajar a los demás casos igualando un número a la media de los otros.
- En 1999, Thomas Hales demostró que la forma de las celdas de un panal de abejas es óptima: entre todas las maneras de dividir el plano en regiones de la misma área, la red de hexágonos regulares es la que usa el menor perímetro total. La demostración se publicó en 2001.
- Terence Tao ganó medallas en la Olimpiada Internacional de Matemáticas en 1986, 1987 y 1988: bronce, plata y oro. Al recibir el oro tenía $13$ años, y según los registros de la competencia es la persona más joven en lograrlo.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Antes de aplicar una desigualdad conviene revisar que los números sean no negativos y buscar el caso de igualdad: indica cómo agrupar los términos.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

La dificultad está en encontrar qué expresión hacer constante, o en usar la desigualdad varias veces y multiplicar los resultados.

[[collection:${collection}:dificiles]]`

const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'intermedio' })
const problem = (code, titulo, enunciado, difficulty = 'intermedio') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })

const problems = [
  exercise('A37', 'Un mínimo con producto fijo', String.raw`Encontrar el menor valor de $x+\dfrac9x$ para $x>0$ e indicar para qué $x$ se alcanza.`, [
    String.raw`El producto de los dos sumandos es constante.`,
  ]),
  exercise('A38', 'Un máximo con suma fija', String.raw`Dos números positivos suman $10$. ¿Cuál es el mayor valor posible de su producto?`, [
    String.raw`Comparar la media aritmética con la geométrica.`,
  ]),
  exercise('A39', 'Una cota que no se alcanza', String.raw`Encontrar el menor valor de $x+\dfrac1x$ para $x\ge3$ y demostrar que es el menor.`, [
    String.raw`La cota $2$ no sirve: no hay $x\ge3$ que la alcance.`,
    String.raw`Factorizar $\left(x+\tfrac1x\right)-\left(3+\tfrac13\right)$ como $(x-3)$ por otra expresión y estudiar su signo.`,
  ]),
  exercise('A40', 'Suma por suma de recíprocos', String.raw`Demostrar que $(a+b)\left(\dfrac1a+\dfrac1b\right)\ge4$ para números reales positivos $a$ y $b$.`, [
    String.raw`Desarrollar el producto y comparar $\tfrac ab+\tfrac ba$ con $2$.`,
  ]),
  problem('A41', 'Cuadrados contra productos', String.raw`Demostrar que $a^2+b^2+c^2\ge ab+bc+ca$ para cualesquiera números reales $a$, $b$ y $c$.`),
  problem('A42', 'Tres números y sus recíprocos', String.raw`Demostrar que $(a+b+c)\left(\dfrac1a+\dfrac1b+\dfrac1c\right)\ge9$ para números reales positivos $a$, $b$ y $c$.`),
  problem('A43', 'Un producto igual a uno', String.raw`Los números reales positivos $x$, $y$ y $z$ cumplen $xyz=1$. Demostrar que $(1+x)(1+y)(1+z)\ge8$.`),
  problem('A44', 'Cubos y productos', String.raw`Demostrar que $a^3+b^3\ge a^2b+ab^2$ para números reales positivos $a$ y $b$.`),
  problem('A45', 'La caja más económica', String.raw`Una caja sin tapa tiene base cuadrada y volumen $32$ centímetros cúbicos. ¿Qué medidas debe tener para que su superficie exterior sea la menor posible?`),
  problem('A46', 'Una cuarta potencia', String.raw`Demostrar que $x^4+3\ge4x$ para todo número real $x$.`),
  problem('A47', 'Tres fracciones con suma uno', String.raw`Los números reales positivos $x$, $y$ y $z$ cumplen $x+y+z=1$. Demostrar que $\left(\dfrac1x-1\right)\left(\dfrac1y-1\right)\left(\dfrac1z-1\right)\ge8$.`, 'avanzado'),
  problem('A48', 'Cuartas potencias', String.raw`Demostrar que $a^4+b^4+c^4\ge abc(a+b+c)$ para cualesquiera números reales $a$, $b$ y $c$.`, 'avanzado'),
]

export default {
  pathSlug,
  lesson,
  summary,
  content,
  problems,
  collections: {
    [collection]: {
      ejercicios: ['TP-A37', 'TP-A38', 'TP-A39', 'TP-A40'],
      practice: ['TP-A41', 'TP-A42', 'TP-A43', 'TP-A44', 'TP-A45', 'TP-A46'],
      dificiles: ['TP-A47', 'TP-A48'],
    },
  },
}
