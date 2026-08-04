import { Link } from 'react-router-dom'
import { Leaf, Sparkles, Users } from 'lucide-react'
import { SceneMedia } from '../components/Media'
import Newsletter from '../components/Newsletter'
import { useLanguage } from '../context/LanguageContext'

const VALUE_ICONS = [Leaf, Sparkles, Users]

export default function About() {
  const { t } = useLanguage()
  const values = t('about.values')

  return (
    <div>
      <SceneMedia tone="hero" overlay="dark-left" className="w-full min-h-[420px] flex items-center px-5 sm:px-8">
        <div className="relative max-w-[1400px] mx-auto w-full">
          <p className="text-[11px] font-medium uppercase tracking-widest2 text-white/80 mb-4">
            {t('about.eyebrow')}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-white max-w-xl leading-tight">{t('about.title')}</h1>
        </div>
      </SceneMedia>

      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <SceneMedia tone="interior" className="w-full aspect-[4/5] sm:aspect-[5/4]" />
        <div>
          <p className="section-eyebrow">{t('about.foundedEyebrow')}</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-navy-900 mb-5 leading-tight">
            {t('about.storyTitle')}
          </h2>
          <p className="text-sm text-navy-500 leading-relaxed mb-4 max-w-md">{t('about.paragraph1')}</p>
          <p className="text-sm text-navy-500 leading-relaxed max-w-md">{t('about.paragraph2')}</p>
        </div>
      </section>

      <section className="bg-navy-900">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-20 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {values.map((v, i) => {
            const Icon = VALUE_ICONS[i]
            return (
              <div key={v.title} className="flex flex-col items-center">
                <Icon className="w-6 h-6 text-white/80 mb-4" strokeWidth={1.25} />
                <h3 className="text-sm font-semibold uppercase tracking-widest text-white mb-2.5">{v.title}</h3>
                <p className="text-sm text-white/60 max-w-[240px] leading-relaxed">{v.body}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-5 sm:px-8 py-20 text-center">
        <p className="font-serif italic text-xl sm:text-2xl text-navy-800 leading-relaxed mb-8">
          &ldquo;{t('about.quote')}&rdquo;
        </p>
        <Link to="/shop" className="btn-secondary">
          {t('about.exploreBtn')}
        </Link>
      </section>

      <Newsletter />
    </div>
  )
}
