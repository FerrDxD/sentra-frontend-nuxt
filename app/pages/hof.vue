<template>
  <div class="hof-page">
    <!-- ── The hero: a night sky holding the latest demisioner cabinet as its brightest constellation ── -->
    <HofHero
      :generation="latestGeneration"
      :loading="loading"
      :lineage="lineageCaption"
      @star-click="openMemberProfileModal"
      @cta="scrollToLineage"
    />

    <!-- ── Horizon: where the sky meets the ground ── -->
    <div class="hof-horizon" aria-hidden="true">
      <div class="hof-horizon-line" />
    </div>

    <!-- ── The lineage: every cabinet mapped as its own constellation ── -->
    <main id="hof-lineage" class="hof-main">
      <div class="hof-intro">
        <h2 class="hof-intro-title">Konstelasi Kepemimpinan</h2>
        <p class="hof-intro-sub">
          Dari masa ke masa, setiap kabinet meninggalkan jejaknya di langit Nawasena.
          Sentuh sebuah bintang untuk mengenang pengurusnya.
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="hof-skeleton" aria-live="polite">
        <div v-for="i in 2" :key="i" class="hof-skeleton-panel" />
      </div>

      <!-- Empty / error -->
      <div
        v-else-if="!topGenerations.length && !developers.length"
        class="hof-empty"
      >
        <Icon name="material-symbols:auto-awesome" class="hof-empty-icon" />
        <p>Langit masih kosong — belum ada jejak kepengurusan yang terukir di sini.</p>
      </div>

      <template v-else>
        <!-- Recent generations -->
        <div class="hof-timeline">
          <HofGenerationPanel
            v-for="(g, i) in topGenerations"
            :key="g.angkatan"
            :generation="g"
            :is-latest="i === 0"
            @star-click="openMemberProfileModal"
            @members="openPeriodMembersModal"
          />
        </div>

        <!-- Older generations -->
        <button
          v-if="olderGenerations.length"
          class="hof-older-btn"
          @click="openOlderPeriodsModal"
        >
          <span class="hof-older-btn-label">
            Jelajahi Angkatan Terdahulu
            <small>{{ olderGenerations.length }} angkatan</small>
          </span>
          <Icon name="material-symbols:history" class="hof-older-btn-icon" />
        </button>

        <!-- The builders -->
        <section v-if="developers.length" class="hof-devs">
          <div class="hof-devs-head">
            <h2 class="hof-devs-title">Di Balik Langit Ini</h2>
            <p class="hof-devs-sub">
              Platform karya anak bangsa — dipersembahkan oleh pengembang Nawasena yang
              merawat arsip digital OSIS-MPK agar terus hidup melintasi generasi.
            </p>
          </div>

          <div class="hof-devs-grid">
            <HofDevCard v-for="dev in developers" :key="dev.id" :dev="dev" />
          </div>

          <figure class="hof-devs-quote">
            <blockquote>
              Teknologi yang hebat bukan yang paling rumit, melainkan yang mempermudah
              urusan banyak orang dan terus hidup melintasi generasi.
            </blockquote>
          </figure>
        </section>
      </template>

      <!-- Close -->
      <div class="hof-back">
        <NuxtLink to="/" class="hof-back-link">
          <Icon name="material-symbols:arrow-back-rounded" class="hof-back-icon" />
          Kembali ke Beranda
        </NuxtLink>
      </div>
    </main>

    <HofModal />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

const {
  loading,
  topGenerations,
  olderGenerations,
  developers,
  latestGeneration,
  lineageLength,
  totalMembers,
  loadHofData,
  openMemberProfileModal,
  openPeriodMembersModal,
  openOlderPeriodsModal,
} = useHof()

const lineageCaption = computed(() => {
  if (loading.value || !lineageLength.value) return ''
  const parts = [`${lineageLength.value} kabinet`]
  if (totalMembers.value) parts.push(`${totalMembers.value} pengurus`)
  return parts.join(' · ')
})

