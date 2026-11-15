# Roles and permissions

Every account has one of three roles. Each role inherits everything from the role
above it in this list, and the server checks permissions on every request; the
interface only mirrors them.

| Role | Adds |
| --- | --- |
| `user` (default) | Read, comment, report comments, report errors in problems and theory pages, propose problems and exam folders, edit and delete (soft) their own problems |
| `editor` | See every report, delete any comment with a reason, edit any problem or theory page (screens pending) |
| `admin` | Review submissions and exam folders, restore deleted content, name editors, be notified of editor changes (notifications pending) |

The matrix lives in `server/src/lib/permissions.js` (`PERMISSIONS`, `can`,
`canAssignRole`). Routes use `requireAuth` followed by
`requirePermission('<permission>')`. Unknown permissions are always denied.

Accounts saved before this version may still store an old value. `roleOf()`
translates it on every read, so nothing breaks before the stored values are
migrated: `usuario` and `moderador` → `user`; `editor_junior` and `editor_senior`
→ `editor`; `teacherperi` → `admin`. Accounts without a stored role count as
`user`. `npm run db:migrate:roles-users` rewrites the stored values (see
[SUBMISSIONS.md](SUBMISSIONS.md)).

Signup never accepts a role. `requireAuth` reads the role from the database on
every request, so a role change applies immediately; the site refreshes the
saved session through `GET /api/auth/me` when it loads.

## Changing a role (first admin, editors)

There is no admin screen yet. Use the guarded script, which changes only the
`role` field of one account and follows the content importer's safety rules:
an explicit `MONGO_ROLE_URI` (never `MONGO_URI`) that names the database, a
dry run by default, and `--apply` only with the exact database name confirmed.
Valid roles: `user`, `editor`, `admin`.

```sh
# Shows the change without writing anything:
MONGO_ROLE_URI='<uri with /teacherperi>' npm run users:set-role -- --user <email or username> --role editor
# Applies it:
MONGO_ROLE_URI='<uri with /teacherperi>' ROLE_CHANGE_CONFIRM=teacherperi npm run users:set-role -- --user <email or username> --role editor --apply
```

Keep the URI in your private shell environment. The script never prints it.
After the change, reload the site and the new role is picked up automatically.
