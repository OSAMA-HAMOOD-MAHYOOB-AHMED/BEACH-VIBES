import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CreditCard, Lock, PackageCheck, ChevronRight } from 'lucide-react'
import { ProductMedia } from '../components/Media'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { localizeProduct } from '../utils/localize'
import { formatPrice } from '../utils/format'
import { api } from '../lib/api'

const TAX_RATE = 0.08

export default function Checkout() {
  const { t, language } = useLanguage()
  const { user } = useAuth()
  const { lines: rawLines, subtotal, clearCart } = useCart()

  const lines = useMemo(
    () => rawLines.map((l) => ({ ...l, product: localizeProduct(l.product, language) })),
    [rawLines, language],
  )

  const [shippingMethod, setShippingMethod] = useState('express')
  const [placed, setPlaced] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })

  const shipping = shippingMethod === 'express' ? 25 : subtotal >= 500 ? 0 : 15
  const tax = subtotal * TAX_RATE
  const total = subtotal + shipping + tax

  const onChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await api.post(
        '/api/orders',
        {
          items: rawLines.map((l) => ({ productId: l.id, quantity: l.qty })),
          shippingAddress: {
            firstName: form.firstName,
            lastName: form.lastName,
            address: form.address,
            city: form.city,
            state: form.state,
            zip: form.zip,
          },
        },
        { auth: true },
      )
      setPlaced(true)
      clearCart()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (lines.length === 0 && !placed) {
    return (
      <div className="max-w-xl mx-auto px-5 py-24 text-center">
        <h1 className="font-serif text-3xl text-navy-900 mb-4">{t('checkout.emptyTitle')}</h1>
        <p className="text-sm text-navy-500 mb-8">{t('checkout.emptyBody')}</p>
        <Link to="/shop" className="btn-primary">
          {t('checkout.browseShop')}
        </Link>
      </div>
    )
  }

  if (placed) {
    return (
      <div className="max-w-xl mx-auto px-5 py-24 text-center">
        <PackageCheck className="w-10 h-10 text-navy-700 mx-auto mb-6" strokeWidth={1.25} />
        <h1 className="font-serif text-3xl sm:text-4xl text-navy-900 mb-4">{t('checkout.confirmedTitle')}</h1>
        <p className="text-sm text-navy-500 mb-2">
          {t('checkout.thankYou', {
            name: form.firstName || t('checkout.defaultName'),
            email: form.email || t('checkout.defaultEmail'),
          })}
        </p>
        <p className="text-sm text-navy-500 mb-10">
          {t('checkout.orderTotal')} <span className="text-navy-900 font-medium">{formatPrice(total)}</span>
        </p>
        <Link to="/shop" className="btn-primary">
          {t('checkout.continueExploring')}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-10">
      <nav className="text-[11px] text-navy-400 uppercase tracking-widest flex items-center gap-2 mb-6">
        <Link to="/cart" className="hover:text-navy-700">{t('checkout.breadcrumbCart')}</Link>
        <span>/</span>
        <span className="text-navy-700">{t('checkout.breadcrumbCheckout')}</span>
      </nav>
      <h1 className="font-serif text-3xl sm:text-4xl text-navy-900 mb-1">{t('checkout.title')}</h1>
      <p className="text-sm text-navy-500 mb-10">{t('checkout.subtitle')}</p>

      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-14">
        <div>
          <Section number="01" title={t('checkout.section1Title')}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <Field label={t('checkout.firstName')}>
                <input
                  required
                  value={form.firstName}
                  onChange={onChange('firstName')}
                  placeholder="Alexander"
                  className="input-field"
                />
              </Field>
              <Field label={t('checkout.lastName')}>
                <input
                  required
                  value={form.lastName}
                  onChange={onChange('lastName')}
                  placeholder="Vance"
                  className="input-field"
                />
              </Field>
              <Field label={t('checkout.emailAddress')} full>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={onChange('email')}
                  placeholder="alexander@domain.com"
                  className="input-field"
                />
              </Field>
            </div>
          </Section>

          <Section number="02" title={t('checkout.section2Title')}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mb-8">
              <Field label={t('checkout.address')} full>
                <input
                  required
                  value={form.address}
                  onChange={onChange('address')}
                  placeholder="72 Ocean View Terrace"
                  className="input-field"
                />
              </Field>
              <Field label={t('checkout.city')}>
                <input
                  required
                  value={form.city}
                  onChange={onChange('city')}
                  placeholder="Cap d'Antibes"
                  className="input-field"
                />
              </Field>
              <Field label={t('checkout.state')}>
                <input
                  value={form.state}
                  onChange={onChange('state')}
                  placeholder="PACA"
                  className="input-field"
                />
              </Field>
              <Field label={t('checkout.zip')}>
                <input
                  required
                  value={form.zip}
                  onChange={onChange('zip')}
                  placeholder="06600"
                  className="input-field"
                />
              </Field>
            </div>

            <p className="text-[10px] font-medium uppercase tracking-widest text-navy-700 mb-3">
              {t('checkout.shippingMethodLabel')}
            </p>
            <div className="space-y-3">
              <ShippingOption
                id="standard"
                label={t('checkout.standardShipping')}
                detail={t('checkout.standardDetail')}
                price={subtotal >= 500 ? t('checkout.complimentary') : formatPrice(15)}
                selected={shippingMethod === 'standard'}
                onSelect={() => setShippingMethod('standard')}
              />
              <ShippingOption
                id="express"
                label={t('checkout.expressShipping')}
                detail={t('checkout.expressDetail')}
                price={formatPrice(25)}
                selected={shippingMethod === 'express'}
                onSelect={() => setShippingMethod('express')}
              />
            </div>
          </Section>

          <Section number="03" title={t('checkout.section3Title')}>
            <div className="border border-navy-200 p-5">
              <div className="flex items-center justify-between mb-5">
                <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-navy-800">
                  <CreditCard className="w-4 h-4" /> {t('checkout.creditCard')}
                </span>
                <div className="flex gap-1.5">
                  <span className="w-8 h-5 bg-navy-100" />
                  <span className="w-8 h-5 bg-navy-100" />
                  <span className="w-8 h-5 bg-navy-100" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                <Field label={t('checkout.cardNumber')} full>
                  <input
                    required
                    value={form.cardNumber}
                    onChange={onChange('cardNumber')}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="input-field"
                  />
                </Field>
                <Field label={t('checkout.expiryDate')}>
                  <input
                    required
                    value={form.expiry}
                    onChange={onChange('expiry')}
                    placeholder="MM / YY"
                    maxLength={7}
                    className="input-field"
                  />
                </Field>
                <Field label={t('checkout.cvv')}>
                  <input
                    required
                    value={form.cvv}
                    onChange={onChange('cvv')}
                    placeholder="123"
                    maxLength={4}
                    className="input-field"
                  />
                </Field>
              </div>
              <label className="flex items-center gap-2.5 mt-6 text-xs text-navy-600">
                <input type="checkbox" defaultChecked className="w-3.5 h-3.5 accent-navy-800" />
                {t('checkout.billingSameAsShipping')}
              </label>
            </div>
          </Section>

          {error && <p className="text-xs text-red-600 mb-4">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full sm:w-auto inline-flex items-center gap-2 disabled:opacity-60"
          >
            {submitting ? t('checkout.placingOrder') : t('checkout.purchaseBtn')}{' '}
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
          <p className="flex items-center gap-4 text-[11px] text-navy-400 mt-4">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> {t('checkout.secureCheckout')}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <PackageCheck className="w-3.5 h-3.5" /> {t('checkout.insuredDelivery')}
            </span>
          </p>
        </div>

        {/* Order summary */}
        <aside className="bg-sand-100 border border-navy-100 p-7 h-fit">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-navy-800">
              {t('checkout.orderSummary')}
            </h3>
            <span className="text-[11px] text-navy-400">{t('checkout.itemsLabel', { count: lines.length })}</span>
          </div>

          <div className="space-y-5 mb-6">
            {lines.map((line) => (
              <div key={line.id} className="flex gap-4">
                <div className="w-14 h-14 shrink-0">
                  <ProductMedia
                    tone={line.product.tone}
                    image={line.product.image}
                    alt={line.product.name}
                    className="w-full h-full"
                    iconClassName="w-5 h-5"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-navy-900 font-medium leading-snug">{line.product.name}</p>
                  <p className="text-[11px] text-navy-400 mt-0.5">Qty: {line.qty}</p>
                </div>
                <p className="text-sm text-navy-700">{formatPrice(line.product.price * line.qty)}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3 text-sm border-t border-navy-200 pt-5 mb-5">
            <div className="flex justify-between text-navy-600">
              <span>{t('checkout.subtotal')}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-navy-600">
              <span>{t('checkout.shipping')}</span>
              <span>{shipping === 0 ? t('checkout.complimentary') : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between text-navy-600">
              <span>{t('checkout.taxes')}</span>
              <span>{formatPrice(tax)}</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline border-t border-navy-200 pt-5 mb-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-navy-800">
              {t('checkout.total')}
            </span>
            <span className="font-serif text-2xl text-navy-900">{formatPrice(total)}</span>
          </div>

          <div className="bg-white border border-navy-100 p-4 mb-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-navy-700 mb-1">
              {t('checkout.memberPerk')}
            </p>
            <p className="text-xs italic text-navy-500">
              {t('checkout.memberPerkBody', { points: Math.round(total) })}
            </p>
          </div>
          <p className="text-[11px] text-navy-400 leading-relaxed">{t('checkout.dutyFreeNote')}</p>
        </aside>
      </form>
    </div>
  )
}

function Section({ number, title, children }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-6 h-6 flex items-center justify-center bg-navy-800 text-white text-[10px] font-semibold shrink-0">
          {number}
        </span>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-navy-900">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function Field({ label, full, children }) {
  return (
    <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
      <span className="block text-[10px] font-medium uppercase tracking-widest text-navy-400 mb-2">
        {label}
      </span>
      {children}
    </label>
  )
}

function ShippingOption({ id, label, detail, price, selected, onSelect }) {
  return (
    <label
      htmlFor={id}
      className={`flex items-center justify-between border px-4 py-3.5 cursor-pointer transition-colors ${
        selected ? 'border-navy-700 bg-navy-50' : 'border-navy-200'
      }`}
    >
      <span className="flex items-center gap-3">
        <input
          id={id}
          type="radio"
          name="shipping"
          checked={selected}
          onChange={onSelect}
          className="w-3.5 h-3.5 accent-navy-800"
        />
        <span>
          <span className="block text-xs font-medium text-navy-900">{label}</span>
          <span className="block text-[11px] text-navy-400">{detail}</span>
        </span>
      </span>
      <span className="text-xs text-navy-700">{price}</span>
    </label>
  )
}
