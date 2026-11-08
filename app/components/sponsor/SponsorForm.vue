<template>
  <div class="bg-bg-card rounded-[24px] p-6 md:p-10 border border-border shadow-lg scroll-mt-24" id="sponsor-form">
    <div class="mb-8">
      <h2 class="text-[1.6rem] md:text-[1.9rem] font-extrabold tracking-tight mb-2 text-text-main">
        Formulir Pengajuan Kerjasama
      </h2>
      <p class="text-text-muted text-[0.95rem]">
        Isi formulir di bawah ini dan tim kami akan menghubungi Anda dalam 1–2 hari kerja.
      </p>
    </div>

    <!-- Success feedback -->
    <div
      v-if="success"
      role="status"
      class="mb-6 flex items-start gap-2.5 rounded-[10px] p-4 text-[0.9rem] bg-[var(--badge-done-bg)] text-[var(--badge-done-text)]"
    >
      <Icon name="material-symbols:check-circle-rounded" class="shrink-0 mt-[1px] text-[1.2rem]" aria-hidden="true" />
      <span>
        Terima kasih! Pesan kerjasama Anda telah disusun dan dibuka di WhatsApp. Jika tidak terbuka otomatis, silakan
        <a href="https://wa.me/6282299234269" target="_blank" rel="noopener" class="underline underline-offset-2 font-semibold">hubungi kami di sini</a>.
      </span>
    </div>

    <!-- Error summary -->
    <div
      v-if="Object.keys(errors).length"
      ref="summaryEl"
      role="alert"
      tabindex="-1"
      class="mb-6 rounded-[10px] border border-red-300 bg-red-50 p-4 dark:bg-red-500/10 dark:border-red-500/40"
    >
      <p class="font-semibold text-[0.9rem] mb-2 text-red-700 dark:text-red-300">Ada beberapa kolom yang perlu dilengkapi:</p>
      <ul class="list-disc pl-5 space-y-1 text-[0.86rem] text-red-700 dark:text-red-300">
        <li v-for="(err, field) in errors" :key="field">
          <a :href="`#${fieldId(field)}`" class="underline underline-offset-2 hover:opacity-80" @click.prevent="focusField(field)">{{ err }}</a>
        </li>
      </ul>
    </div>

    <form novalidate @submit.prevent="submit" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Nama -->
      <div class="flex flex-col">
        <label for="field-nama" class="block text-[0.78rem] font-semibold text-text-muted mb-2">Nama / Nama Lembaga <span class="text-red-500" aria-hidden="true">*</span></label>
        <input
          id="field-nama"
          v-model="form.nama"
          type="text"
          placeholder="Nama lengkap atau nama instansi"
          :aria-invalid="!!errors.nama"
          :aria-describedby="errors.nama ? 'err-nama' : undefined"
          :class="[inputBase, errors.nama ? 'border-red-400' : 'border-border']"
        >
        <p v-if="errors.nama" id="err-nama" class="text-red-600 dark:text-red-400 text-[0.8rem] mt-1.5">{{ errors.nama }}</p>
      </div>

      <!-- Kontak -->
      <div class="flex flex-col">
        <label for="field-kontak" class="block text-[0.78rem] font-semibold text-text-muted mb-2">Kontak (WA / Email) <span class="text-red-500" aria-hidden="true">*</span></label>
        <input
          id="field-kontak"
          v-model="form.kontak"
          type="text"
          placeholder="0812xxxx atau nama@email.com"
          :aria-invalid="!!errors.kontak"
          :aria-describedby="errors.kontak ? 'err-kontak' : undefined"
          :class="[inputBase, errors.kontak ? 'border-red-400' : 'border-border']"
        >
        <p v-if="errors.kontak" id="err-kontak" class="text-red-600 dark:text-red-400 text-[0.8rem] mt-1.5">{{ errors.kontak }}</p>
      </div>

      <!-- Tipe kerjasama -->
      <div class="flex flex-col">
        <label for="field-tipe" class="block text-[0.78rem] font-semibold text-text-muted mb-2">Tipe Kerjasama <span class="text-red-500" aria-hidden="true">*</span></label>
        <div class="relative">
          <select
            id="field-tipe"
            v-model="form.tipe"
            :aria-invalid="!!errors.tipe"
            :aria-describedby="errors.tipe ? 'err-tipe' : undefined"
            :class="[inputBase, 'appearance-none cursor-pointer pr-10', errors.tipe ? 'border-red-400' : 'border-border']"
          >
            <option value="" disabled>Pilih tipe kerjasama</option>
            <optgroup label="Paket Sponsorship">
              <option>Amethyst — Rp75.000</option>
              <option>Topaz — Rp150.000</option>
              <option>Sapphire — Rp200.000</option>
              <option>Alexandrite — Rp350.000</option>
            </optgroup>
            <optgroup label="Tipe Kemitraan">
              <option>Mitra Bisnis & UMKM</option>
              <option>Mitra Kampus & Institusi</option>
              <option>Mitra Alumni</option>
            </optgroup>
            <option>Kerjasama Lainnya</option>
          </select>
          <Icon name="material-symbols:keyboard-arrow-down-rounded" class="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle pointer-events-none" aria-hidden="true" />
        </div>
        <p v-if="errors.tipe" id="err-tipe" class="text-red-600 dark:text-red-400 text-[0.8rem] mt-1.5">{{ errors.tipe }}</p>
      </div>

      <!-- Event -->
      <div class="flex flex-col">
        <label for="field-event" class="block text-[0.78rem] font-semibold text-text-muted mb-2">Program / Event yang Diminati</label>
        <div class="relative">
          <select id="field-event" v-model="form.event" :class="[inputBase, 'appearance-none cursor-pointer pr-10', 'border-border']">
            <option value="" disabled>Pilih (opsional)</option>
            <option>Semua Program Kerja</option>
            <option>EPOK — Event Seni & Olahraga</option>
            <option>Seminar & Forum Edukasi</option>
            <option>Program Sosial & Kemasyarakatan</option>
            <option>Event Peringatan Hari Besar</option>
            <option>Lainnya</option>
          </select>
          <Icon name="material-symbols:keyboard-arrow-down-rounded" class="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle pointer-events-none" aria-hidden="true" />
        </div>
      </div>

      <!-- Pesan -->
      <div class="flex flex-col md:col-span-2">
        <label for="field-pesan" class="block text-[0.78rem] font-semibold text-text-muted mb-2">Pesan & Proposal Singkat <span class="text-red-500" aria-hidden="true">*</span></label>
        <textarea
          id="field-pesan"
          v-model="form.pesan"
          rows="5"
          placeholder="Ceritakan tentang lembaga / bisnis Anda, tujuan kerjasama, dan ekspektasi yang ingin dicapai..."
          :aria-invalid="!!errors.pesan"
          :aria-describedby="errors.pesan ? 'err-pesan' : undefined"
          :class="[inputBase, 'resize-y min-h-[120px]', errors.pesan ? 'border-red-400' : 'border-border']"
        />
        <p v-if="errors.pesan" id="err-pesan" class="text-red-600 dark:text-red-400 text-[0.8rem] mt-1.5">{{ errors.pesan }}</p>
      </div>

      <div class="md:col-span-2">
        <button
          type="submit"
          class="inline-flex items-center justify-center gap-2 bg-accent text-white rounded-[16px] py-3.5 px-6 font-semibold text-[0.95rem] border-none cursor-pointer transition-colors duration-200 hover:bg-accent-hover shadow-md w-full md:w-auto"
        >
          Kirim Pengajuan ke WhatsApp
          <Icon name="mdi:whatsapp" class="text-[1.2rem]" aria-hidden="true" />
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick } from 'vue'

