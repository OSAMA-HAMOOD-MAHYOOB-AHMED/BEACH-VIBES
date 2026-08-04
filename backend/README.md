# Beach Vibes — Backend

Express API sitting between the frontend and the Supabase Postgres database
(see `../database/schema.sql`). The frontend never talks to Supabase
directly — it calls this API, which uses the Supabase **service_role** key
server-side and enforces auth/ownership in application code.

## Setup

1. Run `../database/schema.sql` in the Supabase SQL Editor (once) to create
   the tables.
2. `cp .env.example .env` and fill in `SUPABASE_URL`,
   `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → API — **not** the anon
   key), and a random `JWT_SECRET`.
3. `npm install`
4. `npm run dev` — starts on `http://localhost:4000` (or `PORT` from `.env`),
   restarting on file changes.

Requires Node 18.11+ (uses `node --watch`).

## API

All routes are prefixed with `/api`. **✔** routes require
`Authorization: Bearer <token>`; **✔ admin** routes additionally require the
caller's token to carry the `admin` role.

| Method | Path              | Auth | Description                          |
| ------ | ----------------- | ---- | ------------------------------------- |
| GET    | `/health`         | —    | Liveness check                        |
| POST   | `/auth/register`  | — (rate-limited) | `{ email, password, firstName?, lastName? }` → `{ token, user }`; new accounts default to the `customer` role |
| POST   | `/auth/login`     | — (rate-limited) | `{ email, password }` → `{ token, user }` |
| GET    | `/auth/me`        | ✔    | Current user (includes `role`)        |
| GET    | `/products`       | —    | List catalog                          |
| GET    | `/products/:id`   | —    | Single product                        |
| POST   | `/newsletter`     | —    | `{ email }` — subscribe               |
| POST   | `/contact`        | —    | `{ firstName, lastName, email, message }` |
| POST   | `/orders`         | ✔    | `{ items: [{ productId, quantity }], shippingAddress? }` — prices are looked up server-side, never trusted from the client |
| GET    | `/orders`         | ✔    | List the current user's orders        |
| GET    | `/orders/:id`     | ✔    | A single order (must belong to the caller) |
| POST   | `/admin/products` | ✔ admin | Create a product (`id` optional — auto-slugified from `name`) |
| PUT    | `/admin/products/:id` | ✔ admin | Partial update — only send the fields you're changing |
| DELETE | `/admin/products/:id` | ✔ admin | 409s if the product appears in existing `order_items` |
| GET    | `/admin/orders`   | ✔ admin | All orders, across all customers      |
| PATCH  | `/admin/orders/:id` | ✔ admin | `{ status }` — one of `pending`/`paid`/`shipped`/`cancelled` |
| GET    | `/admin/contact-messages` | ✔ admin | All contact form submissions |
| GET    | `/admin/newsletter-subscribers` | ✔ admin | All newsletter signups |
| GET    | `/admin/users`    | ✔ admin | All accounts (no password hashes)     |
| PATCH  | `/admin/users/:id/role` | ✔ admin | `{ role: "admin" \| "customer" }` |

Errors are always `{ "error": "message" }` with a non-2xx status.

## Authorization model

- **Authentication**: password login only, bcrypt-hashed (never stored or
  returned in plaintext), JWT bearer tokens (`JWT_EXPIRES_IN`, default 7d).
  `/auth/register` and `/auth/login` are rate-limited (20 requests / 15 min
  per IP) against brute-forcing.
- **Authorization**: every user has a `role` of `customer` or `admin`
  (`database/schema.sql`). The role is embedded in the JWT at login/register
  time, so a role change takes effect on the user's *next* login, not
  instantly — acceptable given the 7-day token lifetime.
- **Bootstrapping the first admin**: there is deliberately no API endpoint
  that grants admin — register normally, then run in the Supabase SQL
  Editor:
  ```sql
  update users set role = 'admin' where email = 'you@example.com';
  ```
  Every admin after that can be promoted from the dashboard's **Users** tab
  (`PATCH /admin/users/:id/role`), which an admin can't use on their own
  account (checked client-side; still enforce anything sensitive server-side
  if you extend this).
- **Transport/headers**: `helmet()` sets standard security headers, CORS is
  locked to `CORS_ORIGIN` (comma-separated for multiple frontends).
