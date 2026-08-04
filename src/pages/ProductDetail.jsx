import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Heart,
  Share2,
  Minus,
  Plus,
  ChevronDown,
  Truck,
  ShieldCheck,
  Gift,
  Quote,
} from 'lucide-react'
import { ProductMedia, SceneMedia } from '../components/Media'
import ProductCard from '../components/ProductCard'
import StarRating from '../components/StarRating'
import Newsletter from '../components/Newsletter'
import { useProducts } from '../context/ProductsContext'
import { formatPrice } from '../utils/format'
import { useCart } from '../context/CartContext'

const SIZES = ['50ml', '100ml', '200ml']

const REVIEWS = [
  {
    name: 'Julianna R.',
    date: 'October 14, 2023',
    rating: 5,
    title: 'The perfect summer scent',
    body: "I've been looking for a fragrance that doesn't feel synthetic or heavy. This is incredibly fresh and lingers just long enough. The sea salt notes are very prominent in the best way possible. Truly exceptional craftsmanship.",
  },
  {
    name: 'Marcus T.',
    date: 'September 2, 2023',
    rating: 5,
    title: 'Compliments every time I wear it',
    body: 'Subtle but unmistakably distinctive. The packaging alone feels like an heirloom, and the scent has real depth without being overwhelming.',
  },
]

const ACCORDIONS = [
  { id: 'details', title: 'Product Details & Origin' },
  { id: 'sustainability', title: 'Sustainability' },
  { id: 'shipping', title: 'Shipping & Returns' },
]

