<template>
  <div
    class="sekbid-card group relative overflow-hidden bg-bg-card border border-border rounded-[20px] p-5 cursor-pointer min-h-[148px] flex flex-col gap-3 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md hover:border-[color:var(--sekbid-color)] will-change-transform"
    :style="cssVars"
    @click="$emit('click')"
  >
    <!-- Top row: icon + chip -->
    <div class="flex items-start justify-between gap-2 z-10">
      <div
        class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 ease-out group-hover:scale-110"
        :style="{ background: 'var(--sekbid-glow)', color: 'var(--sekbid-color)' }"
      >
        <Icon :name="meta.icon" size="26" aria-hidden="true" />
      </div>
      <span class="text-[0.58rem] font-extrabold uppercase tracking-[0.12em] px-2 py-[3px] rounded-md bg-bg-card-2 border border-border text-text-subtle leading-none shrink-0">
        {{ chipLabel }}
      </span>
    </div>

    <!-- Name -->
    <h4
      class="sekbid-name text-[0.92rem] font-bold text-text-main leading-snug m-0 line-clamp-3 transition-colors duration-300 z-10"
    >
      {{ sekbid.name }}
    </h4>

    <!-- Footer: counts -->
    <div class="flex items-center gap-2 text-[0.7rem] text-text-muted mt-auto z-10">
      <span class="inline-flex items-center gap-1">
        <Icon name="material-symbols:group-rounded" class="text-[0.95rem]" aria-hidden="true" />
        {{ memberCount }}
      </span>
      <span class="opacity-40" aria-hidden="true">·</span>
      <span class="inline-flex items-center gap-1">
        <Icon name="material-symbols:checklist-rounded" class="text-[0.95rem]" aria-hidden="true" />
        {{ programCount }}
      </span>
    </div>

    <!-- Hover accent glow (corner) -->
    <div
      class="absolute -bottom-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-0 transition-opacity duration-500 pointer-events-none"
      :style="{ background: 'var(--sekbid-glow)' }"
      aria-hidden="true"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSekbidMeta } from '~/composables/useSekbidMeta'

const props = defineProps<{
  sekbid: any
  index: number | string
}>()

defineEmits(['click'])

const meta = computed(() => useSekbidMeta(props.sekbid?.number ?? props.index))

const isKomisi = computed(() =>
  !!props.sekbid?._isKomisi ||
  (typeof props.sekbid?.number === 'string' && /^[A-E]$/i.test(props.sekbid.number)),
)

const chipLabel = computed(() =>
  isKomisi.value ? `Komisi ${props.sekbid?.number}` : `Sekbid ${props.index}`,
)

const memberCount  = computed(() => Array.isArray(props.sekbid?.members)  ? props.sekbid.members.length  : 0)
const programCount = computed(() => Array.isArray(props.sekbid?.programs) ? props.sekbid.programs.length : 0)

const cssVars = computed(() => ({
  '--sekbid-color': meta.value.color,
  '--sekbid-glow':  meta.value.glow,
}))
</script>
