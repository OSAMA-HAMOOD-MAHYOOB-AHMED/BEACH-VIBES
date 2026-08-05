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
import { useLanguage } from '../context/LanguageContext'
import { localizeProduct } from '../utils/localize'
import { formatPrice } from '../utils/format'
import { useCart } from '../context/CartContext'

const SIZES = ['S', 'M', 'L', 'XL']

export default function ProductDetail() {
  const { id } = useParams()
  const { t, language } = useLanguage()
  const { products, findProduct } = useProducts()
  const rawProduct = findProduct(id)
  const product = localizeProduct(rawProduct, language)
  const { addItem } = useCart()

  const [size, setSize] = useState(SIZES[1])
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [openAccordion, setOpenAccordion] = useState('details')
  const [tab, setTab] = useState('journal')

  const related = useMemo(() => {
    if (!rawProduct) return []
    const sameCategory = products.filter(
      (p) => p.id !== rawProduct.id && p.category === rawProduct.category,
    )
    const others = products.filter(
      (p) => p.id !== rawProduct.id && p.category !== rawProduct.category,
    )
    return [...sameCategory, ...others].slice(0, 4)
  }, [products, rawProduct])

  if (!product) {
    return (
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-24 text-center">
        <h1 className="font-serif text-3xl text-navy-900 mb-4">{t('productDetail.notFoundTitle')}</h1>
        <p className="text-sm text-navy-500 mb-8">{t('productDetail.notFoundBody')}</p>
        <Link to="/shop" className="btn-primary">
          {t('productDetail.backToShop')}
        </Link>
      </div>
    )
  }

  const hasSizes = rawProduct.category === 'Swimwear'
  const materialLabel = (
    rawProduct.material ? t(`materials.${rawProduct.material}`) : t('productDetail.defaultMaterial')
  ).toLowerCase()

  const accordions = t('productDetail.accordions')
  const accordionBodies = {
    details: accordions.details.body.replace('{{material}}', materialLabel),
    sustainability: accordions.sustainability.body,
    shipping: accordions.shipping.body,
  }

  const handleAdd = () => {
    addItem(product.id, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const reviews = t('productDetail.reviews')
  const tabs = [
    { id: 'journal', label: t('productDetail.tabs.journal', { count: product.reviews }) },
    { id: 'delivery', label: t('productDetail.tabs.delivery') },
    { id: 'ingredients', label: t('productDetail.tabs.ingredients') },
  ]

  return (
    <div>
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 pt-6">
        <nav className="text-[11px] text-navy-400 uppercase tracking-widest flex items-center gap-2">
          <Link to="/" className="hover:text-navy-700">{t('productDetail.breadcrumbHome')}</Link>
          <span>/</span>
          <Link to="/collections" className="hover:text-navy-700">{t('productDetail.breadcrumbCollections')}</Link>
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
              aria-label={t('productDetail.addToWishlist')}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-white/90 w-9 h-9 flex items-center justify-center hover:bg-white transition-colors"
            >
              <Heart className="w-4 h-4 text-navy-700" />
            </button>
            {product.isSignature && (
              <span className="absolute bottom-4 left-4 rtl:left-auto rtl:right-4 bg-white text-navy-800 text-[9px] font-semibold uppercase tracking-widest px-3 py-1.5">
                {t('productDetail.signatureCollection')}
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
            {t('productDetail.artisanalCategory', { category: t(`categories.${rawProduct.category}`) })}
          </p>
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="font-serif text-3xl sm:text-4xl text-navy-900">{product.name}</h1>
            <div className="flex items-center gap-1.5 shrink-0 pt-2">
              <StarRating rating={product.rating} />
              <span className="text-xs text-navy-400">({product.reviews})</span>
            </div>
          </div>
          <p className="text-xl text-navy-700 mb-6">{formatPrice(product.price)}</p>
          <p className="text-sm text-navy-500 leading-relaxed mb-8 max-w-md">{product.description}</p>

          {hasSizes && (
            <div className="mb-7">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-medium uppercase tracking-widest text-navy-700">
                  {t('productDetail.selectSize')}
                </span>
                <span className="text-[11px] text-navy-400 underline cursor-pointer">
                  {t('productDetail.sizeGuide')}
                </span>
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
                aria-label={t('productDetail.decreaseQty')}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-11 flex items-center justify-center text-navy-600 hover:bg-navy-50"
                aria-label={t('productDetail.increaseQty')}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <button onClick={handleAdd} className="btn-primary flex-1">
              {added ? t('productDetail.addedToBag') : t('productDetail.addToBag')}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8 text-xs text-navy-500">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-navy-500" strokeWidth={1.5} />
              {t('productDetail.complimentaryShipping')}
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-navy-500" strokeWidth={1.5} />
              {t('productDetail.certifiedAuthentic')}
            </div>
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-navy-500" strokeWidth={1.5} />
              {t('productDetail.giftWrapping')}
            </div>
          </div>

          <div className="border-t border-navy-100">
            {product.notes && (
              <Accordion
                title={t('productDetail.scentProfile')}
                open={openAccordion === 'scent'}
                onToggle={() => setOpenAccordion(openAccordion === 'scent' ? null : 'scent')}
              >
                <div className="grid grid-cols-3 gap-4 text-xs text-navy-500">
                  <div>
                    <p className="font-medium text-navy-700 uppercase tracking-wide mb-1">{t('productDetail.topNotes')}</p>
                    <p>{product.notes.top}</p>
                  </div>
                  <div>
                    <p className="font-medium text-navy-700 uppercase tracking-wide mb-1">{t('productDetail.heartNotes')}</p>
                    <p>{product.notes.heart}</p>
                  </div>
                  <div>
                    <p className="font-medium text-navy-700 uppercase tracking-wide mb-1">{t('productDetail.baseNotes')}</p>
                    <p>{product.notes.base}</p>
                  </div>
                </div>
              </Accordion>
            )}
            {['details', 'sustainability', 'shipping'].map((id) => (
              <Accordion
                key={id}
                title={accordions[id].title}
                open={openAccordion === id}
                onToggle={() => setOpenAccordion(openAccordion === id ? null : id)}
              >
                <p className="text-xs text-navy-500 leading-relaxed">{accordionBodies[id]}</p>
              </Accordion>
            ))}
          </div>

          <button className="inline-flex items-center gap-2 text-xs text-navy-400 hover:text-navy-700 mt-6 transition-colors">
            <Share2 className="w-3.5 h-3.5" /> {t('productDetail.shareDiscovery')}
          </button>
        </div>
      </div>

      {/* Inspiration */}
      <section className="bg-sand-100 border-y border-navy-100">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <SceneMedia tone="beach" className="w-full aspect-[4/5] sm:aspect-[5/4]" />
          <div>
            <p className="section-eyebrow">{t('productDetail.inspirationEyebrow')}</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-navy-900 mb-5 leading-tight">
              {t('productDetail.inspirationTitle')}
            </h2>
            <p className="text-sm text-navy-500 leading-relaxed mb-8 max-w-md">
              {t('productDetail.inspirationBody', { productName: product.name })}
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8 max-w-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-navy-800 mb-1.5">
                  {t('productDetail.smallBatchTitle')}
                </p>
                <p className="text-xs text-navy-500 leading-relaxed">{t('productDetail.smallBatchBody')}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-navy-800 mb-1.5">
                  {t('productDetail.sustainabilityTitle2')}
                </p>
                <p className="text-xs text-navy-500 leading-relaxed">{t('productDetail.sustainabilityBody2')}</p>
              </div>
            </div>
            <Link to="/about" className="btn-secondary">
              {t('productDetail.theStoryBtn')}
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 py-20">
        <div className="flex items-center gap-8 border-b border-navy-100 mb-10">
          {tabs.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className={`pb-4 text-xs font-medium uppercase tracking-widest border-b-2 -mb-px transition-colors ${
                tab === tb.id ? 'text-navy-900 border-navy-900' : 'text-navy-400 border-transparent'
              }`}
            >
              {tb.label}
            </button>
          ))}
        </div>

        {tab === 'journal' && (
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12">
            <div className="text-center lg:text-left rtl:lg:text-right">
              <p className="font-serif text-5xl text-navy-900 mb-2">{product.rating}</p>
              <StarRating rating={product.rating} size={16} />
              <p className="text-xs text-navy-400 mt-2 mb-6">
                {t('productDetail.ratingBasedOn', { count: product.reviews })}
              </p>
              <button className="btn-secondary w-full lg:w-auto">{t('productDetail.writeReview')}</button>
            </div>
            <div className="divide-y divide-navy-100">
              {reviews.map((r) => (
                <div key={r.name} className="py-6 first:pt-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-navy-800">{r.name}</p>
                    <p className="text-xs text-navy-400">{r.date}</p>
                  </div>
                  <StarRating rating={5} />
                  <p className="text-sm italic text-navy-800 mt-3 mb-2">&ldquo;{r.title}&rdquo;</p>
                  <p className="text-sm text-navy-500 leading-relaxed max-w-2xl">{r.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'delivery' && (
          <p className="text-sm text-navy-500 leading-relaxed max-w-2xl">{t('productDetail.deliveryContent')}</p>
        )}

        {tab === 'ingredients' && (
          <p className="text-sm text-navy-500 leading-relaxed max-w-2xl">{t('productDetail.ingredientsContent')}</p>
        )}
      </section>

      {/* Testimonial */}
      <section className="bg-navy-900">
        <div className="max-w-xl mx-auto px-5 sm:px-8 py-16 text-center">
          <Quote className="w-6 h-6 text-white/40 mx-auto mb-5" />
          <p className="font-serif italic text-lg sm:text-xl text-white leading-relaxed mb-5">
            &ldquo;{t('productDetail.testimonialQuote')}&rdquo;
          </p>
          <p className="text-[11px] font-medium uppercase tracking-widest text-white/60">
            {t('productDetail.testimonialAttribution')}
          </p>
        </div>
      </section>

      {/* Related */}
      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-eyebrow">{t('productDetail.curatedEyebrow')}</p>
            <h2 className="font-serif text-3xl text-navy-900">{t('productDetail.completeExperience')}</h2>
          </div>
          <Link
            to="/shop"
            className="hidden sm:block text-xs font-medium uppercase tracking-widest text-navy-700 hover:text-navy-900"
          >
            {t('productDetail.viewAllGoods')}
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <Newsletter
        eyebrow={t('productDetail.newsletterEyebrow')}
        title={t('productDetail.newsletterTitle')}
        subtitle={t('productDetail.newsletterSubtitle')}
      />
    </div>
  )
}

function Accordion({ title, open, onToggle, children }) {
  return (
    <div className="border-b border-navy-100">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left rtl:text-right"
      >
        <span className="text-[11px] font-medium uppercase tracking-widest text-navy-800">{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-navy-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="pb-5">{children}</div>}
    </div>
  )
}