const inputBase =
  'w-full rounded-[10px] border px-4 py-3 text-[0.92rem] text-text-main bg-bg-primary outline-none transition-colors duration-200 placeholder:text-text-subtle focus:border-accent focus:shadow-[0_0_0_4px_var(--accent-soft)]'

const form = reactive({
  nama: '',
  kontak: '',
  tipe: '',
  event: '',
  pesan: '',
})

const errors = reactive<Record<string, string>>({})
const summaryEl = ref<HTMLElement | null>(null)
const success = ref(false)

const fieldId = (field: string) => `field-${field}`

function greeting() {
  const h = new Date().getHours()
  if (h < 11) return 'pagi'
  if (h < 15) return 'siang'
  if (h < 18) return 'sore'
  return 'malam'
}

function buildMessage() {
  return [
    'Halo,',
    `Selamat ${greeting()}`,
    '',
    `Perkenalkan Saya *${form.nama}* (Kontak: ${form.kontak}) yang dimana Badan Usaha/Organisasi/Instansi kami tertarik untuk menjalin kerja sama dengan OSIS SMAN 2 JONGGOL.`,
    '',
    'Berikut detail ketertarikan kami:',
    `- Tipe Kerjasama: *${form.tipe}*`,
    `- Program/Event Diminati: *${form.event || '-'}*`,
    '',
    'Pesan Pelengkap:',
    form.pesan,
    '',
    'Mohon informasi dan diskusi lebih lanjut mengenai prosedur kerja sama ini. Terima kasih.',
    '',
    'Hormat Kami,',
    form.nama,
  ].join('\n')
}

function validate() {
  for (const key of Object.keys(errors)) delete errors[key]

  if (!form.nama.trim()) errors.nama = 'Nama / nama lembaga wajib diisi.'
  if (!form.kontak.trim()) errors.kontak = 'Kontak (WA / email) wajib diisi.'
  if (!form.tipe) errors.tipe = 'Pilih tipe kerjasama terlebih dahulu.'
  if (!form.pesan.trim()) errors.pesan = 'Pesan singkat wajib diisi.'

  return Object.keys(errors).length === 0
}

function focusField(field: string) {
  if (import.meta.client) document.getElementById(fieldId(field))?.focus()
}

function submit() {
  success.value = false

  if (!validate()) {
    nextTick(() => summaryEl.value?.focus())
    return
  }

  const waUrl = `https://wa.me/6282299234269?text=${encodeURIComponent(buildMessage())}`
  window.open(waUrl, '_blank', 'noopener')

  success.value = true
  form.nama = ''
  form.kontak = ''
  form.tipe = ''
  form.event = ''
  form.pesan = ''
}
</script>