// 7a OMMEB Guerrero · Concurso Estatal · Nivel 2 (8 de julio de 2023).
// Transcrito de «Estatal_N2_7OMMEBGro (RESP).pdf».
export default {
  edicion: 7,
  year: '2023',
  etapa: 'Estatal',
  nivel: 2,
  grados: '6º de primaria y 1º de secundaria',
  fecha: '8 de julio de 2023',
  duracionMinutos: 120,
  indicaciones: [
    'La duración del examen es de 2 horas.',
    'El uso de celulares, calculadoras, electrónicos, formularios y tablas no está permitido.',
    'Las figuras no están a escala, sólo son representativas.',
    'Problemas 1 a 8: opción múltiple. Problemas 9 a 15: respuesta corta.',
  ],
  problemas: [
    {
      n: 1, area: 'Álgebra',
      enunciado: String.raw`En un concurso de matemáticas participaron 1260 competidores. Las estadísticas arrojaron que 4 de cada 10 competidores obtuvieron medallas (oro, plata y bronce). El número de medallas de bronce es el triple que el número de medallas de oro, y el número de medallas de plata es el doble del número de medallas de oro. ¿Cuántas medallas de plata se entregaron?`,
      opciones: ['$56$', '$84$', '$112$', '$168$', '$252$'],
      respuesta: 'd',
    },
    {
      n: 2, area: 'Teoría de Números',
      enunciado: String.raw`Con los dígitos 2, 0, 2 y 4, Luis arma todos los enteros de cuatro cifras divisibles por 11. ¿Cuál es la suma de estos enteros?`,
      opciones: ['$8888$', '$4444$', '$6226$', '$6662$', '$8646$'],
      respuesta: 'e',
    },
    {
      n: 3, area: 'Geometría',
      enunciado: String.raw`Al salir de la escuela, Ángel y Brenda caminan hacia sus casas, desde el mismo punto de partida. Ángel camina en línea recta hacia el este, avanza 6 metros cada minuto. Brenda avanza hacia el sur, recorriendo 8 metros cada minuto. ¿Cuántos minutos tienen que pasar para que estén separados por una distancia de 2020 metros?`,
      opciones: ['$200$', '$201$', '$202$', '$203$', '$204$'],
      respuesta: 'c',
    },
    {
      n: 4, area: 'Teoría de Números',
      enunciado: String.raw`Sara tiene tres hijos; se sabe que la edad del mayor es un número primo y que el producto de las tres edades es 2024. Son opciones para las edades de los otros dos hermanos, excepto:`,
      opciones: ['$2$', '$4$', '$8$', '$11$', '$22$'],
      respuesta: 'a',
    },
    {
      n: 5, area: 'Combinatoria',
      enunciado: String.raw`Un juego trae 20 cartas enumeradas del 1 al 20. Consiste en tomar 3 cartas al azar y gana quien tenga en todas sus cartas múltiplos de 5. ¿Cuántas posibilidades hay de perder?`,
      opciones: ['$1133$', '$1134$', '$1135$', '$1136$', '$1137$'],
      respuesta: 'd',
    },
    {
      n: 6, area: 'Geometría',
      enunciado: String.raw`Abril dibuja un cuadrilátero $ABCD$ con $AB = 6$, $BC = 7$, $CD = 8$, $AC = 9$ y $BD = 10$. ¿Cuál es el mayor valor posible para el perímetro de $ABCD$?`,
      opciones: ['$34$', '$35$', '$36$', '$37$', '$38$'],
      respuesta: null,
      nota: 'La hoja oficial de respuestas no marca ninguna opción para este problema.',
    },
    {
      n: 7, area: 'Álgebra',
      enunciado: String.raw`La suma de dos números positivos es igual a 5 veces su diferencia. ¿Cuál es la fracción reducida que resulta al dividir el número mayor entre el menor?`,
      opciones: ['$\\dfrac{5}{4}$', '$\\dfrac{3}{2}$', '$\\dfrac{9}{5}$', '$\\dfrac{2}{1}$', '$\\dfrac{5}{2}$'],
      respuesta: 'b',
    },
    {
      n: 8, area: 'Geometría',
      enunciado: String.raw`En el triángulo $ABC$, un punto $E$ está en $AB$ con $AE = 1$ y $EB = 2$. El punto $D$ está en $AC$ de modo que $DE$ y $BC$ son paralelas y el punto $F$ está en $BC$ tal que $EF$ es paralela a $AC$. Si el área de $ABC$ es 9, ¿cuál es el área de $CDEF$?`,
      figuras: [{ archivo: '2023-estatal-n2-p08.png', alt: 'Triángulo ABC con base AB; E está en AB con $AE = 1$ y $EB = 2$. D está en AC con DE paralela a BC, y F está en BC con EF paralela a AC.' }],
      opciones: ['$1$', '$2$', '$3$', '$4$', '$5$'],
      respuesta: 'd',
    },
    {
      n: 9, area: 'Teoría de Números',
      enunciado: String.raw`Los dígitos 2, 0, 2 y 3 se colocan en la siguiente expresión, un dígito por casilla. ¿Cuál es el valor máximo posible de la expresión?
$$\square^{\square} \times \square^{\square}$$`,
      respuesta: '9',
    },
    {
      n: 10, area: 'Álgebra',
      enunciado: String.raw`En la siguiente tabla, Rebeca sumó el valor de cada emoji de cada fila para obtener cada número escrito en la cuarta columna. ¿Qué valor le hace falta?`,
      figuras: [{ archivo: '2023-estatal-n2-p10.png', alt: 'Tabla de 3 filas con tres emojis y una suma. Fila 1: corazón en llamas, pulgar arriba, pulgar arriba; suma 115. Fila 2: carita riendo, carita riendo, corazón en llamas; suma 125. Fila 3: corazón en llamas, pulgar arriba, carita riendo; suma desconocida.' }],
      respuesta: '120',
    },
    {
      n: 11, area: 'Combinatoria',
      enunciado: String.raw`Amairani tiene 2 vestidos (uno rojo y uno azul), 2 playeras (una azul y una morada) y 2 suéteres (uno blanco y uno azul). Va a colgar dichas prendas en una fila con seis ganchos de tal manera que coloca todas las de igual color una al lado de la otra. ¿De cuántas maneras puede hacerlo?`,
      respuesta: '144',
    },
    {
      n: 12, area: 'Combinatoria',
      enunciado: String.raw`Cristian va a tramitar una tarjeta bancaria. En el banco le pidieron crear una clave que consiste en un número usando cuatro dígitos del 0 al 9 de tal manera que no está permitido que los cuatro dígitos sean iguales ni que tampoco todos sean dígitos consecutivos. Por ejemplo, claves como 3333 y 3456 no están permitidas; en cambio, 0333 y 0345 sí lo están. ¿Cuántas claves puede armar Cristian?`,
      respuesta: '9983',
    },
    {
      n: 13, area: 'Geometría',
      enunciado: String.raw`En el triángulo $ABC$, se toma el punto $D$ sobre el segmento $BC$ tal que $BA = AD$. Además $\angle BAD = 40^\circ$ y $E$ es el punto del segmento $AD$ tal que $\angle ECD = 25^\circ$. Calcular la medida, en grados, del ángulo $\angle AEC$.`,
      respuesta: '$135^\\circ$',
    },
    {
      n: 14, area: 'Álgebra',
      enunciado: String.raw`¿Cuál es el valor de $1 + 3 + 5 + \cdots + 2019 + 2021 + 2023 - 2 - 4 - 6 - \cdots - 2020 - 2022$?`,
      respuesta: '1012',
    },
    {
      n: 15, area: 'Teoría de Números',
      enunciado: String.raw`Calcula cuántos enteros positivos de seis cifras, no necesariamente distintas, cumplen con lo siguiente:

• 2023 aparece en el número.
• Para las dos cifras restantes, se usan números primos.
• Son múltiplos de 3.

Por ejemplo, 320232 es uno de ellos, pero no 230232.`,
      respuesta: '15',
    },
  ],
}
