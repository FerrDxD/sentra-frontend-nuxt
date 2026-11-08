<template>
  <div class="hof-starfield" :data-ink="tone === 'ink' ? 'true' : undefined" aria-hidden="true">
    <span
      v-for="s in stars"
      :key="s.key"
      class="hof-star"
      :class="s.bright ? 'is-bright' : ''"
      :style="{
        left: s.x + '%',
        top: s.y + '%',
        width: s.size + 'px',
        height: s.size + 'px',
        animationDelay: s.delay + 's',
        animationDuration: s.duration + 's',
      }"
    />

    <!-- Occasional shooting star, streaking across the upper sky -->
    <span
      v-if="shooting && !prefersReduced"
      class="hof-shooting-star"
      :style="{ animationDelay: shootDelay + 's', animationDuration: shootDuration + 's' }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { mulberry32, hashString } from '~/utils/constellation'

const props = withDefaults(defineProps<{
  /** Number of stars to scatter. */
  density?: number
  /** Stable seed so the sky is identical across renders and clients. */
  seed?: string
  /** Tint of the stars: 'light' (for dark sky) or 'ink' (for light ground). */
  tone?: 'light' | 'ink'
  /** Whether to include the occasional shooting star. */
  shooting?: boolean
}>(), {
  density: 90,
  seed: 'nawasena-sky',
  tone: 'light',
  shooting: false,
})

const prefersReduced = ref(false)
let mq: MediaQueryList | null = null
let mqHandler: ((e: MediaQueryListEvent) => void) | null = null

onMounted(() => {
  if (!import.meta.client) return
  mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReduced.value = mq.matches
  mqHandler = (e: MediaQueryListEvent) => (prefersReduced.value = e.matches)
  mq.addEventListener('change', mqHandler)
})

onUnmounted(() => {
  if (mq && mqHandler) mq.removeEventListener('change', mqHandler)
})

interface Star {
  key: number
  x: number
  y: number
  size: number
  bright: boolean
  delay: number
  duration: number
}

const stars = computed<Star[]>(() => {
  const rand = mulberry32(hashString(props.seed))
  const list: Star[] = []
  const count = props.density
  for (let i = 0; i < count; i++) {
    // bias larger "bright" stars toward a rough band so it reads like a real sky
    const bright = i % 7 === 0
    list.push({
      key: i,
      x: Math.round(rand() * 1000) / 10,
      y: Math.round(rand() * 1000) / 10,
      size: bright ? 1 + Math.round(rand() * 1.6) : 1,
      bright,
      delay: Math.round(rand() * 60) / 10,
      duration: 2.4 + Math.round(rand() * 30) / 10,
    })
  }
  return list
})

// Deterministic timing for the shooting star
const shootDelay = computed(() => 4 + (hashString(props.seed) % 5))
const shootDuration = computed(() => 2.6 + ((hashString(props.seed) % 10) / 10))
</script>

<style scoped>
.hof-starfield {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.hof-star {
  position: absolute;
  border-radius: 9999px;
  display: block;
  background: var(--hof-star, rgba(226, 229, 255, 0.7));
  opacity: 0.35;
  animation: hof-twinkle 3s ease-in-out infinite;
}

/* tone: ink — indigo points that sit on the light ground */
:where(.hof-starfield[data-ink]) .hof-star {
  background: var(--hof-star-ink, rgba(99, 102, 241, 0.5));
}

.hof-star.is-bright {
  opacity: 0.85;
  animation-name: hof-twinkle-bright;
  box-shadow: 0 0 6px var(--hof-star-glow, rgba(196, 200, 255, 0.8));
}

.hof-shooting-star {
  position: absolute;
  top: 12%;
  right: 4%;
  width: 120px;
  height: 1.5px;
  border-radius: 9999px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(226, 229, 255, 0.9));
  transform: rotate(-35deg);
  opacity: 0;
  animation: hof-shoot 6s ease-in infinite;
  will-change: transform, opacity;
}
</style>