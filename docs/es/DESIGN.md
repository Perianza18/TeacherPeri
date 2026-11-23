# Guía de diseño: «Cómic refinado»

**[English](../DESIGN.md)** · Español

Todas las pantallas siguen esta guía. Se basa en el estilo de cuaderno de cómic
que ya está en `src/index.css` (`.tp-card`, `.tp-button`, `.tp-kicker`,
`.tp-lesson-heading-*`).

## 1. Principios

1. **Tinta y papel.** Fondo crema, líneas de tinta negra, sombras duras
   desplazadas. Nada de sombras difuminadas, degradados, efecto vidrio ni emoji.
2. **El color tiene significado.** Cada tipo de contenido usa siempre el mismo
   color (sección 5). Nunca uses color solo para decorar.
3. **Primero la lectura.** El texto largo va en una columna tranquila de máximo
   840px. El estilo de cómic fuerte va en encabezados, tarjetas y botones, no en
   los párrafos.
4. **Interfaz en español.** Todo el texto visible está en español de México:
   «Ver solución», «Guardar», «Responder», «Reportar».

Las tarjetas de problemas usan la franja de color del área para escribir el área
y un subtema disponible en mayúsculas, separados por un punto (por ejemplo,
«COMBINATORIA · PRINCIPIO DE CASILLAS»). Conserva los nombres completos y permite
que ocupen más de una línea. No muestres códigos internos, dificultad ni títulos
genéricos en la tarjeta. Un encabezado de examen identifica fuente, año y número.

## 2. Colores

Son variables CSS en `src/index.css` (`@theme` de Tailwind v4). En los
componentes usa las variables, no valores hexadecimales sueltos.

| Variable | Hex | Uso |
| --- | --- | --- |
| `--tp-paper` | #FAF8F5 | Fondo de página |
| `--tp-surface` | #FFFFFF | Tarjetas, formularios, barra de navegación |
| `--tp-ink` | #111111 | Texto, bordes, sombras |
| `--tp-ink-muted` | #5F5C57 | Texto secundario (cumple 4.5:1 sobre papel y blanco) |
| `--tp-ink-soft` | #46433F | Notas de demostración y pies de figura |
| `--tp-rule` | #C4BCB2 | Divisores punteados |
| `--tp-violet` | #6D3EE8 | Acción principal, menú activo, progreso, etiqueta de teorema (texto blanco) |
| `--tp-violet-soft` | #EEE7FF | Fondo de teorema, botones de herramientas de la caja de comentarios |
| `--tp-sky` | #86D7FF | Banda del encabezado de página, etiqueta de definición |
| `--tp-sky-soft` | #E5F1FF | Fondo de definición |
| `--tp-yellow` | #FFD65A | Kickers, tarjetas de práctica, caja «Problema del día» |
| `--tp-yellow-soft` | #FFF4CC | Consejos y pistas |
| `--tp-mint` | #8EE8BF | Acciones «Resolver» / «Completado», encabezado de ejemplo |
| `--tp-mint-soft` | #D8F5E8 | Panel de problemas relacionados |
| `--tp-orange` | #FF9F43 | El naranja del pingüino: etiqueta de error común, estados de reporte, «¡Hoy!», «Próximamente», la página 404 |
| `--tp-orange-soft` | #FFE9D2 | Fondo de error común |

Los fondos de los encabezados de sección rotan en este orden: #E8DDFF, #D9F1FF,
#FFE2C4, #D8F5E8 (`.tp-lesson-heading-0…3`).

**Regla de contraste:** texto blanco solo sobre `--tp-violet` o `--tp-ink`. Sobre
cualquier otro color, usa `--tp-ink`.

## 3. Tipografía

Las fuentes se cargan de Google Fonts en `index.html`:

- **Títulos:** Bricolage Grotesque 800 (h1, h2, h3, logo, títulos de tarjetas),
  con `letter-spacing: -0.02em` en h1.
- **Texto:** Inter 400/500/600/700/800.
- **Matemáticas:** KaTeX. Nunca imites matemáticas con fuentes.
- **Texto de lectura (lecciones, enunciados):** la fuente matemática, para que el
  texto y las fórmulas combinen. Usa `KaTeX_Main` (incluida en KaTeX) con una
  serif de respaldo, 18px / 1.7. La interfaz sigue en Inter y los títulos en
  Bricolage.

| Uso | Tamaño / interlineado | Peso |
| --- | --- | --- |
| h1 (título de página) | 44px / 1.05 (34px en celular) | 800 títulos |
| h1 (título de problema) | 36px / 1.1 | 800 títulos |
| h2 (sección) | 24px / 1.2 | 800 títulos |
| h3 / título de tarjeta | 19–22px / 1.3 | 800 títulos |
| Párrafo de entrada | 17px / 1.65 | 400 |
| Texto (lectura) | 18px / 1.7, fuente matemática (`KaTeX_Main`) | 400 |
| Texto (interfaz) | 15px / 1.55 | 400–600 |
| Metadatos / migas de pan | 13–14px | 600, atenuado |
| Kicker / etiqueta de caja | 11px, mayúsculas, espaciado 0.12–0.14em | 800 |

