<script setup lang="ts">
defineProps<{
  tableNumber: string
  searchQuery: string
}>()
defineEmits<{
  'update:searchQuery': [value: string]
}>()
const { isDark, toggleTheme } = useTheme()
</script>
<template>
  <header class="p-6 sticky top-0 z-30 bg-[var(--bg-header)] backdrop-blur-xl">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-4xl font-black tracking-tighter text-[var(--text-main)] uppercase">
          BuQ<span class="text-accent">.</span>
        </h1>
        <p class="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)] font-black">Digital Concierge</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="toggleTheme"
          class="h-12 w-12 flex items-center justify-center rounded-full bg-[var(--bg-card)] border-2 border-[var(--border)]"
        >
          <svg v-if="isDark" class="w-6 h-6 text-[var(--text-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="w-6 h-6 text-[var(--text-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
        <div class="h-12 flex items-center bg-[var(--bg-card)] border-2 border-[var(--border)] px-5 rounded-2xl gap-3">
          <span class="w-2 h-2 bg-accent rounded-full shadow-[0_0_8px_var(--accent)]"></span>
          <span class="text-sm font-black text-[var(--text-main)] uppercase tracking-widest">Стіл {{ tableNumber }}</span>
        </div>
      </div>
    </div>
    <div class="relative">
      <input
        :value="searchQuery"
        @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        placeholder="Пошук..."
        class="w-full bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-2xl py-5 pl-14 pr-4 text-lg font-bold focus:outline-none placeholder:text-[var(--text-muted)]"
      />
      <svg class="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  </header>
</template>