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

  const fullName = user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : ''
  const initials =
    (user?.first_name?.[0] || user?.email?.[0] || '?').toUpperCase() + (user?.last_name?.[0] || '').toUpperCase()
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : '—'

  return (
    <div className="max-w-3xl mx-auto px-5 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-navy-800 text-white flex items-center justify-center font-serif text-lg shrink-0">
            {initials}
          </div>
          <div>
            <h1 className="font-serif text-3xl text-navy-900 mb-1">{t('account.title')}</h1>
            <p className="text-sm text-navy-500">{fullName || user?.email}</p>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-xs text-navy-800 underline mt-1 inline-block">
                {t('account.adminDashboard')}
              </Link>
            )}
          </div>
        </div>
        <button onClick={logout} className="btn-secondary">
          {t('account.logout')}
        </button>
      </div>

      <h2 className="text-xs font-semibold uppercase tracking-widest text-navy-800 mb-4">
        {t('account.profileDetails')}
      </h2>
      <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-5 border border-navy-100 p-6 mb-12">
        <div>
          <dt className="text-xs text-navy-400 uppercase tracking-widest mb-1">{t('account.fullName')}</dt>
          <dd className="text-sm text-navy-900">{fullName || '—'}</dd>
        </div>
        <div>
          <dt className="text-xs text-navy-400 uppercase tracking-widest mb-1">{t('account.emailLabel')}</dt>
          <dd className="text-sm text-navy-900">{user?.email}</dd>
        </div>
        <div>
          <dt className="text-xs text-navy-400 uppercase tracking-widest mb-1">{t('account.accountType')}</dt>
          <dd className="text-sm text-navy-900">
            {user?.role === 'admin' ? t('account.roleAdmin') : t('account.roleCustomer')}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-navy-400 uppercase tracking-widest mb-1">{t('account.memberSince')}</dt>
          <dd className="text-sm text-navy-900">{memberSince}</dd>
        </div>
        <div>
          <dt className="text-xs text-navy-400 uppercase tracking-widest mb-1">{t('account.totalOrders')}</dt>
          <dd className="text-sm text-navy-900">{loading ? '—' : orders.length}</dd>
        </div>
        <div>
          <dt className="text-xs text-navy-400 uppercase tracking-widest mb-1">{t('account.lifetimeSpent')}</dt>
          <dd className="text-sm text-navy-900">
            {loading ? '—' : formatPrice(orders.reduce((sum, o) => sum + Number(o.total), 0))}
          </dd>
        </div>
      </dl>

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
