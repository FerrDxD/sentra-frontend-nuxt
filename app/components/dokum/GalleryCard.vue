<template>
  <div
    ref="el"
    class="doc-card-reveal h-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
    :class="[
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
      { 'doc-card-reveal--lead': isFeatured },
    ]"
    :style="{ transitionDelay: delay ? `${delay}ms` : '0ms' }"
  >
    <NuxtLink
      :to="`/dokumentasi/${articleSlug(ev)}`"
      :class="[
        'doc-card group flex h-full flex-col overflow-hidden rounded-[16px] border border-border bg-bg-card text-text-main no-underline shadow-[var(--shadow)] transition duration-300 hover:-translate-y-1 hover:border-accent/35 hover:shadow-[var(--shadow-md)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        { 'doc-card--lead lg:flex-row lg:min-h-[300px]': isFeatured },
      ]"
    >
      <!-- Media -->
      <div
        class="relative shrink-0 overflow-hidden bg-bg-card-2"
        :class="isFeatured
          ? 'aspect-[16/10] lg:aspect-auto lg:h-auto lg:w-[54%] lg:min-w-[54%]'
          : 'aspect-[4/3]'"
      >
        <AppImg
          :src="useImageUrl(ev.thumbnail)"
          :alt="ev.title"
          img-class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          class="h-full w-full"
        />

        <span class="doc-card__tag">{{ ev.tag_text || 'Kegiatan' }}</span>

        <span class="doc-card__count">
          <Icon name="material-symbols:photo-camera-rounded" class="text-[0.8rem]" aria-hidden="true" />
          {{ ev.images?.length || 0 }}
        </span>
      </div>

      <!-- Body -->
      <div
        class="flex flex-1 flex-col p-5"
        :class="{ 'lg:justify-center lg:p-8': isFeatured }"
      >
        <p class="doc-card__date">
          <time :datetime="ev.start_date || ''">{{ formatRangeIndo(ev.start_date, ev.end_date) }}</time>
        </p>

        <h3
          class="doc-card__title"
          :class="isFeatured
            ? 'mt-2 text-[1.45rem] leading-[1.18] md:text-[1.9rem] line-clamp-3'
            : 'mt-1.5 text-[1.02rem] leading-[1.3] line-clamp-2'"
        >
          {{ ev.title }}
        </h3>

        <p
          v-if="ev.description"
          class="doc-card__excerpt"
        >
          {{ ev.description }}
        </p>

        <span class="doc-card__cta">
          Baca artikel
          <Icon
            name="material-symbols:arrow-forward-rounded"
            class="text-[1rem] transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { articleSlug } from '~/utils/articleSlug'
import { formatRangeIndo } from '~/utils/formatDate'

defineProps<{
  ev: any
  isFeatured?: boolean
  delay?: number
}>()

const { el, isVisible } = useScrollReveal()
</script>

<style scoped>
.doc-card__date {
  margin: 0;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.doc-card__title {
  margin: 0;
  font-weight: 800;
  letter-spacing: -0.015em;
  color: var(--text-main);
  text-wrap: balance;
  transition: color 0.2s ease;
}

.doc-card:hover .doc-card__title {
  color: var(--accent);
}

.doc-card__excerpt {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--text-muted);
}

/* The lead entry runs a longer excerpt at a larger size. */
.doc-card--lead .doc-card__excerpt {
  -webkit-line-clamp: 4;
  line-clamp: 4;
  font-size: 0.95rem;
}

.doc-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: auto;
  padding-top: 1rem;
  font-size: 0.8rem;
  font-weight: 700;
  /* indigo #6366f1 lands at 4.45:1 on white and 4.0:1 on the dark card —
     both under AA — so each theme gets the indigo that clears 4.5:1. */
  color: var(--accent-hover);
}
.dark .doc-card__cta {
  color: #818cf8;
}

.doc-card__tag {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 1;
  padding: 0.3rem 0.6rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: color-mix(in srgb, var(--bg-card) 88%, transparent);
  backdrop-filter: blur(6px);
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-main);
}

.doc-card__count {
  position: absolute;
  right: 0.75rem;
  bottom: 0.75rem;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.55rem;
  border-radius: 10px;
  background: rgba(6, 11, 20, 0.66);
  backdrop-filter: blur(6px);
  font-size: 0.7rem;
  font-weight: 700;
  color: #fff;
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  .doc-card-reveal {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
  .doc-card:hover {
    transform: none;
  }
}
</style>
