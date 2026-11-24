// Proceso IMC 2020-2021 · Quinto Examen Selectivo, secundaria (febrero de 2021).
// Transcrito de «Examen 5 - KS3 (Febrero 2021).pdf». El PDF no trae respuestas.
// (El zip no trae el cuarto examen.)
import { IMC_INDICACIONES, SIN_RESPUESTA } from './comun.js'

const sinRespuesta = { respuesta: null, nota: SIN_RESPUESTA }

export default {
  carpeta: ['IMC', 'Selectivo de México (secundaria)', '2021', 'Examen 5'],
  year: '2021',
  nombre: 'Proceso IMC 2020-2021 · Quinto Examen Selectivo (secundaria)',
  fecha: 'febrero de 2021',
  codigo: 'IMC-MX-2021-SEL5',
  tituloProblemas: 'Selectivo IMC México, examen 5',
  dificultad: 'intermedio',
  organizacion: 'Selectivo mexicano para la IMC',
  duracionMinutos: 120,
  indicaciones: IMC_INDICACIONES,
  problemas: [
    { n: 1, area: 'Combinatoria', ...sinRespuesta, enunciado: String.raw`Lupita y su esposo tienen dos hijos. Cuando ellos van a entrar a su carro, dos personas se deben sentar al frente y dos se deben sentar atrás. Solo Lupita o su esposo pueden manejar. ¿De cuántas formas pueden sentarse dentro del carro?` },
    { n: 2, area: 'Geometría', ...sinRespuesta, enunciado: String.raw`Una circunferencia de centro $O$ se encierra entre dos tangentes paralelas. Una tercera tangente corta a las dos primeras en $P$ y en $Q$. Encuentra $\angle POQ$.` },
    { n: 3, area: 'Teoría de Números', ...sinRespuesta, enunciado: String.raw`Considera todos los divisores positivos del número $2021^{2021}$. ¿Cuántos de estos números son cuadrados perfectos?` },
    { n: 4, area: 'Álgebra', ...sinRespuesta, enunciado: String.raw`Existen enteros $a$, $b$ y $c$ mayores que 1 que cumplen que
$$\sqrt[a]{N\sqrt[b]{N\sqrt[c]{N}}} = \sqrt[36]{N^{25}}$$
para todo $N > 1$. ¿Cuánto vale $b$?` },
    { n: 5, area: 'Teoría de Números', ...sinRespuesta, enunciado: String.raw`Para un entero positivo $n$, sea $\langle n \rangle$ el cuadrado perfecto más cercano a $n$. Por ejemplo, $\langle 74 \rangle = 81$ y $\langle 18 \rangle = 16$. Si $N$ es el menor entero positivo tal que
$$\langle 91 \rangle \cdot \langle 120 \rangle \cdot \langle 143 \rangle \cdot \langle 180 \rangle \cdot \langle N \rangle = 91 \cdot 120 \cdot 143 \cdot 180 \cdot N,$$
encuentra la suma de los cuadrados de los dígitos de $N$.` },
    {
      n: 6, area: 'Geometría', ...sinRespuesta,
      enunciado: String.raw`En la siguiente figura, el cuadrado más grande es de lado 9 y se divide en 9 cuadritos iguales como se muestra. Hallar el área sombreada.`,
      figuras: [{ archivo: 'imc-2021-5-p06.png', alt: 'Cuadrado de lado 9 dividido en una cuadrícula de 3 por 3. Un segmento va de la esquina superior derecha al punto de la base que está a un tercio de la esquina inferior izquierda; está sombreada la parte del cuadrito central que queda a la izquierda del segmento.' }],
    },
    { n: 7, area: 'Álgebra', ...sinRespuesta, enunciado: String.raw`Encuentra todas las ternas de números reales positivos $(x, y, z)$ que satisfacen el sistema de ecuaciones
$$\begin{aligned} x^2 + y + z &= 1, \\ x + y^2 + z &= 1, \\ x + y + z^2 &= 1. \end{aligned}$$` },
    { n: 8, area: 'Combinatoria', ...sinRespuesta, enunciado: String.raw`Un equipo de fútbol tiene 22 jugadores. Un conjunto fijo de 11 de ellos iniciará el juego, mientras que los otros 11 jugadores estarán en la banca disponibles como sustitutos. Durante el juego, el entrenador puede hacer a lo mucho 3 cambios. Cualquiera de los 11 jugadores iniciales puede ser sustituido. Ningún jugador que sale de cambio puede volver a entrar al juego, pero un jugador que entra al juego de cambio puede salir después. No puede haber dos sustituciones al mismo tiempo. Sea $n$ el número de maneras en que el entrenador puede hacer los cambios durante el juego, considerando el orden en que se hacen las sustituciones y los jugadores involucrados (es posible que no haya cambios). Encuentra el residuo cuando $n$ es dividido por 1000.` },
    { n: 9, area: 'Teoría de Números', ...sinRespuesta, enunciado: String.raw`Encuentra los últimos tres dígitos de la suma
$$\left\lfloor \sqrt[3]{1} \right\rfloor + \left\lfloor \sqrt[3]{2} \right\rfloor + \left\lfloor \sqrt[3]{3} \right\rfloor + \cdots + \left\lfloor \sqrt[3]{2019} \right\rfloor.$$` },
    { n: 10, area: 'Teoría de Números', ...sinRespuesta, enunciado: String.raw`Sean $p$ y $q$ dos números primos menores que 100, no necesariamente diferentes. Sea $n$ el número que resulta de escribir $p$ y a continuación, a su derecha, escribir $q$. Sea $k$ el resultado de la multiplicación de $p$ y $q$. Si $n - k = 208$, encontrar todos los posibles valores de $p + q$.` },
    {
      n: 11, area: 'Combinatoria', ...sinRespuesta,
      enunciado: String.raw`La figura de abajo muestra un anillo hecho por seis secciones pequeñas que se deben pintar (la sección circular de en medio no se pinta). Se tienen cuatro colores disponibles y cada sección se pinta de un solo color. Encuentra el número de maneras en las que se puede pintar la figura considerando que dos secciones adyacentes no se pueden pintar del mismo color.`,
      figuras: [{ archivo: 'imc-2021-5-p11.png', alt: 'Anillo entre dos circunferencias concéntricas, dividido en seis secciones iguales; el círculo de en medio queda en blanco.' }],
    },
    { n: 12, area: 'Geometría', ...sinRespuesta, enunciado: String.raw`En el triángulo rectángulo $ABC$ con $AB$ perpendicular a $BC$, sean $H$ el pie de la altura desde $B$ a $AC$, $P$ la intersección de la bisectriz del ángulo $\angle BAC$ con $BC$ y $Q$ la intersección de $AP$ con $BH$. Si $AQ = QP$, calcula la razón $\frac{AH}{AC}$.` },
    { n: 13, area: 'Combinatoria', ...sinRespuesta, enunciado: String.raw`En una fiesta hay 15 mujeres y algunos hombres. Primero, cada mujer le regala un mazapán a cada hombre conocido, que se lo come de inmediato. Después, cada hombre le regala un mazapán a cada mujer desconocida. En total se regalaron 240 mazapanes. ¿Cuántos hombres hay en la fiesta?` },
    { n: 14, area: 'Teoría de Números', ...sinRespuesta, enunciado: String.raw`Considérese la siguiente tabla.
$$\begin{array}{|c|c|c|c|c|c|c|c|c|} \hline A & B & C & D & E & F & G & H & I \\ \hline \end{array}$$
Ricardo debe reemplazar cada letra por un número natural entre 1 y 9 inclusive, sin repeticiones, de manera que cada uno de los ocho números
$$\frac{A}{B}, \quad \frac{A + B}{C}, \quad \frac{A + B + C}{D}, \quad \frac{A + B + C + D}{E},$$
$$\frac{A + B + C + D + E}{F}, \quad \frac{A + B + C + D + E + F}{G},$$
$$\frac{A + B + C + D + E + F + G}{H}, \quad \frac{A + B + C + D + E + F + G + H}{I}$$
sea un número entero. Encuentra todos los valores posibles por los que se puede reemplazar la letra $I$.` },
    { n: 15, area: 'Teoría de Números', ...sinRespuesta, enunciado: String.raw`Sea $n$ un número entero. Muestra que existe a lo mucho una cantidad finita de parejas $(a, b)$ de enteros tales que
$$a^2 + ab + b^2 = n.$$` },
  ],
}
