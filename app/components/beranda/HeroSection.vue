<template>
  <header class="min-h-[92vh] md:min-h-screen relative overflow-hidden px-4 md:px-[10%] pt-24 md:pt-28 pb-12 md:pb-20 flex flex-col">

    <!-- ── Ambient ground ──────────────────────────────────────── -->
    <div class="absolute inset-0 pointer-events-none">
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-5%,rgba(99,102,241,0.12),transparent),radial-gradient(ellipse_60%_50%_at_80%_90%,rgba(124,58,237,0.07),transparent),radial-gradient(ellipse_60%_50%_at_20%_80%,rgba(236,72,153,0.06),transparent)]"
      />
      <div class="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-accent/5 blur-3xl animate-[float_8s_ease-in-out_infinite]" />
      <div class="absolute top-[45%] right-[8%] w-80 h-80 rounded-full bg-purple-500/5 blur-3xl animate-[float_10s_ease-in-out_infinite_2s]" />
      <div class="absolute bottom-[12%] left-[25%] w-48 h-48 rounded-full bg-pink-500/5 blur-3xl animate-[float_12s_ease-in-out_infinite_4s]" />
      <div
        class="absolute inset-0 opacity-[0.02] dark:opacity-[0.035]"
        style="background-image: linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px); background-size: 50px 50px;"
      />
    </div>

    <div class="relative z-10 w-full flex-grow flex flex-col items-start justify-center text-left md:max-w-[1000px] md:text-center md:items-center pb-16 md:pb-0">

      <!-- ── Badge (top-left of hero frame) ────────────────────── -->
      <div class="flex mb-6 md:mb-8 animate-[fadeInDown_0.6s_ease_both]">
        <span class="inline-flex items-center gap-2 bg-accent-soft text-accent px-4 py-1.5 rounded-full text-[0.72rem] font-bold tracking-widest uppercase border border-accent/20">
          <Icon name="material-symbols:star-rounded" class="text-sm animate-pulse" aria-hidden="true" />
          NAWASENA 2025/2026
        </span>
      </div>

      <!-- ── Headline ──────────────────────────────────────────── -->
      <h1 class="text-[clamp(2.4rem,8vw,5.2rem)] leading-[1.02] mb-6 font-black tracking-[-0.035em] md:tracking[-0.04em] animate-[fadeInUp_0.7s_ease_0.1s_both]">
        Membangun Masa Depan
        <br />
        <span class="bg-gradient-to-br from-[#6366f1] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">Cerah</span>
        Bersama.
      </h1>

      <!-- ── Sub ───────────────────────────────────────────────── -->
      <p class="text-text-muted max-w-[560px] mx-auto md:mx-0 mb-10 md:mb-0 text-[0.98rem] md:text-[1.08rem] leading-[1.6] animate-[fadeInUp_0.7s_ease_0.2s_both]">
        Sebuah mercusuar digital yang mengintegrasikan gerak organisasi dan menampung titah aspirasi demi kemajuan sekolah.
      </p>

      <!-- ── CTAs (bottom-right action) ────────────────────────── -->
      <div class="flex flex-col sm:flex-row gap-3 justify-start md:justify-center items-start md:items-center animate-[fadeInUp_0.7s_ease_0.3s_both]">
        <button class="inline-flex items-center justify-center gap-2 bg-gradient-to-br from-accent to-purple-500 text-white px-7 py-3.5 rounded-[16px] font-semibold text-[0.92rem] border-none cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(99,102,241,0.5)] w-full sm:w-auto active:translate-y-0 active:scale-95" @click="scrollToContent">
          <Icon name="material-symbols:explore-rounded" size="18" aria-hidden="true" />
          Jelajahi
        </button>
        <button class="inline-flex items-center justify-center gap-2 border border-border bg-bg-card/60 backdrop-blur-sm text-text-main px-6 py-3.5 rounded-[16px] font-semibold text-[0.92rem] cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-[0_4px_20px_rgba(99,102,241,0.15)] w-full sm:w-auto active:scale-95" :class="{ 'border-accent/50 text-accent bg-accent-soft': player.isPlaying.value }" @click="toggleRadio">
          <span class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0" :class="player.isPlaying.value ? 'border-accent' : 'border-text-muted'">
            <span v-if="player.isPlaying.value" class="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          </span>
          <Icon :name="player.isPlaying.value ? 'material-symbols:pause-rounded' : 'material-symbols:radio'" size="18" aria-hidden="true" />
          {{ player.isPlaying.value ? 'Pause Radio' : 'Putar Radio' }}
        </button>
      </div>

      <!-- ── Now playing ticker ────────────────────────────────── -->
      <Transition name="slide-up">
        <div v-if="player.isPlaying.value && player.currentTrack()" class="mt-6 flex justify-start md:justify-center">
          <div class="inline-flex items-center gap-2.5 bg-bg-card/70 backdrop-blur-md border border-accent/20 rounded-full px-4 py-2 text-[0.75rem] text-text-muted">
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

      <!-- ── Scroll indicator ──────────────────────────────────── -->
      <div class="absolute bottom-5 left-0 right-0 flex justify-center animate-[fadeIn_1s_ease_1s_both]" :class="player.isPlaying.value ? 'hidden sm:flex' : 'flex'">
        <button class="flex flex-col items-center gap-1 text-text-muted hover:text-accent transition-colors cursor-pointer bg-transparent border-none" @click="scrollToContent">
          <span class="text-[0.65rem] font-bold tracking-widest uppercase opacity-60">Scroll</span>
          <Icon name="material-symbols:keyboard-arrow-down-rounded" class="text-2xl animate-bounce" aria-hidden="true" />
        </button>
      </div>

    </div>

    <!-- ── Polaroid collage — compass stars around center ──────── -->
    <div class="polaroid-collage absolute right-0 top-[25%] md:top-[30%] -translate-y-1/3 w-full md:w-[460px] h-[640px] md:h-[820px] pointer-events-none z-0 transform-gpu" aria-hidden="true">
      <div v-for="(photo, i) in polaroids" :key="photo.id" class="polaroid absolute" :style="photo.style">
        <div class="polaroid-frame">
          <AppImg :src="photo.src" :alt="photo.alt" class="w-full h-full object-cover rounded-sm" @error="onImgError($event, photo.id)" />
          <p class="polaroid-caption">{{ photo.caption }}</p>
        </div>
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

