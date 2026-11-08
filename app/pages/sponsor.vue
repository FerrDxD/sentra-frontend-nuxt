<template>
  <div class="bg-bg-primary text-text-main transition-colors duration-300">
    <!-- ── Hero ─────────────────────────────────────────────── -->
    <section aria-label="Sponsorship" class="pt-28 md:pt-36 pb-16 md:pb-20 text-center relative">
      <div class="max-w-[1120px] mx-auto px-4 md:px-6">
        <h1 class="text-[clamp(2rem,6vw,3.6rem)] font-extrabold tracking-tight leading-[1.1] mb-5 text-text-main">
          Akselerasi generasi muda<br>bersama <span class="text-accent">Nawasena</span>
        </h1>
        <p class="text-text-muted text-[1rem] md:text-[1.1rem] max-w-[600px] mx-auto mb-8 leading-relaxed">
          Jadilah bagian dari langkah bermakna kami. OSIS SMAN 2 Jonggol membuka peluang kerjasama eksklusif bagi Mitra yang memiliki visi sejalan.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#sponsor-form"
            @click.prevent="scrollToId('sponsor-form')"
            class="inline-flex items-center justify-center gap-2 bg-accent text-white rounded-[16px] px-7 py-3.5 font-semibold text-[0.95rem] no-underline transition-colors duration-200 hover:bg-accent-hover shadow-md"
          >
            Kirim Penawaran
            <Icon name="material-symbols:arrow-forward" class="text-[1.1rem]" aria-hidden="true" />
          </a>
          <a
            href="#sponsor-tiers"
            @click.prevent="scrollToId('sponsor-tiers')"
            class="inline-flex items-center justify-center gap-2 border border-accent/30 text-accent rounded-[16px] px-7 py-3.5 font-semibold text-[0.95rem] no-underline transition-colors duration-200 hover:bg-accent-soft"
          >
            Lihat Paket
            <Icon name="material-symbols:keyboard-arrow-down-rounded" class="text-[1.2rem]" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>

    <main class="max-w-[1120px] mx-auto px-4 md:px-6 pb-4">
      <!-- ── Stats ──────────────────────────────────────────── -->
      <section aria-label="Statistik" class="pb-16 md:pb-20">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SponsorStatCard
            v-for="stat in stats"
            :key="stat.label"
            :icon="stat.icon"
            :target="stat.value"
            :suffix="stat.suffix"
            :label="stat.label"
          />
        </div>
      </section>

      <!-- ── Tiers ──────────────────────────────────────────── -->
      <section id="sponsor-tiers" aria-labelledby="tiers-title" class="pb-16 md:pb-20 scroll-mt-24">
        <SponsorSectionHeading
          id="tiers-title"
          title="Paket Sponsorship"
          subtitle="Pilih tingkatan yang sesuai dengan kontribusi dan kebutuhan visibilitas Anda."
        />
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10 items-stretch">
          <SponsorTierCard
            v-for="tier in tiers"
            :key="tier.id"
            :icon="tier.icon"
            :label="tier.label"
            :title="tier.title"
            :desc="tier.desc"
            :price="tier.price"
            :perks="tier.perks"
            :featured="tier.featured"
          />
        </div>
      </section>

      <!-- ── Partner types ──────────────────────────────────── -->
      <section aria-labelledby="types-title" class="pb-16 md:pb-20">
        <SponsorSectionHeading
          id="types-title"
          title="Tipe Kemitraan"
          subtitle="Lebih dari sekadar sponsor — kami percaya pada kolaborasi yang saling menguntungkan dan bermakna."
        />
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div
            v-for="type in partnerTypes"
            :key="type.title"
            class="group relative bg-bg-card rounded-[16px] p-7 border border-border shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <span class="w-12 h-12 rounded-[10px] flex items-center justify-center bg-accent-soft text-accent mb-5">
              <Icon :name="type.icon" class="text-[1.5rem]" aria-hidden="true" />
            </span>
            <h3 class="text-[1.15rem] font-bold text-text-main mb-2">{{ type.title }}</h3>
            <p class="text-text-muted text-[0.9rem] leading-relaxed">{{ type.desc }}</p>
          </div>
        </div>
      </section>

      <!-- ── Partners marquee ───────────────────────────────── -->
      <section aria-labelledby="partners-title" class="pb-16 md:pb-20">
        <SponsorSectionHeading
          id="partners-title"
          title="Mitra Kami"
          subtitle="Terima kasih kepada seluruh pihak yang telah mendukung perjalanan Nawasena."
        />
        <div class="partner-marquee relative overflow-hidden py-1">
          <div class="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none hidden md:block" aria-hidden="true" />
          <div class="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none hidden md:block" aria-hidden="true" />

          <div class="partner-track flex w-max motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:gap-3 motion-reduce:justify-center">
            <div class="flex gap-4 pr-4 shrink-0 motion-reduce:flex-wrap motion-reduce:pr-0 motion-reduce:justify-center">
              <span
                v-for="partner in partners"
                :key="partner"
                class="inline-flex items-center gap-2 bg-bg-card border border-border rounded-[14px] px-5 py-3 font-semibold text-[0.9rem] text-text-muted shadow whitespace-nowrap"
              >
                <span class="w-2 h-2 rounded-full bg-accent/50 shrink-0" aria-hidden="true"></span>
                {{ partner }}
              </span>
            </div>
            <div class="flex gap-4 pr-4 shrink-0 motion-reduce:hidden" aria-hidden="true">
              <span
                v-for="partner in partners"
                :key="`dup-${partner}`"
                class="inline-flex items-center gap-2 bg-bg-card border border-border rounded-[14px] px-5 py-3 font-semibold text-[0.9rem] text-text-muted shadow whitespace-nowrap"
              >
                <span class="w-2 h-2 rounded-full bg-accent/50 shrink-0" aria-hidden="true"></span>
                {{ partner }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- ── CTA strip ──────────────────────────────────────── -->
      <section aria-label="Hubungi kami" class="pb-16 md:pb-20">
        <div class="relative overflow-hidden bg-accent rounded-[24px] px-6 py-12 md:px-12 md:py-14 text-center shadow-lg">
          <div class="absolute w-[400px] h-[400px] rounded-full bg-white/5 -top-[180px] -left-[120px] pointer-events-none" aria-hidden="true"></div>
          <div class="absolute w-[280px] h-[280px] rounded-full bg-white/5 -bottom-[140px] right-[4%] pointer-events-none" aria-hidden="true"></div>

          <h2 class="relative z-10 text-white text-[1.6rem] md:text-[2rem] font-extrabold mb-3">
            Ada Pertanyaan? Hubungi Kami Langsung
          </h2>
          <p class="relative z-10 text-white/85 text-[0.98rem] max-w-[480px] mx-auto mb-8 leading-relaxed">
            Tim Sekretariat OSIS Nawasena siap mendiskusikan paket kerjasama yang paling sesuai dengan kebutuhan Anda.
          </p>
          <div class="relative z-10 flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
            <a
              href="mailto:osissmanduajonggol@gmail.com"
              class="inline-flex items-center gap-2.5 border border-white/30 text-white rounded-[16px] px-5 py-3 text-[0.9rem] font-semibold no-underline transition-colors duration-200 hover:bg-white/10"
            >
              <Icon name="material-symbols:mail" class="text-[1.1rem]" aria-hidden="true" />
              Email Kami
            </a>
            <a
              href="https://wa.me/6282299234269"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2.5 border border-white/30 text-white rounded-[16px] px-5 py-3 text-[0.9rem] font-semibold no-underline transition-colors duration-200 hover:bg-white/10"
            >
              <Icon name="mdi:whatsapp" class="text-[1.1rem]" aria-hidden="true" />
              WhatsApp
            </a>
            <a
              href="https://www.instagram.com/ofc.osissmandjo/"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2.5 border border-white/30 text-white rounded-[16px] px-5 py-3 text-[0.9rem] font-semibold no-underline transition-colors duration-200 hover:bg-white/10"
            >
              <Icon name="mdi:instagram" class="text-[1.1rem]" aria-hidden="true" />
              Instagram
            </a>
          </div>
        </div>
      </section>

      <!-- ── Form ───────────────────────────────────────────── -->
      <section class="pb-8">
        <SponsorForm />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
const stats = [
  { icon: 'material-symbols:group', value: 800, suffix: '', label: 'Siswa Aktif di Sekolah' },
  { icon: 'material-symbols:calendar-month', value: 12, suffix: '+', label: 'Program Kerja per Tahun' },
  { icon: 'material-symbols:emoji-events', value: 3, suffix: '', label: 'Event Besar per Semester' },
  { icon: 'material-symbols:public', value: 100, suffix: '%', label: 'Aktivitas Terdokumentasi Digital' },
]

const tiers = [
  {
    id: 'amethyst',
    icon: 'material-symbols:auto-awesome',
    label: 'Amethyst',
    title: 'Paket Dasar',
    price: 'Rp75.000',
    desc: 'Paket dasar untuk meningkatkan visibilitas brand melalui media publikasi acara.',
    perks: ['Penempatan Logo di Seluruh Media Publikasi (Flyer, Banner, Frame)'],
    featured: false,
  },
  {
    id: 'topaz',
    icon: 'material-symbols:grade',
    label: 'Topaz',
    title: 'Paket Standar',
    price: 'Rp150.000',
    desc: 'Paket standar dengan tambahan eksposur yang lebih luas untuk memperkuat awareness brand.',
    perks: [
      'Semua benefit Paket Amethyst',
      'Promosi Dalam Bentuk Video Melalui Media Sosial',
    ],
    featured: false,
  },
  {
    id: 'sapphire',
    icon: 'material-symbols:diamond',
    label: 'Sapphire',
    title: 'Paket Eksklusif',
    price: 'Rp200.000',
    desc: 'Paket eksklusif dengan manfaat maksimal, promosi menyeluruh dan fasilitas selama acara.',
    perks: [
      'Semua benefit Paket Topaz',
      'Penyebutan Oleh Master of Ceremony',
      'Kesempatan Untuk Membuka Kios saat Acara Berlangsung',
    ],
    featured: true,
  },
  {
    id: 'alexandrite',
    icon: 'material-symbols:workspace-premium',
    label: 'Alexandrite',
    title: 'Paket Premium',
    price: 'Rp350.000',
    desc: 'Paket premium yang memberikan peluang promosi lebih optimal serta interaksi langsung.',
    perks: [
      'Semua benefit Paket Sapphire',
      'Kesempatan berinteraksi secara langsung kepada siswa-siswi selama acara berlangsung',
      'Prioritas eksposur dan fasilitas paling lengkap selama acara',
    ],
    featured: false,
  },
]

const partnerTypes = [
  {
    icon: 'material-symbols:storefront',
    title: 'Mitra Bisnis & UMKM',
    desc: 'Untuk perusahaan dan pelaku usaha yang ingin meningkatkan brand awareness di kalangan pelajar dan keluarganya.',
  },
  {
    icon: 'material-symbols:school',
    title: 'Mitra Kampus & Institusi',
    desc: 'Untuk universitas dan lembaga pendidikan yang ingin menjangkau calon mahasiswa potensial.',
  },
  {
    icon: 'material-symbols:handshake',
    title: 'Mitra Alumni',
    desc: 'Untuk alumni yang ingin berkontribusi balik ke almamater.',
  },
]

const partners = [
  'Jeruk Mood',
  'Dimsum Hallo Dek',
  'Sempol Celup RJ',
  'Blink Photobox',
  'Nyareat Konveksi',
  'Ice Cream 88',
  'Dyputu Studio',
  'Green Living Co.',
  'Kedai Jajan Mba Pepi',
  'Ekspedisi Kilat',
]

function scrollToId(id: string) {
  if (import.meta.client) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

useSeoMeta({
  title: 'Sponsorship',
  description: 'Sponsorship & kemitraan OSIS Nawasena SMAN 2 Jonggol — pilih paket sponsorship, kenali tipe kemitraan, dan ajukan kerjasama.',
  ogTitle: 'Sponsorship — OSIS Nawasena',
  ogDescription: 'Peluang kerjasama dan sponsorship bersama OSIS Nawasena SMAN 2 Jonggol.',
})
</script>

<style>
@keyframes scroll-left {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.partner-track {
  animation: scroll-left 30s linear infinite;
}

.partner-marquee:hover .partner-track {
  animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  .partner-track {
    animation: none;
  }
}
</style>