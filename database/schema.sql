-- Beach Vibes — database schema (Supabase Postgres)
-- Run this once in the Supabase SQL Editor (Dashboard > SQL Editor > New query > Run).
-- Safe to re-run: uses "if not exists" / "or replace" where possible.
--
-- Access model: the backend/ Express API is the only client that talks to
-- this database, using the Supabase service_role key (which bypasses RLS).
-- Tables below that back auth/orders have RLS enabled with NO policies,
-- so the anon/authenticated roles used by a browser client are locked out
-- entirely — only the service_role key can read or write them.

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
  -- Arabic translations, used by the frontend when the visitor switches
  -- language. Fall back to the English columns above when null.
  name_ar text,
  description_ar text,
  notes_ar jsonb,
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
-- one-time cleanup: retire the old artisanal/luxury catalog
-- ============================================================
-- The catalog was rebuilt from fragrance/home-decor/leather goods to
-- beach & swim gear under new ids, so "on conflict" below won't touch
-- these old rows — delete them by id first. Safe to re-run (deletes
-- zero rows once already gone). If this errors with a foreign key
-- violation, it means a real order still references one of these ids;
-- decide manually whether to keep or reassign that order before deleting.
delete from products where id in (
  'essence-of-azure', 'lessence-de-la-mer', 'locean-de-soie', 'neroli-des-bermudes',
  'monolith-ceramic-vase', 'artisanal-ceramic-vase', 'artisanal-linen-set',
  'cerulean-silk-wrap', 'midnight-silk-scarf', 'veau-grained-tote',
  'heritage-leather-tote', 'riviera-leather-sandal'
);

