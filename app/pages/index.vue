<script setup lang="ts">
import type { Database } from '~/types/database\.types'
import { useCart } from '~/composables/useCart'
const supabase = useSupabaseClient<Database>()
const route = useRoute()
const cart = useCart()
const tableNumber = computed<string>(() => (route.query.table as string) ?? '0')
const searchQuery = ref('')
const activeCategory = ref('Усі')
const { data: products } = await useAsyncData('products', async () => {
  const { data } = await supabase.from('products').select('*').eq('is_available', true)
  return data ?? []
})
const categories = computed<string[]>(() => {
  const list = products.value ?? []
  const cats = list
    .map(p => p.category?.split(' / ')[0])
    .filter((cat): cat is string => !!cat)
  return ['Усі', ...new Set(cats)]
})
const groupedProducts = computed(() => {
  const list = products.value ?? []
  const filtered = list.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = activeCategory.value === 'Усі' || p.category.startsWith(activeCategory.value)
    return matchesSearch && matchesCategory
  })
  return filtered.reduce<Record<string, typeof filtered>>((groups, p) => {
    ;(groups[p.category] ??= []).push(p)
    return groups
  }, {})
})
async function placeOrder() {
  if (!cart.guestName) return alert('Введіть імʼя для замовлення')
  try {
    const { success } = await $fetch('/api/orders', {
      method: 'POST',
      body: {
        clientId: cart.clientId,
        tableNumber: tableNumber.value,
        guestName: cart.guestName,
        items: cart.items.map(i => ({ productId: i.product.id, quantity: i.quantity }))
      }
    })
    if (success) {
      cart.clearCart()
      alert('Замовлення відправлено!')
    }
  } catch (e: any) {
    alert(e.statusMessage || 'Помилка')
  }
}
</script>
<template>
  <div class="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] pb-44 font-sans antialiased flex justify-center relative">
    <div class="w-full max-w-2xl shadow-2xl border-x border-[var(--border)] bg-[var(--bg-page)] min-h-screen">
      <AppHeader
        :table-number="tableNumber"
        :search-query="searchQuery"
        @update:search-query="searchQuery = $event"
      />
      <CategoryTabs
        :categories="categories"
        :active-category="activeCategory"
        @update:active-category="activeCategory = $event"
      />
      <main class="px-4 space-y-12">
        <section v-for="(items, categoryName) in groupedProducts" :key="categoryName">
          <div class="flex items-center gap-4 mb-8">
            <h2 class="text-base font-black uppercase tracking-[0.4em] text-[var(--text-muted)] whitespace-nowrap">
              {{ categoryName }}
            </h2>
            <div class="h-[1px] bg-gradient-to-r from-[var(--border)] to-transparent w-full"></div>
          </div>
          <div class="grid gap-8">
            <ProductCard
              v-for="product in items"
              :key="product.id"
              :product="product"
            />
          </div>
        </section>
      </main>
    </div>
    <ClientOnly>
      <CartBar @place-order="placeOrder" />
    </ClientOnly>
  </div>
</template>