# Beach Vibes

A storefront being split into three layers:

```
.               React + Vite frontend (temporary location — see note below)
backend/        Express API — see backend/README.md
database/       Supabase Postgres schema — see database/schema.sql
```

## Backend + database

The backend is the only thing that talks to the database, using a Supabase
service_role key server-side. See [`backend/README.md`](backend/README.md)
for setup and the full API reference, and
[`database/schema.sql`](database/schema.sql) for the table definitions
(products, newsletter_subscribers, contact_messages, users, orders,
order_items).

## Frontend

Currently still at the repo root (the original `src/`, `public/`,
`index.html`, etc.) and talks to Supabase directly via
`src/lib/supabaseClient.js`. Moving it into its own `frontend/` folder and
switching it to call the new backend API instead of Supabase directly is
the next step — see `DEPLOYMENT.md` for the current (pre-backend)
deployment setup, which will also need updating once that happens.
