<template>
  <div class="flex gap-2 mb-6 w-full overflow-x-auto pb-1 scrollbar-hide">
    <button 
      class="inline-flex items-center gap-1.5 px-3.5 md:px-4 py-2 rounded-[10px] border border-border bg-bg-card text-text-muted font-semibold text-[0.8rem] md:text-[0.85rem] cursor-pointer transition-all duration-200 whitespace-nowrap shrink-0"
      :class="modelValue === 'all' ? '!text-accent !border-accent !bg-accent-soft' : 'hover:text-accent hover:border-accent hover:bg-accent-soft'" 
      @click="$emit('update:modelValue', 'all')"
    >
      Semua
    </button>
    <button 
      class="inline-flex items-center gap-1.5 px-3.5 md:px-4 py-2 rounded-[10px] border border-border bg-bg-card text-text-muted font-semibold text-[0.8rem] md:text-[0.85rem] cursor-pointer transition-all duration-200 whitespace-nowrap shrink-0"
      :class="modelValue === 'Berjalan' ? '!text-accent !border-accent !bg-accent-soft' : 'hover:text-accent hover:border-accent hover:bg-accent-soft'" 
      @click="$emit('update:modelValue', 'Berjalan')"
    >
      <span class="inline-block w-[7px] h-[7px] rounded-full bg-[#f59e0b] shrink-0"></span>Berjalan
    </button>
    <button 
      class="inline-flex items-center gap-1.5 px-3.5 md:px-4 py-2 rounded-[10px] border border-border bg-bg-card text-text-muted font-semibold text-[0.8rem] md:text-[0.85rem] cursor-pointer transition-all duration-200 whitespace-nowrap shrink-0"
      :class="modelValue === 'Selesai' ? '!text-accent !border-accent !bg-accent-soft' : 'hover:text-accent hover:border-accent hover:bg-accent-soft'" 
      @click="$emit('update:modelValue', 'Selesai')"
    >
      <span class="inline-block w-[7px] h-[7px] rounded-full bg-[#22c55e] shrink-0"></span>Selesai
    </button>
    <button 
      class="inline-flex items-center gap-1.5 px-3.5 md:px-4 py-2 rounded-[10px] border border-border bg-bg-card text-text-muted font-semibold text-[0.8rem] md:text-[0.85rem] cursor-pointer transition-all duration-200 whitespace-nowrap shrink-0"
      :class="modelValue === 'Direncanakan' ? '!text-accent !border-accent !bg-accent-soft' : 'hover:text-accent hover:border-accent hover:bg-accent-soft'" 
      @click="$emit('update:modelValue', 'Direncanakan')"
    >
      <span class="inline-block w-[7px] h-[7px] rounded-full bg-[#94a3b8] shrink-0"></span>Direncanakan
    </button>
    <button 
      class="inline-flex items-center gap-1.5 px-3.5 md:px-4 py-2 rounded-[10px] border border-border bg-bg-card text-text-muted font-semibold text-[0.8rem] md:text-[0.85rem] cursor-pointer transition-all duration-200 whitespace-nowrap shrink-0"
      :class="modelValue === 'Dibatalkan' ? '!text-accent !border-accent !bg-accent-soft' : 'hover:text-accent hover:border-accent hover:bg-accent-soft'" 
      @click="$emit('update:modelValue', 'Dibatalkan')"
    >
      <span class="inline-block w-[7px] h-[7px] rounded-full bg-[#f87171] shrink-0"></span>Dibatalkan
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

defineEmits(['update:modelValue'])
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
