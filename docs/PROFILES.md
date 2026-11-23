# Mi Espacio (profiles)

English · **[Español](es/PROFILES.md)**

Every account has a profile at `/perfil/<username>`. «Mi Espacio» in the avatar
menu opens your own.

## What is public and what is private

Privacy is fixed; there are no settings. The **server** leaves private data out
of its answers, so it never reaches another person's browser.

| Part | Owner | Everyone else |
| --- | --- | --- |
| @username, avatar, role, description, follower counts, «En números» | ✓ | ✓ |
| Comentarios (visible comments on public problems) | ✓ | ✓ |
| Guardados: public collections | ✓ | ✓ |
| Guardados: private collections («Solo tú») | ✓ | – (404) |
| «Problemas resueltos» (which problems) | ✓ | – (404; visitors see only the number) |
| Insignias | ✓ | ✓ |
| Email | ✓ | – |
| Actividad | ✓ | – (404) |
| Mis envíos (proposed problems and «Sugerir un cambio» suggestions) | ✓ | – |

## The page

- **Left:** the profile card (avatar, @username, role, description, «N seguidores»
  and «N siguiendo», «Editar perfil» or «Seguir»/«Siguiendo», and the email for
  the owner only), then «Buscar usuarios», then «En números»: problems solved,
  comments, proposed problems (published ones) and badges. For the owner the
  solved number is a button that opens «Problemas resueltos».
- **Right:** tabs (`?tab=` in the address). Owner: Actividad, Comentarios,
  Guardados, Mis envíos, Insignias. Visitors: Comentarios, Guardados, Insignias.
  Old links with `?tab=listas` open Guardados. The
  tabs are a real tablist: ←/→ move (and wrap), Home and End jump. Clicking a
  follower count shows that list instead (`?ver=seguidores` or
  `?ver=siguiendo`), with no tab selected and a «Volver» link. The same happens
  for «Problemas resueltos» (`?ver=resueltos`, owner only) and for search
  results (`?buscar=`).
- **Editar perfil:** one of 24 preset avatars (no uploads): 12 illustrated
  drawings and 12 math shapes. One of 13 light background colours for it
  (`AVATAR_COLORS` in `src/lib/avatars.js`), or «Original», the avatar's own
  fill. Dark backgrounds are left out because they show a white halo around
  the drawings. And a description of up to 160 characters. Accounts that never chose an avatar
  get a fixed math shape picked from their id.

## Guardados (collections)

«Listas» is the name of the Listas page in Entrenamiento, so the profile and the
save flow never use that word: the tab is «Guardados» and each named group is a
«colección». In the code they are still personal lists (`UserList`,
`UserListItem`, `/api/my-lists`).

- «Guardar» is on every problem page, in the problem window of the library and
  on every lesson. It opens «Guardar en una colección»: your collections as
  checkboxes, plus «Nueva colección». Signed out, it opens sign-in.
- Collections hold problems and lessons today. Experiencias posts have no
  «Guardar» yet; they will use the same button when they can be saved.
- A collection is private when created unless you tick «Pública». The owner
  renames, makes public or private, and deletes collections from the Guardados
  tab. One collection: `/perfil/<username>/colecciones/<id>` (old
  `/perfil/<username>/listas/<id>` links redirect there).
- Limits: 50 collections per person, 500 items per collection, names up to 80
  characters. Only published content can be saved; content that is later
  unpublished is hidden from the collection.

## Problemas resueltos

- Only the owner can open it: the solved number in «En números» is a button
  (keyboard too). Visitors see the plain number, and the API answers 404 to
  anyone but the owner.
- Rows: the statement (no title), the área pill and the date solved, newest
  first, each linking to the problem. Chips at the top filter by área. Only
  published problems are listed, the same ones the number counts.

## Buscar usuarios

- A search box on every profile, between the profile card and «En números».
  Type part of a username (from the start, upper or lower case; a leading «@»
  is ignored). It searches from 2 characters, 300 ms after you stop typing.
- Up to 20 results in the right column, the same rows as followers (avatar,
  @username, role, «Ver perfil»), with «Volver». No match: «No encontramos a
  nadie con ese usuario.»
- The API (`GET /api/profiles?q=`) only returns username, avatar and role,
  never the email. It allows 60 searches per minute from one address.

## «Lo resolví» and badges

- «Lo resolví» on a problem marks it solved. Nothing checks the answer; it is
  the student's own record. Clicking again unmarks it.
- Badges are computed from what you did and stored when your profile or badges
  are read, so past activity counts with its real date. A badge, once earned, is
  never taken away.

| Category | Tiers |
| --- | --- |
| Problemas resueltos («Lo resolví» on published problems) | Primer problema 1 · Constancia 10 · Incansable 50 |
| Comentarios (visible, on published problems) | Primera palabra 1 · Conversador 10 · Voz de la comunidad 50 |
| Problemas aceptados (approved proposals) | Autor 1 · Autor frecuente 5 · Creador de problemas 20 |
| Sugerencias aplicadas («Aplicada» in Revisión) | Ojo atento 1 · Corrector 5 · Revisor de oro 20 |
| Rol | Editor (editors and admins) · Admin |

The Insignias tab shows every earned badge with its date, and the next locked
tier of each category with how many are missing («Te faltan N»; visitors read
«Le faltan N»). The badge set lives in `server/src/lib/badgeRules.js`.

## Links to a comment

Comentarios and Actividad link each comment to
`/entrenamiento/problemas/<id>#comentario-<commentId>`. The problem page now
shows its comments; it scrolls to that comment and highlights it for a moment
(no animation with reduced motion). A deleted comment opens the page at the
comments.

## Code and API

- Pages: `src/pages/PerfilPage.jsx`, `src/pages/UserListPage.jsx`; pieces in
  `src/components/profile/`. Avatars: `src/lib/avatars.js`, drawings in
  `src/assets/avatars/` (256 px square WebP with a transparent background).
- API: `server/src/routes/profiles.routes.js` (`/api/profiles`, including the
  search and `/:username/solved`),
  `userLists.routes.js` (`/api/my-lists`), `solves.routes.js`
  (`/api/problems/:id/solved`) and `GET /api/flags/mine`. See
  [ARCHITECTURE.md](ARCHITECTURE.md#api).
- Models: `Follow`, `UserList`, `UserListItem`, `ProblemSolve`, `UserBadge`, and
  `bio`, `avatar` and `avatarColor` on `User`. **No migration is needed:** the new fields have
  defaults and the API creates the new collections and indexes when it starts.
- Tests: `server/src/__tests__/profiles.test.js`, `profile-solved-search.test.js`,
  `no-lista-text.unit.test.js`, `user-lists.test.js`,
  `badges.test.js`, `badge-rules.unit.test.js`, `profile-ui.unit.test.js`, and
  `tests/browser/mi-espacio.spec.js`.

## Not built yet

Comments on lessons, saving Experiencias posts, privacy settings, avatar
uploads, notifications for new followers, following a Ruta and «continúa donde
te quedaste».
