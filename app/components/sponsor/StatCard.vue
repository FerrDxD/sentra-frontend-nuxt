<template>
  <div class="bg-bg-card rounded-[16px] p-6 text-center border border-border shadow h-full">
    <Icon :name="icon" class="text-[1.6rem] text-accent mb-3 mx-auto block" aria-hidden="true" />
    <span class="block text-[2.1rem] font-extrabold leading-none text-text-main tabular-nums">
      <span ref="numEl" aria-hidden="true">0{{ suffix }}</span>
      <span class="sr-only">{{ target }}{{ suffix }}</span>
    </span>
    <span class="block text-text-muted text-[0.82rem] font-medium mt-2">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  icon: string
  target: number
  suffix?: string
  label: string
}>()

const numEl = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null
let timer: number | undefined

onMounted(() => {
  if (!import.meta.client || !numEl.value) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (numEl.value) numEl.value.textContent = String(props.target) + (props.suffix || '')
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          runCounter()
          observer?.unobserve(e.target)
        }
      })
    },
    { threshold: 0.4 },
  )
  observer.observe(numEl.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  if (timer) window.clearInterval(timer)
})

function runCounter() {
  const steps = Math.ceil(1600 / 16)
  const inc = props.target / steps
  let cur = 0
  timer = window.setInterval(() => {
    cur = Math.min(cur + inc, props.target)
    if (numEl.value) numEl.value.textContent = Math.floor(cur) + (props.suffix || '')
    if (cur >= props.target && timer) window.clearInterval(timer)
  }, 16)
}
</script>