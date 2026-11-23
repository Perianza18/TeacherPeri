// «Ceva y Menelao» in the lesson format of the theory page. Original
// TeacherPeri text. Exercises and problems live in the banco; the lesson
// only points to them. New lesson (no earlier text).

const pathSlug = 'ceva-y-menelao'
const collection = 'ceva-menelao'

const lesson = { title: 'Ceva y Menelao', area: 'geometry', level: 'intermedio' }

const summary = 'Decidir con un producto de tres razones si tres cevianas pasan por un mismo punto (Ceva) y calcular razones a lo largo de una recta que corta a un triángulo (Menelao).'

const content = String.raw`## Preámbulo: Una sola prueba para muchas concurrencias

En lecciones anteriores demostramos que las medianas, las bisectrices y las alturas de un triángulo pasan por un mismo punto, y cada demostración usó una idea distinta: el doble de distancia en las medianas, las distancias a los lados en las bisectrices, otro triángulo en las alturas. ¿Hay una prueba que sirva para cualquier terna de cevianas?

La lección «Áreas y razones en triángulos» sugiere dónde buscar: una ceviana por un punto $P$ parte al triángulo en piezas cuyas áreas están en la misma razón que los segmentos del lado opuesto. Con tres cevianas aparecen tres razones, y su producto resulta ser la clave.

## Teoría

### El teorema de Ceva

Sean $D$, $E$ y $F$ puntos interiores de los lados $BC$, $CA$ y $AB$ del triángulo $ABC$.

![Triángulo ABC con las cevianas AD, BE y CF, resaltadas, que se cortan en el punto P.](figuras/ceva-y-menelao-ceva.svg "Tres cevianas que pasan por un mismo punto")

:::theorem Teorema de Ceva
Las cevianas $AD$, $BE$ y $CF$ pasan por un mismo punto si y solo si
$$\frac{BD}{DC}\cdot\frac{CE}{EA}\cdot\frac{AF}{FB}=1.$$
:::

:::proof
Supongamos primero que las tres pasan por un punto $P$, que está dentro del triángulo. El lema de la razón de una ceviana (lección «Áreas y razones en triángulos») da, para la ceviana $AD$, $\tfrac{BD}{DC}=\tfrac{[ABP]}{[ACP]}$; para la ceviana $BE$, $\tfrac{CE}{EA}=\tfrac{[BCP]}{[BAP]}$; y para la ceviana $CF$, $\tfrac{AF}{FB}=\tfrac{[CAP]}{[CBP]}$. Al multiplicar las tres igualdades, cada área aparece una vez arriba y una vez abajo, y el producto vale $1$.

Ahora supongamos que el producto vale $1$. Sea $P$ el punto donde se cortan $AD$ y $BE$, y sea $F'$ el punto donde la recta $CP$ corta al lado $AB$. Por la primera parte, aplicada a $AD$, $BE$ y $CF'$, se tiene $\tfrac{BD}{DC}\cdot\tfrac{CE}{EA}\cdot\tfrac{AF'}{F'B}=1$. Al comparar con la hipótesis, $\tfrac{AF'}{F'B}=\tfrac{AF}{FB}$. Si esa razón es $t$, entonces $AF=\tfrac t{1+t}AB=AF'$, así que $F'=F$ y la tercera ceviana es $CF$.
:::

El caso más sencillo ya da un resultado conocido.

:::try ¿Qué dice el teorema de Ceva cuando $D$, $E$ y $F$ son los puntos medios de los lados?
Las tres razones valen $1$, su producto es $1$, y las medianas concurren: es otra prueba del teorema del centroide.
:::

:::mistake
Escribir las razones en desorden, por ejemplo $\tfrac{BD}{DC}\cdot\tfrac{EA}{CE}\cdot\tfrac{AF}{FB}$. El producto correcto recorre el triángulo en un solo sentido: de $B$ a $D$ y de $D$ a $C$, luego de $C$ a $E$ y de $E$ a $A$, luego de $A$ a $F$ y de $F$ a $B$. Cada vértice aparece una vez en un numerador y una vez en un denominador.
:::

El teorema también demuestra concurrencias nuevas, siempre que las tres razones se puedan calcular.

:::example
La circunferencia inscrita del triángulo $ABC$ toca a $BC$, $CA$ y $AB$ en $D$, $E$ y $F$. Demostrar que $AD$, $BE$ y $CF$ pasan por un mismo punto.

Por la lección «Bisectrices, incentro y excentros», los dos segmentos tangentes desde un mismo vértice son iguales: $AF=AE=x$, $BD=BF=y$ y $CD=CE=z$. Entonces
$$\frac{BD}{DC}\cdot\frac{CE}{EA}\cdot\frac{AF}{FB}=\frac yz\cdot\frac zx\cdot\frac xy=1,$$
y el teorema de Ceva da la concurrencia. El punto se llama **punto de Gergonne**.
:::

### El teorema de Menelao

Ahora una recta $\ell$, que no pasa por ningún vértice y no es paralela a ningún lado, corta a las rectas $BC$, $CA$ y $AB$ en $D$, $E$ y $F$. Una recta así corta exactamente a dos lados y a la prolongación del tercero, o a las prolongaciones de los tres.

![Triángulo ABC y una recta resaltada que corta a AB en F, a AC en E y a la prolongación de BC en D; desde A, B y C se trazan las perpendiculares a la recta, con pies A′, B′ y C′.](figuras/ceva-y-menelao-menelao.svg "Las perpendiculares desde los vértices comparan las tres razones")

:::theorem Teorema de Menelao
Con esa notación,
$$\frac{BD}{DC}\cdot\frac{CE}{EA}\cdot\frac{AF}{FB}=1.$$
:::

:::proof
Sean $A'$, $B'$ y $C'$ los pies de las perpendiculares desde $A$, $B$ y $C$ a $\ell$; como los vértices no están en $\ell$, las longitudes $AA'$, $BB'$ y $CC'$ son positivas.

Los triángulos $DBB'$ y $DCC'$ son rectángulos en $B'$ y $C'$, y tienen el mismo ángulo en $D$: si $D$ está fuera del segmento $BC$, es el mismo ángulo; si está dentro, son opuestos por el vértice. Por el criterio AA son semejantes, así que $\tfrac{BD}{DC}=\tfrac{BB'}{CC'}$. Con los triángulos $ECC'$ y $EAA'$, rectángulos en $C'$ y $A'$ y con el mismo ángulo en $E$, se obtiene $\tfrac{CE}{EA}=\tfrac{CC'}{AA'}$. Con $FAA'$ y $FBB'$ se obtiene $\tfrac{AF}{FB}=\tfrac{AA'}{BB'}$. Al multiplicar las tres igualdades, $AA'$, $BB'$ y $CC'$ se cancelan y el producto vale $1$.
:::

El teorema de Menelao sirve para calcular razones: si una recta corta a un triángulo y se conocen dos de las razones, la tercera queda determinada.

:::example
En el triángulo $ABC$, $D$ está en $BC$ con $BD:DC=1:2$ y $E$ es el punto medio de $CA$. Las cevianas $AD$ y $BE$ se cortan en $P$. Calcular $AP:PD$ con el teorema de Menelao.

Lo que se busca es una razón sobre $AD$, así que usamos un triángulo con lado $AD$: el triángulo $ADC$. La recta $BE$ lo corta en $P$, sobre el lado $AD$; en $E$, sobre el lado $CA$; y en $B$, sobre la prolongación de $DC$. Recorremos $A\to D\to C\to A$:
$$\frac{AP}{PD}\cdot\frac{DB}{BC}\cdot\frac{CE}{EA}=1.$$
Como $BD:DC=1:2$, se tiene $DB=\tfrac13BC$; y $CE=EA$. Así, $\tfrac{AP}{PD}\cdot\tfrac13\cdot1=1$ y $AP:PD=3:1$, como en la lección de áreas, ahora sin nombrar ninguna área.
:::

:::tip
Para usar Menelao hay que elegir el triángulo y la recta: el triángulo debe tener como lado el segmento cuya razón se busca, y la recta debe pasar por el punto que lo divide y por dos puntos de los que se conozcan razones.
:::

## Agregados culturales

- Giovanni Ceva publicó su teorema en 1678, en un libro sobre rectas que se cortan. Lo demostró con ideas de la estática: colocaba pesos en los vértices de modo que los centros de gravedad de cada pareja cayeran en los puntos de los lados; las tres cevianas pasan entonces por el centro de gravedad de los tres pesos.
- El teorema ya era conocido siglos antes. Yusuf al-Mu'taman ibn Hud, rey de la taifa de Zaragoza en el siglo XI, lo demostró en un libro de geometría que los historiadores identificaron en el siglo XX. El teorema de Menelao es todavía más antiguo: aparece en la obra de Menelao de Alejandría, hacia el año $100$.
- Desde 2014 se organiza en Irán una olimpiada dedicada solo a la geometría, con niveles elemental, intermedio y avanzado. Los estudiantes la presentan en sus propios países, y en 2019 participaron más de $50$ países.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

En cada problema conviene decidir primero si se pide una concurrencia, que es tarea de Ceva, o una razón sobre una recta que cruza al triángulo, que es tarea de Menelao, y escribir el producto recorriendo el triángulo en un solo sentido.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Aquí hace falta usar un teorema en la dirección contraria, o combinar los dos en triángulos distintos de la misma figura.

[[collection:${collection}:dificiles]]`

