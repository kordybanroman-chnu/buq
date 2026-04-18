<script setup lang="ts">
defineProps<{
  categories: string[]
  activeCategory: string
}>()
defineEmits<{
  'update:activeCategory': [value: string]
}>()
</script>
<template>
  <div class="px-4 mb-10 overflow-x-auto no-scrollbar flex gap-2">
    <button v-for="cat in categories" :key="cat" @click="$emit('update:activeCategory', cat)" :class="[
      'px-6 flex-1 min-w-fit items-center justify-center rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap h-11',
      activeCategory === cat
        ? 'bg-accent text-black font-bold shadow-md'
        : 'bg-[var(--bg-card)]/70 text-[var(--text-muted)] border-2 border-[var(--border)] hover:border-accent/50'
    ]">
      {{ cat }}
    </button>
  </div>
</template>
<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>