## 4. Forma, bordes, sombras, espacios

| Elemento | Borde | Radio | Sombra |
| --- | --- | --- | --- |
| Tarjeta principal (`.tp-card`) | 3px tinta | 18px | 6px 6px 0 tinta |
| Tarjeta / caja normal (`.tp-card-soft`) | 2px tinta | 14px | 4px 4px 0 tinta, o ninguna en cajas tranquilas |
| Botón (`.tp-button`) | 2px tinta | 12px | 4px 4px 0 tinta; al pasar el cursor sube a 6px; al presionar baja a 2px |
| Píldora / etiqueta | 2px tinta | 999px | ninguna |
| Encabezado de sección | 2px tinta | 10px | 3px 3px 0 tinta |
| Campos de formulario | 2px tinta | 10px | ninguna; al enfocar, contorno violeta de 2px separado 3px |

- Escala de espacios: 4, 8, 12, 16, 20, 24, 28, 32, 40, 64px. El relleno de las
  tarjetas es de 18–28px. Entre bloques de un artículo hay 26px.
- Diseño: ancho máximo del contenido 1120px, 24px de margen lateral. Columna de
  lectura de máximo 840px. Barra lateral de 260–300px; en celular baja debajo del
  contenido y nunca queda fija.
- Las zonas táctiles miden al menos 44px de alto.
- Dos mascotas: **Peri**, el pingüino con un grafo en la espalda (`PeriPenguin`, también el logo), y **Cath**, la
  gatita (`CathCat`). Las dos son solo decoración. Salen juntas, con los nombres «TeacherPeri» y «TeacherCath», en «Sobre TeacherPeri» en Inicio y en la imagen
  de vista previa de links. La palabra gigante del pie de página se turna al azar entre TeacherPeri (Cath en la
  «T», Peri en la «i») y TeacherCath (Peri en la «T», Cath en la «h»); cada una tiene además poses con un lugar fijo
  (`Mascot`, poses en `src/lib/mascots.js`): Peri saludando en la ventana de «Entrar / Crear cuenta» y en Contacto;
  Peri estudiando arriba de Teoría y Rutas; Cath jugando arriba de Problemas y Exámenes; Cath acostada en las páginas
  «Próximamente»; Cath con la patita en el «¡Mensaje enviado!» de Contacto y en «Mis envíos» vacío. En la página 404
  y en los avisos sin resultados sale cualquiera de las siete poses al azar (`RandomMascot`). A lo mucho una mascota
  por pantalla, al lado del contenido, nunca encima del texto.
- Los avatares son círculos con borde de tinta de 2px y relleno pastel. Los
  usuarios elegirán solo entre avatares prediseñados (sin subir imágenes).

## 5. Bloques de teoría (un estilo por tipo)

