// 7a OMMEB Guerrero · Concurso Estatal · Nivel 1 (8 de julio de 2023).
// Transcrito de «Estatal_N1_7OMMEBGro (RESP).pdf» (el zip no trae la versión
// sin respuestas de los exámenes de la 7a edición).
export default {
  edicion: 7,
  year: '2023',
  etapa: 'Estatal',
  nivel: 1,
  grados: '4º y 5º de primaria',
  fecha: '8 de julio de 2023',
  duracionMinutos: 120,
  indicaciones: [
    'La duración del examen es de 2 horas.',
    'El uso de celulares, calculadoras, electrónicos, formularios y tablas no está permitido.',
    'Las figuras no están a escala, sólo son representativas.',
    'Problemas 1 a 10: opción múltiple. Problemas 11 a 15: respuesta corta.',
  ],
  problemas: [
    {
      n: 1, area: 'Teoría de Números',
      enunciado: String.raw`¿Cuántos números de seis dígitos que terminan en 2023 puedes formar de tal manera que sean múltiplos de 9 y que los dos dígitos restantes sólo sean primos?`,
      opciones: ['$0$', '$2$', '$5$', '$12$', '$16$'],
      respuesta: 'a',
    },
    {
      n: 2, area: 'Geometría',
      enunciado: String.raw`En la figura, se tienen las siguientes medidas:
$$\angle A = 27^\circ, \qquad \angle C = 90^\circ, \qquad \angle ABD = 2\angle BDA, \qquad \angle CDA = \angle ABD.$$
¿Cuál es la medida de $\angle CDB$?`,
      figuras: [{ archivo: '2023-estatal-n1-p02.png', alt: 'Cuadrilátero ABCD con ángulo recto en C: C arriba a la izquierda, B arriba, D a la izquierda abajo de C y A abajo a la derecha. Se traza la diagonal BD.' }],
      opciones: ['$27^\\circ$', '$39^\\circ$', '$45^\\circ$', '$49^\\circ$', '$51^\\circ$'],
      respuesta: 'e',
    },
    {
      n: 3, area: 'Álgebra',
      enunciado: String.raw`Ismael está haciendo figuras en forma de “L” con monedas iguales aplicando el siguiente patrón. ¿Cuántas monedas necesita para formar la quinta “L”?`,
      figuras: [{ archivo: '2023-estatal-n1-p03.png', alt: 'Tres figuras de monedas en forma de L, cada una más grande: la primera con 4 monedas, la segunda con 16 y la tercera con 36.' }],
      opciones: ['$64$', '$96$', '$100$', '$125$', '$144$'],
      respuesta: 'c',
    },
    {
      n: 4, area: 'Teoría de Números',
      enunciado: String.raw`Rebeca tiene 6 cupones que se pueden canjear por conos de helado gratis en “Dulce Vida”. Para que los cupones duren, decide canjear uno cada 10 días hasta que los haya usado todos. Sabe que “Dulce Vida” cierra los domingos, pero mientras encierra las 6 fechas en su calendario, se da cuenta de que ninguna fecha encerrada cae en domingo. ¿Qué día de la semana Rebeca canjea su primer cupón?`,
      opciones: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
      respuesta: ['b', 'c'],
      nota: 'La hoja oficial de respuestas marca dos opciones para este problema: (b) y (c).',
    },
    {
      n: 5, area: 'Combinatoria',
      enunciado: String.raw`En una ciudad hay amigos (siempre dicen la verdad), enemigos (siempre mienten) y espías (pueden decir la verdad o mentir). Abril, Brandon y Carlos son uno de cada tipo. Abril dice: “yo no soy una amiga”; Brandon dice: “yo no soy un espía”; y Carlos dice: “yo no soy un enemigo”. ¿De qué tipo es Carlos?`,
      opciones: ['Faltan datos', 'Ninguno', 'Espía', 'Amigo', 'Enemigo'],
      respuesta: 'e',
    },
    {
      n: 6, area: 'Combinatoria',
      enunciado: String.raw`Un taxi puede llevar 4 pasajeros: 1 adelante y 3 atrás. ¿De cuántas formas pueden ir sentadas 4 personas si una de ellas no quiere irse adelante?`,
      opciones: ['$9$', '$18$', '$24$', '$12$', '$6$'],
      respuesta: 'b',
    },
    {
      n: 7, area: 'Teoría de Números',
      enunciado: String.raw`Si $a + b + c = 12$, hallar $\overline{abc} + \overline{bca} + \overline{cab}$, donde esta notación indica números de tres cifras usando los valores de $a$, $b$ y $c$ como dígitos.`,
      opciones: ['$1222$', '$1322$', '$1232$', '$2222$', '$1332$'],
      respuesta: 'e',
    },
    {
      n: 8, area: 'Teoría de Números',
      enunciado: String.raw`Con los dígitos 2, 0, 2 y 4, Jonathan arma todos los enteros de cuatro cifras divisibles por 11. ¿Cuál es la suma de estos enteros?`,
      opciones: ['$8888$', '$6662$', '$8646$', '$4444$', '$6226$'],
      respuesta: 'c',
    },
    {
      n: 9, area: 'Álgebra',
      enunciado: String.raw`En un concurso de matemáticas participaron 1260 competidores. Las estadísticas arrojaron que 4 de cada 10 competidores obtuvieron medallas (oro, plata y bronce). El número de medallas de bronce es el triple que el número de medallas de oro, y el número de medallas de plata es el doble del número de medallas de oro. ¿Cuántas medallas de plata se entregaron?`,
      opciones: ['$56$', '$84$', '$112$', '$168$', '$252$'],
      respuesta: 'd',
    },
    {
      n: 10, area: 'Combinatoria',
      enunciado: String.raw`Un juego trae 20 cartas enumeradas del 1 al 20. Consiste en tomar 3 cartas al azar y gana quien tenga en todas sus cartas múltiplos de 5. ¿Cuántas posibilidades hay de perder?`,
      opciones: ['$1133$', '$1134$', '$1135$', '$1136$', '$1137$'],
      respuesta: 'd',
    },
    {
      n: 11, area: 'Combinatoria',
      enunciado: String.raw`Aylin, Beto, Catherine y Damián participaron en un torneo de ajedrez. Cada jugador compitió contra cada uno de los otros tres jugadores exactamente dos veces. A continuación se muestran los registros de victorias y derrotas de los jugadores. Los números 1 y 0 representan una victoria o una derrota, respectivamente. Por ejemplo, Aylin ganó cinco partidos y perdió el cuarto. ¿Cuál fue el registro de victorias y derrotas de Damián?
$$\begin{array}{c|c} \text{Jugador} & \text{Resultado} \\ \hline \text{Aylin} & 111011 \\ \text{Beto} & 101010 \\ \text{Catherine} & 010100 \\ \text{Damián} & \end{array}$$`,
      respuesta: '000101',
    },
    {
      n: 12, area: 'Geometría',
      enunciado: String.raw`Sebastián dibujó un cuadrado de 60 cm de perímetro y dentro de éste sombreó el triángulo $GCD$ y los cuadrados $ABCG$ y $DEFG$. Si $AG = GF$ y $AB = 6$ cm, ¿cuál es el área de la parte del cuadrado que Sebastián dejó sin sombrear?`,
      figuras: [{ archivo: '2023-estatal-n1-p12.png', alt: 'Cuadrado grande con tres regiones sombreadas en el centro: el cuadrado DEFG arriba a la izquierda, el cuadrado ABCG abajo a la derecha y el triángulo GCD entre ellos.' }],
      respuesta: '135 cm$^2$',
    },
    {
      n: 13, area: 'Teoría de Números',
      enunciado: String.raw`Un entero positivo de tres cifras es traidor si es múltiplo de 6 y el número formado por las centenas y las decenas es divisible por 5. Por ejemplo, 852 es traidor, ya que 852 es múltiplo de 6 y además 85 es divisible por 5. ¿Cuántos números traidores hay?`,
      respuesta: '30',
    },
    {
      n: 14, area: 'Combinatoria',
      enunciado: String.raw`Amairani va a tramitar una tarjeta bancaria. En el banco le pidieron crear una clave que consiste en un número usando cuatro dígitos del 0 al 9 de tal manera que no está permitido que los cuatro dígitos sean iguales ni que tampoco todos sean dígitos consecutivos. Por ejemplo, claves como 3333 y 3456 no están permitidas; en cambio, 0333 y 0345 sí lo están. ¿Cuántas claves puede armar Amairani?`,
      respuesta: '9983',
    },
    {
      n: 15, area: 'Geometría',
      enunciado: String.raw`En la figura, $ADG$ es un triángulo isósceles con
$$AG = GD \quad \text{y} \quad GD = 3AD,$$
cuyo perímetro es de 28 cm. $DEFG$ es un cuadrado; $GHIA$ y $ABCD$ son rectángulos; y $CD = GH$. La suma del área de $GHIA$ y el área de $ABCD$ es $156$ cm$^2$. ¿Cuál es el perímetro de $ABCDEFGHI$?`,
      figuras: [{ archivo: '2023-estatal-n1-p15.png', alt: 'Triángulo isósceles ADG con base AD abajo. Sobre el lado GD hay un cuadrado DEFG, sobre el lado AG un rectángulo GHIA y bajo la base AD un rectángulo ABCD.' }],
      respuesta: '91 cm',
    },
  ],
}
