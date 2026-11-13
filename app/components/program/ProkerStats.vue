<template>
  <div class="bg-bg-card border border-border rounded-2xl shadow-md p-4 md:p-7 mb-8 w-full">

    <!-- ═══ Mobile layout (< md) ═══════════════════════════════ -->
    <div class="md:hidden">
      <div class="flex items-center gap-4">
        <div class="relative w-[120px] h-[120px] shrink-0">
          <svg viewBox="0 0 120 120" class="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" stroke-width="14" class="cursor-pointer" @click="toggleFilter('all')" />
            <circle
              v-for="s in statusItems"
              :key="s.key"
              cx="60" cy="60" r="50" fill="none"
              :stroke="s.color"
              :stroke-width="arcWidth(s.key)"
              stroke-linecap="round"
              :stroke-dasharray="`${s.len} ${circumference - s.len}`"
              :stroke-dashoffset="arcStart(s.key)"
              :opacity="arcOpacity(s.key)"
              class="transition-all duration-500 ease-out cursor-pointer"
              @click="toggleFilter(s.key)"
            />
            <circle v-if="dibatalkan" cx="60" cy="60" r="50" fill="none" stroke="#f87171" stroke-width="14" :stroke-dasharray="`${dibatalkanLen} ${circumference - dibatalkanLen}`" :stroke-dashoffset="dibatalkanStart" :opacity="arcOpacity('Dibatalkan')" class="transition-all duration-500 ease-out cursor-pointer" @click="toggleFilter('Dibatalkan')" />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span class="text-[1.4rem] font-[900] tracking-[-1.5px] leading-none" :style="{ color: centerColor }">
              {{ centerValue }}
              <small v-if="activeFilter === 'all'" class="text-[0.8rem] font-[700] tracking-normal">%</small>
            </span>
            <span class="text-[0.58rem] font-semibold text-text-muted uppercase tracking-[0.06em] mt-0.5">{{ centerLabel }}</span>
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <button type="button" class="w-full text-left mb-2" @click="toggleFilter('all')">
            <span class="text-[1.8rem] font-[900] tracking-[-1.5px] leading-none text-text-main">{{ total }}</span>
            <span class="text-[0.68rem] font-semibold text-text-muted uppercase tracking-[0.04em] ml-1.5">Program</span>
          </button>
          <div class="flex items-center gap-2 text-[0.68rem] font-semibold text-text-muted">
            <span class="inline-flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-sm" :style="{ background: '#6366f1' }"></span>BPH: {{ bphCount }}
            </span>
            <span class="opacity-30">·</span>
            <span class="inline-flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-sm" :style="{ background: '#a855f7' }"></span>Sekbid: {{ sekbidCount }}
            </span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 mt-3">
        <button
          v-for="s in statusItems"
          :key="s.key"
          type="button"
          class="flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all duration-200"
          :class="activeFilter === s.key ? '' : 'bg-bg-card-2 border-border'"
          :style="activeFilter === s.key ? `background:${s.color}12;border-color:${s.color}40;box-shadow:0 0 0 1px ${s.color}25` : ''"
          @click="toggleFilter(s.key)"
        >
          <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ background: s.color }"></span>
          <span class="text-[0.68rem] font-semibold text-text-muted uppercase tracking-[0.03em] flex-1 min-w-0 truncate">{{ s.label }}</span>
          <span class="text-[1rem] font-[800] tracking-[-0.5px]" :style="{ color: s.color }">{{ s.count }}</span>
        </button>
      </div>
    </div>

    <!-- ═══ Desktop layout (>= md) ═════════════════════════════ -->
    <div class="hidden md:grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 lg:gap-8 items-center">

      <!-- Ring -->
      <div class="flex items-center justify-center">
        <div class="relative w-[220px] h-[220px]">
          <svg viewBox="0 0 120 120" class="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" stroke-width="12" class="cursor-pointer" @click="toggleFilter('all')" />
            <circle
              v-for="s in statusItems"
              :key="s.key"
              cx="60" cy="60" r="50" fill="none"
              :stroke="s.color"
              :stroke-width="arcWidth(s.key)"
              stroke-linecap="round"
              :stroke-dasharray="`${s.len} ${circumference - s.len}`"
              :stroke-dashoffset="arcStart(s.key)"
              :opacity="arcOpacity(s.key)"
              class="transition-all duration-500 ease-out cursor-pointer"
              @click="toggleFilter(s.key)"
            />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span class="text-[2.2rem] font-[900] tracking-[-2px] leading-none" :style="{ color: centerColor }">
              {{ centerValue }}
              <small v-if="activeFilter === 'all'" class="text-[1.1rem] font-[700] tracking-normal">%</small>
            </span>
            <span class="text-[0.68rem] font-semibold text-text-muted uppercase tracking-[0.08em] mt-1">{{ centerLabel }}</span>
          </div>
        </div>
      </div>

      <!-- Status + scope -->
      <div class="flex flex-col gap-3">
        <button type="button" class="flex items-center gap-3 p-3.5 rounded-xl border text-left w-full transition-all duration-200" :class="activeFilter === 'all' ? 'bg-bg-card-2 border-accent/30' : 'bg-bg-card-2 border-border hover:border-accent/25'" @click="toggleFilter('all')">
          <div class="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center shrink-0">
            <Icon name="material-symbols:assignment-rounded" class="text-accent text-[1.2rem]" />
          </div>
          <div>
            <span class="text-[1.5rem] font-[800] tracking-[-1px] leading-none text-text-main">{{ total }}</span>
            <span class="text-[0.72rem] font-semibold text-text-muted uppercase tracking-[0.06em] ml-2">Total Program</span>
          </div>
        </button>

        <div class="grid grid-cols-2 gap-2.5">
          <button
            v-for="s in statusItems"
            :key="s.key"
            type="button"
            class="flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200"
            :class="activeFilter === s.key ? '' : 'bg-bg-card-2 border-border hover:border-[rgba(99,102,241,0.2)]'"
            :style="activeFilter === s.key ? `background:${s.color}12;border-color:${s.color}40;box-shadow:0 0 0 1px ${s.color}25` : ''"
            @click="toggleFilter(s.key)"
          >
            <span class="w-3 h-3 rounded-full shrink-0" :style="{ background: s.color }"></span>
            <div class="flex-1 min-w-0">
              <span class="text-[0.72rem] font-semibold text-text-muted uppercase tracking-[0.04em]">{{ s.label }}</span>
            </div>
            <span class="text-[1.15rem] font-[800] tracking-[-0.5px]" :style="{ color: s.color }">{{ s.count }}</span>
          </button>
        </div>

        <div class="flex items-center gap-2 pt-2 border-t border-border mt-1">
          <div class="flex items-center gap-1.5 text-[0.72rem] font-semibold text-text-muted">
            <span class="inline-block w-2 h-2 rounded-sm" :style="{ background: '#6366f1' }"></span>
            BPH: {{ bphCount }}
          </div>
          <span class="text-text-border">·</span>
          <div class="flex items-center gap-1.5 text-[0.72rem] font-semibold text-text-muted">
            <span class="inline-block w-2 h-2 rounded-sm" :style="{ background: '#a855f7' }"></span>
            Sekbid: {{ sekbidCount }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  programs: any[]
  activeFilter: string
}>()

