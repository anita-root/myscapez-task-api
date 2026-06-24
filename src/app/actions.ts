"use server";

import { sendEmail } from "../lib/resend";

type LeadState = {
  success: boolean;
  message: string;
};

const initialState: LeadState = {
  success: false,
  message: "",
};

export async function submitLead(
  previousState: LeadState = initialState,
  formData: FormData,
): Promise<LeadState> {
  void previousState;

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return {
      success: false,
      message: "Please fill out all fields.",
    };
  }

  const recipient =
    process.env.LEAD_RECIPIENT_EMAIL ?? process.env.RESEND_FROM_EMAIL;

  if (!recipient) {
    return {
      success: false,
      message: "Set LEAD_RECIPIENT_EMAIL or RESEND_FROM_EMAIL in your environment.",
    };
  }

  const result = await sendEmail({
    to: recipient,
    subject: `New lead from ${name}`,
    replyTo: email,
    html: `
      <h1>New lead from MyScapez</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br />")}</p>
    `,
  });

  if (!result.ok) {
    return {
      success: false,
      message: result.message,
    };
  }

  return {
    success: true,
    message: "Thanks. I’ll be in touch shortly.",
  };
}