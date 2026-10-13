// Two review-only proposals. Existing bank Problems are referenced by code;
// new exercises live once here and are NOT imported/published automatically.
export const REFINED_SAMPLES = {
  'principio-aditivo-y-multiplicativo': {
    title: 'Principios aditivo y multiplicativo', collection: 'conteo',
    content: String.raw`## Preámbulo: Contar sin perder la cuenta

Contar hasta doce no parece una hazaña. Pero imagina que una pantalla tiene doce focos y cada uno puede estar apagado, encendido en rojo o encendido en azul. ¿Cuántos mensajes diferentes puedes mostrar? No se trata de contar los focos: ahora tenemos que contar todas sus posibles configuraciones. Son $531\,441$. ¿Cómo podríamos llegar a ese número sin pasar la tarde dibujándolas?

Vamos a empezar con una pantalla de solo dos focos. Llama O al estado apagado, R al rojo y A al azul. Si el primer foco está apagado, los mensajes posibles son OO, OR y OA. Si está rojo, son RO, RR y RA. Si está azul, son AO, AR y AA. Tres grupos de tres: nueve mensajes.

La lista tiene algo mejor que una respuesta: tiene un orden. Toda configuración aparece en el grupo que corresponde a su primer foco y aparece una sola vez. Ese pequeño argumento es lo que necesitaremos cuando la lista sea demasiado grande para escribirla.

## Teoría: Una decisión abre otras puertas

### Construir por etapas

Para añadir un tercer foco, cada uno de los nueve mensajes anteriores admite tres finales. Tenemos $9\cdot3=27$. Cada foco nuevo multiplica por tres la cantidad de mensajes. Con doce focos obtenemos $3^{12}=531\,441$. Ahora el número grande tiene una explicación pequeña.

:::definition Principio multiplicativo
Si una construcción tiene $a$ primeras elecciones y cada una admite exactamente $b$ continuaciones, hay $ab$ resultados. Para contar correctamente, cada construcción debe producir un resultado válido y cada resultado debe aparecer una sola vez. El argumento se puede repetir en más etapas.
:::

### Ejemplo guiado: una clave con memoria

Una clave consta de tres letras distintas elegidas de A, B, C, D y E. ¿Cuántas hay? Si escribiste $5^3$, prueba qué pasaría con AAA: la cuenta la incluye, pero la regla la prohíbe.

Fijemos la primera letra. Cualquiera que sea, ya gastamos una de las cinco: quedan cuatro para el segundo lugar. Después quedan tres para el tercero. Por eso el conteo es $5\cdot4\cdot3=60$.

Las elecciones no son independientes: la primera cambia cuáles letras quedan. Lo que se mantiene es la cantidad de continuaciones en cada etapa. Esa es la condición que permite multiplicar.

### Reunir posibilidades que no se mezclan

Ahora una señal puede ser un destello de un solo color o una secuencia de dos colores distintos. Hay tres colores disponibles. ¿Sumarías o multiplicarías las cantidades de señales cortas y largas?

:::definition Principio aditivo
Si dividimos los resultados en grupos que no se superponen y que cubren todas las posibilidades, el total es la suma de los tamaños de los grupos. Cada resultado debe pertenecer a exactamente un grupo.
:::

### Ejemplo guiado: una señal, dos longitudes

Las señales de un destello son tres. Las de dos destellos distintos son $3\cdot2=6$: el orden importa porque rojo–azul y azul–rojo se ven diferentes. Una señal no puede tener ambas longitudes a la vez. Por eso hay $3+6=9$ señales.

Multiplicar tres por seis contaría algo diferente: elegir una señal corta y además una larga. El enunciado pide una sola. Antes de decidir la operación, describe qué significa una respuesta completa.

### Cambiar el orden de las decisiones

A veces un único producto esconde que unas elecciones dejan más posibilidades que otras. Podemos resolverlo separando casos y multiplicando dentro de cada uno.

### Ejemplo guiado: deja que el cero decida

¿Cuántos números pares de tres cifras distintas se forman con $0,1,2,3,4$? La última cifra tiene una condición especial: debe ser cero, dos o cuatro. Comencemos por ella.

Si termina en cero, quedan cuatro opciones para la centena y tres para la decena: $4\cdot3=12$. Si termina en dos o cuatro, hay dos opciones para la unidad; una vez fijada, la centena tiene tres opciones porque no puede ser cero ni repetir la unidad. La decena tiene tres, incluido el cero. Este caso aporta $2\cdot3\cdot3=18$.

Los casos no se cruzan y cubren todas las terminaciones pares. Sumamos: $12+18=30$. La diferencia entre ambos casos es exactamente el cero: gastarlo al final deja una centena más disponible.

### Contar lo que falta

### Ejemplo guiado: al menos una luz encendida

Volvamos a la pantalla de doce focos. Ahora exigimos al menos un foco encendido. Contar por separado los mensajes con uno, dos, tres… focos encendidos sería posible, pero largo. ¿Cuántos mensajes de los que ya contamos incumplen la nueva condición?

Solo uno: todos los focos apagados. Por eso quedan $3^{12}-1=531\,440$. Cuando las posibilidades prohibidas son fáciles de describir, contar todo y quitarlas puede ahorrar trabajo. Hay que quitar exactamente las prohibidas, una sola vez cada una.

## Ejercicios: Antes de apagar la calculadora

1. Una pantalla tiene cuatro focos con los mismos tres estados. ¿Cuántas configuraciones tiene? ¿Cuántas tienen al menos un foco encendido?

2. Con A, B, C y D forma claves de uno o dos lugares sin repetir letras. Explica por qué hay una suma y también un producto.

3. En el ejemplo de números pares, ¿qué cuenta incorrectamente $3\cdot4\cdot3$?

:::reveal Comprobar los ejercicios
1. Son $3^4=81$ configuraciones, y $80$ si quitamos la completamente apagada.

2. Hay $4+4\cdot3=16$: cuatro claves cortas y doce largas.

3. Le asigna cuatro centenas a toda terminación. Cuando termina en dos o cuatro, incluye al cero como centena y produce escrituras que no son números de tres cifras.
:::

## Agregados culturales: Un árbol que no necesita hojas de papel

La lista organizada de dos focos es un pequeño diagrama de árbol escrito con letras. Cada rama representa una elección y cada final, un resultado. Cuando multiplicas, estás contando esos finales sin dibujarlos todos.

En programación aparece la misma pregunta al recorrer combinaciones de opciones. Un cálculo de posibilidades permite anticipar si conviene enumerar todo o buscar una idea que evite hacerlo. Aquí, unas cuantas decisiones con solo tres opciones ya generaron más de medio millón de resultados.

## Problemas: Ahora elige tú el camino

Estos problemas mezclan decisiones sucesivas, longitudes y restricciones. Antes de calcular, escribe qué distingue a dos resultados. El bloque muestra cinco; la colección continúa en su propia página de revisión.

[[collection:conteo:practice]]

## Problemas de mayor dificultad: Cuando la cuenta se resiste

Aquí la dificultad está en encontrar una buena separación de casos o reconocer un sobreconteo. No necesitas una fórmula nueva. Usa un caso pequeño para poner a prueba tu idea antes de escribir el argumento general.

[[collection:conteo:challenge]]` },
  'principio-de-casillas': {
    title: 'Principio de casillas', collection: 'casillas',
    content: String.raw`## Preámbulo: Cuando ya no cabe la casualidad

Cinco proyectos llegan a un taller. Cada uno recibe una de cuatro etiquetas: dibujo, música, relato o fotografía. No has visto ninguno. Aun así puedes anunciar que dos compartirán etiqueta. ¿Cómo puedes saber algo de proyectos que todavía no conoces?

Intenta evitar la repetición: da una etiqueta diferente a cada uno de los primeros cuatro. Ya usaste todas. Al quinto le tocará una ocupada. Si repetiste antes, tu anuncio ya se había cumplido. No hace falta buena suerte; hace falta un objeto más que categorías.

Todavía no sabemos qué etiqueta se repite ni cuáles son los proyectos. Eso no impide demostrar que la coincidencia existe. En esta lección aprenderemos a fabricar clasificaciones que obliguen a aparecer la propiedad que buscamos.

## Teoría: Dale una casilla a cada idea

### Una repetición inevitable

:::definition Principio de casillas
Si $k+1$ objetos se distribuyen en $k$ casillas, alguna casilla contiene al menos dos objetos. Cada objeto se asigna a exactamente una casilla. Si todas tuvieran a lo más uno, habría a lo más $k$ objetos, contradiciendo que tenemos $k+1$.
:::

### Ejemplo guiado: encontrar una diferencia sin encontrar los números

Alguien escribe cuatro enteros y te pide demostrar que dos tienen diferencia divisible entre tres. Clasificarlos por cantidad de cifras no parece ayudar. ¿Qué propiedad sí conecta dos números con una diferencia múltiplo de tres?

El residuo. Solo hay tres residuos posibles al dividir entre tres: cero, uno y dos. Esas serán nuestras casillas. Como tenemos cuatro números, dos comparten residuo. Si son $3a+r$ y $3b+r$, su diferencia es $3(a-b)$.

Observa las dos partes: primero forzamos la coincidencia; después explicamos por qué esa coincidencia resuelve el problema. Escribir solo «por casillas» dejaría sin explicar justamente la elección importante.

### Forzar algo más que una pareja

:::definition Casillas con capacidad
Si $kr+1$ objetos ocupan $k$ casillas, alguna contiene al menos $r+1$. En efecto, si todas contuvieran a lo más $r$, el total no superaría $kr$. Con exactamente $kr$ objetos todavía podría haber $r$ en cada casilla.
:::

### Ejemplo guiado: ¿cuántos hacen falta para asegurar seis?

Queremos garantizar que seis proyectos lleven la misma etiqueta entre cuatro etiquetas posibles. En lugar de perseguir directamente los seis, intenta evitarlos: puedes colocar cinco en cada categoría, para un total de veinte. El proyecto veintiuno obliga a alguna categoría a llegar a seis.

La respuesta mínima es veintiuno. La prueba tiene dos piezas: veintiuno siempre basta y veinte todavía pueden fallar, con la distribución $5,5,5,5$. Probar que una cantidad basta no demuestra por sí solo que sea la menor.

### Mirar el promedio

:::definition Promedio y extremos
Entre varios números reales, alguno es al menos su promedio y alguno es a lo más su promedio. Si todos fueran menores que el promedio, al sumarlos obtendríamos menos que el total que define ese promedio; lo mismo, al revés, si todos fueran mayores.
:::

### Ejemplo guiado: una media que nadie tiene

Cinco grupos resolvieron cuarenta y dos ejercicios en total. Su promedio es $42/5=8.4$, aunque ningún grupo resolvió cuatro décimas de ejercicio. Alguno resolvió al menos nueve, porque su cantidad es entera y debe ser al menos $8.4$. Alguno resolvió a lo más ocho por el mismo razonamiento hacia abajo.

También puedes demostrarlo sin decimales: cinco grupos con ocho o menos no llegarían a cuarenta y dos; cinco con nueve o más se pasarían. El promedio organiza esa comparación.

### Diseñar las casillas según la conclusión

### Ejemplo guiado: queremos una suma, no una diferencia

Se eligen siete números distintos entre uno y doce. Queremos que dos sumen trece. Agrupar por residuos no señala inmediatamente esa suma. Mejor escribe las parejas que sí la producen: $\{1,12\}$, $\{2,11\}$, $\{3,10\}$, $\{4,9\}$, $\{5,8\}$ y $\{6,7\}$.

Tenemos seis casillas y siete elecciones. Dos elecciones caen en una misma pareja. Como los números elegidos son distintos, son los dos miembros de esa pareja, y suman trece. Si permitiéramos repetir, elegir dos veces el uno no bastaría. La hipótesis «distintos» tiene trabajo que hacer.

## Ejercicios: Haz espacio para el argumento

1. Diecisiete dibujos ocupan cuatro carpetas. ¿Cuántos puedes garantizar en alguna carpeta? Da una distribución que impida garantizar uno más.

2. ¿Cuántos proyectos bastan para garantizar cuatro con una misma etiqueta entre seis etiquetas posibles? Demuestra que tu cantidad es mínima.

3. En el ejemplo de la suma trece, ¿por qué no podemos quitar la condición de números distintos?

:::reveal Comprobar los ejercicios
1. Puedes garantizar cinco; $5,4,4,4$ muestra que no puedes garantizar seis.

2. Diecinueve: dieciocho aún caben como tres por categoría. Con diecinueve, alguna llega a cuatro.

3. Podrías elegir siete veces el uno. Dos elecciones caerían en la misma casilla, pero su suma sería dos. Compartir casilla debe implicar realmente la conclusión que buscamos.
:::

## Agregados culturales: Las casillas pueden ser invisibles

Este principio también se conoce como principio del palomar o de los pichones. Pero sus casillas pueden ser residuos, intervalos, parejas o patrones completos de respuestas. La dificultad de un problema suele estar en inventarlas, no en comparar dos cantidades.

Además, una prueba de existencia no siempre entrega un procedimiento para localizar rápidamente el ejemplo. Saber que una coincidencia tiene que aparecer puede ser el primer paso para diseñar una búsqueda, aunque todavía no sepamos dónde mirar.

## Problemas: Construye tus propias casillas

En cada solución identifica los objetos, las casillas y lo que significa compartir una. Si buscas una cantidad mínima, explica tanto por qué basta como por qué una menos podría fallar.

[[collection:casillas:practice]]

## Problemas de mayor dificultad: Las casillas no venían dibujadas

Ahora tendrás que transformar la información del enunciado antes de clasificarla. Puedes conocer perfectamente el principio y aun así necesitar tiempo para descubrir qué objetos conviene colocar en las casillas.

[[collection:casillas:challenge]]` },
}

