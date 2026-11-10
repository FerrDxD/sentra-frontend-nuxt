<template>
  <div
    ref="el"
    class="mb-8 transition-all duration-700"
    :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'"
  >
    <h2
      :id="id"
      class="text-[1.55rem] md:text-[1.9rem] font-extrabold tracking-tight mb-2 text-text-main"
    >
      {{ title }}
    </h2>
    <p v-if="subtitle" class="text-text-muted text-[0.95rem] leading-relaxed max-w-[560px]">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  id?: string
}>()

const { el, isVisible } = useScrollReveal()
</script>