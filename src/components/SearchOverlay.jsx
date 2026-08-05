import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useProducts } from '../context/ProductsContext'
import { useLanguage } from '../context/LanguageContext'
import { localizeProduct } from '../utils/localize'
import { formatPrice } from '../utils/format'
import { ProductMedia } from './Media'

const MAX_PRODUCT_RESULTS = 5
const MAX_JOURNAL_RESULTS = 3

export default function SearchOverlay({ open, onClose }) {
  const { t, language } = useLanguage()
  const { products } = useProducts()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (!open) return
    setQuery('')
    const id = setTimeout(() => inputRef.current?.focus(), 10)
    return () => clearTimeout(id)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  const q = query.trim().toLowerCase()

  const productResults = useMemo(() => {
    if (!q) return []
    return products
      .map((p) => localizeProduct(p, language))
      .filter(
        (p) => p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q),
      )
      .slice(0, MAX_PRODUCT_RESULTS)
  }, [products, q, language])

  const journalPosts = t('journal.posts')
  const journalResults = useMemo(() => {
    if (!q) return []
    return journalPosts
      .filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.tag.toLowerCase().includes(q),
      )
      .slice(0, MAX_JOURNAL_RESULTS)
  }, [journalPosts, q])

  const hasQuery = q.length > 0
  const hasResults = productResults.length > 0 || journalResults.length > 0

  const goTo = (path) => {
    onClose()
    navigate(path)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (!q) return
    goTo(`/shop?q=${encodeURIComponent(query.trim())}`)
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-navy-900/30 z-40" onClick={onClose} />
      <div className="fixed top-0 inset-x-0 z-50 bg-sand border-b border-navy-100 shadow-lg">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-6">
          <form onSubmit={onSubmit} className="relative flex items-center gap-3">
            <Search className="w-4 h-4 text-navy-400 absolute left-0 rtl:left-auto rtl:right-0 pointer-events-none" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              className="flex-1 bg-transparent border-b border-navy-200 focus:border-navy-600 pl-7 pr-2 rtl:pl-2 rtl:pr-7 py-2.5 text-lg font-serif focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label={t('common.close')}
              className="text-navy-500 hover:text-navy-800 shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </form>

          {hasQuery && (
            <div className="mt-6 max-h-[60vh] overflow-y-auto">
              {!hasResults ? (
                <p className="text-sm text-navy-400 py-6">{t('search.noResults', { query })}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {productResults.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-navy-400 mb-3">
                        {t('search.productsHeading')}
                      </p>
                      <div className="space-y-1">
                        {productResults.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => goTo(`/product/${p.id}`)}
                            className="flex items-center gap-3 w-full text-left rtl:text-right hover:bg-navy-50 p-1.5 -m-1.5 transition-colors"
                          >
                            <div className="w-12 h-12 shrink-0">
                              <ProductMedia
                                tone={p.tone}
                                image={p.image}
                                alt={p.name}
                                className="w-full h-full"
                                iconClassName="w-4 h-4"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-navy-900 truncate">{p.name}</p>
                              <p className="text-xs text-navy-500">{formatPrice(p.price)}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {journalResults.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-navy-400 mb-3">
                        {t('search.journalHeading')}
                      </p>
                      <div className="space-y-1">
                        {journalResults.map((post) => (
                          <button
                            key={post.title}
                            onClick={() => goTo('/journal')}
                            className="block w-full text-left rtl:text-right hover:bg-navy-50 p-1.5 -m-1.5 transition-colors"
                          >
                            <p className="text-sm text-navy-900">{post.title}</p>
                            <p className="text-xs text-navy-500 line-clamp-1">{post.excerpt}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {hasResults && (
                <button
                  onClick={() => goTo(`/shop?q=${encodeURIComponent(query.trim())}`)}
                  className="text-xs font-medium uppercase tracking-widest text-navy-800 border-b border-navy-800 pb-1 mt-6 hover:text-navy-600 hover:border-navy-600 transition-colors"
                >
                  {t('search.viewAllResults')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
