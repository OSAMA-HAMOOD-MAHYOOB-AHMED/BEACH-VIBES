import { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, SlidersHorizontal, ChevronDown, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import Newsletter from '../components/Newsletter'
import { SceneMedia } from '../components/Media'
import { useProducts } from '../context/ProductsContext'
import { useLanguage } from '../context/LanguageContext'
import { localizeProduct } from '../utils/localize'

const PAGE_SIZE = 8

export default function Shop() {
  const { t, language } = useLanguage()
  const { products } = useProducts()
  const [params, setParams] = useSearchParams()
  const category = params.get('category')
  const brand = params.get('brand')
  const activeFilter = params.get('filter') // 'new' | 'sale'
  const [query, setQuery] = useState(() => params.get('q') || '')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const clearFilter = (key) => {
    const next = new URLSearchParams(params)
    next.delete(key)
    setParams(next)
    setVisible(PAGE_SIZE)
  }

  const filtered = useMemo(() => {
    let result = products.map((p) => localizeProduct(p, language))
    if (category) result = result.filter((p) => p.category === category)
    if (brand) result = result.filter((p) => p.brand === brand)
    if (activeFilter === 'new') result = result.filter((p) => p.isNew)
    if (activeFilter === 'sale') result = result.filter((p) => p.compareAtPrice > p.price)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      result = result.filter((p) => p.name.toLowerCase().includes(q))
    }
    return result
  }, [products, category, brand, activeFilter, query, language])

  const shown = filtered.slice(0, visible)
  const activeChips = [
    ...(activeFilter === 'new' ? [{ key: 'filter', label: t('shop.newArrivalsChip') }] : []),
    ...(activeFilter === 'sale' ? [{ key: 'filter', label: t('shop.saleChip') }] : []),
    ...(category ? [{ key: 'category', label: t(`categories.${category}`) }] : []),
    ...(brand ? [{ key: 'brand', label: brand }] : []),
  ]

  return (
    <div>
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 pt-14 sm:pt-16 pb-8 text-center">
        <p className="section-eyebrow justify-center flex">{t('shop.eyebrow')}</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-navy-900">{t('shop.title')}</h1>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 pb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border-y border-navy-100 py-4">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-navy-300 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setVisible(PAGE_SIZE)
              }}
              placeholder={t('shop.searchPlaceholder')}
              className="w-full border border-navy-100 pl-8 pr-3 rtl:pl-3 rtl:pr-8 py-2.5 text-sm focus:outline-none focus:border-navy-400"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-1.5 border border-navy-100 px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-navy-700 hover:border-navy-400 transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5" /> {t('shop.filterBtn')}
            </button>
            <button className="inline-flex items-center gap-1.5 border border-navy-100 px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-navy-700 hover:border-navy-400 transition-colors">
              {t('shop.sortBtn')} <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {activeChips.length > 0 && (
          <div className="flex items-center gap-2 pt-4">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                onClick={() => clearFilter(chip.key)}
                className="inline-flex items-center gap-1.5 bg-navy-50 text-navy-700 text-xs px-3 py-1.5"
              >
                {chip.label} <X className="w-3 h-3" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 pb-20">
        {shown.length === 0 ? (
          <p className="text-sm text-navy-400 py-16 text-center">{t('shop.emptyState')}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="mt-14">
          <p className="text-xs text-navy-400 text-center mb-3">
            {t('shop.showing', { shown: shown.length, total: filtered.length })}
          </p>
          <div className="h-0.5 max-w-xs mx-auto bg-navy-100 mb-8">
            <div
              className="h-0.5 bg-navy-800 transition-all"
              style={{ width: `${(shown.length / Math.max(filtered.length, 1)) * 100}%` }}
            />
          </div>
          {visible < filtered.length && (
            <div className="text-center">
              <button onClick={() => setVisible((v) => v + PAGE_SIZE)} className="btn-secondary">
                {t('shop.loadMore')}
              </button>
            </div>
          )}
        </div>
      </div>

      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 pb-20">
        <Link to="/journal" className="relative block overflow-hidden">
          <SceneMedia tone="interior" overlay="dark-full" className="w-full min-h-[380px] flex items-center justify-center">
            <div className="relative bg-white/95 text-center px-10 py-10 max-w-md mx-4">
              <p className="text-[10px] font-medium uppercase tracking-widest2 text-navy-400 mb-3">
                {t('shop.journalEyebrow')}
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-navy-900 mb-4">{t('shop.journalTitle')}</h2>
              <p className="text-sm text-navy-500 mb-5 leading-relaxed">{t('shop.journalBody')}</p>
              <span className="text-xs font-medium uppercase tracking-widest text-navy-800 border-b border-navy-800 pb-1">
                {t('shop.readStory')}
              </span>
            </div>
          </SceneMedia>
        </Link>
      </section>

      <Newsletter
        eyebrow={t('shop.newsletterEyebrow')}
        title={t('shop.newsletterTitle')}
        subtitle={t('shop.newsletterSubtitle')}
      />
    </div>
  )
}
