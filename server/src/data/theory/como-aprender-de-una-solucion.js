const pathSlug = 'como-aprender-de-una-solucion'
const collection = pathSlug
const summary = 'Leer una solución por decisiones, reconstruir sus argumentos y comprobar cuándo una idea se puede adaptar.'
const content = String.raw`## Preámbulo: «¡Ah, ya entendí!»

Una estudiante lleva un rato intentando demostrar que el cuadrado de un entero impar deja residuo $1$ al dividirse entre $8$. Lee una solución, sigue cada línea y piensa: «¡Ah, ya entendí!». Al día siguiente intenta explicársela a una amiga y se detiene: recuerda que aparecían dos enteros consecutivos, pero no por qué eso ayudaba.

¿Entender una explicación mientras está a la vista es lo mismo que poder reconstruirla? Leer una solución puede abrir una puerta; detenerse en sus decisiones y volver a escribir las razones ayuda a descubrir qué hay detrás.

## Teoría

### Conservar la propia pregunta

Antes de leer, conviene guardar el intento: una cuenta, un ejemplo, una conjetura o el paso donde apareció la duda. Después será más fácil comparar caminos. Incluso un intento que no terminó puede contener una observación útil.

La pregunta de la estudiante puede escribirse así: «si $n$ es impar, ¿por qué $8$ divide a $n^2-1$?». Esa forma muestra qué se necesita demostrar. Calcular $3^2-1=8$ y $5^2-1=24$ da ejemplos, pero no explica lo que ocurre con todos los impares.

### Leer por decisiones

:::example
Demostrar que, para todo entero impar $n$, el número $n^2-1$ es divisible por $8$.

Como $n$ es impar, existe un entero $k$ con $n=2k+1$. Sustituimos y desarrollamos el cuadrado: $n^2-1=4k^2+4k+1-1$. Al cancelar $1-1$ y sacar factor común $4k$, obtenemos:
$$n^2-1=4k(k+1).$$
Si $k$ es par, $k=2m$ para algún entero $m$, y entonces $4k(k+1)=8m(k+1)$ es múltiplo de $8$. Si $k$ es impar, $k=2m+1$ para algún entero $m$, de modo que $k+1=2(m+1)$ y $4k(k+1)=8k(m+1)$ también es múltiplo de $8$. Todo entero es par o impar, así que ambos casos cubren las posibilidades.
:::

¿Por qué aparece $k(k+1)$? Al sustituir $n=2k+1$ y desarrollar, $n^2-1=4k^2+4k=4k(k+1)$. La factorización muestra dos enteros consecutivos. Uno es par: si $k$ es par sirve el primero, y si $k$ es impar sirve el segundo. El factor $2$ adicional, junto con el $4$ que ya teníamos, produce el $8$ buscado.

No basta reconocer la identidad al verla. Para cada paso se puede preguntar: «¿qué dato permite hacerlo?» y «¿qué se gana con esta transformación?». En la prueba, escribir el impar como $2k+1$ usa la hipótesis; factorizar permite aprovechar la paridad de dos consecutivos.

:::try ¿Qué paso explica que $k$ y $k+1$ no pueden ser ambos impares?
Si $k$ es impar, existe un entero $m$ con $k=2m+1$. Entonces $k+1=2(m+1)$ es par. Si $k$ es par, el primero ya es par. Estos dos casos cubren todos los enteros $k$.
:::

### Cerrar y reconstruir

Después de comprender una parte, ocultar la solución e intentar explicar el argumento desde el enunciado. No hace falta memorizar las mismas frases: sí hacen falta las hipótesis y las razones que justifican cada paso. Al terminar, comparar con el texto y completar las lagunas.

Por ejemplo, escribir solamente «son consecutivos, así que hay un $8$» omite la procedencia de los factores. La reconstrucción debe señalar el $4$ de la expresión y el $2$ que divide a uno de los dos enteros consecutivos.

:::mistake
Copiar cada línea de una solución y considerar terminada la revisión sin preguntar por sus razones. Una copia puede ser correcta, pero no permite saber si se puede explicar el paso decisivo o usarlo en otra situación.
:::

### Probar los límites de la idea

Cambiar una condición permite investigar qué papel desempeña. ¿Sigue siendo cierto el resultado para un entero par? No: con $n=2$, se obtiene $n^2-1=3$, que no es divisible por $8$. La hipótesis de imparidad no era decorativa.

También se puede pedir una conclusión más débil: si $n$ es impar, ¿es $n^2-1$ divisible por $4$? Sí. La expresión $4k(k+1)$ ya muestra un factor $4$, sin necesidad de separar según la paridad de $k$. En una variación distinta hay que comprobar de nuevo las hipótesis; una idea conocida no garantiza por sí sola la nueva conclusión. Si una solución usa que dos números son consecutivos, conviene localizar la línea que establece esa relación. Si los números de una variante ya no son consecutivos, se necesita otra razón para afirmar que alguno es par; no basta repetir la frase de la prueba anterior.

:::tip
Al terminar una lectura, anotar tres frases: «el obstáculo era…», «la idea fue…» y «esta idea funciona aquí porque…». Después intentar resolver una variante y revisar qué parte del argumento necesita cambiar.
:::

Aprender de otra solución no disminuye el valor del propio intento. Comparar ambos caminos permite identificar qué se había descubierto, qué faltaba y qué pregunta podría orientar el próximo problema.

## Agregados culturales

- Emmy Noether realizó contribuciones importantes al álgebra abstracta. En 1933 comenzó a trabajar en Bryn Mawr College, en Estados Unidos, donde dirigió un seminario de álgebra.
- La séptima Olimpiada Internacional de Matemáticas se celebró en Berlín en 1965. Participaron $80$ estudiantes de $10$ países.
- Los pulpos son cefalópodos y tienen tres corazones. Dos impulsan sangre hacia las branquias y el tercero la bombea al resto del cuerpo.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Elegir un problema y conservar el intento. Si se consulta una solución, identificar una decisión importante y reconstruirla después sin mirar.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Tras resolver o estudiar cada problema, cambiar una condición y determinar con cuidado si la conclusión sigue siendo cierta.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problems = [
  exercise('O33', 'Reconstruir un argumento', String.raw`Demostrar que el cuadrado de un entero impar es impar. Después, ocultar la demostración e intentar escribirla de nuevo con las razones completas.`, ['Representar el entero impar como $2k+1$.']),
  exercise('O34', 'Cambiar la hipótesis', String.raw`¿Es divisible por $8$ el número $n^2-1$ para todo entero $n$? Demostrar la afirmación o dar un contraejemplo.`, ['Probar un entero par pequeño.']),
  exercise('O35', 'Dos consecutivos', String.raw`Demostrar que el producto de dos enteros consecutivos es par. Explicar en qué parte de la solución se usa que son consecutivos.`, ['Separar los casos en que el primer entero es par o impar.']),
  exercise('O36', 'Una conclusión más débil', String.raw`Si $n$ es impar, demostrar que $n^2-1$ es divisible por $4$ sin usar que es divisible por $8$.`, ['Sustituir $n=2k+1$ y sacar factor común.']),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-O33','TP-O34','TP-O35','TP-O36'], practice: ['TP-A04','TP-A06','TP-N03','TP-N05','TP-C03','TP-C04'], dificiles: ['TP-A01','TP-M02'] } } }
