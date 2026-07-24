/**
 * useGallery — загрузка интерьеров из /public/data/gallery.json
 *
 * Предоставляет:
 *   - gallery: список всех интерьеров с действительным image
 *   - getInteriorsForProduct(product, limit = 3): возвращает интерьеры, привязанные к конкретному товару.
 */

import { useFetch } from './useFetch'

export function useGallery() {
  const { data, loading, error } = useFetch('/data/gallery.json')
  const rawGallery = data?.gallery ?? []

  // Гарантированно берем только интерьеры, у которых указан путь к изображению
  const gallery = rawGallery.filter(item => item && item.image && String(item.image).trim() !== '')

  /**
   * Возвращает отфильтрованные интерьеры для конкретного товара
   */
  function getInteriorsForProduct(product, limit = 3) {
    if (!product || gallery.length === 0) return []

    const productId   = product.id
    const productName = product.name?.toLowerCase() ?? ''
    const category    = product.category

    // 1. Прямое совпадение по productId или имени товара
    const exactMatches = gallery.filter(item => {
      if (item.productId && item.productId === productId) return true
      if (item.productName && item.productName.toLowerCase() === productName) return true
      return false
    })

    // 2. Совпадение по категории (если точных совпадений меньше лимита)
    const categoryMatches = gallery.filter(item => {
      if (exactMatches.some(m => m.id === item.id)) return false
      return item.category === category
    })

    // 3. Остальные интерьеры для заполнения до лимита
    const fallbackMatches = gallery.filter(item => {
      if (exactMatches.some(m => m.id === item.id)) return false
      if (categoryMatches.some(m => m.id === item.id)) return false
      return true
    })

    // Собираем результаты по приоритетам
    const result = [...exactMatches, ...categoryMatches, ...fallbackMatches]
    return result.slice(0, limit)
  }

  return {
    gallery,
    getInteriorsForProduct,
    loading,
    error,
  }
}
