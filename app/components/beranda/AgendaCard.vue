<template>
  <div
    ref="el"
    class="transition-all duration-700"
    :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
    :style="{ transitionDelay: delay ? `${delay}ms` : '0ms' }"
  >
    <div
      class="relative bg-bg-card border border-border rounded-2xl overflow-hidden group cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(99,102,241,0.15)] hover:border-accent/30"
    >
      <!-- Left accent bar -->
      <div class="absolute left-0 inset-y-0 w-1 bg-gradient-to-b from-accent to-purple-500 rounded-l-2xl" />

      <!-- Content -->
      <div class="pl-5 pr-4 py-5 md:pl-6 md:pr-5 md:py-5 ml-0.5">
        <!-- Date -->
        <div class="flex items-center gap-1.5 mb-2.5">
          <Icon name="material-symbols:calendar-month-rounded" class="text-accent text-sm shrink-0" aria-hidden="true" />
          <small class="text-accent font-bold text-[0.72rem] tracking-wide">
            {{ agenda.end_date
              ? `${formatDate(agenda.start_date)} — ${formatDate(agenda.end_date)}`
              : formatDate(agenda.start_date) }}
          </small>
        </div>

        <h3 class="text-[0.98rem] md:text-[1.05rem] font-bold mb-1.5 text-text-main leading-snug">
          {{ agenda.judul }}
        </h3>
        <p class="text-text-muted text-[0.85rem] leading-relaxed m-0 line-clamp-2">
          {{ agenda.ket }}
        </p>
      </div>

      <!-- Hover glow overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-purple-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  agenda: any
  delay?: number
}>()

const { el, isVisible } = useScrollReveal()
const { formatDate } = useAgenda()
</script>
