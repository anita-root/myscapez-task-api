import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * Validate an email address without using a ReDoS-prone regex.
 * Splits on '@', checks both parts exist, and verifies the domain has a dot.
 */
function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length > 320) return false; // RFC 5321 max length
  const atIndex = trimmed.indexOf("@");
  if (atIndex <= 0) return false; // must have a local part before '@'
  const local = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex + 1);
  if (local.length === 0 || domain.length === 0) return false;
  const dotIndex = domain.lastIndexOf(".");
  if (dotIndex <= 0 || dotIndex === domain.length - 1) return false;
  // Must not contain spaces or additional '@' characters
  if (/\s/.test(trimmed) || domain.includes("@")) return false;
  return true;
}

export async function POST(req: NextRequest) {
  // Instantiate lazily so a missing key during build doesn't crash the module.
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[/api/contact] RESEND_API_KEY is not set.");
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);

  /** The business inbox that receives every new lead notification. */
  const BUSINESS_EMAIL =
    process.env.BUSINESS_EMAIL ?? "admin@myscapez.com";

  /** The verified "From" address configured in your Resend domain. */
  const FROM_EMAIL =
    process.env.FROM_EMAIL ?? "Myscapez <no-reply@myscapez.com.au>";

  try {
    const body = await req.json();
    const { name, email, phone, service, message } = body as {
      name?: string;
      email?: string;
      phone?: string;
      service?: string;
      message?: string;
    };

    // ── Basic validation ──────────────────────────────────────────────────
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }

    if (
      !email ||
      typeof email !== "string" ||
      !isValidEmail(email)
    ) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const safeName = name.trim();
    const safeEmail = email.trim().toLowerCase();
    const safePhone = (phone ?? "").trim() || "Not provided";
    const safeService = (service ?? "").trim() || "Not specified";
    const safeMessage = (message ?? "").trim() || "No message provided.";

    // ── 1. Notify the business ────────────────────────────────────────────
    await resend.emails.send({
      from: FROM_EMAIL,
      to: BUSINESS_EMAIL,
      subject: `New lead from ${safeName} – ${safeService}`,
      html: `
        <h2 style="color:#166534;font-family:sans-serif">New Quote Request 🌿</h2>
        <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%;max-width:520px">
          <tr><td style="padding:8px 4px;color:#6b7280;width:130px">Name</td><td style="padding:8px 4px;font-weight:600">${safeName}</td></tr>
          <tr><td style="padding:8px 4px;color:#6b7280">Email</td><td style="padding:8px 4px"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
          <tr><td style="padding:8px 4px;color:#6b7280">Phone</td><td style="padding:8px 4px">${safePhone}</td></tr>
          <tr><td style="padding:8px 4px;color:#6b7280">Service</td><td style="padding:8px 4px">${safeService}</td></tr>
          <tr><td style="padding:8px 4px;color:#6b7280;vertical-align:top">Message</td><td style="padding:8px 4px;white-space:pre-wrap">${safeMessage}</td></tr>
        </table>
        <p style="font-family:sans-serif;font-size:12px;color:#9ca3af;margin-top:24px">
          Submitted via myscapez.com.au
        </p>
      `,
    });

    // ── 2. Confirmation to the lead ───────────────────────────────────────
    await resend.emails.send({
      from: FROM_EMAIL,
      to: safeEmail,
      subject: "We've received your enquiry – Myscapez",
      html: `
        <div style="font-family:sans-serif;max-width:520px;color:#1f2937">
          <h2 style="color:#166534">Hi ${safeName}, thanks for reaching out! 🌿</h2>
          <p>We've received your quote request and one of our landscaping specialists will be in touch within <strong>24 hours</strong>.</p>
          <p style="color:#6b7280;font-size:14px"><strong>Your enquiry summary:</strong></p>
          <ul style="font-size:14px;color:#6b7280;line-height:1.8">
            <li><strong>Service:</strong> ${safeService}</li>
            <li><strong>Phone:</strong> ${safePhone}</li>
            ${safeMessage !== "No message provided." ? `<li><strong>Your message:</strong> ${safeMessage}</li>` : ""}
          </ul>
          <p>In the meantime, feel free to reply to this email if you have any questions.</p>
          <p style="margin-top:32px">Warm regards,<br/><strong>The Myscapez Team</strong></p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0"/>
          <p style="font-size:12px;color:#9ca3af">Myscapez · Premium Landscaping Services · Australia-wide</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[/api/contact]", err);
    return NextResponse.json(
      { error: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
}
