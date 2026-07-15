/**
 * Header — навигация и логотип
 * TODO: добавить мобильное меню, корзину, поиск
 */

const NAV_LINKS = [
  { label: 'Каталог',         href: '#catalog'  },
  { label: 'Интерьеры',       href: '#gallery'  },
  { label: 'О нас',           href: '#about'    },
  { label: 'Отзывы',          href: '#reviews'  },
  { label: 'Стать партнёром', href: '#partner'  },
  { label: 'Контакты',        href: '#contacts' },
]

export default function Header() {
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

        {/* Действия */}
        <div className="flex items-center gap-4">
          <button className="text-sm text-stone-600 hover:text-stone-900 transition-colors hidden sm:block">
            Поиск
          </button>
          <button className="btn-primary text-xs px-4 py-2">
            Корзина (0)
          </button>
        </div>

      </div>
    </header>
  )
}
