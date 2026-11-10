import { databaseRoleProblem } from "./database-role.ts"

const failures: string[] = []
function check(name: string, condition: boolean) {
  if (!condition) failures.push(name)
}

check("unset is allowed", databaseRoleProblem(undefined) === null)
check("blank is allowed", databaseRoleProblem("  ") === null)
const owner = databaseRoleProblem("mongodb+srv://admin:secret-value@cluster0.example.mongodb.net/myscapez")
check("owner login is refused", owner === "The database login is an owner account. Use a limited application login.")
check("owner error hides the secret", owner !== null && !owner.includes("secret-value"))
check("root login is refused", databaseRoleProblem("mongodb://root:pw@localhost:27017/myscapez") !== null)
check("postgres is refused", databaseRoleProblem("postgresql://app:pw@localhost/app") === "The database address must be MongoDB.")
check("limited srv login is allowed", databaseRoleProblem("mongodb+srv://myscapez_app:pw@cluster0.example.mongodb.net/?retryWrites=true&w=majority") === null)
check("limited standard login is allowed", databaseRoleProblem("mongodb://myscapez_app:pw@db.example:27017/myscapez?tls=true") === null)
check("missing password is refused", databaseRoleProblem("mongodb+srv://myscapez_app@cluster0.example.mongodb.net/") !== null)
check("tls off is refused", databaseRoleProblem("mongodb://myscapez_app:pw@db.example:27017/?tls=false") === "The database connection must use verified TLS.")
check("invalid certificates are refused", databaseRoleProblem("mongodb://myscapez_app:pw@db.example:27017/?tlsAllowInvalidCertificates=true") !== null)

if (failures.length) {
  console.error(failures.join("\n"))
  process.exit(1)
}
console.log("database-role checks passed")
