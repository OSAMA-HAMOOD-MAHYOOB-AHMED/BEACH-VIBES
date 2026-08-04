-- Aqua Atelier — Supabase schema
-- Run this once in the Supabase SQL Editor (Dashboard > SQL Editor > New query > Run).
-- Safe to re-run: uses "if not exists" / "or replace" where possible.

-- ============================================================
-- products
-- ============================================================
create table if not exists products (
  id text primary key,
  name text not null,
  category text not null,
  price numeric not null,
  tone text not null,
  image text,
  material text,
  rating numeric,
  reviews integer default 0,
  is_new boolean default false,
  is_signature boolean default false,
  description text,
  notes jsonb,
  created_at timestamptz default now()
);

alter table products enable row level security;

drop policy if exists "Public read access" on products;
create policy "Public read access" on products
  for select using (true);

-- No insert/update/delete policy for the anon role: the catalog is
-- managed from the Supabase dashboard (Table Editor) or via the
-- service_role key, never from the browser.

-- ============================================================
-- newsletter_subscribers
-- ============================================================
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz default now()
);

alter table newsletter_subscribers enable row level security;

drop policy if exists "Public insert" on newsletter_subscribers;
create policy "Public insert" on newsletter_subscribers
  for insert with check (true);

-- No select/update/delete policy for anon: visitors can subscribe,
-- but cannot read back the list of subscribers.

-- ============================================================
-- contact_messages
-- ============================================================
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

alter table contact_messages enable row level security;

drop policy if exists "Public insert" on contact_messages;
create policy "Public insert" on contact_messages
  for insert with check (true);

-- ============================================================
-- seed: product catalog (matches src/data/products.js)
-- ============================================================
insert into products (id, name, category, price, tone, image, material, rating, reviews, is_new, is_signature, description, notes)
values
  (
    'essence-of-azure', 'Essence of Azure', 'Fragrance', 185, 'fragrance',
    '/images/products/essence-of-azure.jpg', 'Glass', 4.8, 96, true, false,
    'A luminous eau de parfum opening with citrus zest and settling into a warm, salt-kissed amber base.',
    '{"top":"Bergamot, Sea Salt, Lemon Zest","heart":"Jasmine Sambac, Neroli, Seaweed","base":"Ambergris, White Musk, Driftwood"}'
  ),
  (
    'lessence-de-la-mer', 'L''Essence de la Mer', 'Fragrance', 245, 'fragrance',
    '/images/products/lessence-de-la-mer.jpg', 'Glass', 4.9, 124, false, false,
    'A profound olfactory journey into the heart of the Mediterranean. This artisanal fragrance captures the fleeting moment of dawn over a serene coastline, blending crisp sea salt with the warmth of sun-drenched citrus and the grounding depth of coastal cedarwood.',
    '{"top":"Bergamot, Sea Salt, Lemon Zest","heart":"Jasmine Sambac, Neroli, Seaweed","base":"Ambergris, White Musk, Driftwood"}'
  ),
  (
    'locean-de-soie', 'L''Océan de Soie', 'Fragrance', 285, 'fragrance-gold',
    '/images/products/locean-de-soie.jpg', 'Glass', 4.9, 154, false, true,
    'An ethereal composition inspired by the silk-like surface of a calm morning sea. L''Océan de Soie opens with crisp sea salt and ozonic notes of white lotus, transitioning into a heart of white lotus and sun-bleached driftwood.',
    '{"top":"Sea Salt, Bergamot","heart":"White Lotus","base":"Driftwood, Ambergris, Mineral Musk"}'
  ),
  (
    'neroli-des-bermudes', 'Néroli des Bermudes', 'Fragrance', 245, 'fragrance',
    '/images/products/neroli-des-bermudes.jpg', 'Glass', 4.7, 58, false, false,
    'A bright, effervescent neroli fragrance layered over warm island musk and soft petitgrain.',
    null
  ),
  (
    'monolith-ceramic-vase', 'Monolith Ceramic Vase', 'Home Decor', 320, 'ceramic',
    '/images/products/monolith-ceramic-vase.jpg', 'Ceramic', 4.8, 41, false, false,
    'A sculptural stoneware vessel, hand-thrown and finished with a matte organic glaze inspired by coastal cliffs.',
    null
  ),
  (
    'artisanal-ceramic-vase', 'Artisanal Ceramic Vase', 'Home Decor', 240, 'ceramic',
    '/images/products/artisanal-ceramic-vase.jpg', 'Ceramic', 4.6, 33, true, false,
    'Wheel-thrown ceramic in a soft terracotta glaze, equally at home with a single stem or a full arrangement.',
    null
  ),
  (
    'artisanal-linen-set', 'Artisanal Linen Set', 'Home Goods', 145, 'linen',
    '/images/products/artisanal-linen-set.jpg', 'Linen', 4.7, 29, true, false,
    'Stone-washed European linen dining set, woven for softness that only improves with age.',
    null
  ),
  (
    'cerulean-silk-wrap', 'Cerulean Silk Wrap', 'Accessories', 450, 'silk',
    '/images/products/cerulean-silk-wrap.jpg', 'Silk', 4.6, 22, false, false,
    'Hand-painted mulberry silk wrap in a wave-inspired print, finished with hand-rolled edges.',
    null
  ),
  (
    'midnight-silk-scarf', 'Midnight Silk Scarf', 'Accessories', 320, 'silk',
    '/images/products/midnight-silk-scarf.jpg', 'Silk', 4.5, 18, false, false,
    'A jewel-toned silk twill scarf, versatile enough for the neck, hair, or handbag handle.',
    null
  ),
  (
    'veau-grained-tote', 'Veau Grained Tote', 'Leather Goods', 2400, 'leather',
    '/images/products/veau-grained-tote.jpg', 'Leather', 4.9, 47, false, false,
    'Structured tote in full-grain vitello leather with brushed brass hardware, made by hand in a single atelier.',
    null
  ),
  (
    'heritage-leather-tote', 'Heritage Leather Tote', 'Leather Goods', 850, 'leather',
    '/images/products/heritage-leather-tote.jpg', 'Leather', 4.7, 63, false, false,
    'A timeless top-handle tote in vegetable-tanned leather that patinas beautifully over years of wear.',
    null
  ),
  (
    'riviera-leather-sandal', 'Riviera Leather Sandal', 'Footwear', 680, 'footwear',
    '/images/products/riviera-leather-sandal.jpg', 'Leather', 4.6, 39, false, false,
    'Slim gladiator-style sandals in butter-soft leather straps, hand-cut and stitched in Southern Europe.',
    null
  )
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  price = excluded.price,
  tone = excluded.tone,
  image = excluded.image,
  material = excluded.material,
  rating = excluded.rating,
  reviews = excluded.reviews,
  is_new = excluded.is_new,
  is_signature = excluded.is_signature,
  description = excluded.description,
  notes = excluded.notes;
