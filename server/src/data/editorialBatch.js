// Original TeacherPeri writing. OMMBC is a pedagogical reference, not a text source.
export const EDITORIAL_BATCH = {
  'principio-aditivo-y-multiplicativo': { engagement: 10, content: String.raw`En un taller vas a fabricar una insignia. Puedes escoger una de tres figuras —estrella, luna o rayo— y pintarla de azul o verde. Antes de buscar una fórmula, intenta dibujar todas las insignias. ¿Cómo te asegurarías de no olvidar ninguna y de no contar dos veces la misma?

IDEAS CLAVE
UN ÁRBOL QUE ORGANIZA LAS DECISIONES
Empieza por la figura. De la estrella salen dos posibilidades: estrella azul y estrella verde. De la luna salen otras dos, y del rayo otras dos. Hay $2+2+2=6$. El producto $3\cdot2$ es una forma breve de escribir esa suma: tres grupos, cada uno con dos resultados.

Lo importante no es que haya dos decisiones, sino que cada elección inicial admita la misma cantidad de continuaciones. Si además colocas la insignia en una de cuatro posiciones de una mochila, cada insignia da cuatro resultados: $3\cdot2\cdot4=24$. Para usar este conteo, figura, color y posición deben identificar un resultado de manera única.

¿Y CUÁNDO SUMAMOS?
Ahora el taller ofrece fabricar una insignia o un llavero, pero solo puedes llevarte uno. Hay seis insignias posibles y cinco llaveros distintos: tienes $6+5=11$ opciones. Los dos grupos no se superponen. Si una opción apareciera en ambos grupos, sumarla dos veces produciría un error.

Estas observaciones reciben los nombres de principio multiplicativo y principio aditivo. Multiplicamos al construir un resultado por etapas con cantidades de continuaciones controladas. Sumamos al separar resultados en casos que no se repiten y que, juntos, cubren todo lo pedido.

EJEMPLO TRABAJADO
CUANDO UNA REGLA CAMBIA EL ÁRBOL
Forma números de dos cifras distintas usando $0,1,2,3$. La primera cifra no puede ser cero: hay tres opciones. Una vez elegida, quedan tres cifras para la segunda. Obtenemos $3\cdot3=9$. Observa que no elegimos de la misma lista en ambas posiciones, aunque por casualidad las cantidades sean iguales.

Ahora pide que el número sea par. Conviene comenzar por la última cifra. Si termina en cero, la primera puede ser $1,2,3$: tres números. Si termina en dos, la primera puede ser uno o tres: dos números. La respuesta es $3+2=5$. Los casos son incompatibles y cubren todas las terminaciones pares disponibles. Un solo producto habría escondido que cambia el número de continuaciones.

ERRORES FRECUENTES
Una multiplicación no se justifica diciendo “hay varias opciones”. Debes explicar qué representa cada factor. Una suma tampoco basta sin aclarar por qué los casos no se cruzan. Un pequeño árbol o una lista ordenada pueden revelar el error antes de hacer cuentas grandes.

PRACTICA
1. Diseñas una señal con cuatro símbolos y tres colores. ¿Cuántas señales hay? Dibuja las ramas de un símbolo antes de calcular.
2. Forma números de tres cifras distintas con $1,2,3,4$. ¿Por qué las cantidades disponibles van disminuyendo?
3. Con $0,1,2,3$, cuenta los números pares de dos cifras si ahora puedes repetir cifras. ¿Qué cambió respecto al ejemplo?

COMPRUEBA TU RAZONAMIENTO
1. Hay $4\cdot3=12$: cada símbolo admite tres colores. 2. Hay $4\cdot3\cdot2=24$: cada posición consume una cifra. 3. Hay $3+3=6$: tanto la terminación cero como la terminación dos admiten tres decenas. En este último caso también funciona $3\cdot2$.

EN RESUMEN
Antes de contar, explica qué hace distintos a dos resultados. Después elige entre construir por decisiones o separar por casos. La fórmula llega al final de esa organización, no al principio.` },
  'permutaciones-y-combinaciones': { engagement: 10, content: String.raw`Cuatro robots —A, B, C y D— van a presentar sus inventos. Solo hay un escenario y deben pasar uno después de otro. El organizador propone el orden A-B-C-D; otra persona prefiere B-A-C-D. Son los mismos robots, pero la presentación cambió. ¿Cuántos programas distintos podemos preparar sin escribir una lista interminable?

IDEAS CLAVE
EL ORDEN SE CONSTRUYE, NO SE ADIVINA
Para abrir la presentación hay cuatro candidatos. Elegido el primero, quedan tres para el segundo lugar. Después quedan dos y, finalmente, uno. Cada secuencia de elecciones da un programa diferente, y todo programa puede construirse así. Por eso hay $4\cdot3\cdot2\cdot1=24$.

Prueba con tres robots: si A empieza, quedan B-C o C-B; lo mismo ocurre cuando empieza B o C. Son seis programas. Este caso pequeño permite ver lo que el producto está contando.

Con $n$ objetos distintos ocurre lo mismo: las opciones disminuyen de $n$ hasta uno. Escribimos ese producto como $n!$ y lo llamamos factorial. Ahora sí podemos nombrar la idea: una permutación es una ordenación de todos los objetos. No hace falta memorizar primero la fórmula; puedes reconstruirla colocando un objeto a la vez.

LA PREGUNTA CAMBIA SI NO HAY PUESTOS
Ahora elegimos dos robots para revisar el escenario. No hay capitán ni suplente: A con B es el mismo equipo que B con A. Si usamos $4\cdot3=12$, hemos contado cada equipo dos veces. Dividimos entre dos y obtenemos seis equipos. Compruébalo: AB, AC, AD, BC, BD y CD.

Para elegir $k$ objetos de $n$, primero cuenta las listas de $k$ objetos distintos: $n(n-1)\cdots(n-k+1)$. Cada grupo de $k$ objetos aparece en exactamente $k!$ órdenes. Al dividir por esa repetición obtenemos $\binom nk=n!/[k!(n-k)!]$, para $0\le k\le n$. Elegir ninguno tiene una sola posibilidad: el grupo vacío; la convención $0!=1$ hace que la fórmula también funcione allí.

EJEMPLO TRABAJADO
DOS ENCARGOS O UN EQUIPO
Entre cinco estudiantes se eligen quien explica y quien toma notas. Son encargos distintos: hay $5\cdot4=20$ asignaciones. Si solo se elige una pareja sin encargos, cada pareja apareció dos veces: hay diez. No cambió la cantidad de estudiantes; cambió qué consideramos un resultado diferente.

DOS ROBOTS QUIEREN PASAR JUNTOS
En la presentación inicial, A y B deben ocupar lugares consecutivos. Trata a esa pareja como un bloque. Hay tres objetos por ordenar: el bloque, C y D. Se ordenan de $3!=6$ maneras. Dentro del bloque caben A-B y B-A, así que hay $6\cdot2=12$ programas. Cada programa válido tiene un único bloque A-B o B-A; no hemos perdido ni repetido programas.

ERRORES FRECUENTES
Preguntar “¿importa el orden?” significa preguntar si intercambiar dos objetos cambia el resultado solicitado. Dividir por $k!$ solo funciona si cada grupo aparece exactamente ese número de veces. Si los objetos no son distintos, o hay restricciones especiales, vuelve al razonamiento: la fórmula básica puede dejar de servir.

PRACTICA
1. Ordena cinco libros distintos. ¿Cuántas opciones hay para los dos primeros lugares? ¿Y para todos?
2. De seis estudiantes elige un equipo de tres sin cargos. Explica por qué cada equipo aparece seis veces al contar listas ordenadas.
3. Ordena cinco libros distintos si dos libros concretos deben quedar juntos. ¿Por qué el bloque puede tener dos órdenes internos?

COMPRUEBA TU RAZONAMIENTO
1. Los primeros lugares admiten $5\cdot4=20$ posibilidades; todos los lugares, $5!=120$. 2. Las listas son $6\cdot5\cdot4=120$; cada equipo tiene $3!=6$ órdenes, así que hay veinte equipos. 3. Ordena cuatro objetos contando el bloque y luego su interior: $4!\cdot2=48$.

EN RESUMEN
Define primero el resultado: ¿una fila, cargos distintos o un grupo? Construye las opciones paso a paso. Si borras el orden, identifica exactamente cuántas veces habías contado cada grupo. Esa explicación vale más que acertar una fórmula por su nombre.` },
  'induccion-matematica': { engagement: 8, content: String.raw`Construyes una escalera con fichas: la primera fila tiene una, la segunda dos y la tercera tres. Con cuatro filas usas diez fichas. Con cinco usas quince. Alguien afirma que con $n$ filas siempre se necesitan $n(n+1)/2$. Comprobar diez tamaños da confianza, pero ¿qué impide que el tamaño once falle?

IDEAS CLAVE
NO COMPRUEBES CADA ESCALERA: ESTUDIA CÓMO CRECE
Entre una escalera de $n$ filas y la siguiente solo hay una novedad: añadimos una fila con $n+1$ fichas. Esa conexión permite transformar información de un tamaño en información del siguiente. La inducción aprovecha esta estructura; no consiste en suponer que todo es cierto.

Llamemos $P(n)$ a la afirmación $1+2+\cdots+n=n(n+1)/2$, para enteros $n\ge1$. Hay dos tareas. Primero comprobamos $P(1)$. Después demostramos que para cualquier entero $k\ge1$, si $P(k)$ es cierta, entonces $P(k+1)$ también lo es. La primera tarea proporciona un punto de partida y la segunda una regla que nunca se rompe.

EJEMPLO TRABAJADO
LA ESCALERA COMPLETA
Base: para $n=1$, ambos lados valen uno.

Paso: fija un entero arbitrario $k\ge1$ y supone, solo para este paso, que $1+\cdots+k=k(k+1)/2$. Esta es la hipótesis inductiva. Queremos probar que $1+\cdots+k+(k+1)=(k+1)(k+2)/2$.

Agrupa las primeras $k$ filas y aplica la hipótesis: $1+\cdots+k+(k+1)=k(k+1)/2+(k+1)=(k+1)(k+2)/2$. La fórmula del siguiente tamaño apareció al añadir la fila nueva, exactamente como en la construcción. Como hay base y cada caso transmite la propiedad al siguiente, la fórmula vale para todo entero $n\ge1$.

OTRA CONEXIÓN: CUÁNTOS SUBCONJUNTOS HAY
Un conjunto vacío tiene un subconjunto: él mismo. Si un conjunto de $k$ elementos tiene $2^k$ subconjuntos, añade un elemento nuevo $x$. Cada subconjunto anterior produce dos: uno sin $x$ y otro con $x$. Son diferentes y todo subconjunto nuevo pertenece a uno de esos dos tipos. Por tanto hay $2\cdot2^k=2^{k+1}$. Con base $n=0$, queda demostrado que un conjunto de $n$ elementos tiene $2^n$ subconjuntos. Aquí la transición es una clasificación, no una manipulación algebraica.

ERRORES FRECUENTES
Probar algunos casos no garantiza todos. Suponer $P(k+1)$ sería asumir precisamente lo que falta demostrar. Escribe por separado la hipótesis y la meta. Tampoco olvides dónde comienza el argumento: una transición correcta sin base no inicia nada. Si la transición requiere $k\ge4$, una base en uno no salva los tres saltos faltantes.

PRACTICA
1. Dibuja un cuadrado de lado uno y amplíalo a lado dos, luego tres. ¿Cuántas fichas añade cada borde? Usa esa conexión para demostrar $1+3+\cdots+(2n-1)=n^2$.
2. Prueba que $3$ divide a $4^n-1$ para cada entero $n\ge0$. Busca cómo expresar el caso siguiente usando $4^k-1$.
3. Una supuesta prueba afirma que todos los enteros positivos son pares porque “si $n$ es par, $n+2$ también”. Encuentra tanto el problema de inicio como el del salto.

COMPRUEBA TU RAZONAMIENTO
1. La base es $1=1^2$. El paso añade $2k+1$: $k^2+2k+1=(k+1)^2$. 2. En cero obtenemos cero, divisible por tres. Después $4^{k+1}-1=4(4^k-1)+3$, divisible por tres bajo la hipótesis. 3. Uno no es par y el salto de dos nunca conecta pares con impares; empezar en dos solo alcanzaría los pares.

EN RESUMEN
Busca la transformación del caso $k$ al $k+1$, fija una base válida y utiliza la hipótesis únicamente para justificar esa transformación. La intuición descubre la conexión; la prueba explica por qué funciona siempre.` },
}
