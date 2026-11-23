# Funciones

**[English](../FEATURES.md)** · Español

Todo lo que TeacherPeri hace hoy o quiere hacer. Cada función tiene un estado:

- **Hecho:** ya está en https://teacherperi.vercel.app.
- **En curso:** se está construyendo; la nota dice dónde (rama o pull request).
- **Parcial:** una parte ya está publicada; la nota dice cuál.
- **Planeado:** acordado, sin empezar. **Hoy** explica qué hace el sitio mientras tanto.

Actualiza este archivo, y [../FEATURES.md](../FEATURES.md), en el mismo pull
request que cambia la función (ver [CONTRIBUTING.md](CONTRIBUTING.md)).

_Última actualización: 2026-11-22._

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
| Seguir una Ruta, guardarla para después | Planeado | Parte de Mi Espacio. **Hoy:** solo se guardan los pasos completados; las lecciones se pueden guardar en listas personales |
| Ruta Universidad (aplicar a universidades de EE. UU. y Canadá) | Planeado | Usará el mismo motor de Rutas. **Hoy:** `/estudia-en-el-extranjero` es una página «Próximamente» («Universidad» en el pie de página) |

## Entrenamiento (bibliotecas)

| Función | Estado | Notas |
| --- | --- | --- |
| Problemas: búsqueda, filtros (área › subtema, carpeta de examen), páginas | Hecho | 330 problemas en el catálogo de contenido; el total publicado puede incluir aportes de la comunidad. Un problema se abre en una ventana con sus comentarios |
| Filtros más simples en las bibliotecas: «Palabras clave» y Área › subtema | Hecho | Problemas y Teoría muestran una sola tarjeta: una caja de palabras clave que ignora acentos y mayúsculas (también busca en enunciados, etiquetas y nombres de subtemas, y sugiere subtemas como atajos), y luego las 4 áreas como mosaicos; al elegir una se abren sus subtemas. «Otros temas» agrupa «Cómo entrenar», «Demostraciones»… cuando tienen contenido. Las carpetas de exámenes siguen en «Buscar por examen o carpeta». Se quitaron los filtros «Tema curricular», «Etiqueta», «Nivel», «Año» y «Colección». La API acepta `?area=<nombre>` (coincide con el árbol de Topics o con el campo viejo `tema`) y `GET /api/topics/counts` |
| Problemas: pistas (cada una con su propio botón) y soluciones | Hecho | |
| Página de problema con enlace estable | Hecho | `/entrenamiento/problemas/:id` |
| Árbol de carpetas de examen (p. ej. Exámenes › OMM › OMM Estatal › Jalisco › 2023), usable como filtro | Hecho | Funcionan el árbol, el filtro «Carpeta o examen» y las carpetas nuevas que proponen los usuarios. «Exámenes» tiene OMM (que incluye OMM Estatal), OMMEB, Centroamericana, Iberoamericana, IMO y «Prácticas TeacherPeri» con los 3 exámenes de práctica (14 problemas); se agregaron a la base del sitio el 2026-11-21 |
| Teoría: 37 lecciones con matemáticas, ejemplos y práctica | Hecho | Sitio en vivo. El código tiene además las 12 lecciones que faltaban del Ciclo 2 (49 lecciones antes del Ciclo 3) |
| Teoría: formato nuevo de lección (definiciones, teoremas, figuras, cajas de ejercicios) | Hecho | Las 49 lecciones anteriores al Ciclo 3 tienen el formato nuevo en el código, con figuras calculadas por scripts en `server/src/scripts/figures/`. `content:revise-theory` las publica lección por lección: revisa las 37 que ya existían, crea las 12 nuevas del Ciclo 2 y omite cualquier lección editada en el sitio, salvo que esa versión exacta se acepte con `--accept-live`. Todavía no se ha corrido en ninguna base |
| Vista local de borradores de teoría | En curso | Solo en desarrollo: `/dev/teoria-borrador/<slug-de-lección>` muestra el texto y las colecciones sin base de datos, con la etiqueta curricular y el nivel de la lección |
| «Sugerir un cambio» y «Reportar» en las lecciones | Hecho | Las mismas dos acciones que en los problemas (ver abajo) |
| Exámenes: navegación por competencia y subcarpeta | Hecho | La página muestra las carpetas principales como tarjetas descriptivas, solo cuando tienen exámenes publicados, como «TeacherPeri Originals» y «OMM»; «OMM Estatal» está dentro de «OMM». Al abrir una carpeta aparecen directamente sus tarjetas de examen, sin un botón adicional para el año; las demás subcarpetas aparecen como tarjetas de carpeta. Nuevas competencias como OMMEB aparecen automáticamente cuando contienen exámenes publicados. |
| Exámenes: 3 exámenes de práctica | Hecho | Práctica original de TeacherPeri, no exámenes oficiales de la OMM |
| Exámenes: un examen por carpeta de examen, armado con sus problemas | Hecho | Cada carpeta de examen con problemas publicados tiene un examen en Exámenes, con el título de la ruta de la carpeta («OMM 2024», «OMM Estatal 2023 · Jalisco») y sus problemas en orden de número (los que no tienen número van al final). Se actualiza solo cuando se aprueba un problema (en el sitio o con `npm run review`), se mueve, se renumera, se borra o se restaura, o se renombra una carpeta; un examen que se queda sin problemas se despublica, no se borra. Los 3 exámenes de práctica no se tocan. `npm run atlas:sync-exams:<test\|prod>` completa las carpetas que ya tenían problemas. Ver [SUBMISSIONS.md](SUBMISSIONS.md#carpetas-de-examen-en-la-página-exámenes) En la página del examen, cada problema numerado muestra su número original aunque el examen esté incompleto. |
| Imágenes en los problemas (geometría) | Hecho | Hasta 4 por problema, cada una con descripción obligatoria en español. Los usuarios las agregan al proponer; editores y admins las ven en Revisión; los editores las agregan, reemplazan o quitan (enunciado o solución). La descripción acepta fórmulas con $…$: quien escribe ve una vista previa, quien revisa la ve renderizada junto a cada imagen, y la página nunca la muestra (el texto `alt` recibe una versión en texto simple). Se guardan en MongoDB como WebP (máximo 1200 px), unos 12 KB por figura. Ver [SUBMISSIONS.md](SUBMISSIONS.md#imágenes-en-los-problemas) |
| Búsqueda global en todas las bibliotecas | Planeado | **Hoy:** cada biblioteca tiene su propia búsqueda |
| Renovación visual de Inicio, Rutas, Entrenamiento, Listas, Contacto y lecciones (estilo «cómic», logo del pingüino) | Hecho | Pull requests #18, #20 y #21 |
| Dos mascotas: TeacherPeri (pingüino) y TeacherCath (gatita) | Hecho | Juntas en «Sobre TeacherPeri» y la vista previa de links; la palabra del pie de página se turna entre TeacherPeri y TeacherCath; se turnan en la página 404 y en los avisos sin resultados. Ver [DESIGN.md](DESIGN.md) |
| Presentación de tarjetas de problemas | Hecho | Las tarjetas muestran el área y un subtema disponible como texto en la franja de color, seguidos del enunciado. Los nombres se escriben completos y pueden ocupar más de una línea si es necesario. La vista local `/dev/tarjetas-problemas` muestra ejemplos de tarjetas de problemas y exámenes con subtemas ilustrativos. Solo aparece un título cuando la fuente, el año y el número identifican un problema de concurso; no se muestra la dificultad en las vistas públicas de problemas ni en las cajas de práctica de las lecciones. |

## Listas

| Función | Estado | Notas |
| --- | --- | --- |
| Listas de ejercicios en Entrenamiento | Hecho | «Listas» (`/entrenamiento/listas`) reúne aplicaciones directas de la teoría por tema, con enunciados, pistas y soluciones en una lista ordenada. Un ejercicio puede aparecer en varias listas. «Problemas» excluye los ejercicios clasificados, y los enlaces directos y referencias de exámenes siguen funcionando. «Recursos externos» conserva los enlaces a otras organizaciones. Ver [EXERCISE_LISTS.md](../EXERCISE_LISTS.md) para criterios y mantenimiento. |
| Listas personales («Guardar en lista») | Hecho | En la página del problema, la ventana del problema y las lecciones: marca tus listas o crea una. Privadas salvo que se marquen «Pública»; se renombran, se hacen públicas o privadas y se borran en Mi Espacio › Listas; cada lista en `/perfil/<usuario>/listas/<id>`. Solo problemas y lecciones; las publicaciones de Experiencias y otro contenido vendrán después. Ver [PROFILES.md](PROFILES.md#listas-guardar-en-lista) |

## Comunidad

| Función | Estado | Notas |
| --- | --- | --- |
| Comentarios en problemas: respuestas hasta 3 niveles, matemáticas con `$...$`, insignias de rol | Hecho | Se ven en la ventana del problema y, desde Mi Espacio, también en la página del problema. Cada comentario tiene un enlace (`#comentario-<id>`) que baja hasta él y lo resalta. Los nombres de usuario llevan a su perfil |
| Reportar un comentario; borrar un comentario con motivo | Hecho | Cada quien borra sus comentarios. Editores y admins borran cualquiera y deben dar un motivo |
| Botones «@ Mencionar» y «Enlazar problema» en la caja de comentarios | Planeado | **Hoy:** la caja solo tiene el botón «$ LaTeX» |
| Figuras en los comentarios | Planeado | **Hoy:** solo texto y matemáticas |
| Proponer un problema (enunciado, áreas, etiquetas, carpeta y número de examen opcionales) | Hecho | `/entrenamiento/problemas/proponer`. Se publica solo cuando un admin lo aprueba. Ver [SUBMISSIONS.md](SUBMISSIONS.md) |
| Proponer una carpeta de examen | Hecho | Solo su autor la ve hasta que un admin la aprueba |
| «Mis envíos»: ver, editar y borrar tus propuestas | Hecho | `/mis-envios`, en el menú del avatar |
| Crédito en los problemas aprobados («Propuesto por @usuario») | Hecho | |
| «Sugerir un cambio» y «Reportar» en problemas y lecciones | Hecho | «Sugerir un cambio» es una corrección de contenido (respuesta equivocada, errata, caso faltante): un mensaje de 10 a 1000 caracteres que va a Revisión. «Reportar» es para contenido inapropiado (los mismos motivos que al reportar un comentario) y va a Moderación. Solo con sesión; uno abierto de cada tipo por persona y página. Lo que se envió antes como «Reportar un error» aparece en Revisión como sugerencia, sin migración |
| Notificaciones en el sitio (propuesta aprobada o rechazada) | Hecho | En el menú del avatar |
| Revisión automática al proponer un problema | Planeado | **Hoy:** al guardar corren revisiones automáticas; un editor o admin aprueba o rechaza en `/panel/revision` (o con `npm run review`) |
| Página de moderación para reportes de contenido inapropiado | Hecho | `/panel/moderacion`, editores y admins. Solo reportes: comentarios, y problemas y lecciones reportados con «Reportar». Un problema o lección reportado enlaza a la página y a «Editar», y se marca como resuelto o descartado con una nota opcional. Los comentarios reportados se descartan con nota o se eliminan con motivo. Filtros: abiertos, resueltos, descartados. Las correcciones de contenido no están aquí: van a Revisión |
| Sugerir cambios a problemas y lecciones oficiales | Hecho | «Sugerir un cambio» (solo mensaje). Editores y admins las ven en Revisión, abren desde ahí «Editar problema» o «Editar lección» y marcan cada una como «Aplicada» o «Descartar» con una nota opcional |
| Seguir a otros usuarios | Hecho | «Seguir» / «Siguiendo» en un perfil; listas de seguidores y seguidos en cada perfil. Aún no hay aviso de nuevos seguidores |
| Hilos (un foro aparte de los comentarios de los problemas) | Planeado | **Hoy:** la conversación ocurre solo en los comentarios de cada problema |

## Cuentas y roles

| Función | Estado | Notas |
| --- | --- | --- |
| Registro e inicio de sesión con correo y contraseña | Hecho | |
| Tres roles: Usuario, Editor, Admin | Hecho | Ver [ROLES.md](ROLES.md). Las cuentas guardadas con los seis roles anteriores se leen como los nuevos |
| Pantallas de editor: ver todos los reportes, editar cualquier problema o lección | Hecho | «Panel del equipo» en el menú del avatar (`/panel`). «Editar problema» en la página de un problema abre `/panel/problemas/:id/editar` (título, enunciado, pistas, solución, áreas, etiquetas, carpeta y número de examen, con vista previa de las fórmulas). «Editar lección» en una lección abre `/panel/teoria/:id/editar` (título, resumen y texto, con el mismo renderizador de lecciones como vista previa, incluidas sus cajas de problemas). El texto sigue siendo marcado simple, pero cada caja, título y fórmula se colorea como se ve en la página. Una barra encima inserta el marcado en el cursor o alrededor de lo seleccionado: «Bloque» (todas las cajas, más Figura y Tabla), «Título» (sección o subsección), «Problema» (busca en el banco y agrega una caja con los problemas elegidos) y «$ LaTeX». Los cambios se publican al guardar; cada guardado registra quién, cuándo y cada campo antes y después |
| Pantalla de revisión (editores y admins) y pantallas de admin | Hecho | `/panel/revision`, editores y admins: todas las propuestas en una lista, con el filtro «Todo / Problemas / Teoría / Carpetas». Aprobar problemas (corrigiendo antes título, áreas, etiquetas, carpeta o número) o rechazar con motivo; aprobar, renombrar o rechazar carpetas de examen propuestas; cerrar sugerencias. Misma lógica que `npm run review`, que sigue funcionando. Cada decisión aparece en «Cambios de editores»; si la toma un editor, los admins reciben un aviso. Solo admins: `/panel/usuarios`: dar o quitar el rol de Editor; nadie se vuelve admin desde el sitio y la última cuenta admin conserva su rol |
| Aviso a los admins cuando un editor cambia algo | Hecho | Notificación en el sitio para cada otro admin («@edith editó TP-M03 «…»: pistas»), con enlace a `/panel/cambios/:id` y el antes y después de cada campo. `/panel/cambios` lista todos los cambios |
| Iniciar sesión con Google | Planeado | |
| Verificación de correo | Planeado | Requiere un servicio de correo y dominio propio |

## Mi Espacio

| Función | Estado | Notas |
| --- | --- | --- |
| Página de perfil `/perfil/<usuario>` («Mi Espacio» en el menú del avatar) | Hecho | Tarjeta del perfil, «En números» y pestañas: Actividad, Comentarios, Listas, Mis envíos, Insignias. Los visitantes solo ven Comentarios, Listas e Insignias. El servidor solo manda al dueño el correo, la Actividad, Mis envíos y las listas privadas. Ver [PROFILES.md](PROFILES.md) |
| «Editar perfil»: avatares prediseñados y una descripción corta | Hecho | 12 avatares prediseñados (sin fotos) y hasta 160 caracteres. Se ven en la barra, en los comentarios y en las listas de seguidores |
| «Lo resolví» en los problemas | Hecho | El estudiante marca un problema como resuelto (nada revisa la respuesta). Cuenta como «problemas resueltos» |
| Insignias ganadas | Hecho | Problemas resueltos (1/10/50), comentarios (1/10/50), problemas aceptados (1/5/20), sugerencias aplicadas (1/5/20), y Editor/Admin. Nunca se pierden. Ver [PROFILES.md](PROFILES.md#lo-resolví-e-insignias) |
| Rutas que sigues, «continúa donde te quedaste» | Planeado | **Hoy:** Actividad muestra tus comentarios, cosas guardadas, problemas resueltos, propuestas y sugerencias recientes |

## Otras páginas

| Función | Estado | Notas |
| --- | --- | --- |
| Recursos: recursos externos por categoría | Hecho | `/recursos`. Ningún menú enlaza a ella todavía. Está planeado un filtro por etiquetas |
| Contacto | Parcial | El formulario funciona con sesión iniciada. El enlace «Correo» y los íconos de Instagram y LinkedIn de abajo todavía llevan a direcciones de ejemplo |
| Colabora (cómo colaborar) | Planeado | **Hoy:** usa Contacto |
| Experiencias (blog de exolímpicos) | Planeado | **Hoy:** página «Próximamente» |
| Equipo | Hecho | `/equipo`: dos tarjetas, Elías (TeacherPeri) y Catherine (TeacherCath), y cada una abre su propia página (`/equipo/elias`, `/equipo/catherine`, un archivo por persona en `src/pages/equipo/`), que cada quien decora. Enlazada desde «Conócenos» en Inicio |

## Sitio y hospedaje

| Función | Estado | Notas |
| --- | --- | --- |
| Sistema de diseño «Cómic refinado» | Hecho | Colores, fuentes y estilos compartidos en `src/index.css`. Reglas en [DESIGN.md](DESIGN.md) |
| Funciona en celulares (desde 375 px) | Hecho | |
| Hospedaje: Vercel (sitio), Render (API), MongoDB Atlas (base de datos) | Hecho | Ver [DEPLOYMENT.md](DEPLOYMENT.md) |
| Dominio propio | Planeado | **Hoy:** teacherperi.vercel.app |
