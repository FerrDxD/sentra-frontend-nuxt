import { ref, computed } from 'vue'

// ─── Module-level singleton state ─────────────────────────────────────────────
const loading        = ref(true)
const error          = ref(false)

const topGenerations   = ref<any[]>([])
const olderGenerations = ref<any[]>([])
const developers       = ref<any[]>([])

// Modal state — shared across hof.vue, HofModal.vue, and the constellation panels
const isHofModalOpen = ref(false)
const modalType      = ref<'PERIOD_MEMBERS' | 'MEMBER_PROFILE' | 'OLDER_PERIODS'>('MEMBER_PROFILE')
const modalTitle     = ref('')
const modalData      = ref<any>(null)

let _loaded = false

// ─── Pure helpers (shared with the components) ────────────────────────────────
export const romanNumeral = (n?: number | string): string => {
  const table = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV']
  const v = Number(n)
  if (!Number.isFinite(v) || v < 1) return String(n ?? '')
  return table[v - 1] || String(v)
}

/** Flatten a period's core members (bph) into star-shaped entries. */
export const periodStars = (period: any, org: 'OSIS' | 'MPK'): any[] =>
  (period?.bph || []).map((m: any) => ({ ...m, org, _isMember: true }))

/** All stars of a generation (osis + mpk core boards). */
export const generationStars = (gen: any): any[] => [
  ...periodStars(gen?.osis, 'OSIS'),
  ...periodStars(gen?.mpk, 'MPK'),
]

// ─── Composable ───────────────────────────────────────────────────────────────
export const useHof = () => {
  const { fetchHof } = useApi()

  const loadHofData = async (force = false) => {
    if (_loaded && !force) return
    loading.value = true
    error.value   = false
    try {
      const data: any = await fetchHof()
      if (data) {
        topGenerations.value   = data.top_generations   || []
        olderGenerations.value = data.older_generations || []
        developers.value       = data.developers        || []
      } else {
        error.value = true
      }
    } catch (e) {
      console.error('Failed to load HoF:', e)
      error.value = true
    } finally {
      loading.value = false
      _loaded = true
    }
  }

  // ── Derived overview (used for the small factual "lineage" caption) ────────
  const allGenerations = computed(() => [...topGenerations.value, ...olderGenerations.value])

  const lineageLength = computed(() => allGenerations.value.length)

  const latestGeneration = computed(() => topGenerations.value[0] ?? null)

  const totalMembers = computed(() => {
    let n = 0
    for (const g of allGenerations.value) {
      for (const org of ['osis', 'mpk'] as const) {
        const p = g?.[org]
        if (!p) continue
        n += (p.bph?.length || 0) + (p.anggota?.length || 0)
      }
    }
    return n
  })

  // ── Modal openers ───────────────────────────────────
  // period = osis or mpk sub-object (has .nama, .tahun, .anggota[] or .members[])
  const openPeriodMembersModal = (period: any, org: 'OSIS' | 'MPK', isOther = false) => {
    modalType.value  = 'PERIOD_MEMBERS'
    modalTitle.value = `Anggota ${org} — Periode ${period.nama}`
    const members    = isOther
      ? (period.members || [])
      : (period.anggota || [])
    modalData.value      = { members, org }
    isHofModalOpen.value = true
    if (import.meta.client) document.body.style.overflow = 'hidden'
  }

  const openMemberProfileModal = (member: any) => {
    modalType.value      = 'MEMBER_PROFILE'
    modalTitle.value     = 'Profil Demisioner'
    modalData.value      = member
    isHofModalOpen.value = true
    if (import.meta.client) document.body.style.overflow = 'hidden'
  }

  const openOlderPeriodsModal = () => {
    modalType.value      = 'OLDER_PERIODS'
    modalTitle.value     = 'Periode Terdahulu'
    modalData.value      = olderGenerations.value
    isHofModalOpen.value = true
    if (import.meta.client) document.body.style.overflow = 'hidden'
  }

  const closeHofModal = () => {
    isHofModalOpen.value = false
    if (import.meta.client) document.body.style.overflow = ''
  }

  return {
    loading,
    error,
    topGenerations,
    olderGenerations,
    developers,
    loadHofData,

    allGenerations,
    lineageLength,
    latestGeneration,
    totalMembers,

    isHofModalOpen,
    modalType,
    modalTitle,
    modalData,

    openPeriodMembersModal,
    openMemberProfileModal,
    openOlderPeriodsModal,
    closeHofModal,
  }
}