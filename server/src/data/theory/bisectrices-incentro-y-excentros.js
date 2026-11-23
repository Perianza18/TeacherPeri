// «Bisectrices, incentro y excentros» in the lesson format of the theory
// page. Original TeacherPeri text. Exercises and problems live in the banco;
// the lesson only points to them. New lesson (no earlier text).

const pathSlug = 'bisectrices-incentro-y-excentros'
const collection = 'bisectrices'

const lesson = { title: 'Bisectrices, incentro y excentros', area: 'geometry', level: 'intermedio' }

const summary = 'Usar que los puntos de una bisectriz están a la misma distancia de los dos lados del ángulo para encontrar el incentro y los excentros, y calcular radios y razones con ellos.'

const content = String.raw`## Preámbulo: Una fuente en una plaza triangular

Una plaza tiene forma de triángulo y está rodeada por tres bardas. Se quiere construir una fuente circular tan grande como sea posible, sin salirse de la plaza. Si la fuente toca solo una barda, todavía se puede alejar de ella y agrandarla; si toca dos, se puede deslizar entre ellas hasta tocar la tercera. La fuente más grande parece tocar las tres bardas.

¿Dónde va el centro? Debe estar a la misma distancia de las tres bardas, que son rectas, no puntos. En la lección anterior, los puntos a la misma distancia de dos puntos formaban la mediatriz; aquí hace falta la recta que juega ese papel para dos rectas que se cortan.

## Teoría

### La bisectriz

La **distancia** de un punto $P$ a una recta $\ell$ es la longitud $PD$, donde $D$ es el pie de la perpendicular desde $P$ a $\ell$. Es la menor distancia de $P$ a un punto de $\ell$: si $Q$ es otro punto de $\ell$, el triángulo $PDQ$ es rectángulo en $D$ y, por Pitágoras, $PQ^2=PD^2+DQ^2>PD^2$.

:::definition Bisectriz
La **bisectriz** de un ángulo $\angle XOY$ es la semirrecta con origen en $O$ que lo divide en dos ángulos iguales.
:::

![Ángulo XOY con su bisectriz resaltada; un punto P de la bisectriz tiene pies de perpendicular D en OX y E en OY.](figuras/bisectrices-incentro-y-excentros-bisectriz.svg "Un punto de la bisectriz está a la misma distancia de los dos lados")

:::lemma Puntos de la bisectriz
Sea $\angle XOY$ un ángulo menor que $180^\circ$ y $P$ un punto en su interior, con pies de perpendicular $D$ en la recta $OX$ y $E$ en la recta $OY$. Entonces $PD=PE$ si y solo si $P$ está en la bisectriz.
:::

:::proof
Si un pie, digamos $D$, no estuviera en la semirrecta $OX$, el triángulo $ODP$ tendría en $O$ un ángulo de al menos $90^\circ$ además del ángulo recto en $D$, y sus ángulos sumarían al menos $180^\circ$. Por eso, cuando $\angle XOP<90^\circ$, el pie $D$ está en la semirrecta $OX$, y cuando $\angle POY<90^\circ$, el pie $E$ está en la semirrecta $OY$.

Si $P$ está en la bisectriz, $\angle XOP=\angle POY$, y cada uno mide menos de $90^\circ$ porque suman menos de $180^\circ$. Los triángulos $ODP$ y $OEP$ tienen el mismo ángulo en $O$ y ángulos rectos en $D$ y $E$, así que sus terceros ángulos, en $P$, también son iguales. Comparten el lado $OP$, comprendido entre esos dos ángulos; por ALA son congruentes y $PD=PE$.

Ahora supongamos $PD=PE$. Ningún pie es $O$: si fuera $D=O$, el pie $E$ sería distinto de $O$ (las rectas $OX$ y $OY$ no son perpendiculares ambas a $OP$), y $PE<PO=PD$ por ser $PE$ la menor distancia de $P$ a la recta $OY$. Del mismo hecho con $E=O$ saldría $PD<PE$. Entonces $ODP$ y $OEP$ son triángulos rectángulos, y Pitágoras da $OD^2=OP^2-PD^2=OP^2-PE^2=OE^2$, así que $OD=OE$. Por LLL los triángulos son congruentes y $\angle DOP=\angle EOP$.

Si ambos pies están en las semirrectas, estos ángulos son $\angle XOP$ y $\angle POY$, y terminamos. Si $D$ no estuviera en $OX$, sería $\angle XOP>90^\circ$; como $\angle XOP+\angle POY<180^\circ$, se tendría $\angle POY<90^\circ$ y $E$ estaría en $OY$. El ángulo $\angle DOP$ sería entonces $180^\circ-\angle XOP$, y la igualdad diría $180^\circ-\angle XOP=\angle POY$, es decir, $\angle XOY=180^\circ$, lo cual es falso. Si fuera $E$ el pie fuera de $OY$, se tendría $\angle POY>90^\circ$, $D$ estaría en $OX$ y la igualdad diría $\angle XOP=180^\circ-\angle POY$; otra vez $\angle XOY=180^\circ$.
:::

### El incentro

![Triángulo ABC con sus tres bisectrices, resaltadas, que se cortan en I; la circunferencia de centro I y radio r toca los lados en D, E y F.](figuras/bisectrices-incentro-y-excentros-incentro.svg "Las bisectrices se cortan en el incentro I, centro de la circunferencia inscrita")

:::theorem Incentro
Las bisectrices de los tres ángulos de un triángulo $ABC$ pasan por un mismo punto $I$, que está a la misma distancia $r$ de las rectas $BC$, $CA$ y $AB$.
:::

:::proof
La bisectriz desde $A$ corta al lado $BC$ en un punto $L$. La bisectriz desde $B$ deja a $A$ de un lado y a $L$, que está entre $B$ y $C$, del otro; por eso corta al segmento $AL$ en un punto $I$ interior al triángulo.

Como $I$ está en la bisectriz desde $A$, el lema da que su distancia a $AB$ es igual a su distancia a $AC$. Como está en la bisectriz desde $B$, su distancia a $BA$ es igual a su distancia a $BC$. Por tanto sus distancias a $CA$ y a $CB$ son iguales; como $I$ está en el interior del ángulo $\angle ACB$, el lema, en la otra dirección, dice que $I$ está en la bisectriz desde $C$.
:::

El punto $I$ es el **incentro** y $r$ es el **inradio**. Sea $D$ el pie de la perpendicular desde $I$ a $BC$; como $\angle IBC$ y $\angle ICB$ son mitades de ángulos del triángulo, ambos son agudos y $D$ cae entre $B$ y $C$. La circunferencia de centro $I$ y radio $r$ pasa por $D$, y cualquier otro punto de la recta $BC$ está a más de $r$ de $I$; así, la recta toca a la circunferencia solo en $D$. Para los pies $E$ en $CA$ y $F$ en $AB$, los ángulos $\angle ICA$, $\angle IAC$, $\angle IAB$ e $\angle IBA$ también son mitades de ángulos del triángulo; por eso $E$ y $F$ caen en los lados, y las rectas $CA$ y $AB$ tocan la circunferencia solo en ellos. Esta es la **circunferencia inscrita**, y es la fuente del preámbulo.

:::proposition Área e inradio
Si $a=BC$, $b=CA$, $c=AB$ y $s=\tfrac{a+b+c}2$ es el semiperímetro, entonces $[ABC]=rs$.
:::

:::proof
Como $I$ está dentro del triángulo, los triángulos $IBC$, $ICA$ e $IAB$ lo cubren sin traslaparse. Sus alturas desde $I$ miden $r$, así que $[ABC]=\tfrac{ar}2+\tfrac{br}2+\tfrac{cr}2=r\cdot\tfrac{a+b+c}2=rs$.
:::

:::example
Calcular el inradio del triángulo con lados $BC=14$, $CA=15$ y $AB=13$.

Conviene conocer primero el área. Sea $H$ el pie de la altura desde $A$ y $x=BH$. Pitágoras en $ABH$ y en $ACH$ da $13^2-x^2=15^2-(14-x)^2$; al desarrollar, $169-x^2=225-196+28x-x^2$, de donde $28x=140$ y $x=5$. La altura mide $\sqrt{169-25}=12$ y el área es $14\cdot12/2=84$. Como $s=21$, la proposición da $r=84/21=4$.
:::

:::try Si $BC=7$, $CA=8$ y $AB=9$, ¿cuánto mide $AF$, donde $F$ es el punto donde la circunferencia inscrita toca a $AB$?
En la prueba del lema, los triángulos congruentes dan $AE=AF$; del mismo hecho en $B$ y en $C$ salen $BF=BD$ y $CD=CE$. Con $x=AF$, $y=BD$ y $z=CE$, se tiene $x+y=9$, $y+z=7$ y $z+x=8$. Al sumar las tres, $x+y+z=12$; al restar la segunda, $x=5$.
:::

### El teorema de la bisectriz

:::mistake
Suponer que la bisectriz desde $A$ corta a $BC$ en su punto medio. Eso solo ocurre si $AB=AC$. En general, la bisectriz se acerca al vértice del lado más corto, como dice el teorema siguiente.
:::

![Triángulo ABC con la bisectriz AL resaltada; desde L salen las perpendiculares LP a AB y LQ a AC.](figuras/bisectrices-incentro-y-excentros-teorema.svg "L está a la misma distancia de AB y de AC")

:::theorem Teorema de la bisectriz
Si la bisectriz desde $A$ corta a $BC$ en $L$, entonces $\dfrac{BL}{LC}=\dfrac{AB}{AC}$.
:::

:::proof
Calculamos $[ABL]/[ALC]$ de dos maneras. Los dos triángulos tienen el vértice $A$ en común y bases $BL$ y $LC$ sobre la recta $BC$, así que (lección «Áreas y razones») $[ABL]/[ALC]=BL/LC$.

Por otro lado, $L$ está en la bisectriz, así que sus distancias $LP$ a $AB$ y $LQ$ a $AC$ son iguales; llamémoslas $h$. Con bases $AB$ y $AC$, $[ABL]=AB\cdot h/2$ y $[ALC]=AC\cdot h/2$, de modo que $[ABL]/[ALC]=AB/AC$. Al igualar las dos expresiones se obtiene el teorema.
:::

:::tip
Una igualdad de razones de longitudes suele salir de calcular un mismo cociente de áreas de dos maneras: una vez con bases sobre una recta y otra vez con alturas iguales.
:::

### Los excentros

El **ángulo exterior** en $B$ es el que forman la semirrecta $BC$ y la prolongación de $AB$ más allá de $B$; mide $180^\circ-\angle B$. Su bisectriz es la **bisectriz exterior** en $B$.

![Triángulo ABC con los lados AB y AC prolongados; las bisectrices exteriores en B y C y la bisectriz interior en A, resaltadas, se cortan en un punto; la circunferencia con centro en ese punto toca a BC y a las prolongaciones.](figuras/bisectrices-incentro-y-excentros-excentro.svg "El excentro opuesto a A y su circunferencia")

:::theorem Excentro
Las bisectrices exteriores en $B$ y en $C$ y la bisectriz interior en $A$ pasan por un mismo punto $I_A$, que está a la misma distancia $r_A$ de las rectas $BC$, $CA$ y $AB$.
:::

:::proof
Las bisectrices exteriores en $B$ y en $C$ salen hacia el lado de $BC$ opuesto a $A$ y forman con el segmento $BC$ ángulos de $90^\circ-\tfrac{\angle B}2$ y $90^\circ-\tfrac{\angle C}2$. Esos ángulos suman $180^\circ-\tfrac{\angle B+\angle C}2<180^\circ$, así que por el postulado de las paralelas, en la forma de Euclides, las dos semirrectas se cortan; sea $I_A$ el punto de corte.

Por el lema aplicado al ángulo exterior en $B$, las distancias de $I_A$ a las rectas $BC$ y $AB$ son iguales; aplicado al ángulo exterior en $C$, sus distancias a $BC$ y a $CA$ son iguales. Por tanto sus distancias a $AB$ y a $AC$ son iguales. El punto $I_A$ está dentro del ángulo $\angle BAC$, más allá del lado $BC$, y el lema dice entonces que está en la bisectriz desde $A$.
:::

La circunferencia de centro $I_A$ y radio $r_A$ toca al lado $BC$ y a las prolongaciones de $AB$ y $AC$: es la **circunferencia exinscrita** opuesta a $A$. Cada triángulo tiene tres, una por vértice, y sus centros son los tres **excentros**.

## Agregados culturales

- En 1822, Karl Wilhelm Feuerbach demostró que en todo triángulo no equilátero la circunferencia que pasa por los puntos medios de los lados y por los pies de las alturas toca a la circunferencia inscrita y a las tres exinscritas. El punto donde toca a la inscrita se llama hoy punto de Feuerbach.
- La primera Olimpiada Europea Femenil de Matemáticas se celebró en abril de 2012 en Cambridge, Inglaterra, con $70$ concursantes de $19$ países. Se inspiró en la Olimpiada Femenil de China y desde entonces se celebra cada año.
- Herón de Alejandría, en el siglo I, explicó que un rayo de luz que se refleja en un espejo plano sigue el camino más corto entre dos puntos. De ahí sale que la perpendicular al espejo en el punto de reflexión es la bisectriz del ángulo entre el rayo que llega y el que sale.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

En estos problemas conviene marcar los pies de las perpendiculares desde el incentro o desde un excentro: forman triángulos rectángulos congruentes y segmentos tangentes iguales.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

La dificultad está en relacionar a la vez el incentro y los excentros, que comparten bisectrices; las fórmulas de área de la lección ayudan a traducir esa relación a números.

[[collection:${collection}:dificiles]]`

