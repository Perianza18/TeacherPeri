import { THEORY_WRITING_LAB } from './theoryWritingLab.js'
import { EDITORIAL_BATCH } from './editorialBatch.js'
import { OMM_LAUNCH_CONTENT_BATCH_1 } from './ommLaunchContent.js'
import { defineLesson } from './ommLaunchContent.helpers.js'
import { MVP_PROBLEMS } from './mvpProblems.js'

// The reviewed algebra, geometry and number theory articles remain intact.
// These additions deepen the initially shorter counting and digit lessons.
const additions = {
  'principio-aditivo-y-multiplicativo': String.raw`MODELAR ANTES DE CONTAR
Un resultado debe describirse sin ambigüedad. Si una clave lleva una letra y dos dígitos, dos claves son diferentes cuando cambia alguna posición. El principio multiplicativo exige que cada prefijo tenga el mismo número de continuaciones; no exige que las elecciones sean independientes en sentido probabilístico. Cuando no hay repetición, las opciones disminuyen y eso se registra en cada etapa.

Si las continuaciones dependen de lo elegido, divide en casos y suma los conteos. Para formar números de dos cifras con $0,1,2,3$ sin repetir, la decena tiene tres opciones y la unidad otras tres: son nueve. Pero para números pares hay dos casos. Si terminan en cero, hay tres decenas posibles. Si terminan en dos, hay dos decenas posibles (uno o tres). Total: cinco. Multiplicar tres por dos sin distinguir los casos contaría ilegalmente el número con dos en ambas posiciones.

POR QUÉ FUNCIONAN LOS PRINCIPIOS
En una unión de conjuntos disjuntos, cada elemento se cuenta exactamente una vez; por eso se suman sus tamaños. En etapas con $a$ primeros pasos y $b$ continuaciones por cada primero, los resultados se separan en $a$ grupos de tamaño $b$, así que hay $ab$. Dibuja un árbol de opciones pequeño para comprobar que cada hoja corresponde a un resultado único.

CONTROL DE RESPUESTAS
Las palabras de tres letras distintas sobre $\{A,B,C\}$ son $3\cdot2\cdot1=6$. Las de longitud uno, dos o tres son $3+6+6=15$. Cada longitud es un caso disjunto y cada posición es una etapa.`,
  'permutaciones-y-combinaciones': String.raw`POR QUÉ SE DIVIDE POR $k!$
Primero contamos listas ordenadas de $k$ personas distintas: hay $n(n-1)\cdots(n-k+1)$. Si solo interesa el grupo, cada grupo se contó una vez por cada orden de sus $k$ miembros, exactamente $k!$ veces. Dividir funciona porque todos los grupos tienen la misma multiplicidad. Si una restricción cambia esa multiplicidad, no se puede dividir automáticamente.

Para $0\le k\le n$, la elección sin orden es $\binom nk$. Elegir a las personas que entran equivale a elegir las que quedan fuera, por lo que $\binom nk=\binom n{n-k}$. Un comité vacío tiene una única elección; de ahí $0!=1$ y $\binom n0=1$. Estas convenciones conservan el significado combinatorio.

RESTRICCIONES Y BLOQUES
Si Ana y Bruno deben estar juntos en una fila de cinco personas, considéralos un bloque. Quedan cuatro unidades distintas y dos órdenes internos del bloque: hay $4!\cdot2=48$. Cada fila admisible determina un único orden de unidades y un único orden interno; esa correspondencia justifica el producto.

Si se exige al menos una persona de un grupo especial, puede ser más fácil contar todos los comités y restar los que no contienen a ninguna. La resta es válida porque los excluidos forman un subconjunto bien definido. No restes dos grupos superpuestos sin revisar la intersección.

CONTROL DE RESPUESTAS
Las cadenas de cuatro letras distintas tomadas de siete son $7\cdot6\cdot5\cdot4=840$. Los comités de cuatro entre siete son $\binom74=35$. Su cociente es $24=4!$: cada comité admite veinticuatro órdenes.`,
  'principio-de-casillas': String.raw`LA PRUEBA Y EL UMBRAL
Si cada una de $k$ casillas tuviera como máximo $r$ objetos, habría como máximo $kr$ en total. Por contraposición, con $kr+1$ objetos alguna casilla contiene al menos $r+1$. La forma con techo expresa exactamente esa idea. Tener $kr$ objetos no obliga a superar $r$: pueden repartirse uniformemente.

ELEGIR CASILLAS QUE PRODUZCAN LA CONCLUSIÓN
Para forzar una diferencia divisible por seis, clasifica enteros por sus residuos $0,1,2,3,4,5$. Dos en la misma casilla se escriben $6u+r$ y $6v+r$; su diferencia es $6(u-v)$. No basta anunciar casillas: hay que explicar por qué compartirlas implica la propiedad pedida.

Otro diseño: entre seis números distintos de uno a diez, dos suman once. Las casillas son las parejas $\{1,10\},\{2,9\},\{3,8\},\{4,7\},\{5,6\}$. Seis elecciones en cinco casillas fuerzan una pareja completa. Si los números pudieran repetirse, dos objetos en esa casilla podrían representar el mismo número; la hipótesis de distintos es esencial.

APLICACIÓN GEOMÉTRICA
Cinco puntos dentro de un cuadrado de lado dos tienen dos puntos a distancia a lo más $\sqrt2$. Divide el cuadrado en cuatro cuadrados de lado uno. Asigna los puntos de las fronteras a una sola casilla mediante una regla fija. Dos puntos caen en la misma y su distancia no supera su diagonal, $\sqrt{1^2+1^2}$. La conclusión combina casillas con Pitágoras.

CONTROL DE RESPUESTAS
Seis enteros entre cinco residuos fuerzan un par igual módulo cinco. Si veintiún objetos ocupan cuatro cajas y todas tuvieran a lo más cinco, habría a lo más veinte: alguna tiene al menos seis.`,
  'representacion-en-distintas-bases': String.raw`POR QUÉ LAS DIVISIONES RECONSTRUYEN LAS CIFRAS
El algoritmo de división escribe $N=bq+r$ con $0\le r<b$. El residuo $r$ es precisamente la cifra de unidades en base $b$. Al repetir con $q$, se obtiene la cifra siguiente; la lectura se hace de abajo hacia arriba porque la primera división revela la última posición.

Para convertir $45$ a binario: $45=2\cdot22+1$, $22=2\cdot11+0$, $11=2\cdot5+1$, $5=2\cdot2+1$, $2=2\cdot1+0$, $1=2\cdot0+1$. Leídos al revés los residuos dan $(101101)_2$. La comprobación es $32+8+4+1=45$.

UNIDAD, CERO Y UNICIDAD
Una cifra cero indica una posición vacía y no puede omitirse en el interior. $(101)_2$ y $(11)_2$ valen cinco y tres. Las cifras deben ser menores que la base; una escritura con un dígito tres no es válida en base tres. Ceros iniciales no cambian el valor, pero no cuentan como cifras significativas al hablar de longitud.

La representación es única: el residuo módulo $b$ determina la última cifra; luego el cociente determina la siguiente del mismo modo. Repetir este argumento determina todas las posiciones. Para un entero positivo de $k$ cifras en base $b$, $b^{k-1}\le N<b^k$. Este intervalo permite revisar la longitud sin efectuar toda la conversión.

CONTROL DE RESPUESTAS
$(1021)_3=27+6+1=34$. En sentido contrario, $34=3\cdot11+1$, $11=3\cdot3+2$, $3=3\cdot1+0$ y $1=3\cdot0+1$ recuperan las mismas cifras.`,
  'problemas-de-digitos': String.raw`CONVERTIR UNA ESCRITURA EN ECUACIÓN
El símbolo $\overline{ab}$ no es un producto: es el valor $10a+b$. Las restricciones $1\le a\le9$ y $0\le b\le9$ son parte del sistema, no una revisión opcional al final. Si el número invertido también debe tener dos cifras, añade $b\ge1$.

Al sumar el número y su inversión aparece $11(a+b)$; al restarlos aparece $9(a-b)$. Por ello toda diferencia de dos escrituras invertidas de dos cifras es múltiplo de nueve. Esta observación detecta imposibilidad antes de enumerar: una diferencia de veinte nunca se obtiene así.

EJEMPLO CON DOS CONDICIONES
Si la suma de ambas escrituras es $110$ y la diferencia positiva es $36$, entonces $a+b=10$ y $a-b=4$. Al sumar ecuaciones, $2a=14$, de donde $a=7$ y $b=3$. Las cifras cumplen las restricciones y $73+37=110$, $73-37=36$.

EJEMPLO DE ENUMERACIÓN CONTROLADA
Para $10a+b=4(a+b)$ se obtiene $b=2a$. La restricción $b\le9$ reduce a $a=1,2,3,4$, dando $12,24,36,48$. No es necesario probar los noventa números de dos cifras. También hay que verificar que todas las opciones de la lista satisfacen la condición y que no se omitió ninguna.

OTRAS BASES
En base $q$, una escritura de dos cifras vale $qa+b$. Su diferencia con la inversión es $(q-1)(a-b)$; cambia el factor nueve por $q-1$. Antes de aplicar un criterio decimal, identifica la base.`,
}

