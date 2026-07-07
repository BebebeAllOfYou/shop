/**
 * useCompany — загрузка данных о компании (контакты, статистика, соцсети)
 *
 * Использование:
 *   const { company, loading, error } = useCompany()
 */

import { useFetch } from './useFetch'

export function useCompany() {
  const { data, loading, error } = useFetch('/data/company.json')

  return {
    company: data,
    loading,
    error,
  }
}
