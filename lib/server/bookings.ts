import "server-only"
import { MongoServerError } from "mongodb"
import { bookableDates, bookingWindows, DEFAULT_SLOTS_PER_WINDOW, type Availability, type BookingWindowId } from "@/lib/booking"
import { database } from "./db"
import { readServerEnv } from "./env"

type SlotDoc = { _id: string; date: string; window: BookingWindowId; count: number }

export function slotsPerWindow() {
  const configured = Number(readServerEnv("BOOKING_SLOTS_PER_WINDOW"))
  return Number.isInteger(configured) && configured > 0 && configured <= 100 ? configured : DEFAULT_SLOTS_PER_WINDOW
}

function slotId(date: string, window: BookingWindowId) {
  return `${date}:${window}`
}

/** Remaining spots for every bookable day. Without a database every window shows as open. */
export async function availability(): Promise<{ live: boolean; days: Availability }> {
  const capacity = slotsPerWindow()
  const dates = bookableDates()
  const days: Availability = {}
  for (const date of dates) days[date] = { morning: capacity, afternoon: capacity }
  const db = await database()
  if (!db) return { live: false, days }
  const taken = await db
    .collection<SlotDoc>("bookingSlots")
    .find({ date: { $gte: dates[0], $lte: dates[dates.length - 1] } }, { projection: { date: 1, window: 1, count: 1 } })
    .toArray()
  for (const slot of taken) {
    if (days[slot.date] && slot.window in days[slot.date]) {
      days[slot.date][slot.window] = Math.max(0, capacity - slot.count)
    }
  }
  return { live: true, days }
}

/**
 * Take one spot in a window. The filter and the increment run as one operation, so two customers
 * cannot both take the last spot: when the window is full the upsert collides on _id and is refused.
 */
export async function reserveSlot(date: string, window: BookingWindowId): Promise<"reserved" | "full" | "skipped"> {
  const db = await database()
  if (!db) return "skipped"
  if (!bookingWindows.some((item) => item.id === window)) return "full"
  try {
    await db.collection<SlotDoc>("bookingSlots").updateOne(
      { _id: slotId(date, window), count: { $lt: slotsPerWindow() } },
      { $inc: { count: 1 }, $setOnInsert: { date, window } },
      { upsert: true },
    )
    return "reserved"
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) return "full"
    throw error
  }
}

/** Give a spot back when the booking that took it could not be saved. */
export async function releaseSlot(date: string, window: BookingWindowId) {
  const db = await database()
  if (!db) return
  await db.collection<SlotDoc>("bookingSlots").updateOne({ _id: slotId(date, window), count: { $gt: 0 } }, { $inc: { count: -1 } })
}

const referenceAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

export function bookingReference() {
  const bytes = new Uint8Array(6)
  crypto.getRandomValues(bytes)
  return `MSZ-${Array.from(bytes, (byte) => referenceAlphabet[byte % referenceAlphabet.length]).join("")}`
}
