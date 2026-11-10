import { NextResponse } from "next/server"
import { formErrors } from "@/lib/form-errors"
import { plainEmail, plainPhone, plainText } from "@/lib/form-text"
import { allowForm, alreadyReceived, fingerprint, readJsonBody, turnstilePasses } from "@/lib/form-guard"
import { canonicalSuburb } from "@/lib/form-text"
import { isSeqPostcode, isValidAbn, trades } from "@/lib/seq-directory"
import { uploadAttempt } from "@/lib/quote-photos"
import { noteAbuse, reportCode } from "@/lib/incident"
import { countEnquiry } from "@/lib/measure"
import { readServerEnv } from "@/lib/server/env"
import { saveListing } from "@/lib/server/records"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    return await receiveListing(request)
  } catch {
    reportCode("form-error")
    return NextResponse.json({ error: formErrors.invalid }, { status: 500 })
  }
}

async function receiveListing(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local"
  if (!allowForm(ip)) {
    noteAbuse(ip)
    return NextResponse.json({ error: formErrors.limited }, { status: 429 })
  }
  const body = await readJsonBody(request)
  if (!body.ok) return NextResponse.json({ error: body.error }, { status: body.status })
  if (uploadAttempt(body.value)) return NextResponse.json({ error: formErrors.invalid }, { status: 400 })

  const postcode = plainText(body.value.postcode, 8).replace(/\D/g, "")
  const trade = plainText(body.value.mainTrade, 40)
  const email = plainEmail(body.value.email)
  const phone = plainPhone(body.value.phone)
  const firstName = plainText(body.value.firstName, 40)
  const lastName = plainText(body.value.lastName, 40)
  const suburbs = Array.isArray(body.value.suburbs) ? body.value.suburbs.map((item) => canonicalSuburb(item)).filter(Boolean) : []
  const headline = plainText(body.value.headline, 120)
  const about = plainText(body.value.about, 600)
  const hasAbn = plainText(body.value.hasAbn, 3)
  const abn = plainText(body.value.abn, 14)
  const tradeOk = trades.some((item) => item.title === trade)
  if (postcode.length !== 4 || !isSeqPostcode(postcode) || !tradeOk || !email || phone.length < 10 || firstName.length < 2 || lastName.length < 2 || suburbs.length === 0 || headline.length < 8 || about.length < 40) {
    return NextResponse.json({ error: formErrors.invalid }, { status: 400 })
  }
  if (hasAbn === "Yes" && !isValidAbn(abn)) return NextResponse.json({ error: formErrors.invalid }, { status: 400 })
  if (!(await turnstilePasses(body.value.turnstileToken, readServerEnv("TURNSTILE_SECRET_KEY"), ip))) {
    return NextResponse.json({ error: formErrors.invalid }, { status: 400 })
  }
  const key = await fingerprint(["listing", email, phone, postcode])
  if (alreadyReceived(key)) return NextResponse.json({ error: formErrors.duplicate }, { status: 409 })
  const saved = await saveListing(key, { firstName, lastName, email, phone, postcode, trade, suburbs, headline, about, abn: hasAbn === "Yes" ? abn : "" })
  if (saved === "duplicate") return NextResponse.json({ error: formErrors.duplicate }, { status: 409 })
  await countEnquiry("listing")
  return NextResponse.json({ ok: true })
}
