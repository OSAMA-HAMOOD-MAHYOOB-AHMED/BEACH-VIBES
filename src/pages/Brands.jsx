import { Link } from 'react-router-dom'
import { Droplet } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const COMING_SOON_COUNT = 4

export default function Brands() {
  const { t } = useLanguage()

  return (
    <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-16 sm:py-20">
      <div className="text-center mb-14">
        <p className="section-eyebrow justify-center flex">{t('brands.eyebrow')}</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-navy-900 mb-4">{t('brands.title')}</h1>
        <p className="text-sm text-navy-500 max-w-lg mx-auto leading-relaxed">{t('brands.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/shop"
          className="group border border-navy-800 bg-navy-800 text-white p-10 flex flex-col items-center justify-center text-center gap-4 hover:bg-navy-900 transition-colors"
        >
          <Droplet className="w-8 h-8" strokeWidth={1.25} />
          <div>
            <h2 className="font-serif text-xl mb-1.5">Beach Vibes</h2>
            <p className="text-xs text-white/70 uppercase tracking-widest">{t('brands.flagship')}</p>
          </div>
          <span className="text-[11px] font-medium uppercase tracking-widest border-b border-white/60 pb-1 group-hover:border-white transition-colors">
            {t('brands.shopBtn')}
          </span>
        </Link>

        {Array.from({ length: COMING_SOON_COUNT }).map((_, i) => (
          <div
            key={i}
            className="border border-dashed border-navy-200 p-10 flex flex-col items-center justify-center text-center gap-3 text-navy-300"
          >
            <div className="w-8 h-8 border border-navy-200 flex items-center justify-center text-xs font-serif">
              {i + 1}
            </div>
            <p className="text-xs uppercase tracking-widest">{t('brands.comingSoon')}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
