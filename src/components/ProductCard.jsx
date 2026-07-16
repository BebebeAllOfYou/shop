/**
 * ProductCard — карточка товара
 *
 * Props:
 *   product: объект из products.json (включая wildberriesLink)
 */

import { useState } from 'react'
import { useCartContext } from '../context/CartContext'

export default function ProductCard({ product = {} }) {
  const {
    name      = 'Название товара',
    category  = 'Категория',
    price     = 0,
    oldPrice  = null,
    image     = null,
    badge     = null,
    wildberriesLink = null,
    inStock   = true,
  } = product

  const { addToCart, items } = useCartContext()
  const [added, setAdded]    = useState(false)

  const inCart = items.some(i => i.id === product.id)

  function handleAdd(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!inStock) return
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const fmt = n => n.toLocaleString('ru-RU')

  const PhotoContent = (
    <>
      {image ? (
        <img src={image} alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-stone-300 text-sm">
          [Фото товара]
        </div>
      )}

      {/* Бейдж */}
      {badge && (
        <span className={[
          'absolute top-3 left-3 text-white text-xs px-2 py-1 tracking-wide',
          badge === 'Скидка' ? 'bg-red-500' : 'bg-primary-600',
        ].join(' ')}>
          {badge}
        </span>
      )}

      {/* Нет в наличии */}
      {!inStock && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
          <span className="text-xs tracking-widest uppercase text-stone-500 bg-white px-3 py-1 border border-stone-200">
            Нет в наличии
          </span>
        </div>
      )}

      {/* Кнопка «В корзину» — появляется при наведении */}
      {inStock && (
        <button
          onClick={handleAdd}
          className={[
            'absolute bottom-3 left-3 right-3 py-2 text-xs tracking-wide uppercase',
            'transition-all duration-200 font-medium',
            added
              ? 'bg-green-600 text-white opacity-100'
              : inCart
              ? 'bg-stone-900 text-white opacity-0 group-hover:opacity-100'
              : 'bg-white text-stone-900 border border-stone-200 opacity-0 group-hover:opacity-100 hover:bg-stone-900 hover:text-white hover:border-stone-900',
          ].join(' ')}
        >
          {added ? '✓ Добавлено' : inCart ? `В корзине (${items.find(i => i.id === product.id)?.qty})` : '+ В корзину'}
        </button>
      )}
    </>
  )

  return (
    <article className="group relative flex flex-col bg-white">

      {/* Фото — кликабельно, если есть ссылка на Wildberries */}
      {wildberriesLink ? (
        <a
          href={wildberriesLink}
          target="_blank"
          rel="noopener noreferrer"
          className="relative aspect-[3/4] bg-stone-100 overflow-hidden block"
        >
          {PhotoContent}
        </a>
      ) : (
        <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
          {PhotoContent}
        </div>
      )}

      {/* Инфо */}
      <div className="pt-4 pb-2 flex flex-col gap-1">
        <p className="text-xs text-stone-400 tracking-wide uppercase">{category}</p>
        <h3 className="font-display text-stone-900 leading-snug">{name}</h3>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-primary-600 font-medium">{fmt(price)} ₽</p>
          {oldPrice && (
            <p className="text-xs text-stone-400 line-through">{fmt(oldPrice)} ₽</p>
          )}
        </div>
      </div>

    </article>
  )
}