export const MVP_LESSONS = OMM_LAUNCH_CONTENT_BATCH_1.lessons.map((source) => {
  const lesson = structuredClone(source)
  if (additions[lesson.pathSlug]) lesson.theory.content += `\n\nAMPLIACIÓN Y COMPROBACIONES\n${additions[lesson.pathSlug]}`
  // Advanced, unverified third-party fixtures remain outside the launch import.
  lesson.steps.forEach((step) => { step.problemCodes = [] })
  const codes = MVP_PROBLEMS.filter((p) => p.pathSlug === lesson.pathSlug).map((p) => p.codigo)
  if (codes.length) {
    lesson.steps[2].problemCodes = codes
    lesson.steps[3].description = 'Compara tus argumentos con las soluciones del banco. Identifica la primera diferencia, corrige tu prueba y vuelve a resolver un problema sin mirar la solución.'
  }
  if (lesson.pathSlug === 'entrenamiento-mixto-ciclo-1') {
    lesson.steps[1].problemCodes = ['TP-C05', 'TP-G07', 'TP-A02']
    lesson.steps[2].problemCodes = ['TP-C01', 'TP-D01']
    lesson.steps[3].examKeys = ['ciclo-1-a', 'ciclo-1-b']
    lesson.steps[3].listKeys = ['mixto-ciclo-1']
  }
  return lesson
})

