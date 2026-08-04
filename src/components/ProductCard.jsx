import { Link } from 'react-router-dom'
import { ProductMedia } from './Media'
import { formatPrice } from '../utils/format'
import { useLanguage } from '../context/LanguageContext'
import { localizeProduct } from '../utils/localize'

export default function ProductCard({ product: rawProduct, showCategory = true }) {
  const { t, language } = useLanguage()
  const product = localizeProduct(rawProduct, language)

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative aspect-square mb-4 overflow-hidden">
        <ProductMedia
          tone={product.tone}
          image={product.image}
          alt={product.name}
          className="w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        {product.isNew && (
          <span className="absolute top-3 left-3 rtl:left-auto rtl:right-3 bg-white text-navy-800 text-[9px] font-semibold uppercase tracking-widest px-2.5 py-1">
            {t('productCard.newBadge')}
          </span>
        )}
      </div>
      {showCategory && (
        <p className="text-[10px] font-medium uppercase tracking-widest text-navy-400 mb-1">
          {t(`categories.${product.category}`)}
        </p>
      )}
      <h3 className="text-sm text-navy-900 font-medium mb-1 group-hover:text-navy-600 transition-colors">
        {product.name}
      </h3>
      <p className="text-sm text-navy-600">{formatPrice(product.price)}</p>
    </Link>
  )
}
