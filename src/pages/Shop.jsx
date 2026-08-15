import { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, SlidersHorizontal, ChevronDown, X, Check } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import Newsletter from '../components/Newsletter'
import { SceneMedia } from '../components/Media'
import { MATERIALS } from '../data/products'
import { useProducts } from '../context/ProductsContext'
import { useLanguage } from '../context/LanguageContext'
import { localizeProduct } from '../utils/localize'

const PAGE_SIZE = 8

const PRICE_RANGES = [
  { id: 'under-200', test: (p) => p < 200 },
  { id: '200-500', test: (p) => p >= 200 && p <= 500 },
  { id: '500-1000', test: (p) => p > 500 && p <= 1000 },
  { id: '1000-plus', test: (p) => p > 1000 },
]

const SORT_FNS = {
  newest: (a, b) => (b.isNew === a.isNew ? 0 : b.isNew ? 1 : -1),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name),
}

export default function Shop() {
  const { t, language } = useLanguage()
  const { products } = useProducts()
  const [params, setParams] = useSearchParams()
  const category = params.get('category')
  const categoriesParam = params.get('categories')
  const categoryList = categoriesParam ? categoriesParam.split(',') : null
  const brand = params.get('brand')
  const activeFilter = params.get('filter') // 'new' | 'sale'
  const bundle = params.get('bundle')
  const [query, setQuery] = useState(() => params.get('q') || '')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const [priceFilters, setPriceFilters] = useState([])
  const [materialFilters, setMaterialFilters] = useState([])
  const [sort, setSort] = useState('newest')
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  const toggleValue = (list, setList, value) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
    setVisible(PAGE_SIZE)
  }

  const clearFilter = (key) => {
    const next = new URLSearchParams(params)
    next.delete(key)
    if (key === 'categories') next.delete('bundle')
    setParams(next)
    setVisible(PAGE_SIZE)
  }

  const filtered = useMemo(() => {
    let result = products.map((p) => localizeProduct(p, language))
    if (category) result = result.filter((p) => p.category === category)
    if (categoryList) result = result.filter((p) => categoryList.includes(p.category))
    if (brand) result = result.filter((p) => p.brand === brand)
    if (activeFilter === 'new') result = result.filter((p) => p.isNew)
    if (activeFilter === 'sale') result = result.filter((p) => p.compareAtPrice > p.price)
    if (priceFilters.length) {
      result = result.filter((p) =>
        priceFilters.some((id) => PRICE_RANGES.find((r) => r.id === id)?.test(p.price)),
      )
    }
    if (materialFilters.length) {
      result = result.filter((p) => materialFilters.includes(p.material))
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      result = result.filter((p) => p.name.toLowerCase().includes(q))
    }
    result.sort(SORT_FNS[sort])
    return result
  }, [products, category, categoryList, brand, activeFilter, priceFilters, materialFilters, query, sort, language])

  const shown = filtered.slice(0, visible)
  const priceRanges = t('collections.priceRanges')
  const sorts = t('collections.sorts')
  const activeChips = [
    ...(activeFilter === 'new' ? [{ key: 'filter', label: t('shop.newArrivalsChip') }] : []),
    ...(activeFilter === 'sale' ? [{ key: 'filter', label: t('shop.saleChip') }] : []),
    ...(category ? [{ key: 'category', label: t(`categories.${category}`) }] : []),
    ...(bundle ? [{ key: 'categories', label: t(`bundles.${bundle}.title`) }] : []),
    ...(brand ? [{ key: 'brand', label: brand }] : []),
    ...priceFilters.map((id) => ({
      key: `price-${id}`,
      label: priceRanges[id],
      onClear: () => toggleValue(priceFilters, setPriceFilters, id),
    })),
    ...materialFilters.map((m) => ({
      key: `material-${m}`,
      label: t(`materials.${m}`),
      onClear: () => toggleValue(materialFilters, setMaterialFilters, m),
    })),
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
            <div className="relative">
              <button
                onClick={() => {
                  setFilterOpen((v) => !v)
                  setSortOpen(false)
                }}
                className="inline-flex items-center gap-1.5 border border-navy-100 px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-navy-700 hover:border-navy-400 transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> {t('shop.filterBtn')}
              </button>
              {filterOpen && (
                <div className="absolute top-full left-0 rtl:left-auto rtl:right-0 mt-2 w-64 bg-white border border-navy-100 shadow-xl p-5 z-10 space-y-6">
                  <div>
                    <h4 className="text-[10px] font-semibold uppercase tracking-widest text-navy-800 mb-3">
                      {t('collections.priceRangeHeading')}
                    </h4>
                    <ul className="space-y-2.5">
                      {PRICE_RANGES.map((r) => (
                        <li key={r.id} className="flex items-center gap-2.5">
                          <input
                            id={`shop-price-${r.id}`}
                            type="checkbox"
                            checked={priceFilters.includes(r.id)}
                            onChange={() => toggleValue(priceFilters, setPriceFilters, r.id)}
                            className="w-3.5 h-3.5 accent-navy-800"
                          />
                          <label htmlFor={`shop-price-${r.id}`} className="text-sm text-navy-600">
                            {priceRanges[r.id]}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-semibold uppercase tracking-widest text-navy-800 mb-3">
                      {t('collections.materialityHeading')}
                    </h4>
                    <ul className="space-y-2.5">
                      {MATERIALS.map((m) => (
                        <li key={m} className="flex items-center gap-2.5">
                          <input
                            id={`shop-mat-${m}`}
                            type="checkbox"
                            checked={materialFilters.includes(m)}
                            onChange={() => toggleValue(materialFilters, setMaterialFilters, m)}
                            className="w-3.5 h-3.5 accent-navy-800"
                          />
                          <label htmlFor={`shop-mat-${m}`} className="text-sm text-navy-600">
                            {t(`materials.${m}`)}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setSortOpen((v) => !v)
                  setFilterOpen(false)
                }}
                className="inline-flex items-center gap-1.5 border border-navy-100 px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-navy-700 hover:border-navy-400 transition-colors"
              >
                {t('shop.sortBtn')} <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {sortOpen && (
                <div className="absolute top-full right-0 rtl:right-auto rtl:left-0 mt-2 w-56 bg-white border border-navy-100 shadow-xl py-2 z-10">
                  {Object.keys(SORT_FNS).map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSort(key)
                        setSortOpen(false)
                      }}
                      className="w-full flex items-center justify-between gap-2 px-4 py-2 text-sm text-navy-700 hover:bg-navy-50 transition-colors text-left rtl:text-right"
                    >
                      {sorts[key]}
                      {sort === key && <Check className="w-3.5 h-3.5 text-navy-800" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {activeChips.length > 0 && (
          <div className="flex items-center gap-2 pt-4">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                onClick={chip.onClear || (() => clearFilter(chip.key))}
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
