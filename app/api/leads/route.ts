import { NextResponse } from "next/server"
import { formErrors } from "@/lib/form-errors"
import { cleanJobDetails, cleanPerson, knownJobIds } from "@/lib/form-text"
import { allowForm, alreadyReceived, fingerprint, readJsonBody, turnstilePasses } from "@/lib/form-guard"
import { uploadAttempt } from "@/lib/quote-photos"
import { noteAbuse, reportCode } from "@/lib/incident"
import { countEnquiry } from "@/lib/measure"
import { readServerEnv } from "@/lib/server/env"
import { saveLead } from "@/lib/server/records"

export const dynamic = "force-dynamic"

function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local"
}

export async function GET() {
  return NextResponse.json({ error: "Sign-in is required." }, { status: 401 })
}

export async function POST(request: Request) {
  try {
    return await receiveLead(request)
  } catch {
    reportCode("form-error")
    return NextResponse.json({ error: formErrors.invalid }, { status: 500 })
  }
}

async function receiveLead(request: Request) {
  const ip = clientIp(request)
  if (!allowForm(ip)) {
    noteAbuse(ip)
    return NextResponse.json({ error: formErrors.limited }, { status: 429 })
  }
  const body = await readJsonBody(request)
  if (!body.ok) return NextResponse.json({ error: body.error }, { status: body.status })
  if (uploadAttempt(body.value)) return NextResponse.json({ error: formErrors.invalid }, { status: 400 })

  const person = cleanPerson({ name: body.value.name, email: body.value.email, phone: body.value.phone, suburb: body.value.suburb })
  const details = cleanJobDetails({
    propertyType: body.value.propertyType,
    lawnSize: body.value.lawnSize,
    frequency: body.value.frequency,
    extras: body.value.extras,
    preferredDay: body.value.preferredDay,
    photoCount: body.value.photoCount,
  })
  const category = knownJobIds([body.value.category])[0] || ""
  if (person.name.length < 2 || !person.email || person.phone.length < 10 || !person.suburb || !category || !details.propertyType || !details.lawnSize || !details.frequency) {
    return NextResponse.json({ error: formErrors.invalid }, { status: 400 })
  }
  if (!(await turnstilePasses(body.value.turnstileToken, readServerEnv("TURNSTILE_SECRET_KEY"), ip))) {
    return NextResponse.json({ error: formErrors.invalid }, { status: 400 })
  }
  const key = await fingerprint(["lead", person.email, person.phone, person.suburb, category])
  if (alreadyReceived(key)) return NextResponse.json({ error: formErrors.duplicate }, { status: 409 })
  const saved = await saveLead(key, { ...person, category, ...details })
  if (saved === "duplicate") return NextResponse.json({ error: formErrors.duplicate }, { status: 409 })
  await countEnquiry("lead")

  return NextResponse.json({
    ok: true,
    category,
    suburb: person.suburb,
    propertyType: details.propertyType,
    lawnSize: details.lawnSize,
    frequency: details.frequency,
    extras: details.extras,
    preferredDay: details.preferredDay,
    photoCount: details.photoCount,
  })
}
