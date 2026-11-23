// «La desigualdad útil» in the lesson format of the theory page. Original
// TeacherPeri text. Exercises and problems live in the banco; the lesson
// only points to them. New lesson (no earlier text).

const pathSlug = 'la-desigualdad-util'
const collection = 'desigualdad-util'

const lesson = { title: 'La desigualdad útil', area: 'algebra', level: 'intermedio' }

const summary = 'Acotar sumas de fracciones con la desigualdad útil, reconocer cuándo se alcanza la igualdad y preparar las fracciones para que tengan cuadrados en el numerador.'

const content = String.raw`## Preámbulo: Repartir una unidad

Los números positivos $x$ y $y$ suman $1$, y se busca el menor valor de $\tfrac4x+\tfrac9y$. Con $x=y=\tfrac12$ se obtiene $26$; con $x=\tfrac25$ y $y=\tfrac35$, el valor baja a $10+15=25$; con $x=\tfrac3{10}$ sube otra vez a más de $26$. Todo indica que el mínimo es $25$.

La desigualdad entre la media aritmética y la geométrica no se aplica directamente: el producto de $\tfrac4x$ y $\tfrac9y$ no es constante. Hace falta una desigualdad hecha para sumas de fracciones con denominadores positivos, y que además diga cuándo se alcanza la igualdad.

## Teoría

### Dos fracciones

:::theorem Desigualdad útil para dos fracciones
Para números reales $a$, $b$ y números reales positivos $x$, $y$,
$$\frac{a^2}x+\frac{b^2}y\ge\frac{(a+b)^2}{x+y},$$
con igualdad si y solo si $\dfrac ax=\dfrac by$.
:::

:::proof
El número $xy(x+y)$ es positivo, así que multiplicar ambos lados por él no cambia el sentido de la desigualdad. Queda la desigualdad equivalente
$$(a^2y+b^2x)(x+y)\ge(a+b)^2xy.$$
Al desarrollar, el lado izquierdo es $a^2xy+a^2y^2+b^2x^2+b^2xy$ y el derecho es $a^2xy+2abxy+b^2xy$. Al restar el lado derecho de ambos lados, la desigualdad se convierte en $a^2y^2-2abxy+b^2x^2\ge0$, es decir, $(ay-bx)^2\ge0$, que es cierto porque un cuadrado nunca es negativo. La igualdad ocurre si y solo si $ay=bx$; al dividir entre $xy$, eso es $\tfrac ax=\tfrac by$.
:::

La igualdad pide que cada numerador «sin cuadrado» sea proporcional a su denominador. Esa condición es la que indica dónde está el mínimo.

Con $a=b=1$ el teorema dice $\tfrac1x+\tfrac1y\ge\tfrac4{x+y}$. Al tomar recíprocos y multiplicar por $2$, eso es $\tfrac{2xy}{x+y}\le\tfrac{x+y}2$: la media armónica no supera a la aritmética, como en la lección anterior. La desigualdad útil extiende esa comparación a numeradores cualesquiera.

:::example
Encontrar el menor valor de $\dfrac4x+\dfrac9y$ si $x$ y $y$ son positivos y $x+y=1$.

Los numeradores son cuadrados: $4=2^2$ y $9=3^2$. La desigualdad útil con $a=2$, $b=3$ da $\tfrac4x+\tfrac9y\ge\tfrac{(2+3)^2}{x+y}=25$. Para saber si $25$ es el mínimo hay que alcanzar la igualdad: $\tfrac2x=\tfrac3y$, es decir, $y=\tfrac32x$. Con $x+y=1$ resulta $\tfrac52x=1$, $x=\tfrac25$ y $y=\tfrac35$, que son positivos. El mínimo es $25$.
:::

:::mistake
Usar la desigualdad con denominadores que pueden ser negativos. Con $a=b=1$, $x=-1$ y $y=2$, el lado izquierdo es $-1+\tfrac12=-\tfrac12$ y el derecho es $\tfrac41=4$: la desigualdad falla. En la prueba se multiplicó por $xy(x+y)$, y eso solo conserva el sentido cuando ese número es positivo.
:::

### Muchas fracciones

:::theorem Desigualdad útil
Para números reales $a_1,\dots,a_n$ y números reales positivos $x_1,\dots,x_n$,
$$\frac{a_1^2}{x_1}+\frac{a_2^2}{x_2}+\cdots+\frac{a_n^2}{x_n}\ge\frac{(a_1+a_2+\cdots+a_n)^2}{x_1+x_2+\cdots+x_n},$$
con igualdad si y solo si $\dfrac{a_1}{x_1}=\dfrac{a_2}{x_2}=\cdots=\dfrac{a_n}{x_n}$.
:::

:::proof
Por inducción sobre $n$. Para $n=1$ los dos lados son iguales, y para $n=2$ es el teorema anterior. Supongamos que la desigualdad vale para $n$ fracciones y escribamos $A=a_1+\cdots+a_n$ y $X=x_1+\cdots+x_n$, que es positivo. Para $n+1$ fracciones, la hipótesis de inducción y después el caso de dos fracciones, con numeradores $A$ y $a_{n+1}$, dan
$$\frac{a_1^2}{x_1}+\cdots+\frac{a_n^2}{x_n}+\frac{a_{n+1}^2}{x_{n+1}}\ge\frac{A^2}X+\frac{a_{n+1}^2}{x_{n+1}}\ge\frac{(A+a_{n+1})^2}{X+x_{n+1}}.$$
La igualdad final exige igualdad en los dos pasos: en el primero, por hipótesis de inducción, que las razones $\tfrac{a_i}{x_i}$ con $i\le n$ sean iguales entre sí, digamos a $k$; entonces $A=kX$, y en el segundo paso hace falta $\tfrac AX=\tfrac{a_{n+1}}{x_{n+1}}$, es decir, $\tfrac{a_{n+1}}{x_{n+1}}=k$. Recíprocamente, si las $n+1$ razones valen $k$, los dos pasos son igualdades por las mismas dos condiciones.
:::

:::try ¿Qué da la desigualdad útil para $\dfrac1a+\dfrac1b+\dfrac1c$, con $a$, $b$ y $c$ positivos?
Con numeradores $1^2$ resulta $\tfrac1a+\tfrac1b+\tfrac1c\ge\tfrac{9}{a+b+c}$, con igualdad cuando $a=b=c$.
:::

### Preparar las fracciones

Muchas veces los numeradores no son cuadrados. Si $p$ y $q$ son positivos, $\tfrac pq=\tfrac{p^2}{pq}$, y el nuevo denominador $pq$ sigue siendo positivo: se multiplican numerador y denominador por el propio numerador.

:::example
Demostrar que $\dfrac a{b+c}+\dfrac b{c+a}+\dfrac c{a+b}\ge\dfrac32$ para números reales positivos $a$, $b$ y $c$.

Al multiplicar cada fracción por su numerador arriba y abajo, la suma es $\tfrac{a^2}{ab+ac}+\tfrac{b^2}{bc+ba}+\tfrac{c^2}{ca+cb}$. La desigualdad útil da
$$\frac{a^2}{ab+ac}+\frac{b^2}{bc+ba}+\frac{c^2}{ca+cb}\ge\frac{(a+b+c)^2}{2(ab+bc+ca)}.$$
Falta ver que el lado derecho es al menos $\tfrac32$, es decir, que $(a+b+c)^2\ge3(ab+bc+ca)$. Al desarrollar, eso es $a^2+b^2+c^2\ge ab+bc+ca$, que se obtiene al sumar $(a-b)^2+(b-c)^2+(c-a)^2\ge0$ y dividir entre $2$. La igualdad ocurre si $a=b=c$.
:::

:::tip
Cuando una suma de fracciones debe ser al menos algo, conviene preguntarse qué denominador común aparecería tras la desigualdad útil. Si se elige bien el factor por el que se multiplica cada fracción, la suma de los denominadores resulta una expresión conocida, como $2(ab+bc+ca)$ en el ejemplo.
:::

:::example
Demostrar que $\dfrac a{b+2c}+\dfrac b{c+2a}+\dfrac c{a+2b}\ge1$ para números reales positivos $a$, $b$ y $c$.

El mismo truco funciona aunque los denominadores no sean simétricos. Al multiplicar cada fracción por su numerador, los nuevos denominadores son $ab+2ac$, $bc+2ab$ y $ca+2bc$, que suman $3(ab+bc+ca)$. La desigualdad útil da que la suma es al menos $\tfrac{(a+b+c)^2}{3(ab+bc+ca)}$, y esto es al menos $1$ porque $(a+b+c)^2\ge3(ab+bc+ca)$, como en el ejemplo anterior. La igualdad ocurre cuando $a=b=c$.
:::

## Agregados culturales

- La desigualdad del último ejemplo se conoce como desigualdad de Nesbitt: Alfred Nesbitt la propuso como problema a principios del siglo XX en la revista británica *Educational Times*. Hoy se conocen decenas de demostraciones distintas.
- La desigualdad útil tiene muchos nombres. Nairi Sedrakyan publicó aplicaciones en la revista rusa *Kvant* en 1997, Arthur Engel la incluyó en 1998 en su libro *Problem-Solving Strategies*, y en el mundo de las olimpiadas también se le llama lema de Titu, por Titu Andreescu, entrenador de equipos de olimpiada.
- En la Olimpiada Internacional de 1995, celebrada en Toronto, Canadá, el segundo problema fue una desigualdad con tres números positivos cuyo producto es $1$. Una de sus soluciones más cortas cambia cada número por su recíproco y aplica la desigualdad útil seguida de la desigualdad entre medias.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

En cada problema conviene decidir primero qué numerador elevar al cuadrado y comprobar al final que el caso de igualdad es posible.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Aquí la desigualdad útil deja una segunda desigualdad por demostrar; la dificultad está en preparar las fracciones para que esa segunda parte sea conocida.

[[collection:${collection}:dificiles]]`

