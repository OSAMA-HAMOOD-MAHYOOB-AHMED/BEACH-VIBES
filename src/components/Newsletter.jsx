import { useState } from 'react'
import { Mail } from 'lucide-react'
import { SceneMedia } from './Media'
import { api } from '../lib/api'
import { useLanguage } from '../context/LanguageContext'

export default function Newsletter({ eyebrow, title, subtitle }) {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)

  const resolvedEyebrow = eyebrow ?? t('newsletter.defaultEyebrow')
  const resolvedTitle = title ?? t('newsletter.defaultTitle')
  const resolvedSubtitle = subtitle ?? t('newsletter.defaultSubtitle')

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    setSubmitting(true)
    setError(false)
    try {
      await api.post('/api/newsletter', { email })
      setSubmitted(true)
    } catch {
      setError(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="relative">
      <SceneMedia tone="invite" overlay="dark-full" className="w-full py-20 sm:py-24 px-5">
        <div className="relative max-w-xl mx-auto text-center">
          <p className="text-[11px] font-medium uppercase tracking-widest2 text-white/80 mb-3">
            {resolvedEyebrow}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-white mb-3">{resolvedTitle}</h2>
          <p className="text-sm text-white/85 mb-8 leading-relaxed">{resolvedSubtitle}</p>

          {submitted ? (
            <p className="text-sm text-white">{t('newsletter.success')}</p>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-navy-400 absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('newsletter.placeholder')}
                  className="w-full bg-white pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-3.5 text-sm text-ink placeholder:text-navy-300 focus:outline-none"
                />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary whitespace-nowrap disabled:opacity-60">
                {submitting ? t('newsletter.joining') : t('newsletter.join')}
              </button>
            </form>
          )}
          {error && <p className="text-xs text-white/80 mt-3">{t('newsletter.error')}</p>}
        </div>
      </SceneMedia>
    </section>
  )
}
