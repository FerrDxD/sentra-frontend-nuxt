<template>
  <div ref="el" class="transition-all duration-700" :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'" :style="{ transitionDelay: delay ? `${delay}ms` : '0ms' }">
    <div class="relative bg-bg-card border border-border rounded-[20px] p-5 md:p-6 flex flex-col gap-2.5 transition-all duration-300 cursor-default group hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_16px_40px_rgba(99,102,241,0.16)] overflow-hidden">
      <!-- Status row like worksheet checkboxes -->
      <div class="flex items-center gap-1.5 flex-wrap">
        <span class="text-[0.62rem] font-bold px-2 py-0.5 rounded-full flex items-center gap-1" :class="{
          'bg-[var(--badge-ongoing-bg)] text-[var(--badge-ongoing-text)]': program.status === 'Berjalan',
          'bg-[var(--badge-done-bg)] text-[var(--badge-done-text)]': program.status === 'Selesai',
          'bg-[var(--badge-plan-bg)] text-[var(--badge-plan-text)]': !program.status || program.status === 'Direncanakan',
        }">
          <span class="w-1.5 h-1.5 rounded-full" :class="{ 'bg-amber-500': program.status === 'Berjalan', 'bg-green-500': program.status === 'Selesai', 'bg-slate-400': !program.status || program.status === 'Direncanakan' }" />
          {{ program.status || 'Direncanakan' }}
        </span>
        <span v-if="program.sekbid_name" class="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-bg-card-2 text-text-subtle border border-border">{{ program.sekbid_name }}</span>
        <span v-else class="text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-accent-soft text-accent">BPH</span>
      </div>
      <h4 class="text-[0.88rem] font-bold text-text-main leading-snug m-0 group-hover:text-accent transition-colors duration-200">{{ program.nama }}</h4>
      <p v-if="program.deskripsi" class="text-[0.78rem] text-text-muted leading-relaxed m-0 line-clamp-2">{{ program.deskripsi }}</p>
      <!-- Hover seal (cap resmi muncul saat hover) -->
      <div class="absolute inset-0 bg-accent/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ program: any; delay?: number }>()
const { el, isVisible } = useScrollReveal()
</script>
