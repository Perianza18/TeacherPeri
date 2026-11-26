// 7a OMMEB Guerrero · Concurso Estatal · Nivel 3 (8 de julio de 2023).
// Transcrito de «Estatal_N3_7OMMEBGro (RESP).pdf».
export default {
  edicion: 7,
  year: '2023',
  etapa: 'Estatal',
  nivel: 3,
  grados: '2º de secundaria',
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
      n: 1, area: 'Geometría',
      enunciado: String.raw`Un triángulo $ABC$ tiene área igual a $60$ cm$^2$. Se escoge $D$ en $BC$ tal que $DC$ es la tercera parte de $BC$. ¿Cuál es el área del triángulo $ADC$?`,
      opciones: ['$10$ cm$^2$', '$20$ cm$^2$', '$30$ cm$^2$', '$40$ cm$^2$', '$50$ cm$^2$'],
      respuesta: 'b',
    },
    {
      n: 2, area: 'Teoría de Números',
      enunciado: String.raw`Cierto entero es divisible por sólo cuatro de los siguientes números: $\{6, 15, 20, 21, 70\}$. ¿Qué número no divide a dicho entero?`,
      opciones: ['$6$', '$15$', '$20$', '$21$', '$70$'],
      respuesta: 'c',
    },
    {
      n: 3, area: 'Combinatoria',
      enunciado: String.raw`Amairani elige aleatoriamente tres puntos de la cuadrícula que se muestra. Cada conjunto de tres puntos tiene la misma probabilidad de ser elegido. ¿Cuál es la probabilidad de que los puntos que eligió se encuentren en la misma línea recta?`,
      figuras: [{ archivo: '2023-estatal-n3-p03.png', alt: 'Cuadrícula de 3 por 3 puntos.' }],
      opciones: ['$\\dfrac{1}{14}$', '$\\dfrac{1}{28}$', '$\\dfrac{1}{21}$', '$\\dfrac{1}{7}$', '$\\dfrac{2}{21}$'],
      respuesta: 'e',
    },
    {
      n: 4, area: 'Teoría de Números',
      enunciado: String.raw`Juan pescó entre 60 y 90 cuatetes. Planea venderlos por montones. Si los apila de cuatro en cuatro, le sobran 3; y si los apila de cinco en cinco, le sobra 1. ¿Cuántos cuatetes pescó?`,
      opciones: ['$71$', '$66$', '$81$', '$61$', '$86$'],
      respuesta: 'a',
    },
    {
      n: 5, area: 'Geometría',
      enunciado: String.raw`En el triángulo $ABC$, un punto $E$ está en $AB$ con $AE = 1$ y $EB = 2$. El punto $D$ está en $AC$ de modo que $DE$ y $BC$ son paralelas y el punto $F$ está en $BC$ tal que $EF$ es paralela a $AC$. Si el área de $ABC$ es 9, ¿cuál es el área de $CDEF$?`,
      figuras: [{ archivo: '2023-estatal-n2-p08.png', alt: 'Triángulo ABC con base AB; E está en AB con $AE = 1$ y $EB = 2$. D está en AC con DE paralela a BC, y F está en BC con EF paralela a AC.' }],
      opciones: ['$1$', '$2$', '$3$', '$4$', '$5$'],
      respuesta: 'd',
    },
    {
      n: 6, area: 'Teoría de Números',
      enunciado: String.raw`Un número es llamado fiel si tiene exactamente dos dígitos y la suma de ellos equivale a una cuarta parte del número. Por ejemplo, 24 es fiel pues $2 + 4 = 6$ y este resultado es la cuarta parte de 24. ¿Cuánto vale la suma de todos los números fieles?`,
      opciones: ['$24$', '$36$', '$72$', '$84$', '$120$'],
      respuesta: 'e',
    },
    {
      n: 7, area: 'Combinatoria',
      enunciado: String.raw`¿Cuántos triángulos escalenos se forman usando tres de los vértices de un octágono regular?`,
      opciones: ['$36$', '$40$', '$44$', '$48$', '$52$'],
      respuesta: 'b',
    },
    {
      n: 8, area: 'Geometría',
      enunciado: String.raw`Dentro de un hexágono regular $ABCDEF$, Sebastián dibujó segmentos en forma de “escaleras” con las siguientes medidas:
$$CP = 1 \text{ cm}, \quad PQ = 2 \text{ cm}, \quad QR = 3 \text{ cm}, \quad RS = 4 \text{ cm}, \quad ST = 5 \text{ cm}, \quad TF = 6 \text{ cm}.$$
¿Cuánto mide el lado del hexágono?`,
      figuras: [{ archivo: '2023-estatal-n3-p08.png', alt: 'Hexágono regular ABCDEF y, dentro, una línea en zigzag C, P, Q, R, S, T, F con ángulos rectos en P, Q, R, S y T.' }],
      opciones: ['$6$ cm', '$6.5$ cm', '$7$ cm', '$7.5$ cm', '$8$ cm'],
      respuesta: null,
      nota: 'La hoja oficial de respuestas no marca ninguna opción para este problema.',
    },
    {
      n: 9, area: 'Álgebra',
      enunciado: String.raw`En la siguiente tabla, Ángel sumó el valor de cada emoji de cada fila para obtener cada número escrito en la cuarta columna. ¿Qué valor le hace falta?`,
      figuras: [{ archivo: '2023-estatal-n2-p10.png', alt: 'Tabla de 3 filas con tres emojis y una suma. Fila 1: corazón en llamas, pulgar arriba, pulgar arriba; suma 115. Fila 2: carita riendo, carita riendo, corazón en llamas; suma 125. Fila 3: corazón en llamas, pulgar arriba, carita riendo; suma desconocida.' }],
      respuesta: '120',
    },
    {
      n: 10, area: 'Teoría de Números',
      enunciado: String.raw`Los dígitos 2, 0, 2 y 3 se colocan en la siguiente expresión, un dígito por casilla. ¿Cuál es el valor máximo posible de la expresión?
$$\square^{\square} \times \square^{\square}$$`,
      respuesta: '9',
    },
    {
      n: 11, area: 'Combinatoria',
      enunciado: String.raw`Brandon tiene 2 camisas (una roja y una azul), 2 playeras (una azul y una morada) y 2 suéteres (uno blanco y uno azul). Va a colgar dichas prendas en una fila con seis ganchos de tal manera que coloca todas las de igual color una al lado de la otra. ¿De cuántas maneras puede hacerlo?`,
      respuesta: '144',
    },
    {
      n: 12, area: 'Teoría de Números',
      enunciado: String.raw`Luis escribió 2023 dígitos en una línea de tal manera que cada par de dígitos juntos forman un número divisible por 17 o 23. Si 8 es el último de los 2023 dígitos, ¿cuál es el primero?`,
      respuesta: '4',
    },
    {
      n: 13, area: 'Geometría',
      enunciado: String.raw`En la siguiente figura, Abril elige un punto $D$ en $BC$ para que los triángulos $\triangle ACD$ y $\triangle ABD$ tengan perímetros iguales. ¿Cuál es el área del $\triangle ABD$?`,
      figuras: [{ archivo: '2023-estatal-n3-p13.png', alt: 'Triángulo rectángulo con ángulo recto en A: $AC = 20$, $AB = 15$ y $BC = 25$.' }],
      respuesta: '90',
    },
    {
      n: 14, area: 'Combinatoria',
      enunciado: String.raw`En Ommeblandia tienen un diccionario con palabras que resultan de reordenar las siguientes letras y números: O, M, M, E, B, 1, 2, 3. Por ejemplo, una de las palabras que aparecen es 2OM3B1EM. El orden alfabético de ese diccionario sigue esta jerarquía: primero van los números y después las letras, de menor a mayor. Así, 123BEMMO es la primera palabra y OMMEB321 es la última. ¿Qué posición ocupa la palabra OMMEB123?`,
      respuesta: '20155',
    },
    {
      n: 15, area: 'Geometría',
      enunciado: String.raw`En el triángulo $ABC$, el punto $D$ está en el lado $AC$ y el punto $E$ en el lado $BC$. Las medidas de los ángulos $\angle ABD$, $\angle BAE$, $\angle CAE$ y $\angle CBD$ son $30^\circ$, $60^\circ$, $20^\circ$ y $30^\circ$, respectivamente. Encuentre la medida, en grados, del ángulo $\angle AED$.`,
      respuesta: '$20^\\circ$',
    },
  ],
}
