<script setup lang="ts">
import type { Database } from '~/types/database\.types'
type OrderStatus = Database['public']['Enums']['order_status']
type OrderItem = {
  id: string
  quantity: number
  products: { name: string } | null
}
type Order = {
  id: string
  table_number: string
  guest_name: string
  status: OrderStatus | null
  order_items: OrderItem[]
}
const props = defineProps<{
  order: Order
  isUpdating: boolean
}>()
const emit = defineEmits<{
  updateStatus: [id: string, status: OrderStatus]
}>()
const shortId = computed(() => props.order.id.slice(0, 4))
</script>
<template>
   <div class="bg-[var(--bg-card)] p-4 rounded-2xl border border-[var(--border)] shadow-lg transition-all hover:border-accent/20">
     <!-- Order Header -->
     <div class="flex justify-between items-start mb-3">
       <div>
         <div class="text-[10px] text-[var(--text-muted)] mb-1 font-mono">#{{ shortId }}</div>
         <div class="font-black text-xl leading-none text-[var(--text-main)]">Стіл {{ order.table_number }}</div>
       </div>
       <span class="bg-accent/10 text-accent text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider">
         {{ order.guest_name }}
       </span>
     </div>
     <!-- Items -->
     <div class="space-y-1 mb-4 border-t border-[var(--border)] pt-3">
       <div
         v-for="item in order.order_items"
         :key="item.id"
         class="text-sm text-[var(--text-muted)] flex justify-between"
       >
         <span>{{ item.products?.name }}</span>
         <span class="font-mono text-[var(--text-muted)]/70">×{{ item.quantity }}</span>
       </div>
     </div>
    <!-- Actions -->
    <slot name="actions" :isUpdating="isUpdating" />
  </div>
</template>