export default function ProductDetail() {
  const { id } = useParams()
  const { products, findProduct } = useProducts()
  const product = findProduct(id)
  const { addItem } = useCart()

  const [size, setSize] = useState(SIZES[1])
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [openAccordion, setOpenAccordion] = useState('details')
  const [tab, setTab] = useState('journal')

  const related = useMemo(() => {
    if (!product) return []
    const sameCategory = products.filter(
      (p) => p.id !== product.id && p.category === product.category,
    )
    const others = products.filter(
      (p) => p.id !== product.id && p.category !== product.category,
    )
    return [...sameCategory, ...others].slice(0, 4)
  }, [products, product])

  if (!product) {
    return (
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-24 text-center">
        <h1 className="font-serif text-3xl text-navy-900 mb-4">Piece not found</h1>
        <p className="text-sm text-navy-500 mb-8">
          This artifact may have sold out or moved to a new collection.
        </p>
        <Link to="/shop" className="btn-primary">
          Back to Shop
        </Link>
      </div>
    )
  }

  const hasSizes = product.category === 'Fragrance'

  const handleAdd = () => {
    addItem(product.id, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div>
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 pt-6">
        <nav className="text-[11px] text-navy-400 uppercase tracking-widest flex items-center gap-2">
          <Link to="/" className="hover:text-navy-700">Home</Link>
          <span>/</span>
          <Link to="/collections" className="hover:text-navy-700">Collections</Link>
          <span>/</span>
          <span className="text-navy-700">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square mb-4">
            <ProductMedia
              tone={product.tone}
              image={product.image}
              alt={product.name}
              className="w-full h-full"
              iconClassName="w-16 h-16"
            />
            <button
              aria-label="Add to wishlist"
              className="absolute top-4 right-4 bg-white/90 w-9 h-9 flex items-center justify-center hover:bg-white transition-colors"
            >
              <Heart className="w-4 h-4 text-navy-700" />
            </button>
            {product.isSignature && (
              <span className="absolute bottom-4 left-4 bg-white text-navy-800 text-[9px] font-semibold uppercase tracking-widest px-3 py-1.5">
                Signature Collection
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <ProductMedia
                key={i}
                tone={product.tone}
                image={product.image}
                alt={product.name}
                className="aspect-square cursor-pointer border border-transparent hover:border-navy-300"
                iconClassName="w-6 h-6"
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest2 text-navy-400 mb-2">
            Artisanal {product.category}
          </p>
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="font-serif text-3xl sm:text-4xl text-navy-900">{product.name}</h1>
            <div className="flex items-center gap-1.5 shrink-0 pt-2">
              <StarRating rating={product.rating} />
              <span className="text-xs text-navy-400">({product.reviews})</span>
            </div>
          </div>
          <p className="text-xl text-navy-700 mb-6">{formatPrice(product.price)}</p>
          <p className="text-sm text-navy-500 leading-relaxed mb-8 max-w-md">
            {product.description}
          </p>

          {hasSizes && (
            <div className="mb-7">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-medium uppercase tracking-widest text-navy-700">
                  Select Size
                </span>
                <span className="text-[11px] text-navy-400 underline cursor-pointer">Size Guide</span>
              </div>
              <div className="flex gap-3">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-5 py-2.5 text-sm border transition-colors ${
                      size === s
                        ? 'bg-navy-800 text-white border-navy-800'
                        : 'border-navy-200 text-navy-700 hover:border-navy-500'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mb-7">
            <div className="flex items-center border border-navy-200 w-fit">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-11 flex items-center justify-center text-navy-600 hover:bg-navy-50"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-11 flex items-center justify-center text-navy-600 hover:bg-navy-50"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <button onClick={handleAdd} className="btn-primary flex-1">
              {added ? 'Added to Bag' : 'Add to Atelier Bag'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8 text-xs text-navy-500">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-navy-500" strokeWidth={1.5} />
              Complimentary Shipping
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-navy-500" strokeWidth={1.5} />
              Certified Authentic
            </div>
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-navy-500" strokeWidth={1.5} />
              Gift Wrapping Available
            </div>
          </div>

          <div className="border-t border-navy-100">
            {product.notes && (
              <Accordion
                title="Scent Profile"
                open={openAccordion === 'scent'}
                onToggle={() => setOpenAccordion(openAccordion === 'scent' ? null : 'scent')}
              >
                <div className="grid grid-cols-3 gap-4 text-xs text-navy-500">
                  <div>
                    <p className="font-medium text-navy-700 uppercase tracking-wide mb-1">Top Notes</p>
                    <p>{product.notes.top}</p>
                  </div>
                  <div>
                    <p className="font-medium text-navy-700 uppercase tracking-wide mb-1">Heart Notes</p>
                    <p>{product.notes.heart}</p>
                  </div>
                  <div>
                    <p className="font-medium text-navy-700 uppercase tracking-wide mb-1">Base Notes</p>
                    <p>{product.notes.base}</p>
                  </div>
                </div>
              </Accordion>
            )}
            {ACCORDIONS.map((a) => (
              <Accordion
                key={a.id}
                title={a.title}
                open={openAccordion === a.id}
                onToggle={() => setOpenAccordion(openAccordion === a.id ? null : a.id)}
              >
                <p className="text-xs text-navy-500 leading-relaxed">
                  {a.id === 'details' &&
                    `Crafted by independent artisans using techniques passed through generations. Made from ${product.material?.toLowerCase() || 'artisanal materials'} sourced from certified sustainable suppliers.`}
                  {a.id === 'sustainability' &&
                    'Limited-batch production, recyclable packaging, and forest-certified materials throughout.'}
                  {a.id === 'shipping' &&
                    'Complimentary standard shipping on all orders over $500. 30-day returns accepted on unused goods in original packaging.'}
                </p>
              </Accordion>
            ))}
          </div>

          <button className="inline-flex items-center gap-2 text-xs text-navy-400 hover:text-navy-700 mt-6 transition-colors">
            <Share2 className="w-3.5 h-3.5" /> Share This Discovery
          </button>
        </div>
      </div>

      {/* Inspiration */}
      <section className="bg-sand-100 border-y border-navy-100">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <SceneMedia tone="beach" className="w-full aspect-[4/5] sm:aspect-[5/4]" />
          <div>
            <p className="section-eyebrow">The Inspiration</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-navy-900 mb-5 leading-tight">
              Where Water Meets The Shore
            </h2>
            <p className="text-sm text-navy-500 leading-relaxed mb-8 max-w-md">
              Our founder spent three summers on the Amalfi Coast, documenting the changing scent
              of the sea from sunrise to dusk. {product.name} is the culmination of those
              journals — a liquid memory of crisp mornings and sun-warmed stone.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8 max-w-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-navy-800 mb-1.5">
                  Small Batch
                </p>
                <p className="text-xs text-navy-500 leading-relaxed">
                  Limited to 500 bottles per season to ensure quality.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-navy-800 mb-1.5">
                  Sustainability
                </p>
                <p className="text-xs text-navy-500 leading-relaxed">
                  100% recyclable glass and forest-certified packaging.
                </p>
              </div>
            </div>
            <Link to="/about" className="btn-secondary">
              The Aqua Atelier Story
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 py-20">
        <div className="flex items-center gap-8 border-b border-navy-100 mb-10">
          {[
            { id: 'journal', label: `Customer Journal (${product.reviews})` },
            { id: 'delivery', label: 'Delivery & Returns' },
            { id: 'ingredients', label: 'Ingredients' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`pb-4 text-xs font-medium uppercase tracking-widest border-b-2 -mb-px transition-colors ${
                tab === t.id ? 'text-navy-900 border-navy-900' : 'text-navy-400 border-transparent'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'journal' && (
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12">
            <div className="text-center lg:text-left">
              <p className="font-serif text-5xl text-navy-900 mb-2">{product.rating}</p>
              <StarRating rating={product.rating} size={16} />
              <p className="text-xs text-navy-400 mt-2 mb-6">Based on {product.reviews} reviews</p>
              <button className="btn-secondary w-full lg:w-auto">Write A Review</button>
            </div>
            <div className="divide-y divide-navy-100">
              {REVIEWS.map((r) => (
                <div key={r.name} className="py-6 first:pt-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-navy-800">
                      {r.name}
                    </p>
                    <p className="text-xs text-navy-400">{r.date}</p>
                  </div>
                  <StarRating rating={r.rating} />
                  <p className="text-sm italic text-navy-800 mt-3 mb-2">&ldquo;{r.title}&rdquo;</p>
                  <p className="text-sm text-navy-500 leading-relaxed max-w-2xl">{r.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'delivery' && (
          <p className="text-sm text-navy-500 leading-relaxed max-w-2xl">
            Complimentary standard shipping on all orders over $500. Express Atelier Delivery
            available at checkout. Unused items in original packaging may be returned within 30
            days of delivery for a full refund.
          </p>
        )}

        {tab === 'ingredients' && (
          <p className="text-sm text-navy-500 leading-relaxed max-w-2xl">
            Formulated with responsibly sourced botanical extracts and mineral musks. Free from
            parabens, phthalates, and synthetic dyes. Full ingredient listing available upon
            request from our concierge team.
          </p>
        )}
      </section>

      {/* Testimonial */}
      <section className="bg-navy-900">
        <div className="max-w-xl mx-auto px-5 sm:px-8 py-16 text-center">
          <Quote className="w-6 h-6 text-white/40 mx-auto mb-5" />
          <p className="font-serif italic text-lg sm:text-xl text-white leading-relaxed mb-5">
            &ldquo;This scent is a revelation. It manages to capture the exact feeling of cool
            ocean air and morning light. Simply timeless.&rdquo;
          </p>
          <p className="text-[11px] font-medium uppercase tracking-widest text-white/60">
            Elena V. — Verified Collector
          </p>
        </div>
      </section>

      {/* Related */}
      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-eyebrow">Curated</p>
            <h2 className="font-serif text-3xl text-navy-900">Complete The Experience</h2>
          </div>
          <Link
            to="/shop"
            className="hidden sm:block text-xs font-medium uppercase tracking-widest text-navy-700 hover:text-navy-900"
          >
            View All Artisanal Goods
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <Newsletter
        eyebrow="Stay Informed"
        title="Join Our Circle"
        subtitle="Join our circle for exclusive access to artisanal releases and private collection viewings."
      />
    </div>
  )
}

function Accordion({ title, open, onToggle, children }) {
  return (
    <div className="border-b border-navy-100">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-[11px] font-medium uppercase tracking-widest text-navy-800">
          {title}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-navy-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="pb-5">{children}</div>}
    </div>
  )
}
