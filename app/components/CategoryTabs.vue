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
  <div class="px-4 mb-10 overflow-x-auto no-scrollbar flex gap-3">
    <button
      v-for="cat in categories"
      :key="cat"
      @click="$emit('update:activeCategory', cat)"
      :class="[
        'px-8 flex-1 min-w-fit items-center justify-center rounded-2xl text-sm font-black uppercase tracking-widest whitespace-nowrap h-14 border-2 border-[var(--border)]',
        activeCategory === cat
          ? 'bg-accent'
          : 'bg-[var(--bg-card)]'
      ]"
    >
      {{ cat }}
    </button>
  </div>
</template>
<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>