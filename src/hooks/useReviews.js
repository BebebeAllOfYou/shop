/**
 * useReviews — загрузка отзывов и сводной статистики
 *
 * Использование:
 *   const { reviews, summary, loading, error } = useReviews()
 */

import { useFetch } from './useFetch'

export function useReviews() {
  const { data, loading, error } = useFetch('/data/reviews.json')

  return {
    reviews: data?.reviews ?? [],
    summary: data?.summary ?? { average: 0, total: 0, breakdown: {} },
    loading,
    error,
  }
}
