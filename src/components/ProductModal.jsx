/**
 * ProductModal — модальный предпросмотр товара
 *
 * Props:
 *   product  — объект товара (null = закрыто)
 *   onClose  — коллбек закрытия
 *
 * Содержимое:
 *   • Фото товара
 *   • Название, категория, цена
 *   • Описание и материалы
 *   • Мини-галерея интерьеров (первые 3 из GALLERY_ITEMS)
 *   • Кнопка «В корзину»
 */

import { useEffect, useCallback } from 'react'
import { useCartContext } from '../context/CartContext'

// Интерьерные фото для блока «В интерьере»
const GALLERY_ITEMS = [
  { id: 1, image: '/images/gallery/interior-01.jpg', style: 'Эко-модерн'          },
  { id: 2, image: '/images/gallery/interior-02.jpg', style: 'Световой минимализм' },
  { id: 3, image: '/images/gallery/interior-03.jpg', style: 'Мягкий лофт'         },
]

const fmt = n => Number(n).toLocaleString('ru-RU')

export default function ProductModal({ product, onClose }) {
  const { addToCart, items } = useCartContext()

  const inCart = product ? items.some(i => i.id === product.id) : false
  const qty    = product ? (items.find(i => i.id === product.id)?.qty ?? 0) : 0

  // Закрытие по Escape
  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (!product) return
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [product, handleKey])

  if (!product) return null

  const {
    name        = 'Товар',
    category    = '',
    price       = 0,
    oldPrice    = null,
    image       = null,
    badge       = null,
    description = '',
    materials   = [],
    inStock     = true,
  } = product

  function handleAdd() {
    if (!inStock) return
    addToCart(product)
  }

  return (
    <>
      {/* Оверлей */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm
                   animate-[fadeIn_0.2s_ease]"
      />

      {/* Само модальное окно */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={name}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto
                     pointer-events-auto shadow-2xl
                     animate-[slideUp_0.25s_ease]"
          onClick={e => e.stopPropagation()}
        >
          {/* Кнопка закрытия */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center
                       text-stone-400 hover:text-stone-900 hover:bg-stone-100
                       transition-colors text-2xl leading-none"
            aria-label="Закрыть"
          >×</button>

          <div className="grid md:grid-cols-2 gap-0">

            {/* ── Левая колонка: фото ── */}
            <div className="relative bg-stone-100 aspect-[3/4] md:aspect-auto md:min-h-[480px] overflow-hidden">
              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-stone-300 text-sm">
                  [Фото товара]
                </div>
              )}

              {/* Бейдж */}
              {badge && (
                <span className={[
                  'absolute top-4 left-4 text-white text-xs px-3 py-1.5 tracking-wide',
                  badge === 'Скидка' ? 'bg-red-500' : 'bg-primary-600',
                ].join(' ')}>
                  {badge}
                </span>
              )}
            </div>

            {/* ── Правая колонка: инфо ── */}
            <div className="flex flex-col p-7 gap-6">

              {/* Название + категория */}
              <div>
                <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">{category}</p>
                <h2 className="font-display text-2xl text-stone-900 leading-snug">{name}</h2>
              </div>

              {/* Цена */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl text-primary-600 font-medium">{fmt(price)} ₽</span>
                {oldPrice && (
                  <span className="text-stone-400 line-through text-sm">{fmt(oldPrice)} ₽</span>
                )}
              </div>

              {/* Описание */}
              {description && (
                <div>
                  <p className="text-xs text-stone-400 uppercase tracking-wide mb-2">Описание</p>
                  <p className="text-sm text-stone-600 leading-relaxed">{description}</p>
                </div>
              )}

              {/* Материалы */}
              {materials?.length > 0 && (
                <div>
                  <p className="text-xs text-stone-400 uppercase tracking-wide mb-2">Материал</p>
                  <div className="flex flex-wrap gap-2">
                    {materials.map(m => (
                      <span
                        key={m}
                        className="text-xs border border-stone-200 text-stone-600 px-3 py-1"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Мини-галерея интерьеров */}
              <div>
                <p className="text-xs text-stone-400 uppercase tracking-wide mb-2">В интерьере</p>
                <div className="grid grid-cols-3 gap-2">
                  {GALLERY_ITEMS.map(item => (
                    <div
                      key={item.id}
                      className="relative aspect-square bg-stone-100 overflow-hidden group"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.style}
                          className="absolute inset-0 w-full h-full object-cover
                                     transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-stone-300 text-xs">
                          фото
                        </div>
                      )}
                      <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/40 transition-colors" />
                      <p className="absolute bottom-1.5 left-1.5 right-1.5 text-white text-[10px]
                                    opacity-0 group-hover:opacity-100 transition-opacity leading-tight">
                        {item.style}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="mt-auto pt-2 flex flex-col gap-3">
                {inStock ? (
                  <button
                    onClick={handleAdd}
                    className="w-full btn-primary justify-center"
                  >
                    {inCart ? `✓ В корзине (${qty} шт.) — добавить ещё` : '+ В корзину'}
                  </button>
                ) : (
                  <button disabled className="w-full btn-primary justify-center opacity-40 cursor-not-allowed">
                    Нет в наличии
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="w-full btn-outline justify-center text-sm"
                >
                  Продолжить покупки
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
