/**
 * Hero — главный экран
 * Статистика загружается из /public/data/company.json через useCompany()
 */

import { Link }       from 'react-router-dom'
import { useCompany } from '../hooks/useCompany'

export default function Hero() {
  const { company } = useCompany()
  const stats = company?.stats ?? []

  return (
    <section id="about" className="relative pt-16 min-h-screen flex items-center bg-stone-50 overflow-hidden">

      {/* Фоновый паттерн */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #78716c 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container-site relative z-10 py-20 grid md:grid-cols-2 gap-12 items-center">

        {/* Текст */}
        <div className="space-y-6">
          <p className="section-label">Декоративные стеновые панели и вешалки</p>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-stone-900 leading-[1.05]">
            Пространство,<br />
            <em className="text-primary-600 not-italic">созданное</em><br />
            для вас
          </h1>

          <p className="text-stone-500 text-lg leading-relaxed max-w-md">
            Самоклеящиеся стеновые панели для быстрого и стильного обновления интерьера.
            Простой монтаж, высокое качество и современный дизайн.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/catalog" className="btn-primary">Смотреть каталог</Link>
            <Link to="/gallery"  className="btn-outline">Интерьеры</Link>
          </div>

          {/* Цифры из company.json */}
          {stats.length > 0 && (
            <div className="flex flex-wrap gap-10 pt-6 border-t border-stone-200">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <p className="font-display text-2xl text-stone-900">{value}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Изображение-заглушка */}
        <div className="relative aspect-[4/5] bg-stone-200 rounded-sm overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-stone-400 text-sm">
            [Главное фото — 800×1000px]
          </div>
        </div>

      </div>
    </section>
  )
}
