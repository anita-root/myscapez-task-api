import "server-only"
import { bookingWindowById, formatBookingDate, type BookingWindowId } from "@/lib/booking"
import { jobById } from "@/lib/work-catalog"
import { readServerEnv } from "./env"

type BookingEmail = {
  reference: string
  name: string
  email: string
  phone: string
  suburb: string
  category: string
  bookingDate: string
  bookingWindow: BookingWindowId
  propertyType: string
  lawnSize: string
  frequency: string
  extras: string[]
}

async function send(apiKey: string, from: string, to: string, subject: string, text: string, replyTo?: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, text, ...(replyTo ? { reply_to: replyTo } : {}) }),
  })
  if (!response.ok) throw new Error(`email ${response.status}`)
}

/**
 * Sends the customer confirmation and the MyScapez notification through Resend.
 * Returns false when RESEND_API_KEY is not set or a send fails. The booking stands either way.
 * Emails are plain text, so nothing a customer typed is rendered as markup.
 */
export async function sendBookingEmails(booking: BookingEmail) {
  const apiKey = readServerEnv("RESEND_API_KEY")
  if (!apiKey) return false
  // The sender must be on a domain verified in Resend.
  const from = readServerEnv("RESEND_FROM_EMAIL") || "MyScapez <bookings@myscapez.com>"
  const notify = readServerEnv("LEAD_RECIPIENT_EMAIL") || readServerEnv("MYSCAPEZ_ADMIN_EMAIL") || "admin@myscapez.com"
  const job = jobById(booking.category)?.title ?? booking.category
  const window = bookingWindowById(booking.bookingWindow)
  const when = `${formatBookingDate(booking.bookingDate)}, ${window?.label.toLowerCase()} (${window?.time})`
  const details = [
    `Booking reference: ${booking.reference}`,
    `Job: ${job}`,
    `When: ${when}`,
    `Suburb: ${booking.suburb}`,
    `Property: ${booking.propertyType}, ${booking.lawnSize.toLowerCase()} lawn, ${booking.frequency.toLowerCase()}`,
    `Extras: ${booking.extras.length ? booking.extras.join(", ") : "None"}`,
  ].join("\n")
  try {
    await send(
      apiKey,
      from,
      booking.email,
      `You're booked in: ${job} on ${formatBookingDate(booking.bookingDate)}`,
      `G'day ${booking.name},\n\nYour job is booked in with MyScapez.\n\n${details}\n\nWe'll match it with a local crew that services ${booking.suburb} and let you know who is coming. If anything changes, reply to this email with your booking reference.\n\nMyScapez\n0480 733 936`,
      notify,
    )
    await send(
      apiKey,
      from,
      notify,
      `New booking ${booking.reference}: ${job} in ${booking.suburb}`,
      `${details}\n\nCustomer: ${booking.name}\nEmail: ${booking.email}\nPhone: ${booking.phone}`,
      booking.email,
    )
    return true
  } catch {
    return false
  }
}
