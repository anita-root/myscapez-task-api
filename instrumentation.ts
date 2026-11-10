export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return
  const { databaseRoleProblem } = await import("./lib/database-role")
  const problem = databaseRoleProblem(process.env.MONGODB_URI)
  if (problem) throw new Error(problem)
}
