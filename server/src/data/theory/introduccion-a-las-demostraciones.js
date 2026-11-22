const pathSlug = 'introduccion-a-las-demostraciones'
const collection = pathSlug
const summary = 'Distinguir ejemplos, demostraciones y contraejemplos, identificando las hipótesis y la conclusión de una afirmación.'
const content = String.raw`## Preámbulo: Una máquina de números primos

Una máquina recibe un entero $n$ y devuelve $n^2+n+17$. Con las entradas $0$, $1$, $2$ y $3$ produce $17$, $19$, $23$ y $29$: cuatro números primos. ¿Seguirá ocurriendo lo mismo para cualquier entero?

Los primeros resultados invitan a hacer una conjetura. También dejan una duda: ¿cuántas pruebas particulares bastan para asegurar una regla sin excepciones? Una demostración busca responder con una razón que cubra todos los casos indicados.

## Teoría

### Observar y afirmar

Una **conjetura** es una afirmación que se propone a partir de observaciones y cuya validez todavía debe justificarse. Los ejemplos ayudan a descubrirla y a comprobar que se entendió el enunciado, pero una lista finita no cubre por sí sola todos los enteros.

La conjetura de la máquina dice: «para todo entero $n$, el número $n^2+n+17$ es primo». Para refutar una afirmación que dice «para todo», basta encontrar un valor permitido que no cumpla la propiedad.

:::try ¿Qué produce la máquina cuando $n=17$ y es primo el resultado?
Produce $17^2+17+17=17(17+1+1)=17\cdot19$. Es compuesto, pues $17$ y $19$ son enteros mayores que $1$. Por tanto $n=17$ es un contraejemplo a la conjetura.
:::

Un **contraejemplo** debe satisfacer las condiciones de partida y hacer falsa la conclusión. El número $17$ es una entrada entera permitida, y la salida tiene dos factores mayores que uno. No necesita haber un contraejemplo pequeño para que una afirmación sea falsa.

### Usar una definición

Una demostración para todos los enteros comienza con un entero arbitrario del tipo indicado. Después usa las definiciones y propiedades conocidas para llegar a la conclusión, sin elegir un número que haga fácil el cálculo.

:::proposition Cuadrado de un impar
Si $n$ es un entero impar, entonces $n^2$ es impar.
:::

:::proof
Como $n$ es impar, existe un entero $k$ tal que $n=2k+1$. Desarrollamos el cuadrado:
$$n^2=4k^2+4k+1.$$
Al sacar factor $2$ de los dos primeros términos, $n^2=2(2k^2+2k)+1$. La cantidad $2k^2+2k$ es entera, así que $n^2$ tiene la forma de un entero impar. La elección de $n$ fue arbitraria.
:::

La prueba cubre, por ejemplo, a $-3$: puede escribirse como $2(-2)+1$. No tuvimos que repetir el cálculo para cada entero impar, porque la definición incluyó todos los casos permitidos.

:::example
Demostrar que la suma de dos múltiplos enteros de $5$ es múltiplo de $5$.

Sean $a$ y $b$ dos múltiplos enteros de $5$. Existen enteros $r$ y $s$ con $a=5r$ y $b=5s$. Al sumar, $a+b=5r+5s=5(r+s)$. Como $r+s$ es entero, la suma es múltiplo de $5$.
:::

:::mistake
Escribir varios ejemplos favorables y declarar demostrada una afirmación universal. Los cuatro primeros valores de la máquina no mostraron su salida compuesta con $n=17$. Una prueba general debe explicar por qué la propiedad se cumple para un objeto arbitrario del dominio.
:::

### Hipótesis y conclusión

En una afirmación «si $P$, entonces $Q$», la hipótesis $P$ describe lo que se supone y la conclusión $Q$ lo que se quiere obtener. La implicación no garantiza $Q$ para objetos que no cumplen $P$, ni afirma automáticamente la implicación en sentido inverso.

:::example
Identificar hipótesis y conclusión en «si un entero es divisible por $6$, entonces es divisible por $3$», y demostrar la afirmación.

La hipótesis es que un entero $n$ es divisible por $6$; la conclusión es que $n$ es divisible por $3$. Por la hipótesis, $n=6k$ para algún entero $k$. Como $6k=3(2k)$ y $2k$ es entero, $n$ es divisible por $3$.
:::

Intercambiar hipótesis y conclusión da la **recíproca**. En este ejemplo la recíproca sería «si un entero es divisible por $3$, entonces es divisible por $6$», que es falsa: $3$ cumple la primera condición, pero no la segunda.

:::tip
Antes de escribir una prueba, anotar el dominio, la hipótesis y la conclusión. Al terminar, revisar si cada símbolo fue definido y si el último paso realmente demuestra lo que se pedía.
:::

### Encontrar una afirmación intermedia

No toda prueba pasa de la hipótesis a la conclusión en un solo paso. Podemos buscar una afirmación intermedia y explicar tanto por qué se deduce de los datos como por qué ayuda a terminar.

:::example
Demostrar que la suma de dos enteros consecutivos es impar.

Llamemos $m$ al menor de los dos enteros; el mayor es $m+1$. La suma es $m+(m+1)=2m+1$. Como $m$ es entero, la definición de impar muestra que la suma es impar. La representación de los consecutivos es el puente entre el enunciado y la forma $2m+1$.
:::

## Agregados culturales

- Julia Robinson estudió durante años preguntas sobre ecuaciones con soluciones enteras. Su trabajo fue parte del desarrollo que permitió resolver el décimo problema de Hilbert en 1970.
- La tercera Olimpiada Internacional de Matemáticas se celebró en 1961 en Veszprém, Hungría. Participaron $48$ estudiantes de $6$ países.
- La Luna tarda aproximadamente $27.3$ días en completar una vuelta alrededor de la Tierra. El intervalo entre dos lunas nuevas es distinto: aproximadamente $29.5$ días.

## Ejercicios

[[collection:${collection}:ejercicios]]

## Problemas

Enunciar las hipótesis y la conclusión antes de empezar. Si se propone un contraejemplo, comprobar que cumple todas las condiciones de partida.

[[collection:${collection}:practice]]

## Problemas de mayor dificultad

Estos problemas requieren encontrar una propiedad intermedia o justificar una imposibilidad para todos los valores del dominio.

[[collection:${collection}:dificiles]]`
const exercise = (code, titulo, enunciado, hints) => ({ codigo: `TP-${code}`, pathSlug, titulo, enunciado, hint: hints.join('\n\n'), difficulty: 'basico' })
const problems = [
  exercise('O17','Un contraejemplo',String.raw`Una persona afirma que $n^2=n$ para todo entero $n$. Dar un contraejemplo y comprobarlo.`,['Probar un entero distinto de $0$ y $1$.']),
  exercise('O18','Una hipótesis de divisibilidad',String.raw`Demostrar que si un entero es divisible por $6$, entonces es par.`,['Escribir el entero como $6k$ para algún entero $k$.']),
  exercise('O19','Una afirmación sobre primos',String.raw`Una persona afirma que todo número primo es impar. Encontrar un contraejemplo y justificar que cumple las condiciones.`,['Considerar el menor número primo.']),
  exercise('O20','Sumar múltiplos',String.raw`Demostrar que la suma de dos múltiplos enteros de $7$ es múltiplo de $7$.`,['Escribir los dos sumandos con un factor $7$.']),
]
export default { pathSlug, summary, content, problems, collections: { [collection]: { ejercicios: ['TP-O17','TP-O18','TP-O19','TP-O20'], practice: ['TP-A02','TP-N02','TP-C05','TP-C06','TP-D03','TP-N08'], dificiles: ['TP-A01','TP-M02'] } } }
