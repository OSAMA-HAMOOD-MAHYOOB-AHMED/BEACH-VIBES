import { NavLink, Outlet } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

export default function AdminLayout() {
  const { t } = useLanguage()

  const links = [
    { to: '/admin/products', label: t('admin.nav.products') },
    { to: '/admin/orders', label: t('admin.nav.orders') },
    { to: '/admin/messages', label: t('admin.nav.messages') },
    { to: '/admin/users', label: t('admin.nav.users') },
  ]

  return (
    <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-10 grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-10">
      <aside>
        <h1 className="font-serif text-2xl text-navy-900 mb-6">{t('admin.title')}</h1>
        <nav className="flex flex-wrap lg:flex-col gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm px-3 py-2 transition-colors ${
                  isActive ? 'bg-navy-800 text-white' : 'text-navy-600 hover:bg-navy-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  )
}
