// 9a OMMEB Guerrero · Concurso Estatal · Nivel 1 (28 de junio de 2025).
// Transcrito de «E4-Estatal_N1_9aOMMEBGro (RESP).pdf».
export default {
  edicion: 9,
  year: '2025',
  etapa: 'Estatal',
  nivel: 1,
  grados: '4º y 5º de primaria',
  fecha: '28 de junio de 2025',
  lugar: 'Acapulco de Juárez, Gro.',
  duracionMinutos: 150,
  indicaciones: [
    'La duración del examen es de 2 horas y media.',
    'El uso de celulares, calculadoras, electrónicos, formularios y tablas no está permitido.',
    'Las figuras no están a escala, sólo son representativas.',
    'En caso de que las respuestas a estos problemas no sean enteras, estas deben ser aproximadas a dos decimales tomando en cuenta π = 3.14.',
    'Problemas 1 a 5: opción múltiple. Problemas 6 a 13: respuesta corta. Problemas 14 y 15: de redacción (se escribe la solución completa).',
  ],
  problemas: [
    {
      n: 1, area: 'Geometría',
      enunciado: String.raw`Una pista de carreras tiene forma de una figura compuesta: un rectángulo de 20 metros de largo y 10 metros de ancho, con un semicírculo en cada uno de sus lados cortos. Se quiere cubrir toda la pista con pintura especial para protegerla del sol. ¿Cuál es el área total que se debe pintar?`,
      opciones: [String.raw`$231.4$ m$^2$`, String.raw`$514.0$ m$^2$`, String.raw`$262.8$ m$^2$`, String.raw`$357.0$ m$^2$`, String.raw`$278.5$ m$^2$`],
      respuesta: 'e',
    },
    {
      n: 2, area: 'Teoría de Números',
      enunciado: String.raw`En la suma $\overline{ABC} + \overline{CBA} = 777$, $\overline{ABC}$ y $\overline{CBA}$ son números de tres cifras en donde letras distintas indican dígitos distintos. ¿Cuántas sumas distintas hay?

Nota: Consideraremos que dos sumas son iguales si son los mismos números en orden distinto. Por ejemplo, si quisiéramos sumar 8, entonces $3 + 5$ y $5 + 3$ son la misma suma.`,
      opciones: ['$0$', '$8$', '$7$', '$4$', '$3$'],
      respuesta: 'a',
    },
    {
      n: 3, area: 'Geometría',
      enunciado: String.raw`Una bandera tiene la forma de una figura compuesta por un cuadrado y dos triángulos equiláteros, uno pegado a la parte superior y otro a la parte inferior del cuadrado, compartiendo lados entre el cuadrado y el triángulo. Cada lado del cuadrado mide 10 cm. ¿Cuál es el perímetro total de la figura?`,
      opciones: ['$40$ cm', '$50$ cm', '$60$ cm', '$70$ cm', '$80$ cm'],
      respuesta: 'c',
    },
    {
      n: 4, area: 'Combinatoria',
      enunciado: String.raw`Amairani escribe todos los números más chiquitos que 1,000 en los que sólo un dígito aparece dos veces. Por ejemplo, los números 100 y 55 son números que están en su lista, pero números como 839 o 777 no están escritos. ¿Cuántos números escribió Amairani?`,
      opciones: ['$234$', '$252$', '$261$', '$279$', '$324$'],
      respuesta: 'b',
    },
    {
      n: 5, area: 'Combinatoria',
      enunciado: String.raw`Hay cuatro estudiantes acusadas de copiarse en el examen de matemáticas: Atenea, Bibiana, Cindi y Danna.

• Atenea dice que no copió.
• Bibiana dice que ni Atenea ni ella copiaron.
• Cindi dice que ni Bibiana ni ella copiaron.
• Danna dice que ni Atenea ni Bibiana copiaron.

De las cuatro estudiantes, sólo una está mintiendo, ¿quién es?`,
      opciones: ['Atenea', 'Bibiana', 'Cindi', 'Danna', 'No se puede saber'],
      respuesta: 'c',
    },
    {
      n: 6, area: 'Teoría de Números',
      enunciado: String.raw`El cumpleaños de Jorgelder es el 2 de abril. Esta fecha resulta interesante porque, al escribirla como $2 \mid 4$, se puede interpretar como una afirmación matemática verdadera: “2 divide a 4”. ¿Cuántas fechas del calendario cumplen esta misma característica: que el número del día divide exactamente al número del mes? (Incluye al 2 de abril en tu conteo.)`,
      respuesta: '35',
    },
    {
      n: 7, area: 'Combinatoria',
      enunciado: String.raw`Abril escribe los dígitos del 1 al 9, sin repetir y uno por casilla, en la cuadrícula mostrada. A la derecha de cada fila se indica la suma de los números en dicha fila. Se desea que esas tres sumas, en algún orden, sean también las sumas de las tres columnas. ¿Cuál es el número que debe colocarse en la casilla sombreada?`,
      figuras: [{ archivo: '2025-estatal-n1-p07.png', alt: 'Cuadrícula de 3 por 3. Fila 1: vacía, casilla sombreada, 7; suma 14. Fila 2: 9, 2, vacía; suma 17. Fila 3: vacía, 8, vacía; suma 14.' }],
      respuesta: '4',
    },
    {
      n: 8, area: 'Combinatoria',
      enunciado: String.raw`Paulina se dio a la tarea de escribir todos los enteros positivos de tres dígitos con una característica muy especial: uno de sus dígitos es igual a la suma de los otros dos. Por ejemplo, 431 y 134 están en su lista porque $4 = 1 + 3$. ¿Cuántos números escribió Paulina?`,
      respuesta: '126',
    },
    {
      n: 9, area: 'Geometría',
      enunciado: String.raw`Sea $ACDF$ un rectángulo de área $18$ cm$^2$. Sean $B$ y $E$ los puntos medios de los lados $AC$ y $DF$, respectivamente. ¿Cuál es el área del paralelogramo $BCEF$?`,
      respuesta: '9',
    },
    {
      n: 10, area: 'Combinatoria',
      enunciado: String.raw`Un explorador cuenta con diez pilas portátiles para cargar su celular. Cada pila proporciona una cantidad distinta de horas de duración de la batería: la primera da 8 horas, la segunda 16 horas, la tercera 24 horas, y así sucesivamente, hasta llegar a 80 horas. El explorador se prepara para una expedición de tres días en la selva, durante la cual necesita que su celular funcione continuamente. ¿De cuántas maneras puede seleccionar pilas de tal manera que su celular dure exactamente esos tres días?`,
      respuesta: '8',
    },
    {
      n: 11, area: 'Geometría',
      enunciado: String.raw`El área del rectángulo $ABCD$ es de $72$ cm$^2$. El segmento $EF$ es paralelo al segmento $BC$, además $AE$ mide un tercio de $AB$. Calcula el valor de la suma de las áreas de los triángulos $AEG$ y $GFC$.`,
      figuras: [{ archivo: '2025-estatal-n1-p11.png', alt: 'Rectángulo ABCD con A arriba a la izquierda, D arriba a la derecha, B abajo a la izquierda y C abajo a la derecha. El segmento EF es horizontal, con E en AB y F en DC; la diagonal AC lo corta en G. Los triángulos AEG y GFC están sombreados.' }],
      respuesta: '20',
    },
    {
      n: 12, area: 'Álgebra',
      enunciado: String.raw`Miguel compra una paleta de chocolate, una de menta y una de limón y paga 53.20 pesos por todo. Antonio compra una de chocolate, dos de menta y dos de limón, pagando en total 86 pesos. ¿Cuánto cuesta una paleta de limón y una de menta?`,
      respuesta: '32.80 pesos',
    },
    {
      n: 13, area: 'Álgebra',
      enunciado: String.raw`En una frutería se venden mangos, sandías, naranjas y papayas.

• El mango cuesta la mitad que una sandía, pero 15 pesos más que una naranja.
• La papaya cuesta el triple de lo que cuesta una naranja.

Si se compró una unidad de cada fruta y se pagaron 115 pesos, ¿cuál es la diferencia de precio entre la fruta más cara y la más barata?`,
      respuesta: '40 pesos',
    },
    {
      n: 14, area: 'Teoría de Números',
      enunciado: String.raw`Rebeca tiene menos de 100 años. De su edad sabemos que:

• Es múltiplo de 4.
• El dígito de las decenas es impar.
• La suma de sus dígitos es 13.

¿Cuál es la edad de Rebeca?`,
      respuesta: '76 años',
      solucion: String.raw`Para que el dígito de las decenas sea impar, los únicos números a usar son 1, 3, 5, 7 y 9.

La condición de que la suma de sus dígitos es 13 nos hace descartar al 1 y al 3. Luego, las opciones son 58, 76 y 94.

De ellas, la única divisible por 4 es 76. Por tanto, la edad de Rebeca es 76 años.`,
    },
    {
      n: 15, area: 'Combinatoria',
      enunciado: String.raw`En el 3°A de una escuela secundaria hay 6 alumnos y en el 3°B hay 7 alumnos. De cada grupo se deben elegir 5 alumnos que representen a su salón en un juego entre los dos grupos. ¿De cuántas formas podemos hacerlo?`,
      respuesta: '126',
      solucion: String.raw`Notemos que, dado que no estamos considerando posiciones de los jugadores, entonces el orden de elección no importa.

Luego, las maneras de elegir 5 alumnos de los 6 que hay en el 3°A son:
$$\binom{6}{5} = \frac{6!}{5! \times 1!} = 6.$$
De manera similar, las formas de elegir 5 alumnos de los 7 que hay en el 3°B son:
$$\binom{7}{5} = \frac{7!}{5! \times 2!} = 21.$$
Dado que se van a enfrentar entre los dos grupos, por regla del producto, la cantidad de juegos distintos que hay es:
$$\binom{6}{5} \times \binom{7}{5} = 6 \times 21 = 126.$$`,
    },
  ],
}
