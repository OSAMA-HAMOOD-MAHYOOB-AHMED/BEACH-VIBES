import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../lib/api'
import { useFormatPrice } from '../hooks/useFormatPrice'

export default function Account() {
  const { t } = useLanguage()
  const formatPrice = useFormatPrice()
  const { user, logout, updateProfile, changePassword, deleteAccount } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passwordError, setPasswordError] = useState('')
  const [passwordFieldsUnlocked, setPasswordFieldsUnlocked] = useState(false)

  const [deleting, setDeleting] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteSaving, setDeleteSaving] = useState(false)
  const [deleteError, setDeleteError] = useState('')

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

  const onChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const onPasswordChange = (key) => (e) => setPasswordForm((f) => ({ ...f, [key]: e.target.value }))

  const onStartEdit = () => {
    setForm({ firstName: user?.first_name || '', lastName: user?.last_name || '', email: user?.email || '' })
    setError('')
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setPasswordError('')
    setPasswordFieldsUnlocked(false)
    setDeleting(false)
    setDeletePassword('')
    setDeleteError('')
    setEditing(true)
  }

  const onCancelEdit = () => {
    setEditing(false)
    setError('')
    setPasswordError('')
    setDeleting(false)
    setDeleteError('')
  }

  const onSaveAll = async (e) => {
    e.preventDefault()
    setError('')
    setPasswordError('')

    const wantsPasswordChange = Boolean(
      passwordForm.currentPassword || passwordForm.newPassword || passwordForm.confirmPassword,
    )
    if (wantsPasswordChange) {
      if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
        setPasswordError(t('account.passwordFieldsRequired'))
        return
      }
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setPasswordError(t('account.passwordMismatch'))
        return
      }
    }

    setSaving(true)
    try {
      await updateProfile(form)
    } catch (err) {
      setError(err.message)
      setSaving(false)
      return
    }

    if (wantsPasswordChange) {
      try {
        await changePassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        })
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } catch (err) {
        setPasswordError(err.message)
        setSaving(false)
        return
      }
    }

    setSaving(false)
    setEditing(false)
  }

  const onStartDelete = () => {
    setDeletePassword('')
    setDeleteError('')
    setDeleting(true)
  }

  const onCancelDelete = () => {
    setDeleting(false)
    setDeleteError('')
  }

  const onConfirmDelete = async (e) => {
    e.preventDefault()
    setDeleteError('')
    setDeleteSaving(true)
    try {
      await deleteAccount(deletePassword)
      navigate('/', { replace: true })
    } catch (err) {
      setDeleteError(err.message)
      setDeleteSaving(false)
    }
  }

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

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-navy-800">
          {t('account.profileDetails')}
        </h2>
        {!editing && (
          <button onClick={onStartEdit} className="text-xs text-navy-800 underline">
            {t('account.editProfile')}
          </button>
        )}
      </div>

      {editing ? (
        <div className="border border-navy-100 p-6 mb-12 space-y-10">
          <form onSubmit={onSaveAll} className="space-y-10">
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-[10px] font-medium uppercase tracking-widest text-navy-400 mb-2">
                    {t('auth.firstName')}
                  </span>
                  <input value={form.firstName} onChange={onChange('firstName')} className="input-field" />
                </label>
                <label className="block">
                  <span className="block text-[10px] font-medium uppercase tracking-widest text-navy-400 mb-2">
                    {t('auth.lastName')}
                  </span>
                  <input value={form.lastName} onChange={onChange('lastName')} className="input-field" />
                </label>
              </div>
              <label className="block">
                <span className="block text-[10px] font-medium uppercase tracking-widest text-navy-400 mb-2">
                  {t('auth.email')}
                </span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={onChange('email')}
                  className="input-field"
                />
              </label>
              {error && <p className="text-xs text-red-600">{error}</p>}
            </div>

            <div className="pt-8 border-t border-navy-100">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-navy-800 mb-5">
                {t('account.changePassword')}
              </h3>
              <div className="space-y-5">
                <label className="block">
                  <span className="block text-[10px] font-medium uppercase tracking-widest text-navy-400 mb-2">
                    {t('account.currentPassword')}
                  </span>
                  <input
                    type="password"
                    autoComplete="new-password"
                    readOnly={!passwordFieldsUnlocked}
                    onFocus={() => setPasswordFieldsUnlocked(true)}
                    value={passwordForm.currentPassword}
                    onChange={onPasswordChange('currentPassword')}
                    className="input-field"
                  />
                </label>
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="block text-[10px] font-medium uppercase tracking-widest text-navy-400 mb-2">
                      {t('account.newPassword')}
                    </span>
                    <input
                      type="password"
                      autoComplete="new-password"
                      readOnly={!passwordFieldsUnlocked}
                      onFocus={() => setPasswordFieldsUnlocked(true)}
                      minLength={8}
                      value={passwordForm.newPassword}
                      onChange={onPasswordChange('newPassword')}
                      className="input-field"
                    />
                  </label>
                  <label className="block">
                    <span className="block text-[10px] font-medium uppercase tracking-widest text-navy-400 mb-2">
                      {t('account.confirmNewPassword')}
                    </span>
                    <input
                      type="password"
                      autoComplete="new-password"
                      readOnly={!passwordFieldsUnlocked}
                      onFocus={() => setPasswordFieldsUnlocked(true)}
                      minLength={8}
                      value={passwordForm.confirmPassword}
                      onChange={onPasswordChange('confirmPassword')}
                      className="input-field"
                    />
                  </label>
                </div>
                {passwordError && <p className="text-xs text-red-600">{passwordError}</p>}
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
                {saving ? t('account.saving') : t('account.saveChanges')}
              </button>
              <button type="button" onClick={onCancelEdit} className="btn-secondary">
                {t('account.cancel')}
              </button>
            </div>
          </form>

          <div className="pt-8 border-t border-red-200">
            <p className="text-sm text-navy-500 mb-5">{t('account.deleteAccountWarning')}</p>
            {deleting ? (
              <form onSubmit={onConfirmDelete} className="space-y-4">
                <label className="block max-w-xs">
                  <span className="block text-[10px] font-medium uppercase tracking-widest text-navy-400 mb-2">
                    {t('account.deleteAccountConfirmPrompt')}
                  </span>
                  <input
                    required
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="input-field"
                  />
                </label>
                {deleteError && <p className="text-xs text-red-600">{deleteError}</p>}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={deleteSaving}
                    className="inline-flex items-center justify-center gap-2 bg-red-700 text-white px-7 py-3.5 text-xs font-medium uppercase tracking-widest hover:bg-red-800 transition-colors disabled:opacity-60"
                  >
                    {deleteSaving ? t('account.deleting') : t('account.deleteAccountConfirmBtn')}
                  </button>
                  <button type="button" onClick={onCancelDelete} className="btn-secondary">
                    {t('account.cancel')}
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={onStartDelete}
                className="inline-flex items-center justify-center gap-2 bg-white text-red-700 border border-red-700 px-7 py-3.5 text-xs font-medium uppercase tracking-widest hover:bg-red-700 hover:text-white transition-colors"
              >
                {t('account.deleteAccountAction')}
              </button>
            )}
          </div>
        </div>
      ) : (
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
      )}

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
