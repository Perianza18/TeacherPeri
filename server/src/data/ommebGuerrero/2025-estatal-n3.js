// 9a OMMEB Guerrero · Concurso Estatal · Nivel 3 (28 de junio de 2025).
// Transcrito de «E4-Estatal_N3_9aOMMEBGro (RESP).pdf».
export default {
  edicion: 9,
  year: '2025',
  etapa: 'Estatal',
  nivel: 3,
  grados: '2º de secundaria',
  fecha: '28 de junio de 2025',
  lugar: 'Acapulco de Juárez, Gro.',
  duracionMinutos: 150,
  indicaciones: [
    'La duración del examen es de 2 horas y media.',
    'El uso de celulares, calculadoras, electrónicos, formularios y tablas no está permitido.',
    'Las figuras no están a escala, sólo son representativas.',
    'En caso de que las respuestas a estos problemas no sean enteras, estas deben ser aproximadas a dos decimales tomando en cuenta π = 3.14.',
    'Problemas 1 a 5: opción múltiple. Problemas 6 a 13: respuesta corta. Problemas 14 y 15: de redacción (se escribe la solución completa).',
  ],
  problemas: [
    {
      n: 1, area: 'Teoría de Números',
      enunciado: String.raw`Al terminar su examen de manera completa, Pach notó algo curioso en sus respuestas: todos los resultados eran números enteros positivos de dos cifras, y cada uno cumplía que al sumarlo con el número formado al invertir sus dígitos se obtenía 132. ¿Cuántas preguntas tenía el examen que hizo Pach?`,
      opciones: ['$3$', '$4$', '$6$', '$7$', '$8$'],
      respuesta: 'd',
    },
    {
      n: 2, area: 'Teoría de Números',
      enunciado: String.raw`Un entero positivo es cargado si cumple que:

• Es múltiplo de 5.
• El producto de sus dígitos es 20.
• La suma de sus dígitos es 15.

¿Cuántos números cargados hay?`,
      opciones: ['$7$', '$18$', '$28$', '$35$', '$252$'],
      respuesta: 'd',
    },
    {
      n: 3, area: 'Combinatoria',
      enunciado: String.raw`Hay cuatro estudiantes acusadas de copiarse en el examen de matemáticas: Atenea, Bibiana, Cindi y Danna.

• Atenea dice que no copió.
• Bibiana dice que ni Atenea ni ella copiaron.
• Cindi dice que ni Bibiana ni ella copiaron.
• Danna dice que ni Atenea ni Bibiana copiaron.

De las cuatro estudiantes, sólo una está mintiendo, ¿quién es?`,
      opciones: ['Atenea', 'Bibiana', 'Cindi', 'Danna', 'No se puede saber'],
      respuesta: 'c',
    },
    {
      n: 4, area: 'Teoría de Números',
      enunciado: String.raw`¿Cuántos valores enteros de $n$ hay tales que
$$\frac{n^2 + 2n + 5}{n + 1}$$
sea un entero?`,
      opciones: ['$2$', '$3$', '$4$', '$5$', '$6$'],
      respuesta: 'e',
    },
    {
      n: 5, area: 'Combinatoria',
      enunciado: String.raw`¿Cuántas palabras distintas se pueden formar usando todas las letras de la palabra guerrero?

Nota: Las palabras no necesitan tener significado, sólo tener todas las letras. Por ejemplo, palabras como orrreegu y grerueor deben estar en tu conteo.`,
      opciones: ['$3360$', '$1120$', '$40320$', '$1680$', '$6720$'],
      respuesta: 'a',
    },
    {
      n: 6, area: 'Geometría',
      enunciado: String.raw`En la figura se muestran cinco triángulos con un ángulo de medida $\alpha$ y que comparten al menos un lado. Las medidas de algunos lados y ángulos están escritas. Si se sabe que $\alpha + \beta + \gamma = 180^\circ$, halla el valor del lado marcado con $x$.`,
      figuras: [{ archivo: '2025-estatal-n2-p09.png', alt: 'Cinco triángulos en abanico que comparten un vértice, cada uno con un ángulo $\\alpha$ en ese vértice. Lados marcados, de derecha a izquierda: 15 y 20, 40, 80, 160 y 320; el lado de la base del triángulo más grande es $x$. Algunos ángulos están marcados con $\\beta$ y $\\gamma$.' }],
      respuesta: '480',
    },
    {
      n: 7, area: 'Teoría de Números',
      enunciado: String.raw`Un número se considera toreado si:

• Tiene tres cifras,
• Termina en 2,
• Es múltiplo de 3.

¿Cuántos números toreados existen?`,
      respuesta: '30',
    },
    {
      n: 8, area: 'Combinatoria',
      enunciado: String.raw`Aurora tiene las siguientes tarjetas:
$$1,\ 1,\ 2,\ 2,\ 3,\ 3,\ 4,\ 4,\ 5,\ 5.$$
Quiere formar números de tres cifras sin repetir dígitos que estén juntos (por ejemplo, 112 no es válido, pero 121 sí). ¿Cuántos números distintos puede formar Aurora?`,
      respuesta: '80',
    },
    {
      n: 9, area: 'Teoría de Números',
      enunciado: String.raw`Un entero positivo se dice que es coqueto si es un múltiplo de 15 de seis cifras y es de la forma $\overline{A2025B}$, donde $A$ y $B$ son dígitos. ¿Cuál es la diferencia positiva entre el mayor y el menor número coqueto?`,
      respuesta: '799995',
    },
    {
      n: 10, area: 'Geometría',
      enunciado: String.raw`Sea $ABCD$ un rectángulo. Se elige un punto $Q$ sobre el lado $BC$ tal que se cumpla $\angle BAQ = \angle QAD$, y además $\angle QAC = 15^\circ$. Se marca el punto $O$ sobre la diagonal $AC$ tal que $AO = OC$. ¿Cuál es la medida del ángulo $\angle BOQ$?`,
      respuesta: '$75^\\circ$',
    },
    {
      n: 11, area: 'Combinatoria',
      enunciado: String.raw`Juanito vende naranjas y las distribuye en un arreglo cuadrado, luego coloca más naranjas encima del primer arreglo, justo en los espacios vacíos del piso anterior de naranjas. Sigue haciendo esto, hasta acomodar todas sus naranjas, formando una pirámide con una naranja en la cima. Él sabe que tiene más de 1100 pero menos de 1300 naranjas. ¿Cuántas naranjas tiene el arreglo de Juanito?`,
      respuesta: '1240',
    },
    {
      n: 12, area: 'Teoría de Números',
      enunciado: String.raw`Un cuadrado perfecto termina en 36 y es el mayor posible que es menor que 1000. ¿Quién es este cuadrado perfecto?`,
      respuesta: '36',
    },
    {
      n: 13, area: 'Álgebra',
      enunciado: String.raw`Sean $a$ y $b$ enteros positivos tales que satisfacen las condiciones
$$(2a + 2b)^2 = 400 \quad \text{y} \quad a^2 + b^2 = 52.$$
Hallar el valor de $a + b$.`,
      respuesta: '10',
    },
    {
      n: 14, area: 'Geometría',
      enunciado: String.raw`Sebas dibujó un octágono regular de lado 5 cm. Luego, sobre sus lados, construyó de forma alternada semicírculos y triángulos equiláteros hacia afuera del octágono, usando como base cada lado del mismo. Es decir, sobre un lado trazó un semicírculo hacia afuera, sobre el siguiente un triángulo equilátero hacia afuera, y así sucesivamente. ¿Cuál es el perímetro total de la figura resultante?`,
      figuras: [
        { archivo: '2025-estatal-n3-p14-sol1.png', alt: 'Octágono regular con semicírculos y triángulos construidos hacia afuera sobre sus lados, alternándose.', en: 'solucion' },
        { archivo: '2025-estatal-n3-p14-sol2.png', alt: 'La misma figura con el octágono punteado: los lados exteriores de los triángulos en rojo y los 4 semicírculos en azul.', en: 'solucion' },
      ],
      respuesta: '71.4 cm',
      solucion: String.raw`El dibujo que hizo Sebas es el de la primera figura de la solución, donde el octágono regular mide 5 cm de lado.

Entonces, para obtener el perímetro total de la figura resultante basta con calcular el perímetro de 8 lados de triángulo equilátero y de 4 semicircunferencias (segunda figura).

Al ser triángulos equiláteros, sabemos que sus lados medirán lo mismo que los del octágono, es decir, 5 cm. Esto también es equivalente a decir que se calcula exactamente el perímetro del octágono. Luego, su perímetro es
$$8 \times 5 \text{ cm} = 40 \text{ cm}.$$
Luego, el diámetro de cada semicircunferencia es igual al lado del octágono, esto es, un diámetro de 5 cm. Dado que son 4 semicircunferencias, es equivalente a 2 circunferencias; el perímetro que aportan es
$$2 \times (\pi \times D) = 2 \times 3.14 \times 5 \text{ cm} = 31.4 \text{ cm}.$$
Por lo tanto, el perímetro de toda la figura es
$$40 + 31.4 = 71.4 \text{ cm}.$$`,
    },
    {
      n: 15, area: 'Teoría de Números',
      enunciado: String.raw`Encuentra el mayor múltiplo de 36 que cumpla que todos sus dígitos son pares y que ningún dígito se repite.`,
      respuesta: '8640',
      solucion: String.raw`Los posibles dígitos a usar son 0, 2, 4, 6 y 8 en algún orden. Por criterios de divisibilidad, se debe cumplir que el número sea múltiplo de 4 y de 9 al mismo tiempo.

Criterio de divisibilidad por 9: la suma de sus dígitos debe ser divisible por 9. Si usamos todos los dígitos tendríamos
$$0 + 2 + 4 + 6 + 8 = 20,$$
lo cual no es un múltiplo de 9. Entonces, es necesario descartar al menos uno de ellos para que se cumpla el criterio. Debido a que queremos el número mayor, trataremos de descartar el dígito más pequeño posible. En consecuencia, descartamos el 2 para que la suma sea
$$0 + 4 + 6 + 8 = 18.$$
Criterio de divisibilidad por 4: requerimos que los dos últimos dígitos del número formen un número divisible por 4. Como buscamos el número mayor, probamos la opción más sencilla (ordenar los dígitos de mayor a menor) y obtenemos 8640, que termina en 40, divisible por 4, cumpliendo así el criterio.

Por lo tanto, la respuesta es 8640.`,
    },
  ],
}
