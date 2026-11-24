// 8a OMMEB Guerrero · Concurso Estatal · Nivel 2 (22 de junio de 2024).
// Transcrito de «Estatal_N2___8aOMMEBGro (RESP).pdf».
export default {
  edicion: 8,
  year: '2024',
  etapa: 'Estatal',
  nivel: 2,
  grados: '6º de primaria y 1º de secundaria',
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
      enunciado: String.raw`¿Cuántos números enteros $m$ hacen que $\frac{2m - 12}{m + 6}$ también sea un número entero?`,
      opciones: ['$1$', '$4$', '$8$', '$12$', '$16$'],
      respuesta: 'e',
    },
    {
      n: 2, area: 'Álgebra',
      enunciado: String.raw`Sea $N = 8^{2024}$. ¿Cuál de las siguientes opciones es equivalente a $\dfrac{N}{4^{2020}}$?`,
      opciones: ['$2^4$', '$4^{1008}$', '$4^{2016}$', '$2^{2020}$', '$2^{1014}$'],
      respuesta: null,
      nota: 'La hoja oficial de respuestas no marca ninguna opción para este problema.',
    },
    {
      n: 3, area: 'Combinatoria',
      enunciado: String.raw`Una baraja tiene cuatro cartas rojas etiquetadas $A$, $B$, $C$, $D$ y cuatro cartas verdes etiquetadas $A$, $B$, $C$, $D$. Jorgelder toma dos cartas al azar. Una pareja ganadora son dos del mismo color o dos de la misma letra. ¿Cuál es la probabilidad de que Jorgelder haya sacado una pareja ganadora?`,
      opciones: ['$\\dfrac{2}{7}$', '$\\dfrac{3}{8}$', '$\\dfrac{1}{2}$', '$\\dfrac{4}{7}$', '$\\dfrac{5}{8}$'],
      respuesta: 'd',
    },
    {
      n: 4, area: 'Álgebra',
      enunciado: String.raw`Calcula la suma de todos los enteros entre 30 y 300 que terminan en 1.`,
      opciones: ['$4347$', '$4351$', '$4678$', '$4377$', '$4648$'],
      respuesta: 'a',
    },
    {
      n: 5, area: 'Combinatoria',
      enunciado: String.raw`En una práctica de ajedrez se ha colocado la siguiente configuración. ¿Qué peón blanco debo mover primero si quiero que al menos uno llegue a la fila 8?

Nota: Un peón sólo avanza una casilla por turno, “come” en diagonal y los peones negros jugarán a ganar.`,
      figuras: [{ archivo: '2024-estatal-n1-p03.png', alt: 'Tablero de 3 columnas (A, B y C) y filas 5 a 8. Hay peones negros en la fila 7 en las tres columnas y peones blancos en la fila 5 en las tres columnas.' }],
      opciones: ['Peón $A$', 'Peón $B$', 'Peón $C$', 'Ninguno se logra coronar.', 'Cualquiera funciona.'],
      respuesta: 'b',
    },
    {
      n: 6, area: 'Geometría',
      enunciado: String.raw`En la figura se muestran cuatro círculos iguales tangentes entre sí y de radio 1 cm. Entre ellos se encuentra un círculo que es tangente a los cuatro anteriores. ¿Cuánto vale el área sombreada?`,
      figuras: [{ archivo: '2024-estatal-n2-p06.png', alt: 'Cuatro círculos iguales acomodados en un cuadrado de 2 por 2, tangentes entre sí, y un círculo pequeño en medio tangente a los cuatro. Está sombreada la región entre los cuatro círculos grandes que queda fuera del círculo pequeño.' }],
      opciones: [
        String.raw`$4 - 4\pi - \pi\left(\sqrt{2} - 1\right)^2$ cm$^2$`,
        String.raw`$4 - \pi - \left(\sqrt{2} - 1\right)^2$ cm$^2$`,
        String.raw`$4 - 4\pi - 4\pi\left(\sqrt{2} - 1\right)^2$ cm$^2$`,
        String.raw`$4 - \pi - \pi\left(\sqrt{2} - 1\right)^2$ cm$^2$`,
        String.raw`$4 - \pi - 4\pi\left(\sqrt{2} - 1\right)^2$ cm$^2$`,
      ],
      respuesta: 'a',
      nota: String.raw`La hoja oficial marca (a). Sin embargo, $4 - 4\pi$ ya es negativo; el cuadrado que une los centros tiene área 4, los cuatro cuartos de círculo suman $\pi$ y el círculo pequeño tiene radio $\sqrt{2} - 1$, lo que da la opción (d).`,
    },
    {
      n: 7, area: 'Combinatoria',
      enunciado: String.raw`En la cuadrícula aparecen los números 1, 2 y 3 como se muestra. ¿De cuántas maneras diferentes se pueden colocar los números 4, 5, 6, 7, 8 y 9 (una vez cada uno) de manera que la suma de los números de cada renglón y de cada columna sea la misma?`,
      figuras: [{ archivo: '2024-estatal-n1-p14.png', alt: 'Cuadrícula de 3 por 3 con el 1 en la esquina superior izquierda, el 2 en el centro y el 3 en la esquina inferior derecha; las demás casillas están vacías.' }],
      opciones: ['$0$', '$1$', '$2$', '$3$', '$6$'],
      respuesta: 'c',
    },
    {
      n: 8, area: 'Geometría',
      enunciado: String.raw`En los triángulos superpuestos $\triangle ABC$ y $\triangle ABE$ que comparten un lado común $AB$, $\angle EAB$ y $\angle ABC$ son ángulos rectos, $AB = 4$, $BC = 6$, $AE = 8$, y $\overline{AC}$ y $\overline{BE}$ se cruzan en $D$. ¿Cuál es la diferencia entre las áreas de $\triangle ADE$ y $\triangle BDC$?`,
      figuras: [{ archivo: '2024-estatal-n2-p08.png', alt: 'Segmento AB horizontal; AE vertical hacia arriba desde A y BC vertical hacia arriba desde B, más corto. Los segmentos AC y BE se cruzan en D.' }],
      opciones: ['$2$', '$3$', '$4$', '$6$', '$8$'],
      respuesta: 'c',
    },
    {
      n: 9, area: 'Teoría de Números',
      enunciado: String.raw`Calcula el último dígito de la suma:
$$1 + 2^2 + 3^{3^3} + 4^{4^{4^4}} + 5^{5^{5^{5^5}}}.$$`,
      respuesta: '3',
    },
    {
      n: 10, area: 'Álgebra',
      enunciado: String.raw`¿Cuál es el valor exacto de $\dfrac{2024! + 2025!}{2024!}$?`,
      respuesta: '2026',
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
      n: 13, area: 'Álgebra',
      enunciado: String.raw`Hace 6 años la edad de Abril era el triple de la de Rebeca y dentro de 4 años será el doble. Determina la suma de sus edades actuales.`,
      respuesta: '52 años',
    },
    {
      n: 14, area: 'Combinatoria',
      enunciado: String.raw`Estefania quiere construir una palabra de 6 letras usando las letras O, M, E y B, de tal manera que:

• Las primeras tres letras sean todas distintas, así como también las últimas tres.
• La primera, segunda, cuarta y quinta letras sean distintas entre sí.

¿Cuántas palabras distintas puede construir?

Ejemplo: Una palabra que puede formar es OMBBEO.`,
      respuesta: '96',
    },
    {
      n: 15, area: 'Geometría',
      enunciado: String.raw`Migue dibujó dos triángulos semejantes. El perímetro del más pequeño es la cuarta parte del perímetro del más grande. Los dos lados correspondientes tienen una diferencia de 15 cm. ¿Cuál es el perímetro del triángulo grande?`,
      respuesta: '60 cm',
    },
  ],
}
