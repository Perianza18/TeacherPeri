# Funciones

**[English](../FEATURES.md)** · Español

Todo lo que TeacherPeri hace hoy o quiere hacer. Cada función tiene un estado:

- **Hecho:** ya está en https://teacherperi.vercel.app.
- **En curso:** se está construyendo; la nota dice dónde (rama o pull request).
- **Parcial:** una parte ya está publicada; la nota dice cuál.
- **Planeado:** acordado, sin empezar. **Hoy** explica qué hace el sitio mientras tanto.

Actualiza este archivo, y [../FEATURES.md](../FEATURES.md), en el mismo pull
request que cambia la función (ver [CONTRIBUTING.md](CONTRIBUTING.md)).

_Última actualización: 2026-11-21._

## Inicio

| Función | Estado | Notas |
| --- | --- | --- |
| Página de inicio: misión, «¿Cómo empiezo?», enlaces a cada sección | Hecho | |
| «Problema del día» | Hecho | Elige un problema según la fecha en la Ciudad de México. Muestra el enunciado, nunca un título |
| Agradecimientos a colaboradores en Inicio | Planeado | **Hoy:** `/colaboradores` es una página «Próximamente» a la que no enlaza ningún menú |

## Rutas

Una Ruta es un recorrido ordenado por material que ya existe. En
[CONTENT.md](CONTENT.md#rutas) se explica cómo funciona.

| Función | Estado | Notas |
| --- | --- | --- |
| Página de Rutas con búsqueda y filtro por etiqueta | Hecho | `/rutas` |
| Páginas de Ruta: migas de pan, franja «En la Ruta», paso anterior y siguiente | Hecho | La dirección sigue el camino que tomaste, p. ej. `/rutas/preparacion-para-la-omm/...` |
| Marcar un paso como completado; progreso de las Rutas que lo contienen | Hecho | Solo con sesión iniciada. El progreso nunca bloquea contenido |
| Ruta OMM: Preparación (18 lecciones) y Ciclo 1 (17 lecciones) | Hecho | |
| Ruta OMM: Ciclo 2 | Parcial | Hay 2 de 13 lecciones (aritmética modular y congruencias lineales). Las demás muestran «Próximamente» |
| Ruta OMM: Ciclos 3 a 5 | Planeado | **Hoy:** sus títulos muestran «Próximamente» |
| Seguir una Ruta, guardarla para después | Planeado | Parte de Mi Espacio. **Hoy:** solo se guardan los pasos completados |
| Ruta Universidad (aplicar a universidades de EE. UU. y Canadá) | Planeado | Usará el mismo motor de Rutas. **Hoy:** `/estudia-en-el-extranjero` es una página «Próximamente» («Universidad» en el pie de página) |

## Entrenamiento (bibliotecas)

| Función | Estado | Notas |
| --- | --- | --- |
| Problemas: búsqueda, filtros (área, etiqueta, nivel, año, carpeta), páginas | Hecho | 56 problemas. Un problema se abre en una ventana con sus comentarios |
| Problemas: pistas (cada una con su propio botón) y soluciones | Hecho | |
| Página de problema con enlace estable | Hecho | `/entrenamiento/problemas/:id` |
| Árbol de carpetas de examen (p. ej. Exámenes › OMM Estatal › Jalisco › 2023), usable como filtro | Hecho | Funcionan el árbol, el filtro «Carpeta o examen» y las carpetas nuevas que proponen los usuarios. «Exámenes» tiene OMM, OMM Estatal, OMMEB, Centroamericana, Iberoamericana, IMO y «Prácticas TeacherPeri» con los 3 exámenes de práctica (14 problemas); se agregaron a la base del sitio el 2026-11-21 |
| Teoría: 37 lecciones con matemáticas, ejemplos y práctica | Hecho | |
| Teoría: formato nuevo de lección (definiciones, teoremas, figuras, cajas de ejercicios) | Parcial | El formato ya funciona y 2 lecciones lo usan («Ángulos, paralelas y perpendiculares», «Principio de casillas»). Las otras 35 siguen con el formato anterior |
| «Reportar un error» y «Sugerir cambio» en las lecciones | Hecho | «Sugerir cambio» abre Contacto |
| Exámenes: 3 exámenes de práctica | Hecho | Práctica original de TeacherPeri, no exámenes oficiales de la OMM |
| Imágenes en los problemas (geometría) | Hecho | Hasta 4 por problema, cada una con descripción obligatoria en español. Los usuarios las agregan al proponer; los admins las ven en Revisión; los editores las agregan, reemplazan o quitan (enunciado o solución). Se guardan en MongoDB como WebP (máximo 1200 px), unos 12 KB por figura. Ver [SUBMISSIONS.md](SUBMISSIONS.md#imágenes-en-los-problemas) |
| Búsqueda global en todas las bibliotecas | Planeado | **Hoy:** cada biblioteca tiene su propia búsqueda |
| Renovación visual de Inicio, Rutas, Entrenamiento, Listas, Contacto y lecciones (estilo «cómic», logo del pingüino) | Hecho | Pull requests #18, #20 y #21 |

## Listas

| Función | Estado | Notas |
| --- | --- | --- |
| Listas seleccionadas en su propia página | Hecho | `/listas`: 6 listas de TeacherPeri y 3 recursos externos (OMM, IMO, NRICH). Los enlaces viejos `/entrenamiento/listas` redirigen |
| Listas personales («Guardar en lista») | Planeado | Parte de Mi Espacio. **Hoy:** no se pueden guardar problemas ni lecciones |

## Comunidad

| Función | Estado | Notas |
| --- | --- | --- |
| Comentarios en problemas: respuestas hasta 3 niveles, matemáticas con `$...$`, insignias de rol | Hecho | |
| Reportar un comentario; borrar un comentario con motivo | Hecho | Cada quien borra sus comentarios. Editores y admins borran cualquiera y deben dar un motivo |
| Botones «@ Mencionar» y «Enlazar problema» en la caja de comentarios | Planeado | **Hoy:** la caja solo tiene el botón «$ LaTeX» |
| Figuras en los comentarios | Planeado | **Hoy:** solo texto y matemáticas |
| Proponer un problema (enunciado, áreas, etiquetas, carpeta y número de examen opcionales) | Hecho | `/entrenamiento/problemas/proponer`. Se publica solo cuando un admin lo aprueba. Ver [SUBMISSIONS.md](SUBMISSIONS.md) |
| Proponer una carpeta de examen | Hecho | Solo su autor la ve hasta que un admin la aprueba |
| «Mis envíos»: ver, editar y borrar tus propuestas | Hecho | `/mis-envios`, en el menú del avatar |
| Crédito en los problemas aprobados («Propuesto por @usuario») | Hecho | |
| «Reportar un error» en problemas y lecciones | Hecho | |
| Notificaciones en el sitio (propuesta aprobada o rechazada) | Hecho | En el menú del avatar |
| Revisión automática al proponer un problema | Planeado | **Hoy:** al guardar corren revisiones automáticas; un admin aprueba o rechaza en `/panel/revision` (o con `npm run review`) |
| Página de moderación para reportes de comentarios y de errores | Hecho | `/panel/moderacion`, editores y admins. Los reportes de errores enlazan al problema o la lección (y a «Editar»); cada uno se marca como resuelto o descartado con una nota opcional. Los comentarios reportados se descartan con nota o se eliminan con motivo. Filtros: abiertos, resueltos, descartados |
| Sugerir cambios a problemas y lecciones oficiales | Planeado | **Hoy:** «Reportar un error», o «Sugerir cambio» en las lecciones, que abre Contacto |
| Seguir a otros usuarios | Planeado | |
| Hilos (un foro aparte de los comentarios de los problemas) | Planeado | **Hoy:** la conversación ocurre solo en los comentarios de cada problema |

## Cuentas y roles

| Función | Estado | Notas |
| --- | --- | --- |
| Registro e inicio de sesión con correo y contraseña | Hecho | |
| Tres roles: Usuario, Editor, Admin | Hecho | Ver [ROLES.md](ROLES.md). Las cuentas guardadas con los seis roles anteriores se leen como los nuevos |
| Pantallas de editor: ver todos los reportes, editar cualquier problema o lección | Hecho | «Panel del equipo» en el menú del avatar (`/panel`). «Editar problema» en la página de un problema abre `/panel/problemas/:id/editar` (título, enunciado, pistas, solución, áreas, etiquetas, carpeta y número de examen, con vista previa de las fórmulas). «Editar lección» en una lección abre `/panel/teoria/:id/editar` (título, resumen y texto, con el mismo renderizador de lecciones como vista previa). Los cambios se publican al guardar; cada guardado registra quién, cuándo y cada campo antes y después |
| Pantallas de admin: revisar propuestas, nombrar editores | Hecho | `/panel/revision`: aprobar (corrigiendo antes título, áreas, etiquetas, carpeta o número) o rechazar con motivo; aprobar, renombrar o rechazar carpetas de examen propuestas. Misma lógica que `npm run review`, que sigue funcionando. `/panel/usuarios`: dar o quitar el rol de Editor; nadie se vuelve admin desde el sitio y la última cuenta admin conserva su rol |
| Aviso a los admins cuando un editor cambia algo | Hecho | Notificación en el sitio para cada otro admin («@edith editó TP-M03 «…»: pistas»), con enlace a `/panel/cambios/:id` y el antes y después de cada campo. `/panel/cambios` lista todos los cambios |
| Iniciar sesión con Google | Planeado | |
| Verificación de correo | Planeado | Requiere un servicio de correo y dominio propio |

## Mi Espacio

| Función | Estado | Notas |
| --- | --- | --- |
| Perfil con parte pública (usuario, avatar, rol, insignias, comentarios) y privada (correo, listas) | Planeado | **Hoy:** el menú del avatar tiene «Mis envíos», notificaciones y «Cerrar sesión» |
| Rutas que sigues, cosas guardadas, «continúa donde te quedaste» | Planeado | |
| Avatares prediseñados | Planeado | **Hoy:** el avatar es la primera letra del nombre de usuario |
| Insignias ganadas | Planeado | |

## Otras páginas

| Función | Estado | Notas |
| --- | --- | --- |
| Recursos: recursos externos por categoría | Hecho | `/recursos`. Ningún menú enlaza a ella todavía. Está planeado un filtro por etiquetas |
| Contacto | Parcial | El formulario funciona con sesión iniciada. El enlace «Correo» y los íconos de Instagram y LinkedIn de abajo todavía llevan a direcciones de ejemplo |
| Colabora (cómo colaborar) | Planeado | **Hoy:** usa Contacto |
| Experiencias (blog de exolímpicos) | Planeado | **Hoy:** página «Próximamente» |
| Equipo | Planeado | **Hoy:** página «Próximamente» |
| Sobre mí | Planeado | **Hoy:** página «Próximamente», enlazada desde Inicio y el pie de página |

## Sitio y hospedaje

| Función | Estado | Notas |
| --- | --- | --- |
| Sistema de diseño «Cómic refinado» | Hecho | Colores, fuentes y estilos compartidos en `src/index.css`. Reglas en [DESIGN.md](DESIGN.md) |
| Funciona en celulares (desde 375 px) | Hecho | |
| Hospedaje: Vercel (sitio), Render (API), MongoDB Atlas (base de datos) | Hecho | Ver [DEPLOYMENT.md](DEPLOYMENT.md) |
| Dominio propio | Planeado | **Hoy:** teacherperi.vercel.app |
