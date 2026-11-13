// Original TeacherPeri lessons. Source structures and research notes: docs/editorial/WRITING_LAB.md.
// Review labels live outside persisted Theory records; canonical identities are unchanged.
export const THEORY_WRITING_LAB = {
  'principio-aditivo-y-multiplicativo': {
    model: 'A', label: 'A1 · Contar construyendo', engagement: 10,
    content: String.raw`## Una clave que todavía puedes contar a mano

Una puerta se abre con una clave de dos símbolos. El teclado solo tiene estrella, luna y sol. Puedes repetir símbolos, y estrella–luna abre una puerta distinta de luna–estrella. ¿Cuántas claves habría que probar para tener la seguridad de abrirla?

Antes de hacer una cuenta, escribe las claves. Son pocas. El reto es encontrar una manera de ordenarlas que te permita decir: «no me falta ninguna».

:::reveal Comparar mi lista
Si empiezas con estrella, puedes terminar con estrella, luna o sol. Son tres claves. Las que empiezan con luna forman otro grupo de tres; las que empiezan con sol, otro. En total hay $3+3+3=9$. No falta ninguna: toda clave empieza con uno de esos símbolos. Ninguna está dos veces: los grupos tienen comienzos diferentes.
:::

Fíjate en lo que acabas de hacer. La multiplicación $3\cdot3$ no apareció porque el enunciado tuviera dos números. Apareció porque construiste tres grupos del mismo tamaño. Esa organización es la parte matemática del conteo; hacer la multiplicación es lo último.

## Cambiemos una sola regla

Ahora el teclado rechaza las claves que repiten símbolo. No borres toda tu lista: tacha las que dejaron de servir. ¿Cuántas sobreviven en cada grupo?

Quedan dos por grupo. Una vez escogido el primer símbolo, ese símbolo ya no puede ocupar el segundo lugar. Tenemos $3\cdot2=6$ claves. Las decisiones dependen una de otra, pero la cantidad de opciones para la segunda sigue siendo dos, cualquiera que haya sido la primera.

Esto importa: para multiplicar no necesitamos decisiones «independientes». Necesitamos saber cuántas continuaciones tiene cada elección. Si mañana el teclado tiene siete símbolos y pide tres distintos, puedes reconstruir el cálculo: siete para comenzar, seis para continuar y cinco para terminar. Hay $7\cdot6\cdot5=210$.

### Una pausa pequeña

Con los tres símbolos originales, ¿cuántas claves de tres lugares hay si se permite repetir? ¿Y si no se permite? Explica qué cuenta cada factor, incluso si ya ves el resultado.

:::reveal Revisar las dos cuentas
Con repetición, cada prefijo admite tres continuaciones: $3^3=27$. Sin repetición, quedan tres, luego dos y luego uno: $3\cdot2\cdot1=6$. Un mismo teclado produce respuestas distintas porque cambió lo que se permite hacer.
:::

## Cuando multiplicar de golpe cuenta cosas prohibidas

Pasemos a números: queremos números pares de tres cifras distintas usando $0,1,2,3,4$. ¿Por dónde empezarías?

Si comienzas por la centena, tendrás que vigilar dos cosas después: qué cifras quedan y cuáles pueden cerrar un número par. Podemos reducir ese trabajo empezando por la unidad, que es el lugar con la condición más fuerte.

La unidad puede ser cero, dos o cuatro. Pero esas tres opciones no se comportan igual. Si ya gastamos el cero, nunca tendremos que preocuparnos por ponerlo al principio. Si gastamos el dos, el cero sigue disponible y podría estropear la centena.

### Caso 1: termina en cero

La centena tiene cuatro opciones: $1,2,3,4$. Después quedan tres cifras para la decena. Obtenemos $4\cdot3=12$ números.

### Caso 2: termina en dos o en cuatro

Hay dos elecciones de unidad. Fijada una, la centena tiene tres posibilidades: no puede ser cero ni repetir la unidad. La decena puede ser cualquiera de las tres cifras que quedan, incluido el cero. Obtenemos $2\cdot3\cdot3=18$ números.

El total es $12+18=30$. Sumamos porque un número no puede pertenecer a ambos casos, y porque todo número par permitido termina en uno de los tres dígitos que consideramos.

¿Ves por qué $3\cdot4\cdot3$ habría fallado? Asigna cuatro centenas a todas las terminaciones. En los grupos que terminan en dos o cuatro, eso incluye números que empiezan con cero.

## Ya podemos ponerles nombre

El principio multiplicativo cuenta construcciones por etapas: si hay $a$ elecciones iniciales y cada una admite exactamente $b$ continuaciones, hay $ab$ resultados. Puedes repetir el argumento para más etapas. Cada construcción debe identificar un resultado único y producirlo una sola vez.

El principio aditivo cuenta casos separados: si todo resultado pertenece a exactamente uno de varios grupos, sumamos los tamaños de esos grupos. «Exactamente uno» evita tanto los olvidos como las repeticiones.

No son dos recetas rivales. En el ejemplo de los números multiplicamos dentro de cada caso y sumamos al reunirlos.

## Prueba si puedes elegir el camino

1. El teclado de tres símbolos acepta claves de uno o dos lugares, con repetición. ¿Cuántas acepta? ¿Por qué aquí aparece una suma?

2. Con $0,1,2,3,4$, cuenta los números impares de tres cifras distintas. ¿Necesitas separar las dos terminaciones impares?

3. Una clave tiene cuatro lugares, usa solo A y B, y debe contener al menos una B. ¿Puedes contar primero algo más sencillo y quitar lo que sobra?

:::reveal Pistas para los tres retos
1. Separa por longitud: una clave no puede tener a la vez uno y dos lugares.

2. Prueba qué cifras quedan cuando fijas uno y cuando fijas tres al final.

3. ¿Cuántas claves quedan prohibidas por no tener ninguna B?
:::

:::reveal Soluciones razonadas
1. Hay $3+3^2=12$. Los grupos de distinta longitud no se cruzan.

2. Hay dos unidades posibles; en ambos casos quedan tres centenas no nulas y tres decenas: $2\cdot3\cdot3=18$. Aquí sí sirve un único producto.

3. Hay $2^4=16$ claves sin restricción. Solo AAAA no contiene B; por eso quedan $16-1=15$. Restar funciona porque identificamos exactamente las claves prohibidas.
:::

## Una pregunta para llevarte

Cuando te atasques contando, no empieces buscando una fórmula. Describe un resultado concreto y pregúntate: ¿cómo lo construyo?, ¿en qué grupo cae?, ¿podría contarlo dos veces? Una lista pequeña puede darte la organización de un problema grande.

[[practice]]` },
  'permutaciones-y-combinaciones': {
    model: 'A', label: 'A2 · Investigar un sobreconteo', engagement: 10,
    content: String.raw`## Dos respuestas para una misma selección

Un club tiene cinco cortometrajes diferentes, A, B, C, D y E. Quiere elegir tres para una función. Inés cuenta $5\cdot4\cdot3=60$. Leo escribe diez grupos y dice que hay diez posibilidades. ¿Quién se equivocó?

Nos falta una pregunta: ¿están eligiendo qué películas se proyectan o también el orden de la función? No la contestes con una fórmula. Compara A–B–C y C–A–B: tienen las mismas películas, pero empiezan de manera distinta.

Si la función incluye un horario, son programas diferentes. Si solo estamos enviando una lista de títulos al encargado, son la misma selección. Los dos conteos pueden ser correctos; están contando objetos distintos.

## Primero, construyamos un programa

Para la primera proyección hay cinco opciones. Elegida esa película, quedan cuatro para la segunda y tres para la tercera. Cada programa de tres películas distintas se construye de una única forma. Así se justifican los sesenta programas de Inés.

Ahora imagina que proyectamos las cinco. Al llenar cada lugar nos queda una película menos: $5\cdot4\cdot3\cdot2\cdot1=120$. Esta operación aparece tanto que le damos una abreviatura: $5!$, que se lee «cinco factorial».

Una ordenación de todos los objetos distintos se llama permutación. Para $n$ objetos, el mismo razonamiento da $n!$. La notación resume lo que hicimos; no sustituye la explicación de por qué cada lugar tiene esa cantidad de opciones.

### Comprueba con algo que puedas ver completo

Escribe los programas que usan exactamente A, B y C. Hay seis. Agrúpalos según la película que va primero. Luego explica por qué no hay un séptimo.

:::reveal Ver los seis programas
ABC, ACB; BAC, BCA; CAB, CBA. Hay tres comienzos posibles y dos órdenes para las películas restantes: $3\cdot2=6$. Todo programa tiene uno de esos comienzos y uno de esos finales.
:::

## ¿Adónde fueron a parar cincuenta programas?

Volvamos a la selección sin horario. Toma los seis programas anteriores y borra el orden. Los seis se convierten en el mismo grupo: A, B y C. Ahora haz lo mismo con A, B y D: también produce seis programas.

No ocurre solo con nuestros ejemplos. Cualquier grupo de tres películas distintas tiene exactamente $3!=6$ órdenes. Podemos repartir los sesenta programas en paquetes de seis, uno por selección. Por eso Leo obtiene $60/6=10$ grupos.

Esta es la razón para dividir. No dividimos «porque el orden no importa» sin más: dividimos porque sabemos cuántas veces apareció cada resultado. Si distintos resultados aparecieran cantidades distintas de veces, una división uniforme no arreglaría el conteo.

### Ahora tú: cambia la cantidad elegida

¿Cuántas selecciones de dos películas hay entre las cinco? Cuenta primero los programas de dos y averigua cuántos programas corresponden a cada selección.

:::reveal Comprobar la selección de dos
Hay $5\cdot4=20$ programas. Cada pareja aparece dos veces, AB y BA, por ejemplo. Son $20/2=10$ selecciones. Coinciden con las selecciones de tres: escoger dos que quedan fuera determina las tres que entran.
:::

## La fórmula llega después de la explicación

Una selección de $k$ objetos entre $n$ distintos, sin atender al orden, se llama combinación. Su cantidad se escribe $\binom nk$.

Para $1\le k\le n$, contamos primero listas: $n(n-1)\cdots(n-k+1)$. Cada selección aparece $k!$ veces, por los posibles órdenes de sus miembros. Luego

$$\binom nk=\frac{n(n-1)\cdots(n-k+1)}{k!}=\frac{n!}{k!(n-k)!}.$$

La elección de cero objetos también tiene sentido: hay una sola, la selección vacía. Adoptamos $0!=1$, lo que permite que la fórmula incluya $k=0$ y $k=n$.

Si olvidas la fórmula, recupera las dos preguntas: ¿cuántas listas puedo construir?, ¿cuántas listas representan la misma selección?

## Una condición que cambia cómo conviene mirar

Los cinco cortometrajes se proyectarán todos, pero A y B deben ir consecutivos. Podríamos escribir 120 programas y tachar muchos. Probemos algo más pequeño: ata A y B como un bloque.

Ahora ordenas cuatro unidades: el bloque, C, D y E. Hay $4!=24$ órdenes. Dentro del bloque puedes poner AB o BA. En total, $24\cdot2=48$ programas.

La justificación tiene dos sentidos. Todo programa que construimos cumple la condición. Y cualquier programa válido puede comprimirse en un único bloque, así que aparece exactamente una vez. Estas dos comprobaciones hacen confiable el truco.

¿Qué pasa si A y B deben quedar separados? Ya contamos los que están juntos. De los $120$ programas quitamos esos $48$: quedan $72$.

## Tres preguntas sin el nombre de la herramienta

1. Entre seis películas elige tres, pero A debe estar incluida. Solo importa la selección, no el horario.

2. Cinco películas distintas van en fila. A debe aparecer antes que B, aunque no necesariamente inmediatamente antes. ¿Por qué «hacer un bloque» ya no resuelve este problema?

3. Forma grupos de tres películas entre siete. A y B no pueden pertenecer al mismo grupo. Encuentra una manera de contar y otra de comprobarla.

:::reveal Una pista por pregunta
1. Una elección ya está hecha.

2. Empareja cada programa con el que intercambia los lugares de A y B.

3. Cuenta todos y quita los grupos prohibidos; después separa según cuántas películas aparecen de la pareja A, B.
:::

:::reveal Comparar argumentos
1. Faltan dos películas entre las otras cinco: $\binom52=10$.

2. El intercambio empareja cada programa con A antes de B con uno que tiene B antes de A, sin programas fijos. La mitad de $5!=120$ es $60$. Un bloque contaría solo los casos consecutivos.

3. Son $\binom73-5=35-5=30$: para un grupo prohibido solo falta elegir la tercera película entre las otras cinco. Otra cuenta es $\binom53+2\binom52=10+20=30$: ninguna de A, B, o exactamente una.
:::

## Antes de abrir el siguiente problema

Describe con tus palabras qué hace diferentes a dos respuestas. Después decide si puedes construirlas por lugares, agrupar repeticiones, comprimir un bloque o quitar los casos prohibidos. Aprender combinatoria también es aprender a cambiar lo que estás contando sin perder de vista la pregunta original.

[[practice]]` },
  'induccion-matematica': {
    model: 'A', label: 'A3 · Descubrir el paso que se repite', engagement: 8,
    content: String.raw`## Construye una cadena y mira qué cambia

Dibuja un cuadrado con cuatro palitos. A su derecha añade otro cuadrado del mismo tamaño, compartiendo un lado. Continúa formando una fila de cuadrados, sin superponer palitos. ¿Cuántos palitos necesitas para una fila de cien cuadrados?

No hace falta dibujar los cien. Cuenta las primeras filas: un cuadrado usa cuatro palitos; dos usan siete; tres usan diez. Cada cuadrado nuevo comparte un lado con el último y añade otros tres. ¿Qué expresión propondrías para una fila de $n$ cuadrados?

Una posibilidad es $4+3(n-1)$: cuatro para comenzar y tres por cada cuadrado restante. Simplificando, $3n+1$. Esta explicación ya prueba la fórmula para la construcción descrita. Vamos a usarla para aprender otra forma de demostrar, útil cuando una construcción se entiende mejor por etapas.

## Saber muchos casos no es saber todos

Podríamos verificar la fórmula para cien, mil o un millón de valores. Todavía faltan infinitos. Lo decisivo será demostrar una regla que nos permita avanzar desde cualquier fila a la siguiente.

Imagina que alguien entrega una fila de $k$ cuadrados y certifica que usa $3k+1$ palitos. No sabes cuánto vale $k$. ¿Puedes usar ese dato para justificar que la fila de $k+1$ cuadrados usa $3(k+1)+1$?

:::reveal Ver el paso, antes de ponerle nombre
Añadir un cuadrado aporta tres palitos. La nueva cantidad es $(3k+1)+3=3k+4=3(k+1)+1$. Esto vale para cualquier entero $k\ge1$. No hemos probado solo un ejemplo más: hemos probado una implicación que funciona en todas las etapas.
:::

Pero una regla para continuar no sirve si nunca comenzamos. Debemos comprobar también la fila de un cuadrado: usa $4=3\cdot1+1$. Ahora sabemos el primer caso y sabemos pasar de cualquier caso al siguiente.

## Escribir el argumento completo

Llamemos $P(n)$ a la afirmación «una fila de $n$ cuadrados construida de esta manera usa $3n+1$ palitos», para enteros $n\ge1$.

Base: $P(1)$ es cierta, porque un cuadrado usa cuatro palitos.

Hipótesis de inducción: fijamos un entero arbitrario $k\ge1$ y suponemos $P(k)$, es decir, que la fila de $k$ cuadrados usa $3k+1$ palitos.

Paso: al añadir el siguiente cuadrado incorporamos tres palitos. Por la hipótesis, el total es $(3k+1)+3=3(k+1)+1$. Hemos probado $P(k+1)$ a partir de $P(k)$.

Conclusión: por inducción, $P(n)$ es cierta para todo entero $n\ge1$.

¿Por qué no es una trampa suponer lo que queremos demostrar? Porque en el paso no afirmamos que todos los casos sean ciertos. Probamos la condición «si este caso es cierto, el siguiente también». La base permite usar esa condición para alcanzar cualquier entero posterior en una cantidad finita de pasos.

## Ahora quita el dibujo

Queremos demostrar que $8^n-1$ es divisible entre siete para todo entero $n\ge1$. El primer caso es fácil: $8-1=7$. La dificultad está en conectar el caso siguiente con el que suponemos conocido.

Si sabemos algo de $8^k-1$, necesitamos que esa expresión aparezca dentro de $8^{k+1}-1$. Escribe $8^{k+1}=8\cdot8^k$. ¿Qué debes sumar para reconstruir $8(8^k-1)$?

:::reveal Desarrollar la conexión
Tenemos $8^{k+1}-1=8(8^k-1)+7$. Bajo la hipótesis $8^k-1=7t$ para algún entero $t$, resulta $8^{k+1}-1=56t+7=7(8t+1)$. Es múltiplo de siete. Junto con el caso $n=1$, esto completa la inducción.
:::

El trabajo interesante fue encontrar esa reescritura. En una suma, puedes separar el último término. En una potencia, puedes sacar un factor. En una figura, puedes retirar una pieza. En los tres casos buscas dentro del problema nuevo una copia del anterior.

## Dos argumentos que parecen avanzar, pero no llegan

«Si $n$ es par, $n+2$ también es par; como dos es par, todos los enteros desde dos son pares». ¿Dónde está el salto falso?

:::reveal Diagnosticar el salto
La regla avanza de dos en dos. Desde dos alcanza $2,4,6,\ldots$, pero nunca tres. La conclusión correcta sería que todos los enteros de la forma $2+2t$, con $t\ge0$, son pares. Una inducción tiene que alcanzar todo el dominio que anuncia.
:::

Otro intento: «Si $2^k>2^{k+1}$, al multiplicar por dos obtenemos $2^{k+1}>2^{k+2}$; por lo tanto siempre se cumple». La implicación es válida, pero no existe una base verdadera. Una escalera con pasos conectados todavía necesita un punto de partida.

## Inténtalo con menos ayuda

1. Demuestra que $2+5+8+\cdots+(3n-1)=n(3n+1)/2$ para todo entero $n\ge1$. Antes de calcular, escribe exactamente el término que se añade al pasar de $n=k$ a $n=k+1$.

2. Demuestra $3^n\ge2n+1$ para enteros $n\ge0$. En el paso tendrás una cota $6k+3$. ¿Por qué basta?

3. Una fila de $n$ triángulos se construye añadiendo cada triángulo con exactamente un lado compartido y dos lados nuevos. Encuentra y demuestra la cantidad de palitos. Explica qué hipótesis geométrica estás usando.

:::reveal Pistas
1. El término nuevo es $3k+2$, no $3k-1$.

2. Compara $6k+3$ con $2(k+1)+1$.

3. Empieza con tres y pregunta cuánto añade cada paso; no supongas que cualquier dibujo de triángulos tiene esa propiedad.
:::

:::reveal Soluciones para revisar tu prueba
1. Para $n=1$ ambos lados valen dos. Suponiendo la fórmula para $k$, la suma siguiente vale $k(3k+1)/2+(3k+2)=(3k^2+7k+4)/2=(k+1)(3k+4)/2$, como queríamos.

2. La base es $1\ge1$. Si $3^k\ge2k+1$, entonces $3^{k+1}\ge6k+3\ge2k+3=2(k+1)+1$, pues $k\ge0$.

3. La fórmula es $2n+1$: base tres y paso $(2k+1)+2=2(k+1)+1$. Requiere exactamente dos palitos nuevos por triángulo; otra forma de pegar las piezas podría tener un conteo distinto.
:::

## Cuándo buscar esta herramienta

No todo problema con una letra $n$ pide inducción. Busca una manera útil de pasar entre tamaños consecutivos y comprueba que el caso pequeño realmente ayude. La fórmula de los palitos tenía también una demostración directa. Poder comparar ambas explicaciones es más valioso que obligar a todos los problemas a seguir el mismo método.

[[practice]]` },
  'primos-y-factorizacion': {
    model: 'B', label: 'B1 · Estructura OMMBC: números', engagement: 9,
    source: 'https://ommbc.org/sitio/Material/Numeros/N1_TFA.pdf',
    content: String.raw`Vamos a mirar los enteros como productos. Primero veremos por qué desarmar un número puede revelar lo que una división larga oculta; después conectaremos esa mirada con los residuos. Necesitas multiplicaciones, divisiones y el significado de una potencia. Ten una hoja a la mano: habrá preguntas pequeñas durante el recorrido.

## 1. Un pequeño preámbulo

Tienes treinta fichas y quieres acomodarlas en un rectángulo, sin huecos. Puedes hacer dos filas de quince, tres de diez o cinco de seis. Si tuvieras treinta y una fichas, la situación cambiaría: solo podrías hacer una fila de treinta y una, o girar ese mismo rectángulo. ¿Cómo justificarías que no hay otra posibilidad?

Un entero positivo mayor que uno es primo si sus únicos divisores positivos son uno y él mismo. Si tiene algún otro divisor, es compuesto. El uno queda fuera de ambas categorías: tiene un solo divisor positivo.

Para comprobar que $31$ es primo no necesitamos probar todos los números menores que él. Si $31=ab$ con $1<a\le b$, entonces $a^2\le31$, así que $a\le\sqrt{31}<6$. Basta revisar los primos dos, tres y cinco; ninguno divide a $31$. Cualquier divisor compuesto pequeño tendría a su vez un divisor primo pequeño.

Prueba ahora con $49$. No te detengas antes de siete: la igualdad en el límite también cuenta.

## 2. El Teorema Fundamental

Volvamos a treinta. Una persona escribe $30=3\cdot10=3\cdot2\cdot5$. Otra comienza con $30=5\cdot6=5\cdot2\cdot3$. Las rutas son diferentes, pero ambas terminan con los mismos primos.

El teorema fundamental de la aritmética afirma que todo entero mayor que uno es producto de primos y que, salvo el orden de los factores, esa descomposición es única. Repeticiones sí puede haber: $72=2^3\cdot3^2$ tiene tres factores dos y dos factores tres.

¿Por qué siempre llegamos a primos? Si un factor no es primo, lo separamos en factores mayores que uno y menores que él. Ese descenso no puede continuar indefinidamente entre enteros positivos. La unicidad requiere un argumento adicional, el lema de Euclides: si un primo divide un producto, divide alguno de sus factores. Al comparar dos descomposiciones, ese lema permite emparejar un primo de la primera con uno igual de la segunda, cancelarlo y repetir. Usamos aquí ese lema como resultado previo; probarlo con Bézout será otra conexión útil.

Leer un producto sin expandirlo.

Piensa en $N=2^4\cdot3^2\cdot7$. ¿Es divisible entre $18$? ¿Entre $32$? No calcules $N$ todavía.

Para $18=2\cdot3^2$ tenemos todos los factores necesarios, así que sí. Para $32=2^5$ falta un factor dos, así que no. Los divisores positivos de $N$ son exactamente los productos $2^a3^b7^c$ con $0\le a\le4$, $0\le b\le2$ y $0\le c\le1$.

¿Y qué habría que multiplicar por $N$ para obtener un cuadrado? Al elevar un entero al cuadrado se duplican todos sus exponentes primos. Por tanto, un entero positivo es cuadrado si y solo si esos exponentes son pares. En $N$ solo el exponente de siete es impar. El menor multiplicador positivo es siete. Más generalmente, los multiplicadores que sirven son $7t^2$, con $t$ entero positivo.

## 3. A caminar entre residuos

La factorización resulta muy útil cuando conocemos los factores. Si el número es enorme y solo queremos saber qué sobra al dividir, quizá convenga guardar menos información.

Repartir $53$ fichas en grupos de ocho produce seis grupos y sobran cinco: $53=8\cdot6+5$. Esa escritura separa una parte que sabemos divisible entre ocho de otra pequeña. En general, para un entero $a$ y un divisor positivo $m$, escribimos $a=mq+r$, donde $q$ es entero y $0\le r<m$.

Si juntas dos cantidades que dejan cinco y seis fichas sueltas al dividir entre ocho, quedan once fichas sueltas antes de reagrupar. Puedes formar un grupo más: el residuo final es tres, no once. Los residuos se pueden combinar, pero hay que volver a reducir cuando salimos del intervalo permitido.

### 3.1. La notación desarrollada

El número $243$ significa $2\cdot100+4\cdot10+3$. Para dividir entre nueve, cada diez deja uno y cada cien también. Así, $243$ deja el mismo residuo que $2+4+3=9$: es divisible entre nueve. La escritura por posiciones conecta cifras y divisibilidad sin tener que factorizar primero todo el número.

No confundas ambas miradas. Saber las cifras ayuda a obtener residuos; conocer la factorización permite describir todos los divisores. Conviene elegir según lo que el problema pida.

## 4. Ejercicios

1. Decide si $91$ es primo y justifica hasta dónde necesitas probar divisores.

2. Para $N=2^4\cdot3^2\cdot7$, decide si $24$, $63$ y $49$ son divisores. Después cuenta todos sus divisores positivos sin escribirlos uno por uno.

3. Encuentra el menor entero positivo $t$ para que $108t$ sea un cuadrado.

4. Dos enteros dejan residuos seis y cuatro al dividir entre siete. ¿Qué residuo deja su suma? ¿Y su producto?

:::reveal Revisar los ejercicios
1. No es primo: $91=7\cdot13$. Basta probar primos hasta $\sqrt{91}<10$.

2. Los tres números son $2^3\cdot3$, $3^2\cdot7$ y $7^2$: los dos primeros dividen a $N$ y el tercero no. Hay $5\cdot3\cdot2=30$ divisores, una elección por cada terna de exponentes.

3. $108=2^2\cdot3^3$; falta un factor tres, así que $t=3$.

4. La suma deja tres y el producto deja tres, porque diez y veinticuatro dejan tres al dividir entre siete.
:::

## 5. Agregados culturales

La descomposición en primos también se llama factorización prima. Los exponentes registran multiplicidad: conocer qué primos aparecen no basta para saber si un número divide a otro.

Hay una conexión curiosa entre cuadrados y divisores. Los divisores de un entero positivo se emparejan como $d$ y $N/d$. Solo queda un divisor sin pareja distinta cuando $d^2=N$. Así, un entero positivo tiene una cantidad impar de divisores precisamente cuando es cuadrado.

## 6. Lista de problemas

1. Encuentra todos los enteros positivos que tienen exactamente tres divisores positivos. No basta dar ejemplos: justifica por qué no hay otros.

2. Determina todos los enteros positivos $t$ para los que $72t$ es un cuadrado. Explica por qué tu descripción incluye todas las posibilidades.

3. Si $p$ es primo y divide a $x^2$, demuestra que divide a $x$. Usa esa idea para probar que $\sqrt{5}$ no es racional.

:::reveal Pistas para comenzar
1. Escribe la cantidad de divisores como producto de «exponente más uno».

2. Examina la paridad de cada exponente en $72=2^3\cdot3^2$.

3. Supón una fracción reducida cuyo cuadrado sea cinco; busca un divisor común del numerador y denominador.
:::

:::reveal Argumentos completos
1. Son exactamente $p^2$, con $p$ primo. Si $N=\prod p_i^{a_i}$, la cantidad de divisores es $\prod(a_i+1)$. Para que valga tres, hay un solo factor y debe ser tres; luego un único primo con exponente dos. El uno tiene solo un divisor.

2. Son $t=2s^2$, con $s\ge1$ entero: el exponente de dos en $t$ debe ser impar y todos los demás exponentes, pares. Entonces $72t=(12s)^2$.

3. Por unicidad de factorización, todo primo de $x^2$ ya aparece en $x$. Si $\sqrt5=a/b$ en términos positivos reducidos, $a^2=5b^2$ implica $5\mid a$. Escribe $a=5c$ y obtén $b^2=5c^2$, de donde $5\mid b$. Contradice que la fracción estuviera reducida.
:::

[[practice]]` },
  'aritmetica-modular': {
    model: 'B', label: 'B2 · Estructura OMMBC: congruencias', engagement: 8,
    source: 'https://ommbc.org/sitio/Material/Numeros/N2_ModulosDivisibilidad.pdf',
    content: String.raw`A veces queremos conocer un número completo. Otras veces basta saber en qué casilla termina, qué cifra tiene al final o si una división deja algo. En esta sesión aprenderemos a conservar solo esa información, operar con ella y reconocer cuándo no alcanza. Necesitarás divisibilidad y la escritura $a=mq+r$.

## 1. Un pequeño preámbulo

Una cinta lleva un patrón que se repite cada seis posiciones: A, B, C, D, E, F. Numeramos desde cero, así que A ocupa las posiciones $0,6,12,\ldots$. Las posiciones ocho y veinte tienen la misma letra. ¿Cómo puedes saberlo sin dibujar la cinta completa?

Ambas dejan residuo dos al dividir entre seis. También puedes observar que su diferencia, doce, es un múltiplo de seis: pasar de una posición a otra equivale a recorrer patrones completos.

Estas son dos maneras de expresar una misma relación. Para enteros $a,b$ y un módulo entero $m\ge2$, escribimos $a\equiv b\pmod m$ cuando $m$ divide a $a-b$. Equivale a que $a$ y $b$ tengan el mismo residuo al dividir entre $m$.

Para verlo, escribe $a=mq+r$ y $b=ms+t$, con $0\le r,t<m$. Su diferencia es $m(q-s)+(r-t)$. Si es múltiplo de $m$, también lo es $r-t$; como $-m<r-t<m$, necesariamente $r=t$. El regreso es inmediato: si los residuos coinciden, la diferencia es $m(q-s)$.

## 2. Módulos y operaciones modulares

En la cinta, avanzar catorce posiciones tiene el mismo efecto que avanzar dos. Avanzar treinta y tres tiene el mismo efecto que avanzar tres. Juntos equivalen a avanzar cinco: $14+33\equiv2+3\equiv5\pmod6$.

No estamos diciendo que cuarenta y siete sea igual a cinco. Decimos que son indistinguibles para la pregunta «¿en qué posición del patrón termino?».

### 2.1. Qué operaciones conservan la información

Si cambias un número por otro que difiere en un múltiplo de $m$, puedes sumar, restar o multiplicar sin alterar el residuo final. Por ejemplo, si $a=b+mu$ y $c=d+mv$, entonces $a+c=b+d+m(u+v)$ y $ac=bd+m(bv+du+muv)$. Las diferencias son múltiplos de $m$.

Por repetir la multiplicación, también puedes elevar a cualquier potencia entera no negativa. Así, para hallar el residuo de $29^2+17\cdot23$ módulo cinco, reemplazamos por $(-1)^2+2\cdot3=7\equiv2\pmod5$. Usar $-1$ en lugar de cuatro simplifica la cuenta. El representante puede ser negativo; el residuo convencional final estará entre cero y cuatro.

### 2.1.1. Sumar y restar

De $x\equiv4\pmod7$ obtenemos $x+5\equiv2\pmod7$ y $x-6\equiv5\pmod7$. En el segundo cálculo aparece primero $-2$, y sumamos siete para dar el representante entre cero y seis.

### 2.1.2. Multiplicar

Si $x\equiv4\pmod7$ y $y\equiv6\pmod7$, entonces $xy\equiv24\equiv3\pmod7$. No necesitas conocer $x$ ni $y$: esa parte de la información ya basta.

### 2.1.3. Elevar a potencias

Como $4\equiv-1\pmod5$, tenemos $4^{100}\equiv1$ y $4^{101}\equiv-1\equiv4\pmod5$. La paridad del exponente decide el signo. Antes de hacer una tabla larga, busca un representante cómodo.

### 2.1.4. Cuidado al cancelar

Sabemos que $2\cdot1\equiv2\cdot4\pmod6$, pero $1\not\equiv4\pmod6$. Cancelar dos manteniendo el módulo seis daría una afirmación falsa.

La cancelación por $c$ sí está garantizada si $\gcd(c,m)=1$: por Bézout existen enteros $u,v$ con $uc+vm=1$. Si $m\mid c(a-b)$, al multiplicar esa identidad por $a-b$ obtenemos que $m\mid(a-b)$. Cuando el MCD es mayor que uno, puedes necesitar cambiar el módulo. Aquí no cancelaremos sin justificarlo; la lección de inversos desarrolla ese caso.

### 2.2. Convertir una búsqueda infinita en unos pocos casos

¿Puede $x^2+2$ ser divisible entre cinco? Todo entero deja uno de los residuos $0,1,2,3,4$. Sus cuadrados dejan, respectivamente, $0,1,4,4,1$. Al sumar dos aparecen $2,3,1,1,3$: nunca cero. Ningún entero sirve.

La lista es una prueba porque cubre todos los residuos, no porque probamos cinco números al azar. Cada entero comparte residuo con uno de esos representantes y las operaciones preservan la congruencia.

### 2.3. Divisibilidad de expresiones con potencias

Si $a,b$ son enteros positivos, entonces $a\equiv-b\pmod{a+b}$. Al elevar a un exponente impar $r$, obtenemos $a^r\equiv-b^r$, así que $a+b$ divide a $a^r+b^r$. Si $r$ es par, obtenemos $a^r\equiv b^r$: ahora la expresión divisible es $a^r-b^r$.

No intercambies suma y diferencia sin revisar la paridad. Para $a=2$, $b=1$, la suma $2^2+1^2=5$ no es divisible entre tres.

### 2.4. Reunir lo que podemos usar

Trabaja siempre con un módulo fijo. Puedes cambiar representantes, sumar, restar, multiplicar y elevar a potencias enteras no negativas. Las tablas permiten agotar posibilidades. Dividir necesita una justificación adicional. Ninguna congruencia aislada determina el número completo: determina una clase de números separados por múltiplos del módulo.

## 3. Ejercicios

1. Da el residuo de $-19$ al dividir entre seis.

2. Encuentra el residuo de $38\cdot52+11$ módulo siete sin multiplicar los números grandes.

3. Encuentra la última cifra de $9^{57}$.

4. Resuelve $3x\equiv1\pmod5$ probando los cinco residuos posibles.

:::reveal Comprobaciones
1. Es cinco, porque $-19=6(-4)+5$.

2. Es seis: $3\cdot3+4=13\equiv6\pmod7$.

3. Es nueve: $9\equiv-1\pmod{10}$ y el exponente es impar.

4. Solo $x\equiv2\pmod5$ funciona: los residuos de $3x$ son $0,3,1,4,2$. Todos los enteros $x=5t+2$, con $t$ entero, son soluciones.
:::

## 4. Agregados culturales

La paridad es el caso módulo dos. «Última cifra» pide módulo diez; «últimas dos cifras», módulo cien. En muchos problemas, elegir el módulo ya es una parte importante de la solución.

Una obstrucción modular puede demostrar que algo es imposible. Pasar esa prueba no garantiza que sea posible: $21$ deja uno módulo cuatro, igual que algunos cuadrados, pero está entre $4^2$ y $5^2$ y no es cuadrado.

## 5. Lista de problemas

1. Demuestra que $n^2+n+1$ nunca es par, para todo entero $n$.

2. Encuentra todos los enteros $n$ para los que $n^2+1$ es divisible entre cinco.

3. Demuestra que $6^{2r}-1$ es divisible entre $35$ para todo entero $r\ge1$.

:::reveal Pistas
1. Trabaja módulo dos, o mira dos consecutivos.

2. Reutiliza los residuos de cuadrados, pero ahora busca cuatro.

3. Puedes trabajar directamente módulo treinta y cinco si calculas primero $6^2$.
:::

:::reveal Soluciones
1. Si $n$ es par, $n^2+n+1\equiv1\pmod2$; si es impar, queda $1+1+1\equiv1$.

2. Necesitamos $n^2\equiv4\pmod5$. La tabla da exactamente $n\equiv2$ o $n\equiv3\pmod5$, y ambos casos satisfacen la condición.

3. $6^2=36\equiv1\pmod{35}$. Luego $6^{2r}=(6^2)^r\equiv1$, así que la diferencia es divisible entre treinta y cinco.
:::

[[practice]]` },
  'principio-de-casillas': {
    model: 'B', label: 'B3 · Estructura OMMBC: casillas', engagement: 10,
    source: 'https://ommbc.org/sitio/Material/Combinatoria/C3_Casillas.pdf',
    content: String.raw`Hoy vamos a asegurar que algo ocurre aunque no sepamos exactamente dónde. La cuenta será pequeña; el trabajo estará en encontrar una clasificación que obligue a dos objetos a compartir una propiedad. Necesitas sumar, multiplicar y distinguir «puede ocurrir» de «tiene que ocurrir».

## 1. Un pequeño preámbulo que abarca toda la teoría

En un taller, cada proyecto recibe una de cuatro etiquetas: dibujo, música, relato o fotografía. Llegan cinco proyectos. Sin conocerlos y sin leer sus etiquetas, ¿puedes asegurar que dos reciben la misma?

Intenta evitarlo. El primero ocupa una categoría; el segundo puede ocupar otra; después de cuatro proyectos, en el mejor caso para evitar repeticiones, todas las categorías tienen uno. El quinto no encuentra una categoría nueva. Tiene que compartir.

No hemos averiguado qué etiqueta se repite. Ni cuáles son los dos proyectos. Hemos probado que alguna repetición existe, incluso en la distribución más desfavorable.

Con $k$ categorías y $k+1$ objetos, ocurre lo mismo: alguna categoría contiene al menos dos objetos. Las categorías son las casillas. Cada objeto debe quedar asignado a exactamente una, y no puede haber objetos sin clasificar.

Ahora queremos tres en una misma categoría.

Con cuatro categorías, ocho proyectos todavía pueden distribuirse como $2,2,2,2$. No podemos garantizar tres. Pero con nueve sí: si ninguna categoría tuviera tres, todas tendrían como máximo dos y habría a lo más ocho proyectos. Contradicción.

Acabamos de demostrar una versión más general: si repartimos $kr+1$ objetos entre $k$ casillas, alguna contiene al menos $r+1$. Para enteros positivos $k,r$, la cifra extra es decisiva: con $kr$ objetos todavía cabe una distribución de exactamente $r$ por casilla.

No memorices solo el umbral. Conserva la pregunta que lo produce: «si ninguna casilla llegara a lo que busco, ¿cuántos objetos podrían caber como máximo?».

### 1.1. Otras formas de casillas

Cinco grupos resolvieron en total cuarenta y dos ejercicios. Alguno resolvió al menos nueve: si todos hubieran resuelto a lo más ocho, el total no superaría cuarenta. También alguno resolvió a lo más ocho, porque cinco grupos con nueve o más sumarían al menos cuarenta y cinco.

La misma idea se expresa mediante el promedio. Entre varios números reales, alguno es al menos su promedio y alguno es a lo más su promedio. Si todos fueran menores, su suma sería menor que el número de datos multiplicado por el promedio, lo cual contradice la definición de promedio. El otro sentido es análogo.

Elegir casillas que digan algo útil.

Con cuatro números enteros, dos tienen diferencia divisible entre tres. Aquí las casillas no vienen dibujadas. Las construimos usando los tres residuos posibles: cero, uno y dos. Cuatro números en tres casillas fuerzan un par con el mismo residuo. Si son $3a+r$ y $3b+r$, su diferencia es $3(a-b)$.

El último paso es indispensable. No basta decir «por casillas»: hay que explicar qué significa caer juntos y por qué eso produce lo pedido. Si hubiéramos clasificado por la cantidad de cifras, compartir casilla no garantizaría una diferencia divisible entre tres.

## 2. Ejercicios

1. Se archivan diecisiete dibujos en cuatro carpetas. ¿Cuántos dibujos puedes garantizar en una misma carpeta? Da una distribución que muestre por qué no puedes garantizar uno más.

2. Quieres garantizar que seis proyectos tengan la misma etiqueta entre cuatro etiquetas disponibles. ¿Cuál es la menor cantidad de proyectos que basta?

3. Se eligen siete enteros. Explica por qué dos tienen diferencia divisible entre seis. No omitas el paso que va del residuo a la diferencia.

4. Entre los números de uno a doce se eligen siete distintos. Demuestra que dos suman trece. ¿Por qué la palabra «distintos» importa?

:::reveal Pistas y comprobaciones de los ejercicios
1. Puedes asegurar cinco. La distribución $5,4,4,4$ impide asegurar seis.

2. Veintiuno: con veinte aún cabe $5,5,5,5$.

3. Hay seis residuos; dos números se escriben $6a+r$ y $6b+r$, y su diferencia es $6(a-b)$.

4. Usa las seis parejas $\{1,12\},\{2,11\},\ldots,\{6,7\}$ como casillas. Siete elecciones distintas ocupan dos lugares de una pareja. Si pudieras repetir el mismo número, ocupar dos veces esa casilla no significaría haber elegido ambos miembros.
:::

## 3. Agregados culturales

También encontrarás este principio bajo los nombres de palomar o pichones. Los objetos no tienen que ser animales ni las casillas cajas físicas: pueden ser residuos, intervalos o patrones de colores.

Una prueba de existencia puede dar mucha información sin señalar un ejemplo concreto. También hay que cuidar el lenguaje: «al menos dos» permite tres o más. Y «alguna casilla» no significa que podamos elegir de antemano cuál será.

## 4. Lista de problemas

1. Trece puntos están en el cuadrado cerrado de lado tres. Demuestra que dos están a distancia a lo más $\sqrt2$. Aclara qué harás con un punto que caiga sobre una línea de tu partición.

2. Diez personas respondieron un cuestionario de tres preguntas, cada una con respuesta sí o no. Demuestra que dos entregaron exactamente el mismo patrón de respuestas.

3. Se eligen siete números distintos entre uno y doce. Demuestra ahora que dos son consecutivos. Compara tus casillas con las del ejercicio sobre suma trece: la conclusión cambió, así que probablemente también deba cambiar la clasificación.

:::reveal Ideas de entrada
1. Divide el cuadrado en nueve cuadrados de lado uno.

2. Cuenta cuántos patrones completos existen.

3. Agrupa los números en parejas consecutivas, sin superposiciones.
:::

:::reveal Soluciones de la lista
1. Asigna cada punto a uno de los nueve cuadrados pequeños que lo contienen, siguiendo una regla fija en las fronteras. Como trece es mayor que nueve, dos quedan en el mismo. La distancia máxima dentro de un cuadrado de lado uno es su diagonal, $\sqrt2$.

2. Hay $2^3=8$ patrones. Diez respuestas en ocho casillas fuerzan dos iguales.

3. Usa $\{1,2\},\{3,4\},\ldots,\{11,12\}$. Dos de las siete elecciones pertenecen a una misma pareja y, por ser distintas, son sus dos miembros.
:::

## 5. Problemas más jarcors

Este reto pide fabricar objetos nuevos antes de elegir casillas. Si todavía no sale, vuelve después: no necesitas resolverlo para comprender el principio.

Se escriben ocho enteros en una fila. Demuestra que hay un bloque no vacío de posiciones consecutivas cuya suma es divisible entre ocho.

:::reveal Primera pista
En vez de clasificar los ocho números por separado, calcula las sumas que se obtienen empezando siempre en la primera posición y terminando en cada una de las posiciones posibles.
:::

:::reveal Segunda pista
Incluye también la suma vacía, que vale cero. Ahora tienes nueve sumas y solo ocho residuos posibles. ¿Qué representa la diferencia de dos de esas sumas?
:::

:::reveal Solución del reto
Sean $S_0=0$ y $S_j=a_1+\cdots+a_j$ para $1\le j\le8$. Dos de las nueve sumas tienen el mismo residuo módulo ocho. Elige sus índices $i<j$. Entonces $S_j-S_i=a_{i+1}+\cdots+a_j$ es divisible entre ocho. El bloque es consecutivo y no vacío porque $i<j$. Aunque dos sumas tengan el mismo valor, el argumento funciona: son objetos distintos por sus índices.
:::

[[practice]]` },
}

// Keep the structural reference attached to the article in database-backed views.
for (const revision of Object.values(THEORY_WRITING_LAB)) {
  if (revision.source) revision.content += `\n\n[[source:${revision.source}]]`
}
