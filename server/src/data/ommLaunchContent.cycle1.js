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
  algebraLesson('factorizacion-e-identidades', 'Factorización e identidades',
    'Transformaciones que revelan productos, ceros y divisibilidad.',
    'Identidades básicas: $a^2-b^2=(a-b)(a+b)$, $(a\\pm b)^2=a^2\\pm2ab+b^2$, y $a^3-b^3=(a-b)(a^2+ab+b^2)$. Antes de expandir, busca factor común, agrupación o una forma notable. Factorizar sirve para resolver, comparar signos y demostrar divisibilidad.',
    'Para calcular $1001^2-999^2$, usa diferencia de cuadrados: $(1001-999)(1001+999)=2\\cdot2000=4000$. La estructura evita multiplicaciones largas.',
    'Aplicar una identidad con signo equivocado; factorizar parcialmente; cancelar términos de una suma; o expandir una expresión cuya forma factorizada contiene la idea.',
    'Factoriza $x^2-9$, $3x^2+6x$ y $x^3-8$. Después demuestra que la diferencia de cuadrados de dos enteros impares es múltiplo de 8.'),
  algebraLesson('manipulaciones-y-sustituciones-algebraicas', 'Manipulaciones y sustituciones algebraicas',
    'Cómo elegir una transformación que preserve información y acerque el objetivo.',
    'Manipular con propósito significa saber qué forma buscas: simetría, factor, cuadrado, suma fija o variable auxiliar. Toda operación debe respetar dominio y equivalencia. Una sustitución útil comprime una expresión repetida; por ejemplo, si aparecen $x+y$ y $xy$, nómbralos en vez de expandir sin control.',
    'Si $x+1/x=3$, no necesitas hallar $x$ para calcular $x^2+1/x^2$. Al cuadrar: $x^2+2+1/x^2=9$, luego $x^2+1/x^2=7$. La condición $x\\neq0$ ya está implícita.',
    'Elevar al cuadrado y olvidar soluciones extra; dividir por una expresión que podría ser cero; sustituir sin traducir la respuesta; o hacer pasos reversibles en una sola dirección sin indicarlo.',
    'Si $a+b=7$ y $ab=10$, calcula $a^2+b^2$ y $(a-b)^2$ sin resolver primero para $a,b$. Anota por qué cada transformación es válida.'),
  algebraLesson('ecuaciones-algebraicas', 'Ecuaciones algebraicas',
    'Resolver preservando equivalencias y usando la estructura antes que la rutina.',
    'Una solución debe satisfacer la ecuación original. Simplifica ambos lados, controla denominadores y busca factorización. Para $uv=0$, se usa la propiedad del producto cero. Las transformaciones como sumar lo mismo son equivalentes; cuadrar o multiplicar por una expresión variable puede introducir o perder casos y exige verificación.',
    'Resuelve $x^2-5x=0$: factoriza $x(x-5)=0$, por lo que $x=0$ o $x=5$. Ambas funcionan. En cambio, de $\\sqrt{x}=x-2$, cuadrar da candidatos que deben comprobarse y además requiere $x\\ge0$ y $x-2\\ge0$.',
    'Dividir entre una variable y perder la solución cero; confundir una identidad con una ecuación; aceptar raíces extra; o no declarar restricciones de denominadores y radicales.',
    'Resuelve $(x-2)(x+3)=0$ y $1/(x-1)=2$, indicando restricciones. Luego crea una ecuación cuyo conjunto solución sea exactamente $\\{-2,4\\}$.'),
  numberTheoryLesson('divisibilidad-y-criterios-de-divisibilidad', 'Divisibilidad y criterios',
    'Lenguaje y herramientas iniciales para reconocer múltiplos sin depender de divisiones largas.',
    'Escribimos $a\\mid b$ si existe un entero $k$ con $b=ak$. Si $a\\mid b$ y $a\\mid c$, entonces $a\\mid mb+nc$ para enteros $m,n$. Los criterios decimales provienen de residuos de potencias de 10: módulo 3 y 9 importa la suma de dígitos; módulo 11, la suma alternada.',
    'Para $5382$, la suma de dígitos es 18, así que es divisible por 9. Para 11, $5-3+8-2=8$, que no es múltiplo de 11; por tanto no es divisible por 11.',
    'Tratar $a\\mid b$ como una fracción; invertir la relación; aplicar criterios fuera de base 10 sin justificación; o concluir divisibilidad de una suma cuando solo un sumando es divisible.',
    'Decide divisibilidad por 3, 4, 8, 9 y 11 de 123552. Después demuestra el criterio de 3 escribiendo el número con potencias de 10.'),
  numberTheoryLesson('primos-y-factorizacion', 'Primos y factorización',
    'Cómo descomponer enteros y usar exponentes primos para comparar productos.',
    'Un primo mayor que 1 tiene exactamente dos divisores positivos. Todo entero mayor que 1 se expresa de manera única, salvo orden, como producto de primos. La factorización permite leer divisores: si $n=p_1^{a_1}\\cdots p_r^{a_r}$, cada divisor elige exponentes entre 0 y $a_i$. Para probar primalidad basta revisar primos hasta la raíz cuadrada.',
    '$360=2^3\\cdot3^2\\cdot5$. Un divisor tiene forma $2^a3^b5^c$ con $0\\le a\\le3$, $0\\le b\\le2$, $0\\le c\\le1$; por eso hay $4\\cdot3\\cdot2=24$ divisores positivos.',
    'Llamar primo al 1; detener la búsqueda de divisores demasiado pronto; omitir multiplicidades; o creer que una factorización observada sin prueba es única.',
    'Factoriza 756, cuenta sus divisores y decide cuáles son cuadrados. Luego explica por qué un compuesto $n$ tiene un divisor primo no mayor que $\\sqrt n$.'),
  numberTheoryLesson('mcd-mcm-y-algoritmo-de-euclides', 'MCD, MCM y algoritmo de Euclides',
    'Cálculo eficiente y relaciones estructurales entre divisores comunes y múltiplos.',
    'El MCD es el mayor divisor positivo común; el MCM, el menor múltiplo positivo común. Euclides usa $\\gcd(a,b)=\\gcd(b,r)$ cuando $a=bq+r$. Para positivos, $\\gcd(a,b)\\operatorname{mcm}(a,b)=ab$. La factorización toma mínimos de exponentes para MCD y máximos para MCM.',
    '$252=198\\cdot1+54$, $198=54\\cdot3+36$, $54=36\\cdot1+18$, $36=18\\cdot2$. Por tanto $\\gcd(252,198)=18$ y el MCM es $252\\cdot198/18=2772$.',
    'Confundir MCD con un divisor común cualquiera; usar el producto sin dividir por el MCD; cometer errores de residuo; o detener Euclides antes del último residuo no nulo.',
    'Calcula $\\gcd(414,662)$ con Euclides y verifica por factorización. Después halla el MCM y explica qué representa en un problema de ciclos.'),
  numberTheoryLesson('bezout-y-combinaciones-lineales', 'Bézout y combinaciones lineales',
    'Cómo convertir el algoritmo de Euclides en representaciones y criterios de solvencia.',
    'La identidad de Bézout afirma que existen enteros $x,y$ con $ax+by=\\gcd(a,b)$. Al sustituir hacia atrás en Euclides se encuentran. Los valores que pueden escribirse como $ax+by$ son exactamente los múltiplos del MCD; por ello $ax+by=c$ tiene soluciones enteras si y solo si $\\gcd(a,b)\\mid c$.',
    'Euclides: $35=22+13$, $22=13+9$, $13=9+4$, $9=2\\cdot4+1$. Sustituyendo hacia atrás se obtiene $1=8\\cdot22-5\\cdot35$. Así también $7=56\\cdot22-35\\cdot35$.',
    'Buscar coeficientes solo positivos; afirmar existencia sin comprobar la divisibilidad por el MCD; perder signos al sustituir; o creer que la representación es única.',
    'Encuentra $x,y$ tales que $26x+15y=1$. Usa esa identidad para resolver $26x+15y=7$ y explica por qué $26x+15y=4$ también es soluble.'),
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

function algebraLesson(pathSlug, title, summary, ideas, example, mistakes, practice) {
  return topicLesson(pathSlug, 'algebra', title, summary, ideas, example, mistakes, practice)
}
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
