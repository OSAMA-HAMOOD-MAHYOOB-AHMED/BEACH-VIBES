import { useEffect, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { api } from '../../lib/api'

const EMPTY_FORM = { currency: '', tier1: '', tier2: '', tier3: '' }

export default function AdminPriceRanges() {
  const { t } = useLanguage()
  const [ranges, setRanges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | currency code
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deletingCurrency, setDeletingCurrency] = useState(null)

  const load = () => {
    setLoading(true)
    api
      .get('/api/admin/price-ranges', { auth: true })
      .then((data) => setRanges(data.priceRanges))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const onChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const startCreate = () => {
    setForm(EMPTY_FORM)
    setEditing('new')
  }

  const startEdit = (r) => {
    setForm({ currency: r.currency, tier1: r.tier1, tier2: r.tier2, tier3: r.tier3 })
    setEditing(r.currency)
  }

  const cancelEdit = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const currency = form.currency.trim().toUpperCase()
    const [t1, t2, t3] = [Number(form.tier1), Number(form.tier2), Number(form.tier3)]

    if (!/^[A-Z]{3}$/.test(currency)) {
      setError(t('admin.priceRanges.invalidCurrency'))
      return
    }
    if (!(t1 > 0 && t1 < t2 && t2 < t3)) {
      setError(t('admin.priceRanges.invalidOrder'))
      return
    }

    setSaving(true)
    try {
      const { priceRange } = await api.put(
        `/api/admin/price-ranges/${currency}`,
        { tier1: t1, tier2: t2, tier3: t3 },
        { auth: true },
      )
      setRanges((prev) => {
        const others = prev.filter((r) => r.currency !== priceRange.currency)
        return [...others, priceRange].sort((a, b) => a.currency.localeCompare(b.currency))
      })
      cancelEdit()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (r) => {
    if (!window.confirm(t('admin.priceRanges.deleteConfirm', { currency: r.currency }))) return
    setError('')
    setDeletingCurrency(r.currency)
    try {
      await api.del(`/api/admin/price-ranges/${r.currency}`, undefined, { auth: true })
      setRanges((prev) => prev.filter((existing) => existing.currency !== r.currency))
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingCurrency(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-serif text-navy-900">{t('admin.priceRanges.title')}</h2>
        {editing === null && (
          <button onClick={startCreate} className="btn-secondary">
            {t('admin.priceRanges.addBtn')}
          </button>
        )}
      </div>

      <p className="text-xs text-navy-400 mb-6 max-w-xl">{t('admin.priceRanges.explainer')}</p>

      {error && <p className="text-xs text-red-600 mb-4">{error}</p>}

      {editing !== null && (
        <form onSubmit={onSubmit} className="border border-navy-100 bg-sand-100 p-6 mb-10 space-y-5">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-navy-800">
            {editing === 'new' ? t('admin.priceRanges.createTitle') : t('admin.priceRanges.editTitle')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            <Field label={t('admin.priceRanges.currency')}>
              <input
                required
                value={form.currency}
                onChange={onChange('currency')}
                disabled={editing !== 'new'}
                placeholder="SAR"
                maxLength={3}
                className="input-field uppercase disabled:opacity-60"
              />
            </Field>
            <Field label={t('admin.priceRanges.tier1')}>
              <input required type="number" min="0" step="0.01" value={form.tier1} onChange={onChange('tier1')} className="input-field" />
            </Field>
            <Field label={t('admin.priceRanges.tier2')}>
              <input required type="number" min="0" step="0.01" value={form.tier2} onChange={onChange('tier2')} className="input-field" />
            </Field>
            <Field label={t('admin.priceRanges.tier3')}>
              <input required type="number" min="0" step="0.01" value={form.tier3} onChange={onChange('tier3')} className="input-field" />
            </Field>
          </div>
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
      ) : ranges.length === 0 ? (
        <p className="text-sm text-navy-400">{t('admin.priceRanges.empty')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-semibold uppercase tracking-widest text-navy-400 border-b border-navy-100">
                <th className="py-3 pr-4">{t('admin.priceRanges.currency')}</th>
                <th className="py-3 pr-4">{t('admin.priceRanges.tier1')}</th>
                <th className="py-3 pr-4">{t('admin.priceRanges.tier2')}</th>
                <th className="py-3 pr-4">{t('admin.priceRanges.tier3')}</th>
                <th className="py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {ranges.map((r) => (
                <tr key={r.currency}>
                  <td className="py-3 pr-4 text-navy-900 font-medium">{r.currency}</td>
                  <td className="py-3 pr-4 text-navy-600">{r.tier1}</td>
                  <td className="py-3 pr-4 text-navy-600">{r.tier2}</td>
                  <td className="py-3 pr-4 text-navy-600">{r.tier3}</td>
                  <td className="py-3 text-right rtl:text-left">
                    <button onClick={() => startEdit(r)} className="text-xs text-navy-700 underline mr-4 rtl:mr-0 rtl:ml-4">
                      {t('admin.common.edit')}
                    </button>
                    <button
                      onClick={() => onDelete(r)}
                      disabled={deletingCurrency === r.currency}
                      className="text-xs text-red-600 underline disabled:opacity-60"
                    >
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