const polaroids = [
  { id: 'p1', alt: 'Kegiatan OSIS Nawasena', caption: 'Program Kerja', style: { top: '8%', left: '0%', width: '150px', rotate: '-8deg' } },
  { id: 'p2', alt: 'Agenda Sekolah', caption: 'Agenda', style: { top: '22%', left: '58%', width: '170px', rotate: '6deg' } },
  { id: 'p3', alt: 'Radio Nawasena', caption: 'Radio', style: { top: '42%', left: '0%', width: '140px', rotate: '-12deg' } },
  { id: 'p4', alt: 'Dokumentasi Kegiatan', caption: 'Dokumentasi', style: { top: '58%', left: '42%', width: '160px', rotate: '9deg' } },
  { id: 'p5', alt: 'Kotak Saran', caption: 'Aspirasi', style: { top: '12%', left: '72%', width: '130px', rotate: '-5deg' } },
  { id: 'p6', alt: 'Filosofi Nawasena', caption: 'Filosofi', style: { top: '68%', left: '8%', width: '150px', rotate: '7deg' } },
]

function onImgError(e: Event, id: string) {
  const img = e.target as HTMLImageElement
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect fill="#f3f1fe" width="200" height="200"/>
      <circle cx="100" cy="100" r="60" fill="#e0e0ff"/>
      <text x="100" y="105" font-family="Inter,sans-serif" font-size="14" font-weight="600" fill="#6b6882" text-anchor="middle">Nawasena</text>
    </svg>
  `)}`
  img.onerror = null
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

.polaroid-collage { overflow: visible; }
.polaroid { transition: transform 0.4s ease, filter 0.3s ease; will-change: transform; }

.polaroid-frame {
  position: relative;
  width: 100%;
  height: auto;
  aspect-ratio: 1;
  background: #ffffff;
  padding: 10px 10px 28px 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.polaroid-frame > img { width: 100%; height: 100%; object-fit: cover; border-radius: 2px; }
.polaroid-caption {
  margin: 6px 0 0 0;
  font-family: Inter, system-ui, sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  color: #1c1a3e;
  letter-spacing: 0.04em;
  text-align: center;
  line-height: 1.2;
}

@media (prefers-reduced-motion: reduce) {
  .polaroid { animation: none !important; transform: none !important; }
  .animate-float, [class*="animate-[float"] { animation: none !important; }
}
</style>
