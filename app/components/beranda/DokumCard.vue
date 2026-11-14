<template>
  <div ref="el" class="transition-all duration-700" :class="[isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8', { 'md:row-span-2': isFeatured }]" :style="{ transitionDelay: delay ? `${delay}ms` : '0ms' }">
    <NuxtLink :to="`/dokumentasi/${articleSlug(ev)}`" class="bg-bg-card border border-border rounded-[18px] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_16px_40px_rgba(99,102,241,0.18)] flex flex-col group h-full no-underline text-text-main">
      <!-- Thumbnail -->
      <div class="relative overflow-hidden flex-shrink-0 bg-bg-card-2" :class="isFeatured ? 'h-[260px]' : 'h-[180px]'">
        <AppImg :src="useImageUrl(ev.thumbnail)" :alt="ev.title" img-class="transition-transform duration-500 group-hover:scale-105" class="w-full h-full" />
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        <span class="absolute top-3 left-3 bg-accent/90 backdrop-blur-sm text-white text-[0.62rem] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full">{{ ev.tag_text || 'Kegiatan' }}</span>
        <span v-if="isFeatured" class="absolute top-3 right-3 bg-accent/90 backdrop-blur-sm text-white text-[0.6rem] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
          <Icon name="material-symbols:star-rounded" class="text-xs" aria-hidden="true" />
          Pilihan
        </span>
      </div>

      <!-- Body -->
      <div class="p-4 flex flex-col flex-1 gap-1.5">
        <span class="text-[0.68rem] font-bold text-accent uppercase tracking-widest flex items-center gap-1">
          <Icon name="material-symbols:calendar-today-rounded" class="text-xs" aria-hidden="true" />
          {{ formatDate(ev.start_date) }}
        </span>
        <h3 class="font-bold text-text-main leading-snug m-0 group-hover:text-accent transition-colors duration-200" :class="isFeatured ? 'text-[1.12rem] line-clamp-3' : 'text-[0.95rem] line-clamp-2'">{{ ev.title }}</h3>
        <p v-if="ev.description" class="text-[0.8rem] text-text-muted leading-relaxed m-0 line-clamp-2 flex-1">{{ ev.description }}</p>
        <span class="text-[0.78rem] font-bold text-accent mt-auto pt-2 flex items-center gap-1">
          Baca Artikel
          <Icon name="material-symbols:arrow-forward" class="text-[0.95rem] transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { articleSlug } from '~/utils/articleSlug'

defineProps<{ ev: any; isFeatured?: boolean; delay?: number }>()
const { el, isVisible } = useScrollReveal()

function formatDate(s: string) {
  if (!s) return ''
  try {
    const d = new Date(s)
    if (isNaN(d.getTime())) return s
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  } catch { return s }
}
</script>
