# Roles and permissions

English · **[Español](es/ROLES.md)**

Every account has one role. Each role has everything the role above it has.
The server checks the role on every request; the website only hides buttons.

| Role | Can do | Status |
| --- | --- | --- |
| **User** (everyone who signs up) | Read; comment; report comments; report errors on problems and lessons; propose problems and exam folders; edit and delete their own proposals | Done |
| **Editor** | + delete any comment, with a reason; see every comment report and error report; edit any problem or lesson | Done. «Panel del equipo» (`/panel`): Moderación, plus «Editar problema» and «Editar lección» on each problem and lesson. See [FEATURES.md](FEATURES.md#accounts-and-roles) |
| **Admin** | + approve or reject proposals and exam folders; restore deleted problems; name editors; get notified when an editor changes something | Done, except restoring: Revisión (`/panel/revision`), Usuarios (`/panel/usuarios`), Cambios de editores (`/panel/cambios`) and a notification for every editor change. Restoring deleted problems is still only `npm run review -- restore` ([SUBMISSIONS.md](SUBMISSIONS.md)) |

Role badges: comments show «Editor» or «Admin» next to the username. Users get
no badge.

## Where it lives in the code

- `server/src/lib/permissions.js`: the list of roles (`ROLES`) and the permission
  table (`PERMISSIONS`). Each permission names the lowest role that has it. A
  permission that is not in the table is always denied. `can(user, permission)`
  answers the question.
- Routes use `requireAuth` and then `requirePermission('<permission>')`, both in
  `server/src/middleware/auth.js`.
- `src/lib/roles.js` mirrors the roles on the website, to show or hide buttons.
- Sign-up never accepts a role. New accounts are `user`.

## Accounts with an old role

Before this version there were six roles. Old values still stored in the
database are translated every time they are read, so those accounts keep working:

| Stored value | Read as |
| --- | --- |
| `usuario`, `moderador` | `user` |
| `editor_junior`, `editor_senior` | `editor` |
| `teacherperi` | `admin` |
| no role | `user` |

`npm run db:migrate:roles-users` rewrites the stored values once (see
[SUBMISSIONS.md](SUBMISSIONS.md#migration)).

## Changing someone's role

**On the site (admins):** `/panel/usuarios` («Usuarios» in «Panel del equipo»).
Search the account and use «Nombrar editor» or «Quitar rol de editor». An admin
can also move another admin to Editor, but never the last admin. The server
checks all of this (`PUT /api/users/:id/role`); nobody becomes admin from the site.

**From a terminal:** use the guarded script. It changes the role of
one account, shows the change first, and writes only with `--apply` and the
database name typed to confirm. Valid roles: `user`, `editor`, `admin`.

```sh
# Shows the change without writing anything:
MONGO_ROLE_URI='<address ending in /teacherperi>' npm run users:set-role -- --user <email or username> --role editor
# Applies it:
MONGO_ROLE_URI='<address ending in /teacherperi>' ROLE_CHANGE_CONFIRM=teacherperi npm run users:set-role -- --user <email or username> --role editor --apply
```

Keep the address in your private shell environment; the script never prints it.
With the private Atlas file (see [DEVELOPMENT.md](DEVELOPMENT.md#atlas-scripts)),
`npm run atlas:set-role:test -- --user <email or username> --role editor` does the
same without typing the address (`atlas:set-role:prod` for the live site; add
`--apply` to write).
The new role applies at once; the person only needs to reload the site.

Nobody can make an admin from the website. Only this script can.

## Where the team pages are

| Page | Who | What |
| --- | --- | --- |
| `/panel` | Editor, Admin | Start page («Panel del equipo» in the avatar menu) |
| `/panel/moderacion` | Editor, Admin | Comment reports and error reports |
| `/panel/problemas/:id/editar`, `/panel/teoria/:id/editar` | Editor, Admin | Edit a problem or a lesson; applies at once |
| `/panel/revision` | Admin | Review proposed problems and exam folders |
| `/panel/usuarios` | Admin | Name or remove editors |
| `/panel/cambios`, `/panel/cambios/:id` | Admin | Every editor change, with before and after |
