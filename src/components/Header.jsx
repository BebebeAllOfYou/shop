/**
 * Header — навигация и логотип
 */

import { useCartContext } from '../context/CartContext'

const NAV_LINKS = [
  { label: 'Каталог',         href: '#catalog'  },
  { label: 'Интерьеры',       href: '#gallery'  },
  { label: 'О нас',           href: '#about'    },
  { label: 'Отзывы',          href: '#reviews'  },
  { label: 'Стать партнёром', href: '#partner'  },
  { label: 'Контакты',        href: '#contacts' },
]

export default function Header() {
  const { totalItems, setIsOpen } = useCartContext()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-100">
      <div className="container-site flex items-center justify-between h-16">

        {/* Логотип */}
        <a href="/" className="font-display text-xl text-stone-900 tracking-tight">
          Forma<span className="text-primary-600">.</span>
        </a>

        {/* Навигация (desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Кнопка корзины */}
        <button
          id="cart-open-btn"
          onClick={() => setIsOpen(true)}
          className="relative flex items-center gap-2 text-sm text-stone-600
                     hover:text-stone-900 transition-colors"
          aria-label="Открыть корзину"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>

          <span className="hidden sm:inline">Корзина</span>

          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 sm:relative sm:top-0 sm:right-0
                             bg-primary-600 text-white text-xs w-5 h-5 rounded-full
                             flex items-center justify-center font-medium">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </button>

      </div>
    </header>
  )
}

