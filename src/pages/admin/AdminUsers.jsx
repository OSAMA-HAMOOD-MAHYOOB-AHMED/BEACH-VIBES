import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { api } from '../../lib/api'

export default function AdminUsers() {
  const { t } = useLanguage()
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    api
      .get('/api/admin/users', { auth: true })
      .then((data) => setUsers(data.users))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const toggleRole = async (u) => {
    const nextRole = u.role === 'admin' ? 'customer' : 'admin'
    setUpdatingId(u.id)
    try {
      const { user } = await api.patch(`/api/admin/users/${u.id}/role`, { role: nextRole }, { auth: true })
      setUsers((prev) => prev.map((existing) => (existing.id === u.id ? user : existing)))
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) return <p className="text-sm text-navy-400">{t('account.loading')}</p>

  return (
    <div>
      <h2 className="text-lg font-serif text-navy-900 mb-6">{t('admin.nav.users')}</h2>
      {error && <p className="text-xs text-red-600 mb-4">{error}</p>}
      {users.length === 0 ? (
        <p className="text-sm text-navy-400">{t('admin.orders.empty')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-semibold uppercase tracking-widest text-navy-400 border-b border-navy-100">
                <th className="py-3 pr-4">{t('admin.users.name')}</th>
                <th className="py-3 pr-4">{t('admin.users.email')}</th>
                <th className="py-3 pr-4">{t('admin.users.role')}</th>
                <th className="py-3">{t('admin.users.joined')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {users.map((u) => {
                const isSelf = u.id === currentUser?.id
                return (
                  <tr key={u.id}>
                    <td className="py-3 pr-4 text-navy-900">
                      {[u.first_name, u.last_name].filter(Boolean).join(' ') || '—'}
                      {isSelf && <span className="text-navy-400"> ({t('admin.users.you')})</span>}
                    </td>
                    <td className="py-3 pr-4 text-navy-600">{u.email}</td>
                    <td className="py-3 pr-4">
                      <button
                        onClick={() => toggleRole(u)}
                        disabled={isSelf || updatingId === u.id}
                        className={`text-xs px-2.5 py-1 uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          u.role === 'admin'
                            ? 'bg-navy-800 text-white'
                            : 'border border-navy-200 text-navy-600 hover:border-navy-400'
                        }`}
                        title={isSelf ? t('admin.users.cannotChangeSelf') : undefined}
                      >
                        {u.role === 'admin' ? t('admin.users.makeCustomer') : t('admin.users.makeAdmin')}
                      </button>
                    </td>
                    <td className="py-3 text-navy-600">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
