<template>
  <div ref="el" class="transition-all duration-700" :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'">
    <div class="relative bg-bg-card border border-border rounded-[24px] px-7 py-10 md:px-10 md:py-14 shadow overflow-hidden group hover:shadow-[0_20px_50px_rgba(99,102,241,0.14)] transition-all duration-500 hover:border-accent/50">
      <!-- Stamp motif (cap resmi indigo di pojok) -->
      <div class="absolute top-6 right-6 w-20 h-20 rounded-full border border-accent/30 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-accent/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        NAWASENA
      </div>

      <!-- Left margin rule (garis pinggir kiri lembar kerja) -->
      <div class="absolute left-0 top-0 bottom-0 w-[4px] bg-accent rounded-l-[24px]" />

      <p class="leading-relaxed text-[0.97rem] md:text-[1.05rem] text-text-main relative z-10">
        Nama <strong class="text-accent underline underline-offset-2 decoration-[1px] decoration-accent">Nawasena</strong> yang diambil dari bahasa Sanskerta secara ontologis menempatkan organisasi ini pada posisi kompas moral yang mengarahkan pandangan jauh ke cakrawala.
        <em class="not-italic font-semibold text-text-main">Masa depan yang cerah</em> bukan sekadar angan, namun menjadi jangkar bagi setiap tindakan yang diambil oleh para pengurusnya. Di sini, Nawasena berperan sebagai payung besar atau
        <em class="not-italic font-semibold text-text-main">oikos</em> yang menaungi OSIS dan MPK dalam satu napas perjuangan yang harmonis.
      </p>

      <div class="flex flex-wrap gap-2 mt-10 relative z-10">
        <span v-for="chip in chips" :key="chip.word" class="inline-flex items-center gap-1.5 text-[0.72rem] font-semibold px-2.5 py-1 rounded-full border border-accent/30 bg-accent-soft text-accent">
          <Icon :name="chip.icon" class="text-sm" aria-hidden="true" />
          <span class="font-bold">{{ chip.word }}</span>
          <span class="opacity-60">·</span>
          <span>{{ chip.meaning }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { el, isVisible } = useScrollReveal()

const chips = [
  { word: 'Nawa', meaning: 'Baru', icon: 'material-symbols:brightness-9-rounded' },
  { word: 'Sena', meaning: 'Kekuatan / Pasukan', icon: 'material-symbols:public-rounded' },
  { word: 'Nawasena', meaning: 'Pasukan Pembawa Perubahan Dengan Masa Depan Yang Cerah', icon: 'material-symbols:lightbulb-rounded' },
]
</script>
