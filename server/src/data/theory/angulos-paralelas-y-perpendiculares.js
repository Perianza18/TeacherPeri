// «Ángulos, paralelas y perpendiculares» in the lesson format of the theory
// page. Original TeacherPeri text. Figures: public/figuras/angulos-*.svg.
// Exercises and problems live in the banco; the lesson only points to them.

const pathSlug = 'angulos-paralelas-y-perpendiculares'
const collection = 'angulos-y-paralelas'

const summary = 'Calcular ángulos desconocidos con una cadena de igualdades justificadas y usar esas mismas relaciones para demostrar que dos rectas son paralelas.'

const content = String.raw`## Preámbulo: Dibujar no es demostrar

![Las rectas paralelas r y s; entre ellas, el punto P está unido con A en r y con B en s. PA forma 35 grados con r, PB forma 40 grados con s y el ángulo en P se llama x.](figuras/angulos-codo.svg "Las rectas $r$ y $s$ son paralelas y $P$ está entre ellas.")

En la figura, las rectas $r$ y $s$ son paralelas y el punto $P$ está entre ellas. El segmento $PA$ forma un ángulo de $35^\circ$ con $r$, y $PB$ forma uno de $40^\circ$ con $s$. Queremos saber cuánto mide $x=\angle APB$.

Un transportador marca casi $75^\circ$, que parece ser $35^\circ+40^\circ$. Es una buena sospecha, pero no una respuesta: todo trazo tiene errores, y una medición no dice si la suma funcionaría con otros datos.

Para tener certeza hacen falta relaciones entre ángulos que valgan siempre. Esta lección las construye y termina con el camino inverso: usar ángulos para demostrar que dos rectas son paralelas.

## Teoría

### Ángulos alrededor de un punto

Un punto $O$ de una recta la divide en dos semirrectas con origen en $O$ y sentidos opuestos. El ángulo que forman esas dos semirrectas se llama **ángulo llano** y mide $180^\circ$. Cuando dos rectas se cortan en $O$ forman cuatro ángulos. Si dos de ellos comparten un lado, sus otros dos lados son semirrectas opuestas de una misma recta; por eso, juntos forman un ángulo llano y suman $180^\circ$.

:::definition Suplementarios y opuestos por el vértice
Dos ángulos son **suplementarios** si suman $180^\circ$. Dos de los cuatro ángulos que forman dos rectas al cortarse son **opuestos por el vértice** si los lados de uno son las prolongaciones de los lados del otro.
:::

![Dos rectas se cortan en O y forman los ángulos α, β, γ y δ, en ese orden; α y γ están resaltados.](figuras/angulos-opuestos.svg "$\alpha$ y $\gamma$ son opuestos por el vértice, igual que $\beta$ y $\delta$.")

En la figura, $\alpha$ y $\beta$ juntos forman un ángulo llano, igual que $\beta$ y $\gamma$. Eso basta para comparar dos ángulos opuestos.

:::proposition Ángulos opuestos por el vértice
Los ángulos opuestos por el vértice son iguales.
:::

:::proof
Los ángulos $\alpha$ y $\beta$ comparten un lado, así que juntos forman un ángulo llano: $\alpha+\beta=180^\circ$. Por la misma razón, $\beta$ y $\gamma$ cumplen $\beta+\gamma=180^\circ$. Al restar la segunda igualdad de la primera, $\beta$ se cancela:
$$(\alpha+\beta)-(\beta+\gamma)=180^\circ-180^\circ,\quad\text{es decir,}\quad \alpha-\gamma=0,$$
y por lo tanto $\alpha=\gamma$.

Para la otra pareja se repite el argumento, ahora con $\gamma$ como el ángulo común. Los ángulos $\beta$ y $\gamma$ comparten un lado, igual que $\gamma$ y $\delta$, así que $\beta+\gamma=180^\circ$ y $\gamma+\delta=180^\circ$. Al restar la segunda igualdad de la primera, $\gamma$ se cancela y queda $\beta-\delta=0$, es decir, $\beta=\delta$.
:::

Dos rectas son **perpendiculares** si al cortarse forman un ángulo de $90^\circ$; se escribe $r\perp s$.

:::try Dos rectas se cortan y uno de los cuatro ángulos mide $90^\circ$. ¿Cuánto miden los otros tres?
También $90^\circ$. Los dos que comparten un lado con él miden $180^\circ-90^\circ$, y el opuesto mide lo mismo que el original.
:::

### Paralelas cortadas por una transversal

Dos rectas del plano son **paralelas** si no se cortan; se escribe $r\parallel s$. Una **transversal** $t$ corta a $r$ en $A$ y a $s$ en $B$, y en cada cruce forma cuatro ángulos. Un ángulo es **interior** si queda en la franja entre $r$ y $s$, y **exterior** si queda fuera.

:::definition Pares de ángulos con una transversal
Un ángulo con vértice $A$ y otro con vértice $B$ son
- **correspondientes** si están del mismo lado de $t$ y uno es interior y el otro exterior;
- **alternos internos** si ambos son interiores y están en lados opuestos de $t$;
- **interiores del mismo lado** si ambos son interiores y están del mismo lado de $t$.
:::

![Rectas paralelas r y s cortadas por la transversal t en A y B; dos ángulos correspondientes, a la derecha de t y debajo de cada recta, marcados con α.](figuras/angulos-correspondientes.svg "Correspondientes") ![Las mismas rectas; dos ángulos alternos internos, entre r y s y en lados opuestos de t, marcados con α.](figuras/angulos-alternos-internos.svg "Alternos internos") ![Las mismas rectas; dos ángulos interiores del mismo lado, entre r y s y a la derecha de t, marcados con α y β.](figuras/angulos-interiores-mismo-lado.svg "Interiores del mismo lado")

Estos nombres describen posiciones, no medidas. Para relacionar medidas aceptaremos sin demostración una forma del postulado de las paralelas de Euclides: **por un punto que no está en una recta pasa exactamente una paralela a ella, y si dos paralelas son cortadas por una transversal, sus ángulos correspondientes son iguales.**

:::theorem Ángulos entre paralelas
Si $r\parallel s$ y la transversal $t$ las corta, entonces los ángulos correspondientes son iguales, los alternos internos son iguales y los interiores del mismo lado suman $180^\circ$.
:::

:::proof
Lo primero es el hecho aceptado.

Para los alternos internos, sean $\alpha$, en $A$, y $\alpha'$, en $B$, dos ángulos alternos internos, y sea $\varphi$ el opuesto por el vértice de $\alpha$. Por la proposición anterior, $\varphi=\alpha$. Además, $\varphi$ es exterior y está del mismo lado de $t$ que $\alpha'$, que es interior; por lo tanto, $\varphi$ y $\alpha'$ son correspondientes y, por el hecho aceptado, $\varphi=\alpha'$. De $\varphi=\alpha$ y $\varphi=\alpha'$ se sigue que $\alpha=\alpha'$.

Para los interiores del mismo lado, sean $\alpha$, en $A$, y $\beta$, en $B$, dos ángulos interiores del mismo lado de $t$, y sea $\psi$ el ángulo en $A$ que comparte con $\alpha$ el lado contenido en $r$. Como $\alpha$ y $\psi$ comparten un lado, juntos forman un ángulo llano, así que $\psi=180^\circ-\alpha$. Además, $\psi$ está del mismo lado de $t$ que $\alpha$ (y, por lo tanto, que $\beta$) pero fuera de la franja, así que es exterior; entonces $\psi$ y $\beta$ son correspondientes y $\psi=\beta$. Igualando las dos expresiones de $\psi$ se obtiene $\beta=180^\circ-\alpha$, es decir, $\alpha+\beta=180^\circ$.
:::

Con este teorema ya se puede responder la pregunta del preámbulo, aunque el ángulo $x$ no forme ningún par de la lista con los datos.

:::example
En la figura del preámbulo, $r\parallel s$, el segmento $PA$ forma un ángulo de $35^\circ$ con $r$ y el segmento $PB$ forma un ángulo de $40^\circ$ con $s$. Demostrar que $\angle APB=75^\circ$.

La suma sospechada sugiere partir $\angle APB$ en una pieza ligada a $r$ y otra ligada a $s$, trazando por $P$ la paralela $\ell$ a $r$.

![La figura del preámbulo con la recta ℓ, paralela a r y a s, trazada por P; ℓ parte el ángulo en P en una pieza de 35 grados y otra de 40 grados.](figuras/angulos-codo-solucion.svg "La paralela $\ell$ por $P$ parte el ángulo en dos piezas.")

La recta $\ell$ también es paralela a $s$: si la cortara en un punto $Q$, por $Q$ pasarían dos paralelas distintas a $r$, la recta $s$ y la recta $\ell$.

Con la transversal $PA$, el ángulo de $35^\circ$ en $A$ y el ángulo entre $PA$ y $\ell$ en $P$ son alternos internos, así que este mide $35^\circ$. Con la transversal $PB$ y las paralelas $s$ y $\ell$, el ángulo de $40^\circ$ en $B$ y el ángulo entre $PB$ y $\ell$ en $P$ también son alternos internos, así que este mide $40^\circ$. Como $A$ y $B$ quedan en lados opuestos de $\ell$, esas son las dos piezas de $\angle APB$, que mide $75^\circ$. Con esta disposición, el ángulo en $P$ es siempre la suma de los dos ángulos dados.
:::

:::tip
Cuando el vértice de un ángulo está entre dos paralelas, conviene trazar por ese vértice una tercera paralela. Parte el ángulo en piezas que sí forman pares conocidos con los datos.
:::

En figuras con muchas rectas, lo difícil suele ser reconocer los pares.

:::mistake
Reconocer los pares por la forma de una letra: una «F» para los correspondientes, una «Z» para los alternos internos. Si la figura está girada o tiene más rectas, la forma engaña. Antes hay que fijar la transversal, las dos rectas que corta y de qué lado de la transversal y de la franja está cada ángulo.
:::

### Ángulos de un triángulo

La idea del ejemplo, trazar una paralela por un vértice, también responde la pregunta más conocida sobre ángulos.

:::theorem Suma de los ángulos de un triángulo
Si $\alpha$, $\beta$ y $\gamma$ son los ángulos del triángulo $ABC$ en $A$, $B$ y $C$, entonces $\alpha+\beta+\gamma=180^\circ$.
:::

:::proof
![Triángulo ABC con la recta ℓ por A paralela a BC; junto a A, a la izquierda y a la derecha de α, aparecen copias de β y de γ.](figuras/angulos-suma-triangulo.svg "La paralela $\ell$ por $A$ lleva $\beta$ y $\gamma$ hasta el vértice $A$.")

Sea $\ell$ la paralela a $BC$ por $A$. Con la transversal $AB$, el ángulo entre $\ell$ y $AB$ del lado de $B$ es alterno interno de $\beta$, así que mide $\beta$; con la transversal $AC$, el ángulo entre $\ell$ y $AC$ del lado de $C$ mide $\gamma$. Esos dos ángulos y $\alpha$ quedan uno junto a otro y forman el ángulo llano de $\ell$, así que $\alpha+\beta+\gamma=180^\circ$.
:::

Una consecuencia inmediata limita cuántos ángulos grandes puede tener un triángulo.

:::try ¿Puede un triángulo tener dos ángulos mayores que $90^\circ$?
No: esos dos ya sumarían más de $180^\circ$, y el tercero tendría que medir menos que cero.
:::

Al prolongar un lado de un triángulo aparece un **ángulo exterior**, que forma un ángulo llano con el ángulo interior de ese vértice.

:::corollary Ángulo exterior
Si se prolonga el lado $BC$ del triángulo $ABC$ más allá de $C$, el ángulo exterior en $C$ mide $\alpha+\beta$, la suma de los ángulos interiores en $A$ y en $B$.

![Triángulo ABC con el lado BC prolongado hasta D; el ángulo exterior en C, entre CD y CA, está resaltado y mide α + β.](figuras/angulos-exterior.svg "El ángulo exterior en $C$ es la suma de los interiores en $A$ y en $B$.")
:::

En efecto, el ángulo exterior forma un ángulo llano con $\gamma$, así que mide $180^\circ-\gamma$, que por el teorema es $\alpha+\beta$.

:::tip
Al rastrear ángulos, conviene escribir junto a cada igualdad la propiedad que la justifica: opuestos por el vértice, alternos internos, suma del triángulo. Un paso sin nombre suele ser un paso que solo se «ve» en el dibujo.
:::

### Demostrar que dos rectas son paralelas

Muchos problemas piden lo contrario de lo que hemos hecho: demostrar que dos rectas son paralelas. Las relaciones del teorema también sirven en ese sentido.

:::theorem Criterio de paralelismo
Sea $t$ una transversal que corta a las rectas $r$ y $s$. Si un par de ángulos correspondientes son iguales, o un par de alternos internos son iguales, o un par de interiores del mismo lado suman $180^\circ$, entonces $r\parallel s$.
:::

:::proof
Supongamos que dos ángulos correspondientes, con vértices $A$ en $r$ y $B$ en $s$, miden $\theta$. Sea $s'$ la paralela a $r$ por $B$. Por el teorema anterior, $s'$ forma con $t$, en esa misma posición, un ángulo de $\theta$. Como en esa posición solo una recta por $B$ forma con $t$ un ángulo $\theta$, se tiene $s'=s$, y entonces $s\parallel r$.

Falta ver que cada una de las otras dos condiciones da un par de correspondientes iguales; con eso, el párrafo anterior concluye.

Si dos alternos internos, $\alpha$ en $A$ y $\alpha'$ en $B$, son iguales, sea $\varphi$ el opuesto por el vértice de $\alpha$. Como en la demostración anterior, $\varphi$ y $\alpha'$ son correspondientes, y $\varphi=\alpha=\alpha'$: la primera igualdad porque son opuestos por el vértice y la segunda por hipótesis.

Si dos interiores del mismo lado, $\alpha$ en $A$ y $\beta$ en $B$, suman $180^\circ$, sea $\psi$ el ángulo en $A$ que comparte con $\alpha$ el lado contenido en $r$. Como en la demostración anterior, $\psi$ y $\beta$ son correspondientes, y $\psi=180^\circ-\alpha=\beta$: la primera igualdad porque $\alpha$ y $\psi$ juntos forman un ángulo llano y la segunda por hipótesis.
:::

Un caso particular aparece con frecuencia.

:::corollary Perpendiculares a una misma recta
Dos rectas perpendiculares a una misma recta son paralelas entre sí.

Idea: con esa recta como transversal, los dos ángulos correspondientes miden $90^\circ$.
:::

:::example
En el cuadrilátero convexo $ABCD$, $\angle A=115^\circ$, $\angle B=65^\circ$ y $\angle C=115^\circ$. Demostrar que $AD\parallel BC$ y que $AB\parallel CD$.

![Cuadrilátero convexo ABCD con 115 grados en A, 65 grados en B y 115 grados en C; los lados opuestos están marcados como paralelos.](figuras/angulos-cuadrilatero.svg "Los ángulos en $A$ y en $B$ son interiores del mismo lado de la transversal $AB$.")

Que el dibujo parezca un paralelogramo no demuestra nada; cada par de lados necesita una transversal. Para $AD$ y $BC$ es $AB$. Como el cuadrilátero es convexo, $C$ y $D$ están del mismo lado de la recta $AB$, así que $\angle DAB$ y $\angle ABC$ son interiores del mismo lado. Suman $180^\circ$, y el criterio da $AD\parallel BC$. Con la transversal $BC$, los ángulos $\angle ABC$ y $\angle BCD$ también suman $180^\circ$, así que $AB\parallel CD$.
:::

## Agregados culturales

- Durante más de dos mil años se intentó, sin éxito, deducir el postulado de las paralelas de los demás axiomas de Euclides. Nikolái Lobachevski en 1829 y János Bolyai en 1832 publicaron, cada uno por su cuenta, una geometría donde por un punto fuera de una recta pasan varias paralelas. En ella, los ángulos de un triángulo suman menos de $180^\circ$.
- Las abejas melíferas indican con un ángulo dónde está el alimento. Sobre el panal vertical, la exploradora recorre una línea recta sacudiendo el abdomen, y el ángulo entre esa línea y la vertical es el ángulo entre el alimento y el Sol. Karl von Frisch descifró esta danza y en 1973 compartió el Premio Nobel de Fisiología o Medicina por sus estudios del comportamiento animal.
- Hacia el año 240 a. C., Eratóstenes estimó el tamaño de la Tierra suponiendo que los rayos del Sol llegan paralelos. Un mediodía de verano, en Siena (hoy Asuán, Egipto) un palo vertical no daba sombra, y en Alejandría la sombra marcaba unos $7.2^\circ$, un cincuentavo de vuelta. Por ángulos alternos internos, ese es también el ángulo entre las dos ciudades visto desde el centro de la Tierra.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Antes de calcular conviene marcar las paralelas, las transversales y los triángulos, y justificar cada igualdad. Cuando se pide demostrar, un caso con números no basta.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Aquí los datos no forman de inmediato un par conocido. La dificultad está en elegir qué recta auxiliar trazar o qué triángulo mirar, no en las cuentas.

[[collection:${collection}:dificiles]]`

