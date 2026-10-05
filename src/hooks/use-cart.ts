import { useState } from 'react'
import { useOutletContext } from 'react-router'
import type { Item } from './fetch'

export type CartLine = {
  item: Item
  count: number
}

export type CartContext = {
  uniqueItems: CartLine[]
  totalCount: number
  setCart: (item: Item, count: number) => void
  removeFromCart: (item: Item) => void
}

export const useCartState = (): CartContext => {
  const [uniqueItems, setUniqueItems] = useState<CartLine[]>([])

  const setCart = (item: Item, count: number) => {
    setUniqueItems((prev) => {
      const exists = prev.some((line) => line.item.id === item.id)
      if (!exists) return [...prev, { item, count }]
      return prev.map((line) => (line.item.id === item.id ? { ...line, count } : line))
    })
  }

  const removeFromCart = (item: Item) => {
    setUniqueItems((prev) => prev.filter((line) => line.item.id !== item.id))
  }

  const totalCount = uniqueItems.reduce((sum, line) => sum + line.count, 0)

  return { uniqueItems, totalCount, setCart, removeFromCart }
}

export const useCart = () => useOutletContext<CartContext>()
