## Copilot instructions for this repo

Purpose: Help AI coding agents become productive quickly by documenting the app structure, conventions, and where to make safe changes.

- **Big picture**: This is a Next.js (app router) frontend (src/app) built with TypeScript, TailwindCSS and client components. The UI is a single-purpose patient intake form with an admin area for viewing submissions.

- **Key places to look**:
  - [src/app](src/app) — routes and pages (app router). Root layout: [src/app/layout.tsx](src/app/layout.tsx).
  - [src/app/intake/page.tsx](src/app/intake/page.tsx) — the main multi-step client form; shows localStorage draft save and inline validation patterns.
  - [src/lib/api.ts](src/lib/api.ts) and [src/lib/app.ts](src/lib/app.ts) — API helper modules. The frontend expects an external API (env: `NEXT_PUBLIC_API_URL`) and calls endpoints like `/api/intake` and `/api/admin/*`.
  - [src/lib/client.ts](src/lib/client.ts) — single location for clinic display strings (use this when changing displayed name/phone/title).
  - [src/lib/constants.ts](src/lib/constants.ts) — lists like `MEDICAL_CONDITIONS` used in the form.

- **API / network conventions**:
  - The base API URL is taken from `NEXT_PUBLIC_API_URL` (fallbacks to `http://localhost:4000`). Change that env var when pointing to a dev/staging backend.
  - The project exposes a small `api` surface (see `src/lib/app.ts` and `src/lib/api.ts`). Pages import from `@/lib/api` (example: `import { submitIntake } from '@/lib/api'`).
  - Note: `src/lib/api.ts` currently contains duplicated/incorrect code around submissions — verify and prefer the cleaner `api` object in `src/lib/app.ts` when making fixes.

- **Frontend conventions & patterns**:
  - Pages in `src/app` default to server components; a file starting with `'use client'` is a client component (see intake page). Use hooks, state, and localStorage only in client components.
  - Tailwind classes are used everywhere; prefer adding utility classes or small component wrappers in `src/app/components` when needed.
  - Icons: `lucide-react` is used for inline icons.
  - Absolute import alias `@/` maps to the `src` folder — use this consistently.

- **Developer workflows**:
  - Start dev server: `npm run dev` (Next dev on default port).
  - Build: `npm run build`.
  - Start production server: `npm run start` after build.
  - Lint: `npm run lint`.

- **Common edits & where to change them**:
  - Change display text / contact: `src/lib/client.ts`.
  - Add or edit intake form fields and validation: `src/app/intake/page.tsx` (client component). Follow the existing step/validation style (validate per-step with `validateStep`).
  - Add new API calls: extend `src/lib/app.ts` (or `src/lib/api.ts`) and update imports in pages.

- **Testing / manual checks for PRs**:
  - Run `npm run dev` and exercise the intake flow locally. The form saves drafts to localStorage under key `dental_intake_draft` — clear that when retesting.
  - For admin features, ensure the backend is reachable (set `NEXT_PUBLIC_API_URL`) and that Bearer token flows use the `Authorization` header as shown in the API helpers.

- **Safety notes for automated agents**:
  - Avoid changing UI text in isolation; prefer editing `src/lib/client.ts` for display strings so content is centralized.
  - When touching `src/lib/api.ts`, run a quick smoke test of pages importing it because this file currently has a duplicated/ malformed section for submissions.
  - Keep changes minimal and consistent with existing Tailwind utilities and component patterns.

If anything in these notes is unclear or you'd like more examples (imports, exact lines to edit, or a small fix to `src/lib/api.ts`), tell me which area to expand and I will update this file.
