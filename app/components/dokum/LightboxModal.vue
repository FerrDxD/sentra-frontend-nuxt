<template>
  <div
    v-if="isLightboxModalOpen"
    ref="dialog"
    class="lb"
    role="dialog"
    aria-modal="true"
    aria-label="Galeri foto"
    tabindex="-1"
    @click.self="closeLightboxModal"
  >
    <div class="lb__frame">
      <!-- Header -->
      <div class="lb__bar">
        <h3 class="lb__title">{{ lightboxTitle || 'Foto' }}</h3>
        <div class="lb__tools">
          <span class="lb__counter" aria-live="polite">
            {{ currentIndex + 1 }} / {{ photos.length }}
          </span>
          <button type="button" class="lb__btn lb__btn--close" aria-label="Tutup galeri" @click="closeLightboxModal">
            <Icon name="material-symbols:close-rounded" size="24" aria-hidden="true" />
          </button>
        </div>
      </div>

      <!-- Previous -->
      <button
        v-if="photos.length > 1"
        type="button"
        class="lb__nav lb__nav--prev"
        aria-label="Foto sebelumnya"
        :disabled="currentIndex === 0"
        @click="prev"
      >
        <Icon name="material-symbols:chevron-left-rounded" size="30" aria-hidden="true" />
      </button>

      <!-- Stage -->
      <div class="lb__stage" @click.self="closeLightboxModal">
        <img
          :key="currentPhoto?.url"
          :src="useImageUrl(currentPhoto?.url)"
          :alt="currentPhoto?.caption || lightboxTitle || 'Foto kegiatan'"
          loading="eager"
          decoding="async"
          class="lb__img"
        />
        <p v-if="currentPhoto?.caption" class="lb__caption">{{ currentPhoto.caption }}</p>
      </div>

      <!-- Next -->
      <button
        v-if="photos.length > 1"
        type="button"
        class="lb__nav lb__nav--next"
        aria-label="Foto berikutnya"
        :disabled="currentIndex === photos.length - 1"
        @click="next"
      >
        <Icon name="material-symbols:chevron-right-rounded" size="30" aria-hidden="true" />
      </button>

      <!-- Thumbnails -->
      <div v-if="photos.length > 1" class="lb__thumbs">
        <div ref="thumbList" class="lb__thumb-track">
          <button
            v-for="(img, i) in photos"
            :key="i"
            type="button"
            class="lb__thumb"
            :class="{ 'is-on': i === currentIndex }"
            :data-active="i === currentIndex ? 'true' : undefined"
            :aria-label="`Foto ${i + 1}${img.caption ? `: ${img.caption}` : ''}`"
            :aria-current="i === currentIndex ? 'true' : undefined"
            @click="jump(i)"
          >
            <AppImg :src="useImageUrl(img.url)" :alt="''" class="h-full w-full" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, nextTick, onMounted, onUnmounted, ref } from 'vue'

const {
  selectedPhotos: photos,
  selectedPhotoIndex: currentIndex,
  lightboxTitle,
  isLightboxModalOpen,
  closeLightboxModal,
} = useDokumentasi()

const dialog = ref<HTMLElement | null>(null)
const thumbList = ref<HTMLElement | null>(null)
let lastFocused: HTMLElement | null = null

const currentPhoto = computed(() => photos.value[currentIndex.value])

const next = () => {
  if (currentIndex.value < photos.value.length - 1) currentIndex.value++
}
const prev = () => {
  if (currentIndex.value > 0) currentIndex.value--
}
const jump = (i: number) => {
  currentIndex.value = i
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!isLightboxModalOpen.value) return
  if (e.key === 'ArrowRight') next()
  else if (e.key === 'ArrowLeft') prev()
  else if (e.key === 'Escape') closeLightboxModal()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (import.meta.client) document.body.style.overflow = ''
})

