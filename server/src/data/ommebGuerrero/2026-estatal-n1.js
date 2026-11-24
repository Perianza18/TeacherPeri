// 10a OMMEB Guerrero · Concurso Estatal · Nivel 1 (20 de junio de 2026).
// Transcrito de «E3_N1_Estatal_10aOMMEBGro (RESP).pdf».
export default {
  edicion: 10,
  year: '2026',
  etapa: 'Estatal',
  nivel: 1,
  grados: '4º y 5º de primaria',
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
• Isaac: Fue Kevin o José.
• José: Fue Isaac.
• Cuauh: Yo no fui.

Se sabe que hay un único culpable y está entre nosotros. Además, solo una declaración es verdadera y las otras son falsas. ¿Quién fue el culpable?`,
      opciones: ['Kevin', 'Isaac', 'José', 'Cuauh', 'No se puede saber.'],
      respuesta: 'd',
    },
    {
      n: 2, area: 'Teoría de Números',
      enunciado: String.raw`Un entero positivo es llamado capicúa si puede leerse exactamente igual de izquierda a derecha que de derecha a izquierda; por ejemplo, 6776, 434 y 8888 son capicúas. ¿Cuántos capicúas de cuatro cifras son múltiplos de 6?`,
      opciones: ['$9$', '$10$', '$12$', '$13$', '$30$'],
      respuesta: 'd',
    },
    {
      n: 3, area: 'Teoría de Números',
      enunciado: String.raw`Un entero positivo de dos cifras es sietífico si al sumar sus dos cifras y luego multiplicar esa suma por 7, se obtiene el número original. Por ejemplo, 63 es sietífico, porque $(6 + 3) \times 7 = 63$. ¿Cuánto da la suma de todos los números sietíficos?`,
      opciones: ['$105$', '$63$', '$126$', '$210$', '$147$'],
      respuesta: 'd',
    },
    {
      n: 4, area: 'Geometría',
      enunciado: String.raw`A las 5:00 horas el ángulo menor que forman las manecillas del reloj es de $150^\circ$. Entre las 5:00 y las 8:00 horas, incluidas ambas, ¿cuántas veces el ángulo menor formado por las manecillas será de $150^\circ$?

Nota: En este problema, se considera como ángulo menor al ángulo que mide más de $0^\circ$ y menos de $180^\circ$.`,
      opciones: ['$3$', '$4$', '$5$', '$6$', '$7$'],
      respuesta: 'c',
    },
    {
      n: 5, area: 'Combinatoria',
      enunciado: String.raw`En la fonda “Panchito” venden paquetes que incluyen una bebida, una comida y una sopa. La bebida se sirve en un vaso, la comida en un plato ovalado y la sopa en un plato hondo. La fonda dispone de vasos de colores azules, amarillos, rojos y verdes; platos ovalados de colores rojos, azules, verdes, naranjas, morados y blancos; y platos hondos blancos, amarillos, azules, cafés y morados. Una familia de tres integrantes pide tres paquetes, uno para cada persona. Para servirlos, la mesera debe elegir, para cada integrante, un color de vaso, un color de plato ovalado y un color de plato hondo. Los colores de vasos y platos pueden repetirse entre los integrantes. ¿De cuántas formas distintas puede servir los tres paquetes?`,
      opciones: ['$1{,}728{,}000$', '$800$', '$172{,}800$', '$360$', '$720$'],
      respuesta: 'a',
    },
    {
      n: 6, area: 'Geometría',
      enunciado: String.raw`Un triángulo y un cuadrado tienen el mismo perímetro. Los lados del triángulo miden 7.4, 9.7 y 10.9. Calcula el área del cuadrado.`,
      respuesta: '49',
    },
    {
      n: 7, area: 'Álgebra',
      enunciado: String.raw`El $30\,\%$ de $m$ es $n$; y el $20\,\%$ de $n$ es 12. ¿Cuánto es el $50\,\%$ de $(m + n)$?`,
      respuesta: '130',
    },
    {
      n: 8, area: 'Teoría de Números',
      enunciado: String.raw`Simplifica la fracción
$$\frac{6^{12}}{3^2 \times 6 \times 12^6}$$
hasta obtener una fracción que sea equivalente e irreducible. Escribe tu respuesta como fracción, no como decimal.

Nota: Una fracción es irreducible si no se puede simplificar más, es decir, si su numerador y su denominador no tienen divisores comunes mayores que 1.`,
      respuesta: '$\\dfrac{27}{2} = 13.5$',
    },
    {
      n: 9, area: 'Geometría',
      enunciado: String.raw`En la figura se muestra una estrella. Se sabe que los triángulos $FEJ$ y $HCI$ son isósceles con $EF = EJ$ y $CI = CH$. Además, $\angle FAG = \angle GBH$. Si $\angle GFJ = 103^\circ$, ¿cuánto vale el ángulo $\angle ADB$?`,
      figuras: [{ archivo: '2026-estatal-n1-p09.png', alt: 'Estrella de cinco puntas A, B, C, D y E. Los puntos de cruce interiores son F, G, H, I y J; el ángulo GFJ mide $103^\\circ$ y el ángulo en la punta D está marcado.' }],
      respuesta: '$26^\\circ$',
    },
    {
      n: 10, area: 'Álgebra',
      enunciado: String.raw`Las edades de Carlo, Mauricio, Julian y Camilo suman 92 años. ¿Cuánto sumarán sus edades en 8 años?`,
      respuesta: '124 años',
    },
    {
      n: 11, area: 'Combinatoria',
      enunciado: String.raw`Una tienda departamental ubicada dentro de un centro comercial tiene 4 accesos de entrada/salida en la planta baja, y 3 accesos de entrada/salida en la planta alta. Además, dentro de la tienda hay 4 escaleras que comunican ambas plantas. Encuentra la cantidad de maneras distintas en que dos personas pueden entrar por la planta baja y salir por la planta alta, si en cada recorrido pueden elegir cualquier acceso y cualquier escalera, incluso si coinciden en alguno de ellos.`,
      respuesta: '2304',
    },
    {
      n: 12, area: 'Combinatoria',
      enunciado: String.raw`El celular de Vicente guarda cada foto con un nombre formado por la fecha en que fue tomada. Para ello usa un número de ocho cifras con el siguiente formato: primero el año con 4 dígitos, después el mes con 2 dígitos y finalmente el día con 2 dígitos. Por ejemplo, una foto tomada el 20 de junio de 2026 se guarda con el nombre 20260620. Considerando solamente las fechas del año 2026, ¿en cuántas de ellas ocurre que, en el nombre del archivo, cada dígito aparece una cantidad par de veces?`,
      respuesta: '6',
    },
    {
      n: 13, area: 'Teoría de Números',
      enunciado: String.raw`Un rectángulo tiene lados de longitud entera y un área de $115$ cm$^2$. ¿Cuánto es el mayor perímetro posible del rectángulo, en cm?`,
      respuesta: '232 cm',
    },
    {
      n: 14, area: 'Geometría',
      enunciado: String.raw`¿Cuánto suman los ángulos marcados con $a$ y $b$ en la figura?`,
      figuras: [
        { archivo: '2026-estatal-n1-p14.png', alt: 'Triángulo rectángulo con el ángulo recto abajo a la derecha. La hipotenusa se prolonga por ambos lados; $a$ es el ángulo exterior en el vértice de abajo a la izquierda y $b$ el ángulo exterior en el vértice de arriba.' },
        { archivo: '2026-estatal-n1-p14-sol.png', alt: 'La misma figura con los ángulos agudos del triángulo marcados: $x$ junto a $a$ y $y$ junto a $b$.', en: 'solucion' },
      ],
      respuesta: '$a + b = 270^\\circ$',
      solucion: String.raw`Solución 1. Notemos que $a$ y $b$ son dos ángulos exteriores del triángulo. El tercer ángulo exterior mide $90^\circ$, ya que corresponde al ángulo interior recto del triángulo. Sabemos que los ángulos exteriores de un triángulo suman $360^\circ$; entonces
$$a + b + 90^\circ = 360^\circ$$
y, al despejar,
$$a + b = 270^\circ.$$

Solución 2. Sean $x$ y $y$ los ángulos agudos del triángulo rectángulo, como se muestra en la figura de la solución. Usando que los ángulos interiores de un triángulo suman $180^\circ$ se tiene
$$x + y + 90^\circ = 180^\circ,$$
por lo que
$$x + y = 90^\circ. \qquad (1)$$
Por otra parte, las parejas de ángulos $a$ con $x$, y $b$ con $y$ son suplementarios; así
$$x + a = 180^\circ, \qquad y + b = 180^\circ. \qquad (2)$$
Al sumar las igualdades en (2) y al usar (1) se obtiene
$$180^\circ + 180^\circ = x + a + y + b = (x + y) + (a + b) = 90^\circ + (a + b).$$
Por lo tanto,
$$360^\circ = 90^\circ + (a + b) \implies a + b = 270^\circ.$$`,
    },
    {
      n: 15, area: 'Álgebra',
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
  ],
}
