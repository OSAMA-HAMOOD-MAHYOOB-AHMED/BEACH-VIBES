import { useEffect, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { api } from '../../lib/api'
import { formatPrice } from '../../utils/format'

const STATUSES = ['pending', 'paid', 'shipped', 'cancelled']

export default function AdminOrders() {
  const { t } = useLanguage()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const load = () => {
    setLoading(true)
    api
      .get('/api/admin/orders', { auth: true })
      .then((data) => setOrders(data.orders))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const updateStatus = async (id, status) => {
    setUpdatingId(id)
    try {
      const { order } = await api.patch(`/api/admin/orders/${id}`, { status }, { auth: true })
      setOrders((prev) => prev.map((o) => (o.id === id ? order : o)))
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div>
      <h2 className="text-lg font-serif text-navy-900 mb-6">{t('admin.orders.title')}</h2>
      {error && <p className="text-xs text-red-600 mb-4">{error}</p>}
      {loading ? (
        <p className="text-sm text-navy-400">{t('account.loading')}</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-navy-400">{t('admin.orders.empty')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-semibold uppercase tracking-widest text-navy-400 border-b border-navy-100">
                <th className="py-3 pr-4">{t('admin.orders.orderId')}</th>
                <th className="py-3 pr-4">{t('admin.orders.customer')}</th>
                <th className="py-3 pr-4">{t('admin.orders.date')}</th>
                <th className="py-3 pr-4">{t('admin.orders.total')}</th>
                <th className="py-3">{t('admin.orders.status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="py-3 pr-4 font-medium text-navy-900">#{o.id.slice(0, 8).toUpperCase()}</td>
                  <td className="py-3 pr-4 text-navy-600">{o.email}</td>
                  <td className="py-3 pr-4 text-navy-600">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="py-3 pr-4 text-navy-600">{formatPrice(o.total)}</td>
                  <td className="py-3">
                    <select
                      value={o.status}
                      disabled={updatingId === o.id}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="border border-navy-200 px-2 py-1.5 text-xs bg-white focus:outline-none focus:border-navy-400 disabled:opacity-60"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {t(`orderStatus.${s}`)}
                        </option>
                      ))}
                    </select>
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
