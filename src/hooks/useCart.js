/**
 * useCart — хук управления корзиной
 * TODO: расширить: количество товаров, итоговая сумма, сохранение в localStorage
 */

import { useState, useCallback } from 'react'

export function useCart() {
  const [items, setItems] = useState([])

  const addToCart = useCallback((product) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === product.id)
      if (exists) {
        return prev.map(i =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((productId) => {
    setItems(prev => prev.filter(i => i.id !== productId))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems  = items.reduce((sum, i) => sum + i.qty,         0)
  const totalPrice  = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return { items, addToCart, removeFromCart, clearCart, totalItems, totalPrice }
}