-- ============================================================
-- seed: product catalog (matches src/data/products.js)
-- ============================================================
insert into products (id, name, category, price, tone, image, material, rating, reviews, is_new, is_signature, description, notes, name_ar, description_ar, notes_ar)
values
  (
    'riviera-one-piece', 'Riviera One-Piece Swimsuit', 'Swimwear', 128, 'swimwear',
    null, 'Nylon', 4.8, 112, false, true,
    'A sculpted one-piece in UPF 50+ recycled nylon, cut for confident lines from poolside to shoreline.',
    null,
    'بدلة سباحة قطعة واحدة – ريفييرا',
    'بدلة سباحة من قطعة واحدة، مصنوعة من نايلون معاد تدويره بحماية UPF 50+، بقصة نحيلة تمنحك حضوراً واثقاً من حمام السباحة إلى الشاطئ.',
    null
  ),
  (
    'cerulean-bikini-set', 'Cerulean Bikini Set', 'Swimwear', 96, 'swimwear',
    null, 'Nylon', 4.6, 54, true, false,
    'A two-piece in a rich cerulean hue with adjustable ties and moderate coverage, built for long days in the water.',
    null,
    'طقم بيكيني بلون سماوي',
    'طقم بيكيني بلونٍ سماوي غني، بأربطة قابلة للتعديل وتغطية متوسطة، مصمم لأيامٍ طويلة في الماء.',
    null
  ),
  (
    'mineral-sunscreen-spf50', 'Mineral Sunscreen SPF 50', 'Sun Care', 34, 'suncare',
    null, 'Mineral', 4.9, 203, false, true,
    'A reef-safe, broad-spectrum mineral sunscreen that blends in clear and never feels greasy — the one bottle worth reapplying.',
    null,
    'واقي شمس معدني SPF 50',
    'واقٍ شمسي معدني آمن للشعاب المرجانية وواسع الطيف، يمتزج بالبشرة دون أثر أبيض أو لمعان دهني — الزجاجة الوحيدة التي تستحق إعادة الاستخدام.',
    null
  ),
  (
    'after-sun-aloe-balm', 'After-Sun Aloe Balm', 'Sun Care', 26, 'suncare',
    null, 'Mineral', 4.7, 68, true, false,
    'A cooling aloe and chamomile balm that calms sun-warmed skin and locks in moisture after a long day at the beach.',
    null,
    'بلسم الصبار لما بعد الشمس',
    'بلسم مهدئ من الصبار والبابونج يخفف احمرار البشرة المتعبة من الشمس ويحافظ على ترطيبها بعد يومٍ طويل على الشاطئ.',
    null
  ),
  (
    'turkish-beach-towel', 'Oversized Turkish Beach Towel', 'Beach Gear', 58, 'beachgear',
    null, 'Cotton', 4.8, 91, true, false,
    'Densely woven Turkish cotton that''s sand-resistant, quick-drying, and generous enough to share.',
    null,
    'منشفة شاطئ تركية كبيرة الحجم',
    'منشفة من القطن التركي المنسوج بإحكام، تقاوم الرمل وتجف بسرعة، وبحجمٍ كبير يكفي للمشاركة.',
    null
  ),
  (
    'portable-beach-umbrella', 'Portable Beach Umbrella', 'Beach Gear', 89, 'beachgear',
    null, 'Aluminum', 4.6, 47, false, false,
    'A UPF 50+ canopy on a corrosion-resistant aluminum pole, with a sand anchor for wind-steady shade.',
    null,
    'مظلة شاطئ محمولة',
    'مظلة بحماية UPF 50+ على عمودٍ من الألومنيوم المقاوم للتآكل، مزودة بمثبت رملي لظلٍ ثابت مهما اشتدت الرياح.',
    null
  ),
  (
    'anti-fog-swim-goggles', 'Anti-Fog Swim Goggles', 'Water Sports', 32, 'watersports',
    null, 'Rubber', 4.7, 84, false, false,
    'A wide-vision anti-fog lens with a soft silicone gasket for a leak-free, mark-free fit.',
    null,
    'نظارات سباحة مضادة للضباب',
    'عدسة بمجال رؤية واسع ومقاومة للضباب، بحشية سيليكون ناعمة لملاءمة محكمة دون تسرب أو أثر على الوجه.',
    null
  ),
  (
    'full-face-snorkel-mask', 'Full-Face Snorkel Mask', 'Water Sports', 68, 'watersports',
    null, 'Rubber', 4.8, 76, false, true,
    'A 180-degree panoramic mask with a dry-top snorkel and anti-fog ventilation, built for effortless breathing at the surface.',
    null,
    'قناع غطس كامل للوجه',
    'قناع بانورامي بزاوية رؤية 180 درجة مع أنبوب تنفس علوي جاف وتهوية مضادة للضباب، مصمم لتنفسٍ سلس عند سطح الماء.',
    null
  ),
  (
    'quick-dry-water-shoes', 'Quick-Dry Water Shoes', 'Footwear', 54, 'footwear',
    null, 'Neoprene', 4.5, 39, false, false,
    'Barefoot-feel neoprene shoes with a grippy sole, made for rocky shores and slippery decks alike.',
    null,
    'أحذية مائية سريعة الجفاف',
    'أحذية من النيوبرين بشعور قريب من الحفاء ونعل يمنع الانزلاق، مناسبة للشواطئ الصخرية وأسطح القوارب على حدٍ سواء.',
    null
  ),
  (
    'woven-raffia-sandals', 'Woven Raffia Sandals', 'Footwear', 72, 'footwear',
    null, 'Straw', 4.6, 28, true, false,
    'Hand-woven raffia straps on a cushioned footbed, easy enough for sand and polished enough for a beachside lunch.',
    null,
    'صنادل من الرافيا المنسوجة',
    'أحزمة من الرافيا المنسوجة يدوياً على نعلٍ مبطن، عملية على الرمال وأنيقة بما يكفي لغداءٍ قرب الشاطئ.',
    null
  ),
  (
    'woven-straw-beach-bag', 'Woven Straw Beach Bag', 'Accessories', 86, 'accessories',
    null, 'Straw', 4.7, 52, false, true,
    'A roomy hand-woven tote with a water-resistant lining, sized for towels, sunscreen, and everything else the day needs.',
    null,
    'حقيبة شاطئ من القش المنسوج',
    'حقيبة توتس واسعة منسوجة يدوياً ببطانة مقاومة للماء، تتسع للمناشف وواقي الشمس وكل ما يحتاجه يومك.',
    null
  ),
  (
    'packable-sun-hat', 'Packable Sun Hat', 'Accessories', 48, 'accessories',
    null, 'Straw', 4.5, 33, false, false,
    'A wide-brim straw hat that folds flat for travel and springs back into shape, with UPF 50+ coverage for face and neck.',
    null,
    'قبعة شمس قابلة للطي',
    'قبعة قش عريضة الحواف تُطوى بسهولة للسفر وتستعيد شكلها فوراً، بحماية UPF 50+ للوجه والرقبة.',
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
  notes = excluded.notes,
  name_ar = excluded.name_ar,
  description_ar = excluded.description_ar,
  notes_ar = excluded.notes_ar;

-- ============================================================
-- users
-- ============================================================
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  first_name text,
  last_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now()
);

-- Bootstrap the first admin manually after they've registered normally
-- through the app (there is deliberately no public "become admin" endpoint):
--   update users set role = 'admin' where email = 'you@example.com';

-- Safe to re-run against a users table that predates the role column:
alter table users add column if not exists role text not null default 'customer';
alter table users drop constraint if exists users_role_check;
alter table users add constraint users_role_check check (role in ('customer', 'admin'));

alter table users enable row level security;
-- No policies: only the backend (service_role key) may read/write.
-- Passwords are hashed with bcrypt before ever reaching this table
-- (see backend/src/utils/password.js) — this column never holds plaintext.

-- ============================================================
-- orders
-- ============================================================
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  email text not null,
  status text not null default 'pending',
  subtotal numeric not null,
  total numeric not null,
  shipping_address jsonb,
  created_at timestamptz default now()
);

alter table orders enable row level security;
-- No policies: only the backend may read/write. "A user can only see
-- their own orders" is enforced in application code
-- (backend/src/routes/orders.routes.js), not by RLS, since the backend
-- always queries with the service_role key.

-- ============================================================
-- order_items
-- ============================================================
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id text references products(id),
  product_name text not null,
  unit_price numeric not null,
  quantity integer not null,
  created_at timestamptz default now()
);

alter table order_items enable row level security;
-- No policies: only the backend may read/write, joined through orders.
