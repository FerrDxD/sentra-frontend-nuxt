<template>
  <article
    class="relative flex flex-col bg-bg-card rounded-[16px] border p-7 h-full transition-all duration-300"
    :class="featured
      ? 'border-accent/40 shadow-md'
      : 'border-border shadow hover:-translate-y-1 hover:shadow-md'"
  >
    <span
      v-if="featured"
      class="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 bg-accent text-white text-[0.68rem] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full"
    >
      <Icon name="material-symbols:auto-awesome" class="text-[0.9rem]" aria-hidden="true" />
      Direkomendasikan
    </span>

    <div class="flex items-center gap-3 mb-6">
      <span class="w-11 h-11 rounded-[10px] flex items-center justify-center bg-accent-soft text-accent shrink-0">
        <Icon :name="icon" class="text-[1.4rem]" aria-hidden="true" />
      </span>
      <div class="min-w-0">
        <p class="text-[0.68rem] font-bold tracking-[0.14em] uppercase text-text-subtle leading-none mb-1">{{ label }}</p>
        <h3 class="text-[1.15rem] font-bold text-text-main leading-tight">{{ title }}</h3>
      </div>
    </div>

    <div class="mb-1">
      <span class="text-[1.9rem] font-extrabold tracking-tight text-text-main tabular-nums">{{ price }}</span>
      <span class="text-text-subtle text-[0.82rem] font-medium ml-1">/ paket</span>
    </div>
    <p class="text-[0.86rem] text-text-muted leading-relaxed mb-6">{{ desc }}</p>

    <hr class="border-t border-border mb-5" />

    <ul class="flex-1 flex flex-col gap-3 mb-6">
      <li
        v-for="(perk, i) in perks"
        :key="i"
        class="flex items-start gap-2.5 text-[0.86rem] text-text-muted leading-snug"
      >
        <Icon name="material-symbols:check-circle-rounded" class="text-accent text-[1.1rem] shrink-0 mt-[1px]" aria-hidden="true" />
        <span>{{ perk }}</span>
      </li>
    </ul>

    <a
      href="#sponsor-form"
      class="inline-flex items-center justify-center gap-2 rounded-[16px] py-3 px-5 font-semibold text-[0.9rem] transition-colors duration-200 no-underline"
      :class="featured
        ? 'bg-accent text-white hover:bg-accent-hover shadow-md'
        : 'border border-accent/30 text-accent hover:bg-accent-soft'"
    >
      Pilih Paket
      <Icon name="material-symbols:arrow-forward" class="text-[1.1rem]" aria-hidden="true" />
    </a>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  label: string
  title: string
  desc: string
  perks: string[]
  price: string
  featured?: boolean
}>()
</script>