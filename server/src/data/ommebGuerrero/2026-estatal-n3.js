// 10a OMMEB Guerrero · Concurso Estatal · Nivel 3 (20 de junio de 2026).
// Transcrito de «E3_N3_Estatal_10aOMMEBGro (RESP).pdf».
export default {
  edicion: 10,
  year: '2026',
  etapa: 'Estatal',
  nivel: 3,
  grados: '2º de secundaria',
  fecha: '20 de junio de 2026',
  lugar: 'Chilpancingo de los Bravo, Gro.',
  duracionMinutos: 120,
  indicaciones: [
    'La duración del examen es de 2 horas.',
    'El uso de celulares, calculadoras, electrónicos, formularios y tablas no está permitido.',
    'Las figuras no están a escala, sólo son representativas.',
    'Cuando las respuestas de estos problemas no sean números enteros, deberán aproximarse a dos cifras decimales, considerando π = 3.14.',
    'Problemas 1 a 5: opción múltiple. Problemas 6 a 13: respuesta corta. Problemas 14 y 15: de redacción (se escribe la solución completa).',
  ],
  problemas: [
    {
      n: 1, area: 'Combinatoria',
      enunciado: String.raw`Un crimen fue cometido y hay cuatro sospechosos: Kevin, Isaac, José y Cuauh. Sus declaraciones fueron las siguientes:

• Kevin: Yo no fui.
• Isaac: Fue Cuauh o José.
• José: Fue Isaac.
• Cuauh: Yo no fui.

Se sabe que hay un único culpable y está entre nosotros. Además, solo una declaración es verdadera y las otras son falsas. ¿Quién fue el culpable?`,
      opciones: ['Kevin', 'Isaac', 'José', 'Cuauh', 'No se puede saber.'],
      respuesta: 'a',
    },
    {
      n: 2, area: 'Combinatoria',
      enunciado: String.raw`Pach tiene 6 canciones distintas en su lista de reproducción, de las cuales 3 son de la cantante TS. Al activar el modo aleatorio, se reproducen las 6 canciones, sin repetir ninguna, y todos los órdenes posibles de reproducción son igualmente probables. ¿Cuál es la probabilidad de que las 3 canciones de TS se reproduzcan de manera consecutiva?`,
      opciones: ['$\\dfrac{1}{5}$', '$\\dfrac{1}{30}$', '$\\dfrac{1}{120}$', '$\\dfrac{1}{20}$', '$\\dfrac{1}{60}$'],
      respuesta: 'a',
    },
    {
      n: 3, area: 'Teoría de Números',
      enunciado: String.raw`Encuentra la suma de todos los enteros $n$ para los cuales
$$\frac{2n + 11}{n - 11}$$
es un entero.`,
      opciones: ['$18$', '$92$', '$48$', '$88$', '$110$'],
      respuesta: 'd',
    },
    {
      n: 4, area: 'Combinatoria',
      enunciado: String.raw`Una sala de cine tiene una fila de 45 asientos consecutivos. El Grinch llega a la sala y se sienta en un asiento vacío. Si no hay ninguna persona sentada justo a su lado, comienza a arruinar la tranquilidad de los demás. Antes de que llegue el Grinch, el gerente Sebas puede acomodar a algunas personas en la fila. ¿Cuál es la menor cantidad de personas que necesita acomodar para garantizar que, sin importar qué asiento vacío elija el Grinch, este quede sentado junto a alguna de las personas que ya estaban sentadas?

Nota: Dos personas están sentadas juntas si ocupan asientos consecutivos.`,
      opciones: ['$14$', '$15$', '$16$', '$22$', '$23$'],
      respuesta: 'b',
    },
    {
      n: 5, area: 'Geometría',
      enunciado: String.raw`En la figura se muestra un cuadrado $ABCD$ de lado 2 cm y un cuadrado $BEFG$ de lado 6 cm. El segmento $AF$ intersecta al lado $BC$ en $P$ y el segmento $AG$ intersecta a $CD$ en $Q$. ¿Cuál es el área del cuadrilátero $APCQ$?`,
      figuras: [{ archivo: '2026-estatal-n3-p05.png', alt: 'Cuadrado pequeño ABCD y cuadrado grande BEFG, uno junto al otro sobre la recta AE. El segmento AF corta a BC en P y el segmento AG corta a DC en Q.' }],
      opciones: ['$2$ cm$^2$', '$\\dfrac{11}{6}$ cm$^2$', '$\\dfrac{4}{3}$ cm$^2$', '$\\dfrac{2}{3}$ cm$^2$', '$\\dfrac{3}{2}$ cm$^2$'],
      respuesta: 'b',
    },
    {
      n: 6, area: 'Teoría de Números',
      enunciado: String.raw`¿Cuántos dígitos tiene el resultado de calcular $25^{15} \times 20^{26}$?`,
      respuesta: '55',
    },
    {
      n: 7, area: 'Geometría',
      enunciado: String.raw`En el rectángulo $ABCD$ se marca el punto $E$ en el lado $BC$ de forma tal que $BE = \frac{1}{2}AE$. El ángulo $\angle EDC = 30^\circ$ y el área del triángulo $ABE$ es 24. Calcula el área del rectángulo $ABCD$.`,
      respuesta: '96',
    },
    {
      n: 8, area: 'Teoría de Números',
      enunciado: String.raw`Un rectángulo tiene lados de longitud entera y un área de $2026$ cm$^2$. ¿Cuánto es el mayor perímetro posible del rectángulo, en cm?`,
      respuesta: '4054 cm',
    },
    {
      n: 9, area: 'Combinatoria',
      enunciado: String.raw`Peter, la araña, tejió la telaraña de la imagen. La telaraña está formada por dos hexágonos, uno dentro de otro, y por varios segmentos que parten de un mismo punto interior. Además, los vértices correspondientes de los dos hexágonos están alineados con ese punto interior. ¿Cuántos triángulos se pueden contar en la telaraña de Peter?`,
      figuras: [{ archivo: '2026-estatal-n3-p09.png', alt: 'Telaraña: un hexágono irregular dentro de otro, con varios segmentos que salen de un mismo punto interior; seis de ellos pasan por vértices correspondientes de los dos hexágonos.' }],
      respuesta: '36',
    },
    {
      n: 10, area: 'Teoría de Números',
      enunciado: String.raw`Sean $a$ y $b$ enteros positivos que satisfacen $ab^2 + a = 2026$. ¿Cuál es el menor valor de $a + b$?`,
      respuesta: '46',
    },
    {
      n: 11, area: 'Combinatoria',
      enunciado: String.raw`En la lavandería de Don Migue se lavaron los uniformes de algunas selecciones que participan en la Copa Mundial. Hoy se lavaron 10 playeras: 4 playeras idénticas de México, 3 playeras idénticas de Argentina y 3 playeras idénticas de Francia. Don Migue va a tender todas las playeras en una cuerda, una junto a otra, formando una fila. ¿De cuántas formas distintas puede acomodarlas en la cuerda?`,
      respuesta: '4200',
    },
    {
      n: 12, area: 'Álgebra',
      enunciado: String.raw`Paloma pensó en dos números $x$, $y$ que cumplen que su suma es $-10$ y su producto es 26. Paloma calculó el valor de
$$\frac{x}{y} + \frac{y}{x}$$
y obtuvo una fracción irreducible $\frac{a}{b}$. ¿Cuánto vale $a + b$?

Nota: Una fracción es irreducible si no se puede simplificar más, es decir, si su numerador y su denominador no tienen divisores comunes mayores que 1.`,
      respuesta: '37',
    },
    {
      n: 13, area: 'Geometría',
      enunciado: String.raw`Atenea dibujó tres cuadrados adyacentes de longitudes distintas, como se muestra en la figura. Los vértices $P$, $Q$, $R$ de los cuadrados están alineados. El lado del cuadrado mayor mide 52 cm. Si un lado del cuadrado mediano mide 13 cm más que un lado del cuadrado menor, ¿cuál es la medida que tiene el lado del cuadrado menor?`,
      figuras: [{ archivo: '2026-estatal-n3-p13.png', alt: 'Tres cuadrados de tamaño creciente, uno junto al otro sobre una misma recta. P, Q y R son los vértices superiores izquierdos del cuadrado menor, el mediano y el mayor.' }],
      respuesta: '13 cm',
    },
    {
      n: 14, area: 'Geometría',
      enunciado: String.raw`Sea $ABCD$ un cuadrado. Se elige un punto $P$ en el lado $AB$ y un punto $Q$ en el lado $BC$, de tal manera que $PB = QC$. Las rectas $AQ$ y $DP$ se cortan en el punto $T$. ¿Cuánto mide, en grados, el ángulo $\angle PTQ$?`,
      figuras: [
        { archivo: '2026-estatal-n2-p15-sol1.png', alt: 'Cuadrado ABCD con P en AB y Q en BC, $PB = QC$; las rectas AQ y DP se cortan en T. Los ángulos ADP y BAQ están marcados con $\\alpha$ y los ángulos APD y AQB con $\\beta$.', en: 'solucion' },
        { archivo: '2026-estatal-n2-p15-sol3.png', alt: 'La misma figura con los segmentos PC y DQ. Están marcados $\\alpha$ y $\\theta$ en D, los ángulos PCB y QDC iguales a $\\beta$, y el ángulo TAD igual a $\\theta + \\beta$.', en: 'solucion' },
      ],
      respuesta: '$90^\\circ$',
      solucion: String.raw`Solución 1. Dado que $ABCD$ es un cuadrado se tiene, en particular, que
$$DA = AB \quad \text{y} \quad \angle DAP = \angle ABQ = 90^\circ.$$
Por otro lado, el problema nos da que $PB = QC$, por lo que $AP = BQ$. En consecuencia, los triángulos $DAP$ y $ABQ$ son congruentes por el criterio LAL (primera figura de la solución).

Nombremos $\angle ADP = \alpha$ y $\angle APD = \beta$. Entonces obtenemos las siguientes igualdades:
$$\angle ADP = \angle BAQ = \alpha \quad \text{y} \quad \angle APD = \angle AQB = \beta.$$
Ahora, vamos a fijarnos en el triángulo $ATP$. Como tiene los mismos ángulos que el triángulo $DAP$, se sigue que son semejantes. Entonces $\angle ATP = 90^\circ$ y, por lo tanto, $\angle PTQ = 90^\circ$.

Solución 2. Con el mismo razonamiento de la Solución 1, tenemos que
$$\angle ADP = \angle BAQ = \alpha \quad \text{y} \quad \angle APD = \angle AQB = \beta.$$
Luego, $\angle TPB = 180^\circ - \beta$ por ser suplementario del $\angle TPA = \beta$. Con esto, obtenemos que el cuadrilátero $PBQT$ es cíclico. Por lo tanto
$$\angle PTQ + \angle PBQ = 180^\circ \implies \angle PTQ + 90^\circ = 180^\circ \implies \angle PTQ = 90^\circ.$$

Solución 3. Tracemos los segmentos $PC$ y $DQ$ (segunda figura de la solución). Por el mismo argumento de la Solución 1, se tiene que los triángulos $DAP$ y $ABQ$ son congruentes, con $\angle ADP = \angle BAQ = \alpha$.

Por otra parte, tenemos $PB = QC$ (por hipótesis), $BC = CD$ y $\angle PBC = \angle QCD = 90^\circ$ (porque $ABCD$ es un cuadrado), lo que implica que los triángulos $PBC$ y $QCD$ son congruentes por LAL. Sean
$$\beta = \angle PCB = \angle QDC, \qquad \theta = \angle PDQ.$$
En el ángulo $\angle ADC = 90^\circ$ tenemos
$$\alpha + \theta + \beta = 90^\circ.$$
Ahora, en el ángulo $\angle BAD = 90^\circ$, llegamos a
$$\alpha + \angle TAD = 90^\circ \implies \alpha + \angle TAD = \alpha + \theta + \beta \implies \angle TAD = \theta + \beta.$$
Por último, el ángulo $\angle PTQ$ es exterior al triángulo $ADT$, de modo que
$$\angle PTQ = \angle TAD + \angle ADT = \alpha + \theta + \beta = 90^\circ.$$`,
    },
    {
      n: 15, area: 'Combinatoria',
      enunciado: String.raw`La siguiente cuadrícula del Juego del Gato, de $3 \times 3$, será llenada completamente por 6 cruces y por 3 círculos, colocando una figura por casilla. Una figura gana cuando las tres están alineadas en fila, columna o diagonal. El llenado debe hacerse de manera que los tres círculos no formen una línea ganadora. ¿De cuántas formas diferentes se puede llenar la cuadrícula?

Nota: En la figura se muestra una configuración donde los círculos ganaron.`,
      figuras: [{ archivo: '2026-estatal-n3-p15.png', alt: 'Tablero del Juego del Gato de 3 por 3: la columna central tiene tres círculos (O) y las columnas de los lados tienen cruces (X).' }],
      respuesta: '76',
      solucion: String.raw`Solución 1. Podemos contar primero todas las formas posibles de llenar la cuadrícula y después restar aquellas en las que los círculos ganan.

Para que los círculos ganen, deben ocupar una línea completa de tres casillas. En el tablero del Juego del Gato hay 8 líneas ganadoras: 3 horizontales, 3 verticales y 2 diagonales. En cada una de estas 8 formas, las demás casillas se llenan con cruces.

Ahora contemos todas las formas posibles de colocar los 3 círculos en la cuadrícula. Para ello, basta con elegir 3 de las 9 casillas disponibles, por lo que hay
$$\binom{9}{3} = \frac{9!}{3! \times 6!} = 84 \text{ formas posibles}.$$
Notemos que esto es equivalente a elegir las 6 casillas que serán ocupadas por cruces:
$$\binom{9}{6} = \frac{9!}{6! \times 3!} = 84.$$
Por lo tanto, las formas en las que los círculos no ganan son
$$84 - 8 = 76.$$

Solución 2. Vamos a contar las maneras de acuerdo con las posiciones de los círculos, separando por casos si uno de los círculos está o no en el centro.

Caso 1. Un círculo está en el centro. Entonces los otros dos círculos deben colocarse en 2 de las 8 casillas restantes. Hay
$$\binom{8}{2} = \frac{8!}{2! \times 6!} = 28 \text{ formas de hacerlo}.$$
Pero aquí el círculo gana en cuatro configuraciones: la columna central, la fila central y las dos diagonales. Por lo tanto, en este caso hay $28 - 4 = 24$ formas en las que el círculo no gana.

Caso 2. Ningún círculo está en el centro. Los tres círculos deben colocarse en las 8 casillas del contorno. Esto se puede hacer de
$$\binom{8}{3} = \frac{8!}{3! \times 5!} = 56 \text{ formas distintas}.$$
En este caso, el círculo gana en cuatro configuraciones, si ocupa uno de los lados del tablero. Por lo tanto, en este caso hay $56 - 4 = 52$ formas en las que el círculo no gana.

Finalmente, el total es
$$52 + 24 = 76.$$`,
    },
  ],
}
