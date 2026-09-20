import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  itemCount: number
  subtotal: number
  increment: (id: number) => void
  decrement: (id: number) => void
}

const CartContext = createContext<CartContextValue | null>(null)

const initialItems: CartItem[] = [
  { id: 1, name: 'Denim Jacket', price: 118, quantity: 1 },
  { id: 2, name: 'Aviator Sunglasses', price: 76, quantity: 2 },
]

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(initialItems)

  const increment = (id: number) =>
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)),
    )

  const decrement = (id: number) =>
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item,
      ),
    )

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [items],
  )

  const value = useMemo(
    () => ({ items, itemCount, subtotal, increment, decrement }),
    [items, itemCount, subtotal],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
