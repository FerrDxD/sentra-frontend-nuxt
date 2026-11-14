<template>
  <div>
    <main class="max-w-[1120px] mx-auto pt-20 md:pt-24 pb-14 px-4 md:px-6">

      <!-- ── Hero header — left-aligned masthead ─────────────────── -->
      <header class="mb-10 md:mb-14">
        <span class="inline-flex items-center gap-1.5 bg-accent-soft text-accent text-[0.65rem] font-bold tracking-[0.12em] uppercase px-3 py-1 rounded-full mb-4">
          <Icon name="material-symbols:assignment-rounded" class="text-[0.95rem]" />
          Program Kerja
        </span>

        <h1 class="text-[clamp(2.4rem,6vw,3.4rem)] font-black tracking-[-0.035em] leading-[1.02] text-text-main m-0 mb-5">
          Inisiatif
          <span class="text-accent">Nawasena</span>
        </h1>

        <p class="text-[1rem] md:text-[1.1rem] text-text-muted max-w-[640px] leading-relaxed m-0 mb-6">
          Target capaian dan status pelaksanaan program kerja OSIS-MPK Nawasena 2025/2026.
        </p>

        <div class="flex items-center gap-2.5 text-[0.72rem] font-semibold text-text-subtle uppercase tracking-[0.08em]">
          <span class="inline-flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-[#22c55e]"></span>
            {{ programCountLabel }}
          </span>
          <span class="text-border">·</span>
          <span>{{ filteredPrograms.length }} program tercatat</span>
        </div>
      </header>

      <!-- ── Stats Dashboard (mission control) ────────────── -->
      <ProgramProkerStats v-if="!loading" :programs="programs" v-model:active-filter="filter" />

      <!-- ── Filter + Grid section ────────────────────────── -->
      <section>
        <div class="flex items-end justify-between mb-5 md:mb-6">
          <h2 class="text-[1.1rem] md:text-[1.25rem] font-extrabold text-text-main m-0 leading-tight">Daftar Program</h2>
          <span v-if="!loading" class="text-[0.74rem] text-text-subtle font-semibold uppercase tracking-wider">
            {{ filteredPrograms.length }} program
          </span>
        </div>

        <ProgramProkerFilterTabs v-model="filter" />

        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="i in 9" :key="i" class="h-[174px] rounded-2xl border border-border bg-[var(--bg-card)] animate-pulse"></div>
        </div>
        <div v-else-if="filteredPrograms.length === 0" class="text-center py-14">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-bg-card-2 border border-border text-text-subtle mb-3">
            <Icon name="material-symbols:search-off" class="text-[28px]" />
          </div>
          <p class="text-[0.9rem] text-text-muted font-medium m-0">Tidak ada program dengan status ini.</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProgramProkerCard v-for="prog in filteredPrograms" :key="prog.id" :prog="prog" />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useProgram } from '~/composables/useProgram'

const { loading, programs, filter, filteredPrograms, loadPrograms } = useProgram()

const programCountLabel = computed(() => {
  const total = programs.value.length
  if (loading.value) return 'Memetakan program kerja…'
  if (total === 0) return 'Belum ada program tercatat'
  return `${total} program tercatat untuk kabinet 2025/2026`
})

useSeoMeta({
  title: 'Program Kerja',
  description: 'Daftar program kerja, target capaian, dan status pelaksanaan program kerja OSIS-MPK Nawasena 2025/2026.',
  ogTitle: 'Program Kerja — OSPK Nawasena',
  ogDescription: 'Daftar program kerja kabinet OSIS-MPK Nawasena 2025/2026.',
})

onMounted(() => {
  loadPrograms()
})
</script>
