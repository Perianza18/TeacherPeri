// 40.a Olimpiada Mexicana de Matemáticas en Guerrero · Etapa Estatal
// (4 y 5 de septiembre de 2026). Transcrito de «Estatal-1.pdf» (día 1,
// problemas 1 a 3) y «Estatal-2.pdf» (día 2, problemas 4 a 6). Los PDF no
// traen respuestas. Va en un solo examen, como los regionales de la OMM.
import { SIN_RESPUESTA } from './comun.js'

const sinRespuesta = { respuesta: null, nota: SIN_RESPUESTA }

export default {
  carpeta: ['OMM Estatal', 'Guerrero', '2026'],
  year: '2026',
  nombre: '40.a Olimpiada Mexicana de Matemáticas en Guerrero · Etapa Estatal',
  fecha: '4 y 5 de septiembre de 2026',
  codigo: 'OMME-GRO-2026',
  tituloProblemas: 'OMM Estatal Guerrero',
  dificultad: 'intermedio',
  organizacion: 'Olimpiada Mexicana de Matemáticas en Guerrero',
  duracionMinutos: 540,
  indicaciones: [
    'El examen se presenta en dos días: problemas 1 a 3 el primero y problemas 4 a 6 el segundo.',
    'La duración de cada día es de 4.5 horas.',
    'No está permitido usar calculadoras, dispositivos móviles o bots de IA durante el examen.',
    'Durante la primera hora de cada día puedes hacer preguntas sobre palabras o frases de los planteamientos que no te queden claras.',
  ],
  problemas: [
    { n: 1, area: 'Teoría de Números', ...sinRespuesta, enunciado: String.raw`Determine cuáles son todos los números primos $p$, $q$ y $r$ que satisfacen la ecuación
$$p \cdot q \cdot r = 11(p + q + r).$$` },
    { n: 2, area: 'Geometría', ...sinRespuesta, enunciado: String.raw`Sea $\Gamma$ una circunferencia con centro $O$ y diámetro $AC$ y sea $B$ un punto sobre $\Gamma$ distinto de $A$ y de $C$. Sea $D$ el punto donde se intersecan las mediatrices de los segmentos $OA$ y $OB$ y sea $E$ el punto donde se intersecan las mediatrices de los segmentos $OC$ y $OB$. Demuestre que los triángulos $DBE$ y $ABC$ son semejantes.` },
    { n: 3, area: 'Álgebra', ...sinRespuesta, enunciado: String.raw`Demuestre que para todo número entero positivo $n$ se cumple que
$$\left(\frac{1}{2}\right)\left(\frac{3}{4}\right)\left(\frac{5}{6}\right)\cdots\left(\frac{2n - 1}{2n}\right) \le \frac{1}{\sqrt{3n}}.$$` },
    { n: 4, area: 'Teoría de Números', ...sinRespuesta, enunciado: String.raw`Denotemos con $\mathcal{N}$ al menor número entero positivo que tiene exactamente 2026 divisores positivos: supongamos que tales divisores son
$$d_1 < d_2 < d_3 < \ldots < d_{2026}.$$
Se sabe que $d_{1013} - d_{1012} = p^m$, donde $p$ es un número primo y $m$ es un número entero. ¿A qué número es igual $m - p$?` },
    { n: 5, area: 'Álgebra', ...sinRespuesta, enunciado: String.raw`Determine todos los números enteros $\kappa$ para los cuales se cumple que la ecuación
$$x^3 - x + \kappa = 0$$
tiene por raíces puros números enteros.` },
    { n: 6, area: 'Combinatoria', ...sinRespuesta, enunciado: String.raw`¿De cuántas formas se pueden colorear de blanco y negro las casillas de una cuadrícula de $4 \times 4$ si se quiere que en cada una de las nueve subcuadrículas de $2 \times 2$ contenidas dentro de la cuadrícula haya exactamente dos cuadritos negros?` },
  ],
}
