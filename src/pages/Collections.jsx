import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, LayoutGrid, List, ArrowRight } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import Newsletter from '../components/Newsletter'
import { SceneMedia, ProductMedia } from '../components/Media'
import { CATEGORIES, MATERIALS } from '../data/products'
import { useProducts } from '../context/ProductsContext'
import { formatPrice } from '../utils/format'

const PRICE_RANGES = [
  { id: 'under-200', label: 'Under $200', test: (p) => p < 200 },
  { id: '200-500', label: '$200 - $500', test: (p) => p >= 200 && p <= 500 },
  { id: '500-1000', label: '$500 - $1,000', test: (p) => p > 500 && p <= 1000 },
  { id: '1000-plus', label: '$1,000+', test: (p) => p > 1000 },
]

const SORTS = {
  newest: { label: 'Newest First', fn: (a, b) => (b.isNew === a.isNew ? 0 : b.isNew ? 1 : -1) },
  'price-asc': { label: 'Price: Low to High', fn: (a, b) => a.price - b.price },
  'price-desc': { label: 'Price: High to Low', fn: (a, b) => b.price - a.price },
  name: { label: 'Name: A to Z', fn: (a, b) => a.name.localeCompare(b.name) },
}

const PAGE_SIZE = 6

export default function Collections() {
  const { products } = useProducts()
  const [category, setCategory] = useState('All Collections')
  const [priceFilters, setPriceFilters] = useState([])
  const [materialFilters, setMaterialFilters] = useState([])
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('newest')
  const [view, setView] = useState('grid')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const toggle = (list, setList, value) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])

  const filtered = useMemo(() => {
    let result = [...products]
    if (category !== 'All Collections') {
      if (category === 'New Arrivals') result = result.filter((p) => p.isNew)
      else result = result.filter((p) => p.category === category)
    }
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
    result.sort(SORTS[sort].fn)
    return result
  }, [products, category, priceFilters, materialFilters, query, sort])

  const shown = filtered.slice(0, visible)
  const collectionLinks = ['All Collections', 'New Arrivals', ...CATEGORIES]

  return (
    <div>
      <div className="bg-sand-100 border-b border-navy-100">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-14 sm:py-16">
          <h1 className="font-serif text-4xl sm:text-5xl text-navy-900 mb-4">
            Curated Collections
          </h1>
          <p className="text-sm text-navy-500 max-w-xl leading-relaxed">
            Explore our selection of artisanal goods, crafted with a dedication to timeless
            elegance and superior materiality. From sensory fragrances to architectural home
            accents.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-12 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12">
        {/* Sidebar */}
        <aside className="space-y-10">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-navy-800 mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5">
              {collectionLinks.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => {
                      setCategory(c)
                      setVisible(PAGE_SIZE)
                    }}
                    className={`text-sm transition-colors ${
                      category === c ? 'text-navy-900 font-medium' : 'text-navy-500 hover:text-navy-800'
                    }`}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-navy-100 pt-8">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-navy-800 mb-4">
              Price Range
            </h4>
            <ul className="space-y-3">
              {PRICE_RANGES.map((r) => (
                <li key={r.id} className="flex items-center gap-2.5">
                  <input
                    id={r.id}
                    type="checkbox"
                    checked={priceFilters.includes(r.id)}
                    onChange={() => {
                      toggle(priceFilters, setPriceFilters, r.id)
                      setVisible(PAGE_SIZE)
                    }}
                    className="w-3.5 h-3.5 accent-navy-800"
                  />
                  <label htmlFor={r.id} className="text-sm text-navy-600">
                    {r.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-navy-100 pt-8">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-navy-800 mb-4">
              Materiality
            </h4>
            <ul className="space-y-3">
              {MATERIALS.map((m) => (
                <li key={m} className="flex items-center gap-2.5">
                  <input
                    id={`mat-${m}`}
                    type="checkbox"
                    checked={materialFilters.includes(m)}
                    onChange={() => {
                      toggle(materialFilters, setMaterialFilters, m)
                      setVisible(PAGE_SIZE)
                    }}
                    className="w-3.5 h-3.5 accent-navy-800"
                  />
                  <label htmlFor={`mat-${m}`} className="text-sm text-navy-600">
                    {m}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <p className="text-xs text-navy-400">Showing {shown.length} of {filtered.length} results</p>
              <div className="hidden sm:flex items-center gap-1.5 border border-navy-100 p-0.5">
                <button
                  onClick={() => setView('grid')}
                  className={`p-1.5 ${view === 'grid' ? 'bg-navy-800 text-white' : 'text-navy-400'}`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-1.5 ${view === 'list' ? 'bg-navy-800 text-white' : 'text-navy-400'}`}
                  aria-label="List view"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-navy-300 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setVisible(PAGE_SIZE)
                  }}
                  placeholder="Search artifacts..."
                  className="border border-navy-100 pl-8 pr-3 py-2 text-sm w-48 focus:outline-none focus:border-navy-400"
                />
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-navy-100 px-3 py-2 text-sm focus:outline-none focus:border-navy-400 bg-white"
              >
                {Object.entries(SORTS).map(([key, s]) => (
                  <option key={key} value={key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {shown.length === 0 ? (
            <p className="text-sm text-navy-400 py-16 text-center">
              No artifacts match your filters. Try adjusting your selection.
            </p>
          ) : (
            <div
              className={
                view === 'grid'
                  ? 'grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10'
                  : 'flex flex-col divide-y divide-navy-100'
              }
            >
              {shown.map((p) =>
                view === 'grid' ? (
                  <ProductCard key={p.id} product={p} />
                ) : (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    className="flex items-center gap-5 py-5 group"
                  >
                    <div className="w-20 h-20 shrink-0 overflow-hidden">
                      <ProductMedia
                        tone={p.tone}
                        image={p.image}
                        alt={p.name}
                        className="w-full h-full"
                        iconClassName="w-5 h-5"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-medium uppercase tracking-widest text-navy-400 mb-1">
                        {p.category}
                      </p>
                      <h3 className="text-sm text-navy-900 font-medium group-hover:text-navy-600 transition-colors">
                        {p.name}
                      </h3>
                    </div>
                    <p className="text-sm text-navy-600">{formatPrice(p.price)}</p>
                  </Link>
                ),
              )}
            </div>
          )}

          {visible < filtered.length && (
            <div className="text-center mt-14">
              <button onClick={() => setVisible((v) => v + PAGE_SIZE)} className="btn-secondary">
                Load More Discoveries
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Seasonal Spotlight */}
      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 pb-20">
        <Link to="/shop?category=Home Goods" className="relative block overflow-hidden group">
          <SceneMedia tone="interior" overlay="dark-full" className="w-full min-h-[380px] flex items-center justify-center">
            <div className="relative text-center px-6">
              <p className="text-[11px] font-medium uppercase tracking-widest2 text-white/80 mb-3">
                Seasonal Spotlight
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-white mb-6 max-w-md mx-auto">
                The Coastal Sanctuary Collection
              </h2>
              <span className="btn-outline-light bg-white text-navy-900 border-white hover:bg-navy-900 hover:text-white inline-flex items-center gap-2">
                Explore The Edit <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </SceneMedia>
        </Link>
      </section>

      <Newsletter
        eyebrow="Join Our Exclusive Circle"
        title="Join Our Exclusive Circle"
        subtitle="Be the first to receive updates on new artisanal arrivals, private sales, and the Aqua Atelier journal."
      />
    </div>
  )
}
