<template>
  <div ref="el" class="mb-8 transition-all duration-700" :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'">
    <div v-if="label" class="flex items-center gap-2 mb-3">
      <span class="inline-flex items-center gap-1.5 text-[0.7rem] font-bold tracking-widest uppercase text-accent bg-accent-soft border border-accent/20 px-3 py-1 rounded-full">
        <Icon v-if="icon" :name="icon" class="text-sm" aria-hidden="true" />
        {{ label }}
      </span>
    </div>
    <div class="flex items-end justify-between flex-wrap gap-3">
      <div>
        <h2 class="text-[1.6rem] md:text-[2.2rem] font-black tracking-tight mb-1 text-text-main">{{ title }}</h2>
        <p v-if="subtitle" class="text-text-muted text-sm">{{ subtitle }}</p>
      </div>
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; subtitle?: string; label?: string; icon?: string }>()
const { el, isVisible } = useScrollReveal()
</script>
