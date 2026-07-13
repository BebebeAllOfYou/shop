/**
 * useProducts — загрузка товаров и категорий + фильтрация + сортировка
 *
 * Цены подгружаются из Google Таблицы через useSheetsPrices().
 * Если URL не задан или Google API недоступен — используются цены из products.json.
 *
 * Использование:
 *   const {
 *     products, categories,
 *     loading, error,
 *     activeCategory, setActiveCategory,
 *     sort, setSort,
 *     visibleCount, showMore, hasMore,
 *   } = useProducts()
 */

import { useState, useMemo } from 'react'
import { useFetch }          from './useFetch'
import { useSheetsPrices }   from './useSheetsPrices'

const PAGE_SIZE = 8

export function useProducts() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [sort,           setSort]           = useState('default')
  const [visibleCount,   setVisibleCount]   = useState(PAGE_SIZE)

  const { data: productsData, loading: loadingP, error: errorP } = useFetch('/data/products.json')
  const { data: categoriesData                                  } = useFetch('/data/categories.json')

  // Цены из Google Таблицы (при пустом URL — не запрашиваются)
  const { pricesMap, loading: loadingPrices } = useSheetsPrices()

  // Применяем цены из Google Sheets поверх локальных данных.
  // Если товар не найден в pricesMap — остаются цены из products.json.
  const allProducts = useMemo(() => {
    const base = productsData?.products ?? []
    if (!Object.keys(pricesMap).length) return base
    return base.map(p => {
      const sheetsPrice = pricesMap[p.id]
      if (!sheetsPrice) return p
      return {
        ...p,
        price:    sheetsPrice.price,
        oldPrice: sheetsPrice.oldPrice,
      }
    })
  }, [productsData, pricesMap])

  const categories = categoriesData?.categories ?? []

  // 1. Фильтрация по категории
  const filtered = useMemo(() => {
    if (activeCategory === 'all') return allProducts
    return allProducts.filter(p => p.category === activeCategory)
  }, [allProducts, activeCategory])

  // 2. Сортировка
  const sorted = useMemo(() => {
    const arr = [...filtered]
    if (sort === 'price-asc')  return arr.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') return arr.sort((a, b) => b.price - a.price)
    if (sort === 'new')        return arr.sort((a, b) => (b.badge === 'Новинка') - (a.badge === 'Новинка'))
    return arr // 'default' — порядок из JSON
  }, [filtered, sort])

  // 3. Пагинация («Показать ещё»)
  const products = useMemo(() => sorted.slice(0, visibleCount), [sorted, visibleCount])
  const hasMore  = visibleCount < sorted.length
  const showMore = () => setVisibleCount(n => n + PAGE_SIZE)

  // Сбрасываем страницу при смене фильтра/сортировки
  const handleSetCategory = (cat) => { setActiveCategory(cat); setVisibleCount(PAGE_SIZE) }
  const handleSetSort     = (s)   => { setSort(s);             setVisibleCount(PAGE_SIZE) }

  return {
    products,
    categories,
    loading: loadingP || loadingPrices,
    error:   errorP,
    activeCategory,
    setActiveCategory: handleSetCategory,
    sort,
    setSort: handleSetSort,
    visibleCount,
    showMore,
    hasMore,
    totalFiltered: sorted.length,
  }
}
