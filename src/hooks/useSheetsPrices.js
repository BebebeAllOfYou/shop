/**
 * useSheetsPrices — загружает все данные товаров из Google Таблицы через Apps Script.
 *
 * Возвращает объект `productsMap` вида:
 *   { [productId]: { name, price, oldPrice, description, badge, category, image, inStock, featured, wildberriesLink } }
 *
 * Правило мёржа: если ячейка в таблице ПУСТАЯ — поле берётся из локального products.json.
 * Это позволяет менеджеру заполнять только то, что нужно изменить.
 *
 * Структура таблицы (первая строка — заголовки):
 *   A: id
 *   B: name
 *   C: price
 *   D: oldPrice
 *   E: description
 *   F: badge
 *   G: category
 *   H: image
 *   I: inStock     (TRUE / FALSE)
 *   J: featured    (TRUE / FALSE)
 *   K: wildberriesLink
 *
 * Кэширование:
 *   - Данные сохраняются в localStorage на PRICES_CACHE_TTL (5 мин)
 *   - Если Google API недоступен — возвращается пустой объект,
 *     и useProducts автоматически использует данные из локального JSON
 */

import { useState, useEffect } from 'react'
import { SHEETS_PRICES_URL, PRICES_CACHE_TTL } from '../config/catalog'

// Версия кэша — увеличьте при изменении структуры таблицы
const CACHE_KEY = 'furniture_sheets_v3'

/** Читает кэш. Возвращает данные если актуальны, иначе null. */
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

/** Сохраняет данные в localStorage. */
function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }))
  } catch {
    // localStorage может быть недоступен (приватный режим)
  }
}

/**
 * Разбирает строку «TRUE»/«FALSE»/1/0 в boolean или null если ячейка пустая.
 * null означает «не задано менеджером → использовать значение из JSON».
 */
function parseBool(val) {
  if (val === '' || val === null || val === undefined) return null
  if (typeof val === 'boolean') return val
  const s = String(val).trim().toUpperCase()
  if (s === 'TRUE'  || s === '1' || s === 'ДА')  return true
  if (s === 'FALSE' || s === '0' || s === 'НЕТ') return false
  return null
}

/** Пустая строка → null, иначе trimmed string. */
function parseStr(val) {
  if (val === '' || val === null || val === undefined) return null
  return String(val).trim() || null
}

/** Пустая строка → null, иначе число. */
function parseNum(val) {
  if (val === '' || val === null || val === undefined) return null
  const n = Number(val)
  return isNaN(n) ? null : n
}

/**
 * Преобразует массив строк из Apps Script в карту { id → поля товара }.
 * Поля со значением null означают «не задано» — мёрж оставит значение из JSON.
 */
function buildProductsMap(sheetsArray) {
  const map = {}
  for (const item of sheetsArray) {
    const id = Number(item.id)
    if (!id) continue
    map[id] = {
      name:             parseStr(item.name),
      price:            parseNum(item.price),
      oldPrice:         parseNum(item.oldPrice),
      description:      parseStr(item.description),
      badge:            parseStr(item.badge),
      category:         parseStr(item.category),
      image:            parseStr(item.image),
      inStock:          parseBool(item.inStock),
      featured:         parseBool(item.featured),
      wildberriesLink:  parseStr(item.wildberriesLink),
    }
  }
  return map
}

export function useSheetsPrices() {
  const [productsMap, setProductsMap] = useState({})
  const [loading,     setLoading]     = useState(!!SHEETS_PRICES_URL)

  useEffect(() => {
    if (!SHEETS_PRICES_URL) {
      setLoading(false)
      return
    }

    const cached = readCache()
    if (cached) {
      setProductsMap(cached)
      setLoading(false)
      return
    }

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
      })

    return () => { cancelled = true }
  }, [])

  return { productsMap, loading }
}
