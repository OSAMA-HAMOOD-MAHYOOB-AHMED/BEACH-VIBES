import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import { useProducts } from './ProductsContext'

const CartContext = createContext(null)

const INITIAL_ITEMS = [
  { id: 'sorrento-swim-jammer', qty: 1 },
  { id: 'mineral-sunscreen-spf50', qty: 1 },
  { id: 'woven-straw-beach-bag', qty: 1 },
]

export function CartProvider({ children }) {
  const { findProduct } = useProducts()
  const [items, setItems] = useState(INITIAL_ITEMS)

  const addItem = useCallback((id, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id)
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i))
      }
      return [...prev, { id, qty }]
    })
  }, [])

  const updateQty = useCallback((id, qty) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
        .filter((i) => i.qty > 0),
    )
  }, [])

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const lines = useMemo(
    () =>
      items
        .map((i) => ({ ...i, product: findProduct(i.id) }))
        .filter((l) => l.product),
    [items, findProduct],
  )

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.product.price * l.qty, 0),
    [lines],
  )

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items])

  const value = { items, lines, subtotal, count, addItem, updateQty, removeItem, clearCart }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
