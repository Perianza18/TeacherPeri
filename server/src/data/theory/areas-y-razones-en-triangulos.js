// «Áreas y razones en triángulos» in the lesson format of the theory page.
// Original TeacherPeri text. Exercises and problems live in the banco; the
// lesson only points to them. New lesson (no earlier text).

const pathSlug = 'areas-y-razones-en-triangulos'
const collection = 'areas-en-triangulos'

const lesson = { title: 'Áreas y razones en triángulos', area: 'geometry', level: 'intermedio' }

const summary = 'Convertir razones de segmentos en razones de áreas y de regreso, para calcular en qué proporción se cortan dos cevianas sin medir nada.'

const content = String.raw`## Preámbulo: Dos caminos que se cruzan

En un terreno triangular $ABC$ se trazan dos caminos rectos: uno sale de $A$ y llega al lado $BC$, a un tercio de camino entre $B$ y $C$; el otro sale de $B$ y llega al punto medio de $CA$. Los caminos se cruzan en un punto $P$. ¿Qué fracción del primer camino queda entre $A$ y el cruce?

Con regla se puede estimar, pero los datos son solo razones: no hay una sola longitud ni un ángulo. La lección «Áreas y razones» del Ciclo 1 enseñó a comparar áreas de triángulos con la misma altura. Aquí usaremos esa idea en las dos direcciones: de razones de segmentos a razones de áreas, y de regreso.

## Teoría

### Dos triángulos con un ángulo común

Recordemos el hecho básico, que usaremos muchas veces: si dos triángulos tienen un vértice en común y sus bases están sobre una misma recta, sus alturas desde ese vértice son iguales, y la razón de sus áreas es la razón de sus bases. Escribimos $[XYZ]$ para el área del triángulo $XYZ$.

![Triángulo ABC con B′ en AB y C′ en AC; el triángulo AB′C′ está sombreado y el segmento B′C une B′ con C.](figuras/areas-y-razones-en-triangulos-comun.svg "El triángulo AB′C sirve de puente entre AB′C′ y ABC")

:::proposition Ángulo común
Si $B'$ está en la semirrecta $AB$ y $C'$ en la semirrecta $AC$, distintos de $A$, entonces
$$\frac{[AB'C']}{[ABC]}=\frac{AB'}{AB}\cdot\frac{AC'}{AC}.$$
:::

:::proof
Usamos el triángulo $AB'C$ como paso intermedio. Los triángulos $AB'C'$ y $AB'C$ tienen el vértice $B'$ en común y bases $AC'$ y $AC$ sobre la recta $AC$, así que $[AB'C']/[AB'C]=AC'/AC$. Los triángulos $AB'C$ y $ABC$ tienen el vértice $C$ en común y bases $AB'$ y $AB$ sobre la recta $AB$, así que $[AB'C]/[ABC]=AB'/AB$. Al multiplicar las dos igualdades, $[AB'C]$ se cancela y queda la fórmula.
:::

El caso $AB'/AB=AC'/AC=k$ con $B'C'\parallel BC$ es la proposición «Área y escala» del Ciclo 1: el área se multiplica por $k^2$. La nueva fórmula no necesita paralelas.

:::try Si $AB'=\tfrac12AB$ y $AC'=\tfrac13AC$, ¿qué fracción del área de $ABC$ ocupa $AB'C'$?
Por la proposición, $\tfrac12\cdot\tfrac13=\tfrac16$.
:::

:::example
Los puntos $D$, $E$ y $F$ están en los lados $BC$, $CA$ y $AB$ del triángulo $ABC$, con $BD:DC=CE:EA=AF:FB=1:2$. Si $[ABC]=1$, calcular $[DEF]$.

El triángulo $DEF$ no comparte ángulo con $ABC$, pero lo que sobra sí: $ABC$ se parte en $DEF$ y los tres triángulos de las esquinas, $AFE$, $BDF$ y $CED$, y cada uno comparte un ángulo con $ABC$. En la esquina $A$, $AF=\tfrac13AB$ y $AE=\tfrac23AC$, así que la proposición da $[AFE]=\tfrac13\cdot\tfrac23=\tfrac29$. En la esquina $B$, $BD=\tfrac13BC$ y $BF=\tfrac23BA$, de modo que $[BDF]=\tfrac29$. En la esquina $C$, $CE=\tfrac13CA$ y $CD=\tfrac23CB$, de modo que $[CED]=\tfrac29$. Por tanto $[DEF]=1-3\cdot\tfrac29=\tfrac13$.
:::

### Un punto sobre una ceviana

Una **ceviana** es un segmento que une un vértice con un punto del lado opuesto. Sea $AD$ una ceviana, con $D$ en $BC$, y sea $P$ un punto del segmento $AD$ distinto de $A$.

![Triángulo ABC con la ceviana AD resaltada y un punto P sobre ella; el triángulo ABP está sombreado y P está unido con B y con C.](figuras/areas-y-razones-en-triangulos-ceviana.svg "ABP y ACP están en la razón BD : DC")

:::lemma Razón de una ceviana
Con esa notación, $\dfrac{[ABP]}{[ACP]}=\dfrac{BD}{DC}$ y $\dfrac{AP}{PD}=\dfrac{[ABP]+[ACP]}{[BCP]}$, esta última cuando $P\ne D$.
:::

:::proof
Sea $k=BD/DC$. Con vértice $A$ y bases sobre $BC$, $[ABD]=k\,[ACD]$; con vértice $P$, $[PBD]=k\,[PCD]$. Como $P$ está entre $A$ y $D$, el triángulo $ABD$ se parte en $ABP$ y $PBD$, y $ACD$ en $ACP$ y $PCD$. Al restar la segunda igualdad de la primera,
$$[ABP]=[ABD]-[PBD]=k\,([ACD]-[PCD])=k\,[ACP].$$

Para la segunda fórmula, los triángulos $ABD$ y $PBD$ tienen el vértice $B$ en común y bases $AD$ y $PD$ sobre la recta $AD$, así que $[ABD]=\tfrac{AD}{PD}[PBD]$; con el vértice $C$, $[ACD]=\tfrac{AD}{PD}[PCD]$. Al sumar, $[ABC]=\tfrac{AD}{PD}[BCP]$. Entonces
$$\frac{AP}{PD}=\frac{AD}{PD}-1=\frac{[ABC]-[BCP]}{[BCP]}=\frac{[ABP]+[ACP]}{[BCP]}.$$
:::

### Dos cevianas que se cortan

Con el lema, cada dato de un problema se vuelve una relación entre las áreas de los tres triángulos $PBC$, $PCA$ y $PAB$, y cada pregunta sobre segmentos se responde con esas mismas áreas.

![Triángulo ABC con las cevianas AD y BE, resaltadas, que se cortan en P; D está a un tercio de BC desde B y E es el punto medio de CA.](figuras/areas-y-razones-en-triangulos-dos-cevianas.svg "Los caminos del preámbulo")

:::example
En el triángulo $ABC$, el punto $D$ está en $BC$ con $BD:DC=1:2$ y $E$ es el punto medio de $CA$. Las cevianas $AD$ y $BE$ se cortan en $P$. Calcular $AP:PD$ y $BP:PE$.

Las incógnitas naturales son las áreas de $PAB$, $PBC$ y $PCA$. Sea $x=[PAB]$. El lema con la ceviana $AD$ da $[PAB]/[PCA]=BD/DC=1/2$, así que $[PCA]=2x$. El lema con la ceviana $BE$ da $[PBC]/[PBA]=CE/EA=1$, así que $[PBC]=x$.

Ahora la segunda parte del lema responde las preguntas:
$$\frac{AP}{PD}=\frac{[PAB]+[PCA]}{[PBC]}=\frac{x+2x}{x}=3,\qquad \frac{BP}{PE}=\frac{[PBA]+[PBC]}{[PCA]}=\frac{x+x}{2x}=1.$$
Así, $AP:PD=3:1$ y $P$ es el punto medio de $BE$. En el preámbulo, tres cuartas partes del primer camino quedan entre $A$ y el cruce.
:::

:::mistake
Suponer que $P$ divide a $AD$ en la misma razón en que $D$ divide a $BC$. En el ejemplo, $BD:DC=1:2$ pero $AP:PD=3:1$. La razón en que se cortan dos cevianas depende de los datos de ambas, y por eso hace falta un cálculo como el del lema.
:::

:::tip
Al combinar varias cevianas, poner una letra a una sola área, escribir las demás en función de ella con el lema y dejar las preguntas sobre segmentos para el final. Así cada dato se usa una vez y no se mezclan razones de segmentos con razones de áreas.
:::

## Agregados culturales

- En 1896, Edward Routh publicó una fórmula para el área del triángulo que forman tres cevianas. Su caso más famoso dice que si cada lado se divide en razón $1:2$ y se trazan las cevianas correspondientes, el triángulo central ocupa exactamente un séptimo del área.
- La primera Olimpiada Iberoamericana de Matemáticas se celebró en diciembre de 1985 en Colombia, entre Paipa, Villa de Leyva y Bogotá, con estudiantes de diez países. Colombia la propuso porque en ese momento solo cuatro países de la región participaban en la Olimpiada Internacional.
- En 1615, Willebrord Snellius midió la distancia entre las ciudades neerlandesas de Alkmaar y Bergen op Zoom, de unos $130$ kilómetros, con una red de triángulos: medía ángulos y unas pocas distancias, y calculaba el resto. Publicó el método en 1617; es la base de la triangulación con la que se hicieron mapas durante siglos.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Antes de calcular conviene elegir qué áreas desconocidas nombrar y traducir cada razón del enunciado en una relación entre ellas.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Aquí hay tres cevianas o varias piezas a la vez. La dificultad está en organizar las incógnitas para que cada razón dé una ecuación sencilla.

[[collection:${collection}:dificiles]]`

