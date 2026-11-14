<template>
  <Teleport to="body">
    <div
      v-if="isPengurusModalOpen"
      class="fixed inset-0 bg-black/55 backdrop-blur-md z-[2000] flex items-center justify-center p-4 transition-opacity duration-300"
      @click.self="closePengurusModal"
    >
      <div class="relative bg-bg-card border border-border rounded-3xl w-full max-w-[520px] md:max-w-[820px] max-h-[90dvh] overflow-y-auto shadow-[var(--shadow-lg)] animate-[modalSlideUp_0.28s_cubic-bezier(.4,0,.2,1)]">

        <!-- Close -->
        <button
          type="button"
          class="absolute top-4 right-4 w-8 h-8 rounded-full bg-bg-card-2 text-text-muted flex items-center justify-center border-none cursor-pointer hover:bg-accent-soft hover:text-accent transition-colors z-10"
          aria-label="Tutup"
          @click="closePengurusModal"
        >
          <Icon name="material-symbols:close" size="20" aria-hidden="true" />
        </button>

        <template v-if="p">
          <!-- Desktop: 2-column grid -->
          <div class="md:grid md:grid-cols-[220px_1fr] md:min-h-[400px]">

            <!-- ── LEFT PANEL ─────────────────────────────── -->
            <div class="md:border-r md:border-border md:bg-bg-card-2/40 p-6 md:p-7 flex flex-col items-center md:items-start gap-4 md:rounded-l-3xl">
              <!-- Avatar -->
              <div class="relative">
                <AppImg
                  :src="useImageUrl(p.foto, p.nama)"
                  :alt="p.nama"
                  rounded="full"
                  class="w-[96px] h-[96px] md:w-[112px] md:h-[112px] rounded-full border-[3px] border-accent shadow-[0_4px_20px_rgba(99,102,241,0.25)]"
                  @error="onImgError"
                />
                <span
                  v-if="p.online"
                  class="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 bg-green-500 border-2 border-bg-card rounded-full"
                  title="Sedang online"
                />
              </div>

              <!-- Org + jabatan badges -->
              <div class="flex flex-wrap gap-1.5 justify-center md:justify-start">
                <span class="inline-flex items-center gap-1 bg-bg-card border border-border text-text-subtle text-[0.58rem] font-extrabold tracking-[0.12em] uppercase px-2 py-[3px] rounded-md leading-none">
                  <Icon :name="orgIcon" class="text-[0.85rem]" aria-hidden="true" />
                  {{ orgLabel }}
                </span>
                <span class="inline-block bg-accent-soft text-accent text-[0.62rem] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                  {{ p.jabatan }}
                </span>
              </div>

              <!-- Nama -->
              <h3 class="text-[1.2rem] font-extrabold text-text-main m-0 leading-tight text-center md:text-left">
                {{ p.nama }}
              </h3>

              <!-- Quick chips -->
              <div class="flex flex-wrap gap-2 justify-center md:justify-start">
                <span v-if="p.kelas" class="inline-flex items-center gap-1 text-[0.72rem] text-text-muted bg-bg-card border border-border px-2 py-0.5 rounded-full">
                  <Icon name="material-symbols:class" class="text-sm" aria-hidden="true" /> {{ p.kelas }}
                </span>
                <span v-if="p.hobi" class="inline-flex items-center gap-1 text-[0.72rem] text-text-muted bg-bg-card border border-border px-2 py-0.5 rounded-full">
                  <Icon name="material-symbols:favorite-outline" class="text-sm" aria-hidden="true" /> {{ p.hobi }}
                </span>
              </div>

              <!-- Motto (desktop left panel only) -->
              <div v-if="p.motto" class="hidden md:block mt-auto pt-4 border-t border-border w-full">
                <p class="text-[0.65rem] font-bold uppercase tracking-widest text-accent mb-1">Motto</p>
                <p class="text-[0.82rem] text-text-muted italic leading-relaxed m-0">"{{ p.motto }}"</p>
              </div>
            </div>

            <!-- ── RIGHT PANEL ────────────────────────────── -->
            <div class="p-6 md:p-7 md:pr-8 flex flex-col gap-5 overflow-y-auto">

              <!-- Biodata -->
              <div>
                <h4 class="flex items-center gap-1.5 text-[0.72rem] font-bold uppercase tracking-wider text-accent border-b border-border pb-2 mb-3">
                  <Icon name="material-symbols:badge" class="text-sm text-accent" aria-hidden="true" />
                  Biodata Lengkap
                </h4>
                <div class="flex flex-col gap-1.5">
                  <div
                    v-for="row in biodataRows"
                    :key="row.label"
                    class="flex items-baseline gap-3 bg-bg-card-2 border border-border rounded-xl px-3 py-1.5"
                  >
                    <span class="shrink-0 min-w-[120px] text-[0.71rem] font-semibold text-text-muted">{{ row.label }}</span>
                    <span class="text-[0.82rem] text-text-main" :class="{ 'italic': row.italic }">{{ row.value }}</span>
                  </div>
                </div>
              </div>

              <!-- Visi & Misi -->
              <div v-if="hasVisiMisi">
                <h4 class="flex items-center gap-1.5 text-[0.72rem] font-bold uppercase tracking-wider text-accent border-b border-border pb-2 mb-3">
                  <Icon name="material-symbols:my-location" class="text-sm text-accent" aria-hidden="true" />
                  Visi &amp; Misi
                </h4>
                <div v-if="p.visi" class="mb-3">
                  <p class="text-[0.7rem] font-bold text-text-muted mb-1.5">Visi</p>
                  <ul v-if="Array.isArray(p.visi)" class="pl-4 flex flex-col gap-1 m-0">
                    <li v-for="(v, i) in p.visi" :key="i" class="text-[0.85rem] text-text-main">{{ v }}</li>
                  </ul>
                  <p v-else class="text-[0.85rem] text-text-main m-0">{{ p.visi }}</p>
                </div>
                <div v-if="p.misi?.length">
                  <p class="text-[0.7rem] font-bold text-text-muted mb-1.5">Misi</p>
                  <ul class="pl-4 flex flex-col gap-1 m-0">
                    <li v-for="(m, i) in p.misi" :key="i" class="text-[0.85rem] text-text-main">{{ m }}</li>
                  </ul>
                </div>
              </div>

              <!-- Program Kerja -->
              <div>
                <h4 class="flex items-center gap-1.5 text-[0.72rem] font-bold uppercase tracking-wider text-accent border-b border-border pb-2 mb-3">
                  <Icon name="material-symbols:checklist" class="text-sm text-accent" aria-hidden="true" />
                  Program Kerja
                  <span v-if="programs.length" class="ml-auto text-text-subtle font-semibold tracking-normal normal-case">{{ programs.length }}</span>
                </h4>

                <p
                  v-if="isSekbidMember && hasSekbidPrograms"
                  class="text-[0.7rem] text-text-subtle m-0 mb-2.5 inline-flex items-center gap-1.5"
                >
                  <Icon :name="sekbidMeta.icon" class="text-[0.95rem]" :style="{ color: sekbidMeta.color }" aria-hidden="true" />
                  Termasuk program kerja Sekbid {{ p.sekbid_number }}.
                </p>

                <div v-if="programs.length" class="flex flex-col gap-2">
                  <div
                    v-for="prog in programs"
                    :key="prog.id"
                    class="bg-bg-card-2 border border-border rounded-xl px-3 py-2"
                    :style="prog._source === 'sekbid' ? { borderColor: sekbidMeta.color + '40' } : undefined"
                  >
                    <div class="flex items-center justify-between gap-2 mb-0.5">
                      <span class="text-[0.85rem] font-semibold text-text-main">{{ prog.nama || prog.name }}</span>
                      <div class="flex items-center gap-1.5 shrink-0">
                        <!-- Sekbid source tag -->
                        <span
                          v-if="prog._source === 'sekbid'"
                          class="text-[0.55rem] font-extrabold uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-full leading-none"
                          :style="{ background: sekbidMeta.glow, color: sekbidMeta.color }"
                        >Sekbid</span>
                        <span
                          class="text-[0.6rem] font-bold px-2 py-0.5 rounded-full"
                          :class="{
                            'bg-[var(--badge-ongoing-bg)] text-[var(--badge-ongoing-text)]': prog.status === 'Berjalan',
                            'bg-[var(--badge-done-bg)] text-[var(--badge-done-text)]': prog.status === 'Selesai',
                            'bg-[var(--badge-plan-bg)] text-[var(--badge-plan-text)]': !prog.status || prog.status === 'Direncanakan',
                          }"
                        >{{ prog.status || 'Direncanakan' }}</span>
                      </div>
                    </div>
                    <p v-if="prog.deskripsi || prog.description" class="text-[0.77rem] text-text-muted m-0">{{ prog.deskripsi || prog.description }}</p>
                    <p v-if="prog.target" class="text-[0.7rem] text-text-subtle m-0 mt-0.5">Target: {{ prog.target }}</p>
                  </div>
                </div>
                <p v-else class="text-[0.85rem] text-text-muted m-0">Belum ada program kerja direkam.</p>
              </div>

            </div>
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useImageUrl } from '~/composables/useImageUrl'
import { useSekbidMeta } from '~/composables/useSekbidMeta'

