<template>
  <div ref="el" class="transition-all duration-700" :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'">
    <div class="relative bg-bg-card border border-border rounded-[24px] overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-accent/[0.03] via-transparent to-transparent pointer-events-none" />
      <div class="absolute top-0 right-0 w-56 h-56 rounded-full bg-accent/5 blur-[80px] pointer-events-none -translate-y-1/4 translate-x-1/4" />

      <div class="relative z-10 p-7 md:p-9">
        <div class="flex items-center justify-between gap-3 mb-7">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0 shadow-[0_4px_15px_rgba(99,102,241,0.35)]">
              <Icon name="material-symbols:radio" class="text-white text-xl" :class="{ 'animate-pulse': player.isPlaying.value }" aria-hidden="true" />
            </div>
            <div>
              <h3 class="text-[0.95rem] font-bold text-text-main m-0 leading-tight">Radio Nawasena</h3>
              <p class="text-[0.72rem] text-text-muted m-0">Musik pengiring kegiatan</p>
            </div>
          </div>
          <div class="flex items-center gap-1.5">
            <button
              class="w-8 h-8 rounded-full bg-bg-card-2 border border-border flex items-center justify-center text-text-muted hover:bg-accent-soft hover:text-accent hover:border-accent/40 transition-all duration-200 cursor-pointer"
              title="Lagu sebelumnya"
              @click="player.prevTrack()"
            >
              <Icon name="material-symbols:skip-previous-rounded" size="16" aria-hidden="true" />
            </button>
            <button
              class="w-11 h-11 rounded-full bg-accent flex items-center justify-center text-white shadow-[0_4px_12px_rgba(99,102,241,0.4)] transition-all duration-200 cursor-pointer hover:bg-accent-hover hover:scale-105 hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)] active:scale-95"
              @click="handlePlayPause"
            >
              <Icon
                :name="player.isPlaying.value ? 'material-symbols:pause-rounded' : 'material-symbols:play-arrow-rounded'"
                size="22"
                aria-hidden="true"
              />
            </button>
            <button
              class="w-8 h-8 rounded-full bg-bg-card-2 border border-border flex items-center justify-center text-text-muted hover:bg-accent-soft hover:text-accent hover:border-accent/40 transition-all duration-200 cursor-pointer"
              title="Lagu berikutnya"
              @click="player.nextTrack()"
            >
              <Icon name="material-symbols:skip-next-rounded" size="16" aria-hidden="true" />
            </button>
          </div>
        </div>

        <!-- Now playing bar -->
        <div
          v-if="player.currentTrack()"
          class="flex items-center gap-3 bg-bg-card-2 border border-border rounded-[16px] px-3.5 py-3 mb-7"
        >
          <div class="flex items-end gap-[3px] h-4 shrink-0" :class="{ 'opacity-30': !player.isPlaying.value }">
            <span class="w-[3px] rounded-full bg-accent" :class="player.isPlaying.value ? 'animate-[eq1_0.7s_ease-in-out_infinite]' : 'h-[4px]'" />
            <span class="w-[3px] rounded-full bg-accent" :class="player.isPlaying.value ? 'animate-[eq2_0.7s_ease-in-out_0.12s_infinite]' : 'h-[2px]'" />
            <span class="w-[3px] rounded-full bg-accent" :class="player.isPlaying.value ? 'animate-[eq3_0.7s_ease-in-out_0.24s_infinite]' : 'h-[3px]'" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[0.72rem] text-text-muted mb-0.5 m-0">Sedang Diputar</p>
            <p class="text-[0.85rem] font-semibold text-text-main m-0 truncate">
              {{ player.currentTrack()?.judul || player.currentTrack()?.title || 'Memuat...' }}
            </p>
          </div>
          <span v-if="player.isPlaying.value" class="text-[0.62rem] font-bold text-accent bg-accent-soft px-1.5 py-0.5 rounded-full shrink-0">LIVE</span>
        </div>

        <div v-else-if="loading" class="flex items-center gap-3 mb-7">
          <div class="h-11 flex-1 rounded-[16px] bg-bg-card-2 animate-pulse" />
        </div>

        <!-- Playlist (lembar daftar putar) -->
        <div v-if="player.playlist.value.length > 0" class="flex flex-col gap-1 max-h-[200px] overflow-y-auto pr-2" style="scrollbar-width: thin; scrollbar-color: var(--accent-soft) transparent;">
          <div
            v-for="(track, idx) in player.playlist.value"
            :key="track.id || idx"
            class="flex items-center gap-2.5 px-3 py-2.5 rounded-[14px] cursor-pointer transition-all duration-150 group/track"
            :class="player.currentTrackIndex.value === idx ? 'bg-accent-soft text-accent' : 'hover:bg-bg-card-2 text-text-muted hover:text-text-main'"
            @click="player.playTrack(idx)"
          >
            <span class="text-[0.62rem] font-bold w-5 shrink-0 text-center" :class="player.currentTrackIndex.value === idx ? 'text-accent' : 'text-text-subtle'">
              <template v-if="player.currentTrackIndex.value === idx && player.isPlaying.value">
                <Icon name="material-symbols:volume-up-rounded" class="text-sm" aria-hidden="true" />
              </template>
              <template v-else>{{ idx + 1 }}</template>
            </span>
            <span class="text-[0.82rem] flex-1 truncate font-medium" :class="{ 'font-bold': player.currentTrackIndex.value === idx }">{{ track.judul || track.title }}</span>
            <Icon name="material-symbols:play-circle-outline-rounded" class="text-base opacity-0 group-hover/track:opacity-100 transition-opacity shrink-0" :class="{ 'opacity-100 text-accent': player.currentTrackIndex.value === idx }" aria-hidden="true" />
          </div>
        </div>

        <div v-else-if="!loading" class="flex flex-col items-center gap-2 py-8 text-text-muted text-sm">
          <Icon name="material-symbols:music-off-rounded" class="text-3xl opacity-30" aria-hidden="true" />
          <span>Tidak ada lagu tersedia</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const player = useMusicPlayer()
const { el, isVisible } = useScrollReveal()
const loading = ref(true)

onMounted(async () => {
  await player.loadPlaylist()
  loading.value = false
})

const handlePlayPause = async () => {
  if (player.playlist.value.length === 0) {
    loading.value = true
    await player.loadPlaylist()
    loading.value = false
  }
  if (player.playlist.value.length === 0) return
  player.togglePlay()
}
</script>

<style>
@keyframes eq1 { 0%, 100% { height: 4px; } 50% { height: 14px; } }
@keyframes eq2 { 0%, 100% { height: 10px; } 50% { height: 4px; } }
@keyframes eq3 { 0%, 100% { height: 6px; } 50% { height: 14px; } }
</style>
