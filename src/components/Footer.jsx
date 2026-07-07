/**
 * Footer — подвал сайта
 */

const FOOTER_NAV = {
  'Каталог': ['Вешалки', 'Деревянные рейки', 'Панели'],
  'Компания': ['О нас', 'Блог', 'Партнёрам'],
  'Покупателям': ['FAQ'],
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-stone-950 text-stone-400">

      {/* Основной блок */}
      <div className="container-site py-16 grid grid-cols-2 md:grid-cols-4 gap-10">

        {/* Лого + описание */}
        <div className="col-span-2 md:col-span-1 space-y-4">
          <a href="/" className="font-display text-xl text-white tracking-tight block">
            Forma<span className="text-primary-500">.</span>
          </a>
          <p className="text-sm leading-relaxed">
            Мебель из натурального дерева для тех, кто ценит качество и стиль.
          </p>
          {/* Соцсети */}
          <div className="flex gap-3 pt-2">
            {['VK', 'TG', 'YT'].map(sn => (
              <a
                key={sn}
                href="#"
                className="w-9 h-9 border border-stone-700 flex items-center justify-center
                           text-xs hover:border-primary-500 hover:text-primary-400 transition-colors"
              >
                {sn}
              </a>
            ))}
          </div>
        </div>

        {/* Навигационные колонки */}
        {Object.entries(FOOTER_NAV).map(([heading, links]) => (
          <nav key={heading}>
            <p className="text-white text-sm font-medium mb-4">{heading}</p>
            <ul className="space-y-2.5">
              {links.map(link => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}

      </div>

      {/* Нижняя строка */}
      <div className="border-t border-stone-800">
        <div className="container-site py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs">
          <p>© {year} Forma. Все права защищены.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-white transition-colors">Конфиденциальность</a>
            <a href="/terms"   className="hover:text-white transition-colors">Условия</a>
          </div>
        </div>
      </div>

    </footer>
  )
}
