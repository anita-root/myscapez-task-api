import "server-only"

const SERVER_ENV_NAMES = ["MONGODB_URI", "MONGODB_DB", "BOOKING_SLOTS_PER_WINDOW", "RESEND_FROM_EMAIL", "LEAD_RECIPIENT_EMAIL", "MYSCAPEZ_ADMIN_EMAIL", "RESEND_API_KEY", "SLACK_WEBHOOK_URL", "SESSION_SECRET", "TURNSTILE_SECRET_KEY"] as const

export type ServerEnvName = (typeof SERVER_ENV_NAMES)[number]

/** Read a secret on the server. Never prefix these names with NEXT_PUBLIC_. */
export function readServerEnv(name: ServerEnvName) {
  const value = process.env[name]?.trim()
  return value || undefined
}
