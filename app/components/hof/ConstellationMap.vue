<template>
  <div
    ref="el"
    class="constellation-map"
    :class="[`cm-${size}`, `cm-${variant}`]"
  >
    <!-- Soft halo behind the cluster -->
    <div class="cm-halo" aria-hidden="true" />

    <!-- Constellation lines (minimum spanning tree, drawn on scroll) -->
    <svg
      class="cm-lines"
      :class="{ 'is-drawn': revealed }"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <line
        v-for="(e, i) in constellation.edges"
        :key="`${e.a}-${e.b}`"
        class="hof-constellation-line cm-line"
        :x1="constellation.points[e.a].x * 100"
        :y1="constellation.points[e.a].y * 100"
        :x2="constellation.points[e.b].x * 100"
        :y2="constellation.points[e.b].y * 100"
        :style="{
          strokeDasharray: `${e.length}`,
          strokeDashoffset: revealed ? '0' : `${e.length}`,
          transitionDelay: `${i * 90}ms`,
        }"
      />
    </svg>

    <!-- Stars -->
    <div
      v-for="(star, i) in positioned"
      :key="star.member.id ?? `${star.member.nama}-${i}`"
      class="cm-node"
      :class="{ 'is-revealed': revealed }"
      :style="{ left: star.x + '%', top: star.y + '%', transitionDelay: `${i * 70}ms` }"
    >
      <component
        :is="interactive ? 'button' : 'div'"
        class="cm-core"
        :class="{ 'is-interactive': interactive }"
        :aria-label="interactive ? `${star.member.nama}, ${star.member.jabatan}` : undefined"
        @click="interactive && $emit('star-click', star.member)"
      >
        <span class="cm-avatar">
          <AppImg
            :src="useImageUrl(star.member.foto, star.member.nama)"
            :alt="star.member.nama"
            rounded="full"
            loading="lazy"
            class="w-full h-full"
          />
          <span class="cm-ring" />
        </span>
        <span
          v-if="star.member.org"
          class="cm-org"
          :class="star.member.org === 'MPK' ? 'is-mpk' : 'is-osis'"
          :title="star.member.org"
        >
          {{ star.member.org === 'MPK' ? 'MPK' : 'OSIS' }}
        </span>
      </component>

      <div v-if="showLabels" class="cm-label" :style="{ top: labelTop + 'px' }">
        <span class="cm-name">{{ star.member.nama }}</span>
        <span v-if="star.member.jabatan" class="cm-role">{{ star.member.jabatan }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { buildConstellation } from '~/utils/constellation'

const props = withDefaults(defineProps<{
  /** Member entries — each needs at least { id?, nama, jabatan?, foto?, org? }. */
  stars: any[]
  /** Render name + role labels beneath each star. */
  showLabels?: boolean
  /** Avatar scale. */
  size?: 'sm' | 'md' | 'lg'
  /** 'bright' = latest cabinet, 'faint' = older cabinets. */
  variant?: 'bright' | 'faint'
  /** Make stars focusable/clickable (emits `star-click`). */
  interactive?: boolean
}>(), {
  showLabels: true,
  size: 'md',
  variant: 'bright',
  interactive: true,
})

const emit = defineEmits<{
  (e: 'star-click', member: any): void
}>()

const { el, isVisible } = useScrollReveal()
const revealed = ref(false)

onMounted(() => {
  // Above the fold, reveal immediately; otherwise the observer will flip it.
  if (isVisible.value) revealed.value = true
})

// Let the observer's first fire drive the draw-in for all other cases.
watch(isVisible, (v) => { if (v) revealed.value = true })

const constellation = computed(() =>
  buildConstellation(props.stars.map((s, i) => s.id ?? `${s.nama ?? 'star'}-${i}`)),
)

const positioned = computed(() =>
  props.stars.map((member, i) => ({
    member,
    x: Math.round(constellation.value.points[i]?.x * 1000) / 10,
    y: Math.round(constellation.value.points[i]?.y * 1000) / 10,
  })),
)

// Label offset sits just below the avatar ring.
const avatarPx = computed(() => (props.size === 'lg' ? 84 : props.size === 'sm' ? 40 : 56))
const labelTop = computed(() => avatarPx.value / 2 + 10)
</script>

<style scoped>
.constellation-map {
  position: relative;
  width: 100%;
  min-height: 340px;
}
.cm-sm { min-height: 260px; }
.cm-lg { min-height: 400px; }
@media (min-width: 768px) {
  .cm-sm { min-height: 300px; }
  .cm-md { min-height: 380px; }
  .cm-lg { min-height: 460px; }
}

.cm-halo {
  position: absolute;
  inset: 8%;
  border-radius: 9999px;
  background: radial-gradient(circle, var(--halo-color, rgba(99, 102, 241, 0.14)), transparent 68%);
  filter: blur(12px);
  pointer-events: none;
}
.cm-bright .cm-halo { --halo-color: rgba(124, 122, 255, 0.20); }
.cm-faint .cm-halo { --halo-color: rgba(99, 102, 241, 0.09); }

.cm-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}
.cm-line {
  stroke: var(--line-color, rgba(99, 102, 241, 0.45));
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
  stroke-linecap: round;
  transition: stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.cm-bright .cm-line { --line-color: rgba(139, 128, 255, 0.55); }
.cm-faint .cm-line { --line-color: rgba(99, 102, 241, 0.28); }

.cm-node {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  transform: scale(0.92);
  transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.cm-node.is-revealed {
  opacity: 1;
  transform: scale(1);
}

.cm-core {
  position: absolute;
  transform: translate(-50%, -50%);
  display: grid;
  place-items: center;
  border: none;
  background: transparent;
  padding: 0;
}
.cm-core.is-interactive {
  cursor: pointer;
  border-radius: 9999px;
}
.cm-core.is-interactive:focus-visible {
  outline: 2px solid var(--accent, #6366f1);
  outline-offset: 3px;
}

.cm-avatar {
  position: relative;
  display: block;
  border-radius: 9999px;
}
.cm-sm .cm-avatar { width: 40px; height: 40px; }
.cm-md .cm-avatar { width: 56px; height: 56px; }
.cm-lg .cm-avatar { width: 72px; height: 72px; }
@media (min-width: 768px) {
  .cm-lg .cm-avatar { width: 84px; height: 84px; }
}

.cm-avatar-img { border-radius: 9999px; }
.cm-avatar :deep(.app-img-wrap) {
  border-radius: 9999px;
  box-shadow: 0 8px 22px -6px rgba(15, 16, 44, 0.35);
}

.cm-ring {
  position: absolute;
  inset: -3px;
  border-radius: 9999px;
  border: 1.5px solid var(--ring-color, rgba(124, 122, 255, 0.7));
  box-shadow: 0 0 14px var(--ring-glow, rgba(124, 122, 255, 0.45));
  pointer-events: none;
}
.cm-bright { --ring-color: rgba(139, 128, 255, 0.75); --ring-glow: rgba(124, 122, 255, 0.5); }
.cm-faint  { --ring-color: rgba(99, 102, 241, 0.4);  --ring-glow: rgba(99, 102, 241, 0.2); }

.cm-core.is-interactive:hover .cm-avatar { transform: scale(1.08); }
.cm-core.is-interactive:hover .cm-ring { --ring-color: rgba(99, 102, 241, 1); --ring-glow: rgba(99, 102, 241, 0.7); }

.cm-org {
  position: absolute;
  right: -4px;
  bottom: -3px;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.04em;
  line-height: 1;
  padding: 2px 4px;
  border-radius: 9999px;
  color: #fff;
  background: #6366f1;
  border: 2px solid var(--bg-card, #fff);
}
.cm-org.is-mpk { background: #a855f7; }

.cm-label {
  position: absolute;
  left: 0;
  transform: translateX(-50%);
  width: max-content;
  max-width: 116px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1px;
}
.cm-name {
  max-width: 116px;
  font-weight: 700;
  font-size: 0.76rem;
  line-height: 1.25;
  color: var(--text-main, #1c1a3e);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cm-role {
  max-width: 116px;
  font-weight: 600;
  font-size: 0.58rem;
  line-height: 1.3;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-subtle, #a09dbf);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@media (max-width: 639px) {
  .cm-role { display: none; }
  .cm-label { max-width: 96px; }
  .cm-name { font-size: 0.7rem; }
}
</style>