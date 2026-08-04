import { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, SlidersHorizontal, ChevronDown, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import Newsletter from '../components/Newsletter'
import { SceneMedia } from '../components/Media'
import { useProducts } from '../context/ProductsContext'

const PAGE_SIZE = 8

export default function Shop() {
  const { products } = useProducts()
  const [params, setParams] = useSearchParams()
  const category = params.get('category')
  const isNewOnly = params.get('filter') === 'new'
  const [query, setQuery] = useState('')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const clearFilter = (key) => {
    const next = new URLSearchParams(params)
    next.delete(key)
    setParams(next)
    setVisible(PAGE_SIZE)
  }

  const filtered = useMemo(() => {
    let result = [...products]
    if (category) result = result.filter((p) => p.category === category)
    if (isNewOnly) result = result.filter((p) => p.isNew)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      result = result.filter((p) => p.name.toLowerCase().includes(q))
    }
    return result
  }, [products, category, isNewOnly, query])

  const shown = filtered.slice(0, visible)
  const activeChips = [
    ...(isNewOnly ? [{ key: 'filter', label: 'New Arrivals' }] : []),
    ...(category ? [{ key: 'category', label: category }] : []),
  ]

  return (
    <div>
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 pt-14 sm:pt-16 pb-8 text-center">
        <p className="section-eyebrow justify-center flex">Curated Artisanal Collections</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-navy-900">Aqua Atelier Shop</h1>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 pb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border-y border-navy-100 py-4">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-navy-300 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setVisible(PAGE_SIZE)
              }}
              placeholder="Search..."
              className="w-full border border-navy-100 pl-8 pr-3 py-2.5 text-sm focus:outline-none focus:border-navy-400"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-1.5 border border-navy-100 px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-navy-700 hover:border-navy-400 transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filter
            </button>
            <button className="inline-flex items-center gap-1.5 border border-navy-100 px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-navy-700 hover:border-navy-400 transition-colors">
              Sort <ChevronDown className="w-3.5 h-3.5" />
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
          <p className="text-sm text-navy-400 py-16 text-center">
            No pieces match your search just yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="mt-14">
          <p className="text-xs text-navy-400 text-center mb-3">
            Showing {shown.length} of {filtered.length} items
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
                Load More
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
                The Coastal Journal
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-navy-900 mb-4">
                Elegance in Simplicity
              </h2>
              <p className="text-sm text-navy-500 mb-5 leading-relaxed">
                Discover the philosophy behind our Summer Collections. Inspired by the raw
                textures of the Mediterranean coast.
              </p>
              <span className="text-xs font-medium uppercase tracking-widest text-navy-800 border-b border-navy-800 pb-1">
                Read The Story
              </span>
            </div>
          </SceneMedia>
        </Link>
      </section>

      <Newsletter
        eyebrow="Join The Circle"
        title="Join Our Exclusive Circle"
        subtitle="Be the first to receive updates on new artisanal arrivals, private sales, and the Aqua Atelier journal."
      />
    </div>
  )
}
