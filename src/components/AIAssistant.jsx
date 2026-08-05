import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, X, ArrowLeft } from 'lucide-react'
import { ProductMedia } from './Media'
import { useProducts } from '../context/ProductsContext'
import { useLanguage } from '../context/LanguageContext'
import { localizeProduct } from '../utils/localize'
import { formatPrice } from '../utils/format'

const DESTINATIONS = [
  { key: 'beachResort', categories: ['Beachwear', 'Accessories'] },
  { key: 'swimmingPool', categories: ['Swimwear', 'Swimming Equipment'] },
  { key: 'bali', categories: ['Water Sports', 'Swimwear'] },
  { key: 'maldives', categories: ['Beachwear', 'Accessories'] },
  { key: 'familyVacation', categories: ['Beach Essentials', 'Footwear'] },
]

export default function AIAssistant() {
  const { t, language } = useLanguage()
  const { products } = useProducts()
  const [open, setOpen] = useState(false)
  const [destination, setDestination] = useState(null)

  const recommendations = useMemo(() => {
    if (!destination) return []
    return products
      .filter((p) => destination.categories.includes(p.category))
      .map((p) => localizeProduct(p, language))
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, 3)
  }, [destination, products, language])

  const categoriesQuery = destination ? destination.categories.join(',') : ''

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t('assistant.toggleLabel')}
        className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-40 w-[52px] h-[52px] rounded-full bg-navy-800 text-white flex items-center justify-center shadow-lg hover:bg-navy-900 transition-colors"
      >
        {open ? <X className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 rtl:right-auto rtl:left-6 z-40 w-[340px] max-w-[calc(100vw-3rem)] bg-sand border border-navy-100 shadow-xl">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-navy-100">
            <Sparkles className="w-4 h-4 text-navy-700" strokeWidth={1.5} />
            <h3 className="font-serif text-base text-navy-900">{t('assistant.title')}</h3>
          </div>

          <div className="p-5 max-h-[420px] overflow-y-auto">
            {!destination ? (
              <>
                <p className="text-sm text-navy-700 mb-4">{t('assistant.question')}</p>
                <div className="grid grid-cols-1 gap-2">
                  {DESTINATIONS.map((d) => (
                    <button
                      key={d.key}
                      onClick={() => setDestination(d)}
                      className="text-left rtl:text-right border border-navy-100 px-3.5 py-2.5 text-sm text-navy-700 hover:border-navy-400 hover:text-navy-900 transition-colors"
                    >
                      {t(`assistant.destinations.${d.key}`)}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => setDestination(null)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-navy-500 hover:text-navy-800 mb-4 transition-colors"
                >
                  <ArrowLeft className="w-3 h-3 rtl:rotate-180" /> {t('assistant.startOver')}
                </button>
                <p className="text-sm text-navy-700 mb-4">
                  {t('assistant.recommendationIntro', { destination: t(`assistant.destinations.${destination.key}`) })}
                </p>
                <div className="space-y-3 mb-4">
                  {recommendations.map((p) => (
                    <Link
                      key={p.id}
                      to={`/product/${p.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 hover:bg-navy-50 p-1.5 -m-1.5 transition-colors"
                    >
                      <div className="w-12 h-12 shrink-0">
                        <ProductMedia tone={p.tone} image={p.image} alt={p.name} className="w-full h-full" iconClassName="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-navy-900 truncate">{p.name}</p>
                        <p className="text-xs text-navy-500">{formatPrice(p.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  to={`/shop?categories=${encodeURIComponent(categoriesQuery)}`}
                  onClick={() => setOpen(false)}
                  className="btn-primary w-full text-center"
                >
                  {t('assistant.shopEdit')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
