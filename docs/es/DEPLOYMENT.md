# Despliegue

**[English](../DEPLOYMENT.md)** · Español

El sitio está publicado. Cada merge a `main` vuelve a publicar el sitio y la API
automáticamente.

| Parte | Servicio | Dirección |
| --- | --- | --- |
| Sitio | Vercel (plan Hobby), proyecto `teacherperi` | https://www.teacherperi.com (`teacherperi.com` y `teacherperi.vercel.app` redirigen ahí) |
| API | Render (plan gratuito, este de EE. UU.), servicio `teacherperi-api` | https://teacherperi-api.onrender.com |
| Base de datos | MongoDB Atlas (clúster gratuito M0), base `teacherperi_prod` | — |

El plan gratuito de Render se duerme cuando nadie lo usa, así que la primera
petición después de un rato puede tardar cerca de un minuto.

Vercel también publica una vista previa de cada pull request; el enlace aparece
en las revisiones del pull request.

## Configuración

Los secretos viven solo en los paneles de cada servicio, nunca en el repositorio,
en un pull request ni en una variable `VITE_*`.

**Render (API):** `NODE_ENV=production`, `MONGO_URI` (un usuario de base de datos
que solo puede leer y escribir `teacherperi_prod`), `JWT_SECRET`,
`CLIENT_ORIGIN=https://www.teacherperi.com` y `TRUST_PROXY_HOPS=3`. Se
construye con `npm ci` y arranca con `npm start`.

`TRUST_PROXY_HOPS` le dice a la API cuántos proxies hay delante de ella, para que
los límites de peticiones cuenten a cada visitante y no al proxy. En Render debe
ser 3 (Cloudflare más dos relevos de Render). Se midió: con 3, el contador del
límite general de peticiones (300 cada 15 minutos en `/api`) baja exactamente
uno por petición desde una misma
computadora, y un encabezado `X-Forwarded-For` falso no lo reinicia. Con 1 o 2,
el contador se reparte entre varias direcciones. Si cambia el hospedaje, mide de
nuevo con esas dos pruebas (revisa el encabezado de respuesta
`RateLimit-Remaining`).

**Vercel (sitio):** `VITE_API_URL=https://teacherperi-api.onrender.com` (sin
diagonal al final), build `npm run build`, salida `dist`. `vercel.json` manda
cualquier dirección de página a `index.html`, así que recargar un enlace profundo
como `/rutas/...` funciona.

## Cambiar datos en la base del sitio

Solo con los scripts protegidos ([CONTENT.md](CONTENT.md), [ROLES.md](ROLES.md),
[SUBMISSIONS.md](SUBMISSIONS.md)): primero la simulación, luego aplicar con el
nombre de la base confirmado. Pruébalos en la base de pruebas `teacherperi` antes
que en `teacherperi_prod`. Haz un respaldo antes de un cambio grande. Nunca corras
`db:reset:dev` contra Atlas.

## Después de publicar

Abre https://www.teacherperi.com en una computadora y en un celular y revisa:
las bibliotecas cargan con sus matemáticas, una Ruta abre desde un enlace
directo, una dirección que no existe muestra «Página no encontrada» y la consola
del navegador no tiene errores.
