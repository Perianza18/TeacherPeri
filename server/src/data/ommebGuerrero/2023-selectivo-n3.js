// 7a OMMEB Guerrero · Concurso Estatal Selectivo · Nivel 3 (22 de agosto de 2023).
// Transcrito de «Selectivo-N3 - 7OMMEBGro (RESP).pdf».
//
// OJO: la hoja de respuestas de la Parte A de este PDF es la de otro examen
// (repite la del Nivel 2 y dice «Categoría I, Etapa municipal»). Los problemas
// que también están en el Nivel 2 toman la respuesta oficial de ese examen; los
// demás quedan sin respuesta oficial.
const OTHER_KEY = 'La hoja de respuestas que viene en el PDF de este examen corresponde a otro examen.'
const FROM_N2 = `${OTHER_KEY} La respuesta se tomó de la hoja oficial del Nivel 2, donde aparece el mismo problema.`
const NO_KEY = `${OTHER_KEY} Por eso este problema no tiene respuesta oficial.`

export default {
  edicion: 7,
  year: '2023',
  etapa: 'Selectivo',
  nivel: 3,
  grados: '2º de secundaria',
  fecha: '22 de agosto de 2023',
  duracionMinutos: 120,
  indicaciones: [
    'La duración del examen es de 2 horas.',
    'El uso de celulares, calculadoras, electrónicos, formularios y tablas no está permitido.',
    'Las figuras no están a escala, sólo son representativas.',
    'En la Parte A (problemas del 1 al 12) sólo la respuesta es requerida.',
    'La Parte B (problemas del 13 al 15) es de redacción libre; el procedimiento es requerido.',
  ],
  problemas: [
    {
      n: 1, area: 'Teoría de Números',
      enunciado: String.raw`Determina el resto que deja $2023^4 + 4^{2023}$ al ser dividido por 5.`,
      respuesta: null,
      nota: NO_KEY,
    },
    {
      n: 2, area: 'Teoría de Números',
      enunciado: String.raw`Aurora nació en el año $\overline{20ab}$. En este año, 2023, cumplió $a + b$ años de edad. ¿Cuántos años cumplirá en 2024?`,
      respuesta: '8 años',
      nota: FROM_N2,
    },
    {
      n: 3, area: 'Geometría',
      enunciado: String.raw`Sean $ABC$ y $DEF$ triángulos rectángulos semejantes con hipotenusas $AC = 2$ y $DF = 10$, respectivamente. Calcula el valor de $AB \cdot DE + BC \cdot EF$.`,
      respuesta: null,
      nota: NO_KEY,
    },
    {
      n: 4, area: 'Combinatoria',
      enunciado: String.raw`Para llenar una quiniela de fútbol tenemos que elegir algún posible resultado de entre tres opciones de cada partido (gana local, empate, gana visitante), con la posibilidad de elegir hasta las tres opciones. Brandon va a llenar una quiniela de 7 partidos. En cuatro partidos él elegirá exactamente dos resultados. En dos partidos él elegirá las tres opciones. En el partido restante, sólo elegirá una opción. ¿De cuántas formas puede hacer esto?`,
      respuesta: null,
      nota: NO_KEY,
    },
    {
      n: 5, area: 'Álgebra',
      enunciado: String.raw`Cristian quiere escribir un número en cada cuadrito del tablero que se muestra en la figura, de manera que el número escrito en cada cuadrito sea la suma de los números escritos en los dos cuadritos con los que comparte un lado. ¿Qué número va a escribir en el cuadrito marcado con $X$?`,
      figuras: [{ archivo: '2023-selectivo-n2-p06.png', alt: 'Marco rectangular de cuadritos de 6 de ancho por 5 de alto. La esquina superior izquierda tiene un 10, la superior derecha un 3, y el segundo cuadrito de la fila de abajo está marcado con X.' }],
      respuesta: '7',
      nota: FROM_N2,
    },
    {
      n: 6, area: 'Combinatoria',
      enunciado: String.raw`En una cena hay 12 ex-compañeros de clase que han reservado una mesa redonda en un restaurante. Luego de un pleito del pasado, dos de ellos no se llevan. El organizador, preocupado por la situación, ha calculado de cuántas formas pueden sentarse a la mesa los 12 comensales, de manera que los enemistados no se sienten juntos, y obtuvo un número de la forma $a \times b!$. ¿Cuál es el valor de $a + b$?`,
      respuesta: null,
      nota: NO_KEY,
    },
    {
      n: 7, area: 'Álgebra',
      enunciado: String.raw`Rebeca tiene 110.00 pesos en monedas de 1, 2 y 5 pesos. La cantidad de dinero que tiene en monedas de 5 pesos es el doble que la cantidad de dinero en monedas de 2 pesos y el triple de lo juntado en monedas de 1 peso. ¿Cuántas monedas tiene Rebeca?`,
      respuesta: null,
      nota: NO_KEY,
    },
    {
      n: 8, area: 'Geometría',
      enunciado: String.raw`Un hexágono regular y un triángulo equilátero tienen el mismo perímetro. Si el área del hexágono es $6\sqrt{3}$, entonces el área del triángulo es $a\sqrt{3}$. ¿Cuánto vale $a$?`,
      respuesta: '4',
      nota: FROM_N2,
    },
    {
      n: 9, area: 'Combinatoria',
      enunciado: String.raw`Abril está jugando una variante del clásico juego conocido como Buscaminas. El juego consiste en voltear casillas una sola vez y evitar descubrir las minas. Como ayuda, algunas casillas están marcadas con números del 0 al 4 que indican la cantidad de minas adyacentes a una casilla. Como ejemplo se muestra la primera imagen, donde ya han sido descubiertas todas las casillas.

Abril ha llegado a la configuración de la segunda imagen. ¿Con cuántas minas puede encontrarse?`,
      figuras: [
        { archivo: '2023-selectivo-n2-p08-ejemplo.png', alt: 'Ejemplo de 3 por 3 ya descubierto. Fila 1: mina, 2, 0. Fila 2: 3, mina, 1. Fila 3: mina, 2, 0.' },
        { archivo: '2023-selectivo-n2-p08.png', alt: 'Tablero de 4 filas por 6 columnas. Fila 1: 2, vacía, 2, vacía, 1, vacía. Fila 2: vacía, vacía, vacía, 1, vacía, vacía. Fila 3: 2, vacía, 2, vacía, vacía, 1. Fila 4: 0, vacía, vacía, vacía, vacía, 0.' },
      ],
      respuesta: '6',
      nota: FROM_N2,
    },
    {
      n: 10, area: 'Teoría de Números',
      enunciado: String.raw`Por mal comportamiento en clase, Miguel fue castigado a escribir los números 2022 y 2023 seguidos uno del otro, hasta completar un total de 2023 bloques. Un bloque termina cuando se escriben los cuatro dígitos de 2022 o 2023, como se muestra:
$$\underbrace{2022}_{1}\,\underbrace{2023}_{2}\,\underbrace{2022}_{3}\,\underbrace{2023}_{4}\,\cdots\,\underbrace{\phantom{2023}}_{2023}$$
¿Cuántos dígitos iguales a 2 escribió Miguel?`,
      respuesta: null,
      nota: NO_KEY,
    },
    {
      n: 11, area: 'Álgebra',
      enunciado: String.raw`Cuatro hermanos cuentan sus ahorros. Si entre los dos mayores se repartieran su dinero a partes iguales, cada uno tendría 520 pesos. Si hicieran lo mismo el segundo y el tercero, entonces cada uno tendría 450 pesos. Y si lo hicieran los dos menores, se quedarían con 370 pesos cada uno. Si el hermano mayor y el menor hicieran el reparto, ¿cuánto dinero tendrían cada uno?`,
      respuesta: '440 pesos',
      nota: FROM_N2,
    },
    {
      n: 12, area: 'Geometría',
      enunciado: String.raw`En la figura, el triángulo $ABC$ tiene longitudes $AB = 5$, $BC = 4$ y $CA = 3$. El segmento $DE$ es perpendicular a $AB$. Si el área de $EDB$ es la cuarta parte de la de $ABC$, ¿cuánto mide $BD$?`,
      figuras: [{ archivo: '2023-selectivo-n3-p12.png', alt: 'Triángulo ABC con base AB; D está en AB y E en BC, con DE perpendicular a AB.' }],
      respuesta: null,
      nota: NO_KEY,
    },
    {
      n: 13, area: 'Geometría',
      enunciado: String.raw`Danna recortó rectángulos iguales de $7 \times 1$ y los fue pegando por columnas seguidas como se muestra en la figura.

Si esto lo hizo hasta que la última columna tenía 17 rectángulos, ¿cuál es el área del triángulo rectángulo más grande posible que queda formado por tres de los vértices de los rectángulos que conforman la figura final?`,
      figuras: [
        { archivo: '2023-selectivo-n2-p14.png', alt: 'Escalera de rectángulos de 7 por 1 acostados: la primera columna tiene 1 rectángulo, la segunda 2 apilados y la tercera 3 apilados; siguen puntos suspensivos.' },
        { archivo: '2023-selectivo-n2-p14-sol.png', alt: 'La escalera completa con 17 columnas y el triángulo rectángulo más grande: base de $7 \\times 17$ abajo y altura de $1 \\times 17$ a la derecha; la hipotenusa pasa por la esquina superior derecha de la última pieza de cada columna.', en: 'solucion' },
      ],
      respuesta: '$\\dfrac{2023}{2}$',
      solucion: String.raw`Solución 1. La columna 1 tiene 1 rectángulo, la columna 2 tiene 2 rectángulos, …; entonces la figura está conformada por 17 columnas.

El triángulo rectángulo mayor es el que se forma con el vértice inferior izquierdo del rectángulo de la columna 1, con el vértice inferior derecho del primer rectángulo de la columna 17 y con el vértice superior derecho del último rectángulo de la columna 17 (véase la figura de la solución).

Este triángulo tiene a 17 rectángulos como base, cada uno aportando una longitud igual a 7; entonces su base es de $7 \times 17$. Su altura es igual a 17 veces la altura de cada rectángulo, que es 1; así, la altura del triángulo es $1 \times 17$. Por lo tanto, su área es
$$\frac{\text{base} \times \text{altura}}{2} = \frac{7 \times 17 \times 1 \times 17}{2} = \frac{2023}{2}.$$

Solución 2. Cada “escalera” de rectángulos tiene los vértices de la diagonal alineados, así que la hipotenusa del triángulo pasa por el vértice superior derecho del último rectángulo de cada columna. Para calcular su área basta con sumar 17 mitades de rectángulo (por donde pasa la hipotenusa) y los rectángulos completos que quedan por debajo, que forman una escalera de 16 columnas: $1 + 2 + \cdots + 16 = \frac{16 \times 17}{2}$. Cada rectángulo tiene área 7, por lo que el área buscada es
$$17 \times \frac{7}{2} + \frac{16 \times 17}{2} \times 7 = \frac{17 \times 17 \times 7}{2} = \frac{2023}{2}.$$
(La hoja oficial incluye también una Solución 3, que generaliza este argumento a $n$ columnas y obtiene el área $\frac{7n^2}{2}$.)`,
    },
    {
      n: 14, area: 'Teoría de Números',
      enunciado: String.raw`Un entero positivo de tres cifras es primo impostor si el número de dos dígitos formado por las centenas y decenas sumado con la cifra de las unidades es igual a un número primo. Por ejemplo, 509 es primo impostor porque $50 + 9 = 59$ es primo. ¿Cuántos primos impostores hay entre 300 y 400?`,
      respuesta: '26',
      solucion: String.raw`El PDF sólo trae los criterios de calificación de este problema; de ellos se obtiene la idea de la solución.

Un número entre 300 y 400 es de la forma $\overline{3ab}$, y la suma es $\overline{3a} + b$, que está entre 30 y 48. Los primos posibles son 31, 37, 41, 43 y 47. Contando por casos ($\overline{3a} + b = 30 + a + b$):

• primo 31, es decir, $a + b = 1$: 2 números;
• primo 37, es decir, $a + b = 7$: 8 números;
• primo 41, es decir, $a + b = 11$: 8 números;
• primo 43, es decir, $a + b = 13$: 6 números;
• primo 47, es decir, $a + b = 17$: 2 números.

En total hay $2 + 8 + 8 + 6 + 2 = 26$ primos impostores.`,
    },
    {
      n: 15, area: 'Combinatoria',
      enunciado: String.raw`Un agricultor provee de frutas y verduras por cajas a cuatro supermercados. En estos momentos dispone de dos cajas de frutas: una de manzanas y otra de naranjas; y tres cajas de verduras: una de papas, una de cebollas y otra de zanahorias. Si al repartir sus productos no desea que a algún supermercado le toquen las tres cajas de verduras, ¿cuántas formas hay de repartir las cajas?`,
      respuesta: '960',
      solucion: String.raw`Solución 1. Dividimos por casos de acuerdo con la cantidad de cajas de verduras que se manden a un supermercado.

Caso 1: le tocan 2 cajas de verduras a un supermercado. Tenemos 4 opciones para elegir al supermercado al que se le proveerán las dos cajas. De las 3 cajas de verduras, seleccionamos cuáles 2 se le darán, de $\binom{3}{2}$ maneras. Hace falta una caja de verduras, que podemos dar a cualquiera de los otros 3 supermercados (para que al primero no le toquen todas). Como no hay condición para las cajas de frutas, para cada caja hay 4 opciones, así que hay $4 \times 4$ maneras de repartirlas. El total del caso es
$$4 \times \binom{3}{2} \times 3 \times 4 \times 4 = 4 \times 3 \times 3 \times 4 \times 4 = 576.$$
Caso 2: exactamente una caja de verduras a tres supermercados. Elegimos los supermercados que recibirán verduras de $\binom{4}{3}$ formas y decidimos qué caja de verduras le toca a cada uno de $3!$ maneras. Las frutas se reparten de nuevo de $4 \times 4$ maneras. El total del caso es
$$\binom{4}{3} \times 3! \times 4 \times 4 = 4 \times 6 \times 4 \times 4 = 384.$$
Entonces, las maneras de repartir las cajas son $576 + 384 = 960$.

Solución 2. Sin restricción, cada una de las 5 cajas tiene 4 supermercados como opción: $4^5 = 1024$ maneras. Quitamos los casos en que una tienda recibe las tres cajas de verduras: hay 4 tiendas posibles y cada caja de fruta puede ir a cualquiera de los 4 supermercados, es decir, $4 \times 4 \times 4 = 4^3 = 64$ formas. Por tanto, hay
$$4^5 - 4^3 = 1024 - 64 = 960$$
maneras de repartir las cajas sin que a un supermercado le toquen las tres cajas de verduras.`,
    },
  ],
}
