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
  -- Original pre-discount price; product is "on sale" when this is set
  -- and greater than price.
  compare_at_price numeric,
  -- House/vendor label. Defaults to the storefront's own brand; a
  -- second value only becomes meaningful once a second real vendor is
  -- onboarded (see /brands and the admin product form).
  brand text default 'Beach Vibes',
  -- Optional array of hex swatches, e.g. '["#0f2a40","#2e7d95"]'. Purely
  -- visual — there's no per-color inventory/SKU tracking.
  colors jsonb,
  created_at timestamptz default now()
);

alter table products enable row level security;

-- Safe to re-run against a products table that predates these columns:
alter table products add column if not exists compare_at_price numeric;
alter table products add column if not exists brand text default 'Beach Vibes';
alter table products add column if not exists colors jsonb;

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
insert into products (id, name, category, price, compare_at_price, tone, image, material, brand, colors, rating, reviews, is_new, is_signature, description, notes, name_ar, description_ar, notes_ar)
values
  (
    'riviera-one-piece', 'Riviera One-Piece Swimsuit', 'Swimwear', 128, null, 'swimwear',
    'https://images.unsplash.com/photo-1542427361-4388a46a654a?auto=format&fit=crop&w=800&q=80', 'Nylon', 'Beach Vibes', '["#0f2a40","#2e7d95","#1c1c1c"]', 4.8, 112, false, true,
    'A sculpted one-piece in UPF 50+ recycled nylon, cut for confident lines from poolside to shoreline.',
    null,
    'بدلة سباحة قطعة واحدة – ريفييرا',
    'بدلة سباحة من قطعة واحدة، مصنوعة من نايلون معاد تدويره بحماية UPF 50+، بقصة نحيلة تمنحك حضوراً واثقاً من حمام السباحة إلى الشاطئ.',
    null
  ),
  (
    'cerulean-bikini-set', 'Cerulean Bikini Set', 'Swimwear', 96, 120, 'swimwear',
    'https://images.unsplash.com/photo-1656457981333-a9e055bd783f?auto=format&fit=crop&w=800&q=80', 'Nylon', 'Beach Vibes', '["#2e7d95","#0f2a40"]', 4.6, 54, true, false,
    'A two-piece in a rich cerulean hue with adjustable ties and moderate coverage, built for long days in the water.',
    null,
    'طقم بيكيني بلون سماوي',
    'طقم بيكيني بلونٍ سماوي غني، بأربطة قابلة للتعديل وتغطية متوسطة، مصمم لأيامٍ طويلة في الماء.',
    null
  ),
  (
    'amalfi-swim-trunks', 'Amalfi Swim Trunks', 'Swimwear', 68, null, 'swimwear',
    'https://images.unsplash.com/photo-1617951907145-53f6eb87a3a3?auto=format&fit=crop&w=800&q=80', 'Nylon', 'Beach Vibes', '["#1c1c1c","#2e7d95","#c96b4a"]', 4.7, 41, false, false,
    'Quick-dry swim trunks in a mid-length cut with a mesh liner and secure zip pocket, built for the water and the walk back.',
    null,
    'شورت سباحة أمالفي',
    'شورت سباحة سريع الجفاف بطول متوسط وبطانة شبكية وجيب بسحاب آمن، مناسب للماء وللطريق عودةً منه.',
    null
  ),
  (
    'sun-washed-kaftan', 'Sun-Washed Kaftan', 'Beachwear', 118, null, 'beachwear',
    'https://images.unsplash.com/photo-1753192103616-53e7e0ef83e6?auto=format&fit=crop&w=800&q=80', 'Cotton', 'Beach Vibes', '["#f2a488","#f4ecd8"]', 4.7, 36, false, true,
    'A breezy cotton kaftan in a sun-bleached wash, cut loose enough to throw over a swimsuit or wear on its own at golden hour.',
    null,
    'قفطان مغسول بالشمس',
    'قفطان قطني منعش بغسلة مبيّضة بالشمس، بقصة فضفاضة تُلبس فوق ملابس السباحة أو بمفردها عند الغروب.',
    null
  ),
  (
    'printed-sarong-wrap', 'Printed Sarong Wrap', 'Beachwear', 52, null, 'beachwear',
    'https://plus.unsplash.com/premium_photo-1780358592028-811e9b139c0c?auto=format&fit=crop&w=800&q=80', 'Cotton', 'Beach Vibes', '["#2e7d95","#c96b4a"]', 4.5, 22, true, false,
    'A lightweight cotton sarong in a hand-drawn wave print, tied a dozen ways from beach cover-up to sundress.',
    null,
    'لفة ساحلية بنقشة مطبوعة',
    'لفة قطنية خفيفة بنقشة أمواج مرسومة يدوياً، تُربط بعشرات الطرق من غطاء شاطئ إلى فستان صيفي.',
    null
  ),
  (
    'quick-dry-water-shoes', 'Quick-Dry Water Shoes', 'Footwear', 54, null, 'footwear',
    'https://plus.unsplash.com/premium_photo-1770507229353-febfcc8f98fc?auto=format&fit=crop&w=800&q=80', 'Neoprene', 'Beach Vibes', null, 4.5, 39, false, false,
    'Barefoot-feel neoprene shoes with a grippy sole, made for rocky shores and slippery decks alike.',
    null,
    'أحذية مائية سريعة الجفاف',
    'أحذية من النيوبرين بشعور قريب من الحفاء ونعل يمنع الانزلاق، مناسبة للشواطئ الصخرية وأسطح القوارب على حدٍ سواء.',
    null
  ),
  (
    'woven-raffia-sandals', 'Woven Raffia Sandals', 'Footwear', 72, null, 'footwear',
    'https://plus.unsplash.com/premium_photo-1777047775890-6d3f391230ab?auto=format&fit=crop&w=800&q=80', 'Straw', 'Beach Vibes', null, 4.6, 28, true, false,
    'Hand-woven raffia straps on a cushioned footbed, easy enough for sand and polished enough for a beachside lunch.',
    null,
    'صنادل من الرافيا المنسوجة',
    'أحزمة من الرافيا المنسوجة يدوياً على نعلٍ مبطن، عملية على الرمال وأنيقة بما يكفي لغداءٍ قرب الشاطئ.',
    null
  ),
  (
    'classic-flip-flops', 'Classic Rubber Flip-Flops', 'Footwear', 28, null, 'footwear',
    'https://images.unsplash.com/photo-1659963970293-b12cfeb286c5?auto=format&fit=crop&w=800&q=80', 'Rubber', 'Beach Vibes', null, 4.4, 67, false, false,
    'Soft rubber flip-flops with a contoured footbed and a sole that grips wet tile as well as dry sand.',
    null,
    'شبشب مطاطي كلاسيكي',
    'شبشب من المطاط الناعم بقاعدة مقوسة تدعم القدم ونعل يثبت جيداً على البلاط المبلل والرمل الجاف على حد سواء.',
    null
  ),
  (
    'anti-fog-swim-goggles', 'Anti-Fog Swim Goggles', 'Swimming Equipment', 32, null, 'swimequipment',
    'https://images.unsplash.com/photo-1533060629428-48484ce98a74?auto=format&fit=crop&w=800&q=80', 'Rubber', 'Beach Vibes', null, 4.7, 84, false, false,
    'A wide-vision anti-fog lens with a soft silicone gasket for a leak-free, mark-free fit.',
    null,
    'نظارات سباحة مضادة للضباب',
    'عدسة بمجال رؤية واسع ومقاومة للضباب، بحشية سيليكون ناعمة لملاءمة محكمة دون تسرب أو أثر على الوجه.',
    null
  ),
  (
    'full-face-snorkel-mask', 'Full-Face Snorkel Mask', 'Swimming Equipment', 68, 82, 'swimequipment',
    'https://images.unsplash.com/photo-1569397726135-cf39bc57e5e3?auto=format&fit=crop&w=800&q=80', 'Rubber', 'Beach Vibes', null, 4.8, 76, false, true,
    'A 180-degree panoramic mask with a dry-top snorkel and anti-fog ventilation, built for effortless breathing at the surface.',
    null,
    'قناع غطس كامل للوجه',
    'قناع بانورامي بزاوية رؤية 180 درجة مع أنبوب تنفس علوي جاف وتهوية مضادة للضباب، مصمم لتنفسٍ سلس عند سطح الماء.',
    null
  ),
  (
    'silicone-swim-cap', 'Silicone Swim Cap', 'Swimming Equipment', 22, null, 'swimequipment',
    'https://images.unsplash.com/photo-1528803030572-cf341cadda3e?auto=format&fit=crop&w=800&q=80', 'Rubber', 'Beach Vibes', null, 4.5, 31, false, false,
    'A durable silicone cap that grips without pulling, cutting drag for laps and keeping hair dry-ish at the beach.',
    null,
    'قبعة سباحة سيليكون',
    'قبعة سيليكون متينة تثبت دون أن تشد الشعر، تقلل مقاومة الماء أثناء السباحة وتحافظ على الشعر شبه جاف على الشاطئ.',
    null
  ),
  (
    'inflatable-sup-board', 'Inflatable Stand-Up Paddleboard', 'Water Sports', 449, null, 'watersports',
    'https://plus.unsplash.com/premium_photo-1681256187429-a68de5e61800?auto=format&fit=crop&w=800&q=80', 'PVC', 'Beach Vibes', null, 4.8, 44, false, true,
    'A rigid-when-inflated touring board with a carbon-hybrid paddle, hand pump, and backpack — the whole kit rolls up small enough for a car trunk.',
    null,
    'لوح تجديف واقفاً قابل للنفخ',
    'لوح تجول يصبح صلباً عند نفخه، مع مجداف هجين من الكربون ومنفاخ يدوي وحقيبة ظهر — تنطوي المجموعة كاملة لتناسب صندوق السيارة.',
    null
  ),
  (
    'coastal-life-jacket', 'Coastal Life Jacket', 'Water Sports', 74, null, 'watersports',
    'https://images.unsplash.com/photo-1559063208-31aabee9142f?auto=format&fit=crop&w=800&q=80', 'Nylon', 'Beach Vibes', null, 4.6, 19, true, false,
    'A US Coast Guard-approved life vest in a low-profile cut, sized for a real range of paddling and boating days.',
    null,
    'سترة نجاة ساحلية',
    'سترة نجاة معتمدة من خفر السواحل الأمريكي بقصة منخفضة الحجم، مناسبة لأيام التجديف والإبحار الحقيقية.',
    null
  ),
  (
    'mineral-sunscreen-spf50', 'Mineral Sunscreen SPF 50', 'Beach Essentials', 34, null, 'suncare',
    'https://images.unsplash.com/photo-1738721796993-5f42d9315689?auto=format&fit=crop&w=800&q=80', 'Mineral', 'Beach Vibes', null, 4.9, 203, false, true,
    'A reef-safe, broad-spectrum mineral sunscreen that blends in clear and never feels greasy — the one bottle worth reapplying.',
    null,
    'واقي شمس معدني SPF 50',
    'واقٍ شمسي معدني آمن للشعاب المرجانية وواسع الطيف، يمتزج بالبشرة دون أثر أبيض أو لمعان دهني — الزجاجة الوحيدة التي تستحق إعادة الاستخدام.',
    null
  ),
  (
    'after-sun-aloe-balm', 'After-Sun Aloe Balm', 'Beach Essentials', 26, null, 'suncare',
    'https://plus.unsplash.com/premium_photo-1661434889227-617f791dd381?auto=format&fit=crop&w=800&q=80', 'Mineral', 'Beach Vibes', null, 4.7, 68, true, false,
    'A cooling aloe and chamomile balm that calms sun-warmed skin and locks in moisture after a long day at the beach.',
    null,
    'بلسم الصبار لما بعد الشمس',
    'بلسم مهدئ من الصبار والبابونج يخفف احمرار البشرة المتعبة من الشمس ويحافظ على ترطيبها بعد يومٍ طويل على الشاطئ.',
    null
  ),
  (
    'turkish-beach-towel', 'Oversized Turkish Beach Towel', 'Beach Essentials', 58, null, 'beachgear',
    'https://images.unsplash.com/photo-1760783320488-9af5d3217f50?auto=format&fit=crop&w=800&q=80', 'Cotton', 'Beach Vibes', null, 4.8, 91, true, false,
    'Densely woven Turkish cotton that''s sand-resistant, quick-drying, and generous enough to share.',
    null,
    'منشفة شاطئ تركية كبيرة الحجم',
    'منشفة من القطن التركي المنسوج بإحكام، تقاوم الرمل وتجف بسرعة، وبحجمٍ كبير يكفي للمشاركة.',
    null
  ),
  (
    'portable-beach-umbrella', 'Portable Beach Umbrella', 'Beach Essentials', 89, null, 'beachgear',
    'https://images.unsplash.com/photo-1521170813716-0b3f42fcfb65?auto=format&fit=crop&w=800&q=80', 'Aluminum', 'Beach Vibes', null, 4.6, 47, false, false,
    'A UPF 50+ canopy on a corrosion-resistant aluminum pole, with a sand anchor for wind-steady shade.',
    null,
    'مظلة شاطئ محمولة',
    'مظلة بحماية UPF 50+ على عمودٍ من الألومنيوم المقاوم للتآكل، مزودة بمثبت رملي لظلٍ ثابت مهما اشتدت الرياح.',
    null
  ),
  (
    'woven-straw-beach-bag', 'Woven Straw Beach Bag', 'Accessories', 86, null, 'accessories',
    'https://plus.unsplash.com/premium_photo-1764343569512-566ced2f5762?auto=format&fit=crop&w=800&q=80', 'Straw', 'Beach Vibes', '["#c9a876","#8f8266"]', 4.7, 52, false, true,
    'A roomy hand-woven tote with a water-resistant lining, sized for towels, sunscreen, and everything else the day needs.',
    null,
    'حقيبة شاطئ من القش المنسوج',
    'حقيبة توتس واسعة منسوجة يدوياً ببطانة مقاومة للماء، تتسع للمناشف وواقي الشمس وكل ما يحتاجه يومك.',
    null
  ),
  (
    'packable-sun-hat', 'Packable Sun Hat', 'Accessories', 48, null, 'accessories',
    'https://plus.unsplash.com/premium_photo-1675993000728-cdc7727e779f?auto=format&fit=crop&w=800&q=80', 'Straw', 'Beach Vibes', null, 4.5, 33, false, false,
    'A wide-brim straw hat that folds flat for travel and springs back into shape, with UPF 50+ coverage for face and neck.',
    null,
    'قبعة شمس قابلة للطي',
    'قبعة قش عريضة الحواف تُطوى بسهولة للسفر وتستعيد شكلها فوراً، بحماية UPF 50+ للوجه والرقبة.',
    null
  ),
  (
    'polarized-beach-sunglasses', 'Polarized Beach Sunglasses', 'Accessories', 118, 145, 'accessories',
    'https://images.unsplash.com/photo-1566421966482-ad8076104d8e?auto=format&fit=crop&w=800&q=80', 'Aluminum', 'Beach Vibes', '["#1c1c1c","#a8783f"]', 4.6, 29, true, false,
    'Polarized lenses in a lightweight aluminum frame, cutting glare off the water without distorting the color of the day.',
    null,
    'نظارة شمسية مستقطبة للشاطئ',
    'عدسات مستقطبة بإطار خفيف من الألومنيوم، تقلل وهج الماء دون أن تُغيّر ألوان اليوم من حولك.',
    null
  )
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  tone = excluded.tone,
  image = excluded.image,
  material = excluded.material,
  brand = excluded.brand,
  colors = excluded.colors,
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
