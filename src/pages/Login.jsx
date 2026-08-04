import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export default function Login() {
  const { t } = useLanguage()
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await login(form.email, form.password)
      const fallback = user.role === 'admin' ? '/admin' : '/account'
      const dest = location.state?.from?.pathname || fallback
      navigate(dest, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-5 py-20">
      <h1 className="font-serif text-3xl text-navy-900 mb-2">{t('auth.loginTitle')}</h1>
      <p className="text-sm text-navy-500 mb-8">{t('auth.loginSubtitle')}</p>
      <form onSubmit={onSubmit} className="space-y-6">
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
        <label className="block">
          <span className="block text-[10px] font-medium uppercase tracking-widest text-navy-400 mb-2">
            {t('auth.password')}
          </span>
          <input
            required
            type="password"
            value={form.password}
            onChange={onChange('password')}
            className="input-field"
          />
        </label>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
          {submitting ? t('auth.loggingIn') : t('auth.loginBtn')}
        </button>
      </form>
      <p className="text-sm text-navy-500 mt-6">
        {t('auth.noAccount')}{' '}
        <Link to="/register" className="text-navy-800 underline">
          {t('auth.registerLink')}
        </Link>
      </p>
    </div>
  )
}
