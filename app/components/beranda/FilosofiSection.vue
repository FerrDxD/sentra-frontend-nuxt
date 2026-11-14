<template>
  <div ref="el" class="transition-all duration-700" :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'">
    <div class="relative bg-bg-card border border-border rounded-[24px] px-6 py-8 md:px-10 md:py-12 shadow overflow-hidden group hover:shadow-[0_16px_48px_rgba(99,102,241,0.14)] transition-all duration-500 hover:border-accent/40">
      <!-- Accent bar (compass needle) -->
      <div class="absolute left-0 inset-y-0 w-[4px] bg-gradient-to-b from-accent to-accent-hover rounded-l-[24px]" />
      <!-- BG glow -->
      <div class="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-purple-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <Icon name="material-symbols:format-quote-rounded" class="absolute top-6 right-6 text-5xl text-accent/10 group-hover:text-accent/20 transition-colors duration-500" aria-hidden="true" />

      <p class="leading-relaxed text-[0.97rem] md:text-[1.05rem] text-text-main relative z-10">
        Nama <strong class="text-accent">Nawasena</strong> yang diambil dari bahasa Sanskerta secara ontologis menempatkan organisasi ini pada posisi kompas moral yang mengarahkan pandangan jauh ke cakrawala.
        <em class="not-italic font-semibold text-purple-500">Masa depan yang cerah</em> bukan sekadar angan, namun menjadi jangkar bagi setiap tindakan yang diambil oleh para pengurusnya. Di sini, Nawasena berperan sebagai payung besar atau
        <em class="not-italic font-semibold text-pink-500">oikos</em> yang menaungi OSIS dan MPK dalam satu napas perjuangan yang harmonis.
      </p>

      <div class="flex flex-wrap gap-2 mt-8 relative z-10">
        <span v-for="chip in chips" :key="chip.word" class="inline-flex items-center gap-1.5 text-[0.72rem] font-semibold px-2.5 py-1 rounded-full border" :class="chip.class">
          <Icon :name="chip.icon" class="text-sm" aria-hidden="true" />
          <span class="font-bold">{{ chip.word }}</span>
          <span class="opacity-70">·</span>
          <span>{{ chip.meaning }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { el, isVisible } = useScrollReveal()

const chips = [
  { word: 'Nawa', meaning: 'Baru', icon: 'material-symbols:brightness-9-rounded', class: 'bg-accent-soft text-accent border-accent/20' },
  { word: 'Sena', meaning: 'Kekuatan / Pasukan', icon: 'material-symbols:public-rounded', class: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  { word: 'Nawasena', meaning: 'Pasukan Pembawa Perubahan Dengan Masa Depan Yang Cerah', icon: 'material-symbols:lightbulb-rounded', class: 'bg-pink-500/10 text-pink-500 border-pink-500/20' },
]
</script>
