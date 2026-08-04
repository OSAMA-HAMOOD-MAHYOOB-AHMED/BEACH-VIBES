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
-- seed: product catalog (matches src/data/products.js)
-- ============================================================
insert into products (id, name, category, price, tone, image, material, rating, reviews, is_new, is_signature, description, notes, name_ar, description_ar, notes_ar)
values
  (
    'essence-of-azure', 'Essence of Azure', 'Fragrance', 185, 'fragrance',
    '/images/products/essence-of-azure.jpg', 'Glass', 4.8, 96, true, false,
    'A luminous eau de parfum opening with citrus zest and settling into a warm, salt-kissed amber base.',
    '{"top":"Bergamot, Sea Salt, Lemon Zest","heart":"Jasmine Sambac, Neroli, Seaweed","base":"Ambergris, White Musk, Driftwood"}',
    'جوهر الزُرقة',
    'عطر مُشرق يفتتح بنفحات الحمضيات المنعشة، ليستقر في قاعدة عنبرية دافئة تلامسها لمسة من ملح البحر.',
    '{"top":"برغموت، ملح البحر، قشر الليمون","heart":"ياسمين سامباك، زهر النارنج، أعشاب بحرية","base":"عنبر، مسك أبيض، خشب الطفو"}'
  ),
  (
    'lessence-de-la-mer', 'L''Essence de la Mer', 'Fragrance', 245, 'fragrance',
    '/images/products/lessence-de-la-mer.jpg', 'Glass', 4.9, 124, false, false,
    'A profound olfactory journey into the heart of the Mediterranean. This artisanal fragrance captures the fleeting moment of dawn over a serene coastline, blending crisp sea salt with the warmth of sun-drenched citrus and the grounding depth of coastal cedarwood.',
    '{"top":"Bergamot, Sea Salt, Lemon Zest","heart":"Jasmine Sambac, Neroli, Seaweed","base":"Ambergris, White Musk, Driftwood"}',
    'جوهر البحر',
    'رحلة شمّية عميقة إلى قلب البحر المتوسط. يلتقط هذا العطر الحرفي لحظة الفجر العابرة فوق ساحل هادئ، ممزوجاً نقاء ملح البحر بدفء الحمضيات المشبعة بالشمس وعمق خشب الأرز الساحلي الراسخ.',
    '{"top":"برغموت، ملح البحر، قشر الليمون","heart":"ياسمين سامباك، زهر النارنج، أعشاب بحرية","base":"عنبر، مسك أبيض، خشب الطفو"}'
  ),
  (
    'locean-de-soie', 'L''Océan de Soie', 'Fragrance', 285, 'fragrance-gold',
    '/images/products/locean-de-soie.jpg', 'Glass', 4.9, 154, false, true,
    'An ethereal composition inspired by the silk-like surface of a calm morning sea. L''Océan de Soie opens with crisp sea salt and ozonic notes of white lotus, transitioning into a heart of white lotus and sun-bleached driftwood.',
    '{"top":"Sea Salt, Bergamot","heart":"White Lotus","base":"Driftwood, Ambergris, Mineral Musk"}',
    'محيط الحرير',
    'تركيبة أثيرية مستوحاة من سطح بحرٍ صباحي هادئ يشبه الحرير في نعومته. يفتتح محيط الحرير بملح البحر المنعش ونفحات أوزونية من اللوتس الأبيض، لينتقل إلى قلب من اللوتس الأبيض وخشب الطفو المُبيَّض بأشعة الشمس.',
    '{"top":"ملح البحر، برغموت","heart":"لوتس أبيض","base":"خشب الطفو، عنبر، مسك معدني"}'
  ),
  (
    'neroli-des-bermudes', 'Néroli des Bermudes', 'Fragrance', 245, 'fragrance',
    '/images/products/neroli-des-bermudes.jpg', 'Glass', 4.7, 58, false, false,
    'A bright, effervescent neroli fragrance layered over warm island musk and soft petitgrain.',
    null,
    'زهر نارنج برمودا',
    'عطر نارنجي منعش وحيوي، يتوشح بمسك جزري دافئ ونفحات ناعمة من البتيغرين.',
    null
  ),
  (
    'monolith-ceramic-vase', 'Monolith Ceramic Vase', 'Home Decor', 320, 'ceramic',
    '/images/products/monolith-ceramic-vase.jpg', 'Ceramic', 4.8, 41, false, false,
    'A sculptural stoneware vessel, hand-thrown and finished with a matte organic glaze inspired by coastal cliffs.',
    null,
    'مزهرية مونوليث الخزفية',
    'إناء خزفي نحتي، مصنوع يدوياً بالعجلة ومطلي بطلاء عضوي غير لامع مستوحى من المنحدرات الساحلية.',
    null
  ),
  (
    'artisanal-ceramic-vase', 'Artisanal Ceramic Vase', 'Home Decor', 240, 'ceramic',
    '/images/products/artisanal-ceramic-vase.jpg', 'Ceramic', 4.6, 33, true, false,
    'Wheel-thrown ceramic in a soft terracotta glaze, equally at home with a single stem or a full arrangement.',
    null,
    'مزهرية خزفية حرفية',
    'خزف مصنوع بعجلة الخزاف بطلاء تراكوتا ناعم، يليق بغصنٍ واحد كما يليق بتنسيقٍ زهري كامل.',
    null
  ),
  (
    'artisanal-linen-set', 'Artisanal Linen Set', 'Home Goods', 145, 'linen',
    '/images/products/artisanal-linen-set.jpg', 'Linen', 4.7, 29, true, false,
    'Stone-washed European linen dining set, woven for softness that only improves with age.',
    null,
    'طقم كتان حرفي',
    'طقم مائدة من الكتان الأوروبي المغسول بالحجر، منسوج بنعومة تزداد جمالاً مع مرور الوقت.',
    null
  ),
  (
    'cerulean-silk-wrap', 'Cerulean Silk Wrap', 'Accessories', 450, 'silk',
    '/images/products/cerulean-silk-wrap.jpg', 'Silk', 4.6, 22, false, false,
    'Hand-painted mulberry silk wrap in a wave-inspired print, finished with hand-rolled edges.',
    null,
    'وشاح الحرير السماوي',
    'وشاح من حرير التوت مرسوم يدوياً بنقشٍ مستوحى من الأمواج، بحواف ملفوفة يدوياً.',
    null
  ),
  (
    'midnight-silk-scarf', 'Midnight Silk Scarf', 'Accessories', 320, 'silk',
    '/images/products/midnight-silk-scarf.jpg', 'Silk', 4.5, 18, false, false,
    'A jewel-toned silk twill scarf, versatile enough for the neck, hair, or handbag handle.',
    null,
    'وشاح الحرير الليلي',
    'وشاح حريري بألوان جوهرية زاهية، متعدد الاستخدامات يناسب الرقبة أو الشعر أو مقبض الحقيبة.',
    null
  ),
  (
    'veau-grained-tote', 'Veau Grained Tote', 'Leather Goods', 2400, 'leather',
    '/images/products/veau-grained-tote.jpg', 'Leather', 4.9, 47, false, false,
    'Structured tote in full-grain vitello leather with brushed brass hardware, made by hand in a single atelier.',
    null,
    'حقيبة جلد العجل المحبب',
    'حقيبة توتس مُهيكلة من جلد العجل الإيطالي الكامل الحبيبات، بتفاصيل نحاسية مصقولة، مصنوعة يدوياً في محترف واحد.',
    null
  ),
  (
    'heritage-leather-tote', 'Heritage Leather Tote', 'Leather Goods', 850, 'leather',
    '/images/products/heritage-leather-tote.jpg', 'Leather', 4.7, 63, false, false,
    'A timeless top-handle tote in vegetable-tanned leather that patinas beautifully over years of wear.',
    null,
    'حقيبة التراث الجلدية',
    'حقيبة توتس خالدة بمقبض علوي، من جلد مدبوغ نباتياً يكتسب بريقاً جميلاً مع سنوات الاستخدام.',
    null
  ),
  (
    'riviera-leather-sandal', 'Riviera Leather Sandal', 'Footwear', 680, 'footwear',
    '/images/products/riviera-leather-sandal.jpg', 'Leather', 4.6, 39, false, false,
    'Slim gladiator-style sandals in butter-soft leather straps, hand-cut and stitched in Southern Europe.',
    null,
    'صندل ريفييرا الجلدي',
    'صنادل نحيلة بطراز الغلادييتور، بأحزمة جلدية ناعمة كالزبدة، مقصوصة ومخيطة يدوياً في جنوب أوروبا.',
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
  created_at timestamptz default now()
);

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
