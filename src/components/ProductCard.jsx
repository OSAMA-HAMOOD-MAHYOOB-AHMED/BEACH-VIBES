import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { ProductMedia } from './Media'
import StarRating from './StarRating'
import QuickViewModal from './QuickViewModal'
import { useFormatPrice } from '../hooks/useFormatPrice'
import { useLanguage } from '../context/LanguageContext'
import { localizeProduct } from '../utils/localize'
import { useWishlist } from '../hooks/useWishlist'

export default function ProductCard({ product: rawProduct, showCategory = true }) {
  const { t, language } = useLanguage()
  const product = localizeProduct(rawProduct, language)
  const formatPrice = useFormatPrice()
  const { isWishlisted, toggle } = useWishlist()
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const wishlisted = isWishlisted(product.id)
  const onSale = product.compareAtPrice > product.price

  return (
    <>
      <Link to={`/product/${product.id}`} className="group block">
        <div className="relative aspect-square mb-4 overflow-hidden">
          <ProductMedia
            tone={product.tone}
            image={product.image}
            alt={product.name}
            className="w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 right-3 rtl:left-3 rtl:right-3 flex items-start justify-between gap-2">
            {product.isNew ? (
              <span className="bg-white text-navy-800 text-[9px] font-semibold uppercase tracking-widest px-2.5 py-1">
                {t('productCard.newBadge')}
              </span>
            ) : (
              <span />
            )}
            {onSale && (
              <span className="bg-navy-800 text-white text-[9px] font-semibold uppercase tracking-widest px-2.5 py-1">
                {t('productCard.saleBadge')}
              </span>
            )}
          </div>

          <div className="absolute bottom-0 inset-x-0 flex items-stretch bg-white/95 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                setQuickViewOpen(true)
              }}
              className="flex-1 text-[10px] font-semibold uppercase tracking-widest text-navy-800 hover:text-navy-600 py-2.5 transition-colors"
            >
              {t('productCard.quickView')}
            </button>
            <span className="w-px my-2 bg-navy-200" />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                toggle(product.id)
              }}
              aria-label={t('productCard.wishlist')}
              aria-pressed={wishlisted}
              className="w-10 flex items-center justify-center"
            >
              <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-navy-800 text-navy-800' : 'text-navy-700'}`} />
            </button>
          </div>
        </div>
        {showCategory && (
          <p className="text-[10px] font-medium uppercase tracking-widest text-navy-400 mb-1">
            {t(`categories.${product.category}`)}
          </p>
        )}
        <h3 className="text-sm text-navy-900 font-medium mb-1 group-hover:text-navy-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm text-navy-600">{formatPrice(product.price)}</p>
          {onSale && (
            <p className="text-xs text-navy-300 line-through">{formatPrice(product.compareAtPrice)}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          {product.rating != null && (
            <div className="flex items-center gap-1.5">
              <StarRating rating={product.rating} size={10} />
              <span className="text-[11px] text-navy-400">({product.reviews})</span>
            </div>
          )}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 4).map((color) => (
                <span
                  key={color}
                  className="w-2.5 h-2.5 rounded-full border border-navy-200"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      <QuickViewModal product={product} open={quickViewOpen} onClose={() => setQuickViewOpen(false)} />
    </>
  )
}
