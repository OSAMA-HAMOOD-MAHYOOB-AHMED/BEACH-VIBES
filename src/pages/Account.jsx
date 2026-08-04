import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../lib/api'
import { formatPrice } from '../utils/format'

export default function Account() {
  const { t } = useLanguage()
  const { user, logout } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    api
      .get('/api/orders', { auth: true })
      .then((data) => {
        if (!cancelled) setOrders(data.orders)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-5 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="font-serif text-3xl text-navy-900 mb-1">{t('account.title')}</h1>
          <p className="text-sm text-navy-500">
            {user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.email}
          </p>
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-xs text-navy-800 underline mt-1 inline-block">
              {t('account.adminDashboard')}
            </Link>
          )}
        </div>
        <button onClick={logout} className="btn-secondary">
          {t('account.logout')}
        </button>
      </div>

      <h2 className="text-xs font-semibold uppercase tracking-widest text-navy-800 mb-4">
        {t('account.orderHistory')}
      </h2>
      {loading ? (
        <p className="text-sm text-navy-400">{t('account.loading')}</p>
      ) : orders.length === 0 ? (
        <div>
          <p className="text-sm text-navy-400 mb-6">{t('account.noOrders')}</p>
          <Link to="/shop" className="btn-primary">
            {t('checkout.browseShop')}
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-navy-100">
          {orders.map((o) => (
            <div key={o.id} className="py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-navy-900 font-medium">#{o.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-xs text-navy-400">
                  {new Date(o.created_at).toLocaleDateString()} · {t(`orderStatus.${o.status}`)}
                </p>
              </div>
              <p className="text-sm text-navy-700">{formatPrice(o.total)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
