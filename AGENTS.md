**<!-- BEGIN:nextjs-**agent**-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Repo Facts

- Use `npm run dev`, `npm run build`, and `npm run lint` for the primary local workflow.
- The app router entrypoint is `src/app/page.tsx`; shared sections live in `src/components/`.
- Global styling and shared UI helpers belong in `src/app/globals.css`.
- The lead form posts to `src/app/api/leads/route.ts`; email setup lives in the README.
- Prefer `next/image` for logos and large imagery; the navbar and hero already use it.

## Working Conventions**

- Keep edits small and localized; avoid broad refactors unless the request calls for them.
- Preserve the existing Tailwind-first styling approach and add reusable classes in `globals.css` when a pattern repeats.
- Keep navbar and hero content responsive across desktop and mobile breakpoints.
- When changing form or API behavior, validate the full flow against the lead route instead of editing UI only.

## Useful References

- [README.md][def] for setup and Resend environment variables.
- 

- [src/app/api/leads/route.ts](src/app/api/leads/route.ts) for submission handling.
- [src/app/globals.css](src/app/globals.css) for shared design tokens and custom classes.


[def]: README.md