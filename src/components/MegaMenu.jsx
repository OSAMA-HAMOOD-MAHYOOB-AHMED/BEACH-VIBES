import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Waves, Shirt, Footprints, Glasses, Fish, Umbrella, ShoppingBag, ArrowRight } from 'lucide-react'
import { SceneMedia } from './Media'
import { useLanguage } from '../context/LanguageContext'

const CATEGORY_ICONS = {
  Swimwear: Waves,
  Beachwear: Shirt,
  Footwear: Footprints,
  'Swimming Equipment': Glasses,
  'Water Sports': Fish,
  'Beach Essentials': Umbrella,
  Accessories: ShoppingBag,
}

const MEGA_CATEGORIES = [
  'Swimwear',
  'Beachwear',
  'Footwear',
  'Swimming Equipment',
  'Water Sports',
  'Beach Essentials',
  'Accessories',
]

export default function MegaMenu() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        to="/shop"
        className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-widest text-navy-700 hover:text-navy-900 transition-colors"
        onFocus={() => setOpen(true)}
      >
        {t('header.nav.shop')}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </Link>

      {open && (
        <div className="absolute top-full left-1/2 rtl:left-auto rtl:right-1/2 -translate-x-1/2 rtl:translate-x-1/2 pt-4 w-[640px] max-w-[90vw]">
          <div className="bg-sand border border-navy-100 shadow-xl grid grid-cols-[1fr_260px]">
            <div className="grid grid-cols-2 gap-1 p-6">
              {MEGA_CATEGORIES.map((category) => {
                const Icon = CATEGORY_ICONS[category]
                return (
                  <Link
                    key={category}
                    to={`/shop?category=${encodeURIComponent(category)}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-navy-700 hover:bg-navy-50 hover:text-navy-900 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-navy-500 shrink-0" strokeWidth={1.5} />
                    {t(`categories.${category}`)}
                  </Link>
                )
              })}
              <Link
                to="/collections"
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5 px-3 py-2.5 mt-1 text-[11px] font-medium uppercase tracking-widest text-navy-800 border-t border-navy-100 col-span-2"
              >
                {t('header.nav.allCollections')} <ArrowRight className="w-3 h-3 rtl:rotate-180" />
              </Link>
            </div>
            <Link to="/shop?category=Water Sports" onClick={() => setOpen(false)} className="relative block group overflow-hidden">
              <SceneMedia tone="coastal" overlay="dark-bottom" className="w-full h-full min-h-[220px]">
                <div className="relative h-full flex flex-col justify-end p-5">
                  <p className="text-[10px] font-medium uppercase tracking-widest2 text-white/80 mb-1.5">
                    {t('header.megaMenu.promoEyebrow')}
                  </p>
                  <h4 className="font-serif text-lg text-white mb-2">{t('header.megaMenu.promoTitle')}</h4>
                  <span className="text-[10px] font-medium uppercase tracking-widest text-white border-b border-white/60 pb-0.5 w-fit group-hover:border-white transition-colors">
                    {t('header.megaMenu.promoCta')}
                  </span>
                </div>
              </SceneMedia>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
