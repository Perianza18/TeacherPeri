// Primer Examen Selectivo de la Delegación Mexicana PAGMO (10 de septiembre de 2021).
// Transcrito de «selectivo1.pdf». El PDF no trae respuestas.
import { SIN_RESPUESTA } from './comun.js'

const sinRespuesta = { respuesta: null, nota: SIN_RESPUESTA }

export default {
  carpeta: ['PAGMO', 'Selectivo de México', '2021', 'Examen 1'],
  year: '2021',
  nombre: 'Primer Examen Selectivo de la Delegación Mexicana PAGMO',
  fecha: '10 de septiembre de 2021',
  codigo: 'PAGMO-MX-2021-SEL1',
  tituloProblemas: 'Selectivo PAGMO México, examen 1',
  dificultad: 'avanzado',
  organizacion: 'Selectivo mexicano para la PAGMO',
  duracionMinutos: 270,
  indicaciones: [
    'Duración del examen: 4 horas y 30 minutos.',
  ],
  problemas: [
    { n: 1, area: 'Álgebra', ...sinRespuesta, enunciado: String.raw`Sean $a$, $b$ y $c$ números reales tales que las raíces de la ecuación $x^2 + ax + b = 0$ son $r_1$, $r_2$ y las raíces de la ecuación $x^2 + 3x + 3c = 0$ son $\frac{r_1}{r_2}$ y $\frac{r_2}{r_1}$. Calcular el valor de $\left|\dfrac{a^2}{bc}\right|$.` },
    { n: 2, area: 'Combinatoria', ...sinRespuesta, enunciado: String.raw`Encuentra el número de permutaciones de $1, 2, 3, 4, 5, 6$ tales que, para cada $k$ con $1 \le k \le 5$, al menos uno de los primeros $k$ términos de la permutación es mayor que $k$.` },
    { n: 3, area: 'Teoría de Números', ...sinRespuesta, enunciado: String.raw`Sea $n$ un entero positivo y sea $d(n)$ el número de parejas ordenadas de enteros positivos $(x, y)$ tales que
$$(x + 1)^2 - xy(2x - xy + 2y) + (y + 1)^2 = n.$$
Encuentra el menor entero positivo $n$ que satisface que $d(n) = 61$.` },
  ],
}
