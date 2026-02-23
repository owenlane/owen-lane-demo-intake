# Dental Patient Digital Intake — MVP v1

## 1. High-Level Architecture

```
┌──────────────┐      HTTPS       ┌──────────────┐     service_role     ┌──────────────┐
│              │  ──────────────►  │              │  ──────────────────►  │              │
│   Frontend   │                  │   Backend    │                       │   Supabase   │
│   (Vercel)   │  ◄──────────────  │   (Render)   │  ◄──────────────────  │   Postgres   │
│   Next.js    │      JSON        │   Express    │      SQL / RPC       │              │
└──────────────┘                  └──────────────┘                       └──────────────┘
```

- **Frontend** (Next.js 14, App Router): Patient intake wizard + admin dashboard. Deployed on Vercel. Calls backend API via `NEXT_PUBLIC_API_URL`.
- **Backend** (Express + TypeScript): Stateless REST API. Handles validation (zod), auth (JWT + bcrypt), audit logging, CORS, rate limiting, Helmet headers. Deployed on Render.
- **Database** (Supabase Postgres): Backend connects via `supabase-js` with the **service role key** (bypasses RLS). The service key is NEVER exposed to the frontend.

Data flow:
1. Patient fills multi-step form → submits to `POST /api/intake/submit`
2. Backend validates, sanitizes, inserts into `patients` + `intake_submissions`
3. Admin logs in → JWT token → calls protected `/api/admin/*` routes
4. Admin views/filters/exports submissions, updates status


## 2. Folder Structure

```
/frontend
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # redirects → /intake
│   │   ├── intake/page.tsx             # multi-step wizard
│   │   └── admin/
│   │       ├── login/page.tsx
│   │       └── submissions/
│   │           ├── page.tsx            # list + search + export
│   │           └── [id]/page.tsx       # detail view
│   └── lib/
│       ├── api.ts                      # fetch wrapper
│       └── constants.ts                # medical conditions list
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── postcss.config.js
└── .env.example

/backend
├── src/
│   ├── index.ts                        # Express app entry
│   ├── seed.ts                         # demo data seeder
│   ├── routes/
│   │   ├── intake.ts                   # POST /api/intake/submit
│   │   └── admin.ts                    # all /api/admin/* routes
│   ├── middleware/
│   │   └── auth.ts                     # JWT verify + role check
│   ├── validators/
│   │   └── schemas.ts                  # zod schemas
│   └── lib/
│       ├── supabase.ts                 # supabase client
│       ├── audit.ts                    # activity log writer
│       └── sanitize.ts                 # HTML sanitization
├── package.json
├── tsconfig.json
└── .env.example
```


## 3–4. Source Code

All source code is provided in the accompanying files. See the `/frontend` and `/backend` directories.


## 5. Supabase SQL

**Schema:** `supabase-schema.sql` — creates all 4 tables with indexes.
**Seed:** `supabase-seed.sql` — inserts 1 admin user + 2 sample submissions.

Alternatively, run `npm run seed` from the backend after setting env vars.


## 6. Environment Variables

### Backend (`/backend/.env`)
```
PORT=4000
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...           # from Supabase dashboard → Settings → API
JWT_SECRET=generate-a-random-64-char-string      # openssl rand -hex 32
FRONTEND_URL=https://your-app.vercel.app         # for CORS
```

### Frontend (`/frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```


## 7. Render Deployment (Backend)

1. Push `/backend` to its own GitHub repo (e.g., `dental-intake-api`).
2. Go to [render.com](https://render.com) → New → **Web Service**.
3. Connect your GitHub repo.
4. Settings:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment:** Node
   - **Node Version:** 20+
5. Add environment variables in Render dashboard:
   - `PORT` = `4000` (Render sets its own, but add as fallback)
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
   - `FRONTEND_URL` = your Vercel domain
6. Deploy. Note the URL (e.g., `https://dental-intake-api.onrender.com`).
7. Seed the database: run `SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx src/seed.ts` locally, OR run the SQL seed directly in Supabase SQL Editor.


## 8. Vercel Deployment (Frontend)

1. Push `/frontend` to its own GitHub repo (e.g., `dental-intake-app`).
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo.
3. Framework Preset: **Next.js** (auto-detected).
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://dental-intake-api.onrender.com/api`
5. Deploy.
6. Copy the deployed URL and update `FRONTEND_URL` in Render's env vars (for CORS).


## 9. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** and run `supabase-schema.sql`.
3. Run `supabase-seed.sql` (or use `npm run seed` from backend).
4. Go to **Settings → API** and copy:
   - `Project URL` → use as `SUPABASE_URL`
   - `service_role` key → use as `SUPABASE_SERVICE_ROLE_KEY`
5. **NEVER** use the anon key on the backend. **NEVER** expose the service role key to the frontend.
6. **RLS (optional defense-in-depth):** Enable RLS on all tables and add a policy that allows only `service_role` access. See comments in `supabase-schema.sql`.


## 10. Security Checklist (HIPAA-Aware)

### Transport
- [x] HTTPS enforced on all endpoints (Vercel + Render provide TLS by default)
- [x] CORS locked to specific frontend origin
- [x] Helmet.js secure headers (HSTS, X-Content-Type-Options, X-Frame-Options, etc.)

### Authentication & Authorization
- [x] Passwords hashed with bcrypt (cost factor 12)
- [x] JWT tokens with expiration (8 hours)
- [x] Auth middleware on all admin routes
- [x] Role-based access control (admin, staff)
- [x] Rate limiting on login (10 attempts / 15 min)
- [x] Rate limiting on all API routes (100 req / 15 min)

### Input Security
- [x] Zod schema validation on all inputs
- [x] HTML sanitization on all string inputs (sanitize-html)
- [x] Request body size limited to 1MB

### Data Protection
- [x] Service role key used ONLY on backend, NEVER exposed to browser
- [x] Supabase RLS guidance provided (defense-in-depth)
- [x] PHI stored in Postgres (Supabase) with encryption at rest (Supabase default)
- [x] No PHI in URL params or query strings
- [x] Audit logging on all admin actions (login, view, status change, export)

### HIPAA Considerations for Production
- [ ] Sign a BAA (Business Associate Agreement) with Supabase (requires Pro plan)
- [ ] Sign a BAA with Render / use HIPAA-eligible hosting
- [ ] Implement session timeout / auto-logout
- [ ] Add MFA for admin accounts
- [ ] Enable database audit trail (Supabase pg_audit)
- [ ] Set up encrypted backups with tested restore procedures
- [ ] Implement data retention / purge policies
- [ ] Conduct penetration testing
- [ ] Complete a formal HIPAA risk assessment
- [ ] Train all staff on PHI handling procedures
- [ ] Implement breach notification procedures
