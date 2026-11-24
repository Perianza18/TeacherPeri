// 7a OMMEB Guerrero · Concurso Estatal Selectivo · Nivel 1 (22 de agosto de 2023).
// Transcrito de «Selectivo-N1 - 7OMMEBGro (RESP).pdf».
export default {
  edicion: 7,
  year: '2023',
  etapa: 'Selectivo',
  nivel: 1,
  grados: '4º y 5º de primaria',
  fecha: '22 de agosto de 2023',
  duracionMinutos: 90,
  indicaciones: [
    'La duración del examen es de 90 minutos.',
    'El uso de celulares, calculadoras, electrónicos, formularios y tablas no está permitido.',
    'Las figuras no están a escala, sólo son representativas.',
    'Todos los problemas son de respuesta corta: se escribe el valor numérico de la respuesta. Cada problema vale 5 puntos; no hay puntos parciales ni penalización por respuesta incorrecta.',
  ],
  problemas: [
    {
      n: 1, area: 'Geometría',
      enunciado: String.raw`Para llegar del punto $A$ al punto $B$ una hormiga debe seguir algún camino que se forme con algunos de los segmentos del siguiente rectángulo que fue dividido en 8 cuadrados iguales. La hormiga caminó siguiendo la línea resaltada, recorriendo un total de 45 metros. ¿Cuántos metros habría recorrido si hubiera elegido el camino más corto?`,
      figuras: [{ archivo: '2023-selectivo-n1-p01.png', alt: 'Rectángulo de 2 por 4 cuadritos con A en la esquina inferior izquierda y B en la superior derecha. Un camino resaltado en zigzag sube y baja por las líneas de la cuadrícula desde A hasta B.' }],
      respuesta: '27 metros',
    },
    {
      n: 2, area: 'Combinatoria',
      enunciado: String.raw`Tres personas suben en la planta baja al ascensor de un edificio que tiene cinco pisos. Al bajar del elevador, todos van a llegar a su habitación y no piensan volver a salir. ¿De cuántas maneras diferentes pueden ir saliendo del ascensor si no baja más de una persona por piso?`,
      respuesta: '60',
    },
    {
      n: 3, area: 'Teoría de Números',
      enunciado: String.raw`¿Cuántos enteros positivos de tres dígitos cumplen que la suma de sus tres cifras es igual al número de dos dígitos formado con las centenas y decenas? Por ejemplo, 159 es uno de ellos, pues $1 + 5 + 9 = 15$.

Nota: La centena de un entero de tres dígitos no puede ser igual a 0.`,
      respuesta: '10',
    },
    {
      n: 4, area: 'Geometría',
      enunciado: String.raw`Abril dibujó montañas creando triángulos isósceles continuos con base en una misma recta y haciendo que el ángulo en la punta sea $10^\circ$ menor que el anterior.

Abril se detuvo hasta que una montaña fue un triángulo equilátero. ¿Cuál es la suma de todos los ángulos que separan cada par de montañas consecutivas? (En la figura, se han sombreado dos de los ángulos cuya suma es buscada.)`,
      figuras: [{ archivo: '2023-selectivo-n1-p04.png', alt: 'Tres montañas (triángulos isósceles) seguidas sobre una recta, con ángulos en la punta de $130^\\circ$, $120^\\circ$ y $110^\\circ$. Están sombreados los ángulos entre montañas consecutivas.' }],
      respuesta: '$665^\\circ$',
    },
    {
      n: 5, area: 'Geometría',
      enunciado: String.raw`¿Cuántos pares de aristas paralelas, como $AB$ y $CD$, o $BD$ y $FG$, tiene un cubo?`,
      figuras: [{ archivo: '2023-selectivo-n1-p05.png', alt: 'Cubo con vértices A, B, C, D, E, F, G y H.' }],
      respuesta: '18',
    },
    {
      n: 6, area: 'Combinatoria',
      enunciado: String.raw`En la fonda del sr. Jonathan se arman paquetes de comida que incluyen: tres platillos distintos, dos salsas (no necesariamente distintas) y tres bebidas (no necesariamente distintas). Si la fonda dispone de 5 tipos de platillos, 4 tipos de salsas y 5 bebidas de sabores distintos, ¿cuántos paquetes diferentes se pueden armar?`,
      respuesta: '20000',
    },
    {
      n: 7, area: 'Geometría',
      enunciado: String.raw`La figura está formada por tres triángulos equiláteros. El perímetro del triángulo equilátero grande es de 48 cm. El perímetro del segundo triángulo es la mitad del primero y el perímetro del tercero es la mitad del segundo. ¿Cuál es el perímetro de la figura?`,
      figuras: [{ archivo: '2023-selectivo-n1-p07.png', alt: 'Tres triángulos equiláteros de tamaño decreciente, colocados uno junto al otro y encimados en parte, formando una figura; los lados interiores están punteados.' }],
      respuesta: '60 cm',
    },
    {
      n: 8, area: 'Combinatoria',
      enunciado: String.raw`En la sopa de letras, ¿por cuántos caminos diferentes se puede encontrar la palabra OMEB? Un camino sólo permite movimientos de una letra a otra letra adyacente (arriba, abajo, izquierda o derecha, pero no en diagonal), todos comenzando desde la O en el centro. Por ejemplo, un camino se muestra en la figura.`,
      figuras: [{ archivo: '2023-selectivo-n1-p08.png', alt: 'Sopa de letras en forma de rombo con la O en el centro, rodeada de M, luego E y luego B. Un camino marcado va de la O a la M de su izquierda, sube a la E y luego a la B.' }],
      respuesta: '24',
    },
    {
      n: 9, area: 'Geometría',
      enunciado: String.raw`En un triángulo $ABC$ la longitud de la altura $CH$, con $H$ en el segmento $AB$, es igual a la mitad del lado $AB$. Si $\angle BAC = 45^\circ$, encuentra la medida del $\angle ABC$.`,
      respuesta: '$45^\\circ$',
    },
    {
      n: 10, area: 'Álgebra',
      enunciado: String.raw`En su primer día de trabajo, Rebeca vendió una mantecada. El segundo día, vendió tres mantecadas. En el día tres, vendió cinco mantecadas, y cada día siguiente vendió dos mantecadas más de las que había vendido el día anterior. ¿Cuántas mantecadas en total vendió Rebeca después de trabajar 20 días?`,
      respuesta: '400',
    },
    {
      n: 11, area: 'Teoría de Números',
      enunciado: String.raw`Estefania sumó los números $\overline{OMM}$ y $\overline{EB}$ (formados por las letras “O”, “M”, “E”, “B”), donde cada letra distinta representa un dígito distinto, y todas son distintas de cero; y obtuvo lo siguiente:
$$\begin{array}{r} O\,M\,M \\ +\;\;\; E\,B \\ \hline 9\,2\,3 \end{array}$$
¿A qué es igual la suma de los dígitos $O + M + M + E + B$?`,
      respuesta: '32',
    },
    {
      n: 12, area: 'Teoría de Números',
      enunciado: String.raw`Un entero mayor a 7 se conoce como fan del bicho si es múltiplo de 7 y además al sumar sus dígitos el resultado es 7. ¿Cuál es el entero fan del bicho más pequeño?`,
      respuesta: '70',
    },
    {
      n: 13, area: 'Combinatoria',
      enunciado: String.raw`¿Cuántos números de cuatro dígitos tienen exactamente tres dígitos iguales?`,
      respuesta: '324',
    },
    {
      n: 14, area: 'Geometría',
      enunciado: String.raw`En un trapecio $ABCD$, con $AB$ paralela a $DC$, y ángulos $\angle ADC = \angle BCD = 45^\circ$, se tiene que $AB = 5$ y $CD = 9$. Encuentra el área del trapecio.

Nota: Un trapecio es un cuadrilátero con un par de lados paralelos.`,
      respuesta: '14',
    },
    {
      n: 15, area: 'Combinatoria',
      enunciado: String.raw`Cristian va a vestirse con gorra, pantalón y playera, y quiere hacerlo de tal forma que las tres prendas sean de distinto color. Tiene que elegir entre gorra de color blanco o negro; pantalón de color blanco, negro, rojo o azul; playera de color blanca, negra, roja, azul, morada o café. ¿De cuántas maneras distintas puede hacerlo?`,
      respuesta: '20',
    },
  ],
}
