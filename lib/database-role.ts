const ownerLogins = new Set(["root", "admin", "administrator", "mongo", "mongodb", "atlasadmin", "owner"])

/** Empty means no database is configured. A set address must be a limited MongoDB login. */
export function databaseRoleProblem(uri: string | undefined) {
  const value = uri?.trim()
  if (!value) return null
  let parsed: URL
  try {
    parsed = new URL(value)
  } catch {
    return "The database address is not usable."
  }
  if (parsed.protocol !== "mongodb:" && parsed.protocol !== "mongodb+srv:") {
    return "The database address must be MongoDB."
  }
  const user = decodeURIComponent(parsed.username).toLowerCase()
  if (!user || ownerLogins.has(user)) {
    return "The database login is an owner account. Use a limited application login."
  }
  if (!parsed.password) return "The database login is missing its password."
  const params = new URLSearchParams(parsed.search.toLowerCase())
  if (params.get("tls") === "false" || params.get("ssl") === "false" || params.get("tlsallowinvalidcertificates") === "true" || params.get("tlsinsecure") === "true") {
    return "The database connection must use verified TLS."
  }
  return null
}
