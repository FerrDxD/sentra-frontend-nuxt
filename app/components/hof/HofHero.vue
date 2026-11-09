<template>
  <header class="hof-hero">
    <!-- Night-sky backdrop -->
    <div class="hof-hero-sky" aria-hidden="true">
      <div class="hof-hero-glow hof-hero-glow-a" />
      <div class="hof-hero-glow hof-hero-glow-b" />
    </div>
    <HofStarfield :density="110" seed="hof-hero-sky" tone="light" shooting />

    <div class="hof-hero-inner">
      <div class="hof-hero-copy">
        <h1 class="hof-hero-title">Hall of Fame</h1>
        <p class="hof-hero-sub">
          Sebuah langit untuk mengenang. Setiap pengurus adalah bintang yang pernah
          menerangi Nawasena, dan jejak mereka abadi sebagai konstelasi kepemimpinan.
        </p>

        <p v-if="!loading && lineage" class="hof-hero-lineage">
          <span class="hof-hero-lineage-dot" />
          {{ lineage }}
        </p>
      </div>

      <!-- Latest demisioner cabinet = the brightest constellation in the sky -->
      <div class="hof-hero-map" :class="{ 'is-empty': !hasStars }">
        <template v-if="hasStars">
          <ConstellationMap
            :stars="latestStars"
            :variant="'bright'"
            :size="'lg'"
            :show-labels="true"
            :interactive="true"
            @star-click="$emit('star-click', $event)"
          />
        </template>

        <template v-else-if="loading">
          <div class="hof-hero-loading" aria-live="polite">
            <span class="hof-hero-loading-ring" />
            <p>Memetakan bintang…</p>
          </div>
        </template>

        <template v-else>
          <p class="hof-hero-empty">Langit masih menanti bintang pertamanya.</p>
        </template>
      </div>

      <button class="hof-hero-cta" aria-label="Gulir ke jejak kepengurusan" @click="$emit('cta')">
        <span>Telusuri jejak</span>
        <Icon name="material-symbols:keyboard-arrow-down-rounded" class="hof-hero-cta-icon" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { generationStars } from '~/composables/useHof'

const props = defineProps<{
  generation?: any
  loading?: boolean
  lineage?: string
}>()

defineEmits<{
  (e: 'star-click', member: any): void
  (e: 'cta'): void
}>()

const latestStars = computed(() => generationStars(props.generation))
const hasStars = computed(() => !props.loading && latestStars.value.length > 0)
</script>

<style scoped>
.hof-hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(180deg, #0a0c29 0%, #16173e 52%, #241d57 100%);
  color: #eef0ff;
}

.hof-hero-sky {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.hof-hero-glow {
  position: absolute;
  border-radius: 9999px;
  filter: blur(60px);
}
.hof-hero-glow-a {
  width: 60vw;
  height: 60vw;
  left: -15vw;
  top: -20vw;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.28), transparent 68%);
}
.hof-hero-glow-b {
  width: 52vw;
  height: 52vw;
  right: -14vw;
  bottom: -18vw;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.22), transparent 68%);
}

.hof-hero-inner {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 108px 16px 96px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.hof-hero-copy {
  max-width: 620px;
}

.hof-hero-title {
  margin: 0;
  font-weight: 900;
  font-size: clamp(2.7rem, 10vw, 6rem);
  line-height: 0.98;
  letter-spacing: -0.035em;
  color: #f3f4ff;
  text-shadow: 0 2px 40px rgba(124, 122, 255, 0.45);
}

.hof-hero-sub {
  margin: 20px auto 0;
  max-width: 520px;
  font-size: 1rem;
  line-height: 1.75;
  color: #c6c9ec;
}

.hof-hero-lineage {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 20px 0 0;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #a7abdb;
}
.hof-hero-lineage-dot {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: #818cf8;
  box-shadow: 0 0 10px rgba(129, 140, 248, 0.9);
}

.hof-hero-map {
  width: 100%;
  margin-top: 12px;
}
.hof-hero-map.is-empty {
  display: flex;
  align-items: center;
  justify-content: center;
}

.hof-hero-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 48px 0;
  color: #a7abdb;
  font-size: 0.88rem;
}
.hof-hero-loading-ring {
  width: 34px;
  height: 34px;
  border-radius: 9999px;
  border: 2px solid rgba(129, 140, 248, 0.25);
  border-top-color: #818cf8;
  animation: spin 1s linear infinite;
}

.hof-hero-empty {
  padding: 48px 0;
  color: #a7abdb;
  font-size: 0.9rem;
}

.hof-hero-cta {
  margin-top: 36px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  color: #a7abdb;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.2s ease;
}
.hof-hero-cta:hover,
.hof-hero-cta:focus-visible {
  color: #fff;
  outline: none;
}
.hof-hero-cta-icon {
  font-size: 1.5rem;
  animation: hof-bob 2s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes hof-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}
</style>