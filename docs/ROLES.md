# Roles and permissions

Every account has one role. Each role inherits everything from the roles above it
in this list, and the server checks permissions on every request; the interface
only mirrors them.

| Role | Adds |
| --- | --- |
| `usuario` (default) | Read, comment, report comments, manage own lists, suggest edits |
| `moderador` | Delete any comment with a reason; see reports |
| `editor_junior` | Edit problems and theory (stored now; activates with the approval workflow) |
| `editor_senior` | Approve publications (stored now; activates with the approval workflow) |
| `admin` | Grant roles below `admin` |
| `teacherperi` | Assign any role, including `admin` |

The matrix lives in `server/src/lib/permissions.js` (`PERMISSIONS`, `can`,
`canAssignRole`). Routes use `requireAuth` followed by
`requirePermission('<permission>')`. Unknown permissions are always denied.
Accounts created before roles existed have no stored role and count as `usuario`.

Signup never accepts a role. `requireAuth` reads the role from the database on
every request, so a role change applies immediately; the site refreshes the
saved session through `GET /api/auth/me` when it loads.

## Changing a role (first admin, moderators)

There is no admin screen yet. Use the guarded script, which changes only the
`role` field of one account and follows the content importer's safety rules:
an explicit `MONGO_ROLE_URI` (never `MONGO_URI`) that names the database, a
dry run by default, and `--apply` only with the exact database name confirmed.

```sh
# Shows the change without writing anything:
MONGO_ROLE_URI='<uri with /teacherperi>' npm run users:set-role -- --user <email or username> --role teacherperi
# Applies it:
MONGO_ROLE_URI='<uri with /teacherperi>' ROLE_CHANGE_CONFIRM=teacherperi npm run users:set-role -- --user <email or username> --role teacherperi --apply
```

Keep the URI in your private shell environment. The script never prints it.
After the change, reload the site and the new role is picked up automatically.
