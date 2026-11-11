"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { bookingWindows, formatBookingDate, type Availability, type BookingWindowId } from "@/lib/booking"

export type BookingChoice = { date: string; window: BookingWindowId | "" }

const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function monthKey(date: string) {
  return date.slice(0, 7)
}

function shiftMonth(key: string, by: number) {
  const [year, month] = key.split("-").map(Number)
  const next = new Date(Date.UTC(year, month - 1 + by, 1))
  return next.toISOString().slice(0, 7)
}

function monthTitle(key: string) {
  const [year, month] = key.split("-").map(Number)
  return new Intl.DateTimeFormat("en-AU", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, 1)))
}

/** Every day cell for a month, Monday first, with blanks before the 1st. */
function monthCells(key: string) {
  const [year, month] = key.split("-").map(Number)
  const first = new Date(Date.UTC(year, month - 1, 1))
  const blanks = (first.getUTCDay() + 6) % 7
  const length = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const cells: (string | null)[] = Array.from({ length: blanks }, () => null)
  for (let day = 1; day <= length; day++) cells.push(`${key}-${String(day).padStart(2, "0")}`)
  return cells
}

function spotsText(count: number) {
  if (count <= 0) return "Fully booked"
  return count === 1 ? "1 spot left" : `${count} spots left`
}

export function BookingCalendar({ value, onChange, refreshKey = 0 }: { value: BookingChoice; onChange: (next: BookingChoice) => void; refreshKey?: number }) {
  const [days, setDays] = useState<Availability | null>(null)
  const [failed, setFailed] = useState(false)
  const [month, setMonth] = useState("")

  const load = useCallback(async () => {
    setFailed(false)
    try {
      const response = await fetch("/api/availability", { cache: "no-store" })
      if (!response.ok) throw new Error("unavailable")
      const payload = (await response.json()) as { days?: Availability }
      if (!payload.days) throw new Error("unavailable")
      setDays(payload.days)
    } catch {
      setFailed(true)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load, refreshKey])

  const dates = useMemo(() => (days ? Object.keys(days).sort() : []), [days])
  const firstMonth = dates[0] ? monthKey(dates[0]) : ""
  const lastMonth = dates.length ? monthKey(dates[dates.length - 1]) : ""
  const shownMonth = month || (value.date ? monthKey(value.date) : firstMonth)

  useEffect(() => {
    if (!days || !value.date) return
    const left = days[value.date]
    if (!left) return onChange({ date: "", window: "" })
    if (value.window && left[value.window] <= 0) onChange({ date: value.date, window: "" })
  }, [days, value.date, value.window, onChange])

  if (failed) {
    return (
      <div className="rounded-2xl border border-white/10 p-4 text-sm text-[#9aa995]">
        <p role="alert">The booking calendar could not load.</p>
        <button type="button" onClick={() => void load()} className="mt-2 font-semibold text-[#9cff12]">Try again</button>
      </div>
    )
  }

  if (!days) return <p className="rounded-2xl border border-white/10 p-4 text-sm text-[#9aa995]" aria-live="polite">Loading available days…</p>

  const selected = value.date ? days[value.date] : undefined

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3 sm:p-4">
        <div className="mb-3 flex items-center justify-between">
          <button type="button" onClick={() => setMonth(shiftMonth(shownMonth, -1))} disabled={shownMonth <= firstMonth} className="flex size-11 items-center justify-center rounded-full text-[#9cff12] disabled:text-[#3f483e]" aria-label="Previous month">
            <ChevronLeft aria-hidden="true" />
          </button>
          <p className="font-semibold" aria-live="polite">{monthTitle(shownMonth)}</p>
          <button type="button" onClick={() => setMonth(shiftMonth(shownMonth, 1))} disabled={shownMonth >= lastMonth} className="flex size-11 items-center justify-center rounded-full text-[#9cff12] disabled:text-[#3f483e]" aria-label="Next month">
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wider text-[#657162]" aria-hidden="true">
          {weekdayLabels.map((label) => <span key={label} className="py-1">{label}</span>)}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {monthCells(shownMonth).map((date, index) => {
            if (!date) return <span key={`blank-${index}`} />
            const left = days[date]
            const total = left ? left.morning + left.afternoon : 0
            const open = total > 0
            const isSelected = value.date === date
            return (
              <button
                key={date}
                type="button"
                disabled={!open}
                aria-pressed={isSelected}
                aria-label={`${formatBookingDate(date)}, ${left ? (open ? `${total} ${total === 1 ? "spot" : "spots"} left` : "fully booked") : "not available"}`}
                onClick={() => onChange({ date, window: "" })}
                className={`relative flex h-11 sm:h-12 flex-col items-center justify-center rounded-xl text-sm transition ${isSelected ? "bg-[#9cff12] font-semibold text-[#081006]" : open ? "border border-white/10 text-[#e4ece1] hover:border-[#9cff12]/60" : "text-[#3f483e] line-through"}`}
              >
                {Number(date.slice(8))}
                {open && !isSelected && total <= 2 && <span className="absolute bottom-1 size-1 rounded-full bg-[#ffb547]" aria-hidden="true" />}
              </button>
            )
          })}
        </div>
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#657162]">
          <span>Bookings open from tomorrow. No Sunday jobs.</span>
          <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-[#ffb547]" aria-hidden="true" />Nearly full</span>
        </p>
      </div>

      {value.date && selected && (
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-medium">Time window for {formatBookingDate(value.date)}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {bookingWindows.map((window) => {
              const left = selected[window.id]
              const active = value.window === window.id
              return (
                <button
                  key={window.id}
                  type="button"
                  disabled={left <= 0}
                  aria-pressed={active}
                  onClick={() => onChange({ date: value.date, window: window.id })}
                  className={`flex min-h-16 flex-col items-start justify-center rounded-2xl border px-4 py-3 text-left transition disabled:opacity-40 ${active ? "border-[#9cff12] bg-[#9cff12]/10" : "border-white/10 hover:border-[#9cff12]/60"}`}
                >
                  <span className="font-semibold">{window.label} <span className="font-normal text-[#9aa995]">{window.time}</span></span>
                  <span className={`text-xs ${left <= 0 ? "text-[#ff9f9f]" : left <= 1 ? "text-[#ffb547]" : "text-[#9cff12]"}`}>{spotsText(left)}</span>
                </button>
              )
            })}
          </div>
        </fieldset>
      )}
    </div>
  )
}
