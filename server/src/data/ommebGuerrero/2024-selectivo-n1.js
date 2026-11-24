// 8a OMMEB Guerrero · Concurso Estatal Selectivo · Nivel 1 (2 de agosto de 2024).
// Transcrito de «Selectivo_N1___8aOMMEBGro__RESP.pdf».
export default {
  edicion: 8,
  year: '2024',
  etapa: 'Selectivo',
  nivel: 1,
  grados: '4º y 5º de primaria',
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
      n: 1, area: 'Álgebra',
      enunciado: String.raw`Cierto día Jonathan compró 3 plumones y un borrador y pagó 125.50 pesos. Días después, él pasó a comprar otros tres borradores y un lápiz por lo que pagó 25 pesos. Posteriormente Jonathan pagó 73.50 pesos por tres lápices y un plumón. Suponiendo que todos los artículos se mantuvieron en el mismo precio inicial, ¿cuánto pagará Jonathan si ahora compra 7 lápices, 7 plumones y 7 borradores?`,
      opciones: ['56 pesos', '168 pesos', '224 pesos', '392 pesos', '448 pesos'],
      respuesta: 'd',
    },
    {
      n: 2, area: 'Combinatoria',
      enunciado: String.raw`Al Congreso de Matemáticas asistieron 9 delegados repartidos de la siguiente forma: 2 delegados de Veracruz, 3 delegados de Sinaloa y 4 delegados de Guerrero. Durante la sesión inaugural, tres de los delegados se quedaron dormidos. Calcula cuántas formas distintas hay tales que exactamente dos de los que se durmieron sean del mismo estado.`,
      opciones: ['$7$', '$18$', '$30$', '$55$', '$84$'],
      respuesta: 'd',
    },
    {
      n: 3, area: 'Álgebra',
      enunciado: String.raw`A lo largo de un camino rural hay 41 postes separados uniformemente (la distancia entre uno y otro es la misma). Nando, el ñandú, da 44 pasos para llegar de un poste a otro. En cambio, Trus, el avestruz, sólo da 12 pasos para hacer lo mismo. Si la distancia entre el primer y último poste es de 5280 pies, ¿cuál es la diferencia, en pies, de un paso de Nando y un paso de Trus?`,
      opciones: ['6 pies', '8 pies', '10 pies', '11 pies', '15 pies'],
      respuesta: 'b',
    },
    {
      n: 4, area: 'Teoría de Números',
      enunciado: String.raw`¿Cuál es la suma de todos los enteros positivos menores a 150 que dejan 3 como residuo al ser divididos entre 5?`,
      opciones: ['$2115$', '$2265$', '$7550$', '$4530$', '$11325$'],
      respuesta: 'b',
    },
    {
      n: 5, area: 'Geometría',
      enunciado: String.raw`En un triángulo isósceles $ABC$, con $BA = AC$, se sabe que $\angle CBA = 2 \cdot \angle BAC$. Se toma un punto $P$ en $AC$ tal que $BP$ es bisectriz de $\angle CBA$; y se coloca un punto $Q$ en $AB$ de modo que $PQ$ es la altura del triángulo $APB$. ¿Cuánto vale $\dfrac{AB}{AQ}$?`,
      opciones: ['$\\dfrac{1}{2}$', '$1$', '$\\dfrac{1}{3}$', '$3$', '$2$'],
      respuesta: 'e',
    },
    {
      n: 6, area: 'Teoría de Números',
      enunciado: String.raw`¿Cuántos enteros positivos de 4 dígitos son divisibles entre 2, 3, 4 y 5?`,
      respuesta: '150',
    },
    {
      n: 7, area: 'Geometría',
      enunciado: String.raw`En la figura se muestra un cuadrado grande y en su interior un cuadrado pequeño cuyos lados son paralelos a los del grande y los lados del cuadrado pequeño miden 35 cm. Si se sabe que
$$\text{Perímetro de } ABCD = 12 \text{ cm}, \qquad \text{Perímetro de } EFGH = 48 \text{ cm}, \qquad \text{Perímetro de } ABGH = 122 \text{ cm},$$
¿cuál es el valor del área que está sombreada?`,
      figuras: [{ archivo: '2024-selectivo-n1-p07.png', alt: 'Cuadrado grande sombreado de amarillo con un cuadrado blanco adentro. Una franja vertical a la derecha va de A a B arriba y de H a G abajo; los rectángulos ABCD y EFGH están en esa franja, a la altura del lado superior y del lado inferior del cuadrado blanco.' }],
      respuesta: '2024 cm$^2$',
    },
    {
      n: 8, area: 'Álgebra',
      enunciado: String.raw`Aída le dispara a un tiro al blanco y le atina únicamente a las regiones que valen 8 y 10 puntos. Si sabemos que acertó a la región de 8 tantas veces como a la región de 10, falló en el $25\,\%$ de los tiros y en total obtuvo 162 puntos, ¿cuántos disparos hizo Aída en total?`,
      respuesta: '24',
    },
    {
      n: 9, area: 'Combinatoria',
      enunciado: String.raw`Estefania lanza dos fichas al azar en el siguiente tablero de $3 \times 3$. Suponiendo que las fichas siempre caen en el tablero y además no caen en la misma casilla, ¿de cuántas maneras pueden quedar en dos casillas no adyacentes?

Nota: Dos casillas son adyacentes cuando comparten un lado en común, tal y como se muestra en la figura.`,
      figuras: [{ archivo: '2024-selectivo-n1-p09.png', alt: 'Tablero de 3 por 3 con dos fichas rojas en las casillas de en medio de la fila de arriba y de la fila central: son casillas adyacentes.' }],
      respuesta: '24',
    },
    {
      n: 10, area: 'Geometría',
      enunciado: String.raw`Se construye un rectángulo $ABCD$, donde $AB = 144$ cm y $BC = 87$ cm. Se coloca un punto $P$ sobre el lado $AD$, de tal forma que $PC = 145$ cm. Posteriormente se coloca un punto $S$ en $PC$, tal que $BS$ sea perpendicular a $PC$. ¿Cuánto vale $BS$?`,
      respuesta: '86.4 cm',
    },
    {
      n: 11, area: 'Combinatoria',
      enunciado: String.raw`Hay 20 estudiantes que participan en un programa extraescolar que ofrece clases de música, acondicionamiento físico y pintura. Cada estudiante debe tomar al menos una de estas tres clases, con la posibilidad de tomar dos o las tres. Hay 10 estudiantes que toman música, 13 toman acondicionamiento físico y 9 toman pintura. Hay 9 estudiantes que toman al menos dos clases. ¿Cuántos estudiantes están tomando las tres clases?`,
      respuesta: '3',
    },
    {
      n: 12, area: 'Teoría de Números',
      enunciado: String.raw`Jaime olvidó la clave de su celular. Sin embargo, recuerda que:

• Tiene 4 dígitos.
• Es capicúa.
• Es múltiplo de 9.
• Deja residuo 2 al dividir entre 8.

¿Cuál es la clave del celular de Jaime?`,
      respuesta: '4554',
    },
    {
      n: 13, area: 'Geometría',
      enunciado: String.raw`Dado un triángulo isósceles $\triangle ABC$ con $AB = CB$ y $AC = 6$, sea $M$ el punto medio de $AC$. Considerando un punto $P$ sobre $BM$ tal que $BP = 2 \cdot PM$ y el área del triángulo $\triangle APM$ es $6$ cm$^2$, encontrar el área del triángulo $\triangle ABC$.`,
      figuras: [{ archivo: '2024-selectivo-n1-p13-sol.png', alt: 'Triángulo isósceles ABC con la altura BM; $AM = MC = 3$, P está en BM con $PM = a$ y $BP = 2a$, y se traza AP.', en: 'solucion' }],
      respuesta: '36 cm$^2$',
      solucion: String.raw`En la figura de la solución, sea $PM = a$; entonces $BP = 2 \cdot PM = 2a$, lo que implica que $BM = 3a$. Por su parte, $AM = MC = 3$.

Dado que $BM$ es la mediana trazada a la base de un triángulo isósceles, entonces también es bisectriz, altura y mediatriz para este triángulo. Por la fórmula de área de un triángulo para el $\triangle APM$ tenemos
$$\text{Área}(APM) = \frac{3a}{2} = 6 \implies a = 4.$$
En consecuencia,
$$BM = 3a = 3 \times 4 = 12,$$
y por lo tanto
$$\text{Área}(ABC) = \frac{6 \times 12}{2} = 36 \text{ cm}^2.$$`,
    },
    {
      n: 14, area: 'Teoría de Números',
      enunciado: String.raw`Carolina anotó 4 enteros positivos consecutivos en su libreta. Después se dio cuenta que el primero era divisible entre 5, el segundo era divisible entre 6, el tercero entre 7 y el cuarto entre 8. Sabemos que todos son números de 3 dígitos. ¿Cuáles son los números que Carolina anotó?`,
      respuesta: '845, 846, 847 y 848',
      solucion: String.raw`Solución 1. Por el criterio de divisibilidad por 5, el primero de los números termina en 0 o en 5. Si termina en 0, entonces el siguiente número termina en 1, pero esto es imposible porque este número debe ser par, por el criterio de divisibilidad por 6. Entonces los números son de la forma
$$\underline{\ }\,\underline{\ }\,5, \quad \underline{\ }\,\underline{\ }\,6, \quad \underline{\ }\,\underline{\ }\,7, \quad \underline{\ }\,\underline{\ }\,8.$$
Por el criterio de divisibilidad por 7, el número $\underline{\ }\,\underline{\ }\,7$ debe ser un múltiplo de 7, lo que nos da que el número formado por el dígito de las centenas y el de las decenas es un múltiplo de 7 y, puesto que debe ser de dos dígitos, tiene que ser mayor o igual a 14. Tenemos las opciones $14, 21, 28, \ldots, 98$.

Luego, para que $\underline{\ }\,\underline{\ }\,6$ sea divisible por 6, la suma de sus cifras debe ser múltiplo de 3; entonces el número formado por el dígito de las centenas y el de las decenas también tiene que ser múltiplo de 3. Nos quedamos con los múltiplos de 21: 21, 42, 63, 84. Por inspección, 84 es el único con el que $\underline{\ }\,\underline{\ }\,8$ es divisible por 8.

Teniendo este número, los tenemos todos: 845, 846, 847, 848.

Solución 2. Como en la Solución 1, los números terminan en 5, 6, 7 y 8. Por el criterio de divisibilidad por 8, el número $\underline{\ }\,\underline{\ }\,8$ debe ser un múltiplo de 8. Por inspección, las opciones son $128, 168, \ldots, 968$. Notamos que los dos primeros dígitos forman una sucesión que empieza en 12 y de ahí va de 4 en 4, es decir, son múltiplos de 4 de dos dígitos.

Para que el número $\underline{\ }\,\underline{\ }\,7$ sea divisible por 7, necesitamos que los dos primeros dígitos formen un número divisible por 7; de lo anterior, deben ser múltiplos de $4 \times 7 = 28$. Nos quedamos con las opciones 28, 56, 84.

Por último, para que $\underline{\ }\,\underline{\ }\,6$ sea divisible por 6, la suma de sus cifras debe ser múltiplo de 3; la única opción que cumple es 84.

Teniendo este número, los tenemos todos: 845, 846, 847, 848.`,
    },
    {
      n: 15, area: 'Combinatoria',
      enunciado: String.raw`Paulina tiene cinco fichas numeradas con un número distinto del 1 al 5. Sin mirar, Paulina toma una cierta cantidad de las fichas, al menos una de ellas. Posteriormente, ella suma los números de las fichas que tomó. ¿De cuántas maneras la suma que obtuvo Paulina es menor o igual a 10?`,
      respuesta: '24',
      solucion: String.raw`Solución 1. La idea de esta solución es contar cuántos casos son posibles cuando Paulina toma una cierta cantidad de fichas.

• Paulina toma una ficha. Todas las maneras de tomar una ficha son posibles. Hay $\binom{5}{1} = 5$ opciones.
• Paulina toma dos fichas. Todas las maneras de tomar dos fichas son posibles. Hay $\binom{5}{2} = 10$ opciones.
• Paulina toma tres fichas. Son posibles todas las maneras excepto cuando toma las fichas $\{2, 4, 5\}$ o $\{3, 4, 5\}$. Entonces hay $\binom{5}{3} - 2 = 10 - 2 = 8$ opciones.
• Paulina toma cuatro fichas. La única opción es cuando toma las fichas $\{1, 2, 3, 4\}$. La suma de estas fichas es 10; al ser estos los números más pequeños, de cualquier otra manera la suma será mayor a 10. Este caso da 1 opción.
• Paulina toma las cinco fichas. Es imposible, pues la suma es 15.

Por lo tanto, el total de maneras es
$$5 + 10 + 8 + 1 + 0 = 24.$$

Solución 2. La suma de las cinco fichas es $1 + 2 + 3 + 4 + 5 = \frac{5 \times 6}{2} = 15$. Podemos pensar el problema de la siguiente manera: “¿De cuántas maneras Paulina puede tomar fichas tal que su suma sea mayor a 10?” Al conocer esta cantidad, podemos restarla al total de maneras de tomar fichas.

• Caso I: suma 15. Hay sólo 1 opción: tomar todas las fichas, $\{1, 2, 3, 4, 5\}$.
• Caso II: suma 14. Como $14 = 15 - 1$, hay sólo 1 opción: $\{2, 3, 4, 5\}$, es decir, excluir la ficha 1.
• Caso III: suma 13. Como $13 = 15 - 2$, hay sólo 1 opción: $\{1, 3, 4, 5\}$, es decir, excluir la ficha 2.
• Caso IV: suma 12. Como $12 = 15 - 3 = 15 - 1 - 2$, hay 2 opciones: $\{1, 2, 4, 5\}$ o $\{3, 4, 5\}$, es decir, excluir la ficha 3 o excluir las fichas 1 y 2.
• Caso V: suma 11. Como $11 = 15 - 4 = 15 - 1 - 3$, hay 2 opciones: $\{1, 2, 3, 5\}$ o $\{2, 4, 5\}$, es decir, excluir la ficha 4 o excluir las fichas 1 y 3.

De modo que debemos quitar $1 + 1 + 1 + 2 + 2 = 7$ opciones del total. El total de maneras de tomar fichas es el total de subconjuntos de $\{1, 2, 3, 4, 5\}$ excepto el vacío (cuando no se toma ficha alguna). Por lo tanto, la cantidad buscada es
$$2^5 - 1 - 7 = 32 - 1 - 7 = 24.$$`,
    },
  ],
}
