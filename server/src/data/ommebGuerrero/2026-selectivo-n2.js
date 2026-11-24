// 10a OMMEB Guerrero · Concurso Estatal Selectivo · Nivel 2 (25 de julio de 2026).
// Transcrito de «E4_N2_Selectivo_10aOMMEBGro (RESP).pdf».
export default {
  edicion: 10,
  year: '2026',
  etapa: 'Selectivo',
  nivel: 2,
  grados: '6º de primaria y 1º de secundaria',
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
      n: 1, area: 'Combinatoria',
      enunciado: String.raw`Se tiene la lista de todos los números de cuatro dígitos que no usan al cero en su escritura. ¿En cuántos de estos números no aparece el 7 en la posición de las centenas?`,
      opciones: ['$5832$', '$5184$', '$5760$', '$5904$', '$6561$'],
      respuesta: 'a',
    },
    {
      n: 2, area: 'Álgebra',
      enunciado: String.raw`Jaime, Guadalupe y Resendiz, los jaguares, estaban platicando sobre datos curiosos en la cantidad de sus manchas.

• Jaime: La suma de las manchas de Guadalupe y Resendiz es el doble de la cantidad de manchas que tengo.
• Guadalupe: ¡Qué curioso! También ocurre que la suma de las manchas de Resendiz y Jaime dan el doble de las que yo tengo.

Se sabe que uno de los tres jaguares tiene 2026 manchas. ¿Cuántas manchas tiene Resendiz?`,
      opciones: ['$1013$', '$4052$', '$6078$', '$2026$', 'No se puede saber.'],
      respuesta: 'd',
    },
    {
      n: 3, area: 'Teoría de Números',
      enunciado: String.raw`Encuentra la mayor potencia de 3 que divide a $100!$.`,
      opciones: ['$3^{45}$', '$3^{46}$', '$3^{47}$', '$3^{48}$', '$3^{49}$'],
      respuesta: 'd',
    },
    {
      n: 4, area: 'Geometría',
      enunciado: String.raw`El perímetro de un cuadrado inscrito a una circunferencia $\mathcal{C}$ es 36 m. Calcula el área del cuadrado circunscrito a $\mathcal{C}$.`,
      opciones: ['$\\dfrac{81}{2}$ m$^2$', '$81$ m$^2$', '$36\\sqrt{2}$ m$^2$', '$18\\sqrt{2}$ m$^2$', '$162$ m$^2$'],
      respuesta: 'e',
    },
    {
      n: 5, area: 'Álgebra',
      enunciado: String.raw`La suma de los tres primeros términos de una progresión aritmética es 16 y el cuarto término es 3. Determina el valor del primer término.`,
      opciones: ['$\\dfrac{5}{2}$', '$\\dfrac{13}{2}$', '$\\dfrac{7}{2}$', '$\\dfrac{9}{2}$', '$\\dfrac{11}{2}$'],
      respuesta: 'b',
    },
    {
      n: 6, area: 'Teoría de Números',
      enunciado: String.raw`La suma de dos números primos es 63. ¿Cuántos valores distintos hay para el producto de ellos?`,
      respuesta: '1',
    },
    {
      n: 7, area: 'Combinatoria',
      enunciado: String.raw`Usando solo dígitos iguales a 0, 1 o 2, ¿cuántos enteros positivos menores a un millón son tales que la suma de sus cifras es 6?`,
      respuesta: '141',
    },
    {
      n: 8, area: 'Geometría',
      enunciado: String.raw`Dibuja un hexágono regular $ABCDEF$. En el interior del hexágono se toma un punto $P$ de tal manera que $AP = PC = EF$. Si $Q$ es el punto medio de $DE$, ¿cuánto mide el ángulo $\angle APQ$?`,
      respuesta: '$150^\\circ$',
    },
    {
      n: 9, area: 'Geometría',
      enunciado: String.raw`En la figura se muestran diez cuadrados, uno dentro de otro. Sus colores alternan entre gris y blanco, comenzando con gris en el cuadrado más grande. El cuadrado más grande tiene lado de 10 cm. El siguiente tiene lado de 9 cm, el siguiente de 8 cm, y así sucesivamente, hasta llegar al cuadrado más pequeño, que tiene lado de 1 cm. ¿Cuál es el área total de color gris, en cm$^2$?`,
      figuras: [{ archivo: '2026-selectivo-n2-p09.png', alt: 'Diez cuadrados uno dentro de otro, alternando gris y blanco, empezando con gris en el más grande.' }],
      respuesta: '55',
    },
    {
      n: 10, area: 'Combinatoria',
      enunciado: String.raw`Se tienen tres tazas indistinguibles, tres canicas azules y tres canicas rojas. Las canicas del mismo color también son indistinguibles entre sí. Se reparten todas las canicas entre las tres tazas con la posibilidad de que alguna de ellas quede vacía. ¿De cuántas maneras diferentes puede hacerse la repartición?`,
      respuesta: '19',
    },
    {
      n: 11, area: 'Geometría',
      enunciado: String.raw`En la figura se muestra el pentágono $ABCDE$ y las longitudes de sus lados. Se sabe que las rectas $AE$ y $BD$ son paralelas, así como las rectas $AC$ y $DE$, y que $\angle DEA = 90^\circ$. Si el área del pentágono puede expresarse como $a + b\sqrt{c}$, donde $a$, $b$ y $c$ son enteros positivos y $c$ no es divisible por el cuadrado de ningún número primo, ¿cuál es el valor de $a + b + c$?`,
      figuras: [{ archivo: '2026-selectivo-n2-p11.png', alt: 'Pentágono ABCDE con $AB = 10$, $BC = 8\\sqrt{2}$, $CD = 16$, $DE = 6$ y $EA = 8\\sqrt{3}$; el ángulo en E es recto.' }],
      respuesta: '139',
    },
    {
      n: 12, area: 'Álgebra',
      enunciado: String.raw`Sean $x$, $y$ números reales. Encuentra el menor valor de
$$2x^2 + 2xy + y^2 + 10x + 38.$$`,
      respuesta: '13',
    },
    {
      n: 13, area: 'Teoría de Números',
      enunciado: String.raw`Encuentra todos los números de tres dígitos que cumplen que:

• No son divisibles por 2.
• Son múltiplos de 5.
• Son múltiplos de 9.`,
      respuesta: '10 números: 135, 225, 315, 405, 495, 585, 675, 765, 855 y 945',
      solucion: String.raw`Solución 1. Dado que son múltiplos de 5, por el criterio de divisibilidad, terminan en 0 o en 5. Pero como son impares (no son divisibles por 2), la única opción es que terminen en 5.

Por el criterio de divisibilidad del 9, la suma de sus cifras debe ser múltiplo de 9. Escribamos el número como $\overline{AB5}$, donde $A$ y $B$ son sus dígitos. La suma de las cifras es $A + B + 5$, de modo que
$$6 = 1 + 0 + 5 \le A + B + 5 \le 9 + 9 + 5 = 23.$$
Las únicas sumas posibles que son múltiplos de 9 son 9 y 18.

• Caso I. La suma de sus cifras es 9. Entonces $A + B = 4$, lo que nos da 4 opciones: $(A, B) = (1, 3), (2, 2), (3, 1), (4, 0)$.
• Caso II. La suma de sus cifras es 18. Entonces $A + B = 13$, lo que nos da 6 opciones: $(A, B) = (4, 9), (5, 8), (6, 7), (7, 6), (8, 5), (9, 4)$.

Por lo tanto, hay $4 + 6 = 10$ números.

Solución 2. Los números que buscamos son impares. Dado que el mínimo común múltiplo de 9 y 5 es 45, se tiene que, encontrando uno de ellos, los demás van de 45 en 45. El menor número de tres dígitos que satisface las condiciones es 135.

Los múltiplos consecutivos de 45 alternan entre impares y pares, ya que 45 es impar. Por ejemplo, después de 135 se encuentra $135 + 45 = 180$, que es par y, por lo tanto, no satisface la primera condición. Así, para obtener únicamente los múltiplos impares de 45, debemos avanzar de 90 en 90.

Puesto que el primero es $135 + 90 \times 0 = 135$ y el último es $135 + 90 \times 9 = 945$, se tiene que hay 10 números que satisfacen las condiciones.`,
    },
    {
      n: 14, area: 'Geometría',
      enunciado: String.raw`Observe la siguiente figura. Sea $ABC$ un triángulo. Sea $D$ un punto en el plano opuesto a $B$ tal que el triángulo $ADC$ es equilátero. Sean $E$, $F$ puntos en el plano opuestos a $C$ tales que $AEFB$ es un cuadrado. Suponiendo que $E$, $A$, $C$ son colineales y $A$ es el punto medio de $EC$, encuentra el valor del ángulo $\angle EDA$. Posteriormente, justifica por qué es posible trazar una circunferencia que pase por los puntos $B$, $C$, $D$, $E$.`,
      figuras: [
        { archivo: '2026-selectivo-n2-p14.png', alt: 'Cuadrado AEFB arriba de la recta EC, con A punto medio de EC; el triángulo equilátero ADC está debajo de la recta y también se trazan BC y ED.' },
        { archivo: '2026-selectivo-n2-p14-sol.png', alt: 'La misma figura con marcas de segmentos iguales: los lados del cuadrado, AC, CD y DA; el ángulo EAB es recto.', en: 'solucion' },
      ],
      respuesta: '$\\angle EDA = 30^\\circ$',
      solucion: String.raw`Para encontrar el valor del ángulo $\angle EDA$, sabemos que el ángulo $\angle DAC = 60^\circ$, porque el triángulo $DAC$ es equilátero. Entonces
$$60^\circ + \angle EAD = 180^\circ \implies \angle EAD = 120^\circ.$$
Puesto que el triángulo $ACD$ es equilátero, $ABFE$ es un cuadrado y $A$ es punto medio de $EC$, tenemos que
$$FE = FB = BA = EA = AC = CD = DA.$$
Esto implica que los triángulos $ABC$ y $ADE$ son isósceles. Sea $\angle EDA = \angle DEA = x$. En el triángulo $ADE$ tenemos que $2x + 120^\circ = 180^\circ$ y, por lo tanto, $x = 30^\circ$.

Como $\angle EAB$ y $\angle CAB$ son suplementarios, obtenemos que $\angle CAB = 90^\circ$.

Por otra parte, para justificar por qué es posible trazar una circunferencia que pase por los puntos $B$, $C$, $D$, $E$, podemos hacerlo de dos maneras:

• Primera forma. Podemos ver que $AB = AC = AD = AE$; entonces hay una circunferencia centrada en $A$ de la que los segmentos mencionados son radios.
• Segunda forma. Notemos que
$$\angle CDE = \angle CDA + \angle EDA = 60^\circ + 30^\circ = 90^\circ,$$
$$\angle EBC = \angle EBA + \angle ABC = 45^\circ + 45^\circ = 90^\circ,$$
y así $\angle CDE + \angle EBC = 180^\circ$. Por lo tanto, $BCDE$ es cíclico.`,
    },
    {
      n: 15, area: 'Álgebra',
      enunciado: String.raw`Un grupo de ranas vive en un árbol. Una rana se vuelve verde cuando está en la sombra y amarilla cuando está bajo el sol. Inicialmente, había 3 ranas verdes por cada rana amarilla. Luego, 3 ranas verdes se movieron al lado soleado y 5 ranas amarillas a la sombra. Ahora, hay 4 ranas verdes por cada amarilla. ¿Cuál es la diferencia entre el número de ranas verdes y amarillas ahora?

Nota: Cada rana está completamente en la sombra o completamente bajo el sol.`,
      respuesta: '24',
      solucion: String.raw`Sea $x$ la cantidad de ranas amarillas inicialmente. Así, la cantidad de ranas verdes inicialmente es $3x$.

Cuando se movieron 3 ranas verdes al lado soleado, se volvieron amarillas. Y cuando se pasaron 5 ranas amarillas a la sombra, se convirtieron en verdes. Entonces la cantidad de ranas es
$$\text{Ranas verdes} = 3x - 3 + 5 = 3x + 2, \qquad \text{Ranas amarillas} = x - 5 + 3 = x - 2.$$
Es decir, la cantidad de ranas verdes aumentó en 2, mientras que la de ranas amarillas disminuyó en 2. Dado que ahora hay 4 ranas verdes por cada amarilla, se sigue que
$$3x + 2 = 4(x - 2) \implies x = 10.$$
Esto nos dice que inicialmente había 10 ranas amarillas y 30 ranas verdes. Por lo tanto, ahora son 8 ranas amarillas y 32 ranas verdes, lo que implica que la diferencia es 24.`,
    },
  ],
}
