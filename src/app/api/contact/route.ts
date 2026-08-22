import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, phone, message } = await request.json();

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { message: "Missing RESEND_API_KEY" },
        { status: 500 }
      );
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "MyScapez <onboarding@resend.dev>",
      to: ["myscapezcrerations@gmail.com"],
      reply_to: email,
      subject: `New MyScapez quote request from ${name}`,
      html: `
        <h2>New MyScapez Lead</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);

      return NextResponse.json(
        { message: error.message || "Email failed to send." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Email sent successfully.", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);

    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