const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'intermedio' })
const problem = (code, titulo, enunciado, difficulty = 'intermedio') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })

const problems = [
  exercise('G61', 'El inradio de un triángulo rectángulo', String.raw`Calcular el inradio del triángulo de lados $5$, $12$ y $13$.`, [
    String.raw`Comprobar primero que el triángulo es rectángulo; así su área es fácil de calcular.`,
    String.raw`Usar $[ABC]=rs$.`,
  ]),
  exercise('G62', 'Tres segmentos tangentes', String.raw`En el triángulo $ABC$, $BC=11$, $CA=10$ y $AB=13$. La circunferencia inscrita toca a $BC$, $CA$ y $AB$ en $D$, $E$ y $F$. Calcular $AF$, $BD$ y $CE$.`, [
    String.raw`Desde cada vértice salen dos segmentos tangentes de la misma longitud.`,
  ]),
  exercise('G63', 'La bisectriz no llega al punto medio', String.raw`En el triángulo $ABC$, $AB=6$, $AC=4$ y $BC=5$. La bisectriz desde $A$ corta a $BC$ en $L$. Calcular $BL$ y $LC$.`, [
    String.raw`Usar el teorema de la bisectriz junto con $BL+LC=5$.`,
  ]),
  exercise('G64', 'Incentro y excentro alineados', String.raw`Demostrar que el incentro $I$ y el excentro $I_A$ del triángulo $ABC$ están en una misma recta que pasa por $A$.`, [
    String.raw`¿Qué recta por $A$ contiene a cada uno de los dos puntos?`,
  ]),
  problem('G65', 'El ángulo en el incentro', String.raw`Sea $I$ el incentro del triángulo $ABC$. Demostrar que $\angle BIC=90^\circ+\tfrac12\angle BAC$, y calcular $\angle BIC$ cuando $\angle BAC=70^\circ$.`),
  problem('G66', 'El ángulo en el excentro', String.raw`Sea $I_A$ el excentro opuesto a $A$ del triángulo $ABC$. Demostrar que $\angle BI_AC=90^\circ-\tfrac12\angle BAC$.`),
  problem('G67', 'Inradio de un triángulo rectángulo', String.raw`Un triángulo rectángulo tiene catetos $a$ y $b$ e hipotenusa $c$. Demostrar que su inradio es $r=\tfrac{a+b-c}2$.`),
  problem('G68', 'Cuatro radios', String.raw`En el triángulo $ABC$, $BC=14$, $CA=15$ y $AB=13$. Calcular su inradio y los radios de sus tres circunferencias exinscritas.`),
  problem('G69', 'Área y exradio', String.raw`Sean $a=BC$ y $s$ el semiperímetro del triángulo $ABC$, y $r_A$ el radio de la circunferencia exinscrita opuesta a $A$. Demostrar que $[ABC]=r_A(s-a)$.`),
  problem('G70', 'Una paralela por el incentro', String.raw`Sea $I$ el incentro del triángulo $ABC$. La paralela a $BC$ por $I$ corta a $AB$ en $D$ y a $AC$ en $E$. Demostrar que $DE=BD+CE$.`),
  problem('G71', 'Inversos de los radios', String.raw`Sean $r$ el inradio del triángulo $ABC$ y $r_A$, $r_B$, $r_C$ los radios de sus circunferencias exinscritas. Demostrar que $\dfrac1r=\dfrac1{r_A}+\dfrac1{r_B}+\dfrac1{r_C}$.`, 'avanzado'),
  problem('G72', 'El triángulo de los excentros', String.raw`Sean $I_A$, $I_B$ e $I_C$ los excentros del triángulo $ABC$ e $I$ su incentro. Demostrar que $A$ está en la recta $I_BI_C$ y que $I$ es el ortocentro del triángulo $I_AI_BI_C$.`, 'avanzado'),
]

export default {
  pathSlug,
  lesson,
  summary,
  content,
  problems,
  collections: {
    [collection]: {
      ejercicios: ['TP-G61', 'TP-G62', 'TP-G63', 'TP-G64'],
      practice: ['TP-G65', 'TP-G66', 'TP-G67', 'TP-G68', 'TP-G69', 'TP-G70'],
      dificiles: ['TP-G71', 'TP-G72'],
    },
  },
}
