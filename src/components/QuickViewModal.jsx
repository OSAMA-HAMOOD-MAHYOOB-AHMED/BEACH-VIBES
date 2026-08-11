import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { ProductMedia } from './Media'
import StarRating from './StarRating'
import { useFormatPrice } from '../hooks/useFormatPrice'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'

export default function QuickViewModal({ product, open, onClose }) {
  const { t } = useLanguage()
  const { addItem } = useCart()
  const formatPrice = useFormatPrice()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const onSale = product?.compareAtPrice > product?.price

  useEffect(() => {
    if (!open) return
    setQty(1)
    setAdded(false)
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open || !product) return null

  const handleAdd = () => {
    addItem(product.id, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <>
      <div className="fixed inset-0 bg-navy-900/40 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-sand max-w-2xl w-full grid grid-cols-1 sm:grid-cols-2 shadow-xl pointer-events-auto max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="aspect-square sm:aspect-auto">
            <ProductMedia tone={product.tone} image={product.image} alt={product.name} className="w-full h-full" iconClassName="w-10 h-10" />
          </div>
          <div className="p-6 sm:p-7 relative">
            <button
              onClick={onClose}
              aria-label={t('common.close')}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-navy-400 hover:text-navy-800"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="text-[10px] font-medium uppercase tracking-widest text-navy-400 mb-1.5">
              {t(`categories.${product.category}`)}
            </p>
            <h3 className="font-serif text-xl text-navy-900 mb-2 pr-6 rtl:pr-0 rtl:pl-6">{product.name}</h3>
            {product.rating != null && (
              <div className="flex items-center gap-1.5 mb-3">
                <StarRating rating={product.rating} size={12} />
                <span className="text-xs text-navy-400">({product.reviews})</span>
              </div>
            )}
            <div className="flex items-center gap-2 mb-4">
              <p className="text-lg text-navy-700">{formatPrice(product.price)}</p>
              {onSale && <p className="text-sm text-navy-300 line-through">{formatPrice(product.compareAtPrice)}</p>}
            </div>
            <p className="text-sm text-navy-500 leading-relaxed mb-5">{product.description}</p>

            {product.colors && product.colors.length > 0 && (
              <div className="mb-5">
                <p className="text-[10px] font-medium uppercase tracking-widest text-navy-400 mb-2">
                  {t('productCard.colors')}
                </p>
                <div className="flex items-center gap-2">
                  {product.colors.map((color) => (
                    <span
                      key={color}
                      className="w-5 h-5 rounded-full border border-navy-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-5">
              <div className="flex items-center border border-navy-200 w-fit">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-8 h-9 flex items-center justify-center text-navy-600 hover:bg-navy-50"
                  aria-label={t('productDetail.decreaseQty')}
                >
                  −
                </button>
                <span className="w-8 text-center text-sm">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-8 h-9 flex items-center justify-center text-navy-600 hover:bg-navy-50"
                  aria-label={t('productDetail.increaseQty')}
                >
                  +
                </button>
              </div>
              <button onClick={handleAdd} className="btn-primary flex-1">
                {added ? t('productDetail.addedToBag') : t('productDetail.addToBag')}
              </button>
            </div>

            <Link
              to={`/product/${product.id}`}
              onClick={onClose}
              className="text-xs font-medium uppercase tracking-widest text-navy-800 border-b border-navy-800 pb-1"
            >
              {t('productCard.viewFullDetails')}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
