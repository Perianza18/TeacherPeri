// «Entrenamiento mixto — Ciclo 2» in the lesson format of the theory page.
// Original TeacherPeri text. The practice boxes reuse problems from the
// Ciclo 2 lessons; only the four exercises are new. New lesson (no earlier text).

const pathSlug = 'entrenamiento-mixto-ciclo-2'
const collection = 'mixto-ciclo-2'

const lesson = { title: 'Entrenamiento mixto — Ciclo 2', area: 'mixed', level: 'intermedio' }

const summary = 'Reconocer qué herramienta del Ciclo 2 pide un problema cuando nadie la anuncia, y combinar dos herramientas de temas distintos en una misma solución.'

const content = String.raw`## Preámbulo: Sin el nombre de la lección

Dentro de una lección es fácil saber qué usar: en «Ceva y Menelao» los problemas piden cevianas, y en «Inclusión-exclusión» piden uniones de conjuntos. En un examen, los problemas llegan sin ese aviso, y muchos necesitan dos herramientas de temas distintos.

El Ciclo 2 agregó once herramientas a las del Ciclo 1. Esta lección no presenta teoremas nuevos: muestra cómo leer un enunciado para elegir entre ellas y cómo se combinan. Los problemas de las cajas vienen de todas las lecciones del ciclo y aparecen mezclados.

## Teoría

### Señales en el enunciado

Algunas frases sugieren una herramienta. La tabla resume las del ciclo; es una guía para empezar a explorar, no una regla, y un mismo problema puede tener varias señales.

| Si el enunciado pide o da… | Herramienta que conviene probar |
| --- | --- |
| tres rectas que pasan por un punto | caracterizar cada recta (mediatriz, bisectriz) o el teorema de Ceva |
| una razón sobre una recta que cruza un triángulo | áreas con la misma altura, o el teorema de Menelao |
| un residuo de una potencia grande | una potencia congruente con $1$ y la regla del producto |
| una congruencia $ax\equiv b$ | el MCD de $a$ y el módulo, y un inverso |
| una suma de fracciones con denominadores positivos | la desigualdad útil |
| un producto de dos sumas, o una suma de cuadrados fija | Cauchy-Schwarz |
| una condición como $a+b+c=1$ o $abc=1$ | homogeneizar o sustituir |
| datos «por cada uno» | doble conteo |
| «al menos una» o «ninguna» de varias condiciones | inclusión-exclusión |

:::try ¿Qué herramienta sugiere el enunciado «demostrar que la suma de $\tfrac a{b+c}$, $\tfrac b{c+a}$ y $\tfrac c{a+b}$ es al menos $\tfrac32$» para $a,b,c>0$?
Es una suma de fracciones con denominadores positivos: la desigualdad útil, después de multiplicar cada fracción por su numerador. Es el ejemplo de Nesbitt de la lección «La desigualdad útil».
:::

### Combinar dos temas

Muchos problemas necesitan una herramienta para traducir y otra para terminar.

:::example
¿Cuántos números del $1$ al $100$ dejan residuo $1$ al dividirse entre $3$ o al dividirse entre $4$?

La palabra «o» pide una unión, así que contamos con inclusión-exclusión. Sea $A$ el conjunto de los que cumplen $n\equiv1\pmod3$ y $B$ el de los que cumplen $n\equiv1\pmod4$. Son $A=\{1,4,\dots,100\}$, con $34$ elementos, y $B=\{1,5,\dots,97\}$, con $25$.

Para la intersección hace falta aritmética modular: $n\equiv1\pmod3$ y $n\equiv1\pmod4$ dicen que $3$ y $4$ dividen a $n-1$. Como $3$ y $4$ no tienen divisores comunes mayores que $1$, su mínimo común múltiplo es $12$, y eso equivale a que $12$ divida a $n-1$. Así, $A\cap B=\{1,13,\dots,97\}$ tiene $9$ elementos, y la respuesta es $34+25-9=50$.
:::

:::mistake
Elegir la herramienta por una palabra sin revisar sus condiciones. Ver fracciones y aplicar la desigualdad útil cuando un denominador puede ser negativo, o aplicar el teorema de Ceva con un punto fuera de los lados, lleva a conclusiones falsas aunque la idea parezca la correcta. Antes de usar un teorema hay que comprobar sus hipótesis en el problema concreto.
:::

Las herramientas de geometría también se combinan entre sí.

:::example
Usar el teorema de Ceva y el teorema de la bisectriz para dar otra demostración de que las tres bisectrices de un triángulo pasan por un mismo punto.

Sean $a=BC$, $b=CA$ y $c=AB$, y sean $L$, $M$ y $N$ los puntos donde las bisectrices desde $A$, $B$ y $C$ cortan a los lados opuestos. El teorema de la bisectriz dice que cada bisectriz divide al lado opuesto en la razón de los dos lados que salen de su vértice. Desde $A$ salen $AB$ y $AC$, así que $\tfrac{BL}{LC}=\tfrac cb$; desde $B$ salen $BC$ y $BA$, así que $\tfrac{CM}{MA}=\tfrac ac$; desde $C$ salen $CA$ y $CB$, así que $\tfrac{AN}{NB}=\tfrac ba$. El producto es $\tfrac cb\cdot\tfrac ac\cdot\tfrac ba=1$, y el teorema de Ceva da la concurrencia.
:::

Escribir de qué vértice salen los lados de cada razón evita el error más común en este tipo de cuentas: poner la razón de otra bisectriz.

:::tip
Antes de elegir una herramienta, escribir en una línea qué tipo de conclusión se pide: un número, una igualdad, una desigualdad, una concurrencia o una imposibilidad. Esa línea suele descartar la mitad de las herramientas antes de hacer cuentas.
:::

## Agregados culturales

- El Instituto de Matemáticas de la UNAM empezó a funcionar el 30 de junio de 1942 y fue la primera institución de México dedicada a la investigación matemática. Hoy tiene sedes en la Ciudad de México, Cuernavaca, Juriquilla y Oaxaca.
- En agosto de 2014, en Seúl, Maryam Mirzakhani se convirtió en la primera mujer en recibir la Medalla Fields, el premio más conocido de las matemáticas, por su trabajo en geometría y sistemas dinámicos. Años antes había ganado dos medallas de oro en la Olimpiada Internacional con el equipo de Irán.
- En 2016, un estudio con $657$ girasoles cultivados por voluntarios en el Reino Unido contó las espirales de sus cabezas. De $768$ conteos confiables, $565$ eran números de Fibonacci, pero también aparecieron cabezas que no siguen ese patrón, algo que no se había documentado de forma sistemática.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Estos problemas vienen de distintas lecciones del Ciclo 2 y aparecen mezclados. Antes de empezar cada uno conviene identificar qué tipo de conclusión pide y qué herramientas podrían servir.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

En estos dos la herramienta no es la que sugiere la primera lectura: hay que transformar el enunciado antes de que alguna técnica del ciclo se aplique.

[[collection:${collection}:dificiles]]`

