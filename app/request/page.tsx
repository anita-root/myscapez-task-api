"use client"

import { FormEvent, useState } from "react"
import { BookingCalendar, type BookingChoice } from "@/components/booking-calendar"
import { SuburbFinder } from "@/components/suburb-finder"
import { TurnstileField } from "@/components/turnstile-field"
import { allowEnquiry } from "@/lib/enquiry-limit"
import { safeFormError } from "@/lib/form-errors"
import { saveLead, type BusinessProfile } from "@/lib/match-store"
import { acceptedPhotoCount } from "@/lib/quote-photos"
import { bookingWindowById, formatBookingDate } from "@/lib/booking"
import { workGroups, jobById, propertyTypes, lawnSizes, frequencies, bookingExtras } from "@/lib/work-catalog"


function RequestPage() {
  const [suburb, setSuburb] = useState<string[]>([])
  const [category, setCategory] = useState("")
  const [extras, setExtras] = useState<string[]>([])
  const [photoCount, setPhotoCount] = useState(0)
  const [error, setError] = useState("")
  const [sending, setSending] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState("")
  const [booking, setBooking] = useState<BookingChoice>({ date: "", window: "" })
  const [calendarRefresh, setCalendarRefresh] = useState(0)
  const [result, setResult] = useState<{ matches: BusinessProfile[]; score: number; bucket: string; reasons: string[]; reference: string; confirmed: boolean; emailed: boolean; date: string; window: string } | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get("name") || "").trim()
    const email = String(form.get("email") || "").trim()
    const phone = String(form.get("phone") || "").trim()
    const propertyType = String(form.get("property") || "")
    const lawnSize = String(form.get("size") || "")
    const frequency = String(form.get("frequency") || "")
    if (name.length < 2) return setError("Enter your name.")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Enter a valid email.")
    if (phone.replace(/\D/g, "").length < 10) return setError("Enter a 10-digit phone number.")
    if (!category || !jobById(category)) return setError("Choose the type of lawn work.")
    if (!propertyType) return setError("Choose the property type.")
    if (!lawnSize) return setError("Choose the lawn size.")
    if (!frequency) return setError("Choose how often you want the work.")
    if (!suburb[0]) return setError("Choose the suburb where the job is.")
    if (!booking.date) return setError("Pick a day for the job.")
    if (!booking.window) return setError("Pick a morning or afternoon window.")
    if (sending) return
    if (!allowEnquiry()) return setError("Too many enquiries from this browser. Wait a few minutes and try again.")
    setSending(true)
    let accepted: { category?: string; suburb?: string; propertyType?: string; lawnSize?: string; frequency?: string; extras?: string[]; preferredDay?: string; photoCount?: number; bookingDate?: string; bookingWindow?: string; reference?: string; confirmed?: boolean; emailed?: boolean }
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, phone, suburb: suburb[0], category, bookingDate: booking.date, bookingWindow: booking.window, propertyType, lawnSize, frequency, extras, photoCount, turnstileToken }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        if (response.status === 409) setCalendarRefresh((count) => count + 1)
        return setError(safeFormError(payload?.error))
      }
      accepted = payload
      if (!accepted.category || !accepted.suburb || !accepted.propertyType || !accepted.lawnSize || !accepted.frequency || !accepted.bookingDate || !accepted.bookingWindow) {
        return setError("Check the form and try again.")
      }
    } catch {
      return setError("Check the form and try again.")
    } finally {
      setSending(false)
    }
    let saved
    try {
      saved = saveLead({
        name,
        email,
        phone,
        suburb: accepted.suburb,
        category: accepted.category,
        preferredDay: accepted.preferredDay || "",
        propertyType: accepted.propertyType,
        lawnSize: accepted.lawnSize,
        frequency: accepted.frequency,
        extras: accepted.extras || [],
        photoCount: accepted.photoCount || 0,
      })
    } catch {
      setError("Check the form and try again.")
      return
    }
    setError("")
    setResult({ matches: saved.matches, score: saved.lead.score, bucket: saved.lead.bucket, reasons: saved.lead.reasons, reference: accepted.reference || "", confirmed: Boolean(accepted.confirmed), emailed: Boolean(accepted.emailed), date: accepted.bookingDate || "", window: accepted.bookingWindow || "" })
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050605] text-[#f2f6ef]">
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#050605]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between gap-3 px-5 lg:px-10">
          <a href="/" aria-label="MyScapez home"><img src="/myscapez-logo-small.png" alt="MyScapez" className="h-10 w-auto" /></a>
          <a href="/directory" className="text-sm text-[#a8b1a7] transition hover:text-[#9cff12]">Directory</a>
        </div>
      </header>
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[.8fr_1.2fr] lg:px-10">
        <div>
          <p className="eyebrow">Book a job</p>
          <h1 className="section-heading mt-4">Pick a day. <span>We&apos;ll match the crew.</span></h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-[#9ca99a]">Choose the job, pick a day and a morning or afternoon window from the calendar, and lock it in. The job only goes to a business that does that work and services your suburb.</p>
        </div>
        {result ? (
          <div className="rounded-[28px] border border-[#9cff12]/25 bg-[#0d150b] p-6 sm:p-8">
            <div className="mb-6 rounded-2xl bg-[#9cff12] p-5 text-[#081006]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-70">{result.confirmed ? "You're booked in" : "Booking request received"}</p>
              <p className="mt-2 text-xl font-bold">{result.date ? formatBookingDate(result.date) : ""}</p>
              <p className="text-sm font-medium">{bookingWindowById(result.window)?.label} · {bookingWindowById(result.window)?.time}</p>
              {result.reference && <p className="mt-3 text-sm">Booking reference <span className="font-mono font-bold">{result.reference}</span></p>}
              <p className="mt-2 text-xs leading-5 opacity-80">{result.emailed ? "A confirmation email is on its way." : result.confirmed ? "Your spot is held. Keep your booking reference handy." : "This spot is not held yet. Online bookings are still being switched on."}</p>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9cff12]">{result.bucket} · score {result.score}</p>
            <h2 className="mt-3 text-2xl font-semibold">{result.matches.length ? "These businesses can do this job there." : "No business covers this yet."}</h2>
            <ul className="mt-4 flex flex-col gap-2 text-sm leading-6 text-[#9aa995]">{result.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
            <div className="mt-6 flex flex-col gap-3">
              {result.matches.map((business) => (
                <article key={business.id} className="rounded-2xl border border-white/10 p-4">
                  <h3 className="font-semibold">{business.name}</h3>
                  <p className="mt-1 text-sm text-[#9aa995]">{jobById(category)?.title} in {suburb[0]}. Their phone number is not shown.</p>
                </article>
              ))}
              {result.matches.length === 0 && <p className="text-sm text-[#9aa995]">The lead is stored under No coverage. It is not handed to a business outside the suburb or the job type.</p>}
            </div>
            <p className="mt-6 text-sm leading-6 text-[#657162]">Your phone and email stay on the private lead. They are not added to the public directory, and the business phone is not shown here. {result.emailed ? "" : "Nothing was emailed."}</p>
            <a href="/crm" className="mt-4 inline-flex font-semibold text-[#9cff12]">Open the lead list</a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-[28px] border border-[#9cff12]/25 bg-[#0d150b] p-6 sm:p-8">
            <label className="flex flex-col gap-2 text-sm font-medium">Your name
              <input name="name" className="form-input" autoComplete="name" />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium">Email
                <input name="email" type="email" className="form-input" autoComplete="email" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium">Phone
                <input name="phone" type="tel" className="form-input" placeholder="04xx xxx xxx" autoComplete="tel" required />
                <span className="text-xs font-normal text-[#657162]">Required. Your number is stored with the lead. It is not published on the directory.</span>
              </label>
            </div>
            <label className="flex flex-col gap-2 text-sm font-medium">Type of work
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="form-input">
                <option value="">Choose a job</option>
                {workGroups.map((group) => (
                  <optgroup key={group.id} label={group.title}>
                    {group.jobs.map((job) => <option key={job.id} value={job.id}>{job.title}</option>)}
                  </optgroup>
                ))}
              </select>
              {jobById(category)?.note && <span className="text-xs font-normal leading-5 text-[#c9a227]">{jobById(category)?.note}</span>}
            </label>
            <div className="grid gap-5 sm:grid-cols-3">
              <label className="flex flex-col gap-2 text-sm font-medium">Property
                <select name="property" className="form-input" defaultValue="">
                  <option value="">Choose</option>
                  {propertyTypes.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium">Lawn size
                <select name="size" className="form-input" defaultValue="">
                  <option value="">Choose</option>
                  {lawnSizes.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium">How often
                <select name="frequency" className="form-input" defaultValue="">
                  <option value="">Choose</option>
                  {frequencies.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
            </div>
            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-medium">Extras <span className="font-normal text-[#657162]">Optional</span></legend>
              {bookingExtras.map((extra) => (
                <label key={extra} className="flex min-h-11 items-center gap-3 text-sm">
                  <input type="checkbox" checked={extras.includes(extra)} onChange={() => setExtras((current) => current.includes(extra) ? current.filter((item) => item !== extra) : [...current, extra])} />
                  {extra}
                </label>
              ))}
            </fieldset>
            <div className="flex flex-col gap-2 text-sm font-medium">Suburb of the job
              <SuburbFinder selected={suburb} onChange={setSuburb} single />
            </div>
            <div className="flex flex-col gap-2 text-sm font-medium">Book a day
              <BookingCalendar value={booking} onChange={setBooking} refreshKey={calendarRefresh} />
            </div>
            <label className="flex flex-col gap-2 text-sm font-medium">Photos <span className="font-normal text-[#657162]">Optional</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="text-sm" onChange={(event) => {
                const input = event.currentTarget
                const files = [...(input.files || [])]
                input.value = ""
                void acceptedPhotoCount(files).then((result) => {
                  setPhotoCount(result.count)
                  setError(result.rejected ? "Use up to 6 JPEG, PNG or WebP photos, each under 5 MB. Photos are not uploaded." : "")
                })
              }} />
              <span className="text-xs font-normal text-[#657162]">{photoCount ? `${photoCount} checked. The files were not kept or uploaded.` : "JPEG, PNG or WebP only, up to 6 photos under 5 MB. Nothing is uploaded."}</span>
            </label>
            <TurnstileField onToken={setTurnstileToken} />
            {error && <p role="alert" className="text-sm text-[#ff9f9f]">{error}</p>}
            <button type="submit" disabled={sending} className="glow-button min-h-14 rounded-full px-7 font-semibold text-[#081006] disabled:opacity-60">{sending ? "Booking…" : "Book it in"}</button>
            <p className="text-xs leading-5 text-[#657162]">A standard mow in North Lakes matches Greenline Grounds. Turf in Southport matches Coastal Turf Co. Hedge trimming in North Lakes also matches Greenline Grounds. Pressure washing does not, until a business turns it on.</p>
          </form>
        )}
      </section>
    </main>
  )
}

export default RequestPage
