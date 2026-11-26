// 10a OMMEB Guerrero · Concurso Estatal Selectivo · Nivel 1 (25 de julio de 2026).
// Transcrito de «E4_N1_Selectivo_10aOMMEBGro (RESP).pdf».
export default {
  edicion: 10,
  year: '2026',
  etapa: 'Selectivo',
  nivel: 1,
  grados: '4º y 5º de primaria',
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
      n: 1, area: 'Geometría',
      enunciado: String.raw`En la figura se muestra un cuadrilátero $ABCD$. Si $BC = AD$, ¿cuánto mide el ángulo $\angle ADC$?`,
      figuras: [{ archivo: '2026-selectivo-n1-p01.png', alt: 'Cuadrilátero ABCD con la diagonal AC. El ángulo ABC mide $55^\\circ$, el ángulo BCA mide $70^\\circ$ y el ángulo CAD mide $30^\\circ$.' }],
      opciones: ['$55^\\circ$', '$65^\\circ$', '$70^\\circ$', '$75^\\circ$', '$85^\\circ$'],
      respuesta: 'd',
    },
    {
      n: 2, area: 'Combinatoria',
      enunciado: String.raw`¿En cuántas formas podemos dividir un grupo de 10 personas en dos grupos? Suponemos que no hay grupos de cero personas.`,
      opciones: ['$255$', '$512$', '$637$', '$1022$', '$511$'],
      respuesta: 'e',
    },
    {
      n: 3, area: 'Álgebra',
      enunciado: String.raw`Jaime, Guadalupe y Resendiz, los jaguares, estaban platicando sobre datos curiosos en la cantidad de sus manchas.

• Jaime: La suma de las manchas de Guadalupe y Resendiz es el doble de la cantidad de manchas que tengo.
• Guadalupe: ¡Qué curioso! También ocurre que la suma de las manchas de Resendiz y Jaime dan el doble de las que yo tengo.

Se sabe que uno de los tres jaguares tiene 2026 manchas. ¿Cuántas manchas tiene Resendiz?`,
      opciones: ['$1013$', '$2026$', '$4052$', '$6078$', 'No se puede saber.'],
      respuesta: 'b',
    },
    {
      n: 4, area: 'Teoría de Números',
      enunciado: String.raw`Encuentra la mayor potencia de 3 que divide a $100!$.`,
      opciones: ['$3^{45}$', '$3^{46}$', '$3^{47}$', '$3^{48}$', '$3^{49}$'],
      respuesta: 'd',
    },
    {
      n: 5, area: 'Teoría de Números',
      enunciado: String.raw`Vicente escribe todos los enteros positivos de tres cifras que satisfacen que:

• sus dígitos son consecutivos y aparecen en orden creciente,
• son múltiplos de 9.

¿Cuál es la suma de todos los números que escribió Vicente?`,
      opciones: ['$801$', '$1197$', '$5994$', '$234$', '$1368$'],
      respuesta: 'a',
    },
    {
      n: 6, area: 'Álgebra',
      enunciado: String.raw`Calcula el valor numérico de $9999^2 - 1$.`,
      respuesta: '99980000',
    },
    {
      n: 7, area: 'Geometría',
      enunciado: String.raw`La longitud del lado de un rombo es 13 y la diagonal menor vale 10. Calcula el valor del área del rombo.`,
      respuesta: '120',
    },
    {
      n: 8, area: 'Combinatoria',
      enunciado: String.raw`Un álbum se llena con un total de 200 estampas diferentes. Las estampas se venden en sobres. Cada sobre contiene 7 estampas, posiblemente con repetidas. ¿Cuál es el menor número de sobres que debes abrir para garantizar que, entre todas las estampas obtenidas, haya al menos dos repetidas?`,
      respuesta: '29',
    },
    {
      n: 9, area: 'Álgebra',
      enunciado: String.raw`Rebeca tiene dos velas de cera de la misma longitud. La primera vela, si permanece encendida, se consume por completo en 6 horas; la segunda, si permanece encendida, se consume por completo en 8 horas. Ambas velas se consumen a ritmo constante. Las dos velas se encendieron al mismo tiempo, pero después de un rato un fuerte viento las apagó. En ese momento, se observó que la longitud restante de la primera vela era la mitad de la longitud restante de la segunda. ¿Cuántos minutos estuvieron encendidas las velas?`,
      respuesta: '288 minutos',
    },
    {
      n: 10, area: 'Geometría',
      enunciado: String.raw`Dibuja un hexágono regular $ABCDEF$. En el interior del hexágono se toma un punto $P$ de tal manera que $AP = PC = EF$. Si $Q$ es el punto medio de $DE$, ¿cuánto mide el ángulo $\angle APQ$?`,
      respuesta: '$150^\\circ$',
    },
    {
      n: 11, area: 'Combinatoria',
      enunciado: String.raw`Un dominó tiene 28 fichas con una pareja de números enteros del 0 al 6 (pueden ser iguales). Usando cuatro fichas distintas de dominó, Amairani las coloca formando los lados de un cuadrado, como se muestra en la imagen. En cada esquina, los extremos de las dos fichas que se encuentran deben tener el mismo número. ¿Cuántas configuraciones distintas hay de hacer esto?`,
      figuras: [{ archivo: '2026-selectivo-n1-p11.png', alt: 'Cuatro fichas de dominó colocadas como los lados de un cuadrado; en cada esquina se tocan los extremos de dos fichas con el mismo número de puntos.' }],
      respuesta: '1680',
    },
    {
      n: 12, area: 'Teoría de Números',
      enunciado: String.raw`Encuentra cuántos números de tres dígitos cumplen que:

• Son múltiplos de 6.
• Son múltiplos de 5.
• Tienen exactamente dos dígitos impares.`,
      respuesta: '8',
    },
    {
      n: 13, area: 'Álgebra',
      enunciado: String.raw`En un zoológico hay 3 capibaras por cada 2 pandas. Se sabe que hay 12 capibaras más que pandas. ¿Cuántos capibaras y cuántos pandas hay en el zoológico?`,
      respuesta: '36 capibaras y 24 pandas',
      solucion: String.raw`Solución 1 (mediante la proporción). Por cada 2 pandas hay 3 capibaras. Observemos cómo cambia la cantidad de animales al multiplicar esta proporción:
$$\begin{array}{cccc} \text{Número de grupos} & \text{Capibaras} & \text{Pandas} & \text{Diferencia} \\ \hline 1 & 3 & 2 & 1 \\ 2 & 6 & 4 & 2 \\ 3 & 9 & 6 & 3 \\ \vdots & \vdots & \vdots & \vdots \\ k & 3k & 2k & k \end{array}$$
Así, en el $k$-ésimo grupo hay $3k$ capibaras y $2k$ pandas, por lo que la diferencia entre ambas cantidades es $3k - 2k = k$. Como se sabe que hay 12 capibaras más que pandas, la diferencia debe ser $k = 12$. Por lo tanto, hay
$$3k = 3 \times 12 = 36 \text{ capibaras}, \qquad 2k = 2 \times 12 = 24 \text{ pandas}.$$

Solución 2 (planteando una ecuación con la proporción). Como en la Solución 1, en el $k$-ésimo grupo hay $3k$ capibaras y $2k$ pandas. Dado que hay 12 capibaras más que pandas, se tiene
$$3k = 2k + 12.$$
La solución de la ecuación anterior es $k = 12$. Por lo tanto, hay $3k = 36$ capibaras y $2k = 24$ pandas.

Solución 3 (planteando una ecuación). Sea $x$ la cantidad de capibaras y $y$ la cantidad de pandas. Entonces se tiene que
$$3y = 2x, \qquad x = 12 + y.$$
Al sustituir el valor $x = 12 + y$, se tiene
$$3y = 2(12 + y) \implies y = 24 \implies x = 36.$$
Por lo tanto, hay 36 capibaras y 24 pandas.`,
    },
    {
      n: 14, area: 'Geometría',
      enunciado: String.raw`En el rectángulo $ABCD$, $AB = 8$ y $BC = 6$. Los puntos $E$ y $F$ están sobre el lado $CD$, de forma que $CE = 2$ y $EF = 4$. Si $AE$ y $BF$ se intersectan en $P$, determina el valor de la suma de las áreas de los triángulos $ABP$ y $CPF$.`,
      figuras: [{ archivo: '2026-selectivo-n1-p14-sol.png', alt: 'Rectángulo ABCD con $AB = 8$ y $BC = 6$; sobre DC están $DF = 2$, $FE = 4$ y $EC = 2$. AE y BF se cortan en P; la altura de P a DC mide 2 y la de P a AB mide 4.', en: 'solucion' }],
      respuesta: '22',
      solucion: String.raw`Notemos que $AD = DE = 6$ y $FC = CB = 6$; entonces los triángulos rectángulos $ADE$ y $BCF$ son isósceles. Entonces, en particular, $\angle FEP = \angle EFP = 45^\circ$ y $\angle BAP = \angle ABP = 45^\circ$.

Obtenemos que los triángulos $ABP$ y $EFP$ son isósceles y semejantes. Como sus bases están a razón $2 : 1$, también lo están sus alturas, de modo que la altura de $ABP$ mide 4 y la altura de $EFP$ mide 2 (véase la figura de la solución).

Por lo tanto,
$$\text{Área}(ABP) + \text{Área}(CPF) = \frac{8 \times 4}{2} + \frac{6 \times 2}{2} = 16 + 6 = 22.$$`,
    },
    {
      n: 15, area: 'Combinatoria',
      enunciado: String.raw`En la imagen se indica el número de segmentos necesarios para formar los dígitos de las pantallas de algunas calculadoras.

¿Cuántos números distintos de dos cifras se pueden escribir con 10 segmentos?`,
      figuras: [{ archivo: '2026-selectivo-n1-p15.png', alt: 'Los dígitos del 0 al 9 como en una pantalla de calculadora, con el número de segmentos de cada uno: 0 usa 6, 1 usa 2, 2 usa 5, 3 usa 5, 4 usa 4, 5 usa 5, 6 usa 6, 7 usa 3, 8 usa 7 y 9 usa 6.' }],
      respuesta: '16',
      solucion: String.raw`Solución 1. Tenemos tres opciones para que las cantidades de segmentos de los dos dígitos sumen 10:
$$7 + 3, \qquad 5 + 5, \qquad 6 + 4.$$
• Caso I: $7 + 3$. Los únicos dígitos posibles son 8 y 7. Se obtienen 87 y 78, es decir, 2 números.
• Caso II: $5 + 5$. Los dígitos que utilizan 5 segmentos son 2, 3 y 5. Para números con cifras distintas tenemos 3 opciones para el primer dígito y 2 opciones para el segundo; entonces hay $3 \times 2 = 6$ números con cifras distintas (23, 25, 32, 35, 52, 53). Si se repiten cifras, tenemos tres números: 22, 33 y 55. Por tanto, este caso aporta 9 números.
• Caso III: $6 + 4$. Los dígitos que utilizan 6 segmentos son 0, 6 y 9, mientras que el único dígito que utiliza 4 segmentos es el 4. Entonces tenemos 3 opciones para uno de los dígitos, 1 opción para el otro y 2 formas de ordenarlos, es decir, hay $3 \times 1 \times 2 = 6$ arreglos (04, 40, 64, 46, 94, 49). Pero en este conteo está el 04, que no es de dos cifras. Por tanto, este caso aporta $6 - 1 = 5$ números.

Por lo tanto, la cantidad total de números es $2 + 9 + 5 = 16$.

Solución 2. Dividimos en casos de acuerdo con el primer dígito (el de las decenas):
• No empiezan con 1, porque no existe un dígito que utilice 8 segmentos.
• Si empieza en 2, se junta con los dígitos que utilizan 5 segmentos: 2, 3, 5 (se forman 3 números).
• Si empieza en 3, se junta con los dígitos que utilizan 5 segmentos: 2, 3, 5 (se forman 3 números).
• Si empieza en 4, se junta con los dígitos que utilizan 6 segmentos: 0, 6, 9 (se forman 3 números).
• Si empieza en 5, se junta con los dígitos que utilizan 5 segmentos: 2, 3, 5 (se forman 3 números).
• Si empieza en 6, se junta con el dígito que utiliza 4 segmentos: el 4 (se forma 1 número).
• Si empieza en 7, se junta con el dígito que utiliza 7 segmentos: el 8 (se forma 1 número).
• Si empieza en 8, se junta con el dígito que utiliza 3 segmentos: el 7 (se forma 1 número).
• Si empieza en 9, se junta con el dígito que utiliza 4 segmentos: el 4 (se forma 1 número).

Sumando todas las posibilidades, obtenemos
$$0 + 3 + 3 + 3 + 3 + 1 + 1 + 1 + 1 = 16.$$`,
    },
  ],
}