const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'intermedio' })
const problem = (code, titulo, enunciado, difficulty = 'intermedio') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })

const problems = [
  exercise('A49', 'Un mínimo con dos fracciones', String.raw`Los números positivos $x$ y $y$ suman $3$. Encontrar el menor valor de $\dfrac1x+\dfrac4y$ y los valores de $x$ y $y$ que lo alcanzan.`, [
    String.raw`Escribir $4$ como $2^2$ y usar la desigualdad útil.`,
    String.raw`El caso de igualdad pide $\tfrac1x=\tfrac2y$.`,
  ]),
  exercise('A50', 'Recíprocos', String.raw`Demostrar que $\dfrac1a+\dfrac1b+\dfrac1c\ge\dfrac9{a+b+c}$ para números reales positivos $a$, $b$ y $c$.`, [
    String.raw`Cada numerador es $1^2$.`,
  ]),
  exercise('A51', 'Un denominador negativo', String.raw`Decidir si $\dfrac1x+\dfrac1y\ge\dfrac4{x+y}$ se cumple para todos los reales $x$ y $y$ distintos de cero con $x+y\ne0$. Justificar con un ejemplo o una demostración.`, [
    String.raw`Probar con un denominador negativo, por ejemplo $x=-1$ y $y=2$.`,
  ]),
  exercise('A52', 'Una suma cíclica', String.raw`Demostrar que $\dfrac{a^2}b+\dfrac{b^2}c+\dfrac{c^2}a\ge a+b+c$ para números reales positivos $a$, $b$ y $c$.`, [
    String.raw`Los numeradores ya son cuadrados; sumar los denominadores.`,
  ]),
  problem('A53', 'Cuadrados sobre sumas', String.raw`Demostrar que $\dfrac{x^2}{y+z}+\dfrac{y^2}{z+x}+\dfrac{z^2}{x+y}\ge\dfrac{x+y+z}2$ para números reales positivos $x$, $y$ y $z$.`),
  problem('A54', 'Cuatro fracciones', String.raw`Demostrar que $\dfrac a{b+c}+\dfrac b{c+d}+\dfrac c{d+a}+\dfrac d{a+b}\ge2$ para números reales positivos $a$, $b$, $c$ y $d$.`),
  problem('A55', 'Uno, cuatro y nueve', String.raw`Los números positivos $a$, $b$ y $c$ suman $1$. Demostrar que $\dfrac1a+\dfrac4b+\dfrac9c\ge36$ y encontrar cuándo se alcanza la igualdad.`),
  problem('A56', 'Dos fracciones con dobles', String.raw`Demostrar que $\dfrac x{x+2y}+\dfrac y{y+2x}\ge\dfrac23$ para números reales positivos $x$ y $y$.`),
  problem('A57', 'Suma tres', String.raw`Los números positivos $a$, $b$ y $c$ suman $3$. Demostrar que $\dfrac{a^2}{a+1}+\dfrac{b^2}{b+1}+\dfrac{c^2}{c+1}\ge\dfrac32$.`),
  problem('A58', 'Suma por recíprocos de sumas', String.raw`Demostrar que $(a+b+c)\left(\dfrac1{a+b}+\dfrac1{b+c}+\dfrac1{c+a}\right)\ge\dfrac92$ para números reales positivos $a$, $b$ y $c$.`),
  problem('A59', 'Cubos sobre sumas', String.raw`Demostrar que $\dfrac{a^3}{b+c}+\dfrac{b^3}{c+a}+\dfrac{c^3}{a+b}\ge\dfrac{a^2+b^2+c^2}2$ para números reales positivos $a$, $b$ y $c$.`, 'avanzado'),
  problem('A60', 'Una suma alrededor de un círculo', String.raw`Los números positivos $a_1,a_2,\dots,a_n$, con $n\ge2$, suman $1$, y se escribe $a_{n+1}=a_1$. Demostrar que $\dfrac{a_1^2}{a_1+a_2}+\dfrac{a_2^2}{a_2+a_3}+\cdots+\dfrac{a_n^2}{a_n+a_{n+1}}\ge\dfrac12$.`, 'avanzado'),
]

export default {
  pathSlug,
  lesson,
  summary,
  content,
  problems,
  collections: {
    [collection]: {
      ejercicios: ['TP-A49', 'TP-A50', 'TP-A51', 'TP-A52'],
      practice: ['TP-A53', 'TP-A54', 'TP-A55', 'TP-A56', 'TP-A57', 'TP-A58'],
      dificiles: ['TP-A59', 'TP-A60'],
    },
  },
}
