import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ArrowLeft, Truck, RefreshCcw, ShieldCheck } from 'lucide-react'
import { ProductMedia } from '../components/Media'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductsContext'
import { useLanguage } from '../context/LanguageContext'
import { localizeProduct } from '../utils/localize'
import { useFormatPrice } from '../hooks/useFormatPrice'

const TAX_RATE = 0.08

export default function Cart() {
  const { t, language } = useLanguage()
  const formatPrice = useFormatPrice()
  const { lines: rawLines, subtotal, count, updateQty, removeItem } = useCart()
  const { products } = useProducts()

  const lines = useMemo(
    () => rawLines.map((l) => ({ ...l, product: localizeProduct(l.product, language) })),
    [rawLines, language],
  )

  const shipping = subtotal >= 500 || subtotal === 0 ? 0 : 25
  const tax = subtotal * TAX_RATE
  const total = subtotal + shipping + tax

  const complements = useMemo(() => {
    const inCart = new Set(rawLines.map((l) => l.id))
    return products.filter((p) => !inCart.has(p.id)).slice(0, 4)
  }, [products, rawLines])

  return (
    <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-10">
      <nav className="text-[11px] text-navy-400 uppercase tracking-widest flex items-center gap-2 mb-6">
        <Link to="/" className="hover:text-navy-700">{t('cart.breadcrumbHome')}</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-navy-700">{t('cart.breadcrumbShop')}</Link>
        <span>/</span>
        <span className="text-navy-700">{t('cart.breadcrumbBag')}</span>
      </nav>

      <div className="flex items-baseline justify-between mb-10">
        <h1 className="font-serif text-3xl sm:text-4xl text-navy-900">{t('cart.title')}</h1>
        <p className="text-xs text-navy-400">
          {count === 1 ? t('cart.itemCountOne') : t('cart.itemCountOther', { count })}
        </p>
      </div>

      {lines.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-sm text-navy-500 mb-8">{t('cart.emptyMessage')}</p>
          <Link to="/shop" className="btn-primary">
            {t('cart.continueExploringBtn')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-14">
          <div>
            <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 pb-4 border-b border-navy-100 text-[10px] font-semibold uppercase tracking-widest text-navy-400">
              <span>{t('cart.headerProduct')}</span>
              <span>{t('cart.headerQuantity')}</span>
              <span>{t('cart.headerPrice')}</span>
              <span className="text-right rtl:text-left">{t('cart.headerTotal')}</span>
            </div>

            <div className="divide-y divide-navy-100">
              {lines.map((line, idx) => (
                <div
                  key={line.id}
                  className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr] gap-4 py-6 items-center"
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 shrink-0">
                      <ProductMedia
                        tone={line.product.tone}
                        image={line.product.image}
                        alt={line.product.name}
                        className="w-full h-full"
                        iconClassName="w-6 h-6"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-widest text-navy-400 mb-1">
                        {t(`categories.${line.product.category}`)}
                      </p>
                      <Link
                        to={`/product/${line.id}`}
                        className="text-sm text-navy-900 font-medium hover:text-navy-600 transition-colors"
                      >
                        {line.product.name}
                      </Link>
                      <p className="text-[11px] text-navy-400 mt-1">
                        {t('cart.skuLabel')}: BV-{line.id.slice(0, 3).toUpperCase()}-{String(idx + 1).padStart(3, '0')}
                      </p>
                      <button
                        onClick={() => removeItem(line.id)}
                        className="sm:hidden inline-flex items-center gap-1.5 text-xs text-navy-400 hover:text-navy-700 mt-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> {t('cart.remove')}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center border border-navy-200 w-fit">
                    <button
                      onClick={() => updateQty(line.id, line.qty - 1)}
                      className="w-8 h-9 flex items-center justify-center text-navy-600 hover:bg-navy-50"
                      aria-label={t('cart.decreaseQty')}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm">{line.qty}</span>
                    <button
                      onClick={() => updateQty(line.id, line.qty + 1)}
                      className="w-8 h-9 flex items-center justify-center text-navy-600 hover:bg-navy-50"
                      aria-label={t('cart.increaseQty')}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <p className="text-sm text-navy-600">{formatPrice(line.product.price)}</p>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <p className="text-sm text-navy-900 font-medium">
                      {formatPrice(line.product.price * line.qty)}
                    </p>
                    <button
                      onClick={() => removeItem(line.id)}
                      className="hidden sm:inline-flex text-navy-400 hover:text-navy-700"
                      aria-label={t('cart.removeItem')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-navy-700 hover:text-navy-900 mt-8"
            >
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" /> {t('cart.continueExploring')}
            </Link>
          </div>

          <aside className="bg-sand-100 border border-navy-100 p-7 h-fit">
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-navy-800 mb-6">
              {t('cart.orderSummary')}
            </h3>
            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-navy-600">
                <span>{t('cart.subtotal')}</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-navy-600">
                <span>{t('cart.shipping')}</span>
                <span>{shipping === 0 ? t('cart.complimentary') : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-navy-600">
                <span>{t('cart.estimatedTax')}</span>
                <span>{formatPrice(tax)}</span>
              </div>
            </div>

            <div className="mb-5">
              <p className="text-[10px] font-medium uppercase tracking-widest text-navy-400 mb-2">
                {t('cart.promotionCode')}
              </p>
              <div className="flex gap-2">
                <input
                  placeholder={t('cart.enterCode')}
                  className="flex-1 border border-navy-200 px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-navy-400"
                />
                <button className="border border-navy-800 px-4 text-xs font-medium uppercase tracking-widest text-navy-800 hover:bg-navy-800 hover:text-white transition-colors">
                  {t('cart.apply')}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-baseline border-t border-navy-200 pt-5 mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-navy-800">
                {t('cart.estimatedTotal')}
              </span>
              <span className="font-serif text-2xl text-navy-900">{formatPrice(total)}</span>
            </div>

            <Link to="/checkout" className="btn-primary w-full mb-6">
              {t('cart.proceedToCheckout')}
            </Link>

            <ul className="space-y-4 text-xs text-navy-500">
              <li className="flex gap-3">
                <Truck className="w-4 h-4 text-navy-500 shrink-0 mt-0.5" strokeWidth={1.5} />
                <span>
                  <span className="block font-semibold text-navy-700 uppercase tracking-wide text-[10px] mb-0.5">
                    {t('cart.deliveryTitle')}
                  </span>
                  {t('cart.deliveryBody')}
                </span>
              </li>
              <li className="flex gap-3">
                <RefreshCcw className="w-4 h-4 text-navy-500 shrink-0 mt-0.5" strokeWidth={1.5} />
                <span>
                  <span className="block font-semibold text-navy-700 uppercase tracking-wide text-[10px] mb-0.5">
                    {t('cart.assuranceTitle')}
                  </span>
                  {t('cart.assuranceBody')}
                </span>
              </li>
              <li className="flex gap-3">
                <ShieldCheck className="w-4 h-4 text-navy-500 shrink-0 mt-0.5" strokeWidth={1.5} />
                <span>
                  <span className="block font-semibold text-navy-700 uppercase tracking-wide text-[10px] mb-0.5">
                    {t('cart.conciergeTitle')}
                  </span>
                  {t('cart.conciergeBody')}
                </span>
              </li>
            </ul>
          </aside>
        </div>
      )}

      {complements.length > 0 && (
        <section className="mt-24">
          <p className="section-eyebrow text-center flex justify-center">{t('cart.complementsHeading')}</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 mt-8">
            {complements.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
