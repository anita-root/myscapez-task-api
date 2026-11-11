import { addDays, bookableDates, bookingWindowById, formatBookingDate, isBookableDate, isDateString, weekday } from "./booking.ts"

const failures: string[] = []
function check(name: string, condition: boolean) {
  if (!condition) failures.push(name)
}

const today = "2026-11-10" // a Tuesday
const dates = bookableDates(today)
check("today is not bookable", !isBookableDate(today, today))
check("tomorrow is bookable", isBookableDate("2026-11-11", today))
check("sundays are closed", !dates.some((date) => weekday(date) === 0))
check("sunday 15 Nov is refused", !isBookableDate("2026-11-15", today))
check("60 days out is the limit", isBookableDate(addDays(today, 60), today) || weekday(addDays(today, 60)) === 0)
check("61 days out is refused", !isBookableDate(addDays(today, 61), today))
check("past dates are refused", !isBookableDate("2026-11-01", today))
check("bad dates are refused", !isDateString("2026-02-30") && !isDateString("next week") && !isDateString({ $gt: "" }))
check("month rollover", addDays("2026-11-30", 1) === "2026-12-01")
check("windows are known", bookingWindowById("morning")?.label === "Morning" && !bookingWindowById("evening"))
check("dates read in Australian English", formatBookingDate("2026-11-11") === "Wednesday 11 November 2026")

if (failures.length) {
  console.error(failures.join("\n"))
  process.exit(1)
}
console.log("booking checks passed")
