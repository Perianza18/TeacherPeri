// 9a OMMEB Guerrero · Concurso Estatal Selectivo · Nivel 2 (26 de julio de 2025).
// Transcrito de «E5_Selectivo_N2_9aOMMEBGro (RESP).pdf».
export default {
  edicion: 9,
  year: '2025',
  etapa: 'Selectivo',
  nivel: 2,
  grados: '6º de primaria y 1º de secundaria',
  fecha: '26 de julio de 2025',
  lugar: 'Chilpancingo de los Bravo, Gro.',
  duracionMinutos: 150,
  indicaciones: [
    'La duración del examen es de 2 horas y media.',
    'El uso de celulares, calculadoras, electrónicos, formularios y tablas no está permitido.',
    'Las figuras no están a escala, sólo son representativas.',
    'En caso de que las respuestas a estos problemas no sean enteras, estas deben ser aproximadas a dos decimales tomando en cuenta π = 3.14.',
    'Problemas 1 a 5: opción múltiple. Problemas 6 a 12: respuesta corta. Problemas 13 a 15: de redacción (se escribe la solución completa).',
  ],
  problemas: [
    {
      n: 1, area: 'Geometría',
      enunciado: String.raw`En un triángulo $ABC$ se traza una línea paralela al lado $BC$, la cual corta a los lados $AB$ y $AC$ en los puntos $D$ y $E$, respectivamente. Se sabe que:
$$AD = x + 2, \quad BD = 6, \quad AE = 3x \quad \text{y} \quad CE = 9.$$
¿Cuál es el valor de $x$?`,
      opciones: ['$2$', '$3$', '$4$', '$5$', '$6$'],
      respuesta: 'a',
    },
    {
      n: 2, area: 'Teoría de Números',
      enunciado: String.raw`Sebas tiene las siguientes cuatro cifras: 2, 0, 2 y 5. Usando algunos o todos estos cuatro dígitos, ¿cuántos múltiplos de 18 se pueden formar?`,
      opciones: ['$2$', '$6$', '$7$', '$9$', '$12$'],
      respuesta: 'd',
    },
    {
      n: 3, area: 'Teoría de Números',
      enunciado: String.raw`Un entero de tres cifras es potente si la suma de sus cifras es igual al número con sus cifras invertidas. Por ejemplo, si tomamos el número 501, entonces la suma de sus cifras es $5 + 0 + 1$ y el número con sus cifras invertidas es 105; claramente no es potente. ¿Cuántos números potentes hay?`,
      opciones: ['$0$', '$1$', '$5$', '$9$', '$10$'],
      respuesta: 'd',
    },
    {
      n: 4, area: 'Combinatoria',
      enunciado: String.raw`¿Cuál es la probabilidad de que en un grupo de tres personas haya al menos dos que nacieron el mismo día de la semana?`,
      opciones: ['$\\dfrac{1}{7}$', '$\\dfrac{30}{49}$', '$\\dfrac{19}{49}$', '$\\dfrac{3}{7}$', '$\\dfrac{18}{49}$'],
      respuesta: 'c',
    },
    {
      n: 5, area: 'Combinatoria',
      enunciado: String.raw`Miguel escribió todos los números de cuatro cifras que se pueden hacer usando los dígitos 1, 2, 3 y 4, con la repetición permitida. Cuando él ordena dichos números de menor a mayor, ¿qué lugar ocupa el número 4132?`,
      opciones: ['$64$', '$192$', '$202$', '$207$', '$256$'],
      respuesta: 'c',
    },
    {
      n: 6, area: 'Geometría',
      enunciado: String.raw`Un triángulo rectángulo tiene catetos $BC = 6$ cm y $CA = 8$ cm. Se traza una línea paralela al lado más grande, desde un punto $D$ sobre $BC$ tal que $BD$ y $DC$ están a razón $1:2$. Nombremos $E$ a la intersección de $CA$ con la paralela anterior. ¿Cuál es el perímetro del triángulo $DCE$?`,
      respuesta: '16 cm',
    },
    {
      n: 7, area: 'Teoría de Números',
      enunciado: String.raw`Paulina escribió todos los números de dos cifras. Luego tachó todos los que son pares, tienen dígitos iguales, o terminan en 5. ¿Cuántos números quedaron sin tachar?`,
      respuesta: '32',
    },
    {
      n: 8, area: 'Geometría',
      enunciado: String.raw`Atenea dibujó un cuadrado $PQRS$ de lado 15 cm y marcó los puntos $H$ sobre $PQ$ y $G$ sobre $QR$ de tal manera que $PH = QG = 8$ cm. Atenea llamó $T$ a la intersección de $PG$ con $SH$. ¿Cuál es el valor de $PT$?`,
      respuesta: '$\\dfrac{120}{17} \\approx 7.05$ cm',
    },
    {
      n: 9, area: 'Combinatoria',
      enunciado: String.raw`Amairani va a preparar aguinaldos de dulces para una fiesta. Cada aguinaldo debe contener exactamente 10 dulces, distribuidos de la siguiente manera: 2 paletas, 3 chocolates, 3 chicles y 2 gomitas. Amairani tiene disponibles:

• 5 tipos diferentes de paletas,
• 7 tipos diferentes de chocolates,
• 5 tipos diferentes de chicles, y
• 10 tipos diferentes de gomitas.

¿Cuántas maneras distintas tiene Amairani de formar un aguinaldo?`,
      respuesta: '157500',
    },
    {
      n: 10, area: 'Teoría de Números',
      enunciado: String.raw`Un número de tres dígitos $\overline{ABC}$ es fresco si el número de dos dígitos $\overline{AB}$ es primo y divide al número $\overline{BC}$. ¿Cuántos números frescos existen?`,
      respuesta: '4',
    },
    {
      n: 11, area: 'Álgebra',
      enunciado: String.raw`Supongamos que $a_1 < a_2 < \cdots < a_{25}$ son enteros positivos, tales que el promedio de $a_1 + a_2 + \cdots + a_{24}$ es la mitad del promedio de $a_1 + a_2 + \cdots + a_{24} + a_{25}$. ¿Cuál es el mínimo valor posible de $a_{25}$?`,
      respuesta: '325',
    },
    {
      n: 12, area: 'Álgebra',
      enunciado: String.raw`En la familia de Abril, todos desayunan con una taza de 8 onzas de café con leche, no necesariamente en la misma proporción. Ningún miembro de la familia toma café solo ni leche sola. En la mesa hay dos jarras, una de café y otra de leche. Abril se toma toda su taza y se da cuenta que ella se ha tomado un cuarto del total de leche y un sexto del total de café. ¿Cuántas personas tiene la familia de Abril?`,
      respuesta: '5',
    },
    {
      n: 13, area: 'Geometría',
      enunciado: String.raw`El cuadrilátero $ABCD$ tiene ángulo recto en $C$ y sus medidas son $AB = 6$ cm, $BC = 3$ cm, $CD = 4$ cm y $DA = 5$ cm. Calcule el área de $ABCD$.`,
      figuras: [
        { archivo: '2025-selectivo-n2-p13.png', alt: 'Cuadrilátero ABCD con A arriba a la izquierda, D a la derecha, B y C abajo; el ángulo en C es recto.' },
        { archivo: '2025-selectivo-n2-p13-sol1.png', alt: 'El cuadrilátero con sus medidas: $AB = 6$, $AD = 5$, $DC = 4$, $BC = 3$, y la diagonal $BD$ trazada en rojo.', en: 'solucion' },
        { archivo: '2025-selectivo-n2-p13-sol2.png', alt: 'El triángulo isósceles DAB con $DA = DB = 5$ y la altura $h$ desde $D$, que corta a $AB$ en su punto medio, dejando dos segmentos de 3.', en: 'solucion' },
      ],
      respuesta: '18 cm$^2$',
      solucion: String.raw`Solución 1. Trazamos el segmento $BD$. Entonces
$$\text{Área}(ABCD) = \text{Área}(BCD) + \text{Área}(DAB).$$
De manera inmediata tenemos que
$$\text{Área}(BCD) = \frac{3 \times 4}{2} = 6 \text{ cm}^2.$$
Puesto que $BCD$ es un triángulo rectángulo, por el Teorema de Pitágoras,
$$BD^2 = 3^2 + 4^2 \implies BD = 5.$$
Obtenemos que $DAB$ es un triángulo isósceles con $AD = DB = 5$. Podemos calcular su altura trazada desde $D$. La altura $h$ corta a $AB$ en su punto medio. Luego, por el Teorema de Pitágoras,
$$h^2 + 3^2 = 5^2 \implies h = 4.$$
De modo que
$$\text{Área}(DAB) = \frac{6 \times 4}{2} = 12 \text{ cm}^2.$$
Por lo tanto,
$$\text{Área}(ABCD) = 6 + 12 = 18 \text{ cm}^2.$$

Solución 2. De manera análoga a la Solución 1, se tiene $\text{Área}(BCD) = 6$ cm$^2$ y $BD = 5$. Para calcular el área del triángulo $DAB$, usamos la fórmula de Herón
$$A = \sqrt{S(S - a)(S - b)(S - c)},$$
donde $S = \frac{a + b + c}{2}$ es el semiperímetro y $a$, $b$ y $c$ son las medidas de los lados del triángulo. Se concluye que:
$$\text{Área}(DAB) = \sqrt{8 \times 3 \times 3 \times 2} = \sqrt{144} = 12 \text{ cm}^2.$$
Por lo tanto,
$$\text{Área}(ABCD) = 6 + 12 = 18 \text{ cm}^2.$$`,
    },
    {
      n: 14, area: 'Álgebra',
      enunciado: String.raw`Un marciano, un terrícola y un venusiano llegaron en la misma nave espacial a Júpiter y cada uno se dirigió a su estación espacial. Al cabo de un tiempo, se encontraron en un puerto espacial.

• El terrícola dijo: “Pasé exactamente la mitad de mi vida aquí”.
• El venusiano dijo: “Pasé una cuarta parte de mi vida aquí”.
• El marciano dijo: “Pasé una sexta parte de mi vida aquí”.
• El venusiano dijo: “Marciano, tú y yo tenemos un total de 300 años terrestres”.

¿Cuántos años terrestres tiene el terrícola?`,
      respuesta: '60 años terrestres',
      solucion: String.raw`Sean $t$ = edad del terrícola, $v$ = edad del venusiano y $m$ = edad del marciano, todas en años terrestres.

Como todos pasaron el mismo tiempo en Júpiter, se tiene que:
$$\frac{t}{2} = \frac{v}{4} = \frac{m}{6}.$$
Podemos dividir esto en dos igualdades, es decir, la proporción que existe entre las edades del venusiano y el marciano con respecto a la edad del terrícola:
$$\frac{t}{2} = \frac{v}{4}, \qquad \frac{t}{2} = \frac{m}{6},$$
y despejar las variables $v$ y $m$ en función de $t$:
$$2t = v, \qquad 3t = m.$$
Dado que el venusiano y el marciano tienen un total de 300 años terrestres, se sigue que:
$$v + m = 300 \implies 2t + 3t = 300 \implies 5t = 300 \implies t = 60.$$
Por lo tanto, el terrícola tiene 60 años terrestres.`,
    },
    {
      n: 15, area: 'Teoría de Números',
      enunciado: String.raw`Vicente va a llenar una tabla de 3 filas por 2025 columnas como sigue:

• En la primera fila, escribe los números del 1 al 2025, uno en cada casilla.
• En la segunda fila, escribe los mismos números pero desordenados.
• En la tercera fila, escribió la diferencia de los dos números ubicados en esa columna.

Finalmente, él hizo la multiplicación de los números ubicados en la tercera fila. Vicente notó algo muy interesante: que sin importar cómo se coloquen los 2025 números en la segunda fila, el resultado de la multiplicación siempre es un número par. Escribe por qué siempre pasa esto.`,
      solucion: String.raw`Entre 1 y 2025 hay más impares que pares; en específico, hay un impar más que la cantidad de pares (1013 impares y 1012 pares).

Denotemos por $I$ = números impares y $P$ = números pares. Sabemos que:

• Una suma es par cuando ambos sumandos tienen la misma paridad: $I + I = P$, $P + P = P$.
• Una suma es impar cuando ambos sumandos tienen distinta paridad: $I + P = I$.
• Un producto es par cuando al menos uno de los factores es par: $P \times P = P$, $P \times I = P$.
• Un producto es impar cuando todos los factores son impares: $I \times I = I$.

Al intentar colocar los números de la segunda fila, en el peor de los casos se van a escribir los impares debajo de los pares, con el fin de que su diferencia sea impar (los números que se van a escribir en la tercera fila):
$$\begin{array}{|c|c|c|c|c|c|c|} \hline 1 & 2 & 3 & 4 & \cdots & 2024 & 2025 \\ \hline & I & & I & \cdots & I & \\ \hline \end{array}$$
Hace falta colocar un impar. Forzosamente, este impar debe estar debajo de otro impar, de modo que la tabla completa es:
$$\begin{array}{|c|c|c|c|c|c|c|} \hline 1 & 2 & 3 & 4 & \cdots & 2024 & 2025 \\ \hline I & I & P & I & \cdots & I & P \\ \hline P & I & I & I & \cdots & I & I \\ \hline \end{array}$$
Por lo tanto, al existir al menos un par, el producto de los enteros en la tercera fila es par.`,
    },
  ],
}