const draft = (code, collection, tier, enunciado, hint, solution) => ({ codigo: code, collection, tier, enunciado, hint, solution, draft: true })
export const REVIEW_PROBLEMS = [
  draft('RC-01','conteo','practice',String.raw`Una señal tiene tres posiciones. En cada una puedes colocar rojo, azul o verde. Se permiten repeticiones. ¿Cuántas señales contienen al menos un rojo?`, 'Cuenta todas y quita las que usan solo los otros dos colores.', String.raw`Hay $3^3=27$ señales. Las que no contienen rojo son $2^3=8$. Quedan $27-8=19$. Cada señal prohibida se quita una sola vez.`),
  draft('RC-02','conteo','practice',String.raw`Una ruta de A a C debe pasar por B. Hay tres caminos de A a B y cuatro de B a C. ¿Cuántas rutas de ida hay? ¿Y cuántos viajes de ida y vuelta si en el regreso no puedes repetir ninguno de los caminos de la ida? Todos los caminos pueden recorrerse en ambos sentidos.`, 'En el regreso, cuenta por separado las opciones de cada tramo.', String.raw`Para la ida hay $3\cdot4=12$. Tras elegirla, quedan tres caminos de C a B y dos de B a A. Los viajes completos son $3\cdot4\cdot3\cdot2=72$. Cada viaje queda determinado por esas cuatro elecciones.`),
  draft('RC-03','conteo','practice',String.raw`Con las cifras $0,1,2,3,4$ se forman números impares de tres cifras distintas. ¿Cuántos hay?`, 'Fija primero la unidad. Comprueba cuántas centenas quedan en cada caso.', String.raw`La unidad es uno o tres. Fijada, hay tres centenas posibles, pues no pueden ser cero ni la unidad, y tres decenas posibles. Total $2\cdot3\cdot3=18$.`),
  draft('RC-04','conteo','practice',String.raw`Una clave tiene uno, dos o tres símbolos, elegidos de A, B, C y D sin repetir. ¿Cuántas claves diferentes hay?`, 'Las longitudes definen casos que no se cruzan.', String.raw`Hay cuatro de longitud uno, $4\cdot3=12$ de longitud dos y $4\cdot3\cdot2=24$ de longitud tres. En total $4+12+24=40$.`),
  draft('RC-05','conteo','challenge',String.raw`Forma claves de cuatro símbolos usando A, B y C, con repetición. ¿Cuántas contienen al menos una A y al menos una B?`, 'Si restas las que no tienen A y las que no tienen B, ¿qué clave has quitado dos veces?', String.raw`Hay $3^4=81$ claves. Restamos $2^4=16$ sin A y otras dieciséis sin B. CCCC pertenece a ambos grupos y se restó dos veces; la devolvemos una vez. Quedan $81-16-16+1=50$.`),
  draft('RC-06','conteo','challenge',String.raw`Con $0,1,2,3,4,5$ forma números de cuatro cifras distintas divisibles entre cinco. ¿Cuántos hay?`, 'Separa terminación cero y terminación cinco. La centena no tiene la restricción del primer lugar.', String.raw`Si termina en cero, hay cinco primeras cifras y luego cuatro y tres opciones: $5\cdot4\cdot3=60$. Si termina en cinco, hay cuatro primeras cifras no nulas y distintas de cinco; después cuatro y tres opciones: $4\cdot4\cdot3=48$. Total $108$.`),
  draft('RP-01','casillas','practice',String.raw`Veintidós proyectos se clasifican con cinco etiquetas. ¿Cuántos proyectos con la misma etiqueta puedes garantizar? ¿Por qué no puedes garantizar uno más?`, 'Supón que cada etiqueta se usa a lo más cuatro veces.', String.raw`Alguna etiqueta se usa al menos cinco veces, pues $22>5\cdot4$. No podemos garantizar seis: la distribución $5,5,4,4,4$ tiene veintidós y ninguna categoría llega a seis.`),
  draft('RP-02','casillas','practice',String.raw`Nueve personas responden tres preguntas de sí o no. Demuestra que dos entregan exactamente el mismo patrón de respuestas.`, 'Una casilla debe describir las tres respuestas, no una sola.', String.raw`Hay $2^3=8$ patrones completos. Nueve personas en esas ocho casillas fuerzan dos con el mismo patrón.`),
  draft('RP-03','casillas','practice',String.raw`Se eligen ocho números distintos entre uno y catorce. Demuestra que dos son consecutivos.`, 'Divide la lista completa en parejas consecutivas disjuntas.', String.raw`Usa las siete casillas $\{1,2\},\{3,4\},\ldots,\{13,14\}$. Dos elecciones comparten una casilla. Por ser distintas, ocupan sus dos miembros, que son consecutivos.`),
  draft('RP-04','casillas','practice',String.raw`Seis enteros se escriben en una hoja. Demuestra que hay dos cuya suma o cuya diferencia es divisible entre cuatro.`, 'Agrupa los residuos para que tanto compartir como complementar puedan servir.', String.raw`Usa tres casillas: residuo cero, residuo dos, y residuos uno o tres. Dos de los seis enteros comparten casilla. Si tienen el mismo residuo, su diferencia es múltiplo de cuatro. Si sus residuos son uno y tres, su suma es múltiplo de cuatro. De hecho, cuatro enteros ya bastarían.`),
  draft('RP-05','casillas','challenge',String.raw`Se escriben ocho enteros en una fila. Demuestra que un bloque no vacío de posiciones consecutivas tiene suma divisible entre ocho.`, 'Incluye la suma vacía junto con las ocho sumas iniciales.', String.raw`Sean $S_0=0$ y $S_j=a_1+\cdots+a_j$. Entre las nueve sumas hay dos con igual residuo módulo ocho. Si sus índices son $i<j$, la diferencia $S_j-S_i=a_{i+1}+\cdots+a_j$ es múltiplo de ocho y corresponde a un bloque no vacío.`),
  draft('RP-06','casillas','challenge',String.raw`Nueve puntos están en el cuadrado cerrado de lado dos. Demuestra que tres pueden quedar contenidos en un mismo cuadrado de lado uno y que cada par de esos tres puntos está a distancia a lo más $\sqrt2$.`, 'Divide en cuatro cuadrados; asigna cada punto de frontera a uno solo.', String.raw`Distribuye los puntos entre los cuatro cuadrados de lado uno, asignando los puntos de fronteras mediante una regla fija. Como $9>4\cdot2$, uno contiene al menos tres. La distancia entre cualesquiera dos puntos de ese cuadrado no supera su diagonal, $\sqrt2$.`),
]
export const REVIEW_COLLECTIONS = {
  conteo: { title: 'Principios aditivo y multiplicativo', practice: ['TP-C01','TP-C02','RC-01','RC-02','RC-03','RC-04'], challenge: ['RC-05','RC-06'] },
  casillas: { title: 'Principio de casillas', practice: ['TP-C05','TP-C06','RP-01','RP-02','RP-03','RP-04'], challenge: ['RP-05','RP-06'] },
}
