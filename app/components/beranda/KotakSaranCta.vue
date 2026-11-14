<template>
  <div ref="el" class="transition-all duration-700" :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'">
    <div class="relative rounded-[24px] overflow-hidden bg-accent p-[1px]">
      <div class="relative rounded-[calc(1rem-1px)] bg-bg-card px-7 py-10 md:px-10 md:py-12 flex flex-col md:flex-row items-center gap-7 md:gap-10 overflow-hidden">
        <!-- Icon -->
        <div class="shrink-0 w-18 h-18 rounded-[20px] bg-accent flex items-center justify-center shadow-[0_8px_25px_rgba(99,102,241,0.4)]">
          <Icon name="material-symbols:mail-rounded" class="text-white text-[32px]" aria-hidden="true" />
        </div>

        <div class="flex-1 text-center md:text-left relative z-10">
          <h3 class="text-[1.15rem] md:text-[1.4rem] font-black text-text-main mb-2 tracking-tight">Kotak Saran Nawasena</h3>
          <p class="text-text-muted text-[0.88rem] leading-relaxed m-0">Punya ide, kritik, atau aspirasi? Sampaikan secara anonim. Setiap suaramu berarti bagi kami.</p>
        </div>

        <div class="shrink-0 relative z-10">
          <button class="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-[16px] font-bold text-[0.9rem] no-underline transition-all duration-200 hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(99,102,241,0.45)] active:scale-95" @click="openAurora">
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
