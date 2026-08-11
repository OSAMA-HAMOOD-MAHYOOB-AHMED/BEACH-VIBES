import { useEffect, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { api } from '../../lib/api'
import { CATEGORIES, MATERIALS } from '../../data/products'
import { formatPrice } from '../../utils/format'

const TONES = ['swimwear', 'beachwear', 'suncare', 'beachgear', 'swimequipment', 'watersports', 'footwear', 'accessories']

const EMPTY_FORM = {
  id: '',
  name: '',
  name_ar: '',
  category: CATEGORIES[0],
  material: MATERIALS[0],
  tone: TONES[0],
  brand: 'Beach Vibes',
  price: '',
  compareAtPrice: '',
  image: '',
  rating: '',
  reviews: '',
  is_new: false,
  is_signature: false,
  description: '',
  description_ar: '',
}

function toFormState(product) {
  return {
    id: product.id,
    name: product.name || '',
    name_ar: product.name_ar || '',
    category: product.category,
    material: product.material,
    tone: product.tone,
    brand: product.brand || 'Beach Vibes',
    price: product.price,
    compareAtPrice: product.compareAtPrice ?? '',
    image: product.image || '',
    rating: product.rating ?? '',
    reviews: product.reviews ?? '',
    is_new: !!product.isNew,
    is_signature: !!product.isSignature,
    description: product.description || '',
    description_ar: product.description_ar || '',
  }
}

export default function AdminProducts() {
  const { t } = useLanguage()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | product id
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    api
      .get('/api/products')
      .then((data) => setProducts(data.products))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const startCreate = () => {
    setForm(EMPTY_FORM)
    setEditing('new')
  }

  const startEdit = (product) => {
    setForm(toFormState(product))
    setEditing(product.id)
  }

  const cancelEdit = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
  }

  const onChange = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [key]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        name: form.name,
        name_ar: form.name_ar || null,
        category: form.category,
        material: form.material,
        tone: form.tone,
        brand: form.brand || 'Beach Vibes',
        price: Number(form.price),
        compare_at_price: form.compareAtPrice === '' ? null : Number(form.compareAtPrice),
        image: form.image || null,
        rating: form.rating === '' ? null : Number(form.rating),
        reviews: form.reviews === '' ? 0 : Number(form.reviews),
        is_new: form.is_new,
        is_signature: form.is_signature,
        description: form.description || null,
        description_ar: form.description_ar || null,
      }

      if (editing === 'new') {
        const { product } = await api.post('/api/admin/products', { ...payload, id: form.id || undefined }, { auth: true })
        setProducts((prev) => [product, ...prev])
      } else {
        const { product } = await api.put(`/api/admin/products/${editing}`, payload, { auth: true })
        setProducts((prev) => prev.map((p) => (p.id === editing ? product : p)))
      }
      cancelEdit()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (product) => {
    if (!window.confirm(t('admin.products.deleteConfirm'))) return
    setError('')
    try {
      await api.del(`/api/admin/products/${product.id}`, undefined, { auth: true })
      setProducts((prev) => prev.filter((p) => p.id !== product.id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-serif text-navy-900">{t('admin.products.title')}</h2>
        {editing === null && (
          <button onClick={startCreate} className="btn-secondary">
            {t('admin.products.addBtn')}
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-600 mb-4">{error}</p>}

      {editing !== null && (
        <form onSubmit={onSubmit} className="border border-navy-100 bg-sand-100 p-6 mb-10 space-y-5">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-navy-800">
            {editing === 'new' ? t('admin.products.createTitle') : t('admin.products.editTitle')}
          </h3>

          {editing === 'new' && (
            <Field label={t('admin.products.idHint')}>
              <input
                value={form.id}
                onChange={onChange('id')}
                placeholder="auto-generated-from-name"
                className="input-field"
              />
            </Field>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label={t('admin.products.name')}>
              <input required value={form.name} onChange={onChange('name')} className="input-field" />
            </Field>
            <Field label={t('admin.products.nameAr')}>
              <input value={form.name_ar} onChange={onChange('name_ar')} dir="rtl" className="input-field" />
            </Field>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            <Field label={t('admin.products.category')}>
              <select value={form.category} onChange={onChange('category')} className="input-field">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t('admin.products.material')}>
              <select value={form.material} onChange={onChange('material')} className="input-field">
                {MATERIALS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t('admin.products.tone')}>
              <select value={form.tone} onChange={onChange('tone')} className="input-field">
                {TONES.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t('admin.products.price')}>
              <input required type="number" min="0" step="0.01" value={form.price} onChange={onChange('price')} className="input-field" />
            </Field>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            <Field label={t('admin.products.brand')}>
              <input value={form.brand} onChange={onChange('brand')} className="input-field" />
            </Field>
            <Field label={t('admin.products.compareAtPrice')}>
              <input type="number" min="0" step="0.01" value={form.compareAtPrice} onChange={onChange('compareAtPrice')} className="input-field" />
            </Field>
            <Field label={t('admin.products.rating')}>
              <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={onChange('rating')} className="input-field" />
            </Field>
            <Field label={t('admin.products.reviews')}>
              <input type="number" min="0" step="1" value={form.reviews} onChange={onChange('reviews')} className="input-field" />
            </Field>
            <label className="flex items-center gap-2 text-sm text-navy-700 self-end pb-2.5">
              <input type="checkbox" checked={form.is_new} onChange={onChange('is_new')} className="w-3.5 h-3.5 accent-navy-800" />
              {t('admin.products.isNew')}
            </label>
            <label className="flex items-center gap-2 text-sm text-navy-700 self-end pb-2.5">
              <input type="checkbox" checked={form.is_signature} onChange={onChange('is_signature')} className="w-3.5 h-3.5 accent-navy-800" />
              {t('admin.products.isSignature')}
            </label>
          </div>

          <Field label={t('admin.products.image')}>
            <input value={form.image} onChange={onChange('image')} placeholder="/images/products/example.jpg" className="input-field" />
          </Field>

          <Field label={t('admin.products.description')}>
            <textarea rows={3} value={form.description} onChange={onChange('description')} className="input-field resize-none" />
          </Field>
          <Field label={t('admin.products.descriptionAr')}>
            <textarea rows={3} dir="rtl" value={form.description_ar} onChange={onChange('description_ar')} className="input-field resize-none" />
          </Field>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
              {t('admin.common.save')}
            </button>
            <button type="button" onClick={cancelEdit} className="btn-secondary">
              {t('admin.common.cancel')}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-navy-400">{t('account.loading')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-semibold uppercase tracking-widest text-navy-400 border-b border-navy-100">
                <th className="py-3 pr-4">{t('admin.products.name')}</th>
                <th className="py-3 pr-4">{t('admin.products.category')}</th>
                <th className="py-3 pr-4">{t('admin.products.price')}</th>
                <th className="py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="py-3 pr-4 text-navy-900 font-medium">{p.name}</td>
                  <td className="py-3 pr-4 text-navy-600">{p.category}</td>
                  <td className="py-3 pr-4 text-navy-600">{formatPrice(p.price)}</td>
                  <td className="py-3 text-right rtl:text-left">
                    <button onClick={() => startEdit(p)} className="text-xs text-navy-700 underline mr-4 rtl:mr-0 rtl:ml-4">
                      {t('admin.common.edit')}
                    </button>
                    <button onClick={() => onDelete(p)} className="text-xs text-red-600 underline">
                      {t('admin.common.delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-medium uppercase tracking-widest text-navy-400 mb-2">{label}</span>
      {children}
    </label>
  )
}
