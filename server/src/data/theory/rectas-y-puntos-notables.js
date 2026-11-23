// «Rectas y puntos notables» in the lesson format of the theory page.
// Original TeacherPeri text. Exercises and problems live in the banco; the
// lesson only points to them. New lesson (no earlier text).

const pathSlug = 'rectas-y-puntos-notables'
const collection = 'puntos-notables'

const lesson = { title: 'Rectas y puntos notables', area: 'geometry', level: 'intermedio' }

const summary = 'Demostrar que las mediatrices, las medianas y las alturas de un triángulo pasan por un mismo punto, y usar esos puntos para calcular distancias y áreas.'

const content = String.raw`## Preámbulo: Un pozo para tres casas

Tres casas, que no están en línea recta, quieren compartir un pozo y acuerdan que debe quedar a la misma distancia de las tres. Si solo fueran dos casas, habría muchas posiciones posibles. Con tres, ¿existe siempre un lugar así? ¿Puede haber más de uno?

Al dibujar algunos casos parece que siempre hay exactamente uno, a veces dentro del triángulo que forman las casas y a veces fuera. Un dibujo, sin embargo, no garantiza que tres rectas pasen por un mismo punto: dos rectas que casi se cortan en el mismo lugar se ven igual que dos que se cortan exactamente ahí.

Esta lección convierte la pregunta del pozo en un teorema y muestra que no es un caso aislado: en todo triángulo hay tres familias de rectas que concurren, es decir, pasan por un mismo punto.

## Teoría

### La mediatriz

![Segmento AB con su punto medio M y la recta m perpendicular a AB por M, resaltada; un punto P de m está unido con A y con B.](figuras/rectas-y-puntos-notables-mediatriz.svg "Todo punto de la mediatriz de AB está a la misma distancia de A y de B")

:::definition Mediatriz
La **mediatriz** de un segmento $AB$ es la recta perpendicular a $AB$ que pasa por su punto medio $M$.
:::

Para dos casas, los lugares posibles para el pozo forman exactamente la mediatriz. Usaremos los criterios de congruencia lado-ángulo-lado (LAL) y lado-lado-lado (LLL) de la lección «Semejanza y congruencia».

:::lemma Puntos de la mediatriz
Un punto $P$ del plano cumple $PA=PB$ si y solo si $P$ está en la mediatriz de $AB$.
:::

:::proof
Sea $M$ el punto medio de $AB$. Si $P=M$, las dos afirmaciones son ciertas. Supongamos $P\ne M$.

Si $P$ está en la mediatriz, los triángulos $PMA$ y $PMB$ tienen $MA=MB$, el lado común $PM$ y ángulos rectos en $M$ entre esos lados. Por LAL son congruentes, así que $PA=PB$.

Si $PA=PB$, los triángulos $PMA$ y $PMB$ tienen $PA=PB$, $MA=MB$ y el lado común $PM$. Por LLL son congruentes, así que $\angle PMA=\angle PMB$. Esos dos ángulos forman un ángulo llano, porque $MA$ y $MB$ son semirrectas opuestas; cada uno mide entonces $180^\circ/2=90^\circ$. Así, $PM$ es perpendicular a $AB$ por su punto medio: es la mediatriz.
:::

### El circuncentro

![Triángulo ABC con las mediatrices de sus tres lados, resaltadas, que se cortan en O; la circunferencia con centro O pasa por A, B y C.](figuras/rectas-y-puntos-notables-circuncentro.svg "Las tres mediatrices se cortan en el circuncentro O")

:::theorem Circuncentro
En todo triángulo $ABC$, las mediatrices de los tres lados pasan por un mismo punto $O$, y $OA=OB=OC$.
:::

:::proof
Las mediatrices de $AB$ y de $BC$ no son paralelas: si lo fueran, las rectas $AB$ y $BC$, perpendiculares a ellas, también serían paralelas, y como ambas pasan por $B$ serían la misma recta, lo que contradice que $A$, $B$ y $C$ no están alineados. Por tanto se cortan en un punto, que llamamos $O$. Como $O$ está en la mediatriz de $AB$, el lema da $OA=OB$; como está en la mediatriz de $BC$, da $OB=OC$. De las dos igualdades se sigue $OA=OC$, y el lema, usado ahora en la otra dirección, dice que $O$ está en la mediatriz de $CA$.
:::

El punto $O$ es el **circuncentro** y la circunferencia con centro $O$ y radio $OA$ pasa por los tres vértices: es la **circunferencia circunscrita**. Esto responde el preámbulo: el pozo debe ir en $O$, y es el único lugar posible, porque cualquier punto a la misma distancia de las tres casas está en dos de las mediatrices, que solo se cortan en $O$.

:::tip
Para demostrar que tres rectas concurren, conviene describir cada recta por una propiedad («estar a la misma distancia de $A$ y de $B$») y mostrar que el punto donde se cortan dos de ellas tiene la propiedad que caracteriza a la tercera.
:::

### Las medianas y el centroide

![Triángulo ABC con los puntos medios M, N y P de sus lados, las tres medianas cortándose en G y el segmento MN resaltado.](figuras/rectas-y-puntos-notables-medianas.svg "Las medianas se cortan en G; el segmento MN es paralelo a AB")

Una **mediana** une un vértice con el punto medio del lado opuesto. Llamemos $M$, $N$ y $P$ a los puntos medios de $BC$, $CA$ y $AB$.

:::lemma Paralela media
El segmento $MN$ es paralelo a $AB$ y mide la mitad de $AB$.
:::

:::proof
Sea $M'$ el punto donde la paralela a $AB$ por $N$ corta a $BC$. Por la proposición de la paralela a un lado (lección «Semejanza y congruencia»), $CM'/CB=CN/CA=NM'/AB$. Como $N$ es punto medio, $CN/CA=1/2$; entonces $CM'=CB/2$, de modo que $M'$ es el punto medio $M$. Así, $MN$ es la paralela trazada, y $MN/AB=1/2$.
:::

Con la paralela media aparecen dos triángulos semejantes de razón $\tfrac12$, y de ahí sale la posición del punto de corte de las medianas.

:::theorem Centroide
Las tres medianas de un triángulo pasan por un mismo punto $G$, que está en cada mediana a dos tercios de su longitud desde el vértice.
:::

:::proof
Sea $G$ el punto donde se cortan las medianas $AM$ y $BN$. Como $MN\parallel AB$, con la transversal $AM$ los ángulos $\angle GMN$ y $\angle GAB$ son alternos internos, y con la transversal $BN$ también lo son $\angle GNM$ y $\angle GBA$. Por el criterio AA, los triángulos $GMN$ y $GAB$ son semejantes, con razón $MN/AB=1/2$. Por tanto $GM=GA/2$, es decir, $AG=2GM$ y $AG=\tfrac23AM$.

Ahora sea $G'$ el punto donde se cortan las medianas $AM$ y $CP$. El lema, aplicado a los puntos medios $M$ y $P$ de $BC$ y $BA$, da $MP\parallel CA$ y $MP=CA/2$. Con las transversales $AM$ y $CP$, los triángulos $G'MP$ y $G'AC$ tienen dos pares de ángulos alternos internos iguales; son semejantes con razón $1/2$, así que $AG'=2G'M$ y $AG'=\tfrac23AM$. Sobre el segmento $AM$ hay un solo punto a distancia $\tfrac23AM$ de $A$, de modo que $G'=G$ y las tres medianas pasan por $G$.
:::

El punto $G$ es el **centroide** del triángulo.

:::try Si la mediana $AM$ mide $18$, ¿cuánto miden $AG$ y $GM$?
Por el teorema, $AG=\tfrac23\cdot18=12$ y $GM=18-12=6$.
:::

:::example
Demostrar que las tres medianas dividen al triángulo $ABC$ en seis triángulos de la misma área.

Las piezas son $GBM$, $GMC$, $GCN$, $GNA$, $GAP$ y $GPB$. Dos triángulos con un vértice en común y bases iguales sobre una misma recta tienen la misma altura desde ese vértice, y por tanto la misma área (lección «Áreas y razones»). Con el vértice $G$ y $BM=MC$, $CN=NA$, $AP=PB$, podemos escribir $[GBM]=[GMC]=x$, $[GCN]=[GNA]=y$ y $[GAP]=[GPB]=z$.

Con el vértice $A$ y las bases $BM=MC$, los triángulos $ABM$ y $AMC$ también tienen la misma área: $2z+x=2y+x$, y al restar $x$ y dividir entre $2$ queda $z=y$. Con el vértice $B$ y las bases $CN=NA$, los triángulos $BCN$ y $BNA$ dan $2x+y=2z+y$, de donde $x=z$. Las seis áreas son iguales y suman $[ABC]$, así que cada una mide $[ABC]/6$.
:::

### Las alturas y el ortocentro

Una **altura** de un triángulo es la recta que pasa por un vértice y es perpendicular a la recta del lado opuesto. Las alturas no se pueden tratar como las medianas, pero hay un truco: verlas como mediatrices de otro triángulo.

![Triángulo ABC dentro del triángulo A′B′C′ formado por las paralelas a sus lados trazadas por los vértices; las tres alturas de ABC, resaltadas, se cortan en H.](figuras/rectas-y-puntos-notables-ortocentro.svg "Las alturas de ABC son las mediatrices de A′B′C′")

:::theorem Ortocentro
Las tres alturas de un triángulo pasan por un mismo punto $H$.
:::

:::proof
Por cada vértice trazamos la paralela al lado opuesto; las tres rectas forman el triángulo $A'B'C'$ de la figura, con $A$ en $B'C'$, $B$ en $C'A'$ y $C$ en $A'B'$. Usaremos también el criterio de congruencia ángulo-lado-ángulo (ALA).

Cada uno de los triángulos $CB'A$, $AC'B$ y $BA'C$ comparte un lado con $ABC$ y es congruente con él:
- En $CB'A$, el lado $AC$ es común; $\angle B'CA=\angle BAC$ son alternos internos entre las paralelas $CB'$ y $AB$ con la transversal $AC$, y $\angle B'AC=\angle BCA$ lo son entre $AB'$ y $BC$. Por ALA, $AB'=BC$ y $CB'=AB$.
- En $AC'B$, el lado $AB$ es común; $\angle C'AB=\angle ABC$ son alternos internos entre $AC'$ y $BC$, y $\angle C'BA=\angle BAC$ lo son entre $BC'$ y $AC$. Por ALA, $AC'=BC$ y $BC'=AC$.
- En $BA'C$, el lado $BC$ es común; $\angle A'BC=\angle BCA$ son alternos internos entre $BA'$ y $CA$, y $\angle A'CB=\angle CBA$ lo son entre $CA'$ y $BA$. Por ALA, $BA'=AC$ y $CA'=AB$.

Así, $AB'=AC'=BC$, de modo que $A$ es el punto medio de $B'C'$; también $BC'=BA'=AC$ y $CB'=CA'=AB$, de modo que $B$ y $C$ son los puntos medios de $C'A'$ y de $A'B'$.

La altura desde $A$ es perpendicular a $BC$, y $BC\parallel B'C'$; por eso es perpendicular a $B'C'$ y pasa por su punto medio $A$: es la mediatriz de $B'C'$. Para las otras dos, la altura desde $B$ es perpendicular a $CA\parallel C'A'$ y pasa por el punto medio $B$ de $C'A'$, y la altura desde $C$ es perpendicular a $AB\parallel A'B'$ y pasa por el punto medio $C$ de $A'B'$: son las otras dos mediatrices. Por el teorema del circuncentro, aplicado a $A'B'C'$, las tres pasan por un mismo punto.
:::

El punto $H$ es el **ortocentro**. En la figura queda dentro del triángulo, pero eso depende de la forma del triángulo.

:::mistake
Suponer que los puntos notables siempre quedan dentro del triángulo. El centroide sí, porque está sobre cada mediana, entre el vértice y el punto medio. En cambio, si el ángulo en $A$ mide más de $90^\circ$, el circuncentro y el ortocentro quedan fuera, y las alturas desde $B$ y desde $C$ cortan a las prolongaciones de los lados, no a los lados mismos. Un dibujo con un triángulo acutángulo esconde ese caso.
:::

## Agregados culturales

- En un artículo escrito hacia 1763, Leonhard Euler demostró que en todo triángulo el circuncentro, el centroide y el ortocentro están alineados; la recta que los une se llama hoy recta de Euler. Si el triángulo no es equilátero, el centroide está entre los otros dos y su distancia al ortocentro es el doble de su distancia al circuncentro.
- La primera Olimpiada Matemática de Centroamérica y el Caribe se celebró en San José, Costa Rica, en julio de 1999, con México entre los países participantes. Desde entonces se celebra cada año en un país distinto de la región.
- Clark Kimberling empezó en 1998 una lista de $400$ puntos notables del triángulo. Con aportaciones de muchas personas se convirtió en la Enciclopedia de Centros del Triángulo, que en noviembre de 2026 registraba más de $73\,000$ puntos, cada uno con un número de la forma $X(n)$.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Antes de calcular conviene decidir qué propiedad describe cada recta: estar a la misma distancia de dos puntos, pasar por un punto medio o ser perpendicular a un lado. Muchas pruebas de concurrencia salen de esa descripción.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

En estos problemas la dificultad está en ver un punto notable desde otro triángulo, como se hizo con el ortocentro, y no en las cuentas.

[[collection:${collection}:dificiles]]`

