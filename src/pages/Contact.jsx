import { useState } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import { api } from '../lib/api'
import { useLanguage } from '../context/LanguageContext'

export default function Contact() {
  const { t } = useLanguage()
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', message: '' })

  const onChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()

    setSubmitting(true)
    setError(false)
    try {
      await api.post('/api/contact', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        message: form.message,
      })
      setSent(true)
    } catch {
      setError(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-16">
      <div>
        <p className="section-eyebrow">{t('contact.eyebrow')}</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-navy-900 mb-6">{t('contact.title')}</h1>
        <p className="text-sm text-navy-500 leading-relaxed max-w-md mb-10">{t('contact.subtitle')}</p>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Mail className="w-4 h-4 text-navy-600 mt-1" strokeWidth={1.5} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-navy-800 mb-1">{t('contact.emailLabel')}</p>
              <p className="text-sm text-navy-500">hello@beachvibes.com</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Phone className="w-4 h-4 text-navy-600 mt-1" strokeWidth={1.5} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-navy-800 mb-1">{t('contact.phoneLabel')}</p>
              <p className="text-sm text-navy-500">+1 (415) 555-0148</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin className="w-4 h-4 text-navy-600 mt-1" strokeWidth={1.5} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-navy-800 mb-1">{t('contact.atelierLabel')}</p>
              <p className="text-sm text-navy-500">14 Promenade de la Plage, Antibes, France</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-sand-100 border border-navy-100 p-8 sm:p-10">
        {sent ? (
          <p className="text-sm text-navy-700">{t('contact.sentMessage')}</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <label className="block">
                <span className="block text-[10px] font-medium uppercase tracking-widest text-navy-400 mb-2">
                  {t('contact.formFirstName')}
                </span>
                <input
                  required
                  value={form.firstName}
                  onChange={onChange('firstName')}
                  className="input-field"
                />
              </label>
              <label className="block">
                <span className="block text-[10px] font-medium uppercase tracking-widest text-navy-400 mb-2">
                  {t('contact.formLastName')}
                </span>
                <input
                  required
                  value={form.lastName}
                  onChange={onChange('lastName')}
                  className="input-field"
                />
              </label>
            </div>
            <label className="block">
              <span className="block text-[10px] font-medium uppercase tracking-widest text-navy-400 mb-2">
                {t('contact.formEmail')}
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
                {t('contact.formMessage')}
              </span>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={onChange('message')}
                className="input-field resize-none"
              />
            </label>
            <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
              {submitting ? t('contact.sending') : t('contact.sendBtn')}
            </button>
            {error && <p className="text-xs text-navy-400">{t('contact.errorMessage')}</p>}
          </form>
        )}
      </div>
    </div>
  )
}
