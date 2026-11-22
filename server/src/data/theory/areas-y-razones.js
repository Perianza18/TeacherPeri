const pathSlug = 'areas-y-razones'
const collection = pathSlug
const summary = 'Comparar áreas de triángulos a partir de sus bases y alturas, y usar esas razones para encontrar áreas sin medir todas las longitudes.'
const content = String.raw`## Preámbulo: Una división de la base

![Triángulo ABC dividido por el segmento AD, con D en BC y altura AH](figuras/areas-y-razones-bases.svg "Dos triángulos con la misma altura")

Un triángulo $ABC$ tiene área $30$ y un punto $D$ en el interior de $BC$ satisface $BD:DC=2:3$. El segmento $AD$ divide el triángulo en dos regiones. Si sus áreas están en esa misma razón, las cinco partes iguales valen $30/5=6$ y las áreas buscadas son $12$ y $18$.

Pero la figura por sí sola no demuestra que las áreas estén en razón $2:3$. Necesitamos relacionar la base con la altura y justificar qué cambia cuando una longitud varía. Así podremos comparar regiones aun cuando ninguna de sus alturas se conozca numéricamente.

## Teoría

### Bases sobre una misma recta

![Triángulo ABC con D en BC y pie de altura H fuera de BD](figuras/areas-y-razones-bases.svg "La altura puede caer fuera de la base elegida")

Usaremos la fórmula conocida para el área de un triángulo: si una base tiene longitud $b$ y la distancia perpendicular desde el vértice opuesto a la recta de esa base es $h$, el área es $bh/2$. La altura es una distancia, aunque el pie de la perpendicular quede fuera del segmento elegido como base. Escribiremos $[ABC]$ para el área del triángulo $ABC$.

![Triángulo ABC con D en BC y altura AH perpendicular a BC](figuras/areas-y-razones-bases.svg "Los triángulos ABD y ADC comparten altura")

:::proposition Bases y áreas
Sea $ABC$ un triángulo y $D$ un punto interior del segmento $BC$. Entonces
$$\frac{[ABD]}{[ADC]}=\frac{BD}{DC}.$$
:::

:::proof
Sea $h$ la distancia perpendicular de $A$ a la recta $BC$. Como $BD$ y $DC$ están en esa misma recta, $h$ es la altura de ambos triángulos al elegir esas bases. Por la fórmula del área, $[ABD]=BD\cdot h/2$ y $[ADC]=DC\cdot h/2$. Como $h>0$ y $DC>0$, al dividir la primera igualdad entre la segunda y cancelar el factor común $h/2$ obtenemos $[ABD]/[ADC]=BD/DC$.
:::

![Triángulo ABC dividido por AD en dos triángulos con bases BD y DC](figuras/areas-y-razones-bases.svg "La suma de las dos áreas es el área total")

:::example
Un triángulo $ABC$ tiene área $45$. El punto $D$ está en el interior de $BC$ y $BD:DC=2:3$. Calcular $[ABD]$ y $[ADC]$.

La proposición da $[ABD]:[ADC]=2:3$. Escribamos esas áreas como $2x$ y $3x$, respectivamente. Los dos triángulos no se traslapan en su interior y forman $ABC$, así que $2x+3x=45$. De $5x=45$ resulta $x=9$; las áreas son $18$ y $27$.
:::

:::try Si $BD=DC$ en la configuración anterior, ¿qué fracción de $[ABC]$ es $[ABD]$?
La mitad. La proposición da $[ABD]=[ADC]$, y las dos áreas suman $[ABC]$.
:::

### Alturas respecto de una misma base

![Triángulos ABC y EBC con base común BC y vértice E sobre la altura AH](figuras/areas-y-razones-alturas.svg "La misma base con dos alturas")

Si se conserva la base $BC$ y se cambia el vértice opuesto, la fórmula del área permite comparar las alturas. En la figura, $E$ está en el interior de la altura $AH$; por eso sus distancias a la recta $BC$ son $EH$ y $AH$.

:::proposition Una base común
Sean $ABC$ y $EBC$ triángulos no degenerados con base común $BC$. Si $h_A$ y $h_E$ son las distancias perpendiculares de $A$ y $E$ a la recta $BC$, entonces
$$\frac{[EBC]}{[ABC]}=\frac{h_E}{h_A}.$$
:::

:::proof
Por la fórmula del área, $[EBC]=BC\cdot h_E/2$ y $[ABC]=BC\cdot h_A/2$. Como $BC>0$ y $h_A>0$, dividir la primera igualdad entre la segunda y cancelar $BC/2$ da $[EBC]/[ABC]=h_E/h_A$.
:::

![Triángulo ABC con altura AH y E en el interior de AH](figuras/areas-y-razones-alturas.svg "Las alturas se miden desde la recta BC")

:::example
En el triángulo $ABC$, $AH$ es una altura, $E$ está en el interior de $AH$ y satisface $AE:EH=2:3$ y $[ABC]=50$. Calcular $[EBC]$.

Como $AH=AE+EH$, la razón $AE:EH=2:3$ da $EH/AH=3/5$. Por la proposición de base común, $[EBC]/[ABC]=EH/AH=3/5$. Por tanto, $[EBC]=(3/5)\cdot50=30$. La razón $AE/AH=2/5$ usa el tramo equivocado: la altura desde $E$ hasta $BC$ es $EH$.
:::

![Triángulo ABC con altura AH y E entre A y H](figuras/areas-y-razones-alturas.svg "La altura desde E termina en H")

:::mistake
Confundir la distancia entre dos vértices con la altura de uno de ellos. La altura se mide desde el vértice hasta la recta de la base: en la figura, la altura correspondiente a $E$ es $EH$.
:::

### Una escala en dos direcciones

![Triángulo ABC con DE paralela a BC y alturas AK y AH](figuras/areas-y-razones-semejantes.svg "El triángulo ADE es una copia a escala de ABC")

En la figura, $D$ y $E$ son puntos interiores de $AB$ y $AC$, y $DE$ es paralela a $BC$. El pie de la perpendicular desde $A$ a $BC$ es $H$, y esa perpendicular corta a $DE$ en $K$. La figura muestra un caso particular; el argumento siguiente vale para cualquier razón $k$ entre $0$ y $1$, siempre que el pie $H$ esté en el interior del lado $BC$ elegido.

:::proposition Área y escala
Sea $ABC$ un triángulo cuyo pie de altura $H$ desde $A$ está en el interior de $BC$. Sean $D$ y $E$ puntos interiores de $AB$ y $AC$, con $DE\parallel BC$. Si $AD/AB=k$, entonces $[ADE]/[ABC]=k^2$.
:::

:::proof
Por la semejanza producida por la paralela, $ADE\sim ABC$, de modo que $DE/BC=AD/AB=k$. Las rectas $DE$ y $BC$ son paralelas, así que $AK$ también es perpendicular a $DE$. Los triángulos $ADK$ y $ABH$ tienen ángulos rectos en $K$ y $H$, respectivamente, y tienen igual ángulo en $A$: las semirrectas $AD$ y $AB$ coinciden, y también coinciden $AK$ y $AH$. Por el criterio AA son semejantes; por tanto, $AK/AH=AD/AB=k$.

Con bases $DE$ y $BC$, las alturas son $AK$ y $AH$. Al dividir sus fórmulas de área obtenemos $[ADE]/[ABC]=(DE/BC)(AK/AH)=k\cdot k=k^2$.
:::

El exponente dos aparece al multiplicar dos razones iguales: una para la base y otra para la altura.

:::tip
Cuando dos áreas parecen difíciles de comparar, buscar primero una base común o dos bases sobre una misma recta. Después revisar si las alturas son iguales o si se pueden comparar con semejanza.
:::

## Agregados culturales

- Arquímedes encontró el área de un segmento de parábola comparándola con un triángulo adecuado: el área del segmento es cuatro tercios del área de ese triángulo. Su razonamiento usa una sucesión de triángulos cada vez menores.
- En julio de 1960 se celebró la segunda Olimpiada Internacional de Matemáticas en Sinaia, Rumania. Participaron $39$ estudiantes de cinco países.
- Marte tiene aproximadamente la mitad del diámetro terrestre. Según la NASA, su superficie tiene un área cercana a la de toda la tierra firme de nuestro planeta.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Conviene identificar una base y la altura correspondiente de cada triángulo antes de comparar sus áreas.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

En estos problemas la razón buscada se obtiene reuniendo varias comparaciones; puede ser útil expresar las áreas parciales en función de una sola.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problem = (code, titulo, enunciado, difficulty = 'basico') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })
const problems = [
  exercise('G29','Dos bases',String.raw`En el triángulo $ABC$, el punto $D$ está en el interior de $BC$ y $BD:DC=1:2$. Si el área de $ABC$ es $36$, calcular el área de $ABD$.`,['Los dos triángulos tienen la misma altura respecto de sus bases sobre $BC$.']),
  exercise('G30','Punto medio y área',String.raw`En el triángulo $ABC$, $M$ es el punto medio de $BC$. Si el área de $ABM$ es $14$, calcular el área de $ABC$.`,['Comparar las bases $BM$ y $MC$.']),
  exercise('G31','Altura partida',String.raw`En el triángulo $ABC$, $AH$ es una altura y $E$ está en el interior de $AH$, con $AE:EH=1:3$. Si el área de $ABC$ es $40$, calcular el área de $EBC$.`,['La altura desde $E$ hasta la recta $BC$ es $EH$.']),
  exercise('G32','Escala y área',String.raw`En un triángulo $ABC$ con altura $AH$ interior, $D$ y $E$ son los puntos medios de $AB$ y $AC$, y $DE\parallel BC$. Si el área de $ABC$ es $32$, calcular el área de $ADE$.`,['Comparar la razón de los lados correspondientes con la razón de las áreas.']),
  problem('G33','Una base dividida',String.raw`En el triángulo $ABC$, $D$ está en el interior de $BC$, $BD:DC=3:4$ y el área de $ABD$ es $21$. Calcular el área de $ABC$.`),
  problem('G34','Dos puntos en una base',String.raw`En el triángulo $ABC$, los puntos $D$ y $E$ están sobre $BC$ en el orden $B,D,E,C$ y $BD=DE=EC$. Si el área de $ABC$ es $63$, calcular el área de $ADE$.`),
  problem('G35','Dos medianas',String.raw`En el triángulo $ABC$, $M$ y $N$ son los puntos medios de $BC$ y $AC$. Demostrar que los triángulos $ABM$ y $ABN$ tienen la misma área.`),
  problem('G36','Razón y total',String.raw`En el triángulo $ABC$, $D$ está en el interior de $BC$ y el área de $ABD$ es el doble del área de $ADC$. Si $BC=15$, calcular $BD$ y $DC$.`),
  problem('G37','Dos divisiones',String.raw`En el triángulo $ABC$, $D$ es el punto medio de $BC$ y $E$ está en el interior de $AD$, con $AE:ED=2:1$. Si el área de $ABC$ es $72$, calcular las áreas de $BDE$ y $CDE$.`,'intermedio'),
  problem('G38','Un triángulo entre puntos medios',String.raw`En el triángulo $ABC$, los puntos $D$, $E$ y $F$ son los puntos medios de $AB$, $BC$ y $CA$, respectivamente. Determinar la razón entre el área de $DEF$ y la de $ABC$, y justificarla.`,'intermedio'),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-G29','TP-G30','TP-G31','TP-G32'], practice: ['TP-G05','TP-G06','TP-G33','TP-G34','TP-G35','TP-G36'], dificiles: ['TP-G37','TP-G38'] } } }
