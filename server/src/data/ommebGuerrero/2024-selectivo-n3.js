// 8a OMMEB Guerrero · Concurso Estatal Selectivo · Nivel 3 (2 de agosto de 2024).
// Transcrito de «Selectivo_N3___8aOMMEBGro__RESP.pdf».
export default {
  edicion: 8,
  year: '2024',
  etapa: 'Selectivo',
  nivel: 3,
  grados: '2º de secundaria',
  fecha: '2 de agosto de 2024',
  lugar: 'Chilpancingo de los Bravo, Gro.',
  duracionMinutos: 120,
  indicaciones: [
    'La duración del examen es de 2 horas.',
    'El uso de celulares, calculadoras, electrónicos, formularios y tablas no está permitido.',
    'Las figuras no están a escala, sólo son representativas.',
    'Parte A (problemas 1 a 12): los problemas 1 a 5 son de opción múltiple y los problemas 6 a 12 de respuesta corta.',
    'Parte B (problemas 13, 14 y 15): de redacción libre (se escribe la solución completa).',
  ],
  problemas: [
    {
      n: 1, area: 'Teoría de Números',
      enunciado: String.raw`Luis escribe todos los enteros positivos de 13 cifras de la forma $\overline{2024ABCDE2024}$ que son divisibles por 88. ¿Cuántos números escribió Luis?`,
      opciones: ['$0$', '$2024$', '$9090$', '$9091$', '$8181$'],
      respuesta: 'd',
    },
    {
      n: 2, area: 'Álgebra',
      enunciado: String.raw`Encuentra el entero positivo $A$ que satisface
$$A^2 = 4(2024) + 4(2022) + 4(2020) + \cdots + 4(4) + 4(2) + 1.$$`,
      opciones: ['$2021$', '$2023$', '$2025$', '$2027$', '$2029$'],
      respuesta: 'c',
    },
    {
      n: 3, area: 'Combinatoria',
      enunciado: String.raw`Hay 10 puntos en el plano de manera que exactamente 5 de ellos están en una línea y no existe otra línea que contenga 3 o más de los puntos. ¿Cuántos triángulos pueden dibujarse con vértices en estos puntos?`,
      opciones: ['$20$', '$50$', '$70$', '$60$', '$110$'],
      respuesta: 'e',
    },
    {
      n: 4, area: 'Álgebra',
      enunciado: String.raw`Encuentra la expresión equivalente a
$$(2 + 3)\left(2^2 + 3^2\right)\left(2^4 + 3^4\right)\left(2^8 + 3^8\right)\left(2^{16} + 3^{16}\right)\left(2^{32} + 3^{32}\right)\left(2^{64} + 3^{64}\right).$$`,
      opciones: ['$3^{64} - 2^{64}$', '$3^{128} - 2^{128}$', '$3^{128} + 2^{128}$', '$2^{128} - 3^{128}$', '$3^{127} + 2^{127} + 2 \\cdot 3^{63} + 3 \\cdot 2^{63}$'],
      respuesta: 'b',
    },
    {
      n: 5, area: 'Geometría',
      enunciado: String.raw`Dibuja un rectángulo $ABCD$ con $AB = 6$ cm y $AD = 60$ cm, y prolonga el segmento $AB$ dos unidades más allá de $B$; nombra este extremo como el punto $E$. Sean $G$ el punto medio de $\overline{AD}$ y $F$ la intersección de $\overline{ED}$ y $\overline{BC}$. ¿Cuál es el área de $BFDG$?`,
      opciones: ['$315$ cm$^2$', '$225$ cm$^2$', '$90$ cm$^2$', '$180$ cm$^2$', '$135$ cm$^2$'],
      respuesta: 'e',
    },
    {
      n: 6, area: 'Combinatoria',
      enunciado: String.raw`Ismael lanza dos piezas de ajedrez (un caballo y un peón) al azar en el siguiente tablero de $3 \times 3$. Suponiendo que las piezas siempre caen en el tablero y además no caen en la misma casilla, ¿en cuántas configuraciones el peón no es atacado por el caballo?

Nota: Un caballo ataca en forma de “L” formada por cuatro casillas. En el ejemplo se muestra una configuración donde el peón sí es atacado por el caballo.`,
      figuras: [{ archivo: '2024-selectivo-n3-p06.png', alt: 'Tablero de 3 por 3 con un peón en la casilla de en medio de la fila de arriba y un caballo en la esquina inferior derecha.' }],
      respuesta: '56',
    },
    {
      n: 7, area: 'Combinatoria',
      enunciado: String.raw`El grupo 2°A y el grupo 2°B de una secundaria participaron con 5 estudiantes cada uno para el concurso de selección de escolta. Una escolta está formada por 6 integrantes. ¿De cuántas maneras se puede formar la escolta de modo que por lo menos un estudiante de cada grupo pertenezca a ella?`,
      respuesta: '210',
    },
    {
      n: 8, area: 'Teoría de Números',
      enunciado: String.raw`En este año, 2024, Miguelito cumplió tantos años como la suma de los valores de las cifras del año de su nacimiento. ¿Qué edad tiene Miguelito?`,
      respuesta: '4 años',
    },
    {
      n: 9, area: 'Geometría',
      enunciado: String.raw`Sea $\triangle ABC$ un triángulo isósceles tal que $BC = AC$ y $\angle ACB = 40^\circ$. La circunferencia de diámetro $BC$ corta a los lados $AC$ y $AB$ en $D$ y $E$, respectivamente. Sea $F$ la intersección de $CE$ con $BD$. Encuentra el valor del ángulo $\angle BFC$.`,
      respuesta: '$110^\\circ$',
    },
    {
      n: 10, area: 'Álgebra',
      enunciado: String.raw`Sebas estuvo de vacaciones durante algunos días y observó que:

• llovió 7 veces, por la mañana o por la tarde;
• cuando llovió por la tarde, por la mañana el cielo estaba despejado;
• hubo cinco tardes despejadas;
• hubo seis mañanas despejadas.

Entonces, ¿cuántos días estuvo de vacaciones Sebas?`,
      respuesta: '9',
    },
    {
      n: 11, area: 'Combinatoria',
      enunciado: String.raw`Sobre una circunferencia hay 2024 puntos azules y 1 punto rojo. Paulina cuenta el número de polígonos convexos que se pueden dibujar uniendo sólo vértices azules. Luis cuenta el número de polígonos convexos que incluyen el punto rojo entre sus vértices. ¿Cuál es la diferencia entre la cantidad que obtuvo Paulina y la cantidad de Luis?`,
      respuesta: '$\\dbinom{2024}{2}$',
    },
    {
      n: 12, area: 'Geometría',
      enunciado: String.raw`Sean $AB$ el diámetro de una circunferencia con centro $O$ de radio 5 y $BC$ una cuerda con longitud 8. Coloca un punto $D$ en la recta tangente a la circunferencia en el punto $B$ tal que $OD \perp BC$ en el punto $F$. Dado que $OD$ interseca a la circunferencia en el punto $E$, donde $E$ está entre $D$ y $O$, y $\angle AEC = \angle ODB$, encuentre la longitud de $DE$.`,
      respuesta: '$\\dfrac{10}{3}$',
    },
    {
      n: 13, area: 'Teoría de Números',
      enunciado: String.raw`Si el número de nueve dígitos $\overline{2024AA324}$ es divisible por 7, encuentra todos los valores posibles para $A$.`,
      respuesta: '$A = 0$ o $A = 7$',
      solucion: String.raw`Solución 1. Podemos escribir
$$\overline{2024AA324} = 2024 \times 10^5 + 11000A + 324.$$
Por el criterio de divisibilidad por 7 (quitar la última cifra y restar su doble), debemos tener que el número
$$\overline{2024AA32} - 4 \times 2 = \overline{2024AA32} - 8 = \overline{2024AA24}$$
sea divisible por 7. Nuevamente, por el criterio de divisibilidad por 7, la siguiente expresión
$$\overline{2024AA2} - 4 \times 2 = 2024 \times 10^3 + 110A + 2 - 8 = 2024 \times 1000 + 110A - 6$$
debe ser múltiplo de 7. Sabiendo que $2023 = 7 \times 289$ y $1001 = 7 \times 143$ son múltiplos de 7, podemos ver lo anterior como
$$2024 \times 1000 + 110A - 6 = (2023 + 1)(1001 - 1) + 110A - 6 = \underbrace{(2023 \times 1001 - 2023 + 1001 - 7)}_{\text{divisible por 7}} + 110A.$$
De modo que $110A$ debe ser divisible por 7; esto pasa si y sólo si $A$ es un dígito divisible por 7, lo que deja como opciones $A = 0$ y $A = 7$.

Solución 2. Escribimos de nuevo $\overline{2024AA324} = 2024 \times 10^5 + 11000A + 324$ y calculamos las congruencias módulo 7 de cada factor y término:
$$2024 = 2023 + 1 \equiv 1 \pmod 7,$$
$$10^5 \equiv 3^5 = 9 \times 9 \times 3 \equiv 2 \times 2 \times 3 \equiv -2 \pmod 7,$$
$$11000A = 11 \times (1001 - 1) \times A \equiv 4 \times (-1) \times A \equiv -4A \pmod 7,$$
$$324 = 280 + 42 + 2 \equiv 2 \pmod 7.$$
En consecuencia,
$$\overline{2024AA324} \equiv 1 \times (-2) - 4A + 2 \equiv -4A \pmod 7.$$
Y $-4A \equiv 0 \pmod 7$ si y sólo si $A$ es un dígito divisible por 7, lo que deja como opciones $A = 0$ y $A = 7$.`,
    },
    {
      n: 14, area: 'Geometría',
      enunciado: String.raw`En la circunferencia dada, el diámetro $\overline{EB}$ es paralelo a $\overline{DC}$, y $\overline{AB}$ es paralelo a $\overline{ED}$. Los ángulos $\angle AEB$ y $\angle ABE$ están en la proporción $4 : 5$. ¿Cuál es la medida del ángulo $\angle BCD$?`,
      figuras: [{ archivo: '2024-selectivo-n3-p14.png', alt: 'Circunferencia con el diámetro horizontal EB. Arriba está el punto A, unido con E y con B; abajo están D y C, con DC paralelo a EB, y se trazan ED y CB.' }],
      respuesta: '$130^\\circ$',
      solucion: String.raw`Solución 1. Notemos que $\angle EAB = \angle EDB = 90^\circ$, al ser ángulos inscritos que abarcan un diámetro.

Dado que $\angle AEB$ y $\angle ABE$ están en proporción $4 : 5$, denotemos $\angle AEB = 4\alpha$ y $\angle ABE = 5\alpha$. Al ser $\triangle ABE$ un triángulo rectángulo, tenemos $4\alpha + 5\alpha = 90^\circ$, de modo que $\alpha = 10^\circ$ y obtenemos
$$\angle AEB = 40^\circ \quad \text{y} \quad \angle ABE = 50^\circ.$$
Al ser $AB \parallel ED$, se tiene que $ABDE$ es un rectángulo, llegando a que
$$\angle DBE = 40^\circ \quad \text{y} \quad \angle DEB = 50^\circ.$$
Ahora bien, puesto que $BCDE$ es cíclico, se tiene
$$\angle DEB + \angle DCB = 180^\circ \implies 50^\circ + \angle DCB = 180^\circ \implies \angle DCB = 130^\circ.$$

Solución 2. Como en la Solución 1, $\angle EAB = \angle EDB = 90^\circ$, $\angle AEB = 4\alpha$ y $\angle ABE = 5\alpha$. Sean $\angle DCB = x$, $\angle DBC = \beta$ y $\angle CDB = \gamma$. Al usar que $AB \parallel ED$ obtenemos que $\angle DEB = 5\alpha$ y $\angle EBD = 4\alpha$.

La suma de los ángulos interiores del pentágono $ABCDE$ es $180^\circ \times (5 - 2) = 540^\circ$. Usando los ángulos inscritos:
$$90^\circ + 5\alpha + 4\alpha + \beta + x + \gamma + 90^\circ + 5\alpha + 4\alpha = 540^\circ \implies 18\alpha + (\beta + \gamma) + x = 360^\circ.$$
Como $\beta$ y $\gamma$ son ángulos inscritos que abarcan los arcos $DC$ y $CB$, su suma es la mitad del arco $DB$, que es igual a $\angle DEB = 5\alpha$. Entonces
$$18\alpha + 5\alpha + x = 360^\circ \implies x = 360^\circ - 23\alpha.$$
Al ser $\triangle ABE$ un triángulo rectángulo, $4\alpha + 5\alpha = 90^\circ$, de modo que $\alpha = 10^\circ$ y, por lo tanto,
$$x = 360^\circ - 230^\circ = 130^\circ.$$`,
    },
    {
      n: 15, area: 'Combinatoria',
      enunciado: String.raw`Se coloca un triángulo o un círculo en cada uno de los nueve cuadrados de una cuadrícula de $3 \times 3$. En la figura de la derecha se muestra un ejemplo con tres triángulos en una misma línea. ¿Cuántas configuraciones tendrán tres triángulos en una misma línea y tres círculos en otra misma línea?`,
      figuras: [{ archivo: '2024-selectivo-n3-p15.png', alt: 'Cuadrícula de 3 por 3. Columna izquierda: tres triángulos. Columna central: círculo, círculo, triángulo. Columna derecha: triángulo, triángulo, círculo.' }],
      respuesta: '84',
      solucion: String.raw`En primer lugar, tengamos en cuenta que no puede existir una línea diagonal, ya que la segunda línea se vería obligada a ser diagonal también, y eso es imposible (las dos diagonales comparten la casilla central).

Los casos en los que las líneas son horizontales y verticales son simétricos, por lo que calculamos para las verticales y multiplicamos por 2 al final.

Caso I: dos líneas de triángulos y una línea de círculos. Elegimos las dos líneas que serán de triángulos: $\binom{3}{2} = 3$; queda determinada la línea de círculos. Lo mismo pasa si son dos líneas de círculos y una de triángulos. Por tanto, hay $3 \cdot 2 = 6$ maneras en este caso.

Caso II: una línea de círculos, una línea de triángulos y una línea de figuras distintas. Elegimos las dos líneas que tendrán figuras iguales, $\binom{3}{2}$, y multiplicamos por 2 para decidir cuál es de círculos y cuál de triángulos. La tercera línea puede tener círculos o triángulos en cada casilla, $2^3$ maneras, pero quitamos 2 opciones (todos círculos o todos triángulos), así que hay $2^3 - 2$ disposiciones. Por lo tanto, hay
$$\binom{3}{2} \times 2 \times \left(2^3 - 2\right) = 36 \text{ maneras en este caso}.$$
Ambos casos nos dan $36 + 6 = 42$ opciones. Finalmente, las maneras totales son $42 \times 2 = 84$.

(La hoja oficial trae además otra solución que cuenta primero $\binom{3}{2} \times 2 \times 2^3 = 48$ arreglos y resta los 6 que se cuentan dos veces: $48 - 6 = 42$ por orientación.)`,
    },
  ],
}