const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'intermedio' })

const problems = [
  exercise('X05', 'Una potencia grande', String.raw`Encontrar el residuo de $2^{100}$ al dividir entre $7$.`, [
    String.raw`Buscar una potencia de $2$ congruente con $1$ módulo $7$.`,
  ]),
  exercise('X06', 'Centroide y altura', String.raw`En el triángulo $ABC$, $BC=14$, $CA=15$ y $AB=13$. Calcular la distancia del centroide a la recta $BC$.`, [
    String.raw`Calcular primero la altura desde $A$.`,
    String.raw`El centroide está a dos tercios de la mediana desde $A$; ¿qué fracción de la altura queda entre él y $BC$?`,
  ]),
  exercise('X07', 'Primos relativos con 50', String.raw`¿Cuántos números del $1$ al $50$ son primos relativos con $50$?`, [
    String.raw`Un número no es primo relativo con $50$ si es múltiplo de $2$ o de $5$.`,
  ]),
  exercise('X08', 'Un mínimo con suma uno', String.raw`Los números positivos $x$ y $y$ suman $1$. Encontrar el menor valor de $\dfrac1x+\dfrac1y$.`, [
    String.raw`Cada numerador es $1^2$.`,
  ]),
]

export default {
  pathSlug,
  lesson,
  summary,
  content,
  problems,
  collections: {
    [collection]: {
      ejercicios: ['TP-X05', 'TP-X06', 'TP-X07', 'TP-X08'],
      practice: ['TP-G56', 'TP-M20', 'TP-A55', 'TP-C56', 'TP-G90', 'TP-C67'],
      dificiles: ['TP-A72', 'TP-G71'],
    },
  },
}
