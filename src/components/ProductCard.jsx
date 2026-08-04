import { Link } from 'react-router-dom'
import { ProductMedia } from './Media'
import { formatPrice } from '../utils/format'

export default function ProductCard({ product, showCategory = true }) {
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
          <span className="absolute top-3 left-3 bg-white text-navy-800 text-[9px] font-semibold uppercase tracking-widest px-2.5 py-1">
            New
          </span>
        )}
      </div>
      {showCategory && (
        <p className="text-[10px] font-medium uppercase tracking-widest text-navy-400 mb-1">
          {product.category}
        </p>
      )}
      <h3 className="text-sm text-navy-900 font-medium mb-1 group-hover:text-navy-600 transition-colors">
        {product.name}
      </h3>
      <p className="text-sm text-navy-600">{formatPrice(product.price)}</p>
    </Link>
  )
}