const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'intermedio' })
const problem = (code, titulo, enunciado, difficulty = 'intermedio') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })

const problems = [
  exercise('G73', 'Un triángulo dentro de otro', String.raw`El triángulo $ABC$ tiene área $60$. Los puntos $B'$ y $C'$ están en los lados $AB$ y $AC$, con $AB'=\tfrac13AB$ y $AC'=\tfrac34AC$. Calcular $[AB'C']$.`, [
    String.raw`Usar la proposición del ángulo común.`,
  ]),
  exercise('G74', 'El punto medio de una ceviana', String.raw`En el triángulo $ABC$, de área $50$, el punto $D$ está en $BC$ con $BD:DC=2:3$, y $P$ es el punto medio de $AD$. Calcular $[ABP]$.`, [
    String.raw`Calcular primero $[ABD]$; después comparar $ABP$ con $ABD$.`,
  ]),
  exercise('G75', 'Otra pareja de cevianas', String.raw`En el triángulo $ABC$, $D$ es el punto medio de $BC$ y $E$ está en $CA$ con $CE:EA=2:1$. Las cevianas $AD$ y $BE$ se cortan en $P$. Calcular $AP:PD$ y $BP:PE$.`, [
    String.raw`Llamar $x$ al área de $PAB$ y escribir las áreas de $PBC$ y $PCA$ en función de $x$.`,
    String.raw`Cuidado: la razón de $D$ en $BC$ no es la respuesta para $AP:PD$.`,
  ]),
  exercise('G76', 'Tres áreas iguales', String.raw`El punto $P$ está dentro del triángulo $ABC$ y cumple $[PAB]=[PBC]=[PCA]$. Demostrar que $P$ es el centroide de $ABC$.`, [
    String.raw`La recta $AP$ corta a $BC$ en un punto $D$. ¿Qué dice el lema sobre $BD/DC$?`,
  ]),
  problem('G77', 'Siete veces más grande', String.raw`El triángulo $ABC$ tiene área $1$. Se prolonga $AB$ más allá de $B$ hasta $A'$ con $BA'=AB$, se prolonga $BC$ más allá de $C$ hasta $B'$ con $CB'=BC$, y se prolonga $CA$ más allá de $A$ hasta $C'$ con $AC'=CA$. Calcular el área del triángulo $A'B'C'$.`),
  problem('G78', 'Cevianas desiguales', String.raw`En el triángulo $ABC$, $D$ está en $BC$ con $BD:DC=3:1$ y $E$ está en $CA$ con $CE:EA=2:1$. Las cevianas $AD$ y $BE$ se cortan en $P$. Calcular $AP:PD$, $BP:PE$ y la fracción del área de $ABC$ que ocupa $APB$.`),
  problem('G79', 'Diagonales de un cuadrilátero', String.raw`Las diagonales del cuadrilátero convexo $ABCD$ se cortan en $P$. Demostrar que $[PAB]\cdot[PCD]=[PBC]\cdot[PDA]$.`),
  problem('G80', 'Diagonales de un trapecio', String.raw`En el trapecio $ABCD$, con $AB\parallel CD$, las diagonales se cortan en $P$. Demostrar que $[PAD]=[PBC]$.`),
  problem('G81', 'Tres segmentos sobre una ceviana', String.raw`Los puntos $D$ y $E$ dividen al lado $BC$ del triángulo $ABC$ en tres partes iguales, en el orden $B$, $D$, $E$, $C$, y $F$ es el punto medio de $AC$. El segmento $BF$ corta a $AD$ en $P$ y a $AE$ en $Q$. Calcular $BP:PQ:QF$.`),
  problem('G82', 'Una suma que vale uno', String.raw`El punto $P$ está dentro del triángulo $ABC$, y las rectas $AP$, $BP$ y $CP$ cortan a los lados opuestos en $D$, $E$ y $F$. Demostrar que $\dfrac{PD}{AD}+\dfrac{PE}{BE}+\dfrac{PF}{CF}=1$.`),
  problem('G83', 'El triángulo de un séptimo', String.raw`En el triángulo $ABC$, los puntos $D$, $E$ y $F$ están en $BC$, $CA$ y $AB$ con $BD:DC=CE:EA=AF:FB=1:2$. Las cevianas $AD$, $BE$ y $CF$ forman un triángulo pequeño en el centro. Demostrar que su área es $\tfrac17$ del área de $ABC$.`, 'avanzado'),
  problem('G84', 'Seis piezas', String.raw`Las cevianas $AD$, $BE$ y $CF$ del triángulo $ABC$ pasan por un punto $P$ y lo dividen en seis triángulos. Se sabe que $[PBD]=6$, $[PDC]=4$, $[PCE]=5$ y $[PFB]=10$. Calcular el área de $ABC$.`, 'avanzado'),
]

export default {
  pathSlug,
  lesson,
  summary,
  content,
  problems,
  collections: {
    [collection]: {
      ejercicios: ['TP-G73', 'TP-G74', 'TP-G75', 'TP-G76'],
      practice: ['TP-G77', 'TP-G78', 'TP-G79', 'TP-G80', 'TP-G81', 'TP-G82'],
      dificiles: ['TP-G83', 'TP-G84'],
    },
  },
}
