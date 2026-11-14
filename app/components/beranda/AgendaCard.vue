<template>
  <div ref="el" class="transition-all duration-700" :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'" :style="{ transitionDelay: delay ? `${delay}ms` : '0ms' }">
    <div class="relative bg-bg-card border border-border rounded-[20px] overflow-hidden group cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(99,102,241,0.15)] hover:border-accent/40">
      <!-- Left margin rule like worksheet -->
      <div class="absolute left-0 top-0 bottom-0 w-[4px] bg-accent rounded-l-[20px]" />

      <div class="pl-6 pr-5 py-6 md:pl-8 md:pr-6 md:py-7 ml-0.5">
        <div class="flex items-center gap-1.5 mb-3">
          <Icon name="material-symbols:calendar-month-rounded" class="text-accent text-sm shrink-0" aria-hidden="true" />
          <small class="text-accent font-bold text-[0.72rem] tracking-wide">{{ agenda.end_date ? `${formatDate(agenda.start_date)} — ${formatDate(agenda.end_date)}` : formatDate(agenda.start_date) }}</small>
        </div>
        <h3 class="text-[0.98rem] md:text-[1.05rem] font-bold mb-1.5 text-text-main leading-snug">{{ agenda.judul }}</h3>
        <p class="text-text-muted text-[0.85rem] leading-relaxed m-0 line-clamp-2">{{ agenda.ket }}</p>
      </div>
      <!-- Hover seal -->
      <div class="absolute inset-0 bg-accent/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ agenda: any; delay?: number }>()
const { el, isVisible } = useScrollReveal()
const { formatDate } = useAgenda()
</script>
