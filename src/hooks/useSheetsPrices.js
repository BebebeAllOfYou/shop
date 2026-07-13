/**
 * useSheetsPrices — загружает актуальные данные из Google Таблицы через Apps Script.
 *
 * Возвращает объект `productsMap` вида:
 *   { [productId]: { price: number, oldPrice: number | null, name: string | null } }
 *
 * Логика кэширования:
 *   - При первом запросе данные сохраняются в localStorage
 *   - Повторный fetch происходит не чаще чем раз в PRICES_CACHE_TTL (5 мин)
 *   - Если Google API недоступен — возвращается пустой объект,
 *     и useProducts автоматически использует данные из локального JSON
 */

import { useState, useEffect } from 'react'
import { SHEETS_PRICES_URL, PRICES_CACHE_TTL } from '../config/catalog'

const CACHE_KEY = 'furniture_sheets_prices_v2'

/**
 * Читает кэш из localStorage.
 * Возвращает данные, если кэш ещё актуален, иначе null.
 */
function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, timestamp } = JSON.parse(raw)
    if (Date.now() - timestamp < PRICES_CACHE_TTL) return data
  } catch {
    // повреждённый кэш — игнорируем
  }
  return null
}

/**
 * Сохраняет данные в localStorage с текущим временем.
 */
function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }))
  } catch {
    // localStorage может быть недоступен (приватный режим)
  }
}

/**
 * Преобразует массив из Google Sheets в удобный объект { id → данные товара }.
 */
function buildProductsMap(sheetsArray) {
  const map = {}
  for (const item of sheetsArray) {
    const id = Number(item.id)
    if (!id) continue
    map[id] = {
      price:    Number(item.price)    || 0,
      oldPrice: item.oldPrice != null ? Number(item.oldPrice) : null,
      name:     item.name?.trim()     || null,
    }
  }
  return map
}

export function useSheetsPrices() {
  const [productsMap, setProductsMap] = useState({})
  const [loading,     setLoading]     = useState(!!SHEETS_PRICES_URL)

  useEffect(() => {
    // Если URL не задан — модуль выключен, используем локальные данные
    if (!SHEETS_PRICES_URL) {
      setLoading(false)
      return
    }

    // Проверяем кэш
    const cached = readCache()
    if (cached) {
      setProductsMap(cached)
      setLoading(false)
      return
    }

    // Запрос к Google Apps Script
    let cancelled = false

    fetch(SHEETS_PRICES_URL)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(json => {
        if (cancelled) return
        const map = buildProductsMap(json.products ?? [])
        writeCache(map)
        setProductsMap(map)
        setLoading(false)
      })
      .catch(err => {
        if (cancelled) return
        console.warn('[useSheetsPrices] Не удалось загрузить данные из Google Таблицы:', err.message)
        console.warn('[useSheetsPrices] Используются данные из локального products.json')
        setLoading(false)
        // productsMap остаётся пустым — useProducts использует локальные данные
      })

    return () => { cancelled = true }
  }, [])

  return { productsMap, loading }
}
