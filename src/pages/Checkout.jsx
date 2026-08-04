import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CreditCard, Lock, PackageCheck, ChevronRight } from 'lucide-react'
import { ProductMedia } from '../components/Media'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/format'

const TAX_RATE = 0.08

export default function Checkout() {
  const { lines, subtotal, clearCart } = useCart()
  const navigate = useNavigate()

  const [shippingMethod, setShippingMethod] = useState('express')
  const [placed, setPlaced] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
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

  const onSubmit = (e) => {
    e.preventDefault()
    setPlaced(true)
    clearCart()
  }

  if (lines.length === 0 && !placed) {
    return (
      <div className="max-w-xl mx-auto px-5 py-24 text-center">
        <h1 className="font-serif text-3xl text-navy-900 mb-4">Your bag is empty</h1>
        <p className="text-sm text-navy-500 mb-8">
          Add a piece to your collection before checking out.
        </p>
        <Link to="/shop" className="btn-primary">
          Browse the Shop
        </Link>
      </div>
    )
  }

  if (placed) {
    return (
      <div className="max-w-xl mx-auto px-5 py-24 text-center">
        <PackageCheck className="w-10 h-10 text-navy-700 mx-auto mb-6" strokeWidth={1.25} />
        <h1 className="font-serif text-3xl sm:text-4xl text-navy-900 mb-4">
          Your Collection Is Confirmed
        </h1>
        <p className="text-sm text-navy-500 mb-2">
          Thank you, {form.firstName || 'valued collector'}. A confirmation has been sent to{' '}
          {form.email || 'your inbox'}.
        </p>
        <p className="text-sm text-navy-500 mb-10">
          Order total: <span className="text-navy-900 font-medium">{formatPrice(total)}</span>
        </p>
        <Link to="/shop" className="btn-primary">
          Continue Exploring
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-10">
      <nav className="text-[11px] text-navy-400 uppercase tracking-widest flex items-center gap-2 mb-6">
        <Link to="/cart" className="hover:text-navy-700">Cart</Link>
        <span>/</span>
        <span className="text-navy-700">Checkout</span>
      </nav>
      <h1 className="font-serif text-3xl sm:text-4xl text-navy-900 mb-1">Checkout</h1>
      <p className="text-sm text-navy-500 mb-10">
        Securely complete your luxury order with Aqua Atelier.
      </p>

      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-14">
        <div>
          <Section number="01" title="Customer Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <Field label="First Name">
                <input
                  required
                  value={form.firstName}
                  onChange={onChange('firstName')}
                  placeholder="Alexander"
                  className="input-field"
                />
              </Field>
              <Field label="Last Name">
                <input
                  required
                  value={form.lastName}
                  onChange={onChange('lastName')}
                  placeholder="Vance"
                  className="input-field"
                />
              </Field>
              <Field label="Email Address" full>
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

          <Section number="02" title="Shipping Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mb-8">
              <Field label="Address" full>
                <input
                  required
                  value={form.address}
                  onChange={onChange('address')}
                  placeholder="72 Ocean View Terrace"
                  className="input-field"
                />
              </Field>
              <Field label="City">
                <input
                  required
                  value={form.city}
                  onChange={onChange('city')}
                  placeholder="Cap d'Antibes"
                  className="input-field"
                />
              </Field>
              <Field label="State">
                <input
                  value={form.state}
                  onChange={onChange('state')}
                  placeholder="PACA"
                  className="input-field"
                />
              </Field>
              <Field label="Zip Code">
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
              Shipping Method
            </p>
            <div className="space-y-3">
              <ShippingOption
                id="standard"
                label="Standard Shipping"
                detail="5-7 Business Days"
                price={subtotal >= 500 ? 'Complimentary' : formatPrice(15)}
                selected={shippingMethod === 'standard'}
                onSelect={() => setShippingMethod('standard')}
              />
              <ShippingOption
                id="express"
                label="Express Atelier Delivery"
                detail="Next Day Delivery"
                price={formatPrice(25)}
                selected={shippingMethod === 'express'}
                onSelect={() => setShippingMethod('express')}
              />
            </div>
          </Section>

          <Section number="03" title="Payment Method">
            <div className="border border-navy-200 p-5">
              <div className="flex items-center justify-between mb-5">
                <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-navy-800">
                  <CreditCard className="w-4 h-4" /> Credit Card
                </span>
                <div className="flex gap-1.5">
                  <span className="w-8 h-5 bg-navy-100" />
                  <span className="w-8 h-5 bg-navy-100" />
                  <span className="w-8 h-5 bg-navy-100" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                <Field label="Card Number" full>
                  <input
                    required
                    value={form.cardNumber}
                    onChange={onChange('cardNumber')}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="input-field"
                  />
                </Field>
                <Field label="Expiry Date">
                  <input
                    required
                    value={form.expiry}
                    onChange={onChange('expiry')}
                    placeholder="MM / YY"
                    maxLength={7}
                    className="input-field"
                  />
                </Field>
                <Field label="CVV">
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
                Billing address is same as shipping address
              </label>
            </div>
          </Section>

          <button type="submit" className="btn-primary w-full sm:w-auto inline-flex items-center gap-2">
            Purchase Collection <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <p className="flex items-center gap-4 text-[11px] text-navy-400 mt-4">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Secure Checkout
            </span>
            <span className="inline-flex items-center gap-1.5">
              <PackageCheck className="w-3.5 h-3.5" /> Insured Delivery
            </span>
          </p>
        </div>

        {/* Order summary */}
        <aside className="bg-sand-100 border border-navy-100 p-7 h-fit">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-navy-800">
              Order Summary
            </h3>
            <span className="text-[11px] text-navy-400">{lines.length} items</span>
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
                  <p className="text-sm text-navy-900 font-medium leading-snug">
                    {line.product.name}
                  </p>
                  <p className="text-[11px] text-navy-400 mt-0.5">Qty: {line.qty}</p>
                </div>
                <p className="text-sm text-navy-700">
                  {formatPrice(line.product.price * line.qty)}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-3 text-sm border-t border-navy-200 pt-5 mb-5">
            <div className="flex justify-between text-navy-600">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-navy-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Complimentary' : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between text-navy-600">
              <span>Taxes</span>
              <span>{formatPrice(tax)}</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline border-t border-navy-200 pt-5 mb-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-navy-800">
              Total
            </span>
            <span className="font-serif text-2xl text-navy-900">{formatPrice(total)}</span>
          </div>

          <div className="bg-white border border-navy-100 p-4 mb-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-navy-700 mb-1">
              Member Perk
            </p>
            <p className="text-xs italic text-navy-500">
              You&apos;re earning {Math.round(total)} Atelier Points on this purchase.
            </p>
          </div>
          <p className="text-[11px] text-navy-400 leading-relaxed">
            Duty-free worldwide shipping is included for your region. Returns accepted within 14
            days of delivery.
          </p>
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
