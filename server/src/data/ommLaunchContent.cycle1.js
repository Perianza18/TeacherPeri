import { defineLesson as L } from './ommLaunchContent.helpers.js'

export const OMM_CYCLE_1_LESSONS = [
  L({
    pathSlug: 'angulos-paralelas-y-perpendiculares', area: 'geometry', title: 'Ángulos, paralelas y perpendiculares: guía esencial',
    summary: 'Relaciones angulares para leer una figura y construir una cadena de igualdades justificadas.',
    article: {
      introduction: 'Aprenderás a calcular ángulos usando rectas, paralelas y triángulos, y también a recorrer esas relaciones en sentido inverso para demostrar que dos rectas son paralelas. La idea central es el rastreo de ángulos: cada valor se obtiene del anterior mediante una razón concreta, no porque el dibujo parezca mostrarlo.',
      ideas: `RELACIONES BÁSICAS
Una vuelta completa alrededor de un punto mide $360^\\circ$. Sobre una recta, dos ángulos adyacentes forman un ángulo llano y suman $180^\\circ$. Cuando dos rectas se cruzan, los ángulos opuestos por el vértice son iguales; los adyacentes, en cambio, son suplementarios. Si las rectas son perpendiculares, cada uno de los cuatro ángulos mide $90^\\circ$.

PARALELAS Y UNA TRANSVERSAL
Cuando una transversal corta dos rectas paralelas, los ángulos correspondientes son iguales y los alternos internos son iguales. Los interiores del mismo lado de la transversal suman $180^\\circ$. Conviene marcar primero cuáles son las dos paralelas y cuál es la transversal; memorizar solo la forma de una “F” o una “Z” puede fallar si la figura está girada.

Estas relaciones también funcionan como criterios de paralelismo. Si una transversal forma ángulos correspondientes iguales, alternos internos iguales, o interiores del mismo lado suplementarios, entonces las dos rectas son paralelas. Es importante distinguir la dirección lógica: para transportar un ángulo necesitas saber que hay paralelas; para probar el paralelismo necesitas verificar una de esas relaciones.

ÁNGULOS EN TRIÁNGULOS
Los tres ángulos interiores de un triángulo suman $180^\\circ$. Un ángulo exterior, formado al prolongar un lado, es igual a la suma de los dos ángulos interiores no adyacentes: se obtiene restando de $180^\\circ$ el interior vecino. En un triángulo isósceles, los ángulos opuestos a los dos lados iguales son iguales. En un triángulo equilátero los tres lados son iguales, por lo que sus tres ángulos son iguales y cada uno mide $60^\\circ$.

RASTREO DE ÁNGULOS
Rastrear ángulos es encadenar hechos breves: “este ángulo vale tanto por ser opuesto”, “el siguiente es igual por alternos internos”, “el que falta completa un triángulo”. Escribe la justificación junto a cada igualdad. Así una figura complicada se convierte en varios pasos elementales.`,
      example: `EJEMPLO 1: UNA CADENA DE VARIOS PASOS
En el triángulo $ABC$ se prolonga $BC$ más allá de $C$. El ángulo exterior en $C$ mide $128^\\circ$ y $\\angle A=47^\\circ$. Además, por $A$ se traza una recta $r$ paralela a $BC$.

Primero, el ángulo interior $\\angle C$ y el exterior forman una recta, así que $\\angle C=180^\\circ-128^\\circ=52^\\circ$. Segundo, la suma del triángulo da $\\angle B=180^\\circ-47^\\circ-52^\\circ=81^\\circ$. Tercero, como $r\\parallel BC$, el ángulo agudo que $AB$ forma con $r$ mide $81^\\circ$ por ángulos alternos internos. Del mismo modo, el ángulo que $AC$ forma con $r$ mide $52^\\circ$. Como comprobación, sobre la recta $r$ aparecen consecutivamente $81^\\circ$, $47^\\circ$ y $52^\\circ$, cuya suma es $180^\\circ$.

EJEMPLO 2: USAR LA RELACIÓN AL REVÉS
Una transversal corta las rectas $m$ y $n$, y un par de ángulos alternos internos mide $64^\\circ$ cada uno. La igualdad no solo permite copiar el valor: demuestra que $m\\parallel n$.`,
      mistakes: 'Confiar en el tamaño aparente de un ángulo; confundir opuestos por el vértice con adyacentes; declarar que dos ángulos son correspondientes sin identificar la transversal; transportar valores antes de establecer el paralelismo; o escribir una cadena de números sin indicar qué propiedad respalda cada paso. Tampoco debe suponerse que una figura es isósceles o perpendicular si no está dado ni demostrado.',
      practice: `1. Dos rectas se cruzan y uno de sus ángulos mide $37^\\circ$. Determina los otros tres y justifica cada valor.
2. Los ángulos de un triángulo son $2x$, $3x$ y $4x$. Encuentra $x$ y los tres ángulos.
3. En un triángulo isósceles los dos lados iguales se encuentran en un ángulo de $38^\\circ$. Calcula los ángulos de la base.
4. Una transversal forma dos ángulos interiores del mismo lado de $112^\\circ$ y $68^\\circ$. ¿Qué puedes concluir sobre las rectas?

Respuestas de control: 1. $37^\\circ,143^\\circ,143^\\circ$; 2. $x=20^\\circ$ y ángulos $40^\\circ,60^\\circ,80^\\circ$; 3. $71^\\circ$ y $71^\\circ$; 4. son paralelas porque los ángulos suman $180^\\circ$.`,
      summary: 'Localiza rectas, transversales y triángulos; anota cada igualdad o suma con su justificación; y revisa el resultado usando una vuelta de $360^\\circ$, una recta de $180^\\circ$ o la suma angular del triángulo. Las mismas relaciones que calculan ángulos pueden, usadas en sentido inverso, establecer paralelismo.',
    },
    steps: [
      { title: 'Construye el mapa de relaciones angulares', description: 'Lee la guía y dibuja ejemplos propios de ángulos opuestos, suplementarios, correspondientes, alternos y de un triángulo isósceles.' },
      { title: 'Reconstruye el rastreo paso a paso', description: 'Oculta el ejemplo principal, calcula de nuevo cada ángulo y escribe al lado la propiedad exacta que autoriza el paso.' },
      { title: 'Practica cálculo y paralelismo', description: 'Resuelve los cuatro ejercicios sin usar medidas visuales; en el último, explica por qué la relación angular prueba que las rectas son paralelas.' },
      { title: 'Audita una cadena de ángulos', description: 'Revisa tus soluciones buscando un paso sin justificar y comprueba cada respuesta con una suma de $180^\\circ$ o $360^\\circ$.' },
    ],
  }),
  L({
    pathSlug: 'semejanza-y-congruencia', area: 'geometry', title: 'Semejanza y congruencia: guía esencial',
    summary: 'Criterios para reconocer triángulos con la misma forma o exactamente el mismo tamaño.',
    article: {
      introduction: 'Aprenderás a decidir cuándo dos triángulos tienen la misma forma, cuándo coinciden por completo y cómo escribir correctamente la correspondencia entre sus vértices. En problemas olímpicos, estas relaciones permiten convertir información angular en proporciones, o datos parciales en igualdades de longitudes.',
      ideas: `SEMEJANZA Y CORRESPONDENCIA
Dos triángulos son semejantes si sus ángulos correspondientes son iguales y sus lados correspondientes guardan una misma razón. Si escribimos $\\triangle ABC\\sim\\triangle DEF$, el orden afirma que $A$ corresponde a $D$, $B$ a $E$ y $C$ a $F$; por tanto, $AB/DE=BC/EF=CA/FD$. Esa razón común es el factor de escala. Si el factor del primero al segundo es $k$, toda longitud correspondiente se multiplica por $k$.

No hace falta verificar las seis relaciones. Basta uno de estos criterios: AA, dos ángulos correspondientes iguales; LAL proporcional, dos pares de lados en la misma razón y el ángulo comprendido igual; o LLL proporcional, los tres pares de lados en una misma razón. El ángulo del criterio LAL debe estar entre los lados comparados.

TEOREMA DE TALES: UNA PARALELA CREA SEMEJANZA
En $\\triangle ABC$, toma $D$ en $AB$ y $E$ en $AC$. Si $DE\\parallel BC$, entonces $\\angle ADE=\\angle ABC$ y $\\angle AED=\\angle ACB$ por las relaciones de paralelas. Así, $\\triangle ADE\\sim\\triangle ABC$ por AA y
$AD/AB=AE/AC=DE/BC$.
Esta es la forma básica del teorema de Tales: una paralela a un lado de un triángulo corta los otros dos lados proporcionalmente. No es una fórmula aislada; la proporcionalidad nace de los triángulos semejantes. También puede escribirse $AD/DB=AE/EC$, siempre respetando segmentos correspondientes.

CONGRUENCIA
Dos triángulos son congruentes si tienen la misma forma y el mismo tamaño: sus lados y ángulos correspondientes son iguales. Los criterios básicos son LLL, tres lados iguales; LAL, dos lados y el ángulo comprendido iguales; y ALA, dos ángulos y el lado comprendido iguales. La congruencia puede verse como semejanza con factor de escala $1$, pero sus criterios permiten concluir directamente todas las igualdades correspondientes.

Una condición arbitraria ALL, también llamada SSA, no suele bastar: conocer dos lados y un ángulo que no está comprendido puede permitir dos triángulos distintos. Por eso debes comprobar la posición del ángulo antes de invocar LAL.`,
      example: `EJEMPLO 1: TALES Y UNA LONGITUD FALTANTE
En $\\triangle ABC$, los puntos $D$ y $E$ están en $AB$ y $AC$, respectivamente, y $DE\\parallel BC$. Se sabe que $AD=6$, $DB=3$ y $AE=8$. Como $AB=9$ y los triángulos $ADE$ y $ABC$ son semejantes por AA, $AD/AB=AE/AC$. Entonces $6/9=8/AC$, de donde $AC=12$ y $EC=AC-AE=4$.

EJEMPLO 2: IDENTIFICAR UNA CORRESPONDENCIA OCULTA
En el trapecio $ABCD$, con $AB\\parallel CD$, las diagonales $AC$ y $BD$ se cortan en $O$. Queremos relacionar $AO$ y $OC$ con $BO$ y $OD$. Los ángulos $\\angle AOB$ y $\\angle COD$ son opuestos por el vértice. Además, $\\angle ABO=\\angle CDO$ porque $AB\\parallel CD$ y $BD$ es transversal. Por AA, $\\triangle AOB\\sim\\triangle COD$.

El orden correcto es $A\\leftrightarrow C$, $B\\leftrightarrow D$ y $O\\leftrightarrow O$; por eso $AO/OC=BO/OD$. Si $AO=6$, $OC=4$ y $OD=3$, entonces $6/4=BO/3$, así que $BO=9/2$. La semejanza no estaba anunciada por triángulos anidados: hubo que descubrir los ángulos y fijar la correspondencia.`,
      mistakes: 'Escribir proporciones antes de fijar la correspondencia; emparejar lados por su posición visual; usar AAA para afirmar congruencia, cuando solo da semejanza; olvidar que el factor de escala modifica longitudes; citar Tales sin señalar la paralela; usar LAL con un ángulo no comprendido; o suponer que ALL garantiza congruencia. Una buena defensa es escribir primero la igualdad de ángulos y luego el orden completo de los triángulos.',
      practice: `1. En un triángulo, una paralela al lado mayor produce un triángulo pequeño con $AD/AB=2/5$. Si $AE=6$, calcula $AC$.
2. Dos triángulos tienen lados $3,4,5$ y $6,8,10$. Justifica la semejanza y da el factor de escala del primero al segundo.
3. Decide si estos datos garantizan congruencia: dos lados de longitudes $5$ y $7$ y el ángulo de $40^\\circ$ comprendido entre ellos. Nombra el criterio.
4. Explica por qué conocer dos lados y un ángulo no comprendido no autoriza automáticamente el criterio LAL.

Respuestas de control: 1. $AC=15$; 2. LLL proporcional y factor $2$; 3. sí, por LAL; 4. la posición del ángulo puede dejar más de una construcción posible.`,
      summary: 'Primero identifica vértices correspondientes; después elige un criterio válido. Las paralelas suelen producir igualdad de ángulos y, mediante Tales, triángulos semejantes con segmentos proporcionales. La congruencia exige tamaño idéntico; la semejanza admite un factor de escala distinto de $1$.',
    },
    steps: [
      { title: 'Distingue forma, escala e igualdad', description: 'Estudia las definiciones y crea una tabla breve que contraste semejanza, congruencia, correspondencia y factor de escala.' },
      { title: 'Deriva Tales desde los ángulos', description: 'Dibuja un triángulo con una paralela, marca los pares de ángulos iguales y reconstruye la proporción sin memorizarla como fórmula aislada.' },
      { title: 'Encuentra correspondencias y aplica criterios', description: 'Resuelve los ejemplos y ejercicios escribiendo el orden de los vértices antes de plantear cualquier razón o criterio.' },
      { title: 'Revisa criterios y casos insuficientes', description: 'Comprueba que cada uso de LAL tiene el ángulo comprendido y explica en una frase por qué AAA y ALL no prueban congruencia.' },
    ],
  }),
  L({
    pathSlug: 'areas-y-razones', area: 'geometry', title: 'Áreas y razones: guía esencial',
    summary: 'Comparaciones y descomposiciones de área que evitan calcular longitudes innecesarias.',
    article: {
      introduction: 'Aprenderás a usar el área como una herramienta de razonamiento, no solo como un número al final de un cálculo. El rastreo de áreas permite traducir razones de segmentos en razones de regiones, sumar piezas o restarlas y resolver figuras aun cuando faltan alturas o longitudes individuales.',
      ideas: `FÓRMULAS Y COMPARACIONES FUNDAMENTALES
El área de un triángulo de base $b$ y altura perpendicular $h$ es $bh/2$. Un rectángulo de lados $b,h$ tiene área $bh$, y un paralelogramo con base $b$ y altura perpendicular $h$ también tiene área $bh$. La altura siempre se mide perpendicularmente a la recta que contiene la base; no tiene que quedar dentro de la figura.

Si dos triángulos tienen la misma altura, el factor $h/2$ es común y la razón de sus áreas es la razón de sus bases. Esto ocurre, por ejemplo, cuando sus bases están sobre una misma recta y comparten el vértice opuesto. Si comparten la misma base, la razón de sus áreas es la razón de sus alturas. En particular, dos vértices que se mueven sobre una recta paralela a la base permanecen a la misma distancia de ella, así que producen áreas iguales.

CEVIANAS Y RASTREO DE ÁREAS
Una ceviana es un segmento desde un vértice hasta el lado opuesto. Si $D$ está en $BC$, la ceviana $AD$ divide $\\triangle ABC$ en $\\triangle ABD$ y $\\triangle ADC$. Ambos comparten la altura desde $A$ a la recta $BC$, por lo que $[ABD]/[ADC]=BD/DC$. Usaremos $[XYZ]$ para el área del triángulo $XYZ$.

También se puede dividir una figura en regiones pequeñas y sumar sus áreas, o encerrar una región en una figura mayor y restar las partes sobrantes. Esta técnica es útil cuando ninguna fórmula directa usa los datos disponibles. No es necesario conocer cada longitud: basta conservar correctamente las razones y el área total.

SEMEJANZA Y ÁREA
Si dos figuras semejantes tienen factor lineal $k$, tanto la base como la altura se multiplican por $k$; por ello el área se multiplica por $k^2$. Una razón de lados $2:3$ produce una razón de áreas $4:9$, no $2:3$.`,
      example: `EJEMPLO 1: MISMA ALTURA
En $\\triangle ABC$, un punto $D$ de $BC$ cumple $BD:DC=2:3$ y $[ABC]=50$. Los triángulos $ABD$ y $ADC$ tienen la misma altura desde $A$, así que sus áreas están en razón $2:3$. Las cinco partes de la razón representan $50$, de modo que cada parte vale $10$. Por tanto, $[ABD]=20$ y $[ADC]=30$. La altura y las longitudes de $BD,DC$ nunca fueron necesarias.

EJEMPLO 2: DESCOMPONER ALREDEDOR DE UNA CEVIANA
En $\\triangle ABC$ de área $96$, el punto $D$ está en $BC$ y $BD:DC=1:2$. El punto $E$ está en $AD$ y $AE:ED=3:1$. Se trazan $BE$ y $CE$. Primero, la ceviana $AD$ divide el área en la razón $1:2$, así que $[ABD]=32$ y $[ADC]=64$.

Dentro de $\\triangle ABD$, los triángulos $ABE$ y $EBD$ comparten la altura desde $B$ a la recta $AD$; sus bases $AE$ y $ED$ están en razón $3:1$. Por ello, $[ABE]=24$ y $[EBD]=8$. Del mismo modo, en $\\triangle ADC$, $[AEC]=48$ y $[EDC]=16$. La región $BEC$ se descompone en $BED$ y $EDC$, de modo que $[BEC]=8+16=24$. Este cálculo usa bases, alturas comunes y suma de piezas, sin hallar ninguna longitud.`,
      mistakes: 'Comparar bases sin verificar que las alturas sean iguales; llamar altura a un lado inclinado; creer que dos triángulos comparten altura solo porque están cerca; sumar razones como si fueran áreas; olvidar que las piezas deben cubrir la región sin superponerse; o elevar al cuadrado una razón que no proviene de figuras semejantes. En figuras semejantes, el factor de área es $k^2$, no $k$.',
      practice: `1. Una ceviana divide el lado opuesto en razón $3:5$. ¿Qué fracción del área total ocupa cada triángulo?
2. Dos triángulos comparten una base. Sus vértices opuestos están sobre una recta paralela a esa base. Compara sus áreas.
3. Un triángulo de área $72$ se divide por una ceviana en razón de bases $1:3$. Calcula las dos áreas.
4. Dos triángulos semejantes tienen razón de lados correspondientes $3:4$. Si el menor tiene área $27$, calcula el área del mayor.

Respuestas de control: 1. $3/8$ y $5/8$; 2. son iguales; 3. $18$ y $54$; 4. $48$, porque la razón de áreas es $9:16$.`,
      summary: 'Busca primero alturas o bases compartidas, paralelas y cevianas. Convierte razones de segmentos en razones de áreas, descompón o resta regiones cuando convenga y reserva $k^2$ para figuras que realmente sean semejantes. El objetivo es controlar el área sin calcular datos que el problema no necesita.',
    },
    steps: [
      { title: 'Relaciona bases, alturas y áreas', description: 'Estudia las comparaciones fundamentales y dibuja pares de triángulos con la misma altura, la misma base y vértices sobre una paralela.' },
      { title: 'Reconstruye los dos rastreos de área', description: 'Oculta las soluciones y recupera cada área de los ejemplos indicando qué altura, base o descomposición se usa.' },
      { title: 'Practica razones y semejanza', description: 'Resuelve los cuatro ejercicios y evita calcular longitudes que no intervienen en la comparación solicitada.' },
      { title: 'Comprueba la contabilidad de regiones', description: 'Verifica que las áreas parciales sumen el total y que solo hayas cuadrado razones lineales cuando existe semejanza.' },
    ],
  }),
  L({
    pathSlug: 'teorema-de-pitagoras', area: 'geometry', title: 'Teorema de Pitágoras: guía esencial',
    summary: 'Relaciones métricas en triángulos rectángulos y estrategias para descubrir o construir el triángulo adecuado.',
    article: {
      introduction: 'Aprenderás qué afirma el teorema de Pitágoras, cómo reconocer cuándo puede usarse y cómo crear un triángulo rectángulo mediante una diagonal, una altura o un segmento auxiliar. La herramienta es más poderosa cuando primero se identifica la estructura geométrica y solo después se sustituyen números.',
      ideas: `EL TEOREMA Y SU CONVERSO
En un triángulo rectángulo, los catetos $a$ y $b$ forman el ángulo de $90^\\circ$ y la hipotenusa $c$ está enfrente de ese ángulo. El teorema afirma $a^2+b^2=c^2$. La hipotenusa es siempre el lado mayor; no se decide por cómo esté girado el dibujo.

El converso también es útil: si un triángulo tiene lados $a,b,c$, con $c$ el mayor, y cumple $a^2+b^2=c^2$, entonces es rectángulo. Las ternas $3,4,5$ y $5,12,13$, así como sus múltiplos, sirven como señales rápidas, pero reconocerlas no sustituye explicar qué lado es la hipotenusa y por qué se aplica el teorema o su converso.

UNA PRUEBA POR ÁREAS
Construye un cuadrado de lado $a+b$ y coloca dentro cuatro copias de un triángulo rectángulo de catetos $a,b$ e hipotenusa $c$, de modo que las cuatro hipotenusas formen un cuadrado central. El área grande es $(a+b)^2$. También es la suma de los cuatro triángulos, $4(ab/2)=2ab$, y el cuadrado central, $c^2$. Así,
$(a+b)^2=2ab+c^2$.
Al expandir el lado izquierdo y cancelar $2ab$, queda $a^2+b^2=c^2$. La igualdad surge de calcular la misma área de dos maneras.

TRIÁNGULOS RECTÁNGULOS OCULTOS
Una diagonal de un rectángulo crea dos triángulos rectángulos. Una altura es perpendicular al lado sobre el que cae y también crea uno o dos. En un triángulo isósceles, la altura desde el vértice principal divide la base en dos partes iguales; esto puede justificarse por congruencia de los dos triángulos rectángulos resultantes. En otros problemas conviene trazar un segmento paralelo o perpendicular auxiliar para producir el ángulo recto que falta.

En coordenadas, los cambios horizontal y vertical son catetos: entre $(x_1,y_1)$ y $(x_2,y_2)$ la distancia es $\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$. Es una aplicación secundaria del mismo dibujo, no una fórmula independiente.`,
      example: `EJEMPLO 1: APLICACIÓN MÉTRICA DIRECTA
Un rectángulo mide $9$ por $12$. Su diagonal $d$ es la hipotenusa del triángulo rectángulo formado por dos lados del rectángulo. Entonces $d^2=9^2+12^2=81+144=225$, y como una longitud es positiva, $d=15$. La terna $3,4,5$ multiplicada por $3$ permite anticipar y comprobar el resultado.

EJEMPLO 2: CREAR EL TRIÁNGULO RECTÁNGULO
Un triángulo isósceles tiene lados iguales de longitud $13$ y base $10$. No aparece una longitud perpendicular en los datos. Trazamos la altura desde el vértice entre los lados iguales hasta la base. En un isósceles, esa altura divide la base en dos segmentos de longitud $5$. Ahora sí aparece un triángulo rectángulo con hipotenusa $13$, un cateto $5$ y altura $h$.

Por Pitágoras, $h^2+5^2=13^2$, así que $h^2=169-25=144$ y $h=12$. Como consecuencia, el área del triángulo original es $10\\cdot12/2=60$. La parte decisiva no fue sustituir en una fórmula, sino decidir qué segmento trazar para revelar el triángulo $5$-$12$-$13$.`,
      mistakes: 'Aplicar $a^2+b^2=c^2$ a un triángulo que no es rectángulo; elegir como hipotenusa el lado que parece inclinado; usar el converso sin comprobar que $c$ sea el lado mayor; olvidar la raíz cuadrada o aceptar una longitud negativa; redondear antes de tiempo; o trazar una altura y asumir propiedades adicionales sin justificarlas. Antes de calcular, marca explícitamente el ángulo recto.',
      practice: `1. Una escalera de longitud $13$ alcanza una pared a $12$ unidades de altura. ¿A qué distancia está su pie de la pared?
2. Decide mediante el converso si un triángulo de lados $7,24,25$ es rectángulo.
3. Un cuadrado tiene lado $6$. Encuentra su diagonal sin usar una fórmula memorizada para cuadrados.
4. Un triángulo isósceles tiene lados iguales $10$ y base $12$. Traza una altura y calcula su área.

Respuestas de control: 1. $5$; 2. sí, porque $7^2+24^2=25^2$; 3. $6\\sqrt2$; 4. la semibase es $6$, la altura es $8$ y el área es $48$.`,
      summary: 'Confirma o construye primero un ángulo recto, identifica la hipotenusa como el lado opuesto y mayor, y solo entonces usa el teorema. El converso detecta triángulos rectángulos; diagonales y alturas suelen revelarlos; y una prueba por áreas explica por qué la relación cuadrática es verdadera.',
    },
    steps: [
      { title: 'Identifica la estructura rectángula', description: 'Estudia el teorema, su converso y la hipotenusa; marca el ángulo recto y el lado opuesto en varios dibujos girados.' },
      { title: 'Reconstruye la prueba por áreas', description: 'Dibuja el cuadrado de lado $a+b$ y explica cada término de $(a+b)^2=2ab+c^2$ antes de simplificar.' },
      { title: 'Aplica y construye triángulos auxiliares', description: 'Rehaz los dos ejemplos y resuelve los ejercicios, dibujando la diagonal o altura antes de plantear la ecuación.' },
      { title: 'Revisa condiciones y resultados', description: 'Comprueba en cada solución que existía un ángulo recto, que la hipotenusa era el lado mayor y que la longitud obtenida es positiva.' },
    ],
  }),
  L({
    pathSlug: 'factorizacion-e-identidades', area: 'algebra', title: 'Factorización e identidades: guía esencial',
    summary: 'Transformaciones estructurales que revelan productos, ceros y divisibilidad.',
    article: {
      introduction: 'Aprenderás a reconocer patrones algebraicos y a decidir si conviene desarrollar una expresión o escribirla como producto. En problemas olímpicos, factorizar no es una rutina mecánica: es una manera de hacer visible una estructura que estaba escondida.',
      ideas: `FACTOR COMÚN Y AGRUPACIÓN
Factorizar significa reescribir una suma como producto. La primera pregunta debe ser si todos los términos comparten un factor. Por ejemplo, $6x^3-9x^2=3x^2(2x-3)$. Conviene extraer el mayor factor común disponible, pues detenerse en $3x(2x^2-3x)$ deja la expresión factorizada solo parcialmente.

Cuando no hay un factor común global, puede aparecer por grupos. En $ax+ay+bx+by$, los dos primeros términos comparten $a$ y los dos últimos comparten $b$: $a(x+y)+b(x+y)=(a+b)(x+y)$. La agrupación funciona porque consigue un mismo factor entre paréntesis; una separación arbitraria no garantiza nada.

IDENTIDADES QUE CONVIENE RECONOCER
Las identidades básicas pueden leerse en ambos sentidos:
$a^2-b^2=(a-b)(a+b)$,
$(a+b)^2=a^2+2ab+b^2$,
$(a-b)^2=a^2-2ab+b^2$,
$a^3-b^3=(a-b)(a^2+ab+b^2)$,
$a^3+b^3=(a+b)(a^2-ab+b^2)$.

No basta memorizar las fórmulas. Para detectar una diferencia de cuadrados, busca dos términos cuadrados separados por una resta. Para reconocer un binomio al cuadrado, verifica que los extremos sean cuadrados y que el término medio sea el doble del producto de sus raíces. En las fórmulas de cubos, el primer factor conserva el signo entre los cubos y el término medio del segundo factor lleva el signo contrario.

¿CONVIENE DESARROLLAR O FACTORIZAR?
Factoriza cuando quieras encontrar ceros, demostrar divisibilidad o estudiar cuándo un producto se anula. Conserva un producto intacto si sus factores ya expresan la idea. Desarrolla cuando necesites comparar coeficientes, reunir términos semejantes o revelar una combinación simétrica. Antes de operar, pregunta qué forma acerca más el objetivo.

A veces la identidad no aparece de inmediato. Reagrupar, o sumar y restar la misma cantidad, puede fabricarla sin cambiar la expresión. Esta reescritura debe tener un propósito claro: producir un cuadrado, una diferencia de cuadrados o un factor común.`,
      example: `EJEMPLO 1: RECONOCIMIENTO DIRECTO
En $49x^2-25$, ambos términos son cuadrados y están separados por una resta: $(7x)^2-5^2$. Por diferencia de cuadrados,
$49x^2-25=(7x-5)(7x+5)$.

EJEMPLO 2: REESCRIBIR ANTES DE FACTORIZAR
La expresión $x^2+6x+5$ no es un cuadrado perfecto porque $5\\neq9$. Sumamos y restamos $9$, la cantidad que completa $(x+3)^2$:
$x^2+6x+5=x^2+6x+9-4=(x+3)^2-2^2$.
Ahora aparece una diferencia de cuadrados, así que
$x^2+6x+5=(x+1)(x+5)$.
No agregamos valor a la expresión: $+9-4$ reemplaza al $+5$ original.

EJEMPLO 3: FACTORIZACIÓN Y DIVISIBILIDAD
Para cualquier entero $n$,
$n^3-n=n(n^2-1)=n(n-1)(n+1)$.
El producto contiene tres enteros consecutivos. Entre tres consecutivos hay uno divisible por $3$, y al menos uno es par. Por ello el producto es divisible por $6$. La forma desarrollada $n^3-n$ ocultaba esa conclusión; la forma factorizada la vuelve inmediata.`,
      mistakes: 'Cambiar signos al usar una identidad; confundir $a^2+b^2$ con una diferencia de cuadrados; olvidar el término $2ab$ en un binomio al cuadrado; cancelar términos a través de una suma, como si $(x+2)/x$ fuera $2$; detener la factorización cuando aún hay un factor común o una identidad; desarrollar un producto que ya muestra ceros o divisibilidad; o aplicar una fórmula porque la expresión se parece, sin comprobar todos sus términos.',
      practice: `1. Factoriza completamente $12x^3-18x^2$.
2. Factoriza $x^2-16$, $x^2+10x+25$ y $8y^3+1$.
3. Agrupa y factoriza $x^3+x^2-x-1$.
4. Resuelve $x^2-10x+21=0$ mediante factorización.
5. Explica por qué $m^3-m$ es par para todo entero $m$.

Respuestas de control: 1. $6x^2(2x-3)$; 2. $(x-4)(x+4)$, $(x+5)^2$ y $(2y+1)(4y^2-2y+1)$; 3. $(x+1)^2(x-1)$; 4. $x=3$ o $x=7$; 5. $m(m-1)(m+1)$ contiene un factor par.`,
      summary: 'Busca primero factor común; después examina agrupaciones e identidades en sentido inverso. Reescribe solo para revelar una estructura útil y elige entre desarrollar o factorizar según el objetivo: coeficientes y simetría, o bien ceros, productos y divisibilidad.',
    },
    steps: [
      { title: 'Aprende a ver productos escondidos', description: 'Estudia las señales de factor común, agrupación, cuadrados y cubos; para cada identidad explica cómo reconocerla en sentido inverso.' },
      { title: 'Reconstruye una factorización estratégica', description: 'Oculta el segundo ejemplo y recupera por qué se suma y resta $9$, qué identidad aparece y cómo se llega al producto final.' },
      { title: 'Elige entre desarrollar y factorizar', description: 'Resuelve los cinco ejercicios y anota antes de cada uno qué forma —suma o producto— hará visible el objetivo.' },
      { title: 'Revisa signos, factores y propósito', description: 'Multiplica tus factores para comprobarlos, busca factores pendientes y señala un paso donde expandir habría ocultado información.' },
    ],
  }),
  L({
    pathSlug: 'manipulaciones-y-sustituciones-algebraicas', area: 'algebra', title: 'Manipulaciones y sustituciones algebraicas: guía esencial',
    summary: 'Transformaciones guiadas por el objetivo que extraen información sin mover símbolos al azar.',
    article: {
      introduction: 'Manipular no significa mover símbolos al azar; significa transformar una expresión hacia una forma útil. Aprenderás a partir de los datos y del objetivo, detectar combinaciones repetidas o simétricas y escoger una transformación que conserve la información necesaria.',
      ideas: `EMPIEZA POR EL OBJETIVO
Antes de calcular, escribe qué conoces y qué debes obtener. Si aparecen $x+y$ y $xy$, quizá no necesites conocer $x$ e $y$ por separado. Si buscas $x^2+y^2$, conviene mirar $(x+y)^2=x^2+2xy+y^2$ y despejar
$x^2+y^2=(x+y)^2-2xy$.
De forma parecida, $(x-y)^2=(x+y)^2-4xy$. Estas relaciones convierten exactamente los datos disponibles en la cantidad pedida.

La simetría es una pista elemental. Una expresión como $x+y$, $xy$ o $x^2+y^2$ no cambia al intercambiar $x$ e $y$. Si tanto los datos como la pregunta son simétricos, resolver primero cada variable puede ser trabajo innecesario.

EXPRESIONES RECÍPROCAS
Si aparece $x+1/x$, la presencia del recíproco obliga a registrar $x\\neq0$. Al cuadrar,
$(x+1/x)^2=x^2+2+1/x^2$,
de modo que $x^2+1/x^2=(x+1/x)^2-2$. El objetivo no es hallar $x$, sino construir la expresión solicitada a partir de la conocida.

SUSTITUIR UNA ESTRUCTURA REPETIDA
Una variable temporal reduce ruido. Si una expresión repite muchas veces $x+y$, puedes escribir $t=x+y$, trabajar con $t$ y al final traducir el resultado. Por ejemplo, $(x+y)^2-5(x+y)+6$ se convierte en $t^2-5t+6$. La sustitución es útil cuando comprime una estructura; introducir letras nuevas para partes que aparecen una sola vez suele complicar el problema.

COMBINAR RELACIONES
Sumar ecuaciones puede eliminar términos con signos opuestos; restarlas puede eliminar términos iguales. Si una relación ya despeja una cantidad, sustituirla en otra puede concentrar la información. Por ejemplo, de $y=2x+1$ y $x+y=10$, sustituir produce $3x+1=10$. Sin embargo, no siempre interesa resolver todo: combina las ecuaciones para obtener directamente la expresión solicitada.

TRANSFORMACIONES VÁLIDAS
Sumar la misma expresión a ambos lados conserva equivalencia. Multiplicar o dividir por un número no nulo también. Nunca dividas por una expresión variable sin separar el caso en que vale cero. Los denominadores imponen restricciones. Elevar al cuadrado conserva que toda solución original sea candidata, pero puede introducir candidatas nuevas; por eso exige comprobar la relación inicial. Cada paso debe indicar si es reversible o si habrá que verificar al final.`,
      example: `EJEMPLO 1: NO RESOLVER PARA $x$
Si $x+1/x=4$, entonces $x\\neq0$. Al cuadrar obtenemos $x^2+2+1/x^2=16$, por lo que $x^2+1/x^2=14$. No hizo falta encontrar los posibles valores de $x$.

EJEMPLO 2: USAR SUMA Y PRODUCTO
Sean $x+y=9$ y $xy=14$. Entonces
$x^2+y^2=(x+y)^2-2xy=81-28=53$.
Además, $(x-y)^2=(x+y)^2-4xy=81-56=25$. Los datos son simétricos y las preguntas también; separar las variables habría añadido trabajo sin aportar información.

EJEMPLO 3: COMBINAR SOLO LO NECESARIO
Se sabe que $2u+v=11$ y $u-v=1$, y se pide $3u$. Al sumar las dos relaciones, $v$ y $-v$ se cancelan directamente:
$(2u+v)+(u-v)=11+1$,
así que $3u=12$. Como esa era exactamente la cantidad solicitada, no es necesario calcular $u$ ni $v$ por separado.`,
      mistakes: 'Expandir todo antes de mirar los datos; resolver variables individuales cuando solo se pide una combinación simétrica; hacer una sustitución y olvidar volver a la expresión original; dividir por $x$, $x-y$ u otra expresión sin considerar que podría ser cero; ignorar restricciones de denominadores; elevar al cuadrado y tratar cada candidato como solución; o realizar pasos correctos pero sin relación con el objetivo.',
      practice: `1. Si $a+b=7$ y $ab=10$, calcula $a^2+b^2$ y $(a-b)^2$ sin hallar $a$ y $b$.
2. Si $z+1/z=5$, calcula $z^2+1/z^2$ e indica la restricción necesaria.
3. Usa $t=p+q$ para simplificar y evaluar $(p+q)^2-4(p+q)+7$ cuando $p+q=3$.
4. Si $3r+s=17$ y $2r-s=8$, encuentra $5r$ combinando las ecuaciones.

Respuestas de control: 1. $29$ y $9$; 2. $23$, con $z\\neq0$; 3. $t^2-4t+7=4$; 4. $5r=25$.`,
      summary: 'Parte de la información dada y de la cantidad buscada. Reconoce simetría y subexpresiones repetidas, combina relaciones para eliminar lo innecesario y usa sustituciones que reduzcan complejidad. Comprueba siempre dominios y distingue los pasos equivalentes de los que crean solo candidatos.',
    },
    steps: [
      { title: 'Traza una ruta desde los datos al objetivo', description: 'Estudia la guía y, antes de operar, relaciona cada objetivo con una identidad o combinación construida a partir de los datos.' },
      { title: 'Reconstruye tres decisiones eficientes', description: 'Rehaz los ejemplos sin mirar: explica por qué no se resuelve para $x$, por qué se conserva la simetría y por qué se suman las ecuaciones.' },
      { title: 'Practica sustitución y combinación', description: 'Resuelve los cuatro ejercicios registrando la expresión temporal, la restricción o la cancelación que vuelve útil cada paso.' },
      { title: 'Audita la lógica de tus transformaciones', description: 'Marca cualquier división o cuadrado, verifica sus condiciones y elimina al menos un cálculo que no contribuya al objetivo.' },
    ],
  }),
  L({
    pathSlug: 'ecuaciones-algebraicas', area: 'algebra', title: 'Ecuaciones algebraicas: guía esencial',
    summary: 'Una base responsable para resolver ecuaciones, controlar restricciones y verificar resultados.',
    article: {
      introduction: 'Resolver una ecuación significa encontrar todos los valores que hacen verdadera la igualdad original. Aprenderás a distinguir transformaciones equivalentes de pasos que solo producen candidatos, a usar factorización y a tratar con cuidado denominadores y radicales.',
      ideas: `SOLUCIONES Y EQUIVALENCIA
Un valor es solución únicamente si satisface la ecuación original. Sumar o restar la misma expresión en ambos lados conserva exactamente las soluciones. Multiplicar o dividir por una constante no nula también. Estas transformaciones son equivalentes y pueden leerse en ambos sentidos.

En una ecuación lineal como $3x-5=10$, sumar $5$ y dividir entre $3$ produce $x=5$. Esta base es importante, pero en problemas menos rutinarios conviene examinar primero la estructura. Dividir por una expresión que depende de $x$ puede perder el caso en que esa expresión es cero. Por ejemplo, dividir $x(x-4)=0$ entre $x$ eliminaría indebidamente la solución $x=0$.

PRODUCTO CERO Y CUADRÁTICAS FACTORIZABLES
Si $AB=0$ en los números reales, entonces $A=0$ o $B=0$. Por eso llevar todos los términos a un lado y factorizar convierte ciertas cuadráticas en ecuaciones más simples. Esta propiedad solo se aplica cuando un producto es igual a cero; de $AB=6$ no se concluye que un factor sea cero.

RESTRICCIONES Y ECUACIONES RACIONALES
Una fracción algebraica existe solo cuando su denominador no es cero. Las restricciones se escriben antes de eliminar denominadores y se conservan hasta el final. Multiplicar por un denominador puede producir una ecuación más sencilla, pero cualquier valor prohibido sigue excluido. Cancelar factores también requiere registrar cuándo el factor cancelado era cero.

RADICALES Y CANDIDATOS EXTRAÑOS
En los números reales, $\\sqrt{A}$ exige $A\\ge0$ y representa la raíz no negativa. Elevar ambos lados al cuadrado no es reversible sin condiciones: números opuestos tienen el mismo cuadrado. Por tanto, las soluciones originales pasan a la ecuación cuadrada, pero esta puede contener candidatos extra. Cada candidato debe comprobarse en la ecuación original.

VERIFICAR ES PARTE DE RESOLVER
Sustituir al final detecta errores aritméticos, valores prohibidos y candidatos introducidos por pasos no equivalentes. La lista final debe contener todos y solo los valores válidos, no simplemente las raíces de la última expresión obtenida.`,
      example: `EJEMPLO 1: FACTORIZACIÓN Y PRODUCTO CERO
Resolvamos $x^2-5x+6=0$. Buscamos dos números cuyo producto sea $6$ y cuya suma sea $-5$:
$x^2-5x+6=(x-2)(x-3)$.
Por la propiedad del producto cero, $x-2=0$ o $x-3=0$, así que $x=2$ o $x=3$. Ambos valores verifican la ecuación original.

EJEMPLO 2: ECUACIÓN RACIONAL
Resolvamos $(x+1)/(x-2)=3$. Primero, $x\\neq2$. Para valores permitidos multiplicamos por $x-2$:
$x+1=3(x-2)=3x-6$.
Entonces $7=2x$ y $x=7/2$. Este valor no viola la restricción y, al sustituir, $(7/2+1)/(7/2-2)=3$, de modo que es solución.

EJEMPLO 3: UNA SOLUCIÓN EXTRAÑA AL CUADRAR
Resolvamos $\\sqrt{x+1}=x-1$. El lado derecho debe ser no negativo, así que una solución requiere $x\\ge1$. Al cuadrar obtenemos
$x+1=(x-1)^2=x^2-2x+1$,
es decir, $x^2-3x=0$ y $x(x-3)=0$. Los candidatos son $x=0$ y $x=3$. El primero no cumple $x\\ge1$ y en la ecuación original daría $1=-1$, así que se rechaza. Para $x=3$, $\\sqrt4=2=3-1$; la única solución es $3$.`,
      mistakes: 'Aceptar un valor porque satisface la última ecuación y no la original; dividir entre una variable y perder su caso cero; aplicar producto cero a una expresión que no está igualada a cero; cancelar términos a través de sumas; olvidar valores prohibidos por denominadores; omitir las condiciones de un radical; elevar al cuadrado y conservar candidatos extraños; o verificar solo una de varias respuestas.',
      practice: `1. Resuelve $2x-7=9$.
2. Resuelve $x^2+x-12=0$ por factorización.
3. Resuelve $2/(x-1)=1$, comenzando por la restricción.
4. Resuelve $\\sqrt{x+6}=x$ y comprueba cada candidato en la ecuación original.
5. Explica qué solución se pierde si se divide inmediatamente $x(x+5)=0$ entre $x$.

Respuestas de control: 1. $x=8$; 2. $x=3$ o $x=-4$; 3. $x\\neq1$ y la solución es $x=3$; 4. los candidatos son $3$ y $-2$, pero solo $x=3$ es válido; 5. se pierde $x=0$.`,
      summary: 'Declara primero el dominio, usa transformaciones equivalentes cuando sea posible y aprovecha producto cero tras factorizar. Si divides por una expresión variable o elevas al cuadrado, registra qué puede perderse o añadirse. La sustitución en la ecuación original cierra siempre la solución.',
    },
    steps: [
      { title: 'Distingue soluciones de candidatos', description: 'Estudia equivalencia, restricciones y producto cero; clasifica cada transformación de la guía como reversible o necesitada de verificación.' },
      { title: 'Reconstruye tres tipos de ecuación', description: 'Resuelve de nuevo los ejemplos de factorización, fracción y radical, conservando restricciones y comprobaciones explícitas.' },
      { title: 'Practica con dominio y estructura', description: 'Completa los cinco ejercicios, escribiendo el dominio antes de eliminar denominadores o elevar una igualdad al cuadrado.' },
      { title: 'Haz una verificación responsable', description: 'Sustituye cada respuesta en la ecuación original y explica cualquier valor perdido, prohibido o extraño que hayas descartado.' },
    ],
  }),
  L({
    pathSlug: 'divisibilidad-y-criterios-de-divisibilidad', area: 'number-theory', title: 'Divisibilidad y criterios: guía esencial',
    summary: 'Lenguaje y razonamiento para demostrar que un entero divide a otro y reconocer múltiplos en base diez.',
    article: {
      introduction: 'Aprenderás a tratar la divisibilidad como una relación algebraica que se demuestra, no solo como una división que se efectúa. La definición permitirá justificar propiedades, entender criterios decimales y reconocer estructuras frecuentes en problemas olímpicos.',
      ideas: `DEFINICIÓN Y LENGUAJE
Para enteros $a$ y $b$, con $a\\neq0$, escribimos $a\\mid b$ si existe un entero $k$ tal que $b=ak$. Decimos que $a$ es divisor de $b$ y que $b$ es múltiplo de $a$. Si no existe tal entero, escribimos $a\\nmid b$. Por ejemplo, $6\\mid42$ porque $42=6\\cdot7$, mientras que $6\\nmid43$. Los signos no alteran la existencia del factor entero: $a\\mid b$ equivale a $-a\\mid b$ y a $a\\mid-b$. Además, todo entero no nulo divide a $0$.

PROPIEDADES DESDE LA DEFINICIÓN
Si $a\\mid b$ y $a\\mid c$, existen enteros $r,s$ con $b=ar$ y $c=as$. Entonces
$b+c=a(r+s)$ y $b-c=a(r-s)$,
así que $a$ divide tanto la suma como la diferencia. Más generalmente, para enteros $m,n$,
$mb+nc=a(mr+ns)$,
por lo que $a\\mid mb+nc$. Esta prueba muestra por qué una combinación lineal de múltiplos de $a$ sigue siendo múltiplo de $a$.

También hay transitividad: si $a\\mid b$ y $b\\mid c$, entonces $b=ar$ y $c=bs$, de modo que $c=a(rs)$ y $a\\mid c$. Si $a\\mid b$, multiplicar $b$ por cualquier entero conserva la divisibilidad. Estas reglas permiten fabricar el objetivo a partir de cantidades cuya divisibilidad ya se conoce.

CRITERIOS EN BASE DIEZ
Un número es divisible por $2$ si su última cifra es par, por $5$ si termina en $0$ o $5$, por $4$ si sus últimas dos cifras forman un múltiplo de $4$, y por $8$ si sus últimas tres cifras forman un múltiplo de $8$. Esto funciona porque $10$, $100$ o $1000$ hacen que las cifras anteriores aporten un múltiplo del divisor correspondiente.

Para $3$ y $9$, las potencias de $10$ dejan el mismo resto que $1$ al dividirse entre esos números. Por eso un número y la suma de sus cifras dejan el mismo resto: basta revisar esa suma. Para $11$, las potencias de $10$ alternan el efecto de $1$ y $-1$; de ahí que la suma alternada de cifras deba ser múltiplo de $11$.

En olimpiadas, busca expresar el objetivo como combinación de múltiplos conocidos, factorizar una expresión, explotar si un número es par o impar, o traducir una condición sobre cifras a su valor posicional.`,
      example: `EJEMPLO 1: UNA PRUEBA ALGEBRAICA
Si $7\\mid a$ y $7\\mid b$, entonces $a=7r$ y $b=7s$ para ciertos enteros $r,s$. Por tanto,
$3a-2b=21r-14s=7(3r-2s)$.
Como $3r-2s$ es entero, queda demostrado que $7\\mid(3a-2b)$.

EJEMPLO 2: LEER LAS CIFRAS
Para $527472$, la suma de cifras es $27$, así que es divisible por $3$ y por $9$. Termina en cifra par; sus últimas dos cifras, $72$, son divisibles por $4$; y sus últimas tres, $472=8\\cdot59$, son divisibles por $8$. La suma alternada $2-7+4-7+2-5=-11$ muestra además divisibilidad por $11$. No es divisible por $5$.

EJEMPLO 3: REVELAR UN PRODUCTO
Para todo entero $n$, $n^3-n=n(n-1)(n+1)$. Son tres enteros consecutivos: uno es múltiplo de $3$ y al menos uno es par. Por ello el producto es divisible por $6$. La factorización hizo visibles ambos factores necesarios.`,
      mistakes: 'Leer $a\\mid b$ como una fracción o invertir divisor y múltiplo; afirmar divisibilidad sin exhibir el factor entero; sumar una cantidad no divisible a otra divisible y conservar la conclusión; usar un criterio decimal en otra base; aplicar el criterio de $4$ o $8$ a la suma de cifras; o citar paridad sin explicar dónde aparece el factor $2$.',
      practice: `1. Demuestra desde la definición: si $5\\mid u$ y $5\\mid v$, entonces $5\\mid(4u+3v)$.
2. Decide por cuáles de $2,3,4,5,8,9,11$ es divisible $123552$.
3. Demuestra que la diferencia de los cuadrados de dos enteros impares es divisible por $8$.
4. Si $d\\mid x$ y $x\\mid y$, prueba que $d\\mid y$.

Respuestas de control: 1. escribe $u=5r$, $v=5s$; 2. por $2,3,4,8,9$ y $11$, pero no por $5$; 3. para $2r+1$ y $2s+1$, la diferencia es $4(r-s)(r+s+1)$ y uno de los últimos factores es par; 4. sustituye $x=dk$ en $y=xq$.`,
      summary: 'Una afirmación $a\\mid b$ exige escribir $b$ como $a$ por un entero. Desde esa definición surgen las combinaciones lineales y la transitividad. Los criterios decimales son atajos justificados por las potencias de $10$; en problemas, combina, factoriza o traduce cifras para mostrar el factor buscado.',
    },
    steps: [
      { title: 'Habla el lenguaje de divisores y múltiplos', description: 'Estudia la definición y reescribe seis afirmaciones con la forma $b=ak$, incluyendo ejemplos negativos y un caso de no divisibilidad.' },
      { title: 'Reconstruye una propiedad desde la definición', description: 'Oculta la primera prueba y demuestra de nuevo la combinación lineal, nombrando los enteros que garantizan cada divisibilidad.' },
      { title: 'Aplica criterios y estructuras', description: 'Resuelve los ejercicios de cifras, factorización y transitividad sin limitarte a anunciar el criterio utilizado.' },
      { title: 'Comprueba cada afirmación de divisibilidad', description: 'Señala el factor entero final de cada prueba y distingue qué pasos dependen de base diez, paridad o una combinación lineal.' },
    ],
  }),
  L({
    pathSlug: 'primos-y-factorizacion', area: 'number-theory', title: 'Primos y factorización: guía esencial',
    summary: 'Cómo descomponer enteros y leer divisores, potencias perfectas y restricciones desde exponentes primos.',
    article: {
      introduction: 'Aprenderás qué distingue a un primo de un compuesto, cómo comprobar primalidad de manera razonada y cómo extraer información de una factorización prima. En teoría de números, los primos actúan como piezas básicas de los enteros positivos.',
      ideas: `PRIMOS, COMPUESTOS Y EL NÚMERO $1$
Un entero positivo mayor que $1$ es primo si tiene exactamente dos divisores positivos: $1$ y él mismo. Es compuesto si puede escribirse como producto de dos enteros mayores que $1$. El número $1$ no es primo ni compuesto: solo tiene un divisor positivo. Excluirlo hace posible que las factorizaciones primas sean únicas sin insertar tantos factores $1$ como se quiera.

TEOREMA FUNDAMENTAL DE LA ARITMÉTICA
Todo entero mayor que $1$ puede escribirse como producto de primos. Además, esa escritura es única salvo el orden de los factores. La existencia dice que al descomponer un compuesto el proceso termina en primos; la unicidad permite hablar de “la” factorización prima. En este nivel usaremos el teorema como fundamento, sin desarrollar su demostración completa.

COMPROBAR PRIMALIDAD
Si $n$ es compuesto y $n=ab$, no pueden cumplirse simultáneamente $a>\\sqrt n$ y $b>\\sqrt n$, pues entonces $ab>n$. Por ello algún factor es a lo más $\\sqrt n$. Para decidir si $n$ es primo basta probar divisibilidad por los primos que no superan esa raíz.

La criba de Eratóstenes genera primos pequeños: escribe los enteros desde $2$, conserva el primer número no tachado y elimina sus múltiplos; repite con el siguiente no tachado. Los números restantes son primos. Es una herramienta de organización, no un sustituto de la justificación en un problema.

LEER EXPONENTES PRIMOS
Si $n=p_1^{a_1}\\cdots p_r^{a_r}$, cada divisor positivo elige para $p_i$ un exponente entre $0$ y $a_i$. Hay $a_i+1$ elecciones independientes, así que el número de divisores es
$(a_1+1)\\cdots(a_r+1)$.
Un cuadrado perfecto tiene todos sus exponentes primos pares; un cubo perfecto los tiene múltiplos de $3$. Más generalmente, una potencia perfecta impone un divisor común mayor que $1$ en sus exponentes. Esta lectura revela divisibilidad, posibles divisores y restricciones sobre productos sin enumerarlos uno por uno.`,
      example: `EJEMPLO 1: ¿ES $97$ PRIMO?
Como $\\sqrt{97}<10$, solo probamos los primos $2,3,5,7$. El número no es par, su suma de cifras es $16$, no termina en $0$ o $5$, y no es múltiplo de $7$ porque está entre $91$ y $98$. Ningún primo hasta su raíz lo divide, por lo que $97$ es primo.

EJEMPLO 2: INFORMACIÓN EN LOS EXPONENTES
$360=2^3\\cdot3^2\\cdot5$. Un divisor tiene forma $2^a3^b5^c$, con $0\\le a\\le3$, $0\\le b\\le2$ y $0\\le c\\le1$. Por tanto hay $4\\cdot3\\cdot2=24$ divisores positivos. Para que el divisor sea cuadrado, los exponentes deben ser pares: hay dos opciones para $a$, dos para $b$ y una para $c$, de modo que $360$ tiene $4$ divisores cuadrados.

EJEMPLO 3: RECONOCER UNA POTENCIA
$216=2^3\\cdot3^3=(2\\cdot3)^3=6^3$. Los exponentes son múltiplos de $3$, lo que revela el cubo sin ensayar bases. En cambio, $72=2^3\\cdot3^2$ no es cuadrado ni cubo porque sus exponentes no cumplen la condición correspondiente.`,
      mistakes: 'Llamar primo al $1$; comprobar divisibilidad solo hasta un límite elegido sin relacionarlo con $\\sqrt n$; probar todos los enteros cuando bastan los primos; omitir multiplicidades en una factorización; contar exponentes disponibles como $a_i$ en lugar de $a_i+1$; o afirmar que un producto es cuadrado sin revisar la paridad de todos sus exponentes primos.',
      practice: `1. Factoriza $756$ y cuenta sus divisores positivos.
2. Encuentra el mayor divisor cuadrado de $756$.
3. Decide si $221$ es primo revisando solo los primos necesarios.
4. Usa una criba para listar los primos no mayores que $30$.
5. Decide si $540=2^2\\cdot3^3\\cdot5$ es cuadrado, cubo o ninguna de las dos cosas.

Respuestas de control: 1. $756=2^2\\cdot3^3\\cdot7$ y tiene $3\\cdot4\\cdot2=24$ divisores; 2. $2^2\\cdot3^2=36$; 3. no, pues $221=13\\cdot17$; 4. $2,3,5,7,11,13,17,19,23,29$; 5. ninguna.`,
      summary: 'Los primos son los bloques únicos de toda factorización de un entero mayor que $1$. Para comprobar primalidad basta buscar factores primos hasta la raíz cuadrada. Una vez factorizado el número, sus exponentes describen divisores y detectan cuadrados, cubos y otras potencias perfectas.',
    },
    steps: [
      { title: 'Distingue primos, compuestos y unidades', description: 'Estudia las definiciones, explica por qué $1$ queda fuera y construye ejemplos que muestren existencia y unicidad de la factorización.' },
      { title: 'Reconstruye una prueba de primalidad', description: 'Repite el análisis de $97$, justificando el límite de la raíz cuadrada y cada prueba de divisibilidad realizada.' },
      { title: 'Lee información desde los exponentes', description: 'Resuelve los ejercicios de $756$, $221$ y $540$, registrando las elecciones de exponentes en lugar de enumerar divisores.' },
      { title: 'Verifica factorizaciones y conteos', description: 'Multiplica los factores primos, revisa el número de elecciones y comprueba que cada potencia perfecta cumple todas las condiciones.' },
    ],
  }),
  L({
    pathSlug: 'mcd-mcm-y-algoritmo-de-euclides', area: 'number-theory', title: 'MCD, MCM y algoritmo de Euclides: guía esencial',
    summary: 'Conceptos y métodos para controlar divisores comunes, múltiplos comunes y coprimalidad.',
    article: {
      introduction: 'Aprenderás qué miden el máximo común divisor y el mínimo común múltiplo, cómo leerlos en factorizaciones primas y por qué el algoritmo de Euclides conserva exactamente los divisores comunes en cada paso.',
      ideas: `MCD, MCM Y COPRIMALIDAD
El máximo común divisor de enteros positivos $a,b$, escrito $\\gcd(a,b)$, es el mayor entero positivo que divide a ambos. El mínimo común múltiplo, escrito $\\operatorname{mcm}(a,b)$, es el menor entero positivo divisible por ambos. “Máximo” y “mínimo” describen conjuntos distintos: divisores comunes frente a múltiplos comunes.

Si $\\gcd(a,b)=1$, los números son coprimos o primos relativos. Ninguno necesita ser primo: $8$ y $15$ son compuestos y coprimos porque no comparten factores primos. Dos enteros consecutivos siempre son coprimos: cualquier divisor común dividiría también su diferencia, que es $1$.

EL PUNTO DE VISTA DE LOS EXPONENTES
Al escribir ambos números con los mismos primos, el MCD toma en cada primo el menor exponente, pues ese es el máximo que cabe en los dos. El MCM toma el mayor, pues debe contener suficiente de cada primo para ser múltiplo de ambos.

Para positivos,
$\\gcd(a,b)\\operatorname{mcm}(a,b)=ab$.
En cada primo, el exponente mínimo más el máximo es la suma de los dos exponentes originales. Así, ambos lados tienen exactamente la misma factorización prima. La identidad permite obtener el MCM después de conocer el MCD, pero conviene dividir antes de multiplicar para evitar números innecesariamente grandes.

POR QUÉ FUNCIONA EUCLIDES
Si $a=bq+r$, entonces $\\gcd(a,b)=\\gcd(b,r)$. En efecto, un divisor común de $a$ y $b$ divide $r=a-bq$. En sentido contrario, un divisor común de $b$ y $r$ divide $a=bq+r$. Por tanto, los pares $(a,b)$ y $(b,r)$ tienen exactamente los mismos divisores comunes.

El algoritmo repite divisiones con residuo. Cuando aparece residuo $0$, el último residuo no nulo es el MCD. No es solo una receta: cada reemplazo conserva el conjunto de divisores comunes y reduce los números hasta que el MCD queda visible.

El MCM aparece en situaciones de repetición: si dos eventos ocurren cada $a$ y $b$ unidades, el primer instante positivo en que coinciden es $\\operatorname{mcm}(a,b)$.`,
      example: `EJEMPLO 1: FACTORIZACIÓN PRIMA
$84=2^2\\cdot3\\cdot7$ y $126=2\\cdot3^2\\cdot7$. Tomando exponentes mínimos,
$\\gcd(84,126)=2\\cdot3\\cdot7=42$.
Tomando máximos,
$\\operatorname{mcm}(84,126)=2^2\\cdot3^2\\cdot7=252$.
La comprobación da $42\\cdot252=84\\cdot126=10584$.

EJEMPLO 2: ALGORITMO DE EUCLIDES COMPLETO
$252=198\\cdot1+54$,
$198=54\\cdot3+36$,
$54=36\\cdot1+18$,
$36=18\\cdot2+0$.
El último residuo no nulo es $18$, así que $\\gcd(252,198)=18$. La identidad producto da
$\\operatorname{mcm}(252,198)=252\\cdot198/18=2772$.

EJEMPLO 3: CICLOS
Dos señales se repiten cada $12$ y $18$ minutos. Como $12=2^2\\cdot3$ y $18=2\\cdot3^2$, su MCM es $2^2\\cdot3^2=36$. Si coinciden ahora, volverán a coincidir por primera vez en $36$ minutos.`,
      mistakes: 'Confundir un divisor común con el máximo, o un múltiplo común con el mínimo; tomar exponentes máximos para el MCD; creer que coprimos significa que ambos números son primos; perder un residuo en Euclides; detenerse antes del residuo cero; usar el producto $ab$ como MCM sin dividir por el MCD; o aplicar el MCD cuando el problema pide la primera coincidencia de ciclos.',
      practice: `1. Calcula $\\gcd(414,662)$ con Euclides.
2. Halla $\\operatorname{mcm}(414,662)$ usando la relación producto.
3. Calcula MCD y MCM de $72=2^3\\cdot3^2$ y $120=2^3\\cdot3\\cdot5$.
4. Prueba que $35$ y $36$ son coprimos sin factorizarlos por completo.
5. Dos actividades se repiten cada $8$ y $12$ días. ¿Después de cuántos días coinciden por primera vez?

Respuestas de control: 1. $2$; 2. $137034$; 3. MCD $24$ y MCM $360$; 4. todo divisor común divide $36-35=1$; 5. $24$ días.`,
      summary: 'El MCD reúne los factores compartidos con exponentes mínimos; el MCM reúne todos los necesarios con exponentes máximos. Euclides funciona porque reemplazar $(a,b)$ por $(b,r)$ conserva los divisores comunes. Coprimalidad significa MCD igual a $1$, no primalidad individual.',
    },
    steps: [
      { title: 'Separa divisores, múltiplos y coprimalidad', description: 'Estudia las definiciones y construye ejemplos que distingan MCD, MCM y pares coprimos compuestos.' },
      { title: 'Justifica y ejecuta Euclides', description: 'Reconstruye por qué el residuo conserva los divisores comunes y repite el algoritmo completo para $252$ y $198$.' },
      { title: 'Alterna factorización, Euclides y ciclos', description: 'Resuelve los cinco ejercicios eligiendo el método que muestre mejor exponentes, residuos o coincidencias.' },
      { title: 'Comprueba con productos y diferencias', description: 'Verifica la relación MCD–MCM, cada división con residuo y el argumento de coprimalidad de números consecutivos.' },
    ],
  }),
  L({
    pathSlug: 'bezout-y-combinaciones-lineales', area: 'number-theory', title: 'Bézout y combinaciones lineales: guía esencial',
    summary: 'Cómo convertir el algoritmo de Euclides en representaciones enteras y criterios de solvencia.',
    article: {
      introduction: 'Aprenderás a expresar el máximo común divisor como combinación de dos enteros y a decidir cuándo una ecuación $ax+by=c$ admite soluciones enteras. La identidad de Bézout continúa de manera natural el algoritmo de Euclides.',
      ideas: `COMBINACIONES LINEALES ENTERAS
Una combinación lineal entera de $a$ y $b$ es un número de la forma $ax+by$, donde $x$ e $y$ son enteros, posiblemente negativos o cero. Si $d$ divide a $a$ y a $b$, entonces divide toda combinación $ax+by$: al escribir $a=dr$ y $b=ds$, queda $ax+by=d(rx+sy)$.

IDENTIDAD DE BÉZOUT
La identidad de Bézout afirma que existen enteros $x,y$ tales que
$ax+by=\\gcd(a,b)$.
Conceptualmente, el MCD no solo divide toda combinación: es la menor cantidad positiva que puede obtenerse de esta forma. Cuando $a$ y $b$ son coprimos, su MCD es $1$, así que alguna combinación entera de ellos vale $1$. Los coeficientes pueden ser negativos y normalmente no son únicos.

EUCLIDES EXTENDIDO
Para encontrar los coeficientes, primero ejecuta el algoritmo de Euclides. Luego toma el último residuo no nulo y sustituye hacia atrás cada residuo usando la igualdad anterior. En cada línea conserva paréntesis y reúne coeficientes; así se reducen errores de signo. El proceso termina expresando el MCD mediante los dos números originales.

QUÉ ENTEROS PUEDEN REPRESENTARSE
Sea $d=\\gcd(a,b)$. Toda combinación $ax+by$ es múltiplo de $d$, porque $d$ divide a ambos términos. En sentido contrario, Bézout da $ax_0+by_0=d$ para ciertos $x_0,y_0$. Multiplicar por cualquier entero $k$ produce
$a(kx_0)+b(ky_0)=kd$.
Por tanto, los enteros representables son exactamente los múltiplos del MCD.

Se sigue el criterio de solvencia: $ax+by=c$ tiene soluciones enteras si y solo si $\\gcd(a,b)\\mid c$. La divisibilidad decide existencia. Este Path no busca describir todas las soluciones; su objetivo es construir una representación y distinguir lo posible de lo imposible.`,
      example: `EJEMPLO 1: REPRESENTAR $1$ MEDIANTE EUCLIDES
Como $35$ y $22$ son coprimos, ejecutamos:
$35=22+13$,
$22=13+9$,
$13=9+4$,
$9=2\\cdot4+1$.
Ahora sustituimos hacia atrás:
$1=9-2\\cdot4$,
$1=9-2(13-9)=3\\cdot9-2\\cdot13$,
$1=3(22-13)-2\\cdot13=3\\cdot22-5\\cdot13$,
$1=3\\cdot22-5(35-22)=8\\cdot22-5\\cdot35$.
Así, $35(-5)+22(8)=1$. Una verificación directa da $-175+176=1$.

EJEMPLO 2: ESCALAR LA REPRESENTACIÓN
Multiplicando la última igualdad por $7$ obtenemos
$35(-35)+22(56)=7$.
Por tanto, $35x+22y=7$ tiene, por ejemplo, la solución entera $x=-35$, $y=56$.

EJEMPLO 3: DETECTAR IMPOSIBILIDAD
$\\gcd(18,30)=6$. Toda combinación $18x+30y$ es múltiplo de $6$, pero $7$ no lo es. En consecuencia, $18x+30y=7$ no tiene soluciones enteras. En cambio, $18(-1)+30(1)=12$ muestra una solución para el objetivo $12$, que sí es múltiplo de $6$.`,
      mistakes: 'Buscar solo coeficientes positivos; confundir combinación lineal con producto; detener Euclides antes del último residuo no nulo; sustituir hacia atrás perdiendo paréntesis o signos; afirmar que todo entero es representable aunque el MCD no sea $1$; escalar el resultado sin escalar ambos coeficientes; o concluir imposibilidad sin comprobar si el MCD divide al objetivo.',
      practice: `1. Usa Euclides extendido para demostrar $1=26(-4)+15(7)$.
2. Escala esa identidad para representar $7$ como $26x+15y$.
3. Decide si $18x+30y=25$ tiene soluciones enteras y justifica sin probar valores.
4. Encuentra una representación de $12$ como $18x+30y$.
5. Explica por qué toda combinación $42x+30y$ es múltiplo de $6$.

Respuestas de control: 1. las sustituciones dan $1=7\\cdot15-4\\cdot26$; 2. $x=-28$, $y=49$; 3. no, porque $6\\nmid25$; 4. $x=-1$, $y=1$; 5. $42x+30y=6(7x+5y)$.`,
      summary: 'Toda combinación de $a,b$ es múltiplo de su MCD, y Bézout garantiza que el propio MCD puede construirse como combinación entera. Las sustituciones hacia atrás en Euclides encuentran coeficientes. Así, $ax+by=c$ es soluble en enteros exactamente cuando el MCD divide a $c$.',
    },
    steps: [
      { title: 'Conecta combinaciones con divisibilidad', description: 'Estudia la definición y demuestra por qué un divisor común de $a,b$ divide automáticamente cualquier combinación $ax+by$.' },
      { title: 'Reconstruye Euclides hacia atrás', description: 'Repite todas las divisiones para $35,22$ y cada sustitución hasta verificar $35(-5)+22(8)=1$.' },
      { title: 'Decide existencia y construye ejemplos', description: 'Resuelve los cinco ejercicios, usando primero el MCD para decidir posibilidad y después escalando una identidad cuando corresponda.' },
      { title: 'Audita signos y criterios de solvencia', description: 'Comprueba cada combinación por sustitución directa y explica por qué los casos imposibles fallan antes de buscar coeficientes.' },
    ],
  }),
  combinatoricsLesson('principio-aditivo-y-multiplicativo', 'Principios aditivo y multiplicativo',
    'Cómo dividir elecciones en casos o etapas sin omitir ni contar dos veces.',
    'Si opciones incompatibles se separan en casos, sus cantidades se suman. Si una construcción tiene etapas y cada elección de una etapa puede combinarse con las siguientes, las cantidades se multiplican. Antes de operar, pregunta si estás eligiendo “esto o aquello” o “esto y después aquello”. Los casos aditivos deben ser disjuntos.',
    'Con dígitos $1,2,3,4$, números de dos cifras sin repetición: 4 opciones para la decena y 3 para la unidad, total 12. Si se permiten números de una o dos cifras, se suman 4 y 12: total 16.',
    'Sumar etapas; multiplicar casos alternativos; contar casos superpuestos; cambiar el número de opciones sin registrarlo; o ignorar restricciones como cero inicial y repetición.',
    'Cuenta palabras de longitud 3 sobre $\\{A,B,C\\}$ sin repetición. Luego cuenta las de longitud 1, 2 o 3 y explica dónde sumas y dónde multiplicas.'),
  combinatoricsLesson('permutaciones-y-combinaciones', 'Permutaciones y combinaciones',
    'Ordenar o seleccionar: dos preguntas distintas con fórmulas que deben comprenderse.',
    'Ordenar $n$ objetos distintos da $n!$. Elegir y ordenar $k$ de $n$ da $n(n-1)\\cdots(n-k+1)$. Elegir sin importar orden da $\\binom nk=n!/(k!(n-k)!)$, porque cada conjunto elegido aparece en $k!$ órdenes. Decide primero si el orden cambia el resultado.',
    'De 8 estudiantes, comités de 3: $\\binom83=56$. Presidenta, secretaria y tesorera: $8\\cdot7\\cdot6=336$. Son los mismos tamaños, pero en el segundo caso los cargos distinguen el orden.',
    'Usar combinaciones cuando hay cargos; contar objetos repetidos como distintos; olvidar restricciones; o aplicar una fórmula antes de definir qué constituye un resultado.',
    'Cuenta cadenas de 4 letras distintas tomadas de 7 y comités de 4 entre 7. Explica por qué los resultados difieren por un factor de $4!$.'),
  L({
    pathSlug: 'principio-de-casillas', area: 'combinatorics', title: 'Principio de casillas: forzar coincidencias',
    summary: 'Cómo reconocer objetos, casillas y el umbral que garantiza una acumulación.',
    article: {
      introduction: 'El principio de casillas convierte una comparación de cantidades en una garantía. No dice dónde ocurre la coincidencia; dice que evitarla es imposible.',
      ideas: 'Si más de $n$ objetos se colocan en $n$ casillas, alguna contiene al menos dos. En general, al distribuir $N$ objetos en $k$ casillas, alguna recibe al menos $\\lceil N/k\\rceil$. La dificultad suele ser elegir casillas que representen la propiedad buscada.',
      example: 'Entre 13 personas, dos nacieron en el mismo mes. Los objetos son personas y las 12 casillas son meses. Si cada mes tuviera a lo más una, habría a lo más 12 personas, contradiciendo que hay 13.',
      mistakes: 'No definir objetos/casillas; usar casillas que no implican la conclusión; olvidar el techo; afirmar exactamente dos cuando solo se garantiza al menos dos; o ignorar que una persona pertenece a una sola casilla.',
      practice: 'Demuestra que entre seis enteros hay dos con el mismo residuo módulo 5. Después muestra que entre 21 objetos repartidos en 4 cajas alguna contiene al menos 6.',
      summary: 'Modela una propiedad común como casilla y compara el número de objetos con la capacidad total que evitaría la coincidencia.',
    },
    steps: [
      { title: 'Identifica objetos y casillas', description: 'Desarma el ejemplo de los meses y explica por qué cada persona ocupa exactamente una casilla.' },
      { title: 'Usa la forma general', description: 'Calcula qué garantiza distribuir 21 objetos en 4 cajas y justifica el techo.' },
      { title: 'Elige casillas matemáticas', description: 'Resuelve el ejercicio de residuos módulo 5 definiendo con precisión las cinco casillas.' },
      { title: 'Revisa lo que realmente se fuerza', description: 'Distingue “al menos”, “exactamente” y “como máximo” en tres conclusiones propuestas.' },
    ],
  }),
  numberTheoryLesson('representacion-en-distintas-bases', 'Representación en distintas bases',
    'Valor posicional, conversiones y lectura algebraica de una escritura digital.',
    'En base $b\\ge2$ se usan dígitos de 0 a $b-1$. La escritura $(a_ka_{k-1}\\cdots a_0)_b$ representa $a_kb^k+\\cdots+a_1b+a_0$. Para pasar de decimal a base $b$, divide repetidamente entre $b$ y lee los residuos de abajo hacia arriba. La representación sin ceros iniciales es única.',
    'Convertir $45$ a base 2: divisiones sucesivas producen residuos $1,0,1,1,0,1$ leídos al revés, así $45=(101101)_2$. Verificación: $32+8+4+1=45$.',
    'Permitir un dígito igual a la base; leer una escritura como producto; olvidar el orden de residuos; o aplicar criterios decimales en otra base sin volver a demostrarlo.',
    'Convierte $83$ a base 3 y $(231)_4$ a decimal. Explica por qué todo número que termina en 0 en base $b$ es múltiplo de $b$.',
    [{ code: 'PUTNAM-2023-A5', label: 'Suma con signos alternantes en base 3' }, { code: 'PUTNAM-2023-B2', label: 'Mínimo de unos en la representación binaria de 2023n' }]),
  numberTheoryLesson('problemas-de-digitos', 'Problemas de dígitos',
    'Traducir condiciones sobre cifras a ecuaciones y restricciones aritméticas.',
    'Un número de dos cifras $\\overline{ab}$ significa $10a+b$, con $1\\le a\\le9$ y $0\\le b\\le9$. Invertir cifras da $10b+a$ si $b$ puede ser inicial en la nueva escritura. La suma de dígitos y el último dígito conectan con divisibilidad; en otras bases cambia la potencia posicional.',
    'Si un número de dos cifras supera en 27 al número con cifras invertidas, $(10a+b)-(10b+a)=9(a-b)=27$, así $a-b=3$. Después se aplican las restricciones de dígitos para enumerar posibilidades.',
    'Tratar $\\overline{ab}$ como $a\\cdot b$; olvidar que el primer dígito no es cero; aceptar soluciones algebraicas fuera de 0–9; o enumerar antes de extraer la ecuación.',
    'Encuentra los números de dos cifras cuyo valor es cuatro veces la suma de sus dígitos. Organiza las restricciones antes de probar valores.',
    [{ code: 'PUTNAM-2023-A5', label: 'Suma con signos alternantes en base 3' }, { code: 'PUTNAM-2023-B2', label: 'Mínimo de unos en la representación binaria de 2023n' }]),
  L({
    pathSlug: 'entrenamiento-mixto-ciclo-1', area: 'mixed', title: 'Entrenamiento mixto — Ciclo 1',
    summary: 'Una práctica introductoria para elegir herramientas sin que el tema venga anunciado.',
    article: {
      introduction: 'En una práctica mixta, la primera tarea es reconocer la estructura. Este conjunto no es un examen oficial ni imita una competencia específica; es material editorial de TeacherPeri para integrar el Ciclo 1.',
      ideas: 'Trabaja sin etiquetas de tema. Para cada problema registra: datos, objetivo, dos observaciones, herramienta elegida y revisión. Da 15–25 minutos por problema antes de usar la pista. Al final clasifica por la idea decisiva, no por la apariencia.',
      example: 'Problema A: demuestra que entre siete enteros hay dos cuya diferencia es múltiplo de 6. Pista: clasifica por residuo módulo 6. Solución breve: hay seis residuos posibles; por casillas, dos enteros comparten residuo y su diferencia es múltiplo de 6.',
      mistakes: 'Buscar una fórmula por palabra clave; anunciar el tema antes de explorar; abandonar sin registrar nada; o medir el resultado solo por respuestas correctas.',
      practice: 'B) Un rectángulo tiene diagonal 13 y un lado 5: encuentra el otro. C) Factoriza $n^2-1$ y prueba que es múltiplo de 8 cuando $n$ es impar. D) ¿Cuántos números de tres cifras distintas pueden formarse con $1,2,3,4$? E) En base 3, convierte $(1021)_3$ a decimal.',
      summary: 'La meta es seleccionar y justificar herramientas básicas: casillas, Pitágoras, factorización, conteo y valor posicional.',
    },
    steps: [
      { title: 'Prepara una hoja de decisiones', description: 'Crea columnas para datos, objetivo, observaciones, herramienta y revisión; no escribas todavía nombres de temas.' },
      { title: 'Resuelve el bloque A–C', description: 'Trabaja el problema de residuos, el rectángulo y la divisibilidad. Escribe una solución verificable para al menos dos.' },
      { title: 'Resuelve el bloque D–E', description: 'Cuenta las escrituras y convierte la representación ternaria, justificando restricciones y valor posicional.' },
      { title: 'Haz la revisión cruzada', description: 'Clasifica cada problema por su idea decisiva, registra un error y elige uno para repetir dentro de una semana.' },
    ],
  }),
]

