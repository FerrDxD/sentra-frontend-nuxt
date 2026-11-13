<template>
  <article
    class="bg-bg-card border border-border rounded-2xl shadow p-[1.25rem_1.35rem_1.35rem] flex flex-col gap-[0.6rem] transition-all duration-200 hover:-translate-y-[3px] hover:shadow-md hover:border-[rgba(99,102,241,0.25)] h-full"
  >
    <div class="flex items-start justify-between">
      <div class="flex gap-[0.4rem] flex-wrap">
        <span class="inline-flex items-center text-[0.68rem] font-bold px-2 py-[3px] rounded-[6px] tracking-[0.04em] uppercase" :style="scopeStyle">{{ prog.scope || 'BPH' }}</span>
        <span class="inline-flex items-center text-[0.68rem] font-bold px-2 py-[3px] rounded-[6px] tracking-[0.04em] uppercase" :class="statusBadgeClass">
          <span class="inline-block w-[6px] h-[6px] rounded-full mr-[5px] align-middle" :class="statusDotClass"></span>
          {{ statusLabel }}
        </span>
      </div>
      <span v-if="links.length" class="inline-flex items-center gap-1 text-[0.62rem] font-bold px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
        <Icon name="material-symbols:link-rounded" class="text-[0.75rem]" />
        {{ links.length }}
      </span>
    </div>

    <h3 class="text-[0.95rem] font-bold text-text-main leading-[1.4] m-0">{{ prog.nama }}</h3>

    <div v-if="prog.scope === 'SEKBID' && prog.owner_id" class="text-[0.75rem] text-text-subtle font-medium flex items-center gap-[3px]">
      <Icon name="material-symbols:group" class="opacity-[0.55] text-[0.85rem] align-middle" />
      {{ prog.sekbid_name ? `Sekbid ${prog.owner_id} · ${prog.sekbid_name}` : `Sekbid ${prog.owner_id}` }}
    </div>

    <p v-if="prog.deskripsi" class="text-[0.82rem] text-text-muted leading-[1.55] m-0 line-clamp-2 flex-1">{{ prog.deskripsi }}</p>
    <div v-else class="flex-1"></div>

    <div v-if="prog.target" class="text-[0.78rem] text-text-subtle font-medium mt-auto pt-[0.5rem] border-t border-border flex items-center gap-1">
      <Icon name="material-symbols:calendar-month" class="opacity-[0.6] text-[0.9rem] align-middle" />
      {{ prog.target }}
    </div>

    <div v-if="links.length" class="mt-1 pt-2 border-t border-border space-y-1.5">
      <template v-for="link in links" :key="link.id ?? link.ref_id + link.link_type">

        <NuxtLink
          v-if="link.link_type === 'DOKUMENTASI'"
          :to="`/dokumentasi/${articleSlug({ id: link.ref_id, title: link.title || '' })}`"
          class="flex items-center gap-2 w-full text-left px-2.5 py-2 rounded-xl border border-transparent hover:border-[rgba(99,102,241,0.3)] bg-indigo-500/5 hover:bg-indigo-500/10 transition-all duration-150 group no-underline"
        >
          <div class="w-6 h-6 rounded-lg bg-indigo-500/15 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/25 transition-colors">
            <Icon name="material-symbols:article-rounded" class="text-indigo-400 text-[0.85rem]" />
          </div>
          <span class="text-[0.72rem] font-semibold text-text-main line-clamp-1 flex-1 min-w-0">{{ link.title || 'Lihat Artikel' }}</span>
          <Icon name="material-symbols:arrow-outward-rounded" class="text-[0.75rem] text-indigo-400 opacity-60 group-hover:opacity-100 shrink-0 transition-opacity" />
        </NuxtLink>

        <div v-else-if="link.link_type === 'AGENDA'" class="rounded-xl border overflow-hidden transition-all duration-200"
          :class="openAgenda === link.ref_id ? 'border-amber-500/30 bg-amber-500/5' : 'border-transparent bg-amber-500/5 hover:border-amber-500/20'"
        >
          <button type="button"
            class="flex items-center gap-2 w-full text-left px-2.5 py-2 transition-colors group"
            @click="openAgenda = (openAgenda === link.ref_id ? null : link.ref_id)"
          >
            <div class="w-6 h-6 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0 group-hover:bg-amber-500/25 transition-colors">
              <Icon name="material-symbols:event-rounded" class="text-amber-400 text-[0.85rem]" />
            </div>
            <span class="text-[0.72rem] font-semibold text-text-main line-clamp-1 flex-1 min-w-0">{{ link.title || 'Agenda Terkait' }}</span>
            <Icon
              name="material-symbols:keyboard-arrow-down-rounded"
              class="text-[0.9rem] text-amber-400 shrink-0 transition-transform duration-200"
              :class="openAgenda === link.ref_id ? 'rotate-180' : ''"
            />
          </button>

          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            leave-active-class="transition-all duration-150 ease-in"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div v-if="openAgenda === link.ref_id" class="px-2.5 pb-2.5">
              <div class="rounded-xl bg-amber-500/8 border border-amber-500/15 p-3 space-y-1.5">
                <div v-if="link.start_date || link.end_date" class="flex items-center gap-1.5 text-[0.7rem] font-semibold text-amber-600 dark:text-amber-300">
                  <Icon name="material-symbols:schedule-rounded" class="text-[0.85rem] shrink-0 opacity-70" />
                  <span>{{ formatDateRange(link.start_date, link.end_date) }}</span>
                </div>
                <p v-if="link.ket" class="text-[0.7rem] text-text-muted leading-relaxed m-0 line-clamp-3">{{ link.ket }}</p>
                <p v-else class="text-[0.68rem] text-text-subtle italic m-0">Tidak ada deskripsi agenda.</p>
              </div>
            </div>
          </Transition>
        </div>
      </template>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { articleSlug } from '~/utils/articleSlug'
