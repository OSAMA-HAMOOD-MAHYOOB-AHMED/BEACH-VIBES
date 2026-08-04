import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, Sparkles, ShieldCheck, Globe2, Headset } from 'lucide-react'
import { SceneMedia } from '../components/Media'
import ProductCard from '../components/ProductCard'
import Newsletter from '../components/Newsletter'
import { useProducts } from '../context/ProductsContext'
import { useLanguage } from '../context/LanguageContext'

const CURATION_IDS = [
  'essence-of-azure',
  'artisanal-ceramic-vase',
  'midnight-silk-scarf',
  'heritage-leather-tote',
]

const PILLAR_ICONS = [ShieldCheck, Globe2, Headset]

export default function Home() {
  const { t } = useLanguage()
  const { products } = useProducts()
  const curated = CURATION_IDS.map((id) => products.find((p) => p.id === id)).filter(Boolean)
  const qualityPillars = t('home.qualityPillars')

  return (
    <div>
      {/* Hero */}
      <section className="relative">
        <SceneMedia
          tone="hero"
          overlay="dark-left"
          className="w-full min-h-[560px] sm:min-h-[640px] flex items-center px-5 sm:px-8"
        >
          <div className="relative max-w-[1400px] mx-auto w-full">
            <div className="max-w-xl">
              <p className="text-[11px] font-medium uppercase tracking-widest2 text-white/80 mb-4">
                {t('home.heroEyebrow')}
              </p>
              <h1 className="font-serif text-4xl sm:text-6xl leading-[1.1] text-white mb-5">
                {t('home.heroTitlePrefix')}{' '}
                <span className="italic font-normal">{t('home.heroTitleEmphasis')}</span>
                {t('home.heroTitleSuffix')}
              </h1>
              <p className="text-sm sm:text-base text-white/85 max-w-md mb-9 leading-relaxed">
                {t('home.heroSubtitle')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/collections" className="btn-primary">
                  {t('home.shopCollectionBtn')}
                </Link>
                <Link to="/about" className="btn-outline-light">
                  {t('home.ourStoryBtn')}
                </Link>
              </div>
            </div>
          </div>
        </SceneMedia>
      </section>

      {/* Summer Curations */}
      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 py-20 sm:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-eyebrow">{t('home.editEyebrow')}</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-navy-900">{t('home.summerCurationsTitle')}</h2>
          </div>
          <Link
            to="/collections"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-navy-700 hover:text-navy-900 transition-colors"
          >
            {t('home.viewAllObjects')} <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {curated.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Craftsmanship */}
      <section className="bg-sand-100 border-y border-navy-100">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-20 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <SceneMedia tone="beach" className="w-full aspect-[4/5] sm:aspect-[5/4]" />
          <div>
            <p className="section-eyebrow">{t('home.craftsmanshipEyebrow')}</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-navy-900 mb-5 leading-tight">
              {t('home.craftsmanshipTitle')}
            </h2>
            <p className="text-sm text-navy-500 leading-relaxed mb-8 max-w-md">
              {t('home.craftsmanshipBody')}
            </p>
            <div className="flex gap-10 mb-9">
              <div className="flex items-center gap-2.5">
                <Leaf className="w-5 h-5 text-navy-600" strokeWidth={1.5} />
                <span className="text-xs font-medium uppercase tracking-wide text-navy-700">
                  {t('home.sustainableLabel')}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-navy-600" strokeWidth={1.5} />
                <span className="text-xs font-medium uppercase tracking-wide text-navy-700">
                  {t('home.uniqueLabel')}
                </span>
              </div>
            </div>
            <Link to="/about" className="btn-secondary">
              {t('home.discoverProcessBtn')}
            </Link>
          </div>
        </div>
      </section>

      {/* Explore Collections */}
      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 py-20 sm:py-24 text-center">
        <p className="section-eyebrow justify-center flex">{t('home.exploreCollectionsEyebrow')}</p>
        <h2 className="font-serif text-3xl sm:text-4xl text-navy-900 mb-4">{t('home.curatedWayTitle')}</h2>
        <p className="text-sm text-navy-500 max-w-lg mx-auto mb-12 leading-relaxed">
          {t('home.curatedWaySubtitle')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left rtl:text-right">
          <Link to="/shop?category=Fragrance" className="group relative block overflow-hidden">
            <SceneMedia tone="dark" overlay="dark-bottom" className="w-full h-full min-h-[420px]">
              <div className="relative h-full flex flex-col justify-end p-8">
                <h3 className="font-serif text-2xl text-white mb-4">{t('home.fragranceBarTitle')}</h3>
                <span className="text-[11px] font-medium uppercase tracking-widest text-white border-b border-white/60 pb-1 w-fit group-hover:border-white transition-colors">
                  {t('home.exploreScents')}
                </span>
              </div>
            </SceneMedia>
          </Link>
          <div className="grid grid-rows-2 gap-6">
            <Link to="/shop?category=Footwear" className="group relative block overflow-hidden">
              <SceneMedia tone="coastal" overlay="dark-bottom" className="w-full h-full min-h-[192px]">
                <div className="relative h-full flex flex-col justify-end p-6">
                  <h3 className="font-serif text-xl text-white">{t('home.summerFootwearTitle')}</h3>
                </div>
              </SceneMedia>
            </Link>
            <Link to="/shop?category=Home Goods" className="group relative block overflow-hidden">
              <SceneMedia tone="interior" overlay="dark-bottom" className="w-full h-full min-h-[192px]">
                <div className="relative h-full flex flex-col justify-end p-6">
                  <h3 className="font-serif text-xl text-white">{t('home.coastalComfortTitle')}</h3>
                </div>
              </SceneMedia>
            </Link>
          </div>
        </div>
      </section>

      {/* Quality pillars */}
      <section className="bg-navy-900">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-16 sm:py-20 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {qualityPillars.map((pillar, i) => {
            const Icon = PILLAR_ICONS[i]
            return (
              <div key={pillar.title} className="flex flex-col items-center">
                <Icon className="w-6 h-6 text-white/80 mb-4" strokeWidth={1.25} />
                <h3 className="text-sm font-semibold uppercase tracking-widest text-white mb-2.5">
                  {pillar.title}
                </h3>
                <p className="text-sm text-white/60 max-w-[220px] leading-relaxed">{pillar.body}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Quote */}
      <section className="max-w-2xl mx-auto px-5 sm:px-8 py-20 sm:py-24 text-center">
        <p className="font-serif italic text-xl sm:text-2xl text-navy-800 leading-relaxed mb-6">
          &ldquo;{t('home.quote')}&rdquo;
        </p>
        <p className="text-[11px] font-medium uppercase tracking-widest text-navy-400">
          {t('home.quoteAttribution')}
        </p>
      </section>

      <Newsletter />
    </div>
  )
}
