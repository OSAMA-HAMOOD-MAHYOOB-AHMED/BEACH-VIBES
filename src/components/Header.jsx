import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Search, User, ShoppingBag, Menu, X, Droplet } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'

function LanguageSwitcher({ language, setLanguage, className = '' }) {
  return (
    <div className={`flex items-center border border-navy-200 text-[10px] font-semibold uppercase tracking-widest ${className}`}>
      <button
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`px-2.5 py-1.5 transition-colors ${
          language === 'en' ? 'bg-navy-800 text-white' : 'text-navy-600 hover:text-navy-900'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('ar')}
        aria-pressed={language === 'ar'}
        className={`px-2.5 py-1.5 transition-colors ${
          language === 'ar' ? 'bg-navy-800 text-white' : 'text-navy-600 hover:text-navy-900'
        }`}
      >
        AR
      </button>
    </div>
  )
}

export default function Header() {
  const { count } = useCart()
  const { t, language, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)

  const navLinks = [
    { to: '/shop?filter=new', label: t('header.nav.newArrivals') },
    { to: '/collections', label: t('header.nav.collections') },
    { to: '/shop', label: t('header.nav.artisanal') },
    { to: '/about', label: t('header.nav.about') },
  ]

  return (
    <header className="sticky top-0 z-40 bg-sand/95 backdrop-blur border-b border-navy-100">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-5 sm:px-8 h-16">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Droplet className="w-4 h-4 text-navy-800" strokeWidth={1.5} />
          <span className="font-serif text-sm sm:text-base tracking-widest2 uppercase text-navy-900">
            {t('header.brand')}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-[11px] font-medium uppercase tracking-widest text-navy-700 hover:text-navy-900 transition-colors ${
                  isActive ? 'text-navy-900' : ''
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4 sm:gap-5">
          <button aria-label={t('header.searchLabel')} className="text-navy-800 hover:text-navy-500 transition-colors">
            <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </button>
          <button aria-label={t('header.accountLabel')} className="text-navy-800 hover:text-navy-500 transition-colors hidden sm:block">
            <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </button>
          <Link to="/cart" aria-label={t('header.cartLabel')} className="relative text-navy-800 hover:text-navy-500 transition-colors">
            <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 rtl:right-auto rtl:-left-2 bg-navy-800 text-white text-[9px] leading-none rounded-full w-4 h-4 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <LanguageSwitcher language={language} setLanguage={setLanguage} className="hidden sm:flex" />
          <button
            aria-label={t('header.menuLabel')}
            className="md:hidden text-navy-800"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-navy-100 bg-sand px-5 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="text-xs font-medium uppercase tracking-widest text-navy-700"
            >
              {link.label}
            </NavLink>
          ))}
          <LanguageSwitcher language={language} setLanguage={setLanguage} className="w-fit" />
        </div>
      )}
    </header>
  )
}
