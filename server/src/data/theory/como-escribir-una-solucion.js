const pathSlug = 'como-escribir-una-solucion'
const collection = pathSlug
const summary = 'Convertir una idea en una solución clara y completa, con variables definidas, justificación de los pasos y comprobación de todos los casos.'
const content = String.raw`## Preámbulo: Una respuesta en una servilleta

Dos amigos buscan enteros consecutivos cuyo producto sea $72$. Uno anota «$8$ y $9$» en una servilleta: al multiplicarlos, el resultado funciona. El otro pregunta: «¿Cómo sabes que no hay otra pareja?»

Encontrar una respuesta puede ser emocionante. Pero, cuando un problema pide *todas* las respuestas, convencer a otra persona exige algo más: explicar por qué las encontradas sirven y por qué ninguna quedó fuera. ¿Cómo se transforma una buena idea en una explicación que alguien pueda revisar?

## Teoría

### Del borrador a la explicación

Al explorar es normal hacer cuentas desordenadas, probar números y descartar ideas. El borrador es un espacio de trabajo; no tiene que contar la historia en el orden en que se descubrió cada cosa. La solución final, en cambio, debe permitir que alguien siga una cadena de razones desde los datos hasta lo pedido.

Antes de escribir conviene identificar el dominio. ¿Se habla de enteros, enteros positivos o números reales? Una palabra puede cambiar la respuesta. Después se decide qué representa cada letra y se conserva ese significado durante toda la solución.

:::try ¿Hay otra pareja de enteros consecutivos con producto $72$?
Sí: $-9$ y $-8$ también tienen producto $72$. El enunciado permite enteros negativos, así que no podemos detenernos al encontrar $8$ y $9$.
:::

### Presentar una solución completa

Volvamos al problema de la servilleta y llamemos $n$ al menor de los dos enteros. El otro es $n+1$. Esta elección traduce «consecutivos» a una relación precisa.

:::example
Encontrar todas las parejas de enteros consecutivos cuyo producto sea $72$.

Sea $n$ el menor entero de una pareja que cumple las condiciones. Entonces $n(n+1)=72$. Al desarrollar y restar $72$ de ambos lados obtenemos $n^2+n-72=0$. Factorizamos:
$$(n+9)(n-8)=0.$$
El producto de dos números es cero solo si al menos uno de los factores es cero. Por tanto, $n+9=0$ o $n-8=0$; es decir, $n=-9$ o $n=8$. Las únicas parejas posibles son $(-9,-8)$ y $(8,9)$.

Falta comprobar que ambas sirven. Sus integrantes son consecutivos y sus productos son $(-9)(-8)=72$ y $8\cdot9=72$. Por ello, las dos parejas son las soluciones y no hay otras.
:::

La primera parte muestra que cualquier pareja buscada debe aparecer en nuestra lista: eso prueba que no omitimos ninguna. La comprobación muestra que cada pareja de la lista cumple lo pedido. Estas dos tareas son especialmente útiles cuando debemos encontrar todos los objetos con una propiedad. En otros problemas se pide demostrar una sola afirmación: allí la conclusión debe ser precisamente esa afirmación, no un ejemplo que la ilustre. Revisar la pregunta original al final ayuda a reconocer la diferencia.

### Justificar los puentes

Una solución no necesita explicar cada suma elemental, pero sí los pasos de los que depende la idea. Es distinto escribir una conclusión después de muchas cuentas que explicar por qué se sigue de ellas. Al usar un teorema, hay que verificar sus hipótesis; al separar casos, hay que explicar por qué cubren las posibilidades y resolver cada uno.

:::mistake
«Como $8\cdot9=72$, la única respuesta es $8$ y $9$». La cuenta demuestra que esa pareja sirve, pero no descarta otras. De hecho, la pareja negativa también sirve. Una respuesta correcta puede venir acompañada de un argumento incompleto.
:::

:::example
Demostrar que la suma de dos enteros impares es par.

Sean $a$ y $b$ enteros impares. Por definición existen enteros $r$ y $s$ con $a=2r+1$ y $b=2s+1$. Al sustituir estas expresiones y agrupar, obtenemos $a+b=2(r+s+1)$. Como $r+s+1$ es entero, la suma es par.
:::

En esta demostración se declara qué objetos se eligen, se usa la definición de impar y se identifica el entero que hace par a la suma. Decir solo «impar más impar es par» repetiría la conclusión sin explicar su razón.

### Revisar lo que leerá otra persona

Conviene leer el texto sin apoyarse en las cuentas que quedaron en otra hoja. ¿Se definió cada letra antes de usarla? ¿Cada igualdad sigue de la anterior? ¿Se indicó dónde se usó la condición del problema? Si se construyó una respuesta, hay que comprobar que respeta todas las condiciones. Si se afirmó que no existen otras, hay que localizar la línea que lo demuestra.

:::tip
Una frase breve entre dos cálculos puede indicar una acción o una razón: «sustituimos», «restamos la misma cantidad» o «como el factor es un entero». Las frases ayudan a distinguir los pasos justificados de los saltos.
:::

No hace falta esconder una idea sencilla detrás de palabras complicadas. Una solución breve puede ser excelente si explica lo necesario. Tampoco hace falta fingir que el camino se encontró de inmediato: organizarlo de nuevo es parte de comunicarlo.

## Agregados culturales

- Hacia 1637, Pierre de Fermat escribió en el margen de un libro de Diofanto que no existen enteros positivos $x,y,z$ con $x^3+y^3=z^3$, ni con exponentes mayores, y que tenía una demostración maravillosa que no cabía en el margen. Su hijo publicó la nota en 1670. La demostración nunca apareció, y la afirmación se demostró hasta 1995, con el trabajo de Andrew Wiles.
- La cuarta Olimpiada Internacional de Matemáticas se celebró en 1962 en České Budějovice, entonces Checoslovaquia. Participaron $56$ estudiantes de $7$ países.
- La Luna tarda aproximadamente $27$ días en completar una órbita alrededor de la Tierra. Sus fases dependen de qué parte iluminada por el Sol vemos desde nuestro planeta.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Escribir una solución que otra persona pueda seguir: definir las variables, justificar la idea principal y revisar que se respondió toda la pregunta.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Además de buscar la respuesta, explicar cómo se sabe que el argumento incluye todas las posibilidades del enunciado.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problems = [
  exercise('O21', 'Parejas consecutivas', String.raw`Encontrar todas las parejas de enteros consecutivos cuyo producto es $20$. Explicar por qué no hay otras.`, ['Llamar $n$ al menor de los dos enteros y factorizar $n^2+n-20$.']),
  exercise('O22', 'Una afirmación equivocada', String.raw`Una persona afirma que todo entero par es divisible por $4$. Dar un contraejemplo y explicar por qué lo es.`, ['Buscar un múltiplo de $2$ que no sea múltiplo de $4$.']),
  exercise('O23', 'Una suma explicada', String.raw`Demostrar que la suma de dos múltiplos enteros de $3$ es divisible por $3$. Definir las letras que se usen.`, ['Escribir cada sumando como $3$ multiplicado por un entero.']),
  exercise('O24', 'Cifras por escrito', String.raw`Encontrar todos los números de dos cifras cuya suma de cifras es $7$ y cuya cifra de las decenas supera en $3$ a la de las unidades. Justificar que no hay otros.`, ['Llamar $d$ a la cifra de las decenas y $u$ a la de las unidades.']),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-O21','TP-O22','TP-O23','TP-O24'], practice: ['TP-A02','TP-N02','TP-C05','TP-C06','TP-D03','TP-N08'], dificiles: ['TP-A01','TP-M02'] } } }
