# Deployment

The app degrades gracefully if Supabase isn't configured (falls back to the
static catalog in `src/data/products.js`, forms just show a local success
message), so these steps can be done in any order — but Supabase first means
Vercel/Render go live with the real backend from the start.

## 1. Supabase (database)

1. Create a project at [supabase.com](https://supabase.com/dashboard) (free tier is fine).
2. **Project Settings → API** — copy the **Project URL** and the **anon public** key.
3. **SQL Editor → New query** — paste the contents of `supabase/schema.sql` and run it.
   This creates `products` (seeded with the current catalog), `newsletter_subscribers`,
   and `contact_messages`, each with Row Level Security locked down appropriately
   (public read on products, public insert-only on the two form tables).
4. Locally: `cp .env.example .env.local` and fill in the URL/key, then `npm run dev`
   to confirm the site now reads from Supabase (the newsletter/contact forms will
   start actually saving rows).

## 2. GitHub

The repo is initialized locally with one commit on `main`, not yet pushed.

1. Create an **empty** repo at [github.com/new](https://github.com/new) — don't
   initialize it with a README/.gitignore/license (we already have those).
2. Push:
   ```
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

## 3. Vercel

1. [vercel.com/new](https://vercel.com/new) → import the GitHub repo.
2. Framework preset auto-detects as Vite — no changes needed (`vercel.json`
   handles the SPA routing fallback).
3. Add environment variables (**Project Settings → Environment Variables**):
   `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
4. Deploy. Every push to `main` redeploys automatically.

## 4. Render

1. [dashboard.render.com](https://dashboard.render.com) → **New → Blueprint** →
   connect the same GitHub repo. Render auto-detects `render.yaml`.
2. It will prompt for `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` since
   those are marked `sync: false` in the blueprint — paste the same values.
3. Deploy. Every push to `main` redeploys automatically here too.

## Notes

- The Supabase anon key is meant to be public/client-side — it only grants
  what the RLS policies in `supabase/schema.sql` allow.
- To change the product catalog later, edit rows directly in the Supabase
  Table Editor (`products` table) — no redeploy needed, the site fetches on load.
