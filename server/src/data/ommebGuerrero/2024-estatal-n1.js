// 8a OMMEB Guerrero · Concurso Estatal · Nivel 1 (22 de junio de 2024).
// Transcrito de «Estatal_N1___8aOMMEBGro (RESP).pdf».
export default {
  edicion: 8,
  year: '2024',
  etapa: 'Estatal',
  nivel: 1,
  grados: '4º y 5º de primaria',
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
      n: 1, area: 'Teoría de Números',
      enunciado: String.raw`Tenemos los enteros positivos $A$, $B$ y $C$ que cumplen las siguientes sumas:
$$\begin{array}{r} A \\ +\; A \\ B \\ \hline 7 \end{array} \qquad\qquad \begin{array}{r} C \\ +\; B \\ C \\ \hline 11 \end{array} \qquad\qquad \begin{array}{r} B \\ +\; C \\ A \\ \hline 9 \end{array}$$
¿Cuántos valores puede tomar $C$?`,
      opciones: ['$1$', '$2$', '$3$', '$4$', '$5$'],
      respuesta: 'c',
    },
    {
      n: 2, area: 'Geometría',
      enunciado: String.raw`Afuera de un cuadrado $ABCD$ se colocó un punto $E$ de modo que $\angle CDE = 110^\circ$. El punto $F$ se eligió en $AD$ para que $DE = DF$. ¿Cuál es la medida de $\angle AFE$?`,
      figuras: [{ archivo: '2024-estatal-n1-p02.png', alt: 'Cuadrado ABCD con A arriba a la izquierda y D arriba a la derecha. E está afuera, arriba a la derecha de D, y F está sobre AD; se traza el segmento FE.' }],
      opciones: ['$160^\\circ$', '$164^\\circ$', '$166^\\circ$', '$170^\\circ$', '$174^\\circ$'],
      respuesta: 'd',
    },
    {
      n: 3, area: 'Combinatoria',
      enunciado: String.raw`En una práctica de ajedrez se ha colocado la siguiente configuración. ¿Qué peón blanco debo mover primero si quiero que al menos uno llegue a la fila 8?

Nota: Un peón sólo avanza una casilla por turno, “come” en diagonal y los peones negros jugarán a ganar.`,
      figuras: [{ archivo: '2024-estatal-n1-p03.png', alt: 'Tablero de 3 columnas (A, B y C) y filas 5 a 8. Hay peones negros en la fila 7 en las tres columnas y peones blancos en la fila 5 en las tres columnas.' }],
      opciones: ['Peón $A$', 'Peón $B$', 'Peón $C$', 'Ninguno se logra coronar.', 'Cualquiera funciona.'],
      respuesta: 'b',
    },
    {
      n: 4, area: 'Combinatoria',
      enunciado: String.raw`Jonathan escribe todos los números enteros positivos de cuatro cifras en los cuales al sumarle a 6837 “no se lleva nada” (no hay acarreo) en ninguna columna y el resultado sigue siendo un número de cuatro cifras.

Por ejemplo, uno de los números que escribió es 1022 porque no hay acarreo en ninguna columna; sin embargo, él no escribe al 1358 porque sí hay acarreos (observa las sumas de abajo).
$$\begin{array}{r} 6837 \\ +\; 1022 \\ \hline 7859 \end{array} \qquad\qquad \begin{array}{r} {\scriptstyle 1\;\;\;1\;\;} \\ 6837 \\ +\; 1358 \\ \hline 8195 \end{array}$$
¿Cuántos números anotó Jonathan?`,
      opciones: ['$18$', '$63$', '$126$', '$36$', '$168$'],
      respuesta: 'c',
    },
    {
      n: 5, area: 'Combinatoria',
      enunciado: String.raw`¿Cuántos números enteros positivos de cuatro dígitos (es decir, enteros entre 1000 y 9999, inclusive) que tienen sólo dígitos pares son divisibles por 5?`,
      opciones: ['$80$', '$100$', '$125$', '$200$', '$500$'],
      respuesta: 'b',
    },
    {
      n: 6, area: 'Combinatoria',
      enunciado: String.raw`En una isla únicamente existen monedas de 1, 5, 10, 25 y 50 pesos. ¿Cuál es la menor cantidad de monedas que Estefania necesitaría para poder pagar cualquier artículo con un precio menor a 100 pesos?`,
      opciones: ['$6$', '$10$', '$15$', '$25$', '$99$'],
      respuesta: null,
      nota: 'La hoja oficial de respuestas no marca ninguna opción para este problema.',
    },
    {
      n: 7, area: 'Geometría',
      enunciado: String.raw`Un triángulo $ABC$ es isósceles, $AB = AC$ y $\angle A = 40^\circ$. $P$ es un punto interior del triángulo de tal forma que $\angle PBC = \angle PCA$. Calcula el valor del ángulo $\angle BPC$.`,
      opciones: ['$70^\\circ$', '$90^\\circ$', '$100^\\circ$', '$110^\\circ$', '$120^\\circ$'],
      respuesta: 'd',
    },
    {
      n: 8, area: 'Combinatoria',
      enunciado: String.raw`¿Cuántos triángulos puedes dibujar que tengan sus vértices en los puntos de esta figura?`,
      figuras: [{ archivo: '2024-estatal-n1-p08.png', alt: 'Siete puntos: cuatro alineados en vertical y, desde el segundo punto de arriba, otros tres alineados hacia la derecha en horizontal, formando una T acostada.' }],
      opciones: ['$35$', '$31$', '$10$', '$20$', '$27$'],
      respuesta: 'e',
    },
    {
      n: 9, area: 'Combinatoria',
      enunciado: String.raw`¿Cuántas palabras distintas se pueden escribir revolviendo las letras de la palabra GUERRERO?`,
      respuesta: '3360',
    },
    {
      n: 10, area: 'Geometría',
      enunciado: String.raw`En la figura se muestran varios ángulos rectos y un ángulo de $40^\circ$. ¿Cuánto mide el ángulo marcado con $x$?`,
      figuras: [{ archivo: '2024-estatal-n1-p10.png', alt: 'Una línea en zigzag que rebota entre dos rectas que se cruzan varias veces; los ángulos marcados en cada rebote son rectos, el ángulo de la izquierda mide $40^\\circ$ y el de la derecha es $x$.' }],
      respuesta: '$50^\\circ$',
    },
    {
      n: 11, area: 'Teoría de Números',
      enunciado: String.raw`Jonathan anotó los siguientes números en el pizarrón:
$$1 \times 15, \quad 2 \times 15, \quad 3 \times 15, \quad 4 \times 15, \quad \ldots, \quad 2024 \times 15.$$
¿Cuántos de ellos son múltiplos de 18?`,
      respuesta: '337',
    },
    {
      n: 12, area: 'Geometría',
      enunciado: String.raw`En la esquina sureste de un terreno de 40 m por 40 m se construyó un cuarto de 8 m por 8 m. El dueño del terreno quiere dividir la parte restante con dos cercas en forma de L en tres regiones en forma de L de la misma área, como lo muestra la figura. Cada segmento de la cerca es perpendicular a un lado del terreno, y los dos segmentos de la misma cerca tienen igual longitud. ¿Cuál es la longitud, en metros, de la cerca más chica?`,
      figuras: [{ archivo: '2024-estatal-n1-p12.png', alt: 'Terreno cuadrado con un cuadrito en la esquina inferior derecha y dos cercas en forma de L que dividen el resto en tres regiones en forma de L.' }],
      respuesta: '48 m',
    },
    {
      n: 13, area: 'Álgebra',
      enunciado: String.raw`Calcula el valor de $3 + 6 + 9 + 12 + \cdots + 300$.`,
      respuesta: '15150',
    },
    {
      n: 14, area: 'Combinatoria',
      enunciado: String.raw`En la cuadrícula aparecen los números 1, 2 y 3 como se muestra. ¿De cuántas maneras diferentes se pueden colocar los números 4, 5, 6, 7, 8 y 9 (una vez cada uno) de manera que la suma de los números de cada renglón y de cada columna sea la misma?`,
      figuras: [{ archivo: '2024-estatal-n1-p14.png', alt: 'Cuadrícula de 3 por 3 con el 1 en la esquina superior izquierda, el 2 en el centro y el 3 en la esquina inferior derecha; las demás casillas están vacías.' }],
      respuesta: '2',
    },
    {
      n: 15, area: 'Combinatoria',
      enunciado: String.raw`Estefania quiere construir una palabra de 6 letras usando las letras O, M, E y B, de tal manera que:

• Las primeras tres letras sean todas distintas, así como también las últimas tres.
• La primera, segunda, cuarta y quinta letras sean distintas entre sí.

¿Cuántas palabras distintas puede construir?

Ejemplo: Una palabra que puede formar es OMBBEO.`,
      respuesta: '96',
    },
  ],
}
