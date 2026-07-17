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

  // Данные из Google Таблицы (при пустом URL — не запрашиваются)
  const { productsMap, loading: loadingPrices } = useSheetsPrices()

  // Применяем данные из Google Sheets поверх локальных.
  // Правило: если поле в таблице пустое (null) — остаётся значение из products.json.
  // Товары без названия скрываются из каталога полностью.
  const allProducts = useMemo(() => {
    const base = productsData?.products ?? []
    const merged = !Object.keys(productsMap).length
      ? base
      : base.map(p => {
          const s = productsMap[p.id]   // s = данные из Sheets для этого товара
          if (!s) return p

          return {
            ...p,
            // Каждое поле берётся из Sheets только если оно не null
            ...(s.name            !== null ? { name:            s.name            } : {}),
            ...(s.price           !== null ? { price:           s.price           } : {}),
            ...(s.oldPrice        !== null ? { oldPrice:        s.oldPrice        } : {}),
            ...(s.description     !== null ? { description:     s.description     } : {}),
            ...(s.badge           !== null ? { badge:           s.badge           } : {}),
            ...(s.category        !== null ? { category:        s.category        } : {}),
            ...(s.image           !== null ? { image:           s.image           } : {}),
            ...(s.inStock         !== null ? { inStock:         s.inStock         } : {}),
            ...(s.featured        !== null ? { featured:        s.featured        } : {}),
            ...(s.wildberriesLink !== null ? { wildberriesLink: s.wildberriesLink } : {}),
          }
        })
    // Скрываем позиции без названия (пустая строка или null/undefined)
    return merged.filter(p => p.name?.trim())
  }, [productsData, productsMap])

  // Пересчитываем счётчики категорий динамически из реального списка товаров.
  // Это исправляет расхождение между захардкоженным count в categories.json
  // и фактическим количеством товаров в каталоге.
  const categories = useMemo(() => {
    const base = categoriesData?.categories ?? []
    return base.map(cat => ({
      ...cat,
      count: cat.id === 'all'
        ? allProducts.length
        : allProducts.filter(p => p.category === cat.id).length,
    }))
  }, [categoriesData, allProducts])

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
