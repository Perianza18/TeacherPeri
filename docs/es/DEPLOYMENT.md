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
construye con `npm ci` y arranca con `npm start`. Opcional: `RESEND_API_KEY`
(y `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM`) para los correos de contacto, ver abajo.

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

## Correos de contacto

Cada mensaje del formulario de Contacto se guarda en la colección
`contactmessages` y además se manda por correo al equipo con
[Resend](https://resend.com) (plan gratis: 3,000 correos al mes). La API llama
directo a la API web de Resend, así que no hay librería extra. El correo sale
después de que el formulario responde, así que un fallo del correo nunca impide
guardar el mensaje; solo queda en el registro (`[contact] no se pudo mandar el
aviso…` en los logs de Render).

Formato: asunto `[Contacto TeacherPeri] <motivo> · @<usuario>`; cuerpo con
Usuario, Correo, ¿Quién eres?, Motivo, Fecha (hora de la Ciudad de México) y el
mensaje. «Responder» le contesta directo a quien escribió (`reply_to` es el
correo de su cuenta).

| Variable (Render) | Valor |
| --- | --- |
| `RESEND_API_KEY` | La clave de la API de Resend. Sin ella no se manda ningún correo (pruebas y desarrollo local) |
| `CONTACT_EMAIL_TO` | Opcional. Por defecto `contacto@teacherperi.com` |
| `CONTACT_EMAIL_FROM` | Opcional. Por defecto `TeacherPeri <avisos@teacherperi.com>`; debe usar un dominio verificado en Resend |

Configuración (una sola vez):
1. Crea una cuenta gratis en Resend.
2. En Resend › Domains, agrega `teacherperi.com` y copia los registros DNS que
   muestra (DKIM, y SPF y MX en el subdominio `send`) en el DNS del dominio. No
   tocan los registros MX de la raíz, así que el reenvío de ImprovMX sigue
   funcionando.
3. Cuando el dominio diga «Verified», crea una clave de API con «Sending access».
4. Agrégala en Render como `RESEND_API_KEY` y guarda (Render vuelve a publicar).
5. Manda un mensaje de prueba desde https://www.teacherperi.com/contacto.

## Cambiar datos en la base del sitio

Solo con los scripts protegidos ([CONTENT.md](CONTENT.md), [ROLES.md](ROLES.md),
[SUBMISSIONS.md](SUBMISSIONS.md)): primero la simulación, luego aplicar con el
nombre de la base confirmado. Pruébalos en la base de pruebas `teacherperi` antes
que en `teacherperi_prod`. Haz un respaldo antes de un cambio grande. Nunca corras
`db:reset:dev` contra Atlas.

## Sitemap

`npm run build` genera `dist/sitemap.xml` después de Vite. En producción
(`VERCEL_ENV=production`) consulta la API pública e incluye problemas, lecciones,
exámenes, listas, recursos y Rutas públicas, con su última fecha de modificación
cuando está disponible. Recorre todas las páginas de resultados y evita duplicados.
Las Rutas que solo agrupan lecciones se omiten, igual que en el catálogo.

En vistas previas conserva `public/sitemap.xml`. Para probar el contenido completo
localmente: `SITEMAP=1 npm run build`. Usa `VITE_API_URL` para la API y `SITE_URL`
para el dominio; por defecto usa las direcciones de producción. Si la API falla
tras dos intentos, conserva el sitemap estático y no bloquea el despliegue.
El contenido nuevo se incorpora en el siguiente despliegue de producción.

Después de publicar, revisa `https://www.teacherperi.com/sitemap.xml` y envía esa
dirección en Search Console. Las pruebas están incluidas en `npm run test:unit`.

## Después de publicar

Abre https://www.teacherperi.com en una computadora y en un celular y revisa:
las bibliotecas cargan con sus matemáticas, una Ruta abre desde un enlace
directo, una dirección que no existe muestra «Página no encontrada» y la consola
del navegador no tiene errores.