const {
  isPengurusModalOpen,
  selectedPengurus,
  closePengurusModal,
  sekbid: sekbidList,
  resolveSekbidPrograms,
} = useStruktur()

const p = computed(() => selectedPengurus.value)

const orgKey = computed(() => String(p.value?.organisasi ?? p.value?.org ?? 'osis').toLowerCase())
const orgLabel = computed(() => orgKey.value === 'mpk' ? 'MPK' : 'OSIS')
const orgIcon = computed(() => orgKey.value === 'mpk' ? 'material-symbols:groups-rounded' : 'material-symbols:school-rounded')

const isSekbidMember = computed(() => !!p.value?.sekbid_number)
const sekbidMeta = computed(() => useSekbidMeta(p.value?.sekbid_number))

/** Sekbid programs in PengurusModal shape. */
const sekbidPrograms = computed<any[]>(() => {
  if (!isSekbidMember.value) return []
  const sekbidObj = sekbidList.value.find((s: any) => s.number === p.value!.sekbid_number)
  if (!sekbidObj) return []
  return resolveSekbidPrograms(sekbidObj).map((prog: any) => ({
    id:        prog.id,
    nama:      prog.nama ?? prog.name,
    deskripsi: prog.deskripsi ?? prog.description,
    target:    prog.target,
    status:    prog.status,
  }))
})

