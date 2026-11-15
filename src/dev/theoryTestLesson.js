// Dev-only test lesson (not in the database): every block of the lesson
// format (spec «Página de teoría», Part 2) with placeholder text. Opened at
// /dev/teoria-prueba while running `npm run dev`; never part of the build.
import correspondientes from './figuras/correspondientes.svg'
import alternosInternos from './figuras/alternos-internos.svg'
import interioresMismoLado from './figuras/interiores-mismo-lado.svg'
import { figureUrl } from '../lib/theoryArticle'

const content = String.raw`Esta es una lección de prueba, solo para desarrollo. Usa cada bloque del formato con texto de relleno: **negritas**, *cursivas*, **negritas con $x^2$ dentro** y una fórmula en línea $a+b=b+a$. Esto <b>no debe verse en negritas</b> y <script>alert(1)</script> debe verse como texto.

## Enunciados

:::definition Término de prueba
Texto de relleno para una definición, con una fórmula $a \mid b$.
:::

:::theorem Teorema de prueba
Texto de relleno para el enunciado de un teorema:
$$a^2+b^2=c^2$$
:::

:::lemma
Texto de relleno para un lema sin nombre: la etiqueta debe decir LEMA 1.

Idea: texto de relleno para la idea, en un tono más suave.
:::

:::corollary
Texto de relleno para un corolario sin nombre: COROLARIO 1.
:::

:::proposition Con nombre
Texto de relleno para una proposición con nombre.
:::

:::proof
Texto de relleno para la demostración, abierta por defecto. Al final aparece el cuadrado de fin a la derecha.
:::

## Ejemplos y preguntas

:::example Ejemplo con solución oculta
Enunciado de relleno: se ve siempre y en negritas.

Primer párrafo de la solución, oculto hasta abrir «Ver solución».

:::reveal Un detalle dentro del ejemplo
Texto de relleno dentro de un desplegable anidado.
:::
:::

### Ejemplo con el formato anterior
Texto de relleno de un ejemplo antiguo: todo visible, sin «Ver solución», numerado después del anterior.

:::try ¿Pregunta de prueba con $n$?
Respuesta de relleno, oculta hasta abrir.

:::reveal Pista anidada
Texto de relleno dentro del desplegable anidado.
:::
:::

:::tip
Texto de relleno para un consejo de olimpiada.
:::

:::mistake
Texto de relleno para un error común.
:::

:::reveal Un desplegable genérico
Texto de relleno oculto por defecto.
:::

## Listas, tablas y figuras

Lista con viñetas, justo después de un párrafo:
- Primer elemento con $x$.
- Segundo elemento con **negritas**.

1. Primer paso numerado.
2. Segundo paso numerado.

| Columna | Centrada | A la derecha |
| --- | :---: | ---: |
| $a \mid b$ en una celda | texto | 10 |
| *cursiva* | $a|b$ con barra | 200 |

![Dos rectas paralelas ℓ y m cortadas por la transversal t; los dos ángulos correspondientes están marcados con α](figuras/prueba-correspondientes.svg "**Una figura sola** · pie en Inter")

![Dos rectas paralelas ℓ y m cortadas por la transversal t; los ángulos correspondientes están marcados con α](figuras/prueba-correspondientes.svg "**Correspondientes** · son iguales") ![Dos rectas paralelas ℓ y m cortadas por la transversal t; los ángulos alternos internos están marcados con α](figuras/prueba-alternos-internos.svg "**Alternos internos** · son iguales") ![Dos rectas paralelas ℓ y m cortadas por la transversal t; los ángulos interiores del mismo lado están marcados con α y 180° − α](figuras/prueba-interiores-mismo-lado.svg "**Interiores del mismo lado** · suman 180°")

![Figura que no existe: este texto debe verse en un recuadro punteado](figuras/no-existe.svg "Pie de una figura que falta")

## Problemas

[[collection:prueba:ejercicios]]

[[collection:prueba:practice]]

[[collection:casillas:challenge]]

## En resumen

Texto de relleno para el resumen.

## Agregados culturales

- Dato de relleno para la primera tarjeta.
- Dato de relleno para la segunda tarjeta, con $\pi$.
- Dato de relleno para la tercera tarjeta.

[[source:https://example.com/fuente-de-prueba]]`

export const TEST_LESSON = {
  _id: 'leccion-de-prueba',
  title: 'Lección de prueba: todos los bloques',
  summary: 'Página solo para desarrollo con cada bloque del formato de lecciones y texto de relleno.',
  level: 'basico',
  topics: [{ name: 'Prueba' }],
  content,
}

// Existing bank problems (with hints) for the test collections; `casillas`
// comes from the draft review data.
export const TEST_COLLECTIONS = {
  prueba: { ejercicios: ['TP-C05', 'TP-C06'], practice: ['TP-C01', 'TP-C02'] },
}

const FIGURES = {
  'figuras/prueba-correspondientes.svg': correspondientes,
  'figuras/prueba-alternos-internos.svg': alternosInternos,
  'figuras/prueba-interiores-mismo-lado.svg': interioresMismoLado,
}

export function testFigureUrl(src) {
  return FIGURES[src] || figureUrl(src)
}