function combinatoricsLesson(pathSlug, title, summary, ideas, example, mistakes, practice) {
  return topicLesson(pathSlug, 'combinatorics', title, summary, ideas, example, mistakes, practice)
}
function numberTheoryLesson(pathSlug, title, summary, ideas, example, mistakes, practice, challengeProblems = []) {
  return topicLesson(pathSlug, 'number-theory', title, summary, ideas, example, mistakes, practice, challengeProblems)
}

function topicLesson(pathSlug, area, title, summary, ideas, example, mistakes, practice, challengeProblems = []) {
  const challengeStep = challengeProblems.length
    ? {
        title: 'Explora desafíos opcionales',
        description: 'Después de dominar la guía, intenta estos problemas avanzados existentes. Su procedencia requiere revisión y no deben presentarse como material oficial verificado.',
        problemCodes: challengeProblems.map(({ code }) => code),
      }
    : { title: `Consolida ${title.toLowerCase()}`, description: practice }
  return L({
    pathSlug, area, title: `${title}: guía esencial`, summary,
    article: {
      introduction: `${summary} En olimpiadas, la herramienta importa porque reduce una pregunta desconocida a relaciones que ya puedes controlar.`,
      ideas,
      example,
      mistakes,
      practice,
      summary: `Reconoce la estructura, aplica ${title.toLowerCase()} con condiciones claras y verifica que la conclusión responde exactamente al problema.`,
    },
    steps: [
      { title: `Construye la idea de ${title.toLowerCase()}`, description: 'Estudia la guía, reproduce sus definiciones y explica con tus palabras por qué la herramienta funciona.' },
      { title: `Reconstruye el ejemplo de ${title.toLowerCase()}`, description: 'Oculta el texto y vuelve a resolver el ejemplo, justificando cada transformación o relación.' },
      { title: `Practica ${title.toLowerCase()}`, description: practice },
      challengeStep,
    ],
  })
}
