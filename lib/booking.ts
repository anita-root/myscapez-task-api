/** Booking rules shared by the calendar and the server. All dates are YYYY-MM-DD in Brisbane time (no daylight saving). */

export const BOOKING_TIME_ZONE = "Australia/Brisbane"
export const BOOKING_DAYS_AHEAD = 60
/** Default number of jobs each window can take. The server can override it with BOOKING_SLOTS_PER_WINDOW. */
export const DEFAULT_SLOTS_PER_WINDOW = 4

export const bookingWindows = [
  { id: "morning", label: "Morning", time: "7am – 12pm" },
  { id: "afternoon", label: "Afternoon", time: "12pm – 5pm" },
] as const

export type BookingWindowId = (typeof bookingWindows)[number]["id"]

/** 0 is Sunday. Crews do not take bookings on Sundays. */
const closedWeekdays = new Set([0])

export function bookingWindowById(id: unknown) {
  return bookingWindows.find((window) => window.id === id)
}

export function brisbaneToday(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: BOOKING_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(now)
}

function toUtc(date: string) {
  const [year, month, day] = date.split("-").map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

export function addDays(date: string, days: number) {
  const next = toUtc(date)
  next.setUTCDate(next.getUTCDate() + days)
  return next.toISOString().slice(0, 10)
}

export function weekday(date: string) {
  return toUtc(date).getUTCDay()
}

export function isDateString(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  return toUtc(value).toISOString().slice(0, 10) === value
}

/** Bookable days run from tomorrow to BOOKING_DAYS_AHEAD days out, Sundays excluded. */
export function bookableDates(today = brisbaneToday()) {
  const dates: string[] = []
  for (let offset = 1; offset <= BOOKING_DAYS_AHEAD; offset++) {
    const date = addDays(today, offset)
    if (!closedWeekdays.has(weekday(date))) dates.push(date)
  }
  return dates
}

export function isBookableDate(date: unknown, today = brisbaneToday()): date is string {
  return isDateString(date) && bookableDates(today).includes(date)
}

export function formatBookingDate(date: string) {
  return new Intl.DateTimeFormat("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(toUtc(date))
}

/** Remaining spots for each window on each bookable day. */
export type Availability = Record<string, Record<BookingWindowId, number>>
