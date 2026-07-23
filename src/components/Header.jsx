/**
 * Header — навигация с React Router
 * NavLink автоматически добавляет класс активного маршрута.
 */

import { NavLink } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Каталог',   to: '/catalog'  },
  { label: 'Интерьеры', to: '/gallery'  },
  { label: 'О нас',     to: '/about'    },
  { label: 'Отзывы',    to: '/reviews'  },
  //{ label: 'Стать партнёром', to: '/partner' },  //← раскомментируйте чтобы показать
  { label: 'Контакты',  to: '/contacts' },
]

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-100">
      <div className="container-site flex items-center justify-between h-16">

        {/* Логотип */}
        <NavLink to="/" className="font-display text-xl text-stone-900 tracking-tight">
          СТЕПАН<span className="text-primary-600">.</span>
        </NavLink>

        {/* Навигация (desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => [
                'text-sm transition-colors',
                isActive
                  ? 'text-stone-900 font-medium border-b-2 border-primary-600 pb-0.5'
                  : 'text-stone-600 hover:text-stone-900',
              ].join(' ')}
            >
              {label}
            </NavLink>
          ))}
        </nav>

      </div>
    </header>
  )
}
