# Deployment

There are now three pieces: the **database** (Supabase Postgres), the
**backend** (Express API on Render), and the **frontend** (still at the repo
root, on Vercel). The frontend currently still talks to Supabase directly
(not yet wired to the backend) — that wiring is a follow-up step, so its
deployment instructions below are unchanged from before the backend existed.

## 1. Supabase (database)

1. Create a project at [supabase.com](https://supabase.com/dashboard) (free tier is fine).
2. **Project Settings → API** — copy the **Project URL**, the **anon public**
   key (for the frontend), and the **service_role** key (for the backend —
   keep this one secret, never put it in frontend code or a `VITE_`-prefixed
   env var).
3. **SQL Editor → New query** — paste the contents of `database/schema.sql`
   and run it. This creates `products`, `newsletter_subscribers`,
   `contact_messages`, `users`, `orders`, and `order_items`.
4. Locally (frontend): `cp .env.example .env.local` and fill in the URL/anon
   key, then `npm run dev`.

## 2. GitHub

Already pushed — `main` tracks
`https://github.com/OSAMA-HAMOOD-MAHYOOB-AHMED/BEACH-VIBES`.

## 3. Backend (Render)

The `backend/` Express API needs to run continuously, so it's a Render
**Web Service**, not a static site.

1. [dashboard.render.com](https://dashboard.render.com) → **New → Blueprint** →
   connect the repo. Render reads `render.yaml` and creates a Node web
   service rooted at `backend/`.
   - If a service already exists that was created manually (not via
     Blueprint) and is misconfigured (e.g. wrong runtime), fix it instead
     under **Settings → Build & Deploy**: Root Directory `backend`, Runtime
     `Node`, Build Command `npm install`, Start Command `npm start`.
2. Under **Environment**, set: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
   (the service_role key, not anon), `JWT_SECRET` (any long random string),
   and `CORS_ORIGIN` (the frontend's deployed URL, e.g.
   `https://your-frontend.vercel.app`).
3. Deploy. Confirm `https://<your-service>.onrender.com/api/health` returns
   `{"status":"ok"}`. Every push to `main` redeploys automatically.

## 4. Frontend (Vercel)

1. [vercel.com/new](https://vercel.com/new) → import the GitHub repo.
2. Framework preset auto-detects as Vite — no changes needed (`vercel.json`
   handles the SPA routing fallback).
3. Add environment variables (**Project Settings → Environment Variables**):
   `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
4. Deploy. Every push to `main` redeploys automatically.

## Notes

- The Supabase anon key is meant to be public/client-side — it only grants
  what the RLS policies in `database/schema.sql` allow. The service_role key
  is the opposite: it bypasses RLS entirely and must only ever live in the
  backend's server-side environment variables.
- To change the product catalog later, edit rows directly in the Supabase
  Table Editor (`products` table) — no redeploy needed, the frontend fetches
  on load (and once wired to the backend, the backend will too).
