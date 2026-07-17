/**
 * HomePage — главная страница
 * Содержит Hero и навигационные карточки-превью разделов сайта.
 */

import { Link } from 'react-router-dom'
import Hero     from '../components/Hero'

const SECTIONS = [
  {
    to:          '/catalog',
    label:       'Каталог',
    description: 'Панели, рейки и вешалки для вашего интерьера',
    icon:        '🪵',
    accent:      'bg-stone-50 hover:bg-stone-100',
  },
  {
    to:          '/gallery',
    label:       'Интерьеры',
    description: 'Готовые решения и фото реализованных проектов',
    icon:        '🖼️',
    accent:      'bg-stone-50 hover:bg-stone-100',
  },
  {
    to:          '/reviews',
    label:       'Отзывы',
    description: 'Что говорят наши покупатели',
    icon:        '⭐',
    accent:      'bg-stone-50 hover:bg-stone-100',
  },
  {
    to:          '/partner',
    label:       'Стать партнёром',
    description: 'Оптовые закупки и условия сотрудничества',
    icon:        '🤝',
    accent:      'bg-primary-50 hover:bg-primary-100',
  },
]

export default function HomePage() {
  return (
    <main>
      {/* Hero занимает весь экран — отступ для шапки встроен */}
      <Hero />

      {/* Быстрые ссылки на разделы */}
      <section className="py-20 bg-white">
        <div className="container-site">
          <p className="section-label mb-2">Разделы сайта</p>
          <h2 className="section-title mb-10">Что вас интересует?</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SECTIONS.map(({ to, label, description, icon, accent }) => (
              <Link
                key={to}
                to={to}
                className={[
                  'group flex flex-col gap-3 p-6 border border-stone-100 transition-all duration-200',
                  accent,
                ].join(' ')}
              >
                <span className="text-3xl">{icon}</span>
                <div>
                  <h3 className="font-display text-lg text-stone-900 group-hover:text-primary-700 transition-colors">
                    {label}
                  </h3>
                  <p className="text-sm text-stone-500 mt-1 leading-relaxed">{description}</p>
                </div>
                <span className="text-primary-600 text-sm font-medium mt-auto">
                  Перейти →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
