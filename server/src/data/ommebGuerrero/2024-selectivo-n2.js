// 8a OMMEB Guerrero · Concurso Estatal Selectivo · Nivel 2 (2 de agosto de 2024).
// Transcrito de «Selectivo_N2___8aOMMEBGro__RESP.pdf» (el zip no trae la versión
// sin respuestas de este examen).
export default {
  edicion: 8,
  year: '2024',
  etapa: 'Selectivo',
  nivel: 2,
  grados: '6º de primaria y 1º de secundaria',
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
      n: 1, area: 'Combinatoria',
      enunciado: String.raw`En una carrera compiten 5 corredores, etiquetados $A$, $B$, $C$, $D$ y $E$. Si sacamos todos los posibles resultados de la carrera, ¿en cuántos de ellos el competidor $A$ quedó en mejor lugar que el competidor $B$? (Considera que nunca hay empates.)`,
      opciones: ['$5$', '$24$', '$64$', '$120$', '$256$'],
      respuesta: null,
      nota: 'La hoja oficial de respuestas no marca ninguna opción para este problema.',
    },
    {
      n: 2, area: 'Álgebra',
      enunciado: String.raw`A lo largo de un camino rural hay 41 postes separados uniformemente (la distancia entre uno y otro es la misma). Nando, el ñandú, da 44 pasos para llegar de un poste a otro. En cambio, Trus, el avestruz, sólo da 12 pasos para hacer lo mismo. Si la distancia entre el primer y último poste es de 5280 pies, ¿cuál es la diferencia, en pies, de un paso de Nando y un paso de Trus?`,
      opciones: ['6 pies', '8 pies', '10 pies', '11 pies', '15 pies'],
      respuesta: 'b',
    },
    {
      n: 3, area: 'Combinatoria',
      enunciado: String.raw`En una colonia se sabe lo siguiente acerca del uso de redes sociales: 42 personas usan Facebook, 30 usan Instagram, y 28 usan Twitter. 10 personas usan tanto Facebook como Instagram, 5 personas Facebook y Twitter, y 8 Twitter e Instagram. Las tres redes son usadas por 3 personas. Por lo tanto, el número de personas que exclusivamente usan Twitter son:`,
      opciones: ['$18$', '$30$', '$15$', '$28$', '$12$'],
      respuesta: 'a',
    },
    {
      n: 4, area: 'Teoría de Números',
      enunciado: String.raw`Luis escribe todos los enteros positivos de 13 cifras de la forma $\overline{2024ABCDE2024}$ que son divisibles por 11. ¿Cuántos números escribió Luis?`,
      opciones: ['$0$', '$2024$', '$9090$', '$9091$', '$8181$'],
      respuesta: 'd',
    },
    {
      n: 5, area: 'Geometría',
      enunciado: String.raw`Los triángulos $\triangle ABC$ y $\triangle AED$ son semejantes, con
$$\overline{AD} = 2 \cdot \overline{AC} \quad \text{y} \quad \overline{BE} = \overline{EH}.$$
Además tenemos las siguientes medidas:
$$\overline{AC} = \overline{HG} = 4 \text{ cm} \quad \text{y} \quad \overline{AB} = \overline{DF} = 5 \text{ cm}.$$
¿Cuál es el área de $\triangle EFG$?`,
      figuras: [{ archivo: '2024-selectivo-n2-p05.png', alt: 'Triángulos rectángulos ABC (verde) y AED (azul) con ángulo recto en A; B y E están sobre la recta vertical por A, y C y D sobre la horizontal. H está arriba de E con HG horizontal, y F está arriba de D con DF vertical. El triángulo EFG está sombreado de rojo.' }],
      opciones: ['$10$ cm$^2$', '$20$ cm$^2$', '$30$ cm$^2$', '$40$ cm$^2$', '$50$ cm$^2$'],
      respuesta: 'c',
    },
    {
      n: 6, area: 'Álgebra',
      enunciado: String.raw`El primer término de una sucesión aritmética es 7 y el último es 79. Sabemos que si sumamos todos sus términos obtenemos 817. ¿Cuántos términos tiene esa sucesión?

Nota: Una sucesión aritmética es una secuencia de números en la cual entre cada dos números consecutivos hay una misma diferencia.`,
      respuesta: '19',
    },
    {
      n: 7, area: 'Teoría de Números',
      enunciado: String.raw`Tres números primos se elevaron al cuadrado para posteriormente sumar sus resultados. Si se obtuvo 5070 de la suma de sus cuadrados, ¿cuánto obtengo al multiplicar esos 3 números primos?`,
      respuesta: '710',
    },
    {
      n: 8, area: 'Álgebra',
      enunciado: String.raw`Paulina estuvo de vacaciones durante algunos días y observó que:

• llovió 7 veces, por la mañana o por la tarde;
• cuando llovió por la tarde, por la mañana el cielo estaba despejado;
• hubo cinco tardes despejadas;
• hubo seis mañanas despejadas.

Entonces, ¿cuántos días estuvo de vacaciones Paulina?`,
      respuesta: '9',
    },
    {
      n: 9, area: 'Geometría',
      enunciado: String.raw`En el triángulo $ABC$, se coloca un punto $H$ en $AB$ tal que $CH$ es la altura de $ABC$. La longitud de $CH$ es igual a la mitad del lado $AB$. Si $\angle BAC = 45^\circ$, halla $\angle ABC$.`,
      respuesta: '$45^\\circ$',
    },
    {
      n: 10, area: 'Combinatoria',
      enunciado: String.raw`Estefania lanza dos fichas al azar en el siguiente tablero de $3 \times 3$. Suponiendo que las fichas siempre caen en el tablero y además no caen en la misma casilla, ¿de cuántas maneras pueden quedar en dos casillas no adyacentes?

Nota: Dos casillas son adyacentes cuando comparten un lado en común, tal y como se muestra en la figura.`,
      figuras: [{ archivo: '2024-selectivo-n1-p09.png', alt: 'Tablero de 3 por 3 con dos fichas rojas en las casillas de en medio de la fila de arriba y de la fila central: son casillas adyacentes.' }],
      respuesta: '24',
    },
    {
      n: 11, area: 'Teoría de Números',
      enunciado: String.raw`Encuentra el cuadrado perfecto de 4 dígitos tal que el dígito de los millares sea igual al de las centenas y el dígito de las decenas sea igual al de las unidades.`,
      respuesta: '7744',
    },
    {
      n: 12, area: 'Geometría',
      enunciado: String.raw`Sea $\triangle ABC$ un triángulo isósceles tal que $BC = AC$ y $\angle ACB = 40^\circ$. La circunferencia de diámetro $BC$ corta a los lados $AC$ y $AB$ en $D$ y $E$, respectivamente. Sea $F$ la intersección de $CE$ con $BD$. Encuentra el valor del ángulo $\angle BFC$.`,
      respuesta: '$110^\\circ$',
    },
    {
      n: 13, area: 'Combinatoria',
      enunciado: String.raw`Al Congreso de Matemáticas asistieron 9 delegados repartidos de la siguiente forma: 2 delegados de Veracruz, 3 delegados de Sinaloa y 4 delegados de Guerrero. Durante la sesión inaugural, tres de los delegados se quedaron dormidos. Calcula cuántas formas distintas hay tales que exactamente dos de los que se durmieron sean del mismo estado.`,
      respuesta: '55',
      solucion: String.raw`Procedamos por casos de acuerdo con los diferentes estados.

• Si los dos que se durmieron son de Veracruz, entonces hay 7 opciones para elegir al tercero que se durmió. Este caso nos da 7 opciones.
• Si los dos son de Sinaloa, tenemos $\binom{3}{2} = 3$ opciones para elegirlos. Para el tercero tendremos 6 opciones. Este caso nos da $3 \times 6 = 18$ opciones.
• Si los dos son de Guerrero, entonces hay $\binom{4}{2} = 6$ formas de elegirlos. Para el tercero hay 5 opciones. Este caso nos da $6 \times 5 = 30$ opciones.

Por lo tanto, el total de formas es $7 + 18 + 30 = 55$.`,
    },
    {
      n: 14, area: 'Geometría',
      enunciado: String.raw`En un cuadrado de lado $L$ están inscritos cuatro círculos tangentes entre sí, los cuales tienen sus centros en la diagonal del cuadrado. Si el radio de cada círculo es 1 cm, ¿cuál es el valor de $L$?`,
      figuras: [
        { archivo: '2024-selectivo-n2-p14.png', alt: 'Cuadrado de lado L con cuatro círculos iguales en fila sobre una diagonal, cada uno tangente al siguiente; el primero toca dos lados del cuadrado en una esquina y el último toca los otros dos en la esquina opuesta.' },
        { archivo: '2024-selectivo-n2-p14-sol.png', alt: 'El cuadrado PQRS con la diagonal SQ en rojo y los centros A, B, C y D de los círculos sobre ella; desde A se trazan los radios de longitud 1 a los dos lados cercanos.', en: 'solucion' },
      ],
      respuesta: '$L = \\sqrt{22 + 6\\sqrt{2}} = 2 + 3\\sqrt{2}$ cm',
      solucion: String.raw`Nombremos $A$, $B$, $C$ y $D$ a los centros de las circunferencias y $PQRS$ al cuadrado, tal y como se muestra en la figura de la solución. Tracemos la diagonal $SQ$. Basta con calcular la medida de esta diagonal para después aplicar el Teorema de Pitágoras a $PQS$.

Notemos que $SA = DQ$ y $AD = 6 \times 1 = 6$ cm, por lo que
$$SQ = SA + AD + DQ = 6 + 2 \times SA.$$
Para el valor de $SA$ trazamos los radios que unen $A$ con los puntos de tangencia a los lados del cuadrado. Por el Teorema de Pitágoras,
$$SA = \sqrt{1^2 + 1^2} = \sqrt{2} \implies SQ = 6 + 2\sqrt{2}.$$
Por lo tanto, por el Teorema de Pitágoras aplicado al triángulo rectángulo $PQS$,
$$L^2 + L^2 = \left(6 + 2\sqrt{2}\right)^2 \implies 2L^2 = 44 + 24\sqrt{2} \implies L^2 = 22 + 12\sqrt{2},$$
$$L = \sqrt{22 + 12\sqrt{2}} = 2 + 3\sqrt{2}.$$`,
      nota: String.raw`En la solución oficial aparece $2L^2 = 44 + 12\sqrt{2}$ y $L = \sqrt{22 + 6\sqrt{2}}$; como $(6 + 2\sqrt{2})^2 = 44 + 24\sqrt{2}$, el valor correcto bajo la raíz es $22 + 12\sqrt{2}$, cuya raíz es $2 + 3\sqrt{2}$ (la respuesta final coincide).`,
    },
    {
      n: 15, area: 'Teoría de Números',
      enunciado: String.raw`Encuentra cuántos números de 4 cifras cumplen que:

• Es divisible entre 77.
• Tiene 16 divisores.
• Deja residuo 2 al dividir entre 4.`,
      respuesta: '14',
      solucion: String.raw`Los números dejan residuo 2 al ser divididos por 4; esto quiere decir que son pares, pero no múltiplos de 4 (por ejemplo, 2, 6, 10, …); esto implica que tienen al 2 una vez como factor en su descomposición en primos. Dado que son múltiplos de 77, son múltiplos de 7 y de 11.

Usando la fórmula de la cantidad de divisores positivos de un entero positivo, para que tenga 16 divisores debemos expresar al 16 como
$$16 = (1 + 1)(1 + 1)(1 + 1)(1 + 1) = (1 + 1)(1 + 1)(3 + 1) = (1 + 1)(3 + 1)(1 + 1).$$
Por lo que los números son de la forma
$$2^1 \times 7^a \times 11^b \times p^c,$$
donde $a$, $b$ y $c$ son enteros no negativos y $p$ es un primo distinto de 2, 7 y 11. Usando las descomposiciones del 16 anteriores, los candidatos son
$$2^1 \times 7^1 \times 11^1 \times p^1, \qquad 2^1 \times 7^1 \times 11^3, \qquad 2^1 \times 7^3 \times 11^1.$$
Pero $2 \times 7 \times 11^3 = 18634$ no es de cuatro dígitos; por su parte, $2 \times 7^3 \times 11 = 7546$ sí es de cuatro dígitos, así que llevamos un número.

Por último, para que $2 \times 7 \times 11 \times p$ sea de cuatro dígitos, los posibles valores de $p$ son los primos desde 13 hasta 61, es decir, 13 primos (13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59 y 61).

Por lo tanto, hay 14 números que satisfacen las tres condiciones del problema.`,
    },
  ],
}
