// 10a OMMEB Guerrero · Concurso Estatal Selectivo · Nivel 3 (25 de julio de 2026).
// Transcrito de «E4_N3_Selectivo_10aOMMEBGro (RESP).pdf».
export default {
  edicion: 10,
  year: '2026',
  etapa: 'Selectivo',
  nivel: 3,
  grados: '2º de secundaria',
  fecha: '25 de julio de 2026',
  lugar: 'Iguala de la Independencia, Gro.',
  duracionMinutos: 120,
  indicaciones: [
    'La duración del examen es de 2 horas.',
    'El uso de celulares, calculadoras, electrónicos, formularios y tablas no está permitido.',
    'Las figuras no están a escala, sólo son representativas.',
    'Cuando las respuestas de estos problemas no sean números enteros, deberán aproximarse a dos cifras decimales, considerando π = 3.14.',
    'Problemas 1 a 5: opción múltiple. Problemas 6 a 12: respuesta corta. Problemas 13 a 15: de redacción (se escribe la solución completa).',
  ],
  problemas: [
    {
      n: 1, area: 'Teoría de Números',
      enunciado: String.raw`¿Cuántos divisores positivos de 10000 no son divisores de 100?`,
      opciones: ['$9$', '$12$', '$16$', '$20$', '$25$'],
      respuesta: 'c',
    },
    {
      n: 2, area: 'Álgebra',
      enunciado: String.raw`La suma de los tres primeros términos de una progresión aritmética es 16 y el cuarto término es 3. Determina el valor del primer término.`,
      opciones: ['$\\dfrac{5}{2}$', '$\\dfrac{13}{2}$', '$\\dfrac{7}{2}$', '$\\dfrac{9}{2}$', '$\\dfrac{11}{2}$'],
      respuesta: 'b',
    },
    {
      n: 3, area: 'Geometría',
      enunciado: String.raw`Miguel dibujó un cuadrado gris de lado 2026 cm. En su interior dibujó un cuadrado blanco de lado 2025 cm. Después, dentro de este último, dibujó un cuadrado gris de lado 2024 cm y continuó el proceso alternando los colores y disminuyendo en 1 cm la longitud del lado de cada nuevo cuadrado, hasta dibujar un último cuadrado de lado 1 cm. Cada cuadrado quedó completamente contenido en el anterior. ¿Cuál es el área total que quedó visible de color gris?

Nota: En la figura se muestran los primeros cuatro cuadrados dibujados por Miguel.`,
      figuras: [{ archivo: '2026-selectivo-n3-p03.png', alt: 'Cuatro cuadrados, cada uno dentro del anterior y ligeramente girado: gris, blanco, gris y blanco.' }],
      opciones: ['$1013^2$ cm$^2$', '$2026 \\cdot 1013$ cm$^2$', '$2026^2$ cm$^2$', '$2026 \\cdot 2027$ cm$^2$', '$2027 \\cdot 1013$ cm$^2$'],
      respuesta: 'e',
    },
    {
      n: 4, area: 'Álgebra',
      enunciado: String.raw`¿Cuál es el coeficiente del término $xyz$ en el desarrollo de $(x + y + z)^3$?`,
      opciones: ['$1$', '$3$', '$6$', '$9$', '$12$'],
      respuesta: 'c',
    },
    {
      n: 5, area: 'Geometría',
      enunciado: String.raw`En el cuadrilátero $ABCD$, la suma de los ángulos $\angle A$ y $\angle C$ es $150^\circ$. Las bisectrices de estos ángulos se intersectan en el punto $P$. Se conoce que el ángulo $\angle APC = 140^\circ$ y que el ángulo $\angle B$ es agudo. ¿Cuál es el valor del ángulo $\angle B$?`,
      opciones: ['$40^\\circ$', '$55^\\circ$', '$65^\\circ$', '$70^\\circ$', '$75^\\circ$'],
      respuesta: 'c',
    },
    {
      n: 6, area: 'Combinatoria',
      enunciado: String.raw`Usando solo dígitos iguales a 0, 1 o 2, ¿cuántos enteros positivos menores a un millón son tales que la suma de sus cifras es 6?`,
      respuesta: '141',
    },
    {
      n: 7, area: 'Geometría',
      enunciado: String.raw`Dentro del cuadrado $ABCD$ se dibujó un triángulo $DEF$ de área $76$ cm$^2$, donde $E$ está en el lado $AB$ y $F$ en $BC$. Si se sabe que $AE$ y $EB$ están a razón $2 : 3$ y $EB = FC$, ¿cuál es el valor del área, en cm$^2$, de $ABCD$?`,
      figuras: [{ archivo: '2026-selectivo-n3-p07.png', alt: 'Cuadrado ABCD con A arriba a la izquierda y D abajo a la izquierda; E está en el lado AB y F en el lado BC, y se traza el triángulo DEF.' }],
      respuesta: '200',
    },
    {
      n: 8, area: 'Combinatoria',
      enunciado: String.raw`Se elige al azar un número entero entre 1000 y 9999, ambos incluidos. La probabilidad de que el número elegido sea impar y tenga sus cuatro cifras distintas puede escribirse como una fracción irreducible $\frac{a}{b}$. ¿Cuál es el valor de $a + b$?

Nota: Una fracción es irreducible si su numerador y su denominador no tienen divisores comunes mayores que 1.`,
      respuesta: '281',
    },
    {
      n: 9, area: 'Geometría',
      enunciado: String.raw`Sea $ABC$ un triángulo isósceles tal que $BC = AC$ y $\angle ACB = 40^\circ$. La circunferencia de diámetro $BC$ corta a los lados $AC$ y $AB$ en $D$ y $E$, respectivamente. Sea $F$ la intersección de $CE$ con $BD$. Encuentra el valor del ángulo $\angle BFC$.`,
      respuesta: '$110^\\circ$',
    },
    {
      n: 10, area: 'Álgebra',
      enunciado: String.raw`Un grupo de ranas vive en un árbol. Una rana se vuelve verde cuando está en la sombra y amarilla cuando está bajo el sol. Inicialmente, había 3 ranas verdes por cada rana amarilla. Luego, 3 ranas verdes se movieron al lado soleado y 5 ranas amarillas a la sombra. Ahora, hay 4 ranas verdes por cada amarilla. ¿Cuál es la diferencia entre el número de ranas verdes y amarillas ahora?

Nota: Cada rana está completamente en la sombra o completamente bajo el sol.`,
      respuesta: '24',
    },
    {
      n: 11, area: 'Teoría de Números',
      enunciado: String.raw`Sean $m$ y $n$ enteros positivos tales que
$$\frac{1}{m} + \frac{1}{n} - \frac{1}{mn^2} = \frac{3}{4}.$$
¿Cuál es el mayor valor posible para $m + n$?`,
      respuesta: '5',
    },
    {
      n: 12, area: 'Álgebra',
      enunciado: String.raw`Supongamos que $0 < b < a$ y que $a^2 + b^2 = 3ab$. Calcula el valor numérico de $\dfrac{a + b}{a - b}$.`,
      respuesta: '$\\sqrt{5}$',
    },
    {
      n: 13, area: 'Teoría de Números',
      enunciado: String.raw`En las siguientes sumas horizontales debemos colocar en cada cuadrito un signo $+$ o un signo $-$, de forma que el resultado sea cero. En cada caso, explica si es posible o no lograrlo y por qué.

• $\square\, 1 \;\square\, 2 \;\square\, 3 \;\square\, 4 \;\square\, 5 \;\square\, 6 \;\square\, 7 \;\square\, 8 \;\square\, 9 \;\square\, 10 = 0$
• $\square\, 1 \;\square\, 2 \;\square\, 3 \;\square\, 4 \;\square\, 5 \;\square\, 6 \;\square\, 7 \;\square\, 8 \;\square\, 9 \;\square\, 10 \;\square\, 11 = 0$`,
      respuesta: 'La primera no es posible; la segunda sí.',
      solucion: String.raw`El primer caso no es posible lograrlo. Notemos que al hacer la suma de todos los números se tiene la suma de Gauss:
$$1 + 2 + \cdots + 10 = 55.$$
Como este valor es impar, es imposible dividirlo en dos sumas iguales para que la diferencia sea 0.

El segundo caso, por su parte, sí es posible lograrlo. De forma similar, al hacer la suma de Gauss:
$$1 + 2 + \cdots + 11 = 66.$$
Se tiene un valor par; entonces, con dos sumas iguales a 33 se puede tener una diferencia cero. Una manera de hacerlo es dejando como negativos a los números 3, 9, 10 y 11; explícitamente:
$$+1 + 2 - 3 + 4 + 5 + 6 + 7 + 8 - 9 - 10 - 11 = 0.$$`,
    },
    {
      n: 14, area: 'Teoría de Números',
      enunciado: String.raw`Para los estudiantes del Selectivo, se compraron 45 lápices iguales. Cada lápiz costó más de 10.00 pesos y su precio tenía a lo más dos cifras decimales. Al revisar el ticket de compra, se observó que al costo total le había caído agua y se habían borrado la primera y la última cifra. Solo quedó visible lo siguiente:
$$\underline{\phantom{0}}\,29.9\,\underline{\phantom{0}} \text{ pesos}$$
donde cada espacio en blanco representa un dígito borrado. ¿Cuál fue el costo de cada lápiz?`,
      figuras: [{ archivo: '2026-selectivo-n3-p14.jpg', alt: 'Foto de un ticket mojado: «TOTAL A PAGAR:» y debajo el signo de pesos, una mancha, «29.9» y otra mancha.' }],
      respuesta: '16.22 pesos',
      solucion: String.raw`Sea $x$ el costo de cada lápiz; entonces $45x = \overline{A299B}/100$, donde $A$ y $B$ son dígitos. Al multiplicar por 100, se tiene $45(100x) = \overline{A299B}$. Notemos que $100x$ es un entero, pues el precio de cada lápiz tenía a lo más dos cifras decimales. Entonces $\overline{A299B}$ es múltiplo de 45.

Por el criterio de divisibilidad por 5 se tiene que $B = 0$ o $B = 5$. Por el criterio de divisibilidad por 9, debemos lograr que $A + 2 + 9 + 9 + B$ sea múltiplo de 9, es decir, que $A + 2 + B$ sea múltiplo de 9.

• Caso I: $B = 5$. Entonces $A = 2$. Obtenemos que el total pagado es 229.95 pesos. Pero cada lápiz costó más de 10 pesos, entonces el total debe ser mayor a 450. Este caso queda descartado.
• Caso II: $B = 0$. Entonces $A = 7$. El total pagado es 729.90 pesos. Por tanto $45x = 729.90$ y $x = 16.22$.

Cada lápiz costó 16.22 pesos.`,
    },
    {
      n: 15, area: 'Geometría',
      enunciado: String.raw`La medida del lado de un rombo $ABCD$ es 10 cm, y su área es $80$ cm$^2$. Tomemos un punto $E$ en el lado $AB$ tal que $DE$ es perpendicular a $AB$. ¿Cuánto mide $AE$?`,
      figuras: [{ archivo: '2026-selectivo-n3-p15-sol.png', alt: 'Rombo ABCD con lados de 10, la diagonal BD y el segmento DE perpendicular al lado AB.', en: 'solucion' }],
      respuesta: '6 cm',
      solucion: String.raw`Tracemos la diagonal $BD$. Notemos que los triángulos $BDA$ y $BDC$ son congruentes por LLL, ya que dos de sus lados son los del rombo y comparten $BD$. Entonces ambos tienen $40$ cm$^2$ de área.

Luego, en el triángulo $BDA$ se tiene que $ED$ es su altura; así
$$\frac{AB \cdot ED}{2} = 40 \implies \frac{10 \cdot ED}{2} = 40 \implies ED = 8.$$
Finalmente, para calcular $AE$ tenemos dos maneras:

• Primera forma: por el Teorema de Pitágoras, se tiene $10^2 = (AE)^2 + 8^2$ y, por lo tanto, $AE = 6$ cm.
• Segunda forma: el triángulo rectángulo $AED$ es semejante al 3-4-5, con un factor de escala de 2. Por lo tanto, $AE = 3 \times 2 = 6$.`,
    },
  ],
}
