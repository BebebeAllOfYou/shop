/**
 * ProductGrid — сетка товаров с фильтром, сортировкой и «Показать ещё»
 * Данные загружаются из /public/data/products.json и categories.json через useProducts()
 */

import { useProducts } from '../hooks/useProducts'
import ProductCard from './ProductCard'

const SORT_OPTIONS = [
  { value: 'default',    label: 'По умолчанию'  },
  { value: 'price-asc',  label: 'Цена: дешевле' },
  { value: 'price-desc', label: 'Цена: дороже'  },
  { value: 'new',        label: 'Сначала новинки' },
]

// Скелетон-заглушка во время загрузки
function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="aspect-[3/4] bg-stone-100 rounded-sm" />
      <div className="h-3 w-1/3 bg-stone-100 rounded" />
      <div className="h-4 w-2/3 bg-stone-100 rounded" />
      <div className="h-4 w-1/4 bg-stone-100 rounded" />
    </div>
  )
}

export default function ProductGrid() {
  const {
    products,
    categories,
    loading,
    error,
    activeCategory,
    setActiveCategory,
    sort,
    setSort,
    showMore,
    hasMore,
    totalFiltered,
  } = useProducts()

  return (
    <section id="catalog" className="py-20 bg-white">
      <div className="container-site">

        {/* Заголовок + сортировка */}
        <div className="mb-10">
          <p className="section-label mb-2">Каталог</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="section-title">Наши коллекции</h2>

            {/* Сортировка */}
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="text-sm border border-stone-200 px-3 py-2 text-stone-600
                         focus:outline-none focus:border-stone-800 bg-white transition-colors
                         cursor-pointer self-start sm:self-auto"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Фильтр категорий из JSON */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={[
                'px-4 py-1.5 text-xs tracking-wide border transition-colors',
                activeCategory === cat.id
                  ? 'border-stone-900 bg-stone-900 text-white'
                  : 'border-stone-200 text-stone-500 hover:border-stone-800 hover:text-stone-900',
              ].join(' ')}
            >
              {cat.label}
              <span className="ml-1.5 opacity-50">{cat.count}</span>
            </button>
          ))}
        </div>

        {/* Ошибка загрузки */}
        {error && (
          <div className="py-16 text-center">
            <p className="text-stone-400 text-sm">Не удалось загрузить товары.</p>
            <p className="text-stone-300 text-xs mt-1">{error}</p>
          </div>
        )}

        {/* Сетка */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={p => console.log('В корзину:', p.name)}
                />
              ))
          }
        </div>

        {/* Пустой результат после фильтрации */}
        {!loading && !error && products.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-stone-400">В этой категории пока нет товаров.</p>
          </div>
        )}

        {/* Счётчик + «Показать ещё» */}
        {!loading && products.length > 0 && (
          <div className="mt-12 flex flex-col items-center gap-3">
            <p className="text-xs text-stone-400">
              Показано {products.length} из {totalFiltered}
            </p>
            {hasMore && (
              <button onClick={showMore} className="btn-outline">
                Показать ещё
              </button>
            )}
          </div>
        )}

      </div>
    </section>
  )
}
