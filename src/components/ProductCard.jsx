import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { ProductMedia } from './Media'
import StarRating from './StarRating'
import { formatPrice } from '../utils/format'
import { useLanguage } from '../context/LanguageContext'
import { localizeProduct } from '../utils/localize'
import { useWishlist } from '../hooks/useWishlist'

export default function ProductCard({ product: rawProduct, showCategory = true }) {
  const { t, language } = useLanguage()
  const product = localizeProduct(rawProduct, language)
  const { isWishlisted, toggle } = useWishlist()
  const wishlisted = isWishlisted(product.id)
  const onSale = product.compareAtPrice > product.price

  return (
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
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            toggle(product.id)
          }}
          aria-label={t('productCard.wishlist')}
          aria-pressed={wishlisted}
          className={`absolute bottom-3 right-3 rtl:right-auto rtl:left-3 w-8 h-8 flex items-center justify-center bg-white/90 transition-opacity ${
            wishlisted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 ${wishlisted ? 'fill-navy-800 text-navy-800' : 'text-navy-700'}`}
          />
        </button>
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
      {product.rating != null && (
        <div className="flex items-center gap-1.5">
          <StarRating rating={product.rating} size={10} />
          <span className="text-[11px] text-navy-400">({product.reviews})</span>
        </div>
      )}
    </Link>
  )
}
