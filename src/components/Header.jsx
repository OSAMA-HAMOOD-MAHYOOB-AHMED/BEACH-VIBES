import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Search, User, ShoppingBag, Menu, X, Droplet } from 'lucide-react'
import { useCart } from '../context/CartContext'

const NAV_LINKS = [
  { to: '/shop?filter=new', label: 'New Arrivals' },
  { to: '/collections', label: 'Collections' },
  { to: '/shop', label: 'Artisanal' },
  { to: '/about', label: 'About' },
]

export default function Header() {
  const { count } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-sand/95 backdrop-blur border-b border-navy-100">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-5 sm:px-8 h-16">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Droplet className="w-4 h-4 text-navy-800" strokeWidth={1.5} />
          <span className="font-serif text-sm sm:text-base tracking-widest2 uppercase text-navy-900">
            Aqua Atelier
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
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
          <button aria-label="Search" className="text-navy-800 hover:text-navy-500 transition-colors">
            <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </button>
          <button aria-label="Account" className="text-navy-800 hover:text-navy-500 transition-colors hidden sm:block">
            <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </button>
          <Link to="/cart" aria-label="Shopping bag" className="relative text-navy-800 hover:text-navy-500 transition-colors">
            <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-navy-800 text-white text-[9px] leading-none rounded-full w-4 h-4 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button
            aria-label="Menu"
            className="md:hidden text-navy-800"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-navy-100 bg-sand px-5 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              onClick={() => setOpen(false)}
              className="text-xs font-medium uppercase tracking-widest text-navy-700"
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
