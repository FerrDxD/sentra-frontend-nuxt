<template>
  <header class="min-h-[92vh] md:min-h-screen relative overflow-hidden px-4 md:px-[10%] pt-20 md:pt-24 pb-16 md:pb-20 flex flex-col">

    <!-- ── Paper ground (lembar kerja) ───────────────────────── -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute inset-0 opacity-40 pointer-events-none" style="background-image: repeating-linear-gradient(0deg, rgba(99,102,241,0.06) 0, rgba(99,102,241,0.06) 1px, transparent 1px, transparent 24px); background-size: 100% 24px;" />
    </div>

    <div class="relative z-10 w-full flex-grow flex flex-col items-start justify-center text-left md:max-w-[960px] md:text-center md:items-center pb-16 md:pb-0">

      <!-- ── Badge (lembar kerja header) ─────────────────────── -->
      <div class="flex mb-6 md:mb-8 animate-[fadeInDown_0.6s_ease_both]">
        <span class="inline-flex items-center gap-2 bg-accent-soft text-accent px-4 py-1.5 rounded-full text-[0.72rem] font-bold tracking-widest uppercase border border-accent/20">
          <Icon name="material-symbols:assignment-rounded" class="text-sm animate-pulse" aria-hidden="true" />
          Lembar Kerja Nawasena
        </span>
      </div>

      <!-- ── Headline — tulisan tangan di atas garis lurus ────── -->
      <h1 class="text-[clamp(2.6rem,9vw,5.6rem)] leading-[1.0] mb-6 font-black tracking-[-0.04em] md:tracking[-0.05em] animate-[fadeInUp_0.7s_ease_0.1s_both]">
        Membangun
        <br />
        <span class="text-accent underline underline-offset-4 decoration-[2px] decoration-accent">Masa Depan</span>
        Bersama.
      </h1>

      <!-- ── Sub ──────────────────────────────────────────────── -->
      <p class="text-text-muted max-w-[540px] mx-auto md:mx-0 mb-10 md:mb-0 text-[0.98rem] md:text-[1.08rem] leading-[1.6] animate-[fadeInUp_0.7s_ease_0.2s_both]">
        Sebuah mercusuar digital yang mengintegrasikan gerak organisasi dan menampung titah aspirasi demi kemajuan sekolah.
      </p>

      <!-- ── CTAs ─────────────────────────────────────────────── -->
      <div
        class="flex flex-col sm:flex-row gap-3 justify-start md:justify-center items-start md:items-center animate-[fadeInUp_0.7s_ease_0.3s_both]"
      >
        <button
          class="inline-flex items-center justify-center gap-2 bg-accent text-white px-7 py-3.5 rounded-[16px] font-semibold text-[0.92rem] border-none cursor-pointer transition-all duration-200 hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(99,102,241,0.25)] w-full sm:w-auto active:translate-y-0 active:scale-95"
          @click="scrollToContent"
        >
          <Icon name="material-symbols:explore-rounded" size="18" aria-hidden="true" />
          Jelajahi
        </button>
        <button
          class="inline-flex items-center justify-center gap-2 border border-border bg-bg-card text-text-main px-6 py-3.5 rounded-[16px] font-semibold text-[0.92rem] cursor-pointer transition-all duration-200 hover:border-accent/40 hover:bg-accent-soft hover:-translate-y-0.5 w-full sm:w-auto active:scale-95"
          @click="toggleRadio"
        >
          <span class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0" :class="player.isPlaying.value ? 'border-accent' : 'border-text-muted'">
            <span v-if="player.isPlaying.value" class="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          </span>
          <Icon
            :name="player.isPlaying.value ? 'material-symbols:pause-rounded' : 'material-symbols:radio'"
            size="18"
            aria-hidden="true"
          />
          {{ player.isPlaying.value ? 'Pause Radio' : 'Putar Radio' }}
        </button>
      </div>

      <!-- ── Now playing ticker ──────────────────────────────── -->
      <Transition name="slide-up">
        <div
          v-if="player.isPlaying.value && player.currentTrack()"
          class="mt-8 flex justify-start md:justify-center"
        >
          <div
            class="inline-flex items-center gap-2.5 bg-bg-card border border-border rounded-full px-4 py-2 text-[0.75rem] text-text-muted"
          >
            <span class="flex items-end gap-[3px] h-3">
              <span class="w-[3px] bg-accent rounded-full animate-[eq1_0.8s_ease-in-out_infinite]" />
              <span class="w-[3px] bg-accent rounded-full animate-[eq2_0.8s_ease-in-out_0.15s_infinite]" />
              <span class="w-[3px] bg-accent rounded-full animate-[eq3_0.8s_ease-in-out_0.3s_infinite]" />
            </span>
            <span class="text-accent font-semibold">Sedang Diputar:</span>
            <span class="max-w-[180px] truncate">{{ player.currentTrack()?.judul || player.currentTrack()?.title }}</span>
          </div>
        </div>
      </Transition>

      <!-- ── Scroll indicator ────────────────────────────────── -->
      <div
        class="absolute bottom-6 left-0 right-0 flex justify-center animate-[fadeIn_1s_ease_1s_both]"
        :class="player.isPlaying.value ? 'hidden sm:flex' : 'flex'"
      >
        <button
          class="flex flex-col items-center gap-1 text-text-muted hover:text-accent transition-colors cursor-pointer bg-transparent border-none"
          @click="scrollToContent"
        >
          <span class="text-[0.65rem] font-bold tracking-widest uppercase opacity-60">Scroll</span>
          <Icon name="material-symbols:keyboard-arrow-down-rounded" class="text-2xl animate-bounce" aria-hidden="true" />
        </button>
      </div>

    </div>
  </header>
</template>

<script setup lang="ts">
const player = useMusicPlayer()

const scrollToContent = () => {
  if (import.meta.client) {
    const el = document.getElementById('nawasena-section')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const toggleRadio = async () => {
  if (player.playlist.value.length === 0) {
    await player.loadPlaylist()
  }
  if (player.playlist.value.length === 0) return
  player.togglePlay()
}
</script>

<style>
@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-20px) scale(1.05); }
}
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-16px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes eq1 {
  0%, 100% { height: 4px; }
  50% { height: 12px; }
}
@keyframes eq2 {
  0%, 100% { height: 8px; }
  50% { height: 4px; }
}
@keyframes eq3 {
  0%, 100% { height: 6px; }
  50% { height: 12px; }
}

.slide-up-enter-active,
.slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from,
.slide-up-leave-to { opacity: 0; transform: translateY(8px); }

@media (prefers-reduced-motion: reduce) {
  .animate-float, [class*="animate-[float"] { animation: none !important; }
}
</style>
