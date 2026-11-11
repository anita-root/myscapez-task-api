export const formErrors = {
  invalid: "Check the form and try again.",
  limited: "Too many enquiries. Wait a few minutes and try again.",
  duplicate: "This enquiry was already received.",
  full: "That time is fully booked. Choose another day or window.",
} as const

const allowed = new Set<string>(Object.values(formErrors))

/** Only these sentences may be shown from a form response. */
export function safeFormError(value: unknown) {
  return typeof value === "string" && allowed.has(value) ? value : formErrors.invalid
}
