const pathSlug = 'semejanza-y-congruencia'
const collection = pathSlug
const summary = 'Comparar triángulos mediante correspondencias entre sus vértices para deducir longitudes y ángulos, y justificar cuándo coinciden en forma o también en tamaño.'

const content = String.raw`## Preámbulo: Una imagen en la pantalla

![Tres versiones de una carita: la original, una ampliada y otra estirada hacia los lados](figuras/semejanza-y-congruencia-pantalla.svg "Una carita ampliada y otra estirada")

¿Por qué una carita dibujada en la pantalla se ve igual, solo más grande, cuando se amplía, pero parece más ancha si se estira hacia los lados? En ambos casos cambia de tamaño, aunque no parece cambiar de la misma manera. La diferencia se nota en la carita, pero necesitamos algo más preciso que una impresión para explicarla.

![Un triángulo ABC y otro DEF más grande y girado](figuras/semejanza-y-congruencia-giro.svg "Dos triángulos en posiciones y tamaños distintos")

La misma duda aparece con las figuras geométricas. En la imagen, el triángulo $DEF$ es más grande que $ABC$ y está girado. ¿Cómo saber si conserva la forma de $ABC$ o si solo se le parece a simple vista?

Una posibilidad sería comparar todos sus lados y ángulos, pero en un problema quizá solo conozcamos algunos de ellos. Necesitamos reconocer qué partes corresponden y qué datos bastan para decidir si dos triángulos tienen la misma forma. Si además tienen el mismo tamaño, la comparación nos llevará a la congruencia.

## Teoría

### Correspondencia y escala

![Dos triángulos rectángulos ABC y DEF con vértices correspondientes A y D, B y E, C y F](figuras/semejanza-y-congruencia-correspondencia.svg "Correspondencia entre los vértices de dos triángulos")

El orden de los vértices indica la correspondencia: en $ABC$ y $DEF$, $A$ corresponde a $D$, $B$ a $E$ y $C$ a $F$. Así, $AB$ corresponde a $DE$, $BC$ a $EF$ y $CA$ a $FD$.

![Dos triángulos ABC y DEF con lados correspondientes](figuras/semejanza-y-congruencia-correspondencia.svg "Los vértices se nombran en el orden de la correspondencia")

:::definition Semejanza de triángulos
Dos triángulos no degenerados $ABC$ y $DEF$ son semejantes, en ese orden, si sus ángulos correspondientes son iguales y existe un número $k>0$ tal que $DE=k\,AB$, $EF=k\,BC$ y $FD=k\,CA$. Escribimos $ABC\sim DEF$; $k$ es la razón de semejanza del primero al segundo.
:::

![Dos triángulos ABC y DEF comparados por sus lados y ángulos](figuras/semejanza-y-congruencia-correspondencia.svg "La congruencia exige también el mismo tamaño")

Los triángulos son **congruentes** cuando sus lados y ángulos correspondientes son iguales. En particular, una semejanza de razón $1$ es una congruencia. Para reconocerla no hace falta medir las seis partes: usaremos como criterio conocido lado-ángulo-lado (LAL): dos triángulos son congruentes si dos lados y el ángulo comprendido entre ellos son respectivamente iguales.

![Dos triángulos rectángulos ABC y DEF, con DE igual a 120 y AB igual a 80](figuras/semejanza-y-congruencia-correspondencia.svg "Correspondencia de lados para calcular una longitud")

:::example
Los triángulos $ABC$ y $DEF$ son semejantes en ese orden. Si $AB=80$, $DE=120$ y $BC=100$, determinar $EF$.

Como $AB$ corresponde a $DE$, la razón del primero al segundo es $k=120/80=3/2$. El lado $BC$ corresponde a $EF$, de modo que $EF=(3/2)\cdot100=150$. La razón inversa, $2/3$, serviría para pasar del segundo triángulo al primero, no para esta operación.
:::

:::try Si $ABC\sim DEF$, $AB=6$ y $DE=4$, ¿cuál es la razón del primero al segundo?
La razón es $4/6=2/3$. Una razón menor que $1$ indica que los lados del segundo son menores que sus correspondientes del primero.
:::

### Reconocer triángulos semejantes

![Dos triángulos ABC y DEF con vértices correspondientes](figuras/semejanza-y-congruencia-correspondencia.svg "La correspondencia permite comparar ángulos")

Usaremos como resultado previo el criterio ángulo-ángulo (AA): si dos ángulos de un triángulo son respectivamente iguales a dos de otro, los triángulos son semejantes con esa correspondencia. El tercer par de ángulos también es igual porque la suma de los ángulos interiores de cada triángulo es $180^\circ$.

![Triángulo ABC con D sobre AB y E sobre AC, y DE paralela a BC](figuras/semejanza-y-congruencia-paralela.svg "La transversal AB corta a las paralelas DE y BC")

También usaremos que los ángulos correspondientes entre paralelas son iguales.

![Triángulo ABC con D en AB, E en AC y DE paralela a BC](figuras/semejanza-y-congruencia-paralela.svg "Una paralela a un lado del triángulo")

:::proposition Paralela a un lado
En un triángulo $ABC$, sean $D$ y $E$ puntos interiores de los segmentos $AB$ y $AC$, respectivamente. Si $DE$ es paralelo a $BC$, entonces $ADE\sim ABC$ y
$$\frac{AD}{AB}=\frac{AE}{AC}=\frac{DE}{BC}.$$
:::

:::proof
Los triángulos $ADE$ y $ABC$ comparten el ángulo en $A$: las semirrectas $AD$ y $AB$ coinciden, al igual que $AE$ y $AC$. Como $DE$ es paralela a $BC$ y la recta $AB$ las corta, los ángulos correspondientes $ADE$ y $ABC$ son iguales. Por AA, $ADE\sim ABC$ con correspondencia $A\leftrightarrow A$, $D\leftrightarrow B$, $E\leftrightarrow C$. La definición de semejanza da la igualdad de las tres razones escritas.
:::

![Triángulo ABC con D sobre AB y E sobre AC, y segmento DE paralelo a BC](figuras/semejanza-y-congruencia-paralela.svg "El triángulo pequeño se compara con el completo")

:::example
En el triángulo $ABC$, $D$ está en el interior de $AB$, $E$ en el interior de $AC$ y $DE\parallel BC$. Si $AD=4$, $DB=2$ y $AE=6$, calcular $EC$.

La paralela permite comparar $ADE$ con $ABC$, no con una de las piezas sobrantes. Como $AB=AD+DB=6$, la proposición da $4/6=6/AC$. Al multiplicar por $6AC$ obtenemos $4AC=36$, así que $AC=9$. Finalmente, $EC=AC-AE=9-6=3$.
:::

![Triángulo ABC con un segmento DE paralelo al lado BC](figuras/semejanza-y-congruencia-paralela.svg "Lados completos y partes de un triángulo")

:::mistake
Comparar lados que no corresponden. La igualdad $AD/AB=AE/AC$ compara cada lado del triángulo pequeño con el lado completo correspondiente. Por ejemplo, sustituir $AB$ por $DB$ sin justificar otra relación cambia la razón y puede dar un resultado falso.
:::

### Usar congruencia para demostrar

![Triángulo isósceles ABC con M punto medio de BC y segmento AM](figuras/semejanza-y-congruencia-mediana.svg "La mediana de un triángulo isósceles")

En la figura, dos triángulos comparten un lado. Si además conocemos dos igualdades de lados, podemos usar un criterio de congruencia y después trasladar una igualdad de ángulos. Tomaremos como resultado previo el criterio lado-lado-lado (LLL): tres parejas de lados respectivamente iguales aseguran congruencia.

:::proposition Mediana de un isósceles
En un triángulo $ABC$ con $AB=AC$, sea $M$ el punto medio de $BC$. Entonces $AM$ es perpendicular a $BC$.
:::

:::proof
Por hipótesis $AB=AC$. Como $M$ es punto medio, $BM=CM$; además, $AM=AM$ porque es el mismo segmento en ambos triángulos. Por LLL, $ABM$ y $ACM$ son congruentes, con $B$ correspondiente a $C$, por lo que $\angle BMA=\angle AMC$.

Las semirrectas $MB$ y $MC$ son opuestas porque $M$ está en el interior de $BC$. Por tanto, $\angle BMA+\angle AMC=180^\circ$. Al sustituir $\angle AMC$ por $\angle BMA$, obtenemos $2\angle BMA=180^\circ$; dividir entre $2$ da $\angle BMA=90^\circ$. Por definición, las rectas $AM$ y $BC$ son perpendiculares.
:::

La demostración transforma igualdades de lados en una igualdad de ángulos y después usa la medida de un ángulo llano.

:::tip
Antes de aplicar un criterio, escribir la correspondencia de los vértices y señalar qué datos justifican cada igualdad. Después se pueden usar los lados o ángulos correspondientes que requiere la conclusión.
:::

## Agregados culturales

- En los *Elementos* de Euclides, el libro VI estudia semejanza y proporciones. Entre sus resultados está la relación entre las áreas de figuras semejantes y el cuadrado de la razón de sus lados.
- La primera Olimpiada Internacional de Matemáticas se celebró en Brașov, Rumania, en julio de 1959. Participaron $52$ estudiantes de siete países.
- En una guía de 1997, la NASA propone estimar el diámetro de la Luna comparando su tamaño aparente con el de un disco cercano. La actividad usa una proporción entre diámetros y distancias.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Conviene fijar primero el orden de los vértices correspondientes y justificar el criterio antes de escribir una proporción o una igualdad de ángulos.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

La dificultad está en encontrar los triángulos adecuados y justificar que la correspondencia elegida conserva las partes necesarias.

[[collection:${collection}:dificiles]]`