const programs = computed<any[]>(() => {
  if (!p.value) return []
  const personal = p.value.programKerja || []

  if (!isSekbidMember.value) {
    return personal.map((prog: any) => ({ ...prog, _source: 'personal' }))
  }

  const seen = new Set<number | string>(personal.map((prog: any) => prog.id))
  const sekbidTagged = sekbidPrograms.value
    .filter((prog: any) => !seen.has(prog.id))
    .map((prog: any) => ({ ...prog, _source: 'sekbid' }))

  const personalTag = p.value.sekbid_role && /koordinator/i.test(p.value.sekbid_role)
    ? 'sekbid'
    : 'personal'

  return [
    ...personal.map((prog: any) => ({ ...prog, _source: personalTag })),
    ...sekbidTagged,
  ]
})

const hasSekbidPrograms = computed(() => programs.value.some(prog => prog._source === 'sekbid'))

const hasVisiMisi = computed(() => {
  if (!p.value) return false
  const hasVisi = Array.isArray(p.value.visi) ? p.value.visi.length > 0 : !!p.value.visi
  const hasMisi = Array.isArray(p.value.misi) && p.value.misi.length > 0
  return hasVisi || hasMisi
})

const biodataRows = computed(() => {
  if (!p.value) return []
  return [
    { label: 'Nama',               value: p.value.nama || '—' },
    { label: 'Kelas',              value: p.value.kelas || '—' },
    { label: 'Tempat / Tgl Lahir', value: [p.value.tempatLahir, p.value.tanggalLahir].filter(Boolean).join(', ') || '—' },
    { label: 'Alamat',             value: p.value.alamat || '—' },
    { label: 'Hobi',               value: p.value.hobi || '—' },
  ].filter(r => r.value !== '—')
})

function onImgError(e: Event) {
  const img = e.target as HTMLImageElement
  img.src = useImageUrl('', p.value?.nama)
  img.onerror = null
}
</script>

<style>
@keyframes modalSlideUp {
  from { opacity: 0; transform: translateY(18px) scale(0.97); }
  to   { opacity: 1; transform: none; }
}
</style>
