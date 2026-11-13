<template>
  <main class="doc-page">
    <!-- ── Masthead ─────────────────────────────────────── -->
    <header class="doc-masthead">
      <h1 class="doc-title">Rekam Jejak Nawasena</h1>
      <p class="doc-lede">
        Galeri dokumentasi kegiatan dan memori perjalanan kabinet OSIS-MPK Nawasena 2025/2026.
      </p>
      <p v-if="!loading && dokumentasi.length" class="doc-count">
        {{ dokumentasi.length }} kegiatan
        <span aria-hidden="true">·</span>
        {{ totalPhotos }} foto terdokumentasi
      </p>
    </header>

    <!-- ── Filter ───────────────────────────────────────── -->
    <div v-if="!loading && tags.length > 1" class="doc-filterbar">
      <div class="doc-filters" role="group" aria-label="Saring kegiatan berdasarkan tag">
        <button
          type="button"
          class="doc-chip"
          :class="{ 'is-on': activeTag === null }"
          :aria-pressed="activeTag === null"
          @click="activeTag = null"
        >
          Semua
        </button>
        <button
          v-for="tag in tags"
          :key="tag"
          type="button"
          class="doc-chip"
          :class="{ 'is-on': activeTag === tag }"
          :aria-pressed="activeTag === tag"
          @click="activeTag = tag"
        >
          {{ tag }}
        </button>
      </div>
    </div>

    <!-- ── Loading ──────────────────────────────────────── -->
    <div v-if="loading" class="doc-grid" role="status" aria-live="polite">
      <span class="sr-only">Memuat dokumentasi…</span>
      <div
        v-for="i in 6"
        :key="i"
        class="doc-skel"
        :class="{ 'doc-skel--lead': i === 1 }"
        aria-hidden="true"
      />
    </div>

    <!-- ── Empty ────────────────────────────────────────── -->
    <div v-else-if="filtered.length === 0" class="doc-empty">
      <span class="doc-empty__icon" aria-hidden="true">
        <Icon :name="activeTag ? 'material-symbols:search-off-rounded' : 'material-symbols:folder-open-rounded'" />
      </span>
      <h2 class="doc-empty__title">
        {{ activeTag ? `Belum ada kegiatan berlabel “${activeTag}”` : 'Belum ada dokumentasi' }}
      </h2>
      <p class="doc-empty__text">
        {{
          activeTag
            ? 'Coba label lain, atau lihat seluruh arsip kegiatan Nawasena.'
            : 'Dokumentasi kegiatan Nawasena akan segera ditampilkan di sini.'
        }}
      </p>
      <button v-if="activeTag" type="button" class="doc-empty__reset" @click="activeTag = null">
        Tampilkan semua kegiatan
      </button>
    </div>

    <!-- ── Archive ──────────────────────────────────────── -->
    <div v-else class="doc-archive">
      <section v-for="(group, gi) in groups" :key="group.year || 'arsip'" class="doc-year">
        <h2 class="doc-year__head">
          <span class="doc-year__label">{{ group.year || 'Arsip' }}</span>
          <span class="doc-year__rule" aria-hidden="true" />
          <span class="doc-year__count">{{ group.items.length }} kegiatan</span>
        </h2>

        <div class="doc-grid">
          <DokumGalleryCard
            v-for="(ev, i) in group.items"
            :key="ev.id"
            :ev="ev"
            :is-featured="gi === 0 && i === 0"
            :delay="Math.min(i, 5) * 70"
          />
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { yearOf } from '~/utils/formatDate'

definePageMeta({
  pageTransition: { name: 'article-slide', mode: 'out-in' },
})

const { loading, dokumentasi, loadDokumentasiData } = useDokumentasi()

const activeTag = ref<string | null>(null)

const totalPhotos = computed(() =>
  dokumentasi.value.reduce((sum: number, ev: any) => sum + (ev.images?.length || 0), 0)
)

/** Every distinct `tag_text` present in the feed, alphabetised. Purely client-side. */
const tags = computed(() => {
  const seen = new Set<string>()
  for (const ev of dokumentasi.value) {
    const t = String(ev?.tag_text || '').trim()
    if (t) seen.add(t)
  }
  return Array.from(seen).sort((a, b) => a.localeCompare(b, 'id'))
})

/** Newest first; entries without a usable date keep their relative order at the end. */
const sorted = computed(() =>
  [...dokumentasi.value].sort((a, b) =>
    String(b?.start_date || '').localeCompare(String(a?.start_date || ''))
  )
)

const filtered = computed(() => {
  if (!activeTag.value) return sorted.value
  const wanted = activeTag.value
  return sorted.value.filter((ev) => String(ev?.tag_text || '').trim() === wanted)
})

interface YearGroup {
  year: string
  items: any[]
}

