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

All routes are prefixed with `/api`. Protected routes require
`Authorization: Bearer <token>`.

| Method | Path              | Auth | Description                          |
| ------ | ----------------- | ---- | ------------------------------------- |
| GET    | `/health`         | —    | Liveness check                        |
| POST   | `/auth/register`  | —    | `{ email, password, firstName?, lastName? }` → `{ token, user }` |
| POST   | `/auth/login`     | —    | `{ email, password }` → `{ token, user }` |
| GET    | `/auth/me`        | ✔    | Current user                          |
| GET    | `/products`       | —    | List catalog                          |
| GET    | `/products/:id`   | —    | Single product                        |
| POST   | `/newsletter`     | —    | `{ email }` — subscribe               |
| POST   | `/contact`        | —    | `{ firstName, lastName, email, message }` |
| POST   | `/orders`         | ✔    | `{ items: [{ productId, quantity }], shippingAddress? }` — prices are looked up server-side, never trusted from the client |
| GET    | `/orders`         | ✔    | List the current user's orders        |
| GET    | `/orders/:id`     | ✔    | A single order (must belong to the caller) |

Errors are always `{ "error": "message" }` with a non-2xx status.
