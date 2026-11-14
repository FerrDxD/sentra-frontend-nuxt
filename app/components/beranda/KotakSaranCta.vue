<template>
  <div
    ref="el"
    class="transition-all duration-700"
    :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
  >
    <div
      class="relative rounded-2xl overflow-hidden bg-gradient-to-br from-accent via-purple-500 to-pink-500 p-px"
    >
      <div class="relative rounded-[calc(1rem-1px)] bg-bg-card px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 overflow-hidden">
        <!-- BG pattern -->
        <div
          class="absolute inset-0 opacity-[0.025]"
          style="background-image: radial-gradient(circle, rgba(99,102,241,0.8) 1px, transparent 1px); background-size: 20px 20px;"
        />
        <!-- Glow -->
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

        <!-- Icon -->
        <div
          class="shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center shadow-[0_8px_25px_rgba(99,102,241,0.4)]"
        >
          <Icon name="material-symbols:mail-rounded" class="text-white text-3xl" aria-hidden="true" />
        </div>

        <div class="flex-1 text-center md:text-left relative z-10">
          <h3 class="text-[1.15rem] md:text-[1.35rem] font-extrabold text-text-main mb-1.5 tracking-tight">
            Kotak Saran Nawasena
          </h3>
          <p class="text-text-muted text-[0.88rem] leading-relaxed m-0">
            Punya ide, kritik, atau aspirasi? Sampaikan secara anonim. Setiap suaramu berarti bagi kami.
          </p>
        </div>

        <div class="shrink-0 relative z-10">
          <button
          class="inline-flex items-center gap-2 bg-gradient-to-br from-accent to-purple-500 text-white px-5 py-2.5 rounded-xl font-bold text-[0.9rem] no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(99,102,241,0.45)] active:scale-95"
          @click="openAurora"
          >
            <Icon name="material-symbols:edit-rounded" size="18" aria-hidden="true" />
            Isi Sekarang
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { el, isVisible } = useScrollReveal()
const isAuroraOpen = useState('isAuroraOpen', () => false)
const openAurora = () => { isAuroraOpen.value = true }
</script>
