<script setup lang="ts">
import type { Database } from '~/types/database\.types'
type OrderStatus = Database['public']['Enums']['order_status']
defineProps<{
  title: string
  accentClass: string
  orders: any[]
  isUpdating: string | null
  primaryAction?: { label: string; status: OrderStatus; btnClass: string }
  secondaryAction?: { label: string; status: OrderStatus; btnClass: string }
  showDelete?: boolean
}>()
defineEmits<{
  updateStatus: [id: string, status: OrderStatus]
  deleteOrder: [id: string]
}>()
</script>
<template>
  <div class="bg-[var(--bg-card)] p-4 rounded-2xl border border-[var(--border)]">
    <h2 :class="['font-bold mb-4 uppercase text-[10px] tracking-widest', accentClass]">{{ title }}</h2>
    <div class="space-y-4">
      <p v-if="orders.length === 0" class="text-[var(--text-muted)] text-xs text-center py-4">Порожньо</p>
      <AdminOrderCard v-for="order in orders" :key="order.id" :order="order" :is-updating="isUpdating === order.id">
        <template #actions="{ isUpdating }">
          <div class="flex gap-2">
            <button v-if="primaryAction" @click="$emit('updateStatus', order.id, primaryAction.status)"
              :disabled="!!isUpdating"
              :class="['flex-1 py-3 rounded-xl text-base font-bold transition-all disabled:opacity-40 min-h-[48px]', primaryAction.btnClass]">
              {{ isUpdating ? '...' : primaryAction.label }}
            </button>
            <button v-if="secondaryAction" @click="$emit('updateStatus', order.id, secondaryAction.status)"
              :disabled="!!isUpdating"
              :class="['px-4 py-3 rounded-xl text-base font-bold transition-all disabled:opacity-40 min-h-[48px]', secondaryAction.btnClass]">
              {{ secondaryAction.label }}
            </button>
            <button v-if="showDelete" @click="$emit('deleteOrder', order.id)" :disabled="!!isUpdating"
              class="px-4 py-3 rounded-xl text-base font-bold transition-all bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white disabled:opacity-40 min-h-[48px]">
              🗑
            </button>
          </div>
        </template>
      </AdminOrderCard>
    </div>
  </div>
</template>