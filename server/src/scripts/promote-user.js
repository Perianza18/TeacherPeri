// ---------------------------------------------------------------------------
// Cambia el rol de UNA cuenta (por ejemplo, nombrar al primer admin o a un
// editor). Roles válidos: user, editor, admin.
//
//   MONGO_ROLE_URI=mongodb+srv://.../teacherperi \
//     npm run users:set-role -- --user ana@correo.com --role admin           # solo muestra
//   MONGO_ROLE_URI=... ROLE_CHANGE_CONFIRM=teacherperi \
//     npm run users:set-role -- --user ana@correo.com --role admin --apply   # aplica
//
// Mismas reglas de seguridad que el importador de contenido: una URI propia y
// explícita (nunca MONGO_URI), con nombre de base; modo de prueba por defecto;
// --apply exige escribir el nombre exacto de la base. Solo cambia el campo
// `role` de una cuenta; nunca crea, borra ni toca nada más. No imprime la URI.
// ---------------------------------------------------------------------------

import 'dotenv/config'
import mongoose from 'mongoose'
import User from '../models/User.js'
import { ROLES, roleOf } from '../lib/permissions.js'

// Errores propios del script: su mensaje es seguro de imprimir. Cualquier otro
// error (por ejemplo, del driver de MongoDB) se reporta de forma genérica.
function fail(message) {
  return Object.assign(new Error(message), { code: 'ROLE_SCRIPT' })
}

export function roleChangeTarget(env = process.env, apply = false) {
  const uri = env.MONGO_ROLE_URI
  if (!uri || !/^mongodb(?:\+srv)?:\/\//.test(uri) || /[\s#]/.test(uri)) throw fail('Set an explicit MONGO_ROLE_URI with a database path.')
  const dbName = /^mongodb(?:\+srv)?:\/\/[^/]+\/([^?]+)(?:\?.*)?$/.exec(uri)?.[1]
  if (!dbName || !/^[a-zA-Z0-9_-]+$/.test(dbName) || ['admin', 'local', 'config'].includes(dbName)) throw fail('An explicit non-system database name is required.')
  if (/[?&]dbName=/i.test(uri)) throw fail('Do not override the database with URI options.')
  if (apply && env.ROLE_CHANGE_CONFIRM !== dbName) throw fail('ROLE_CHANGE_CONFIRM must equal the exact database name for --apply.')
  return { uri, dbName }
}

export function parseRoleArgs(argv) {
  const args = { user: null, role: null, apply: false }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--apply') args.apply = true
    else if (arg === '--dry-run') continue
    else if (arg === '--user' || arg === '--role') {
      const value = argv[i + 1]
      if (!value || value.startsWith('--')) throw fail(`${arg} needs a value.`)
      args[arg.slice(2)] = value.trim()
      i += 1
    } else throw fail(`Unknown argument: ${arg}. Use --user <email or username> --role <role> [--apply].`)
  }
  if (argv.includes('--apply') && argv.includes('--dry-run')) throw fail('Use --dry-run (default) or --apply, not both.')
  if (!args.user) throw fail('--user <email or username> is required.')
  if (!ROLES.includes(args.role)) throw fail(`--role must be one of: ${ROLES.join(', ')}.`)
  return args
}

// Busca exactamente una cuenta por correo o username. Si el texto coincide con
// el correo de una cuenta y el username de OTRA, se niega en vez de adivinar.
export async function setUserRole({ user, role, apply }) {
  const matches = await User.find({ $or: [{ email: user.toLowerCase() }, { username: user }] }).select('username email role').lean()
  if (matches.length === 0) throw fail('No account matches that email or username.')
  if (matches.length > 1) throw fail('That value matches more than one account; use the exact email.')
  const [account] = matches
  const from = roleOf(account)
  // Compara con el valor GUARDADO: una cuenta con un rol antiguo equivalente
  // (por ejemplo `teacherperi` → admin) también se reescribe al valor nuevo.
  const differs = account.role !== role
  if (apply && differs) await User.updateOne({ _id: account._id }, { $set: { role } })
  return { mode: apply ? 'applied' : 'dry-run', username: account.username, email: account.email, from, stored: account.role ?? null, to: role, changed: differs && apply }
}

async function run() {
  const args = parseRoleArgs(process.argv.slice(2))
  const target = roleChangeTarget(process.env, args.apply)
  await mongoose.connect(target.uri, { dbName: target.dbName, serverSelectionTimeoutMS: 10000, autoIndex: false, autoCreate: false })
  if (mongoose.connection.name !== target.dbName || mongoose.connection.db.databaseName !== target.dbName) throw fail('Connected database does not match the explicit target.')
  const result = await setUserRole(args)
  console.log(JSON.stringify({ database: target.dbName, ...result }))
}

// Importar este archivo en pruebas no debe conectarse ni escribir nada.
if (process.argv[1]?.endsWith('/scripts/promote-user.js')) run().catch((error) => {
  const detail = error.code === 'ROLE_SCRIPT' ? error.message : 'Could not complete the change (check the URI, network access and database).'
  console.error(`Role change failed: ${detail} Nothing was changed; credentials are never logged.`)
  process.exitCode = 1
}).finally(() => mongoose.disconnect())