const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'intermedio' })
const problem = (code, titulo, enunciado, difficulty = 'intermedio') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })

const problems = [
  exercise('G49', 'Partes de una mediana', String.raw`En el triángulo $ABC$, la mediana desde $B$ mide $21$. Calcular la distancia del centroide a $B$ y al punto medio de $AC$.`, [
    String.raw`El centroide está a dos tercios de la mediana, medidos desde el vértice.`,
  ]),
  exercise('G50', 'Dos igualdades bastan', String.raw`Un punto $P$ cumple $PA=PB$ y $PB=PC$, donde $A$, $B$ y $C$ no están alineados. Demostrar que $P$ está en la mediatriz de $AC$ y que $P$ es el circuncentro de $ABC$.`, [
    String.raw`Combinar las dos igualdades y usar el lema de la mediatriz en la dirección «si $PA=PC$…».`,
  ]),
  exercise('G51', 'Un circuncentro afuera', String.raw`Dar un triángulo cuyo circuncentro quede fuera del triángulo y justificar que queda fuera. Por ejemplo, usar los vértices $A=(0,0)$, $B=(6,0)$ y $C=(1,1)$ del plano cartesiano.`, [
    String.raw`La mediatriz de $AB$ es la recta $x=3$; buscar en ella el punto a la misma distancia de $A$ y de $C$.`,
    String.raw`Comparar el punto obtenido con el triángulo: ¿qué signo tiene su segunda coordenada?`,
  ]),
  exercise('G52', 'La tercera altura', String.raw`En el triángulo $ABC$, la altura desde $A$ y la altura desde $B$ se cortan en $H$, y $H\ne C$. Demostrar que la recta $CH$ es perpendicular a $AB$.`, [
    String.raw`Usar el teorema del ortocentro: ¿por qué punto pasa la altura desde $C$?`,
  ]),
  problem('G53', 'Áreas alrededor del centroide', String.raw`Las medianas $AM$ y $BN$ del triángulo $ABC$ se cortan en $G$, y $[ABC]=36$. Calcular el área del triángulo $AGB$ y la del cuadrilátero $GMCN$.`),
  problem('G54', 'Una mediana igual a la mitad del lado', String.raw`En el triángulo $ABC$, $M$ es el punto medio de $BC$ y $AM=BM$. Demostrar que $\angle BAC=90^\circ$.`),
  problem('G55', 'Cuatro triángulos iguales', String.raw`En el triángulo $ABC$, los puntos $D$, $E$ y $F$ son los puntos medios de $BC$, $CA$ y $AB$. Demostrar que los triángulos $AFE$, $FBD$, $EDC$ y $DEF$ son congruentes.`),
  problem('G56', 'Tres puntos con coordenadas', String.raw`En el plano cartesiano, $A=(0,0)$, $B=(8,0)$ y $C=(2,6)$. Encontrar las coordenadas del circuncentro $O$, del centroide $G$ y del ortocentro $H$ del triángulo $ABC$, y comprobar que están alineados.`),
  problem('G57', 'Medianas iguales', String.raw`Demostrar que si dos medianas de un triángulo tienen la misma longitud, el triángulo es isósceles.`),
  problem('G58', 'El isósceles y sus rectas', String.raw`En el triángulo $ABC$, $AB=AC$. Demostrar que la mediana desde $A$, la altura desde $A$ y la mediatriz de $BC$ son la misma recta.`),
  problem('G59', 'Un ortocentro que cambia de papel', String.raw`Sea $H$ el ortocentro del triángulo acutángulo $ABC$. Demostrar que $A$ es el ortocentro del triángulo $HBC$.`, 'avanzado'),
  problem('G60', 'La recta de Euler', String.raw`Sea $ABC$ un triángulo no equilátero, con circuncentro $O$, centroide $G$ y ortocentro $H$. Demostrar que $O$, $G$ y $H$ están alineados y que $GH=2\,OG$.`, 'avanzado'),
]

export default {
  pathSlug,
  lesson,
  summary,
  content,
  problems,
  collections: {
    [collection]: {
      ejercicios: ['TP-G49', 'TP-G50', 'TP-G51', 'TP-G52'],
      practice: ['TP-G53', 'TP-G54', 'TP-G55', 'TP-G56', 'TP-G57', 'TP-G58'],
      dificiles: ['TP-G59', 'TP-G60'],
    },
  },
}
