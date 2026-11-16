# Cómo colaborar

**[English](../CONTRIBUTING.md)** · Español

## Flujo de trabajo

1. Parte de la versión más reciente de `main` y crea una rama con el nombre del
   trabajo: `feature/...`, `fix/...`, `content/...`, `design/...` o `docs/...`.
2. Haz el cambio. Un tema por rama, y commits pequeños y claros en inglés.
3. Corre las revisiones de
   [DEVELOPMENT.md](DEVELOPMENT.md#revisiones-antes-de-un-pull-request).
4. Abre un pull request hacia `main` con una descripción corta y una lista «How
   to test» (cómo probarlo). GitHub Actions tiene que pasar.
5. Hacer merge a `main` publica el cambio en el sitio, así que solo haz merge de
   lo que está listo.

## Reglas

- **Mantén la documentación al día.** Si tu cambio agrega, termina o cambia una
  función, actualiza su fila en [FEATURES.md](FEATURES.md) (estado y cómo
  funciona hoy) y cualquier documento cuyos datos cambien: rutas, endpoints,
  scripts, roles, modelos. Hazlo en el mismo pull request, en inglés y en
  español (`docs/es/`), y menciónalo en la descripción del pull request.
- **Español para los visitantes.** Todo lo que se ve en el sitio está en español
  de México. El código, los comentarios y los mensajes de commit pueden estar en
  inglés o en español.
- **Sigue la guía de diseño.** [DESIGN.md](DESIGN.md): usa las variables y clases
  de `src/index.css` (`.tp-card`, `.tp-button`, ...). Nada de colores, fuentes o
  sombras nuevas.
- **Accesibilidad.** Elementos reales `<button>`, `<a>` y `<label>`, contraste de
  texto de 4.5:1, y cada página funciona a 375 px de ancho.
- **Commits.** Usa tu propia identidad de Git. Los commits tienen solo autores
  humanos: nada de líneas de coautor ni de «generado por».
- **Datos.** Nunca subas secretos ni el `.env`. Cambia los datos del sitio solo
  con los scripts protegidos, y pruébalos en `teacherperi` antes que en
  `teacherperi_prod`.
- **Contenido.** Nunca copies un problema dentro de una lista, examen o lección;
  haz referencia a él. No publiques lecciones vacías; muestra «Próximamente». No
  agregues contenido matemático (problemas, lecciones, soluciones) sin revisión:
  el contenido oficial sigue [CONTENT.md](CONTENT.md).