const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problem = (code, titulo, enunciado, difficulty = 'basico') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })

const problems = [
  exercise('G09', 'Ángulos adyacentes', String.raw`Dos rectas se cortan y forman cuatro ángulos. Uno de ellos mide $40^\circ$ más que uno de los ángulos con los que comparte un lado. Calcular los cuatro ángulos.`, [
    String.raw`Dos ángulos que comparten un lado, formados por dos rectas que se cortan, suman $180^\circ$.`,
    String.raw`Si el menor de los dos mide $x$, el otro mide $x+40^\circ$. Los ángulos restantes son opuestos por el vértice a estos dos.`,
  ]),
  exercise('G10', 'Interiores del mismo lado', String.raw`Una transversal corta a dos rectas paralelas. Dos ángulos interiores del mismo lado de la transversal miden $(2x+20)^\circ$ y $(3x+10)^\circ$. Calcular $x$ y la medida de cada uno de los ocho ángulos que se forman.`, [
    String.raw`Los ángulos interiores del mismo lado no son iguales: suman $180^\circ$.`,
    String.raw`Cada uno de los ocho ángulos es igual a uno de los dos ángulos dados o suplementario de él.`,
  ]),
  exercise('G11', 'Un ángulo exterior de 120°', String.raw`En un triángulo, el ángulo exterior en uno de los vértices mide $120^\circ$, y uno de los dos ángulos interiores de los otros vértices mide el triple del otro. Calcular los tres ángulos interiores del triángulo.`, [
    String.raw`Un ángulo exterior es igual a la suma de los dos ángulos interiores de los otros vértices.`,
    String.raw`El ángulo interior del vértice del ángulo exterior forma con él un ángulo llano.`,
  ]),
  exercise('G12', 'Una paralela dentro del triángulo', String.raw`En el triángulo $ABC$, $\angle ABC=65^\circ$. Sobre los lados $AB$ y $AC$ se eligen puntos $M$ y $N$, distintos de los vértices, tales que $\angle AMN=65^\circ$. Demostrar que la recta $MN$ es paralela a $BC$.`, [
    String.raw`Identificar una transversal que corte a las rectas $MN$ y $BC$.`,
    String.raw`Los ángulos $\angle AMN$ y $\angle ABC$ ocupan la misma posición en $M$ y en $B$ respecto a la recta $AB$.`,
  ]),
  problem('G13', 'Ángulos de un polígono convexo', String.raw`Demostrar que la suma de los ángulos interiores de un polígono convexo de $n$ lados es $(n-2)\cdot180^\circ$. Calcular cuánto mide cada ángulo de un hexágono convexo cuyos seis ángulos son iguales.`),
  problem('G14', 'Dos bisectrices entre paralelas', String.raw`Dos rectas paralelas $r$ y $s$ son cortadas por una transversal en los puntos $A$, sobre $r$, y $B$, sobre $s$. Las bisectrices de los dos ángulos interiores que quedan de un mismo lado de la transversal se cortan en un punto $P$. Demostrar que $\angle APB=90^\circ$. (La bisectriz de un ángulo es la semirrecta que lo divide en dos ángulos iguales.)`),
  problem('G15', 'Dos perpendiculares desde un punto', String.raw`Sea $P$ un punto en el interior de un ángulo agudo $\angle XOY$ que mide $\theta$. Sean $M$ y $N$ los pies de las perpendiculares trazadas desde $P$ a las rectas $OX$ y $OY$, respectivamente. Demostrar que $\angle MPN=180^\circ-\theta$.`),
  problem('G16', 'El ángulo entre dos bisectrices', String.raw`En el triángulo $ABC$, las bisectrices de los ángulos $B$ y $C$ se cortan en el punto $I$. Calcular $\angle BIC$ cuando $\angle A=70^\circ$, y demostrar que en todo triángulo $\angle BIC=90^\circ+\tfrac12\angle A$.`),
  problem('G17', 'La estrella de cinco puntas', String.raw`Los puntos $A$, $B$, $C$, $D$ y $E$ son, en ese orden, los vértices de un pentágono convexo. Sus cinco diagonales $AC$, $CE$, $EB$, $BD$ y $DA$ forman una estrella cuyas puntas son $A$, $B$, $C$, $D$ y $E$. Demostrar que $\angle CAD+\angle DBE+\angle ECA+\angle ADB+\angle BEC=180^\circ$.`, 'intermedio'),
  problem('G18', 'Altura y bisectriz', String.raw`En el triángulo $ABC$ se cumple $\angle B>\angle C$. Sea $H$ el pie de la perpendicular trazada desde $A$ a la recta $BC$, y sea $D$ el punto donde la bisectriz del ángulo $A$ corta al lado $BC$. Demostrar que $\angle HAD=\tfrac12(\angle B-\angle C)$.`, 'intermedio'),
]

export default {
  pathSlug,
  summary,
  content,
  problems,
  collections: {
    [collection]: {
      ejercicios: ['TP-G09', 'TP-G10', 'TP-G11', 'TP-G12'],
      practice: ['TP-G01', 'TP-G02', 'TP-G13', 'TP-G14', 'TP-G15', 'TP-G16'],
      dificiles: ['TP-G17', 'TP-G18'],
    },
  },
}
