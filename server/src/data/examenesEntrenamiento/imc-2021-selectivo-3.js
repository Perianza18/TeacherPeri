// Proceso IMC 2020-2021 · Tercer Examen Selectivo (enero de 2021).
// Transcrito de «Examen 3 - KS3 (Enero 2021).pdf». El PDF no trae respuestas.
import { IMC_INDICACIONES, SIN_RESPUESTA } from './comun.js'

const sinRespuesta = { respuesta: null, nota: SIN_RESPUESTA }

export default {
  carpeta: ['IMC', 'Selectivo de México (secundaria)', '2021', 'Examen 3'],
  year: '2021',
  nombre: 'Proceso IMC 2020-2021 · Tercer Examen Selectivo (secundaria)',
  fecha: 'enero de 2021',
  codigo: 'IMC-MX-2021-SEL3',
  tituloProblemas: 'Selectivo IMC México, examen 3',
  dificultad: 'intermedio',
  organizacion: 'Selectivo mexicano para la IMC',
  duracionMinutos: 120,
  indicaciones: IMC_INDICACIONES,
  problemas: [
    { n: 1, area: 'Geometría', ...sinRespuesta, enunciado: String.raw`Las longitudes de los lados de un triángulo son todos números enteros y el perímetro del triángulo es 8. ¿Cuánto vale su área?` },
    { n: 2, area: 'Teoría de Números', ...sinRespuesta, enunciado: String.raw`¿Cuántos enteros entre 10 y 100 cumplen que son iguales al doble del producto de sus dígitos?` },
    { n: 3, area: 'Combinatoria', ...sinRespuesta, enunciado: String.raw`Hay 10 personas sentadas alrededor de una mesa redonda de tal manera que forman un decágono regular. Cada persona conoce a 3 de las otras 9 personas: las dos sentadas a sus lados y a la persona directamente opuesta a ella en la mesa redonda (conocerse es mutuo). ¿De cuántas maneras se pueden partir las 10 personas en 5 parejas de tal forma que los integrantes de cada pareja se conozcan entre sí?` },
    { n: 4, area: 'Teoría de Números', ...sinRespuesta, enunciado: String.raw`Encuentra la cantidad de pares de enteros $(x, y)$ que satisfacen la ecuación
$$x^{2020} + y^2 = 2y.$$` },
    { n: 5, area: 'Teoría de Números', ...sinRespuesta, enunciado: String.raw`Si el dígito de las unidades de millar de un cuadrado perfecto de 4 dígitos se disminuye en 3 y las unidades se aumentan en 3, se obtiene otro cuadrado perfecto de 4 dígitos. ¿Cuál es el número original?` },
    { n: 6, area: 'Álgebra', ...sinRespuesta, enunciado: String.raw`Dado que $f(x) = \frac{x^2}{1 + x^2}$, determine el valor de la expresión
$$f\!\left(\frac{1}{2020}\right) + f\!\left(\frac{2}{2020}\right) + \cdots + f\!\left(\frac{2019}{2020}\right) + f\!\left(\frac{2020}{2020}\right) + f\!\left(\frac{2020}{2019}\right) + f\!\left(\frac{2020}{2018}\right) + \cdots + f\!\left(\frac{2020}{1}\right).$$` },
    {
      n: 7, area: 'Combinatoria', ...sinRespuesta,
      enunciado: String.raw`Cada casilla de la figura se pinta de uno de los siguientes colores: azul, blanco, rojo y verde. Se pueden usar todos o algunos de los 4 colores, pero se debe cumplir la condición de que las casillas que tienen un lado (o parte de un lado) común sean de distinto color (si comparten solo un vértice, pueden tener el mismo color). ¿De cuántas maneras se puede pintar la figura?`,
      figuras: [{ archivo: 'imc-2021-3-p07.png', alt: 'Triángulo grande dividido en cuatro triángulos (tres en las esquinas y uno al centro); debajo de su base hay otro triángulo que apunta hacia abajo. Son cinco casillas.' }],
    },
    {
      n: 8, area: 'Geometría', ...sinRespuesta,
      enunciado: String.raw`Como se ve en la figura, el cuadrilátero convexo $ABCD$ cumple que $AB = 3$, $BC = 4$, $CD = 13$, $AD = 12$ y $\angle ABC = 90^\circ$. ¿Cuál es el área del cuadrilátero?`,
      figuras: [{ archivo: 'imc-2021-3-p08.png', alt: 'Cuadrilátero ABCD con ángulo recto en B: AB horizontal arriba, BC vertical hacia abajo y D lejos a la derecha, abajo.' }],
    },
    { n: 9, area: 'Álgebra', ...sinRespuesta, enunciado: String.raw`Cuatro enteros positivos $a$, $b$, $c$, $d$ satisfacen
$$\begin{aligned} ab + a + b &= 524, \\ bc + b + c &= 146, \\ cd + c + d &= 104, \\ abcd &= 8!. \end{aligned}$$
Calcula $a - d$.` },
    { n: 10, area: 'Combinatoria', ...sinRespuesta, enunciado: String.raw`En una cuadrícula de $8 \times 8$, ¿de cuántas formas se puede ir de la esquina inferior izquierda a la esquina superior derecha pasando por las líneas de la cuadrícula si no se permite pasar dos veces por el mismo lugar y tampoco se permite caminar hacia la izquierda?` },
    { n: 11, area: 'Teoría de Números', ...sinRespuesta, enunciado: String.raw`En la ecuación
$$A^{AA} + AA = B,BBC,DED,BEE,BBB,BBE$$
las letras $A$, $B$, $C$, $D$ y $E$ representan dígitos diferentes en base 10 (por lo que el lado derecho es un número de 16 dígitos y $AA$ es un número de dos dígitos). Dado que $C = 9$, encuentra $A + B + D + E$.` },
    { n: 12, area: 'Geometría', ...sinRespuesta, enunciado: String.raw`Sea $AB$ un diámetro de una circunferencia de radio $5\sqrt{2}$. Sea $CD$ una cuerda en el círculo que intersecta a $AB$ en un punto $E$ de tal forma que $\angle AEC = 45^\circ$. ¿Cuánto vale $CE^2 + DE^2$?` },
    { n: 13, area: 'Teoría de Números', ...sinRespuesta, enunciado: String.raw`Encuentra todos los enteros positivos $n$ tales que $1 + 2^2 + 3^3 + 4^n$ es un cuadrado perfecto.` },
    { n: 14, area: 'Combinatoria', ...sinRespuesta, enunciado: String.raw`El piso de una habitación es una cuadrícula de 10 cuadritos de ancho por 17 cuadritos de largo. Un niño va a caminar desde una esquina de esta habitación hasta la esquina opuesta en línea recta. ¿Por cuántos cuadritos pasó al caminar por dicha línea recta?

Nota: Si el niño pasó por la esquina de un cuadrito y no por su interior, se considera que no pasó por dicho cuadrito.` },
    { n: 15, area: 'Teoría de Números', ...sinRespuesta, enunciado: String.raw`Sean $a$ y $b$ números naturales tales que $ab > 2$. Supóngase que $\operatorname{mcd}(a, b) + \operatorname{mcm}[a, b]$ es múltiplo de $a + b$. Prueba que
$$\frac{\operatorname{mcd}(a, b) + \operatorname{mcm}[a, b]}{a + b} \le \frac{a + b}{4}.$$
¿Cuándo se da la igualdad?` },
  ],
}