watch(isLightboxModalOpen, async (open) => {
  if (!import.meta.client) return
  if (open) {
    lastFocused = (document.activeElement as HTMLElement) || null
    document.body.style.overflow = 'hidden'
    await nextTick()
    dialog.value?.focus()
    scrollActiveThumb()
  } else {
    document.body.style.overflow = ''
    lastFocused?.focus?.()
    lastFocused = null
  }
})

function scrollActiveThumb() {
  const active = thumbList.value?.querySelector<HTMLElement>('[data-active="true"]')
  active?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
}

watch(currentIndex, () => {
  if (isLightboxModalOpen.value) scrollActiveThumb()
})
</script>

<style scoped>
.lb {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(3, 6, 14, 0.96);
  animation: lbFade 0.22s ease;
}
.lb:focus {
  outline: none;
}

.lb__frame {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

/* ── Bar ─────────────────────────────────────────────── */
.lb__bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem 1.25rem;
  background: linear-gradient(to bottom, rgba(3, 6, 14, 0.85), rgba(3, 6, 14, 0));
  pointer-events: none;
}
.lb__title {
  margin: 0;
  padding-top: 0.55rem;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: #fff;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.lb__tools {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  pointer-events: auto;
}
.lb__counter {
  padding: 0.3rem 0.7rem;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  font-size: 0.78rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  font-variant-numeric: tabular-nums;
}
.lb__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-size: 1.35rem;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
}
.lb__btn:hover {
  background: var(--accent);
  border-color: var(--accent);
  transform: rotate(90deg);
}
.lb__btn:focus-visible,
.lb__nav:focus-visible,
.lb__thumb:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

/* ── Stage ───────────────────────────────────────────── */
.lb__stage {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 5.5rem 1rem 6.5rem;
}
@media (min-width: 768px) {
  .lb__stage {
    padding: 5.5rem 6rem 7rem;
  }
}
.lb__img {
  max-width: 100%;
  max-height: 72vh;
  object-fit: contain;
  border-radius: 16px;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.65);
  animation: lbRise 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}
.lb__caption {
  position: absolute;
  bottom: 1.75rem;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  max-width: min(80%, 44rem);
  padding: 0.45rem 1rem;
  border-radius: 999px;
  background: rgba(3, 6, 14, 0.78);
  color: rgba(255, 255, 255, 0.92);
  font-size: 0.8125rem;
  line-height: 1.45;
  text-align: center;
}

/* ── Prev / next ─────────────────────────────────────── */
.lb__nav {
  position: absolute;
  top: 50%;
  z-index: 10;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  transform: translateY(-50%);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(6px);
  color: #fff;
  font-size: 1.6rem;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease, opacity 0.2s ease;
}
.lb__nav:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.26);
  transform: translateY(-50%) scale(1.06);
}
.lb__nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.lb__nav--prev { left: 0.6rem; }
.lb__nav--next { right: 0.6rem; }
@media (min-width: 768px) {
  .lb__nav--prev { left: 1.5rem; }
  .lb__nav--next { right: 1.5rem; }
}

/* ── Thumbnails ──────────────────────────────────────── */
.lb__thumbs {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  padding: 0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom));
  background: rgba(3, 6, 14, 0.86);
  backdrop-filter: blur(8px);
}
.lb__thumb-track {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-start;
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}
.lb__thumb-track::-webkit-scrollbar {
  height: 6px;
}
.lb__thumb-track::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 999px;
}
.lb__thumb {
  position: relative;
  flex: 0 0 auto;
  width: 4.5rem;
  height: 3.15rem;
  padding: 0;
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}
.lb__thumb:hover {
  opacity: 0.9;
}
.lb__thumb.is-on {
  border-color: var(--accent);
  opacity: 1;
  transform: translateY(-2px);
}

@keyframes lbFade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes lbRise {
  from { opacity: 0; transform: scale(0.985); }
  to   { opacity: 1; transform: scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .lb,
  .lb__img {
    animation: none;
  }
  .lb__btn:hover,
  .lb__nav:hover:not(:disabled),
  .lb__thumb.is-on {
    transform: none;
  }
}
</style>
