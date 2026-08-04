import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Twitter, Facebook, Droplet, Mail, Check } from 'lucide-react'
import { api } from '../lib/api'
import { useLanguage } from '../context/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle') // idle | submitting | done | error

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!email || state === 'submitting') return

    setState('submitting')
    try {
      await api.post('/api/newsletter', { email })
      setState('done')
    } catch {
      setState('error')
    }
  }

  return (
    <footer className="bg-sand-100 border-t border-navy-100">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-14 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <Droplet className="w-4 h-4 text-navy-800" strokeWidth={1.5} />
            <span className="font-serif text-sm tracking-widest2 uppercase text-navy-900">
              {t('footer.brand')}
            </span>
          </Link>
          <p className="text-sm text-navy-500 leading-relaxed max-w-xs">{t('footer.tagline')}</p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-navy-800 mb-4">
            {t('footer.exploreHeading')}
          </h4>
          <ul className="space-y-2.5 text-sm text-navy-500">
            <li><Link to="/collections" className="hover:text-navy-800 transition-colors">{t('footer.links.collections')}</Link></li>
            <li><Link to="/about" className="hover:text-navy-800 transition-colors">{t('footer.links.about')}</Link></li>
            <li><Link to="/journal" className="hover:text-navy-800 transition-colors">{t('footer.links.journal')}</Link></li>
            <li><Link to="/contact" className="hover:text-navy-800 transition-colors">{t('footer.links.contact')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-navy-800 mb-4">
            {t('footer.joinHeading')}
          </h4>
          <p className="text-sm text-navy-500 mb-4">{t('footer.joinSubtitle')}</p>
          {state === 'done' ? (
            <p className="flex items-center gap-2 text-sm text-navy-700">
              <Check className="w-4 h-4" /> {t('footer.subscribedMessage')}
            </p>
          ) : (
            <form
              onSubmit={onSubmit}
              className="flex items-center border-b border-navy-200 focus-within:border-navy-600 transition-colors"
            >
              <Mail className="w-4 h-4 text-navy-400 shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.emailPlaceholder')}
                className="flex-1 bg-transparent px-3 py-2 text-sm placeholder:text-navy-300 focus:outline-none"
              />
              <button
                type="submit"
                disabled={state === 'submitting'}
                className="text-[10px] font-semibold uppercase tracking-widest text-navy-800 border border-navy-800 px-4 py-2 hover:bg-navy-800 hover:text-white transition-colors shrink-0 disabled:opacity-60"
              >
                {state === 'submitting' ? t('footer.subscribing') : t('footer.subscribeButton')}
              </button>
            </form>
          )}
          {state === 'error' && (
            <p className="text-xs text-navy-400 mt-2">{t('footer.errorMessage')}</p>
          )}
        </div>
      </div>

      <div className="border-t border-navy-100">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-navy-400">{t('footer.copyright')}</p>
          <div className="flex items-center gap-4 text-navy-500">
            <a href="#" aria-label={t('footer.social.instagram')} className="hover:text-navy-800 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" aria-label={t('footer.social.twitter')} className="hover:text-navy-800 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" aria-label={t('footer.social.facebook')} className="hover:text-navy-800 transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
