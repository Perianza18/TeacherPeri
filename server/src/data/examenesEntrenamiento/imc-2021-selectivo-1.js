// Proceso IMC 2020-2021 · Primer Examen Selectivo (enero de 2021).
// Transcrito de «Examen 1 - KS3 (Enero 2021).pdf». El PDF no trae respuestas.
import { IMC_INDICACIONES, SIN_RESPUESTA } from './comun.js'

const sinRespuesta = { respuesta: null, nota: SIN_RESPUESTA }

export default {
  carpeta: ['IMC', 'Selectivo de México (secundaria)', '2021', 'Examen 1'],
  year: '2021',
  nombre: 'Proceso IMC 2020-2021 · Primer Examen Selectivo (secundaria)',
  fecha: 'enero de 2021',
  codigo: 'IMC-MX-2021-SEL1',
  tituloProblemas: 'Selectivo IMC México, examen 1',
  dificultad: 'intermedio',
  organizacion: 'Selectivo mexicano para la IMC',
  duracionMinutos: 120,
  indicaciones: IMC_INDICACIONES,
  problemas: [
    { n: 1, area: 'Combinatoria', ...sinRespuesta, enunciado: String.raw`¿Cuántos números de tres dígitos son tales que la suma de sus dígitos es par?` },
    { n: 2, area: 'Álgebra', ...sinRespuesta, enunciado: String.raw`¿Cuántos enteros se pueden escribir de la forma $\frac{a}{b} + \frac{b}{a}$ con $a$ y $b$ números enteros?` },
    { n: 3, area: 'Álgebra', ...sinRespuesta, enunciado: String.raw`Los números reales $a$, $b$ y $c$ satisfacen las ecuaciones $a + b + c = \frac{14}{5}$ y $\frac{1}{a} + \frac{1}{b} + \frac{1}{c} = \frac{5}{2}$. Encuentra el valor de
$$\frac{a}{b} + \frac{b}{a} + \frac{b}{c} + \frac{c}{b} + \frac{a}{c} + \frac{c}{a}.$$` },
    { n: 4, area: 'Geometría', ...sinRespuesta, enunciado: String.raw`Sea $ABC$ un triángulo rectángulo con ángulo recto en $A$, y sea $D$ el pie de la perpendicular desde $A$ hasta $BC$. Supóngase que $BD = 1$ y que $AB = CD$. ¿Cuánto mide $AB$?` },
    { n: 5, area: 'Teoría de Números', ...sinRespuesta, enunciado: String.raw`¿De cuántas formas se puede escribir el número 1000 como suma de dos o más enteros positivos consecutivos?` },
    { n: 6, area: 'Geometría', ...sinRespuesta, enunciado: String.raw`¿Cuál es el área de un rombo de lado 25 cuyas diagonales difieren por 10 entre sí?` },
    { n: 7, area: 'Teoría de Números', ...sinRespuesta, enunciado: String.raw`En un tablero de $1 \times 6$ se colocan seis números enteros consecutivos. A la señal, todos los números se multiplican por 5 y luego se les suma 1. ¿Cuál es la máxima cantidad de números primos que pueden quedar en el tablero?` },
    { n: 8, area: 'Álgebra', ...sinRespuesta, enunciado: String.raw`Encuentra la mediana del conjunto de números
$$1, 2, 3, \ldots, 2021, 1^2, 2^2, 3^2, \ldots, 2021^2.$$
Nota: para obtener la mediana de un conjunto de datos, estos se ordenan de menor a mayor. Si hay una cantidad impar de datos, se elige el dato de en medio. Si hay una cantidad par de datos, se promedian los dos datos que quedan en medio. Por ejemplo, la mediana de $\{1, 2, 3\}$ es 2, mientras que la mediana de $\{1, 2, 3, 4\}$ es $\frac{2 + 3}{2} = 2.5$.` },
    {
      n: 9, area: 'Geometría', ...sinRespuesta,
      enunciado: String.raw`En la siguiente figura se presenta un cuarto de círculo cuyo radio mide 6 cm. El punto $A$ está sobre el arco $BD$ de tal forma que $\angle DCA = 30^\circ$. El punto $X$ está sobre el segmento $CD$ de tal forma que la región delimitada por el semicírculo y que está encima de los segmentos $AX$ y $XB$ tiene la mitad del área del cuarto de círculo. ¿Cuánto mide, en centímetros, el segmento $CX$?`,
      figuras: [{ archivo: 'imc-2021-1-p09.png', alt: 'Cuarto de círculo con centro C, el radio CD horizontal y el radio CB vertical. A está sobre el arco BD; X está sobre CD y se trazan los segmentos AX y XB.' }],
    },
    { n: 10, area: 'Teoría de Números', ...sinRespuesta, enunciado: String.raw`Encontrar el menor número de 6 dígitos tal que la suma de sus dígitos es divisible entre 26 y la suma de los dígitos de su sucesor también es divisible entre 26.` },
    { n: 11, area: 'Teoría de Números', ...sinRespuesta, enunciado: String.raw`Sean $m$ y $n$ enteros positivos tales que $\frac{5}{9} < \frac{m}{n} < \frac{4}{7}$ y $n$ es lo más pequeño posible. ¿Cuánto vale $n - m$?` },
    { n: 12, area: 'Combinatoria', ...sinRespuesta, enunciado: String.raw`Hugo y Lupita juegan al gato. A Hugo le tocó jugar con “X” y a Lupita le tocó jugar con “O”. Al terminar el juego se dieron cuenta de que empataron. Si no sabemos quién empezó a jugar, ¿de cuántas formas pudo haber quedado el tablero al final?` },
    { n: 13, area: 'Álgebra', ...sinRespuesta, enunciado: String.raw`Se tienen 5 objetos de pesos distintos. Se han pesado las 10 combinaciones de dos de estos objetos. Se sabe que las tres combinaciones más livianas pesan 39, 43 y 44 kilogramos, y que las dos combinaciones más pesadas pesan 56 y 59 kilogramos. Si los 10 pesos de estas combinaciones se ordenan de menor a mayor, calcular el peso de la combinación en la quinta posición.` },
    { n: 14, area: 'Teoría de Números', ...sinRespuesta, enunciado: String.raw`Encuentra todos los enteros positivos que no pueden ser escritos como la diferencia de dos cuadrados perfectos.` },
    {
      n: 15, area: 'Geometría', ...sinRespuesta,
      enunciado: String.raw`En la siguiente figura se muestra un cuadrado y un hexágono regular. Si $AB$ es paralela a $DC$ y $DC = 2$, hallar $AB$.`,
      figuras: [{ archivo: 'imc-2021-1-p15.png', alt: 'Hexágono regular con lados horizontales arriba y abajo; DC es el lado de arriba. Dentro hay un cuadrado cuyo lado superior AB es paralelo a DC y cuyos cuatro vértices están sobre los lados inclinados del hexágono.' }],
    },
  ],
}
