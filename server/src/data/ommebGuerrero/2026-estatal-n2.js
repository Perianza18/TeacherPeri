// 10a OMMEB Guerrero · Concurso Estatal · Nivel 2 (20 de junio de 2026).
// Transcrito de «E3_N2_Estatal_10aOMMEBGro (RESP).pdf».
export default {
  edicion: 10,
  year: '2026',
  etapa: 'Estatal',
  nivel: 2,
  grados: '6º de primaria y 1º de secundaria',
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

• Kevin: Fue Cuauh.
• Isaac: Yo no fui.
• José: Yo no fui.
• Cuauh: Fue José o Kevin.

Se sabe que hay un único culpable y está entre nosotros. Además, solo una declaración es verdadera y las otras son falsas. ¿Quién fue el culpable?`,
      opciones: ['Kevin', 'Isaac', 'José', 'Cuauh', 'No se puede saber.'],
      respuesta: 'b',
    },
    {
      n: 2, area: 'Geometría',
      enunciado: String.raw`A las 5:00 horas el ángulo menor que forman las manecillas del reloj es de $150^\circ$. Entre las 5:00 y las 8:00 horas, incluidas ambas, ¿cuántas veces el ángulo menor formado por las manecillas será de $150^\circ$?

Nota: En este problema, se considera como ángulo menor al ángulo que mide más de $0^\circ$ y menos de $180^\circ$.`,
      opciones: ['$3$', '$4$', '$5$', '$6$', '$7$'],
      respuesta: 'c',
    },
    {
      n: 3, area: 'Combinatoria',
      enunciado: String.raw`Pach tiene 6 canciones distintas en su lista de reproducción, de las cuales 3 son de la cantante TS. Al activar el modo aleatorio, se reproducen las 6 canciones, sin repetir ninguna, y todos los órdenes posibles de reproducción son igualmente probables. ¿Cuál es la probabilidad de que las 3 canciones de TS se reproduzcan de manera consecutiva?`,
      opciones: ['$\\dfrac{1}{5}$', '$\\dfrac{1}{30}$', '$\\dfrac{1}{120}$', '$\\dfrac{1}{20}$', '$\\dfrac{1}{60}$'],
      respuesta: 'a',
    },
    {
      n: 4, area: 'Teoría de Números',
      enunciado: String.raw`Un entero positivo de dos cifras es sietífico si al sumar sus dos cifras y luego multiplicar esa suma por 7, se obtiene el número original. Por ejemplo, 63 es sietífico, porque $(6 + 3) \times 7 = 63$. ¿Cuánto da la suma de todos los números sietíficos?`,
      opciones: ['$105$', '$63$', '$126$', '$210$', '$147$'],
      respuesta: 'd',
    },
    {
      n: 5, area: 'Combinatoria',
      enunciado: String.raw`Una sala de cine tiene una fila de 45 asientos consecutivos. El Grinch llega a la sala y se sienta en un asiento vacío. Si no hay ninguna persona sentada justo a su lado, comienza a arruinar la tranquilidad de los demás. Antes de que llegue el Grinch, el gerente Sebas puede acomodar a algunas personas en la fila. ¿Cuál es la menor cantidad de personas que necesita acomodar para garantizar que, sin importar qué asiento vacío elija el Grinch, este quede sentado junto a alguna de las personas que ya estaban sentadas?

Nota: Dos personas están sentadas juntas si ocupan asientos consecutivos.`,
      opciones: ['$14$', '$15$', '$16$', '$22$', '$23$'],
      respuesta: 'b',
    },
    {
      n: 6, area: 'Álgebra',
      enunciado: String.raw`Las edades de Carlo, Mauricio, Julian y Camilo suman 92 años. ¿Cuánto sumarán sus edades en 8 años?`,
      respuesta: '124 años',
    },
    {
      n: 7, area: 'Álgebra',
      enunciado: String.raw`En la panadería “Migajas”, se creó una nueva escala de temperatura para hornear pan, llamada Migagrados (denotada por $^\circ$M). Esta escala se relaciona de manera lineal con los grados Celsius ($^\circ$C). El pan se fermenta a los $30^\circ$C, que corresponde a $0^\circ$M en la escala Migagrados. El pan se hornea a $180^\circ$C, que equivale a $100^\circ$M en la escala Migagrados. Si el pan está listo cuando su temperatura interna alcanza los $96^\circ$C, ¿a cuántos migagrados equivale esta temperatura?`,
      respuesta: '$44^\\circ$M',
    },
    {
      n: 8, area: 'Teoría de Números',
      enunciado: String.raw`Los enteros positivos favoritos de Sebas son los números de cuatro cifras que cumplen que:

• son impares;
• son múltiplos de 15;
• ningún dígito se repite.

Encuentra el número favorito de Sebas más pequeño.`,
      respuesta: '1035',
    },
    {
      n: 9, area: 'Geometría',
      enunciado: String.raw`En la figura se muestra una estrella. Se sabe que los triángulos $FEJ$ y $HCI$ son isósceles con $EF = EJ$ y $CI = CH$. Además, $\angle FAG = \angle GBH$. Si $\angle GFJ = 103^\circ$, ¿cuánto vale el ángulo $\angle ADB$?`,
      figuras: [{ archivo: '2026-estatal-n1-p09.png', alt: 'Estrella de cinco puntas A, B, C, D y E. Los puntos de cruce interiores son F, G, H, I y J; el ángulo GFJ mide $103^\\circ$ y el ángulo en la punta D está marcado.' }],
      respuesta: '$26^\\circ$',
    },
    {
      n: 10, area: 'Teoría de Números',
      enunciado: String.raw`Un rectángulo tiene lados de longitud entera y un área de $2026$ cm$^2$. ¿Cuánto es el menor perímetro posible del rectángulo, en cm?`,
      respuesta: '2030 cm',
    },
    {
      n: 11, area: 'Combinatoria',
      enunciado: String.raw`Abril va a llenar la siguiente cuadrícula de $2 \times 3$ con 4 círculos y 2 estrellas, colocando exactamente una figura en cada casilla. El llenado lo hará de modo que no tenga dos estrellas en casillas adyacentes. Dos casillas se consideran adyacentes si comparten un lado, ya sea horizontal o vertical. ¿De cuántas maneras distintas Abril puede llenar la cuadrícula?

Nota: En la figura se muestra un ejemplo de llenado que no cumple la condición, pues las dos estrellas están en casillas adyacentes.`,
      figuras: [{ archivo: '2026-estatal-n2-p11.png', alt: 'Cuadrícula de 3 filas y 2 columnas. Columna izquierda: estrella, estrella, círculo. Columna derecha: tres círculos. Las dos estrellas están una encima de la otra.' }],
      respuesta: '8',
    },
    {
      n: 12, area: 'Combinatoria',
      enunciado: String.raw`En la lavandería de Don Migue se lavaron los uniformes de algunas selecciones que participan en la Copa Mundial. Hoy se lavaron 10 playeras: 4 playeras idénticas de México, 3 playeras idénticas de Argentina y 3 playeras idénticas de Francia. Don Migue va a tender todas las playeras en una cuerda, una junto a otra, formando una fila. ¿De cuántas formas distintas puede acomodarlas en la cuerda?`,
      respuesta: '4200',
    },
    {
      n: 13, area: 'Geometría',
      enunciado: String.raw`Yat Zil dibuja un cuadrado $ABCD$ cuya longitud de lado es un número entero. Desde $P$ traza los segmentos $PG$, $PA$, $PE$, $PF$ y $PB$; donde $G$ está en el lado $AD$, y $E$ y $F$ están en el lado $AB$. Se sabe que los segmentos $PG$ y $PE$ tienen longitudes enteras y son perpendiculares a los lados $AD$ y $AB$, respectivamente. Además, las áreas de los triángulos $GPA$, $EPF$ y $FPB$ son, respectivamente, 15, 20 y $25$ cm$^2$. ¿Cuál es la menor longitud posible del lado del cuadrado $ABCD$ (en cm)?`,
      figuras: [{ archivo: '2026-estatal-n2-p13.png', alt: 'Cuadrado ABCD con A abajo a la izquierda y D arriba a la izquierda. Desde el punto interior P salen el segmento horizontal PG hacia el lado AD, el segmento vertical PE hacia el lado AB, y los segmentos PA, PF y PB, con E y F sobre AB.' }],
      respuesta: '12 cm',
    },
    {
      n: 14, area: 'Álgebra',
      enunciado: String.raw`Se tienen 90 cuadritos que tienen que ser llenados con los números del 1 al 90, uno por cuadrito y sin repetir. Cada cuadrito está separado por un signo menos y un signo más de manera alternada, como se muestra en la figura.
$$\square - \square + \square - \square + \square - \cdots + \square - \square$$
De todas las formas de acomodar los números, ¿cuál es el mayor resultado posible?`,
      respuesta: '2025',
      solucion: String.raw`Para obtener el mayor resultado posible, conviene colocar los números más grandes en los cuadritos que tienen signo positivo y los números más pequeños en aquellos que tienen signo negativo.

Por lo tanto, asignamos los números $90, 89, 88, \ldots, 46$ a los cuadritos con signo positivo, y los números $45, 44, 43, \ldots, 1$ a los cuadritos con signo negativo:
$$90 - 45 + 89 - 44 + 88 - \cdots + 46 - 1.$$
Agrupamos por parejas consecutivas y obtenemos
$$(90 - 45) + (89 - 44) + (88 - 43) + \cdots + (46 - 1) = 45 + 45 + 45 + \cdots + 45.$$
Y ya que son 45 parejas, este resultado es
$$45 \times 45 = 2025.$$`,
    },
    {
      n: 15, area: 'Geometría',
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
  ],
}