import type { ProgramLink } from '~/utils/programTypes'

const props = defineProps<{
  prog: any
}>()

const openAgenda = ref<number | null>(null)

const links = computed<ProgramLink[]>(() => Array.isArray(props.prog.links) ? props.prog.links : [])

const SCOPE_COLORS: Record<string, any> = {
  'BPH': { bg: 'rgba(99,102,241,0.10)', text: '#6366f1', border: 'rgba(99,102,241,0.2)' },
  'SEKBID': { bg: 'rgba(168,85,247,0.10)', text: '#a855f7', border: 'rgba(168,85,247,0.2)' },
}
const scopeData = computed(() => SCOPE_COLORS[props.prog.scope] || SCOPE_COLORS['BPH'])
const scopeStyle = computed(() => `background:${scopeData.value.bg};color:${scopeData.value.text};border:1px solid ${scopeData.value.border}`)

const STATUS_CONFIG: Record<string, any> = {
  'Berjalan': { dot: 'bg-[#f59e0b]', badge: 'bg-orange-100 text-[#d97706] dark:bg-orange-500/10 dark:text-[#fbbf24]' },
  'Selesai': { dot: 'bg-[#22c55e]', badge: 'bg-green-100 text-[#16a34a] dark:bg-green-500/10 dark:text-[#4ade80]' },
  'Dibatalkan': { dot: 'bg-red-400', badge: 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400' },
  'Direncanakan': { dot: 'bg-[#94a3b8]', badge: 'bg-slate-200 text-[#64748b] dark:bg-slate-500/10 dark:text-[#94a3b8]' },
}
const statusCfg = computed(() => STATUS_CONFIG[props.prog.status || 'Direncanakan'] || STATUS_CONFIG['Direncanakan'])
const statusDotClass = computed(() => statusCfg.value.dot)
const statusBadgeClass = computed(() => statusCfg.value.badge)
const statusLabel = computed(() => props.prog.status || 'Direncanakan')

function formatDateRange(start?: string | null, end?: string | null): string {
  const fmt = (d?: string | null) => {
    if (!d) return ''
    try {
      return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch { return d }
  }
  if (start && end && start !== end) return `${fmt(start)} – ${fmt(end)}`
  return fmt(start) || fmt(end) || ''
}
</script>
