// 9a OMMEB Guerrero · Concurso Estatal Selectivo · Nivel 3 (26 de julio de 2025).
// Transcrito de «E5_Selectivo_N3_9aOMMEBGro (RESP).pdf».
export default {
  edicion: 9,
  year: '2025',
  etapa: 'Selectivo',
  nivel: 3,
  grados: '2º de secundaria',
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
      n: 1, area: 'Teoría de Números',
      enunciado: String.raw`Sebas tiene los números 2, 0, 2 y 5. ¿Cuántos múltiplos de 18 se obtienen al usar algunos o todos estos cuatro dígitos?`,
      opciones: ['$2$', '$6$', '$7$', '$9$', '$12$'],
      respuesta: 'd',
    },
    {
      n: 2, area: 'Geometría',
      enunciado: String.raw`Paloma dibujó una circunferencia $\mathcal{C}$ de radio $r$, en la que marcó su centro $O$. Luego, colocó cuatro puntos $A$, $B$, $C$ y $D$ sobre $\mathcal{C}$ de modo que $ABCD$ sea un cuadrado inscrito en la circunferencia. ¿Cuál es la diferencia entre el área de la circunferencia y el área del cuadrado?`,
      opciones: ['$\\pi r^2 - r^2$', '$\\pi r^2 - 2r^2$', '$\\pi r^2 - \\dfrac{r^2}{2}$', '$\\pi r^2 - \\dfrac{r^2}{\\sqrt{2}}$', '$\\pi r^2 - \\dfrac{r^2}{2\\sqrt{2}}$'],
      respuesta: 'b',
    },
    {
      n: 3, area: 'Teoría de Números',
      enunciado: String.raw`Un entero de tres cifras es potente si la suma de sus cifras es igual al número con sus cifras invertidas. Por ejemplo, si tomamos el número 501, entonces la suma de sus cifras es $5 + 0 + 1$ y el número con sus cifras invertidas es 105; claramente no es potente. ¿Cuántos números potentes hay?`,
      opciones: ['$0$', '$1$', '$5$', '$9$', '$10$'],
      respuesta: 'd',
    },
    {
      n: 4, area: 'Teoría de Números',
      enunciado: String.raw`Un número de tres dígitos $\overline{ABC}$ es fresco si el número de dos dígitos $\overline{AB}$ es primo y divide al número $\overline{BC}$. ¿Cuántos números frescos existen?`,
      opciones: ['$0$', '$1$', '$2$', '$3$', '$4$'],
      respuesta: 'e',
    },
    {
      n: 5, area: 'Combinatoria',
      enunciado: String.raw`¿Cuál es la probabilidad de que en un grupo de tres personas haya al menos dos que nacieron el mismo día de la semana?`,
      opciones: ['$\\dfrac{1}{7}$', '$\\dfrac{30}{49}$', '$\\dfrac{19}{49}$', '$\\dfrac{3}{7}$', '$\\dfrac{18}{49}$'],
      respuesta: 'c',
    },
    {
      n: 6, area: 'Combinatoria',
      enunciado: String.raw`Amairani va a preparar aguinaldos de dulces para una fiesta. Cada aguinaldo debe contener exactamente 10 dulces, distribuidos de la siguiente manera: 2 paletas, 3 chocolates, 3 chicles y 2 gomitas. Amairani tiene disponibles:

• 5 tipos diferentes de paletas,
• 7 tipos diferentes de chocolates,
• 5 tipos diferentes de chicles, y
• 10 tipos diferentes de gomitas.

¿Cuántas maneras distintas tiene Amairani de formar un aguinaldo?`,
      respuesta: '157500',
    },
    {
      n: 7, area: 'Geometría',
      enunciado: String.raw`Un triángulo rectángulo tiene catetos $BC = 6$ cm y $CA = 8$ cm. Se traza una línea paralela al lado más grande, desde un punto $D$ sobre $BC$ tal que $BD$ y $DC$ están a razón $1:2$. Nombremos $E$ a la intersección de $CA$ con la paralela anterior. ¿Cuál es el perímetro del triángulo $DCE$?`,
      respuesta: '16 cm',
    },
    {
      n: 8, area: 'Combinatoria',
      enunciado: String.raw`Mario y Luigi buscan números de tres cifras que:

• Sean pares,
• Tengan dígitos en orden estrictamente descendente (centena > decena > unidad).

Mario suma los 5 números más grandes. Luigi suma los 7 más pequeños. ¿Cuánto se obtiene al restar la suma de Luigi a la de Mario?`,
      respuesta: '2376',
    },
    {
      n: 9, area: 'Geometría',
      enunciado: String.raw`En la tarea de Miguel se le pidió dibujar todos los triángulos rectángulos que tengan un lado igual a 15 cm, evitando los que sean congruentes. ¿Cuántos triángulos va a dibujar?

Nota: Dos triángulos son congruentes cuando puedes sobreponer uno sobre otro, es decir, cuando las medidas entre ambos sean las mismas. En la figura se muestra un par de triángulos congruentes (por supuesto, ninguno de ellos es respuesta a este problema).`,
      figuras: [{ archivo: '2025-selectivo-n3-p09.png', alt: 'Dos triángulos congruentes con lados 5, 6 y 8, dibujados en posiciones distintas.' }],
      respuesta: '5',
    },
    {
      n: 10, area: 'Álgebra',
      enunciado: String.raw`Supongamos que $a_1 < a_2 < \cdots < a_{25}$ son enteros positivos, tales que el promedio de $a_1 + a_2 + \cdots + a_{24}$ es la mitad del promedio de $a_1 + a_2 + \cdots + a_{24} + a_{25}$. ¿Cuál es el mínimo valor posible de $a_{25}$?`,
      respuesta: '325',
    },
    {
      n: 11, area: 'Álgebra',
      enunciado: String.raw`En la familia de Abril, todos desayunan con una taza de 8 onzas de café con leche, no necesariamente en la misma proporción. Ningún miembro de la familia toma café solo ni leche sola. En la mesa hay dos jarras, una de café y otra de leche. Abril se toma toda su taza y se da cuenta que ella se ha tomado un cuarto del total de leche y un sexto del total de café. ¿Cuántas personas tiene la familia de Abril?`,
      respuesta: '5',
    },
    {
      n: 12, area: 'Teoría de Números',
      enunciado: String.raw`Encuentra la cantidad de ternas de números enteros positivos distintos $(a, b, c)$ tales que
$$\frac{1}{a} + \frac{1}{b} + \frac{1}{c}$$
es un número entero.

Nota: Una terna $(a, b, c)$ es un arreglo de números donde importa el orden; por ejemplo, las ternas $(1, 2, 3)$ y $(2, 1, 3)$ se consideran distintas.`,
      respuesta: '6',
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
      n: 14, area: 'Teoría de Números',
      enunciado: String.raw`¿Cuál es el menor entero positivo $n$ tal que $8n$ es un cuadrado perfecto y $12n$ es un cubo perfecto?

Nota: Un cuadrado perfecto se obtiene del producto de dos enteros iguales; por ejemplo, $25 = 5 \times 5$ es un cuadrado perfecto. Un cubo perfecto es el resultado de multiplicar tres enteros iguales; por ejemplo, $27 = 3 \times 3 \times 3$ es un cubo perfecto.`,
      respuesta: '18',
      solucion: String.raw`Solución 1. Buscamos que
$$8n = a^2, \qquad 12n = b^3, \qquad a, b \in \mathbb{Z}.$$
Al descomponer, obtenemos que
$$2^3 n = a^2, \qquad (1)$$
$$2^2 \times 3n = b^3. \qquad (2)$$
La ecuación (1) nos dice que
$$n = 2^{\text{impar}} \times c^2, \qquad c \in \mathbb{Z}. \qquad (3)$$
Esto es, $n$ debe tener una cantidad impar de factores 2 en su descomposición, además de otro cuadrado perfecto.

Por otra parte, la ecuación (2) nos da
$$n = 2^{3p+1} \times 3^{3q+2} \times d^3, \qquad d, p, q \in \mathbb{Z}. \qquad (4)$$
Lo que nos indica que $n$ tiene que tener $3p + 1$ factores iguales a 2 (o sea, el exponente del 2 puede ser 1, 4, 7, 10, …) y $3q + 2$ factores iguales a 3 (o sea, el exponente del 3 puede ser 2, 5, 8, 11, …).

Notemos que, para tomar el menor valor posible de $n$, podemos hacer $p = q = 0$ y $d = 1$ en (4), y se cumplen las condiciones de (3). Por lo tanto,
$$n = 2^1 \times 3^2 = 18$$
es la respuesta al problema.

Solución 2. Un cuadrado perfecto $a^2$ es múltiplo de 8 si y sólo si $a$ es múltiplo de 4; esto es, $a$ no puede ser de la forma $4k + 2$, con $k$ entero. Escribimos algunos cuadrados perfectos múltiplos de 8:
$$4^2 = 16, \quad 8^2 = 64, \quad 12^2 = 144, \quad 16^2 = 256, \quad 20^2 = 400.$$
Puesto que cada cuadrado es de la forma $8n$, tenemos algunos candidatos para $n$, los cuales son, respectivamente,
$$n = 2, \quad n = 8, \quad n = 18, \quad n = 32, \quad n = 50.$$
Eso quiere decir que los valores posibles de $12n$ son
$$12n = 24, \quad 12n = 96, \quad 12n = 216, \quad 12n = 384, \quad 12n = 600.$$
Y entre los primeros cubos perfectos, $1, 8, 27, 64, 125, 216, \ldots$, el menor de ellos que aparece es 216 y, por lo tanto, $n = 18$ es la respuesta.`,
    },
    {
      n: 15, area: 'Combinatoria',
      enunciado: String.raw`Vicente desea pintar los vértices de un hexágono regular utilizando únicamente los colores azul y rojo, asignando un sólo color a cada vértice. Sin embargo, no quiere que haya dos vértices rojos que estén conectados por un lado del hexágono, es decir, que sean adyacentes. En la figura se muestra un ejemplo de una configuración no válida, ya que existen vértices rojos adyacentes. ¿De cuántas maneras distintas Vicente puede pintar los vértices del hexágono cumpliendo esta condición?`,
      figuras: [
        { archivo: '2025-selectivo-n3-p15.png', alt: 'Hexágono regular con vértices coloreados; empezando arriba a la izquierda y en sentido horario: azul, rojo, azul, azul, rojo, rojo. Los dos vértices rojos de abajo a la izquierda son adyacentes.' },
        { archivo: '2025-selectivo-n3-p15-sol1.png', alt: 'Hexágono con dos vértices rojos consecutivos (abajo a la izquierda): un coloreo no válido del caso 2.', en: 'solucion' },
        { archivo: '2025-selectivo-n3-p15-sol2.png', alt: 'Los dos coloreos con tres vértices rojos alternados con tres azules.', en: 'solucion' },
      ],
      respuesta: '17',
      nota: 'El comité aclaró que hay una ambigüedad: se decidió asumir que ambos colores se usan al menos una vez, por lo que no se cuenta el caso en que todos los vértices son azules.',
      solucion: String.raw`El hexágono puede estar pintado con 1, 2 o 3 puntos rojos, porque si se pinta con 4 o más, existirá al menos un par de puntos rojos que sean adyacentes. Resolveremos el problema por casos:

Caso 1: Un punto rojo. Tenemos seis vértices, entonces hay 6 formas de colorear.

Caso 2: Dos puntos rojos. De los seis vértices elegimos dos; lo podemos hacer de
$$\binom{6}{2} = \frac{6!}{2! \times 4!} = 15 \text{ formas}.$$
Entre ellas, quitamos los coloreos donde los vértices son consecutivos (véase la primera figura de la solución). De modo que son 6 configuraciones no válidas. En consecuencia, el total de este caso es
$$\binom{6}{2} - 6 = 15 - 6 = 9 \text{ formas de colorear}.$$
Caso 3: Tres puntos rojos. Existen 2 formas de colorear (segunda figura de la solución).

Por lo tanto, el total es
$$6 + 9 + 2 = 17 \text{ maneras distintas de colorear}.$$`,
    },
  ],
}
