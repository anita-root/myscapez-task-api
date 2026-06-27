<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Resend (email) setup

This project can send transactional emails (welcome emails, promo codes, and lead notifications) using Resend. To enable it:

1. Copy `.env.local.example` to `.env.local` at the project root.
2. Add your Resend API key and a verified sending address:

```
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM_EMAIL=you@yourdomain.com
MYSCAPEZ_ADMIN_EMAIL=hello@myscapez.com.au
```

3. Ensure the `RESEND_FROM_EMAIL` is verified in your Resend account. Restart the dev server after adding env vars.

The form submissions on the site post to `/api/leads`, which will generate a 10% promo code and email both the admin and the lead using `src/lib/resend.ts`.

=======
# myscapez-task-api
Myscapez Websites for landscapers Australia
>>>>>>> fd7b999d9571aee03804e088ae67d62f93d61f81