const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problem = (code, titulo, enunciado, difficulty = 'basico') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })
const problems = [
  exercise('G19', 'Lados correspondientes', String.raw`Los triángulos $ABC$ y $DEF$ son semejantes en ese orden. Si $AB=5$, $DE=15$ y $BC=7$, calcular $EF$.`, ['Identificar la razón del primer triángulo al segundo.']),
  exercise('G20', 'Escala menor', String.raw`Los triángulos $PQR$ y $XYZ$ son semejantes en ese orden. Si $PQ=12$, $XY=8$ y $PR=9$, calcular $XZ$.`, ['Usar la misma razón para las dos parejas de lados correspondientes.']),
  exercise('G21', 'Correspondencia de vértices', String.raw`Se sabe que $ABC\sim FDE$. Si $AB=4$, $BC=6$ y $FD=10$, calcular $DE$.`, ['El orden indica que $B$ corresponde a $D$.']),
  exercise('G22', 'Ángulos de triángulos congruentes', String.raw`Los triángulos $ABC$ y $DEF$ son congruentes en ese orden. Si $\angle A=40^\circ$ y $\angle B=65^\circ$, calcular $\angle F$.`, [String.raw`La suma de los ángulos interiores de un triángulo es $180^\circ$.`]),
  problem('G23', 'Un segmento paralelo', String.raw`En el triángulo $ABC$, los puntos $D$ y $E$ están en los interiores de $AB$ y $AC$, respectivamente, y $DE\parallel BC$. Si $AD=3$, $AB=8$ y $BC=20$, calcular $DE$.`),
  problem('G24', 'Triángulo isósceles y bisectriz', String.raw`En el triángulo $ABC$, $AB=AC$. La bisectriz del ángulo $A$ corta a $BC$ en $D$. Demostrar que $BD=DC$.`),
  problem('G25', 'Puntos medios y paralela', String.raw`En el triángulo $ABC$, $D$ y $E$ son los puntos medios de $AB$ y $AC$. Demostrar que $DE\parallel BC$.`),
  problem('G26', 'Una razón en la paralela', String.raw`En el triángulo $ABC$, los puntos $D$ y $E$ están en los interiores de $AB$ y $AC$, y $DE\parallel BC$. Si $AD:DB=2:3$ y $EC=9$, calcular $AE$.`),
  problem('G27', 'Bisectriz y lados', String.raw`En el triángulo $ABC$, la bisectriz del ángulo $A$ corta a $BC$ en $D$. Por $C$ se traza la paralela a $AD$, que corta a la recta $AB$ en $E$, con $A$ entre $B$ y $E$. Demostrar que $BD/DC=AB/AC$.`, 'intermedio'),
  problem('G28', 'Dos paralelas interiores', String.raw`En el triángulo $ABC$, $D$ y $E$ son puntos interiores de $AB$ y $AC$, con $DE\parallel BC$. Las rectas $BE$ y $CD$ se cortan en $P$. Demostrar que $PB/PE=PC/PD$.`, 'intermedio'),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-G19','TP-G20','TP-G21','TP-G22'], practice: ['TP-G03','TP-G04','TP-G23','TP-G24','TP-G25','TP-G26'], dificiles: ['TP-G27','TP-G28'] } } }
