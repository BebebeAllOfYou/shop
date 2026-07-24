/**
 * InteriorGallery — галерея готовых интерьеров
 * Отображает все интерьеры, у которых есть путь к изображению в image
 */

import { useState, useMemo, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useGallery } from '../hooks/useGallery'

function GalleryCard({ item, onClick }) {
  if (!item) return null

  return (
    <div
      onClick={() => onClick && onClick(item)}
      className="group relative bg-stone-100 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200/80 aspect-[4/3]"
    >
      {/* Изображение интерьера */}
      {item.image ? (
        <img
          src={item.image}
          alt={item.title || item.style}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-stone-400 text-xs">
          [Фото интерьера]
        </div>
      )}

      {/* Оверлей с градиентом */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300" />

      {/* Иконка увеличения */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-75 bg-stone-900/60 backdrop-blur-md text-white p-2 rounded-full">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
        </svg>
      </div>

      {/* Информация о проекте */}
      <div className="absolute bottom-0 left-0 right-0 p-5 transform transition-transform duration-300">
        <span className="inline-block px-2.5 py-0.5 text-[10px] uppercase font-semibold tracking-wider bg-primary-600/90 text-white rounded mb-1.5 shadow-sm">
          {item.style || 'Интерьер'}
        </span>
        <h3 className="text-white font-display text-base md:text-lg leading-snug drop-shadow-sm">{item.title}</h3>
        {item.productName && (
          <p className="text-xs text-stone-300 opacity-90 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-400 inline-block"></span>
            {item.productName}
          </p>
        )}
      </div>
    </div>
  )
}

export default function InteriorGallery({ limit }) {
  const { gallery, loading } = useGallery()
  const location = useLocation()

  // Состояние фильтра категории
  const [selectedCategory, setSelectedCategory] = useState('Все')
  // Состояние полноэкранного лайтбокса
  const [lightboxIndex, setLightboxIndex] = useState(null)
  // Отображать ли все элементы, если установлен лимит
  const [showAllOverride, setShowAllOverride] = useState(false)

  // Фильтрация интерьеров: только имеющие непустое изображение
  const validGallery = useMemo(() => {
    return gallery.filter(item => item && item.image && String(item.image).trim() !== '')
  }, [gallery])

  // Категории для переключения
  const categories = useMemo(() => {
    const set = new Set(validGallery.map(i => i.category).filter(Boolean))
    return ['Все', ...Array.from(set)]
  }, [validGallery])

  // Итоговый отфильтрованный список интерьеров
  const filteredGallery = useMemo(() => {
    if (selectedCategory === 'Все') return validGallery
    return validGallery.filter(item => item.category === selectedCategory)
  }, [validGallery, selectedCategory])

  // Элементы для вывода (с учетом лимита, если есть)
  const displayItems = useMemo(() => {
    if (limit && !showAllOverride && selectedCategory === 'Все') {
      return filteredGallery.slice(0, limit)
    }
    return filteredGallery
  }, [filteredGallery, limit, showAllOverride, selectedCategory])

  // Обработчик нажатия на «Все проекты»
  const handleAllProjectsClick = () => {
    setSelectedCategory('Все')
    setShowAllOverride(true)
    // Плавный скролл к началу секции галереи
    const el = document.getElementById('gallery')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Навигация по лайтбоксу
  const prevLightboxImage = useCallback(() => {
    setLightboxIndex(curr => (curr > 0 ? curr - 1 : displayItems.length - 1))
  }, [displayItems.length])

  const nextLightboxImage = useCallback(() => {
    setLightboxIndex(curr => (curr < displayItems.length - 1 ? curr + 1 : 0))
  }, [displayItems.length])

  // Управление клавишами для лайтбокса
  useEffect(() => {
    if (lightboxIndex === null) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowLeft') prevLightboxImage()
      if (e.key === 'ArrowRight') nextLightboxImage()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [lightboxIndex, prevLightboxImage, nextLightboxImage])

  const activeLightboxItem = lightboxIndex !== null ? displayItems[lightboxIndex] : null

  return (
    <section id="gallery" className="py-16 md:py-24 bg-stone-50 min-h-[600px]">
      <div className="container-site">

        {/* Шапка секции */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-xl">
            <p className="section-label mb-2">Интерьеры</p>
            <h2 className="section-title">Готовые проекты наших клиентов</h2>
            <p className="text-stone-500 mt-3 leading-relaxed">
              Стеновые панели и вешалки в реальных интерьерах. Вдохновляйтесь готовыми дизайнерскими решениями
              и подбирайте идеальные комбинации для вашего дома.
            </p>
          </div>

          {/* Кнопка "Показать все проекты" вверху при выбранной категории */}
          {selectedCategory !== 'Все' && (
            <button
              onClick={handleAllProjectsClick}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors self-start md:self-auto"
            >
              ← Показать все проекты ({validGallery.length})
            </button>
          )}
        </div>

        {/* Фильтры категорий */}
        {categories.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-stone-200 pb-4">
            <span className="text-xs text-stone-400 font-medium mr-2 uppercase tracking-wider">Категории:</span>
            {categories.map(cat => {
              const count = cat === 'Все'
                ? validGallery.length
                : validGallery.filter(i => i.category === cat).length
              const isActive = selectedCategory === cat

              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat)
                    setShowAllOverride(true)
                  }}
                  className={`px-4 py-2 text-xs md:text-sm font-medium rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-md'
                      : 'bg-white text-stone-600 hover:bg-stone-200/70 border border-stone-200'
                  }`}
                >
                  {cat} <span className={`ml-1 text-[11px] ${isActive ? 'text-stone-300' : 'text-stone-400'}`}>({count})</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Загрузка */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400">
            <div className="w-10 h-10 border-4 border-stone-300 border-t-primary-600 rounded-full animate-spin mb-4" />
            <p className="text-sm">Загрузка проектов интерьеров...</p>
          </div>
        )}

        {/* Список проектов */}
        {!loading && displayItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayItems.map((item, idx) => (
              <GalleryCard
                key={item.id || idx}
                item={item}
                onClick={() => setLightboxIndex(idx)}
              />
            ))}
          </div>
        )}

        {/* Если ничего не найдено */}
        {!loading && displayItems.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center border border-stone-200 max-w-md mx-auto my-8">
            <p className="text-stone-400 text-4xl mb-3">🖼️</p>
            <h3 className="font-display text-lg text-stone-900 mb-2">Проекты не найдены</h3>
            <p className="text-stone-500 text-sm mb-6">В данной категории пока нет сохраненных фотографий.</p>
            <button onClick={handleAllProjectsClick} className="btn-primary">
              Сбросить фильтр
            </button>
          </div>
        )}

        {/* Кнопка "Все проекты" внизу */}
        {((limit && !showAllOverride && validGallery.length > limit) || location.pathname !== '/gallery') ? (
          <div className="mt-12 text-center">
            <Link
              to="/gallery"
              onClick={handleAllProjectsClick}
              className="btn-outline px-8 py-3.5 text-sm font-medium hover:bg-stone-900 hover:text-white transition-all shadow-sm inline-flex items-center gap-2"
            >
              <span>Все проекты</span>
              <span className="px-2 py-0.5 text-xs bg-stone-200/80 rounded-full text-stone-700 font-semibold">
                {validGallery.length}
              </span>
            </Link>
          </div>
        ) : (
          selectedCategory !== 'Все' && (
            <div className="mt-12 text-center">
              <button
                onClick={handleAllProjectsClick}
                className="btn-outline px-8 py-3.5 text-sm font-medium inline-flex items-center gap-2"
              >
                Показать все проекты ({validGallery.length})
              </button>
            </div>
          )
        )}

      </div>

      {/* Полноэкранный Lightbox для просмотра фото */}
      {lightboxIndex !== null && activeLightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex flex-col justify-between p-4 md:p-8 animate-[fadeIn_0.2s_ease]"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Шапка лайтбокса */}
          <div
            className="w-full max-w-6xl mx-auto flex items-center justify-between text-white z-10"
            onClick={e => e.stopPropagation()}
          >
            <div>
              <span className="text-xs text-primary-400 uppercase tracking-widest font-semibold">
                {activeLightboxItem.style || 'Интерьер'}
              </span>
              <h3 className="font-display text-xl md:text-2xl text-white mt-0.5">
                {activeLightboxItem.title}
              </h3>
              {activeLightboxItem.productName && (
                <p className="text-xs text-stone-400 mt-1">Товар: {activeLightboxItem.productName}</p>
              )}
            </div>

            <div className="flex items-center gap-6">
              <span className="text-xs text-stone-400 tracking-widest font-mono">
                {lightboxIndex + 1} / {displayItems.length}
              </span>

              <button
                onClick={() => setLightboxIndex(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition-colors"
                aria-label="Закрыть"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Изображение + Стрелки */}
          <div
            className="relative flex-1 w-full max-w-6xl mx-auto flex items-center justify-center my-4 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {displayItems.length > 1 && (
              <button
                onClick={prevLightboxImage}
                className="absolute left-2 md:left-4 z-20 w-12 h-12 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white flex items-center justify-center text-xl backdrop-blur-sm transition-all hover:scale-105 shadow-lg border border-white/10"
                aria-label="Предыдущее"
              >
                ←
              </button>
            )}

            <img
              src={activeLightboxItem.image}
              alt={activeLightboxItem.title}
              className="max-h-[80vh] max-w-full object-contain shadow-2xl rounded-lg"
            />

            {displayItems.length > 1 && (
              <button
                onClick={nextLightboxImage}
                className="absolute right-2 md:right-4 z-20 w-12 h-12 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white flex items-center justify-center text-xl backdrop-blur-sm transition-all hover:scale-105 shadow-lg border border-white/10"
                aria-label="Следующее"
              >
                →
              </button>
            )}
          </div>

          {/* Подсказка */}
          <div className="text-center text-xs text-stone-400 z-10">
            Используйте <kbd className="bg-stone-800 px-1.5 py-0.5 rounded text-stone-300">←</kbd> <kbd className="bg-stone-800 px-1.5 py-0.5 rounded text-stone-300">→</kbd> для навигации или <kbd className="bg-stone-800 px-1.5 py-0.5 rounded text-stone-300">Esc</kbd> для закрытия
          </div>
        </div>
      )}
    </section>
  )
}
