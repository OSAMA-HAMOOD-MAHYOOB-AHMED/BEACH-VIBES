export const CATEGORIES = [
  'Fragrance',
  'Home Decor',
  'Accessories',
  'Leather Goods',
  'Footwear',
  'Home Goods',
]

export const MATERIALS = ['Glass', 'Ceramic', 'Silk', 'Leather', 'Linen']

export const PRODUCTS = [
  {
    id: 'essence-of-azure',
    name: 'Essence of Azure',
    category: 'Fragrance',
    price: 185,
    tone: 'fragrance',
    image: '/images/products/essence-of-azure.jpg',
    material: 'Glass',
    rating: 4.8,
    reviews: 96,
    isNew: true,
    description:
      'A luminous eau de parfum opening with citrus zest and settling into a warm, salt-kissed amber base.',
    notes: {
      top: 'Bergamot, Sea Salt, Lemon Zest',
      heart: 'Jasmine Sambac, Neroli, Seaweed',
      base: 'Ambergris, White Musk, Driftwood',
    },
    name_ar: 'جوهر الزُرقة',
    description_ar:
      'عطر مُشرق يفتتح بنفحات الحمضيات المنعشة، ليستقر في قاعدة عنبرية دافئة تلامسها لمسة من ملح البحر.',
    notes_ar: {
      top: 'برغموت، ملح البحر، قشر الليمون',
      heart: 'ياسمين سامباك، زهر النارنج، أعشاب بحرية',
      base: 'عنبر، مسك أبيض، خشب الطفو',
    },
  },
  {
    id: 'lessence-de-la-mer',
    name: "L'Essence de la Mer",
    category: 'Fragrance',
    price: 245,
    tone: 'fragrance',
    image: '/images/products/lessence-de-la-mer.jpg',
    material: 'Glass',
    rating: 4.9,
    reviews: 124,
    description:
      'A profound olfactory journey into the heart of the Mediterranean. This artisanal fragrance captures the fleeting moment of dawn over a serene coastline, blending crisp sea salt with the warmth of sun-drenched citrus and the grounding depth of coastal cedarwood.',
    notes: {
      top: 'Bergamot, Sea Salt, Lemon Zest',
      heart: 'Jasmine Sambac, Neroli, Seaweed',
      base: 'Ambergris, White Musk, Driftwood',
    },
    name_ar: 'جوهر البحر',
    description_ar:
      'رحلة شمّية عميقة إلى قلب البحر المتوسط. يلتقط هذا العطر الحرفي لحظة الفجر العابرة فوق ساحل هادئ، ممزوجاً نقاء ملح البحر بدفء الحمضيات المشبعة بالشمس وعمق خشب الأرز الساحلي الراسخ.',
    notes_ar: {
      top: 'برغموت، ملح البحر، قشر الليمون',
      heart: 'ياسمين سامباك، زهر النارنج، أعشاب بحرية',
      base: 'عنبر، مسك أبيض، خشب الطفو',
    },
  },
  {
    id: 'locean-de-soie',
    name: "L'Océan de Soie",
    category: 'Fragrance',
    price: 285,
    tone: 'fragrance-gold',
    image: '/images/products/locean-de-soie.jpg',
    material: 'Glass',
    rating: 4.9,
    reviews: 154,
    isSignature: true,
    description:
      'An ethereal composition inspired by the silk-like surface of a calm morning sea. L’Océan de Soie opens with crisp sea salt and ozonic notes of white lotus, transitioning into a heart of white lotus and sun-bleached driftwood.',
    notes: {
      top: 'Sea Salt, Bergamot',
      heart: 'White Lotus',
      base: 'Driftwood, Ambergris, Mineral Musk',
    },
    name_ar: 'محيط الحرير',
    description_ar:
      'تركيبة أثيرية مستوحاة من سطح بحرٍ صباحي هادئ يشبه الحرير في نعومته. يفتتح محيط الحرير بملح البحر المنعش ونفحات أوزونية من اللوتس الأبيض، لينتقل إلى قلب من اللوتس الأبيض وخشب الطفو المُبيَّض بأشعة الشمس.',
    notes_ar: {
      top: 'ملح البحر، برغموت',
      heart: 'لوتس أبيض',
      base: 'خشب الطفو، عنبر، مسك معدني',
    },
  },
  {
    id: 'neroli-des-bermudes',
    name: 'Néroli des Bermudes',
    category: 'Fragrance',
    price: 245,
    tone: 'fragrance',
    image: '/images/products/neroli-des-bermudes.jpg',
    material: 'Glass',
    rating: 4.7,
    reviews: 58,
    description:
      'A bright, effervescent neroli fragrance layered over warm island musk and soft petitgrain.',
    name_ar: 'زهر نارنج برمودا',
    description_ar: 'عطر نارنجي منعش وحيوي، يتوشح بمسك جزري دافئ ونفحات ناعمة من البتيغرين.',
  },
  {
    id: 'monolith-ceramic-vase',
    name: 'Monolith Ceramic Vase',
    category: 'Home Decor',
    price: 320,
    tone: 'ceramic',
    image: '/images/products/monolith-ceramic-vase.jpg',
    material: 'Ceramic',
    rating: 4.8,
    reviews: 41,
    description:
      'A sculptural stoneware vessel, hand-thrown and finished with a matte organic glaze inspired by coastal cliffs.',
    name_ar: 'مزهرية مونوليث الخزفية',
    description_ar:
      'إناء خزفي نحتي، مصنوع يدوياً بالعجلة ومطلي بطلاء عضوي غير لامع مستوحى من المنحدرات الساحلية.',
  },
  {
    id: 'artisanal-ceramic-vase',
    name: 'Artisanal Ceramic Vase',
    category: 'Home Decor',
    price: 240,
    tone: 'ceramic',
    image: '/images/products/artisanal-ceramic-vase.jpg',
    material: 'Ceramic',
    rating: 4.6,
    reviews: 33,
    isNew: true,
    description:
      'Wheel-thrown ceramic in a soft terracotta glaze, equally at home with a single stem or a full arrangement.',
    name_ar: 'مزهرية خزفية حرفية',
    description_ar:
      'خزف مصنوع بعجلة الخزاف بطلاء تراكوتا ناعم، يليق بغصنٍ واحد كما يليق بتنسيقٍ زهري كامل.',
  },
  {
    id: 'artisanal-linen-set',
    name: 'Artisanal Linen Set',
    category: 'Home Goods',
    price: 145,
    tone: 'linen',
    image: '/images/products/artisanal-linen-set.jpg',
    material: 'Linen',
    rating: 4.7,
    reviews: 29,
    isNew: true,
    description:
      'Stone-washed European linen dining set, woven for softness that only improves with age.',
    name_ar: 'طقم كتان حرفي',
    description_ar:
      'طقم مائدة من الكتان الأوروبي المغسول بالحجر، منسوج بنعومة تزداد جمالاً مع مرور الوقت.',
  },
  {
    id: 'cerulean-silk-wrap',
    name: 'Cerulean Silk Wrap',
    category: 'Accessories',
    price: 450,
    tone: 'silk',
    image: '/images/products/cerulean-silk-wrap.jpg',
    material: 'Silk',
    rating: 4.6,
    reviews: 22,
    description:
      'Hand-painted mulberry silk wrap in a wave-inspired print, finished with hand-rolled edges.',
    name_ar: 'وشاح الحرير السماوي',
    description_ar: 'وشاح من حرير التوت مرسوم يدوياً بنقشٍ مستوحى من الأمواج، بحواف ملفوفة يدوياً.',
  },
  {
    id: 'midnight-silk-scarf',
    name: 'Midnight Silk Scarf',
    category: 'Accessories',
    price: 320,
    tone: 'silk',
    image: '/images/products/midnight-silk-scarf.jpg',
    material: 'Silk',
    rating: 4.5,
    reviews: 18,
    description:
      'A jewel-toned silk twill scarf, versatile enough for the neck, hair, or handbag handle.',
    name_ar: 'وشاح الحرير الليلي',
    description_ar:
      'وشاح حريري بألوان جوهرية زاهية، متعدد الاستخدامات يناسب الرقبة أو الشعر أو مقبض الحقيبة.',
  },
  {
    id: 'veau-grained-tote',
    name: 'Veau Grained Tote',
    category: 'Leather Goods',
    price: 2400,
    tone: 'leather',
    image: '/images/products/veau-grained-tote.jpg',
    material: 'Leather',
    rating: 4.9,
    reviews: 47,
    description:
      'Structured tote in full-grain vitello leather with brushed brass hardware, made by hand in a single atelier.',
    name_ar: 'حقيبة جلد العجل المحبب',
    description_ar:
      'حقيبة توتس مُهيكلة من جلد العجل الإيطالي الكامل الحبيبات، بتفاصيل نحاسية مصقولة، مصنوعة يدوياً في محترف واحد.',
  },
  {
    id: 'heritage-leather-tote',
    name: 'Heritage Leather Tote',
    category: 'Leather Goods',
    price: 850,
    tone: 'leather',
    image: '/images/products/heritage-leather-tote.jpg',
    material: 'Leather',
    rating: 4.7,
    reviews: 63,
    description:
      'A timeless top-handle tote in vegetable-tanned leather that patinas beautifully over years of wear.',
    name_ar: 'حقيبة التراث الجلدية',
    description_ar:
      'حقيبة توتس خالدة بمقبض علوي، من جلد مدبوغ نباتياً يكتسب بريقاً جميلاً مع سنوات الاستخدام.',
  },
  {
    id: 'riviera-leather-sandal',
    name: 'Riviera Leather Sandal',
    category: 'Footwear',
    price: 680,
    tone: 'footwear',
    image: '/images/products/riviera-leather-sandal.jpg',
    material: 'Leather',
    rating: 4.6,
    reviews: 39,
    description:
      'Slim gladiator-style sandals in butter-soft leather straps, hand-cut and stitched in Southern Europe.',
    name_ar: 'صندل ريفييرا الجلدي',
    description_ar:
      'صنادل نحيلة بطراز الغلادييتور، بأحزمة جلدية ناعمة كالزبدة، مقصوصة ومخيطة يدوياً في جنوب أوروبا.',
  },
]

export const findProduct = (id) => PRODUCTS.find((p) => p.id === id)
