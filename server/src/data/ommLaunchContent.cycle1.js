import { defineLesson as L } from './ommLaunchContent.helpers.js'

export const OMM_CYCLE_1_LESSONS = [
  geometryLesson('angulos-paralelas-y-perpendiculares', 'Ángulos, paralelas y perpendiculares',
    'Relaciones angulares que permiten convertir un dibujo en una cadena de igualdades justificadas.',
    'Los ángulos opuestos por el vértice son iguales. Una transversal sobre paralelas produce ángulos correspondientes y alternos internos iguales; los interiores del mismo lado suman $180^\\circ$. En un triángulo, los ángulos interiores suman $180^\\circ$. Dos rectas perpendiculares forman cuatro ángulos rectos.',
    'En un triángulo $ABC$, por $A$ pasa una recta paralela a $BC$. Los ángulos que $AB$ y $AC$ forman con esa paralela son iguales a $B$ y $C$ por alternos internos. Junto con $A$ forman un ángulo llano; por eso $A+B+C=180^\\circ$.',
    'Buscar ángulos iguales por apariencia; confundir correspondientes con suplementarios; o usar que dos rectas son paralelas sin que esté dado o demostrado.',
    'Dibuja dos paralelas con una transversal y etiqueta todos los ángulos a partir de uno de $37^\\circ$. Después resuelve un triángulo con ángulos $2x$, $3x$ y $4x$.'),
  geometryLesson('semejanza-y-congruencia', 'Semejanza y congruencia',
    'Criterios para reconocer figuras con la misma forma o exactamente el mismo tamaño.',
    'Triángulos congruentes coinciden en lados y ángulos; criterios frecuentes: LLL, LAL y ALA. Triángulos semejantes tienen ángulos correspondientes iguales y lados correspondientes proporcionales; bastan AA, LAL proporcional o LLL proporcional. El orden de correspondencia evita mezclar razones.',
    'Si en $\\triangle ABC$ un segmento $DE$ une $AB$ y $AC$ con $DE\\parallel BC$, entonces $\\angle ADE=\\angle ABC$ y $\\angle AED=\\angle ACB$. Por AA, $\\triangle ADE\\sim\\triangle ABC$, de modo que $AD/AB=AE/AC=DE/BC$.',
    'Usar AAA para congruencia; formar razones con lados no correspondientes; concluir semejanza solo porque el dibujo “se parece”; o olvidar que la escala afecta longitudes.',
    'En un triángulo, una paralela corta dos lados en razones $2:5$ y $x:20$. Encuentra $x$ justificando primero la semejanza. Luego busca dos triángulos ocultos en una figura con líneas cruzadas.'),
  geometryLesson('areas-y-razones', 'Áreas y razones',
    'Comparaciones de área que evitan calcular longitudes innecesarias.',
    'El área de un triángulo es $bh/2$. Con la misma altura, las áreas están en la razón de sus bases; con la misma base, en la razón de sus alturas. Cortar y recomponer conserva área. Si dos figuras semejantes tienen razón lineal $k$, su razón de áreas es $k^2$.',
    'Un punto $D$ divide $BC$ con $BD:DC=2:3$. Los triángulos $ABD$ y $ADC$ comparten la altura desde $A$ a $BC$, así que $[ABD]:[ADC]=BD:DC=2:3$. No fue necesario conocer la altura.',
    'Comparar bases sin comprobar una altura común; sumar razones en vez de áreas; creer que escala $k$ produce área $k$; o calcular todo cuando basta una comparación.',
    'Divide un triángulo con una ceviana cuya base queda en razón $3:4$ y determina qué fracción del área ocupa cada parte. Después compara áreas de dos triángulos entre paralelas.'),
  geometryLesson('teorema-de-pitagoras', 'Teorema de Pitágoras',
    'Relaciones métricas en triángulos rectángulos y cómo crear el triángulo auxiliar adecuado.',
    'En un triángulo rectángulo con catetos $a,b$ e hipotenusa $c$, $a^2+b^2=c^2$. El converse también vale: si el lado mayor satisface esa igualdad, el triángulo es rectángulo. En coordenadas, la distancia surge al formar catetos horizontal y vertical.',
    'Un rectángulo mide 6 por 8. Su diagonal es la hipotenusa de un triángulo rectángulo: $d^2=6^2+8^2=100$, así que $d=10$. La misma construcción permite comparar caminos o introducir una altura.',
    'Aplicar la fórmula a cualquier triángulo; no identificar la hipotenusa; olvidar que una longitud es positiva; o usar valores decimales antes de simplificar cuadrados.',
    'Calcula la distancia entre $(1,2)$ y $(7,10)$. Luego decide si un triángulo de lados 7, 24 y 25 es rectángulo usando el converse.'),
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

function geometryLesson(pathSlug, title, summary, ideas, example, mistakes, practice) {
  return topicLesson(pathSlug, 'geometry', title, summary, ideas, example, mistakes, practice)
}
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
