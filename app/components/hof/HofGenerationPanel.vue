<template>
  <section class="hof-panel" :class="isLatest ? 'is-latest' : 'is-past'">
    <!-- ── Header ─────────────────────────────────────────────── -->
    <header class="hof-panel-head">
      <div class="hof-panel-emblem" :aria-hidden="true">
        <span class="hof-panel-roman">{{ roman }}</span>
        <span v-if="isLatest" class="hof-panel-pulse" />
      </div>

      <div class="hof-panel-titles">
        <h2 class="hof-panel-title">{{ title }}</h2>
        <p class="hof-panel-meta">
          Angkatan ke-{{ generation.angkatan }} · {{ yearRange }}
        </p>
      </div>

      <span v-if="isLatest" class="hof-panel-badge">
        <span class="hof-panel-badge-dot" />
        Kabinet Sebelumnya
      </span>
    </header>

    <!-- ── Constellation ──────────────────────────────────────── -->
    <div class="hof-panel-map">
      <ConstellationMap
        :stars="stars"
        :size="'md'"
        :variant="isLatest ? 'bright' : 'faint'"
        :show-labels="true"
        :interactive="true"
        @star-click="$emit('star-click', $event)"
      />
    </div>

    <!-- ── Footer: org breakdown + member counts ──────────────── -->
    <footer class="hof-panel-foot">
      <button
        v-for="org in orgLinks"
        :key="org.key"
        class="hof-org-link"
        :class="org.key"
        @click="$emit('members', org.period, org.name)"
      >
        <span class="hof-org-link-tag">{{ org.name }}</span>
        <span class="hof-org-link-name">{{ org.period.nama }}</span>
        <span class="hof-org-link-count">{{ org.total }} anggota</span>
        <Icon name="material-symbols:arrow-forward-rounded" class="hof-org-link-arrow" />
      </button>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { romanNumeral, generationStars } from '~/composables/useHof'

const props = defineProps<{
  generation: any
  isLatest?: boolean
}>()

defineEmits<{
  (e: 'star-click', member: any): void
  (e: 'members', period: any, org: 'OSIS' | 'MPK'): void
}>()

const roman = computed(() => romanNumeral(props.generation.angkatan))

const title = computed(
  () =>
    props.generation.osis?.nama ??
    props.generation.mpk?.nama ??
    `Kepengurusan Angkatan ${props.generation.angkatan}`,
)

const yearRange = computed(() => {
  const o = props.generation.osis?.tahun
  const m = props.generation.mpk?.tahun
  if (o && m && o !== m) return `Tahun Ajaran ${o} / ${m}`
  return `Tahun Ajaran ${o ?? m ?? ''}`
})

const stars = computed(() => generationStars(props.generation))

interface OrgLink {
  key: 'osis' | 'mpk'
  name: 'OSIS' | 'MPK'
  period: any
  total: number
}

const orgLinks = computed<OrgLink[]>(() => {
  const links: OrgLink[] = []
  for (const [key, name] of [['osis', 'OSIS'], ['mpk', 'MPK']] as const) {
    const p = props.generation[key]
    if (!p) continue
    links.push({
      key,
      name,
      period: p,
      total: (p.bph?.length || 0) + (p.anggota?.length || 0),
    })
  }
  return links
})
</script>

<style scoped>
.hof-panel {
  position: relative;
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border, rgba(99, 102, 241, 0.11));
  border-radius: var(--radius-lg, 24px);
  padding: 24px 20px 20px;
  box-shadow: var(--shadow, 0 1px 3px rgba(99, 102, 241, 0.07), 0 4px 16px rgba(99, 102, 241, 0.06));
  overflow: hidden;
}
@media (min-width: 768px) {
  .hof-panel { padding: 32px 32px 24px; }
}

/* subtle nebula tint inside the panel */
.hof-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 70% 60% at 50% 0%, var(--panel-nebula, rgba(99, 102, 241, 0.05)), transparent 70%);
  pointer-events: none;
}
.hof-panel.is-latest { --panel-nebula: rgba(124, 122, 255, 0.08); border-color: rgba(99, 102, 241, 0.24); }
.hof-panel.is-past { --panel-nebula: rgba(99, 102, 241, 0.04); }

.hof-panel-head {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.hof-panel-emblem {
  position: relative;
  flex: none;
  width: 52px;
  height: 52px;
  border-radius: 9999px;
  display: grid;
  place-items: center;
  background: linear-gradient(160deg, var(--bg-card-2, #f8f7ff), var(--bg-card, #fff));
  border: 1.5px solid rgba(99, 102, 241, 0.28);
}
.hof-panel.is-latest .hof-panel-emblem {
  border-color: rgba(99, 102, 241, 0.7);
  box-shadow: 0 0 22px rgba(99, 102, 241, 0.32);
}
.hof-panel-roman {
  font-weight: 800;
  font-size: 1.05rem;
  letter-spacing: 0.02em;
  color: var(--accent, #6366f1);
}
.hof-panel-pulse {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  background: var(--accent, #6366f1);
  border: 2px solid var(--bg-card, #fff);
  animation: hof-ping 1.8s ease-in-out infinite;
}

.hof-panel-titles { flex: 1 1 auto; min-width: 0; }
.hof-panel-title {
  margin: 0;
  font-weight: 800;
  font-size: 1.35rem;
  line-height: 1.15;
  letter-spacing: -0.01em;
  color: var(--text-main, #1c1a3e);
}
.hof-panel-meta {
  margin: 4px 0 0;
  font-size: 0.82rem;
  color: var(--text-muted, #6b6882);
}

.hof-panel-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--accent, #6366f1);
  background: var(--accent-soft, rgba(99, 102, 241, 0.08));
  border: 1px solid rgba(99, 102, 241, 0.22);
  border-radius: 9999px;
  padding: 6px 12px;
}
.hof-panel-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: var(--accent, #6366f1);
  animation: hof-pulse 2s ease-in-out infinite;
}

.hof-panel-map {
  position: relative;
  z-index: 1;
  margin-top: 8px;
}

.hof-panel-foot {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
  border-top: 1px solid var(--border, rgba(99, 102, 241, 0.11));
  padding-top: 16px;
}

.hof-org-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-card-2, #f8f7ff);
  border: 1px solid var(--border, rgba(99, 102, 241, 0.11));
  border-radius: 9999px;
  padding: 7px 10px 7px 7px;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}
.hof-org-link:hover {
  background: var(--accent-soft, rgba(99, 102, 241, 0.08));
  border-color: rgba(99, 102, 241, 0.35);
  transform: translateY(-1px);
}
.hof-org-link:focus-visible {
  outline: 2px solid var(--accent, #6366f1);
  outline-offset: 2px;
}

.hof-org-link-tag {
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fff;
  background: #6366f1;
  border-radius: 9999px;
  padding: 3px 8px;
}
.hof-org-link.mpk .hof-org-link-tag { background: #a855f7; }

.hof-org-link-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-main, #1c1a3e);
}
.hof-org-link-count {
  font-size: 0.72rem;
  color: var(--text-subtle, #a09dbf);
}
.hof-org-link-arrow {
  font-size: 1rem;
  color: var(--text-subtle, #a09dbf);
}

@keyframes hof-ping {
  0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.5); }
  50% { box-shadow: 0 0 0 5px rgba(99, 102, 241, 0); }
}
@keyframes hof-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
</style>