const scrollToLineage = () => {
  if (import.meta.client) {
    document.getElementById('hof-lineage')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

useSeoMeta({
  title: 'Hall of Fame',
  description: 'Hall of Fame Nawasena — konstelasi penghormatan bagi pengurus-pengurus terdahulu yang telah menorehkan dedikasi dan kepemimpinan inspiratif.',
  ogTitle: 'Hall of Fame — Nawasena',
  ogDescription: 'Jejak cahaya kepemimpinan Nawasena dari masa ke masa.',
})

onMounted(() => {
  loadHofData()
})
</script>

<style scoped>
.hof-page {
  min-height: 100svh;
}

/* ── Horizon ─────────────────────────────────────────────── */
.hof-horizon {
  position: relative;
  height: 28px;
  margin-top: -1px;
  background: linear-gradient(180deg, #241d57 0%, var(--bg-primary, #f3f1fe) 100%);
}
.hof-horizon-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(139, 128, 255, 0.7), transparent);
}

/* ── Main ────────────────────────────────────────────────── */
.hof-main {
  max-width: 1120px;
  margin: 0 auto;
  padding: 24px 16px 64px;
  position: relative;
  z-index: 1;
}

.hof-intro {
  max-width: 620px;
  margin: 24px 0 40px;
}
.hof-intro-title {
  margin: 0 0 10px;
  font-weight: 900;
  font-size: clamp(1.6rem, 4.5vw, 2.4rem);
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: var(--text-main, #1c1a3e);
}
.hof-intro-sub {
  margin: 0;
  font-size: 0.98rem;
  line-height: 1.7;
  color: var(--text-muted, #6b6882);
}

.hof-skeleton {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.hof-skeleton-panel {
  height: 480px;
  border-radius: var(--radius-lg, 24px);
  background: linear-gradient(90deg, var(--bg-card, #fff) 25%, var(--bg-card-2, #f8f7ff) 50%, var(--bg-card, #fff) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
  border: 1px solid var(--border, rgba(99, 102, 241, 0.11));
}

.hof-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  text-align: center;
  padding: 56px 24px;
  color: var(--text-muted, #6b6882);
  border: 1px dashed var(--border, rgba(99, 102, 241, 0.2));
  border-radius: var(--radius-lg, 24px);
}
.hof-empty-icon { font-size: 2.4rem; opacity: 0.5; }
.hof-empty p { margin: 0; font-size: 0.92rem; }

.hof-timeline {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.hof-older-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  margin-top: 28px;
  padding: 18px 22px;
  background: var(--bg-card-2, #f8f7ff);
  border: 1px dashed var(--border, rgba(99, 102, 241, 0.25));
  border-radius: var(--radius, 16px);
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}
.hof-older-btn:hover,
.hof-older-btn:focus-visible {
  background: var(--accent-soft, rgba(99, 102, 241, 0.08));
  border-color: rgba(99, 102, 241, 0.45);
  outline: none;
}
.hof-older-btn-label {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-weight: 700;
  font-size: 0.94rem;
  color: var(--text-main, #1c1a3e);
}
.hof-older-btn-label small {
  font-weight: 500;
  font-size: 0.76rem;
  color: var(--text-subtle, #a09dbf);
}
.hof-older-btn-icon { font-size: 1.4rem; color: var(--accent, #6366f1); }

/* ── Developers ──────────────────────────────────────────── */
.hof-devs {
  margin-top: 72px;
}
.hof-devs-head {
  max-width: 620px;
  margin: 0 auto 40px;
  text-align: center;
}
.hof-devs-title {
  margin: 0 0 10px;
  font-weight: 900;
  font-size: clamp(1.5rem, 4vw, 2rem);
  letter-spacing: -0.02em;
  color: var(--text-main, #1c1a3e);
}
.hof-devs-sub {
  margin: 0;
  font-size: 0.94rem;
  line-height: 1.7;
  color: var(--text-muted, #6b6882);
}
.hof-devs-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px 48px;
}
.hof-devs-quote {
  margin: 44px auto 0;
  max-width: 560px;
  text-align: center;
}
.hof-devs-quote blockquote {
  margin: 0;
  font-size: 0.92rem;
  font-style: italic;
  line-height: 1.85;
  color: var(--text-muted, #6b6882);
  padding: 20px 24px;
  border: 1px solid var(--border, rgba(99, 102, 241, 0.11));
  border-radius: var(--radius, 16px);
  background: var(--bg-card-2, #f8f7ff);
}

/* ── Back link ───────────────────────────────────────────── */
.hof-back {
  text-align: center;
  margin-top: 64px;
}
.hof-back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-muted, #6b6882);
  text-decoration: none;
  padding: 10px 22px;
  border: 1px solid var(--border, rgba(99, 102, 241, 0.11));
  border-radius: 9999px;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}
.hof-back-link:hover,
.hof-back-link:focus-visible {
  color: var(--text-main, #1c1a3e);
  border-color: rgba(99, 102, 241, 0.4);
  background: var(--accent-soft, rgba(99, 102, 241, 0.08));
  outline: none;
}
.hof-back-icon { font-size: 1rem; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>