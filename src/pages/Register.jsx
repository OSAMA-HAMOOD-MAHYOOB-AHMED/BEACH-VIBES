import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export default function Register() {
  const { t } = useLanguage()
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register(form)
      navigate('/account', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-5 py-20">
      <h1 className="font-serif text-3xl text-navy-900 mb-2">{t('auth.registerTitle')}</h1>
      <p className="text-sm text-navy-500 mb-8">{t('auth.registerSubtitle')}</p>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
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
        <label className="block">
          <span className="block text-[10px] font-medium uppercase tracking-widest text-navy-400 mb-2">
            {t('auth.password')}
          </span>
          <input
            required
            type="password"
            minLength={8}
            value={form.password}
            onChange={onChange('password')}
            className="input-field"
          />
          <span className="block text-[11px] text-navy-400 mt-1.5">{t('auth.passwordHint')}</span>
        </label>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
          {submitting ? t('auth.registeringBtn') : t('auth.registerBtn')}
        </button>
      </form>
      <p className="text-sm text-navy-500 mt-6">
        {t('auth.haveAccount')}{' '}
        <Link to="/login" className="text-navy-800 underline">
          {t('auth.loginLink')}
        </Link>
      </p>
    </div>
  )
}
