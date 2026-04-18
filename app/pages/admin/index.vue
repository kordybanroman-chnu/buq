<script setup lang="ts">
import type { Database } from '~/types/database\.types'
useHead({
  title: 'BuQ Admin | Панель керування'
})
type OrderStatus = Database['public']['Enums']['order_status']
const supabase = useSupabaseClient<Database>()
const isUpdating = ref<string | null>(null)
const { data: orders, refresh } = await useAsyncData('admin_orders', async () => {
  const { data } = await supabase
    .from('orders')
    .select('*, order_items(*, products(*))')
    .order('created_at', { ascending: false })
  return data ?? []
})
const pendingOrders = computed(() => orders.value?.filter(o => o.status === 'pending') ?? [])
const preparingOrders = computed(() => orders.value?.filter(o => o.status === 'preparing') ?? [])
const rejectedOrders = computed(() => orders.value?.filter(o => o.status === 'rejected') ?? [])
const { isDark, toggleTheme } = useTheme()
onMounted(() => {
  const channel = supabase
    .channel('admin-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => refresh())
    .subscribe()
  onUnmounted(() => supabase.removeChannel(channel))
})
async function deleteOrder(id: string) {
  if (!confirm('Видалити це замовлення?')) return
  try {
    await $fetch('/api/admin/delete-order', { method: 'DELETE', body: { id } })
    refresh()
  } catch {
    alert('Помилка видалення замовлення')
  }
}
async function updateStatus(id: string, status: OrderStatus) {
  isUpdating.value = id
  try {
    await $fetch('/api/admin/update-status', { method: 'PATCH', body: { id, status } })
  } catch {
    alert('Помилка оновлення статусу')
  } finally {
    isUpdating.value = null
  }
}
</script>
<template>
  <div class="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] font-sans antialiased">
    <header class="p-6 sticky top-0 z-30 bg-[var(--bg-header)] backdrop-blur-xl border-b border-[var(--border)]">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-black tracking-tighter text-[var(--text-main)] uppercase">
            BuQ<span class="text-accent">.</span>
          </h1>
          <p class="text-[9px] uppercase tracking-[0.3em] text-[var(--text-muted)] font-black">Admin Dashboard</p>
        </div>
        <div class="flex items-center gap-2">
          <button @click="toggleTheme"
            class="h-11 aspect-square flex items-center justify-center rounded-full bg-[var(--bg-card)] border-2 border-[var(--border)] hover:border-accent transition-all"
            :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
            <svg v-if="isDark" class="w-5 h-5 text-[var(--text-main)]" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else class="w-5 h-5 text-[var(--text-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
          <div
            class="h-11 flex items-center bg-[var(--bg-card)] border-2 border-[var(--border)] px-5 rounded-2xl gap-2">
            <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
            <span class="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Live</span>
          </div>
        </div>
      </div>
    </header>
    <main class="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <AdminOrderColumn title="Нові замовлення" accent-class="text-accent" :orders="pendingOrders"
        :is-updating="isUpdating"
        :primary-action="{ label: 'Готувати', status: 'preparing', btnClass: 'bg-yellow-500 hover:bg-yellow-400 text-white' }"
        :secondary-action="{ label: '✕', status: 'rejected', btnClass: 'bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white' }"
        @update-status="updateStatus" />
      <AdminOrderColumn title="Готуються" accent-class="text-blue-400" :orders="preparingOrders"
        :is-updating="isUpdating"
        :primary-action="{ label: 'Подати на стіл', status: 'completed', btnClass: 'bg-blue-600 hover:bg-blue-500 text-white' }"
        @update-status="updateStatus" />
      <AdminOrderColumn title="Скасовані" accent-class="text-[var(--text-muted)]" :orders="rejectedOrders"
        :is-updating="isUpdating" :show-delete="true"
        :primary-action="{ label: '✕', status: 'rejected', btnClass: 'bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white' }"
        @update-status="updateStatus" @delete-order="deleteOrder" />
    </main>
  </div>
</template>