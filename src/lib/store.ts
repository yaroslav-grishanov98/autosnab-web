'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Role, FavoriteItem, Order, Product } from './mock-data'
import { MOCK_FAVORITES, MOCK_ORDERS } from './mock-data'

interface AppStore {
  role: Role | null
  restaurantName: string
  favorites: FavoriteItem[]
  orders: Order[]

  setRole: (role: Role) => void
  setRestaurantName: (name: string) => void
  updateFavoriteQuantity: (id: string, quantity: number) => void
  updateFavoriteComment: (id: string, comment: string) => void
  addToFavorites: (product: Product) => void
  removeFromFavorites: (id: string) => void
  submitOrder: () => void
  resetOrderForm: () => void
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      role: null,
      restaurantName: 'Кафе Центральное',
      favorites: MOCK_FAVORITES,
      orders: MOCK_ORDERS,

      setRole: (role) => set({ role }),
      setRestaurantName: (name) => set({ restaurantName: name }),

      updateFavoriteQuantity: (id, quantity) =>
        set((s) => ({
          favorites: s.favorites.map((f) => (f.id === id ? { ...f, quantity } : f)),
        })),

      updateFavoriteComment: (id, comment) =>
        set((s) => ({
          favorites: s.favorites.map((f) => (f.id === id ? { ...f, comment } : f)),
        })),

      addToFavorites: (product) => {
        const { favorites } = get()
        if (favorites.find((f) => f.id === product.id)) return
        set({ favorites: [...favorites, { ...product, quantity: 0, comment: '' }] })
      },

      removeFromFavorites: (id) =>
        set((s) => ({ favorites: s.favorites.filter((f) => f.id !== id) })),

      submitOrder: () => {
        const { favorites, role, orders } = get()
        const items = favorites
          .filter((f) => f.quantity > 0)
          .map((f) => ({
            productId: f.id,
            name: f.name,
            supplier: f.supplier,
            unit: f.unit,
            quantity: f.quantity,
            price: f.price,
            status: 'pending' as const,
            comment: f.comment || undefined,
          }))

        if (!items.length) return

        const newOrder = {
          id: String(Date.now()),
          number: `ЗК-2024-${String(orders.length + 1).padStart(3, '0')}`,
          date: new Date().toISOString().split('T')[0],
          role: role || 'kitchen',
          items,
        }

        set({
          orders: [newOrder, ...orders],
          favorites: favorites.map((f) => ({ ...f, quantity: 0, comment: '' })),
        })
      },

      resetOrderForm: () =>
        set((s) => ({
          favorites: s.favorites.map((f) => ({ ...f, quantity: 0, comment: '' })),
        })),
    }),
    { name: 'autosnab-store' }
  )
)
