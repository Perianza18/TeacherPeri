// 9a OMMEB Guerrero · Concurso Estatal Selectivo · Nivel 1 (26 de julio de 2025).
// Transcrito de «E5_Selectivo_N1_9aOMMEBGro (RESP).pdf».
export default {
  edicion: 9,
  year: '2025',
  etapa: 'Selectivo',
  nivel: 1,
  grados: '4º y 5º de primaria',
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
      enunciado: String.raw`Un hexágono regular $ABCDEF$ con área $24$ cm$^2$ está inscrito en otro hexágono regular $GHIJKL$, como se muestra en la figura. ¿Cuál es el área de la región sombreada?`,
      figuras: [{ archivo: '2025-selectivo-n1-p01.png', alt: 'Hexágono regular GHIJKL con el hexágono ABCDEF inscrito: A y B en GI, C en IJ, D y E en LJ, F en GL, formando una estrella de seis puntas. Están sombreados los triángulos de las puntas en H, L y J.' }],
      opciones: ['$4$ cm$^2$', '$8$ cm$^2$', '$12$ cm$^2$', '$16$ cm$^2$', '$24$ cm$^2$'],
      respuesta: 'c',
    },
    {
      n: 2, area: 'Teoría de Números',
      enunciado: String.raw`Paloma escribió todos los números de dos cifras. Luego tachó todos los que son pares, tienen dígitos iguales, o terminan en 5. ¿Cuántos números quedaron sin tachar?`,
      opciones: ['$27$', '$32$', '$45$', '$58$', '$63$'],
      respuesta: 'b',
    },
    {
      n: 3, area: 'Combinatoria',
      enunciado: String.raw`Vicente desea pintar los vértices de un hexágono regular utilizando únicamente los colores azul y rojo, asignando un sólo color a cada vértice. Sin embargo, no quiere que haya dos vértices rojos que estén conectados por un lado del hexágono, es decir, que sean adyacentes. En la figura se muestra un ejemplo de una configuración no válida, ya que existen vértices rojos adyacentes. ¿De cuántas maneras distintas Vicente puede pintar los vértices del hexágono cumpliendo esta condición?`,
      figuras: [{ archivo: '2025-selectivo-n1-p03.png', alt: 'Hexágono regular con vértices coloreados; empezando arriba a la izquierda y en sentido horario: azul, rojo, azul, azul, rojo, rojo. Los dos vértices rojos de abajo a la izquierda son adyacentes.' }],
      opciones: ['$2$', '$6$', '$9$', '$15$', '$17$'],
      respuesta: 'e',
      nota: 'Según la aclaración del comité en la solución del mismo problema en el Nivel 3, se consideró que ambos colores se usan al menos una vez; por eso no se cuenta el coloreo con todos los vértices azules.',
    },
    {
      n: 4, area: 'Combinatoria',
      enunciado: String.raw`Miguel escribió todos los números de cuatro cifras que se pueden hacer usando los dígitos 1, 2, 3 y 4, con la repetición permitida. Cuando él ordena dichos números de menor a mayor, ¿qué lugar ocupa el número 4132?`,
      opciones: ['$64$', '$192$', '$202$', '$207$', '$256$'],
      respuesta: 'c',
    },
    {
      n: 5, area: 'Álgebra',
      enunciado: String.raw`A Luis y Paulina se les asignó la tarea de cortar círculos de cartón en fracciones. Paulina cortó cada círculo en 8 pedazos. Luis los cortó en 6. En total, cortaron 30 círculos, y Paulina terminó con el doble de pedazos que Luis. ¿Cuántos círculos cortó Paulina?`,
      opciones: ['$10$', '$12$', '$14$', '$16$', '$18$'],
      respuesta: 'e',
    },
    {
      n: 6, area: 'Geometría',
      enunciado: String.raw`Atenea dibujó un cuadrado $PQRS$ de lado 15 cm y marcó los puntos $H$ sobre $PQ$ y $G$ sobre $QR$ de tal manera que $PH = QG = 8$ cm. Atenea llamó $T$ a la intersección de $PG$ con $SH$. ¿Cuánto vale el ángulo $\angle STG$?`,
      respuesta: '$90^\\circ$',
    },
    {
      n: 7, area: 'Álgebra',
      enunciado: String.raw`Si se cumple que
$$a + 1 = b + 2 = c + 3 = d + 4 = a + b + c + d + 5,$$
calcula el valor de $a + b + c + d$.`,
      respuesta: '$-\\dfrac{10}{3}$',
    },
    {
      n: 8, area: 'Teoría de Números',
      enunciado: String.raw`Un número de tres dígitos $\overline{ABC}$ es fresco si el número de dos dígitos $\overline{AB}$ es primo y divide al número $\overline{BC}$. ¿Cuántos números frescos existen?`,
      respuesta: '4',
    },
    {
      n: 9, area: 'Álgebra',
      enunciado: String.raw`Un marciano, un terrícola y un venusiano llegaron en la misma nave espacial a Júpiter y cada uno se dirigió a su estación espacial. Al cabo de un tiempo, se encontraron en un puerto espacial.

• El terrícola dijo: “Pasé exactamente la mitad de mi vida aquí”.
• El venusiano dijo: “Pasé una cuarta parte de mi vida aquí”.
• El marciano dijo: “Pasé una sexta parte de mi vida aquí”.
• El venusiano dijo: “Marciano, tú y yo tenemos un total de 300 años terrestres”.

¿Cuántos años terrestres tiene el terrícola?`,
      respuesta: '60',
    },
    {
      n: 10, area: 'Combinatoria',
      enunciado: String.raw`¿Cuántos rectángulos se pueden formar usando los puntos de la siguiente figura?`,
      figuras: [{ archivo: '2025-selectivo-n1-p10.png', alt: 'Puntos verdes unidos por segmentos formando cuadritos: una fila de 3 cuadritos arriba, debajo 2 cuadritos alineados a la derecha y, abajo, 1 cuadrito en el extremo derecho, como una escalera.' }],
      respuesta: '15',
    },
    {
      n: 11, area: 'Álgebra',
      enunciado: String.raw`Aurora, Brandon, Cindi y Danna son muy amigos. Cierto día comenzaron a hacer cuentas con sus edades actuales. El producto de las edades de Aurora y Brandon es 108; el producto de las edades de Brandon y Cindi es 72; y el producto de las edades de Cindi y Danna es 96. Encuentra cuánto da el producto de las edades de Danna y Aurora.`,
      respuesta: '144',
    },
    {
      n: 12, area: 'Teoría de Números',
      enunciado: String.raw`Sebas tiene las siguientes tarjetas:

[2]   [4]   [6]   [8]

Sebas puede formar números de uno, dos, tres o hasta cuatro dígitos al pegar las tarjetas una junto a otra. No se permite repetir tarjetas en un mismo número. ¿Cuántos múltiplos de 12 puede armar usando al menos una tarjeta?`,
      respuesta: '9',
    },
    {
      n: 13, area: 'Geometría',
      enunciado: String.raw`Abril dibujó una circunferencia $\mathcal{C}$ de radio 2 cm y sobre ella marcó cuatro puntos que forman diámetros perpendiculares entre sí. Posteriormente, dibujó cuatro circunferencias que tienen como diámetro el centro de $\mathcal{C}$ y uno de los puntos marcados anteriormente, como se muestra en la figura. Calcular el área sombreada que pintó Abril.`,
      figuras: [
        { archivo: '2025-selectivo-n1-p13.png', alt: 'Circunferencia $\\mathcal{C}$ con cuatro circunferencias pequeñas que pasan por su centro, como pétalos. Están sombreadas las regiones donde se enciman los pétalos y las regiones de $\\mathcal{C}$ que quedan fuera de los pétalos.' },
        { archivo: '2025-selectivo-n1-p13-sol1.png', alt: 'La figura con segmentos amarillos del centro a las intersecciones de los pétalos y un cuadrado azul que une los cuatro puntos marcados en $\\mathcal{C}$.', en: 'solucion' },
        { archivo: '2025-selectivo-n1-p13-sol2.png', alt: 'El área sombreada trasladada: queda sombreado el círculo $\\mathcal{C}$ fuera del cuadrado azul.', en: 'solucion' },
        { archivo: '2025-selectivo-n1-p13-sol3.png', alt: 'El cuadrado azul de lado $x$ con su diagonal en rojo, que es un diámetro de $\\mathcal{C}$.', en: 'solucion' },
      ],
      respuesta: '$4\\pi - 8$ cm$^2$',
      solucion: String.raw`Unimos el centro de $\mathcal{C}$ con las distintas intersecciones; en la primera figura de la solución son los segmentos en amarillo. Debido a que los radios son perpendiculares entre sí, también lo son estos segmentos. De igual forma, unimos dos puntos consecutivos de los que están marcados en $\mathcal{C}$: los segmentos en color azul de la figura. También estos segmentos son perpendiculares.

Notemos que los segmentos azules y amarillos forman cuadrados, pues son cuerdas iguales de circunferencias de mismo radio. De este modo, las partes sombreadas quedan divididas a la mitad y coinciden con lo faltante en los segmentos azules. Entonces podemos “trasladar” el área sombreada a esos lugares y el problema se reduce a calcular el área del círculo $\mathcal{C}$ menos el área del cuadrado de lados azules (segunda figura).

Para hacer el cálculo de las áreas, tenemos el radio de $\mathcal{C}$, pero nos hace falta el lado del cuadrado inscrito (de lados azules). Para obtener esta medida, trazamos la diagonal de este cuadrado, que es exactamente el diámetro de $\mathcal{C}$ (tercera figura). Si llamamos $x$ a este lado, por el Teorema de Pitágoras tenemos que:
$$x^2 + x^2 = 4^2 \quad\Longrightarrow\quad 2x^2 = 16 \quad\Longrightarrow\quad x^2 = 8.$$
Por tanto,
$$\text{Área del círculo } \mathcal{C} = \pi \times r^2 = \pi \times 2^2 = 4\pi \text{ cm}^2,$$
$$\text{Área del cuadrado inscrito en } \mathcal{C} = (\text{lado})^2 = x^2 = 8 \text{ cm}^2.$$
Finalmente,
$$\text{Área sombreada} = 4\pi - 8 \text{ cm}^2.$$`,
    },
    {
      n: 14, area: 'Teoría de Números',
      enunciado: String.raw`Usando algunos de los dígitos:

[0]   [7]   [2]   [0]   [2]   [5]

construye el menor número primo de tres cifras. Justifica por qué el número que encontraste es primo.`,
      respuesta: '227',
      solucion: String.raw`Afirmamos que el número no puede terminar en 0, 2 ni 5, pues si termina en 0 o 2, el número será par; y si termina en 5, será múltiplo de 5. En consecuencia, el dígito final es 7.

Si utilizamos los dígitos más pequeños para formar el menor número de tres cifras que termina en 7, obtenemos el número 207. Al sumar los dígitos, $2 + 0 + 7 = 9$, tenemos que este número es divisible por 3. Lo descartamos.

Al probar con los siguientes dígitos menores, llegamos al número 227. Afirmamos que 227 es primo. Notemos que $15 \times 15 = 225 < 227$; entonces, si buscamos primos divisores menores que 15, tenemos las opciones
$$2,\ 3,\ 5,\ 7,\ 11,\ 13.$$
Ninguno de estos primos divide a 227. Por lo tanto, 227 es primo y es la respuesta de este problema.`,
    },
    {
      n: 15, area: 'Combinatoria',
      enunciado: String.raw`Amairani va a preparar aguinaldos de dulces para una fiesta. Cada aguinaldo debe contener exactamente 8 dulces, distribuidos de la siguiente manera: 2 paletas, 3 chocolates y 3 chicles. Amairani tiene disponibles:

• 5 tipos diferentes de paletas,
• 7 tipos diferentes de chocolates, y
• 5 tipos diferentes de chicles.

¿Cuántas maneras distintas tiene Amairani de formar un aguinaldo?`,
      respuesta: '3500',
      solucion: String.raw`Tenemos que elegir una cierta cantidad de cada tipo de dulces. Esto lo resuelven las combinaciones $\binom{n}{k}$.

• Para las paletas, de los 5 tipos elegimos 2: $\displaystyle \binom{5}{2} = \frac{5!}{2! \times 3!} = 10.$
• Para los chocolates, de los 7 tipos elegimos 3: $\displaystyle \binom{7}{3} = \frac{7!}{3! \times 4!} = 35.$
• Para los chicles, de los 5 tipos elegimos 3: $\displaystyle \binom{5}{3} = \frac{5!}{3! \times 2!} = 10.$

Por el principio fundamental del conteo, el total de aguinaldos posibles es:
$$\binom{5}{2} \times \binom{7}{3} \times \binom{5}{3} = 10 \times 35 \times 10 = 3500.$$`,
    },
  ],
}
