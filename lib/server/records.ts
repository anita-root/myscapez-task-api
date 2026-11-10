import "server-only"
import { database } from "./db"

const DUPLICATE_WINDOW_MS = 30 * 60 * 1000

export type LeadRecord = {
  name: string
  email: string
  phone: string
  suburb: string
  category: string
  propertyType: string
  lawnSize: string
  frequency: string
  extras: string[]
  preferredDay: string
  photoCount: number
  reference: string
  bookingDate: string
  bookingWindow: string
}

export type ListingRecord = {
  firstName: string
  lastName: string
  email: string
  phone: string
  postcode: string
  trade: string
  suburbs: string[]
  headline: string
  about: string
  abn: string
}

/**
 * "stored": written to MongoDB. "duplicate": the same enquiry was stored inside the last 30 minutes.
 * "skipped": no database is configured, so nothing is written on the server.
 * Every value passed in has already been reduced to plain strings, so no query operators reach MongoDB.
 */
export type SaveResult = "stored" | "duplicate" | "skipped"

async function saveOnce(collection: "leads" | "listings", fingerprint: string, record: Record<string, unknown>): Promise<SaveResult> {
  const db = await database()
  if (!db) return "skipped"
  const now = new Date()
  const recent = await db.collection(collection).findOne(
    { fingerprint, createdAt: { $gt: new Date(now.getTime() - DUPLICATE_WINDOW_MS) } },
    { projection: { _id: 1 } },
  )
  if (recent) return "duplicate"
  await db.collection(collection).insertOne({ ...record, fingerprint, createdAt: now })
  return "stored"
}

export function saveLead(fingerprint: string, lead: LeadRecord) {
  return saveOnce("leads", fingerprint, { ...lead, status: "booked" })
}

/** A listing is not public until someone has reviewed it. */
export function saveListing(fingerprint: string, listing: ListingRecord) {
  return saveOnce("listings", fingerprint, { ...listing, status: "pending-review" })
}
