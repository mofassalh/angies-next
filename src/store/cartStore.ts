import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  selectedOptions: {
    groupId: string
    groupName: string
    optionId: string
    optionName: string
    price: number
  }[]
  optionsPrice: number
  lineTotal: number
}

interface CartStore {
  items: CartItem[]
  locationId: string | null
  locationName: string | null
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setLocation: (id: string, name: string) => void
  getTotalItems: () => number
  getSubtotal: () => number
  getGST: () => number
  getTotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      locationId: null,
      locationName: null,

      addItem: (item) => {
        const id = Math.random().toString(36).substr(2, 9)
        set(state => ({
          items: [...state.items, { ...item, id }]
        }))
      },

      removeItem: (id) => {
        set(state => ({
          items: state.items.filter(item => item.id !== id)
        }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id)
          return
        }
        set(state => ({
          items: state.items.map(item =>
            item.id === id
              ? { ...item, quantity, lineTotal: (item.price + item.optionsPrice) * quantity }
              : item
          )
        }))
      },

      clearCart: () => set({ items: [] }),

      setLocation: (id, name) => set({ locationId: id, locationName: name }),

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.lineTotal, 0)
      },

      getGST: () => {
        return Math.round(get().getSubtotal() * 0.10 * 100) / 100
      },

      getTotal: () => {
        return Math.round((get().getSubtotal() + get().getGST()) * 100) / 100
      },
    }),
    {
      name: 'angies-cart',
    }
  )
)
