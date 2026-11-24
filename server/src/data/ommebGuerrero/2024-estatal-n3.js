// 8a OMMEB Guerrero · Concurso Estatal · Nivel 3 (22 de junio de 2024).
// Transcrito de «Estatal_N3___8aOMMEBGro (RESP).pdf».
export default {
  edicion: 8,
  year: '2024',
  etapa: 'Estatal',
  nivel: 3,
  grados: '2º de secundaria',
  fecha: '22 de junio de 2024',
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
      enunciado: String.raw`El largo de un rectángulo es tres veces su alto. Si el perímetro y el área son ambos iguales a $k$, ¿cuál es el valor de $k$?`,
      opciones: ['$8$', '$\\dfrac{8}{3}$', '$\\dfrac{64}{3}$', '$\\dfrac{3}{8}$', '$3$'],
      respuesta: 'c',
    },
    {
      n: 2, area: 'Combinatoria',
      enunciado: String.raw`Una baraja tiene cuatro cartas rojas etiquetadas $A$, $B$, $C$, $D$ y cuatro cartas verdes etiquetadas $A$, $B$, $C$, $D$. Cristian toma dos cartas al azar. Una pareja ganadora son dos del mismo color o dos de la misma letra. ¿Cuál es la probabilidad de que Cristian haya sacado una pareja ganadora?`,
      opciones: ['$\\dfrac{2}{7}$', '$\\dfrac{3}{8}$', '$\\dfrac{1}{2}$', '$\\dfrac{4}{7}$', '$\\dfrac{5}{8}$'],
      respuesta: 'd',
    },
    {
      n: 3, area: 'Combinatoria',
      enunciado: String.raw`Paulina va a colorear un rectángulo que está dividido en 5 regiones, como se muestra. Ella debe pintar cada región de un color sólido (rojo, naranja, amarillo, azul o verde) de modo que las regiones que se tocan se pinten de diferentes colores y los colores se puedan usar más de una vez. ¿Cuántos coloreos diferentes son posibles?`,
      figuras: [{ archivo: '2024-estatal-n3-p03.png', alt: 'Rectángulo dividido en dos filas: la de arriba en 2 regiones y la de abajo en 3 regiones (angosta, ancha, mediana), con las divisiones desalineadas.' }],
      opciones: ['$120$', '$270$', '$360$', '$540$', '$720$'],
      respuesta: 'd',
    },
    {
      n: 4, area: 'Geometría',
      enunciado: String.raw`Los catetos de un triángulo rectángulo miden 5 y 12. Calcula la longitud de la altura trazada a la hipotenusa.`,
      opciones: ['$13$', '$\\dfrac{60}{13}$', '$\\dfrac{30}{13}$', '$\\dfrac{120}{13}$', '$60$'],
      respuesta: 'b',
    },
    {
      n: 5, area: 'Álgebra',
      enunciado: String.raw`Sea $N = 2024^{2024}$. ¿Cuál de las siguientes opciones es equivalente a $\dfrac{N}{4^4}$?`,
      opciones: ['$506^{2020} \\times 4^4$', '$2024^{2020}$', '$2024^{2020} \\times 506^4$', '$506^{2020}$', '$506^4 \\times 4^{2020}$'],
      respuesta: 'c',
    },
    {
      n: 6, area: 'Combinatoria',
      enunciado: String.raw`Considera los números de 7 cifras formados solo por los dígitos 1 y 2. ¿En cuántos de ellos aparece el 1 más veces que el 2?`,
      opciones: ['$64$', '$35$', '$128$', '$99$', '$63$'],
      respuesta: 'a',
    },
    {
      n: 7, area: 'Álgebra',
      enunciado: String.raw`La suma de tres números es 96. El primer número es igual a 6 veces el tercer número; y el tercer número es 40 menos que el segundo número. ¿Cuál es el valor absoluto de la diferencia entre el primer y segundo número?`,
      opciones: ['$1$', '$2$', '$3$', '$4$', '$5$'],
      respuesta: 'e',
    },
    {
      n: 8, area: 'Geometría',
      enunciado: String.raw`Obed dibuja un triángulo rectángulo $PQR$, con $\angle Q = 90^\circ$, $PQ = 3$ y $QR = 4$. Posteriormente, coloca puntos $S$, $T$ y $U$ en los lados $PQ$, $PR$ y $QR$, respectivamente, de modo que $QSTU$ es un cuadrado. ¿Cuál es la longitud del lado del cuadrado dibujado por Obed?`,
      opciones: ['$2$', '$\\dfrac{9}{7}$', '$\\dfrac{3}{2}$', '$\\dfrac{7}{12}$', '$\\dfrac{12}{7}$'],
      respuesta: 'e',
    },
    {
      n: 9, area: 'Geometría',
      enunciado: String.raw`Los siguientes tres triángulos rectángulos son semejantes. Se sabe que
$$AF = FE, \qquad AD = DC, \qquad AG = 250, \qquad GF = 150.$$
¿Cuál es el perímetro del triángulo más grande?`,
      figuras: [{ archivo: '2024-estatal-n3-p09.png', alt: 'Tres triángulos rectángulos con vértice común A: AGF con ángulo recto en F, AED con ángulo recto en D y ACB con ángulo recto en B. F está en AE y D está en AC; los ángulos en A de los tres triángulos están marcados iguales.' }],
      respuesta: '1536',
    },
    {
      n: 10, area: 'Teoría de Números',
      enunciado: String.raw`Calcula el último dígito de la suma:
$$1 + 2^2 + 3^{3^3} + 4^{4^{4^4}} + 5^{5^{5^{5^5}}}.$$`,
      respuesta: '3',
    },
    {
      n: 11, area: 'Combinatoria',
      enunciado: String.raw`¿Cuántos triángulos puedes dibujar que tengan sus vértices en los puntos de esta figura?`,
      figuras: [{ archivo: '2024-estatal-n1-p08.png', alt: 'Siete puntos: cuatro alineados en vertical y, desde el segundo punto de arriba, otros tres alineados hacia la derecha en horizontal, formando una T acostada.' }],
      respuesta: '27',
    },
    {
      n: 12, area: 'Álgebra',
      enunciado: String.raw`Sebas puede caminar cierta distancia en 20 minutos y Migue puede caminar la misma distancia en 30 minutos. Si Sebas parte 5 minutos después que Migue, ¿cuánto tiempo habrá estado caminando Migue antes de que Sebas lo alcance?`,
      respuesta: '15 minutos',
    },
    {
      n: 13, area: 'Combinatoria',
      enunciado: String.raw`En una caja de 8 crayones de distinto color, hay uno negro. ¿De cuántas maneras diferentes puede un profesor dar crayones a un estudiante de tal forma que entre los crayones que el estudiante reciba esté el crayón negro?

(Nota: el estudiante puede recibir de 1 a 8 crayones.)`,
      respuesta: '128',
    },
    {
      n: 14, area: 'Teoría de Números',
      enunciado: String.raw`Considere los siguientes cien conjuntos de 10 elementos cada uno:
$$\{1, 2, 3, \ldots, 10\},\quad \{11, 12, 13, \ldots, 20\},\quad \{21, 22, 23, \ldots, 30\},\quad \ldots,\quad \{991, 992, 993, \ldots, 1000\}.$$
¿Cuántos de estos conjuntos contienen exactamente dos múltiplos de 7?`,
      respuesta: '42',
    },
    {
      n: 15, area: 'Geometría',
      enunciado: String.raw`Sea $ABCD$ un cuadrilátero que cumple que, al trazar el segmento $BD$, se tiene que $\angle ADB = \angle DCB = 90^\circ$. Además sabemos que el triángulo $\triangle ADB$ es semejante al triángulo $\triangle DCB$. Posteriormente se coloca un punto $E$ sobre $BD$, tal que $\angle BAE = \angle EAD$ y $AE$ es paralelo a $CD$. ¿Cuánto mide el ángulo $\angle DAB$?`,
      respuesta: '$60^\\circ$',
    },
  ],
}
