<script setup lang="ts">
import type { Database } from '~/types/database\.types'
import { useCart } from '~/composables/useCart'
type Product = Database['public']['Tables']['products']['Row']
defineProps<{ product: Product }>()
const cart = useCart()
</script>
<template>
  <div class="flex flex-col gap-4 bg-[var(--bg-card)] p-4 rounded-[2rem] border border-[var(--border)] shadow-sm">
    <div class="flex gap-4">
      <div
        class="relative w-32 h-32 bg-[var(--bg-page)] rounded-2xl overflow-hidden border border-[var(--border)] flex-shrink-0">
        <img v-if="product.image_url" :src="product.image_url" class="w-full h-full object-cover" />
        <div v-else
          class="w-full h-full flex items-center justify-center text-[var(--text-muted)] text-sm uppercase font-black">
          BuQ
        </div>
      </div>
      <div class="flex flex-col justify-center flex-1 min-w-0 py-1">
        <h3 class="font-bold text-[var(--text-main)] text-xl leading-tight mb-2">{{ product.name }}</h3>
        <p class="text-sm text-[var(--text-muted)] line-clamp-2 leading-snug mb-3 flex-1">{{ product.description }}</p>
        <div class="text-3xl font-black text-[var(--text-main)] italic">
          {{ Math.round(product.price) }}<span
            class="text-sm text-[var(--text-muted)] ml-1 not-italic font-medium">₴</span>
        </div>
      </div>
    </div>
    <div class="h-16 w-full flex flex-col justify-center mt-1">
      <div v-if="cart.getItemQuantity(product.id) > 0"
        class="flex items-stretch h-full w-full bg-[var(--bg-page)] rounded-2xl border-2 border-[var(--border)] overflow-hidden">
        <button @click="cart.updateQuantity(product, -1)"
          class="flex-1 flex items-center justify-center bg-accent text-[var(--text-main)] active:bg-orange-600">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M20 12H4" />
          </svg>
        </button>
        <div class="flex items-center justify-center font-black text-2xl text-[var(--text-main)] px-2 min-w-[5rem]">
          {{ cart.getItemQuantity(product.id) }}
        </div>
        <button @click="cart.updateQuantity(product, 1)"
          class="flex-1 flex items-center justify-center bg-accent text-[var(--text-main)] active:bg-orange-600">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      <button v-else @click="cart.updateQuantity(product, 1)"
        class="w-full h-full rounded-2xl border-2 border-[var(--border)] flex items-center justify-center gap-3 text-[var(--text-main)] hover:bg-accent bg-[var(--bg-page)]">
        <div class="w-10 h-10 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-[var(--text-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <span class="text-sm font-black uppercase tracking-widest">Додати</span>
      </button>
    </div>
  </div>
</template>