const emit = defineEmits<{
  (e: 'update:activeFilter', value: string): void
}>()

function toggleFilter(key: string) {
  emit('update:activeFilter', props.activeFilter === key ? 'all' : key)
}

const total = computed(() => props.programs.length)
const selesai = computed(() => props.programs.filter(p => p.status === 'Selesai').length)
const berjalan = computed(() => props.programs.filter(p => p.status === 'Berjalan').length)
const direncanakan = computed(() => props.programs.filter(p => !p.status || p.status === 'Direncanakan').length)
const dibatalkan = computed(() => props.programs.filter(p => p.status === 'Dibatalkan').length)
const bphCount = computed(() => props.programs.filter(p => p.scope !== 'SEKBID').length)
const sekbidCount = computed(() => props.programs.filter(p => p.scope === 'SEKBID').length)

const circumference = 2 * Math.PI * 50 // ~314.16

const safeTotal = computed(() => Math.max(total.value, 1))
const selesaiLen = computed(() => (selesai.value / safeTotal.value) * circumference)
const berjalanLen = computed(() => (berjalan.value / safeTotal.value) * circumference)
const direncanakanLen = computed(() => (direncanakan.value / safeTotal.value) * circumference)
const dibatalkanLen = computed(() => (dibatalkan.value / safeTotal.value) * circumference)

const dibatalkanStart = computed(() => selesaiLen.value + berjalanLen.value + direncanakanLen.value)

const percent = computed(() => total.value > 0 ? Math.round((selesai.value / total.value) * 100) : 0)

const statusItems = computed(() => {
  const items = [
    { key: 'Selesai', label: 'Selesai', color: '#22c55e', count: selesai.value, len: selesaiLen.value },
    { key: 'Berjalan', label: 'Berjalan', color: '#f59e0b', count: berjalan.value, len: berjalanLen.value },
    { key: 'Direncanakan', label: 'Direncanakan', color: '#94a3b8', count: direncanakan.value, len: direncanakanLen.value },
  ]
  if (dibatalkan.value > 0) {
    items.push({ key: 'Dibatalkan', label: 'Dibatalkan', color: '#f87171', count: dibatalkan.value, len: dibatalkanLen.value })
  }
  return items
})

const STATUS_COLORS: Record<string, string> = {
  Selesai: '#22c55e', Berjalan: '#f59e0b', Direncanakan: '#94a3b8', Dibatalkan: '#f87171',
}

const arcStart = (status: string): number => {
  if (status === 'Selesai') return 0
  if (status === 'Berjalan') return selesaiLen.value
  if (status === 'Direncanakan') return selesaiLen.value + berjalanLen.value
  if (status === 'Dibatalkan') return selesaiLen.value + berjalanLen.value + direncanakanLen.value
  return 0
}

const centerValue = computed(() => {
  if (props.activeFilter === 'all') return String(percent.value)
  const item = statusItems.value.find(s => s.key === props.activeFilter)
  return item ? String(item.count) : String(percent.value)
})
const centerLabel = computed(() => {
  if (props.activeFilter === 'all') return 'Selesai'
  return props.activeFilter
})
const centerColor = computed(() => {
  if (props.activeFilter === 'all') return 'var(--text-main)'
  return STATUS_COLORS[props.activeFilter] || 'var(--text-main)'
})

const arcWidth = (status: string): number => {
  if (props.activeFilter === 'all') return 12
  return props.activeFilter === status ? 15 : 10
}

const arcOpacity = (status: string): number => {
  if (props.activeFilter === 'all') return 1
  return props.activeFilter === status ? 1 : 0.25
}
</script>
