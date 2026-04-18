import { defineStore } from 'pinia'
import { useTimestamp, useLocalStorage } from '@vueuse/core'
import type { Database } from '~/types/database\.types'
type Product = Database['public']['Tables']['products']['Row']
function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
export const useCart = defineStore('cart', () => {
  const clientId = useLocalStorage('buq_client_id', generateId())
  const guestName = useLocalStorage('buq_guest_name', '')
  const items = ref<{ product: Product; quantity: number }[]>([])
  const lastOrderTime = useLocalStorage<number | null>('buq_last_order', null)
  const timestamp = useTimestamp({ interval: 1000 })
  const totalAmount = computed(() =>
    items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  )
  const cooldown = computed(() => {
    if (!lastOrderTime.value) return 0
    const diff = Math.floor((timestamp.value - lastOrderTime.value) / 1000)
    return diff < 10 ? 10 - diff : 0
  })
  function addToCart(product: Product) {
    const existing = items.value.find(i => i.product.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ product, quantity: 1 })
    }
  }
  function clearCart() {
    items.value = []
    lastOrderTime.value = Date.now()
  }
  function updateQuantity(product: Product, delta: number) {
    const index = items.value.findIndex(i => i.product.id === product.id)
    if (index !== -1) {
      const item = items.value[index]
      if (!item) return
      item.quantity += delta
      if (item.quantity <= 0) {
        items.value.splice(index, 1)
      }
    } else if (delta > 0) {
      items.value.push({ product, quantity: 1 })
    }
  }
  function getItemQuantity(productId: string): number {
    return items.value.find(i => i.product.id === productId)?.quantity ?? 0
  }
  return { clientId, guestName, items, totalAmount, cooldown, addToCart, clearCart, updateQuantity, getItemQuantity }
})