const pathSlug = 'manipulaciones-y-sustituciones-algebraicas'
const collection = pathSlug
const summary = 'Reorganizar expresiones y elegir sustituciones para obtener información sin calcular cada cantidad por separado.'
const content = String.raw`## Preámbulo: Saber sin descubrirlo todo

Dos números están escondidos. Una persona conoce su suma y su producto, pero no sabe cuál es cada número. ¿Será posible averiguar la suma de sus cuadrados sin descubrir primero los números?

La pregunta aparece cuando los datos describen una pareja, pero lo que interesa es una propiedad de ambos. Tal vez calcular cada número sea una ruta posible; también podría haber una expresión que use directamente la información disponible.

En esta lección buscaremos esas expresiones y daremos nombres breves a las partes que se repiten. Cada transformación deberá conservar su valor y respetar los casos en los que la expresión original está definida.

## Teoría

### De la suma a la suma de cuadrados

Para relacionar los datos del preámbulo con los cuadrados, partimos de la identidad del cuadrado de una suma. Reorganizar una igualdad significa hacer operaciones válidas en ambos lados, no mover símbolos sin justificar.

:::proposition Suma de cuadrados
Para cualesquiera números reales $a$ y $b$ se cumple
$$a^2+b^2=(a+b)^2-2ab.$$
:::

:::proof
Por la identidad del cuadrado de una suma, $(a+b)^2=a^2+2ab+b^2$. Al restar $2ab$ de ambos lados queda $(a+b)^2-2ab=a^2+b^2$. Intercambiar los lados da la igualdad anunciada.
:::

La fórmula responde a la pregunta inicial: conocer la suma y el producto determina la suma de cuadrados, aunque no se haya calculado cada número por separado.

:::example
Dos números reales $a$ y $b$ cumplen $a+b=7$ y $ab=10$. Calcular $a^2+b^2$ sin hallar $a$ ni $b$.

La identidad anterior contiene exactamente la suma y el producto conocidos. Sustituimos $a+b=7$ y $ab=10$ en ella: $a^2+b^2=7^2-2(10)=49-20=29$.
:::

:::try Si $a+b=6$ y $ab=8$, ¿cuánto vale $a^2+b^2$?
Por la identidad, $a^2+b^2=6^2-2(8)=20$.
:::

En otros problemas conocemos una diferencia. Entonces conviene desarrollar $(a-b)^2=a^2-2ab+b^2$ y despejar la suma de cuadrados sumando $2ab$ en ambos lados.

:::tip
Antes de desarrollar una expresión larga, comparar lo que se busca con los datos. Una identidad puede relacionarlos directamente y evitar cálculos que no hacen falta.
:::

### Una expresión y su recíproco

Supongamos ahora que $x$ es un número real distinto de cero. La expresión $1/x$ está definida y $x(1/x)=1$; esto hace que el producto cruzado al elevar al cuadrado sea una constante conocida.

:::proposition Cuadrados recíprocos
Si $x$ es real y $x\ne0$, entonces
$$x^2+\frac{1}{x^2}=\left(x+\frac1x\right)^2-2.$$
:::

:::proof
En $(a+b)^2=a^2+2ab+b^2$ sustituimos $a=x$ y $b=1/x$. Como $x\ne0$, obtenemos $(x+1/x)^2=x^2+2+1/x^2$. Al restar $2$ de ambos lados queda $(x+1/x)^2-2=x^2+1/x^2$. Al intercambiar sus lados se obtiene la igualdad anunciada.
:::

Nombrar $t=x+1/x$ ayuda a ver que la respuesta depende de una sola cantidad: $x^2+1/x^2=t^2-2$. El nombre $t$ no cambia el valor de la expresión y solo se usa donde $x\ne0$.

:::example
Si $x$ es real, $x\ne0$ y $x+1/x=3$, calcular $x^4+1/x^4$.

Primero tomamos $t=x+1/x=3$. La proposición da $x^2+1/x^2=3^2-2=7$. Ahora aplicamos la misma proposición al número no nulo $x^2$: al sustituir $x$ por $x^2$ en la fórmula, resulta $x^4+1/x^4=(x^2+1/x^2)^2-2=7^2-2=47$.
:::

La condición dada sí puede cumplirse: equivale, al multiplicar por $x\ne0$, a $x^2-3x+1=0$, que tiene raíces reales no nulas. La respuesta se obtiene sin elegir una de ellas.

:::mistake
Olvidar el producto cruzado al elevar una suma al cuadrado. En general $(a+b)^2$ no es $a^2+b^2$: falta $2ab$. Por ejemplo, si $a=b=1$, el cuadrado de la suma es $4$ y la suma de cuadrados es $2$.
:::

### Nombrar una parte repetida

Una sustitución puede hacer visible una estructura conocida. La nueva letra representa una expresión completa; hay que conservar sus signos al reemplazarla y, cuando se necesite, volver a la variable original.

:::example
Escribir $x^2+4x+1$ en función de $u=x+2$, para cualquier número real $x$.

El cuadrado $(x+2)^2$ desarrolla como $x^2+4x+4$. Para recuperar $x^2+4x+1$ restamos $3$: $x^2+4x+1=(x+2)^2-3$. Puesto que $u=x+2$, la expresión es $u^2-3$. Todo número real $u$ corresponde a $x=u-2$, así que la sustitución no excluye valores reales.
:::

:::try Si $u=x-1$, ¿cuánto vale $x^2-2x+5$ en función de $u$?
Como $(x-1)^2=x^2-2x+1$, se tiene $x^2-2x+5=(x-1)^2+4=u^2+4$.
:::

### Conservar el dominio

Al transformar una fracción, primero registramos dónde está definida. Simplificar puede producir una fórmula con sentido en más valores, pero eso no amplía el dominio de la expresión original.

:::example
Simplificar $\dfrac{x^2-9}{x-3}$ e indicar su dominio real.

El denominador original es distinto de cero solo si $x\ne3$. Para esos valores, la diferencia de cuadrados da $x^2-9=(x-3)(x+3)$; como $x-3\ne0$, podemos dividirlo en numerador y denominador. El resultado es $x+3$, con la restricción $x\ne3$. Aunque $x+3$ existe en $x=3$, la fracción original no existe allí.
:::

## Agregados culturales

- En 1921 Emmy Noether publicó un trabajo sobre ideales en anillos que fue importante para el desarrollo del álgebra moderna. Su investigación estudió estructuras más generales que las expresiones numéricas de esta lección.
- La quinta Olimpiada Internacional de Matemáticas se celebró en 1963 en Wrocław, Polonia. Participaron $64$ estudiantes de $8$ países.
- Los pulpos tienen tres corazones: dos envían sangre a las branquias y otro la distribuye al resto del cuerpo. También tienen ocho brazos.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Antes de calcular valores individuales, buscar una identidad que relacione las expresiones conocidas con la cantidad solicitada. También conviene anotar las restricciones de cada fracción.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

En estos problemas hay que reutilizar una relación o combinar varias identidades para alcanzar una potencia que no aparece en los datos iniciales.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problem = (code, titulo, enunciado, difficulty = 'basico') => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, difficulty })
const problems = [
  exercise('A17','Suma de cuadrados',String.raw`Los números reales $a$ y $b$ cumplen $a+b=5$ y $ab=6$. Calcular $a^2+b^2$.`,['Desarrollar el cuadrado de la suma.']),
  exercise('A18','Suma de recíprocos',String.raw`Si $x$ es real, $x\ne0$ y $x+1/x=5$, calcular $x^2+1/x^2$.`,['Elevar al cuadrado el dato y reconocer el producto cruzado.']),
  exercise('A19','Dominio y simplificación',String.raw`Simplificar $\dfrac{x^2-16}{x-4}$ e indicar el dominio real de la expresión original.`,['Factorizar el numerador y revisar cuándo se anula el denominador.']),
  exercise('A20','Un nombre para una suma',String.raw`Si $u=x+1$, expresar $x^2+2x+4$ en función de $u$, para cualquier número real $x$.`,['Comparar la expresión con $(x+1)^2$.']),
  problem('A21','Otra suma de cuadrados',String.raw`Los números reales $a$ y $b$ cumplen $a+b=11$ y $ab=24$. Calcular $a^2+b^2$ sin hallar los números por separado.`),
  problem('A22','Diferencia de recíprocos',String.raw`Si $x$ es real, $x\ne0$ y $x-1/x=4$, calcular $x^2+1/x^2$.`),
  problem('A23','Una fracción con restricción',String.raw`Simplificar $\dfrac{x^2-4}{x-2}$ e indicar todos los valores reales de $x$ para los cuales la expresión original está definida.`),
  problem('A24','Una suma de cubos',String.raw`Los números reales $a$ y $b$ cumplen $a+b=3$ y $ab=-4$. Calcular $a^3+b^3$ sin hallar los números por separado.`),
  problem('A25','Cuartas potencias recíprocas',String.raw`Si $x$ es real, $x\ne0$ y $x+1/x=4$, calcular $x^4+1/x^4$.`,'intermedio'),
  problem('A26','Cuartas potencias de una pareja',String.raw`Los números reales $a$ y $b$ cumplen $a+b=4$ y $ab=1$. Calcular $a^4+b^4$ sin hallar los números por separado.`,'intermedio'),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-A17','TP-A18','TP-A19','TP-A20'], practice: ['TP-A03','TP-A04','TP-A21','TP-A22','TP-A23','TP-A24'], dificiles: ['TP-A25','TP-A26'] } } }
