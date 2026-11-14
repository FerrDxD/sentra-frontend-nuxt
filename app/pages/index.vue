<template>
  <div class="min-h-screen bg-bg-primary text-text-main">
    <BerandaHeroSection />

    <main class="max-w-[1120px] mx-auto px-4 md:px-6 relative">
      <!-- Ruled paper background motif (worksheet lines) -->
      <div
        class="absolute inset-0 pointer-events-none -z-10 overflow-hidden"
        style="background-image:
          linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px);
          background-size: 100% 24px, 24px 100%;"
      />

      <!-- ── Filosofi — field terisi ─────────────────────────── -->
      <section id="nawasena-section" class="py-20 md:py-28 border-t border-border first:border-t-0">
        <BerandaSectionHeader
          title="Filosofi Nawasena"
          subtitle="Mengenal makna di balik nama yang mengarahkan kami."
          label="Tentang Kami"
          icon="material-symbols:info-rounded"
        />
        <BerandaFilosofiSection />
      </section>

      <!-- ── Agenda + Radio — dua kolom lembar kerja ─────────── -->
      <section id="agenda" class="py-20 md:py-28 border-t border-border">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <!-- Agenda — kolom kiri -->
          <div>
            <BerandaSectionHeader
              title="Agenda Mendatang"
              subtitle="Kegiatan yang telah direncanakan."
              label="Agenda"
              icon="material-symbols:event-rounded"
            />
            <div v-if="agendaLoading" class="flex flex-col gap-4">
              <div v-for="i in 3" :key="i" class="h-[130px] rounded-[20px] bg-bg-card border border-border animate-pulse" />
            </div>
            <div v-else-if="agendas.length === 0" class="flex flex-col items-center gap-4 py-20 bg-bg-card border border-dashed border-border rounded-[24px] text-text-muted">
              <Icon name="material-symbols:calendar-today-rounded" class="text-[48px] opacity-30" aria-hidden="true" />
              <p class="text-sm font-medium">Belum ada agenda mendatang.</p>
            </div>
            <div v-else class="flex flex-col gap-5">
              <BerandaAgendaCard v-for="(ag, idx) in agendas" :key="ag.id" :agenda="ag" :delay="idx * 90" />
            </div>
          </div>

          <!-- Radio — kolom kanan, sticky -->
          <div class="lg:sticky lg:top-24">
            <BerandaSectionHeader
              title="Radio Nawasena"
              subtitle="Musik pengiring kegiatan."
              label="Live Radio"
              icon="material-symbols:radio"
            />
            <BerandaRadioSection />
          </div>
        </div>
      </section>

      <!-- ── Program Kerja — entri dengan ceklis ─────────────── -->
      <section id="proker-preview" class="py-20 md:py-28 border-t border-border">
        <BerandaSectionHeader
          title="Program Kerja"
          subtitle="Inisiatif nyata demi kemajuan bersama."
          label="Proker"
          icon="material-symbols:assignment-rounded"
        >
          <template #action>
            <NuxtLink to="/program" class="flex items-center gap-1.5 text-sm font-bold text-accent px-3 py-1.5 rounded-lg border border-accent-soft bg-accent-soft hover:bg-accent/15 transition-colors no-underline">
              Lihat semua <Icon name="material-symbols:arrow-forward" class="text-base" aria-hidden="true" />
            </NuxtLink>
          </template>
        </BerandaSectionHeader>

        <div v-if="prokerLoading" class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="i in 4" :key="i" class="h-[130px] rounded-[20px] bg-bg-card border border-border animate-pulse" />
        </div>
        <div v-else-if="programHighlights.length === 0" class="flex flex-col items-center gap-4 py-20 bg-bg-card border border-dashed border-border rounded-[24px] text-text-muted">
          <Icon name="material-symbols:assignment-rounded" class="text-[48px] opacity-30" aria-hidden="true" />
          <p class="text-sm font-medium">Belum ada program kerja.</p>
        </div>
        <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-5">
          <BerandaProkerCard v-for="(p, idx) in programHighlights" :key="p.id" :program="p" :delay="idx * 90" />
        </div>
      </section>

      <!-- ── Dokumentasi — jawaban dengan lampiran ───────────── -->
      <section id="dokum-preview" class="py-20 md:py-28 border-t border-border">
        <BerandaSectionHeader
          title="Dokumentasi Terbaru"
          subtitle="Rekam jejak dan memori perjalanan Nawasena."
          label="Dokumentasi"
          icon="material-symbols:photo-library-rounded"
        >
          <template #action>
            <NuxtLink to="/dokumentasi" class="flex items-center gap-1.5 text-sm font-bold text-accent px-3 py-1.5 rounded-lg border border-accent-soft bg-accent-soft hover:bg-accent/15 transition-colors no-underline">
              Lihat semua <Icon name="material-symbols:arrow-forward" class="text-base" aria-hidden="true" />
            </NuxtLink>
          </template>
        </BerandaSectionHeader>

        <div v-if="dokumLoading" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="i in 3" :key="i" class="h-[280px] rounded-[20px] bg-bg-card border border-border animate-pulse" />
        </div>
        <div v-else-if="dokumHighlights.length === 0" class="flex flex-col items-center gap-4 py-20 bg-bg-card border border-dashed border-border rounded-[24px] text-text-muted">
          <Icon name="material-symbols:folder-open-rounded" class="text-[48px] opacity-30" aria-hidden="true" />
          <p class="text-sm font-medium">Belum ada dokumentasi yang dipublikasikan.</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-min">
          <BerandaDokumCard v-for="(ev, idx) in dokumHighlights" :key="ev.id" :ev="ev" :is-featured="idx === 0" :delay="idx * 90" />
        </div>
      </section>

      <!-- ── Kotak Saran — komentar di bawah lembar ──────────── -->
      <section class="py-20 md:py-28 border-t border-border">
        <BerandaKotakSaranCta />
      </section>
    </main>

    <BerandaFooter />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useDokumentasi } from '~/composables/useDokumentasi'

const { loading: agendaLoading, agendas, loadAgendas } = useAgenda()
const { loading: prokerLoading, programs, loadPrograms } = useProgram()
const { loading: dokumLoading, dokumentasi, loadDokumentasiData } = useDokumentasi()

const programHighlights = computed(() => {
  const order: Record<string, number> = { Berjalan: 0, Direncanakan: 1, Selesai: 2 }
  return [...programs.value]
    .sort((a, b) => (order[a.status] ?? 1) - (order[b.status] ?? 1))
    .slice(0, 4)
})

const dokumHighlights = computed(() => dokumentasi.value.slice(0, 3))

useSeoMeta({
  title: 'Beranda',
  description: 'Selamat datang di portal OSPK Nawasena — kabinet 2025/2026. Lihat agenda terkini, dengarkan radio sekolah, dan jelajahi program kerja serta dokumentasi kegiatan kami.',
  ogTitle: 'Beranda — OSPK Nawasena',
  ogDescription: 'Selamat datang di portal OSPK Nawasena — kabinet 2025/2026.',
})

onMounted(() => {
  loadAgendas()
  loadPrograms()
  loadDokumentasiData()
})
</script>