MVP_LESSONS.push(defineLesson({
  pathSlug: 'aritmetica-modular', area: 'number-theory', title: 'Congruencias: calcular conservando residuos', level: 'intermedio',
  summary: 'Operaciones, ciclos de potencias y obstrucciones mediante residuos.',
  article: {
    introduction: 'Una congruencia conserva la información relevante para una divisibilidad. Trabajaremos con un módulo entero positivo $m$: dos enteros son congruentes cuando su diferencia es múltiplo de $m$.',
    ideas: String.raw`DEFINICIÓN Y OPERACIONES
Escribimos $a\equiv b\pmod m$ si $m\mid a-b$. La relación es reflexiva, simétrica y transitiva. Cada entero pertenece a una de las clases representadas por $0,1,\ldots,m-1$. Los residuos negativos pueden reemplazarse sumando el módulo: $-1\equiv m-1$.

Si $a\equiv b$ y $c\equiv d$ con el mismo módulo, entonces $a+c\equiv b+d$ y $ac\equiv bd$. La primera propiedad sale de sumar diferencias divisibles. Para la segunda, $ac-bd=c(a-b)+b(c-d)$ también es múltiplo de $m$. Por repetición se pueden elevar congruencias a potencias enteras no negativas.

CICLOS Y OBSTRUCCIONES
Calcula residuos de potencias hasta reconocer un patrón y justifica su repetición multiplicando por la misma base. No puedes dividir libremente: $2\cdot1\equiv2\cdot4\pmod6$ pero $1\not\equiv4\pmod6$. La cancelación requiere revisar el MCD.

Para demostrar que una ecuación no tiene soluciones enteras, elige un módulo donde sus lados tengan residuos incompatibles. Los cuadrados son $0$ o $1$ módulo cuatro: los pares tienen cuadrado divisible por cuatro y los impares tienen cuadrado congruente a uno. La obstrucción prueba imposibilidad, pero que no aparezca una obstrucción no demuestra existencia.`,
    example: String.raw`POTENCIAS
Como $3^3=27\equiv-1\pmod7$, $3^6\equiv1$. Entonces $3^{25}=(3^6)^4\cdot3\equiv3\pmod7$.

IMPOSIBILIDAD
Si $x^2+y^2=4k+3$, el lado derecho es tres módulo cuatro, mientras que el izquierdo solo puede ser cero, uno o dos. No hay enteros que satisfagan la igualdad.`,
    mistakes: 'Cambiar el módulo a mitad de cálculo; dividir por un factor no invertible; confundir igualdad con congruencia; o tomar una condición necesaria como suficiente.',
    practice: String.raw`Calcula $2^{20}$ módulo siete. Decide si $x^2=4k+2$ puede tener soluciones enteras. Respuestas: $2^3\equiv1$ y $20\equiv2\pmod3$, así el primer residuo es cuatro; el segundo caso es imposible porque un cuadrado no es dos módulo cuatro.`,
    summary: 'Usa operaciones que preservan divisibilidad, busca patrones con pruebas y elige módulos que hagan visible una incompatibilidad.',
  },
  steps: [
    { title: 'Traduce congruencias a divisibilidad', description: 'Explica la definición y demuestra las reglas de suma y producto con diferencias divisibles.' },
    { title: 'Reconstruye un ciclo de potencias', description: 'Repite el ejemplo sin usar una calculadora y justifica por qué el ciclo vuelve a empezar.' },
    { title: 'Practica cálculo e imposibilidad', description: 'Resuelve los dos problemas canónicos y distingue una obstrucción de una prueba de existencia.', problemCodes: ['TP-M01', 'TP-M02'] },
    { title: 'Revisa cancelaciones', description: 'Explica el contraejemplo módulo seis y comprueba tus respuestas con los residuos permitidos.' },
  ],
}))
MVP_LESSONS.push(defineLesson({
  pathSlug: 'inversos-y-congruencias-lineales', area: 'number-theory', title: 'Inversos y congruencias lineales: existir y resolver', level: 'intermedio',
  summary: 'El MCD determina cuándo se puede invertir y cuántas clases de soluciones aparecen.',
  article: {
    introduction: String.raw`Resolver una congruencia lineal conecta los residuos con Bézout. Fijamos $m\ge2$ y buscamos enteros $x$ tales que $ax\equiv b\pmod m$.`,
    ideas: String.raw`CUÁNDO EXISTE UN INVERSO
Un inverso de $a$ módulo $m$ es un entero $u$ con $au\equiv1\pmod m$. Existe exactamente cuando $\gcd(a,m)=1$. Si existe, cualquier divisor común divide tanto $au$ como $m$, y por ello divide uno. A la inversa, Bézout da $au+mv=1$ si el MCD es uno; reduciendo módulo $m$ se obtiene el inverso.

CRITERIO GENERAL
Sea $d=\gcd(a,m)$. La congruencia equivale a una ecuación $ax+my=b$ con $y$ entero. Bézout muestra que hay soluciones si y solo si $d\mid b$. En ese caso dividimos coeficiente, objetivo y módulo por $d$: $(a/d)x\equiv b/d\pmod{m/d}$. Ahora el coeficiente es coprimo con el nuevo módulo y se puede invertir.

CLASES DE SOLUCIONES
La congruencia reducida tiene una única clase módulo $m/d$. Al regresar al módulo original hay $d$ clases, separadas por $m/d$. La unicidad reducida se prueba multiplicando por el inverso. No se puede cancelar un factor y mantener el módulo original salvo que sea coprimo con él.`,
    example: String.raw`INVERSO
Para $7x\equiv5\pmod{11}$, $7\cdot8=56\equiv1$. Multiplicando por ocho: $x\equiv40\equiv7\pmod{11}$, y $x=7+11t$.

MCD NO TRIVIAL
Para $6x\equiv9\pmod{15}$ el MCD es tres y divide a nueve. Se reduce a $2x\equiv3\pmod5$. El inverso de dos módulo cinco es tres: $x\equiv9\equiv4\pmod5$. Las clases módulo quince son cuatro, nueve y catorce. Todas verifican la congruencia inicial. En cambio, $6x\equiv8\pmod{15}$ no tiene soluciones porque tres no divide a ocho.`,
    mistakes: 'Invertir cuando el MCD no es uno; dividir sin cambiar el módulo; dar solo una clase módulo original cuando hay varias; o olvidar verificar la congruencia inicial.',
    practice: String.raw`Resuelve $4x\equiv6\pmod{10}$. Como el MCD es dos, se reduce a $2x\equiv3\pmod5$, y aparecen $x\equiv4,9\pmod{10}$. Encuentra un inverso de cinco módulo doce: cinco mismo, porque $25\equiv1$.`,
    summary: 'Primero calcula el MCD; después decide existencia, reduce correctamente y usa Bézout para invertir.',
  },
  steps: [
    { title: 'Conecta inversos y Bézout', description: 'Demuestra ambas direcciones del criterio de invertibilidad sin suponer que siempre se puede dividir.' },
    { title: 'Reconstruye los casos del MCD', description: 'Distingue coeficiente invertible, reducción posible e imposibilidad con los ejemplos.' },
    { title: 'Resuelve y enumera clases', description: 'Trabaja las dos congruencias del banco y verifica todas las clases encontradas.', problemCodes: ['TP-M03', 'TP-M04'] },
    { title: 'Comprueba en el módulo original', description: 'Sustituye cada representante y explica por qué cambiar el módulo al dividir es indispensable.' },
  ],
}))

// Exact pre-batch values support a compare-and-set editorial migration.
export const PREVIOUS_EDITORIAL_THEORY = Object.fromEntries(MVP_LESSONS.map((lesson) => [lesson.theory.key, structuredClone(lesson.theory)]))
for (const lesson of MVP_LESSONS) {
  const revision = EDITORIAL_BATCH[lesson.pathSlug]
  if (revision) Object.assign(lesson.theory, revision)
}

// Preserve both known baselines; the review revision refuses any other text.
export const PREVIOUS_WRITING_LAB_THEORY = Object.fromEntries(MVP_LESSONS.map((lesson) => [lesson.theory.key, structuredClone(lesson.theory)]))
for (const lesson of MVP_LESSONS) {
  const revision = THEORY_WRITING_LAB[lesson.pathSlug]
  if (revision) Object.assign(lesson.theory, { content: revision.content, engagement: revision.engagement })
}
