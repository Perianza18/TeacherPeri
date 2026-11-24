// Proceso IMC 2020-2021 · Segundo Examen Selectivo (enero de 2021).
// Transcrito de «Examen 2 - KS3 (Enero 2021).pdf». El PDF no trae respuestas.
import { IMC_INDICACIONES, SIN_RESPUESTA } from './comun.js'

const sinRespuesta = { respuesta: null, nota: SIN_RESPUESTA }

export default {
  carpeta: ['IMC', 'Selectivo de México (secundaria)', '2021', 'Examen 2'],
  year: '2021',
  nombre: 'Proceso IMC 2020-2021 · Segundo Examen Selectivo (secundaria)',
  fecha: 'enero de 2021',
  codigo: 'IMC-MX-2021-SEL2',
  tituloProblemas: 'Selectivo IMC México, examen 2',
  dificultad: 'intermedio',
  organizacion: 'Selectivo mexicano para la IMC',
  duracionMinutos: 120,
  indicaciones: IMC_INDICACIONES,
  problemas: [
    { n: 1, area: 'Geometría', ...sinRespuesta, enunciado: String.raw`En el triángulo $ABC$, se tiene que $AB = 1$, $AC = 2$ y $\angle BAC = 45^\circ$. En el triángulo $DEF$, se cumple que $DE = 1$, $DF = 2$ y $\angle EDF = 135^\circ$. ¿Cuánto vale $\dfrac{[ABC]}{[DEF]}$?

Nota: se denota por $[X]$ al área de la figura $X$.` },
    { n: 2, area: 'Combinatoria', ...sinRespuesta, enunciado: String.raw`¿Cuántos números de cuatro dígitos hay cuya suma de los cuatro dígitos sea mayor que 33?` },
    { n: 3, area: 'Álgebra', ...sinRespuesta, enunciado: String.raw`El producto de tres enteros positivos consecutivos es igual a ocho veces su suma. Encuentra la suma de los cuadrados de estos tres enteros consecutivos.` },
    { n: 4, area: 'Teoría de Números', ...sinRespuesta, enunciado: String.raw`El entero positivo $n$ y el número primo $p$ satisfacen la ecuación
$$(n - 2)^2 + (n - 1)^2 + n^2 + (n + 1)^2 + (n + 2)^2 = 27p.$$
Encuentra el valor de la expresión $\dfrac{n^2}{p}$.` },
    { n: 5, area: 'Geometría', ...sinRespuesta, enunciado: String.raw`Una circunferencia es tangente a una línea en el punto $A$. Los puntos $B$ y $C$ están sobre la circunferencia y sobre la línea, respectivamente, de tal manera que el segmento $BC$ es perpendicular a la línea. Si $BC = 3$ y $AC = 9$, ¿cuál es el radio de la circunferencia?` },
    { n: 6, area: 'Combinatoria', ...sinRespuesta, enunciado: String.raw`¿De cuántas maneras se pueden colocar los números $1, 2, 3, \ldots, 9$, sin repetir, en los cuadritos de una cuadrícula de $3 \times 3$ de tal manera que la suma de los números en cada fila y en cada columna sea impar?` },
    { n: 7, area: 'Álgebra', ...sinRespuesta, enunciado: String.raw`De las siguientes oraciones, ¿cuál es una afirmación correcta sobre la expresión $a\left(\sqrt{a^2 + 1} - a\right)$ cuando $a = 16$?

a) Sus dígitos decimales eventualmente se ciclan.
b) Es menor que $\frac{1}{2}$.
c) El cuadrado del número obtenido es racional.
d) Es mayor que $\frac{1}{2}$.` },
    { n: 8, area: 'Teoría de Números', ...sinRespuesta, enunciado: String.raw`¿Cuántas tripletas de enteros positivos $(x, y, z)$ satisfacen que $\operatorname{mcm}[x, y] = 72$, $\operatorname{mcm}[x, z] = 600$ y $\operatorname{mcm}[y, z] = 900$?` },
    {
      n: 9, area: 'Combinatoria', ...sinRespuesta,
      enunciado: String.raw`¿Cuántas formas hay de ir de $A$ a $B$ avanzando sobre las líneas de la figura sin pasar dos veces por el mismo vértice?`,
      figuras: [{ archivo: 'imc-2021-2-p09.png', alt: 'Pentágono regular con su centro unido a los cinco vértices. B es el vértice de arriba y A el vértice de abajo a la izquierda.' }],
    },
    { n: 10, area: 'Álgebra', ...sinRespuesta, enunciado: String.raw`Sean $x$ y $y$ enteros positivos tales que
$$x\sqrt{y} + y\sqrt{x} - \sqrt{2021x} - \sqrt{2021y} + \sqrt{xy} = \sqrt{2021}.$$
Si se sabe que $x + y$ es múltiplo de 9, ¿cuánto vale $x + y$?` },
    {
      n: 11, area: 'Geometría', ...sinRespuesta,
      enunciado: String.raw`Como se ve en la figura, se tiene un hexágono regular de lado 2 con seis semicírculos dentro de él de tal manera que los diámetros de estos son los lados del hexágono. ¿Cuánto vale el área de la región sombreada?`,
      figuras: [{ archivo: 'imc-2021-2-p11.png', alt: 'Hexágono regular de lado 2 con un semicírculo hacia adentro sobre cada lado. La región central que queda fuera de los seis semicírculos está sombreada.' }],
    },
    { n: 12, area: 'Teoría de Números', ...sinRespuesta, enunciado: String.raw`Se dice que un entero positivo $n$ es $k$-bonito si $n$ tiene exactamente $k$ divisores y $n$ es divisible por $k$. Por ejemplo, 18 es 6-bonito. Sea $S$ la suma de todos los enteros positivos 20-bonitos menores a 2020. Encuentra $\frac{S}{20}$.` },
    { n: 13, area: 'Álgebra', ...sinRespuesta, enunciado: String.raw`Sean $r$ y $s$ racionales positivos. Demuestra que si $\sqrt{r} + \sqrt{s}$ es racional, entonces $\sqrt{r}$ y $\sqrt{s}$ son racionales.` },
    { n: 14, area: 'Geometría', ...sinRespuesta, enunciado: String.raw`Un punto $P$ es marcado en el interior del hexágono regular $ABCDEF$ tal que $\angle BAP = \angle DCP = 50^\circ$. ¿Cuánto vale $\angle ABP$?` },
    { n: 15, area: 'Combinatoria', ...sinRespuesta, enunciado: String.raw`En una fiesta hay 100 personas numeradas del 1 al 100. Si la persona con el número 1 saluda a una persona, la persona con el número 2 saluda a 2 personas, la persona con el número 3 saluda a 3 personas y así sucesivamente hasta que la persona con el número 99 saluda a 99 personas, ¿a cuántas personas saluda la persona con el número 100?` },
  ],
}
