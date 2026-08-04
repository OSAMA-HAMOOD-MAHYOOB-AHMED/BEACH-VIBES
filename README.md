# Beach Vibes

A storefront split into three layers:

```
.               React + Vite frontend (temporary location — see note below)
backend/        Express API — see backend/README.md
database/       Supabase Postgres schema — see database/schema.sql
```

## Backend + database

The backend is the only thing that talks to the database, using a Supabase
service_role key server-side. It also owns auth (JWT + bcrypt), authorization
(`customer`/`admin` roles), and an admin-only API for managing products,
orders, and messages. See [`backend/README.md`](backend/README.md) for setup,
the full API reference, and how to promote the first admin account, and
[`database/schema.sql`](database/schema.sql) for the table definitions
(products, newsletter_subscribers, contact_messages, users, orders,
order_items).

## Frontend

Currently still at the repo root (the original `src/`, `public/`,
`index.html`, etc.). It talks only to the backend API (`VITE_API_URL`,
see `.env.example`) — never to Supabase directly. Moving it into its own
`frontend/` folder is still a pending cleanup step; see `DEPLOYMENT.md`
for the current deployment setup.

Auth/admin surface:
- `/login`, `/register`, `/account` — sign in, sign up, order history
- `/checkout` — requires being signed in
- `/admin` (products/orders/messages/users) — requires the `admin` role,
  guarded both client-side (`RequireAdmin`) and on every backend endpoint
