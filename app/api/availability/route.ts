import { NextResponse } from "next/server"
import { reportCode } from "@/lib/incident"
import { availability } from "@/lib/server/bookings"

export const dynamic = "force-dynamic"

/** Remaining spots per day and window. No customer details are returned. */
export async function GET() {
  try {
    const result = await availability()
    return NextResponse.json(result, { headers: { "cache-control": "no-store" } })
  } catch {
    reportCode("form-error")
    return NextResponse.json({ error: "Bookings could not be loaded." }, { status: 503, headers: { "cache-control": "no-store" } })
  }
}
