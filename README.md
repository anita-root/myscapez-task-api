# Myscapez Landing Page

A lead-capture landing page for **Myscapez** – premium landscaping services across Australia.

Built with **Next.js 16 (App Router)**, **Tailwind CSS v4**, and **Resend** for email delivery. Deployable to **Vercel** in minutes.

---

## Features

- 🌿 Clean, mobile-responsive landing page with hero, services, and stats sections
- 📬 Lead capture form (name, email, phone, service interest, message)
- ✉️ Automated emails via [Resend](https://resend.com):
  - Notification email to the business inbox on every new submission
  - Confirmation email to the lead with their enquiry summary
- ⚡ API route `/api/contact` with input validation and error handling
- 🚀 One-click Vercel deployment

---

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/anita-root/myscapez-task-api.git
cd myscapez-task-api
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | Your Resend API key from [resend.com/api-keys](https://resend.com/api-keys) |
| `BUSINESS_EMAIL` | Inbox that receives new lead notifications |
| `FROM_EMAIL` | Verified "From" address in your Resend account |

> **Domain verification:** The `FROM_EMAIL` domain must be verified in Resend. During development you can use `onboarding@resend.dev` as the From address (limits delivery to your own verified email).

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Add the three environment variables (`RESEND_API_KEY`, `BUSINESS_EMAIL`, `FROM_EMAIL`) in the Vercel project settings.
4. Click **Deploy** – done!

---

## Project Structure

```
src/
  app/
    page.tsx            # Landing page UI
    layout.tsx          # Root layout & metadata
    globals.css         # Global Tailwind styles
    api/
      contact/
        route.ts        # POST /api/contact – validates form & sends emails
.env.example            # Environment variable template
vercel.json             # Vercel deployment config
```

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Next.js](https://nextjs.org) | React framework (App Router) |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| [Resend](https://resend.com) | Transactional email API |
| [Vercel](https://vercel.com) | Hosting & serverless functions |
