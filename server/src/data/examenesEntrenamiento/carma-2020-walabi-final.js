// VI Olimpiada Femenil CARMA · Categoría Walabi · Etapa Final.
// Transcrito de «Examen_Final_Walabi_OFM_VI.pdf». El PDF no trae respuestas
// ni fecha; el año 2020 sale de la fecha del archivo (junio de 2020) y del
// problema 3, que usa 2020 cm.
import { SIN_RESPUESTA } from './comun.js'

const sinRespuesta = { respuesta: null, nota: SIN_RESPUESTA }

export default {
  carpeta: ['Olimpiada Femenil CARMA', '2020', 'Categoría Walabi', 'Etapa final'],
  year: '2020',
  nombre: 'VI Olimpiada Femenil CARMA · Categoría Walabi · Etapa Final',
  fecha: '2020',
  codigo: 'CARMA-2020-WALABI-FINAL',
  tituloProblemas: 'Olimpiada Femenil CARMA, Walabi final',
  dificultad: 'basico',
  organizacion: 'Olimpiada Femenil CARMA',
  indicaciones: [
    'Etapa final de la categoría Walabi. El examen original no indica la duración.',
  ],
  problemas: [
    {
      n: 1, area: 'Combinatoria', ...sinRespuesta,
      enunciado: String.raw`En la siguiente figura se tienen 6 cuadrados. Dos de ellos se consideran vecinos si algunos de sus lados se tocan. Queremos acomodar los números del 1 al 6, uno en cada cuadrado, de tal manera que no haya cuadrados vecinos con números cuya resta sea múltiplo de tres. ¿Cuántas formas hay de hacer esto?`,
      figuras: [{ archivo: 'carma-2020-walabi-p01.png', alt: 'Seis cuadrados: arriba A, B y C chicos en fila; abajo a la izquierda F, grande, ocupando el espacio bajo A y B; a la derecha, bajo C, están D y E.' }],
    },
    {
      n: 2, area: 'Geometría', ...sinRespuesta,
      enunciado: String.raw`Un cubo de $2 \times 2 \times 2$ es construido con 8 cubos pequeños, algunos negros y otros blancos. Cinco caras del cubo de $2 \times 2 \times 2$ se muestran en la figura.

Haz un dibujo de cómo luce la sexta cara del cubo.`,
      figuras: [{ archivo: 'carma-2020-walabi-p02.png', alt: 'Cinco caras de 2 por 2. Cuadritos negros: cara 1, arriba a la izquierda y abajo a la derecha; cara 2, abajo a la izquierda; cara 3, arriba a la izquierda; cara 4, arriba a la derecha; cara 5, abajo a la derecha.' }],
    },
    {
      n: 3, area: 'Geometría', ...sinRespuesta,
      enunciado: String.raw`En la siguiente figura $ABCD$ es un cuadrado y $AC$ es una de sus diagonales. Se toma un punto $O$ en el lado $AD$ y se traza un círculo con centro en $O$ y de radio $AO$. Esta circunferencia interseca al segmento $AC$ en el punto $E$. Si el perímetro del cuadrilátero $ABED$ es de 2020 cm, ¿cuánto mide el perímetro del triángulo sombreado?`,
      figuras: [{ archivo: 'carma-2020-walabi-p03.png', alt: 'Cuadrado ABCD con A arriba a la izquierda y D abajo a la izquierda, y la diagonal AC. O está sobre AD; el círculo con centro O pasa por A y corta a AC en E. Está sombreado el triángulo ODE.' }],
    },
    { n: 4, area: 'Teoría de Números', ...sinRespuesta, enunciado: String.raw`Itzel elige un entero positivo $n$ y escribe la suma de todos los enteros positivos desde el 1 hasta el $n$. Un número primo $p$ divide a dicha suma, pero no divide a ninguno de los $n$ términos de la suma. ¿Cuáles de los siguientes números podrían ser iguales a $n + p$?
$$269 \qquad 221 \qquad 229 \qquad 245 \qquad 217$$` },
  ],
}
