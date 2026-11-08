<template>
  <article class="hof-dev">
    <!-- avatar -->
    <div class="hof-dev-avatar">
      <AppImg
        :src="useImageUrl(dev.foto, dev.nama)"
        :alt="dev.nama"
        rounded="full"
        loading="lazy"
        class="w-full h-full"
      />
      <span class="hof-dev-mark" aria-hidden="true">
        <Icon name="material-symbols:code" class="hof-dev-mark-icon" />
      </span>
    </div>

    <div class="hof-dev-body">
      <span class="hof-dev-role">{{ dev.role }}</span>
      <h3 class="hof-dev-name">{{ dev.nama }}</h3>
      <p v-if="dev.periode_dev" class="hof-dev-period">Periode Dev {{ dev.periode_dev }}</p>
      <p v-if="dev.deskripsi" class="hof-dev-desc">{{ dev.deskripsi }}</p>

      <div v-if="(dev.tech_stack || []).length" class="hof-dev-stack">
        <span v-for="(stack, i) in dev.tech_stack" :key="i" class="hof-dev-chip">{{ stack }}</span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  dev: any
}>()
</script>

<style scoped>
.hof-dev {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  max-width: 320px;
  width: 100%;
}

.hof-dev-avatar {
  position: relative;
  width: 92px;
  height: 92px;
  border-radius: 9999px;
}

.hof-dev-mark {
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(160deg, #6366f1, #a855f7);
  border: 2px solid var(--bg-card, #fff);
}
.hof-dev-mark-icon { font-size: 15px; }

.hof-dev-role {
  display: inline-block;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent, #6366f1);
  background: var(--accent-soft, rgba(99, 102, 241, 0.08));
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 9999px;
  padding: 4px 12px;
}

.hof-dev-name {
  margin: 10px 0 0;
  font-weight: 800;
  font-size: 1.12rem;
  color: var(--text-main, #1c1a3e);
}
.hof-dev-period {
  margin: 3px 0 0;
  font-size: 0.76rem;
  font-style: italic;
  color: var(--text-subtle, #a09dbf);
}
.hof-dev-desc {
  margin: 10px 0 0;
  font-size: 0.84rem;
  line-height: 1.7;
  color: var(--text-muted, #6b6882);
}

.hof-dev-stack {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
}
.hof-dev-chip {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-muted, #6b6882);
  background: var(--bg-card-2, #f8f7ff);
  border: 1px solid var(--border, rgba(99, 102, 241, 0.11));
  border-radius: var(--radius-sm, 10px);
  padding: 3px 10px;
}
</style>