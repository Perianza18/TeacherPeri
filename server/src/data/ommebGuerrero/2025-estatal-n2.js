// 9a OMMEB Guerrero · Concurso Estatal · Nivel 2 (28 de junio de 2025).
// Transcrito de «E4-Estatal_N2_9aOMMEBGro (RESP).pdf».
export default {
  edicion: 9,
  year: '2025',
  etapa: 'Estatal',
  nivel: 2,
  grados: '6º de primaria y 1º de secundaria',
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
      n: 1, area: 'Teoría de Números',
      enunciado: String.raw`Al terminar su examen de manera completa, Pach notó algo curioso en sus respuestas: todos los resultados eran números enteros positivos de dos cifras, y cada uno cumplía que al sumarlo con el número formado al invertir sus dígitos se obtenía 132. ¿Cuántas preguntas tenía el examen que hizo Pach?`,
      opciones: ['$3$', '$4$', '$6$', '$7$', '$8$'],
      respuesta: 'd',
    },
    {
      n: 2, area: 'Álgebra',
      enunciado: String.raw`Ron Damón tiene 1000 monedas de peso y quiere repartir algunas de ellas, posiblemente todas, entre sus 5 nietos, todos de edades distintas. Las reglas para repartir son las siguientes:

• Ningún nieto se queda sin monedas.
• El más grande recibe el doble de monedas del que sigue en edad, quien a su vez recibe el doble del que sigue, y así sucesivamente hasta llegar al menor.

¿Cuántas formas distintas hay de repartir las monedas?`,
      opciones: ['$30$', '$31$', '$32$', '$33$', '$34$'],
      respuesta: 'c',
    },
    {
      n: 3, area: 'Combinatoria',
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
      n: 4, area: 'Teoría de Números',
      enunciado: String.raw`En la suma $\overline{ABC} + \overline{CBA} = 888$, $\overline{ABC}$ y $\overline{CBA}$ son números de tres cifras en donde letras distintas indican dígitos distintos. ¿Cuántas sumas distintas hay?

Nota: Consideraremos que dos sumas son iguales si son los mismos números en orden distinto. Por ejemplo, si quisiéramos sumar 8, entonces $3 + 5$ y $5 + 3$ son la misma suma.`,
      opciones: ['$0$', '$8$', '$7$', '$4$', '$3$'],
      respuesta: 'e',
    },
    {
      n: 5, area: 'Combinatoria',
      enunciado: String.raw`Amairani escribe todos los números más chiquitos que 1,000 en los que sólo un dígito aparece dos veces. Por ejemplo, los números 100 y 55 son números que están en su lista, pero números como 839 o 777 no están escritos. ¿Cuántos números escribió Amairani?`,
      opciones: ['$234$', '$252$', '$261$', '$279$', '$324$'],
      respuesta: 'b',
    },
    {
      n: 6, area: 'Álgebra',
      enunciado: String.raw`Paloma compra una paleta de chocolate, una de menta y una de limón y paga 53.20 pesos por todo. Jonathan compra una de chocolate, dos de menta y dos de limón, pagando en total 86 pesos. ¿Cuánto cuesta una paleta de chocolate?`,
      respuesta: '20.40 pesos',
    },
    {
      n: 7, area: 'Geometría',
      enunciado: String.raw`Sebas dibujó un hexágono regular de lado 5 cm. Luego, sobre sus lados, construyó de forma alternada semicírculos y triángulos equiláteros hacia afuera del hexágono, usando como base cada lado del mismo. Es decir, sobre un lado trazó un semicírculo hacia afuera; sobre el siguiente, un triángulo equilátero hacia afuera, y así sucesivamente. ¿Cuál es el perímetro total de la figura resultante?`,
      respuesta: '53.55 cm',
    },
    {
      n: 8, area: 'Combinatoria',
      enunciado: String.raw`Paulina se dio a la tarea de escribir todos los enteros positivos de tres dígitos con una característica muy especial: uno de sus dígitos es igual a la suma de los otros dos. Por ejemplo, 431 y 134 están en su lista porque $4 = 1 + 3$. ¿Cuántos números escribió Paulina?`,
      respuesta: '126',
    },
    {
      n: 9, area: 'Geometría',
      enunciado: String.raw`En la figura se muestran cinco triángulos con un ángulo de medida $\alpha$ y que comparten al menos un lado. Las medidas de algunos lados y ángulos están escritas. Si se sabe que $\alpha + \beta + \gamma = 180^\circ$, halla el valor del lado marcado con $x$.`,
      figuras: [{ archivo: '2025-estatal-n2-p09.png', alt: 'Cinco triángulos en abanico que comparten un vértice, cada uno con un ángulo $\\alpha$ en ese vértice. Lados marcados, de derecha a izquierda: 15 y 20, 40, 80, 160 y 320; el lado de la base del triángulo más grande es $x$. Algunos ángulos están marcados con $\\beta$ y $\\gamma$.' }],
      respuesta: '480',
    },
    {
      n: 10, area: 'Combinatoria',
      enunciado: String.raw`En el 3°A de una escuela secundaria hay 7 alumnos y en el 3°B hay 8 alumnos. Miguel va en el 3°A y Sebas en el 3°B. De cada grupo se deben elegir 5 alumnos que representen a su salón en un juego entre los dos grupos. Sabemos que Miguel y Sebas no pueden estar en la cancha juntos porque no se llevan bien. ¿De cuántas formas podemos hacerlo?`,
      respuesta: '651',
    },
    {
      n: 11, area: 'Teoría de Números',
      enunciado: String.raw`Un entero positivo es cargado si cumple que:

• Es múltiplo de 5.
• El producto de sus dígitos es 20.
• La suma de sus dígitos es 13.

¿Cuántos números cargados hay?`,
      respuesta: '20',
    },
    {
      n: 12, area: 'Álgebra',
      enunciado: String.raw`La suma de las edades actuales de Carla, Diego, Elena y Francisco es de 105 años. Carla tiene el doble de la edad de Diego. Elena es 5 años mayor que Carla. Francisco tiene la misma edad que tenía Diego hace 8 años. ¿Cuál es la diferencia de edad entre Elena y Francisco?`,
      respuesta: '31 años',
    },
    {
      n: 13, area: 'Teoría de Números',
      enunciado: String.raw`Don José tiene 12 cilindros de metal. Hay dos de cada uno de los siguientes pesos: 1 gramo, 2 gramos, 4 gramos, 8 gramos, 16 gramos y 32 gramos. Don José quiere reunir la mayor cantidad de cilindros de forma que el peso total de ellos sea de 90 gramos. ¿Cuántos cilindros reúne don José?`,
      respuesta: '10',
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
      n: 15, area: 'Geometría',
      enunciado: String.raw`El área del rectángulo $ABCD$ es de $126$ cm$^2$. El segmento $EF$ es paralelo al segmento $BC$, además $AE$ mide un tercio de $AB$. Calcula el valor de la suma de las áreas de los triángulos $AEG$ y $GFC$.`,
      figuras: [
        { archivo: '2025-estatal-n2-p15.png', alt: 'Rectángulo ABCD con A arriba a la izquierda, D arriba a la derecha, B abajo a la izquierda y C abajo a la derecha. El segmento EF es horizontal, con E en AB y F en DC; la diagonal AC lo corta en G. Los triángulos AEG y GFC están sombreados.' },
        { archivo: '2025-estatal-n2-p15-sol1.png', alt: 'La figura del problema con medidas: $AE = a$, $EB = 2a$, $AB = 3a$; en la base, $b$ y $2b$, con $BC = 3b$.', en: 'solucion' },
        { archivo: '2025-estatal-n2-p15-sol2.png', alt: 'El rectángulo dividido en 9 rectángulos iguales (3 por 3) con líneas rojas; los triángulos sombreados AEG y CFG ocupan dos rectángulos y medio.', en: 'solucion' },
      ],
      respuesta: '35 cm$^2$',
      solucion: String.raw`Solución 1. Sea $AE = a$; entonces, por el planteamiento del problema, tenemos que $AB = 3a$. Así $EB = 2a$. Por sus ángulos, sabemos que los triángulos $AEG$ y $CFG$ son semejantes y, por lo anterior, están a proporción $2 : 1$. Esto nos lleva a que si nombramos $EG = b$, entonces $GF = 2b$. Luego, $BC = 3b$ (véase la primera figura de la solución).

En consecuencia, del área del rectángulo obtenemos:
$$\text{Área} = (\text{base}) \times (\text{altura}) \quad\Longrightarrow\quad 126 = (3b)(3a) = 9ab \quad\Longrightarrow\quad ab = 14.$$
Y, por lo tanto, la suma de las áreas de los triángulos $AEG$ y $CFG$ es:
$$\text{Área}(AEG) + \text{Área}(CFG) = \frac{ab}{2} + \frac{(2a)(2b)}{2} = \frac{ab}{2} + 2ab = \frac{14}{2} + 2 \times 14 = 35.$$

Solución 2. Aprovechamos que $AE$ es un tercio de $AB$ y dividimos la figura en 9 rectángulos iguales (véase la segunda figura de la solución). Cada uno de estos rectángulos aporta un área de $14$ cm$^2$.

Igual que en la Solución 1, los triángulos $AEG$ y $CFG$ son semejantes y están a proporción $2 : 1$. Esto nos da que el área buscada es 1 rectángulo más 3 mitades, o bien, 2 rectángulos y 1 mitad. Por lo tanto, el área sombreada es
$$14 \times 2 + 14 \times \frac{1}{2} = 35 \text{ cm}^2.$$`,
    },
  ],
}