const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'intermedio' })
const problem = (code, titulo, enunciado, difficulty = 'intermedio') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })

const problems = [
  exercise('G85', 'La tercera razón', String.raw`En el triángulo $ABC$, los puntos $D$, $E$ y $F$ están en los lados $BC$, $CA$ y $AB$, con $BD:DC=2:1$ y $CE:EA=3:1$. ¿Cuánto debe valer $AF:FB$ para que $AD$, $BE$ y $CF$ pasen por un mismo punto?`, [
    String.raw`Despejar $AF/FB$ en el producto de Ceva.`,
  ]),
  exercise('G86', 'Una recta por un punto medio', String.raw`En el triángulo $ABC$, $D$ es el punto medio de $BC$ y $E$ está en $CA$ con $CE:EA=1:2$. La recta $DE$ corta a la recta $AB$ en $F$. Calcular $AF:FB$ y decidir si $F$ está en el lado $AB$ o en su prolongación.`, [
    String.raw`Usar el teorema de Menelao con el triángulo $ABC$ y la recta $DE$.`,
  ]),
  exercise('G87', 'Sin desordenar las razones', String.raw`En el triángulo $ABC$, $D$ está en $BC$ con $BD:DC=1:2$ y $E$ es el punto medio de $CA$. Las cevianas $AD$ y $BE$ se cortan en $P$, y la recta $CP$ corta a $AB$ en $F$. Calcular $AF:FB$.`, [
    String.raw`Escribir el producto de Ceva recorriendo $B\to D\to C\to E\to A\to F\to B$.`,
  ]),
  exercise('G88', 'Medianas con Ceva', String.raw`Usar el teorema de Ceva para demostrar que las tres medianas de un triángulo pasan por un mismo punto.`, [
    String.raw`¿Cuánto vale cada una de las tres razones?`,
  ]),
  problem('G89', 'Las circunferencias exinscritas', String.raw`La circunferencia exinscrita opuesta a $A$ toca al lado $BC$ en $D$; la opuesta a $B$ toca a $CA$ en $E$; y la opuesta a $C$ toca a $AB$ en $F$. Demostrar que $AD$, $BE$ y $CF$ pasan por un mismo punto.`),
  problem('G90', 'El punto medio de una ceviana', String.raw`En el triángulo $ABC$, $D$ está en $BC$ con $BD:DC=2:1$ y $E$ es el punto medio de $AD$. La recta $BE$ corta a $AC$ en $F$. Calcular $AF:FC$.`),
  problem('G91', 'Una paralela y una mediana', String.raw`En el triángulo $ABC$, los puntos $D$ en $BC$ y $E$ en $CA$ cumplen $DE\parallel AB$. Las cevianas $AD$ y $BE$ se cortan en $P$. Demostrar que la recta $CP$ pasa por el punto medio de $AB$.`),
  problem('G92', 'Dos cevianas y una razón', String.raw`En el triángulo $ABC$, $F$ está en $AB$ con $AF:FB=1:3$ y $E$ está en $AC$ con $AE:EC=2:1$. Las cevianas $BE$ y $CF$ se cortan en $P$. Calcular $BP:PE$.`),
  problem('G93', 'Cevianas por un punto medio', String.raw`Las cevianas $AD$, $BE$ y $CF$ del triángulo $ABC$ pasan por un mismo punto, y $D$ es el punto medio de $BC$. Demostrar que $EF\parallel BC$.`),
  problem('G94', 'Una recta que no corta a BC', String.raw`Una recta corta a los lados $AB$ y $AC$ del triángulo $ABC$ en $F$ y $E$, con $AF:FB=3:2$ y $AE:EC=1:1$, y corta a la prolongación de $BC$ en $D$. Calcular $BD:DC$ y decidir del lado de qué vértice queda $D$.`),
  problem('G95', 'El recíproco de Menelao', String.raw`Los puntos $D$, $E$ y $F$ están en las rectas $BC$, $CA$ y $AB$, distintos de los vértices, y exactamente uno o los tres están fuera de los lados. Demostrar que si $\dfrac{BD}{DC}\cdot\dfrac{CE}{EA}\cdot\dfrac{AF}{FB}=1$, entonces $D$, $E$ y $F$ están alineados.`, 'avanzado'),
  problem('G96', 'Una suma de razones', String.raw`Las cevianas $AD$, $BE$ y $CF$ del triángulo $ABC$ pasan por un punto $P$. Demostrar que $\dfrac{AP}{PD}=\dfrac{AE}{EC}+\dfrac{AF}{FB}$.`, 'avanzado'),
]

export default {
  pathSlug,
  lesson,
  summary,
  content,
  problems,
  collections: {
    [collection]: {
      ejercicios: ['TP-G85', 'TP-G86', 'TP-G87', 'TP-G88'],
      practice: ['TP-G89', 'TP-G90', 'TP-G91', 'TP-G92', 'TP-G93', 'TP-G94'],
      dificiles: ['TP-G95', 'TP-G96'],
    },
  },
}
