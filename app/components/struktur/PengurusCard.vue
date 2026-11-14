<template>
  <div
    class="pengurus-card group relative flex flex-col bg-bg-card border border-border rounded-[22px] transition-all duration-300 ease-out cursor-pointer shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:border-accent/40 will-change-transform overflow-hidden"
    :class="[
      isFeatured
        ? 'col-span-2 md:col-span-2 flex flex-col sm:flex-row items-center text-center sm:text-left p-5 sm:p-6 md:p-7 border-accent/30 bg-bg-card-2/60'
        : 'flex-col items-center justify-center text-center p-[1.5rem_1rem_1.4rem]',
    ]"
    @click="$emit('click')"
  >
    <!-- Avatar -->
    <div
      class="shrink-0 transition-transform duration-300 ease-out group-hover:scale-[1.03] z-10"
      :class="[
        isFeatured
          ? 'w-[88px] h-[88px] sm:w-[104px] sm:h-[104px] md:w-[128px] md:h-[128px]'
          : 'w-[100px] h-[100px] mb-3.5',
      ]"
    >
      <AppImg
        :src="useImageUrl(pengurus.foto, pengurus.nama)"
        :alt="pengurus.nama"
        rounded="full"
        img-class="border-[3px] border-transparent group-hover:border-accent transition-colors duration-300"
        class="w-full h-full rounded-full"
        @error="onImgError"
      />
    </div>

    <!-- Info -->
    <div class="flex flex-col flex-1 min-w-0 z-10" :class="isFeatured ? 'items-center sm:items-start gap-1.5' : 'items-center gap-1'">
      <span class="inline-flex items-center gap-1 bg-accent-soft text-accent px-3 py-1 rounded-md text-[0.65rem] font-bold tracking-[0.08em] uppercase mb-0.5">
        <Icon v-if="isFeatured" name="material-symbols:workspace-premium-rounded" class="text-[0.85rem]" aria-hidden="true" />
        {{ pengurus.jabatan }}
      </span>
      <h3
        class="m-0 font-extrabold text-text-main leading-tight transition-colors duration-200 group-hover:text-accent"
        :class="isFeatured ? 'text-[1.2rem] sm:text-[1.4rem] md:text-[1.5rem]' : 'text-[1.05rem]'"
      >
        {{ pengurus.nama }}
      </h3>

      <!-- Motto (featured only) -->
      <p
        v-if="isFeatured && pengurus.motto"
        class="mt-1.5 mb-0 text-[0.85rem] sm:text-[0.9rem] text-text-muted italic leading-relaxed font-medium max-w-[90%] sm:max-w-none mx-auto sm:mx-0"
      >
        "{{ pengurus.motto }}"
      </p>

      <!-- Class chip (regular cards) -->
      <span
        v-if="!isFeatured && pengurus.kelas"
        class="mt-1.5 text-[0.68rem] font-semibold text-text-subtle uppercase tracking-wider"
      >{{ pengurus.kelas }}</span>
    </div>

    <!-- Featured: subtle bottom accent line -->
    <div
      v-if="isFeatured"
      class="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/60 to-transparent"
      aria-hidden="true"
    />
  </div>
</template>

<script setup lang="ts">
import { useImageUrl } from '~/composables/useImageUrl'

defineProps<{
  pengurus: any
  isFeatured?: boolean
}>()

defineEmits(['click'])

function onImgError(e: Event) {
  const img = e.target as HTMLImageElement
  img.src = useImageUrl('', img.alt)
  img.onerror = null
}
</script>
