<script setup lang="ts">
import { useCart } from '~/composables/useCart'
defineEmits<{ placeOrder: [] }>()
const cart = useCart()
</script>
<template>
  <div v-if="cart.items.length > 0" class="fixed bottom-8 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
    <div class="w-full max-w-2xl bg-[var(--bg-card)] rounded-[2.5rem] shadow-[0_10px_40px_rgba(251,146,60,0.3)] flex items-stretch overflow-hidden h-[4.5rem] border-[3px] border-[var(--border)] pointer-events-auto">
      <div class="flex-1 px-6 flex items-center">
        <input
          v-model="cart.guestName"
          placeholder="Ваше ім'я..."
          class="bg-transparent text-[var(--text-main)] font-black placeholder:text-[var(--text-muted)] outline-none w-full text-xl h-full"
        />
      </div>
      <button
        @click="$emit('placeOrder')"
        :disabled="cart.cooldown > 0"
        class="w-[45%] bg-accent text-black flex items-center justify-center gap-2 disabled:opacity-50 uppercase font-black text-2xl border-l-[3px] border-[var(--border)] active:bg-orange-600 transition-colors"
      >
        <span v-if="cart.cooldown > 0">{{ cart.cooldown }}с</span>
        <template v-else>
          <span>{{ cart.totalAmount }}₴</span>
          <svg class="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </template>
      </button>
    </div>
  </div>
</template>