Son componentes de React en `src/components/content/` (`Bloques.jsx`,
`PracticeBox.jsx`). Los autores eligen un tipo de bloque en el texto de la
lección (ver [CONTENT.md](CONTENT.md#lecciones-teoría)); nunca le dan estilo a
una caja a mano.

| Componente (bloque) | Etiqueta (píldora) | Fondo | Borde / sombra | Notas |
| --- | --- | --- | --- | --- |
| `Definicion` (`definition`) | DEFINICIÓN sobre sky | sky-soft | 2px, sombra 4px | |
| `Teorema` (`theorem`) | TEOREMA · nombre, sobre violeta con texto blanco | violet-soft | **3px, sombra 6px** (la caja más fuerte) | Fórmula destacada centrada |
| `Enunciado` (`lemma`, `corollary`, `proposition`) | nombre sobre violet-soft | blanco | 2px, sin sombra | Línea opcional «Idea:» en ink-soft |
| `Demostracion` (`proof`) | `<details>` con resumen «Demostración» | blanco | 2px **punteado** | Termina con ∎ a la derecha; abierta por defecto en las lecciones |
| `Ejemplo` (`example`) | franja menta «EJEMPLO n» | blanco | 2px | Se numera solo. Enunciado visible; solución oculta detrás de «Ver solución» |
| `Intentalo` (`try`) | `<details>` «Inténtalo: …» | blanco | 2px, sombra 4px | Respuesta oculta hasta abrirla |
| `Consejo` (`tip`) | CONSEJO DE OLIMPIADA sobre amarillo | yellow-soft | 2px | |
| `ErrorComun` (`mistake`) | ERROR COMÚN sobre naranja | orange-soft | 2px | |
| `PracticeBox` (cajas de problemas) | PRACTICA, EJERCICIOS o RETO sobre tinta (texto blanco) + «N problemas para esta lección» | **amarillo** | 3px, sombra 6px | Una caja por tipo, con filas blancas compactas: metadatos (nivel · comentarios), vista previa del enunciado (sin título), «Resolver →» en menta. Apunta al problema del banco; nunca lo copia |
| `Tabla` | ninguna | blanco, fila de encabezado #F2EFE9 | 2px, radio 12px | En celular se desplaza de lado |
| `Figura` | ninguna (pie abajo, Inter 13px) | blanco | 2px, radio 14px | SVG de máximo 480px, centrado. Líneas de tinta de 2.5px, un solo acento (violeta) para lo que señala el texto, etiquetas en la fuente matemática, paralelas con flechas, ángulos iguales con la misma letra. Varias figuras de una misma idea van en fila y se apilan en celular. Texto alternativo obligatorio |
| `AgregadosCulturales` | ninguna (solo el encabezado de sección) | blanco | 2px, sin sombra | Una tarjeta por viñeta |

La geometría y cualquier argumento espacial siempre llevan figura, justo antes
del párrafo que la usa.

## 6. Patrones de página

- **Banda de encabezado:** banda sky a todo lo ancho (de orilla a orilla, borde
  inferior de tinta de 3px, sin marco de tarjeta), kicker amarillo (p. ej.
  «TEORÍA · CICLO 1 · LECCIÓN 2»), h1, párrafo de entrada, cinta de metadatos
  (tiempo de lectura, nivel, número de problemas de práctica).
- **Logo:** solo texto, «TeacherPeri», Bricolage Grotesque 800, 22px,
  letter-spacing -0.02em. Sin caja ni ícono.
- **Barra de navegación:** blanca, borde inferior de 3px. «Entrar» es un botón
  menta con texto de tinta y sombra de tinta de 4px. Orden: Inicio, Rutas,
  Entrenamiento, Experiencias, Equipo, y luego el avatar (o «Entrar»).
  El elemento activo tiene un subrayado violeta de 3px. En celular se vuelve un
  botón de menú.
- **Migas de pan:** 14px atenuadas. Dentro de una Ruta, muestran el camino de la
  Ruta.
- **Sin barras laterales en páginas de lectura.** «En esta lección» es una fila
  de píldoras bajo la banda del encabezado. El contexto de Ruta (abierto con
  `?ruta=`) agrega una franja blanca «En la Ruta» bajo la banda (barra de
  progreso de 12px, borde de 2px, relleno violeta), «Marcar paso como completado»
  en menta y «Paso anterior / Siguiente paso». Si se abre desde una biblioteca,
  nada de esto aparece.
- **Problemas de práctica en una lección:** una caja amarilla «PRACTICA» con
  filas compactas (metadatos, enunciado, «Resolver →»). Los problemas nunca
  muestran título.
- **Anterior / siguiente:** dos tarjetas blancas bajo un divisor punteado.
- **Estados vacíos y «Próximamente»:** una `.tp-card-soft` blanca con kicker
  amarillo y una oración. No hace falta ilustración.

## 7. Comentarios

- Una tarjeta blanca contiene cada hilo principal. Las respuestas se sangran
  52px por nivel, hasta 3 niveles. Después, se quedan en el nivel 3.
- Cada fila: avatar, **nombre de usuario**, insignia de rol (píldora violet-soft:
  Editor, Admin), hora atenuada, el texto (KaTeX para `$...$`), y luego
  «Responder» y «Reportar» (atenuado) como botones de texto.
- Caja para comentar: etiqueta «Escribe un comentario», área de texto con
  marcador «Usa $...$ para escribir matemáticas», botones de herramientas en
  violet-soft («$ LaTeX»; «@ Mencionar» y «Enlazar problema» están planeados) y
  un botón «Publicar» de tinta a la derecha.
- Un comentario borrado deja una línea atenuada: «Comentario eliminado por
  moderación».

## 8. Accesibilidad (obligatoria)

- Usa elementos reales `<button>`, `<a href>`, `<label>` + `<input>`. Nunca
  pongas `onClick` en un `div`.
- El contraste del texto es de al menos 4.5:1. Los botones que solo tienen ícono
  llevan `aria-label`.
- Conserva `:focus-visible` (contorno violeta de 2px). Respeta
  `prefers-reduced-motion` (ya está en `index.css`).
- Cada página funciona a 375px de ancho: las cuadrículas se apilan, las tablas se
  desplazan y el menú se colapsa.

## 9. Lo que no se hace

- Nada de colores, fuentes o estilos de sombra fuera de esta guía.
- Nada de sombras difuminadas, degradados, emoji ni tarjetas inclinadas.
- Nada de avisos con solo un borde de color a la izquierda. Las cajas llevan
  borde completo, como en la sección 5.
- No pongas bordes gruesos en párrafos largos. El texto de lectura va tranquilo.
