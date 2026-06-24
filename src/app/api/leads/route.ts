import { NextResponse } from "next/server";
import { sendEmail } from "../../../lib/resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      business,
      email,
      phone,
      services,
      message,
      marketing,
      doNotSell,
      variant,
    } = body;

    const promoCode = `TAX10-${Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase()}`;

    const adminEmail =
      process.env.MYSCAPEZ_ADMIN_EMAIL || process.env.RESEND_FROM_EMAIL;

    if (!adminEmail) {
      return NextResponse.json(
        { ok: false, message: "Server email is not configured." },
        { status: 500 }
      );
    }

    const subject = `New ${variant || "lead"} from ${
      name || business || "website"
    }`;

    const html = `
      <h2>New lead — MyScapez</h2>
      <p><strong>Name:</strong> ${name || "-"}</p>
      <p><strong>Business:</strong> ${business || "-"}</p>
      <p><strong>Email:</strong> ${email || "-"}</p>
      <p><strong>Phone:</strong> ${phone || "-"}</p>
      <p><strong>Services:</strong> ${(services || []).join(", ")}</p>
      <p><strong>Message:</strong><br/>${message || "-"}</p>
      <p><strong>Marketing consent:</strong> ${marketing ? "Yes" : "No"}</p>
      <p><strong>Do not sell/share:</strong> ${doNotSell ? "Yes" : "No"}</p>
      <p><strong>Promo code:</strong> ${promoCode}</p>
    `;

    await sendEmail({
      to: adminEmail,
      subject,
      html,
      replyTo: email,
    });

    if (email) {
      await sendEmail({
        to: email,
        subject: "Your MyScapez 10% Tax Time Discount Code",
        html: `
          <h1>Thanks for contacting MyScapez</h1>
          <p>Here is your Tax Time promo code for 10% off your first project:</p>
          <h2>${promoCode}</h2>
          <p>Use this code within 30 days. Terms &amp; conditions apply.</p>
        `,
      });
    }

    return NextResponse.json({
      ok: true,
      message: "Lead submitted successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { ok: false, message: "Failed to submit lead." },
      { status: 500 }
    );
  }
}
