<template>
  <div>
    <BerandaHeroSection />

    <main class="max-w-[1120px] mx-auto px-4 md:px-6">

      <!-- ── Filosofi ─────────────────────────────────────── -->
      <section id="nawasena-section" class="py-12 md:py-16 border-t border-border first:border-t-0">
        <BerandaSectionHeader
          title="Filosofi"
          subtitle="Mengenal makna dibalik nama Nawasena."
          label="Tentang Kami"
          icon="material-symbols:info-rounded"
        />
        <BerandaFilosofiSection />
      </section>

      <!-- ── Radio + Agenda (side by side on desktop) ─────── -->
      <section id="agenda" class="py-12 md:py-16 border-t border-border">
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 lg:gap-8 items-start">
          <!-- Agenda Column -->
          <div>
            <BerandaSectionHeader
              title="Agenda Mendatang"
              subtitle="Kegiatan dan acara yang sudah direncanakan."
              label="Agenda"
              icon="material-symbols:event-rounded"
            />
            <div v-if="agendaLoading" class="flex flex-col gap-3">
              <div
                v-for="i in 3"
                :key="i"
                class="h-[110px] rounded-2xl bg-gradient-to-r from-bg-card via-bg-card-2 to-bg-card animate-pulse border border-border"
              />
            </div>
            <div
              v-else-if="agendas.length === 0"
              class="flex flex-col items-center gap-3 py-12 bg-bg-card border border-dashed border-border rounded-2xl text-text-muted"
            >
              <Icon name="material-symbols:calendar-today-rounded" class="text-4xl opacity-40" aria-hidden="true" />
              <p class="text-sm">Belum ada agenda mendatang.</p>
            </div>
            <div v-else class="flex flex-col gap-3">
              <BerandaAgendaCard
                v-for="(ag, idx) in agendas"
                :key="ag.id"
                :agenda="ag"
                :delay="idx * 80"
              />
            </div>
          </div>

          <!-- Radio Column -->
          <div class="lg:sticky lg:top-24">
            <BerandaSectionHeader
              title="Radio Nawasena"
              subtitle="Putar musik favorit sekolah."
              label="Live Radio"
              icon="material-symbols:radio"
            />
            <BerandaRadioSection />
          </div>
        </div>
      </section>

      <!-- ── Program Kerja Preview ──────────────────────────── -->
      <section id="proker-preview" class="py-12 md:py-16 border-t border-border">
        <BerandaSectionHeader
          title="Program Kerja"
          subtitle="Inisiatif nyata demi kemajuan bersama."
          label="Proker"
          icon="material-symbols:assignment-rounded"
        >
          <template #action>
            <NuxtLink
              to="/program"
              class="flex items-center gap-1.5 text-sm font-bold text-accent px-3 py-1.5 rounded-lg border border-accent-soft bg-accent-soft hover:bg-accent/15 transition-colors no-underline"
            >
              Lihat semua <Icon name="material-symbols:arrow-forward" class="text-base" aria-hidden="true" />
            </NuxtLink>
          </template>
        </BerandaSectionHeader>

        <div v-if="prokerLoading" class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="i in 4"
            :key="i"
            class="h-[120px] rounded-2xl bg-gradient-to-r from-bg-card via-bg-card-2 to-bg-card animate-pulse border border-border"
          />
        </div>
        <div
          v-else-if="programHighlights.length === 0"
          class="flex flex-col items-center gap-3 py-12 bg-bg-card border border-dashed border-border rounded-2xl text-text-muted"
        >
          <Icon name="material-symbols:assignment-rounded" class="text-4xl opacity-40" aria-hidden="true" />
          <p class="text-sm">Belum ada program kerja.</p>
        </div>
        <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <BerandaProkerCard
            v-for="(p, idx) in programHighlights"
            :key="p.id"
            :program="p"
            :delay="idx * 70"
          />
        </div>
      </section>

      <!-- ── Dokumentasi Preview ───────────────────────────── -->
      <section id="dokum-preview" class="py-12 md:py-16 border-t border-border">
        <BerandaSectionHeader
          title="Dokumentasi Terbaru"
          subtitle="Rekam jejak dan memori perjalanan Nawasena."
          label="Dokumentasi"
          icon="material-symbols:photo-library-rounded"
        >
          <template #action>
            <NuxtLink
              to="/dokumentasi"
              class="flex items-center gap-1.5 text-sm font-bold text-accent px-3 py-1.5 rounded-lg border border-accent-soft bg-accent-soft hover:bg-accent/15 transition-colors no-underline"
            >
              Lihat semua <Icon name="material-symbols:arrow-forward" class="text-base" aria-hidden="true" />
            </NuxtLink>
          </template>
        </BerandaSectionHeader>

        <div v-if="dokumLoading" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="i in 3"
            :key="i"
            class="h-[260px] rounded-2xl bg-gradient-to-r from-bg-card via-bg-card-2 to-bg-card animate-pulse border border-border"
          />
        </div>
        <div
          v-else-if="dokumHighlights.length === 0"
          class="flex flex-col items-center gap-3 py-12 bg-bg-card border border-dashed border-border rounded-2xl text-text-muted"
        >
          <Icon name="material-symbols:folder-open-rounded" class="text-4xl opacity-40" aria-hidden="true" />
          <p class="text-sm">Belum ada dokumentasi yang dipublikasikan.</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-min">
          <BerandaDokumCard
            v-for="(ev, idx) in dokumHighlights"
            :key="ev.id"
            :ev="ev"
            :is-featured="idx === 0"
            :delay="idx * 80"
          />
        </div>
      </section>

      <!-- ── Kotak Saran CTA ───────────────────────────────── -->
      <section class="py-12 md:py-16 border-t border-border">
        <BerandaKotakSaranCta />
      </section>

    </main>
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
