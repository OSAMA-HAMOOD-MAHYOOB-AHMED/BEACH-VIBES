# Deployment

Three pieces: the **database** (Supabase Postgres), the **backend**
(Express API on Render), and the **frontend** (React/Vite, on Vercel). The
frontend only ever talks to the backend — it never touches Supabase
directly, so the anon key isn't used anywhere anymore.

## 1. Supabase (database)

1. Create a project at [supabase.com](https://supabase.com/dashboard) (free tier is fine).
2. **Project Settings → API** — copy the **Project URL** and the
   **service_role** key (for the backend only — keep this secret, it
   bypasses Row Level Security entirely).
3. **SQL Editor → New query** — paste the contents of `database/schema.sql`
   and run it. This creates `products`, `newsletter_subscribers`,
   `contact_messages`, `users` (with a `role` column: `customer`/`admin`),
   `orders`, and `order_items`.

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
   `https://your-frontend.vercel.app` — comma-separate multiple origins).
3. Deploy. Confirm `https://<your-service>.onrender.com/api/health` returns
   `{"status":"ok"}`. Every push to `main` redeploys automatically.
4. **Create the first admin**: register a normal account through the
   deployed site, then in Supabase **SQL Editor** run:
   ```sql
   update users set role = 'admin' where email = 'you@example.com';
   ```
   Log out and back in on the site — the account now has an **Admin** link
   in the nav and access to `/admin`. There's deliberately no API endpoint
   that grants the first admin; every admin after that can be promoted from
   the dashboard's Users tab instead.

## 4. Frontend (Vercel)

1. [vercel.com/new](https://vercel.com/new) → import the GitHub repo.
2. Framework preset auto-detects as Vite — no changes needed (`vercel.json`
   handles the SPA routing fallback).
3. Add environment variable (**Project Settings → Environment Variables**):
   `VITE_API_URL` — the Render backend's URL, e.g.
   `https://beach-vibes-backend.onrender.com`.
4. Deploy. Every push to `main` redeploys automatically. Once you know the
   Vercel URL, add it to the backend's `CORS_ORIGIN` (step 3 above) and
   redeploy the backend.

## Notes

- The service_role key must only ever live in the backend's server-side
  environment variables — never in a `VITE_`-prefixed one, since those are
  bundled into the browser JavaScript.
- To change the product catalog, use the **Admin Dashboard** (`/admin/products`
  once logged in as an admin) rather than editing Supabase directly — the
  dashboard keeps English/Arabic fields in sync and won't leave orphaned
  `order_items` pointing at a deleted product (the API blocks that delete).
- Login tokens (JWTs) expire after 7 days by default (`JWT_EXPIRES_IN` in
  the backend env) and are stored in the browser's `localStorage`.
