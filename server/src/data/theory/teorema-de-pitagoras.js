const pathSlug = 'teorema-de-pitagoras'
const collection = pathSlug
const summary = 'Relacionar los lados de un triángulo rectángulo para calcular distancias, reconocer ángulos rectos y justificar la relación mediante semejanza.'
const content = String.raw`## Preámbulo: El tamaño de una pantalla

![Pantalla rectangular de proporción 4 a 3 con su diagonal d](figuras/teorema-de-pitagoras-pantalla-cuatro-tres.svg "Una pantalla y su diagonal") ![Pantalla rectangular de proporción 16 a 9 con una diagonal d de la misma longitud](figuras/teorema-de-pitagoras-pantalla-dieciseis-nueve.svg "Otra pantalla con la misma diagonal")

Una pantalla se anuncia como de $10$ pulgadas. ¿Basta ese dato para saber si su ancho es menor que $8.5$ pulgadas? La medida anunciada de una pantalla suele referirse a su diagonal: el segmento que une dos esquinas opuestas, sin contar el marco.

Las dos pantallas de la figura tienen diagonales de la misma longitud, pero sus formas son distintas. Para decidir si una de ellas cabe en un espacio, necesitamos relacionar su ancho, su altura y su diagonal. Medir una de esas longitudes puede ser difícil; una relación entre las tres nos permitirá calcularla a partir de las otras dos.

## Teoría

### Una relación entre tres lados

![Triángulo ABC rectángulo en C, con catetos a y b e hipotenusa c](figuras/teorema-de-pitagoras-triangulo.svg "Los catetos se unen en el ángulo recto")

En un **triángulo rectángulo**, dos lados forman un ángulo de $90^\circ$: son los *catetos*. El lado opuesto a ese ángulo es la *hipotenusa*. En la figura, $BC=a$ y $CA=b$ son los catetos, mientras que $AB=c$ es la hipotenusa. Estas letras nombran longitudes positivas.

![Triángulo ABC rectángulo en C con la altura CH perpendicular a la hipotenusa AB](figuras/teorema-de-pitagoras-altura.svg "La altura CH permite comparar tres triángulos")

:::theorem Teorema de Pitágoras
En todo triángulo rectángulo con catetos de longitudes $a$ y $b$ e hipotenusa de longitud $c$,
$$a^2+b^2=c^2.$$
:::

:::proof
Usaremos que los ángulos interiores de un triángulo suman $180^\circ$ y el criterio ángulo-ángulo de semejanza. En el triángulo $ABC$, rectángulo en $C$, tracemos la perpendicular desde $C$ a la recta $AB$; sea $H$ su punto de intersección con esa recta.

Los ángulos $A$ y $B$ son agudos: suman $90^\circ$ y cada uno es positivo. El punto $H$ está en el interior de $AB$. Para justificarlo, si $H=A$ o $H=B$, el ángulo correspondiente de $ABC$ sería recto. Si $H$ estuviera más allá de $A$, el ángulo $CAH$ sería suplementario de $CAB$ y mediría más de $90^\circ$; el triángulo $ACH$ tendría además un ángulo recto en $H$, lo que contradice que sus ángulos suman $180^\circ$. Si $H$ estuviera más allá de $B$, el ángulo $CBH$ sería suplementario de $CBA$ y mediría más de $90^\circ$; el triángulo $BCH$ tendría además un ángulo recto en $H$, la misma contradicción.

Como $AH$ está sobre $AB$, $\angle CAH=\angle CAB$; además, $\angle AHC=\angle ACB=90^\circ$. Por AA, $AHC\sim ACB$, en ese orden. Sus lados correspondientes dan $AH/AC=AC/AB$. Al multiplicar ambos lados por $AC\cdot AB$, obtenemos $AH\cdot AB=AC^2$.

Para el otro triángulo, las semirrectas $BH$ y $BA$ coinciden, así que $\angle CBH=\angle CBA$; también $\angle BHC=\angle BCA=90^\circ$. Por AA, $BHC\sim BCA$, y sus lados correspondientes dan $BH/BC=BC/BA$. Al multiplicar ambos lados por $BC\cdot BA$, obtenemos $BH\cdot BA=BC^2$.

Al sumar las dos igualdades resulta $AC^2+BC^2=AB(AH+BH)$. Como $H$ está en el interior de $AB$, $AH+BH=AB$. Sustituir esta igualdad y las longitudes $BC=a$, $CA=b$ y $AB=c$ da $a^2+b^2=c^2$.
:::

![Pantalla rectangular de proporción 4 a 3 con diagonal d](figuras/teorema-de-pitagoras-pantalla-cuatro-tres.svg "La diagonal divide el rectángulo en dos triángulos rectángulos")

:::example
Una pantalla rectangular mide $8$ pulgadas de ancho y $6$ de alto. ¿Cuánto mide su diagonal?

La diagonal es la hipotenusa del triángulo rectángulo formado con el ancho y el alto. Si su longitud es $d$, Pitágoras da $d^2=8^2+6^2=64+36=100$. Una longitud es positiva, por lo que $d=10$ pulgadas. Conocer la diagonal sin el ancho o el alto no bastaría para recuperar ambos: distintas formas pueden compartir la misma diagonal.
:::

:::try En un triángulo rectángulo, los catetos miden $5$ y $12$. ¿Cuánto mide la hipotenusa?
Si $c$ es la hipotenusa, $c^2=5^2+12^2=25+144=169$. Como $c>0$, se obtiene $c=13$.
:::

Si falta un cateto en lugar de la hipotenusa, se despeja primero su cuadrado y después se toma la raíz positiva.

:::mistake
Aplicar la fórmula a cualquier triángulo o elegir como hipotenusa el lado que parece inclinado. Primero hay que justificar que existe un ángulo recto y localizar el lado opuesto a él. Después se sabe qué longitud corresponde a $c$; girar el dibujo no cambia esa correspondencia.
:::

### Reconocer un ángulo recto

La igualdad también permite reconocer un triángulo rectángulo a partir de sus lados. Pero esta dirección necesita su propia justificación: una afirmación no demuestra automáticamente su converso.

![Dos triángulos ABC y A prima B prima C prima con lados correspondientes iguales; el segundo tiene ángulo recto en A prima](figuras/teorema-de-pitagoras-converso.svg "Dos triángulos con lados correspondientes iguales")

:::theorem Converso del teorema
Si un triángulo tiene lados de longitudes positivas $a$, $b$ y $c$ y cumple $a^2+b^2=c^2$, entonces el ángulo opuesto al lado de longitud $c$ es recto.
:::

:::proof
Sea $ABC$ el triángulo dado, con $AB=a$, $AC=b$ y $BC=c$. Construyamos un triángulo $A'B'C'$ rectángulo en $A'$ con $A'B'=a$ y $A'C'=b$; llamemos $d$ a la longitud de $B'C'$.

Por Pitágoras, $d^2=a^2+b^2$. La hipótesis dice que $a^2+b^2=c^2$, por lo que $d^2=c^2$. Como $d$ y $c$ son positivos, $d=c$. Los tres lados de $ABC$ y $A'B'C'$ son respectivamente iguales, así que los triángulos son congruentes por LLL. El ángulo $A$ corresponde al ángulo recto $A'$; por tanto, $A$ es recto y está opuesto al lado de longitud $c$.
:::

:::tip
Para comprobar si tres longitudes forman un triángulo rectángulo, comparar primero el cuadrado de la mayor con la suma de los cuadrados de las otras dos. Si son iguales, el converso justifica el ángulo recto.
:::

### Crear el triángulo útil

![Triángulo isósceles ABC con M punto medio de BC y altura AM](figuras/teorema-de-pitagoras-isosceles.svg "La mediana divide el triángulo isósceles en dos triángulos rectángulos")

:::example
Un triángulo isósceles $ABC$ tiene $AB=AC=10$ y $BC=12$. Calcular su área.

Sea $M$ el punto medio de $BC$. La mediana $AM$ es perpendicular a $BC$ por la propiedad del isósceles demostrada en la lección de congruencia. Así, $BM=6$ y $ABM$ es rectángulo en $M$.

Si $AM=h$, Pitágoras da $h^2+6^2=10^2$. Al restar $36$ de ambos lados, $h^2=64$; como $h>0$, $h=8$. El área de $ABC$ es $BC\cdot AM/2=12\cdot8/2=48$.
:::

## Agregados culturales

- La tablilla babilónica conocida como YBC 7289, conservada en Yale, data aproximadamente de $1800$ a $1600$ a. C. Contiene una aproximación de $\sqrt2$ escrita en base $60$, mucho antes de que existiera la notación decimal actual.
- La cuarta Olimpiada Internacional de Matemáticas se celebró en julio de 1962 en České Budějovice, entonces parte de Checoslovaquia. Participaron $56$ estudiantes de siete países.
- La misión Gaia de la Agencia Espacial Europea fue lanzada en 2013. Entre sus mediciones está el paralaje, un cambio aparente de posición que ayuda a estimar la distancia a las estrellas.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Antes de calcular, conviene señalar el ángulo recto o justificarlo con el converso e identificar qué lado queda enfrente de él.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Aquí la relación de Pitágoras debe combinarse con una condición adicional o con las semejanzas que aparecen al trazar la altura.

[[collection:${collection}:dificiles]]`
const exercise=(code,titulo,enunciado,hints)=>({codigo:`TP-${code}`,pathSlug,titulo,enunciado,hint:hints.join('\n\n'),difficulty:'basico'})
const problem=(code,titulo,enunciado,difficulty='basico')=>({codigo:`TP-${code}`,pathSlug,titulo,enunciado,difficulty})
const problems=[
  exercise('G39','Dos catetos',String.raw`Un triángulo rectángulo tiene catetos de longitudes $6$ y $8$. Calcular la longitud de su hipotenusa.`,['Aplicar Pitágoras y recordar que una longitud es positiva.']),
  exercise('G40','Un cateto',String.raw`Un triángulo rectángulo tiene hipotenusa de longitud $13$ y un cateto de longitud $5$. Calcular el otro cateto.`,['Aislar el cuadrado del cateto desconocido.']),
  exercise('G41','Comprobar un ángulo',String.raw`Un triángulo tiene lados de longitudes $6$, $8$ y $11$. Determinar si es rectángulo y justificar la respuesta.`,['Comparar el cuadrado del lado mayor con la suma de los cuadrados de los otros dos.']),
  exercise('G42','Diagonal de un cuadrado',String.raw`Un cuadrado tiene lado de longitud $5$. Calcular la longitud de su diagonal.`,['La diagonal forma un triángulo rectángulo con dos lados del cuadrado.']),
  problem('G43','Diagonal larga',String.raw`Un rectángulo tiene lados de longitudes $7$ y $24$. Calcular la longitud de su diagonal.`),
  problem('G44','Reconocer un triángulo rectángulo',String.raw`Un triángulo tiene lados de longitudes $8$, $15$ y $17$. Demostrar que es rectángulo.`),
  problem('G45','Área de un isósceles',String.raw`Un triángulo isósceles tiene lados iguales de longitud $5$ y base de longitud $8$. Calcular su área y justificar la construcción utilizada.`),
  problem('G46','Rectángulo de perímetro dado',String.raw`Un rectángulo tiene perímetro $34$ y diagonal de longitud $13$. Determinar las longitudes de sus lados.`),
  problem('G47','Tres lados consecutivos',String.raw`Un triángulo rectángulo tiene lados cuyas longitudes son tres enteros positivos consecutivos. Determinar esas longitudes y demostrar que no hay otras.`,'intermedio'),
  problem('G48','Altura sobre la hipotenusa',String.raw`En un triángulo $ABC$ rectángulo en $C$, se cumple $AC=6$ y $BC=8$. Sea $H$ el pie de la perpendicular desde $C$ a $AB$. Calcular $AH$, $HB$ y $CH$.`,'intermedio'),
]
export default {pathSlug,summary,content,problems,collections:{[collection]:{ejercicios:['TP-G39','TP-G40','TP-G41','TP-G42'],practice:['TP-G07','TP-G08','TP-G43','TP-G44','TP-G45','TP-G46'],dificiles:['TP-G47','TP-G48']}}}
