// 7a OMMEB Guerrero · Concurso Estatal Selectivo · Nivel 2 (22 de agosto de 2023).
// Transcrito de «Selectivo-N2 - 7OMMEBGro (RESP).pdf».
export default {
  edicion: 7,
  year: '2023',
  etapa: 'Selectivo',
  nivel: 2,
  grados: '6º de primaria y 1º de secundaria',
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
      n: 1, area: 'Geometría',
      enunciado: String.raw`En un triángulo $ABC$ la longitud de la altura $CH$, con $H$ en el segmento $AB$, es igual a la mitad del lado $AB$. Si $\angle BAC = 45^\circ$, encuentra la medida del $\angle ABC$.`,
      respuesta: '$45^\\circ$',
    },
    {
      n: 2, area: 'Combinatoria',
      enunciado: String.raw`¿Cuántos números de cuatro dígitos tienen exactamente tres dígitos iguales?`,
      respuesta: '324',
    },
    {
      n: 3, area: 'Geometría',
      enunciado: String.raw`En el triángulo rectángulo, se dibujaron dos cuadrados usando segmentos de los catetos como sus lados y puntos en la hipotenusa como sus vértices. De acuerdo con las medidas indicadas, calcula la longitud del lado del cuadrado menor.`,
      figuras: [{ archivo: '2023-selectivo-n2-p03.png', alt: 'Triángulo rectángulo con el ángulo recto abajo a la derecha y cateto vertical de 9. Dentro hay dos cuadrados apoyados en la base, uno junto al otro; el más grande, de lado 6, toca el cateto vertical, y ambos tienen un vértice sobre la hipotenusa.' }],
      respuesta: '4',
    },
    {
      n: 4, area: 'Teoría de Números',
      enunciado: String.raw`Estefania sumó los números $\overline{OMM}$ y $\overline{EB}$ (formados por las letras “O”, “M”, “E”, “B”), donde cada letra distinta representa un dígito distinto, y todas son distintas de cero; y obtuvo lo siguiente:
$$\begin{array}{r} O\,M\,M \\ +\;\;\; E\,B \\ \hline 9\,2\,3 \end{array}$$
¿A qué es igual la suma de los dígitos $O + M + M + E + B$?`,
      respuesta: '32',
    },
    {
      n: 5, area: 'Geometría',
      enunciado: String.raw`Un rombo $ABCD$ tiene perímetro igual a 52 metros. La longitud de la diagonal $AC$ es de 24 metros. ¿Cuál es el área, en metros cuadrados, del rombo $ABCD$?`,
      respuesta: '120',
    },
    {
      n: 6, area: 'Álgebra',
      enunciado: String.raw`Sebas quiere escribir un número en cada cuadrito del tablero que se muestra en la figura, de manera que el número escrito en cada cuadrito sea la suma de los números escritos en los dos cuadritos con los que comparte un lado. ¿Qué número va a escribir en el cuadrito marcado con $X$?`,
      figuras: [{ archivo: '2023-selectivo-n2-p06.png', alt: 'Marco rectangular de cuadritos de 6 de ancho por 5 de alto. La esquina superior izquierda tiene un 10, la superior derecha un 3, y el segundo cuadrito de la fila de abajo está marcado con X.' }],
      respuesta: '7',
    },
    {
      n: 7, area: 'Teoría de Números',
      enunciado: String.raw`Un entero positivo de tres cifras es primo impostor si el número de dos dígitos formado por las centenas y decenas sumado con la cifra de las unidades es igual a un primo. Por ejemplo, 509 es primo impostor porque $50 + 9 = 59$ es primo. ¿Cuántos primos impostores hay entre 300 y 400?`,
      respuesta: '26',
    },
    {
      n: 8, area: 'Combinatoria',
      enunciado: String.raw`Jonathan está jugando una variante del clásico juego conocido como Buscaminas. El juego consiste en voltear casillas una sola vez y evitar descubrir las minas. Como ayuda, algunas casillas están marcadas con números del 0 al 4 que indican la cantidad de minas adyacentes a una casilla. Como ejemplo se muestra la primera imagen, donde ya han sido descubiertas todas las casillas.

Jonathan ha llegado a la configuración de la segunda imagen. ¿Con cuántas minas puede encontrarse?`,
      figuras: [
        { archivo: '2023-selectivo-n2-p08-ejemplo.png', alt: 'Ejemplo de 3 por 3 ya descubierto. Fila 1: mina, 2, 0. Fila 2: 3, mina, 1. Fila 3: mina, 2, 0.' },
        { archivo: '2023-selectivo-n2-p08.png', alt: 'Tablero de 4 filas por 6 columnas. Fila 1: 2, vacía, 2, vacía, 1, vacía. Fila 2: vacía, vacía, vacía, 1, vacía, vacía. Fila 3: 2, vacía, 2, vacía, vacía, 1. Fila 4: 0, vacía, vacía, vacía, vacía, 0.' },
      ],
      respuesta: '6',
    },
    {
      n: 9, area: 'Teoría de Números',
      enunciado: String.raw`Abril escribió todos los enteros positivos menores a 1000 que son múltiplos de 10 y cuya suma de cifras es 10. ¿Cuál es la suma de todos los números que escribió Abril?`,
      respuesta: '4950',
    },
    {
      n: 10, area: 'Álgebra',
      enunciado: String.raw`Cuatro hermanos cuentan sus ahorros. Si entre los dos mayores se repartieran su dinero a partes iguales, cada uno tendría 520 pesos. Si hicieran lo mismo el segundo y el tercero, entonces cada uno tendría 450 pesos. Y si lo hicieran los dos menores, se quedarían con 370 pesos cada uno. Si el hermano mayor y el menor hicieran el reparto, ¿cuánto dinero tendrían cada uno?`,
      respuesta: '440 pesos',
    },
    {
      n: 11, area: 'Geometría',
      enunciado: String.raw`Un hexágono regular y un triángulo equilátero tienen el mismo perímetro. Si el área del hexágono es $6\sqrt{3}$, entonces el área del triángulo es $a\sqrt{3}$. ¿Cuánto vale $a$?`,
      respuesta: '4',
    },
    {
      n: 12, area: 'Combinatoria',
      enunciado: String.raw`Cristian va a vestirse con gorra, pantalón y playera, y quiere hacerlo de tal forma que las tres prendas sean de distinto color. Tiene que elegir entre gorra de color blanco o negro; pantalón de color blanco, negro, rojo o azul; playera de color blanca, negra, roja, azul, morada o café. ¿De cuántas maneras distintas puede hacerlo?`,
      respuesta: '20',
    },
    {
      n: 13, area: 'Teoría de Números',
      enunciado: String.raw`Aurora nació en el año $\overline{20ab}$. En este año, 2023, cumplió $a + b$ años de edad. ¿Cuántos años cumplirá en 2024?`,
      respuesta: '8 años',
      solucion: String.raw`Solución 1. Puesto que el año actual es 2023, $a$ puede ser igual a 0, 1 o 2. Analizamos casos con esos valores.

• $a = 0$. Del año $\overline{200b}$ al año 2023 han transcurrido $b$ años. Pero esto es imposible, porque $\overline{200b} + b = 2023$ indica que la suma de dos dígitos iguales termina en 3.
• $a = 1$. Del año $\overline{201b}$ al año 2023 han transcurrido $b + 1$ años. Entonces, $\overline{201b} + b + 1 = 2023$ nos da que $b + b + 1$ es una suma mayor a 10 que termina en 3. Esto implica que $b = 6$.
• $a = 2$. Del $\overline{202b}$ al año 2023 han transcurrido $b + 2$ años. Similarmente, se requiere que $b + b + 2$ termine en 3, lo cual es imposible.

La única opción es $a = 1$ y $b = 6$, de donde Aurora cumplió $a + b = 1 + 6 = 7$ años en 2023. Por tanto, en 2024 cumplirá 8 años.

Solución 2. Del $\overline{20ab}$ al 2023 han pasado exactamente $a + b$ años, por lo que podemos verlo como la suma
$$\begin{array}{r} 2\,0\,a\,b \\ +\;\;\;\;\;\; a \\ +\;\;\;\;\;\; b \\ \hline 2\,0\,2\,3 \end{array}$$
Como el acarreo más grande que pueden traer tres dígitos es 2, por la columna de las decenas los posibles valores de $a$ son 0, 1 o 2. Si $a = 0$, entonces $b + b$ termina en 3, lo cual es imposible. Si $a = 1$, entonces $b + b$ es 10 o más y termina en 2; así, $b = 6$. Si $a = 2$, entonces $b + b$ termina en 1, lo cual es imposible. Por lo tanto, $a = 1$ y $b = 6$, y Aurora cumplirá 8 años en 2024.

Solución 3. Como en la anterior, notamos que $a + 2b$ termina en 3. Sin importar el valor que tenga $b$, el número $2b$ es par. Así que $a$ tiene que ser impar y, como sus únicas opciones son 0, 1 o 2, se concluye que $a = 1$. De aquí, con un razonamiento parecido al anterior, se deduce que $b = 6$.`,
    },
    {
      n: 14, area: 'Geometría',
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
      n: 15, area: 'Combinatoria',
      enunciado: String.raw`Un examen consta de 15 preguntas de las cuales Luis debe contestar sólo 10 de ellas. Además, Luis está obligado a contestar al menos 5 preguntas de las 7 primeras. ¿Cuántas maneras tiene de elegir las 10 preguntas que responderá?`,
      respuesta: '1722',
      solucion: String.raw`Procedemos por casos de acuerdo con la cantidad de preguntas que Luis conteste de las 7 primeras. De esa decisión dependerá cuántas preguntas debe contestar de las 8 restantes del examen.

Caso 1: contesta sólo 5 de las primeras 7. Esto lo puede hacer de $\binom{7}{5}$ formas. De las 8 preguntas restantes deberá elegir 5 para completar sus diez preguntas, de $\binom{8}{5}$ maneras. Así, el total del caso es
$$\binom{7}{5} \times \binom{8}{5} = \frac{7!}{5! \times 2!} \times \frac{8!}{5! \times 3!} = 21 \times 56 = 1176.$$
Caso 2: contesta sólo 6 de las primeras 7, de $\binom{7}{6}$ formas. Para completar las diez preguntas hacen falta 4, que se eligen de entre 8, de $\binom{8}{4}$ maneras. El total del caso es
$$\binom{7}{6} \times \binom{8}{4} = 7 \times 70 = 490.$$
Caso 3: contesta las 7. Sólo hay 1 manera de hacerlo. Hacen falta 3 preguntas a elegir de entre 8, de $\binom{8}{3}$ maneras. El total del caso es
$$\binom{7}{7} \times \binom{8}{3} = 1 \times 56 = 56.$$
Por lo tanto, Luis tiene un total de $1176 + 490 + 56 = 1722$ maneras de elegir sus diez preguntas.`,
    },
  ],
}