/** Groups the visible entries by year of `start_date`, preserving archive order. */
const groups = computed<YearGroup[]>(() => {
  const out: YearGroup[] = []
  const index = new Map<string, number>()
  for (const ev of filtered.value) {
    const y = yearOf(ev?.start_date)
    if (!index.has(y)) {
      index.set(y, out.length)
      out.push({ year: y, items: [] })
    }
    out[index.get(y)!].items.push(ev)
  }
  return out
})

useSeoMeta({
  title: 'Dokumentasi',
  description: 'Galeri dokumentasi kegiatan dan acara OSIS Nawasena — rekam jejak dan memori perjalanan kabinet Nawasena 2025/2026.',
  ogTitle: 'Dokumentasi — OSIS Nawasena',
  ogDescription: 'Galeri dokumentasi kegiatan dan acara OSIS Nawasena.',
})

onMounted(() => {
  loadDokumentasiData()
})
</script>

<style>
/* ── Page frame ──────────────────────────────────────── */
.doc-page {
  max-width: 1120px;
  margin: 0 auto;
  padding: 5rem 1rem 3.5rem;
}
@media (min-width: 768px) {
  .doc-page {
    padding: 6rem 1.5rem 4.5rem;
  }
}

/* ── Masthead ────────────────────────────────────────── */
.doc-masthead {
  max-width: 46rem;
  margin: 0 0 2.25rem;
}
.doc-title {
  margin: 0;
  font-size: clamp(2.1rem, 6vw, 3.4rem);
  font-weight: 900;
  line-height: 1.03;
  letter-spacing: -0.035em;
  text-wrap: balance;
  color: var(--text-main);
}
.doc-lede {
  margin: 1rem 0 0;
  max-width: 34rem;
  font-size: 1.0625rem;
  line-height: 1.65;
  color: var(--text-muted);
}
.doc-count {
  margin: 1.25rem 0 0;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

/* ── Filter bar (sticks under the fixed nav) ─────────── */
.doc-filterbar {
  position: sticky;
  top: 63px;
  z-index: 20;
  margin: 0 0 2rem;
  padding: 0.7rem 0;
  background: var(--bg-primary);
  box-shadow: 0 1px 0 var(--border);
}
.doc-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.doc-chip {
  appearance: none;
  cursor: pointer;
  padding: 0.45rem 0.95rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--bg-card);
  color: var(--text-muted);
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  transition: background-color 0.18s ease, color 0.18s ease, border-color 0.18s ease;
}
.doc-chip:hover {
  color: var(--text-main);
  border-color: rgba(99, 102, 241, 0.3);
}
/* accent-hover, not accent: white on #6366f1 measures 4.45:1 — just under AA. */
.doc-chip.is-on {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
  color: #fff;
}
.doc-chip:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* ── Year sections ───────────────────────────────────── */
.doc-year + .doc-year {
  margin-top: 2.75rem;
}
.doc-year__head {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0 0 1.25rem;
}
.doc-year__label {
  font-size: clamp(1.4rem, 3vw, 1.75rem);
  font-weight: 900;
  letter-spacing: -0.03em;
  color: var(--text-main);
  font-variant-numeric: tabular-nums;
}
.doc-year__rule {
  flex: 1;
  height: 1px;
  background: var(--border);
}
.doc-year__count {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* ── Grid ────────────────────────────────────────────── */
.doc-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}
@media (min-width: 768px) {
  .doc-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.5rem;
  }
}
@media (min-width: 1024px) {
  .doc-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
/* The lead entry reads across the full archive width. */
.doc-card-reveal--lead {
  grid-column: 1 / -1;
}

/* ── Skeleton ────────────────────────────────────────── */
.doc-skel {
  height: 300px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: linear-gradient(to right, var(--bg-card) 0%, var(--bg-card-2) 50%, var(--bg-card) 100%);
  background-size: 800px 100%;
  animation: docShimmer 1.5s infinite linear;
}
.doc-skel--lead {
  height: 260px;
}
@media (min-width: 768px) {
  .doc-skel--lead {
    grid-column: 1 / -1;
    height: 340px;
  }
}
@keyframes docShimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}

/* ── Empty ───────────────────────────────────────────── */
.doc-empty {
  padding: 3.5rem 0;
  text-align: center;
}
.doc-empty__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  margin-bottom: 1rem;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--bg-card);
  color: var(--text-muted);
  font-size: 1.6rem;
}
.doc-empty__title {
  margin: 0 0 0.5rem;
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text-main);
  text-wrap: balance;
}
.doc-empty__text {
  margin: 0 auto;
  max-width: 30rem;
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--text-muted);
}
.doc-empty__reset {
  margin-top: 1.5rem;
  cursor: pointer;
  padding: 0.6rem 1.25rem;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--bg-card);
  color: var(--text-main);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 700;
  transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}
.doc-empty__reset:hover {
  background: var(--accent-soft);
  border-color: rgba(99, 102, 241, 0.3);
  color: var(--accent);
}
.doc-empty__reset:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .doc-skel {
    animation: none;
  }
}
</style>
