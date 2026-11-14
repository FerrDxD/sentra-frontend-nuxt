<template>
  <footer class="border-t border-border bg-bg-card relative">
    <!-- Ambient glow -->
    <div class="absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-accent/10 via-transparent to-transparent pointer-events-none" />

    <div class="max-w-[1120px] mx-auto px-4 md:px-6 py-14 md:py-20 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-14">

        <!-- Bottom-left: brand / context -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center gap-2 mb-5">
            <div class="w-9 h-9 rounded-sm bg-accent flex items-center justify-center">
              <Icon name="material-symbols:star-rounded" class="text-white text-[13px]" aria-hidden="true" />
            </div>
            <span class="font-black text-[1.15rem] tracking-tight text-text-main">SENTRA<span class="text-accent">.</span></span>
          </div>
          <p class="text-text-muted text-sm leading-relaxed max-w-[320px]">
            Sistem Elektronik Terpadu Nawasena (OSIS/MPK)<br />
            SMAN 2 Jonggol
          </p>
          <div class="mt-7 text-text-muted text-[0.8rem] font-medium uppercase tracking-widest">KABINET NAWASENA · 2025/2026</div>
        </div>

        <!-- Bottom-right: nav + sosial + alamat -->
        <div class="md:col-span-2">
          <div class="flex flex-wrap justify-end gap-7 md:justify-start mb-7">
            <div class="space-y-2">
              <span class="text-[0.7rem] font-bold tracking-widest uppercase text-accent">Navigasi</span>
              <NuxtLink to="/" class="text-text-muted hover:text-accent transition-colors text-sm no-underline">Beranda</NuxtLink>
              <NuxtLink to="/struktur" class="text-text-muted hover:text-accent transition-colors text-sm no-underline">Struktur Organisasi</NuxtLink>
              <NuxtLink to="/program" class="text-text-muted hover:text-accent transition-colors text-sm no-underline">Program Kerja</NuxtLink>
              <NuxtLink to="/dokumentasi" class="text-text-muted hover:text-accent transition-colors text-sm no-underline">Dokumentasi</NuxtLink>
              <NuxtLink to="/hof" class="text-text-muted hover:text-accent transition-colors text-sm no-underline">Hall of Fame</NuxtLink>
              <NuxtLink to="/sponsor" class="text-text-muted hover:text-accent transition-colors text-sm no-underline">Sponsorship</NuxtLink>
            </div>
          </div>

          <div class="pt-7 border-t border-border flex flex-col md:flex-row items-center justify-between gap-5">
            <div class="flex items-center gap-2">
              <span class="text-[0.7rem] font-bold tracking-widest uppercase text-accent">Sosial Media</span>
              <div class="flex items-center gap-2">
                <a href="https://instagram.com/ofc.osissmandjo" target="_blank" rel="noopener" class="w-7 h-7 rounded-full bg-bg-card-2 border border-border flex items-center justify-center text-text-subtle hover:text-accent hover:border-accent transition-colors text-[11px]">
                  <Icon name="material-symbols:instagram" aria-hidden="true" />
                </a>
                <a href="https://whatsapp.com/channel/0029Va9sy8bqFQKdWqZZtG0i" target="_blank" rel="noopener" class="w-7 h-7 rounded-full bg-bg-card-2 border border-border flex items-center justify-center text-text-subtle hover:text-accent hover:border-accent transition-colors text-[11px]">
                  <Icon name="material-symbols:whatsapp" aria-hidden="true" />
                </a>
                <a href="mailto:osissmanduajonggol@gmail.com" class="w-7 h-7 rounded-full bg-bg-card-2 border border-border flex items-center justify-center text-text-subtle hover:text-accent hover:border-accent transition-colors text-[11px]">
                  <Icon name="material-symbols:mail" aria-hidden="true" />
                </a>
              </div>
            </div>
            <div class="text-right">
              <p class="text-text-muted text-sm leading-relaxed">
                SMAN 2 Jonggol<br />
                Jl. Irigasi, Bengkok RT 002/009, Jonggol, Kec. Jonggol<br />
                Kab. Bogor, Jawa Barat
              </p>
              <button class="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent-hover transition-colors no-underline">
                <span>Buka di Google Maps</span>
                <Icon name="material-symbols:open-in-new" class="text-[11px]" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-14 pt-9 border-t border-border flex flex-col md:flex-row items-center justify-between gap-5 text-[0.72rem] text-text-muted">
        <span>© <span id="year"></span> SENTRA · Nawasena SMAN 2 Jonggol</span>
        <span class="flex items-center gap-1">
          <span class="text-[10px]">Tim Developer Nawasena</span>
          <Icon name="material-symbols:favorite" class="text-[10px] text-accent" aria-hidden="true" />
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
onMounted(() => {
  const el = document.getElementById('year')
  if (el) el.textContent = new Date().getFullYear().toString()
})
</script>
